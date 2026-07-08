<?php
// helpers-extract.php
// VERBATIM transitive PHP function closure for the 4 PFN tool routes:
//   playoff-predictor, mockdraft-simulator, mockdraft-simulator-widget, ultimate-simulator
// Each function copied byte-for-byte from source. Do not edit.

// from functions.php:130
// Called from Smarty expression syntax in common/widgets/index.tpl
// (e.g. {$x = NTernary($widget["containerClasses"], "")}); Smarty permits the
// global PHP function only if it exists at compile time, so it must be defined here.
function NTernary() {
    $args = func_get_args();

    for ($i = 0; $i < count($args); $i++) {
        $arg = $args[$i];

        if (isset($arg) && !empty($arg)) {
            return $arg;
        }
    }

    return false;
}

// from routes/sk-proxy.php:12
function restrictAccess($app) {
  $queryParam = $app->request->params("debug__proxy_tools");
  $pfnHeader = $app->request->headers->get("PFNOriginHeader");

  if (!$queryParam && !$pfnHeader) {
    $app->redirect("/error/404");
  }

  return;
}

// from routes/sk-proxy.php:53
function parseJsonFile($filePath, $defaultValue = []) {
  if (file_exists($filePath)) {
    $jsonData = file_get_contents($filePath);
    return json_decode($jsonData, true);
  }
  return $defaultValue;
}

// from routes/sk-proxy.php:1859
function convertMDSDataToNumber(array &$item, array $keys) {
  foreach ($keys as $key) {
    if (!isset($item[$key])) continue;

    $val = $item[$key];

    if ($val === "" || $val === null) {
      // leave blank as-is
      continue;
    }

    if (is_numeric($val)) {
      // convert automatically to int or float
      $item[$key] = $val + 0;
    }
  }
}

// from routes/sk-proxy.php:1877
function convertMDSDataToBool(array &$item, array $keys) {
  foreach ($keys as $key) {
    if (!isset($item[$key])) continue;

    $val = strtolower(trim((string)$item[$key]));

    if ($val === "1" || $val === "true" || $val === "yes") {
      $item[$key] = true;
    } else if ($val === "0" || $val === "false" || $val === "no") {
      $item[$key] = false;
    }
  }
}

// from routes/sk-proxy.php:1891
function mapMDSData($json) {
  $picks = [];
  $players = [];
  $teams = [];
  $player_trades = [];

  foreach ($json['collections'] as $sheet) {

    $sheetName = $sheet['sheetName'];
    $data = $sheet['data'];

    if (empty($data) || !is_array($data)) {
      continue;
    }

    // -----------------------------------
    // First row contains headers
    // -----------------------------------
    $headers = array_shift($data);

    $rows = [];
    foreach ($data as $row) {
      // Ensure row matches header count
      if (count($row) !== count($headers)) {
        $row = array_pad($row, count($headers), "");
      }
      $rows[] = array_combine($headers, $row);
    }

    // -----------------------------------
    // PLAYERS
    // -----------------------------------
    if ($sheetName === "mds_players") {
      foreach ($rows as &$p) {
        convertMDSDataToNumber($p, [
          "number",
          "score",
          "plWeight",
          "pickCap",
          "pickModifier"
        ]);
      }
      unset($p);
      $players = $rows;
    }

    // -----------------------------------
    // PICKS LIST
    // -----------------------------------
    if ($sheetName === "mds_picks") {

      foreach ($rows as &$p) {
        // numeric fields
        convertMDSDataToNumber($p, [
          "number",
          "value"
        ]);

        // boolean fields
        convertMDSDataToBool($p, [
          "futurePick",
          "tradeUpPick",
          "onTheClock",
        ]);
      }
      unset($p);

      $picks = $rows;
    }

    // -----------------------------------
    // TEAMS LIST
    // -----------------------------------
    if ($sheetName === "mds_teams") {

      foreach ($rows as &$t) {

        // numeric fields
        convertMDSDataToNumber($t, [
          "tradeCount",
          "qbCount",
          "needQB",
          "needRB",
          "needWR",
          "needTE",
          "needOT",
          "needOG",
          "needOC",
          "needEDGE",
          "needDT",
          "needLB",
          "needCB",
          "needS"
        ]);

        // boolean fields
        convertMDSDataToBool($t, [
          "isUser",
          "tradeTargetTeam",
          "tradeUserTeam"
        ]);

        // JSON decode fields
        foreach (["doNotDraft", "draftedPlayers", "draftPicks", "penaltyPOS"] as $jsonField) {
          if (!isset($t[$jsonField])) continue;
          if ($t[$jsonField] === "") continue;

          $decoded = json_decode($t[$jsonField], true);
          if (json_last_error() === JSON_ERROR_NONE) {
            $t[$jsonField] = $decoded;
          }
        }
      }
      unset($t);

      $teams = $rows;
    }

    // -----------------------------------
    // PLAYER TRADES
    // -----------------------------------
    if ($sheetName === "player_trades") {
      foreach ($rows as &$pt) {
        convertMDSDataToNumber($pt, [
          "Value"
        ]);
      }
      unset($pt);
      $player_trades = $rows;
    }

    if ($sheetName === "constants") {
      $values  = array_shift($data);
      $constants = array_combine($headers, $values);
  
      // Fields that must be INT
      $numericFields = [
        "pickstart",
        "maxPicksInPackage",
        "blockTradeUpPick",
        "tier1Multiplier",
        "tier2Multiplier",
        "tier3Multiplier",
        "top5PlayerFloor",
        "needCoefficient",
        "lateNeedCoefficient",
        "lateRoundCeiling",
        "lateRoundFloor",
        "top5Threshold",
        "lateRoundThreshold",
        "top5playervalue",
        "top5pickvalue"
      ];

      // Fields that must be arrays of FLOAT (to preserve decimals)
      $arrayFields = [
        "roundends",
        "tradeinittoppick",
        "tradeinittopten",
        "tradeinitfirst",
        "tradeinitallelse",
        "poolslice",
        "highpickvalues",
        "midpickvalues",
        "lowpickvalues"
      ];

      // roundWeights is a special key:value format "1:30,2:20,..."
      // Stored as a raw JS object literal so the template can emit unquoted numeric keys.
      if (isset($constants["roundWeights"]) && trim($constants["roundWeights"]) !== "") {
        $rwPairs = array_map("trim", explode(",", $constants["roundWeights"]));
        $rwParts = [];
        foreach ($rwPairs as $pair) {
          $parts = explode(":", $pair);
          if (count($parts) === 2) {
            $rwParts[] = (int)trim($parts[0]) . ":" . (int)trim($parts[1]);
          }
        }
        $constants["roundWeights"] = "{" . implode(",", $rwParts) . "}";
      } else {
        $constants["roundWeights"] = "{1:30,2:20,3:15,4:5,5:4,6:3,7:1}";
      }
  
      // Convert numeric fields → int
      foreach ($numericFields as $nf) {
        if (isset($constants[$nf]) && is_numeric($constants[$nf])) {
          $constants[$nf] = (int)$constants[$nf];
        }
      }
  
      // Convert array CSV fields → float[]
      foreach ($arrayFields as $af) {
        if (!isset($constants[$af]) || trim($constants[$af]) === "") {
          $constants[$af] = [];
          continue;
        }

        $constants[$af] = array_map(
          "floatval",
          array_filter(
            array_map("trim", explode(",", $constants[$af])),
            fn($v) => $v !== ""
          )
        );
      }
    }
  }

  return [
    "picks"         => $picks,
    "players"       => $players,
    "teams"         => $teams,
    "player_trades" => $player_trades,
    "constants"     => $constants
  ];
}

// from routes/sk-proxy.php:2108
function checkMDSDataisValid($filesData) {
  if (!isset($filesData['collections']) || !is_array($filesData['collections']) || empty($filesData['collections'])) {
    return true;
  }

  foreach ($filesData['collections'] as $sheet) {
    if (!isset($sheet['data']) || !is_array($sheet['data'])) {
      return true;
    }

    if ($sheet['sheetName'] === 'constants') {
      if (
        count($sheet['data']) < 2 ||
        !isset($sheet['data'][1]) ||
        !is_array($sheet['data'][1]) ||
        count($sheet['data'][1]) <= 2
      ) {
        return true;
      }
    } else {
      if (count($sheet['data']) <= 2) {
        return true;
      }
    }
  }

  return false;
}

// from routes/sk-proxy.php:3515
function collectConferenceTeams($conferenceTeams, $allTeams) {
  $teamsCollection = [];
  for ($i = 0; $i < count($conferenceTeams); $i++) {
    for ($j = 0; $j < count($allTeams); $j++) {
      if ($allTeams[$j]['shortName'] === $conferenceTeams[$i]){
        array_push($teamsCollection, $allTeams[$j]);
      }
    }
  }

  return $teamsCollection;
}

// from routes/sk-proxy.php:3528
function setNFLTeamLogoPathForMDS($teams) {
  for ($i = 0; $i < count($teams); $i++) {
    $logoPath = str_replace("/mockdraft/nfl-team-logos/", "", $teams[$i]["teamLogo"]);
    $logoPath = str_replace("gif", "png", $logoPath);
    $teams[$i]["teamLogo"] = $logoPath;
  }

  return $teams;
}

// from routes/sk-proxy.php:4761
function preparePFNMenuData(&$templateData, $categoryLabel, $selectedLabel) {
  if ($templateData["brand"] !== "pfn") {
    return;
  }
  
  $categories = parseJsonFile("templates/third-party/proxy/pfn/common/header-navigation/secondary-nav-data.json");

  $templateData['header_menu_data'] = parseJsonFile("data/pfn/main-menu-data.json", []);
  $templateData['category_links'] = isset($categories[$categoryLabel]) ? $categories[$categoryLabel] : [];
  $templateData['category_label'] = isset($categoryLabel) ? $categoryLabel : "";
  $templateData['active_category'] = isset($selectedLabel) ? $selectedLabel : "";

  $names = [];
  $urls = [];
  
  foreach ($templateData['header_menu_data'] as $item) {
    $names[] = '"' . $item['itemTitle'] . '"';
    $urls[] = '"' . $item['itemUrl'] . '"';
  }
  
  $templateData['siteNavigationNames'] = implode(', ', $names);
  $templateData['siteNavigationLinks'] = implode(', ', $urls);
}

// from routes/sk-proxy.php:5036
function appendFaqsToPageContent($pageContent, $faqs, $faqHeading = "FAQs") {
  if (empty($faqs) || !is_array($faqs)) {
    return $pageContent;
  }
  
  $faqHtml = "<h2 id=\"faq-heading\">" . htmlspecialchars($faqHeading) . "</h2>\n";
  
  foreach ($faqs as $faq) {
    $faqHtml .= "<h3>" . htmlspecialchars($faq['question']) . "</h3>\n";
    $faqHtml .= "<p>" . $faq['answer'] . "</p>\n";
  }
  
  return $pageContent . "\n" . $faqHtml;
}

// from routes/sk-proxy.php:5051
function addPageMetadata(&$template_data, $taxonomy_slug) {
  $url = API_ENDPOINT_DOMAIN . '/v1/taxonomy/'. $taxonomy_slug;

  $page_data = do_curl($url, $statusCode);
  $page_data = json_decode($page_data, true);

  if (empty($page_data["term_taxonomy_id"])) {
    return;
  }

  if ($page_data["taxonomy"] != "data_subpage") {
    return;
  }

  $pageContent = sanitize_article_contents($page_data["termMetaObject"]["data_subpage_info"], false);
  $meta_title = $page_data["termMetaObject"]["seo_page_title"];
  $header_text = $page_data["name"];
  $meta_description = $page_data["termMetaObject"]["meta_desc"];
  $meta_robots_tag = $page_data["termMetaObject"]["seo_robots_tag"];
  $faqs = $page_data["faq"];
  $faq_section_title = $page_data["termMetaObject"]["faq_section_title"] ?? "FAQs";
  $pageContent = appendFaqsToPageContent($pageContent, $faqs, $faq_section_title);

  if (!empty($faqs) && is_array($faqs)) {
    if (!isset($template_data['head_fragments'])) {
      $template_data['head_fragments'] = array();
    }
    
    $faq_schema_path = "templates/common/faq/faq-schema.tpl";
    if (!in_array($faq_schema_path, $template_data['head_fragments'])) {
      $template_data['head_fragments'][] = $faq_schema_path;
    }
  }

  $template_data["seo_title"] = $meta_title;
  $template_data["meta_description"] = $meta_description;
  $template_data["seo_robots_tag"] = $meta_robots_tag;
  $template_data["page_text_content"] = $pageContent;
  $template_data["faq"] = $faqs;
  $template_data["header_text"] = $header_text;
  $template_data["allow_site_scaling"] = true;
  $template_data["setHtmlLangAttribute"] = true;

  $template_data["schemas"] = array(
    "third-party/proxy/pfn/common/schemas/webpage.tpl",
    "third-party/proxy/pfn/common/schemas/newsMediaOrganization.tpl",
    "third-party/proxy/pfn/common/schemas/siteNavigationElement.tpl",
    "third-party/proxy/pfn/common/schemas/website.tpl",
  );
}

// from routes/sk-proxy.php:5102
function getPFNToolSubpageSlug($tool) {
  $subpageSlugMapping = [
    "Playoff Predictor" => "c6e9b54f-008a-42b8-b5b1-0e70d8efd572",
    "Start Sit Optimizer" => "4ae54c80-d8ec-4924-bb2c-ebe054cb58c0",
    "NFL Schedule" => "8facc2a3-3bc9-4ecd-90bc-cc3406607c1e",
    "NBA Mock Draft Simulator" => "56e36780-f618-42dc-bbfd-3c1b4845b31d",
    "NBA Player Guessing Game" => "6e372974-d728-4f1e-b14a-c891e1ff7727",
    "Betting Odds Calculator" => "b41e7b97-7cde-468a-9107-f0dc97ba42c8",
    "Parlay Calculator" => "ceee79d0-f9fb-4a0a-bb20-1c48ce7205f8",
    "NFL DFS Optimizer" => "f4b7ee33-7a8a-49f7-a88d-dcc2efea7a95",
    "NFL Draft Order" => "94fc4105-c02d-4076-92e7-525283eed1d4",
    "Fantasy Team Name Generator" => "544fae1e-552f-486a-a9fd-61850f9f4c82",
    "NFL Fantasy Mock Draft Simulator" => "2ad928fc-a3ac-490e-9f96-eb6f9da33d0c",
    "NFL Salary Cap Tracker" => "1232198e-cbac-4bb1-a288-08c5e8ba0493",
    "Waiver Wire" => "bdcaf468-3f1b-438c-9fbf-7637151576b3",
    "Trade Analyzer" => "2d67d558-ae9d-4c75-9733-5122c79a5936",
    "Who Should I Draft" => "82dce854-9722-4957-9e9b-1a2f2ee6a491",
    "NFL Offseason Manager" => "bcbe7791-2f06-4d66-9673-4a1467412bae",
    "NFL Draft Big Board Builder" => "6c50c28e-7b3c-40ff-8208-41e2d768dd92",
    "NFL Draft Prospect Rankings" => "e6174b8f-60b2-4ff7-b548-e8d7928ebc09",
    "NFL Word Search" => "5815c632-1533-4cac-bdda-863eb92b3cc2",
    "WWE Guessing Game" => "c1c9ca67-252c-4251-bd5f-9b28b3632a76",
    "ros-rest-of-season-fantasy-ppr-rankings" => "e4d55ac4-6f1a-4954-b0b2-a467a9002831",
    "ros-rest-of-season-fantasy-half-ppr-rankings" => "f5a7fbfa-d42e-422f-addb-5b5f8f3713ef",
    "ros-rest-of-season-fantasy-non-ppr-rankings" => "caa76ee3-1e47-48d8-bc7e-2d9ee810940d",
    "ros-rest-of-season-fantasy-qb-rankings" => "5fbb838b-99ac-4d4a-8a21-37a837f1092e",
    "ros-rest-of-season-fantasy-wr-rankings" => "d9d8ad3f-d4fe-4351-93db-7e982df0b6d8",
    "ros-rest-of-season-fantasy-rb-rankings" => "8fe8dc33-ea59-4eac-9546-d03edc4b569f",
    "ros-rest-of-season-fantasy-te-rankings" => "39ce6d28-d3fd-42e7-8b66-f8fddc07c824",
    "ros-rest-of-season-fantasy-defense-rankings" => "fadc2029-e290-4e89-9307-aadd7ad8acda",
    "ros-rest-of-season-fantasy-kicker-rankings" => "c970ee77-2c52-44b5-9f23-1de84a204375",
    "ros-rest-of-season-fantasy-football-rankings" => "4daf1ee1-c47d-418b-a523-6d2139f1da24",
    "dynasty-fantasy-football-qb-rankings" => "5308d4ff-2d8a-4b95-9326-70ba6123d11e",
    "dynasty-fantasy-football-rb-rankings" => "54569350-8407-43fd-90a7-ecd64deb840c",
    "dynasty-fantasy-football-wr-rankings" => "8851e5f7-f21a-4378-822d-714607e21367",
    "dynasty-fantasy-football-te-rankings" => "09fd951e-861e-4233-819f-fd2b3f9e549f",
    "dynasty-ppr-fantasy-football-rankings" => "3384632e-2caa-4eff-b8fb-ccd8e1ab36bb",
    "dynasty-non-ppr-fantasy-football-rankings" => "2a25d182-8801-42c9-acbc-40d4e0465e73",
    "dynasty-fantasy-football-rankings" => "80c3c9e6-0215-4201-9f51-f33aeee20791",
    "dynasty-half-ppr-fantasy-football-rankings" => "327b7cc8-5fa0-4615-a39f-8d500faa5cee",
    "fantasy-football-rankings" => "6de12625-04b8-47ab-b0ad-f3eb7f693476",
    "fantasy-football-qb-rankings" => "2923b500-4f7a-4b65-bafb-aa9770813b4a",
    "fantasy-football-rb-rankings" => "d721b600-929a-44dc-ad00-df94ce55b38d",
    "fantasy-football-wr-rankings" => "8c948f3f-6938-4896-bd66-48425c6b675c",
    "fantasy-football-te-rankings" => "1016560a-e09d-4484-8bb5-d845d48a4ebd",
    "fantasy-football-kicker-rankings" => "1a07b25d-6105-44bb-9cc0-c1928849ef11",
    "fantasy-football-defense-rankings" => "efc887d2-88cd-424b-a810-a4ae3375671f",
    "Fantasy Football Trade Value Charts" => "1e97b165-c325-46f3-bb3e-e989328a4a7a",
    "Dynasty Fantasy Football Trade Value Charts" => "06a8f9f8-fee1-40d9-8351-1cb0f632df54",
    "CFB Playoff Predictor" => "45abf76c-93be-496c-a149-41f6acc86b62",
    "Baseball Trade Analyzer" => "b6dab5aa-0172-49e5-a118-2d1f475f3a59",
    "NFL Player Rankings Tool" => "f7519f43-afb8-4e46-b3c7-ba3ae477ed00",
    "NFL Player Guessing Game" => "7ea59241-0415-4760-b866-8c44f5947471",
    "NFL Draft Prospect Guessing Game" => "c8d51b2c-5c5f-441c-8e34-aa438363b3be",
    "MLB Playoff Predictor" => "9596674b-332a-4b99-81fc-ed00a8721324",
    "NFL Power Rankings" => "739deac4-9f92-4884-b896-c334d429ee8f",
    "NBA Playoff Predictor" => "349db2ad-17a7-43a7-840b-00f8e21a2e76",
    "NFL Connections Game" => "74bd5c60-2f16-4399-b2bc-5fe83fb73170",
    "NFL Ultimate GM Simulator" => "b2c4d786-00f8-4dfc-9bef-fb27a1c3b6e1",
    "FIFA World Cup Simulator" => "ad168211-5952-4e25-bad3-b46e8a1b93b3",
    "Tennis Simulator" => "21b84d24-18bd-42bf-bab3-636541adb628",
    "NASCAR Predictor" => "c977eba7-c752-4fbb-b717-caf17a5c013a",
    "CBB Predictor" => "baf4ac81-e068-4c00-830e-ad716c663bfe",
  ];

  return $subpageSlugMapping[$tool];
}

// from routes/sk-proxy.php:5170
function getPFNSecondaryNavigationData() {
  $dataUrl = "https://statics.sportskeeda.com/assets/sheets/nav-data/navData.json";
  $staticData = do_curl($dataUrl, $status_code);
  $decodedData = json_decode($staticData, TRUE);

  $result = [];
  
  // Find the grey_bar sheet
  foreach ($decodedData['collections'] as $collection) {
    if ($collection['sheetName'] !== 'grey_bar' || $collection['sheetName'] !== 'footer') {
      $data = $collection['data'];
      
      if (!isset($data)) {
        return [];
      }
      
      $categories = [];
      $currentCategory = null;
      
      // Skip the header row
      array_shift($data);
      
      foreach ($data as $row) {
        $label = $row[0] ?? null;
        $link = $row[1] ?? null;
        
        if ($label && !$link) {
          // This is a category header
          $currentCategory = $label;
          $categories[$currentCategory] = [];
        } elseif ($label && $link && $currentCategory) {
          // This is a navigation item under a category
          $categories[$currentCategory][] = [
            'label' => $label,
            'url' => $link
          ];
        }
      }

      if ($collection['sheetName'] === 'grey_bar') {
        $result["secondaryNav"] = $categories;
      }
      if ($collection['sheetName'] === 'footer') {
        $result["footer"] = $categories;
      }

      $categories = [];
    }
  }

  return $result;
}

// from routes/sk-proxy.php:5223
function preparePFNSecondaryNav(&$templateData, $categoryLabel, $selectedLabel) {
  $result = getPFNSecondaryNavigationData();
  $templateData['category_links'] = isset($result["secondaryNav"][$categoryLabel]) ? $result["secondaryNav"][$categoryLabel] : [];
  $templateData['category_label'] = isset($categoryLabel) ? $categoryLabel : "";
  $templateData['active_category'] = isset($selectedLabel) ? $selectedLabel : "";
  $templateData['footer'] = isset($result["footer"]) ? $result["footer"] : "";
}

// from routes/horizontal-pages.php:1614
function getTeamPickSequenceForMDS($picks) {
    $teamPicks = [];
    $teamNames = [];
    foreach($picks as $pick) {
        if(!in_array($pick['shortName'], $teamNames)) {
            array_push($teamPicks, $pick);
            array_push($teamNames, $pick['shortName']);
            if (count($teamPicks) == 32) {
                break;
            }
        }
    }

    return $teamPicks;
}

// from routes/horizontal-pages.php:1630
function addLogoToMDSTeams($teams, $pics) {
    $newPics = [];
    foreach($pics as $picskey=>$picsvalue) {
        foreach($teams as $teamKey=>$teamValue) {
            if ($teamValue['shortName'] == $picsvalue['shortName']) {
                $picsvalue['teamLogo'] = $teamValue['teamLogo'];
                array_push($newPics, $picsvalue);
            }
        }
    }

    return $newPics;
}

// from functions.php:3
function do_curl($url, &$status_code, $time_out = 2) {
    $warning_threshold = 3;
    $start = microtime(TRUE);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $time_out);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'SK-Internal-NON-Blocking');//TODO: check if this can be added here
    $data = curl_exec($ch);
    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $difference = microtime(TRUE) - $start;
    if($difference > $warning_threshold) {
        error_log("WARN: CURL $difference sec " . $url);flush();
    }
    // Not logging `else` case as this will lead to huge log file size
    return $data;
}

// from functions.php:146
function get_brand_login_url($app, $brand) {
    $pfnRequestUri = $app->request->headers->get('PFNOriginHeader');

    $rootUrl = $app->request->getUrl();
    $resourceUri = $app->request->getResourceUri();
    if (!$pfnRequestUri) {
        return $rootUrl . "/sk-proxy/$brand/login?debug__proxy_tools=true&after-login=" . $rootUrl . $resourceUri . "?debug__proxy_tools=true";
    }

    return PFN_URL . "/login?after-login=" . PFN_URL . "/mockdraft";
}

// from functions.php:221
function generateDataIntegrationAssetsPath($relativePath) {
    if (defined("ENVIRONMENT")) {
        $bucket = "sheets_test";

        if (strtoupper((ENVIRONMENT)) == "PRODUCTION") {
            $bucket = "sheets";
        }

        return "assets/$bucket/$relativePath";
    }

    return $relativePath;
}

// from functions.php:15370
function generateAdPlaceholderMarkup($variant = "") {
    if ($variant == "fluid" && !IS_MOBILE) {
        $variant = "default";
    }

    if ($variant == "default") {
        return '
            <div class="ad-placeholder default-variant">
                <div class="ad-placeholder-box">
                    <span>Ad</span>
                </div>
            </div>
        ';
    } else if ($variant == "fluid-transparent-header") {
        return '
            <div class="ad-placeholder fluid-transparent-header-variant">
                <div class="ad-placeholder-box">
                    <span>ADVERTISEMENT</span>
                </div>
            </div>
        ';
    } else if ($variant == "fluid") {
        return '
            <div class="ad-placeholder fluid-variant">
                <div class="ad-placeholder-box">
                    <span>ADVERTISEMENT</span>
                </div>
            </div>
        ';
    }
}

// from functions.php:15595
function getFeaturedToolsQuickLinksWidgetForPFN() {
    return [
        "section" => "quick-links-widget",
        "heading" => "Featured Tools",
        "templateFile" => "common/widgets/taxonomy/quick-links/index.tpl",
        "templateData" => [
            "identifier" => "featured-tools-pfn",
            "groups" => [
                [
                    "heading" => "",
                    "links" => [
                        "Mock Draft Simulator" => "/mockdraft/",
                        "NFL Playoff Predictor" => "/nfl-playoff-predictor/",
                        "Fantasy Football Trade Analyzer" => "/fantasy-football-trade-analyzer/",
                        "Start/Sit Optimizer" => "/who-should-i-start-fantasy-optimizer/",
                        "Fantasy Football Draft Assistant" => "/who-should-i-draft-fantasy-football/",
                        "Fantasy Football Name Generator" => "/fantasy-football-team-name-generator/",
                        "Fantasy Football News Tracker" => "/nfl-player-news-injuries-transactions-fantasy/",
                        "DFS Lineup Optimizer" => "/nfl-dfs-optimizer-lineup-generator/",
                        "Word Fumble: The NFL Wordle" => "/nfl-word-fumble-player-name-game/",
                        "NFL Betting Odds Calculator" => "/nfl-betting/betting-odds-calculator/",
                        "NFL Betting Parlay Calculator" => "/nfl-betting/parlays-calculator/",
                        "NFL Waiver Wire" => "/fantasy-football-waiver-wire/",
                        "Player Guessing Game" => "/nfl-player-guessing-game/",
                        "Offseason Manager" => "/nfl-offseason-salary-cap-free-agency-manage/"
                    ],
                ],
            ],
        ],
    ];
}

// from functions.php:15860
function getStaticUrlConfig() {
    if (defined("ONLYWORDGAMES") && ONLYWORDGAMES) {
        return "//static.onlywordgames.com";
    }

    if (defined("CricRocketOriginHeader") && CricRocketOriginHeader) {
        return "//static.cricrocket.com";
    }

    if (defined("PROFOOTBALLNETWORK") && PROFOOTBALLNETWORK) {
        return "//staticd.profootballnetwork.com";
    }

    return "//static.sportskeeda.com";
}

// from routes/article.php:2793
function sanitize_article_contents($content, $removeLineBreaks = true)
{
    $content = preg_replace('/<p dir="ltr">&nbsp;<\/p>/', '<br />', $content);
    $content = preg_replace('/<p>&nbsp;<\/p>/', '<br />', $content);
    $content = preg_replace('/<p>&#8203;<\/p>/', '<br />', $content);
    $content = preg_replace('/\n/', '', $content);
    // replace any no breaking space from the content with a empty space
    // &nbsp; cannot be broken by word wrap so could result in overflow
    $content = preg_replace('/&nbsp;/i', " ", $content);
    if (!$removeLineBreaks) {
        return $content;
    }

    $dom = new DOMDocument();
    $dom->loadHTML(mb_convert_encoding('<html>' . $content . '</html>', "HTML-ENTITIES", "UTF-8"), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    $brs = $dom->getElementsByTagName('br');
    $elementsToRemove = array();
    foreach ($brs as $br) {
        /** @var DOMElement $parent_of_br */
        $parent_of_br = $br->parentNode;

        // Table cells generally tend to have data in new lines to create a list type. Hence we need to avoid removing <br> from there
        if ($parent_of_br->tagName == "td") {
            continue;
        }

        // if the <br> lies inside a tweet we don't remove it
        if (!$parent_of_br->hasAttribute('class') || strpos($parent_of_br->getAttribute('class'), 'tweet-body') === FALSE) {
            array_push($elementsToRemove, $br);
        }
    }
    $blockquotes = $dom->getElementsByTagName('blockquote');
    foreach ($blockquotes as $blockquote) {
        // Remove blockquote with `app-tweet-blockquote` class as it's hidden and not needed in web.
        // Only needed for android app to provider backward compatibility
        if ($blockquote->hasAttribute('class') && strpos($blockquote->getAttribute('class'), 'app-tweet-blockquote') !== FALSE) {
            array_push($elementsToRemove, $blockquote);
        }
    }

    // Remove the inlinks which are not needed in web
    $blockListDomains = ["soapcentral.com"];
    $anchorTagsToReplace = [];
    $anchorTags = $dom->getElementsByTagName("a");
    foreach ($anchorTags as $anchorTag) {
        if ($anchorTag->hasAttribute("href")) {
            $href = $anchorTag->getAttribute("href");
            foreach ($blockListDomains as $blockListDomain) {
                if (strpos($href, $blockListDomain) !== false) {
                    $anchorTagsToReplace[] = $anchorTag;
                    break; // No need to check other domains once a match is found
                }
            }
        }
    }

    foreach ($anchorTagsToReplace as $anchorTag) {
        $textNode = $dom->createTextNode($anchorTag->textContent);
        $anchorTag->parentNode->replaceChild($textNode, $anchorTag);
    }

    foreach ($elementsToRemove as $ele) {
        $ele->parentNode->removeChild($ele);
    }
    $content_transformed = $dom->saveHTML();
    $content_transformed = str_replace(array('<html>', '</html>'), '', $content_transformed);
    return $content_transformed;
}


// ===== PFN header-menu cron helpers =====
// Used by cronjobs/pfn/pfn-menu-cron.php (+ templates/third-party/proxy/pfn/common/functions.php)
// to refresh data/pfn/main-menu-data.json. Verbatim from the parent functions.php.

// from functions.php:14783
function cron_log_message($str)
{
  date_default_timezone_set('Asia/Kolkata');
  $str = PHP_EOL . $str;
  $str .= ' at ' . date("h:i:sa") . ' on ' . date("d M Y") . PHP_EOL . '-------------------------------------';
  error_log($str);
}

// from functions.php:14791
function cron_info_log_message($str)
{
  date_default_timezone_set('Asia/Kolkata');
  $str = PHP_EOL . $str;
  $str .= ' at ' . date("h:i:sa") . ' on ' . date("d M Y") . PHP_EOL . '-------------------------------------';
	print($str);
}

// from functions.php:15918
function fetch_data_with_curl_multi($urls, $auth_key)
{
  $mh = curl_multi_init();
  $ch = [];
  $responses = [];

  foreach ($urls as $key => $url) {
    $ch[$key] = curl_init($url);
    $headers = ['Authorization: ' . $auth_key];

    curl_setopt($ch[$key], CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch[$key], CURLOPT_TIMEOUT, 10);
    curl_setopt($ch[$key], CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch[$key], CURLOPT_USERAGENT, 'SK-Internal-NON-Blocking');
    curl_setopt($ch[$key], CURLOPT_HTTPHEADER, $headers);

    curl_multi_add_handle($mh, $ch[$key]);
  }

  $active = null;
  do {
    $mrc = curl_multi_exec($mh, $active);
  } while ($mrc == CURLM_CALL_MULTI_PERFORM);

  while ($active && $mrc == CURLM_OK) {
    if (curl_multi_select($mh) != -1) {
      do {
        $mrc = curl_multi_exec($mh, $active);
      } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    }
  }

  foreach ($ch as $key => $channel) {
    if (curl_errno($channel)) {
      cron_log_message("cURL error on URL $urls[$key]: " . curl_error($channel));
      $responses[$key] = null;
    } else {
      $response = curl_multi_getcontent($channel);
      $responses[$key] = json_decode($response, true);
    }
    curl_multi_remove_handle($mh, $channel);
    curl_close($channel);
  }

  curl_multi_close($mh);

  return $responses;
}
