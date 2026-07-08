{if !$included_common_widgets__container}

	{assign var=included_common_widgets__container value=TRUE scope="global"}

	{include_once file="common/elements/panel/index.tpl"}

	<style>
		.sk-widget-grid-wrapper {
			--gap: 30px;

			display: flex;
			flex-direction: column;
			gap: var(--gap);

			.page-info-divider {
				padding: 0 16px;
			}
		}

		.sk-widgets-grid-items {
			display: flex;
			flex-direction: column;
			gap: var(--gap);
		}

		.sk-widgets-grid {
			--rightRegionWidth: 440px;

			display: grid;
			grid-template-columns: 1fr var(--rightRegionWidth);
			grid-template-areas: "left right";
			gap: var(--gap);

			&:not(:has(.grid-widgets-right)) {
				grid-template-columns: 1fr;
				grid-template-areas: "left";
			}

			.grid-widgets-left {
				grid-area: left;
				display: flex;
				flex-direction: column;
				gap: var(--gap);
				min-width: 0;
			}

			.grid-widgets-right {
				grid-area: right;
				display: flex;
				flex-direction: column;
				gap: var(--gap);
				min-width: 0;
			}

			.sk-widget-group {
				display: grid;
				grid-template-columns: repeat(var(--cols), 1fr);
				gap: var(--gap);
			}

			.sk-widget-item {
				min-width: 0;

				{if $is_desktop}
					.sk-widget,
					.sk-widget .panel {
						height: stretch;
					}

				{/if}
			}
		}

		@media (max-width: 768px) {
			.sk-widgets-grid {
				grid-template-columns: 1fr;
				grid-template-areas:
					"left"
					"right";

				.sk-widget-group {
					grid-template-columns: 1fr;
				}
			}
		}

		{**}

		.section-separator:has(+ .sk-widget.fluid) {
			border-color: transparent;
		}

		.sk-widget.fluid+.section-separator {
			border-color: transparent;
		}

		.section-separator:has(+ .sk-widget.no-pre-separator) {
			display: none;
		}

		.sk-widget.no-post-separator+.section-separator {
			display: none;
		}

		.sk-widget .sk-widget-footer-note {
			font-size: 12px;
			line-height: 18px;
			font-style: italic;
			color: #2D2D2D;
			text-align: right;
			background: #ffff;
		}

		@media (max-width: 768px) {
			.sk-widgets-row {
				flex-direction: column;
			}

			.section-separator:has(+ .sk-widget.no-pre-separator-m) {
				display: none;
			}

			.sk-widget.no-post-separator-m+.section-separator {
				display: none;
			}

			.sk-widget .sk-widget-footer-note {
				font-size: 10px;
				line-height: 15px;
			}

			.sk-widget+.section-separator.mb-15--m {
				margin-bottom: 15px;
			}
		}
	</style>

	{function generateSeparator thick=false extraClasses=""}
		<div class="section-separator{if !empty($extraClasses)} {$extraClasses}{/if}{if $thick} thick{/if}"></div>
	{/function}

	{function renderWidgetsGrid grid=[] withSeparator=true}
		<div class="sk-widget-grid-wrapper">
			{if !empty($widget["heading"])}
				{include file="pages/common/h1/v2/index.tpl" h1=$widget["heading"] useH2=true useAnchor=false}
			{/if}
			<div class="sk-widgets-grid-items">
				{foreach $widget["grid"] as $wr}
					{if !empty($wr["left"]) || !empty($wr["right"])}
						<div class="sk-widgets-grid">
							{if !empty($wr["left"])}
								<div class="grid-widget-area grid-widgets-left">
									{foreach $wr["left"] as $group}
										<div class="sk-widget-group" style="--cols: {count($group)}">
											{foreach $group as $w}
												{$w["withoutSeparator"] = true}
												<div class="sk-widget-item {$w['params']['componentId']}">
													{call generateWidgetSection widget=$w}
												</div>
											{/foreach}
										</div>
									{/foreach}
								</div>
							{/if}
							{if !empty($wr["right"])}
								<div class="grid-widget-area grid-widgets-right">
									{foreach $wr["right"] as $w}
										{$w["withoutSeparator"] = true}
										<div class="sk-widget-item {$w['params']['componentId']}">
											{call generateWidgetSection widget=$w}
										</div>
									{/foreach}
								</div>
							{/if}
						</div>
					{/if}
				{/foreach}
			</div>
		</div>

		{if $withSeparator}
			{generateSeparator}
		{/if}
	{/function}

	{function generateWidgetSection widget=[]}
		{if $widget["type"] == "widget_grid" && is_array($widget["grid"])}
			{renderWidgetsGrid grid=$widget["grid"] withSeparator=true}
		{else}
			{$needSeparator = !!!$widget["withoutSeparator"]}
			{$needTopSeparator = !!$widget["withTopSeparator"]}
			{$needThickSeparator = !!$widget["withThickSeparator"]}

			{if !!$widget["withoutSeparatorDesktop"] && $is_desktop}
				{$needSeparator = false}
			{/if}
			{if !!$widget["withoutSeparatorMobile"] && !$is_desktop}
				{$needSeparator = false}
			{/if}

			{**}

			{if !empty($widget["note"]) && !empty($widget["note"]["position"])}
				{assign var="hasNote" value=true}
				{assign var="footerNote" value=$widget["note"]}
			{/if}


			{$containerClasses = NTernary($widget["containerClasses"], "")}
			{if !empty($widget["section"])}
				{$containerClasses = implode(" ", [$containerClasses, $widget["section"]])}
			{/if}
			{if isset($widget["withFluidPanel"]) && $widget["withFluidPanel"]}
				{$containerClasses = implode(" ", [$containerClasses, "fluid"])}
			{/if}
			{if isset($widget["withFluidPanelDesktop"]) && $widget["withFluidPanelDesktop"] && $is_desktop}
				{$containerClasses = implode(" ", [$containerClasses, "fluid"])}
			{/if}
			{if isset($widget["withFluidPanelMobile"]) && $widget["withFluidPanelMobile"] && !$is_desktop}
				{$containerClasses = implode(" ", [$containerClasses, "fluid"])}
			{/if}

			{if $needSeparator && $needTopSeparator}
				{generateSeparator thick=$needThickSeparator}
			{/if}
			{if $widget["isFragment"]}
				<section class="sk-widget {$containerClasses}">
					{foreach $widget["params"] as $paramKey => $paramValue}
						{assign nocache var="{$paramKey}" value=$paramValue}
					{/foreach}
					{include file={$widget["fragment"]}}
				</section>
			{else}
				<section class="sk-widget {$containerClasses}">
					{capture nocache name="widgetBodyRenderer" assign="widgetBody"}
						{if !empty($widget["templateFile"])}
							{include file={$widget["templateFile"]} templateData=$widget["templateData"]}
						{/if}
					{/capture}

					{$widget["body"] = $widgetBody}
					{call generatePanelElement elementInput=$widget}

					{if $hasNote && $footerNote["position"] == "footer"}
						<div class="sk-widget-footer-note">{$footerNote["label"]}</div>
					{/if}
				</section>
			{/if}
			{if $needSeparator && !$needTopSeparator}
				{generateSeparator thick=$needThickSeparator extraClasses=$widget["separatorClasses"]}
			{/if}
		{/if}
	{/function}

{/if}
