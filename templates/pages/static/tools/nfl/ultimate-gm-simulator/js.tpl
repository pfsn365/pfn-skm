{include file="utils/script.tpl"}

{if $is_desktop}
  {include file="templates/utils/carousal.tpl"}
{/if}

{include file="./canvas.tpl"}
{include file="./fetch-data.tpl"}
<script>
  const teamLogoPath = "{$team_logo_path}";
  const logoCacheBuster = "{$logo_cache_buster}";
  const upcomingSeason = "{$upcoming_season}";
  const currentSeason = "{$current_season}";
  const upcomingYear = "{$upcoming_year}";
  const SEND_PAGE_VIEW_EVENT = "{$send_page_view_event}";
  const STATIC_URL = "{$smarty.const.STATIC_URL}";
  const IS_DESKTOP = "{$is_desktop}";
  const mdsPickValue = [1000, 717, 514, 491, 468, 446, 426, 406, 387, 369, 358, 347, 336, 325, 315, 305, 296, 287, 278, 269, 261, 253, 245, 237, 230, 223, 216, 209, 202, 196, 190, 184, 180, 175, 170, 166, 162, 157, 153, 149, 146, 142, 138, 135, 131, 128, 124, 121, 118, 115, 112, 109, 106, 104, 101, 98, 96, 93, 91, 88, 86, 84, 82, 80, 78, 76, 75, 73, 71, 70, 68, 67, 65, 64, 63, 61, 60, 59, 57, 56, 55, 54, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 30, 29, 28, 28, 27, 26, 26, 25, 25, 24, 24, 23, 23, 22, 21, 21, 20, 20, 19, 19, 18, 18, 18, 17, 17, 17, 17, 16, 16, 16, 15, 15, 14, 14, 14, 13, 13, 13, 13, 12, 12, 12, 12, 12, 11, 11, 11, 11, 10, 10, 10, 10, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 6, 8, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const mdsFuturePickValues = {
    "1st": 150,
    "2nd": 65,
    "3rd": 30,
    "4th": 15,
    "5th": 8,
    "6th": 5,
    "7th": 2,
  };
  const crossIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/cross-icon.png";
  const minusRedIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/minus-red-icon.png";
  const minusBlueIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/minus-blue-icon.png";
  const plusIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/plus-icon.png";
  const checkGreenIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/check-green-icon.png";
  const checkGreenOutlineIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/check-green-outline-icon.png";
  const crossRedOutlineIcon = "{$smarty.const.STATIC_URL}/skm/assets/free-agency-simulator/cross-red-outline-icon.png";
  const trackGAEventForPage = function(eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, {
      ...eventParams,
      "tool": "ultimate_simulator",
      "device" : "{$is_desktop}" ? "Desktop" : "Mobile"
    });
  };

  asyncScriptLoader({
        src: "{$js_bundle_location}",
        loadWithAsync: true,
        attributes: [{
            key: "id",
            value: "ULTIMATE_SIMULATOR_SCRIPT_LOCATION",
        }, ],
    })
</script>
