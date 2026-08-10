# Planet Explorer

A browser game that puts you in a survey craft anywhere in the solar system. Fly around any of 24 bodies — the Sun, all 8 planets, 5 dwarf planets, and 10 famous moons — rendered with fully procedural surfaces. No assets, no build step, no internet required.

## Run it

Open `index.html` in a browser. That's it — everything (including Three.js) is local to this folder.

## Controls

The whole screen flies the craft — a drag that starts on top of a panel still
works, so the HUD never gets in the way of the world behind it.

| Input | Action |
|---|---|
| Drag | Fly around the target (with momentum) |
| Scroll / pinch | Move closer / farther |
| WASD / arrows | Nudge the camera |
| Space or `‖`, `[` `]` | Hold time / slow down / speed up |
| `G` / `axis & sun` | Show the science layers |
| `N` / `landmarks` | Name the landmarks on this world |
| `X` / `sense of scale` | Open "sense of scale" |
| `H` / `◐ hide hud` | Fold the whole HUD away, leaving just the world |
| `F` / `⤢ full screen` | Fill the screen, browser chrome and all |
| Bottom strip | Tap a dot to set course; moons stack above their parent planet |
| Strip background / `⤢ orbital plot` | Open the live 2D system map |
| `⬡ captain's log` | Open the survey-badge log |
| Esc / tap outside | Close the system map, log or scale panel |
| `body data ▾` | Fold the right-hand panel down to its heading |

## On a tablet

The game is built for iPad first. One finger flies, two fingers pinch to
change range, and every keyboard shortcut also has a button, so nothing needs
a keyboard. `⤢ full screen` drops Safari's own chrome as well (iPadOS 16.4 and
later); adding the page to your home screen gets the same thing permanently,
and the button steps aside there since there is nothing left to hide.

Controls grow to finger size on a touch screen, and the layout
reflows: in landscape the instruments stay down the left edge, and in portrait
— where an iPad is only ~820px wide and a side column would sit squarely on
the planet — they drop into a console along the bottom with the data panel
folded to its heading, leaving the globe completely clear.

## What's inside

- **Survey missions** — 12 clue-based objectives ("Find the moon that orbits its planet backwards…"). Work out the world, fly there, descend close and hold position to survey it. Each survey stamps a badge into the Captain's Log with a debrief fact; earned worlds get an amber ring in the selector strip. Every clue and debrief is real science, and progress is saved between visits.
- **Real relief** — solid worlds bake a height map alongside their color map, driving true displacement: crater bowls with raised rims, mountain ranges, lunar maria sitting low, Pluto's flat nitrogen glacier — all visible on the planet's silhouette and sharpest along the terminator.
- **The real Earth** — Earth is the one world you can check against memory, so its map is the real one: hand-traced coastlines for every continent and the islands worth seeing from orbit, rasterised at load and frayed by a noise warp into bays and capes. The climate follows: rainforest on the equator, the subtropical deserts (Sahara, Arabia, the outback), taiga and tundra north of that, ice on Greenland and Antarctica, the pale continental shelf ringing every coast — and cloud banded like the real circulation, thick over the equator, clear over the deserts, storm tracks at ±50°.
- **Procedural everything else** — every other surface is generated at load from seeded 3D value noise: Jupiter's counter-flowing cloud bands (alternating zonal jets, with the Great Red Spot drifting between them), Saturn's faint stripes and white oval storms under its rings with the Cassini division, Neptune's supersonic retrograde winds streaking methane cirrus past the Great Dark Spot and its bright companion cloud, Io's volcanoes, Europa's lineae, Haumea's tumbling egg shape (and its real ring), Charon orbiting Pluto as a binary pair, and solar prominences — plasma loops and jets that breathe and erupt off the Sun's limb.
- **The view from a moon** — select any moon and its host planet hangs in the sky: Saturn and its rings loom over Enceladus, Jupiter's bands churn above Io, Neptune rises past Triton's shoulder, and Earth (clouds and all) floats over the Moon — spinning, lit by the same Sun, with their winds still blowing. And the sky moves: the planet circles the moon at the moon's real orbital direction and (game-scaled) period — backwards for Triton — waxing and waning through phases as the Sun angle sweeps around. Tidal locking is honored everywhere: every moon spins exactly once per orbit so its host stays over the same face, and Pluto & Charon — the solar system's only mutually locked pair — each keep one face toward the other.
- **Time warp** — every world turns on the same clock: one second of flight is six minutes of that world's day, wherever you are. Warp it up to 60× (or hold it still) and the physics becomes something you can watch: the Moon keeps the same face toward Earth all the way around its orbit, Haumea tumbles end-over-end every four hours while Venus barely creeps, and the terminator sweeps across the ground below you.
- **Science layers** — press `G` and the target gets its schematic: spin axis with the poles marked and the real axial tilt on the label, the equator, an arrow for which way it turns, and — drawn in the Sun's frame rather than the body's — the sub-solar point where the Sun stands straight overhead and the terminator, the sunrise/sunset line every point rolls through once a day. Uranus lying on its side at 98°, Venus hanging upside down at 177° so its spin runs backwards, and Triton turning against its own orbit all become plain to see rather than something to take on trust.
- **Named landmarks** — press `N` and the real places on the world below get named: Olympus Mons and Valles Marineris on Mars, Tycho and Mare Imbrium on the Moon (and the Sea of Tranquility, where Apollo 11 landed), Caloris on Mercury, Sputnik Planitia on Pluto, Loki Patera on Io, Valhalla on Callisto, the Cassini Division in Saturn's rings, the Great Red Spot as it drifts. They are not stickers on noise: every entry is stamped into the surface *and* the height map at its real latitude and longitude, so Valles Marineris is genuinely a gash 4,000 km long and Olympus really is a shield volcano with a caldera. Fly closer to whichever one you are pointing at and it tells you what it is. Worlds we have only ever seen as cloud — Venus, Uranus — honestly have nothing to show.
- **Sense of scale** — press `X`. The target and Earth are drawn at one scale, which is the whole point: next to the Sun, Earth is a dot you have to hunt for. Then the entire solar system shrinks until the Sun is a 30 cm beach ball — Earth becomes a peppercorn 32 m away, Neptune a marble most of a kilometre off — and the distances get measured in things that take time: how long sunlight takes to arrive, how long a radio call to Earth takes each way, how many years an airliner would need to fly there. Every number is computed from the body's real radius and orbit.
- **Real numbers** — the HUD shows live range-to-surface and velocity in kilometers scaled to each body's true radius, plus radius / day length / axial tilt / orbital distance data.
- **"You, here"** — enter your weight and age in the pilot row and every world shows what *you* would weigh there, how high you could jump (35 m on Enceladus!), and how many birthdays you'd have had — real surface gravity and orbital periods, saved between visits.
- **Avionics-style cockpit HUD** — instrument tapes, a system-map strip scaled by log distance, and a full-screen orbital plot where planets crawl along their orbits at speeds proportional to their real periods.
- **Single file** — the whole game is `index.html` (~2,700 lines); `three.min.js` (r128) is the only dependency, vendored locally.

Textures bake asynchronously in ~14 ms slices (with a scan-progress overlay), so the page never freezes. Worlds are cached as you visit them, a few at a time, and their maps are freed again when they fall out — a phone keeps two and bakes them at half the size, a desktop keeps five at full size. Setting a new course cancels the bake of the one you just left, so you can walk the whole strip without waiting on worlds you passed through.

## Android

A [Capacitor](https://capacitorjs.com) shell lives in `mobile/`, so the repo root stays the three files and `open index.html` still works. The wrapper adds nothing to the game: no network, no analytics, and **no Android permissions at all**.

```
cd mobile && npm install
npm run dev      # copy the game in, sync, build and run on a device
npm run apk      # debug APK
npm run bundle   # release AAB (needs signing config)
```

`mobile/www/` is generated by the copy step — edit `index.html` in the repo root, never there.
