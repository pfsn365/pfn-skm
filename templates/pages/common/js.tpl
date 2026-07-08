{if !$included_common_elements__page_script}

	{assign var=included_common_elements__page_script value=TRUE scope="global"}

	{include file="desktop/utils/date.tpl"}

	<script>
		var $ = document.querySelector.bind(document);
		var $all = document.querySelectorAll.bind(document);
		var $id = document.getElementById.bind(document);

		(function() {
			var carouselContainer = "";
			var carouselItemSelector = "";

			if ($id("keeda_cricket_widget")) {
				carouselContainer = $id("keeda_cricket_widget");
				carouselItemSelector = ".keeda_cricket_single_match";
			} else if ($id("keeda_football_widget")) {
				carouselContainer = $id("keeda_football_widget");
				carouselItemSelector = ".keeda_football_single_match";
			} else if ($id("keeda_kabaddi_widget")) {
				carouselContainer = $id("keeda_kabaddi_widget");
				carouselItemSelector = ".keeda_cricket_single_match";
			}

			if (!carouselItemSelector) {
				return;
			}

			var allScoreCarouselItems = $all(carouselItemSelector);

			function init() {
				allScoreCarouselItems.forEach(function(item) {
					item.addEventListener("click", function(e) {
						var closestAnchor = e.target.closest("a");

						if (closestAnchor) {
							var destinationUrl = closestAnchor.getAttribute("href");

							trackGAEvent("SCORE_CAROUSEL_ITEM_CLICK", {
								destination_url: destinationUrl
							});
						}
					})
				});

				trackImpressionGAEventWhenInViewport({
					element: carouselContainer,
					identifier: "widget_sport_carousel",
					eventName: "SCORE_CAROUSEL_IMPRESSION"
				});
			}

			window.addEventListener("DOMContentLoaded", function() {
				init();
			});
		})();
		(function() {
			var allViewMoreCtas = $all(".view-more-cta");

			allViewMoreCtas.forEach(function(cta) {
				cta.addEventListener("click", function(e) {
					var clickedItem = e.target.closest("a.view-more-cta");

					var section = clickedItem.dataset["section"];
					var destinationUrl = clickedItem.getAttribute("href");

					trackGAEvent("VIEW_MORE_CTA_CLICK", {
						section: section,
						destination_url: destinationUrl
					});
				})
			});
		})();
		(function() {
			function getFormattedDate(dateInstance, format) {
				if (format && typeof Date.prototype.format == "function") {
					return dateInstance.format(format);
				}

				return dateInstance.toLocaleDateString();
			}

			function init() {
				var utcToLocalTimeCandidates = $all(".convert-utc-to-local");

				utcToLocalTimeCandidates.forEach(function(dateItem) {
					try {
						var utcDateTime = dateItem.dataset["utcDateTime"];
						var format = dateItem.dataset["format"];
						var withUserFriendlyDay = dateItem.dataset["userFriendlyDay"] == "true";
						var shouldOutputAsAttribute = dateItem.dataset["asAttribute"] == "true";
						var outputAttributeName = dateItem.dataset["outputAttribute"];

						if (utcDateTime) {
							var localDate = new Date(utcDateTime);
							var dateText = "";

							if (withUserFriendlyDay) {
								var toDateFormat = function(date) {
									return [date.getFullYear(), date.getMonth(), date.getDate()].join("-");
								};

								var localDateFormatted = toDateFormat(localDate);

								var today = new Date();
								if (toDateFormat(today) == localDateFormatted) {
									dateText = "Today";
								} else {
									var tomorrow = new Date(today);
									tomorrow.setDate(today.getDate() + 1);

									if (toDateFormat(tomorrow) == localDateFormatted) {
										dateText = "Tomorrow";
									} else {
										dateText = getFormattedDate(localDate, format);
									}
								}
							} else {
								dateText = getFormattedDate(localDate, format);
							}

							if (shouldOutputAsAttribute && outputAttributeName) {
								dateItem.setAttribute(outputAttributeName, dateText);
							} else {
								dateItem.innerText = dateText;
							}
						}
					} catch (err) {
						console.error(err);
					}
				});
			}

			init();
			window.addEventListener("custom:sk:utils:refreshUtcToLocalTime", init);
		})();

		function NTernary(args) {
			for (var i = 0; i < args.length; i++) {
				if (args[i]) {
					return args[i];
				}
			}

			return false;
		}

		(function() {
			var imageURLCache = {};

			function loadImageIfExists(url, imgParams) {
				var assetURL = [url, imgParams].join("");

				return new Promise(function(resolve, reject) {
					var img = new Image();
					img.src = assetURL;
					img.onload = function() {
						resolve(img);
					};
					img.onerror = function() {
						resolve(false);
					}
				});
			}

			async function initImg(imgElement) {
				var fallbacks = imgElement.dataset["imgFallbacks"];
				if (!fallbacks) return;

				var imgParams = imgElement.dataset["imgParams"];

				var urlsToTry = fallbacks.split("|:|:|");

				for await (var url of urlsToTry) {
					var urlWithParams = [url, imgParams].join("");

					var cachedURL = imageURLCache[urlWithParams];
					if (cachedURL) {
						imgElement.setAttribute("src", cachedURL);
						break;
					}

					var imageTag = await loadImageIfExists(url, imgParams);
					if (imageTag) {
						var attributes = imgElement.getAttributeNames();
						for (var i = 0; i < attributes.length; i++) {
							if (attributes[i] == "src") {
								continue;
							}

							imageTag.setAttribute(attributes[i], imgElement.getAttribute(attributes[i]));
						}

						imageTag.removeAttribute("data-img-fallbacks");

						imgElement.replaceWith(imageTag);

						imageURLCache[urlWithParams] = imageTag.getAttribute("src");

						break;
					}
				}
			}

			function init() {
				var observer = new IntersectionObserver(function(entries) {
					entries.forEach(function(entry) {
						if (!entry.isIntersecting) return;
						if (!entry.target) return;

						removeClass(entry.target, "img-with-fallbacks");

						observer.unobserve(entry.target);

						initImg(entry.target);
					});
				}, {
					threshold: 0.5,
					rootMargin: "25% 0px 25% 0px",
				});

				$all(".img-with-fallbacks").forEach(function(imgElement) {
					observer.observe(imgElement);
				});

				$all(".img-with-fallbacks-eager").forEach(function(imgElement) {
					removeClass(imgElement, "img-with-fallbacks-eager");

					initImg(imgElement);
				});
			}

			window.addEventListener("DOMContentLoaded", init);
			window.addEventListener("custom:sk:utils:lazyLoadAssetImages", init);
		})();

		(function() {
			var playerBasePath = "{$smarty.const.STATIC_URL}/skm/assets/player-images";
			var teamBasePath = "{$smarty.const.STATIC_URL}/skm/assets/team-logos";

			function generatePathResolver(taxType, assetBasePath) {
				return function(taxSlug, categorySlug, fallbackURLs, params) {
					var urlsToTry = fallbackURLs.filter(Boolean);
					var shouldUseAssetImage = false;

					if (taxSlug) {
						if (taxType == "player") {
							if (["nfl", "college-football", "basketball", "cricket"].includes(categorySlug)) {
								shouldUseAssetImage = true;
							}
						} else if (taxType == "team") {
							shouldUseAssetImage = true;
						}

						if (shouldUseAssetImage) {
							urlsToTry.unshift([assetBasePath, categorySlug, [taxSlug, "png"].join(".")].join("/"));
						}
					}

					urlsToTry = urlsToTry.map(function(url) {
						if (params) {
							url = url + params;
						}

						return url;
					});

					return urlsToTry.join("|:|:|");
				}
			}

			window.generatePlayerAssetImage = generatePathResolver("player", playerBasePath);
			window.generateTeamAssetImage = generatePathResolver("team", teamBasePath);
		})();

		(() => {
			function generateLink(originalLink) {
				var now = Date.now();
				var tsParam = [
					Date.now(),
					Math.floor(Math.random() * 90000) + 10000
				].join("__");
				try {
					trackingLink = new URL(originalLink);
					trackingLink.searchParams.set("t", tsParam);
					trackingLink.searchParams.set("ord", now);
					return trackingLink.toString();
				} catch (err) {
					if (originalLink.includes("?")) {
						return originalLink + `&t=${ tsParam }&ord=${ now }`;
					} else {
						return originalLink + `?t=${ tsParam }&ord=${ now }`;
					}
				}
			}

			window.trackCampaignUnitClick = ({ campaignID, propertyID, brandTrackerLink }) => {
				trackGAEvent("SK_CAMPAIGN_UNIT_CLICK", {
					campaign: campaignID,
					property: propertyID,
				});

				if (!brandTrackerLink) return;

				const clickTracker = generateLink(decodeURIComponent(brandTrackerLink));
				window.open(clickTracker, "_blank", "noopener noreferrer");
			}

			window.trackCampaignUnitImpression = ({ element, campaignID, propertyID, brandTrackerLink }) => {
				trackImpressionGAEventWhenInViewport({
					element,
					identifier: `${ campaignID}__${ propertyID }`,
					eventName: "SK_CAMPAIGN_UNIT_IMPRESSION",
					eventParams: {
						campaign: campaignID,
						property: propertyID,
					},
					callback: () => {
						if (!brandTrackerLink) return;

						const pix = new Image();
						pix.src = generateLink(decodeURIComponent(brandTrackerLink));
					},
				});
			}

			function generateBanner({ id, imgURL, campaignID, width, height, styles, imgStyles, impTracker, clickTracker }) {
				const propertyID = id;

				const imgTag = new Image();
				imgTag.src = STATIC_URL + `/${ imgURL }`;
				imgTag.alt = "";
				imgTag.style.cursor = "pointer";
				imgTag.style.width = "var(--w)";
				imgTag.style.height = "var(--h)";

				if (imgStyles && Object.keys(imgStyles).length) {
					for (let k in imgStyles) {
						imgTag.style[k] = imgStyles[k];
					}
				}

				const imgContainer = document.createElement("div");
				imgContainer.classList.add("branded-banner-container");
				imgContainer.appendChild(imgTag);

				if (width) {
					imgContainer.style.setProperty("--w", width);
				}
				if (height) {
					imgContainer.style.setProperty("--h", height);
				}
				if (styles && Object.keys(styles).length) {
					for (let k in styles) {
						imgContainer.style[k] = styles[k];
					}
				}

				imgContainer.addEventListener("click", () => {
					window.trackCampaignUnitClick({
						campaignID,
						propertyID,
						brandTrackerLink: clickTracker,
					});
				});

				window.trackCampaignUnitImpression({
					element: imgContainer,
					campaignID,
					propertyID,
					brandTrackerLink: impTracker,
				});

				return imgContainer;
			}

			function generateBannerWithClone(params) {
				const banner = generateBanner(params);
				banner._bannerParams = params;
				banner.cloneWithListeners = () => generateBannerWithClone(params);
				return banner;
			}

			function addStylesToTarget({ element, styles }) {
				for (let key in styles) {
					element.style[key] = styles[key];
				}
			}

			window.brandedUnitsFactory = {
				generateBanner,
				generateBannerWithClone,
				addStylesToTarget,
			};
		})();
	</script>

{/if}
