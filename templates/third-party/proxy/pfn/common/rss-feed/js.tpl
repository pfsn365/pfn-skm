<script>
  const generateRSSFeedForPFN = (function() {
    const feedsList = [];
    let feedSourceUrl = '';
    let desktop = true;
    heading = "Latest NFL Fantasy News";
    let appendBeforeContainerClass = ".pfn-text-content-container";

    function loadMoreFeeds() {
      const feedsHolder = document.querySelector(".nfl-feeds-container .feeds-holder");
      if (feedsHolder) {
        const shownFeeds = feedsHolder.children.length;
        if (shownFeeds < feedsList.length) {
          const lastFeedIndex = Math.min(shownFeeds + 10, feedsList.length);
          const feedTemplate = document.getElementById('feed-template');

          for (let i = shownFeeds; i < lastFeedIndex; i++) {
            const clone = feedTemplate.content.cloneNode(true);
            const singleFeed = clone.querySelector('.single-feed');
            singleFeed.setAttribute("href", feedsList[i].Link);

            const image = clone.querySelector('.feed-image');
            image.setAttribute("src", feedsList[i].Image);
            if (desktop) {
              image.setAttribute("width", 100);
              image.setAttribute("height", 80);
            } else {
              image.setAttribute("width", 84);
              image.setAttribute("height", 73);
            }

            const feedTitle = clone.querySelector('.feed-title');
            feedTitle.innerHTML = feedsList[i].Title;

            const updatedTime = clone.querySelector('.feed-time');
            const feedDateTimeEDT = new Date(feedsList[i].Date).changeTimezone("America/New_York").format(
              "mmm d, yyyy | hh:MM TT");
            updatedTime.innerHTML = feedDateTimeEDT + " ET";

            feedsHolder.appendChild(clone);
          }

          if (lastFeedIndex === feedsList.length) {
            const loadMoreBtn = document.querySelector(".nfl-feeds-container .load-more-feeds-btn");
            if (loadMoreBtn) {
              loadMoreBtn.classList.add("hidden");
            }
          }
        }
      }
    }

    function showRSSFeeds(feedsData) {
      const headers = feedsData[0];
      for (let i = 1; i < feedsData.length; i++) {
        const feed = {};
        for (let j = 0; j < headers.length; j++) {
          feed[headers[j]] = feedsData[i][j];
        }
        feedsList.push(feed);
      }

      if (feedsList.length) {
        const feedsContainer = document.createElement("div");
        addClass(feedsContainer, "nfl-feeds-container");

        const headerTemplate = document.getElementById('header-template');
        const headerClone = headerTemplate.content.cloneNode(true);
        headerClone.querySelector('.header-text').innerHTML = heading;
        feedsContainer.appendChild(headerClone);

        const feedsHolder = document.createElement("div");
        addClass(feedsHolder, "feeds-holder");
        let feedsLength = feedsList.length > 10 ? 10 : feedsList.length;

        const feedTemplate = document.getElementById('feed-template');

        for (let i = 0; i < feedsLength; i++) {
          const clone = feedTemplate.content.cloneNode(true);
          const singleFeed = clone.querySelector('.single-feed');
          singleFeed.setAttribute("href", feedsList[i].Link);

          const image = clone.querySelector('.feed-image');
          image.setAttribute("src", feedsList[i].Image);
          if (desktop) {
            image.setAttribute("width", 100);
            image.setAttribute("height", 80);
          } else {
            image.setAttribute("width", 84);
            image.setAttribute("height", 73);
          }

          const feedTitle = clone.querySelector('.feed-title');
          feedTitle.innerHTML = feedsList[i].Title;

          const updatedTime = clone.querySelector('.feed-time');
          const feedDateTimeEDT = new Date(feedsList[i].Date).changeTimezone("America/New_York").format(
            "mmm d, yyyy | hh:MM TT");
          updatedTime.innerHTML = feedDateTimeEDT + " ET";

          feedsHolder.appendChild(clone);
        }

        feedsContainer.appendChild(feedsHolder);

        if (feedsList.length > 10) {
          const loadMoreTemplate = document.getElementById('load-more-template');
          const loadMoreClone = loadMoreTemplate.content.cloneNode(true);
          loadMoreClone.querySelector('.load-more-feeds-btn').addEventListener("click", loadMoreFeeds);
          feedsContainer.appendChild(loadMoreClone);
        }
        return feedsContainer;
      }
      return null;
    }

    function getRSSFeeds() {
      return fetch(feedSourceUrl)
        .then(res => res.json())
        .catch(err => {
          console.log(err);
          return null;
        });
    }

    function generateRSSFeed(url, isDesktop, feedHeading) {
      feedSourceUrl = url;
      desktop = isDesktop;
      if (feedHeading) {
        heading = feedHeading;
      }

      return getRSSFeeds().then(feedsData => {
        return showRSSFeeds(feedsData);
      });
    }

    return generateRSSFeed;
  })();
</script>
