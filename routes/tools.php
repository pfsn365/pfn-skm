<?php
/**
 * The 4 extracted PFN tool routes, copied verbatim from the parent
 * routes/sk-proxy.php. Helper functions and constants they depend on live in
 * ../helpers.php and ../config.php (the *_SCRIPT_LOCATION bundle constants,
 * originally in js-side-menu-config.php, are consolidated into config.php).
 *
 *   /sk-proxy/:brand/playoff-predictor          (parent sk-proxy.php:1450)
 *   /sk-proxy/:brand/mockdraft-simulator         (parent sk-proxy.php:2137)
 *   /sk-proxy/:brand/mockdraft-simulator-widget  (parent sk-proxy.php:2300)
 *   /sk-proxy/:brand/ultimate-simulator          (parent sk-proxy.php:4352)
 *
 * Reach a tool with ?debug__proxy_tools=true (restrictAccess guard).
 */

// ===== playoff-predictor (sk-proxy.php:1450-1510) =====

$app->get('/sk-proxy/:brand/playoff-predictor', function ($brand) use ($app) {
  restrictAccess($app);

  $template_data = array(
    'meta_keywords' => 'nfl playoff predictor, playoff predictor',
    'brand' => $brand,
    'tool' => 'playoff-predictor',
    'adv_in_content' => false,
    'canonical_url' => 'https://www.profootballnetwork.com/nfl-playoff-predictor',
    'slug' => 'nfl-playoff-predictor',
    'bodyClasses' => 'no-outstream-player raptive-pfn-disable-footer-close',
    'add_header_navigation' => true,
    'include_right_sidebar' => false,
    'content_width' => 'full-width',
    'updated_timestamp' => "---",
    'logo_cache_buster' => "?ver=" . PFN_NFL_LOGO_CACHE_BUSTER,
    'nfl_teams' => [
      'ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN','DET','GB',
      'HOU','IND','JAX','KC','LV','LAC','LAR','MIA','MIN','NE','NO','NYG','NYJ',
      'PHI','PIT','SF','SEA','TB','TEN','WAS'
    ],
    'send_page_view_event' => true,
    'is_desktop' => $app->is_desktop,
    'data_source_path' => generateDataIntegrationAssetsPath('tools/playoff_predictor/'),
    'feeds_source_path' => generateDataIntegrationAssetsPath("tools/playoff_predictor_rss_feed/rss_feeds.json"),
    'chartbeat_authors' => CHARTBEAT_CONFIGS['team-player-pages']['authors'],
    'chartbeat_sections' => CHARTBEAT_CONFIGS['team-player-pages']['sections'],
    'show_desktop_tools_top_adv_container' => true,
    'team_logo_path' => "/skm/assets/pfn/nfl-teams-logo/",
    'show_sidebar_nav' => true,
    'download_image_url' => 'https://pfsn.app/nflpredictor',
  );

  $template_data['js_bundle_location'] = PLAYOFF_PREDICTOR_SCRIPT_LOCATION;

  $template_data["simulator_header_text"] = "Predict Remaining NFL Games";
  $template_data["playoff_section_text"] = "Playoffs";
  $template_data["standings_section_text"] = "Full Standings & Draft Order";
  $template_data["predict_cta_text"] = "Predict Playoff Games";
  $template_data["standings_header_text"] = "Predicted NFL Standings 2026-27";
  $template_data["brand_logo"] = "pfn-logo.png";
  $template_data['feedback_popup_logo'] = "logo/pfn-black-big.png";
  $template_data['feedback_source_tab'] = $brand;

  addPageMetadata($template_data, getPFNToolSubpageSlug("Playoff Predictor"));

  preparePFNMenuData($template_data, "Tools", "NFL Playoff Predictor");
  preparePFNSecondaryNav($template_data, "Football", "NFL Playoff Predictor");

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/pfn/common/gtag-script.tpl", "pages/static/tools/nfl/playoff-predictor/index.tpl", "third-party/proxy/pfn/tools/playoff-predictor/styles.tpl");
  $template_data['head_fragments'] = array("third-party/proxy/pfn/common/ad-script.tpl", "pages/static/common/analytics/track-returning-users.tpl", "third-party/proxy/pfn/common/taboola-script/head-script.tpl", "third-party/proxy/pfn/tools/playoff-predictor/meta.tpl", "third-party/proxy/pfn/common/clarity-script.tpl", "templates/common/faq/faq-schema.tpl");
  $template_data['body_fragments'] = array("third-party/proxy/pfn/common/taboola-script/body-script.tpl");

  // Above Page Content Widgets
  if ($brand == "pfn") {
    $template_data["abovePageContentWidgets"][] = getFeaturedToolsQuickLinksWidgetForPFN();
  }

  $app->render('third-party/proxy/index.tpl', $template_data);
});

// ===== mockdraft-simulator (sk-proxy.php:2137-2298) =====

$app->get('/sk-proxy/:brand/mockdraft-simulator', function ($brand) use ($app) {
  restrictAccess($app);

  $mdsDataUrl = "https://statics.sportskeeda.com/assets/sheets/tools/mockdraft-simulator/mockdraftSimulatorData.json";

  $filesData = do_curl($mdsDataUrl, $statuscode);
  $filesData = json_decode($filesData, true);
  $isFilesDataInvalid = checkMDSDataisValid($filesData);

  if (!isset($filesData["collections"]) || $isFilesDataInvalid) {
    $players = file_get_contents("templates/nfl-draft-simulator/common/players.json");
    $players = json_decode($players, TRUE);
    $picks = file_get_contents("templates/nfl-draft-simulator/common/picks.json");
    $picks = json_decode($picks, TRUE);
    $teams = file_get_contents("templates/nfl-draft-simulator/common/teams.json");
    $teams = json_decode($teams, TRUE);
    $playerTrades = file_get_contents("templates/nfl-draft-simulator/common/playerTrades.json");
    $playerTrades = json_decode($playerTrades, TRUE);
    $updatedTimestamp = file_get_contents("templates/nfl-draft-simulator/common/updatedTimestamp.txt");
    $simulationConstantsData = file_get_contents("templates/nfl-draft-simulator/common/simulationConstants.js");
    $simulationConstants = [];
    preg_match_all('/const\s+(\w+)\s*=\s*(.*?);/', $simulationConstantsData, $matches, PREG_SET_ORDER);

    foreach ($matches as $m) {
        $key = $m[1];
        $value = trim($m[2]);

        if (strpos($value, '[') === 0) {
          $simulationConstants[$key] = json_decode($value, true);
        } elseif (strpos($value, '{') === 0) {
          // Keep as raw JS object literal; template emits it directly without json_encode.
          $simulationConstants[$key] = $value;
        } elseif (is_numeric($value)) {
          $simulationConstants[$key] = $value + 0;
        } else {
          $simulationConstants[$key] = trim($value, '"\'');
        }
    }
  } else {
    $updatedTimestamp = new DateTime($filesData["updatedTime"], new DateTimeZone('UTC'));
    $updatedTimestamp->setTimezone(new DateTimeZone('America/New_York'));
    $updatedTimestamp = $updatedTimestamp->format('m/d/y, h:i:s A T');
    $filesData = mapMDSData($filesData);
    $picks = $filesData["picks"];
    $players = $filesData["players"];
    $teams = $filesData["teams"];
    $playerTrades = $filesData["player_trades"];
    $simulationConstants = $filesData["constants"];
  }

  $teams = setNFLTeamLogoPathForMDS($teams);

  $pickSequence = getTeamPickSequenceForMDS($teams);
  $picks = addLogoToMDSTeams($teams, $picks);

  $afcTeamsList = ['BAL', 'BUF', 'CIN', 'CLE', 'DEN', 'HOU', 'IND', 'JAX', 'KC', 'LV', 'LAC', 'MIA', 'NE', 'NYJ', 'PIT', 'TEN'];
  $nfcTeamsList = ['ARI', 'ATL', 'CAR', 'CHI', 'DAL', 'DET', 'GB', 'LAR', 'MIN', 'NO', 'NYG', 'PHI', 'SF', 'SEA', 'TB', 'WAS'];

  $afcTeams = collectConferenceTeams($afcTeamsList, $pickSequence);
  $nfcTeams = collectConferenceTeams($nfcTeamsList, $pickSequence);

  $pageTitle = "2027 NFL Mock Draft Simulator With Free Trades and Grades";
  $pageDescription = "PFSN’s free NFL Mock Draft Simulator with user-sim, sim-user, and sim-to-sim trades allows you to look ahead to the 2027 NFL Draft and be the GM of your favorite NFL team(s).";
  $pageTextContent = "
    <h2>What Is PFSN's NFL Mock Draft Simulator?</h2>
    <p>PFSN's NFL Mock Draft Simulator is a free tool that puts you in the general manager's chair for the NFL Draft. You make the picks for the team (s) you control, while a proprietary simulation drafts for the rest of the league, including trades. It is built to let you chase every what-if: reach for your quarterback, trade down to stockpile capital, or sit back and watch how the board falls.</p>
    <h2>How Does PFSN's NFL Mock Draft Simulator Work?</h2>
    <p>Once your draft begins, you go pick-for-pick against the rest of the league. When you are on the clock, your team's biggest needs appear in priority order above the player list, so you can draft for need, take the best player available, or balance the two. The board is filterable by position, and every prospect carries a scouting report and draft profile to inform your pick. The simulation drafts for every team you are not controlling, weighing each prospect's value against that team's roster needs, so the board shifts based on who is still available.</p>
    <h2>How Does the NFL Draft Work?</h2>
    <p>The NFL Draft is held every April over three days and consists of seven rounds. Before trades and compensatory picks, each of the 32 teams receives one selection per round, which, together with compensatory picks, pushes the field past 250 total selections.</p>
    <p>The order is set by the reverse order of finish from the previous season. The 18 teams that miss the playoffs are slotted first, from worst record to best, with strength of schedule as the primary tiebreaker between teams that finish even. The 14 playoff teams fill out the rest of each round by how far they advanced, with the Super Bowl runner-up picking next to last and the Super Bowl champion picking last.</p>
    <p>Compensatory picks are awarded at the end of Rounds 3 through 7 to teams that lost more or better free agents than they signed the previous offseason. A total of 32 compensatory selections are typically awarded under this method, with each team eligible to receive up to 4 selections (there have been 2 occasions when 33 compensatory selections were awarded). Additionally, up to 32 JC-2A resolution compensatory selections can be awarded per season to teams (one per team) that have developed minority candidates for head coach and general manager positions.</p>
    <h2>Can I draft for any NFL team?</h2>
    <p>Yes. All 32 franchises are available. You can run one team, several at once, all 32, or none at all, and let the simulation draft the entire board. Pick order follows the real NFL draft order for the year you select. For the current cycle, the order is based on Super Bowl odds from the summer through the first four weeks of the regular season. From that point on, it is set by the current standings, with each team's 17-game strength of schedule serving as the tiebreaker when needed.</p>
    <h2>How many rounds can I run, and how fast?</h2>
    <p>Anywhere from one round to all seven, the same as the real NFL Draft, with the simulation speed set to slow, normal, or fast. The fast setting quickens the overall simulation but gives you less time to pause between picks. The slow setting gives you more flexibility to pause and pursue trades, while normal strikes a balance.</p>
    <h2>What draft years can I simulate?</h2>
    <p>You can run a mock for the upcoming draft or redraft past NFL Draft classes, dating back to the 2020 NFL Draft cycle.</p>
    <h2>Can I make trades?</h2>
    <p>Yes, and every trade is free. Deals move in every direction: you to the simulation, the simulation to you, and simulation-to-simulation. Pause the draft to make an offer (including a short window before the No. 1 overall pick), choose the team and the picks to include, set protections on any future selections, then review and submit. You can also counter offers that come your way.</p>
    <h2>Can I draft with friends?</h2>
    <p>Yes. In multi-user mode, you can create a room and draft live against others, with everyone selecting from the same board and the same simulation through the final pick. You can create or join a public lobby to draft with other active MDS users, or set up a private lobby with a password to share with your friends.</p>
    <h2>Is PFSN's NFL Mock Draft Simulator free?</h2>
    <p>Yes. It is completely free to use on Pro Football & Sports Network, with no sign-up required.</p>
  ";

  $template_data = array(
    'seo_title' => $pageTitle,
    'meta_description' => $pageDescription,
    'meta_keywords' => 'PFN Mock Draft Simulator, PFSN Mock Draft Simulator, NFL Mock Draft Simulator, 2027 NFL Mock Draft, NFL Draft Simulator with Trades, NFL Draft Predictions, NFL Draft Analysis Tools, Interactive NFL Mock Draft, NFL Mock Draft Simulator with Grades',
    'seo_robots_tag' => 'FOLLOW, INDEX, MAX-SNIPPET:-1, MAX-VIDEO-PREVIEW:-1, MAX-IMAGE-PREVIEW:LARGE',
    'og_title' => $pageTitle,
    'og_description' => $pageDescription,
    'page_text_content' => $pageTextContent,
    'bodyClasses' => 'no-outstream-player raptive-pfn-disable-footer-close',
    'raptive_header_90_class' => 'raptive-pfn-header-90',
    'show_desktop_tools_top_adv_container' => true,
    'brand' => $brand,
    'slug' => 'mockdraft',
    'header_text' => 'NFL Mock Draft Simulator',
    'tool' => 'mockdraft-simulator',
    'add_header_navigation' => true,
    'playersList' => $players,
    'picksList' => $picks,
    'teamsList' => $teams,
    'playerTrades' => $playerTrades,
    'simulationConstants' => $simulationConstants,
    'pickSequence' => $pickSequence,
    'afcTeams' => $afcTeams,
    'nfcTeams' => $nfcTeams,
    'updated_timestamp' => $updatedTimestamp,
    'sidebar_fragment' => "",
    'skip_shift' => "true",
    'send_page_view_event' => true,
    'js_bundle_location' => MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION,
    'content_width' => 'full-width',
    'canonical_url' => 'https://www.profootballnetwork.com/mockdraft',
    'download_image_bottom_url' => 'www.profootballnetwork.com/mockdraft',
    'result_header_logo' => 'skm/assets/pfn/pfsn-logo-white-ver-2.png',
    'feeds_source_path' => generateDataIntegrationAssetsPath("tools/rss_feed/rss_feeds.json"),
    'is_desktop' => $app->is_desktop,
    'chartbeat_authors' => CHARTBEAT_CONFIGS['team-player-pages']['authors'],
    'chartbeat_sections' => CHARTBEAT_CONFIGS['team-player-pages']['sections'],
    'start_draft_btn_text' => 'Enter Solo Draft',
    'hide_mobile_top_adv_container' => true,
    'login_url' => get_brand_login_url($app, $brand),
    'show_dashboard_btn_final_result' => true,
    'setHtmlLangAttribute' => true,
    'allow_site_scaling' => true,
    'include_pfn_feedback' => true,
    'show_playerslist_selection_dropdown' => true,
    'select_teams_text' => "Select Your Team(s) - Solo Mock Draft",
    'logo_cache_buster' => PFN_NFL_LOGO_CACHE_BUSTER,
    'team_logo_path' => "/skm/assets/pfn/nfl-teams-logo/",
  );

  preparePFNMenuData($template_data, "Tools", "NFL Mock Draft Simulator");
  preparePFNSecondaryNav($template_data, "Football", "NFL Mock Draft Simulator");

  $template_data["roomIdParam"] = $app->request->params("roomId");

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/$brand/common/gtag-script.tpl", "third-party/proxy/$brand/tools/mockdraft-simulator/pre-styles.tpl", "templates/nfl-draft-simulator/home/$brand/index.tpl", "third-party/proxy/$brand/tools/mockdraft-simulator/styles.tpl");
  $template_data['head_fragments'] = array("third-party/proxy/$brand/common/ad-script.tpl", "pages/static/common/analytics/track-returning-users.tpl", "third-party/proxy/$brand/common/taboola-script/head-script.tpl", "third-party/proxy/$brand/common/clarity-script.tpl", "third-party/proxy/$brand/tools/mockdraft-simulator/meta.tpl");
  $template_data['body_fragments'] = array("third-party/proxy/$brand/common/taboola-script/body-script.tpl");
  $template_data['feedback_popup_logo'] = "logo/pfn-black-big.png";
  $template_data['feedback_source_tab'] = $brand;

  $template_data["schemas"] = array(
    "third-party/proxy/pfn/common/schemas/webpage.tpl",
    "third-party/proxy/pfn/common/schemas/newsMediaOrganization.tpl",
    "third-party/proxy/pfn/common/schemas/siteNavigationElement.tpl",
    "third-party/proxy/pfn/common/schemas/website.tpl",
  );

  // Bottom Widgets
  if ($brand == "pfn") {
    $template_data["bottomWidgets"][] = getFeaturedToolsQuickLinksWidgetForPFN();
  }
  
  $app->render('third-party/proxy/index.tpl', $template_data);
});

// ===== mockdraft-simulator-widget (sk-proxy.php:2300-2403) =====

$app->get('/sk-proxy/:brand/mockdraft-simulator-widget', function ($brand) use ($app) {
  restrictAccess($app);

  $queryParam = $app->request->params("widgetRef");
  $thirdPartyLogoPath = "";
  $trackingURL = "https://www.profootballnetwork.com/mockdraft";

  if ($queryParam == "fansided") {
    $thirdPartyLogoPath = "/skm/assets/nfl-mockup/fansided-invert.png";
    $thirdPartyLogoWidth = "80";
    $thirdPartyLogoHeight = "20";
    $trackingURL = "https://www.profootballnetwork.com/mockdraft?utm_medium=referral&utm_source=fansided";
  }

  $mdsDataUrl = "https://statics.sportskeeda.com/assets/sheets/tools/mockdraft-simulator/mockdraftSimulatorData.json";

  $filesData = do_curl($mdsDataUrl, $statuscode);
  $filesData = json_decode($filesData, true);
  $isFilesDataInvalid = checkMDSDataisValid($filesData);
  if (!isset($filesData["collections"]) || $isFilesDataInvalid) {
    $players = file_get_contents("templates/nfl-draft-simulator/common/players.json");
    $players = json_decode($players, TRUE);
    $picks = file_get_contents("templates/nfl-draft-simulator/common/picks.json");
    $picks = json_decode($picks, TRUE);
    $teams = file_get_contents("templates/nfl-draft-simulator/common/teams.json");
    $teams = json_decode($teams, TRUE);
    $playerTrades = file_get_contents("templates/nfl-draft-simulator/common/playerTrades.json");
    $playerTrades = json_decode($playerTrades, TRUE);
    $updatedTimestamp = file_get_contents("templates/nfl-draft-simulator/common/updatedTimestamp.txt");
    $simulationConstantsData = file_get_contents("templates/nfl-draft-simulator/common/simulationConstants.js");
    $simulationConstants = [];
    preg_match_all('/const\s+(\w+)\s*=\s*(.*?);/', $simulationConstantsData, $matches, PREG_SET_ORDER);

    foreach ($matches as $m) {
        $key = $m[1];
        $value = trim($m[2]);

        if (strpos($value, '[') === 0) {
            $simulationConstants[$key] = json_decode($value, true);
        } elseif (strpos($value, '{') === 0) {
            // Keep as raw JS object literal; template emits it directly without json_encode.
            $simulationConstants[$key] = $value;
        } elseif (is_numeric($value)) {
            $simulationConstants[$key] = $value + 0;
        } else {
            $simulationConstants[$key] = trim($value, '"\'');
        }
    }
  } else {
    $updatedTimestamp = new DateTime($filesData["updatedTime"], new DateTimeZone('UTC'));
    $updatedTimestamp->setTimezone(new DateTimeZone('America/New_York'));
    $updatedTimestamp = $updatedTimestamp->format('m/d/y, h:i:s A T');
    $filesData = mapMDSData($filesData);
    $picks = $filesData["picks"];
    $players = $filesData["players"];
    $teams = $filesData["teams"];
    $playerTrades = $filesData["player_trades"];
    $simulationConstants = $filesData["constants"];
  }

  $teams = setNFLTeamLogoPathForMDS($teams);

  $pickSequence = getTeamPickSequenceForMDS($teams);
  $picks = addLogoToMDSTeams($teams, $picks);

  $afcTeamsList = ['BAL', 'BUF', 'CIN', 'CLE', 'DEN', 'HOU', 'IND', 'JAX', 'KC', 'LV', 'LAC', 'MIA', 'NE', 'NYJ', 'PIT', 'TEN'];
  $nfcTeamsList = ['ARI', 'ATL', 'CAR', 'CHI', 'DAL', 'DET', 'GB', 'LAR', 'MIN', 'NO', 'NYG', 'PHI', 'SF', 'SEA', 'TB', 'WAS'];

  $afcTeams = collectConferenceTeams($afcTeamsList, $pickSequence);
  $nfcTeams = collectConferenceTeams($nfcTeamsList, $pickSequence);

  $template_data = array(
    'seo_robots_tag' => 'NOFOLLOW, NOINDEX, MAX-SNIPPET:-1, MAX-VIDEO-PREVIEW:-1, MAX-IMAGE-PREVIEW:LARGE',
    'send_page_view_event' => false,
    'brand' => $brand,
    'playersList' => $players,
    'picksList' => $picks,
    'teamsList' => $teams,
    'playerTrades' => $playerTrades,
    'simulationConstants' => $simulationConstants,
    'pickSequence' => $pickSequence,
    'afcTeams' => $afcTeams,
    'nfcTeams' => $nfcTeams,
    'skip_shift' => "true",
    'js_bundle_location' => MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION,
    'download_image_bottom_url' => 'www.profootballnetwork.com/mockdraft',
    'result_header_logo' => 'skm/assets/pfn/pfsn-logo-white-ver-2.png',
    'is_desktop' => false,
    'show_dashboard_btn_final_result' => false,
    'mds_widget_distinction' => true,
    'show_playerslist_selection_dropdown' => true,
    'third_party_logo_path' => $thirdPartyLogoPath,
    'third_party_logo_width' => $thirdPartyLogoWidth,
    'third_party_logo_height' => $thirdPartyLogoHeight,
    'select_teams_text' => "Select Your Team(s)",
    'tracking_url' => $trackingURL,
    'logo_cache_buster' => PFN_NFL_LOGO_CACHE_BUSTER,
    'team_logo_path' => "/skm/assets/pfn/nfl-teams-logo/",
  );

  $template_data['body_fragments'] = array("third-party/proxy/js.tpl", "third-party/proxy/$brand/tools/mockdraft-simulator/pre-styles.tpl", "templates/nfl-draft-simulator/widget/index.tpl", "third-party/proxy/$brand/tools/mockdraft-simulator/styles.tpl");

  $app->render('templates/pages/static/widgets/iframe/index.tpl', $template_data);
});

// ===== ultimate-simulator (sk-proxy.php:4352-4407) =====

$app->get("/sk-proxy/:brand/ultimate-simulator", function ($brand) use ($app) {
  restrictAccess($app);
  $afcTeams = ['BAL', 'BUF', 'CIN', 'CLE', 'DEN', 'HOU', 'IND', 'JAX', 'KC', 'LV', 'LAC', 'MIA', 'NE', 'NYJ', 'PIT', 'TEN'];
  
  $nfcTeams = ['ARI', 'ATL', 'CAR', 'CHI', 'DAL', 'DET', 'GB', 'LAR', 'MIN', 'NO', 'NYG', 'PHI', 'SF', 'SEA', 'TB', 'WAS'];

  $template_data = array(
    'meta_keywords' => "",
    'brand' => $brand,
    'canonical_url' => 'https://www.profootballnetwork.com/nfl-ultimate-gm-simulator/',
    'slug' => 'ultimate-gm-simulator',
    'header_text' => 'Ultimate Simulator',
    'bodyClasses' => 'raptive-pfn-disable-footer-close',
    'page_text_content' => "",
    'tool' => 'ultimate-gm-simulator',
    'include_right_sidebar' => false,
    'adv_in_content' => true,
    'content_width' => 'full-width',
    'hide_mobile_top_adv_container' => true,
    'add_header_navigation' => true,
    'send_page_view_event' => true,
    'updated_timestamp' => "---",
    'raptive_header_90_class' => 'raptive-pfn-header-90',
    'afcTeams' => $afcTeams,
    'nfcTeams' => $nfcTeams,
    'nfl_teams' => [
      'ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN','DET','GB',
      'HOU','IND','JAX','KC','LV','LAC','LAR','MIA','MIN','NE','NO','NYG','NYJ',
      'PHI','PIT','SF','SEA','TB','TEN','WAS'
    ],
    'current_year' => '2026',
    'upcoming_year' => '2027',
    'current_season' => '2025-26',
    'upcoming_season' => '2026-27',
    'js_bundle_location' => ULTIMATE_SIMULATOR_SCRIPT_LOCATION,
    'ultimate_sim_data_source_path' => generateDataIntegrationAssetsPath("tools/ultimate-gm-simulator/ultimateSimulatorData.json"),
    'is_desktop' => $app->is_desktop,
    'chartbeat_authors' => CHARTBEAT_CONFIGS['trade-analyzer']['authors'],
    'chartbeat_sections' => CHARTBEAT_CONFIGS['trade-analyzer']['sections'],
    'show_desktop_tools_top_adv_container' => true,
    'team_logo_path' => "/skm/assets/pfn/nfl-teams-logo/",
    'logo_cache_buster' => "?ver=" . PFN_NFL_LOGO_CACHE_BUSTER,
  );

  $template_data["standings_header_text"] = "Predicted NFL Standings 2026-27";

  preparePFNMenuData($template_data, "Tools", "NFL Ultimate GM Simulator");
  preparePFNSecondaryNav($template_data, "Football", "NFL Ultimate GM Simulator");
  addPageMetadata($template_data, getPFNToolSubpageSlug("NFL Ultimate GM Simulator"));

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/$brand/common/gtag-script.tpl", "pages/static/tools/nfl/ultimate-gm-simulator/index.tpl");
  $template_data['head_fragments'] = array("third-party/proxy/$brand/common/ad-script.tpl", "pages/static/common/analytics/track-returning-users.tpl", "third-party/proxy/$brand/common/clarity-script.tpl", "third-party/proxy/$brand/tools/ultimate-simulator/meta.tpl");

  $app->render('third-party/proxy/index.tpl', $template_data);
});
