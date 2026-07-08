{if !isset($shouldNotLoadAds)}
	{assign var="shouldNotLoadAds" value=FALSE}
{/if}

{if !isset($skipVideoAdPlayer)}
	{assign var="skipVideoAdPlayer" value=FALSE}
{/if}

{if defined("SKIP_VIDEO_AD_PLAYER") && $smarty.const.SKIP_VIDEO_AD_PLAYER == 1}
	{assign var="skipVideoAdPlayer" value=true}
{/if}

{if !isset($withCloseBtn)}
	{assign var="withCloseBtn" value=false}
{/if}

{if !$smarty.const.OPERA && !$shouldNotLoadAds && !$skipVideoAdPlayer}
	<style>
		:root {
			--vidazooPlayerHeight: 0px;
			--primisAspectRatio: 4 / 9;
		}

		.vidazoo-player-container {
			width: 100%;
			height: calc((1110px - 360px - 16px) * var(--primisAspectRatio));
			background-color: #000;
		}

		.sidebar-content .vidazoo-player-container, .right .sk-widget .vidazoo-player-container {
			height: calc(360px * var(--primisAspectRatio)) !important;
		}

		{if $pagetype == "FortniteItemShop"}
			.vidazoo-player-container {
				margin: 10px 0;
				padding: 10px 0;
				height: calc(1110px * var(--primisAspectRatio));
			}

		{else if in_array(strtolower($pagetype), ["slideshow", "singlepageslideshow", "articlepage"])}
			.vidazoo-player-container {
				height: calc(685px * var(--primisAspectRatio));
			}

		{else if $pagetype == "Topicpage"}
			.vidazoo-player-container {
				height: calc(650px * var(--primisAspectRatio));
			}

		{else if $pagetype == "Tagpage"}
			.vidazoo-player-container {
				clear: both;
			}
		{/if}

		{if isset($slug) && $slug == "brainbuster-wwe-player-guessing-game"}
			.vidazoo-player-container {
				height: 0px;
			}

			.vidazoo-container {
				padding: 0;
			}
		{/if}

		@media(max-width: 768px) {
			:root {
				--primisAspectRatio: 9 / 16;
			}
			.vidazoo-container {
				--floatingPlayerTopOffset: 0;
			}

			body.has-top-header .vidazoo-container {
				--floatingPlayerTopOffset: var(--topHeaderHeight);
			}

			body.has-primary-nav .vidazoo-container {
				--floatingPlayerTopOffset: var(--primaryNavHeight);
			}

			body.has-top-header.has-primary-nav .vidazoo-container {
				--floatingPlayerTopOffset: calc(var(--topHeaderHeight) + var(--primaryNavHeight));
			}

			.vidazoo-container vdz[data-view="floater"] {
				top: var(--floatingPlayerTopOffset, 0);
				z-index: calc(var(--primaryNavZIndex, 2147483647) - 1);
			}

			body .sk-cmc-ads-video-player-container .vidazoo-container {
				--floatingPlayerTopOffset: 0px;
			}

			.vidazoo-player-container, .vidazoo-player-container>div, .primis-container, .primis-holder, .primis-holder>div {
				overflow: visible !important;
			}

			.vidazoo-player-container {
				height: calc((100vw) * var(--primisAspectRatio));
			}

			{if $pagetype == "Topicpage"}
				.vidazoo-player-container {
					height: calc((100vw - 32px) * var(--primisAspectRatio));
				}
			{else if isset($slug) && $slug == "brainbuster-wwe-player-guessing-game"}
				.vidazoo-player-container {
					height: 0px;
				}

				.vidazoo-container {
					padding: 0;
				}
			{/if}

			.vidazoo-close-btn {
				position: absolute;
				top: 10px;
				right: 10px;
				z-index: 99999;
			}

			.vidazoo-close-btn img {
				width: 20px;
				height: 20px;
			}
		}
	</style>

	<div class="vidazoo-player-container">
		<span class="vidazoo-close-btn {if !$withCloseBtn} hidden {/if}">
			<img data-lazy="{$smarty.const.STATIC_URL}/cmc-predictor/v2/cross-icon.png?w=40" width="20" height="20" alt="close" loading="lazy"/>
		</span>
		{include file="./index.tpl" playerId=$playerId load_without_interaction=$load_without_interaction withCloseBtn=$withCloseBtn customLoad=$customLoad}
	</div>

	<script>
		(() => {
			const container = $(".vidazoo-player-container");

			const callback = (mutationList) => {
				for (const mutation of mutationList) {
					if (mutation.type != "attributes") continue;
					if (mutation.attributeName != "data-float-active") continue;

					const isStickyPlayerActive = mutation.target.hasAttribute("data-float-active");

					const stickyPlayerHeight = isStickyPlayerActive ? mutation.target.clientHeight : 0;

					document.body.style.setProperty("--vidazooPlayerHeight", stickyPlayerHeight + "px");
				}
			};

			const observer = new MutationObserver(callback);

			observer.observe(container, {
				attributes: true,
				childList: false,
				subtree: true
			});
		})();
	</script>
{/if}
