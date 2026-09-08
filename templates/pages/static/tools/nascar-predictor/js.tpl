<script>
  const isDesktop = "{$is_desktop}";
  const sendPageViewEvent = "{$send_page_view_event}";
  const bundleLocation = "{$js_bundle_location}";
  const STATIC_URL = "{$smarty.const.STATIC_URL}";
  const DATA_SOURCE_PATH = "{$data_source_path}";
  const CANONICAL_URL = "{$canonical_url}";
  const downloadImageURL = "{$canonical_url}";

  var trackGAEventForPage = function(eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, {
      ...eventParams,
      "tool": "nascar_predictor",
      "device": isDesktop ? "Desktop" : "Mobile",
    });
  };

  asyncScriptLoader({
    src: bundleLocation,
    loadWithAsync: true,
    attributes: [{
      key: "id",
      value: "NASCAR_PREDICTOR_SCRIPT_LOCATION",
    }, ],
  })
</script>
