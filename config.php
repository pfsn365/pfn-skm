<?php
// constants-extract.php
// VERBATIM define() blocks for every constant referenced by the 4 PFN tool
// handlers, their closure functions, and the 209 templates in the render path.
//
// INCLUDE ORDER MATTERS:
//   1. PROFOOTBALLNETWORK + BUNDLE_STATIC_URL (config.php top) must come FIRST
//      because js-side-menu-config.php *_SCRIPT_LOCATION defines concatenate
//      BUNDLE_STATIC_URL.
//   2. createBidsArray() must be defined before AD_UNITS (AD_UNITS calls it).
//   3. GA4_MAP before GA4_ID; getStaticUrlConfig() (in helpers-extract.php)
//      + PROFOOTBALLNETWORK before STATIC_URL.
//
// Environment/host conditionals are preserved verbatim. For PFN production the
// HTTP header HTTP_PFNORIGINHEADER is SET -> the PFN branch of each if/else wins.
// See report.md for the resolved production value of each computed constant.

// ============================================================
// SOURCE: config.php  (top-level, environment detection)
// ============================================================

// --- PROFOOTBALLNETWORK + BUNDLE_STATIC_URL (PFN header branch)  (from config.php:7-13) ---
// if(!empty($_SERVER["HTTP_PFNORIGINHEADER"])) {// this header is used for PFN domain
define('PROFOOTBALLNETWORK', true);
define('BUNDLE_STATIC_URL', '//static.profootballnetwork.com');
// } else {
// 	define('PROFOOTBALLNETWORK', false);
// 	define('BUNDLE_STATIC_URL', '//staticg.sportskeeda.com');
// }

	define('GOTHAM_URL', 'http://gotham-bigscoots.profootballnetwork.com');
	define('GOTHAM_CF_URL', 'https://gotham-bigscoots.profootballnetwork.com');

// --- GOTHAM_URL_PFN_FRONTEND  (from config.php:39-39) ---
// Browser-facing Gotham host. Used by the login page (POST /pfn/auth to exchange
// the Firebase ID token for a session), the MDS dashboard/logout calls and the
// feedback/playoff-predictor submissions. Parent value is
// 'https://gotham.profootballnetwork.com'; this repo points at the BigScoots
// endpoint to match GOTHAM_URL/GOTHAM_CF_URL above.
	define('GOTHAM_URL_PFN_FRONTEND', 'https://gotham-bigscoots.profootballnetwork.com');

// --- ENVIRONMENT + SCHEME  (from config.php:73-74) ---
	define('ENVIRONMENT', "production");
	define('SCHEME', "https");

// --- PFN_URL (used by get_brand_login_url)  (from config.php:97-97) ---
	define('PFN_URL', 'https://www.profootballnetwork.com');

// --- MOBILE_LOGIN_FIREBASE_PFN  (from config.php:101-109) ---
// Firebase web-app config for the PFN login page (templates/third-party/proxy/
// pfn/common/login/firebaseManager.tpl). These are public client-side keys, the
// same ones the parent app ships to the browser.
	define("MOBILE_LOGIN_FIREBASE_PFN", [
		"apiKey" => "AIzaSyDxsSRpmQUt41Q_JmPEcbAPgQzUrUNXV6Q",
		"authDomain" => "profootballnetwork-8e365.firebaseapp.com",
		"projectId" => "profootballnetwork-8e365",
		"storageBucket" => "profootballnetwork-8e365.appspot.com",
		"messagingSenderId" => "317914786543",
		"appId" => "1:317914786543:web:e93f8a514cbbc1e761491a",
		"measurementId" => "G-HZWEW0N3E8"
	]);

// --- PFN header-menu cron constants  (from config.php:4223-4225) ---
// Used by cronjobs/pfn/pfn-menu-cron.php to fetch the PFN WordPress top menu.
// NOTE: PFN_WP_AUTH_KEY is a secret (WordPress basic-auth). Consider moving it
// to dev-config.php / an environment variable rather than committing it.
	define("PFN_WP_AUTH_KEY", "Basic QWJkdWw6UzZObCBHaFhpIGE1ZG4gUUFBUyBYYXQyIEFwemk=");
	define("PFN_SITE_URL", "https://www.profootballnetwork.com/");
	define("PFN_MAIN_MENU_ID", "wp-json/wp/v2/menu-items?menus=54");

// --- VISIBL_SCRIPT_URL__PFN  (from config.php:123-123) ---
	define('VISIBL_SCRIPT_URL__PFN', 'https://assets.govisibl.io/scripts/dist/v1/sk.min.js?s=1&t=6008c3a6-0ddf-47a3-9146-2c4a38a74751');

// --- COOKIE_* (USER_ID/COUNTRY/SLUG/PICTURE_LARGE/CURRENT_URL/REFRESH/CONSENT/GDPR/CSRF_NAME/CSRF_HEADER) + PLAY_STORE_URL  (from config.php:345-355) ---
define('COOKIE_USER_ID', 'fw_ID');
define('COOKIE_USER_COUNTRY', 'fw_user_country');
define('COOKIE_USER_SLUG', 'fw_user_slug');
define('COOKIE_USER_PICTURE_LARGE', 'fw_picture_large');
define('COOKIE_USER_CURRENT_URL', 'fw_user_url');
define('COOKIE_REFRESH', 'fw_refresh_token');
define('COOKIE_USER_CONSENT', 'user_consent');
define('COOKIE_GDPR', 'gdpr');
define('PLAY_STORE_URL', 'https://bit.ly/1Gsutvu');
define('COOKIE_CSRF_NAME', 'csrf_token');
define('COOKIE_CSRF_HEADER', 'X-CSRF-TOKEN');

// --- STATIC_URL = getStaticUrlConfig()  (from config.php:360-360) ---
define('STATIC_URL', getStaticUrlConfig());

// --- CHARTBEAT_CONFIGS  (from config.php:3717-3723) ---
define("CHARTBEAT_CONFIGS", [
	"trade-analyzer" => ["authors" => 'Fantasy', "sections" => 'Tools'],
	"mockdraft-simulator" => ["authors" => 'Fantasy Staff', "sections" => 'Fantasy Football'],
	"betting-odds-calculator" => ["authors" => 'Betting', "sections" => 'Tools'],
	"parlay-calculator" => ["authors" => 'Betting', "sections" => 'Tools'],
	"team-player-pages" => ["authors" => 'NFL', "sections" => 'Tools'],
]);

// ============================================================
// SOURCE: js-side-menu-config.php  (needs BUNDLE_STATIC_URL first)
// JS bundle locations. Like the parent repo, a gitignored dev-config.php
// (copied from dev-config.php.sample) can override these on a dev/staging box
// to serve locally-built bundles instead of the production CDN. When it is
// absent (production), the CDN paths below are used.
// ============================================================

if (file_exists(__DIR__ . '/dev-config.php')) {
    // Dev/staging: serve locally-built (non-hashed) bundles from this host.
    include_once __DIR__ . '/dev-config.php';
} else {
    // Production: content-hashed CDN bundles. js-side-menu-config.php is
    // regenerated by `npm run build` and committed by the bundle.yml Action.
    include_once __DIR__ . '/js-side-menu-config.php';
}

define('LANG', 'en');
define('IS_MOBILE', FALSE);
define('IS_DESKTOP', TRUE);
