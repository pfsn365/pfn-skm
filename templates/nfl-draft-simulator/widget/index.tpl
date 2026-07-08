{include file="templates/nfl-draft-simulator/home/styles.tpl"}
{include file="./styles.tpl"}

<div class="nfl-draft-simulator-widget mockdraft-simulator">
  <div class="teams-filters-container">
    {include file="templates/nfl-draft-simulator/common/simulation-input/index.tpl"}
    {include file="templates/nfl-draft-simulator/common/teams/index.tpl"}
    <button class="start-draft-btn" onclick="startDraft(this)">Enter Draft</button>
  </div>

  <div class="draft-simulation-container hidden">
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
      {include file="templates/nfl-draft-simulator/common/players/index.tpl"}
      <div class="mypicks-container">
        <div class="selected-user-teams-container"></div>
        <div class="selected-picks-container"></div>
      </div>
    </div>
    {include file="templates/nfl-draft-simulator/common/simulation-management/index.tpl"}
  </div>

  {include file="templates/nfl-draft-simulator/common/final-result/index.tpl"}

  <div class="bottom-controls hidden">
    <button class="my-draft-btn selected" onclick="showMyDraft()">
      <img class="selected" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/mydraft-icon.svg" width="17"
        height="17" alt="My Draft Icon">
      <span>My Draft</span>
    </button>
    <button class="full-result-btn" onclick="showFullResult()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/full-result-icon.svg" width="17" height="17"
        alt="Full Result Icon">
      <span>Full Result</span>
    </button>
    <button class="restart-simulation" onclick="startNewSimulation()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/restart-icon.svg" width="17" height="17"
        alt="Restart Icon">
      <span>RESTART</span>
    </button>
  </div>

  {include file="templates/nfl-draft-simulator/common/templates/index.tpl"}

  <template id="widget-continue-pfsn">
    <div class="widget-continue-pfsn-container">
      <div class="continue-header">
        <span class="header-text">Continue Draft on PFSN</span>
        <button class="close-btn">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="15" height="15"
            alt="close-icon" />
        </button>
      </div>
      <div class="continue-body">
        <span class="continue-info-text">Carry over your progress and complete the rest of your draft on PFSN's NFL Mock Draft Simulator?</span>
      </div>
      <div class="continue-footer">
        <button class="continue-btn yes-btn">Yes</button>
        <button class="continue-btn no-btn">No</button>
      </div>
    </div>
  </template>

  {include file="./js.tpl"}
</div>
