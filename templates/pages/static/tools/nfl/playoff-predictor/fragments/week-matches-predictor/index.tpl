{include file="./styles.tpl"}

<div class="week-matches-wrapper">
   <div class="week-carousel-container">
      <div class="week-carousel-control-left-btn-holder">
         <button class="week-carousel-control-btn left-scroll-button hidden">
            <img height="8" width="12" alt="scroll button icon" loading="lazy"
               src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/scroll-btn.svg">
         </button>
      </div>
      <div class="week-carousel"></div>
      <div class="week-carousel-control-right-btn-holder">
         <button class="week-carousel-control-btn right-scroll-button hidden">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/scroll-btn.svg" height="8"
               width="12" alt="scroll button icon" loading="lazy">
         </button>
      </div>
   </div>
   <div class="week-matches-container"></div>
   <div class="bye-teams-container"></div>
</div>

