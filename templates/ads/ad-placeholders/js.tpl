<script>
	var monitorAdContainers = (() => {
		{* 1. Helper to mark as done *}
		function process(w) {
			if (!w) return false;

			{* Skip if already handled *}
			if (w.classList.contains("loaded")) return false;

			{* Strict Check: Only proceed if the iframe actually exists *}
			if (!w.querySelector("iframe")) return false;

			{* Hide p *}
			const p = w.querySelector(".ad-placeholder");
			if (p) {
				p.classList.add("hidden");
			}

			{* Mark w as loaded *}
			w.classList.add("loaded");

			return true; {* Return true to indicate successful processing *}
		}

		{* 2. The Observer *}
		var oo = new MutationObserver(function(ms) {
			ms.forEach(function(mutation) {
				if (!mutation.addedNodes.length) return;

				const w = mutation.target.closest(".ad-wrapper");

				{* Attempt to process. If successful (iframe found), stop observing this specific w. *}
				if (process(w)) {
					{* unobserve does not exist on MutationObserver prototype. There is no standard way of disconnecting a single mutation *}
					{* oo.unobserve(w); *}
				}
			});
		});

		{* 3. The Main Function *}
		function monitor() {
			const ww = document.querySelectorAll(".ad-wrapper");

			ww.forEach((w) => {
				{* If marked loaded, skip completely *}
				if (w.classList.contains("loaded")) return;

				{* FAST LOAD CHECK: *}
				{* If the iframe is ALREADY there, process immediately and do not observe. *}
				if (process(w)) return;

				{* Otherwise, observe this w waiting for the iframe injection *}
				oo.observe(w, {
					childList: true,
					subtree: true,
				});
			});
		}

		{* 4. Initialization *}
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", monitor);
		} else {
			monitor();
		}

		{* Return the function in case you need to call it manually later *}
		{* (e.g. after infinite scroll loads new wrappers) *}
		return monitor;
	})();
</script>
