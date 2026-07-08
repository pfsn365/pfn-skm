<script>
    var $ = document.querySelector.bind(document);
    var $all = document.querySelectorAll.bind(document);
    window.dataLayer = window.dataLayer || [];

    function pureJSAjaxGet(url, successCallback, errorCallback, credentials) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.withCredentials = credentials;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                if (xmlHttp.status == 200) {
                    successCallback(xmlHttp.responseText);
                } else {
                    console.log('Error: ' + xmlHttp);
                    errorCallback(xmlHttp.statusText, xmlHttp.status);
                }
            }
        };
        xmlHttp.open("GET", url);
        xmlHttp.send(null);
    }

    function pureJSAjaxGetWithPromise(url) {
        return new Promise(function(resolve, reject) {
            pureJSAjaxGet(url, function(res) {
                resolve(res);
            }, function(err) {
                reject(err);
            }, true);
        })
    }

    function addClass(ele, cls) {
        if (!ele || !ele.classList) return;

        return ele.classList.add(cls);
    }

    function removeClass(ele, cls) {
        if (!ele || !ele.classList) return;

        return ele.classList.remove(cls);
    }

    function hasClass(ele, cls) {
        if (!ele || !ele.classList) return false;

        return ele.classList.contains(cls);
    }

    var trackGAEvent = prepareGAEventTracker();

    function prepareGAEventTracker() {
        return function(eventName, eventParams) {
            eventParams = eventParams || {};

            var params = Object.assign({}, eventParams, {
                send_to: "{$smarty.const.GA4_ID}",
                sk_version: "{$smarty.const.RELEASE}",
            });

            console.info("GTAG EVENT --> ", eventName, params);

            gtag("event", eventName, params);
        }
    }

    function gtag() {
        dataLayer.push(arguments);
    }

    var trackNonInteractiveGAEvent = function(eventName, eventParams) {
        return trackGAEvent(eventName, Object.assign({ "non-interaction": true }, eventParams));
    }

    var notifyWhenInViewport = (function() {
        var trackedElement = {};
        var registeredCallbacks = {};
        var firedTimers = {};

        var SECONDS_TO_REMAIN_IN_VP = 1;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.target) return;

                var identifier = entry.target.dataset["impId"];
                if (!identifier) return;

                if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
                    var timer = firedTimers[identifier];
                    if (timer) {
                        clearTimeout(timer);
                        trackedElement[identifier] = false;
                    }

                    return;
                }

                if (trackedElement[identifier]) return;
                trackedElement[identifier] = true;

                var callback = registeredCallbacks[identifier];
                if (typeof callback == "function") {
                    firedTimers[identifier] = setTimeout(function() {
                        observer.unobserve(entry.target);
                        callback(entry.target);
                    }, SECONDS_TO_REMAIN_IN_VP * 1000);
                }
            });
        }, {
            threshold: 0.5
        });

        return function(element, identifier, callback) {
            if (!element) return;
            if (!identifier) return;
            if (!callback) return;
            if (trackedElement[identifier]) return;

            element.setAttribute("data-imp-id", identifier);
            registeredCallbacks[identifier] = callback;

            observer.observe(element);
        }
    })();

    var trackImpressionGAEventWhenInViewport = function(input) {
        var element = input.element;
        var identifier = input.identifier;
        var eventName = input.eventName;
        var eventParams = input.eventParams;
        var callback = input.callback;

        return notifyWhenInViewport(element, identifier, function() {
            trackNonInteractiveGAEvent(eventName, eventParams);

            if (typeof callback == "function") {
                callback(element);
            }
        });
    }
</script>

