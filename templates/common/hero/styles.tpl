{if isset($use2027Layout) && $use2027Layout}
	{include_once file="common/hero/2027/styles.tpl"}
{else}
	<style>
		.hero-container {
			width: 100%;
			position: relative;
			display: flex;

			{if $is_desktop}
				min-height: 130px;
				margin-bottom: 15px;
			{/if}
		}

		.hero-container .wrapper-container {
			display: flex;
		}

		{if $is_desktop}
			.hero-container .hero-content {
				padding: 0 20px;
			}

		{/if}
	</style>
{/if}
