<script defer src="https://www.googletagmanager.com/gtag/js?id=G-94BYBHMYCW"></script>
<script>
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  // gtag("config", "UA-131524109-1", { "send_page_view": false });
  gtag("config", "G-94BYBHMYCW", { "send_page_view": false });


  function trackGAEvent(eventName, eventParams) {
    eventParams = eventParams || {};
    var source = window.location.pathname + window.location.search;
    var params = Object.assign({}, {
      source_url: source,
      source_title: document.title,
      "send_to": "G-94BYBHMYCW",
    }, eventParams);
    // var ga3Params = Object.assign({}, params, {
    //   source_url: source,
    //   source_title: document.title,
    //   "send_to": "UA-131524109-1",
    // });
    console.info("GTAG EVENT --> ", eventName, params);
    if (typeof runAsBackgroundTask === "function") {
      runAsBackgroundTask(function() {
        gtag("event", eventName, params);
      });
    } else {
      setTimeout(function() {
        gtag("event", eventName, params);
      });
    }
    // gtag("event", eventName, ga3Params);
  }
</script>
