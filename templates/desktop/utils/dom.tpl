{if !$included_global_utils__dom}

  {assign var=included_global_utils__dom value=TRUE scope="root"}

<script type="text/javascript">

function hasClass(domNode, className) {
  if (!className) return;

  if(!domNode || !domNode.classList || typeof(domNode.classList.contains) !== "function") {
    return;
  }

  return domNode.classList.contains(className);
}

function addClass(domNode, className) {
  if (!className) return;

  if(!domNode || !domNode.classList || typeof(domNode.classList.add) !== "function") {
    return;
  }

  return domNode.classList.add(className);
}

function removeClass(domNode, className) {
  if (!className) return;

  if(!domNode || !domNode.classList || typeof(domNode.classList.remove) !== "function") {
    return;
  }

  return domNode.classList.remove(className);
}

// This function detects whether localStorage is both supported and available. Params can be `localStorage` or `sessionStorage`.
function storageAvailable(type) {
    try {
        var storage = window[type],
        x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function stringToHTML(str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'text/html');
  return doc.body;
}

var MEDIA_TAGS = ["figure", "embed", "video", "iframe"]

function isMediaElement(element) {
  if (element) {
    {* Check if the element is of SK Embed type *}
    if (element.classList && element.classList.contains && element.classList.contains("sportskeeda-embed")) {
      return true;
    }

    {* Check if the element is one of the media tag *}
    if (element.tagName) {
      var tagName = String(element.tagName).toLowerCase();
      return MEDIA_TAGS.indexOf(tagName) > -1;
    }
  }

  return false;
}

function countMetaChanges(elements) {
  var charactersChanged = 0;
  var wordsChanged = 0;
  var mediaChanged = 0;

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    if (isMediaElement(element)) {
      mediaChanged += 1;
      continue;
    }

    // use inner text to ignore html attributes
    var content = element.innerText || "";

    {* Replace zero width characters with blank string otherwise it will be treated as one word *}
    content = content.replace(/[\u200B-\u200D\uFEFF]/g, "");

    if (content.length < 1) {
      continue;
    }

    charactersChanged += content.length;
    wordsChanged += content.split(" ").filter(Boolean).length;
  }

  var metaChanges = {
    charactersChanged : charactersChanged,
    wordsChanged : wordsChanged,
    mediaChanged : mediaChanged
  };

  return metaChanges;
}

function whenPageIsVisibleOnce(callback) {
	let triggered = false;

	function fireThis() {
		if (document.visibilityState != "visible") return;

		if (triggered) return;
		triggered = true;

		document.removeEventListener("visibilitychange", fireThis);

		callback();
	}

	if (document.visibilityState == "visible") {
		fireThis();
	} else {
		document.addEventListener("visibilitychange", fireThis, {
			passive: true,
		});
	}
}

</script>

{/if}
