{include file="./styles.tpl"}
<div>
    <div class="standings-conference-tab-toggle">
        <button class="standings-conf-tab-btn afc-tab-btn selected">AFC</button>
        <button class="standings-conf-tab-btn nfc-tab-btn">NFC</button>
    </div>
    <div class="stadings-logo-header-container">
        <div class="afc-logo-header-container">
            <img alt="afc-logo" class="afc-header-logo"
                src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/afc-logo.png?w=60" />
        </div>
        <div class="nfc-logo-header-container">
            <img alt="nfc-logo" class="nfc-header-logo"
                src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/nfc-logo.png?w=60" />
        </div>
    </div>
    <div class="standings-container">
        <div class="standings-conference-bar afc-conference-bar">
            <img alt="afc-logo" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/afc-logo.png?w=60" />
        </div>
        <div class="standings-conference-bar nfc-conference-bar hidden">
            <img alt="nfc-logo" src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/logos/nfc-logo.png?w=60" />
        </div>
        <div class="afc-standings-container">
            <div class="division-header-container">
                <span class="division-name">East</span>
                <span class="division-name">North</span>
                <span class="division-name">South</span>
                <span class="division-name">West</span>
            </div>
            <div class="afc-conference-standings-container">
                <div class="division-standings-container afc-e"></div>
                <div class="division-standings-container afc-n"></div>
                <div class="division-standings-container afc-s"></div>
                <div class="division-standings-container afc-w"></div>
            </div>
        </div>
        <div class="rank-container">
            <div class="rank-header-spacer">
                <span class="rank-text">#</span>
            </div>
            <div class="rank-text-container">
                <div class="rank-item"><span class="rank-text">1</span></div>
                <div class="rank-item"><span class="rank-text">2</span></div>
                <div class="rank-item"><span class="rank-text">3</span></div>
                <div class="rank-item"><span class="rank-text">4</span></div>
            </div>
        </div>
        <div class="nfc-standings-container">
            <div class="division-header-container">
                <span class="division-name">East</span>
                <span class="division-name">North</span>
                <span class="division-name">South</span>
                <span class="division-name">West</span>
            </div>
            <div class="nfc-conference-standings-container">
                <div class="division-standings-container nfc-e"></div>
                <div class="division-standings-container nfc-n"></div>
                <div class="division-standings-container nfc-s"></div>
                <div class="division-standings-container nfc-w"></div>
            </div>
        </div>
    </div>
</div>


