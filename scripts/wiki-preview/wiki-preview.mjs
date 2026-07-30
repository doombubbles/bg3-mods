import { existsSync } from 'node:fs';
import { extname, isAbsolute, join, relative, sep } from 'node:path';
import { spawn } from 'node:child_process';
import chokidar from 'chokidar';
import { buildRoot, buildWiki, root } from './wiki-build.mjs';

const previewRoot = join(root, 'scripts', 'wiki-preview');
const viteCli = join(previewRoot, 'node_modules', 'vite', 'bin', 'vite.js');
const viteConfig = join(previewRoot, 'vite.config.mjs');
const wikiSourceRoot = join(root, 'Wiki');
const incrementalImageSync = join(root, 'scripts', 'sync-bg3-wiki-images-incremental.sh');
const imageSyncCommand = process.platform === 'win32'
  ? join(root, 'bin', 'busybox.exe')
  : 'bash';
const imageSyncCommandArgs = process.platform === 'win32' ? ['bash'] : [];
const imageSyncConcurrency = 2;
const imageSyncDebounceMs = 600;

if (!existsSync(viteCli)) {
  throw new Error(
    'Preview dependencies are missing. Run npm --prefix scripts/wiki-preview install first.'
  );
}
if (!existsSync(incrementalImageSync)) {
  throw new Error(`Missing incremental Wiki image sync script: ${incrementalImageSync}`);
}
if (process.platform === 'win32' && !existsSync(imageSyncCommand)) {
  throw new Error(`Missing Bash runner: ${imageSyncCommand}`);
}

if (process.argv.includes('--build')) {
  await buildWiki();
  process.exit(0);
}

await buildWiki();

const server = spawn(
  process.execPath,
  [viteCli, '--config', viteConfig, '--host', '0.0.0.0'],
  {
    cwd: root,
    stdio: 'inherit'
  }
);

let building = false;
let rebuildQueued = false;
let debounce;
let activeImageSyncs = 0;
const pendingImageSyncs = new Set();
const activeImageSyncPaths = new Set();
const imageSyncDebounces = new Map();
const watchPaths = [
  wikiSourceRoot,
  join(root, 'DoombubblesTweaks'),
  join(root, 'WoWDeathKnight'),
  join(root, 'WoWSubclasses'),
  join(root, 'build', 'DoombubblesTweaks', 'Localization'),
  join(root, 'build', 'WoWDeathKnight', 'Localization'),
  join(root, 'build', 'WoWSubclasses', 'Localization')
];

async function rebuild() {
  if (building) {
    rebuildQueued = true;
    return;
  }
  building = true;
  try {
    await buildWiki();
  } catch (error) {
    console.error(`Wiki rebuild failed: ${error.message}`);
  } finally {
    building = false;
    if (rebuildQueued) {
      rebuildQueued = false;
      await rebuild();
    }
  }
}

function runIncrementalImageSync(path) {
  return new Promise((resolvePromise, reject) => {
    const displayPath = relative(root, path);
    console.log(`Checking ${displayPath} for new Wiki images...`);

    const child = spawn(
      imageSyncCommand,
      [...imageSyncCommandArgs, incrementalImageSync, path],
      { cwd: root, stdio: 'inherit' }
    );
    child.on('error', reject);
    child.on('exit', code => code === 0
      ? resolvePromise()
      : reject(new Error(`Image sync for ${displayPath} exited with code ${code}`)));
  });
}

function drainImageSyncQueue() {
  while (activeImageSyncs < imageSyncConcurrency && pendingImageSyncs.size > 0) {
    const path = [...pendingImageSyncs].find(candidate => !activeImageSyncPaths.has(candidate));
    if (!path) {
      return;
    }

    pendingImageSyncs.delete(path);
    activeImageSyncs += 1;
    activeImageSyncPaths.add(path);

    runIncrementalImageSync(path)
      .catch(error => console.error(`Incremental Wiki image sync failed: ${error.message}`))
      .finally(() => {
        activeImageSyncs -= 1;
        activeImageSyncPaths.delete(path);
        drainImageSyncQueue();
      });
  }
}

function scheduleIncrementalImageSync(path) {
  clearTimeout(imageSyncDebounces.get(path));
  imageSyncDebounces.set(path, setTimeout(() => {
    imageSyncDebounces.delete(path);
    pendingImageSyncs.add(path);
    drainImageSyncQueue();
  }, imageSyncDebounceMs));
}

function isWikiMarkdown(path) {
  const wikiRelativePath = relative(wikiSourceRoot, path);
  return extname(path).toLowerCase() === '.md'
    && !isAbsolute(wikiRelativePath)
    && wikiRelativePath !== '..'
    && !wikiRelativePath.startsWith(`..${sep}`);
}

const watcher = chokidar.watch(watchPaths, {
  ignoreInitial: true,
  usePolling: process.platform === 'linux',
  interval: process.platform === 'linux' ? 500 : undefined,
  ignored: path => path.includes(buildRoot)
});

watcher.on('all', (event, path) => {
  console.log(`Wiki source changed: ${path}`);

  if ((event === 'add' || event === 'change') && isWikiMarkdown(path)) {
    scheduleIncrementalImageSync(path);
  } else if (event === 'unlink' && isWikiMarkdown(path)) {
    clearTimeout(imageSyncDebounces.get(path));
    imageSyncDebounces.delete(path);
    pendingImageSyncs.delete(path);
  }

  clearTimeout(debounce);
  debounce = setTimeout(rebuild, 200);
});

function shutdown() {
  clearTimeout(debounce);
  for (const imageSyncDebounce of imageSyncDebounces.values()) {
    clearTimeout(imageSyncDebounce);
  }
  watcher.close();
  server.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
