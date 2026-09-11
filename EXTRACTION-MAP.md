# PFN Tools — Extraction Map

This repo is a standalone extraction of **9 PFN tools** from the `skm` codebase,
containing only the files needed to render them and nothing else.

| Tool | Route | JS bundle | Canonical |
|------|-------|-----------|-----------|
| NFL Mock Draft Simulator | `/sk-proxy/:brand/mockdraft-simulator` | `mockdraft-simulator-bundle` | profootballnetwork.com/mockdraft |
| Mock Draft Simulator (iframe widget) | `/sk-proxy/:brand/mockdraft-simulator-widget` | `mockdraft-simulator-bundle` | — |
| NFL Playoff Predictor | `/sk-proxy/:brand/playoff-predictor` | `playoff-predictor-bundle` | profootballnetwork.com/nfl-playoff-predictor |
| NFL Ultimate GM Simulator | `/sk-proxy/:brand/ultimate-simulator` | `ultimate-simulator-bundle` | profootballnetwork.com/nfl-ultimate-gm-simulator |
| FIFA World Cup Simulator | `/sk-proxy/:brand/fifa-world-cup-simulator` | `fifa-world-cup-simulator-bundle` | profootballnetwork.com/fifa-world-cup-simulator |
| NFL Offseason Manager (free agency) | `/sk-proxy/:brand/free-agency-simulator` | `free-agency-simulator-bundle` | profootballnetwork.com/nfl-offseason-salary-cap-free-agency-manager |
| Tennis Simulator (US Open) | `/sk-proxy/:brand/tennis-simulator` | `tennis-simulator-bundle` | profootballnetwork.com/tennis-simulator |
| NASCAR Season Predictor | `/sk-proxy/:brand/nascar-predictor` | `nascar-predictor-bundle` | profootballnetwork.com/nascar-predictor |
| NFL DFS Lineup Optimizer | `/sk-proxy/:brand/lineup-optimizer` | — (inline `js.tpl`) | profootballnetwork.com/nfl-dfs-optimizer-lineup-generator |

Plus the **login page** the Mock Draft Simulator sends unauthenticated users to:

| Page | Route | Canonical |
|------|-------|-----------|
| PFN login / register | `/sk-proxy/:brand/login` | profootballnetwork.com/login |

All handlers were copied **verbatim** from the parent `routes/sk-proxy.php` (the
login handler with one documented deviation, see below). The only intended brand
is `pfn`.

---

## How a request renders

```
index.php  (Slim 2 + Smarty 3 bootstrap)
  └─ routes/tools.php            9 handlers + login (verbatim from sk-proxy.php)
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

### PHP (authored slim files — only what these routes use)

| File | Contents | Extracted from |
|------|----------|----------------|
| `index.php` | Minimal Slim 2 + Smarty bootstrap (mirrors parent index.php: same template roots, the `include_once` Smarty plugin, PFN origin forced) | parent `index.php` |
| `routes/tools.php` | The 9 tool handlers + the login handler, verbatim | `routes/sk-proxy.php` :71, :1450, :1697, :2137, :2300, :2405, :4352, :4409, :4602, :4648 |
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
`FREE_AGENCY_SIMULATOR_SCRIPT_LOCATION`, `TENNIS_SIMULATOR_SCRIPT_LOCATION`,
`NASCAR_PREDICTOR_SCRIPT_LOCATION`,
`PFN_NFL_LOGO_CACHE_BUSTER`, `CHARTBEAT_CONFIGS`, `AD_UNITS` (+ `createBidsArray`), `GA4_ID`, `LANG`,
`IS_DESKTOP/IS_MOBILE`, `FRAMEWORK_URL`, `API_ENDPOINT_DOMAIN`, GOTHAM/COOKIE_*
constants, etc. Values resolve to the **PFN production** branch (the app forces
`HTTP_PFNORIGINHEADER` in `index.php`). The request-time constants normally set
by the `redirect-url-and-response-filter.php` middleware (LANG, GA4_ID,
FRAMEWORK_URL, API_ENDPOINT_DOMAIN) are defined directly at the tail
of `config.php`.

`IS_MOBILE`/`IS_DESKTOP` are the exception: they are computed per request. The
parent app flips `$app->is_desktop` in that middleware from the `DEVICE_TYPE`
fastcgi param nginx derives from the incoming `CloudFront-Is-Mobile-Viewer`
header; this repo has no such middleware and runs on Apache, so `isMobileViewer()`
(`helpers.php`) reads that header off `$_SERVER` directly. `index.php` sets
`$app->is_mobile`/`$app->is_desktop` from it before `require 'config.php'`, and
the two constants follow. The Cloudflare worker fronting this origin sends the
header as the literal string `"true"`/`"false"` (true for phone *and* tablet), so
the check is `=== 'true'`, not `!empty()`.

`API_ENDPOINT_DOMAIN` is **not defined in this repo**. `addPageMetadata()`
(`helpers.php:396`) references it, so the taxonomy call fails and the helper
returns early — it supplies no `seo_title`, `meta_description`, `page_text_content`
or `header_text`. That last one matters: `third-party/proxy/pfn/index.tpl` gates
both the `<h1>` header-wrapper **and** the `desktop-tools-top-adv-container`
(Raptive 90px header ad) on `isset($header_text)`, so any route that neither
hardcodes `header_text` nor uses the `show_sidebar_nav` layout branch renders
without a page header. **No route in this repo calls `addPageMetadata()`** — every
tool page sets its metadata inline instead (see below), so `helpers.php`'s copy of
the function is retained only as the documented reference for what those inline
values mirror.

## Login

`/sk-proxy/pfn/login` is the target of `get_brand_login_url()` (`helpers.php`),
which the mock draft simulator passes to its templates as `login_url`; the
dashboard's Login button navigates there with `?after-login=<page you came from>`.

Sign-in is entirely client side, in
`templates/third-party/proxy/pfn/common/login/`:

| File | Role |
|------|------|
| `index.tpl` | The three boxes (sign in / register / forgot password) + the Google button, and the `after-login` redirect |
| `firebaseManager.tpl` | `PFNLoginManagerInstance` — loads Firebase 8.10 from gstatic, does email/password + Google popup auth, then POSTs the Firebase ID token to `GOTHAM_URL_PFN_FRONTEND/pfn/auth` |
| `styles.tpl` | PFN blue overrides |

Gotham's `/pfn/auth` response sets the session cookies; the tools then read
`fw_ID` through `getCurrentUserID()` in `templates/third-party/proxy/js.tpl`.
The base CSS comes from `templates/{desktop,mobile}/fragments/login-css.tpl`
(copied from the parent), and the JS helpers it calls (`$`, `addClass`,
`loadScriptAsync`, `pureJSAjaxPost`, `getCurrentUserID`) already exist in
`third-party/proxy/js.tpl`; `trackGAEvent` comes from the `gtag-script.tpl`
fragment the route includes.

Two constants were added to `config.php` for it: `MOBILE_LOGIN_FIREBASE_PFN`
(public Firebase web config, verbatim from the parent) and
`GOTHAM_URL_PFN_FRONTEND`. The latter was **missing from this repo entirely**
even though the MDS dashboard/logout, the feedback CTA and the playoff-predictor
submission templates all reference it — it rendered as an empty string, so those
calls hit relative URLs. It is defined here as
`https://gotham-bigscoots.profootballnetwork.com` to match the BigScoots
`GOTHAM_URL`/`GOTHAM_CF_URL` above it; the parent uses
`https://gotham.profootballnetwork.com`.

The **one deviation** in the login handler: the parent also passes
`"google_login_url" => get_google_login_url()`, which builds a Google OAuth
redirect back to `FRAMEWORK_URL_HOST/login/google-auth-digest` — the Sportskeeda
login framework. **PFN does not use that flow.** Its Google button goes through
the Firebase popup and ends at the same `POST /pfn/auth` as the email/password
path; `pfn-gotham/app/pfn/router.go` exposes only `/auth`, `/logout` and the MDS
dashboard routes, no OAuth callback. The template never reads
`google_login_url`, so the key, the `get_google_login_url()` /
`get_google_digest_url()` helpers, `FRAMEWORK_URL_HOST` and the `GOOGLE_CLIENT_ID`
secret are all omitted here — this repo needs no secrets file.

## Hardcoded page metadata

The other **deliberate deviation** from the parent: the four tool routes that
called `addPageMetadata()` now set `header_text` / `seo_title` /
`meta_description` / `seo_robots_tag` / `page_text_content` / `faq` /
`allow_site_scaling` / `setHtmlLangAttribute` / `schemas` inline, so they render
with no dependency on the VPC-internal taxonomy API. The values were fetched once
from `/v1/taxonomy/<slug>` on the date below and must be edited by hand when the
CMS entry changes:

| Route | CMS entry (`getPFNToolSubpageSlug`) | FAQs | Fetched |
|-------|-------------------------------------|------|---------|
| `playoff-predictor` | `c6e9b54f-008a-42b8-b5b1-0e70d8efd572` — "Playoff Predictor" | none as fetched; 5 added 2026-09-11 (see below) | 2026-08-05 |
| `ultimate-simulator` | `b2c4d786-00f8-4dfc-9bef-fb27a1c3b6e1` — "NFL Ultimate GM Simulator" | 6 | 2026-08-05 |
| `fifa-world-cup-simulator` | `ad168211-5952-4e25-bad3-b46e8a1b93b3` — "FIFA World Cup Simulator" | none | 2026-08-05 |
| `free-agency-simulator` | `bcbe7791-2f06-4d66-9673-4a1467412bae` — "NFL Offseason Manager" | 6 | 2026-08-06 |
| `tennis-simulator` | `21b84d24-18bd-42bf-bab3-636541adb628` — "Tennis Predictor - US Open" | none | 2026-09-08 |
| `nascar-predictor` | `c977eba7-c752-4fbb-b717-caf17a5c013a` — "NASCAR Season Predictor 2026" | none | 2026-09-08 |
| `lineup-optimizer` | `f4b7ee33-7a8a-49f7-a88d-dcc2efea7a95` — "NFL DFS Optimizer" | 5 | 2026-09-08 |

`page_text_content` is the entry's `data_subpage_info` after
`sanitize_article_contents($c, false)`, with the FAQs appended by
`appendFaqsToPageContent()` under the entry's `faq_section_title` — i.e. exactly
what `addPageMetadata()` would have assembled. The one difference: the helper
strips every `\n`, while the hardcoded blocks keep the line breaks between tags
for source readability (insignificant whitespace between block-level elements).

`tennis-simulator`'s CMS entry has an empty `data_subpage_info` and no FAQs, so
it sets no `page_text_content` / `faq` at all. `nascar-predictor` has page copy
but no FAQs.

`ultimate-simulator`, `free-agency-simulator` and `lineup-optimizer` also gain
`templates/common/faq/faq-schema.tpl` in their `head_fragments` —
`addPageMetadata()` appended that fragment whenever the entry had FAQs, but in
both parent handlers the very next line reassigns `head_fragments` wholesale and
drops it, so the parent never actually emits the `FAQPage` JSON-LD. Adding it
here is a deliberate fix, not a verbatim copy. `playoff-predictor` already listed
it in the parent, and with an empty `faq` it emits an empty `FAQPage`, same as
before.

`free-agency-simulator` keeps the parent's `'slug' => 'ree-agency-simulator'`
typo verbatim; on this page `slug` only feeds an equality check in
`templates/ads/video-players/vidazoo.tpl`, so "fixing" it would be a behavior
change for no gain.

`mockdraft-simulator` is untouched: the parent never called `addPageMetadata()`
for it, so its metadata was already inline. `mockdraft-simulator-widget` is
excluded by design — it is a `NOINDEX` iframe with no SEO metadata or schemas.

### `playoff-predictor` FAQ + schema additions (2026-09-11, owner-approved divergence)

Unlike the other four hardcoded-metadata routes above, `playoff-predictor`'s CMS
snapshot genuinely had no FAQs, so the parent behaviour it inherited was an empty
`faq` array feeding `templates/common/faq/faq-schema.tpl` into an empty
`FAQPage.mainEntity` — sitting directly above five real H2 FAQ headings already
present in `page_text_content`. The owner approved closing that gap and adding
tool-type schema the page never had:

- `routes/tools.php`'s `playoff-predictor` block now populates `faq` with those
  five existing headings, paired with the prose already under each one in
  `page_text_content`, copied verbatim (trimmed only — no new sentences, no
  rewording, no fact-checking of the dates/Super Bowl number/playoff format
  already there). The shape mirrors the only other populated `faq` array in this
  file, `ultimate-simulator`'s (`routes/tools.php`, `$template_data["faq"]` block
  starting ~line 602): array of `{question, answer (nowdoc HTML), url}`.
- One new schema template, a new file with no parent counterpart, added to
  `playoff-predictor`'s `schemas` array only (not to any other route):
  - `templates/third-party/proxy/pfn/common/schemas/breadcrumbList.tpl` — reads a
    new `$template_data["breadcrumb_items"]` set inline in the route
    (`[{name: "Home", url: "https://www.profootballnetwork.com/"}, {name: "NFL
    Playoff Predictor", url: canonical_url}]`). Kept to two nodes deliberately:
    neither `preparePFNMenuData`'s `"Tools"` category nor
    `preparePFNSecondaryNav`'s `"Football"` category resolves to a real hub URL
    anywhere in this codebase (`"Tools"` in `secondary-nav-data.json` is a flyout
    list of sibling tools, not a landing page; `"Football"` is a grey-bar grouping
    label from the remote `navData.json` sheet with no URL of its own), so no
    intermediate crumb URL was guessed. The whole `<script>` block is guarded
    with `{if !empty($breadcrumb_items)}` so a future route that includes this
    template but forgets to set `breadcrumb_items` gets nothing rather than a
    hollow `"itemListElement": []` — the same empty-schema defect this whole
    change exists to remove.
  - `webApplication.tpl` was drafted for this route and deliberately **not**
    shipped: Google's SoftwareApplication/WebApplication structured-data spec
    requires `aggregateRating` or `review` alongside `name`/`offers.price`, and
    this page has no legitimate rating or review data to populate it with
    (fabricating one is a Google policy violation and was explicitly ruled out
    by the owner). Shipping it anyway would fail Rich Results validation and
    open a permanent Search Console error on the site's highest-traffic tool
    page, with no possible rich-result upside. Do not re-add a WebApplication/
    SoftwareApplication schema to this route without also sourcing real
    `aggregateRating`/`review` data.
- Escaping: `faq-schema.tpl` already runs `question`/`answer` through
  `strip_tags:true|strip|trim|escape:'htmlall'|replace:'\\':'\\\\'` — untouched,
  and this addition relies on it rather than pre-escaping in PHP. Also fixed in
  the same pass: `faq-schema.tpl`'s `{$title}` (the FAQPage `headline`) was never
  assigned by any route, so it silently rendered `""`; harmless while `mainEntity`
  was empty, but not once `faq` is populated. `routes/tools.php`'s
  `playoff-predictor` block now sets `$template_data["title"] = $template_data["seo_title"]`
  locally (not in `faq-schema.tpl` itself, which is shared by `ultimate-simulator`,
  `free-agency-simulator` and others).
  The new `breadcrumbList.tpl` template interpolates `{$breadcrumb_items}`
  **unescaped**. Checked against the
  actual sibling files in `templates/third-party/proxy/pfn/common/schemas/`
  before writing this:
  - `website.tpl` interpolates no variables at all — it is not a precedent for
    anything.
  - `newsMediaOrganization.tpl` interpolates only `{$smarty.const.STATIC_URL}`,
    a config constant, not request- or feed-derived — also not a precedent.
  - `webpage.tpl` is the only genuine precedent: it interpolates `{$seo_title}`,
    `{$meta_description}`, `{$meta_keywords}`, `{$canonical_url}` and
    `{$updated_timestamp}` unescaped.
  That's a pre-existing, unaddressed gap in this repo (Rule 4), not something
  this change introduces; the new templates deliberately match it because every
  input it interpolates is a compile-time PHP array literal hardcoded in the
  `playoff-predictor` route, not request-, cookie-, or feed-derived.
  It is not fully dormant, though: of `webpage.tpl`'s five unescaped variables,
  two — `seo_title` and `meta_description` — are also assigned from a **remote**
  CMS JSON response by `addPageMetadata()` (`helpers.php:433`/`452` and
  `:435`/`453`, fetched via `do_curl()`). `addPageMetadata()` has zero callers in
  this extraction today (a known, already-logged issue), which is *why* the
  pattern is dormant rather than safe. If any route ever wires the taxonomy API
  back in, `webpage.tpl` (and, by the same reasoning, `breadcrumbList.tpl` if its
  input stops being hardcoded) becomes a `</script>`-injection point inside
  `<head>`. This decision — ship unescaped — must be revisited the moment
  `breadcrumbList.tpl`'s `breadcrumb_items` input becomes feed- or
  request-derived instead of a route literal.

### `playoff-predictor` inline data payload + deprioritized logo preloads (2026-09-11, owner-approved divergence, perf)

The live page measured LCP 19.6s / Speed Index 29.1s, roughly 3x the sibling
tools (`ultimate-gm-simulator` 5.8s, `mockdraft` 6.3s) on the same CDN/ad stack,
despite shipping the *smallest* of the three JS bundles (124 KiB) — so bundle
weight was ruled out and a review identified two root causes, both fixed here:

- **Duplicate fetch.** `routes/tools.php`'s `playoff-predictor` block already
  called `do_curl()` on `playoffPredictorData.json` (~29KB) and used only
  `updatedTime` from it; `js/fragments/playoff-predictor.js` then fetched the
  identical file again client-side before building any UI, and the whole page
  sits behind index.tpl's full-viewport "Loading..." overlay until that
  finishes. `routes/tools.php` now also wraps the already-decoded `$ppData` in
  an envelope, `array('fetchedAt' => $ppFetchedAtISO, 'payload' => $ppData)`
  (`$ppFetchedAtISO` captured immediately after the `do_curl()` call — see the
  "HTML-cache staleness" bullet below for why), and serialises that envelope
  with `json_encode($ppInlineEnvelope, JSON_HEX_TAG | JSON_HEX_AMP |
  JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES)` into
  `$template_data['playoff_predictor_inline_data']`, guarded on
  `$ppStatusCode == 200 && is_array($ppData) && !empty($ppData['collections'])`
  (the shape the client's `prepareToolData()` actually consumes) **and** on
  `strlen($ppEncoded) <= 512 * 1024` applied to the whole envelope —
  `do_curl()`'s 2s timeout (helpers.php, shared verbatim by all nine tools,
  deliberately not touched here) bounds fetch *time*, not payload *size*, so
  this route-local cap stops a runaway or misconfigured feed export from
  multiplying HTML egress on this page's every response. Any of these checks
  failing leaves `$ppInlinePayloadJson = ''`.

  `templates/pages/static/tools/nfl/playoff-predictor/index.tpl` emits it, when
  non-empty, as `<script type="application/json" id="pp-inline-data">...</script>`
  — deliberately **data**, not a `var X = {...}` JS object literal (security
  review, 2026-09-11): a JS object-literal assignment and `JSON.parse()`
  disagree on a `__proto__` key in untrusted feed data (one sets the object's
  prototype, the other makes it an own property), and the bundle always reads
  this element through `JSON.parse()` (`readInlinePlayoffData()` in
  playoff-predictor.js) so the inline and fallback-fetch paths can never
  silently diverge on that. Printed with `nofilter` (deliberately NOT Smarty's
  `|escape:'javascript'`, which maps `'` to `\'` — not a legal JSON escape, and
  would silently ship broken JSON — this exact wrong suggestion has recurred
  across this audit; see the `breadcrumbList.tpl` note above for the JSON-LD
  case of the same mistake). `JSON_HEX_TAG` rewrites the literal characters `<`
  and `>` to the escapes `\u003C` and `\u003E`, neutralising any `</script>` in
  this remote, feed-derived (untrusted, Rule 4) payload before it's printed
  unescaped.

  `js/fragments/playoff-predictor.js`'s IIFE uses `readInlinePlayoffData()`'s
  result when present, and falls back to its original
  `fetchData(playoffPredictorDataURL)` otherwise — so a feed outage/timeout, a
  decode failure, exceeding the 512KB cap, or simply this PHP shipping without
  the corresponding bundle (see the Bundle-label note below) all degrade to
  exactly today's behavior, never worse.

  **Execution-order correction (security review, 2026-09-11):** the first cut
  of this IIFE only `await`ed the fallback-fetch branch, not the inline-data
  branch:
  ```js
  var data = inlineData ? inlineData : await fetchData(playoffPredictorDataURL);
  ```
  Because the IIFE is `async () => { ... }`, taking the inline branch meant the
  function body ran to completion **synchronously**, before the rest of this
  module's ~9,150-line top-level body had finished executing — in particular
  before `init()` (defined at ~line 9423, called at ~line 9549), whose `setWeekCarousel()` call creates the
  `.week{N}-holder` elements. `prepareToolData()`/`initializeTool()` (called
  from inside the IIFE) reach `changeWeek()`, which queries
  `.week{N}-holder` — with `init()` not yet run, that query matches nothing,
  so the carousel's auto-scroll-to-current-week silently no-ops and the
  carousel stays parked on week 1 while later-week matches are shown. The fix
  is to `await` both branches: `await Promise.resolve(inlineData)` on the
  inline path suspends the async function at zero network/timing cost, so its
  continuation resumes at the next microtask checkpoint — after the module
  body (and `init()`) have run — reproducing the original fetch()-based
  version's relative ordering exactly. Do not "simplify" this back to a bare
  synchronous read.

  **HTML-cache staleness correction (security review, 2026-09-11):** this
  route is served `Cache-Control: max-age=600, s-maxage=600,
  stale-while-revalidate=14400` (measured against the live response headers).
  Before the inline payload existed, a page reload always issued its own
  network fetch for the feed regardless of the HTML cache, so the tool's data
  was never older than the feed itself. Once the feed is inlined, an HTML
  response served from that cache — fresh for up to 600s, or up to 14400s
  (4h) under `stale-while-revalidate` — would otherwise make the tool
  silently render whatever feed snapshot was baked into that cached HTML,
  with `prepareToolData()` writing that same stale time into the visible
  "UPDATED ON" text, so nothing would look wrong to a user. That specifically
  undermines this page's one differentiator over every competitor measured:
  real, near-real-time "updated within minutes of each game" data with a
  matching `dateModified`. Fixed by stamping `fetchedAt` into the envelope
  (above) and having `readInlinePlayoffData()` (`js/fragments/playoff-predictor.js`)
  bound how long it trusts the inline payload against that stamp.

  **THE REAL PROPERTY THIS GUARANTEES — corrected (security review, second
  pass, 2026-09-11):** the original wording here claimed a reload served from
  cache "reliably falls through to a live fetch," which is false for the
  first 300 seconds of every 600-second cache generation. Worked example:
  HTML generated at T=0 with the payload baked in; a game ends and the feed
  updates at T=90s; a user reloads at T=120s; the browser serves the cached
  HTML, `ageMs=120000` is within the 5-minute window, so the (now ~2-minute
  stale) inline payload is used — "UPDATED ON" included. The actual
  guarantee: a reload served from that cache **more than 5 minutes** after
  the response was generated falls through to a live fetch; **within** the
  first 5 minutes the inline payload is used and may be up to 5 minutes
  stale. That bound is the accepted tradeoff, replacing the unbounded
  600s / 14400s exposure the raw HTML cache would otherwise allow — not a
  guarantee of always-live data. 5 minutes was chosen because it sits within
  this page's own "updated within minutes of each game" promise. This repo
  has no test suite, and a wrong comment here is the only specification a
  future reader has — get it right or don't write it.

  **Clock-skew tolerance — corrected (security review, second pass,
  2026-09-11):** the freshness check's first cut rejected any negative age
  (`ageMs < 0`) — i.e. any client clock reading even one second behind the
  server — as stale. Ordinary consumer clock drift of a few seconds is
  routine, so this silently sent an unknown but potentially large share of
  real users through the live-fetch fallback on every single load, forever,
  with nothing logged to reveal it: they paid for the inline payload's HTML
  weight and got none of its benefit. Changed to tolerate the client clock
  running up to 60 seconds *ahead* of the stamp (`ageMs >= -60000`) before
  treating it as implausible, while the upper bound (`ageMs <=
  FRESHNESS_WINDOW_MS`, 5 minutes) is unchanged. This guard is inherently
  client-clock-relative, not a general fix for skew: a client whose clock
  runs hours slow will compute a small or negative age for a stamp that is
  actually hours old by server time, and read it as fresh — there is no
  server-relative signal available to this client-side check to correct for
  that. Written down explicitly because the pre-correction comment implied
  the check was robust against skew in general, and it was not, and still
  isn't beyond the tolerance window.

  **Missing-`collections` guard (security review, second pass, 2026-09-11):**
  `readInlinePlayoffData()` also now requires `envelope.payload.collections`
  to be present, not just `envelope.payload` and `envelope.fetchedAt`. No
  live bug today — `routes/tools.php` already refuses to inline anything
  whose `$ppData['collections']` is empty — but this is defense in depth: if
  that server-side guard is ever loosened independently of this file,
  `prepareToolData()`'s unconditional `Object.keys(data["collections"])`
  would throw inside the IIFE's `try`, the `catch` only `console.error`s, and
  the full-viewport loading overlay — removed only inside `initializeTool()`,
  which would never be reached — would stay up forever with nothing visible
  in the console. Cheap to guard against now rather than to debug blind
  later.

  No path is worse than pre-Fix-A behavior: first load gets the perf win, a
  cached-HTML reload within 5 minutes gets the (bounded-stale, accepted)
  inline payload, a reload past 5 minutes or with an implausible timestamp
  gets a live fetch (today's behavior), and a down/malformed/oversized feed
  still gets the pre-existing soft-fail.
- **Eager logo preloads.** `templates/pages/static/tools/nfl/playoff-predictor/desktop/index.tpl`
  and `.../mobile/index.tpl` each render a 32-team `{foreach}` of team-logo
  `<img>` tags (~12KB each, 64 total across both variants since only one is
  CSS-hidden per breakpoint, not omitted from the DOM). Added
  `fetchpriority="low"` to both loops. `width`/`height` (28x18) and the
  pre-existing `crossorigin="anonymous"` were left exactly as they were, so no
  CLS risk was introduced.

  **`loading="lazy"` was tried first and rejected — do not reintroduce it.**
  The factual premise that led to trying it is correct: every image in both
  loops carries `class="hidden"`, the site's global `display:none!important`
  utility class, so none of these 64 images is ever visible/above-the-fold in
  either variant at any breakpoint. But that fact argues for the opposite
  conclusion. Native lazy-loading decides whether to fetch an image based on
  its distance from the viewport, computed from its layout box — a
  `display:none` element has **no layout box**, so the browser's intersection
  logic never fires and the image may never be fetched at all. That matters
  because these 64 tags are not decoration to defer: the bundle never queries,
  clones or references them. Every logo actually shown in the UI is built
  separately by `js/fragments/playoff-predictor.js` via
  `document.createElement("img")` with a freshly constructed `src` pointing at
  the identical URL (e.g. `standingsTeamLogo`, `divisionteamLogo`,
  `wildcardteamLogo` — search the bundle for `.setAttribute("src", ...logo...)`
  calls). The hidden tags exist solely to get those 32 URLs into the browser's
  HTTP cache before the JS-driven UI requests them. Lazy-loading them leaves
  that cache cold when `initializeTool()` runs, so every standings row,
  bracket cell and matchup card would fire a first-time network request at the
  exact moment the user is looking at it — visible logo pop-in that does not
  happen today. The owner explicitly ruled out that UX regression.
  `fetchpriority="low"` was used instead: it still guarantees the request is
  issued regardless of layout or visibility, it only schedules it behind
  higher-priority resources — which is the actual goal (warm the cache without
  competing with the LCP-critical fetches for early bandwidth).

  Also deliberately **not** changed: `crossorigin="anonymous"` was already
  present on these hidden preload tags before this fix and must stay. Several
  of the JS-created *visible* logo `<img>` elements also call
  `.setAttribute("crossorigin", "anonymous")` (e.g. `standingsTeamLogo`,
  `superbowlTeamLogo`, `wildcardteamLogo`, `divisionteamLogo`,
  `conferenceteamLogo` in `js/fragments/playoff-predictor.js`) — a CORS-mode
  request and a no-CORS request for the same URL land in **different** HTTP
  cache entries. Adding `crossorigin` to a preload that lacked it, or removing
  it from one that has it, would silently split the cache entry from the one
  the visible `<img>` actually reads and defeat the warming this fix exists to
  provide, while looking like an improvement. Match `crossorigin` presence
  between a preload tag and its corresponding consumer before ever touching
  this attribute here.
- **Deploy note (Rule 2):** the `js/fragments/playoff-predictor.js` change only
  reaches production behind the `Bundle`/`bundle` PR label. If the PHP/template
  changes merge without it, the inline payload is emitted into the page but the
  live (old) bundle ignores it and keeps calling its own `fetchData()` — a no-op
  regression risk, not a breakage, because of the fallback path above.

### Templates — `templates/` (250 `.tpl` + data)

Full transitive `{include}` closure of the render path (main render template,
PFN layout/header/footer/nav, ads, schemas, and the four tool template trees).
Notable trees:

- `templates/third-party/proxy/` — proxy render template, PFN chrome, per-tool
  styles/meta, schemas, `pfn/common/login/` (login page + Firebase manager)
- `templates/{desktop,mobile}/fragments/login-css.tpl` — login page base CSS
- `templates/nfl-draft-simulator/` — mock draft simulator UI (home, widget,
  common: players/teams/picks/multi-user/final-result/dashboard) + **data files**
- `templates/pages/static/tools/nfl/{playoff-predictor,ultimate-gm-simulator,fifa-world-cup-simulator,free-agency-simulator}/` — those four tools' markup
  (free-agency-simulator = `index.tpl` + `styles.tpl` + `fetch-data.tpl` + `js.tpl`,
  its only outside include being `templates/utils/script.tpl`)
- `templates/pages/static/tools/{tennis-simulator,nascar-predictor}/` — `index.tpl`
  + `styles.tpl` + `js.tpl` each, fully self-contained (no outside includes)
- `templates/pages/static/tools/nfl/lineup-optimizer/` — `index.tpl` + `desktop.tpl`
  + `mobile.tpl` + `styles.tpl` + `js.tpl` + `common/{templates.tpl,filters/}`; its
  outside includes are `templates/utils/carousal.tpl` and the feedback CTA
  (`third-party/proxy/pfn/common/feedback-cta/index.tpl` + the
  `feedback-cta-styles.tpl` pulled in by the tool's proxy `styles.tpl`). The whole
  optimizer runs from the inline script in `js.tpl` — it has no JS bundle — and
  fetches its slates/players from `https://lineup-optimizer.sportskeeda.com/`
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
| `js/fragments/free-agency-simulator.js` | free-agency-simulator (Offseason Manager) bundle source |
| `js/fragments/tennis-simulator.js` | tennis-simulator bundle source |
| `js/fragments/nascar-predictor.js` | nascar-predictor bundle source |
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
  - `generateDataIntegrationAssetsPath(...)` asset paths (playoff/ultimate/fifa data,
    and `tools/free_agency_simulator/{final,team_level_data}.json` for the Offseason Manager)
- The `redirect-url-and-response-filter.php` middleware (main-site redirect
  logic) — its request-time constants are reproduced directly in `config.php`.

## Runtime notes

- **PHP 7.x** — the parent runs on PHP 7 (Smarty 3.1.48 supports PHP 5.2/7.0
  only). Verified on PHP 7.4. On PHP 8 Smarty 3.1.48 throws; `index.php` includes
  a `get_magic_quotes_gpc()` polyfill but PHP 7 is the supported runtime.
- Handlers are guarded by `restrictAccess()`. `index.php` forces
  `HTTP_PFNORIGINHEADER` (this is a PFN-only repo), so routes are reachable
  directly; behind the real proxy the header is supplied the same way.
