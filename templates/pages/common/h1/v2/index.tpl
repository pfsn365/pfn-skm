{if !(isset($hideMainH1) && $hideMainH1)}
	{include file="./styles.tpl"}

	{$hasAnchor = false}
	{if isset($useAnchor) && $useAnchor && !empty($anchorURL)}
		{$hasAnchor = true}
	{/if}

	<section class="page-info-divider {$containerClasses} {if $hasAnchor}anchor{/if} {if $withSpacer}spacer{/if}">
		<div class="divider-heading-container">
			{if $hasAnchor}
				<a href="{$anchorURL}" class="divider-heading-cta" aria-label="cta"></a>
			{/if}
			{if isset($useH2) && $useH2}
				<h2 class="divider-heading">{$h1}</h2>
			{else}
				<h1 class="divider-heading">{$h1}</h1>
			{/if}
		</div>
	</section>

	{include file="pages/common/h1/js.tpl"}
{/if}
