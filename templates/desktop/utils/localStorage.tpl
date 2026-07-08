{if !$included_global_localstorage_helper}

{assign var=included_global_localstorage_helper value=TRUE scope="root"}
<script type="text/javascript">
    {*
        // @param: String key
        // @param: String value
        // Comment: set the local storage data
    *}
    function setLocalStorageData(key, value) {
        localStorage.setItem(key, value);
    }

    {*
        // @param: String key
        // @return: String
        // Comment: Check if the value for the local storage exist
    *}
    function getLocalStorageData(key) {
        var item = localStorage.getItem(key);
        return item != null ? item : "";
    }

    function setLocalStorageWithExpiry(key, value, expiryTimestamp) {
        {* `item` is an object which contains the original value *}
        {* as well as the time when it's supposed to expire *}
        try {
            var item = {
                value: value,
                expiry: expiryTimestamp,
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.log("Error while setting ls key: ", key);
        }
    }

    function getLocalStorageWithExpiry(key) {
        var lsValue = localStorage.getItem(key);
        {* if the item doesn't exist, return null *}
        if (!lsValue) {
            return null;
        }

        var item;
        try {
            item = JSON.parse(lsValue);
        } catch (e) {
            {* Fallback if trying to access a item set with localStorage.setItem instead of setLocalStorageWithExpiry *}
            return lsValue;
        }

        if (typeof item !== "object") {
            {* Fallback if the item is not an object *}
            return lsValue;
        }

        if (!item || !item.expiry) {
            return lsValue;
        }

        if (item && !item.value) {
            return lsValue;
        }

        var now = new Date();
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            {* If the item is expired, delete the item from storage *}
            {* and return null *}
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }

    function removeFromLocalStorage(key) {
        localStorage.removeItem(key);
    }

    function cleanupLocalStorage() {
        var keys = Object.keys(localStorage);
        keys.forEach(function(key) {
            var value = localStorage.getItem(key);

            if (key.startsWith("fz_widget_") && value && !value.includes("expiry")) {
                {* Remove the outdated fz_widget keys *}
                localStorage.removeItem(key);
            } else if (key.startsWith("profileUpdateMessage") && value && !value.includes("expiry")) {
                {* Remove the outdated profileUpdateMessage key *}
                localStorage.removeItem(key);
            } else if (key.startsWith("LIKEDARTICLES")) {
                {* Remove the outdated liked articles key *}
                localStorage.removeItem(key);
            } else if (key.startsWith("LIKEDTAXONOMY")) {
                {* Remove the outdated liked taxonomy key *}
                localStorage.removeItem(key);
            } else if (key === "cmc_commentary_spotlight_tour_shown:hi") {
                {* Remove the outdated cmc_commentary_spotlight_tour_shown:hi key *}
                localStorage.removeItem(key);
            }

            {* Remove the expired ones by trying to access the value *}
            getLocalStorageWithExpiry(key);
        });
    }

    window.addEventListener("DOMContentLoaded", function() {
        window.addEventListener("scroll", function(e) {
            if (window.requestIdleCallback) {
                window.requestIdleCallback(cleanupLocalStorage);
            } else {
                setTimeout(cleanupLocalStorage, 500);
            }
        }, { passive: true, once: true });
    });
</script>
{/if}
