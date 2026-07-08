<style>
	:root {
		{if $is_desktop}
			--breadcrumbHeight: 26px;
		{else}
			--breadcrumbHeight: 23px;
		{/if}
	}

	{* Breadcrumb needs to be in sync with hero *}
	.breadcrumb-section {
		width: 100%;
		z-index: 99;
		position: absolute;
		left: 0;

		.breadcrumb-container {
			--bcForegroundColor: #2D2D2D;
			--bcAssetFilter: brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(1%) hue-rotate(276deg) brightness(99%) contrast(91%);

			padding: 4px 18px;
			background: transparent;

			.breadcrumb-list li img,
			.breadcrumb-list li::after {
				filter: var(--bcAssetFilter);
			}
		}
	}

	{if isset($hasDarkHeroBackground) && $hasDarkHeroBackground}
		.breadcrumb-section .breadcrumb-container {
			--bcForegroundColor: #fff;
			--bcAssetFilter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(354deg) brightness(103%) contrast(102%);
		}
	{/if}

	{* Hero styles *}

	body.l--2027 .hero-section {
		margin: 0;
	}

	.hero-container {
		--containerHeight: 210px;
		--countdownSpacing: 0px;
		--heroContainerHeight: calc(var(--containerHeight) + var(--breadcrumbHeight) + var(--countdownSpacing));

		position: relative;
		display: flex;
		flex-direction: column;

		width: 100%;
		min-height: minmax(max-content, var(--heroContainerHeight));
	}

	.hero-container .wrapper-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--breadcrumbHeight);
		margin-top: calc(-1 * var(--breadcrumbHeight) / 2);
	}

	.hero-container.has-countdown {
		--countdownSpacing: 0px;

		.wrapper-container {
			justify-content: flex-start;
		}
	}

	@media(max-width: 768px) {
		.hero-container.has-countdown {
			--countdownSpacing: 40px;
		}
	}
</style>
