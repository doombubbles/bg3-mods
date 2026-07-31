# Wiki Preview

This directory contains the local Wiki preview shell. Vite serves the processed Markdown from `build/Wiki`, while remark with its GitHub Flavored Markdown plugin renders pages and `_Sidebar.md` in the browser. GitHub Markdown CSS is the only stylesheet applied to article content.

From the repository root, install the preview dependencies once:

```powershell
npm --prefix scripts/wiki-preview install
```

Start the preview and source watcher:

```powershell
npm --prefix scripts/wiki-preview run wiki:preview
```

Vite listens on all network interfaces through `--host 0.0.0.0`. Open
`http://localhost:3003` on this computer or
`http://<host-lan-address>:3003` from another device. Changes under `Wiki`,
the documented mod sources, or their rendered localization rebuild
`build/Wiki`; Vite then reloads the preview automatically.

The initial build populates the complete Markdown and image tree. While the
server is running, rebuilds preserve existing static images and copy only new
ones discovered by the incremental image sync. Generated files under
`build/Wiki` are ignored while a build is in progress, then the preview sends
one full-page reload after the completed incremental build.

Added or changed Markdown files beneath `Wiki` also queue the incremental Wiki
image sync in the background. Image checks are debounced for 750 milliseconds,
and preview rebuilds wait for one second of quiet. At most two image syncs run
concurrently. Existing converted images are left unchanged.

To run the same build watcher and preview server with Docker Compose, first
make sure `bin/ProcessTemplates` contains a Linux build of ProcessTemplates,
then run:

```powershell
npm --prefix scripts/wiki-preview run wiki:preview:docker
```

This runs `docker compose up -d` using
`scripts/wiki-preview/compose.yaml`. The service mounts the repository,
publishes its preview directly to host port 3003, uses the Linux
ProcessTemplates binary automatically, and polls the bind mount for source
changes. Open `http://<host-lan-address>:3003` from another device on the local
network. The setup does not create a persistent Windows port proxy.

Stop and remove the preview container with:

```powershell
docker compose -f scripts/wiki-preview/compose.yaml down
```

For a one-shot processed Wiki build without the web server or watcher, run:

```powershell
npm --prefix scripts/wiki-preview run wiki:build
```

To render one source Wiki page through the previewer and save it as a PDF under
`output`, run:

```powershell
npm --prefix scripts/wiki-preview run wiki:pdf -- Wiki/Death-Knight.md
```

The command rebuilds the processed Wiki first, waits for the page and its images
to finish rendering, and then writes `output/Death-Knight.pdf`. Paths beneath
`Wiki` are preserved beneath `output`. Install the PDF browser once after
installing dependencies:

```powershell
npx playwright install chromium
```
