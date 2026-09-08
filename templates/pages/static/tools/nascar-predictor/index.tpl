{include file="./styles.tpl"}

<div class="nascar-predictor-container">
    <div class="app-container">
        <!-- Main Content -->
        <main class="main-content">
            <!-- Mobile Controls -->
            <div class="mobile-controls">
                <div class="button-row">
                    <button id="resetBtnMobile" class="btn btn-secondary btn-sm">Reset</button>
                    <button id="simulateBtnMobile" class="btn btn-primary btn-sm">Simulate</button>
                </div>
                <div class="mobile-tabs">
                    <button class="mobile-tab active" data-mobile-tab="schedule">Schedule</button>
                    <button class="mobile-tab" data-mobile-tab="standings">Standings</button>
                </div>
            </div>

            <!-- Left Column -->
            <div class="left-column">
                <div class="button-row desktop-only">
                    <button id="resetBtn" class="btn btn-secondary btn-sm">Reset</button>
                    <button id="simulateBtn" class="btn btn-primary btn-sm">Simulate</button>
                </div>
                <aside class="races-panel">
                    <div class="panel-header">
                        <h2>Race Schedule</h2>
                        <div class="race-counts">
                            <span class="race-count" id="regularSeasonCount">0 / 26 Regular Season</span>
                            <span class="race-count" id="chaseCount">0 / 10 Chase</span>
                        </div>
                    </div>
                    <div class="races-list" id="racesList">
                        <!-- Races will be dynamically populated -->
                    </div>
                </aside>
            </div>

            <!-- Standings Panel (Right) -->
            <section class="standings-panel">
                <div class="panel-header">
                    <div class="standings-tabs">
                        <button class="standings-tab active" data-standings="regular" id="regularSeasonTab">Regular Season</button>
                        <button class="standings-tab disabled" data-standings="chase" id="chaseTab">Chase</button>
                    </div>
                    <button class="btn-icon" id="downloadStandingsBtn" title="Download Standings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    <button class="btn-icon" id="shareStandingsBtn" title="Share Standings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
                <div class="standings-table-container">
                    <table class="standings-table" id="standingsTable">
                        <thead>
                            <tr>
                                <th class="col-pos">Pos</th>
                                <th class="col-driver">Driver</th>
                                <th class="col-points sortable-header" data-sort-column="points">
                                    <span class="header-full">Points</span><span class="header-short">Pts</span>
                                    <span class="sort-indicator active">&#9660;</span>
                                    <button class="btn-scoring-info" id="scoringInfoBtn" title="Scoring Info"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></button>
                                </th>
                                <th class="col-behind"><span class="header-full">Behind</span><span class="header-short">Back</span></th>
                                <th class="col-chase-gap"><span class="header-full">Chase Gap</span><span class="header-short">Chase</span></th>
                                <th class="col-wins sortable-header" data-sort-column="wins">
                                    Wins
                                    <span class="sort-indicator">&#9660;</span>
                                </th>
                                <th class="col-top5 sortable-header desktop-sort" data-sort-column="top5">
                                    Top 5
                                    <span class="sort-indicator">&#9660;</span>
                                </th>
                                <th class="col-top10 sortable-header desktop-sort" data-sort-column="top10">
                                    Top 10
                                    <span class="sort-indicator">&#9660;</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="standingsBody">
                            <!-- Standings will be dynamically populated -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <!-- Race Modal -->
        <div class="modal-overlay" id="raceModal">
            <div class="modal race-modal">
                <div class="modal-header">
                    <h2 class="modal-title" id="modalRaceTitle">Race Name - Track Name</h2>
                    <button class="btn-race-info" id="raceInfoBtn" title="Race Info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </button>
                    <button class="modal-close" id="closeModal">&times;</button>
                </div>

                <div class="modal-tabs">
                    <button class="tab-btn active" data-tab="stage1">Stage 1<span class="tab-info-btn mobile-only" data-title="Stage 1" data-info="Top 10 earn stage points">i</span></button>
                    <button class="tab-btn" data-tab="stage2">Stage 2<span class="tab-info-btn mobile-only" data-title="Stage 2" data-info="Top 10 earn stage points">i</span></button>
                    <button class="tab-btn" data-tab="finish">Finish<span class="tab-info-btn mobile-only" data-title="Finish" data-info="Set final race finishing positions">i</span></button>
                    <button class="tab-btn" data-tab="fastest">Fastest Lap<span class="tab-info-btn mobile-only" data-title="Fastest Lap" data-info="Select the driver who set the fastest lap">i</span></button>
                </div>

                <div class="modal-content">
                    <!-- Stage 1 Tab -->
                    <div class="tab-content active" id="tab-stage1">
                        <div class="stage-info">
                            <p>Set finishing positions for Stage 1 (Top 10 earn stage points)</p>
                        </div>
                        <div class="position-list" id="stage1Positions">
                            <!-- Driver position inputs will be populated -->
                        </div>
                    </div>

                    <!-- Stage 2 Tab -->
                    <div class="tab-content" id="tab-stage2">
                        <div class="stage-info">
                            <p>Set finishing positions for Stage 2 (Top 10 earn stage points)</p>
                        </div>
                        <div class="position-list" id="stage2Positions">
                            <!-- Driver position inputs will be populated -->
                        </div>
                    </div>

                    <!-- Finish Tab -->
                    <div class="tab-content" id="tab-finish">
                        <div class="stage-info">
                            <p>Set final race finishing positions</p>
                        </div>
                        <div class="position-list" id="finishPositions">
                            <!-- Driver position inputs will be populated -->
                        </div>
                    </div>

                    <!-- Fastest Lap Tab -->
                    <div class="tab-content" id="tab-fastest">
                        <div class="stage-info">
                            <p>Select the driver who set the fastest lap</p>
                        </div>
                        <div class="fastest-lap-selector" id="fastestLapSelector">
                            <!-- Driver selection will be populated -->
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" id="clearRaceBtn"><span class="btn-text-full">Clear</span><span class="btn-text-short">Clear</span></button>
                    <button class="btn btn-simulate" id="simulateRaceBtn">Simulate</button>
                    <button class="btn btn-download" id="downloadRaceBtn"><span class="btn-text-full">Download</span><span class="btn-text-short"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span></button>
                    <button class="btn btn-share" id="shareRaceBtn"><span class="btn-text-full">Share</span><span class="btn-text-short"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></span></button>
                    <button class="btn btn-save" id="saveRaceBtn"><span class="btn-text-full">Save</span><span class="btn-text-short">Save</span></button>
                </div>
            </div>
        </div>

        <!-- Simulate Options Modal -->
        <div class="modal-overlay" id="simulateModal">
            <div class="modal simulate-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Simulate Races</h2>
                    <button class="modal-close" id="closeSimulateModal">&times;</button>
                </div>
                <div class="simulate-options">
                    <button class="simulate-option" id="simNextRace">
                        <span class="option-title">Next Race</span>
                        <span class="option-desc">Simulate the next incomplete race</span>
                    </button>
                    <div class="simulate-option sim-to-race-option">
                        <div class="sim-to-race-row">
                            <span class="option-title">Simulate to Race</span>
                        </div>
                        <select id="simToRaceSelect" class="sim-to-race-select">
                            <option value="">Select a race...</option>
                        </select>
                        <span class="option-desc">Simulate all races before the selected race</span>
                        <button class="btn btn-primary btn-sm sim-to-race-btn" id="simToRaceBtn">Go</button>
                    </div>
                    <button class="simulate-option" id="simRegularSeason">
                        <span class="option-title">Regular Season</span>
                        <span class="option-desc">Simulate remaining regular season races</span>
                    </button>
                    <button class="simulate-option" id="simFullSeason">
                        <span class="option-title">Full Season</span>
                        <span class="option-desc">Simulate all remaining races</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Simulate Race Event Modal -->
        <div class="modal-overlay" id="simulateRaceModal">
            <div class="modal simulate-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Simulate Race</h2>
                    <button class="modal-close" id="closeSimulateRaceModal">&times;</button>
                </div>
                <div class="simulate-options">
                    <button class="simulate-option" id="simCurrentEvent">
                        <span class="option-title">Current Event</span>
                        <span class="option-desc" id="simCurrentEventDesc">Simulate the current stage only</span>
                    </button>
                    <button class="simulate-option" id="simFullRace">
                        <span class="option-title">Full Race</span>
                        <span class="option-desc">Simulate all events for this race</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Clear Options Modal -->
        <div class="modal-overlay" id="clearModal">
            <div class="modal simulate-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Clear Results</h2>
                    <button class="modal-close" id="closeClearModal">&times;</button>
                </div>
                <div class="simulate-options">
                    <button class="simulate-option" id="clearCurrentEvent">
                        <span class="option-title">Current Event</span>
                        <span class="option-desc" id="clearCurrentEventDesc">Clear the current stage only</span>
                    </button>
                    <button class="simulate-option" id="clearFullRace">
                        <span class="option-title">Full Race</span>
                        <span class="option-desc">Clear all events for this race</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Download Options Modal -->
        <div class="modal-overlay" id="downloadOptionsModal">
            <div class="modal simulate-modal">
                <div class="modal-header">
                    <h2 class="modal-title" id="downloadOptionsTitle">Download</h2>
                    <button class="modal-close" id="closeDownloadOptionsModal">&times;</button>
                </div>
                <div class="simulate-options">
                    <button class="simulate-option" id="downloadTop10">
                        <span class="option-title">Top 10</span>
                        <span class="option-desc">Download the top 10 only</span>
                    </button>
                    <button class="simulate-option" id="downloadFullList">
                        <span class="option-title">Full List</span>
                        <span class="option-desc">Download the complete list</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div class="loading-overlay" id="loadingOverlay">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>

        <!-- Toast Container -->
        <div class="toast-container" id="toastContainer"></div>
    </div>
</div>

{include file="./js.tpl"}
