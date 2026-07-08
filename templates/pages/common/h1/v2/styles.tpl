{if !$included_global_components_page_h1_v2__css}

	{assign var=included_global_components_page_h1_v2__css value=TRUE scope="root"}

	<style>
		.page-info-divider {
			width: 100%;
			display: flex;
			gap: 16px;
			align-items: center;
		}

		.page-info-divider.spacer {
			margin-top: 10px;
			margin-bottom: 10px;
		}

		.page-info-divider .divider-heading-container {
			position: relative;
			display: flex;
		}

		.page-info-divider .divider-heading-container .divider-heading-cta {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

		.page-info-divider .divider-heading {
			width: auto;
			padding: 0;
			margin: 0;
			color: #474747;
			font-weight: 600;
			font-size: 28px;
			line-height: 34px;
		}

		.page-info-divider.text-small-d .divider-heading {
			font-size: 24px;
			line-height: 31px;
		}

		.page-info-divider.text-small-d .divider-heading::after {
			height: 19px;
			width: 11px;
		}

		.page-info-divider.anchor .divider-heading::after {
			content: "";
			display: inline-block;
			margin-left: 8px;
			width: 12px;
			height: 21px;
			background-image: url("{$smarty.const.STATIC_URL}/skm/assets/ic_breadcrumb_chevron-right--0B65F0.svg");
			background-size: cover;
			background-repeat: no-repeat;
			filter: brightness(0) saturate(100%) invert(29%) sepia(0%) saturate(597%) hue-rotate(188deg) brightness(89%) contrast(90%);
		}

		:root[data-theme="dark"] .page-info-divider .divider-heading {
			background: linear-gradient(90deg, #acc8fc 0%, #fff 50%, #6edbff 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			text-align: center;
			width: fit-content;
		}

		:root[data-theme="dark"] .page-info-divider .divider-heading::after {
			filter: brightness(0) saturate(100%) invert(81%) sepia(38%) saturate(953%) hue-rotate(167deg) brightness(102%) contrast(100%);
		}

		@media (max-width: 768px) {
			.page-info-divider.spacer {
				padding: 0 16px;
			}

			.page-info-divider .h-gap {
				width: 100%;
			}

			.page-info-divider .divider-heading-wrapper {
				width: 100%;
				display: flex;
				gap: 10px;
				justify-content: space-between;
				align-items: center;
			}

			.page-info-divider .divider-heading-wrapper .divider-cta-container {
				display: flex;
			}

			.page-info-divider .divider-heading-wrapper .divider-heading.with-anchor {
				display: flex;
				align-items: center;
				gap: 5px;
			}

			.page-info-divider .divider-heading,
			.page-info-divider.text-small-d .divider-heading {
				font-size: 18px;
				line-height: 27px;
			}

			.page-info-divider .divider-heading::after,
			.page-info-divider.text-small-d .divider-heading::after {
				width: 7px;
				height: 12px;
			}
		}
	</style>

{/if}
