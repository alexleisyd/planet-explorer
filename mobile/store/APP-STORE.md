# App Store — everything App Store Connect will ask for

Answer sheet for `au.com.lionforce.planetexplorer`, version 1.0.0 (build 1).
Copy is final unless marked **DECIDE** or **FILL IN**. Assets in this folder are
ready to upload. The Play answers live beside this in `PLAY-LISTING.md`; where the
two stores ask the same question the answer is the same, but almost none of the
*fields* are the same shape, so this is a separate sheet rather than a diff.

**Blocked on one thing only:** the Apple Developer Program organisation enrolment.
Everything below can be filled in the moment the account opens.

---

## Assets in this folder

| File | Connect field | Spec | Status |
|---|---|---|---|
| `screenshots-iphone/*.png` | iPhone 6.5" screenshots | 1284×2778, 6 of them | ✅ |
| `screenshots-ipad/*.png` | iPad 13" screenshots | 2752×2064 landscape, 6 of them | ✅ |
| — | App icon | **not uploaded separately** — Connect takes the 1024px icon out of the build's asset catalogue | ✅ in build |

**The iPhone slot this listing has is the 6.5" one**, which takes 1242×2688 or
1284×2778 and *refuses* 1320×2868 — the 6.9" size, which is what a current
simulator hands you. None of the iPhones Xcode ships by default is 6.5" any more,
so the set is shot on a simulator created for it:

```
xcrun simctl create "PE 14 Plus" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-14-Plus \
  com.apple.CoreSimulator.SimRuntime.iOS-18-5
```

(iPhone 14 Plus, 12/13 Pro Max → 1284×2778; iPhone 11 Pro Max, XS Max →
1242×2688.) If Connect ever offers the 6.9" slot instead, re-shoot on an iPhone
17 Pro Max — same harness, same six compositions.

Apple's sizes do not overlap Play's at all, so these are shot separately, from the
real WKWebView on that simulator and the iPad Pro 13-inch one. The six
compositions are the same six ideas as the Play set: named landmarks on Earth,
Valles Marineris in relief, Jupiter's bands, Saturn under the science layers, Io,
and the sense-of-scale panel.

**Every screenshot must be flattened — no alpha channel.** Apple wants RGB with no
transparency, and `simctl io screenshot` writes RGBA, so a capture goes straight
into Connect only after

```
magick shot.png -background black -alpha remove -alpha off -colorspace sRGB -strip shot.png
```

This is the same trap the app icon has (`npm run icons` strips it there), and it
is worth knowing that Connect does not always say "alpha" when it refuses the
file — it can report the *dimensions* as wrong on a file whose dimensions are
exactly right.

**The iPad set is landscape**, which is how the game is meant to be held. Apple
accepts either orientation. Getting landscape is the one part of this shoot that
is not scriptable: an iPad app that supports Split View must support all four
orientations, so a landscape-only `UISupportedInterfaceOrientations` is ignored
(the trick that works on iPhone), and `simctl` cannot rotate a device. The
simulator has to be turned in its own window by hand, after which
`xcrun simctl io <udid> screenshot` still writes the device-native **portrait**
framebuffer with the interface lying on its side — so each capture needs a
`magick -rotate -90` to come out upright. That is the opposite direction from the
iPhone landscape trick, where the app is letterboxed rather than the device
turned.

One screenshot set covers every localisation; there is only English.

---

## App information

| Field | Value |
|---|---|
| Name (30 max) | `Planet Explorer` |
| Subtitle (30 max) | `Fly 24 real worlds, offline` (27) |
| Bundle ID | `au.com.lionforce.planetexplorer` |
| SKU | `PLANETEXPLORER1` |
| Primary category | Education |
| Secondary category | Games → Simulation |
| Age rating | **4+** (see below) |
| Price | **Free**, no in-app purchases |
| Copyright | `2026 Lion Force Pty Ltd` |
| Support URL | `https://www.lionforce.com.au` |
| Marketing URL | `https://www.lionforce.com.au` |
| Privacy Policy URL | `https://www.lionforce.com.au/privacy/planet-explorer` |

Primary category is Education rather than Games deliberately: it is the same
argument the review notes make, and it is where a parent looking for this would
search. Play has it under Games → Educational because Play's Education category
excludes games outright.

**Keywords** (100 max, comma-separated, no spaces after commas — 99 used)

```
solar system,planets,space,astronomy,science,stars,mars,saturn,jupiter,moons,orbit,kids,learning
```

Do not repeat the app name or the category in keywords; Apple already indexes
both.

**Promotional text** (170 max, editable without a new build)

```
Twenty-four worlds, generated on your device as you arrive. No ads, no accounts,
no network — it works on a plane. Twelve survey missions written for a young
reader.
```

**Description** (4000 max)

```
Take a survey craft anywhere in the solar system. Twenty-four worlds — the Sun,
all eight planets, five dwarf planets and ten famous moons — and not one of them
is a photograph. Every surface is generated on your device as you arrive:
Jupiter's counter-flowing cloud bands with the Great Red Spot drifting between
them, Saturn's stripes under real ring gaps, Io's volcanoes, Europa's cracked
ice, Haumea tumbling end over end.

TWELVE SURVEY MISSIONS
Each mission is a clue rather than a waypoint. "Find the moon that orbits its
planet backwards." Work out which world it means, fly there, descend close and
hold position to survey it. Every debrief is a real fact, and your badges are
saved.

REAL RELIEF, REAL PLACES
Solid worlds carry a height map, so craters have raised rims and Valles Marineris
is genuinely a gash four thousand kilometres long — visible on the planet's
silhouette and sharpest along the terminator. Turn on landmarks and the real
places name themselves at their real coordinates: Olympus Mons, Tycho, the Sea of
Tranquility where Apollo 11 landed, Caloris, Sputnik Planitia, the Cassini
Division. Worlds we have only ever seen as cloud, like Venus, honestly have
nothing to show.

THE VIEW FROM A MOON
Select a moon and its planet hangs in its sky — Saturn looming over Enceladus,
Jupiter's bands churning above Io, Earth floating over the Moon with its clouds
still moving. The sky moves too: the planet circles at the moon's real orbital
direction and waxes through phases. Every moon is tidally locked, so the host
stays over the same face, and Pluto and Charon each keep one face toward the
other, as they really do.

TIME WARP
One second of flight is six minutes of local day on every world. Speed that up
to sixty times and the physics becomes something you can watch: the terminator
sweeping across the ground, Haumea turning end over end every four hours while
Venus barely creeps.

SCIENCE LAYERS
One tap draws the schematic — spin axis with the poles marked and the real axial
tilt, the equator, the direction of rotation, the sub-solar point and the
terminator. Uranus lying on its side at 98°, Venus upside down at 177° so its
spin runs backwards, Triton turning against its own orbit: things to see rather
than take on trust.

A SENSE OF SCALE
The target and Earth drawn at one scale, which is the point — next to the Sun,
Earth is a dot you have to hunt for. Then the whole solar system shrinks until
the Sun is a 30 cm beach ball, Earth a peppercorn 32 metres away, Neptune a
marble most of a kilometre off. Distances are measured in things that take time:
how long sunlight takes to arrive, how long a radio call would take, how many
years an airliner would need.

YOU, HERE
Enter your weight and age and every world tells you what you would weigh there
and how high you could jump — 35 metres on Enceladus — from real surface gravity.

BUILT TO BE HARMLESS
No advertising. No in-app purchases. No accounts. No analytics. No network
requests of any kind, so it works in a tunnel or on a plane. Nothing is
collected, and nothing can be: the app has no networking code in it at all.

Every number, every clue and every debrief is real science, written to be read by
someone young.
```

**What's New in This Version** (for 1.0.0)

```
First release. Twenty-four worlds, twelve survey missions, real relief and named
landmarks — all generated on your device. No ads, no purchases, no network.
```

---

## App Privacy

Answer **Data Not Collected** and the section is finished — no data types, no
tracking, no third-party SDKs. This is by construction: the app makes no network
request, and on Android the same binary ships without even the INTERNET
permission, which is the same claim in a form a reviewer can verify.

| Question | Answer |
|---|---|
| Do you or your third-party partners collect data from this app? | **No** |
| Does the app use the Advertising Identifier (IDFA)? | **No** |
| Does the app track users across apps or websites? | **No** — no `NSUserTrackingUsageDescription`, no ATT prompt |

The app target carries no privacy manifest of its own. The two frameworks in the
bundle ship theirs — `Capacitor.framework` and `Cordova.framework` both declare
`NSPrivacyTracking false` with empty `NSPrivacyCollectedDataTypes` and
`NSPrivacyAccessedAPITypes` — and there is no third-party SDK. Worth quoting to a
reviewer, since it is Apple's own format saying the same thing the answers do.

The one thing that may still want an app-level `PrivacyInfo.xcprivacy` is the
[required-reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
category for `UserDefaults` (`NSPrivacyAccessedAPICategoryUserDefaults`, reason
`CA92.1` — "access info from same app"), which is what the Preferences mirror
writes. Add it if an upload ever comes back with an ITMS required-reason notice.

**On-device storage, if the reviewer asks:** three values in the WebView's local
storage, mirrored into `UserDefaults` so a storage-pressure eviction does not wipe
a child's progress — which worlds have been surveyed, an optional weight and age
typed into the pilot row, and whether one panel is folded. Never transmitted;
nothing to transmit them with.

---

## Age rating questionnaire

Every content question is **None / No**. Expected result: **4+**.

| Question | Answer |
|---|---|
| Cartoon or fantasy violence · realistic violence · sexual content · nudity | None |
| Profanity or crude humour · alcohol, tobacco, drugs · horror themes | None |
| Simulated gambling · contests | None |
| Unrestricted web access | **No** — there is no browser, no link out, no remote content |
| Medical or treatment information | No |
| Made for Kids | **Yes** — submitted in the Kids Category |

### Kids Category — decided: in

Version 1.0.0 went in under the Kids Category. The app qualifies cleanly: no ads,
no purchases, no accounts, no analytics, no external links, no user-generated
content, no network at all. Guideline 1.3 and the Kids rules therefore apply in
review, a parental gate is required for anything that leaves the app (there is
nothing, so this is free), and the privacy policy URL is mandatory rather than
merely required. Keep this in step with Play's target-audience answer.

### The Guideline 1.3 questionnaire — expect it, and answer it verbatim

A Kids Category submission draws an automated request for four answers before
review proceeds. **This is a routine information request, not a rejection.** Paste
the block below into the Connect message thread; every claim in it is checkable
against the build, which is the point.

```
Thank you for the questions. Planet Explorer collects nothing, and the four
answers are all "no". Details for each:

1. THIRD-PARTY ANALYTICS — No.
The app contains no analytics of any kind, first-party or third-party. There is
no analytics SDK, no crash reporter, no attribution or measurement library, and
no logging that leaves the device. The complete list of third-party code in the
binary is: three.js (MIT licence, bundled as a local file), which draws 3D
graphics on the device and has no network or storage code; and Capacitor (MIT
licence), the open-source native runtime that hosts the app's WKWebView, together
with two of its own first-party plugins — App (to handle the hardware Back
button on Android) and Preferences (to store the three local values described in
question 4). Both frameworks in the bundle ship Apple privacy manifests declaring
NSPrivacyTracking false with empty NSPrivacyCollectedDataTypes and
NSPrivacyAccessedAPITypes. There are no other SDKs.

2. THIRD-PARTY ADVERTISING — No.
The app contains no advertising, no ad SDK, no ad network integration, no
promotional or cross-promotional content, and no links out of the app of any
kind. It does not use the Advertising Identifier, contains no SKAdNetwork
identifiers, and presents no App Tracking Transparency prompt because there is
nothing to track. As there is no ad network involved, there is no ad network
policy to link to.

3. DATA SHARED WITH THIRD PARTIES — No. There is nothing to share, and no means
of sharing it.
The app makes no network requests whatsoever. It contains no networking code: no
HTTP requests, no sockets, no WebSocket, no analytics beacons, no remote
configuration, no downloaded code or content. Everything it displays is either in
the app bundle or generated on the device at runtime — every planet surface is
procedurally generated by the app as the player arrives at that world, which is
what the brief "Scanning surface" progress bar shows on first arrival. It is not
a download.

Two ways to verify this quickly:
- Put the device in Airplane Mode. The app is fully functional, with every
  feature available, because it never needed a connection in the first place.
- The Android build of the same game is shipping with no INTERNET permission
  declared in its manifest at all — the operating system would refuse it a network
  connection even if it asked for one. We mention it because it is the same
  statement in a form that can be verified from outside the binary.

No data is transmitted to us or to anyone else, so no data is stored on any
server, ours or a third party's. We operate no server for this app.

4. ANY OTHER COLLECTION OR USE OF USER OR DEVICE DATA — No collection.
The app requests no permission of any kind (there is not a single usage-
description key in its Info.plist), accesses no device identifier, no contacts,
no location, no camera, no microphone, no photos, no health data and no
advertising identifier. It has no accounts, no sign-in, no user-generated
content, no chat or messaging, no social features, no in-app purchases and no
links to external websites.

Three values are saved on the device, for gameplay only, in the app's own
storage (the WebView's local storage, mirrored into UserDefaults so that iOS
reclaiming website data under storage pressure does not erase a child's
progress):
- which of the 24 worlds the player has surveyed, so the twelve mission badges
  persist between sessions;
- two optional numbers a player may type into the "You, here" panel — a weight
  and an age — used only to calculate what they would weigh and how high they
  could jump on the world currently on screen, from that world's real surface
  gravity. Both are optional, the app is fully playable without them, and they
  are ordinary numbers rather than an identity: nothing asks for a name, an
  email address or a birth date;
- whether one panel of the heads-up display is folded open or closed.

None of the three is transmitted anywhere, none is used for any purpose beyond
drawing the next frame of the game, and all three are removed when the app is
deleted. The privacy policy states the same:
https://www.lionforce.com.au/privacy/planet-explorer

Please let us know if you would like any further detail.
```

The reply's factual claims and where each is verifiable, so a future version does
not quietly break one: no network code (`index.html` contains no `fetch`,
`XMLHttpRequest`, `WebSocket`, `sendBeacon` or `EventSource`, and the only URL in
the file is the SVG namespace); no permissions (no `*UsageDescription` key in
`Info.plist`, and no `uses-permission` in `AndroidManifest.xml`); dependency list
(`mobile/package.json` and `ios/App/CapApp-SPM/Package.swift`); the three stored
keys (`pe-surveyed`, `pe-pilot`, `pe-datapanel`).

---

## Review notes

Paste into App Review Notes. **Budget one rejection round on Guideline 4.2**
(minimum functionality / repackaged website) and reply with this same argument —
it is strong, but a web-view wrapper is exactly the shape reviewers look at
twice.

```
No account, no login, no configuration — launch the app and it plays.

This is a native app built on WKWebView, not a website in a wrapper. There is no
remote content and no networking code of any kind: no URL requests, no analytics,
no ads, no downloaded code. Everything ships in the bundle, and every planet
surface is generated procedurally on the device at runtime (a few seconds of
"Scanning surface" on first arrival at a world is that generation, not a
download). The same build for Android ships with no INTERNET permission at all,
which we mention because it is a verifiable form of the same statement: put the
device in airplane mode and the app is fully functional.

The app is a solar-system flight simulator with twelve survey missions, real
surface relief, named landmarks at real coordinates, axial-tilt and terminator
overlays, and a sense-of-scale calculator. Every figure in it is real science.

Nothing is collected. Three values are kept in on-device storage: which worlds
have been surveyed, an optional weight and age typed into the pilot row, and
whether one panel is folded.
```

---

## Export compliance

`ITSAppUsesNonExemptEncryption` is set to `false` in `Info.plist`, so Connect
stops asking on every upload. It is the truthful answer twice over: the app
contains no encryption of its own, and makes no connection to encrypt.

---

## Content rights and other declarations

| Question | Answer |
|---|---|
| Does your app contain, show, or access third-party content? | **No** — every pixel is generated by the app or drawn by us; there are no photographs, no fonts beyond the system's, no music |
| Third-party libraries | three.js r128 (MIT), vendored; Capacitor (MIT) |
| Sign in with Apple required? | No — the app has no accounts at all |
| Account deletion required? | No — no accounts |
| Government / regulated content | None |

---

## Upload

```
cd mobile
npm run archive          # → ios/App/build/App.xcarchive
```

Then either **Xcode → Organizer → Distribute App → App Store Connect**, or
`xcrun altool`/`notarytool` with an app-specific password. The archive needs a
real distribution certificate, which arrives with the paid account; everything up
to that point — including running on your own device on a personal team's 7-day
provisioning — works today.

Bump `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in
`ios/App/App.xcodeproj/project.pbxproj` for every upload; Connect rejects a
repeated build number even for a rejected build.

**Order of operations:** the privacy policy URL must resolve *before* you submit,
because Apple fetches it during review. It does — `https://www.lionforce.com.au/privacy/planet-explorer`
was verified live on 10 August 2026, so the only thing left ahead of a submission
is the organisation enrolment.
