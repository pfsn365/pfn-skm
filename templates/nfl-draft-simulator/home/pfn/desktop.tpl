{include file="./styles.tpl"}
{include file="../styles.tpl"}
{include file="../multiuser-styles.tpl"}
{include file="templates/nfl-draft-simulator/common/multi-user-popups/index.tpl"}

<div class="simulator-content-container">
	<div class="content-wrapper">
		<div class="simulator-content-holder">
			{if $seo_header_text}
				<div class="seo-header-text">
					{$seo_header_text}
				</div>
			{/if}
			<div class="landing-page-container">
				<div class="draft-option-btns-container">
					<div class="draft-btns-heading">
						<span>Menu</span>
					</div>
					<button class="draft-option-btn selected" data-type="solo" onclick="changeDraftOption(event)">
						<img class="logo-white" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/solo-user-logo-white.png"
							height="20px" width="20px" alt="Solo user Icon">
						<img class="logo-black hidden"
							src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/solo-user-logo-black.png" height="20px" width="20px"
							alt="Solo user Icon">
						<span>Solo</span>
						<div class="triangle-right"></div>
					</button>
					<button class="draft-option-btn redraft" data-type="solo-year" onclick="changeDraftOption(event)">
						<img class="logo-white hidden" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/redraft-icon-white.png"
							height="20px" width="20px" alt="Redraft Icon">
						<img class="logo-black"
							src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/redraft-icon-black.png" height="20px" width="20px"
							alt="Redraft Icon">
						<span>Redraft</span>
						<div class="triangle-right hidden"></div>
						<span class="new-text">New</span>
					</button>
					<button class="draft-option-btn" data-type="multi" onclick="changeDraftOption(event)">
						<img class="logo-white hidden"
							src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/multi-user-logo-white.png" height="20px"
							width="20px" alt="Multi user Icon">
						<img class="logo-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/multi-user-logo-black.png"
							height="20px" width="20px" alt="Multi user Icon">
						<span>Multiplayer</span>
						<div class="triangle-right hidden"></div>
					</button>
					<button class="draft-option-btn" data-type="dashboard" onclick="changeDraftOption(event)">
						<img class="logo-white hidden"
							src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dashboard-logo-white.png" height="20px" width="20px"
							alt="Dashboard Icon">
						<img class="logo-black" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/dashboard-logo-black.png"
							height="20px" width="20px" alt="Dashboard Icon">
						<span>Dashboard</span>
						<div class="triangle-right hidden"></div>
					</button>
					<div class="draft-option-btn logout-container hidden" onclick="showMDSLogoutButton()">
						<img class="more-icon"
							src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/more-icon.png" height="5px" width="20px"
							alt="More Icon">
						<span>More</span>
						<button class="mds-logout-btn hidden" onclick="logoutMDS()">Log Out</button>
					</div>
				</div>
				<div class="draft-options-view-container">
					<div class="teams-filters-container">
						{include file="templates/nfl-draft-simulator/common/teams/index.tpl"}
						{include file="templates/nfl-draft-simulator/common/simulation-input/index.tpl"}
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
			<div class="multi-user-room-container hidden">
				<div class="multi-user-room-section">
					{include file="templates/nfl-draft-simulator/common/multi-user-room/index.tpl"}
					{include file="templates/nfl-draft-simulator/common/multi-user-chat/index.tpl"}
				</div>
			</div>
			<div class="draft-simulation-container hidden">
				<div class="rounds-pics-container">
					<div class="mypicks-btn-container">
						<div class="mypicks-btn-holder">
							<button class="draft-result-btn selected" onclick="toggleMyPicks(this)">Draft Results</button>
							<button class="my-picks-btn" onclick="toggleMyPicks(this)">My Picks</button>
						</div>
					</div>
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
					<div class="mypicks-container hidden">
						<div class="selected-user-teams-container"></div>
						<div class="selected-picks-container"></div>
					</div>
				</div>
				{include file="templates/nfl-draft-simulator/common/simulation-management/index.tpl"}
				{include file="templates/nfl-draft-simulator/common/players/index.tpl"}
			</div>
			{include file="templates/nfl-draft-simulator/common/final-result/index.tpl"}
			{include file="templates/nfl-draft-simulator/common/templates/index.tpl"}

		</div>
	</div>
</div>

{include file="../js.tpl"}
