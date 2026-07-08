{include file="./styles.tpl"}

<div class="simulation-ctas-container">
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
    <button class="power-rank-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="14" width="4" height="8" rx="1" fill="#0050A0"/>
            <rect x="10" y="8" width="4" height="14" rx="1" fill="#0050A0"/>
            <rect x="17" y="2" width="4" height="20" rx="1" fill="#0050A0"/>
        </svg>
        <span>Rankings</span>
        <span class="new-indicator">New</span>
    </button>
    <button class="settings-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#0050A0" stroke-width="2"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#0050A0" stroke-width="2"/>
        </svg>
        <span>Settings</span>
        <span class="new-indicator">New</span>
    </button>
    <button class="delete-button">
        <img width="18px" height="18px" alt="delete-button"
            src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/delete-btn-red.png" />
        <span>Reset</span>
    </button>
    <div class="tooltip hidden">
        <span class="up-arrow"></span>
        <span>Click here to simulate the results of the remaining NFL matches after completing your predictions</span>
    </div>
</div>
