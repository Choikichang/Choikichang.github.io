# react-island — voxel manta background

A small React + [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) app
that renders a school of voxel manta rays behind the Jekyll site, plus an
ocean-veil page-transition effect.

## Develop

```bash
cd react-island
npm install      # first time only
npm run dev      # http://127.0.0.1:5173  — live preview of the school + transition
```

## Build (commit the output)

```bash
npm run build    # writes the bundle to ../assets/manta/{manta.js,manta.css}
```

GitHub Pages only runs Jekyll (no npm), so the built bundle in `/assets/manta`
**must be committed**. Rebuild and commit whenever you change anything in `src/`.

## How it plugs into Jekyll

- `_config.yml` → `manta_background: true|false` toggles the whole thing.
- `_layouts/default.html` adds the `manta-on` class to `<html>` when enabled.
- `_includes/manta-background.html` mounts `#manta-root` (+ frosted `#manta-scrim`)
  and loads the bundle.
- `manta.css` layers the scene **behind** the page with a frosted scrim so text
  stays readable. Tune `--manta-scrim` (0 = vivid fish … 1 = fully frosted).

## Source map

| file | role |
| --- | --- |
| `mantaGeometry.js` | voxelises one manta (navy back / white belly) into 3 merged meshes |
| `Manta.jsx` | one fish: swims, bobs, banks, flaps; reacts to the transition surge |
| `MantaSchool.jsx` | builds geometry once, spawns N fish with varied lanes |
| `MantaBackground.jsx` | the `<Canvas>`, lights, fog, device/reduced-motion tuning |
| `transition.js` | intercepts in-site links → ocean-veil wipe + swoosh, then navigates |
| `bus.js` | tiny shared store linking the transition code to the scene |
