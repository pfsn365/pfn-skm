<script>
  function showPicksByConferenceWidget(data, parentSelector) {
    const parentContainer = $(parentSelector);
    if (parentContainer) {
      Object.keys(data).forEach(conference => {
        let selector = ".picks-by-conference-container ." + conference + " .picks-count";
        if (conference === "Big Ten") {
          selector = ".picks-by-conference-container .bigTen .picks-count";
        }
        if (conference === "Big 12") {
          selector = ".picks-by-conference-container .bigTwelve .picks-count";
        }
        if (conference === "Pac-12") {
          selector = ".picks-by-conference-container .pacTwelve .picks-count";
        }
        if (conference === "Sun Belt") {
          selector = ".picks-by-conference-container .sunbelt .picks-count";
        }

        const target = parentContainer.querySelector(selector);
        if (target) {
          target.innerHTML = data[conference];
        }
      });
    }
  }
</script>
