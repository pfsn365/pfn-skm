<template id="single-round">
	<div class="pic-container">
		<span class="pic-number"></span>
		<button class="team-logo-container" onclick="showTeamPicks(this)">
			<img class="team-logo" src width="36" height="36" alt="NFL-team-logo">
		</button>
		<div class="traded-player-name-position-container">
			<span class="player-name"></span>
			<span class="player-position"></span>
		</div>
		<button class="pick-trade-info-btn hidden" onclick="showTradeData(event)">
			{if $brand === "pfn"}
				<img class="trade-icon" data-icon="trade-icon"
					src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/trade-details-icon-blue-new.png" width="24" height="24"
					alt="trade-icon" crossorigin="anonymous">
			{else}
				<img class="trade-icon" data-icon="trade-icon"
					src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/trade-icon.svg" width="24" height="24" alt="trade-icon"
					crossorigin="anonymous">
			{/if}
		</button>
		<div class="drafting-info-container hidden">
			<span class="draft-text">To Draft</span>
			<span class="draft-by"></span>
		</div>
	</div>
</template>

<template id="available-trades">
	<div class="offer-container">
		<div class="offer-header">
			<span class="offer-number"></span>
			<button class="close-icon">
				<span class="hide-text">HIDE</span>
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/down-arrow.png" width="26" height="26"
					alt="NFL-team-logo">
			</button>
		</div>
		<div class="offer-list">
			<div class="current-team">
				<div class="current-team-holder">
					<img class="current-team-img" src width="40" height="27" alt="team-icon">
					<span class="current-team-shortname"></span>
				</div>
				<span class="current-team-pick"></span>
			</div>
			<div class="offers-separator"></div>
			<div class="offering-team">
				<div class="offering-team-holder">
					<span class="offering-team-shortname"></span>
					<img class="offering-team-img" src width="40" height="27" alt="team-icon">
				</div>
				<div class="offers"></div>
			</div>
			<button class="nav-previous disabled" onclick="showPreviousOffer()">
				<img class="team-logo" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/left-arrow.svg" width="10"
					height="17" alt="NFL-team-logo">
				<span>PREV</span>
			</button>
			<button class="nav-next" onclick="showNextOffer()">
				<span>NEXT</span>
				<img class="team-logo" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/right-arrow.svg" width="10"
					height="17" alt="NFL-team-logo">
			</button>
		</div>
		<div class="trade-value-comparison incoming-offer-value">
			<div class="trade-value-header">
				<div class="trade-value-team user-value">
					<span class="trade-value-label">Value Offered</span>
					<span class="trade-value-points"></span>
				</div>
				<div class="trade-value-team opposing-value">
					<span class="trade-value-label">Value Offered</span>
					<span class="trade-value-points"></span>
				</div>
			</div>
			<div class="trade-value-bar">
				<div class="trade-value-bar-user">
					<span class="trade-value-bar-percent"></span>
				</div>
				<div class="trade-value-bar-opposing">
					<span class="trade-value-bar-percent"></span>
				</div>
			</div>
		</div>
		<div class="offer-selection">
			<button class="btn-accept-offer" onclick="acceptOffer()">Accept</button>
			<button class="btn-counter-offer" onclick="counterOffer()">Counter</button>
			<button class="btn-reject-offer" onclick="rejectOffer()">Reject</button>
		</div>
	</div>
</template>

<template id="trades-data">
	<div class="trade-data-container">
		<div class="trade-data-header">
			<span class="trade-details-text">Trade Details</span>
			<button class="close-trades-info">
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="15" height="15"
					alt="NFL-team-logo">
			</button>
		</div>
		<div class="trades-holder">
			<div class="trade-details-info-container">
				<div class="giving-team-info">
					<img class="nfl-team-logo" src width="40" height="27" alt="NFL-team-logo">
					<span class="received-text">RECEIVED</span>
					<div class="team-picks"></div>
				</div>
				<div class="offers-separator"></div>
				<div class="getting-team-info">
					<img class="nfl-team-logo" src width="40" height="27" alt="NFL-team-logo">
					<span class="received-text">RECEIVED</span>
					<div class="team-picks"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<template id="team-needs-template">
	<div class="team-needs-container">
		<div class="team-needs-header">
			<span class="header-text">Team Needs</span>
			<button class="close-btn">
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="15" height="15"
					alt="close-icon">
			</button>
		</div>

		<div class="team-needs-holder">
		</div>
	</div>
</template>

<template id="user-teams-for-trade">
	<div class="trade-proposal-user-teams-conatiner">
		<div class="proposal-header">
			<span class="header-text">Pick a team and propose a trade</span>
			<button class="close-btn">
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="15" height="15"
					alt="close-icon">
			</button>
		</div>

		<div class="user-teams-container">
			<div class="user-teams-holder"></div>
		</div>

		<div class="nav-btn-container">
			<button class="nav-btn next">Next</button>
		</div>
	</div>
</template>

<template id="all-teams-for-trade">
	<div class="trade-proposal-all-teams-conatiner">
		<div class="proposal-header">
			<span class="header-text">Select Team(s)</span>
			<button class="close-btn">
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="15" height="15"
					alt="close-icon" />
			</button>
		</div>

		<div class="competing-teams-container">
			<div class="user-team-container">
				<img class="team-logo" src="" width="34" height="23" alt="team-logo" />
				<span class="team-name"></span>
			</div>
			<span class="trade-with-text">Trade With</span>
			<div class="blank-team-container">
				<img class="question-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/question-icon.png" width="10"
					height="15" alt="close-icon" />
			</div>
			<div class="opposing-team-container hidden">
				<span class="team-name"></span>
				<img class="team-logo" src="" width="34" height="23" alt="team-logo" />
			</div>
		</div>

		<div class="all-teams-container">
			<div class="all-teams-holder"></div>
		</div>

		<div class="picks-container hidden">
			<div class="user-picks">
				<div class="current-year-picks">
					<span class="text">Current</span>
					<div class="picks-holder"></div>
				</div>
				<div class="next-year-picks">
					<span class="text"></span>
					<div class="picks-holder"></div>
				</div>
			</div>
			<div class="separator"></div>
			<div class="opposing-team-picks">
				<div class="current-year-picks">
					<span class="text">Current</span>
					<div class="picks-holder"></div>
				</div>
				<div class="next-year-picks">
					<span class="text"></span>
					<div class="picks-holder"></div>
				</div>
			</div>
		</div>

		<div class="trade-progress-container hidden">
			<div class="trade-progress-header">
				<span class="trade-progress-label">Trade Acceptance</span>
				<span class="trade-progress-status"></span>
			</div>
			<div class="trade-progress-bar">
				<div class="trade-progress-fill"></div>
				<div class="trade-progress-threshold"></div>
			</div>
		</div>

		<div class="picks-confirmation-container hidden">
			<div class="trade-value-comparison confirm-proposal-value">
				<div class="trade-value-header">
					<div class="trade-value-team user-value">
						<span class="trade-value-label">Value Offered</span>
						<span class="trade-value-points"></span>
					</div>
					<div class="trade-value-team opposing-value">
						<span class="trade-value-label">Value Offered</span>
						<span class="trade-value-points"></span>
					</div>
				</div>
				<div class="trade-value-bar">
					<div class="trade-value-bar-user">
						<span class="trade-value-bar-percent"></span>
					</div>
					<div class="trade-value-bar-opposing">
						<span class="trade-value-bar-percent"></span>
					</div>
				</div>
			</div>
			<div class="user-picks-holder"></div>
			<div class="separator"></div>
			<div class="opposing-team-picks-holder"></div>
		</div>

		<div class="nav-btn-container">
			<button class="nav-btn next" disabled>Confirm</button>
			<button class="nav-btn back hidden">Back</button>
			<button class="nav-btn propose hidden" disabled>Propose</button>
			<button class="nav-btn confirm hidden">Confirm</button>
		</div>

		<div class="trade-accepted-container hidden">
			<img class="trade-accept-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/trade-accepted-icon.png"
				width="88" height="88" alt="accept-icon">
			<span class="text">The trade has been accepted!</span>
		</div>
		<div class="trade-rejected-container hidden">
			<img class="trade-reject-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/trade-rejected-icon.png"
				width="88" height="88" alt="reject-icon">
			<span class="text">The trade has been rejected!</span>
		</div>
	</div>
</template>

<template id="restart-confirmation">
	<div class="restart-confirmation-popup-container">
		<div class="confirmation-header">
			<span class="header-text">Confirm Restart</span>
			<button class="close-btn">
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="15" height="15"
					alt="close-icon" />
			</button>
		</div>
		<div class="confirmation-info-text-container">
			<span class="confirmation-info-text">Are you sure you wish to restart your Sim?</span>
			<span class="confirmation-info-text">You will lose any progress in your current simulation.</span>
		</div>
		<div class="confirmation-btn-container">
			<button class="confirm-restart">Confirm</button>
		</div>
	</div>
</template>

<template id="player-info">
	<div class="player-info-popup">
		<div class="player-info-header">
			<span class="player-info-header-text">Player Info</span>
			<button class="player-info-close-icon-container">
				<img class="close-icon" src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="16"
					height="16" alt="close-icon">
			</button>
		</div>
		<div class="player-info-body">
			<div class="player-name-container">
				<span class="player-name"></span>
				<span class="player-position"></span>
				<span class="player-draft-from"></span>
			</div>
			<div class="player-body-info-container">
				<span class="player-height"></span>
				<span class="player-weight"></span>
				<span class="player-ras"></span>
			</div>
			<div class="player-description-container">
				<span class="player-description"></span>
			</div>
			<div class="popup-btns-container">
				<button class="close-btn">Close</button>
				<a class="full-report-btn" href="" target="_blank">Full Report</a>
			</div>
		</div>
	</div>
</template>

<template id="team-picks-info">
	<div class="team-picks-info-popup">
		<div class="team-picks-header">
			<span class="team-name"></span>
			<button class="close-team-picks-btn">
				<img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/close-icon.svg" width="16" height="16"
					alt="close-icon">
			</button>
		</div>
		<div class="team-picks-list-container">
			<div class="team-picks-list-holder"></div>
		</div>
	</div>
</template>

<template id="trade-proposal-response">
	<div class="trade-proposal-response-popup">
		<div class="trade-proposal-response-header">
			<span class="trade-proposal-response-header-text">Trade Proposal</span>
		</div>
		<div class="trade-proposal-response-container">
			<span class="trade-proposal-response-description"></span>
		</div>
	</div>
</template>
