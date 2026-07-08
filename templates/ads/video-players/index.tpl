{if !isset($shouldNotLoadAds)}
{assign var="shouldNotLoadAds" value=FALSE}
{/if}
{if !$shouldNotLoadAds}
{if empty($playerId)}
	{assign var=skVideoPlayerIdsConfig value=$smarty.const.SK_ADS_VIDEO_PLAYER_ID}
	{assign var=playerId value=json_encode($skVideoPlayerIdsConfig["others"])}
{/if}
{include "desktop/utils/user-geo.tpl"}
<div id="video-player-container--{$placement}"></div>
<script>
	(function () {
		var AU_KV_CHECK_TIMEOUT = 2000;
		var playerLoaded = false;
		
		{if $customLoad}
			window.addEventListener("custom:sk:load_video_player", function () {
				onDomLoaded();
			});
		{else}
			window.addEventListener("DOMContentLoaded", onDomLoaded);
			if (domContentLoaded) {
				onDomLoaded();
			}
		{/if}

		function checKAndProcessVideoAdPlayersQueue() {
			"processVideoAdPlayersQueue" in window && processVideoAdPlayersQueue();
			{* Just in case the function wasn't available in the first few attempts, wait for it. *}
			for (var second = 1; second <= 5; second++) {
				setTimeout(function () {
					"processVideoAdPlayersQueue" in window && processVideoAdPlayersQueue();
				}, second * 1000);
			}
		}

		function loadPlayerWithTargeting(input) {
			if (playerLoaded) {
				return;
			}
			playerLoaded = true;
			var slots = googletag.pubads().getSlots();
			var audigentValue = input.audigentValue || [];
			var publisherTargeting = "";
			var param1Targeting = null;
			var targetingParams = {};
			if (slots.length > 0) {
				targetingParams = {
					BSC: slots[0].getTargeting("BSC"),
					ABS: slots[0].getTargeting("ABS"),
					IDS: slots[0].getTargeting("IDS"),
					AU_SEG: audigentValue,
				};
				param1Targeting = targetingParams.ABS ? "1" : null;
			}
			if (BRAND_SAFETY_CAMPAIGNS) {
				for(var key in BRAND_SAFETY_CAMPAIGNS) {
					targetingParams[key] = BRAND_SAFETY_CAMPAIGNS[key];
				}
			}
			if (slots.length > 0) {
				publisherTargeting = new URLSearchParams(targetingParams).toString();
			}
			input.publisherTargeting = decodeURIComponent(publisherTargeting).replaceAll("&", "%26");
			input.param1Targeting = param1Targeting;
			loadPlayerHelper(input);
		}

		function onDomLoaded() {
				Promise.all([
					asyncScriptLoader({
					src: VIDEO_PLAYER_SCRIPT_LOCATION,
					loadWithAsync: true,
					attributes: [
						{
							key: "id",
							value: "VIDEO_PLAYER_SCRIPT_LOCATION",
						},
					],
				}),
				USER_GEO_LOCATION_PROMISE
			]).then(function ([e, userGeo]) {
				var userCountry = String(getCookie("country_code")).toUpperCase();
				var userCity = String(userGeo.city).toLowerCase();
				var userState = String(userGeo.state).toLowerCase();
				var categorySlug = "{$category_slug}".toLowerCase();
				var eventSlug = "{$event_slug}".toLowerCase();
				var placement = "{$placement}";
				var playerIdsObject = JSON.parse('{$playerId}');
				var isOutstreamPlayer = "{$isOutstreamPlayer}";
				if (userCountry == "IN") {
					playerId = playerIdsObject["IN"];
				} else {
					playerId = playerIdsObject["ROW"];
				}

				if (userCountry == "IN" && playerId == "120058") {
					if (!["maharashtra"].includes(userState)) {
						playerId = "122167";
					}
				}

				var isDesktop = "{$is_desktop}";
				var pageType = "{$pagetype}";
				var fired = false;
				function load() {
					if (fired) return;
					fired = true;
					var playerContainer = document.getElementById("video-player-container--{$placement}");
					var input = {
						playerContainer: playerContainer,
						categorySlug: categorySlug,
						userCountry: userCountry,
						placement: placement,
						playerId: playerId
					};

					googletag.cmd.push(function() {
						window.onDvtagReady(function() {
							document.addEventListener("auSegReady", function(e) {
								input.audigentValue = e.detail.segments;
								loadPlayerWithTargeting(input);
							});

							setTimeout(function() {
								loadPlayerWithTargeting(input);
							}, AU_KV_CHECK_TIMEOUT);
						});					
					});

					document.removeEventListener("scroll", load);
					document.removeEventListener("mousemove", load);
					document.removeEventListener("touchmove", load);

					{if $withCloseBtn}
						var closeBtn = document.querySelector(".vidazoo-player-container .vidazoo-close-btn");
						if (closeBtn) {
							closeBtn.addEventListener("click", function(event) {
								var container = event.target.closest(".vidazoo-player-container");
								if (container) {
									addClass(container, "hidden");
								}
							});
						}
					{/if}
				}

				{if $load_without_interaction}
					load();
					checKAndProcessVideoAdPlayersQueue();
				{/if}

				document.addEventListener("scroll", load, { once: true, passive: true });
				document.addEventListener("mousemove", load, { once: true, passive: true });
				document.addEventListener("touchmove", load, { once: true, passive: true });
			})
		}
	})();
</script>
{/if}
