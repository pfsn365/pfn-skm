{if !$included_third_party_libs__comscore_js}

	{assign var=included_third_party_libs__comscore_js value=TRUE scope="root"}

	{include file="desktop/utils/dom.tpl"}

	{literal}
		<!-- Begin comScore Tag -->
		<script>
			var _comscore = _comscore || [];
			_comscore.push({ c1: "2", c2: "13438550", options: { enableFirstPartyCookie: "false" } });
			(() => {
				whenPageIsVisibleOnce(() => {
					var s = document.createElement("script"),
						el = document.getElementsByTagName("script")[0];
					s.async = true;
					s.src = "https://sb.scorecardresearch.com/cs/13438550/beacon.js";
					el.parentNode.insertBefore(s, el);
				});
			})();
		</script>
		<noscript>
			<img src="https://sb.scorecardresearch.com/p?c1=2&amp;c2=13438550&amp;cv=3.9.1&amp;cj=1">
		</noscript>
		<!-- End comScore Tag -->
	{/literal}
{/if}
