import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const previewRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: previewRoot,
  publicDir: resolve(previewRoot, '..', '..', 'build', 'Wiki'),
  server: {
    port: 3000,
    strictPort: true,
    open: false
  }
});
