# Planet Explorer

A browser game that puts you in a survey craft anywhere in the solar system. Fly around any of 24 bodies — the Sun, all 8 planets, 5 dwarf planets, and 10 famous moons — rendered with fully procedural surfaces. No assets, no build step, no internet required.

## Run it

Open `index.html` in a browser. That's it — everything (including Three.js) is local to this folder.

## Controls

| Input | Action |
|---|---|
| Drag | Fly around the target (with momentum) |
| Scroll | Move closer / farther |
| WASD / arrows | Nudge the camera |
| Bottom strip | Click a dot to set course; moons stack above their parent planet |
| Strip background / `⤢ orbital plot` | Open the live 2D system map |
| `⬡ captain's log` | Open the survey-badge log |
| Esc | Close the system map or log |

## What's inside

- **Survey missions** — 12 clue-based objectives ("Find the moon that orbits its planet backwards…"). Work out the world, fly there, descend close and hold position to survey it. Each survey stamps a badge into the Captain's Log with a debrief fact; earned worlds get an amber ring in the selector strip. Every clue and debrief is real science, and progress is saved between visits.
- **Real relief** — solid worlds bake a height map alongside their color map, driving true displacement: crater bowls with raised rims, mountain ranges, lunar maria sitting low, Pluto's flat nitrogen glacier — all visible on the planet's silhouette and sharpest along the terminator.
- **Procedural everything** — every surface is generated at load from seeded 3D value noise: Earth's continents and drifting clouds, Jupiter's counter-flowing cloud bands (alternating zonal jets, with the Great Red Spot drifting between them), Saturn's faint stripes and white oval storms under its rings with the Cassini division, Neptune's supersonic retrograde winds streaking methane cirrus past the Great Dark Spot and its bright companion cloud, Io's volcanoes, Europa's lineae, Haumea's tumbling egg shape (and its real ring), Charon orbiting Pluto as a binary pair, and solar prominences — plasma loops and jets that breathe and erupt off the Sun's limb.
- **The view from a moon** — select any moon and its host planet hangs in the sky: Saturn and its rings loom over Enceladus, Jupiter's bands churn above Io, Neptune rises past Triton's shoulder, and Earth (clouds and all) floats over the Moon — spinning, lit by the same Sun, with their winds still blowing. And the sky moves: the planet circles the moon at the moon's real orbital direction and (game-scaled) period — backwards for Triton — waxing and waning through phases as the Sun angle sweeps around. Tidal locking is honored everywhere: every moon spins exactly once per orbit so its host stays over the same face, and Pluto & Charon — the solar system's only mutually locked pair — each keep one face toward the other.
- **Real numbers** — the HUD shows live range-to-surface and velocity in kilometers scaled to each body's true radius, plus radius / day length / orbital distance data.
- **"You, here"** — enter your weight and age in the pilot row and every world shows what *you* would weigh there, how high you could jump (35 m on Enceladus!), and how many birthdays you'd have had — real surface gravity and orbital periods, saved between visits.
- **Avionics-style cockpit HUD** — instrument tapes, a system-map strip scaled by log distance, and a full-screen orbital plot where planets crawl along their orbits at speeds proportional to their real periods.
- **Single file** — the whole game is `index.html` (~1,100 lines); `three.min.js` (r128) is the only dependency, vendored locally.

Textures bake asynchronously in ~14 ms slices (with a scan-progress overlay), so the page never freezes; each body bakes once per session and is cached.
