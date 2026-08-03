<script>
  var trackGAEventForPage = function(eventName, eventParams) {
    eventParams = eventParams || {};
    trackGAEvent(eventName, {
      ...eventParams,
      "tool": "fifa_world_cup_simulator"
    });
  };

  const bundleLocation = "{$js_bundle_location}";
  const STATIC_URL = "{$smarty.const.STATIC_URL}";
  const DATA_SOURCE_PATH = "{$data_source_path}";

  asyncScriptLoader({
    src: bundleLocation,
    loadWithAsync: true,
    attributes: [{
      key: "id",
      value: "FOOTBALL_WORLD_CUP_SIMULATOR_SCRIPT_LOCATION",
    }, ],
  })
</script>
