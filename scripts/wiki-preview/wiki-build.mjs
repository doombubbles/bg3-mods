import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const buildRoot = join(root, 'build', 'Wiki');

const processTemplatesName = process.platform === 'win32'
  ? 'ProcessTemplates.exe'
  : 'ProcessTemplates';
const processTemplates = join(root, 'bin', processTemplatesName);
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

export async function buildWiki({ incremental = false } = {}) {
  if (!existsSync(processTemplates)) {
    throw new Error(
      `Missing ${processTemplates}; build ProcessTemplates for ${process.platform} before building the Wiki.`
    );
  }

  const args = incremental
    ? [...processTemplateArgs, '--incremental']
    : processTemplateArgs;
  await run(processTemplates, args);
  console.log('Wiki Markdown updated.');
}
