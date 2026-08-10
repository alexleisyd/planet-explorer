# Planet Explorer · Android shell

A [Capacitor](https://capacitorjs.com) wrapper for Google Play. It lives here
rather than at the repo root so that the root stays the three files the game is
made of and `open index.html` keeps working.

`www/` is a **build output**. `npm run copy` deletes it and re-fills it from
`../index.html` and `../three.min.js`. Edit the game at the repo root; anything
you change under `www/` or `android/app/src/main/assets/public/` is thrown away
by the next sync.

## Build

```
npm install
npm run dev       # copy + sync + build + run on the attached device
npm run apk       # debug APK   → android/app/build/outputs/apk/debug/
npm run bundle    # release AAB → android/app/build/outputs/bundle/release/
npm run sync      # copy the game in and re-sync the native project only
```

Requires JDK 21 and the Android SDK with platform 36 installed. `JAVA_HOME` must
point at a 21 JDK — Gradle here will not run on 11.

| | |
|---|---|
| Application ID | `au.com.lionforce.planetexplorer` |
| minSdk / target | 29 / 36 |
| Permissions | **none** |
| R8 / minify | off, deliberately (see `app/build.gradle`) |

## Signing

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

There are no icon bitmaps. The launcher icon is three vector drawables —
`ic_launcher_background`, `ic_launcher_foreground`, and an
`ic_launcher_monochrome` for Android 13's themed icons — referenced from
`mipmap-anydpi-v26/`. minSdk 29 means every device supports adaptive icons, so
the density-bucketed PNGs Capacitor scaffolds were deleted rather than kept as a
dead fallback; that alone took ~485 KB off the APK.

Everything sits inside a radius of 33dp about the centre of the 108dp canvas —
the safe zone an adaptive icon keeps under any mask a launcher applies.

`store/icon-512.png` is the Play listing icon, rendered from the same paths.

## Testing a debug build over the WebView's DevTools socket

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
