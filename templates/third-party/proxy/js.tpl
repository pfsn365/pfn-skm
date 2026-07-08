{include file="utils/script.tpl"}
<script>
  var $ = document.querySelector.bind(document);
  var $all = document.querySelectorAll.bind(document);
  var $id = document.getElementById.bind(document);

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length).trim();
      }
    }
    return "";
  }

  function pureJSAjaxGet(url, successCallback, errorCallback, credentials) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.withCredentials = !!credentials;
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

  function pureJSAjaxPostWithData(url, data, successCallBack, error_callback, withCredentials) {
    var xmlhttp = new XMLHttpRequest();
    if (withCredentials === true) xmlhttp.withCredentials = true;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var tokenValueFromCookie = getCookie('{$smarty.const.COOKIE_CSRF_NAME}');
    xmlhttp.setRequestHeader('{COOKIE_CSRF_HEADER}', tokenValueFromCookie);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          if (csrfErrorResponse(xmlhttp)) {
            csrfReLogin();
          } else {
            successCallBack(xmlhttp.responseText);
          }
        } else {
          if (typeof(error_callback) === "undefined") {
            error_callback_default(xmlhttp.status);
          } else {
            error_callback(xmlhttp.statusText, xmlhttp.status);
          }
        }
      }
    };
    xmlhttp.send(data);
  }

  function pureJSAjaxPost(url, data, successCallback, errorCallback, finallyCallback, withCredentials) {
    var xmlhttp = new XMLHttpRequest();
    if (typeof(data) !== "string") {
      data = JSON.stringify(data);
    }
    if (withCredentials === true) xmlhttp.withCredentials = true;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if ((xmlhttp.status == 200 || xmlhttp.status == 202) && typeof(successCallback) === "function") {
          successCallback(xmlhttp.responseText);
        } else {
          if (typeof(errorCallback) === "function") {
            errorCallback(xmlhttp.statusText);
          }
        }
        if (typeof(finallyCallback) === "function") {
          finallyCallback(xmlhttp.responseText);
        }
      }
    };
    xmlhttp.send(data);
  }

  function pureJSAjaxPut(url, data, successCallBack) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.withCredentials = true;
    xmlhttp.open("PUT", url, true);
    if (typeof(data) !== "string") {
      data = JSON.stringify(data);
    }
    xmlhttp.setRequestHeader("Content-type", "application/json");

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          successCallBack(xmlhttp.responseText);
        } else {
          console.log(xmlhttp.statusText, xmlhttp.status);
        }
      }
    };
    xmlhttp.send(data);
  }

  function loadScriptAsync(scriptSrc, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Not a valid callback for async script load');
    }
    var script = document.createElement('script');
    script.onload = callback;
    script.src = scriptSrc;
    document.head.appendChild(script);
  }

  function getCurrentUserID() {
    return getCookie("{$smarty.const.COOKIE_USER_ID}");
  }

  function addClass(ele, cls) {
    if (!ele || !ele.classList || !cls) return;

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

  var trackGAEvent = function() {

  }

  var setLocalStorageData = function(key, value) {
    localStorage.setItem(key, value);
  }

  var getLocalStorageData = function(key) {
    var item = localStorage.getItem(key);
    return item != null ? item : "";
  }

  var removeFromLocalStorage = function(key) {
    localStorage.removeItem(key);
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
    var delegateGAEvent = input.delegateGAEvent;

    return notifyWhenInViewport(element, identifier, function() {
      if (typeof delegateGAEvent == "function") {
        delegateGAEvent(eventName, eventParams);
      }
    });
  }

  function getTimeDiffInDaysHoursMinutes(timeInMilliseconds) {
    var diffDays = Math.floor(timeInMilliseconds / 86400000); // difference in days
    var diffHrs = Math.floor((timeInMilliseconds % 86400000) / 3600000); // difference in hours
    var diffMins = Math.round(((timeInMilliseconds % 86400000) % 3600000) / 60000); // difference in minutes

    var result = [];

    if (diffDays) {
      if (diffDays == 1) {
        result.push(diffDays + " day");
      } else {
        result.push(diffDays + " days");
      }
    }
    if (diffHrs) {
      result.push(diffHrs + "hr");
    }
    if (diffMins) {
      result.push(diffMins + "min");
    }

    {* For `timeInMilliseconds` < 29e3, result list will be empty. We should assign the `seconds` unit in that case *}
    if (!result.length) {
      result.push(Math.round(timeInMilliseconds / 1000) + "sec");
    }

    return result;
  }

  function debounce(func, duration) {
    var timeout;
    return function(...args) {
      var effect = function effect() {
        timeout = null;
        return func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(effect, duration);
    };
  }

  function throttleFn(func, delay) {
    var prev = 0;
    return function() {
      var context = this,
        args = arguments;
      let now = new Date().getTime();
      if (now - prev > delay) {
        prev = now;
        return func.apply(context, args);
      }
    }
  }

  function getShortMonthNames() {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }

  function getShortDayNames() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  function convertTimestampToESTDateTime(timestamp) {
    const date = new Date(timestamp);

    const options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/New_York',
      timeZoneName: 'short'
    };

    return date.toLocaleString('en-US', options);
  }

  function yieldToMain() {
    if ("scheduler" in window && "yield" in window.scheduler) {
      return window.scheduler.yield();
    }
    {* Fall back to yielding with setTimeout. *}
    return new Promise(function(resolve) {
      window.setTimeout(function() {
        resolve();
      }, 0);
    });
  }
</script>

{include file="common/third-party/comscore/index.tpl"}
