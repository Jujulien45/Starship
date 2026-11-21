import { readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { defineConfig } from 'vite';

const headerPath = resolve(import.meta.dirname, 'header.html');
const footerPath = resolve(import.meta.dirname, 'footer.html');

export default defineConfig({
  appType: 'mpa',
  base: './',
  plugins: [{
    name: 'starship-layout',
    // Insert the editable HTML partials into each page.
    transformIndexHtml: {
      order: 'pre',
      async handler(html, { filename }) {
        const [header, footer] = await Promise.all([
          readFile(headerPath, 'utf8'),
          readFile(footerPath, 'utf8'),
        ]);
        const prefix = relative(dirname(filename), import.meta.dirname) || '.';
        const navigation = header.replaceAll('href="/', `href="${prefix}/`);
        return html.replace('<!-- site-header -->', () => navigation)
          .replace('<!-- site-footer -->', () => footer);
      },
    },
    // Reload pages when a shared partial changes in development.
    handleHotUpdate({ file, server }) {
      if (file === headerPath || file === footerPath) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  }],
  build: {
    rolldownOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        tech: resolve(import.meta.dirname, 'tech.html'),
        telemetry: resolve(import.meta.dirname, 'telemetry/index.html'),
      },
    },
  },
});
