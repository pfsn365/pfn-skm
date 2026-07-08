{if $brand}
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
{/if}
{include file="utils/script.tpl"}
{include file="nfl-draft-simulator/common/canvas.tpl"}

<script>
  var picksList = {$picksList|json_encode};
  var teamsList = {$teamsList|json_encode};
  var teamNeedsList = {$teamsList|json_encode};
  var playersList = {$playersList|json_encode};
  var playersListAll = {$playersList|json_encode};
  var playerTrades = {$playerTrades|json_encode};
  var playerTradesOriginal = JSON.parse(JSON.stringify(playerTrades));
  let pickstart = {$simulationConstants["pickstart"]};
  let roundends = {$simulationConstants["roundends"]|json_encode};
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
  {if $brand}
  var gradingConfig = {
    tier1Multiplier: {$simulationConstants["tier1Multiplier"]|default:85},
    tier2Multiplier: {$simulationConstants["tier2Multiplier"]|default:76},
    tier3Multiplier: {$simulationConstants["tier3Multiplier"]|default:65},
    top5PlayerFloor: {$simulationConstants["top5PlayerFloor"]|default:60},
    needCoefficient: {$simulationConstants["needCoefficient"]|default:3},
    lateNeedCoefficient: {$simulationConstants["lateNeedCoefficient"]|default:1},
    lateRoundCeiling: {$simulationConstants["lateRoundCeiling"]|default:75},
    lateRoundFloor: {$simulationConstants["lateRoundFloor"]|default:35},
    top5Threshold: {$simulationConstants["top5Threshold"]|default:468},
    lateRoundThreshold: {$simulationConstants["lateRoundThreshold"]|default:78},
    roundWeights: {$simulationConstants["roundWeights"]},
    top5playervalue: {$simulationConstants["top5playervalue"]|default:500},
    top5pickvalue: {$simulationConstants["top5pickvalue"]|default:450}
  };
  {else}
  var gradingConfig = {};
  {/if}
  const imageRefreshTag = "{$logo_cache_buster}";
  const teamLogoPath = "{$team_logo_path}";
  const sendPageViewEvent = "{$send_page_view_event}";
  const playerRankingProvidersMap = {
    "pfsn": "PFSN",
    "espn": "ESPN",
    "pff": "PFF",
    "the_athletic": "The Athletic",
    "user_adp": "User ADP",
    "jacob_infante": "Jacob Infante",
    "ian_cummings": "Ian Cummings",
    "wide_left_consensus": "Wide Left",
  }

  let widgetData;
  var tradesData = [];
  const widgetTrackingURL = "";

  let isRedraft = false;

  // Save original state for restoring when switching back from redraft to solo
  const originalMDSData = {
    picksList: JSON.parse(JSON.stringify(picksList)),
    teamsList: JSON.parse(JSON.stringify(teamsList)),
    playersList: JSON.parse(JSON.stringify(playersList)),
    playerTrades: JSON.parse(JSON.stringify(playerTrades)),
    roundends: JSON.parse(JSON.stringify(roundends)),
    pickstart: pickstart,
  };

  let playerBoardsList = {
    "pfsn": JSON.parse(JSON.stringify(playersList)),
    "consensus": "",
    "espn": "",
    "pff": "",
    "the_athletic": "",
    "user_adp": "",
    "jacob_infante": "",
    "ian_cummings": "",
    "wide_left_consensus": "",
  };

  const redraftDataList = {
    "2020": {
      roundends: [10, 32, 64, 106, 146, 179, 214, 255],
    },
    "2021": {
      roundends: [10, 32, 64, 105, 144, 184, 228, 259],
    },
    "2022": {
      roundends: [10, 32, 64, 105, 143, 179, 221, 262],
    },
    "2023": {
      roundends: [10, 31, 63, 102, 135, 177, 217, 259],
    },
    "2024": {
      roundends: [10, 32, 64, 100, 135, 176, 220, 257],
    },
    "2025": {
      roundends: [10, 32, 64, 102, 138, 176, 216, 257],
    },
    "2026": {
      roundends: [10, 32, 64, 100, 140, 181, 216, 257],
    },
  };


  const showPlayerslistSelectionDropdown = "{$show_playerslist_selection_dropdown}" == true;
  var STATIC_URL = "{$smarty.const.STATIC_URL}";
  var GOTHAM_URL_PFN_FRONTEND = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}";
  var IS_DESKTOP = "{$is_desktop}";
  var feedsSourcePath = "{$feeds_source_path}";
  const brand = "{$brand}";
  const bundleLocation = "{$js_bundle_location}";
  const loginRedirectUrl = "{$login_url}";
  var prodDBSimNum = "";
  let mdsUserIsLoggedIn = false;
  let mdsLoggedInUserId;
  let multiUserDraft = false;
  const mdsWidgetDistinction = {if isset($mds_widget_distinction)}true{else}false{/if};

  let socket;
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

  let timeSpentTimerId;
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
        "tool": "mockdraft_simulator"
      });
    };

    var proDBSimulationNumUrl = "https://qhy62as4g2.execute-api.us-east-1.amazonaws.com/get_pfn_sim_num";
    pureJSAjaxGet(proDBSimulationNumUrl, function(data) {
      data = JSON.parse(data);
      if (data.body) {
        prodDBSimNum = data.body[0] + 1;
      }
    }, function() {}, false);

    (function() {
      var userTotalTimeSpent = 0;
      var timerId;

      function trackTimeSpent() {
        userTotalTimeSpent += 10;
        trackGAEventForPage("time_spent", {
          "value": userTotalTimeSpent,
        });
      }

      function handleVisibilityChange() {
        if (document.visibilityState === "visible") {
          timerId = setInterval(trackTimeSpent, 10000);
        } else if (timerId) {
          clearInterval(timerId);
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);
      handleVisibilityChange();
    })();
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
    if (window.location.search.includes("mds-redraft")) {
      let searchParam = window.location.search.replace("?mds-redraft", "");
      searchParam = searchParam.replace("&mds-redraft", "");
      const pathName = window.location.origin + window.location.pathname + searchParam;
      window.history.replaceState('', '', pathName);
      const redraftBtn = $(".draft-option-btn.redraft");
      if (redraftBtn) {
        redraftBtn.click();
      }
    }

    if (brand) {
      checkUserIsLoggedIn();
    }

    widgetData = JSON.parse(localStorage.getItem("pfsnWidgetData"));
    var overlay = $(".loading-overlay");
    if (overlay) {
      if (!widgetData) {
        overlay.remove();
      }
    }

    if (widgetData) {
      loadWidgetData(widgetData);
    }

    // Listen for widget data via postMessage (cross-origin iframe fallback)
    // Also handles ack to stop the sender even if data was already loaded via localStorage
    window.handleWidgetMessage = handleWidgetMessage;
    function handleWidgetMessage(event) {
      if (event.data && event.data.type === "pfsnWidgetData" && event.data.data) {
        // Always send ack to stop the sender
        event.source.postMessage({ type: "pfsnWidgetDataAck" }, event.origin);
        // Only process data if not already loaded
        if (!widgetData) {
          try {
            widgetData = JSON.parse(event.data.data);
            if (widgetData) {
              window.removeEventListener("message", handleWidgetMessage);
              var overlay = $(".loading-overlay");
              if (overlay) {
                overlay.remove();
              }
              loadWidgetData(widgetData);
            }
          } catch(e) {
            console.error("Failed to parse widget data from postMessage", e);
          }
        } else {
          window.removeEventListener("message", handleWidgetMessage);
        }
      }
    }
    window.addEventListener("message", handleWidgetMessage);
  });

  function checkUserIsLoggedIn() {
    mdsLoggedInUserId = getCookie("{$smarty.const.COOKIE_USER_ID}");
    if (mdsLoggedInUserId) {
      mdsUserIsLoggedIn = true;
    }

    const userImageUrl = decodeURIComponent(getCookie("{$smarty.const.COOKIE_USER_PICTURE_LARGE}"));
    const userName = decodeURIComponent(getCookie("fw_name"));
    if (userName) {
      let dashboardEventData = {
        userId: mdsLoggedInUserId,
        draftType: "solo",
        properties: [{
          propertyName: "userName",
          propertyValue: 1,
        }],
        userImage: userImageUrl,
        userName: userName,
      }
      sendUserDashboardData(dashboardEventData);
    }
  }

  if (
    navigator.maxTouchPoints > 1 &&
    /Macintosh/.test(navigator.userAgent)
  ) {
    document.cookie = "device_override=tablet; path=/; max-age=31536000";
  }
</script>

{if $brand}
  {include file="./multiuser-js.tpl"}
  {include file="templates/nfl-draft-simulator/home/pfn/js.tpl"}
  {include file="templates/nfl-draft-simulator/home/pfn/dashboard/js.tpl"}
{/if}
