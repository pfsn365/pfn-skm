{if !$included_global_components_page_h1__js}

	{assign var=included_global_components_page_h1__js value=TRUE scope="global"}

	<script>
		(function() {
			function onAnchorCTAClicked(e) {
				var target = e.target.closest("a.divider-heading-cta");
				var container = target.closest(".page-info-divider");

				var heading = container && container.querySelector(".divider-heading");

				var label = heading && heading.innerText;
				var destinationUrl = target.getAttribute("href");

				trackGAEvent("PAGE_H1_CTA_CLICK", {
					destination_url: destinationUrl,
					label: label,
				});
			}

			function init() {
				$all(".page-info-divider").forEach(function(container) {
					container.querySelectorAll("a.divider-heading-cta").forEach(function(anchorCTA) {
						anchorCTA.addEventListener("click", onAnchorCTAClicked);
					});
				})
			}

			window.addEventListener("DOMContentLoaded", function() {
				init();
			})
		})();
	</script>

{/if}
