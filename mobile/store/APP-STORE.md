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
| `screenshots-iphone/*.png` | iPhone 6.9" screenshots | 1320×2868, 6 of them | ✅ |
| `screenshots-ipad/*.png` | iPad 13" screenshots | 2064×2752, 6 of them | ✅ |
| — | App icon | **not uploaded separately** — Connect takes the 1024px icon out of the build's asset catalogue | ✅ in build |

Apple's sizes do not overlap Play's at all, so these are shot separately, from the
real WKWebView on the iPhone 17 Pro Max and iPad Pro 13-inch simulators. The six
compositions are the same six ideas as the Play set: named landmarks on Earth,
Valles Marineris in relief, Jupiter's bands, Saturn under the science layers, Io,
and the sense-of-scale panel.

**The iPad set is portrait on purpose.** Apple accepts either orientation, and
landscape cannot be forced from the command line: an iPad app that supports Split
View is required to support all four orientations, so a landscape-only
`UISupportedInterfaceOrientations` is ignored, and the simulator letterboxes the
interface into the portrait framebuffer instead of rotating it. Re-shoot in
landscape on a real iPad if you prefer it — `xcrun simctl io <udid> screenshot`
is the same one-liner on a device.

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

There is no privacy manifest (`PrivacyInfo.xcprivacy`) in the build and none is
required: the app uses no [required-reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
and contains no third-party SDK.

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
| Made for Kids | **DECIDE**, see below |

### Kids Category — **DECIDE**

The app qualifies cleanly: no ads, no purchases, no accounts, no analytics, no
external links, no user-generated content, no network at all. Two ways to go:

- **Enter the Kids Category** (ages 5–8 or 9–11). It is a marketing asset and the
  right shelf for the audience the copy is written for. Costs: Guideline 1.3 and
  the Kids rules apply in review, a parental gate is required for anything that
  leaves the app (there is nothing, so this is free), and the privacy policy URL
  becomes mandatory rather than merely required.
- **Ship 4+ without the Kids Category.** Fastest through review; can be added in
  a later version. Recommended if you want the first submission to be about
  finding real-device problems rather than passing an extra review track.

Nothing in the build changes either way. Keep this decision in step with Play's
target-audience answer.

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

**Order of operations:** the privacy policy URL must resolve *before* you submit —
it lives on the company site, on its own branch of `lion-force-web`, and Apple
fetches it during review.
