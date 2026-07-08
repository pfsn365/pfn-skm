{if !$included_global_helpers__script}

	{assign var=included_global_helpers__script value=TRUE scope="root"}

	<script>
		var scriptsLoadedMap = {};

		function asyncScriptLoader(input) {
			var src = input.src;
			var attachTo = input.attachTo;
			var loadWithAsync = input.loadWithAsync;
			var loadWithDefer = input.loadWithDefer;
			var attributes = input.attributes || {};
			var onUserInteraction = input.onUserInteraction || false;
			var isStyleSheet = input.isStyleSheet || false;
			var retryCount = input.retryCount || 0;
			var retryDelay = input.retryDelay || 1000;

			if ("id" in attributes) {
				if (!!scriptsLoadedMap[attributes.id]) {
					return Promise.resolve();
				}

				scriptsLoadedMap[attributes.id] = true;
			}

			return new Promise(function(resolve, reject) {
				var script = getAsyncScriptObject();

				function loadScript() {
					if (attachTo) {
						attachTo.appendChild(script);
					} else {
						document.head.appendChild(script);
					}
				}

				var scriptLoaded = false;

				function loadScriptOnInteraction() {
					if (scriptLoaded) return;
					scriptLoaded = true;

					{* Strategy to avoid main thread blocking with a timeout of 2s. To avoid high INP *}
					{* ref: https://web.dev/articles/optimize-long-tasks#manually_defer_code_execution *}
					if (typeof requestIdleCallback === "function") {
						requestIdleCallback(loadScript, {
							timeout: 2000,
						});
					} else {
						loadScript();
					}

					document.removeEventListener("scroll", loadScriptOnInteraction);
					document.removeEventListener("mousemove", loadScriptOnInteraction);
					document.removeEventListener("touchmove", loadScriptOnInteraction);
				}

				function getAsyncScriptObject() {
					var asyncScript = {}

					if (isStyleSheet) {
						asyncScript = document.createElement("link");
						asyncScript.setAttribute("rel", "stylesheet");
						asyncScript.href = src;
					} else {
						asyncScript = document.createElement("script");
						asyncScript.src = src;
					}

					if (loadWithAsync) {
						asyncScript.setAttribute("async", true);
					}

					if (loadWithDefer) {
						asyncScript.setAttribute("defer", true);
					}

					if (attributes && attributes.length > 0) {
						attributes.forEach(function(attribute) {
							asyncScript.setAttribute(attribute.key, attribute.value);
						});
					}

					asyncScript.onload = resolve;
					asyncScript.onerror = handleAsyncScriptLoadError;

					return asyncScript;
				}

				function handleAsyncScriptLoadError() {
					if (retryCount > 0) {
						setTimeout(function() {
							script = getAsyncScriptObject();
							loadScript();
							retryCount--;
						}, retryDelay);
					} else {
						reject("Script failed to load after multiple attempts.");
					}
				}

				if (onUserInteraction) {
					document.addEventListener("scroll", loadScriptOnInteraction, { once: true, passive: true });
					document.addEventListener("mousemove", loadScriptOnInteraction, { once: true, passive: true });
					document.addEventListener("touchmove", loadScriptOnInteraction, { once: true, passive: true });
				} else {
					{* Strategy to avoid main thread blocking with a timeout of 2s. To avoid high INP *}
					{* ref: https://web.dev/articles/optimize-long-tasks#manually_defer_code_execution *}
					if (typeof requestIdleCallback === "function") {
						requestIdleCallback(loadScript, {
							timeout: 2000,
						});
					} else {
						loadScript();
					}
				}
			});
		}

		function loadCSSFiles(url, cssId) {
			if (!!scriptsLoadedMap[cssId]) {
				return;
			}
			scriptsLoadedMap[cssId] = true;

			var head = document.getElementsByTagName("head")[0];
			var link = document.createElement("link");
			link.id = cssId;
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url;
			link.media = "all";
			head.appendChild(link);
		}

		function createStyleTagWithContent(cssText, cssId) {
			if (!!scriptsLoadedMap[cssId]) {
				return;
			}
			scriptsLoadedMap[cssId] = true;
			var style = document.createElement("style");
			style.type = "text/css";
			if (style.styleSheet) {
				{* This is required for IE8 and below. *}
				style.styleSheet.cssText = cssText;
			} else {
				style.appendChild(document.createTextNode(cssText));
			}
			document.head.appendChild(style);
		}

		function deepCopy(o) {
			var out, v, key;
			out = Array.isArray(o) ? [] : {};
			for (key in o) {
				v = o[key];
				out[key] = (typeof v === "object" && v !== null) ? deepCopy(v) : v;
			}
			return out;
		}
	</script>

{/if}
