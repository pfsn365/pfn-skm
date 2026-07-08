{include file="./styles.tpl"}

<div class="simulator-page">
  <div class="week-carousel-matches-container">
    {include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/playoff-predictor/fragments/week-matches-predictor/index.tpl"}
  </div>
  <div class="playoff-section">
    <div class="predict-playoff-games-popup-container">
      <div class="popup-header">
        <button class="standings-draftorder-btn">
          <span class="full-standings-text">Full Standings & Draft Order</span>
          <img class="right-arrow"
            src="{$smarty.const.STATIC_URL}/skm/assets/pfn/tools/ultimate-gm-simulator/right-arrow-icon-blue.png"
            width="24" height="24" alt="close-icon">
        </button>
        <div class="header-text-container">
          <div class="styler"></div>
          <span class="header-text">Playoff Bracket</span>
          <div class="styler"></div>
        </div>
      </div>
      <div class="predict-playoff-games-popup-content">
        <div class="playoffs-overlay">
          {if $is_desktop}
            <img src="{$smarty.const.STATIC_URL}/skm/assets/college-football-playoff-predictor/arrow-left.png" width="20"
              height="41" alt="reset icon" />
          {else}
            <img src="{$smarty.const.STATIC_URL}/skm/assets/college-football-playoff-predictor/up-arrow.png" width="47"
              height="44" alt="reset icon" />
          {/if}
          <span class="complete-prediction-text">COMPLETE LEAGUE PREDICTIONS TO ACCESS THE PLAYOFF PICTURE</span>
        </div>
        <div class="playoff-wildcard-round-wrapper">
          <span class="playoff-wildcard-round-text">Wild Card Round</span>
          <div class="playoff-wildcard-round-container">
            <div class="afc-playoff-wildcard-round-container"></div>
            <div class="vertical-container-seperator"></div>
            <div class="nfc-playoff-wildcard-round-container"></div>
          </div>
        </div>
        <div class="playoff-divisional-round-wrapper">
          <span class="playoff-divisional-round-text">Divisional Playoffs</span>
          <div class="playoff-divisional-round-container">
            <div class="afc-playoff-divisional-round-container disabled-round "></div>
            <div class="vertical-container-seperator"></div>
            <div class="nfc-playoff-divisional-round-container disabled-round "></div>
          </div>
        </div>
        <div class="playoff-conference-round-wrapper">
          <span class="playoff-conference-round-text">Conference Championships</span>
          <div class="playoff-conference-round-container">
            <div class="afc-playoff-conference-round-container disabled-round "></div>
            <div class="vertical-container-seperator"></div>
            <div class="nfc-playoff-conference-round-container disabled-round "></div>
          </div>
        </div>
        <div class="playoff-super-bowl-round-wrapper">
          <span class="playoff-super-bowl-round-text">Super Bowl</span>
          <div class="playoff-super-bowl-round-container">
            <div class="afc-playoff-super-bowl-round-container disabled-round "></div>
            <div class="vertical-container-seperator"></div>
            <div class="nfc-playoff-super-bowl-round-container disabled-round "></div>
          </div>
        </div>
        <div class="playoff-predict-popup-footer">
          <span class="playoff-predict-popup-footer-text">
            <strong>Note:</strong> Select the teams which are likely to win their respective rounds
          </span>
        </div>

        <div class="playoff-games-popup-footer">
          <button class="playoff-games-reset-btn" disabled>
            <img width="18px" height="18px" alt="delete"
              src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/delete-btn-red.png" />
            <span>Reset</span>
          </button>
          <button class="playoff-games-sim-btn">
            <img width="18px" height="18px" alt="simulate"
              src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/simulate-btn-blue.png" />
            <span>Simulate</span>
          </button>
          <button class="playoff-games-pause-btn hidden">
            <img width="18px" height="18px" alt="simulate"
              src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/pause-btn-gray.png" />
            <span>Pause</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="standings-draft-order-wrapper hidden">
  <div class="standings-draft-order-toggle-wrapper">
    <button class="standings-section-toggle-btn selected">Standings</button>
    <button class="draft-order-section-toggle-btn">Draft Order</button>
  </div>
  <div class="standings-page standings-section-wrapper">
    <div class="playoff--standings-popup-header-text">
      <span>Predicted NFL Standings {$current_season}</span>
    </div>
    <div class="standings-page-toggle-wrapper">
      <button class="division-toggle-btn selected">Division</button>
      <button class="conference-toggle-btn">Conference</button>
    </div>
    <div class="division-standings"></div>
    <div class="conference-standings hidden"></div>
  </div>
  <div class="draft-order-page draft-order-section-wrapper hidden">
    <div class="draft-order-page-header">
      <div class="draft-order-heading-utility-holder">
        <span class="draft-order-page-header-text">Predicted NFL Draft Order {$current_year}</span>
      </div>
      <span class="draft-order-section-note-text hidden"><strong>Note:</strong> The Draft Order gets updated at the
        end of every playoff round</span>
    </div>
    <div class="draft-order-table"></div>
  </div>
  <div class="glossary-mweb-container">
    {include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/playoff-predictor/common/glossary.tpl"}
  </div>
</div>

{foreach $nfl_teams as $team}
  <img
    class="hidden" src="{$smarty.const.STATIC_URL}{$team_logo_path}{$team}.png{$logo_cache_buster}" width="28" height="18" alt={$team}
    crossorigin="anonymous"/>
{/foreach}

<div class="sticky-bottom-cta-wrapper">
  {include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/playoff-predictor/fragments/simulation-ctas/index.tpl"}
</div>
