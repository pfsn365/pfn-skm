<script>
	(function() {
		function onItemClicked(e) {
			const target = e.target.closest("a.quick-links-item-cta");
			if (!target) return;

			const destinationUrl = target.getAttribute("href");
			if (!destinationUrl) return;

			const destinationLabel = target.textContent.trim();
			if (!destinationLabel) return;

			const identifier = target.dataset["identifier"];
			if (!identifier) return;

			trackGAEvent("QUICK_LINKS_WIDGET_ITEM_CLICK", {
				identifier: identifier,
				destination_url: destinationUrl,
				destination_label: destinationLabel,
			});
		}

		function initEvents(container, index) {
			if (!container) return;

			const identifier = container.dataset["identifier"];
			if (!identifier) return;

			trackImpressionGAEventWhenInViewport({
				element: container,
				identifier: "quick-links-widget-" + index,
				eventName: "QUICK_LINKS_WIDGET_IMPRESSION",
				eventParams: {
					identifier: identifier
				}
			});

			container.querySelectorAll(".quick-links-item-cta").forEach((cta) => {
				cta.addEventListener("click", onItemClicked);
			});
		}

		function init() {
			var containers = $all(".widget--taxonomy-quick-links");

			containers.forEach(initEvents);
		}
		window.addEventListener("DOMContentLoaded", init);
	})();
</script>
