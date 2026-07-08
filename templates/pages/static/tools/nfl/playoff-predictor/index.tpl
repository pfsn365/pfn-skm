{include file="./styles.tpl"}

{include file="./common/templates/index.tpl"}

<div class="playoff-predictor-tool-wrapper">
    <div class="pp-desktop-view {if !$is_desktop}hidden{/if}">
        {include file="./desktop/index.tpl"}
    </div>
    <div class="pp-tablet-mobile-view {if $is_desktop}hidden{/if}">
        {include file="./mobile/index.tpl"}
    </div>
</div>

{if !$is_desktop && $show_bottom_stick_ad}
    <div class="playoff-predictor-bottom-sticky-ad-container">
        {include file="common/ads/sticky/mobile.tpl" slotId = "Mob_32050_Sticky_2019"}
    </div>
{/if}

<div class="overlay hidden"></div>

<div class="loading-overlay">
    <div class="loader"></div>
    <div class="loading-overlay-text">Loading...</div>
</div>

<div class="nfl-feedback-container hidden">
    {include file="templates/third-party/proxy/pfn/common/feedback-cta/index.tpl"}
    {call get_feedback_cta_2024 source_page="playoff-predictor" source_tab=$feedback_source_tab large_content_text="Would you recommend our Playoff Predictor to others?" cta_text="Help us improve the game!" popup_brand_logo=$feedback_popup_logo popup_header_text="" popup_content_text="How can we improve?"}
</div>

{include file="./js.tpl"}
