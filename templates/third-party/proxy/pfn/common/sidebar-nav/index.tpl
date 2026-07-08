{include file="./styles.tpl"}

<input type="checkbox" id="sidebar-mobile-toggle" style="display:none;">
<div class="pfn-mobile-topbar">
    <label for="sidebar-mobile-toggle" class="menu-btn" aria-label="Open navigation">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
    </label>
    <a href="https://www.profootballnetwork.com" class="mobile-logo">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-ver-2.png?w=25&h=25" alt="PFSN">
    </a>
    <span class="right-spacer"></span>
</div>

<aside class="pfn-sidebar-wrapper">
    <a class="pfn-sidebar-logo" href="https://www.profootballnetwork.com">
        <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-ver-2.png?w=58&h=58"
             alt="PFSN" width="58" height="58">
    </a>

    <div class="pfn-sidebar-featured">
        <ul>
            <li>
                <a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq">
                    <span class="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                    </span>
                    <span class="label">Home</span>
                </a>
            </li>
            <li>
                <a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/mockdraft" target="_blank" rel="noopener noreferrer">
                    <span class="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                    </span>
                    <span class="label">NFL Mock Draft Simulator</span>
                </a>
            </li>
            <li>
                <a class="pfn-sidebar-item active" href="https://www.profootballnetwork.com/nfl-playoff-predictor" target="_blank" rel="noopener noreferrer">
                    <span class="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </span>
                    <span class="label">NFL Playoff Predictor</span>
                </a>
            </li>
            <li>
                <a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/teams">
                    <span class="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                        </svg>
                    </span>
                    <span class="label">Browse All Teams</span>
                </a>
            </li>
        </ul>
    </div>

    <nav class="pfn-sidebar-nav">
        <div class="pfn-sidebar-section-label">
            <span>Tools &amp; Games</span>
            <span class="label-line"></span>
        </div>
        <ul>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/trade-machine"><span class="label">NFL Trade Machine</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/player-comparison"><span class="label">Compare Players</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/cta-ultimate-gm-simulator-nfl/" target="_blank" rel="noopener noreferrer">
                <span class="label">Ultimate GM Simulator</span>
                <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-player-guessing-game/" target="_blank" rel="noopener noreferrer">
                <span class="label">Player Guessing Game</span>
                <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/games/nfl-connections/" target="_blank" rel="noopener noreferrer">
                <span class="label">NFL Connections</span>
                <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/games/word-fumble"><span class="label">NFL Word Fumble</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/games/word-search"><span class="label">NFL Word Search</span></a></li>
        </ul>

        <div class="pfn-sidebar-section-label">
            <span>Offseason Hub</span>
            <span class="label-line"></span>
        </div>
        <ul>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/free-agency-tracker"><span class="label">Free Agency Tracker</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/team-needs"><span class="label">Team Needs</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/salary-cap-tracker"><span class="label">Salary Cap Tracker</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/articles"><span class="label">NFL Articles</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-offseason-salary-cap-free-agency-manager" target="_blank" rel="noopener noreferrer">
                <span class="label">Offseason Manager</span>
                <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a></li>
        </ul>

        <div class="pfn-sidebar-section-label">
            <span>Rankings</span>
            <span class="label-line"></span>
        </div>
        <ul>
            <li class="pfn-sidebar-group">
                <input type="checkbox" id="grp-impact" class="pfn-sidebar-toggle">
                <label for="grp-impact" class="pfn-sidebar-item">
                    <span class="label">PFSN Impact Rankings</span>
                    <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </label>
                <div class="pfn-sidebar-sublist">
                    <a href="https://www.profootballnetwork.com/nfl-offense-rankings-impact/" target="_blank" rel="noopener noreferrer">Team Offense</a>
                    <a href="https://www.profootballnetwork.com/nfl-defense-rankings-impact/" target="_blank" rel="noopener noreferrer">Team Defense</a>
                    <a href="https://www.profootballnetwork.com/nfl-qb-rankings-impact/" target="_blank" rel="noopener noreferrer">QB</a>
                    <a href="https://www.profootballnetwork.com/nfl-rb-rankings-impact/" target="_blank" rel="noopener noreferrer">RB</a>
                    <a href="https://www.profootballnetwork.com/nfl-wr-rankings-impact/" target="_blank" rel="noopener noreferrer">WR</a>
                    <a href="https://www.profootballnetwork.com/nfl-te-rankings-impact/" target="_blank" rel="noopener noreferrer">TE</a>
                    <a href="https://www.profootballnetwork.com/nfl-player-ol-rankings-impact/" target="_blank" rel="noopener noreferrer">OL</a>
                    <a href="https://www.profootballnetwork.com/nfl-dt-rankings-impact/" target="_blank" rel="noopener noreferrer">DT</a>
                    <a href="https://www.profootballnetwork.com/nfl-edge-rankings-impact/" target="_blank" rel="noopener noreferrer">EDGE</a>
                    <a href="https://www.profootballnetwork.com/nfl-lb-rankings-impact/" target="_blank" rel="noopener noreferrer">LB</a>
                    <a href="https://www.profootballnetwork.com/nfl-cb-rankings-impact/" target="_blank" rel="noopener noreferrer">CB</a>
                    <a href="https://www.profootballnetwork.com/nfl-saf-rankings-impact/" target="_blank" rel="noopener noreferrer">SAF</a>
                </div>
            </li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/player-rankings-builder"><span class="label">Player Rankings Builder</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/power-rankings-builder"><span class="label">Power Rankings Builder</span></a></li>
        </ul>

        <div class="pfn-sidebar-section-label">
            <span>Season</span>
            <span class="label-line"></span>
        </div>
        <ul>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/schedule"><span class="label">Schedule</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/standings"><span class="label">Standings</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/injuries"><span class="label">Injury Report</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/stats"><span class="label">Stat Leaders</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/transactions"><span class="label">Transactions</span></a></li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-hq/players"><span class="label">Player Pages</span></a></li>
        </ul>

        <div class="pfn-sidebar-section-label">
            <span>Other Hubs</span>
            <span class="label-line"></span>
        </div>
        <ul>
            <li class="pfn-sidebar-group">
                <input type="checkbox" id="grp-superbowl" class="pfn-sidebar-toggle">
                <label for="grp-superbowl" class="pfn-sidebar-item">
                    <span class="icon"><img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/sblx-logo.png" alt="" style="height:18px;width:18px;object-fit:contain;"></span>
                    <span class="label">Super Bowl HQ</span>
                    <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </label>
                <div class="pfn-sidebar-sublist">
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=overview">Overview</a>
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=path-to-super-bowl">Path to Super Bowl</a>
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=rosters">Rosters &amp; Depth Charts</a>
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=injuries">Injury Report</a>
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=stats">Stats Comparison</a>
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=head-to-head">Head-to-Head</a>
                    <a href="https://www.profootballnetwork.com/nfl-hq/super-bowl-lx?tab=history">Super Bowl History</a>
                </div>
            </li>
            <li><a class="pfn-sidebar-item" href="https://www.profootballnetwork.com/nfl-draft-hq/" target="_blank" rel="noopener noreferrer">
                <span class="label">NFL Draft HQ</span>
                <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a></li>
        </ul>
    </nav>

    <div class="pfn-sidebar-bottom-spacer"></div>
</aside>

<label for="sidebar-mobile-toggle" class="pfn-sidebar-close-tab" aria-label="Close navigation">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6"  x2="6"  y2="18"/>
        <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
</label>
