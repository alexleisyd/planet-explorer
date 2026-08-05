# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Planet Explorer is a browser game: fly a survey craft around 24 solar-system bodies rendered with fully procedural (asset-free) surfaces. Three files, no build step, no network:

- `index.html` — the entire game (markup, CSS, and ~1,700 lines of JS in one inline `<script>`)
- `three.min.js` — vendored Three.js **r128** (the only dependency; APIs must stay r128-compatible, e.g. `outputEncoding`/`sRGBEncoding`, `mapTexelToLinear` in shader patches)
- `README.md`

## Running / verifying

Open `index.html` directly in a browser (`open index.html`) — `file://` works, no server needed. There are no tests, no linter, no package manager, and no build. Verify changes by loading the page and watching the console; a texture-baking bug usually shows as a stuck "Scanning surface — N%" overlay.

Two localStorage keys hold persistent state; clear them to test first-run behavior:
- `pe-pilot` — `{mass, age}` for the "You, here" panel
- `pe-surveyed` — array of surveyed body ids (mission badges)

## Architecture

Everything is driven by data tables keyed on body `id`. To add or change a world you edit table entries, not code paths.

**Body catalogue (`index.html:289`)** — `BODIES` is the single source of truth: id, display name/class, real `radiusKm` / `dayH` / `distM`, HUD `fact`, selector-strip `dot`, plus optional `atmo`, `rings`, `clouds`, `parent` (moons), `scaleAxes` (Haumea's egg), `railY`/`railDX` (strip layout nudges). Parallel keyed tables: `TILTS` (:367, the lean each body is *rendered* with), `TILT_DEG` (:371, the real obliquity the science layers quote — the two must stay in agreement, and a body with no measured pole is left out of `TILT_DEG` rather than given a number), `GRAV` (:373), `ORBIT_YEARS` (:1921).

**Earth's real map (`index.html:505`–`:794`)** — Earth is the exception to "procedural everything": `COASTS`, `INLAND_SEAS`, `ICE_SHEETS` and `RANGES` are hand-traced `[lon°,lat°]` geography. `GEO` (:705) rasterises them once into four byte fields — `land`, `cont` (a wide blur of `land`, i.e. how deep inside a continent, which drives both the offshore shelf and interior aridity), `range`, `ice` — sampled bilinearly. Both `SURFACES.earth` and `HFIELDS.earth` go through `earthGeo` (:785), which applies the same two-scale domain warp to the lookup so shading and relief share one coastline and no polygon edge shows. Shapes are drawn at three longitude offsets so seam-crossing outlines wrap; `lat` runs *negative-north* (true latitude is `-lat`).

**Procedural surfaces (`index.html:375`–`:1142`)** — a seeded 3D value-noise `fbm` feeds per-body functions in `SURFACES`, each mapping a unit-sphere point `(px,py,pz,lat,lon)` to an RGB(A) triple. `bakeSurface` walks an equirectangular canvas in **~14 ms slices** with `await setTimeout(0)` between them so the page never freezes, reporting progress to the scan overlay. Companion tables, all keyed by body id:
- `POSTS` (:1071) — 2D canvas passes after the noise pass (crater stamping, Ceres' bright faculae)
- `DISPLACE` (:1098) — displacement scale in body radii; presence of an entry is what makes a world get real relief (and a 320×240 sphere instead of 128×96)
- `HFIELDS` (:1111) / `HF_DEFAULT` (:1110) — the height field baked into the displacement map
- `HCRATERS` (:1104) — crater counts stamped into the *height* map; these must stay in sync with the counts in `POSTS`, and `craterList` (:431) is deterministic and resolution-independent so color and relief line up
- `TEX_SIZES` (:1404) — per-id override; everything else bakes at 2048×1024

**Materials (`planetMaterial`, `index.html:1325`)** — `MeshStandardMaterial` patched via `onBeforeCompile`: a mirrored-repeat detail texture faded in by view distance, plus the optional wind shader that slides `vUv.x` over time. Jupiter counterflows band pairs; Neptune slides the whole deck retrograde. The band profile is deliberately clamped to ±1 (rigid bands, shear confined to thin lanes) — a smooth latitude profile shears the texture without bound and destroys the clouds within minutes. `customProgramCacheKey` is required because all planet materials share one `onBeforeCompile` source.

**Body construction (`buildBody`, `index.html:1439`)** — assembles one `THREE.Group` per body and caches it in `built` (textures cached separately in `texCache`), so each body bakes once per session. Structure: `group` (holds tilt, atmosphere, rings, moon pivots, parent backdrop) → `spinGroup` (surface mesh, clouds, spot overlay, solar prominences). `COMPANIONS` (:1431) defines orbiting moons with compressed distances and ~2.5× exaggerated sizes; negative `T` = retrograde. When a **moon** is the target, the same table is inverted to hang the host planet in its sky as a backdrop that orbits the moon at the moon's period.

Physical invariants baked into `buildBody` — preserve them when touching spin/orbit code: every moon is tidally locked (`spinRate` = its orbit rate, so the host stays over one face), Pluto is locked back to Charon, and Triton's retrograde `T` propagates to both its spin and its sky. Retrograde rotation is expressed the way nature does it — as an obliquity past 90° in `TILTS` (Venus 177°, Pluto 123°), not as a negative spin rate.

**Camera & HUD (`index.html:1597`–`:2011`)** — no OrbitControls; a hand-rolled spherical camera (`ctl`) with drag momentum, exponential smoothing, `MIN_D`/`MAX_D` clamps, and rotation damped near the surface. Distance is in body radii, converted to km via `radiusKm` for the instrument readouts. `setTarget` (:1856) is the async selection path — it uses a `reqSeq` guard so a newer selection supersedes an in-flight bake. The bottom selector strip and the full-screen orbital plot are both DOM/2D-canvas, not WebGL.

**Time warp (`index.html:1679`)** — `TIME_STOPS` is the warp ladder; `timeScale()` multiplies the *world* clock only. The main loop keeps two deltas: `dt` (real seconds — camera smoothing, inertia, the survey hold) and `adt = dt*timeScale()` (every spin, moon orbit, backdrop orbit and prominence). Because a rotation always takes `dayH*10` seconds, one second at 1× is six minutes of local day on *every* body, which is what the readout states. Two deliberate exceptions: companion-moon orbits still use the compressed `COMPANIONS` periods, so they run fast against that clock, and the wind uniforms advance on `wdt`, capped at 2× — `jetTime` smears the cloud texture in proportion to elapsed time, so letting it run at 60× grinds the bands to mush.

**Science layers (`index.html:1704`)** — the G overlay. `buildLayers` rebuilds one `THREE.Group` per target: a body frame carrying the same `TILTS` lean as `buildBody` (axis, poles, equator, a spin arrow whose pivot swings to face the camera each frame), plus a Sun-frame child holding the terminator ring and sub-solar marker, skipped for Sol. Callouts are DOM elements in `#layerLabels`, projected each frame by `updateLayerLabels` and hidden by a `p·camera > 1` horizon test unless flagged `through`. The cage is always a plain sphere at `LAYER_R` — an ellipse fitted to Haumea's egg would swing off the surface as it tumbles.

**Missions (`index.html:2016`)** — `MISSIONS` pairs a clue with a target id and a debrief. Progress is a `Set` persisted to `pe-surveyed`; `surveyTick` runs each frame and awards a badge after holding inside `SURVEY_DIST` radii for `SURVEY_TIME` seconds.

**Main loop (`index.html:2192`)** — single `requestAnimationFrame` tick: keyboard nudges, inertia, camera smoothing, per-body animation (spin, wind uniforms, moon pivots, parent backdrop orbit, solar prominence breathing), instrument updates, `surveyTick`, lens flares, render.

## Conventions

- Compact style: minimal spacing around operators, single-line helpers, `const $=id=>document.getElementById(id)`.
- Comments explain *why* — real physics, why a value was tuned, what breaks otherwise. Match that register; the physics comments are load-bearing documentation.
- Every clue, debrief, and `fact` string is real science. Keep new copy accurate and written for a young reader.
- Colors and UI chrome come from the CSS custom properties in `:root` (`--amber` for live data, `--chrome` for labels, `--ink` for headings).
