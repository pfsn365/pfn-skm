{if !$included_date_tpl}
    {assign var=included_date_tpl value=TRUE scope="root"}
    <script type="text/javascript">
    function getMonthNames() {
        return [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
    }
    
    function getShortMonthNames() {
        return [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
    }
    
    function timeTo12HourFormat(time) {
        var timeSplit = time.split(":");
        var amOrPm = "AM";
        var hour = timeSplit[0];
        var minute = timeSplit[1];
        if (hour >= 12) {
          amOrPm = "PM";
        }
        if (hour > 12) {
          hour = hour - 12;
        }
        return hour + ":" + minute + " " + amOrPm;
    }
    
    function getShortDayNames() {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }
    
    function getFullDayNames() {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }
    
    function getFormattedDate(isoDatetime) {
        var currentDate = new Date();
        var matchDate = new Date(isoDatetime);
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var monthNames = getShortMonthNames();
        var dayNames = getShortDayNames();
    
        var currentDateString = currentDate.getDate() + '-' + currentDate.getMonth() + '-' + currentDate.getFullYear();
        var matchDateString = matchDate.getDate() + '-' + matchDate.getMonth() + '-' + matchDate.getFullYear();
        var tomorrowDateString = tomorrowDate.getDate() + '-' + tomorrowDate.getMonth() + '-' + tomorrowDate.getFullYear();
        var localTime = matchDate.toLocaleTimeString().replace(/\:\d\d\s/, " ");
        var timeZone = matchDate.toString().match(/(\(.*\))/).pop();
    
        return dayNames[matchDate.getDay()] + ", " + matchDate.getDate() + " " + monthNames[matchDate.getMonth()] + " " + matchDate.getFullYear() + ", " + localTime + " " +  timeZone;
    }
    
    function timeSince(isoDateString) {
        var date = new Date(isoDateString);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 86400);
        if(interval > 6) {
            return date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear();
        }
        if (interval > 1) {
            return interval + " days ago";
        }
        if(interval === 1) {
            return "1 day ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval === 1) {
            return interval + " hr ago";
        }
        if (interval > 1) {
            return interval + " hrs ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval === 1) {
            return "1 min ago";
        }
        if (interval > 1) {
            return interval + " mins ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }
    
    function updateTimeStringsToFormatTimeSince() {
        var isPendingContent = window.location.hash === '#pending';
        var timeElements = $all('.keeda-time-since');
        for (var i = 0; i < timeElements.length; i++) {
            var isoDateString = timeElements[i].getAttribute('data-iso-string');
            var timeSinceVal = timeSince(isoDateString);
            if(timeElements[i].classList.contains("author-post-time") && !timeSinceVal.includes("ago")) {
                timeElements[i].innerHTML = "";
            } else if (isPendingContent) {
                timeElements[i].innerHTML = (timeSinceVal + "<br>(" + isoDateString.split("T")[0] + ")");
            } else {
                timeElements[i].innerHTML = timeSinceVal;
            }
        }
    }
    
    function getDateObjectInIST() {
        var currentTime = new Date();
        var currentOffset = currentTime.getTimezoneOffset();
        var ISTOffset = 330;
        {* IST offset UTC +5:30 *}
        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
        return ISTTime;
    }
    
    function getDateInYYYYMMDD(date) {
        var d = !date ? getDateObjectInIST() : date;
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return year + "-" + month + "-" + day;
    }
    
    function getTimezoneOffsetString(theTime) {
        var timezoneMap = {
                "420": "PDT",
                "360": "MDT",
                "300": "CDT",
                "240": "EDT",
                "180": "GMT-3",
                "0": "UTC",
                "-60": "BST",
                "-120": "CEST",
                "-180": "MSK",
                "-240": "GMT+4",
                "-330": "IST",
                "-480": "CST",
                "-540": "JST",
                "-600": "AEST",
                "-720": "NZST"
        };
        return timezoneMap[theTime.getTimezoneOffset().toString()] || theTime.getTimezoneOffset().toString();
    }
    
    function getFriendlyModifiedTime(isoDateString) {
        isoDateString = new Date(isoDateString);
        var timeOffset = getTimezoneOffsetString(isoDateString);
        var friendly_time = isoDateString.toLocaleString('en-US', {
                            day: 'numeric', 
                            year: 'numeric', 
                            month: 'long',
                            hour: 'numeric', 
                            minute: 'numeric', 
                        });
        return friendly_time + ' ' + timeOffset;
    }
    
    function getAMPMFormattedTime(isoDateString) {
        var hours = isoDateString.getHours();
        var minutes = isoDateString.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    
    function getTimeDiffInDaysHoursMinutes(timeInMilliseconds) {
        {* difference in days *}
        var diffDays = Math.floor(timeInMilliseconds / 86400000);
        {* difference in hours *}
        var diffHrs = Math.floor((timeInMilliseconds % 86400000) / 3600000);
        {* difference in minutes *}
        var diffMins = Math.round(((timeInMilliseconds % 86400000) % 3600000) / 60000);
    
        var result = [];
    
        if (diffDays) {
            result.push(diffDays + " day(s)");
        }
        if (diffHrs) {
            result.push(diffHrs + " hour(s)");
        }
        if (diffMins) {
            result.push(diffMins + " minute(s)");
        }
    
        {* For `timeInMilliseconds` < 29e3, result list will be empty. We should assign the `seconds` unit in that case *}
        if (!result.length) {
            result.push(Math.round(timeInMilliseconds / 1000) + " second(s)");
        }
    
        return result;
    }
    
    function getTimeAndDate(isoDateString) {
        var isoDateString = new Date(isoDateString);
        var monthNames = getShortMonthNames();
        var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
        var hours = isoDateString.getHours();
        if (hours <= 9) {
            hours = "0" + hours;
        }
        var minutes = isoDateString.getMinutes();
        if (minutes <= 9) {
            minutes = "0" + minutes;
        }
    
        return hours + ":" + minutes + ", " + isoDateString.getDate() + " " + monthNames[isoDateString.getMonth()] + " " + isoDateString.getFullYear();
    }
    
    function getTimeAndDateFormatted(isoDateString) {
        var isoDateString = new Date(isoDateString);
        var monthNames = getShortMonthNames();
        var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
        var hours = isoDateString.getHours();
        if (hours <= 9) {
            hours = "0" + hours;
        }
        var minutes = isoDateString.getMinutes();
        if (minutes <= 9) {
            minutes = "0" + minutes;
        }
    
        return isoDateString.getDate() + " " + monthNames[isoDateString.getMonth()] + ", " + isoDateString.getFullYear() + " " + hours + ":" + minutes ;
    }
    
    function getFriendlyModifiedTimeWithoutTime(isoDateString) {
        isoDateString = new Date(isoDateString);
        var friendly_time = isoDateString.toLocaleString('en-US', {
                            day: 'numeric', 
                            year: 'numeric', 
                            month: 'short', 
                        });
        return friendly_time;
    }

    function convertToETTimezone(date) {
        return date.toLocaleString("en-US", {
            timeZone: "America/New_York"
        });
    }

    Date.prototype.changeTimezone = function (tz) {
        var tzDate = new Date(this.toLocaleString("en-US", {
            timeZone: tz
        }));

        const timeDiff = this.getTime() - tzDate.getTime();

        return new Date(this.getTime() - timeDiff);
    }

    </script>
    {/if}
    
    <script>

    (function() {
        var dateFormat = function () {
            {literal}
            var	token = /d{1,4}|D{3,4}|m{1,4}|M{3,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                pad = function (val, len) {
                    val = String(val);
                    len = len || 2;
                    while (val.length < len) val = "0" + val;
                    return val;
                };
            {/literal}
    
            {* Regexes and supporting functions are cached through closure *}
            return function (date, mask, utc) {
                var dF = dateFormat;
    
                {* You can't provide utc if you skip other args (use the "UTC:" mask prefix) *}
                if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }
    
                {* Passing date through Date applies Date.parse, if necessary *}
                date = date ? new Date(date) : new Date;
                if (isNaN(date)) throw SyntaxError("invalid date");
    
                mask = String(dF.masks[mask] || mask || dF.masks["default"]);
    
                {* Allow setting the utc argument via the mask *}
                if (mask.slice(0, 4) == "UTC:") {
                    mask = mask.slice(4);
                    utc = true;
                }
    
                var	_ = utc ? "getUTC" : "get",
                    d = date[_ + "Date"](),
                    D = date[_ + "Day"](),
                    m = date[_ + "Month"](),
                    y = date[_ + "FullYear"](),
                    H = date[_ + "Hours"](),
                    M = date[_ + "Minutes"](),
                    s = date[_ + "Seconds"](),
                    L = date[_ + "Milliseconds"](),
                    o = utc ? 0 : date.getTimezoneOffset(),
                    flags = {
                        d:    d,
                        dd:   pad(d),
                        ddd:  dF.i18n.dayNames[D],
                        DDD:  (dF.i18n.dayNames[D]).toUpperCase(),
                        dddd: dF.i18n.dayNames[D + 7],
                        DDDD: (dF.i18n.dayNames[D + 7]).toUpperCase(),
                        m:    m + 1,
                        mm:   pad(m + 1),
                        mmm:  dF.i18n.monthNames[m],
                        MMM:  (dF.i18n.monthNames[m]).toUpperCase(),
                        mmmm: dF.i18n.monthNames[m + 12],
                        MMMM: (dF.i18n.monthNames[m + 12]).toUpperCase(),
                        yy:   String(y).slice(2),
                        yyyy: y,
                        h:    H % 12 || 12,
                        hh:   pad(H % 12 || 12),
                        H:    H,
                        HH:   pad(H),
                        M:    M,
                        MM:   pad(M),
                        s:    s,
                        ss:   pad(s),
                        l:    pad(L, 3),
                        L:    pad(L > 99 ? Math.round(L / 10) : L),
                        t:    H < 12 ? "a"  : "p",
                        tt:   H < 12 ? "am" : "pm",
                        T:    H < 12 ? "A"  : "P",
                        TT:   H < 12 ? "AM" : "PM",
                        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                    };
    
                return mask.replace(token, function ($0) {
                    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                });
            };
        }();
    
        {* Some common format strings *}
        dateFormat.masks = {
            "default":      "ddd mmm dd yyyy HH:MM:ss",
            shortDate:      "m/d/yy",
            mediumDate:     "mmm d, yyyy",
            longDate:       "mmmm d, yyyy",
            fullDate:       "dddd, mmmm d, yyyy",
            shortTime:      "h:MM TT",
            mediumTime:     "h:MM:ss TT",
            longTime:       "h:MM:ss TT Z",
            isoDate:        "yyyy-mm-dd",
            isoTime:        "HH:MM:ss",
            isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };
    
        {* Internationalization strings *}
        dateFormat.i18n = {
            dayNames: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ],
            monthNames: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        };
    
        {* For convenience... *}
        Date.prototype.format = function (mask, utc) {
            return dateFormat(this, mask, utc);
        };
    })();
</script>
    