{include file="utils/script.tpl"}
{if $brand}
    {include file="third-party/proxy/$brand/common/rss-feed/index.tpl"}
{/if}

{include file="templates/utils/carousal.tpl"}

{include file="templates/pages/static/tools/nfl/playoff-predictor/common/animation-script.tpl"}

<script>
    var trackGAEventForPage = function(eventName, eventParams) {
        eventParams = eventParams || {};
        trackGAEvent(eventName, {
            ...eventParams,
            "tool": "playoff_predictor",
            "device" : "{$is_desktop}" ? "Desktop" : "Mobile"
        });
    };

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


    var STATIC_URL = "{$smarty.const.STATIC_URL}";
    var IS_DESKTOP = "{$is_desktop}";
    var DATA_SOURCE_PATH = "{$data_source_path}";
    let FEED_SOURCE_PATH = "{$smarty.const.STATIC_URL}" + "/" + "{$feeds_source_path}";
    FEED_SOURCE_PATH = FEED_SOURCE_PATH.replace("staticd.pr", "staticj.pr");
    var SEND_PAGE_VIEW_EVENT = "{$send_page_view_event}";
    var INCLUDE_SK_ADS = "{$include_sk_ads}";
    var RUN_AUTO_SIMULATION = "{$run_auto_simulation}";
    var PLAYOFF_PREDICTIONS_SUBMISSION_URL = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}/static-pages/submission/nfl/playoff-predictor/predictions";
    var brand = "{$brand}";
    var downloadImageUrl = "{$download_image_url}";
    const logoCacheBuster = "{$logo_cache_buster}";
    const teamLogoPath = "{$team_logo_path}";
    
    asyncScriptLoader({
        src: "{$js_bundle_location}",
        loadWithAsync: true,
        attributes: [{
            key: "id",
            value: "PLAYOFF_PREDICTOR_BUNDLE_SCRIPT",
        }, ],
    })
    if (!IS_DESKTOP && INCLUDE_SK_ADS) {
        registerAdUnit("NFL_Playoff_Predictor_Top");
        registerAdUnit("NFL_Playoff_Predictor_2");
    }

    (function() {
        var BREAKPOINT = 950;
        var desktopView = document.querySelector('.pp-desktop-view');
        var mobileView = document.querySelector('.pp-tablet-mobile-view');
        if (!desktopView || !mobileView) return;

        function moveBracketToActiveView(activeView) {
            var bracketContainers = document.querySelectorAll('.playoff-bracket-tab-content');
            if (bracketContainers.length < 2) return;
            var popup = null;
            for (var i = 0; i < bracketContainers.length; i++) {
                var found = bracketContainers[i].querySelector('.predict-playoff-games-popup-container');
                if (found) { popup = found; break; }
            }
            if (!popup) return;
            var target = activeView.querySelector('.playoff-bracket-tab-content');
            if (target && popup.parentElement !== target) {
                target.appendChild(popup);
            }
        }

        function toggleViews() {
            if (window.innerWidth > BREAKPOINT) {
                desktopView.classList.remove('hidden');
                mobileView.classList.add('hidden');
                moveBracketToActiveView(desktopView);
            } else {
                desktopView.classList.add('hidden');
                mobileView.classList.remove('hidden');
                moveBracketToActiveView(mobileView);
            }
        }

        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(toggleViews, 100);
        });

        toggleViews();
    })();
</script>
