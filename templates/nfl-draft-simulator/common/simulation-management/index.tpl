<div class="simulation-management-buttons-container">
  {if $brand}
    <div class="pick-timer-container">
      <span class="drafting-info"></span>
      <span class="pick-timer"></span>
    </div>
  {/if}
  <div class="simulation-management-buttons-holder">
    {if $brand}
      <button class="ranking-updates-btn" onclick="window.open('https://www.profootballnetwork.com/nfl-draft-hq/mds-risers-fallers/', '_blank')">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/ranking-updates.svg" width="22" height="22"
          alt="Ranking Updates Icon">
        <span>Ranking Updates</span>
      </button>
    {else}
      {if $is_desktop}
        <button class="team-needs-btn" onclick="showTeamNeeds()">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/team-needs-icon.png" width="17" height="17"
            alt="Team Needs Icon">
          <span>Team Needs</span>
        </button>
      {else}
        <button class="restart-simulation" onclick="restartSimulation()">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/restart-icon.svg" width="17" height="17"
            alt="Restart Icon">
          <span>Restart</span>
        </button>
        <button class="leave-multi-user-draft hidden" onclick="leaveRoom()">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/leave-room-icon.png" width="17" height="17"
            alt="Leave Room Icon">
          <span>Leave Room</span>
        </button>
      {/if}
    {/if}
    <button class="user-proposal" onclick="proposeTrade()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/propose-trade-icon.png" width="17" height="17"
        alt="Trade Icon">
      <span>Propose Trade</span>
    </button>
    <button class="revert-pick" disabled style="opacity: 0.4; cursor: not-allowed;" onclick="revertLastPick()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/restart-icon.svg" width="17" height="17"
        alt="Undo Icon">
      {if $is_desktop}
        <span>Undo Pick</span>
      {else}
        <span>Undo</span>
        <span class="second-line-text">Pick</span>
      {/if}
    </button>
    <div class="sim-pause-play-buttons">
      <button class="resume-draft hidden" onclick="resumeDraft(true)">
        <img class="resume-icon-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/play-icon.svg" width="17"
          height="17" alt="Resume Icon">
        <img class="resume-icon-green hidden"
          src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/green-resume-icon.png" width="18" height="18"
          alt="Resume Icon">
        <span class="resume-draft-text">Resume Draft</span>
      </button>
      <button class="pause-draft" onclick="pauseDraft(true)">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/pause-icon.svg" width="17" height="17"
          alt="Pause Icon">
        <span>Pause Draft</span>
      </button>
    </div>
    <button class="show-offers" disabled onclick="showOffer()">
      <img class="trade-icon-green hidden"
        src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/incoming-trade-green.png" width="18" height="18"
        alt="Trade Icon">
      <img class="trade-icon-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/tradeoffer-icon.svg"
        width="18" height="18" alt="Trade Icon">
      <span>Trade Offer</span>
    </button>
    <button class="multi-user-draft-participants hidden" onclick="showParticipantsForRemoval()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/participants-icon.png" width="17" height="17"
        alt="Participants Icon">
      <span>Participants</span>
    </button>
    {if $is_desktop || $brand}
      <button class="restart-simulation" onclick="restartSimulation()">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/restart-icon.svg" width="17" height="17"
          alt="Restart Icon">
        <span>Restart</span>
        {if !$is_desktop}
          <span class="second-line-text">Draft</span>
        {/if}
      </button>
      <button class="leave-multi-user-draft hidden" onclick="leaveRoom()">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/leave-room-icon.png" width="17" height="17"
          alt="Leave Room Icon">
        <span>Leave Room</span>
      </button>
    {else}
      <button class="team-needs-btn" onclick="showTeamNeeds()">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/team-needs-icon.png" width="17" height="17"
          alt="Team Needs Icon">
        <span>Team Needs</span>
      </button>
    {/if}
  </div>
</div>
