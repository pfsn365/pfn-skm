{include file="./styles.tpl"}

<div class="dashboard-holder">
  <div class="dashboard-loading-overlay">
    <span class="loading-overlay-text">Loading...</span>
  </div>
  <div class="dashboard-header">
    <div class="header-text-container">
      <span>Mock Draft Dashboard</span>
      <div class="years-dropdown-container">
        <span class="dashboard-year-text">Year: </span>
        <select class="dashboard-data-year" name="dashboard-year-selector" onchange="fetchDashboardData();">
          <option value="2027" data-default="true">2027</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>
    </div>
    <div class="dashboard-sections-btns">
      <button class="dashboard-section-btn overall" data-section="overall"
        onclick="updateDashboardSection(event)">Overall</button>
      <button class="dashboard-section-btn" data-section="solo" onclick="updateDashboardSection(event)">Solo</button>
      <button class="dashboard-section-btn" data-section="multiUser"
        onclick="updateDashboardSection(event)">Multi-user</button>
    </div>
  </div>
  <div class="dashboard-section-data">
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/userInsights/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/timeSpent/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/totalMockDrafts/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/draftCompletion/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/tradeCompletion/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/picksByConference/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/mostDraftedPlayers/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/milestones/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/draftBoardDeviation/index.tpl"}
    {include file="templates/nfl-draft-simulator/home/pfn/dashboard/multiUserDrafts/index.tpl"}
  </div>
</div>
<div class="login-container-overlay hidden">
  <div class="login-container">
    <span class="view-performance-text">Log in to track your MDS statistics</span>
    <button class="dashboard-login-btn" onclick="navigateToLoginScreen()">Login</button>
  </div>
</div>
