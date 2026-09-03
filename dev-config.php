<?php
/**
 * Staging overrides — mirrors the parent repo's dev-config.php mechanism.
 *
 * This file is committed. config.php loads it INSTEAD of the production CDN
 * bundle constants when the ENVIRONMENT environment variable is STAGING:
 *
 *     ENVIRONMENT=STAGING   -> dev-config.php        (this file)
 *     ENVIRONMENT=PRODUCTION / unset -> js-side-menu-config.php
 *
 * So the staging box serves the JS bundles built from this checkout
 * (npm run dev -> js/dev/*-bundle.js) from its own host, rather than the frozen
 * production bundles on staticd.profootballnetwork.com.
 *
 * Any constant defined here wins over the production default, because config.php
 * only defines the production values in the `else` branch. Add other per-env
 * overrides here as needed.
 */

// Serve the locally-built bundles from this host (relative to the current domain).
// Build them first with: npm install && npm run dev   (or npm run watch)
define('MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION', '/js/dev/mockdraft-simulator-bundle.js');
define('ULTIMATE_SIMULATOR_SCRIPT_LOCATION',  '/js/dev/ultimate-simulator-bundle.js');
define('PLAYOFF_PREDICTOR_SCRIPT_LOCATION',   '/js/dev/playoff-predictor-bundle.js');
define('FIFA_WORLD_CUP_SIMULATOR_SCRIPT_LOCATION', '/js/dev/fifa-world-cup-simulator-bundle.js');
define('FREE_AGENCY_SIMULATOR_SCRIPT_LOCATION', '/js/dev/free-agency-simulator-bundle.js');
