{include file="./styles.tpl"}

<div class="simulation-ctas-container">
  <button class="delete-button">
    <img width="18px" height="18px" alt="delete-button"
      src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/delete-btn-red.png" />
    <span>Reset</span>
  </button>
  <button class="simulate-button">
    <img width="18px" height="18px" alt="simulate-button"
      src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/simulate-btn-blue.png" />
    <span>Simulate</span>
  </button>
  <button class="pause-button hidden">
    <img width="18px" height="18px" alt="pause-button"
      src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/pause-btn-gray.png" />
    <span>Pause</span>
  </button>
  <div class="tooltip hidden">
    <span class="up-arrow"></span>
    <span>Click here to simulate the results of the remaining NFL matches after completing your predictions</span>
  </div>
  {if !$is_desktop}
    <button class="continue-btn" id="continueBtn" disabled>CONTINUE</button>
  {/if}
</div>
