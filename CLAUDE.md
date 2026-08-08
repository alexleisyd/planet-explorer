# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Planet Explorer is a browser game: fly a survey craft around 24 solar-system bodies rendered with fully procedural (asset-free) surfaces. Three files, no build step, no network:

- `index.html` — the entire game (markup, CSS, and ~2,100 lines of JS in one inline `<script>`)
- `three.min.js` — vendored Three.js **r128** (the only dependency; APIs must stay r128-compatible, e.g. `outputEncoding`/`sRGBEncoding`, `mapTexelToLinear` in shader patches)
- `README.md`

## Running / verifying

Open `index.html` directly in a browser (`open index.html`) — `file://` works, no server needed. There are no tests, no linter, no package manager, and no build. Verify changes by loading the page and watching the console; a texture-baking bug usually shows as a stuck "Scanning surface — N%" overlay.

Three localStorage keys hold persistent state; clear them to test first-run behavior:
- `pe-pilot` — `{mass, age}` for the "You, here" panel
- `pe-surveyed` — array of surveyed body ids (mission badges)
- `pe-datapanel` — `"1"`/`"0"`, whether the body-data panel is unfolded (defaults to folded below 900px)

**iPad is the primary surface**, so check any layout change at 1180×730 and 1024×690 (landscape) and 820×1080 and 744×960 (portrait), not just a desktop window. A browser cannot be asked to report `pointer:coarse`, so to exercise the touch branch make a copy with the media query and the `coarse` flag forced on:

```
python3 - <<'EOF'
s=open('index.html').read()
s=s.replace('@media (pointer:coarse){','@media (min-width:1px){',1)
s=s.replace('const coarse=matchMedia("(pointer:coarse)").matches;','const coarse=true;',1)
open('/tmp/pe-touch.html','w').write(s)
EOF
```

## Architecture

Everything is driven by data tables keyed on body `id`. To add or change a world you edit table entries, not code paths.

**Body catalogue (`index.html:481`)** — `BODIES` is the single source of truth: id, display name/class, real `radiusKm` / `dayH` / `distM`, HUD `fact`, selector-strip `dot`, plus optional `atmo`, `rings`, `clouds`, `parent` (moons), `scaleAxes` (Haumea's egg), `railY`/`railDX` (strip layout nudges). Parallel keyed tables: `TILTS` (:559, the lean each body is *rendered* with), `TILT_DEG` (:563, the real obliquity the science layers quote — the two must stay in agreement, and a body with no measured pole is left out of `TILT_DEG` rather than given a number), `GRAV` (:565), `ORBIT_YEARS` (:2501).

**Earth's real map (`index.html:858`–`:1147`)** — Earth is the exception to "procedural everything": `COASTS`, `INLAND_SEAS`, `ICE_SHEETS` and `RANGES` are hand-traced `[lon°,lat°]` geography. `GEO` (:1058) rasterises them once into four byte fields — `land`, `cont` (a wide blur of `land`, i.e. how deep inside a continent, which drives both the offshore shelf and interior aridity), `range`, `ice` — sampled bilinearly. Both `SURFACES.earth` and `HFIELDS.earth` go through `earthGeo` (:1138), which applies the same two-scale domain warp to the lookup so shading and relief share one coastline and no polygon edge shows. Shapes are drawn at three longitude offsets so seam-crossing outlines wrap; `lat` runs *negative-north* (true latitude is `-lat`).

**Procedural surfaces (`index.html:784`–`:1470`)** — a seeded 3D value-noise `fbm` feeds per-body functions in `SURFACES`, each mapping a unit-sphere point `(px,py,pz,lat,lon)` to an RGB(A) triple. `bakeSurface` walks an equirectangular canvas in **~14 ms slices** with `await setTimeout(0)` between them so the page never freezes, reporting progress to the scan overlay. Companion tables, all keyed by body id:
- `POSTS` (:1424) — 2D canvas passes after the noise pass (crater stamping, Ceres' bright faculae)
- `DISPLACE` (:1452) — displacement scale in body radii; presence of an entry is what makes a world get real relief (and a 320×240 sphere instead of 128×96)
- `HFIELDS` (:1465) / `HF_DEFAULT` (:1464) — the height field baked into the displacement map
- `HCRATERS` (:1458) — crater counts stamped into the *height* map; these must stay in sync with the counts in `POSTS`, and `craterList` (:784) is deterministic and resolution-independent so color and relief line up
- `TEX_SIZES` (:1762) — per-id override; everything else bakes at 2048×1024

**Named landmarks (`index.html:610`–`:751`)** — `LANDMARKS` is a per-id list of real places at real coordinates (latitude °N, **east** longitude °), and it is the single source for all three of: the color stamp, the relief stamp, and the callout. `surfaceTexture` applies it centrally — `lmPaint` wraps the `SURFACES` function and `lmRelief` wraps the height field — so adding a landmark never means editing a surface function. Points to keep in mind:
- **The bake runs 180° out of phase with map longitude.** `GEO` rasterises Earth with `x=(lon+180)/360`, which fixed the convention for every body; `lmT` and `lmDir` are the only two places that +180 appears, and they must agree.
- The bake's `(px,py,pz)` triple is mirrored in x relative to the mesh (`SphereGeometry` maps texture u to `-cos φ`), so `lmDir` is *not* the bake point. Both frames still measure east as increasing longitude, which is why an elongated feature keeps its bearing.
- `lmT` returns distance from a feature's centre as a fraction of its own radius (1 = rim), measured in degrees of arc east/north — so a feature's size comes straight from its real width, `(D/2)/R` radians. `lmShape` turns that into the height profile per kind (crater bowl + rim, volcano cone + caldera, canyon, basin), and `lvl` flattens a plain to its own level instead.
- Any body carrying a relief landmark bakes its height map at **2048** instead of 1024: the two `softenCanvas` passes would otherwise erase anything as narrow as Valles Marineris.
- Entries with no `c`/`h`/`lvl` are label-only, for features the surface already draws (Earth's traced geography, the Red and Dark Spots, Triton's cap). Worlds whose visible surface is cloud rather than ground — Venus, Uranus — deliberately have no entry at all.

**Materials (`planetMaterial`, `index.html:1683`)** — `MeshStandardMaterial` patched via `onBeforeCompile`: a mirrored-repeat detail texture faded in by view distance, plus the optional wind shader that slides `vUv.x` over time. Jupiter counterflows band pairs; Neptune slides the whole deck retrograde. The band profile is deliberately clamped to ±1 (rigid bands, shear confined to thin lanes) — a smooth latitude profile shears the texture without bound and destroys the clouds within minutes. `customProgramCacheKey` is required because all planet materials share one `onBeforeCompile` source.

**Body construction (`buildBody`, `index.html:1809`)** — assembles one `THREE.Group` per body and caches it in `built` (textures cached separately in `texCache`), so each body bakes once per session. Structure: `group` (holds tilt, atmosphere, rings, moon pivots, parent backdrop) → `spinGroup` (surface mesh, clouds, spot overlay, solar prominences). `COMPANIONS` (:1801) defines orbiting moons with compressed distances and ~2.5× exaggerated sizes; negative `T` = retrograde. When a **moon** is the target, the same table is inverted to hang the host planet in its sky as a backdrop that orbits the moon at the moon's period.

Physical invariants baked into `buildBody` — preserve them when touching spin/orbit code: every moon is tidally locked (`spinRate` = its orbit rate, so the host stays over one face), Pluto is locked back to Charon, and Triton's retrograde `T` propagates to both its spin and its sky. Retrograde rotation is expressed the way nature does it — as an obliquity past 90° in `TILTS` (Venus 177°, Pluto 123°), not as a negative spin rate.

**Camera & HUD (`index.html:1966`–`:2500`)** — no OrbitControls; a hand-rolled spherical camera (`ctl`) with drag momentum, exponential smoothing, `MIN_D`/`MAX_D` clamps, and rotation damped near the surface. Distance is in body radii, converted to km via `radiusKm` for the instrument readouts. `setTarget` (:2428) is the async selection path — it uses a `reqSeq` guard so a newer selection supersedes an in-flight bake. The bottom selector strip and the full-screen orbital plot are both DOM/2D-canvas, not WebGL.

**Flight input** — pointer listeners hang off `window`, not the canvas, so a drag that begins on top of a panel still flies the craft; `CONTROLS`/`isControl` is the one list of things that swallow a gesture instead (buttons, inputs, the selector strip, the three dialogs). A `touches` Map keyed by `pointerId` is what makes one finger rotate and two pinch — `pinchD` carries the previous finger gap and its ratio drives `tDist` on the same exponential curve as the wheel. Dropping from two fingers to one re-anchors `ctl.lx/ly` on the finger still down; without that the view snaps by the width of the gap. `touch-action:none` on the canvas and `#hud` (and `gesturestart` preventDefault) is what stops Safari swallowing the drag as a page pan or zoom.

**Responsive HUD** — every panel is placed off `--edge`/`--edgeT`/`--edgeB`/`--edgeL`/`--edgeR` (which fold in `env(safe-area-inset-*)`), plus `--strip`/`--railY` for the selector and `--hudBtnY` for the toggle, so moving the HUD is a matter of changing a number rather than chasing offsets. Four breakpoints, in cascade order: `max-width:1300px` pulls the edges in for iPad landscape; `pointer:coarse` grows every control to a finger target (`.tick` keeps its 34px box and reaches 46px via an inset `::after`, so a "−" does not become a slab) and raises the strip to 92px; `max-width:900px` moves the instruments into a bottom console with the overlay buttons lifted onto their own line and the data panel folded to its heading; `max-height:820px and min-width:901px` bottom-anchors the data panel, which centred would run into the mission card. `#hud.hidden` (the H key / `#hudBtn`) fades every direct child except `#scan`, `#stamp` and the toggle itself — which is why the toggle must stay a *sibling* of `#target` rather than a child, and why it sits below the target block where no panel ever goes.

**Touch and the rail** — the moons of a planet all share its x on the selector strip and can only separate vertically, so `RAIL_Y`/`MOON_TOP`/`MOON_DY` in `posFor` shift with `coarse` (18px apart instead of 12) and **must stay in step with the `--strip`/`--railY` pair in the coarse CSS**. Sub-dots then get a wide, short hit box (`padding:6px 13px`) that tiles without overlapping the moon above. The orbital plot widens its moon orbits and doubles both hit radii on `coarse` for the same reason. Anything the hints offer a key for also has a button — `#warpHold` for space, `#scaleBtn` moved into the Overlays cell beside G and N — and the hint, `#orreryHint` and `#scaleFoot` copy is rewritten for gestures when `coarse` (an iPad has no Esc; all three dialogs close on a tap outside).

**Time warp (`index.html:2141`)** — `TIME_STOPS` is the warp ladder; `timeScale()` multiplies the *world* clock only. The main loop keeps two deltas: `dt` (real seconds — camera smoothing, inertia, the survey hold) and `adt = dt*timeScale()` (every spin, moon orbit, backdrop orbit and prominence). Because a rotation always takes `dayH*10` seconds, one second at 1× is six minutes of local day on *every* body, which is what the readout states. Two deliberate exceptions: companion-moon orbits still use the compressed `COMPANIONS` periods, so they run fast against that clock, and the wind uniforms advance on `wdt`, capped at 2× — `jetTime` smears the cloud texture in proportion to elapsed time, so letting it run at 60× grinds the bands to mush.

**Science layers (`index.html:2191`)** — the G overlay. `buildLayers` rebuilds one `THREE.Group` per target: a body frame carrying the same `TILTS` lean as `buildBody` (axis, poles, equator, a spin arrow whose pivot swings to face the camera each frame), plus a Sun-frame child holding the terminator ring and sub-solar marker, skipped for Sol. Callouts are DOM elements in `#layerLabels`, projected each frame by `updateLayerLabels` and hidden by a `p·camera > 1` horizon test unless flagged `through`. The cage is always a plain sphere at `LAYER_R` — an ellipse fitted to Haumea's egg would swing off the surface as it tumbles.

**Landmark callouts (`index.html:2323`)** — the N overlay, and the consumer of `LANDMARKS`. `buildMarks` hangs a tick, an outline (anything ≥1.5° across) and a DOM chip off one of three frames that copy a rotation each frame in `updateMarks`: `body` (the target's `spinGroup`), `spot` (the Red/Dark Spot overlay meshes, which drift across the winds on their own), and `tilt` (the untilted-but-leaning `group`, for ring gaps, whose pin rides round to the camera-facing side). Pins sit at `1.035 + dscale*0.5` radii — clear of the relief, which pushes out by half the displacement scale, and of Earth's cloud shell. The same `p·camera > 1` horizon test hides both the chip *and* its 3D objects: standing off the surface, they would otherwise swing clear of the limb and hang in space. Only the pin nearest the crosshair gets class `near`, which is what unfolds its note.

**Sense of scale (`index.html:2640`)** — the X overlay. `updateScale` computes everything from `radiusKm` and `distM` — nothing is a stored string: the two discs are drawn at one scale (the smaller is *meant* to come out as a dot), the model line shrinks the system until the Sun is a 30 cm beach ball (`MODEL_K`), and the rows work light, radio and a 900 km/h airliner over the same gaps. Distances to Earth are closest approach (`|distM − AU|`, or the body's own `distM` if it orbits Earth); moons take their Sun distance from their parent.

**Missions (`index.html:2692`)** — `MISSIONS` pairs a clue with a target id and a debrief. Progress is a `Set` persisted to `pe-surveyed`; `surveyTick` runs each frame and awards a badge after holding inside `SURVEY_DIST` radii for `SURVEY_TIME` seconds.

**Main loop (`index.html:2871`)** — single `requestAnimationFrame` tick: keyboard nudges, inertia, camera smoothing, per-body animation (spin, wind uniforms, moon pivots, parent backdrop orbit, solar prominence breathing), instrument updates, `surveyTick`, lens flares, both label overlays, render.

## Conventions

- Compact style: minimal spacing around operators, single-line helpers, `const $=id=>document.getElementById(id)`.
- Comments explain *why* — real physics, why a value was tuned, what breaks otherwise. Match that register; the physics comments are load-bearing documentation.
- Every clue, debrief, and `fact` string is real science. Keep new copy accurate and written for a young reader.
- Colors and UI chrome come from the CSS custom properties in `:root` (`--amber` for live data, `--chrome` for labels, `--ink` for headings).
