{if !$included_global_utils__cookie}

    {assign var=included_global_utils__cookie value=TRUE scope="root"}

    {include file="desktop/utils/network-js.tpl"}

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length,c.length).trim();
            }
        }
        return "";
    }

    function setCookie(cname, cvalue, cexpiry) {
        var expiry = typeof cexpiry === 'string' ? cexpiry : cexpiry.toGMTString();
        document.cookie = cname + '=' + cvalue + ';domain=.sportskeeda.com;path=/;expires=' + expiry;
    }

    function unsetCookie(cname) {
        document.cookie = cname + '=;domain=.sportskeeda.com;path=/;expires=Thu, 01 Jan 1971 00:00:01 GMT;';
    }

{/if}
{if !$included_global_utils__cookie_refresh}

    {assign var=included_global_utils__cookie_refresh value=TRUE scope="root"}
    {assign var=enable_user_cookies_refresh value=TRUE}
    {if isset($shouldEnableUserCookieRefresh)}
        {assign var=enable_user_cookies_refresh value=$shouldEnableUserCookieRefresh}
    {/if}

    {if $enable_user_cookies_refresh}
        var refreshCookie = getCookie('{$smarty.const.COOKIE_REFRESH}');
        var currentDate = new Date();
        var refreshDate = new Date(parseInt(refreshCookie));
        var userSlug = getCookie('{$smarty.const.COOKIE_USER_SLUG}');
        var userPicture = getCookie('{$smarty.const.COOKIE_USER_PICTURE_LARGE}');

        if (isNaN(refreshDate.getTime())) {
            refreshDate = new Date();
        }

        console.log(currentDate, refreshDate);

        if((refreshCookie && (currentDate > refreshDate)) || (!!!refreshCookie && userSlug)) {
            refreshUserCookies();
        }

        function refreshUserCookies() {
            pureJSAjaxGetWithCredentialsFlag('{$smarty.const.FRAMEWORK_URL}/login/refresh-token', function(res) {
                console.log(res);
            }, function failed() {
            console.error("Failed to refresh tokens");
            }, true);
        }
    {/if}
{/if}
