{* {if $brand}
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
{/if} *}
{include file="utils/script.tpl"}
{include file="nfl-draft-simulator/common/canvas.tpl"}

<script>
  let widgetData;
  var tradesData = [];
  const teamLogoPath = "{$team_logo_path}";
  const imageRefreshTag = "{$logo_cache_buster}";
  const widgetTrackingURL = "{$tracking_url}";
  let isRedraft = false;
  var picksList = {$picksList|json_encode};
  var teamsList = {$teamsList|json_encode};
  var teamNeedsList = {$teamsList|json_encode};
  var playersList = {$playersList|json_encode};
  var playersListAll = {$playersList|json_encode};
  var playerTrades = {$playerTrades|json_encode};
  var playerTradesOriginal = JSON.parse(JSON.stringify(playerTrades));
  let pickstart = {$simulationConstants["pickstart"]};
  const roundends = {$simulationConstants["roundends"]|json_encode};
  const tradeinittoppick = {$simulationConstants["tradeinittoppick"]|json_encode};
  const tradeinittopten = {$simulationConstants["tradeinittopten"]|json_encode};
  const tradeinitfirst = {$simulationConstants["tradeinitfirst"]|json_encode};
  const tradeinitallelse = {$simulationConstants["tradeinitallelse"]|json_encode};
  const maxPicksInPackage = {$simulationConstants["maxPicksInPackage"]};
  const blockTradeUpPick = {$simulationConstants["blockTradeUpPick"]};
  const poolslice = {$simulationConstants["poolslice"]|json_encode};
  const highpickvalues = {$simulationConstants["highpickvalues"]|json_encode};
  const midpickvalues = {$simulationConstants["midpickvalues"]|json_encode};
  const lowpickvalues = {$simulationConstants["lowpickvalues"]|json_encode};
  const gradingConfig = {
    tier1Multiplier: {$simulationConstants["tier1Multiplier"]},
    tier2Multiplier: {$simulationConstants["tier2Multiplier"]},
    tier3Multiplier: {$simulationConstants["tier3Multiplier"]},
    top5PlayerFloor: {$simulationConstants["top5PlayerFloor"]},
    needCoefficient: {$simulationConstants["needCoefficient"]},
    lateNeedCoefficient: {$simulationConstants["lateNeedCoefficient"]},
    lateRoundCeiling: {$simulationConstants["lateRoundCeiling"]},
    lateRoundFloor: {$simulationConstants["lateRoundFloor"]},
    top5Threshold: {$simulationConstants["top5Threshold"]},
    lateRoundThreshold: {$simulationConstants["lateRoundThreshold"]},
    roundWeights: {$simulationConstants["roundWeights"]},
    top5playervalue: {$simulationConstants["top5playervalue"]},
    top5pickvalue: {$simulationConstants["top5pickvalue"]}
  };
  const sendPageViewEvent = "{$send_page_view_event}";
  const playerRankingProvidersMap = {
    "pfsn": "PFSN",
    "espn": "ESPN",
    "pff": "PFF",
    "the_athletic": "The Athletic",
    "adp": "User ADP",
  }

  let playerBoardsList = {
    "pfsn": JSON.parse(JSON.stringify(playersList)),
    "consensus": "",
    "espn": "",
    "pff": "",
    "the_athletic": "",
    "adp": "",
  };
  const showPlayerslistSelectionDropdown = "{$show_playerslist_selection_dropdown}" == true;
  var STATIC_URL = "{$smarty.const.STATIC_URL}";
  var GOTHAM_URL_PFN_FRONTEND = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}";
  var IS_DESKTOP = false;
  var feedsSourcePath = "{$feeds_source_path}";
  const brand = "{$brand}";
  const bundleLocation = "{$js_bundle_location}";
  const loginRedirectUrl = "{$login_url}";
  var prodDBSimNum = "";
  let mdsUserIsLoggedIn = false;
  let mdsLoggedInUserId;
  let multiUserDraft = false;
  const mdsWidgetDistinction = {if isset($mds_widget_distinction)}true{else}false{/if};
  const widgetLogoPath = "{$third_party_logo_path}";

  function trackReturningUsers() {}
  const socket = "";
  let currentMultiUserPick = 1;
  let multiUserSystemOffersList = [];
  let multiUserCounterOffersList = [];
  let multiUserTradeOffersList = [];
  let counteredTeams = [];
  let proposedTeamsData = [];
  let currentRoomData;
  let currentUserMultiDraftData = {};
  let currentUserIsAdmin = false;
  let currentUserSocketId = "";
  let currentPickIsMine = false;
  let multiUserCurrentOfferTeam = {};
  let multiUserDraftPauseList = [];
  let lastAcceptedOffer = "";
  let lastPlayerSelectedForPick = "";
  let simFinishedRoomData = "";
  let usersLeftInfo = [];
  let toBeHandledOffers = {
    rejectedTradeOffers: [],
    rejectedCounterOffers: [],
    revertedOffers: [],
    acceptedOffer: "",
    acceptedOfferType: "",
    selectedPlayer: "",
  };

  const dashboardUserData = {
    userName: "",
    image: "",
    solo: {},
    multiUser: {},
    overall: {},
    stats: {},
  };

  if (brand) {
    var trackGAEventForPage = function(eventName, eventParams) {
      eventParams = eventParams || {};
      trackGAEvent(eventName, {
        ...eventParams,
        "tool": "mockdraft_simulator_widget"
      });
    };

    // trackGAEventForPage("widget_article", {
    //   articleUrl: window.parent.location.href,
    // })

    // var proDBSimulationNumUrl = "https://qhy62as4g2.execute-api.us-east-1.amazonaws.com/get_pfn_sim_num";
    // pureJSAjaxGet(proDBSimulationNumUrl, function(data) {
    //   data = JSON.parse(data);
    //   if (data.body) {
    //     prodDBSimNum = data.body[0] + 1;
    //   }
    // }, function() {}, false);
  }

  var overlay = document.createElement("div");
  addClass(overlay, "loading-overlay");
  var loadingText = document.createElement("span");
  addClass(loadingText, "overlay-loading-text");
  loadingText.innerHTML = "Loading...";
  overlay.appendChild(loadingText);
  document.body.appendChild(overlay);

  asyncScriptLoader({
    src: bundleLocation,
    loadWithAsync: true,
    attributes: [{
      key: "id",
      value: "MOCKDRAFT_SIMULATOR_SCRIPT_LOCATION",
    }, ],
  }).then(function() {
    var overlay = $(".loading-overlay");
    if (overlay) {
      overlay.remove();
    }
  });
</script>
