{include file="./styles.tpl"}

<div class="week-matches-playoff-participants-wrapper">
  <div class="week-matches-simulation-wrapper">
    <div class="wrapper-header">
      <h2>{$simulator_header_text}</h2>
    </div>
    <div class="week-matches-simulation-wrapper-content">
      <div class="sidebar-cta-wrapper">
        {include file="templates/pages/static/tools/nfl/playoff-predictor/fragments/simulation-ctas/index.tpl"}
      </div>
      <div class="week-carousel-matches-container">
        {include file="templates/pages/static/tools/nfl/playoff-predictor/fragments/week-matches-predictor/index.tpl"}
      </div>
    </div>
  </div>
  <div class="playoff-section">
    <div class="playoff-section-header-container">
      <div class="playoff-section-tab-toggle">
        <button class="playoff-tab-btn participants-tab-btn selected">Playoff Picture</button>
        <button class="playoff-tab-btn bracket-tab-btn">Playoff Bracket</button>
      </div>
      <div class="playoff-section-header-scroll-to-standings-text">
        <span>{$standings_section_text}</span> <img
          src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/scroll-right-btn.png" height="12"
          width="12" alt="scroll button icon" loading="lazy">
      </div>
      <img class="table-pfn-logo" src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn_logo_white_transparent.png" width="25"
        height="25" alt="pfn logo" crossorigin="anonymous">
    </div>
    <div class="custom-settings-banner">
      &nbsp;
    </div>
    <div class="playoff-section-content">
      <div class="">
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

<div class="section-seperator"></div>

<div class="standings-draft-order-wrapper">
  <div class="standings-draft-order-toggle-wrapper">
    <button class="standings-section-toggle-btn selected">Standings</button>
    <button class="draft-order-section-toggle-btn">Draft Order</button>
  </div>
  <div class="standings-section-wrapper">
    <div class="standings-section">
      <div class="standings-section-header-text-container">
        <span class="standings-section-header-text">{$standings_header_text}</span>
        <div class="utility-container">
          <button class="download-btn standings-download">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/download-icon-blue.png" width="16"
              height="16" alt="downoad icon">
            <span class="download-text">Download</span>
          </button>
          <button class="share-btn standings-share hidden">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/share-icon-blue.png" width="16"
              height="16" alt="share icon">
            <span class="share-text">Share</span>
          </button>
        </div>
      </div>
      <div class="standings-page-toggle-wrapper">
        <button class="division-toggle-btn selected">Division</button>
        <button class="conference-toggle-btn">Conference</button>
      </div>
      <div class="division-standings"></div>
      <div class="conference-standings hidden"></div>
    </div>
  </div>
  <div class="draft-order-section-wrapper hidden">
    <div class="draft-order-section">
      <div class="draft-order-section-text-container">
        <div class="draft-order-utility-heading-holder">
          <div class="draft-order-section-text">Predicted NFL Draft Order 2027</div>
          <div class="utility-container">
            <button class="download-btn-mds draft-order-download">
              <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/download-icon-blue.png" width="16"
                height="16" alt="downoad icon">
              <span class="download-text">Download</span>
            </button>
            <button class="share-btn-mds draft-order-share hidden">
              <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/share-icon-blue.png" width="16"
                height="16" alt="share icon">
              <span class="share-text">Share</span>
            </button>
          </div>
        </div>
        <span class="draft-order-section-note-text hidden"><strong>Note:</strong> The Draft Order gets updated at the end of every playoff round</span>
      </div>

      <div class="draft-order-table"></div>
    </div>
  </div>
</div>

{foreach $nfl_teams as $team}
  <img
    class="hidden" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$team}.png{$logo_cache_buster}" width="28" height="18" alt={$team}
    crossorigin="anonymous"/>
{/foreach}


{include file="templates/pages/static/tools/nfl/playoff-predictor/common/glossary.tpl"}
