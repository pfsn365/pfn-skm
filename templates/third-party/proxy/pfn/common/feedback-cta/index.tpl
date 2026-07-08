{include file="./styles.tpl"}

{function get_feedback_cta_2023 source_page="" source_tab="" cta_text="" sheet_name="" popup_brand_logo=null popup_header_text=null sub_tab=""}
    {if !$cta_text}
        {assign var="cta_text" value="What can we do better?"}
    {/if}

    {if is_null($popup_brand_logo)}
        {assign var="popup_brand_logo" value="logo/sk-short-logo.png"}
    {/if}

    {if is_null($popup_header_text)}
        {assign var="popup_header_text" value="Sportskeeda"}
    {/if}

    <div class="feedback-parent-container {$source_tab} {$sub_tab|replace:"&":"-"}" data-brand-logo="{$popup_brand_logo}" data-header-text="{$popup_header_text}">
        <div class="feedback-cta-container">
            <div class="feedback-cta-holder">
                <button class="feedback-cta-button" data-feedback-page="{$source_page}" data-feedback-sheet="{$sheet_name}" data-feedback-section="{$source_tab}" data-feedback-tab="{$sub_tab}">{$cta_text}</button>
            </div>
        </div>

        <div class="feedback-popup-container"></div>
        <div class="feedback-success-modal-container"></div>
    </div>

{/function}

{function get_feedback_cta_2024 source_page="" source_tab="" large_content_text="" cta_text="" sheet_name="" popup_brand_logo=null popup_header_text=null manual_email_required=true}
    {if !$cta_text}
        {assign var="cta_text" value="What can we do better?"}
    {/if}

    {if is_null($popup_brand_logo)}
        {assign var="popup_brand_logo" value="logo/sk-short-logo.png"}
    {/if}

    {if is_null($popup_header_text)}
        {assign var="popup_header_text" value="Sportskeeda"}
    {/if}

    <div class="feedback-parent-container {$source_tab}" data-brand-logo="{$popup_brand_logo}"
        data-header-text="{$popup_header_text}" data-popup-content-text="{$popup_content_text}" data-email-required="{$manual_email_required}">
        <div class="experience-feedback-popup-holder flex-box">
            <div class="experience-feedback-popup-box">
                <div class="experience-feedback-popup-header flex-box">
                    <img class="brand-logo" width="24" height="24" alt="brand-logo"
                        src="{$smarty.const.STATIC_URL}/{$popup_brand_logo}" />
                    <span class="header-text"></span>
                    <img class="close-overlay-icon" width="15" height="15" alt="close-icon"
                        src="{$smarty.const.STATIC_URL}/skm/assets/close.png" />
                </div>
                <div class="experience-feedback-popup-content-holder">
                    <span class="experience-content-text-large">{$large_content_text}</span>
                </div>
                <div class="experience-feedback-popup-buttons flex-box">
                    <button class="experience-feedback-positive-button" data-feedback-page="{$source_page}"
                        data-feedback-sheet="{$sheet_name}" data-feedback-section="{$source_tab}">
                        <div class="experience-feedback-btn-container">
                            <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/like-icon.png" height="25px"
                                width="25px" alt="positive-btn" />
                            <span>Yes</span>
                        </div>
                    </button>
                    <button class="experience-feedback-negative-button" data-feedback-page="{$source_page}"
                        data-feedback-sheet="{$sheet_name}" data-feedback-section="{$source_tab}">
                        <div class="experience-feedback-btn-container">
                            <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dislike-icon.png" height="25px"
                                width="25px" alt="negative-btn" />
                            <span>No</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>


        <div class="feedback-popup-container"></div>
        <div class="feedback-success-modal-container"></div>
    </div>

{/function}

<template id="feedback-popup-template">
    <div class="feedback-popup-holder flex-box">
        <div class="feedback-popup-box">
            <div class="feedback-popup-header flex-box">
                <img class="brand-logo" width="24" height="24" alt="brand-logo" />
                <span class="header-text"></span>
                <img class="close-overlay-icon" width="15" height="15" alt="close-icon" src="{$smarty.const.STATIC_URL}/skm/assets/close.png" />
            </div>
            <div class="feedback-popup-content-holder">
                <span class="feedback-popup-content-text"></span>
                <div class="feedback-popup-data">
                    <textarea class="feedback-text" rows=4 placeholder="Please type your feedback..."></textarea>
                </div>
            </div>
            <div class="feedback-popup-buttons flex-box">
                <button class="feedback-cancel-button">Cancel</button>
                <button class="feedback-submit-button" disabled>Submit</button>
            </div>
        </div>
    </div>
</template>

<template id="feedback-success-modal-template">
    <div class="feedback-success-modal">
        <div class="feedback-success-modal-msg">
            <div class="success-img"></div>
            <span class="success-title"><b>Thank you for your Feedback!</b></span>
        </div>
        <div class="success-popup-backdrop"></div>
    </div>
</template>

{include file="./js.tpl"}
