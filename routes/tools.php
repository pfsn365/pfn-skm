<?php
/**
 * The 6 extracted PFN tool routes, copied verbatim from the parent
 * routes/sk-proxy.php. Helper functions and constants they depend on live in
 * ../helpers.php and ../config.php (the *_SCRIPT_LOCATION bundle constants,
 * originally in js-side-menu-config.php, are consolidated into config.php).
 *
 *   /sk-proxy/:brand/login                       (parent sk-proxy.php:71)
 *   /sk-proxy/:brand/playoff-predictor          (parent sk-proxy.php:1450)
 *   /sk-proxy/:brand/mockdraft-simulator         (parent sk-proxy.php:2137)
 *   /sk-proxy/:brand/mockdraft-simulator-widget  (parent sk-proxy.php:2300)
 *   /sk-proxy/:brand/ultimate-simulator          (parent sk-proxy.php:4352)
 *   /sk-proxy/:brand/fifa-world-cup-simulator    (parent sk-proxy.php:4409)
 *   /sk-proxy/:brand/free-agency-simulator       (parent sk-proxy.php:2405)
 *
 * Reach a tool with ?debug__proxy_tools=true (restrictAccess guard).
 */

define('PFN_NFL_WEEK_NUMBER', "18");
define('PFN_NFL_LOGO_CACHE_BUSTER', "00008");

// ===== login (sk-proxy.php:71-85) =====
// Target of get_brand_login_url() — the mockdraft-simulator dashboard sends
// unauthenticated users here with ?after-login=<the page they came from>. Sign-in
// is Firebase (email/password, register, password reset, Google popup); on
// success firebaseManager.tpl POSTs the Firebase ID token to
// GOTHAM_URL_PFN_FRONTEND/pfn/auth, which sets the session cookies the tools read
// via getCurrentUserID(), and the page redirects to `after-login`.

$app->get('/sk-proxy/:brand/login', function ($brand) use ($app) {
  restrictAccess($app);

  $template_data = array(
    'brand' => $brand,
    'send_page_view_event' => true,
    'is_desktop' => $app->is_desktop,
    'login_page' => true,
    // Deviation from the parent, which also passes
    // "google_login_url" => get_google_login_url(). That builds a Google OAuth
    // redirect back to FRAMEWORK_URL_HOST/login/google-auth-digest — the
    // Sportskeeda login framework, which PFN does not use. PFN auth is Firebase
    // -> POST GOTHAM_URL_PFN_FRONTEND/pfn/auth (pfn-gotham app/pfn/router.go),
    // and the login template never reads the value. Omitted, so this repo needs
    // no GOOGLE_CLIENT_ID secret.
  );

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/$brand/common/login/index.tpl", "third-party/proxy/$brand/common/gtag-script.tpl");

  $app->render('third-party/proxy/index.tpl', $template_data);
});
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

  // Page metadata is set inline rather than via addPageMetadata(), so this page
  // renders without a blocking call to the (VPC-internal) taxonomy API. Values
  // mirror the CMS entry c6e9b54f-008a-42b8-b5b1-0e70d8efd572 as of 2026-08-05
  // (GET API_ENDPOINT_DOMAIN/v1/taxonomy/<slug>). `page_text_content` is that
  // entry's `data_subpage_info` after sanitize_article_contents(), with no FAQs to
  // append (the CMS entry has none, so `faq` is empty and the faq-schema.tpl
  // fragment in head_fragments below emits an empty FAQPage, exactly as before).
  //
  // `header_text` is load-bearing: third-party/proxy/pfn/index.tpl gates BOTH
  // the <h1> header-wrapper and the desktop-tools-top-adv-container (the Raptive
  // 90px header ad) on isset($header_text). Removing it hides the page header
  // and the header ad. Edit these strings here when the CMS entry changes.
  $template_data["header_text"] = "Free NFL Playoff Predictor & Season Simulator (2026)";
  $template_data["seo_title"] = "Free NFL Playoff Predictor & Season Simulator (2026)";
  $template_data["meta_description"] = "PFSN's NFL Playoff Predictor allows you to predict each game of the 2026 NFL season to see how it impacts the playoff picture and matchups.";
  $template_data["seo_robots_tag"] = "index, follow, max-image-preview:large";
  $template_data["allow_site_scaling"] = true;
  $template_data["setHtmlLangAttribute"] = true;
  $template_data["page_text_content"] = <<<'PAGE_TEXT'
<h2 id="c6e9b54f-008a-42b8-b5b1-0e70d8efd572-0">What Is PFSN&rsquo;s NFL Playoff Predictor?</h2>
<p>PFSN&rsquo;s NFL Playoff Predictor is a one-of-a-kind tool that gives you the ability to simulate the entire NFL season right up until the Super Bowl. Not only do you get to see how each game impacts the NFL playoff picture, but you also get to see what next year&rsquo;s <a href="https://www.profootballnetwork.com/nfl-draft-order/" target="_blank" rel="noopener nofollow">draft order</a> will look like based on the outcomes of the games.</p>
<p>PFSN&rsquo;s Playoff Machine is updated within minutes of the conclusion of each NFL game to allow you to test out an unlimited number of playoff scenarios in real time to see how your favorite team is impacted in the NFL playoff picture.</p>
<p>PFSN&rsquo;s NFL Playoff Predictor allows you to play out various weekly scenarios to see how the playoff picture changes with each scenario. The combination of actual game results from the NFL season, along with user-selected game picks and AI-simulated results, provides you with a unique NFL playoff bracket.</p>
<p>Now that the NFL season is here, play out every game and determine who will be heading to Super Bowl LXI in Inglewood.</p>
<h2 id="c6e9b54f-008a-42b8-b5b1-0e70d8efd572-1">How Does PFSN&rsquo;s NFL Playoff Machine Work?</h2>
<p>The PFSN NFL Playoff Picture Predictor is updated in near-real time at the conclusion of every NFL game. From there, you can choose to pick every remaining game yourself or select only the games that interest you. Once you make your picks, you can choose to simulate that week only or the rest of the season. PFSN&rsquo;s Playoff Predictor includes a proprietary, state-of-the-art algorithm that will simulate and predict the outcomes of the games you have not already selected.</p>
<p>From there, you can see the projected playoff picture and can manipulate any of the game results to see how it changes the NFL playoff bracket. Once your NFL playoff bracket predictor is finished, you can select the winners of each playoff matchup from Wild Card Weekend through the Super Bowl.</p>
<h2 id="c6e9b54f-008a-42b8-b5b1-0e70d8efd572-2">How Many Teams Make the NFL Playoffs?</h2>
<p>A total of 14 teams make it into the playoffs. The 14-team field consists of seven teams from the AFC and seven teams from the NFC. There are four division winners and three Wild Card teams from each conference. The three Wild Card teams are those with the best regular-season records among the teams that did not win their respective division.</p>
<h2 id="c6e9b54f-008a-42b8-b5b1-0e70d8efd572-3">How Do the NFL Playoffs Work?</h2>
<p>The NFL regular season is an 18-week schedule consisting of 17 games for each of the 32 NFL teams. At the conclusion of Week 18, the playoff field is set.</p>
<p>The four division winners in each conference are seeded one through four in their respective playoff brackets based on their winning percentage. Three additional teams from each conference, known as Wild Card teams, also advance to the playoffs and are seeded five through seven. In the first round, the No. 1 seed from each conference gets a bye week and automatically advances to the second round. The six other teams in each conference face off: 2 vs. 7, 3 vs. 6, and 4 vs. 5.</p>
<p>The winners advance to the second round. The lowest remaining seed in each conference must face the No. 1 seed. The other two remaining teams in each conference face off as well. Two teams from each conference that win their games advance to the Conference Championship round.</p>
<p>The winners of the AFC Championship Game and NFC Championship Game face off two weeks later in the Super Bowl.</p>
<h2 id="c6e9b54f-008a-42b8-b5b1-0e70d8efd572-4">When Do the NFL Playoffs Start?</h2>
<p>The 2026-27 NFL Playoffs begin with Wild Card Weekend from Saturday, January 16, through Monday, January 18. Two games are slated for Saturday, with three additional games on Sunday. The round wraps up with a Monday Night Football game on January 18. Super Bowl 61 will be played on Sunday, February 14, at SoFi Stadium in Inglewood.</p>
<p><br></p>
PAGE_TEXT;

  $template_data["faq"] = array();

  $template_data["schemas"] = array(
    "third-party/proxy/pfn/common/schemas/webpage.tpl",
    "third-party/proxy/pfn/common/schemas/newsMediaOrganization.tpl",
    "third-party/proxy/pfn/common/schemas/siteNavigationElement.tpl",
    "third-party/proxy/pfn/common/schemas/website.tpl",
  );

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
    // Both of these are placeholders kept from the parent; the inline metadata
    // block below overwrites them (as addPageMetadata() did in the parent).
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

  // Page metadata is set inline rather than via addPageMetadata(), so this page
  // renders without a blocking call to the (VPC-internal) taxonomy API. Values
  // mirror the CMS entry b2c4d786-00f8-4dfc-9bef-fb27a1c3b6e1 as of 2026-08-05
  // (GET API_ENDPOINT_DOMAIN/v1/taxonomy/<slug>). `page_text_content` is that
  // entry's `data_subpage_info` after sanitize_article_contents(), with the 6 CMS
  // FAQs appended by appendFaqsToPageContent() under the "FAQ" heading. The same
  // FAQs feed templates/common/faq/faq-schema.tpl, added to head_fragments below.
  //
  // `header_text` is load-bearing: third-party/proxy/pfn/index.tpl gates BOTH
  // the <h1> header-wrapper and the desktop-tools-top-adv-container (the Raptive
  // 90px header ad) on isset($header_text). Removing it hides the page header
  // and the header ad. Edit these strings here when the CMS entry changes.
  $template_data["header_text"] = "NFL Ultimate GM Simulator";
  $template_data["seo_title"] = "NFL Ultimate GM Simulator";
  $template_data["meta_description"] = "Put your knowledge of the NFL to the test with our Ultimate GM Simulator and guide your favorite team to victory.";
  $template_data["seo_robots_tag"] = "index, follow, max-image-preview:large";
  $template_data["allow_site_scaling"] = true;
  $template_data["setHtmlLangAttribute"] = true;
  $template_data["page_text_content"] = <<<'PAGE_TEXT'
<p>Do you think you can manage your favorite team&rsquo;s roster better than the real-life general managers? Well, the PFSN Ultimate GM Simulator is here to help you prove it. Whether it&rsquo;s making those tough cuts, re-signing your own pending free agents, hitting the free agent market, or running your team's draft, you can build your ideal roster, see how next season plays out, and share it with the world.</p>
<h2 id="b2c4d786-00f8-4dfc-9bef-fb27a1c3b6e1-0">How To Play PFSN&rsquo;s NFL Ultimate GM Simulator</h2>
<p>There are multiple elements to the PFSN Offseason Manager. Firstly, you can either simulate the remaining games or pick how you see them playing out, which will set the draft order for the 2026 NFL Mock Draft Simulator.<br><br>In the initial phase of the offseason, you decide which of the players who are under contract you want to keep, who you want to cut, and whose contracts to restructure to save cap space. When it comes to cutting players, you must navigate the cap implications of each move and decide which decisions are right and which are wrong.</p>
<p>In the second stage of the offseason, you decide which of your pending free agents to re-sign, transition tag, or franchise tag. You can only franchise tag or transition tag one player in total, but you can re-sign as many players as you deem necessary and have cap space to do so. Each player has a programmed minimum value of the contract in terms of money, years, and guarantees that they will accept.</p>
<p>The third stage of the NFL offseason allows you to sign any free agents that you believe will improve your roster. The process here is largely the same as re-signing your own free agents, where each player has minimum values in terms of money, years, and guarantees that you must meet before they will sign with you.</p>
<p>Once you have handled that phase of the offseason, it is on to the MDS to fill the remaining holes on your roster. Navigate your way through a seven-round mock draft to complete your roster ahead of the 2026-27 NFL season.</p>
<p>After that, you can simulate the 2026-27 NFL season with our proprietary PFSN Impact analytics comparing all the rosters following the offseason and playing out what could happen next season. </p>
<p><br></p>
<p><br></p>

<h2 id="faq-heading">FAQ</h2>
<h3>How Does the NFL Salary Cap Work?</h3>
<p><p>The&nbsp;<a href="https://www.profootballnetwork.com/how-does-nfl-salary-cap-work/" target="_blank" rel="noopener">NFL salary cap</a>&nbsp;is complex to master, but the principle of how it works is relatively simple. It is what is referred to as a hard cap, meaning that when the new league year starts, each team must be below that cap and remain below it at all times.</p>
<p>Salary cap numbers are a combination of salaries and bonuses. Only the top 51 players count toward the cap during the offseason, but when the season starts, all 53 players on the active roster count toward it. Additionally, any player placed on the injured reserve or the practice squad counts against a team salary cap.</p></p>
<h3>What Are the Different Free Agent Designations?</h3>
<p><p>Unrestricted Free Agent (UFA): Players with four or more accrued seasons are listed as unrestricted free agents. They can sign with any other team in the league with no draft compensation owed to the previous team. A player with fewer than four accrued seasons can become a UFA if their old team does not extend them a qualifying offer.</p>
<p>Restricted Free Agent (RFA): Players with three accrued seasons who have been given a qualifying offer from their current team. RFAs can negotiate with any team for the first month of the new league year. If they agree to a contract, they must sign an “offer sheet.” Their former team then has the “right of first refusal” on that offer sheet. They will retain that player if they choose to match the offer sheet.</p>
<p>If the original team does not match the offer sheet, then the team that gave the offer sheet may send draft compensation to the original team. The value of this depends on the original qualifying offer given to the RFA.</p>
<p>Exclusive Rights Free Agent (ERFA): A player with two or fewer accrued seasons and an expired contract. If the original team extends a qualifying offer to an ERFA, then that player is unable to negotiate with any other team. If an ERFA is not tendered a qualifying offer, he is free to negotiate with other teams, and his original team has no ability to match unless the ERFA gives them the opportunity.</p>
<p>Street Free Agent: A player who has either been released by his previous team or did not play in the previous season. These players are free to negotiate with any team, and the previous team does not receive any consideration in the compensatory pick formula.</p></p>
<h3>What Are the Different NFL Roster Designations?</h3>
<p><p>QB: Quarterback</p>
<p>RB: Running Back</p>
<p>WR: Wide Receiver</p>
<p>TE: Tight End</p>
<p>OT: Offensive Tackle</p>
<p>G: Guard</p>
<p>C: Center</p>
<p>DT: Defensive Tackle</p>
<p>EDGE: Edge Rusher - includes outside linebackers and defensive ends</p>
<p>LB: Linebacker</p>
<p>CB: Cornerback</p>
<p>S: Safety</p>
<p>K: Kicker</p>
<p>P: Punter</p>
<p>LS: Long Snapper</p></p>
<h3>How do NFL Contract Restructures Work?</h3>
<p><p>There are multiple ways an NFL contract restructure can work. Some restructures can be performed by the team without needing permission from the player, while others require the player to sign a new contract to allow the change in terms to happen. Most of the time, a restructure does not see a player lose money, and it usually accelerates the timeframe in which the player receives their money.</p>
<p>In a basic contract restructure, teams can take any base salary, roster bonus, or workout bonus and pay it to the player as a lump sum. That money is treated as a “signing bonus,” which allows it to be counted for up to five years in terms of the salary cap (prorated). For example, if a team restructures a contract to pay a $10 million lump sum in 2025, that would be prorated across the cap at $2 million a year from 2025 to 2029.</p>
<p>In order for that to be the case, a player must have at least five more years remaining on their deal. If a player has just two years remaining, including 2025, then it would count for $5 million against the cap in 2025 and $5 million in 2026. If a team wants to prorate it over anything longer than the remaining length of the contract, they can add void years to the end of the contract, but this requires the player to sign a new contract.</p>
<p>A void year is essentially a “dummy” year that is used for cap purposes. If a contract voids in 2026, that player becomes a free agent, and all the remaining cap ramifications will then count in the 2026 season. So in the example above, if the cap number were $2 million a year across 2025 to 2029 and the contract voids in 2026, the team would have an $8 million cap hit in the 2026 season, even though the player no longer is on their roster.</p>
<p>When restructuring a contract, the only constraint for a team is that they must leave at least the minimum base salary for that player based on the number of accrued seasons. All other cash for that season can be transferred into the lump sum payment and treated as a signing bonus.</p></p>
<h3>What Is Dead Money in NFL Contracts?</h3>
<p><p>Dead money in an NFL contract refers to money a team has already spent or committed to spending but has yet to count against its cap. This money could be paid as a signing bonus, an option bonus, or a guaranteed salary at signing.</p>
<p>For example, let’s imagine a contract where a player signs for two years in a deal worth $20 million with a $10 million signing bonus and $5 million in guaranteed salary. In Year 1, their salary is just $1.5 million, with the remaining $8.5 million in Year 2.</p>
<p>That $10 million signing bonus prorates across the two years at $5 million per year. His cap numbers would be $6.5 million in Year 1 and $13.5 million in Year 2.</p>
<p>If the team decides after Year 1 that the player is not worth $13.5 million against their cap in Year 2, they could cut him. The team would then have the following in dead money: the remaining $5 million from the prorated signing bonus and the remaining $3.5 million in guaranteed salary.</p>
<p>The remaining $5 million in salary that was not guaranteed would “vanish” and would be both a cap and cash saving of $5 million, as it is money the team would not have to pay to that player. However, because the team has already spent the $5 million signing bonus that was due to count against the cap in Year 2 and committed to spending another $3.5 million in salary, they will have $8.5 million in dead money against their cap in Year 2.</p></p>
<h3>What Are the Franchise Tag and the Transition Tag?</h3>
<p><p>The franchise tag is a tool that NFL teams can use to ensure they retain a free agent. Teams do not have to use a franchise tag but can only use a maximum of one franchise or transition tag per season.</p>
<p>Once a team applies the franchise tag, that player is under contract for another season. As soon as the player signs the franchise tag contract, the salary attributed to the tag is guaranteed and cannot be rescinded unless a long-term contract is agreed upon. However, the player does not have to sign the franchise tag, but it does not mean they can negotiate with other teams.</p>
<p>Once a franchise tag has been applied, a team has until a deadline in the middle of July to negotiate a long-term deal. Once that deadline has passed, no further negotiations can occur until the following offseason.</p>
<p>Teams can franchise tag a player three times, but the cost increases exponentially on each occasion. A first franchise tag is applied at the greater of either the value set within the NFL Collective Bargaining Agreement (CBA) or 120% of the player’s previous year's salary. A second tag has a value of at least 120% of the first tag. A third franchise tag would be valued at 144% of the second tag. The initial cost of the franchise tag is based on the player’s position.</p>
<p>There are two types of franchise tags: exclusive and non-exclusive. The non-exclusive tag allows players to negotiate with other teams. If a player agrees to a contract with another team, the team applying the tag has the right of first refusal. If the original team does not match, then the new team must pay the original team compensation of two first-round picks.</p>
<p>The exclusive franchise tag does not allow a player to negotiate. However, this comes at a higher cost, which is determined following that year’s free agency.</p>
<p>The transition tag is also a one-year, fully guaranteed contract, but at a lower salary than the franchise tag. The value is set by the NFL CBA and varies based on the player’s position. Players who get the transition tag can negotiate with other teams. If they agree to a contract with a new team, their original team has the right of first refusal. If the original team does not match, then the player is free to leave, and no compensation is owed.</p></p>
PAGE_TEXT;

  $template_data["faq"] = array(
    array(
      "question" => "How Does the NFL Salary Cap Work?",
      "answer" => <<<'FAQ_ANSWER'
<p>The&nbsp;<a href="https://www.profootballnetwork.com/how-does-nfl-salary-cap-work/" target="_blank" rel="noopener">NFL salary cap</a>&nbsp;is complex to master, but the principle of how it works is relatively simple. It is what is referred to as a hard cap, meaning that when the new league year starts, each team must be below that cap and remain below it at all times.</p>
<p>Salary cap numbers are a combination of salaries and bonuses. Only the top 51 players count toward the cap during the offseason, but when the season starts, all 53 players on the active roster count toward it. Additionally, any player placed on the injured reserve or the practice squad counts against a team salary cap.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Are the Different Free Agent Designations?",
      "answer" => <<<'FAQ_ANSWER'
<p>Unrestricted Free Agent (UFA): Players with four or more accrued seasons are listed as unrestricted free agents. They can sign with any other team in the league with no draft compensation owed to the previous team. A player with fewer than four accrued seasons can become a UFA if their old team does not extend them a qualifying offer.</p>
<p>Restricted Free Agent (RFA): Players with three accrued seasons who have been given a qualifying offer from their current team. RFAs can negotiate with any team for the first month of the new league year. If they agree to a contract, they must sign an “offer sheet.” Their former team then has the “right of first refusal” on that offer sheet. They will retain that player if they choose to match the offer sheet.</p>
<p>If the original team does not match the offer sheet, then the team that gave the offer sheet may send draft compensation to the original team. The value of this depends on the original qualifying offer given to the RFA.</p>
<p>Exclusive Rights Free Agent (ERFA): A player with two or fewer accrued seasons and an expired contract. If the original team extends a qualifying offer to an ERFA, then that player is unable to negotiate with any other team. If an ERFA is not tendered a qualifying offer, he is free to negotiate with other teams, and his original team has no ability to match unless the ERFA gives them the opportunity.</p>
<p>Street Free Agent: A player who has either been released by his previous team or did not play in the previous season. These players are free to negotiate with any team, and the previous team does not receive any consideration in the compensatory pick formula.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Are the Different NFL Roster Designations?",
      "answer" => <<<'FAQ_ANSWER'
<p>QB: Quarterback</p>
<p>RB: Running Back</p>
<p>WR: Wide Receiver</p>
<p>TE: Tight End</p>
<p>OT: Offensive Tackle</p>
<p>G: Guard</p>
<p>C: Center</p>
<p>DT: Defensive Tackle</p>
<p>EDGE: Edge Rusher - includes outside linebackers and defensive ends</p>
<p>LB: Linebacker</p>
<p>CB: Cornerback</p>
<p>S: Safety</p>
<p>K: Kicker</p>
<p>P: Punter</p>
<p>LS: Long Snapper</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "How do NFL Contract Restructures Work?",
      "answer" => <<<'FAQ_ANSWER'
<p>There are multiple ways an NFL contract restructure can work. Some restructures can be performed by the team without needing permission from the player, while others require the player to sign a new contract to allow the change in terms to happen. Most of the time, a restructure does not see a player lose money, and it usually accelerates the timeframe in which the player receives their money.</p>
<p>In a basic contract restructure, teams can take any base salary, roster bonus, or workout bonus and pay it to the player as a lump sum. That money is treated as a “signing bonus,” which allows it to be counted for up to five years in terms of the salary cap (prorated). For example, if a team restructures a contract to pay a $10 million lump sum in 2025, that would be prorated across the cap at $2 million a year from 2025 to 2029.</p>
<p>In order for that to be the case, a player must have at least five more years remaining on their deal. If a player has just two years remaining, including 2025, then it would count for $5 million against the cap in 2025 and $5 million in 2026. If a team wants to prorate it over anything longer than the remaining length of the contract, they can add void years to the end of the contract, but this requires the player to sign a new contract.</p>
<p>A void year is essentially a “dummy” year that is used for cap purposes. If a contract voids in 2026, that player becomes a free agent, and all the remaining cap ramifications will then count in the 2026 season. So in the example above, if the cap number were $2 million a year across 2025 to 2029 and the contract voids in 2026, the team would have an $8 million cap hit in the 2026 season, even though the player no longer is on their roster.</p>
<p>When restructuring a contract, the only constraint for a team is that they must leave at least the minimum base salary for that player based on the number of accrued seasons. All other cash for that season can be transferred into the lump sum payment and treated as a signing bonus.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Is Dead Money in NFL Contracts?",
      "answer" => <<<'FAQ_ANSWER'
<p>Dead money in an NFL contract refers to money a team has already spent or committed to spending but has yet to count against its cap. This money could be paid as a signing bonus, an option bonus, or a guaranteed salary at signing.</p>
<p>For example, let’s imagine a contract where a player signs for two years in a deal worth $20 million with a $10 million signing bonus and $5 million in guaranteed salary. In Year 1, their salary is just $1.5 million, with the remaining $8.5 million in Year 2.</p>
<p>That $10 million signing bonus prorates across the two years at $5 million per year. His cap numbers would be $6.5 million in Year 1 and $13.5 million in Year 2.</p>
<p>If the team decides after Year 1 that the player is not worth $13.5 million against their cap in Year 2, they could cut him. The team would then have the following in dead money: the remaining $5 million from the prorated signing bonus and the remaining $3.5 million in guaranteed salary.</p>
<p>The remaining $5 million in salary that was not guaranteed would “vanish” and would be both a cap and cash saving of $5 million, as it is money the team would not have to pay to that player. However, because the team has already spent the $5 million signing bonus that was due to count against the cap in Year 2 and committed to spending another $3.5 million in salary, they will have $8.5 million in dead money against their cap in Year 2.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Are the Franchise Tag and the Transition Tag?",
      "answer" => <<<'FAQ_ANSWER'
<p>The franchise tag is a tool that NFL teams can use to ensure they retain a free agent. Teams do not have to use a franchise tag but can only use a maximum of one franchise or transition tag per season.</p>
<p>Once a team applies the franchise tag, that player is under contract for another season. As soon as the player signs the franchise tag contract, the salary attributed to the tag is guaranteed and cannot be rescinded unless a long-term contract is agreed upon. However, the player does not have to sign the franchise tag, but it does not mean they can negotiate with other teams.</p>
<p>Once a franchise tag has been applied, a team has until a deadline in the middle of July to negotiate a long-term deal. Once that deadline has passed, no further negotiations can occur until the following offseason.</p>
<p>Teams can franchise tag a player three times, but the cost increases exponentially on each occasion. A first franchise tag is applied at the greater of either the value set within the NFL Collective Bargaining Agreement (CBA) or 120% of the player’s previous year's salary. A second tag has a value of at least 120% of the first tag. A third franchise tag would be valued at 144% of the second tag. The initial cost of the franchise tag is based on the player’s position.</p>
<p>There are two types of franchise tags: exclusive and non-exclusive. The non-exclusive tag allows players to negotiate with other teams. If a player agrees to a contract with another team, the team applying the tag has the right of first refusal. If the original team does not match, then the new team must pay the original team compensation of two first-round picks.</p>
<p>The exclusive franchise tag does not allow a player to negotiate. However, this comes at a higher cost, which is determined following that year’s free agency.</p>
<p>The transition tag is also a one-year, fully guaranteed contract, but at a lower salary than the franchise tag. The value is set by the NFL CBA and varies based on the player’s position. Players who get the transition tag can negotiate with other teams. If they agree to a contract with a new team, their original team has the right of first refusal. If the original team does not match, then the player is free to leave, and no compensation is owed.</p>
FAQ_ANSWER,
      "url" => "",
    ),
  );

  $template_data["schemas"] = array(
    "third-party/proxy/pfn/common/schemas/webpage.tpl",
    "third-party/proxy/pfn/common/schemas/newsMediaOrganization.tpl",
    "third-party/proxy/pfn/common/schemas/siteNavigationElement.tpl",
    "third-party/proxy/pfn/common/schemas/website.tpl",
  );

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/$brand/common/gtag-script.tpl", "pages/static/tools/nfl/ultimate-gm-simulator/index.tpl");
  $template_data['head_fragments'] = array("third-party/proxy/$brand/common/ad-script.tpl", "pages/static/common/analytics/track-returning-users.tpl", "third-party/proxy/$brand/common/clarity-script.tpl", "third-party/proxy/$brand/tools/ultimate-simulator/meta.tpl", "templates/common/faq/faq-schema.tpl");

  $app->render('third-party/proxy/index.tpl', $template_data);
});

// ===== fifa-world-cup-simulator (sk-proxy.php:4409-4444) =====

$app->get('/sk-proxy/:brand/fifa-world-cup-simulator', function ($brand) use ($app) {
  restrictAccess($app);

  $template_data = array(
    'meta_keywords' => '',
    'brand' => $brand,
    'canonical_url' => 'https://www.profootballnetwork.com/fifa-world-cup-simulator/',
    'slug' => 'nba-mock-draft-simulator',
    'tool' => 'pfn-tools',
    'bodyClasses' => 'raptive-pfn-disable-footer-close',
    'raptive_header_90_class' => 'raptive-pfn-header-90',
    'include_right_sidebar' => false,
    'adv_in_content' => false,
    'add_header_navigation' => true,
    'send_page_view_event' => true,
    'content_width' => 'full-width',
    'updated_timestamp' => "---",
    'is_desktop' => $app->is_desktop,
    'js_bundle_location' => FIFA_WORLD_CUP_SIMULATOR_SCRIPT_LOCATION,
    'show_right_sticky_ad_container' => true,
    'show_desktop_tools_top_adv_container' => true,
    'data_source_path' => generateDataIntegrationAssetsPath('tools/soccer-simulator/'),
    'chartbeat_authors' => CHARTBEAT_CONFIGS['team-player-pages']['authors'],
    'chartbeat_sections' => CHARTBEAT_CONFIGS['team-player-pages']['sections'],
  );

  preparePFNMenuData($template_data, "Tools", "FIFA World Cup Simulator");
  preparePFNSecondaryNav($template_data, "Tools", "FIFA World Cup Simulator");

  // Page metadata is set inline rather than via addPageMetadata(), so this page
  // renders without a blocking call to the (VPC-internal) taxonomy API. Values
  // mirror the CMS entry ad168211-5952-4e25-bad3-b46e8a1b93b3 as of 2026-07-20.
  //
  // `header_text` is load-bearing: third-party/proxy/pfn/index.tpl gates BOTH
  // the <h1> header-wrapper and the desktop-tools-top-adv-container (the Raptive
  // 90px header ad) on isset($header_text). Removing it hides the page header
  // and the header ad. Edit these strings here when the CMS entry changes.
  //
  // page_text_content / faq are intentionally absent: the CMS entry has neither,
  // so there is no FAQ schema fragment to append either.
  $template_data["header_text"] = "FIFA World Cup 2026 Simulator";
  $template_data["seo_title"] = "FIFA World Cup 2026 Simulator | Predict Tournament Results";
  $template_data["meta_description"] = "Interactive FIFA World Cup 2026 tournament simulator with 48 teams. Predict every match, track group standings, and simulate the knockout bracket.";
  $template_data["seo_robots_tag"] = "index, follow, max-image-preview:large";
  $template_data["allow_site_scaling"] = true;
  $template_data["setHtmlLangAttribute"] = true;

  $template_data["schemas"] = array(
    "third-party/proxy/pfn/common/schemas/webpage.tpl",
    "third-party/proxy/pfn/common/schemas/newsMediaOrganization.tpl",
    "third-party/proxy/pfn/common/schemas/siteNavigationElement.tpl",
    "third-party/proxy/pfn/common/schemas/website.tpl",
  );

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/$brand/common/gtag-script.tpl", "pages/static/tools/nfl/fifa-world-cup-simulator/index.tpl");
  $template_data['head_fragments'] = array("third-party/proxy/$brand/common/ad-script.tpl", "pages/static/common/analytics/track-returning-users.tpl", "third-party/proxy/$brand/common/taboola-script/head-script.tpl", "third-party/proxy/$brand/common/clarity-script.tpl", "third-party/proxy/$brand/tools/fifa-world-cup-simulator/meta.tpl");
  $template_data['body_fragments'] = array("third-party/proxy/$brand/common/taboola-script/body-script.tpl");

  $app->render('third-party/proxy/index.tpl', $template_data);
});

// ===== free-agency-simulator / "NFL Offseason Manager" (sk-proxy.php:2405-2455) =====

$app->get('/sk-proxy/:brand/free-agency-simulator', function ($brand) use ($app) {
  restrictAccess($app);

  if ($app->is_desktop) {
    $disableFooterClose = ' raptive-pfn-disable-footer-close';
  } else {
    $disableFooterClose = '';
  }

  $template_data = array(
    'meta_keywords' => "",
    'brand' => $brand,
    // Typo ('ree-' not 'free-') preserved from the parent. `slug` only feeds an
    // equality check in templates/ads/video-players/vidazoo.tpl on this page, so
    // it is kept verbatim rather than "fixed" — both deployments behave alike.
    'slug' => 'free-agency-simulator',
    'tool' => 'free-agency-simulator',
    'add_header_navigation' => true,
    'show_desktop_tools_top_adv_container' => true,
    'raptive_header_90_class' => 'raptive-pfn-header-90',
    'bodyClasses' => 'no-outstream-player' . $disableFooterClose,
    'sidebar_fragment' => "",
    'skip_shift' => "true",
    'js_bundle_location' => FREE_AGENCY_SIMULATOR_SCRIPT_LOCATION,
    'content_width' => 'full-width',
    'canonical_url' => "https://www.profootballnetwork.com/nfl-offseason-salary-cap-free-agency-manager",
    'result_header_logo' => '/skm/assets/third-party/pfsn-logo-white.png',
    'is_desktop' => $app->is_desktop,
    'chartbeat_authors' => CHARTBEAT_CONFIGS['team-player-pages']['authors'],
    'chartbeat_sections' => CHARTBEAT_CONFIGS['team-player-pages']['sections'],
    'hide_mobile_top_adv_container' => true,
    'players_data_source_path' => generateDataIntegrationAssetsPath("tools/free_agency_simulator/final.json"),
    'teams_data_source_path' => generateDataIntegrationAssetsPath("tools/free_agency_simulator/team_level_data.json"),
    'team_logo_path' => "/skm/assets/pfn/nfl-teams-logo/",
    'logo_cache_buster' => "ver=" . PFN_NFL_LOGO_CACHE_BUSTER,
  );

  preparePFNMenuData($template_data, "Tools", "Offseason Manager");
  preparePFNSecondaryNav($template_data, "Football", "NFL Offseason Manager");

  // Page metadata is set inline rather than via addPageMetadata(), so this page
  // renders without a blocking call to the (VPC-internal) taxonomy API. Values
  // mirror the CMS entry bcbe7791-2f06-4d66-9673-4a1467412bae ("NFL Offseason
  // Manager") as of 2026-08-06 (GET API_ENDPOINT_DOMAIN/v1/taxonomy/<slug>).
  // `page_text_content` is that entry's `data_subpage_info` after
  // sanitize_article_contents(), with the 6 FAQs appended by
  // appendFaqsToPageContent() under the entry's faq_section_title ("FAQ").
  //
  // `header_text` is load-bearing: third-party/proxy/pfn/index.tpl gates BOTH
  // the <h1> header-wrapper and the desktop-tools-top-adv-container (the Raptive
  // 90px header ad) on isset($header_text). Removing it hides the page header
  // and the header ad. Edit these strings here when the CMS entry changes.
  $template_data["header_text"] = "NFL Offseason Manager (2026)";
  $template_data["seo_title"] = "NFL Offseason Manager";
  $template_data["meta_description"] = "PFSN's NFL Offseason Manager allows you to take over your favorite team through free agency, contract negotiations, salary cap management, and more.";
  $template_data["seo_robots_tag"] = "index, follow, max-image-preview:large";
  $template_data["allow_site_scaling"] = true;
  $template_data["setHtmlLangAttribute"] = true;
  $template_data["page_text_content"] = <<<'PAGE_TEXT'
<p>Do you think you can manage your favorite team&rsquo;s roster better than the real-life general managers? Well, the PFSN Offseason Manager is here to help you prove it. Whether it&rsquo;s making those tough cuts, re-signing your own pending free agents, or hitting the free agent market, you can build your ideal roster and share it with the world.</p>
<h2 id="bcbe7791-2f06-4d66-9673-4a1467412bae-0">How To Play PFSN&rsquo;s NFL Offseason Manager</h2>
<p>There are multiple elements to the PFSN Offseason Manager. In the initial phase, you decide which of the players who are under contract you want to keep, who you want to cut, and whose contracts to restructure in order to save cap space. When it comes to cutting players, you have to navigate through the cap implications of each move and decide which are the right and wrong decisions to make.</p>
<p>In the second stage, you decide which of your pending free agents to re-sign, transition tag, or franchise tag. You can only franchise tag or transition tag one player in total, but you can re-sign as many players as you deem necessary and have cap space to do so. Each player has a programmed minimum value of the contract in terms of money, years, and guarantees that they will accept.</p>
<p>The final stage of the NFL Offseason Manager allows you to sign any free agents that you believe will improve your roster. The process here is largely the same as re-signing your own free agents, where each player has minimum values in terms of money, years, and guarantees that you must meet before they will sign with you.</p>
<h2 id="bcbe7791-2f06-4d66-9673-4a1467412bae-1">Which Teams Have the Most Salary Cap Space?</h2>
<p>Having extra cap space allows teams to <span style="box-sizing: border-box; margin: 0px; padding: 0px;">make more and bigger moves than others, which also makes them even more exciting to use in PFSN's NFL Offseason Manager. Currently, there are only three teams with over $80 million in cap space: the Tennessee Titans ($100.3 million), the Las Vegas Raiders ($89.3 million), and the Los Angeles Chargers ($88.6 million)</span>. </p>
<p>The Titans could actually rebound quickly from their porous 3-14 campaign in 2025. Robert Saleh is the new head coach, with Brian Daboll coming to take over the offense, led by former No. 1 overall pick Cam Ward. With over $100 million to remake the roster, it wouldn't be surprising if Tennessee enjoys some quilty seasons in the near future. </p>
<p>The Raiders are in a much different scenario. They have yet to officially hire a head coach, the QB position is a question mark, and there are other holes all over the roster. Assuming they are able to find the right person to man the helm, there is plenty of draft capital (No. 1 overall) and salary cap space to establish a true rebuild. </p>
<p>And then there is the Chargers. The franchise has its signal-caller in Justin Herbert and a proven winner at head coach in Jim Harbaugh. The ingredients are there; Los Angeles just needs them to come together for a playoff push past the Wild Card Round (0-3 in three appearances since 2018). Having significant money to play with this offseason should enhance their odds of doing just that. </p>
<p>You can view every team's salary cap situation with <a href="https://www.profootballnetwork.com/cta-salary-cap-table-nfl/" rel="nofollow">PFSN's 2025-26 NFL Salary Cap Tracker</a>.</p>
<p><br></p>
<p><br></p>
<p><br></p>

<h2 id="faq-heading">FAQ</h2>
<h3>How Does the NFL Salary Cap Work?</h3>
<p><p>The&nbsp;<a href="https://www.profootballnetwork.com/how-does-nfl-salary-cap-work/" target="_blank" rel="noopener">NFL salary cap</a>&nbsp;is complex to master, but the principle of how it works is relatively simple. It is what is referred to as a hard cap, meaning that when the new league year starts, each team must be below that cap and remain below it at all times.</p>
<p>Salary cap numbers are a combination of salaries and bonuses. Only the top 51 players count toward the cap during the offseason, but when the season starts, all 53 players on the active roster count toward it. Additionally, any player placed on the injured reserve or the practice squad counts against a team salary cap.</p></p>
<h3>What Are the Different Free Agent Designations?</h3>
<p><p>Unrestricted Free Agent (UFA): Players with four or more accrued seasons are listed as unrestricted free agents. They can sign with any other team in the league with no draft compensation owed to the previous team. A player with fewer than four accrued seasons can become a UFA if their old team does not extend them a qualifying offer.</p>
<p>Restricted Free Agent (RFA): Players with three accrued seasons who have been given a qualifying offer from their current team. RFAs can negotiate with any team for the first month of the new league year. If they agree to a contract, they must sign an “offer sheet.” Their former team then has the “right of first refusal” on that offer sheet. They will retain that player if they choose to match the offer sheet.</p>
<p>If the original team does not match the offer sheet, then the team that gave the offer sheet may send draft compensation to the original team. The value of this depends on the original qualifying offer given to the RFA.</p>
<p>Exclusive Rights Free Agent (ERFA): A player with two or fewer accrued seasons and an expired contract. If the original team extends a qualifying offer to an ERFA, then that player is unable to negotiate with any other team. If an ERFA is not tendered a qualifying offer, he is free to negotiate with other teams, and his original team has no ability to match unless the ERFA gives them the opportunity.</p>
<p>Street Free Agent: A player who has either been released by his previous team or did not play in the previous season. These players are free to negotiate with any team, and the previous team does not receive any consideration in the compensatory pick formula.</p></p>
<h3>What Are the Different NFL Roster Designations?</h3>
<p><p>QB: Quarterback</p>
<p>RB: Running Back</p>
<p>WR: Wide Receiver</p>
<p>TE: Tight End</p>
<p>OT: Offensive Tackle</p>
<p>G: Guard</p>
<p>C: Center</p>
<p>IDL: Interior Defensive Line - includes defensive tackles</p>
<p>EDGE: Edge Rusher - includes outside linebackers and defensive ends</p>
<p>LB: Linebacker</p>
<p>CB: Cornerback</p>
<p>S: Safety</p>
<p>K: Kicker</p>
<p>P: Punter</p>
<p>LS: Long Snapper</p></p>
<h3>How do NFL Contract Restructures Work?</h3>
<p><p>There are multiple ways an NFL contract restructure can work. Some restructures can be performed by the team without needing permission from the player, while others require the player to sign a new contract to allow the change in terms to happen. Most of the time, a restructure does not see a player lose money, and it usually accelerates the timeframe in which the player receives their money.</p>
<p>In a basic contract restructure, teams can take any base salary, roster bonus, or workout bonus and pay it to the player as a lump sum. That money is treated as a “signing bonus,” which allows it to be counted for up to five years in terms of the salary cap (prorated). For example, if a team restructures a contract to pay a $10 million lump sum in 2025, that would be prorated across the cap at $2 million a year from 2025 to 2029.</p>
<p>In order for that to be the case, a player must have at least five more years remaining on their deal. If a player has just two years remaining, including 2025, then it would count for $5 million against the cap in 2025 and $5 million in 2026. If a team wants to prorate it over anything longer than the remaining length of the contract, they can add void years to the end of the contract, but this requires the player to sign a new contract.</p>
<p>A void year is essentially a “dummy” year that is used for cap purposes. If a contract voids in 2026, that player becomes a free agent, and all the remaining cap ramifications will then count in the 2026 season. So in the example above, if the cap number were $2 million a year across 2025 to 2029 and the contract voids in 2026, the team would have an $8 million cap hit in the 2026 season, even though the player no longer is on their roster.</p>
<p>When restructuring a contract, the only constraint for a team is that they must leave at least the minimum base salary for that player based on the number of accrued seasons. All other cash for that season can be transferred into the lump sum payment and treated as a signing bonus.</p></p>
<h3>What Is Dead Money in NFL Contracts?</h3>
<p><p>Dead money in an NFL contract refers to money a team has already spent or committed to spending but has yet to count against its cap. This money could be paid as a signing bonus, an option bonus, or a guaranteed salary at signing.</p>
<p>For example, let’s imagine a contract where a player signs for two years in a deal worth $20 million with a $10 million signing bonus and $5 million in guaranteed salary. In Year 1, their salary is just $1.5 million, with the remaining $8.5 million in Year 2.</p>
<p>That $10 million signing bonus prorates across the two years at $5 million per year. His cap numbers would be $6.5 million in Year 1 and $13.5 million in Year 2.</p>
<p>If the team decides after Year 1 that the player is not worth $13.5 million against their cap in Year 2, they could cut him. The team would then have the following in dead money: the remaining $5 million from the prorated signing bonus and the remaining $3.5 million in guaranteed salary.</p>
<p>The remaining $5 million in salary that was not guaranteed would “vanish” and would be both a cap and cash saving of $5 million, as it is money the team would not have to pay to that player. However, because the team has already spent the $5 million signing bonus that was due to count against the cap in Year 2 and committed to spending another $3.5 million in salary, they will have $8.5 million in dead money against their cap in Year 2.</p></p>
<h3>What Are the Franchise Tag and the Transition Tag?</h3>
<p><p>The franchise tag is a tool that NFL teams can use to ensure they retain a free agent. Teams do not have to use a franchise tag but can only use a maximum of one franchise or transition tag per season.</p>
<p>Once a team applies the franchise tag, that player is under contract for another season. As soon as the player signs the franchise tag contract, the salary attributed to the tag is guaranteed and cannot be rescinded unless a long-term contract is agreed upon. However, the player does not have to sign the franchise tag, but it does not mean they can negotiate with other teams.</p>
<p>Once a franchise tag has been applied, a team has until a deadline in the middle of July to negotiate a long-term deal. Once that deadline has passed, no further negotiations can occur until the following offseason.</p>
<p>Teams can franchise tag a player three times, but the cost increases exponentially on each occasion. A first franchise tag is applied at the greater of either the value set within the NFL Collective Bargaining Agreement (CBA) or 120% of the player’s previous year's salary. A second tag has a value of at least 120% of the first tag. A third franchise tag would be valued at 144% of the second tag. The initial cost of the franchise tag is based on the player’s position.</p>
<p>There are two types of franchise tags: exclusive and non-exclusive. The non-exclusive tag allows players to negotiate with other teams. If a player agrees to a contract with another team, the team applying the tag has the right of first refusal. If the original team does not match, then the new team must pay the original team compensation of two first-round picks.</p>
<p>The exclusive franchise tag does not allow a player to negotiate. However, this comes at a higher cost, which is determined following that year’s free agency.</p>
<p>The transition tag is also a one-year, fully guaranteed contract, but at a lower salary than the franchise tag. The value is set by the NFL CBA and varies based on the player’s position. Players who get the transition tag can negotiate with other teams. If they agree to a contract with a new team, their original team has the right of first refusal. If the original team does not match, then the player is free to leave, and no compensation is owed.</p></p>
PAGE_TEXT;

  $template_data["faq"] = array(
    array(
      "question" => "How Does the NFL Salary Cap Work?",
      "answer" => <<<'FAQ_ANSWER'
<p>The&nbsp;<a href="https://www.profootballnetwork.com/how-does-nfl-salary-cap-work/" target="_blank" rel="noopener">NFL salary cap</a>&nbsp;is complex to master, but the principle of how it works is relatively simple. It is what is referred to as a hard cap, meaning that when the new league year starts, each team must be below that cap and remain below it at all times.</p>
<p>Salary cap numbers are a combination of salaries and bonuses. Only the top 51 players count toward the cap during the offseason, but when the season starts, all 53 players on the active roster count toward it. Additionally, any player placed on the injured reserve or the practice squad counts against a team salary cap.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Are the Different Free Agent Designations?",
      "answer" => <<<'FAQ_ANSWER'
<p>Unrestricted Free Agent (UFA): Players with four or more accrued seasons are listed as unrestricted free agents. They can sign with any other team in the league with no draft compensation owed to the previous team. A player with fewer than four accrued seasons can become a UFA if their old team does not extend them a qualifying offer.</p>
<p>Restricted Free Agent (RFA): Players with three accrued seasons who have been given a qualifying offer from their current team. RFAs can negotiate with any team for the first month of the new league year. If they agree to a contract, they must sign an “offer sheet.” Their former team then has the “right of first refusal” on that offer sheet. They will retain that player if they choose to match the offer sheet.</p>
<p>If the original team does not match the offer sheet, then the team that gave the offer sheet may send draft compensation to the original team. The value of this depends on the original qualifying offer given to the RFA.</p>
<p>Exclusive Rights Free Agent (ERFA): A player with two or fewer accrued seasons and an expired contract. If the original team extends a qualifying offer to an ERFA, then that player is unable to negotiate with any other team. If an ERFA is not tendered a qualifying offer, he is free to negotiate with other teams, and his original team has no ability to match unless the ERFA gives them the opportunity.</p>
<p>Street Free Agent: A player who has either been released by his previous team or did not play in the previous season. These players are free to negotiate with any team, and the previous team does not receive any consideration in the compensatory pick formula.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Are the Different NFL Roster Designations?",
      "answer" => <<<'FAQ_ANSWER'
<p>QB: Quarterback</p>
<p>RB: Running Back</p>
<p>WR: Wide Receiver</p>
<p>TE: Tight End</p>
<p>OT: Offensive Tackle</p>
<p>G: Guard</p>
<p>C: Center</p>
<p>IDL: Interior Defensive Line - includes defensive tackles</p>
<p>EDGE: Edge Rusher - includes outside linebackers and defensive ends</p>
<p>LB: Linebacker</p>
<p>CB: Cornerback</p>
<p>S: Safety</p>
<p>K: Kicker</p>
<p>P: Punter</p>
<p>LS: Long Snapper</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "How do NFL Contract Restructures Work?",
      "answer" => <<<'FAQ_ANSWER'
<p>There are multiple ways an NFL contract restructure can work. Some restructures can be performed by the team without needing permission from the player, while others require the player to sign a new contract to allow the change in terms to happen. Most of the time, a restructure does not see a player lose money, and it usually accelerates the timeframe in which the player receives their money.</p>
<p>In a basic contract restructure, teams can take any base salary, roster bonus, or workout bonus and pay it to the player as a lump sum. That money is treated as a “signing bonus,” which allows it to be counted for up to five years in terms of the salary cap (prorated). For example, if a team restructures a contract to pay a $10 million lump sum in 2025, that would be prorated across the cap at $2 million a year from 2025 to 2029.</p>
<p>In order for that to be the case, a player must have at least five more years remaining on their deal. If a player has just two years remaining, including 2025, then it would count for $5 million against the cap in 2025 and $5 million in 2026. If a team wants to prorate it over anything longer than the remaining length of the contract, they can add void years to the end of the contract, but this requires the player to sign a new contract.</p>
<p>A void year is essentially a “dummy” year that is used for cap purposes. If a contract voids in 2026, that player becomes a free agent, and all the remaining cap ramifications will then count in the 2026 season. So in the example above, if the cap number were $2 million a year across 2025 to 2029 and the contract voids in 2026, the team would have an $8 million cap hit in the 2026 season, even though the player no longer is on their roster.</p>
<p>When restructuring a contract, the only constraint for a team is that they must leave at least the minimum base salary for that player based on the number of accrued seasons. All other cash for that season can be transferred into the lump sum payment and treated as a signing bonus.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Is Dead Money in NFL Contracts?",
      "answer" => <<<'FAQ_ANSWER'
<p>Dead money in an NFL contract refers to money a team has already spent or committed to spending but has yet to count against its cap. This money could be paid as a signing bonus, an option bonus, or a guaranteed salary at signing.</p>
<p>For example, let’s imagine a contract where a player signs for two years in a deal worth $20 million with a $10 million signing bonus and $5 million in guaranteed salary. In Year 1, their salary is just $1.5 million, with the remaining $8.5 million in Year 2.</p>
<p>That $10 million signing bonus prorates across the two years at $5 million per year. His cap numbers would be $6.5 million in Year 1 and $13.5 million in Year 2.</p>
<p>If the team decides after Year 1 that the player is not worth $13.5 million against their cap in Year 2, they could cut him. The team would then have the following in dead money: the remaining $5 million from the prorated signing bonus and the remaining $3.5 million in guaranteed salary.</p>
<p>The remaining $5 million in salary that was not guaranteed would “vanish” and would be both a cap and cash saving of $5 million, as it is money the team would not have to pay to that player. However, because the team has already spent the $5 million signing bonus that was due to count against the cap in Year 2 and committed to spending another $3.5 million in salary, they will have $8.5 million in dead money against their cap in Year 2.</p>
FAQ_ANSWER,
      "url" => "",
    ),
    array(
      "question" => "What Are the Franchise Tag and the Transition Tag?",
      "answer" => <<<'FAQ_ANSWER'
<p>The franchise tag is a tool that NFL teams can use to ensure they retain a free agent. Teams do not have to use a franchise tag but can only use a maximum of one franchise or transition tag per season.</p>
<p>Once a team applies the franchise tag, that player is under contract for another season. As soon as the player signs the franchise tag contract, the salary attributed to the tag is guaranteed and cannot be rescinded unless a long-term contract is agreed upon. However, the player does not have to sign the franchise tag, but it does not mean they can negotiate with other teams.</p>
<p>Once a franchise tag has been applied, a team has until a deadline in the middle of July to negotiate a long-term deal. Once that deadline has passed, no further negotiations can occur until the following offseason.</p>
<p>Teams can franchise tag a player three times, but the cost increases exponentially on each occasion. A first franchise tag is applied at the greater of either the value set within the NFL Collective Bargaining Agreement (CBA) or 120% of the player’s previous year's salary. A second tag has a value of at least 120% of the first tag. A third franchise tag would be valued at 144% of the second tag. The initial cost of the franchise tag is based on the player’s position.</p>
<p>There are two types of franchise tags: exclusive and non-exclusive. The non-exclusive tag allows players to negotiate with other teams. If a player agrees to a contract with another team, the team applying the tag has the right of first refusal. If the original team does not match, then the new team must pay the original team compensation of two first-round picks.</p>
<p>The exclusive franchise tag does not allow a player to negotiate. However, this comes at a higher cost, which is determined following that year’s free agency.</p>
<p>The transition tag is also a one-year, fully guaranteed contract, but at a lower salary than the franchise tag. The value is set by the NFL CBA and varies based on the player’s position. Players who get the transition tag can negotiate with other teams. If they agree to a contract with a new team, their original team has the right of first refusal. If the original team does not match, then the player is free to leave, and no compensation is owed.</p>
FAQ_ANSWER,
      "url" => "",
    ),
  );

  $template_data["schemas"] = array(
    "third-party/proxy/pfn/common/schemas/webpage.tpl",
    "third-party/proxy/pfn/common/schemas/newsMediaOrganization.tpl",
    "third-party/proxy/pfn/common/schemas/siteNavigationElement.tpl",
    "third-party/proxy/pfn/common/schemas/website.tpl",
  );

  $template_data['layout_fragment'] = "third-party/proxy/$brand/index.tpl";
  $template_data['fragments'] = array("third-party/proxy/$brand/common/gtag-script.tpl", "pages/static/tools/nfl/free-agency-simulator/index.tpl", "third-party/proxy/$brand/tools/free-agency-simulator/styles.tpl");
  // templates/common/faq/faq-schema.tpl is the one addition to the parent's list:
  // addPageMetadata() appended it whenever the CMS entry had FAQs (it does, 6),
  // but the parent then reassigned head_fragments on the next line and dropped
  // it. Kept here so the FAQPage JSON-LD actually renders — same call the
  // ultimate-simulator route makes.
  $template_data['head_fragments'] = array(
    "third-party/proxy/$brand/common/ad-script.tpl", 
    "pages/static/common/analytics/track-returning-users.tpl", 
    "third-party/proxy/$brand/common/taboola-script/head-script.tpl", 
    "third-party/proxy/$brand/common/clarity-script.tpl",
    "third-party/proxy/$brand/tools/free-agency-simulator/meta.tpl",
    "templates/common/faq/faq-schema.tpl"
  );
  $template_data['body_fragments'] = array("third-party/proxy/$brand/common/taboola-script/body-script.tpl");
  
  $app->render('third-party/proxy/index.tpl', $template_data);
});

// ===== catch-all: invalid /sk-proxy/pfn/... paths -> styled 404 =====
// (verbatim from parent sk-proxy.php:4663; must stay AFTER the 4 tool routes
//  above so Slim matches those first and this only catches unknown tool paths)
$app->get('/sk-proxy/:brand/.*', function ($brand) use ($app) {
  $templateData = array(
    "layout_fragment" => "third-party/proxy/404.tpl",
    "is_desktop" => $app->is_desktop,
    "brand" => $brand,
  );

  preparePFNMenuData($templateData, "Trending", "");

  $app->render("third-party/proxy/index.tpl", $templateData);
})->conditions(array('brand' => 'pfn'));
