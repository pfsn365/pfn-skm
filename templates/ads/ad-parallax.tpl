{if empty($containerClass)}
  {assign var="containerClass" value=""}
{/if}
<div id="mob2-container-parent-parent">
<div id = "mob2-container-parent">
<div class="mobile-ad-negative-space {$containerClass}" id="mob2-container" style="min-height:{if $ad_units.$slotId.minHeight}{$ad_units.$slotId.minHeight}{else}{$min_height}px{/if};padding-top:10px;margin-bottom: 20px; transition: max-height 0.5s; max-height: 50px;">
    <!-- /{$smarty.const.AD_CODE}/{$slotId} -->
		{generateAdPlaceholderMarkup($variant)}
    <div id='{$ad_units.$slotId.div}' class="mobile-ad-holder-parallax"  {if !empty($refreshConfig)} data-refresh-config='{$refreshConfig}'{/if}>
    <script>
		if(typeof displayAdSlot !== 'undefined') {
        	displayAdSlot('{$ad_units.$slotId.div}');
		}
    </script>
    </div>
</div>
</div>
</div>
<style>
	.frame-holder{
		position: fixed;
		top: 50px;
		height: 100%;
		width: 100%;
		text-align: center;
	}
	.ad-window{
	    position: absolute;
	    width: 100%;
	    height: 100%;
	    left: 0px;
	    top: 0px;
	    clip: rect(auto,auto,auto,auto);
	    will-change: position;
	}
	.ad-window-holder{
		position: relative;
		height:260px;
		width: 100%;
		overflow: hidden;
	}
</style>
<script type="text/javascript">
	var iframeElement = false;
	var adIframeProcessed = false;
	var brandColor = '#fff';
	var keedaHeight = 600;

	window.addEventListener('message',function(e) {
		if(adIframeProcessed) {
			return;
		}
		var key = e.message ? 'message' : 'data';
		var data = e[key];
		try {
			data = JSON.parse(data)
		} catch (e) {}
		if(data.sk && data.keedaWidth) {
			if(data.brandColor) {
				brandColor = data.brandColor;
			}
			if (data.keedaHeight) {
				keedaHeight = data.keedaHeight
			}
			console.log("DATA", data);
			iframeElement = iframeElement || document.querySelector('#{$ad_units.$slotId.div}').querySelector("iframe");
			if(!iframeElement) {
				console.log("IRRELEVANT MESSAGE");
				return;
			}
			console.log("GOT MESSAGE");
			iframeElement.style.height = keedaHeight + "px";
			iframeElement.style.width = data.keedaWidth + "px";
			adIframeProcessed = true;
			addClass($("#mob2-container"), "frame-holder")
			addClass($("#mob2-container-parent"), "ad-window")
			addClass($("#mob2-container-parent-parent"), "ad-window-holder")
			var adContainer = $('#div-gpt-ad-1486709274862-1');
			adContainer.style.background = brandColor;
			$('#mob2-container-parent-parent').style.background = brandColor;
			if (data && data.adContainerWidth && adContainer) {
				adContainer.style.width = data.adContainerWidth + "px";
				adContainer.children[0].style.width = data.adContainerWidth + "px";
			}
			{* transformAdIframe(iframeElement); *}
			//run function//
			window.addEventListener("scroll", function() {
				var oldHeight = iframeElement.style.height.replace("px", "") * 1;
				var newHeight = keedaHeight + "px";
				if(oldHeight == keedaHeight) {
					newHeight = (keedaHeight + 1) + "px" ;
				}
				iframeElement.style.height = newHeight;
			});
		}
	},false);

	function createNewDivParent(element, newParentClassname) {
		var oldParent = element.parentNode;
		var newDivParent = document.createElement('div');
		newDivParent.className = newParentClassname;
		oldParent.replaceChild(newDivParent, element);
		// set element as child of wrapper
		newDivParent.appendChild(element);
	}

	function transformAdIframe(iframeElement) {
		createNewDivParent(iframeElement, "frame-holder");
		setTimeout(function() {
			createNewDivParent(iframeElement.parentNode, "ad-window");
			setTimeout(function() {
				createNewDivParent(iframeElement.parentNode.parentNode, "ad-window-holder")
			})
		}, 0);
	}
</script>