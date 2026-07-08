{include file="desktop/utils/scheduler.tpl"}
{include file="third-party/proxy/pfn/common/rollbar/index.tpl"}
{include file="third-party/proxy/pfn/common/chartbeat-script.tpl"}

<script>
	(function() {
		var utcToLocalTimeCandidates = $all(".convert-utc-to-local");

		function getFormattedDate(dateInstance, format) {
			if (format && typeof Date.prototype.format == "function") {
				return dateInstance.format(format);
			}

			return dateInstance.toLocaleDateString();
		}

		function init() {
			utcToLocalTimeCandidates.forEach(function(dateItem) {
				try {
					var utcDateTime = dateItem.dataset["utcDateTime"];
					var format = dateItem.dataset["format"];

					if (utcDateTime) {
						var localDate = new Date(utcDateTime);

						dateItem.innerText = getFormattedDate(localDate, format);
					}
				} catch (err) {
					console.error(err);
				}
			});
		}

		init();
	})();

	((w, k) => {
		let k4 = new URLSearchParams(w.location.search).get("key4");
		if (k4) {
			w[k] = w[k] || {};
			w[k].tags = w[k].tags || [];
			w[k].category = "nfl tools";
			w[k].key4 = k4;
		}
	})(window, "raptivetarget");
</script>
