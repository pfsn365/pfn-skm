{if !$included_global_utils__network}

    {assign var=included_global_utils__network value=TRUE scope="root"}

    // This function checks for failed CSRF response from server and returns boolean.
    function csrfErrorResponse(xmlHttpInstance) {
        var contentType = String(xmlHttpInstance.getResponseHeader("Content-Type")).toLowerCase();

        if (contentType.indexOf("json") === -1) {
            return false;
        }

        try {
            responseText = JSON.parse(xmlHttpInstance.responseText);
        } catch (error) {
            console.log(error);
        }
        if(responseText['csrf'] === false) {
            return true;
        } else {
            return false;
        }
    }

    // This function handles the re-login when valid session is not found
    function handleInvalidSession(xmlHttpInstance) {
        var contentType = String(xmlHttpInstance.getResponseHeader("Content-Type")).toLowerCase();

        if (contentType.indexOf("json") === -1) {
            return false;
        }
        
        var responseText = {};
        try {
            responseText = JSON.parse(xmlHttpInstance.responseText);
        } catch (error) {
            console.log(error);
        }
        if(responseText['description'] === "You are not logged in") {
            return true;
        } else {
            return false;
        }
    }

    function pureJSAjaxGet(url, successCallBack, error_callback, withCredentials) {
        pureJSAjaxGetWithCredentialsFlag(url, successCallBack, error_callback, withCredentials);
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

    function pureJSAjaxGetWithPromiseAndCredentialsFlag(url, withCredentials) {
        return new Promise(function(resolve, reject) {
            pureJSAjaxGet(url, function(res) {
                resolve(res);
            }, function(err) {
                reject(err);
            }, withCredentials);
        })
    }

    function pureJSAjaxGetWithCredentialsFlag(url, successCallBack, error_callback, credentials) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = credentials;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    successCallBack(xmlhttp.responseText);
                } else {
                    console.log('Error: ' + xmlhttp);
                    if(typeof(error_callback) === "undefined") {
                        error_callback_default(xmlhttp.status);
                    } else {
                        error_callback(xmlhttp.statusText, xmlhttp.status);
                    }
                }
            }
        };
        xmlhttp.open("GET", url);
        xmlhttp.send(null);
    }

    function pureJSAjaxPost(url, data, successCallback, errorCallback, finallyCallback, withCredentials) {
        var xmlhttp = new XMLHttpRequest();
        if(typeof(data) !== "string") {
            data = JSON.stringify(data);
        }
        if (withCredentials === true) xmlhttp.withCredentials = true;
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");

        // Adding CSRF Header
        var tokenValueFromCookie = getCookie('{$smarty.const.COOKIE_CSRF_NAME}');
        xmlhttp.setRequestHeader('{COOKIE_CSRF_HEADER}', tokenValueFromCookie);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if ((xmlhttp.status == 200 || xmlhttp.status == 202) && typeof(successCallback) === "function") {
                    // If CSRF Error is true, ask user for re-login.
                    if(csrfErrorResponse(xmlhttp)){
                        csrfReLogin();
                    } else if(handleInvalidSession(xmlhttp)) {
                        showLoginModal();
                    } else {
                        successCallback(xmlhttp.responseText);
                    }
                } else {
                    if(typeof(errorCallback) === "function") {
                        errorCallback(xmlhttp.statusText);
                    }
                }
                if(typeof(finallyCallback) === "function") {
                    finallyCallback(xmlhttp.responseText);
                }
            }
        };
        xmlhttp.send(data);
    }

    function pureJSAjaxPostWithData(url, data, successCallBack, error_callback, withCredentials) {
        var xmlhttp = new XMLHttpRequest();
        if (withCredentials === true) xmlhttp.withCredentials = true;
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        var tokenValueFromCookie = getCookie('{$smarty.const.COOKIE_CSRF_NAME}');
        xmlhttp.setRequestHeader('{COOKIE_CSRF_HEADER}', tokenValueFromCookie);
        
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    if(csrfErrorResponse(xmlhttp)){
                        csrfReLogin();
                    } else {
                        successCallBack(xmlhttp.responseText);
                    }
                } else {
                    if(typeof(error_callback) === "undefined") {
                        error_callback_default(xmlhttp.status);
                    } else {
                        error_callback(xmlhttp.statusText, xmlhttp.status);
                    }
                }
            }
        };
        xmlhttp.send(data);
    }

    function pureJSAjaxDelete(url, successCallBack, error_callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.withCredentials = true;
            xmlhttp.open("DELETE", url);
            
            var tokenValueFromCookie = getCookie('{$smarty.const.COOKIE_CSRF_NAME}');
            xmlhttp.setRequestHeader('{COOKIE_CSRF_HEADER}', tokenValueFromCookie);

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        if(csrfErrorResponse(xmlhttp)){
                            csrfReLogin();
                        } else {
                            successCallBack(xmlhttp.responseText);
                        }
                    } else {
                        if(typeof(error_callback) === "undefined") {
                            error_callback_default(xmlhttp.status);
                        } else {
                            error_callback(xmlhttp.statusText, xmlhttp.status);
                        }
                    }
                }
            };
            xmlhttp.send(null);
        }

    function pureJSAjaxPut(url, data, successCallBack, error_callback, finally_callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.open("PUT", url, true);
        if(typeof(data) !== "string") {
            data = JSON.stringify(data);
        }
        xmlhttp.setRequestHeader("Content-type", "application/json");

        var tokenValueFromCookie = getCookie('{$smarty.const.COOKIE_CSRF_NAME}');
        xmlhttp.setRequestHeader('{COOKIE_CSRF_HEADER}', tokenValueFromCookie);
        
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    if(csrfErrorResponse(xmlhttp)){
                        csrfReLogin();
                    } else {
                        successCallBack(xmlhttp.responseText);
                    }
                } else {
                    if(typeof(error_callback) === "undefined") {
                        error_callback_default(xmlhttp.status);
                    } else {
                        error_callback(xmlhttp.statusText, xmlhttp.status);
                    }
                }
                if(typeof(finally_callback) === "function") {
                    finally_callback();
                }
            }
        };
        xmlhttp.send(data);
    }

    function pureJSAjaxPatch(url, data, successCallBack, errorCallback, finallyCallback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.open("PATCH", url, true);
        if(typeof(data) !== "string") {
            data = JSON.stringify(data);
        }
        xmlhttp.setRequestHeader("Content-type", "application/json");

        var tokenValueFromCookie = getCookie('{$smarty.const.COOKIE_CSRF_NAME}');
        xmlhttp.setRequestHeader('{COOKIE_CSRF_HEADER}', tokenValueFromCookie);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    if(csrfErrorResponse(xmlhttp)){
                        csrfReLogin();
                    } else {
                        successCallBack(xmlhttp.responseText);
                    }
                } else {
                    if(typeof(errorCallback) === "undefined") {
                        error_callback_default(xmlhttp.status);
                    } else {
                        errorCallback(xmlhttp.statusText, xmlhttp.status);
                    }
                }
                if(typeof(errorCallbacks) === "function") {
                    finallyCallback();
                }
            }
        };
        xmlhttp.send(data);
    }

    function error_callback_default(statusText) {
        if(statusText !== 0) {
            var e = new Error('AjaxGetFailure');
            console.log(e.stack, "Status code: " + statusText);
            setTimeout(function(){
                window.onerror(e, window.location.origin + window.location.pathname);
            },100);
        } else {
            console.log("Connection lost");
        }
    }

    function pureJSAjaxPostFileContent(url, data, successCallBack, error_callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.open("POST", url, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    successCallBack(xmlhttp.responseText);
                } else {
                    if(typeof(error_callback) === "undefined") {
                        error_callback_default(xmlhttp.status);
                    } else {
                        error_callback(xmlhttp.statusText, xmlhttp.status);
                    }
                }
            }
        };
        xmlhttp.send(data);
    }
{/if}
