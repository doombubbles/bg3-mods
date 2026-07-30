import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { buildWiki, root } from './wiki-build.mjs';
import previewConfig from './vite.config.mjs';

const wikiRoot = join(root, 'Wiki');
const outputRoot = join(root, 'output');
const usage = 'Usage: npm --prefix scripts/wiki-preview run wiki:pdf -- Wiki/Page-Name.md';

function resolveWikiPage(argument) {
  let sourcePath = isAbsolute(argument) ? resolve(argument) : resolve(root, argument);
  const rootRelativePath = relative(wikiRoot, sourcePath);
  const rootCandidateIsOutsideWiki = rootRelativePath === '..'
    || rootRelativePath.startsWith(`..${sep}`)
    || isAbsolute(rootRelativePath);
  if (rootCandidateIsOutsideWiki && !isAbsolute(argument)) {
    sourcePath = resolve(wikiRoot, argument);
  }

  const relativePath = relative(wikiRoot, sourcePath);
  const outsideWiki = relativePath === '..'
    || relativePath.startsWith(`..${sep}`)
    || isAbsolute(relativePath);

  if (outsideWiki) {
    throw new Error(`Wiki page must be beneath ${wikiRoot}.`);
  }
  if (!relativePath.toLowerCase().endsWith('.md')) {
    throw new Error('Wiki page must have a .md extension.');
  }
  if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
    throw new Error(`Wiki page does not exist: ${sourcePath}`);
  }

  return { relativePath, sourcePath };
}

async function generatePdf(argument) {
  const { relativePath, sourcePath } = resolveWikiPage(argument);
  const route = relativePath.slice(0, -3).split(sep).join('/');
  const encodedRoute = route.split('/').map(encodeURIComponent).join('/');
  const outputPath = join(outputRoot, relativePath.slice(0, -3) + '.pdf');

  await buildWiki();

  const server = await createServer({
    ...previewConfig,
    configFile: false,
    server: {
      ...previewConfig.server,
      host: '127.0.0.1',
      port: 0,
      strictPort: false,
      open: false
    }
  });

  let browser;
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === 'string') {
      throw new Error('Could not determine the Wiki preview server address.');
    }

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(30_000);

    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('requestfailed', request => {
      const url = request.url();
      if (url.startsWith(`http://127.0.0.1:${address.port}/`)) {
        pageErrors.push(`${request.failure()?.errorText || 'Request failed'}: ${url}`);
      }
    });

    await page.goto(`http://127.0.0.1:${address.port}/#/${encodedRoute}`);
    await page.waitForFunction(() => {
      const state = document.documentElement.dataset.wikiRenderState;
      return state === 'ready' || state === 'error';
    });

    const renderResult = await page.evaluate(() => ({
      state: document.documentElement.dataset.wikiRenderState,
      error: document.documentElement.dataset.wikiRenderError
    }));
    if (renderResult.state !== 'ready') {
      throw new Error(renderResult.error || `Could not render ${relativePath}.`);
    }
    if (pageErrors.length > 0) {
      throw new Error(`Browser errors while rendering ${relativePath}:\n${pageErrors.join('\n')}`);
    }

    mkdirSync(dirname(outputPath), { recursive: true });
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true
    });

    console.log(`Created ${relative(root, outputPath)} from ${relative(root, sourcePath)}.`);
  } finally {
    await browser?.close();
    await server.close();
  }
}

const argumentsList = process.argv.slice(2);
if (argumentsList.length === 1 && ['--help', '-h'].includes(argumentsList[0])) {
  console.log(usage);
} else if (argumentsList.length !== 1) {
  console.error('Expected exactly one Wiki Markdown page.');
  console.error(usage);
  process.exitCode = 1;
} else {
  try {
    await generatePdf(argumentsList[0]);
  } catch (error) {
    console.error(error.message);
    console.error(usage);
    process.exitCode = 1;
  }
}
