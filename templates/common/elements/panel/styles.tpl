{if !$included_common_elements__panel_styles}

	{assign var=included_common_elements__panel_styles value=TRUE scope="global"}

	<style>
		:root {
			--panelXSpacingHeader: 20px;
			--panelYSpacingHeader: 10px;

			--panelXSpacingBody: 20px;
			--panelYSpacingBody: 16px;

			--panelXSpacingFooter: 20px;
			--panelYSpacingFooter: 16px;
		}

		.panel {
			--borderColor: var(--border-color--alpha, #E9E9E9);

			--xSpacingHeader: var(--panelXSpacingHeader);
			--ySpacingHeader: var(--panelYSpacingHeader);

			--xSpacingBody: var(--panelXSpacingBody);
			--ySpacingBody: var(--panelYSpacingBody);

			--xSpacingFooter: var(--panelXSpacingFooter);
			--ySpacingFooter: var(--panelYSpacingFooter);

			width: 100%;
			background-color: var(--panel-background-color);
			border: 1px solid var(--border-color--alpha);
			overflow: clip;
		}

		.panel.transparent {
			background: transparent;
		}

		.panel.rounded {
			border-radius: 12px;
		}

		.panel.with-shadow {
			box-shadow: 0px 4px 4px 0px #E9F2FA;
		}

		.panel.no-border {
			border: none;
		}

		.panel.transparent-border {
			border-color: transparent !important;
		}

		.panel.gradient-colored {
			--headingFontSize: 22px;
			--headingFontHeight: 33px;

			background: linear-gradient(90deg, #32006B 0%, #480048 100%);
			border: 2px solid #bfefff;
			border-radius: 30px;

			& .panel-header {
				padding-bottom: 0;
				border: none;

				.panel-heading {
					background: linear-gradient(90deg, #acc8fc 0%, #fff 50%, #6edbff 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					text-align: center;
					width: fit-content;
					margin: 0 auto;
					font-weight: 600;
					font-size: var(--headingFontSize);
					line-height: var(--headingFontHeight);
					letter-spacing: 0.5px;
				}
			}

			& .panel-body {
				padding-top: 5px;
			}
		}

		{if $is_desktop}
			.panel.transparent-d {
				background: transparent;
			}

			.panel.rounded-d {
				border-radius: 12px;
			}

			.panel.with-shadow-d {
				box-shadow: 0px 4px 4px 0px #E9F2FA;
			}

			.panel.no-border-d {
				border: none;
			}

		{/if}

		.panel-header {
			position: relative;
			width: 100%;
			padding: var(--ySpacingHeader) var(--xSpacingHeader);
			border-bottom: 1px solid var(--border-color--alpha);
			display: flex;
			gap: 10px;
			align-items: center;
			justify-content: center;
		}

		.panel-header.no-border {
			border-bottom: none;
		}

		.panel.fluid .panel-header {
			border-bottom: 0;

			{if $is_desktop}
				padding-bottom: 0;
			{/if}
		}

		.panel-header.column {
			flex-direction: column;
		}

		.panel-header>.panel-heading {
			width: 100%;
			margin: 0;
			padding: 0;
			color: var(--text-color--beta);
			font-weight: 600;
			font-size: 16px;
			line-height: 24px;
		}

		.panel-header>.panel-heading>h2 {
			color: #474747;
			font-weight: 600;
			font-size: 16px;
			line-height: 24px;
		}

		.panel-header a {
			display: flex;
			gap: 5px;
			align-items: center;
			align-self: center;
			cursor: pointer;
			text-decoration: none;
			white-space: nowrap;
			color: var(--hyperlink-color);
			font-size: 14px;
			line-height: 21px;
		}

		.panel-header a.view-more-cta::after {
			content: "";
			display: block;
			width: 6px;
			height: 11px;
			background-image: url("{$smarty.const.STATIC_URL}/skm/assets/ic_breadcrumb_chevron-right--0B65F0.svg");
			background-size: cover;
			background-repeat: no-repeat;
			filter: var(--hyperlink-filter, none);
		}

		.panel .panel-body {
			padding: var(--ySpacingBody) var(--xSpacingBody);
		}

		.panel .panel-body.no-padding {
			--xSpacingBody: 0;
			--ySpacingBody: 0;
		}

		.panel .panel-header.no-padding {
			--xSpacingHeader: 0;
			--ySpacingHeader: 0;
		}

		.panel .panel-body.no-h-padding {
			--xSpacingBody: 0;
		}

		.panel .panel-header.no-h-padding {
			--xSpacingHeader: 0;
		}

		.panel .panel-body.no-v-padding {
			--ySpacingBody: 0;
		}

		.panel .panel-header.no-v-padding {
			--ySpacingHeader: 0;
		}

		.panel .panel-header.no-padding-h {
			--xSpacingHeader: 0;
		}

		.panel .panel-header.no-padding-t {
			padding-top: 0;
		}

		.panel .panel-header.no-padding-b {
			padding-bottom: 0;
		}

		.panel.no-padding-b {
			padding-bottom: 0 !important;
		}

		{if $is_desktop}
			.panel .panel-body.no-padding-d {
				--xSpacingBody: 0;
				--panelXSpacingBody: 0;
				--ySpacingBody: 0;
				--panelYSpacingBody: 0;
			}

			.panel .panel-header.no-padding-d {
				--xSpacingHeader: 0;
				--ySpacingHeader: 0;
			}

			.panel .panel-body.no-h-padding-d {
				--xSpacingBody: 0;
			}

			.panel .panel-header.no-h-padding-d {
				--xSpacingHeader: 0;
			}

			.panel .panel-body.no-v-padding-d {
				--ySpacingBody: 0;
			}

			.panel .panel-header.no-v-padding-d {
				--ySpacingHeader: 0;
			}

		{/if}

		.panel .panel-footer {
			position: relative;
			width: 100%;
			padding: 0 var(--xSpacingFooter) var(--ySpacingFooter);
		}

		.panel .panel-body.no-padding+.panel-footer {
			--ySpacingFooter: 12px;
			padding-top: var(--ySpacingFooter);
		}

		.panel .panel-cta-button {
			cursor: pointer;
			width: 100%;
			color: var(--text-color--beta, #474747);
			text-decoration: none;
			text-align: center;
			display: block;
			background-color: var(--bg-color, #fff);
			border: 1px solid var(--border-color--alpha, #e2e2e2);
			border-radius: 2px;
			font-size: 16px;
			font-weight: 500;
			line-height: 18px;
			padding: 10px;
		}

		{if $is_desktop}
			.panel .panel-cta-button:hover {
				color: var(--primary-color--beta, #474747);
				border-color: var(--primary-color--beta, #474747);
			}

		{/if}

		.panel .panel-cta-link {
			width: 100%;
			display: flex;
			gap: 5px;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			text-decoration: none;
			white-space: nowrap;
			color: #0B65F0;
			font-weight: 600;
			font-size: 14px;
			line-height: 21px;
		}

		.panel .panel-cta-link::after {
			content: "";
			display: block;
			width: 6px;
			height: 11px;
			background-image: url("{$smarty.const.STATIC_URL}/skm/assets/ic_breadcrumb_chevron-right--0B65F0.svg");
			background-size: cover;
			background-repeat: no-repeat;
		}

		@media screen and (max-width: 768px) {
			.panel {
				--panelXSpacingHeader: 16px;
				--panelYSpacingHeader: 16px;

				--panelXSpacingBody: 16px;
				--panelYSpacingBody: 16px;

				--panelXSpacingFooter: 16px;
				--panelYSpacingFooter: 16px;

				--borderColor: transparent;

				border: none;
			}

			.panel.transparent-m {
				background: transparent;
			}

			.panel.rounded-m {
				border-radius: 12px;
			}

			.panel.no-rounded {
				border-radius: 0 !important;
			}

			.panel.with-shadow-m {
				box-shadow: 0px 4px 4px 0px #E9F2FA;
			}

			.panel.no-border-m {
				border: none;
			}

			.panel.gradient-colored {
				--headingFontSize: 18px;
				--headingFontHeight: 27px;

				border-radius: 0;

				& .panel-header {
					padding-top: 10px;
				}
			}

			.panel .panel-body.no-padding-m {
				--xSpacingBody: 0px;
				--ySpacingBody: 0px;
			}

			.panel .panel-header.no-padding-m {
				--xSpacingHeader: 0px;
				--ySpacingHeader: 0px;
			}

			.panel .panel-body.no-h-padding-m {
				--xSpacingBody: 0px;
			}

			.panel .panel-header.no-h-padding-m {
				--xSpacingHeader: 0px;
			}

			.panel .panel-body.no-v-padding-m {
				--ySpacingBody: 0px;
			}

			.panel .panel-header.no-v-padding-m {
				--ySpacingHeader: 0px;
			}

			.panel .panel-header.text-sm-m>.panel-heading {
				font-size: 14px;
				line-height: 21px;
			}
		}
	</style>

{/if}
