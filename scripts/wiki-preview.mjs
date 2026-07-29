import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import chokidar from 'chokidar';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildRoot = join(root, 'build', 'Wiki');
const processTemplates = join(root, 'bin', 'ProcessTemplates.exe');
const viteCli = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const viteConfig = join(root, 'scripts', 'wiki-preview', 'vite.config.mjs');

const processTemplateArgs = [
  '-s', 'Wiki',
  '-d', 'build/Wiki',
  '-v', 'DoombubblesTweaks',
  '-v', 'build/DoombubblesTweaks/Localization',
  '-v', 'WoWDeathKnight',
  '-v', 'build/WoWDeathKnight/Localization',
  '-v', 'WoWSubclasses',
  '-v', 'build/WoWSubclasses/Localization'
];

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0
      ? resolvePromise()
      : reject(new Error(`${command} exited with code ${code}`)));
  });
}

async function build() {
  await run(processTemplates, processTemplateArgs);
  console.log('Wiki Markdown updated.');
}

if (!existsSync(processTemplates)) {
  throw new Error(`Missing ${processTemplates}; build ProcessTemplates before starting the preview.`);
}

if (!existsSync(viteCli)) {
  throw new Error('Preview dependencies are missing. Run npm install first.');
}

if (process.argv.includes('--build')) {
  await build();
  process.exit(0);
}

await build();

const server = spawn(process.execPath, [viteCli, '--config', viteConfig], {
  cwd: root,
  stdio: 'inherit'
});

let building = false;
let rebuildQueued = false;
let debounce;
const watchPaths = [
  join(root, 'Wiki'),
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
    await build();
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

const watcher = chokidar.watch(watchPaths, {
  ignoreInitial: true,
  ignored: path => path.includes(`${join(root, 'build', 'Wiki')}`)
});

watcher.on('all', (_event, path) => {
  console.log(`Wiki source changed: ${path}`);
  clearTimeout(debounce);
  debounce = setTimeout(rebuild, 200);
});

function shutdown() {
  watcher.close();
  server.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
