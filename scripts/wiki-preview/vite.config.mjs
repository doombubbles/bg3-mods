import { defineConfig } from 'vite';
import { createReadStream, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const previewRoot = dirname(fileURLToPath(import.meta.url));
const wikiPublicRoot = resolve(previewRoot, '..', '..', 'build', 'Wiki');
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp']
]);

function dynamicWikiPublicFiles() {
  return {
    name: 'dynamic-wiki-public-files',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url || !['GET', 'HEAD'].includes(request.method)) {
          next();
          return;
        }

        let pathname;
        try {
          pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        } catch {
          next();
          return;
        }

        const filePath = resolve(wikiPublicRoot, `.${pathname}`);
        const relativePath = relative(wikiPublicRoot, filePath);
        const outsidePublicRoot = relativePath === '..'
          || relativePath.startsWith(`..${sep}`)
          || isAbsolute(relativePath);
        if (outsidePublicRoot) {
          next();
          return;
        }

        let stats;
        try {
          stats = statSync(filePath);
        } catch {
          next();
          return;
        }
        if (!stats.isFile()) {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Content-Length', stats.size);
        response.setHeader('Content-Type', contentTypes.get(extname(filePath).toLowerCase())
          ?? 'application/octet-stream');
        if (request.method === 'HEAD') {
          response.end();
          return;
        }

        createReadStream(filePath)
          .on('error', next)
          .pipe(response);
      });
    }
  };
}

export default defineConfig({
  root: previewRoot,
  publicDir: wikiPublicRoot,
  plugins: [dynamicWikiPublicFiles()],
  server: {
    port: Number(process.env.PORT ?? 3003),
    strictPort: true,
    open: false,
    watch: {
      // ProcessTemplates replaces build/Wiki and repopulates every image on each
      // build. The preview controller sends one full reload after that finishes.
      ignored: path => path === wikiPublicRoot || path.startsWith(`${wikiPublicRoot}${sep}`)
    }
  }
});
