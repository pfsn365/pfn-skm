<div class="simulation-management-buttons-container">
  <div class="simulation-management-buttons-holder">
    {if $brand}
      <button class="ranking-updates-btn">
        <a href="https://www.profootballnetwork.com/mock-draft-simulator-change-log-latest-player-updates/"
          target="_blank">
          <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/ranking-updates.svg" width="22" height="22"
            alt="Ranking Updates Icon">
        </a>
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
      {/if}
    {/if}
    <button class="user-proposal" onclick="proposeTrade()">
      <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/propose-trade-icon.png" width="17" height="17"
        alt="Trade Icon">
      <span>Propose Trade</span>
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
    {if $is_desktop || $brand}
    {else}
      <button class="team-needs-btn" onclick="showTeamNeeds()">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/team-needs-icon.png" width="17" height="17"
          alt="Team Needs Icon">
        <span>Team Needs</span>
      </button>
    {/if}
  </div>
</div>
