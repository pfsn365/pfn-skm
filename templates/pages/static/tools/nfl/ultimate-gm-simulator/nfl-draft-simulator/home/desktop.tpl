{include file="./styles.tpl"}

<div class="simulator-content-container">
	<div class="content-wrapper">
		<div class="simulator-content-holder">
			<div class="landing-page-container">
				<div class="draft-options-view-container">
					<div class="teams-filters-container">
					</div>
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
				{include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/simulation-management/index.tpl"}
				{include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/players/index.tpl"}
			</div>
			{include file="templates/pages/static/tools/nfl/ultimate-gm-simulator/nfl-draft-simulator/common/templates/index.tpl"}

		</div>
	</div>
</div>

{include file="./js.tpl"}
