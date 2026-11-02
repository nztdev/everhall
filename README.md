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

## Known limits
Storage is local to one browser until a backend adapter is added. Embedded YouTube needs a real host. Keep photos around 900 px wide and models small for phones.
