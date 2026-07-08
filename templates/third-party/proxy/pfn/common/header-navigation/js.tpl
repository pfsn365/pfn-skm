{if $is_desktop}
  {include file="templates/utils/carousal.tpl"}
{/if}
<script>
  (function() {
    const device = "{$is_desktop}" ? "Desktop" : "Mobile";
    var primaryNavContainer = $(".header-tools-navigation-holder");

    const triggerNavBarGAEventForPFN = (destinationURL, parentSection, eventName) => {
      const sourceURL = window.location.href;
      const eventData = {
        "device": device,
      };
      if (destinationURL) {
        eventData["destination_url"] = destinationURL;
      }
      if (parentSection) {
        eventData["parent_section"] = parentSection;
      }
      trackGAEvent(
        eventName ? eventName : "primary_nav_clicks",
        eventData
      );
    }

    const getParentSection = (element) => {
      var closestDesktopHeaderMenuItem = event.target.closest(".header-menu-items.menu-navigation-btn");
      if (closestDesktopHeaderMenuItem) {
        var menuItemText = closestDesktopHeaderMenuItem.querySelector(".header-menu-items-text");
        if (menuItemText) {
          return menuItemText.textContent.trim();
        }
      }
      // handle the case in which the nav's in mobile view
      var closestMobileHeaderMenuItem = event.target.closest(".mobile-menu-item");
      if (closestMobileHeaderMenuItem) {
        var menuItemText = closestMobileHeaderMenuItem.querySelector(".mobile-menu-item-text");
        if (menuItemText) {
          return menuItemText.textContent.trim();
        }
      }
      return "";
    }

    const generateDesktopNavLinkClickEventListeners = (btnClassName, supplementaryBtnEventListeners) => {
      var navigationBtn = $all(btnClassName);
      if (navigationBtn.length) {
        navigationBtn.forEach(btn => {
          btn.addEventListener("click", function(event) {
            event.stopPropagation();
            var navBtn = event.target.closest(btnClassName);
            var dataUrl = navBtn.getAttribute("data-item-url");
            if (dataUrl) {
              let eventType = btn.getAttribute("data-nav-type");
              eventType = eventType === "secondary" ? "secondary_nav_clicks" : "primary_nav_clicks";
              const parentSection = getParentSection(event.target);
              triggerNavBarGAEventForPFN(dataUrl, parentSection, eventType);
              window.open(dataUrl, "_self");
            }
          });
          if (supplementaryBtnEventListeners) {
            supplementaryBtnEventListeners(btn);
          }
        });
      }
    }

    const generateMobileNavLinkClickEventListeners = (
      btnClassName,
      btnTextClassName,
      btnSubcontainerClassName,
      btnSubItemsClassName
    ) => {
      var mobileMenuItems = $all(btnClassName);
      if (mobileMenuItems.length) {
        mobileMenuItems.forEach(item => {
          const itemText = item.querySelector(btnTextClassName);
          const subMenuContainer = btnSubcontainerClassName ? item.querySelector(btnSubcontainerClassName) :
            undefined;
          if (itemText) {
            const rightArrow = itemText.querySelector('.collapse-sign .nav-right-icon');
            const downArrow = itemText.querySelector('.collapse-sign .nav-down-icon');
            itemText.addEventListener('click', function(event) {
              event.stopPropagation();
              if (btnSubItemsClassName && item.querySelectorAll(btnSubItemsClassName).length > 0) {
                if (subMenuContainer) {
                  subMenuContainer.classList.toggle('hidden');
                }
                
                if (rightArrow && downArrow) {
                  rightArrow.classList.toggle("hidden");
                  downArrow.classList.toggle("hidden");
                }
              } else {
                const dataUrl = item.getAttribute('data-item-url');
                if (dataUrl) {
                  const parentSection = getParentSection(event.target);
                  triggerNavBarGAEventForPFN(dataUrl, parentSection);
                  window.open(dataUrl, "_self");
                }
              }
            });
          }
        });
      }
    }

    const headerLogo = $(".header-logo-container");
    if (headerLogo) {
      headerLogo.addEventListener("click", function(event) {
        event.preventDefault();
        const url = headerLogo.getAttribute("data-item-url");
        if (url) {
          triggerNavBarGAEventForPFN("", "", "logo_clicks");
          window.open(url, '_blank');
        }
      });
    }

    generateDesktopNavLinkClickEventListeners(".menu-navigation-btn", (btn) => {
      const text = btn.querySelector('.header-menu-items-text');
      if (text) {
        text.addEventListener("mouseenter", function() {
          addClass(text, "fade-in");
          removeClass(text, "fade-out");
        });

        text.addEventListener("mouseleave", function() {
          addClass(text, "fade-out");
          removeClass(text, "fade-in");
        });
      }
    }); // this call is used for both primary nav and secondary nav
    generateDesktopNavLinkClickEventListeners(".menu-navigation-btn-2");
    generateDesktopNavLinkClickEventListeners(".menu-navigation-btn-3");
    generateDesktopNavLinkClickEventListeners(".menu-navigation-btn-4");

    var selectedCategoryLink = document.querySelector('.category-link.selected');
    if (selectedCategoryLink) {
      if (device === 'Desktop') {
        selectedCategoryLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        selectedCategoryLink.scrollIntoView({ block: 'center' });
      }
    }

    var hamburgerBtn = document.querySelector('button.page-category');
    var hamburgerDropdown = document.querySelector('.page-dropdown-container .page-dropdown');
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn || !hamburgerDropdown) return;

      const clickedInsideBtn = hamburgerBtn.contains(e.target);
      const clickedInsideDropdown = hamburgerDropdown.contains(e.target);
      const dropdownOpen = !hamburgerDropdown.classList.contains('hidden');

      if (clickedInsideBtn) {
        if (device === "Mobile" && hamburgerDropdown.classList.contains("hidden")) {
          triggerNavBarGAEventForPFN("", "", "hamburger_click");
        }
        hamburgerDropdown.classList.toggle('hidden');
      } else if (!clickedInsideDropdown && dropdownOpen) {
        addClass(hamburgerDropdown, "hidden");
      }
    });

    generateMobileNavLinkClickEventListeners(
      ".mobile-menu-item",
      ".mobile-menu-item-text",
      ".mobile-sub-menu-item-container",
      ".mobile-menu-sub-item"
    );
    generateMobileNavLinkClickEventListeners(
      ".mobile-menu-sub-item",
      ".mobile-menu-sub-item-text",
      ".mobile-sub-sub-menu-item-container",
      ".mobile-menu-sub-sub-item"
    );
    generateMobileNavLinkClickEventListeners(
      ".mobile-menu-sub-sub-item",
      ".mobile-menu-sub-sub-item-text",
      ".mobile-sub-sub-sub-menu-item-container",
      ".mobile-menu-sub-sub-sub-item"
    );
    generateMobileNavLinkClickEventListeners(
      ".mobile-menu-sub-sub-sub-item",
      ".mobile-menu-sub-sub-sub-item-text"
    );

    var dropdownCloseButton = document.querySelector('.close-container button');
    if (dropdownCloseButton) {
      dropdownCloseButton.addEventListener('click', function(event) {
        event.stopPropagation();
        var dropdown = document.querySelector('.page-dropdown');
        if (dropdown) {
          addClass(dropdown, "hidden");
        }
      });
    }

    function initListScroll() {
      const container = $(".pfn-secondary-container .category-links-container");
      const leftScrollButton = $(".pfn-secondary-container .carousel-control-btn.left-scroll-button");
      const rightScrollButton = $(".pfn-secondary-container .carousel-control-btn.right-scroll-button");
      leftScrollButton.onclick = function() {
        container.scrollBy({
          behavior: "smooth",
          top: 0,
          left: -800
        });
      }

      rightScrollButton.onclick = function() {
        container.scrollBy({
          behavior: "smooth",
          top: 0,
          left: 800
        });
      }

      new KeedaCarousalControlsHelper({
        target: container,
        whenFistItemInViewport: function(entry) {
          addClass(leftScrollButton, "hidden");
        },
        whenFistItemNotInViewport: function(entry) {
          removeClass(leftScrollButton, "hidden");
        },
        whenLastItemInViewport: function(entry) {
          addClass(rightScrollButton, "hidden");
        },
        whenLastItemNotInViewport: function(entry) {
          removeClass(rightScrollButton, "hidden");
        }
      }).observeTarget();
    }

    if (device === "Desktop") {
      initListScroll();
    }
  })();
</script>
