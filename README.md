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
- **Procedural everything** — every surface is generated at load from seeded 3D value noise: Earth's continents and drifting clouds, Jupiter's bands and Great Red Spot, Saturn's rings with the Cassini division, Io's volcanoes, Europa's lineae, Haumea's tumbling egg shape (and its real ring), Charon orbiting Pluto as a binary pair.
- **Real numbers** — the HUD shows live range-to-surface and velocity in kilometers scaled to each body's true radius, plus radius / day length / orbital distance data.
- **"You, here"** — enter your weight and age in the pilot row and every world shows what *you* would weigh there, how high you could jump (35 m on Enceladus!), and how many birthdays you'd have had — real surface gravity and orbital periods, saved between visits.
- **Avionics-style cockpit HUD** — instrument tapes, a system-map strip scaled by log distance, and a full-screen orbital plot where planets crawl along their orbits at speeds proportional to their real periods.
- **Single file** — the whole game is `index.html` (~1,100 lines); `three.min.js` (r128) is the only dependency, vendored locally.

Textures bake asynchronously in ~14 ms slices (with a scan-progress overlay), so the page never freezes; each body bakes once per session and is cached.
