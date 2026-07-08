{include file="./styles.tpl"}

<template id="simulate-popup">
    <div class="simulate-popup-container">
        <div class="popup-header">
            <span class="header-text">What do you want to Simulate?</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="radio-option-container option1" data-option="option1" data-simulation-type="simulate">
            <span class="remaining-games-text">Remaining games of 'Week <span class="current-week">18</span>'</span>
            <input type="radio" name="simulate" value="option1">
        </div>
        <div class="seperator option1-seperator"></div>
        <div class="radio-option-container option2" data-option="option2" data-simulation-type="simulate">
            <span class="remaining-games-from-text">Remaining games from 'Week <span
                    class="current-week">18</span>'</span>
            <input type="radio" name="simulate" value="option2">
        </div>
        <div class="seperator option2-seperator"></div>
        <div class="radio-option-container option3" data-option="option3" data-simulation-type="simulate">
            <span>All remaining league games</span>
            <input type="radio" name="simulate" value="option3">
        </div>
        <div class="seperator option4-seperator"></div>
        <div class="result-button-container">
            <button class="submit-simulate-button">Simulate</button>
        </div>
    </div>
</template>

<template id="delete-popup">
    <div class="delete-popup-container">
        <div class="popup-header">
            <span class="header-text">What do you want to Reset?</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="radio-option-container option1" data-option="option1" data-simulation-type="delete">
            <span class="current-week-text"> Predictions of 'Week <span class="current-week">18</span>' only</span>
            <input type="radio" name="delete" value="option1">
        </div>
        <div class="seperator option1-seperator"></div>
        <div class="radio-option-container option2" data-option="option2" data-simulation-type="delete">
            <span> All predictions from 'Week <span class="current-week">18</span>'</span>
            <input type="radio" name="delete" value="option2">
        </div>
        <div class="seperator option2-seperator"></div>
        <div class="radio-option-container option3" data-option="option3" data-simulation-type="delete">
            <span> All predictions before 'Week <span class="current-week">18</span>'</span>
            <input type="radio" name="delete" value="option3">
        </div>
        <div class="seperator option3-seperator"></div>
        <div class="radio-option-container option4" data-option="option4" data-simulation-type="delete">
            <span> Reset Playoff Predictor</span>
            <input type="radio" name="delete" value="option4">
        </div>
        <div class="result-button-container">
            <button class="submit-delete-button">Reset</button>
        </div>
    </div>
</template>

<template id="predict-simulate-popup">
    <div class="predict-simulate-popup-container">
        <div class="popup-header">
            <span class="header-text">Complete League Predictions to access Playoffs</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="radio-option-container option1" data-option="option1" data-simulation-type="simulate">
            <span> Simulate all remaining league games</span>
            <input type="radio" name="simulate" value="option1">
        </div>
        <div class="seperator option1-seperator"></div>
        <div class="radio-option-container option2" data-option="option2" data-simulation-type="simulate">
            <span> Simulate remaining games of 'Week <span class="current-week">18</span>'</span>
            <input type="radio" name="simulate" value="option2">
        </div>
        <div class="seperator option2-seperator"></div>
        <div class="radio-option-container option3" data-option="option3" data-simulation-type="simulate">
            <span> Simulate remaining games from 'Week <span class="current-week">18</span>'</span>
            <input type="radio" name="simulate" value="option3">
        </div>
        <div class="result-button-container">
            <button class="submit-simulate-button">Confirm</button>
        </div>
    </div>
</template>

<template id="playoff-winner-animation">
    <div class="playoff-winner-animation-overlay">
        <div class="playoff-winner-animation-gif-container">
            <div id="playoff-winner-animation-gif"></div>
        </div>
        <div class="playoff-winner-animation-team-container">
            <img src="" class="playoff-winner-animation-team-logo" alt="Winner Team Logo" width="99px" height="66px">
        </div>
    </div>
</template>

<template id="predict-playoff-games-popup">
    <div class="predict-playoff-games-popup-container">
        <div class="popup-header">
            {if $brand_logo}
                <img src="{$smarty.const.STATIC_URL}/skm/assets/pfn/pfsn-logo-black-ver-2.png"
                    class="popup-header-brand-logo" height="26px" width="26px" alt="Logo" />
            {/if}
            <span class="header-text">Predict Playoff Games</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="predict-playoff-games-popup-content">
            <div class="playoff-popup-conference-header">
                <div class="afc-playoff-popup-header">
                    <img width="180px" height="34px" alt="afc-logo" class="afc-playoff-popup-header-logo"
                        crossorigin="anonymous"
                        src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/afc-hr-logo.png" />
                </div>
                <div class="nfc-playoff-popup-header">
                    <img width="180px" height="34px" alt="nfc-logo" class="nfc-playoff-popup-header-logo"
                        crossorigin="anonymous"
                        src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/nfc-hr-logo.png" />
                </div>
            </div>
            <div class="playoff-wildcard-round-wrapper">
                <span class="playoff-wildcard-round-text">Wild Card Round</span>
                <div class="playoff-wildcard-round-container">
                    <div class="afc-playoff-wildcard-round-container"></div>
                    <div class="vertical-container-seperator"></div>
                    <div class="nfc-playoff-wildcard-round-container"></div>
                </div>
            </div>
            <div class="playoff-divisional-round-wrapper">
                <span class="playoff-divisional-round-text">Divisional Playoffs</span>
                <div class="playoff-divisional-round-container">
                    <div class="afc-playoff-divisional-round-container disabled-round "></div>
                    <div class="vertical-container-seperator"></div>
                    <div class="nfc-playoff-divisional-round-container disabled-round "></div>
                </div>
            </div>
            <div class="playoff-conference-round-wrapper">
                <span class="playoff-conference-round-text">Conference Championships</span>
                <div class="playoff-conference-round-container">
                    <div class="afc-playoff-conference-round-container disabled-round "></div>
                    <div class="vertical-container-seperator"></div>
                    <div class="nfc-playoff-conference-round-container disabled-round "></div>
                </div>
            </div>
            <div class="playoff-super-bowl-round-wrapper">
                <span class="playoff-super-bowl-round-text">Super Bowl</span>
                <div class="playoff-super-bowl-round-container">
                    <div class="afc-playoff-super-bowl-round-container disabled-round "></div>
                    <div class="vertical-container-seperator"></div>
                    <div class="nfc-playoff-super-bowl-round-container disabled-round "></div>
                </div>
            </div>
            <div class="playoff-predict-popup-footer">
                <span class="playoff-predict-popup-footer-text">
                    <strong>Note:</strong> Select the teams which are likely to win their respective rounds
                </span>
            </div>
        </div>
        <div class="playoff-games-popup-footer">
            <button class="playoff-games-reset-btn" disabled>
                <img width="18px" height="18px" alt="delete"
                    src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/delete-btn-red.png" />
                <span>Reset</span>
            </button>
            <div class="utility-container">
                <img class="winner-logo hidden" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/winner.svg"
                    width="63" height="20" alt="winner icon" crossorigin="anonymous">
                <button class="download-btn-mds">
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/symbol-download.svg" width="16"
                        height="16" alt="download icon">
                </button>
                <button class="share-btn-mds hidden">
                    <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/symbol-share.svg" width="16"
                        height="16" alt="share icon">
                </button>
                <img class="sk-logo hidden" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/sk-logo.svg"
                    width="63" height="20" alt="winner icon" crossorigin="anonymous">
                <img class="pfn-logo hidden" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/pfn-logo.svg"
                    width="63" height="20" alt="winner icon" crossorigin="anonymous">
            </div>
            <button class="playoff-games-sim-btn">
                <img width="18px" height="18px" alt="simulate"
                    src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/simulate-btn-blue.png" />
                <span>Simulate</span>
            </button>
            <button class="playoff-games-pause-btn hidden">
                <img width="18px" height="18px" alt="simulate"
                    src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/pause-btn-gray.png" />
                <span>Pause</span>
            </button>
        </div>
    </div>
</template>

{include file="./js.tpl"}
