{if !$included_global_components_get_user_location}

  {assign var=included_global_components_get_user_location value=TRUE scope="root"}

  <script>
    var USER_GEO_LOCATION_PROMISE = (() => {
      const sp = new URLSearchParams(window.location.search);

      function prepare(state, city) {
        let cc = countryCode;
        if (sp.get("user_geo__country")) {
          cc = String(sp.get("user_geo__country")).toUpperCase();
        }

        return {
          country: cc,
          state: sp.get("user_geo__state") || state,
          city: sp.get("user_geo__city") || city,
        }
      }

      function getGeoDataFromRemote() {
        return fetch("https://user-geo.staticc.workers.dev/")
          .then((res) => res.json())
          .then((geoData) => {
            var city = geoData?.geo?.city || "";
            var state = geoData?.geo?.state || "";

            if (city && state) {
              var expiry = new Date();
              expiry.setDate(expiry.getDate() + 15);
              setCookie("user_city", city, expiry);
              setCookie("user_state", state, expiry);
            }

            return prepare(state, city);
          }).catch(() => {
            return prepare("", "");
          });
      }

      const ENABLE_REMOTE = 0;

      var userCity = getCookie("user_city");
      var userState = getCookie("user_state");

      if (userCity && userState) {
        return Promise.resolve(prepare(userState, userCity));
      }

      if (ENABLE_REMOTE || countryCode == "IN") {
        return getGeoDataFromRemote();
      }

      return Promise.resolve(prepare("", ""));
    })();
  </script>
{/if}
