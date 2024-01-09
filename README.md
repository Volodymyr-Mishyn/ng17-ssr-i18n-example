# Ng17-Ssr-I18n-Example

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

## About

This app was created for example purposes for anyone seeking how to make Angular built-in i18n and SSR work together simultaneously in production and dev environment.

Kudos to [Lostium team](https://lostium.com/en/) for providing guidance and answering my questions. Their [example](https://github.com/lostium/ssr-i18n-angular17) is a robust approach everyone should consider as first option.

Nevertheless, I came up with more clunky and basic solution with some minor disadvantages.

## Installation and running

```txt
 $ git clone https://github.com/Volodymyr-Mishyn/ng17-ssr-i18n-example.git
 $ cd ng17-ssr-i18n-example
 $ npm install
```

To run dev server for English version

```txt
 $ npm run start
```

To run dev server for Ukrainian version

```txt
 $ npm run start:uk
```

To run production server of Express with both locales

```txt
 $ npm run build
 $ npm run serve:ssr:ng17-ssr-i18n-example
```

## Implementation details

To make your application work with ssr and i18n you'll have to make steps close to following

### SSR basic setup

Creating server side rendering applications

```txt
 $ ng new --ssr
```

To add SSR to an existing project

```txt
 $ ng add @angular/ssr
```

Angular creates [server.ts](server.ts) file with Express.js for Server-Side Rendering (SSR)
We will need to modify this file later, depending on our locales.

### Localizing your application

All information about preparing your application for i18n, extracting strings for localization, and working with locale files is present on [Angular i18n](https://angular.dev/guide/i18n).

#### Localization files

After preparing your files you'll have something like

[messages.xlf](./src/locale/messages.xlf),
messages.{your-locale}.xlf,
[messages.uk.xlf](./src/locale/messages.uk.xlf),

#### Modifying angular.json and preparing dev environment

Configure i18n in your [angular.json](angular.json)
Provide your base locale and other locales you prepared

```json
"i18n": {
    "sourceLocale": {
        "code": "en-US",
        "baseHref": "/en/"
    },
    "locales": {
        "uk": {
            "translation": "src/locale/messages.uk.xlf",
        },
    }
},
```

Setup localization during build time

```json
 "architect": {
        "build": {
          "options": {
            "localize": true,
          }
        }
 }
```

Setup additional dev configuration for languages you want to serve with dev server

```json
  "configurations": {
            "development-uk": {
              "localize": ["uk"],
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
  }
```

```json
"serve": {
      "builder": "@angular-devkit/build-angular:dev-server",
      "configurations": {
        "production": {
          "buildTarget": "ng17-ssr-i18n-example:build:production"
        },
        "development": {
          "buildTarget": "ng17-ssr-i18n-example:build:development"
        },
        "development-uk": {
          "buildTarget": "ng17-ssr-i18n-example:build:development-uk"
        }
      },
      "defaultConfiguration": "development"
}
```

Add script to run your preferred languages to your [package.json](package.json) for quality of life improvement:)

```json
 "scripts": {
    "start": "ng serve",
    "start:uk": "ng serve --configuration=development-uk",
  },
```

### Making localized application work with SSR

When Angular scaffolds ssr for your application it creates [server.ts](server.ts).
But after adding localization your `dist` folder will have another structure

- browser/
  - en-US/
  - uk/
- server/
  - en-US/
  - uk/
- 3rdpartylicenses.txt
- prerendered-routes.json

but the [server.ts](server.ts) is generated without respecting this locales nested structure. So we have to make changes to it

1. Modify app method to have locale parameter

```js
export function app(locale: string): express.Express {
  /**/
}
```

2. Use that parameter to build paths respecting locale

```js
const serverDistFolder = resolve(dirname(fileURLToPath(import.meta.url)), "../", locale);
const browserDistFolder = resolve(serverDistFolder, "../../browser/", locale);
const indexHtml = join(serverDistFolder, "index.server.html");
```

3. Configure server with this paths

```js
server.set("view engine", "html");
server.set("views", browserDistFolder + "/");
// Serve static files from /browser
server.get(
  `*.*`,
  express.static(browserDistFolder + "/", {
    maxAge: "1y",
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
      publicPath: browserDistFolder + "/",
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        //provide locale to the app
        { provide: LOCALE_ID, useValue: locale },
      ],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});
```

4. Create instance of Express server for every locale and set it to be responsible for your route

```js
server.use("/en", app("en-US"));
server.use("/uk", app("uk"));
server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
```

5. (Optional) Add redirects

```js
server.get("/", (req, res) => {
  const { headers, protocol } = req;
  res.redirect(`${protocol}://${headers.host}/en`);
});
server.get("*", (req, res) => {
  const { headers, protocol } = req;
  res.redirect(`${protocol}://${headers.host}/en`);
});
```

_Important note_ : Your basehref-s should be the same in your built index.html files and in Express server setup
`/en/` and `/en`,
`/uk/` and `/uk`

### Running express server in production mode

When angular builds your application each locale folder has it's own server file.
The interesting part, those files don't differ for locales, they are the same.
So you can run

```txt
 $ npm run build
 $ node dist/ng17-ssr-i18n-example/server/en-US/server.mjs
 or
 $ node dist/ng17-ssr-i18n-example/server/{your-locale}/server.mjs
```

and it would lead to same result - same express server with all your configured locales will run.
Congratulations!
