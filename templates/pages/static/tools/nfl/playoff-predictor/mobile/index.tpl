{include file="./styles.tpl"}

{if $include_sk_ads}
    {include file="ads/video-players/vidazoo.tpl" playerId=$skAdsVideoPlayerId load_without_interaction=false}
{/if}

<div class="simulator-standings-page-toggle-wrapper">
    <button class="simulator-page-toggle-btn selected">Playoff Predictor</button>
    <button class="standings-page-toggle-btn">Standings</button>
    <button class="draft-order-page-toggle-btn">Draft Order</button>
</div>

<div class="simulator-page">
    <div class="week-carousel-matches-container">
        {include file="templates/pages/static/tools/nfl/playoff-predictor/fragments/week-matches-predictor/index.tpl"}
    </div>
    <div class="playoff-participants-section">
        <div class="playoff-participants-header">
            <div class="playoff-participants-header-line"></div>
        </div>
        <div class="playoff-section-tab-toggle">
            <button class="playoff-tab-btn participants-tab-btn selected">Playoff Picture</button>
            <button class="playoff-tab-btn bracket-tab-btn">Playoff Bracket</button>
        </div>
        <div class="custom-settings-banner">
            &nbsp;
        </div>
        <div class="playoff-participants-tab-content">
            <div class="participants-logo-header">
                <div class="participants-afc-logo-header">
                    <img alt="afc-logo" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/afc-logo.png?w=60" />
                </div>
                <div class="participants-nfc-logo-header">
                    <img alt="nfc-logo" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/nfc-logo.png?w=60" />
                </div>
            </div>
            <div>
                {include file="templates/pages/static/tools/nfl/playoff-predictor/fragments/playoff-participants/index.tpl"}
            </div>
            <div class="playoff-participants-standings-container">
                {include file="templates/pages/static/tools/nfl/playoff-predictor/fragments/playoff-participants-standings/index.tpl"}
            </div>
        </div>
        <div class="playoff-bracket-tab-content hidden">
        </div>
    </div>
</div>
<div class="standings-page hidden">
    <div class="standings-page-toggle-wrapper">
        <button class="division-toggle-btn selected">Division</button>
        <button class="conference-toggle-btn">Conference</button>
        <div class="utility-container">
            <button class="download-btn standings-download">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/symbol-download.svg" width="16"
                    height="16" alt="downoad icon">
            </button>
            <button class="share-btn standings-share hidden">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/symbol-share.svg" width="16"
                    height="16" alt="share icon">
            </button>
        </div>
    </div>
    <div class="division-standings"></div>
    <div class="conference-standings hidden"></div>
</div>
<div class="draft-order-page hidden">
    <div class="draft-order-page-header">
        <div class="draft-order-heading-utility-holder">
            <span class="draft-order-page-header-text">Predicted NFL Draft Order 2027</span>
            <div class="utility-container">
                <button class="download-btn-mds draft-order-download">
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/symbol-download.svg" width="16"
                        height="16" alt="downoad icon">
                </button>
                <button class="share-btn-mds draft-order-share hidden">
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/symbol-share.svg" width="16"
                        height="16" alt="share icon">
                </button>
            </div>
        </div>
        <span class="draft-order-section-note-text hidden"><strong>Note:</strong> The Draft Order gets updated at the
            end of every playoff round</span>
    </div>
    <div class="draft-order-table"></div>
</div>

<div class="glossary-mweb-container hidden">
    {include file="templates/pages/static/tools/nfl/playoff-predictor/common/glossary.tpl"}
</div>

{foreach $nfl_teams as $team}
  <img
    class="hidden" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$team}.png{$logo_cache_buster}" width="28" height="18" alt={$team}
    crossorigin="anonymous"/>
{/foreach}

{if $include_sk_ads}
    {include file='ads/ad-common.tpl' slotId='NFL_Playoff_Predictor_2'}
{/if}

<div class="sticky-bottom-cta-wrapper">
    {include file="templates/pages/static/tools/nfl/playoff-predictor/fragments/simulation-ctas/index.tpl"}
</div>
