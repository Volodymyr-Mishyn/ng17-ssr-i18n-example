import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import bootstrap from './src/main.server';
import { LOCALE_ID } from '@angular/core';

// The Express app is exported so that it can be used by serverless Functions.
export function app(locale: string): express.Express {
  console.log('LOCALE_ID', locale);
  const server = express();
  const serverDistFolder = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../',
    locale
  );
  const browserDistFolder = resolve(serverDistFolder, '../../browser/', locale);
  const indexHtml = join(serverDistFolder, 'index.server.html');
  // console.log('serverDistFolder', serverDistFolder);
  // console.log('browserDistFolder', browserDistFolder);
  console.log('indexHtml', indexHtml);
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder + '/');
  // Serve static files from /browser
  server.get(
    `*.*`,
    express.static(browserDistFolder + '/', {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  server.get(`*`, (req, res, next) => {
    const { protocol, originalUrl, headers, baseUrl } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder + '/',
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: LOCALE_ID, useValue: locale },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = express();
  server.get('/', (req, res) => {
    const { headers, protocol } = req;
    res.redirect(`${protocol}://${headers.host}/en`);
  });
  server.use('/en', app('en-US'));
  server.use('/uk', app('uk'));
  server.get('*', (req, res) => {
    const { headers, protocol } = req;
    res.redirect(`${protocol}://${headers.host}/en`);
  });

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
