{if !$smarty.const.OPERA}
	<style>
		:root {
			--bottomStickyAdHeight: 55px;
		}

		.sticky-container {
			display: block;
			width: 100%;
			height: var(--bottomStickyAdHeight);
			position: fixed;
			bottom: 0;
			z-index: 2222;
			background: #fff;

			{if isset($useDarkBottomStickyVariant) && $useDarkBottomStickyVariant}
				background: #07070E;
			{else}
				background: #fff;
			{/if}
		}

		:root[data-theme="dark"] .sticky-container {
			background: #07070E;
		}

		.sticky-container>div {
			bottom: 0;
		}
	</style>

	<div id="sticky-ad-container" class="sticky-container">
		{include file="ads/ad-common.tpl" slotId = $slotId}
	</div>
{/if}
