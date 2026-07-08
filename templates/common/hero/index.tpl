{if isset($heroFragment) && !empty($heroFragment) && !empty($heroFragmentData)}
	{include file="./styles.tpl"}

	<div class="hero-container {$heroFragmentData['containerClasses']}">
		<div class="wrapper-container">
			{include file="{$heroFragment}"}
		</div>
	</div>

	{include file="./js.tpl"}
{/if}
