# Everhall

A static, no-build web app. Turn photos, videos and stories into a 3D hall people can walk through.

## Deploy on GitHub Pages
1. Create a repository and upload the contents of this folder (keep the structure).
2. Settings > Pages > Deploy from branch > `main`, folder `/ (root)`.
3. Open `https://<you>.github.io/<repo>/`.

## How it works
- `index.html`: your library of halls (stored in your browser's IndexedDB). Create, duplicate, delete, export, import.
- `hall/`: the 3D viewer. `hall/?id=<local id>` opens one of your halls with the editor. `hall/?src=<url>` opens any hosted hall file in visitor mode, with a "Save a copy" button.
- `src/engine`: layout rules (rooms, hero pieces, placement). `src/world`: Three.js rooms, navigation, audio. `src/themes`: moods. `src/store`: where halls live. `src/ui`: panels and editor.
- `demo/`: Pablo's hall as the showcase. Media sits beside the file and loads on demand.

## Sharing a hall
1. Open a hall, press Edit, press Export (or use Export in the library). You get one `.everhall.json` file with the photos inside.
2. Put the file anywhere static, for example this repo's `halls/` folder.
3. On the library page, paste the file's address under "Open or share by link" and copy the viewer link.

Other hosts need to allow cross-origin requests for the file. GitHub Pages serves static files, so a hall hosted in the same repo needs nothing extra.

## Hall file format (v1)
`{ "v":1, "data":{ "name","sub","theme","items":[...] }, "images":{ "key": "data URL or relative URL" } }`
Each item: `id, type (wall|pedestal|screen|text|audio), group (the room), title, cap, date, src, hero?, img?, ar?, yt?, glb?, credit?, range?`.
`glb` may be a URL, relative to the hall file, of a 3D model shown on a pedestal.

## Spaces (modular worlds)
A hall's content is separate from the space that shows it. Pick a space when you create a hall, or switch it any time in the editor. They run from small and simple to large and open, and each declares how many pieces it holds well.

| Space | What it is | Holds well | Limit |
|---|---|---|---|
| The Cabinet | One small, intimate room | 1-8 | 10 |
| The Rotunda | One round hall, monument at the centre, story around the wall | 6-24 | 32 |
| The Gallery | A walk through chapter rooms, each with a centrepiece | 9-36 | 48 |
| The Courtyard | Open-air garden of stelae and monuments | 16-60 | 72 |

These ranges are first estimates; tune them in `src/spaces/catalog.js` after testing. The editor shows a capacity note and suggests a better fit when the piece count is outside the range. Preview any hall in any space by adding `&space=rotunda` (or `cabinet`, `gallery`, `courtyard`) to the viewer link.

### Adding a space
1. Add an entry (id, name, tier, min/rec/max, description, icon) to `src/spaces/catalog.js`.
2. Add a builder that attaches six functions to it, as in `src/spaces/gallery.js` and `radial.js`: `layout(data)` returns the chapter areas, `build(areas)` creates the geometry and fills `focus`/`OBS`, and `areaAt`, `entry`, `route`, `collide` handle navigation.
3. Load the file in `hall/index.html`. The library chooser and the editor pick it up from the catalogue.

## Known limits
Storage is local to one browser until a backend adapter is added. Embedded YouTube needs a real host. Keep photos around 900 px wide and models small for phones.
