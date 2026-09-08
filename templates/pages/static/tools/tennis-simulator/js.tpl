<script>
  const isDesktop = "{$is_desktop}"; 
  const sendPageViewEvent = "{$send_page_view_event}";
  const bundleLocation = "{$js_bundle_location}";
  const STATIC_URL = "{$smarty.const.STATIC_URL}";
  const FLAG_BASE_URL = "{$flag_base_url}";
  const DATA_SOURCE_PATH = "{$data_source_path}";
  const CANONICAL_URL = "{$canonical_url}"; 

  var trackGAEventForPage = function(eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, {
      ...eventParams,
      "tool": "tennis_simulator",
      "device": isDesktop ? "Desktop" : "Mobile",
    });
  };

  asyncScriptLoader({
    src: bundleLocation,
    loadWithAsync: true,
    attributes: [{
      key: "id",
      value: "TENNIS_SIMULATOR_SCRIPT_LOCATION",
    }, ],
  })
</script>
