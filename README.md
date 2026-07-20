# pfn-skm

Standalone extraction of 5 PFN tools from the `skm` codebase:

- **NFL Mock Draft Simulator** — `/sk-proxy/pfn/mockdraft-simulator`
- **Mock Draft Simulator widget** — `/sk-proxy/pfn/mockdraft-simulator-widget`
- **NFL Playoff Predictor** — `/sk-proxy/pfn/playoff-predictor`
- **NFL Ultimate GM Simulator** — `/sk-proxy/pfn/ultimate-simulator`
- **FIFA World Cup Simulator** — `/sk-proxy/pfn/fifa-world-cup-simulator`

Slim 2 + Smarty 3 app. It renders identically to the parent site; the compiled
JS bundles and all images/fonts load from the same CDN at runtime. See
[`EXTRACTION-MAP.md`](EXTRACTION-MAP.md) for the full file provenance.

## Requirements

- **PHP 7.x** (the parent runtime; Smarty 3.1.48 does not support PHP 8)
- Composer
- Node.js (only to rebuild the JS bundles)

## Run

```bash
composer install          # installs Slim 2, Smarty 3, slim-goes-slimmer
php -S 127.0.0.1:8080 index.php
```

Then open, e.g.:

```
http://127.0.0.1:8080/sk-proxy/pfn/mockdraft-simulator
http://127.0.0.1:8080/sk-proxy/pfn/playoff-predictor
http://127.0.0.1:8080/sk-proxy/pfn/ultimate-simulator
http://127.0.0.1:8080/sk-proxy/pfn/mockdraft-simulator-widget
```

> If PHP 8 is your only option, `composer install --ignore-platform-reqs` will
> install, but Smarty 3.1.48 throws on PHP 8 — use PHP 7.x to match production.

## Rebuild the JS bundles (optional)

The app loads the bundles from the CDN, so this is only needed if you change a
`js/fragments/*.js` source.

```bash
npm install
npm run build      # -> js/production/pfn-proxy/*-bundle.js
```

After building, point the `*_SCRIPT_LOCATION` constants in `config.php` at your
new files (or deploy them to the CDN under the same paths).

## Layout

```
index.php            Slim + Smarty bootstrap
routes/tools.php     the 5 route handlers (verbatim)
helpers.php          helper functions the handlers/templates use
config.php           constants (PFN production values)
templates/           full transitive Smarty template closure + data files
data/pfn/            PFN menu data
js/fragments/        the 4 bundle sources
scripts/build-bundles.js   minifies sources into js/production/pfn-proxy/
```
