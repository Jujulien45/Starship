import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import express from 'express';

const app = express();
const root = import.meta.dirname;
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);

app.enable('strict routing');
app.disable('x-powered-by');
app.use('/assets', express.static(resolve(root, 'assets')));

const publicFiles = [
  'styles.css',
  'site.js',
  'telemetry/telemetry.css',
  'telemetry/telemetry.js',
  'telemetry/sample-flight.csv',
];

for (const file of publicFiles) {
  app.get('/' + file, (_request, response) => response.sendFile(resolve(root, file)));
}

function servePage(routes, file) {
  app.get(routes, async (_request, response) => {
    const [page, header, footer] = await Promise.all(
      [file, 'header.html', 'footer.html'].map(part => readFile(resolve(root, part), 'utf8')),
    );
    response.type('html').send(
      page.replace('<!-- site-header -->', () => header)
        .replace('<!-- site-footer -->', () => footer),
    );
  });
}

servePage(['/', '/index.html'], 'index.html');
servePage('/tech.html', 'tech.html');
servePage(['/telemetry/', '/telemetry/index.html'], 'telemetry/index.html');
app.get('/telemetry', (_request, response) => response.redirect('/telemetry/'));

app.listen(port, host, () => {
  console.log(`Starship listening on http://${host}:${port}`);
});
