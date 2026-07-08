{include file="./styles.tpl"}

<div class="trade-completion-charts-container">
  <span class="trade-completion-text dashboard-widget-heading">Trade Completion</span>
  <div class="trade-completion-charts-holder">
    <div class="user-chart-container">
      <div class="user-trade-attempted-chart">
        <div class="user-trade-attempted-subchart">
          <span class="chart-percentage-text">50%</span>
        </div>
      </div>
      <span class="user-text">You</span>
    </div>
    <div class="average-chart-container">
      <div class="average-trade-attempted-chart">
        <div class="average-trade-attempted-subchart">
          <span class="chart-percentage-text">45%</span>
        </div>
      </div>
      <span class="average-text">Avg</span>
    </div>
  </div>
  <div class="trade-completion-count-container">
    <div class="attempted">
      <span class="count">2600 : </span>
      <span class="attempted-text">Attempted</span>
    </div>
    <div class="conversion">
      <span class="count">1300 : </span>
      <span class="converted-text">Completed</span>
    </div>
  </div>
</div>

{include file="./js.tpl"}
