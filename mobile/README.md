# Planet Explorer · native shells

[Capacitor](https://capacitorjs.com) wrappers for Google Play (`android/`) and the
App Store (`ios/`). They live here rather than at the repo root so that the root
stays the three files the game is made of and `open index.html` keeps working.

`www/` is a **build output**. `npm run copy` deletes it and re-fills it from
`../index.html` and `../three.min.js`. Edit the game at the repo root; anything
you change under `www/`, `android/app/src/main/assets/public/` or
`ios/App/App/public/` is thrown away by the next sync.

## Build

```
npm install
npm run sync        # copy the game in and re-sync both native projects
npm run android     # sync + build + run on the attached device or emulator
npm run ios         # sync + build + run on a simulator or attached device
npm run apk         # debug APK   → android/app/build/outputs/apk/debug/
npm run bundle      # release AAB → android/app/build/outputs/bundle/release/
npm run archive     # release .xcarchive → ios/App/build/
npm run icons       # re-render every raster icon from store/icon-source.svg
```

Android needs JDK 21 and platform 36; `JAVA_HOME` must point at a 21 JDK — Gradle
here will not run on 11. iOS needs Xcode 16 or newer. **CocoaPods is not
required**: Capacitor 8 wires plugins through a generated `Package.swift`, which
is why `ios/App/CapApp-SPM/` exists.

| | Android | iOS |
|---|---|---|
| Application ID | `au.com.lionforce.planetexplorer` | same |
| Floor / target | minSdk 29 / target 36 | iOS 15.0, universal |
| Permissions | **none** | **none** (nothing to declare — no camera, no network) |
| Version | 1.0.0 (versionCode 1) | 1.0.0 (build 1) |
| Chrome | both system bars hidden in `MainActivity` | status bar hidden in `Info.plist` |
| R8 / minify | off, deliberately (see `app/build.gradle`) | n/a |

Both platforms mirror the game's three `pe-*` localStorage keys into native
preferences and restore them if the WebView has lost them — see the store/reload
block in `index.html`. It is there for iOS, where WebKit may evict website data
under storage pressure; on Android it costs one `SharedPreferences` write per
change and keeps the two platforms identical.

## Signing · Android

The upload key is **not** in the repo. A fresh clone still builds — release just
comes out unsigned rather than failing — so create one before you upload:

```
cd android
keytool -genkeypair -v -keystore upload-keystore.jks -storetype PKCS12 \
  -alias upload -keyalg RSA -keysize 4096 -validity 10000 \
  -dname "CN=Planet Explorer, O=Lion Force, C=AU"
```

Then write `android/keystore.properties` beside it:

```
storeFile=upload-keystore.jks
storePassword=…
keyAlias=upload
keyPassword=…
```

Both files are gitignored and should be **backed up somewhere durable**. Under
Play App Signing, this is only the *upload* key — Google holds the app signing
key that users' devices verify — so a lost upload key can be reset by Play
support rather than orphaning the app. That is a support round trip, not a
five-minute job, so back it up anyway.

The certificate's distinguished name is cosmetic for an upload key; nothing about
it is shown to users.

## Icons

There are no icon bitmaps anywhere, on either platform. `npm run icons` renders
what has to be raster from `store/icon-source.svg`.

On Android there is not even that: The launcher icon is three vector drawables —
`ic_launcher_background`, `ic_launcher_foreground`, and an
`ic_launcher_monochrome` for Android 13's themed icons — referenced from
`mipmap-anydpi-v26/`. minSdk 29 means every device supports adaptive icons, so
the density-bucketed PNGs Capacitor scaffolds were deleted rather than kept as a
dead fallback; that alone took ~485 KB off the APK.

Everything sits inside a radius of 33dp about the centre of the 108dp canvas —
the safe zone an adaptive icon keeps under any mask a launcher applies.

On iOS a single 1024px `AppIcon-512@2x.png` is the whole set, cropped to the
middle 76 of the 108-unit canvas — Android masks its icon down to the middle 66,
iOS rounds the corners of the whole square, so the same art has to be rendered at
two scales or it looks shrunken in its tile. The alpha channel is stripped
afterwards; Apple rejects an app icon that carries one even when it is opaque.

`store/icon-512.png` is the Play listing icon, rendered from the same paths.

## Testing · Android: the WebView's DevTools socket

Debug builds are inspectable, which is how the on-device memory numbers in
`CLAUDE.md` were measured. Release builds are not, by design.

```
adb forward tcp:9222 localabstract:$(adb shell cat /proc/net/unix \
  | grep -o 'webview_devtools_remote_[0-9]*' | sort -u | head -1)
```

Then either open `chrome://inspect` on the desktop, or drive it headlessly —
Node 22 has a global `WebSocket`, so CDP needs no client library. See
`scripts/` history and `CLAUDE.md` for the harness.

To exercise the phone layout on a tablet emulator:

```
adb shell wm size 1080x2340 && adb shell wm density 420   # 411×891 CSS px
adb shell wm size reset && adb shell wm density reset
```

Android's one-time "Viewing full screen" panel takes focus on first launch and
swallows the first back press. Silence it for testing with
`adb shell settings put secure immersive_mode_confirmations confirmed`.

## Signing · iOS

Nothing is configured, deliberately: `CODE_SIGN_STYLE` is `Automatic` and there
is no team in the project, so a clone builds for the **simulator** with
`CODE_SIGNING_ALLOWED=NO` and no account at all. To run on your own device, open
`ios/App/App.xcodeproj`, pick your personal team under Signing & Capabilities,
and accept the 7-day provisioning profile — enough to validate everything
platform-specific long before a paid account exists. `npm run archive` produces
the `.xcarchive` for App Store Connect and needs a real distribution identity.

## Testing · iOS simulators

```
xcodebuild -project ios/App/App.xcodeproj -scheme App -sdk iphonesimulator \
  -configuration Debug -destination 'platform=iOS Simulator,id=<udid>' \
  -derivedDataPath ios/App/build CODE_SIGNING_ALLOWED=NO build
xcrun simctl install <udid> ios/App/build/Build/Products/Debug-iphonesimulator/App.app
xcrun simctl launch <udid> au.com.lionforce.planetexplorer
xcrun simctl io <udid> screenshot shot.png
```

There is no CDP for a WKWebView, and `simctl` cannot tap, type or rotate. What
works instead:

- **Reading numbers out**: append a throwaway script to `www/index.html` that
  writes JSON into a localStorage key the game does not use, terminate the app
  (which is what flushes the store), then read it on the host from
  `$(xcrun simctl get_app_container <udid> au.com.lionforce.planetexplorer data)`
  under `Library/WebKit/…/LocalStorage/localstorage.sqlite3`. Values are UTF-16
  blobs, so use `hex(value)` and decode `utf-16-le` — `cast(value as text)` stops
  at the first NUL.
- **Landscape**: build a copy whose `UISupportedInterfaceOrientations` is
  landscape only; iOS turns the interface and reports the real landscape insets.
- **The native preferences mirror**: `plutil -p "$C/Library/Preferences/au.com.lionforce.planetexplorer.plist"`
  shows the `CapacitorStorage.pe-*` keys. To test the restore path, delete
  `Library/WebKit/<bundle id>/WebsiteData/{Default,LocalStorage}` with the app
  terminated and relaunch: the mission count should come back.
- **Real touches** need Accessibility permission for the terminal, so tapping,
  dragging and pinching are the physical-device pass, not this one.
