# PFN Tools — Extraction Map

This repo is a standalone extraction of **5 PFN tools** from the `skm` codebase,
containing only the files needed to render them and nothing else.

| Tool | Route | JS bundle | Canonical |
|------|-------|-----------|-----------|
| NFL Mock Draft Simulator | `/sk-proxy/:brand/mockdraft-simulator` | `mockdraft-simulator-bundle` | profootballnetwork.com/mockdraft |
| Mock Draft Simulator (iframe widget) | `/sk-proxy/:brand/mockdraft-simulator-widget` | `mockdraft-simulator-bundle` | — |
| NFL Playoff Predictor | `/sk-proxy/:brand/playoff-predictor` | `playoff-predictor-bundle` | profootballnetwork.com/nfl-playoff-predictor |
| NFL Ultimate GM Simulator | `/sk-proxy/:brand/ultimate-simulator` | `ultimate-simulator-bundle` | profootballnetwork.com/nfl-ultimate-gm-simulator |
| FIFA World Cup Simulator | `/sk-proxy/:brand/fifa-world-cup-simulator` | `fifa-world-cup-simulator-bundle` | profootballnetwork.com/fifa-world-cup-simulator |

All handlers were copied **verbatim** from the parent `routes/sk-proxy.php`. The
only intended brand is `pfn`.

---

## How a request renders

```
index.php  (Slim 2 + Smarty 3 bootstrap)
  └─ routes/tools.php            5 handlers (verbatim from sk-proxy.php)
       ├─ helpers.php            all helper functions the handlers call
       ├─ config.php             all constants they + the templates reference
       └─ $app->render(...)
            ├─ templates/third-party/proxy/index.tpl      (main tool routes)
            │    └─ layout_fragment third-party/proxy/pfn/index.tpl → header/nav/fragments/footer
            └─ templates/pages/static/widgets/iframe/index.tpl  (widget route)
```

At **runtime the compiled JS bundles load from the CDN** (`//staticd.profootballnetwork.com/...`)
via the `*_SCRIPT_LOCATION` constants in `config.php`. The `js/fragments/*.js`
sources + `scripts/build-bundles.js` are included so the bundles can be rebuilt,
but the tools render like production without a local build.

---

## File inventory

### PHP (authored slim files — only what these 5 routes use)

| File | Contents | Extracted from |
|------|----------|----------------|
| `index.php` | Minimal Slim 2 + Smarty bootstrap (mirrors parent index.php: same template roots, the `include_once` Smarty plugin, PFN origin forced) | parent `index.php` |
| `routes/tools.php` | The 5 route handlers, verbatim | `routes/sk-proxy.php` :1450, :2137, :2300, :4352, :4409 |
| `helpers.php` | 24 helper functions (transitive closure) | see table below |
| `config.php` | Every constant referenced by handlers/helpers/templates, PFN-production values | `config.php`, `js-side-menu-config.php`, `redirect-url-and-response-filter.php` |

**Helper functions in `helpers.php`** (provenance):

| Function | Source |
|----------|--------|
| `restrictAccess`, `parseJsonFile`, `convertMDSDataToNumber`, `convertMDSDataToBool`, `mapMDSData`, `checkMDSDataisValid`, `collectConferenceTeams`, `setNFLTeamLogoPathForMDS`, `preparePFNMenuData`, `appendFaqsToPageContent`, `addPageMetadata`, `getPFNToolSubpageSlug`, `getPFNSecondaryNavigationData`, `preparePFNSecondaryNav` | `routes/sk-proxy.php` |
| `getTeamPickSequenceForMDS`, `addLogoToMDSTeams` | `routes/horizontal-pages.php` |
| `do_curl`, `get_brand_login_url`, `generateDataIntegrationAssetsPath`, `getFeaturedToolsQuickLinksWidgetForPFN`, `getStaticUrlConfig`, `generateAdPlaceholderMarkup`, `NTernary` | `functions.php` |
| `sanitize_article_contents` | `routes/article.php` |

`generateAdPlaceholderMarkup` (ad placeholders) and `NTernary` (used in
`common/widgets/index.tpl`) are called from **inside templates** via Smarty, so
they must exist at render time.

**Key constants in `config.php`** — `BUNDLE_STATIC_URL`, `STATIC_URL`,
`MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION`, `ULTIMATE_SIMULATOR_SCRIPT_LOCATION`,
`PLAYOFF_PREDICTOR_SCRIPT_LOCATION`, `FIFA_WORLD_CUP_SIMULATOR_SCRIPT_LOCATION`,
`PFN_NFL_LOGO_CACHE_BUSTER`, `CHARTBEAT_CONFIGS`, `AD_UNITS` (+ `createBidsArray`), `GA4_ID`, `LANG`,
`IS_DESKTOP/IS_MOBILE`, `FRAMEWORK_URL`, `API_ENDPOINT_DOMAIN`, GOTHAM/COOKIE_*
constants, etc. Values resolve to the **PFN production** branch (the app forces
`HTTP_PFNORIGINHEADER` in `index.php`). The request-time constants normally set
by the `redirect-url-and-response-filter.php` middleware (LANG, GA4_ID,
IS_DESKTOP, FRAMEWORK_URL, API_ENDPOINT_DOMAIN) are defined directly at the tail
of `config.php`.

### Templates — `templates/` (217 `.tpl` + data)

Full transitive `{include}` closure of the render path (main render template,
PFN layout/header/footer/nav, ads, schemas, and the four tool template trees).
Notable trees:

- `templates/third-party/proxy/` — proxy render template, PFN chrome, per-tool
  styles/meta, schemas
- `templates/nfl-draft-simulator/` — mock draft simulator UI (home, widget,
  common: players/teams/picks/multi-user/final-result/dashboard) + **data files**
- `templates/pages/static/tools/nfl/{playoff-predictor,ultimate-gm-simulator,fifa-world-cup-simulator}/` — those three tools' markup
- `templates/common/widgets/`, `templates/ads/`, `templates/pages/common/` — shared chrome pulled in transitively

Three templates are referenced **dynamically via PHP** (not static `{include}`),
found during verification and copied:
`templates/common/widgets/taxonomy/quick-links/{index,styles,js}.tpl`
(the "Featured Tools" widget from `getFeaturedToolsQuickLinksWidgetForPFN`).

### Data files (read at runtime by PHP)

| File | Read by |
|------|---------|
| `data/pfn/main-menu-data.json` | `preparePFNMenuData` |
| `templates/third-party/proxy/pfn/common/header-navigation/secondary-nav-data.json` | `preparePFNMenuData` |
| `templates/nfl-draft-simulator/common/{players,picks,teams,playerTrades}.json`, `updatedTimestamp.txt`, `simulationConstants.js` | Mock draft handlers (fallback when the remote sheet is unavailable) |
| `templates/nfl-draft-simulator/common/sk-players.json` | (present alongside the MDS data set) |
| `templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/simulationConstants.js` | included by the ultimate-sim `js.tpl` |

### JS bundle sources + build

| File | Purpose |
|------|---------|
| `js/fragments/mockdraft-simulator.js` | mockdraft + widget bundle source (self-contained, no imports) |
| `js/fragments/ultimate-simulator.js` | ultimate-sim bundle source |
| `js/fragments/playoff-predictor.js` | playoff-predictor bundle source |
| `js/fragments/fifa-world-cup-simulator.js` | fifa-world-cup-simulator bundle source |
| `scripts/build-bundles.js` | Minifies each source into `js/production/pfn-proxy/*-bundle.js` (matches the parent's `MergeIntoSingleFilePlugin` + minify transform — no module wrapper, globals preserved) |
| `package.json` | `npm run build` → the above (dep: `terser`) |

### Framework (installed, not copied)

`composer.json` + `composer.lock` pull Slim 2, Smarty 3, `slim/views`, and
`sankalp_sans/slim-goes-slimmer` (which provides `\Slim\Views\SmartyPlugin` and
the `SlimGoesSlimmer` middleware). Run `composer install`.

---

## Deliberately NOT included

- **The other ~100 routes** and thousands of unrelated functions from
  `sk-proxy.php` / `functions.php` / `config.php`.
- **Compiled JS bundles & all images/fonts/logos** — there is no local `assets/`
  dir in the parent; every `/skm/assets/...` path and the compiled bundles are
  served from the CDN (`//staticd.profootballnetwork.com`). They load at runtime
  unchanged.
- **Remote data/APIs used at runtime** (unchanged from parent):
  - `statics.sportskeeda.com/assets/sheets/tools/mockdraft-simulator/mockdraftSimulatorData.json` (live MDS data; local JSONs are the fallback)
  - `statics.sportskeeda.com/assets/sheets/nav-data/navData.json` (secondary nav)
  - `API_ENDPOINT_DOMAIN/v1/taxonomy/<slug>` (page SEO metadata)
  - `generateDataIntegrationAssetsPath(...)` asset paths (playoff/ultimate/fifa data)
- The `redirect-url-and-response-filter.php` middleware (main-site redirect
  logic) — its request-time constants are reproduced directly in `config.php`.

## Runtime notes

- **PHP 7.x** — the parent runs on PHP 7 (Smarty 3.1.48 supports PHP 5.2/7.0
  only). Verified on PHP 7.4. On PHP 8 Smarty 3.1.48 throws; `index.php` includes
  a `get_magic_quotes_gpc()` polyfill but PHP 7 is the supported runtime.
- Handlers are guarded by `restrictAccess()`. `index.php` forces
  `HTTP_PFNORIGINHEADER` (this is a PFN-only repo), so routes are reachable
  directly; behind the real proxy the header is supplied the same way.
