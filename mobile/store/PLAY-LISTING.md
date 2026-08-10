# Google Play — everything the Console will ask for

Answer sheet for `au.com.lionforce.planetexplorer`, version 1.0.0 (versionCode 1).
Copy is final unless marked **DECIDE** or **FILL IN**. Assets in this folder are
ready to upload.

---

## Assets in this folder

| File | Play field | Spec | Status |
|---|---|---|---|
| `icon-512.png` | App icon | 512×512 PNG | ✅ |
| `feature-graphic-1024x500.png` | Feature graphic | 1024×500 PNG | ✅ |
| `screenshots-phone/*.png` | Phone screenshots | 1080×1920, 6 of them | ✅ |
| `screenshots-tablet/*.png` | 10" tablet screenshots | 1600×2560, 3 of them | ✅ |

Phone shots were captured from the real Android WebView with the emulator
reconfigured to phone geometry (1080×2340 at 420dpi → 411×891 CSS px, which is
the phone breakpoint), then scaled and padded with black to an exact 9:16. The
padding is invisible: the game's sky is already black.

**Worth re-shooting on your own handset** before you publish — same content, but
a real device gives you the notch, the true panel insets, and a chance to pick
hero frames by eye. `adb exec-out screencap -p > shot.png` is the whole job.

---

## Store listing

**App name** (30 max) — 15 used

```
Planet Explorer
```

**Short description** (80 max) — 78 used

```
Fly a survey craft around 24 real worlds. Every surface generated, not painted.
```

**Full description** (4000 max)

```
Take a survey craft anywhere in the solar system. Twenty-four worlds — the Sun,
all eight planets, five dwarf planets and ten famous moons — and not one of them
is a photograph. Every surface is generated on your device as you arrive: Jupiter's
counter-flowing cloud bands with the Great Red Spot drifting between them,
Saturn's stripes under real ring gaps, Io's volcanoes, Europa's cracked ice,
Haumea tumbling end over end.

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
requests of any kind, so it works in a tunnel or on a plane. The app requests no
Android permissions at all — the permission list on this page is empty, and that
is not a policy, it is how it is built.

Every number, every clue and every debrief is real science, written to be read by
someone young.
```

**Category** — Games → Educational
**Tags** — Educational, Simulation, Space, Learning
**Contact email** — **FILL IN** (appears publicly on the listing)
**Website** — `https://alexleisyd.github.io/planet-explorer/privacy.html`, or your own
**Privacy policy URL** — same, see below

**Release notes** (500 max, for the internal-testing release)

```
First release. Twenty-four worlds, twelve survey missions, real relief and named
landmarks — all generated on your device. No ads, no purchases, no network, no
permissions.
```

---

## Privacy policy — one step needed

`docs/privacy.html` is written and ready. To publish it free:

1. GitHub → repo **Settings → Pages** → Source: *Deploy from a branch*, branch `main`, folder `/docs`.
2. The URL becomes `https://alexleisyd.github.io/planet-explorer/privacy.html`.
3. **FILL IN** the two `CONTACT_EMAIL` placeholders in that file first — a policy with no contact is a rejection, and which address to publish is your call.

Play requires a privacy policy URL even when nothing is collected, and requires it
again for the Families programme.

---

## Data safety

Everything here is **No**, and unusually it is No by construction rather than by
assertion — the shipped manifest declares no permissions at all.

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** |
| Does your app use any of the required data types? | **No** |
| Is all user data encrypted in transit? | N/A — nothing is transmitted |
| Do you provide a way to request data deletion? | N/A — nothing is collected. The on-device values clear with the app's storage. |
| Data collected | **None** |
| Data shared | **None** |
| Third-party SDKs | **None** |

If the form pushes back on the three values kept in local storage: they are
device-local app storage, not collection. Play's definition of "collected" is
data transmitted off the device, and nothing here is.

---

## Content rating (IARC questionnaire)

Category: **Game**. Every content question is No.

| Section | Answer |
|---|---|
| Violence — realistic, cartoon, or otherwise | No |
| Fear, horror, distressing content | No |
| Sexuality, nudity | No |
| Language — profanity, crude humour | No |
| Controlled substances — drugs, alcohol, tobacco | No |
| Gambling, or simulated gambling | No |
| Purchases of digital goods, loot boxes | No |
| Advertising | No |
| User interaction, chat, or user-generated content | No |
| Shares user location | No |
| Shares personal information | No |
| Digital purchases | No |

Expected outcome: **ESRB Everyone · PEGI 3 · USK 0 · ACB G · IARC 3+**.

---

## The rest of the Console checklist

| Section | Answer |
|---|---|
| Ads | **No ads** |
| App access | All functionality is available without restriction — no login |
| Government app | No |
| Financial features | None |
| Health apps | No |
| News app | No |
| Data safety | see above |
| Government-issued IDs, biometrics | None |
| Play App Signing | **Enrol** (default). The `.jks` in `android/` is the *upload* key. |
| App bundle | `android/app/build/outputs/bundle/release/app-release.aab` (3.0 MB) |
| Countries | **DECIDE** — all countries is the simple answer for a free offline game |
| Store presence → pricing | **Free** (locked; a free app cannot later become paid) |

### Target audience — **DECIDE**

The app genuinely qualifies for the Families programme: no ads, no purchases, no
data collection, no external links, no chat. Two ways to go:

- **Include under-13 age bands.** Right for the audience the copy is written for,
  and unlocks Teacher Approved consideration. Costs: the Families policy applies,
  the Console asks for a "designed for families" declaration, and review is
  slower and stricter.
- **Start at 13+ and widen later.** Fastest to first release; you can add younger
  bands in an update once you have seen it live. Recommended if you want the
  first rollout to be about finding real-device problems rather than passing
  Families review.

Nothing in the build changes either way.

---

## Rollout

1. Create the app in Play Console — name, default language, Free, Game.
2. Complete the App content sections above (this is the long part; nothing is blocked on the build).
3. Upload the AAB to **Internal testing**, add yourself as a tester, install from the opt-in link on real handsets.
4. Promote to **Production**. The organisation account is exempt from the 12-tester / 14-day closed-testing gate, so there is no waiting period to serve.

Version 1.0.0 / versionCode 1 is what is built. Bump `versionCode` in
`android/app/build.gradle` for every upload — Play rejects a repeat.
