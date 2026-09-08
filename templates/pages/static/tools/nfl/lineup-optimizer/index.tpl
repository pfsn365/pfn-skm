{include file="./common/templates.tpl"}

{if $is_desktop}
	{include file="./desktop.tpl"}
{else}
	{include file="./mobile.tpl"}
{/if}
