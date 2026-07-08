<script>
	(function() {
		var heroContainer = $(".hero-container");

		window.addEventListener("DOMContentLoaded", function() {
			trackImpressionGAEventWhenInViewport({
				element: heroContainer,
				identifier: "page_primary_hero",
				eventName: "HERO_UNIT_IMPRESSION"
			});
		});
	})();
</script>
