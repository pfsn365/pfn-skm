{include file="./styles.tpl"}

<div class="user-insights-container">
  <div class="user-info-section">
    <img class="user-image" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dummy-user.png" height="60" width="60" alt="user image" />
    <div class="username-grade-holder">
      <span class="username">Richard Benn</span>
    </div>
  </div>

  <div class="drafted-data-section">
    <div class="drafted-info drafts">
      <span class="drafted-info-title">Total Drafts</span>
      <span class="drafted-info-value">1256</span>
    </div>
    <div class="drafted-info most-drafted-player">
      <span class="drafted-info-title">Most Drafted Player</span>
      <span class="drafted-info-value">Antwuan Powell-Ryland</span>
    </div>
    <div class="drafted-info average-rounds">
      <span class="drafted-info-title">Avg. Rounds Drafted</span>
      <span class="drafted-info-value">5</span>
    </div>
    <div class="drafted-info favourite-college">
      <span class="drafted-info-title">Favorite College</span>
      <span class="drafted-info-value">Ole Miss</span>
    </div>
    <div class="drafted-info trades-completed">
      <span class="drafted-info-title">Trades Completed</span>
      <span class="drafted-info-value">456</span>
    </div>
  </div>
</div>

{include file="./js.tpl"}
