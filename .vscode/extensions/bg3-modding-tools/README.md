# BG3 Modding Tools

This repository-local extension is the home for Visual Studio Code language,
navigation, and workflow features used during BG3 mod development.

Features are kept in separate TypeScript modules under `src/features/` so
additional tooling can be added without turning the extension entry point
into a monolith. esbuild combines those modules into the committed
`dist/extension.js` runtime bundle.

## BG3 game-data features

- Adds every `new entry "Name"` declaration to the native Outline view,
  editor breadcrumbs, **Go to Symbol in Editor** (`Ctrl+Shift+O`), and
  **Go to Symbol in Workspace** (`Ctrl+T`).
- Uses the following `type` line to choose the symbol icon and detail.
- Adds localization `contentuid` handles from `.loca.xml` files to Outline,
  workspace symbol search, and definition lookup.
- Shows localized-text snippets as `.loca.xml` Outline entries while retaining
  each handle as the symbol's navigation target and detail.
- Makes localization workspace symbols searchable by either their localized
  text or their handle.
- Adds root templates under `RootTemplates/**/*.lsf.lsx` using `MapKey` as
  their definition identifier and `Stats` (falling back to `Name`) as their
  visible and searchable symbol name.
- Uses explicit definition-link source ranges so UUID MapKeys are highlighted
  and activated as complete identifiers rather than hyphen-delimited pieces.
- Adds `*ClassDescriptions.lsx` entries using `Name` as the visible symbol and
  both `UUID` and `ProgressionTableUUID` as searchable, clickable definition
  identifiers.
- Underlines locally indexed handles and UUIDs in the editor using the same
  decoration style as BG3-GUIDinfos, so the visual treatment corresponds to
  identifiers that our extension can navigate.
- Applies the same handle and UUID navigation, hover, and underline behavior
  while viewing Markdown files.
- Shows hover text for mod-local localization handles while remaining
  compatible with BG3 Text Support's base-game handle tooltips.
- Makes exact BG3 stats identifiers in `.txt`, `.lsx`, `.loca.xml`, `.khn`,
  and `.md` files navigable with **Go to Definition** (`F12`) and Ctrl+click.
- Finds exact usages of indexed identifiers across those authored file types
  with **Go to References** (`Shift+F12`), including unsaved documents.
- Returns all matching source declarations when an identifier has been
  overridden in multiple files.
- Keeps the declaration index current as source files are edited, created,
  changed, or deleted.

Generated and third-party folders such as `build/`, `bin/`, `node_modules/`,
and `Wiki/` are excluded from definition lookup.

## Development structure

- `src/features/gameData/index.ts` registers providers, watchers, and editor
  updates.
- `src/features/gameData/declarationIndex.ts` discovers and caches
  declarations.
- `src/features/gameData/navigation.ts` owns symbols, links, hovers, and
  decorations.
- `src/features/gameData/parsers/` contains the independent stats,
  localization, and LSX parsers.
- `dist/extension.js` is the single committed runtime bundle loaded by
  VS Code.

## Installation

After cloning the repository:

1. Run **Developer: Install Extension from Location...** from the Command
   Palette.
2. Select `.vscode/extensions/bg3-modding-tools`.
3. Run **Developer: Reload Window**.

No publishing or extension packaging is required. After changing extension
source code, run `npm install` once, then `npm run build` and
**Developer: Reload Window**. Alternatively, keep `npm run watch` running
while editing and reload VS Code when you want to exercise a new bundle.

The committed bundle means installation from a fresh clone does not require
Node.js, npm dependencies, or a build step.

## Tests

From `.vscode/extensions/bg3-modding-tools`, run:

- `npm test` to run the TypeScript regression suite directly through tsx
  and Node's built-in test runner.
- `npm run test:coverage` for Node's built-in coverage report. It enforces
  minimum overall coverage of 90% lines, 75% branches, and 80% functions.
- `npm run verify` to type-check, bundle, and run the coverage-gated suite.
