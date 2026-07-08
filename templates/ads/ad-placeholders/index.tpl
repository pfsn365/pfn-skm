{if !$included_ad_placeholders}
  {assign var=included_ad_placeholders  value=TRUE scope="root"}
  {include file="./css.tpl"}
  {include file="./js.tpl"}
{/if}
