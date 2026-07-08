<template id="mds-roster-result-desktop">
	<div class="mds-roster-result-container">
		<div class="mds-roster-result-header">
			<span class="mds-roster-result-header-text">{$current_season} Roster</span>
		</div>
		<div class="mds-roster-result-holder-wrapper">
			<div class="mds-roster-result-holder custom-scrollbar">
				<div class="table-wrapper no-scrollbar">
					<table>
						<thead>
							<th>Player</th>
							<th>Pos</th>
							<th class="center">Status</th>
							<th class="center">Cap Hit</th>
						</thead>
						<tbody id="resultListOdd"></tbody>
					</table>
				</div>
				<div class="table-wrapper no-scrollbar">
					<table>
						<thead>
							<th>Player</th>
							<th>Pos</th>
							<th class="center">Status</th>
							<th class="center">Cap Hit</th>
						</thead>
						<tbody id="resultListEven"></tbody>
					</table>
				</div>
			</div>
		</div>
		<button class="continue-simulate-next-year-games hidden">Simulate {$upcoming_season} Games</button>
	</div>
</template>

<template id="mds-roster-result-mobile">
	<div class="mds-roster-result-container">
		<div class="mds-roster-result-header">
			<span class="mds-roster-result-header-text">{$current_season} Roster</span>
		</div>
		<div class="mds-roster-result-holder-wrapper">
			<div class="mds-roster-result-holder custom-scrollbar mobile">
				<table>
					<thead>
						<th>Player</th>
						<th>Pos</th>
						<th class="center">Status</th>
						<th class="center">Cap Hit</th>
					</thead>
					<tbody id="resultListMobile"></tbody>
				</table>
			</div>
		</div>
		<button class="continue-simulate-next-year-games hidden">Simulate {$upcoming_season} Games</button>
	</div>
</template>

<template id="overview-result-section">
	<div class="team-overview-result">
		<div class="overview-header">
			<div class="team-logo-text-container">
				<div class="team-logo-holder">
					<img class="team-logo" src="" width="30" height="20" alt="team-img" />
				</div>
				<span class="team-name"></span>
			</div>
			<img class="pfn-logo"
				src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png" width="40"
				height="40" alt="pfn-logo" />
		</div>

		<div class="performance-container">
			<div class="year-performance current">
				<span class="season-text">"{$current_season}" Performace</span>
				<div class="record-rank-container">
					<div class="record-container">
						<span class="text">Record:</span>
						<span class="value"></span>
					</div>
					<div class="rank-container">
						<span class="text">Conf. Rank:</span>
						<span class="value"></span>
					</div>
				</div>
				<div class="rank-round-container">
					<div class="rank-container">
						<span class="text">Div. Rank:</span>
						<span class="value"></span>
					</div>
					<div class="round-container">
						<span class="text">Playoff Round:</span>
						<span class="value"></span>
					</div>
				</div>
			</div>
			<div class="year-performance predicted">
				<span class="season-text">Predicted Performance</span>
				<div class="record-rank-container">
					<div class="record-container">
						<span class="text">Record:</span>
						<span class="value"></span>
					</div>
					<div class="rank-container">
						<span class="text">Conf. Rank:</span>
						<span class="value"></span>
					</div>
				</div>
				<div class="rank-round-container">
					<div class="rank-container">
						<span class="text">Div. Rank:</span>
						<span class="value"></span>
					</div>
					<div class="round-container">
						<span class="text">Playoff Round:</span>
						<span class="value"></span>
					</div>
				</div>
			</div>
		</div>

		<div class="roster-changes-container">
			<div class="roster-changes-header">
				<span class="roster-change-text">{$upcoming_season} ROSTER CHANGES</span>
			</div>
			<div class="roster-tables-container"></div>
		</div>
		
		<div class="match-predictions-container">
			<div class="match-predictions-header">
				<span class="match-predictions-text">{$upcoming_season} GAME PREDICTIONS</span>
			</div>
			<div class="match-predictions-tables-container"></div>
		</div>
	</div>
</template>
