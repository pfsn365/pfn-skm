{include file="./styles.tpl"}

{include file="./common/templates/index.tpl"}

<div class="playoff-predictor-tool-wrapper">
    {if $is_desktop}
        {include file="./desktop/index.tpl"}
    {else}
        {include file="./mobile/index.tpl"}
    {/if}
</div>

<div class="overlay hidden"></div>
