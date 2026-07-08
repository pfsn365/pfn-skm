{if !$included_common_elements__panel}

	{assign var=included_common_elements__panel value=TRUE scope="global"}

	{include_once file="common/elements/panel/styles.tpl"}

	{function generatePanelElement elementInput=[]}

		{assign var="hasCta" value=FALSE}
		{if !empty($elementInput["cta"]) && !empty($elementInput["cta"]["url"]) && !empty($elementInput["cta"]["position"])}
			{assign var="hasCta" value=TRUE}
		{/if}

		{function generateHeading useCTA=false elementInput=[]}
			{if $useCTA}
				<a href="{$elementInput['cta']['url']}">{$elementInput["heading"]}</a>
			{else}
				{$elementInput["heading"]}
			{/if}
		{/function}

		<div class="panel {$elementInput['containerClasses']}">
			{if !empty($elementInput["heading"])}
				<header class="panel-header {$elementInput['headerClasses']}">

					{$hasHeadingCTA = $hasCta && $elementInput["cta"]["position"] == "heading"}

					{if $elementInput["useH1ForHeading"]}
						<h1 class="panel-heading{if $hasHeadingCTA} with-cta{/if}">
							{generateHeading useCTA=$hasHeadingCTA elementInput=$elementInput}
						</h1>
					{else}
						<h2 class="panel-heading{if $hasHeadingCTA} with-cta{/if}">
							{generateHeading useCTA=$hasHeadingCTA elementInput=$elementInput}
						</h2>
					{/if}

					{if $hasCta && $elementInput["cta"]["position"] == "header"}
						<a class="view-more-cta" href="{$elementInput['cta']['url']}" data-section="{$elementInput['cta']['section']}">
							<span>{$elementInput["cta"]["label"]}</span>
						</a>
					{/if}
				</header>
			{/if}
			{if !empty($elementInput["body"])}
				<div class="panel-body {$elementInput['bodyClasses']}">
					{$elementInput["body"]}
				</div>
			{/if}
			{if $hasCta && $elementInput["cta"]["position"] == "footer"}
				{$variant = ($elementInput["cta"]["variant"] == "link") ? "panel-cta-link" : "panel-cta-button"}
				<footer class="panel-footer">
					<a class="{$variant} view-more-cta {$elementInput['cta']['variant']}" href="{$elementInput['cta']['url']}"
						data-section="{$elementInput['cta']['section']}">
						<span>{$elementInput["cta"]["label"]}</span>
					</a>
				</footer>
			{/if}
		</div>
	{/function}

{/if}
