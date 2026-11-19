import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const headerPath = resolve(import.meta.dirname, 'header.html');
const footerPath = resolve(import.meta.dirname, 'footer.html');

export default defineConfig({
  appType: 'mpa',
  base: './',
  plugins: [{
    name: 'starship-layout',
    // Insert the editable HTML partials into both pages.
    async transformIndexHtml(html) {
      const [header, footer] = await Promise.all([
        readFile(headerPath, 'utf8'),
        readFile(footerPath, 'utf8'),
      ]);
      return html.replace('<!-- site-header -->', () => header)
        .replace('<!-- site-footer -->', () => footer);
    },
    // Reload both pages when a shared partial changes in development.
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
        engineering: resolve(import.meta.dirname, 'engineering.html'),
      },
    },
  },
});
