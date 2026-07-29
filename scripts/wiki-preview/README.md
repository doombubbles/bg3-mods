# Wiki Preview

This directory contains the local Wiki preview shell. Vite serves the processed Markdown from `build/Wiki`, while remark with its GitHub Flavored Markdown plugin renders pages and `_Sidebar.md` in the browser. GitHub Markdown CSS is the only stylesheet applied to article content.

From the repository root, install the preview dependencies once:

```powershell
npm install
```

Start the preview and source watcher:

```powershell
npm run wiki:preview
```

The browser opens at `http://localhost:3000`. Changes under `Wiki`, the documented mod sources, or their rendered localization rebuild `build/Wiki`; Vite then reloads the preview automatically.

For a one-shot processed Wiki build without the web server or watcher, run:

```powershell
npm run wiki:build
```
