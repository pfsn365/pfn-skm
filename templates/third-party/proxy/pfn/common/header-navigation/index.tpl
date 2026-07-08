{include file="./styles.tpl"}

{if $is_desktop}
  {include file="./desktop.tpl"}
{else}
  {include file="./mobile.tpl"}
{/if}

{include file="./js.tpl"}
