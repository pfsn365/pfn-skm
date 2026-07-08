{if !$smarty.const.OPERA}
{assign var=ad_units value=$smarty.const.AD_UNITS}
{include file="ads/ad-placeholders/index.tpl"}
{if empty($is_desktop)}
    {assign var=is_desktop value=false}
{/if}
{if empty($sticky)}
    {assign var=sticky value=false}
{/if}
{assign var=min_height value=$ad_units.$slotId.mediaTypes.banner.sizes[0][1]}
{if $ad_units.$slotId.mediaTypes.banner.sizes[0] == "fluid" && $ad_units.$slotId.mediaTypes.banner.sizes|@count > 1}
    {assign var=min_height value=$ad_units.$slotId.mediaTypes.banner.sizes[1][1]}
{/if}
{foreach $ad_units.$slotId.mediaTypes.banner.sizes as $size}
    {if $size != "fluid" && $min_height > $size[1]} {* Approach for this condition was to keep the max possible height for the placeholder, so that ad unit is contained within it, and doesn’t jank the page down. *}
        {$min_height = $size[1]}
    {/if}
{/foreach}
{if array_key_exists('sticky', $ad_units.$slotId) && $ad_units.$slotId.sticky}
{$min_height = "50"}{* If this is not hardcoded, it leads to issue like this: https://bitbucket.org/keedaofsports/skm/issues/26/ad-unit-sticky-has-overlapping-close *}
{else}
    {if $ad_units.$slotId.div == "div-gpt-ad-1548933259437-0" || $ad_units.$slotId.div == "div-gpt-ad-1702625128436-0" || $ad_units.$slotId.div == "div-gpt-ad-1549351402243-0" || $ad_units.$slotId.div == "div-gpt-ad-1549351402243-0" }
        {$min_height = $min_height + 5}
    {else}
        {$min_height = $min_height + 30}
    {/if}
{/if}
{if array_key_exists('noMinHeight', $ad_units.$slotId) && $ad_units.$slotId.noMinHeight}
{$min_height = ""}
{/if}
{if empty($containerClass)}
    {assign var="containerClass" value=""}
{/if}

{if isset($nofullheight) && $nofullheight}
{* if this flag is set, we don't want the container to take max possible height, instead we want it to take least possible height.
This is helpful in below the fold or sticky ads where ad appearance doesn't jump layout 
and we don't have awkwardly large padding in case a small creative appears instead the max potential size. *}
{foreach $ad_units.$slotId.mediaTypes.banner.sizes as $oneSize}
    {if $min_height > $oneSize[1]} {* This entire loop will at the end leave $min_height with least possible height defined for this ad unit. *}
        {$min_height = $oneSize[1]}
    {/if}
{/foreach}
{/if}

{if $slotId == "Desktop_72890_1"}
    {$ad_units.$slotId.minHeight = "90px"}
{/if}

{if !empty($ad_units.$slotId.parallax)}
    {include file='ads/ad-parallax.tpl'}
{elseif !empty($ad_units.$slotId.inhouse)}
    {include file='ads/ad-inhouse.tpl'}
{elseif !empty($ad_units.$slotId.sticky)}
    {include file='ads/ad-sticky.tpl'} {* TODO: FLAG – this will mess things up, fix later : sankalp@sportskeeda.com *}
{elseif !empty($ad_units.$slotId.interstitial)}
    {include file='ads/ad-interstitial.tpl'}
{elseif !empty($ad_units.$slotId.native)}
    {include file='ads/ad-native.tpl'}
{elseif !empty($ad_units.$slotId.refresh)}
    <!-- /{$smarty.const.AD_CODE}/{$slotId} -->
    <div id='{$ad_units.$slotId.div}' style='width:320px;clear: both;margin:0 auto;'>
        <script>
            if(typeof displayAdSlot !== 'undefined') {
                displayAdSlot('{$ad_units.$slotId.div}');
            }
        </script>
    </div>
{else}
    <div class="{if !empty($header)}header-ad{elseif !$is_desktop}mobile-ad-negative-space{else}ad-container{/if} {$containerClass}" id='{if $ad_units.$slotId.infiniteContent|default:false}infinite-content-ad-{$key}{/if}'
    style="
        {if $ad_units.$slotId.div == "div-gpt-ad-1549351402243-0"}max-height: {$min_height}px;
        {else if !empty($ad_units.$slotId.minHeight)}min-height: {$ad_units.$slotId.minHeight};
        {else if empty($ad_units.$slotId.noMinHeight)}min-height: {$min_height}px;
        {/if}
        width: 100%; text-align: center;clear:both;
        {if $sticky}position:sticky;top:20px;background:#f6f6f6;z-index:10;{/if}
        {if $ad_units.$slotId.div == "div-gpt-ad-1616756011923-0"}
            transition: max-height 2.7s; max-height: 50px;min-height:250px;
        {else if $ad_units.$slotId.div == "div-gpt-ad-1548933259437-0" || $ad_units.$slotId.div == "div-gpt-ad-1702625128436-0"}
            transition: max-height 2.7s; max-height: 50px;min-height:100px;
        {/if}
        {if $ad_units.$slotId.div == "div-gpt-ad-1548933259437-0" || $ad_units.$slotId.div == "div-gpt-ad-1702625128436-0" || $ad_units.$slotId.div == "div-gpt-ad-1549351402243-0" || $ad_units.$slotId.div == "div-gpt-ad-1616756011923-0"}background-color: white;{/if}">
        {if $ad_units.$slotId.div != "div-gpt-ad-1548933259437-0" && $ad_units.$slotId.div != "div-gpt-ad-1702625128436-0" && $ad_units.$slotId.div != "div-gpt-ad-1549351402243-0" && $ad_units.$slotId.div != "div-gpt-ad-1616756011923-0" && $ad_units.$slotId.div != "div-gpt-ad-1471942863237-0"}
            {include file="ads/mobile/ad-explicit-declare.tpl"}
        {/if}
        <!-- /{$smarty.const.AD_CODE}/{$slotId} -->
        {generateAdPlaceholderMarkup($variant)}
        {if !$ad_units.$slotId.infiniteContent|default:false}
        <div id='{$ad_units.$slotId.div}' class="{if !$is_desktop}mobile-ad-holder{/if}" {if !empty($refreshConfig)} data-refresh-config='{$refreshConfig}'{/if}>
            <script>
                {if $ad_units.$slotId.div == "div-gpt-ad-1680275006038-0" || $ad_units.$slotId.div == "div-gpt-ad-1471939034701-0" || $ad_units.$slotId.div == "div-gpt-ad-1653457590899-0"}
                if (typeof displayAdSlot !== 'undefined' && !window['AVOID_LOADING_SIDEBAR_AD_UNITS']) {
                    displayAdSlot('{$ad_units.$slotId.div}');
                }
                {else if $ad_units.$slotId.div !== "div-gpt-ad-1677757730897-0" && $ad_units.$slotId.div !== "div-gpt-ad-1486709274862-3" && $ad_units.$slotId.div !== "div-gpt-ad-1486709274862-4" && $ad_units.$slotId.div !== "div-gpt-ad-1496133676474-0" && $ad_units.$slotId.div !== "div-gpt-ad-1667550438170-0"}
                if (typeof displayAdSlot !== 'undefined') {
                    displayAdSlot('{$ad_units.$slotId.div}');
                }
                {/if}
            </script>
        </div>
        {/if}
    </div>
{/if}
{include file="ads/in_feed_ad_expand.tpl"}
{/if}
