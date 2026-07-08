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
if(!empty($_SERVER["HTTP_PFNORIGINHEADER"])) {// this header is used for PFN domain
	define('PROFOOTBALLNETWORK', true);
	define('BUNDLE_STATIC_URL', '//staticd.profootballnetwork.com');
} else {
	define('PROFOOTBALLNETWORK', false);
	define('BUNDLE_STATIC_URL', '//staticg.sportskeeda.com');
}

// --- GOTHAM_URL (if/else) + GOTHAM_CF_URL + GOTHAM_URL_FRONTEND + GOTHAM_URL_PFN_FRONTEND  (from config.php:31-40) ---
	if(!empty($_SERVER["HTTP_PFNORIGINHEADER"])) {// this header is used for PFN domain
		define('GOTHAM_URL', 'http://gotham.profootballnetwork.com');
		define('GOTHAM_CF_URL', 'https://gotham.profootballnetwork.com');
	} else {
		define('GOTHAM_URL', 'http://gotham.sportskeeda.com');
		define('GOTHAM_CF_URL', 'https://cf-gotham.sportskeeda.com');
	}
	define('GOTHAM_URL_FRONTEND', 'https://gotham.sportskeeda.com');
	define('GOTHAM_URL_PFN_FRONTEND', 'https://gotham.profootballnetwork.com');
	define('GOTHAM_URL_HA_FRONTEND', 'https://a-gotham.sportskeeda.com'); // HA = High availability. This is using AWS Global Accelerator which improves the network layer availability of the service

// --- API_ENDPOINT_DOMAIN_HOST (dep of API_ENDPOINT_DOMAIN)  (from config.php:44-44) ---
	define('API_ENDPOINT_DOMAIN_HOST', 'http://internal-api.sportskeeda.com');

// --- FRAMEWORK_URL_HOST (dep of FRAMEWORK_URL)  (from config.php:47-47) ---
	define('FRAMEWORK_URL_HOST', 'https://a-login.sportskeeda.com');

// --- ENVIRONMENT + SCHEME  (from config.php:73-74) ---
	define('ENVIRONMENT', "production");
	define('SCHEME', "https");

// --- PFN_URL (used by get_brand_login_url)  (from config.php:97-97) ---
	define('PFN_URL', 'https://www.profootballnetwork.com');

// --- VISIBL_SCRIPT_URL__PFN  (from config.php:123-123) ---
	define('VISIBL_SCRIPT_URL__PFN', 'https://assets.govisibl.io/scripts/dist/v1/sk.min.js?s=1&t=6008c3a6-0ddf-47a3-9146-2c4a38a74751');

// --- OPERA (if/else)  (from config.php:131-135) ---
if(!empty($_SERVER["OPERA"])) { // This http header will come in from nginx config
	define('OPERA', true);
} else {
	define('OPERA', false);
}

// --- GA4_MAP (dep of GA4_ID)  (from config.php:287-298) ---
define('GA4_MAP', [
	'hi'   => 'G-QLP13SMT42',
	'en'   => 'G-T41EZF14QW',
	'ta'   => false,
	'wiki' => 'G-GMYLX95QW6',
	'opera' => 'G-9PM6FEE3C5',
	'fortnite_item_shop' => 'G-K8EY95VX89',
	'picks4sure' => 'G-6WYPLE6KE5',
	'cricRocket' => 'G-SWZJV09SEV',
	'cmc' => 'G-P4CG9LCBQW',
	'onlywordgames' => 'G-KJZN7LY2KN'
]);

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

// --- AD_CODE  (from config.php:380-380) ---
define('AD_CODE', '11446729');

// --- createBidsArray() function (REQUIRED before AD_UNITS)  (from config.php:383-618) ---
function createBidsArray($input)
{
	$bids = [];

	if (array_key_exists("ix", $input)) {
		$ixData = $input["ix"];

		if (!empty($ixData["sizes"])) {
			array_push($bids, [
				"bidder" => "ix",
				"params" => [
					"siteId" => "745046",
				]
			]);
		}
	}

	if (array_key_exists("teads", $input)) {
		$teadsData = $input["teads"];

		if (!empty($teadsData["placementId"]) && !empty($teadsData["pageId"])) {
			array_push($bids, [
				"bidder" => "teads",
				"params" => [
					"placementId" => $teadsData["placementId"],
					"pageId" => $teadsData["pageId"]
				]
			]);
		}
	}

	if (array_key_exists("pubmatic", $input)) {
		$pubmaticData = $input["pubmatic"];

		if (!empty($pubmaticData["adSlot"])) {
			array_push($bids, [
				"bidder" => "pubmatic",
				"params" => [
					"publisherId" => "156349",
					"adSlot" => $pubmaticData["adSlot"]
				]
			]);
		}
	}

	if (array_key_exists("adagio", $input)) {
		$adagioData = $input["adagio"];

		if (!empty($adagioData["placement"])) {
			array_push($bids, [
				"bidder" => "adagio",
				"params" => [
					"organizationId" => "1238",
					"site" => "sportskeeda-com",
					"placement" => $adagioData["placement"],
				]
			]);
		}
	}

	if (array_key_exists("tripleLift", $input)) {
		$tripleLiftData = $input["tripleLift"];

		if (!empty($tripleLiftData["inventoryCode"])) {
			array_push($bids, [
				"bidder" => "triplelift",
				"params" => [
					"inventoryCode" => $tripleLiftData["inventoryCode"]
				]
			]);
		}
	}

	if(array_key_exists("kargo", $input)) {
		$kargoData = $input["kargo"];
		array_push($bids, [
			"bidder" => "kargo",
			"params" => [
				"placementId" => $kargoData['placementId']
			]
		]);
	}

	if(array_key_exists("sharethrough", $input)) {
		$sharethroughData = $input["sharethrough"];
		array_push($bids, [
			"bidder" => "sharethrough",
			"params" => [
				"pkey" => $sharethroughData["pkey"]
			]
		]);
	}

	if(array_key_exists("missena", $input)) {
		array_push($bids, [
			"bidder" => "missena",
			"params" => [
				"apiKey" => "PA-24989846"
			]
		]);
	}

	if(array_key_exists("optidigital", $input)) {
		$optidigitalData = $input["optidigital"];
		array_push($bids, [
			"bidder" => "optidigital",
			"params" => [
				"publisherId" => "p256",
				"placementId" => $optidigitalData["placementId"]
			]
		]);
	}

	array_push($bids, [
		"bidder" => "ttd",
		"params" => [
			"supplySourceId" => "absolutesports",
			"publisherId" => "1",
		]
	]);

	if (array_key_exists("nexx360", $input)) {
		$nexx360Data = $input["nexx360"];
		array_push($bids, [
			"bidder" => "nexx360",
			"params" => [
				"tagId" => $nexx360Data["tagId"]
			]
		]);
	}

	if (array_key_exists("taboola", $input)) {
		$taboolaData = $input["taboola"];
		array_push($bids, [
			"bidder" => "taboola",
			"params" => [
				"publisherId" => "1832431",
				"tagId" => $taboolaData["tagId"]
			]
		]);
	}

	if (array_key_exists("seedtag", $input)) {
		$seedtagData = $input["seedtag"];
		array_push($bids, [
			"bidder" => "seedtag",
			"params" => [
				"publisherId" => "6682-2290-01",
				"adUnitId" => $seedtagData["adUnitId"],
				"placement" => $seedtagData["placement"]
			]
		]);
	}

	array_push($bids, [
		"bidder" => "openx",
		"params" => [
			"delDomain" => "sportskeeda-d.openx.net",
			"unit" => 551030812
		]
	]);

	array_push($bids, [
		"bidder" => "rubicon",
		"params" => [
			"accountId" => 15140,
			"siteId" => 398014,
			"zoneId" => 2230404
		]
	]);

	array_push($bids, [
		"bidder" => "criteo",
		"params" => [
			"networkId" => "11977"
		]
	]);

	array_push($bids, [
		"bidder" => "vidazoo",
		"params" => [
			"cId" => "65a6b42c89f9651eea0ce8b8",
			"pId" => "59ac17c192832d0011283fe3",
			"subDomain" => "exchange"
		]
	]);

	if (array_key_exists("ogury", $input)) {
		$oguryAdUnitId = $input["ogury"]["adUnitId"];
	} else {
		$oguryAdUnitId = "wm-hb-stdb-sports-absol-80s64rwm9uky"; // in article display adUnitId
	}

	array_push($bids, [
		"bidder" => "ogury",
		"params" => [
			"adUnitId" => $oguryAdUnitId,
			"assetKey" => "OGY-1AC83494BC10"
		]
	]);

	if (array_key_exists("ozone", $input)) {
		array_push($bids, [
			"bidder" => "ozone",
			"params" => [
				"publisherId" => "OZONESPO0001",
				"siteId" => "1500000735",
				"placementId" => $input["ozone"]["placementId"],
			]
		]);
	}

	array_push($bids, [
		"bidder" => "insticator",
		"params" => [
			"adUnitId" => "01G2DJ2DEWHVFQKRQYP7C92Q09"
		]
	]);

	array_push($bids, [
		"bidder" => "yahooAds",
		"params" => [
			"dcn" => "8a96980001969633d40c4b3904df0006",
			"pos" => "sportskeeda_display",
		]
	]);

	array_push($bids, [
		"bidder" => "rise",
		"params" => [
			"org" => "5fcde7e56900a50001a59257",
		]
	]);

	return $bids;
}

// --- AD_UNITS (large ad-bidding config; referenced by templates/ads/ad-common.tpl)  (from config.php:620-2787) ---
define(
	'AD_UNITS',
	[
		//Desktop Slots
		'Brain_Buster_300x600_Left_Side_Desktop' => [
			'div' => 'div-gpt-ad-1735297525364-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 600], [300, 50], [320, 100], [300, 100], [300, 250], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [300, 600], [300, 50], [320, 100], [336, 280], [320, 50], [300, 250]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
			])
		],
		'Brain_Buster_300x250_Right_Side_Desktop' => [
			'div' => 'div-gpt-ad-1736144875012-0', 'mediaTypes' => ['banner' => ['sizes' => [[336, 280], [320, 50], [300, 50], [320, 100], [300, 100], [300, 250]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[336, 280], [320, 50], [300, 50], [320, 100], [300, 100], [300, 250]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
			])
		],
		'Desktop_Article_Right_300x600' => [
			'div' => 'div-gpt-ad-1740392944420-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 600], [300, 50], [320, 100], [300, 100], [300, 250], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [300, 600], [300, 50], [320, 100], [336, 280], [320, 50], [300, 250]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
				"taboola" => [
					"tagId" => "sticky_right_desktop"
				],
				"ozone" => [
					"placementId" => "3500017722"
				]
			])
		],
		'Brain_Buster_300x250_Inbetween' => [
			'div' => 'div-gpt-ad-1739195998895-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 100], [320, 50], [336, 280], [300, 100], [300, 250]]]],
			'bids' => createBidsArray([])
		],
		'Desktop_300250_1' => [
			'div' => 'div-gpt-ad-1471939034701-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [320, 100], [300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [320, 100], [300, 50], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_300x250_1@300x250"
				],
				"adagio" => [
					"placement" => "Sidebar"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Desktop_300250_1"
				],
				"kargo" => [
					"placementId" => "_fjwedyYklA"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Desktop_300250_1"
				]
			])
		],
		'Desktop_Vertical_Right_CMC' => [
			'div' => 'div-gpt-ad-1680275006038-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [320, 50], [300, 100], [300, 250], [300, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [320, 100], [300, 50], [320, 50], [300, 250]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_300x250_1@300x250"
				],
				"adagio" => [
					"placement" => "Sidebar"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Desktop_300250_1"
				],
				"kargo" => [
					"placementId" => "_fjwedyYklA"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Desktop_Vertical_Right_CMC"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316916",
					"placement" => "inBanner"
				],
				"taboola" => [
					"tagId" => "desktop_vertical_right"
				],
				"ozone" => [
					"placementId" => "3500017709"
				]
			])
		],
		'Desktop_300250_3' => [
			'div' => 'div-gpt-ad-1589376019464-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 250], [400, 280], [600, 280], [500, 280], [580, 300], [336, 280], [480, 320], [320, 100], [300, 100], [320, 50], [300, 50], [683, 320], [384, 320]]]],
			'infiniteContent' => False,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[1, 1], [300, 250], [400, 280], [600, 280], [500, 280], [580, 300], [336, 280], [480, 320], [320, 100], [300, 100], [320, 50], [300, 50], [683, 320], [384, 320]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_300x250_3@300x250"
				],
				"adagio" => [
					"placement" => "Sidebar"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Desktop_300250_3"
				],
				"kargo" => [
					"placementId" => "_fjwedyYklA"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Desktop_300250_3"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316888",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_desktop_3"
				],
				"ozone" => [
					"placementId" => "3500017705"
				]
			])
		],
		'Desktop_article_rail_top_2022' => [
			'div' => 'div-gpt-ad-1653457590899-0', 'mediaTypes' => ['banner' => ['sizes' => [[336, 280], [300, 250], [300, 100], [320, 100], [300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[336, 280], [300, 250], [300, 100], [320, 100], [300, 50], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_300x250_1@300x250"
				],
				"adagio" => [
					"placement" => "Sidebar"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Desktop_300250_1"
				],
				"kargo" => [
					"placementId" => "_fjwedyYklA"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Desktop_article_rail_top_2022"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316916",
					"placement" => "inBanner"
				],
				"taboola" => [
					"tagId" => "in_article_desktop_rail"
				],
				"ozone" => [
					"placementId" => "3500017710"
				]
			])
		],
		'DESKTOP_BELOW_ARTICLE' => [
			'div' => 'div-gpt-ad-1620810392526-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 250], [336, 280], [300, 100], [320, 100], [300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_DESKTOP_BELOW_ARTICLE@320x50"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Desktop_Below_Article"
				],
				"kargo" => [
					"placementId" => "_fjwedyYklA"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316887",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_desktop_below_article"
				],
				"ozone" => [
					"placementId" => "3500017704"
				]
			])
		],
		'Desktop_72890_1' => [
			'div' => 'div-gpt-ad-1471942863237-0', 'mediaTypes' => ['banner' => ['sizes' => [[970, 90], [728, 90], [1200, 90], [300, 100], [320, 100], [300, 50], [320, 50], [970, 250]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[970, 90], [728, 90], [1200, 90], [300, 100], [320, 100], [300, 50], [320, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_728x90_1@728x90"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Desktop_728x90"
				],
				"kargo" => [
					"placementId" => "_wkpy6bv4Gf"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"ogury" => [
					"adUnitId" => "wd-hb-stdb-sports-absol-u85ctkmxwrar"
				],
				"optidigital" => [
					"placementId" => "Desktop_72890_1"
				],
				"taboola" => [
					"tagId" => "sticky_desktop_top"
				],
				"ozone" => [
					"placementId" => "3500017706"
				],
			])
		],
		'Desktop_72890_2' => [
			'div' => 'div-gpt-ad-1495182871411-0', 'mediaTypes' => ['banner' => ['sizes' => [[728, 90]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[728, 90]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_728x90_2@728x90"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"kargo" => [
					"placementId" => "_bNIS3i0cfu"
				],
				"taboola" => [
					"tagId" => "sticky_desktop_bottom"
				],
				"ozone" => [
					"placementId" => "3500017708"
				],
			])
		],
		'Desktop_Bottom_72890_Sticky' => [
			'div' => 'div-gpt-ad-1677757730897-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [300, 50], [320, 50], [320, 100], [728, 90]]], 'missenanative' => true],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [300, 50], [320, 50], [320, 100], [728, 90]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_728x90_2@728x90"
				],
				"kargo" => [
					"placementId" => "_bNIS3i0cfu"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"missena" => [],
				"missenanative" => [
					"networkId" => 10593,
					"zoneId" => 1628644
				],
				"nexx360" => [
					"tagId" => "tlluycvi"
				],
				"ogury" => [
					"adUnitId" => "wd-hb-stdb-sports-absol-fhraqsnu9udz"
				],
				"seedtag" => [
					"adUnitId" => "34316886",
					"placement" => "inScreen"
				],
				"taboola" => [
					"tagId" => "sticky_desktop_bottom_72890"
				],
				"ozone" => [
					"placementId" => "3500017707"
				]
			])
		],
		'Fluid_Native_Desktop' => [
			'div' => 'div-gpt-ad-1557821524812-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid']]], 'native' => true, 'pos' => 3,
			'bids' => []
		],
		'Fluid_Native_Desktop_2' => [
			'div' => 'div-gpt-ad-1557821558584-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid']]], 'native' => true, 'pos' => 6,
			'bids' => []
		],
		'Carousel_Widget_250x100' => [
			'div' => 'div-gpt-ad-1632146417332-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100]]]],
			'bids' => []
		],
		'FIFAWC_HP_300250_1' => [
			'div' => 'div-gpt-ad-1669786710781-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100],[300, 250]]]],
			'bids' => createBidsArray([])
		],
		'FIFAWC_HP_300250_2' => [
			'div' => 'div-gpt-ad-1669786865478-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100],[300, 250]]]],
			'bids' => createBidsArray([])
		],

		//Mobile slots
		'Brain_Buster_Top_Sticky' => [
			'div' => 'div-gpt-ad-1738070767584-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [300, 50], [320, 100], [320, 50]]]],
			'bids' => createBidsArray([])
		],
		'Mob_32050_header' => [
			'div' => 'div-gpt-ad-1472029132368-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [300, 100], [320, 50], [300, 50]]]],
			'minHeight' => "125px",
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_330x50_header@320x50"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_32050_header"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				],
				"seedtag" => [
					"adUnitId" => "34316942",
					"placement" => "inBanner"
				],
				"taboola" => [
					"tagId" => "header_mob"
				],
				"ozone" => [
					"placementId" => "3500017719"
				],
			])
		],
		'CMC_Rewarded_Play_India' => [
			'div' => 'div-gpt-ad-1745220961012-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [336, 280], [300, 50], [320, 100], [300, 250], [320, 50]]]],
			'minHeight' => "125px",
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_330x50_header@320x50"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_32050_header"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				],
				"seedtag" => [
					"adUnitId" => "34316942",
					"placement" => "inBanner"
				],
			])
		],
		'NFL_Playoff_Predictor_Top' => [
			'div' => 'div-gpt-ad-1702649146137-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [320, 50], [300, 50], [300, 100]]]],
			'minHeight' => "125px",
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_330x50_header@320x50"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_32050_header"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				]
			])
		],
		'NFL_Playoff_Predictor_2' => [
			'div' => 'div-gpt-ad-1702649454749-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [320, 50], [300, 50], [320, 100]]]],
			'minHeight' => "125px",
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_330x50_header@320x50"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_32050_header"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				]
			])
		],
		'Mob_32050_Sticky_2019' => [
			'div' => 'div-gpt-ad-1546862184774-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]], 'missenanative' => true], 'sticky' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_320x50_Sticky_2019@320x50"
				],
				"adagio" => [
					"placement" => "Bottom Sticky"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_sticky"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"missena" => [],
				"missenanative" => [
					"networkId" => 10593,
					"zoneId" => 1628644
				],
				"optidigital" => [
					"placementId" => "Mob_32050_Sticky_2019"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				],
				"ogury" => [
					"adUnitId" => "wm-hb-foot-sports-absol-8b0thmmqf8dy"
				],
				"seedtag" => [
					"adUnitId" => "34316886",
					"placement" => "inScreen"
				],
				"taboola" => [
					"tagId" => "sticky_mob"
				],
				"ozone" => [
					"placementId" => "3500017718"
				]
			])
		],
		'Mobile_320100_Top_Quiz' => [
			'div' => 'div-gpt-ad-1716365757252-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [320, 50], [300, 50], [320, 100]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_330x50_header@320x50"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_32050_header"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				]
			])
		],
		'SK_MDS_Mob_32050_Sticky' => [
			'div' => 'div-gpt-ad-1681188939331-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]], 'missenanative' => true], 'sticky' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_320x50_Sticky_2019@320x50"
				],
				"adagio" => [
					"placement" => "Bottom Sticky"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_sticky"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"missena" => [],
				"missenanative" => [
					"networkId" => 10593,
					"zoneId" => 1628644
				],
				"optidigital" => [
					"placementId" => "SK_MDS_Mob_32050_Sticky"
				],
				"ogury" => [
					"adUnitId" => "wm-hb-foot-sports-absol-8b0thmmqf8dy"
				]
			])
		],
		'CMC-Sticky' => [
			'div' => 'div-gpt-ad-1597287049231-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]], 'missenanative' => true], 'sticky' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_CMC_Sticky@300x50"
				],
				"adagio" => [
					"placement" => "Bottom Sticky"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_CMC_Sticky"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"missena" => [],
				"missenanative" => [
					"networkId" => 10593,
					"zoneId" => 1628644
				],
				"optidigital" => [
					"placementId" => "CMC-Sticky"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"ogury" => [
					"adUnitId" => "wm-hb-foot-sports-absol-8b0thmmqf8dy"
				],
				"seedtag" => [
					"adUnitId" => "34316886",
					"placement" => "inScreen"
				],
			])
		],
		'CMC_LIVE_Direct_OEM' => [
			'div' => 'div-gpt-ad-1676618059719-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_LIVE_Direct_OEM"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				]
			])
		],
		'CMC-Above-Info' => [
			'div' => 'div-gpt-ad-1647443075030-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Info"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316929",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-Tips' => [
			'div' => 'div-gpt-ad-1647443255173-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Tips"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34319556",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-Scorecard' => [
			'div' => 'div-gpt-ad-1647443355732-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Scorecard"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				],
				"seedtag" => [
					"adUnitId" => "34319548",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-News' => [
			'div' => 'div-gpt-ad-1647443521163-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-News"
				]
			])
		],
		'CMC-Above-Predict' => [
			'div' => 'div-gpt-ad-1680368300262-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Predict"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				],
				"seedtag" => [
					"adUnitId" => "34316931",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Squad' => [
			'div' => 'div-gpt-ad-1684157146663-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Squad"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34319567",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Table' => [
			'div' => 'div-gpt-ad-1684157454060-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Table"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34319570",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-Stats' => [
			'div' => 'div-gpt-ad-1717063949340-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Table"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316933",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Between_Trending' => [
			'div' => 'div-gpt-ad-1648628442132-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [300, 250], [300, 50], [300, 100], [320, 50]]]], 'prebid' => true,
			'bids' => createBidsArray([
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Between_Trending"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				]
			])
		],
		'CMC-Sticky_OEM' => [
			'div' => 'div-gpt-ad-1702625374915-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]], 'sticky' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_CMC_Sticky@300x50"
				],
				"adagio" => [
					"placement" => "Bottom Sticky"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_CMC_Sticky"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"missena" => [],
				"optidigital" => [
					"placementId" => "CMC-Sticky_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34316886",
					"placement" => "inScreen"
				],
			])
		],
		'CMC-Commentary_OEM' => [
			'div' => 'div-gpt-ad-1702626210164-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [320, 50], [300, 50], [300, 100]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [320, 50], [300, 50], [320, 100]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenter_Commentary_300x250_2021@300x250"
				],
				"adagio" => [
					"placement" => "In - Article"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenter_Commentary_300x250"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34319561",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Header_OEM' => [
			'div' => 'div-gpt-ad-1702625128436-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]], 'noMinHeight' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50], [300, 100], [320, 100], [300, 250]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"optidigital" => [
					"placementId" => "CMC-Header_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34319563",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Top_Direct_OEM' => [
			'div' => 'div-gpt-ad-1712225718965-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1,1], [320, 100], [320, 50], [300, 50], [300, 100], [300, 250], [336, 280]]]], 'noMinHeight' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [320, 50], [300, 50], [300, 100]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"optidigital" => [
					"placementId" => "CMC-Header_OEM"
				]
			])
		],
		'CMC-Above-Info_OEM' => [
			'div' => 'div-gpt-ad-1702626459911-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Info_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34316930",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-Tips_OEM' => [
			'div' => 'div-gpt-ad-1702627077172-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Tips_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34319557",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-Scorecard_OEM' => [
			'div' => 'div-gpt-ad-1702625817710-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"seedtag" => [
					"adUnitId" => "34319554",
					"placement" => "inBanner"
				],
			])
		],
		'CMC-Above-News_OEM' => [
			'div' => 'div-gpt-ad-1702627973225-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-News_OEM"
				]
			])
		],
		'CMC-Above-Predict_OEM' => [
			'div' => 'div-gpt-ad-1702627572262-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC-Above-Predict_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34316932",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Squad_OEM' => [
			'div' => 'div-gpt-ad-1702626638363-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Squad_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34319569",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Table_OEM' => [
			'div' => 'div-gpt-ad-1702627396344-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Table_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34316947",
					"placement" => "inBanner"
				]
			])
		],
		'CMC-Above-Stats_OEM' => [
			'div' => 'div-gpt-ad-1717064283561-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [300, 250], [320, 100], [320, 50]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Table_OEM"
				],
				"seedtag" => [
					"adUnitId" => "34319544",
					"placement" => "inBanner"
				],
			])
		],
		'CMC_Between_Trending_OEM' => [
			'div' => 'div-gpt-ad-1702627800544-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 50], [300, 100], [300, 250], [300, 50], [320, 100]]]], 'prebid' => true,
			'bids' => createBidsArray([
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "CMC_Between_Trending_OEM"
				]
			])
		],
		'Mob_300250_2' => [
			'div' => 'div-gpt-ad-1486709274862-1', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 250], [336, 280]]]], 'parallax' => true,
			'minHeight' => "290px",
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_2@300x250"
				],
				"adagio" => [
					"placement" => "Above The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_2"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316936",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_mob_2"
				],
				"ozone" => [
					"placementId" => "3500017716"
				]
			])
		],
		'Mob_300250_3' => [
			'div' => 'div-gpt-ad-1544790280952-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 50], [320, 50], [300, 100], [320, 100], [300, 250], [336, 280], [300, 600]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_3@300x250"
				],
				"adagio" => [
					"placement" => "Above The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_3"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316937",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_mob_3"
				],
				"ozone" => [
					"placementId" => "3500017717"
				],
				"ogury" => [
					"adUnitId" => "wm-hb-iart-sports-absol-mztqpxc3vvrh",
				]
			])
		],
		'Mob_300250_4' => [
			'div' => 'div-gpt-ad-1486709274862-3', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 50], [320, 50], [300, 100], [320, 100], [300, 250], [336, 280]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_4@300x250"
				],
				"adagio" => [
					"placement" => "Above The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_4"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_4"
				],
				"seedtag" => [
					"adUnitId" => "34316925",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_mob_4"
				],
				"ozone" => [
					"placementId" => "3500017712"
				]
			])
		],
		'Mob_300250_5' => [
			'div' => 'div-gpt-ad-1486709274862-4', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 50], [320, 50], [300, 100], [320, 100], [300, 250], [336, 280]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_5@300x250"
				],
				"adagio" => [
					"placement" => "Above The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_5"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316927",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_mob_5"
				],
				"ozone" => [
					"placementId" => "3500017713"
				]
			])
		],
		'Mob_300250_6' => [
			'div' => 'div-gpt-ad-1496133676474-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 50], [320, 50], [300, 100], [320, 100], [300, 250], [336, 280]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_6@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_6"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34316934",
					"placement" => "inArticle"
				],
				"taboola" => [
					"tagId" => "in_article_mob_6"
				],
				"ozone" => [
					"placementId" => "3500017714"
				]
			])
		],
		'Arbitrage_Mob_Sticky_Dec_2023' => [
			'div' => 'div-gpt-ad-1702881025633-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [320, 50], [1, 1], [300, 50], [300, 100]]]],
			'bids' => []
		],
		'Arbitrage_Mob_300250_1' => [
			'div' => 'div-gpt-ad-1702882746484-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 600], [300, 50], [320, 100], [320, 50], [336, 280], [300, 250], [1, 1], [300, 100]]]],
			'bids' => []
		],
		'Arbitrage_Mob_300250_2' => [
			'div' => 'div-gpt-ad-1702882831479-0', 'mediaTypes' => ['banner' => ['sizes' => [[1, 1], [300, 250], [336, 280], [320, 50], [300, 100], [320, 100], [300, 50]]]],
			'bids' => []
		],
		'Arbitrage_Mob_300250_3' => [
			'div' => 'div-gpt-ad-1702882881015-0', 'mediaTypes' => ['banner' => ['sizes' => [[1, 1], [320, 50], [300, 250], [336, 280], [300, 50], [320, 100], [300, 100]]]],
			'bids' => []
		],
		'Arbitrage_Mob_300250_4' => [
			'div' => 'div-gpt-ad-1702882951276-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [300, 50], [1, 1], [300, 250], [320, 50], [336, 280], [320, 100]]]],
			'bids' => []
		],
		'Arbitrage_Mob_300250_5' => [
			'div' => 'div-gpt-ad-1702883019072-0', 'mediaTypes' => ['banner' => ['sizes' => [[336, 280], [300, 250], [320, 100], [320, 50], [1, 1], [300, 50], [300, 100]]]],
			'bids' => []
		],
		'Arbitrage_Mob_300250_6' => [
			'div' => 'div-gpt-ad-1702883072565-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 50], [336, 280], [300, 50], [1, 1], [320, 100], [300, 250], [300, 100]]]],
			'bids' => []
		],
		'Mob_300250_08' => [
			'div' => 'div-gpt-ad-1548079988588-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50], [300, 100], [320, 100], [300, 250], [336, 280]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"taboola" => [
					"tagId" => "in_article_mob_08"
				],
				"ozone" => [
					"placementId" => "3500017715"
				]
			])
		],
		'Mobile_300250_Quiz' => [
			'div' => 'div-gpt-ad-1715078341074-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [300, 250], [336, 280], [300, 50], [300, 100], [320, 50]]]], 'noMinHeight' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 250], [336, 280], [300, 50], [300, 100], [320, 50]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
				"taboola" => [
					"tagId" => "in_article_mob_quiz"
				],
				"ozone" => [
					"placementId" => "3500017720"
				]
			])
		],
		'Mob_Arbitrage_300250_1_April_2023' => [
			'div' => 'div-gpt-ad-1548079988588-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [1, 1], [300, 50], [320, 100], [336, 280], [320, 50], [300, 250]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 153116,
					"pageId" => 139511
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_Arbitrage_300250_1_April_2023"
				]
			])
		],
		'MatchCenterHeader_300x50' => [
			'div' => 'div-gpt-ad-1548933259437-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]], 'noMinHeight' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50], [300, 100], [320, 100], [300, 250]]
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenterHeader_300x50@300x50"
				],
				"adagio" => [
					"placement" => "Centre Top"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenterHeader_300x50"
				],
				"optidigital" => [
					"placementId" => "MatchCenterHeader_300x50"
				],
				"seedtag" => [
					"adUnitId" => "34319562",
					"placement" => "inBanner"
				],
			])
		],
		'MatchCenter_300x250_2019' => [
			'div' => 'div-gpt-ad-1547097228479-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50], [300, 100], [320, 100]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50], [300, 100], [320, 100]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenter_300x250_2019@300x250"
				]
			])
		],
		'MatchCenter_Commentary_300x250_2021' => [
			'div' => 'div-gpt-ad-1610966688135-0', 'mediaTypes' => ['banner' => ['sizes' => ['fluid', [1, 1], [300, 100], [320, 50], [300, 50], [320, 100], [300, 250]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [320, 50], [300, 50], [320, 100]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_MatchCenter_Commentary_300x250_2021@300x250"
				],
				"adagio" => [
					"placement" => "In - Article"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_MatchCenter_Commentary_300x250"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				],
				"seedtag" => [
					"adUnitId" => "34319559",
					"placement" => "inBanner"
				],
			])
		],
		'Mob_300100_TeamPage1' => [
			'div' => 'div-gpt-ad-1553934815311-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [300, 50], [320, 50], [320, 100]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [300, 50], [320, 50], [320, 100]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300100_TeamPage1@300x250"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_300100_TeamPage_1"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_300100_TeamPage1"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				]
			])
		],
		'Mob_300100_TeamPage2' => [
			'div' => 'div-gpt-ad-1553934886440-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [300, 50], [320, 50], [320, 100]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 100], [300, 50], [320, 50], [320, 100]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300100_TeamPage2@300x100"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_300100_TeamPage_2"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_300100_TeamPage2"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				]
			])
		],
		'Mob_300x50_fixed_homepage_inarticle' => [
			'div' => 'div-gpt-ad-1647967486065-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]], 'mobile' => true,
			'bids' => []
		],
		'MobileFeed-1' => [
			'div' => 'div-gpt-ad-1597678461348-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100]]]], 'native' => true, 'mobile' => true, 'pos' => 3,
			'bids' => []
		],
		'MobileFeed-2' => [
			'div' => 'div-gpt-ad-1597678582290-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100]]]], 'native' => true, 'mobile' => true, 'pos' => 6,
			'bids' => []
		],
		'CMC_Interstitial' => [
			'div' => 'div-gpt-ad-1562932228734-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 600]]]], 'interstitial' => true,
			'bids' => []
		],
		// 'CMC_AfterOversAdunit_288x40' => [ 'div' => 'div-gpt-ad-1584793145287-0', 'mediaTypes' => [ 'banner' => [ 'sizes' => [[288, 40]] ] ]],
		// 'CMC_AfterOversAdunit_288x40_1' => [ 'div' => 'div-gpt-ad-1587734683290-0', 'mediaTypes' => [ 'banner' => [ 'sizes' => [[288, 40]] ] ]],
		// 'CMC_AfterOversAdunit_288x40_2' => [ 'div' => 'div-gpt-ad-1587734773714-0', 'mediaTypes' => [ 'banner' => [ 'sizes' => [[288, 40]] ] ]],
		'InfiniteContent_MOBILE' => [
			'mediaTypes' => ['banner' => ['sizes' => [[300, 250], [336, 280]]]], 'infiniteContent' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_InfiniteContent_MOBILE@300x250"
				],
				"optidigital" => [
					"placementId" => "InfiniteContent_MOBILE"
				]
			])
		], // infinite content dummy ad unit mobile
		'InfiniteContent_DESKTOP' => [
			'mediaTypes' => ['banner' => ['sizes' => [[300, 250], [336, 280]]]], 'infiniteContent' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_InfiniteContent_DESKTOP@300x250"
				],
				"optidigital" => [
					"placementId" => "InfiniteContent_DESKTOP"
				]
			])
		], // infinite content dummy ad unit desktop
		'InHouse_CMC_MOBILE' => ['inhouse' => true],

		// We'll define interstitial ads from prebid but keep the bidders as empty. That way they can only be fulfilled by GAM.
		'Interstitial' => [
			'div' => 'div-gpt-ad-1423053234910-0', 'mediaTypes' => ['banner' => ['sizes' => [[1, 1]]]], 'interstitial' => true,
			'bids' => []
		],
		'Mobileinterstitial' => [
			'div' => 'div-gpt-ad-1426841729957-0', 'mediaTypes' => ['banner' => ['sizes' => [[1, 1]]], 'missenanative' => true], 'interstitial' => true,
			'bids' => []
		],
		'MANAGED_WEB_INTERSTITIAL' => [
			'div' => '', 'mediaTypes' => ['banner' => ['sizes' => [[1, 1]]]], 'managedInterstitial' => true,
			'bids' => []
		],

		// Third party pages
		'Vivo_Landing_Page' => [
			'div' => 'div-gpt-ad-1603102815122-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]], 'sticky' => true,
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [320, 50]]
				],
			])
		],
		'Mob_Vivo_300_250' => [
			'div' => 'div-gpt-ad-1679470763454-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 50], [300, 50], [300, 100], [320, 100], [300, 250]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 50], [300, 50], [300, 100], [320, 100]]
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				]
			])
		],
		'Mob_Transsion_320_100' => [
			'div' => 'div-gpt-ad-1779700532388-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [300, 100], [320, 50], [320, 100]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 50], [300, 100], [320, 50], [320, 100]]
				],
				"nexx360" => [
					"tagId" => "cibnxwtm"
				]
			])
		],
		'Mob_OEM_300250_22Mar' => [
			'div' => 'div-gpt-ad-1679470435532-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 50], [300, 50], [300, 100], [320, 100], [300, 250]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 50], [300, 50], [300, 100], [320, 100]]
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				]
			])
		],
		'Mobile_300250_Fortnite_Item_Shop_1' => [
			'div' => 'div-gpt-ad-1715254292354-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 250], [300, 50], [320, 100], [336, 280], [300, 100], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
				"seedtag" => [
					"adUnitId" => "34316938",
					"placement" => "inArticle"
				],
			])
		],
		'Mobile_300250_Fortnite_Item_Shop_2' => [
			'div' => 'div-gpt-ad-1715254680134-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [320, 50], [320, 100], [300, 250], [336, 280], [300, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
				"seedtag" => [
					"adUnitId" => "34316939",
					"placement" => "inArticle"
				],
			])
		],
		'Mobile_300250_Fortnite_Item_Shop_3' => [
			'div' => 'div-gpt-ad-1715254849215-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 100], [300, 250], [336, 280], [300, 50], [300, 100], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[300, 250], [320, 50], [336, 280]]
				],
				"teads" => [
					"placementId" => 182899,
					"pageId" => 168031
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_300x250_8@300x250"
				],
				"adagio" => [
					"placement" => "Below The Fold"
				],
				"tripleLift" => [
					"inventoryCode" => "Sportskeeda_Mobile_08"
				],
				"kargo" => [
					"placementId" => "_cu575S0T58"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"optidigital" => [
					"placementId" => "Mob_300250_08"
				],
				"seedtag" => [
					"adUnitId" => "34316940",
					"placement" => "inArticle"
				],
			])
		],
		'Mobile_30050_Fortnite_Item_Shop_New' => [
			'div' => 'div-gpt-ad-1719313283157-0', 'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[320, 100], [300, 100], [320, 50], [300, 50]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Mob_330x50_header@320x50"
				],
				"tripleLift" => [
					"inventoryCode" => "Mob_32050_header"
				],
				"kargo" => [
					"placementId" => "_yogBNNthCO"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"nexx360" => [
					"tagId" => "3wn6lqj8"
				],
				"seedtag" => [
					"adUnitId" => "34316943",
					"placement" => "inBanner"
				],
				"taboola" => [
					"tagId" => "in_article_mob_fis"
				],
				"ozone" => [
					"placementId" => "3500017721"
				],
			])
		],
		'Fortnite_Item_Shop_Desktop_728x90' => [
			'div' => 'div-gpt-ad-1720070140076-0', 'mediaTypes' => ['banner' => ['sizes' => [[320, 50], [320, 100], [300, 100], [728, 90], [300, 50]]]],
			'bids' => createBidsArray([
				"ix" => [
					"sizes" => [[728, 90]]
				],
				"teads" => [
					"placementId" => 182901,
					"pageId" => 168033
				],
				"pubmatic" => [
					"adSlot" => "Sportskeeda_Desktop_728x90_2@728x90"
				],
				"sharethrough" => [
					"pkey" => "6ePC2T4vMdNaayXBrp8oeLsF"
				],
				"kargo" => [
					"placementId" => "_bNIS3i0cfu"
				],
				"optidigital" => [
					"placementId" => "Desktop_72890_2"
				],
				"seedtag" => [
					"adUnitId" => "34316919",
					"placement" => "inBanner"
				],
				"taboola" => [
					"tagId" => "in_article_desktop_fis"
				],
				"ozone" => [
					"placementId" => "3500017711"
				],
			])
		],
		'Mob_300250_1_India' => [
			'div' => 'div-gpt-ad-1757338244255-0',
			'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [320, 50], [320, 100], [336, 280], [300, 100], [300, 250]]]],
			'minHeight' => "290px",
			'bids' => [],
		],
		'Desktop_300250_2_India' => [
			'div' => 'div-gpt-ad-1757407077556-0',
			'mediaTypes' => ['banner' => ['sizes' => [[336, 280], [740, 300], [750, 100], [600, 250], [300, 250], [750, 200], [728, 90], [720, 480], [580, 300], [600, 280], [741, 150], [1, 1], [384, 320], [400, 600], [690, 454], [500, 280], [400, 280], [700, 500], [580, 400], [683, 320], [600, 300], [480, 320], [750, 300]]]],
			'bids' => [],
		],
		'MatchCenter_Commentary_300x250_2025' => [
			'div' => 'div-gpt-ad-1758273432584-0',
			'mediaTypes' => ['banner' => ['sizes' => [[300, 100], [336, 280], [300, 50], [320, 100], [300, 250], [320, 50]]]],
			'bids' => [],
		],
		'Mob_300250_FootballMatchCenter_Top' => [
			'div' => 'div-gpt-ad-1778247627408-0',
			'mediaTypes' => ['banner' => ['sizes' => [[300, 50], [300, 100], [300, 250], [320, 50], [320, 100]]]],
			'minHeight' => "200px",
			'bids' => [],
		],
	]
);

// changed for to work with SKM crons as well
if (function_exists('generate_ad')) {
	define(
		'AMP_AD_BLOCKS',
		[
			// Format: 'ad-slot-name' => ['width' => '300', 'height' => '250', 'data-loading-strategy' => 'prefer-viewability-over-views', 'type'=>'doubleclick' , 'data-slot' =>
			// '/11446729/AMP_Mob_300250_1', 'data-multi-size'="300x250"]

			'AMP_Mob_300250_2' => ['attributes' => generate_ad('AMP_Mob_300250_2', '320', '320', '320x320,300x250,250x250,250x200,200x200', '263466bc-9fcc-4791-9bca-58c7f9bc0b2e')],

			'AMP_Mob_300250_3' => ['attributes' => generate_ad('AMP_Mob_300250_3', '320', '320', '320x320,300x250,250x250,250x200,200x200', 'd783d12e-991b-479c-b0e8-4d26139032ee')],

			'AMP_Mob_300250_4' => ['attributes' => generate_ad('AMP_Mob_300250_4', '320', '320', '320x320,300x250,250x250,250x200,200x200', 'ba50b729-ca60-4ae2-bba0-897230968628')],

			'AMP_Mob_300250_5' => ['attributes' => generate_ad('AMP_Mob_300250_5', '320', '320', '320x320,300x250,250x250,250x200,200x200', 'a163310d-7070-439a-89bd-8c0b81f0ccc7')],

			'AMP_Mob_300250_6' => ['attributes' => generate_ad('AMP_Mob_300250_6', '320', '320', '320x320,300x250,250x250,250x200,200x200', '786b481b-0855-4585-8ae3-799fb3dbe74c')],

			'AMP_Mob_300250_8' => ['attributes' => generate_ad('AMP_Mob_300250_8', '300', '250', '300x250,250x250,250x200,200x200')],

			'AMP_Mob_300250_9' => ['attributes' => generate_ad('AMP_Mob_300250_9', '300', '250', '300x250,250x250,250x200,200x200')],

			'AMP_Mob_300250_10' => ['attributes' => generate_ad('AMP_Mob_300250_10', '300', '250', '300x250,250x250,250x200,200x200')],

			'AMP_Mob_300250_11' => ['attributes' => generate_ad('AMP_Mob_300250_11', '300', '250', '300x250,250x250,250x200,200x200')],

			'AMP-Inside-Article' => ['attributes' => generate_ad('AMP-Inside-Article', '300', '250', '300x250')],
			
			'AMPFeed-1' => ['attributes' => generate_ad('AMPFeed-1', '320', '100', '300x50,320x50,300x100,320x100', '9c026a38-b4c0-452b-99fa-2053ac9352ea')],

			'AMPFeed-2' => ['attributes' => generate_ad('AMPFeed-2', '320', '100', '300x50,320x50,300x100,320x100', 'a499c99c-7fd0-403d-bcb8-f3c9b2ad1fe4')],

			'Carousel_Widget_250x100' => ['attributes' => generate_ad('Carousel_Widget_250x100', '300', '100', '300x100')],

			'AMP-Below-Article' => ['attributes' => generate_ad('AMP-Below-Article', '300', '250', '300x250', '8d8afc0b-48ba-4f2d-8c30-8a3aef8a636a')],

			'AMP-Slideshow-300250-1' => ['attributes' => generate_ad('AMP-Slideshow-300250-1', '300', '250', '300x250,250x250,250x200,200x200', 'f3f3c56e-7469-4062-98c5-358f32d827aa')],

			'AMP-Slideshow-300250-2' => ['attributes' => generate_ad('AMP-Slideshow-300250-2', '300', '250', '300x250,250x250,250x200,200x200', '74cc668d-b7f9-4786-9540-1c9a43ef1c64')],

			'AMP-Slideshow-300250-3' => ['attributes' => generate_ad('AMP-Slideshow-300250-3', '300', '250', '300x250,250x250,250x200,200x200', '3dc5e6e7-d592-435a-b13e-d57dc47fdc43')],

			'AMP-Slideshow-300250-4' => ['attributes' => generate_ad('AMP-Slideshow-300250-4', '300', '250', '300x250,250x250,250x200,200x200', '9ea1f71b-f5ad-4c17-8a04-0db1525b7bc6')],

			'AMP_32050_TagPage' => ['attributes' => generate_ad('AMP_32050_TagPage', '320', '50', '', 'e9057963-46b5-41f4-a033-2b9fc0584ee2')],
		]
	);
}
define('COLOMBIA_AD_UNITS', [
	'en' => [
		'slideshow' => [
			'mobile' => 325738,
			'desktop' => 325737,
			'amp' => 325773
		],
		'article' => [
			'mobile' => 215381,
			'desktop' => 208876,
			'amp' => 325099
		]
	],
	'hi' => [
		'slideshow' => [
			'mobile' => 325736,
			'desktop' => 325735,
			'amp' => 325772
		],
		'article' => [
			'mobile' => 208142,
			'desktop' => 208145,
			'amp' => 325100
		]
	],
	'ta' => [
		'slideshow' => [
			'mobile' => 325824,
			'desktop' => 325818,
			'amp' => 325826
		],
		'article' => [
			'mobile' => 325823,
			'desktop' => 325817,
			'amp' => 325825
		]
	]
]);

// --- RELEASE  (from config.php:2847-2847) ---
define('RELEASE', "openads");

// --- SK_ADS_VIDEO_PLAYER_ID (templates/ads/video-players)  (from config.php:3610-3691) ---
define('SK_ADS_VIDEO_PLAYER_ID', [
	"cricket" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"wwe" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"football" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"mma" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"basketball" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"baseball" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"esports" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"tennis" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"nfl" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"pop-culture" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"anime" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"others" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"mock-draft-simulator" => [
		"IN" => "120387",
		"ROW" => "120387"
	],
	"quiz" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"outstream" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"wiki" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"fortnite_shop" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"nfl_playoff_predictor" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"viral-picks" => [
		"IN" => "120058",
		"ROW" => "117676"
	],
	"brainbuster-wwe-player-guessing-game" => [
		"IN" => "120058",
		"ROW" => "117676"
	]
]);

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
    include_once __DIR__ . '/dev-config.php';
} else {
    // --- MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION  (from js-side-menu-config.php:34-34) ---
    define('MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION', BUNDLE_STATIC_URL . '/js/production/pfn-proxy/mockdraft-simulator-bundle-ab8a1ae4f0.js');

    // --- ULTIMATE_SIMULATOR_SCRIPT_LOCATION  (from js-side-menu-config.php:35-35) ---
    define('ULTIMATE_SIMULATOR_SCRIPT_LOCATION', BUNDLE_STATIC_URL . '/js/production/pfn-proxy/ultimate-simulator-bundle-7d18fcab43.js');

    // --- PLAYOFF_PREDICTOR_SCRIPT_LOCATION  (from js-side-menu-config.php:37-37) ---
    define('PLAYOFF_PREDICTOR_SCRIPT_LOCATION', BUNDLE_STATIC_URL . '/js/production/pfn-proxy/playoff-predictor-bundle-cdfa2d2c0c.js');
}

// ============================================================
// SOURCE: routes/sk-proxy.php  (defined at file scope, top of routes)
// ============================================================

// --- PFN_NFL_WEEK_NUMBER + PFN_NFL_LOGO_CACHE_BUSTER  (from routes/sk-proxy.php:68-69) ---
define('PFN_NFL_WEEK_NUMBER', "18");
define('PFN_NFL_LOGO_CACHE_BUSTER', "00008");

// ============================================================
// COMPUTED AT REQUEST TIME
// SOURCE: redirect-url-and-response-filter.php (Slim middleware).
// These are NOT static config values -- they are define()d per-request from
// the device type and Accept-Language. The standalone app must define them at
// bootstrap. Below are the VERBATIM source lines followed by the value each
// resolves to for a PFN-production DESKTOP request (HTTP_PFNORIGINHEADER set,
// APP_LANG='en', DEVICE_TYPE!='mobile', OPERA false).
// ============================================================

// --- LANG  (from redirect-url-and-response-filter.php:9) ---
//   define('LANG', $this->app->environment()[APP_LANG]);
//   -> PFN production: 'en'

// --- FRAMEWORK_URL / API_ENDPOINT_DOMAIN  (from redirect-url-and-response-filter.php:171-172) ---
//   define('FRAMEWORK_URL', FRAMEWORK_URL_HOST ."/". LANG);
//   define('API_ENDPOINT_DOMAIN', API_ENDPOINT_DOMAIN_HOST ."/". LANG);
//   -> FRAMEWORK_URL      = 'https://a-login.sportskeeda.com/en'
//   -> API_ENDPOINT_DOMAIN = 'http://internal-api.sportskeeda.com/en'

// --- GA4_ID  (from redirect-url-and-response-filter.php:250-253, the final else branch) ---
//   } else {
//     define('GA4_ID', GA4_MAP[LANG]);
//     define('REQUEST_FROM_WIKI_DOMAIN', FALSE);
//     $isMainSKSiteC2 = true;
//   }
//   -> PFN production (LANG='en'): GA4_MAP['en'] = 'G-T41EZF14QW'

// --- IS_MOBILE / IS_DESKTOP  (from redirect-url-and-response-filter.php:306-308, desktop branch) ---
//   define('IS_MOBILE', FALSE);
//   define('IS_DESKTOP', TRUE);
//   define('VERSION_AND_DEVICE', RELEASE . 'desktop');
//   -> Desktop tool render: IS_MOBILE=FALSE, IS_DESKTOP=TRUE
//   (mobile branch, lines 302-304: IS_MOBILE=TRUE, IS_DESKTOP=FALSE)

// ------------------------------------------------------------
// Concrete defines for the request-time constants above.
// In the parent app these are set per-request by the
// redirect-url-and-response-filter.php Slim middleware, which this standalone
// does not run. Values below are the resolved PFN-production DESKTOP values.
// (LANG comes first: FRAMEWORK_URL/API_ENDPOINT_DOMAIN/GA4_ID depend on it.)
// ------------------------------------------------------------
define('LANG', 'en');
define('FRAMEWORK_URL', FRAMEWORK_URL_HOST . "/" . LANG);
define('API_ENDPOINT_DOMAIN', API_ENDPOINT_DOMAIN_HOST . "/" . LANG);
define('GA4_ID', GA4_MAP[LANG]);
define('IS_MOBILE', FALSE);
define('IS_DESKTOP', TRUE);
define('VERSION_AND_DEVICE', RELEASE . 'desktop');
