## Index site

The apex `index.html` lists all projects from `projects.json`.

### Configuration

`projects.json` contains a `projects` array. Each entry supports:

| Field | Description |
|-------|-------------|
| `name` | Display name (required) |
| `description` | Short description |
| `subdomain` | Subdomain the project is deployed on (e.g. `catslop` → `https://catslop.example.com/` when the apex is served from `example.com`; a leading `www.` is ignored) |
| `url` | Link to the project; relative (`GradientLab/`) or absolute. Used when `subdomain` is unset or when previewing on localhost. Either `url` or `subdomain` is required |
| `hide` | `true` hides the project without removing it from the config |

Projects are shown in file order. Extra fields (tags, thumbnails…) are ignored and can be added later; styling lives in `index.css`.

### Installation and deployment

No build step. Deploy the repository root as static files (`index.html`, `index.css`, `index.js`, `projects.json` plus the project folders) to your web host, e.g. GitHub Pages. To preview locally: `python3 -m http.server` and open http://localhost:8000 (the config is loaded via `fetch`, so `file://` won't work).
