<!-- /{$smarty.const.AD_CODE}/{$slotId} -->
<div class = "interstitial-fullpage hidden" style='width:100%; position:fixed; z-index:9999999; padding:0; margin:0;top: 0; left:0;
height: 100%;background-color: #f5f5f5;'>
    <div class = "sk-logo-skip hidden" style = "width: 100%;background-color: #FFF; text-align: left;height:50px; font-family: sans-serif; color: #ccc; margin: 0 auto 2px auto; font-weight: bold; display: block;">
        <div style="width:50%;float:left;">
            <img style="width: 51px;padding-left: 15px;height: 20px;" src="https://statics.sportskeeda.com/logo/brand_logos/Short_Logo_smaller_-3880x624xx.png" class="img-responsive homepage-logo" alt="Sports news" title="Sports news" style="">
        </div>
        <div style="border-radius: 5px;padding: 5px;margin-top:7px;display:flex;align-content: center;justify-content: center;width:auto;float:right;cursor:pointer;margin-right: 10px;background-color: #f5f5f5;" onClick = "skipAd()">
            <a href="javascript:void(0)" style="color:#000;text-decoration: none;font-size:12px;padding:0 10px;height:20px">Skip This</a>
        </div>
    </div>
    <div id='{$ad_units.$slotId.div}' style="margin-top:3px;text-align:center;background-color: #FFF;width:100%;height:100%;">
        <script>
        if (typeof getUrlParamsValue === 'undefined') {
            function getUrlParamsValue(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
                var results = regex.exec(location.search);
                return results === null
                    ? ""
                    : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        }
        if (typeof isAdDisplayed === 'undefined') {
            function isAdDisplayed() {
                var displayedTill = parseInt(getCookie("CMC_INTERSTITIAL_DISPLAYED_AT"));
                var dt = new Date();
                // ad displayed before on hour
                var timeDiff = displayedTill - dt.getTime();
                console.log('Diff::'+timeDiff);
                if (!isNaN(timeDiff) && timeDiff < 3600*1000) {
                    return true;
                }
                return false;
            }
        }
        if (typeof setAdDisplayed === 'undefined') {
            function setAdDisplayed() {
                unsetCookie("CMC_INTERSTITIAL_DISPLAYED_AT");
                var expiryTime = new Date();
                expiryTime.setHours(expiryTime.getHours() + 1); // Expiry after 1 hour
                setCookie("CMC_INTERSTITIAL_DISPLAYED_AT", expiryTime.getTime(), expiryTime);
            }
        }
        if(typeof displayAdSlot !== 'undefined' && !isAdDisplayed() && KEY1 == 'micricket') {
            console.log('Display::CMC_Interstitial');
            displayAdSlot('{$ad_units.$slotId.div}');
        }
        </script>
    </div>
</div>
<script>
    function skipAd() {
        window.scrollTo(0,0);
        window.top.postMessage('adCloseEvent', '*');
        if(document.querySelector(".interstitial-fullpage")) {
            document.querySelector(".interstitial-fullpage").parentNode.removeChild(document.querySelector(".interstitial-fullpage"));
        }
    }
    </script>
<style>
.cookie-consent {
    top: calc(100% - 79px) !important;
    left: calc(100% - 130px) !important;
}
</style>