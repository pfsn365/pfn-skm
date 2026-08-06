{include file="utils/script.tpl"}
<script>
  const crossIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/cross-icon.png";
  const minusRedIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/minus-red-icon.png";
  const minusBlueIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/minus-blue-icon.png";
  const plusIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/plus-icon.png";
  const checkGreenIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/check-green-icon.png";
  const checkGreenOutlineIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/check-green-outline-icon.png";
  const crossRedOutlineIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/cross-red-outline-icon.png";
  const isDesktop = "{$is_desktop}";
  const bundleLocation = "{$js_bundle_location}";
  let trackGAEventForPage;
  const brand = "{$brand}";
  const STATIC_URL = "{$smarty.const.STATIC_URL}";
  const teamLogoPath = "{$team_logo_path}";
  const logoCacheBuster = "{$logo_cache_buster}";

  if (brand) {
    trackGAEventForPage = function(eventName, eventParams) {
      eventParams = eventParams || {};
      trackGAEvent(eventName, {
        ...eventParams,
        "tool": "offseason_manager",
        "device": isDesktop ? "Desktop" : "Mobile",
      });
    };
  }

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
      value: "FREE_AGENCY_SIMULATOR_SCRIPT_LOCATION",
    }, ],
  }).then(function() {
    var overlay = $(".loading-overlay");
    if (overlay) {
      overlay.remove();
    }
  });
</script>
