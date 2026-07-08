{include 'templates/desktop/utils/localStorage.tpl'}
<script>
  const trackReturningUsers = (() => {
    const getToolFromPageType = (pageType) => {
      const toolKeys = [
        'mockDraftSimulator',
        'playoffPredictor',
        'tradeAnalyzer',
        'startSitOptimizer',
        'nflWordle',
        'fantasyNewsTracker',
        'dfsLineupOptimizer',
        'tradeValueChart',
        'dynastyTradeValueChart',
        'collegeFootballPlayoffPredictor',
      ];
      // When the user of the function enters the name of the page in a capitalized form with spaces between words,
      // we convert the first word to lowercase,
      // and captialize the other words,
      // so that we have a more uniform value that can be used as a key
      const toolKey = pageType
        .split(' ')
        .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
  
      return toolKeys.includes(toolKey) ? toolKey : undefined;
    }

    const calculateUserToolAdoptionTypeFactory = (days = 90) => {
      return (tool) => {
        var now = Date.now();
        var userAdoptionObject = {
          "userAdoptionType": "N/A",
          "lastAdopted": now
        };
  
        if (!tool) {
          return userAdoptionObject;
        }
  
        var toolAccessedKey = "tool_accessed_" + (days === 90 ? '' : 'Last' + days + 'Days_') + tool;
        var toolAccessedTime = getLocalStorageWithExpiry(toolAccessedKey);
        if (toolAccessedTime) {
          userAdoptionObject["userAdoptionType"] = "existing";
          userAdoptionObject["lastAdopted"] = toolAccessedTime;
        } else {
          userAdoptionObject["userAdoptionType"] = "new";
        }
  
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        setLocalStorageWithExpiry(toolAccessedKey, now, expiryDate.getTime());
        return userAdoptionObject;
      }
    }
  
    const getUserToolAdoptionTypeFactory = (days = 90) => {
      const calculateUserAdoptionType = calculateUserToolAdoptionTypeFactory(days);
      return (pageType) => {
        var tool = getToolFromPageType(pageType);
        var canTriggerTracking = false;
        if (!tool) {
          return [undefined, false];
        }
  
        try {
          {* 
              Here uta stands for User Tool Adoption
          *}
          var cookieKey = "uta__" + (days === 90 ? '' : 'Last' + days + 'Days_') + tool;
          var userAdoptionTypeFromCookie = getCookie(cookieKey);
          var userAdoptionType = getLocalStorageWithExpiry(cookieKey);
          if (!userAdoptionType && !userAdoptionTypeFromCookie) {
            var calculatedUserAdoptionType = calculateUserAdoptionType(tool);
            userAdoptionType = calculatedUserAdoptionType["userAdoptionType"];
            var expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1); 
            setLocalStorageWithExpiry(cookieKey, userAdoptionType, expiryDate.getTime());
            canTriggerTracking = true;
          }
          return [userAdoptionType, canTriggerTracking];
        } catch (e) {
          console.error("failed to parse user adoption type from cookie", e);
          return [undefined, false];
        }   
      }
    }

    const getUserToolAdoptionTypeLast7Days = getUserToolAdoptionTypeFactory(7);
    const getUserToolAdoptionTypeLast30Days = getUserToolAdoptionTypeFactory(30);
    const getUserToolAdoptionTypeLast90Days = getUserToolAdoptionTypeFactory(90);
    const getUserToolAdoptionTypes = (pageType) => {
      const [userAdoptionType, canTrack90Days] = getUserToolAdoptionTypeLast90Days(pageType);
      const [userAdoptionTypeLast30Days, canTrack30Days] = getUserToolAdoptionTypeLast30Days(pageType);
      const [userAdoptionTypeLast7Days, canTrack7Days] = getUserToolAdoptionTypeLast7Days(pageType);
      const canTrack = canTrack90Days || canTrack30Days || canTrack7Days;
      return [
        {
          userAdoptionType: userAdoptionType,
          userAdoptionTypeLast30Days: userAdoptionTypeLast30Days,
          userAdoptionTypeLast7Days: userAdoptionTypeLast7Days
        },
        canTrack
      ];
    }

    const trackReturningUsers = (pageType, trackFn) => {
      const [userAdoptionTypes, canTrack] = getUserToolAdoptionTypes(pageType);
      if (canTrack) trackFn(userAdoptionTypes);
    }

    return trackReturningUsers;
  })();
</script>
