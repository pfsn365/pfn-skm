<template id="player-substitution-popup">
  <div class="player-substitution-container">
    <div class="substitution-header">
      <button class="close-btn">
        <img class="close-icon" src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/remove-icon.png" width="16"
          height="16" alt="close-icon" />
      </button>
    </div>
    <button class="auto-substitute-player-btn">Auto Substitute</button>
    <span class="or-text">Or</span>
    <div class="substituted-player-container">
      <span class="substitute-text">Substitute</span>
      <span class="substituted-player-name"></span>
    </div>
    <div class="substitute-players-table-container">
      <table class="substitute-players-list">
        <thead>
          <tr>
            <th class="player-text-header">Player</th>
            <th>Sal</th>
            <th class="points-text-header">FPTS</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<template id="reset-popup">
  <div class="reset-confirmation-popup">
    <div class="reset-header">
      <button class="close-btn">
        <img class="close-icon" src="{$smarty.const.STATIC_URL}/skm/assets/lineup-optimizer/remove-icon.png" width="16"
          height="16" alt="close-icon" />
      </button>
    </div>
    <div class="confirmation-text-container">
      <span class="confirmation-text">Do you want to reset the Changes?</span>
    </div>
    <div class="confirmation-btns-container">
      <button class="cancel-reset">Cancel</button>
      <button class="confirm-reset">Yes</button>
    </div>
  </div>
</template>
