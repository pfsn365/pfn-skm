{if !$included_global_helpers__carousal}

  {assign var=included_global_helpers__carousal value=TRUE scope="root"}

  <script>
    function KeedaCarousalControlsHelper(input) {
      var self = this;
      this.target = input.target;
      this.whenCarouselInViewport = input.whenCarouselInViewport;
      this.whenCarouselNotInViewport = input.whenCarouselNotInViewport;
      this.whenFistItemInViewport = input.whenFistItemInViewport;
      this.whenFistItemNotInViewport = input.whenFistItemNotInViewport;
      this.whenLastItemInViewport = input.whenLastItemInViewport;
      this.whenLastItemNotInViewport = input.whenLastItemNotInViewport;

      this.options = input.intersectionObserverOptions || {
        threshold: 1
      };
    }

    KeedaCarousalControlsHelper.prototype.observeTarget = function() {
      var self = this;
      var firstItem = this.target.firstElementChild;
      var lastItem = this.target.lastElementChild;

      var allChildren = this.target.children;
      var firstItem, lastItem;

      for (var i = 0; i < allChildren.length; i++) {
        if (!allChildren[i].classList.contains("hidden")) {
          firstItem = allChildren[i];
          break;
        }
      }
      for (var i = allChildren.length - 1; i >= 0; i--) {
        if (!allChildren[i].classList.contains("hidden")) {
          lastItem = allChildren[i];
          break;
        }
      }

      this.firstItemObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            self.whenFistItemInViewport(entry);
          } else {
            self.whenFistItemNotInViewport(entry);
          }
        })
      }, this.options);

      this.lastItemObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            self.whenLastItemInViewport(entry);
          } else {
            self.whenLastItemNotInViewport(entry);
          }
        })
      }, this.options);

      firstItem && this.firstItemObserver.observe(firstItem);
      lastItem && this.lastItemObserver.observe(lastItem);

      if (typeof self.whenCarouselInViewport == "function" && typeof self.whenCarouselNotInViewport == "function") {
        this.carouselObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              self.whenCarouselInViewport(entry);
            } else {
              self.whenCarouselNotInViewport(entry);
            }
          })
        }, {
          threshold: 1
        });

        this.carouselObserver.observe(this.target);
      }

      return this;
    }

    KeedaCarousalControlsHelper.prototype.unobserveTarget = function() {
      if (this.carouselObserver) {
        this.carouselObserver.disconnect();
      }
      if (this.firstItemObserver) {
        this.firstItemObserver.disconnect();
      }
      if (this.lastItemObserver) {
        this.lastItemObserver.disconnect();
      }

      return this;
    }

    KeedaCarousalControlsHelper.prototype.reset = function() {
      return this.unobserveTarget().observeTarget();
    }
  </script>
{/if}
