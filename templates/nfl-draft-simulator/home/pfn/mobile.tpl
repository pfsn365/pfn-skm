{include file="./styles.tpl"}
{include file="../styles.tpl"}
{include file="../multiuser-styles.tpl"}
{include file="templates/nfl-draft-simulator/common/multi-user-popups/index.tpl"}

{if $seo_header_text}
  <div class="seo-header-text">
    {$seo_header_text}
  </div>
{/if}

<div class="landing-page-container">
  <div class="draft-option-btns-container">
    <button class="draft-option-btn selected" data-type="solo" onclick="changeDraftOption(event)">
      <img class="logo-white" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/solo-user-logo-white.png"
        height="20px" width="20px" alt="Solo user Icon">
      <img class="logo-black hidden" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/solo-user-logo-black.png"
        height="20px" width="20px" alt="Solo user Icon">
      <span>Solo</span>
    </button>
    <button class="draft-option-btn redraft" data-type="solo-year" onclick="changeDraftOption(event)">
      <img class="logo-white hidden" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/redraft-icon-white.png"
        height="20px" width="20px" alt="Multi user Icon">
      <img class="logo-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/redraft-icon-black.png"
        height="20px" width="20px" alt="Multi user Icon">
      <span>Redraft</span>
      <span class="new-text">New</span>
    </button>
    <button class="draft-option-btn" data-type="multi" onclick="changeDraftOption(event)">
      <img class="logo-white hidden" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/multi-user-logo-white.png"
        height="20px" width="20px" alt="Multi user Icon">
      <img class="logo-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/multi-user-logo-black.png"
        height="20px" width="20px" alt="Multi user Icon">
      <span>Multiplayer</span>
    </button>
    <button class="draft-option-btn" data-type="dashboard" onclick="changeDraftOption(event)">
      <img class="logo-white hidden" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dashboard-logo-white.png"
        height="20px" width="20px" alt="Dashboard Icon">
      <img class="logo-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dashboard-logo-black.png"
        height="20px" width="20px" alt="Dashboard Icon">
      <span>Dashboard</span>
    </button>
    <div class="draft-option-btn logout-container hidden" onclick="showMDSLogoutButton()">
      <img class="more-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/more-icon.png" height="5px"
        width="20px" alt="More Icon">
      <button class="mds-logout-btn hidden" onclick="logoutMDS()">Log Out</button>
    </div>
  </div>
  <div class="draft-options-view-container">
    <div class="teams-filters-container">
      {include file="templates/nfl-draft-simulator/common/simulation-input/index.tpl"}
      {include file="templates/nfl-draft-simulator/common/teams/index.tpl"}
      <button class="start-draft-btn" onclick="startDraft(this)">Enter Solo Draft</button>
    </div>
    <div class="multi-user-create-join-room-container hidden">
      <div class="join-room-container"></div>
      <div class="create-room-container">
        <span class="create-room-text">Enjoy our multi-user Draft experience</span>
        <button class="create-room-btn">Create Room</button>
        <button class="instructions-btn">Instructions</button>
      </div>
    </div>
    <div class="dashboard-container hidden">
      {include file="templates/nfl-draft-simulator/home/pfn/dashboard/index.tpl"}
    </div>
  </div>
</div>

<div id="ad-banner-container">
  <div class="adthrive-draft-simulator-header">
  </div>
</div>

<div class="multi-user-room-container hidden">
  <div class="multi-user-room-section">
    {include file="templates/nfl-draft-simulator/common/multi-user-room/index.tpl"}
    {include file="templates/nfl-draft-simulator/common/multi-user-chat/index.tpl"}
  </div>
</div>
<div class="draft-simulation-container hidden">
  {include file="templates/nfl-draft-simulator/common/simulation-management/index.tpl"}
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
</div>

{include file="templates/nfl-draft-simulator/common/final-result/index.tpl"}

<div class="room-bottom-controls hidden">
  <div class="draft-now-btn-container">
    <button class="draft-now-btn disabled">Draft Now</button>
  </div>
  <div class="chat-btn-container">
    <button class="chat-btn"> <img class="selected" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/chat-icon.png"
        width="16" height="16" alt="Chat Icon">Draft Central</button>
    <span class="unread-chat-count hidden" data-count="0"></span>
  </div>
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
  <button class="restart-simulation" onclick="startNewSimulation()">
    <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/restart-icon.svg" width="17" height="17"
      alt="Restart Icon">
    <span>RESTART</span>
  </button>
  <button class="back-to-room-btn hidden" onclick="backToRoom()">
    <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/restart-icon.svg" width="17" height="17"
      alt="Restart Icon">
    <span>Back To Room</span>
  </button>
</div>

{include file="templates/nfl-draft-simulator/common/templates/index.tpl"}
{include file="../js.tpl"}
