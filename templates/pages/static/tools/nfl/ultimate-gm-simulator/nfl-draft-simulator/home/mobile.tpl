{include file="./styles.tpl"}

<div class="draft-simulation-container">
  <div class="sim-nav-container">
    <button class="draft-result selected" onclick="toggleSimView('result')">Draft Result</button>
    <button class="player-pool" onclick="toggleSimView('pool')">Player Pool</button>
    <button class="my-picks" onclick="toggleSimView('mypicks')">My Picks</button>
  </div>
  <div class="sim-content-slider show-rounds-pics-container">
    <div class="rounds-pics-container">
      <div class="next-pick-container">
        <div class="image-container">
        </div>
        <div class="next-pick-text-holder">
          <span class="next-pick-number"></span>
          <span class="next-pick-text">Next Pick</span>
        </div>
      </div>
      <div class="rounds-pics-holder">
      </div>
    </div>
    {include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/players/index.tpl"}
    <div class="mypicks-container">
      <div class="selected-user-teams-container"></div>
      <div class="selected-picks-container"></div>
    </div>
  </div>
  {include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/simulation-management/index.tpl"}
</div>

<div class="bottom-controls hidden">
  <button class="my-draft-btn selected" onclick="showMyDraft()">
    <img class="selected" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/mydraft-icon.svg" width="17" height="17"
      alt="Pause Icon">
    <span>My Draft</span>
  </button>
  <button class="full-result-btn" onclick="showFullResult()">
    <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/full-result-icon.svg" width="17" height="17"
      alt="Pause Icon">
    <span>Full Result</span>
  </button>
  {if $show_dashboard_btn_final_result == true}
    <button class="dashboard-btn" onclick="showResultScreenDashboardMobile()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dashboard-logo-black.png" width="17" height="17"
        alt="dashboard Icon">
      <span>Dashboard</span>
      <span class="new-text">New</span>
    </button>
  {/if}
</div>

{include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/templates/index.tpl"}
{include file="./js.tpl"}
