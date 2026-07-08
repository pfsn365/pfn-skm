{include file="desktop/utils/cookie.tpl"}

<script>
    (function() {

        var userID = getCookie("fw_ID");
        var userMail = decodeURIComponent(getCookie("fw_email"));
        var userCountry = getCookie("country_code");

        var feedbackSectionParent = "";

        function showFeedbackPopup(event) {
            var targetElement = event.target.closest("button");
            var feedbackSheet = targetElement.getAttribute("data-feedback-sheet");
            var feedbackPage = targetElement.getAttribute("data-feedback-page");
            var feedbackSection = targetElement.getAttribute("data-feedback-section");
            var feedbackTab = targetElement.getAttribute("data-feedback-tab");

            var subTabSelector = "";
            if (feedbackTab) {
                subTabSelector = "." + feedbackTab.replace("&", "-");
            }
            var nestedSelector = "";
            if (feedbackSection || subTabSelector) {
                nestedSelector = "." + feedbackSection + subTabSelector;
            }
            feedbackSectionParent = $(".feedback-parent-container" + nestedSelector);

            var brandLogo = feedbackSectionParent.getAttribute("data-brand-logo");
            var headerText = feedbackSectionParent.getAttribute("data-header-text");
            var contentText = feedbackSectionParent.getAttribute("data-popup-content-text");

            var popupHolder = feedbackSectionParent.querySelector(".feedback-popup-container");
            var popupElementTemplate = document.importNode($("#feedback-popup-template").cloneNode(true)
                .content, true);

            var feedbackTextElement = popupElementTemplate.querySelector(".feedback-text");
            feedbackTextElement.addEventListener("keyup", function(e) {
                e.stopImmediatePropagation();
                toggleFeedbackSubmitButton();
            });

            var feedbackSubmitButton = popupElementTemplate.querySelector(".feedback-submit-button");
            feedbackSubmitButton.addEventListener("click", function() {
                submitFeedbackContent(feedbackSheet, feedbackPage, feedbackSection, feedbackTab);
            });

            var feedbackCloseButton = popupElementTemplate.querySelector(".close-overlay-icon");
            feedbackCloseButton.addEventListener("click", function() {
                closeFeedbackPopup();
            });

            var feedbackCancelButton = popupElementTemplate.querySelector(".feedback-cancel-button");
            feedbackCancelButton.addEventListener("click", function() {
                closeFeedbackPopup();
            });

            var feedbackContentText =popupElementTemplate.querySelector(".feedback-popup-content-text");
            feedbackContentText.innerHTML = contentText; 

            var headerNode = popupElementTemplate.querySelector(".feedback-popup-header");

            headerNode.querySelector(".brand-logo").setAttribute("src", "{$smarty.const.STATIC_URL}/" + brandLogo);
            headerNode.querySelector(".header-text").innerText = headerText;

            popupHolder.appendChild(popupElementTemplate);

            var gaEventParams = {};

            if (feedbackPage) {
                gaEventParams["source_page"] = feedbackPage;
            }

            if (feedbackSection) {
                gaEventParams["feedback_section"] = feedbackSection;
            }

            trackGAEvent("FEEDBACK_BTN_CLICK", gaEventParams);
        }

        function closeFeedbackPopup() {
            var popupHolder = feedbackSectionParent.querySelector(".feedback-popup-container");
            popupHolder.removeChild($(".feedback-popup-holder"));
        }

        function submitFeedbackContent(feedbackSheet, feedbackPage, feedbackSection, feedbackTab) {
            var feedbackSubmissionUrl = "{$smarty.const.GOTHAM_URL}/static-pages/submission";
            var feedbackText = feedbackSectionParent.querySelector(".feedback-text").value;

            removeExperienceFeedbackPopup();

            var payload = {
                "page": feedbackSheet || feedbackPage,
                "feedback": (feedbackText).replace(/<(.|\n)*?>/g, ''),
                "section": feedbackSection,
                "page_url": window.location.href,
                "device": "{$smarty.const.IS_MOBILE}" ? "Mobile" : "Desktop"
            }

            if (feedbackTab) {
                payload["property"] = feedbackTab
            }

            if (userID) {
                payload["user_id"] = userID;
            }

            if (userMail) {
                payload["user_mail"] = userMail;
            }

            if (userCountry) {
                payload["user_country"] = userCountry;
            }

            if (feedbackSection == "Live" && (typeof currentCommentaryLang !== "undefined")) {
                payload["lang"] = currentCommentaryLang;
            }

            if (navigator.userAgent) {
                payload["user_agent"] = navigator.userAgent;
                payload["device_width"] = window.innerWidth;
                payload["device_height"] = window.innerHeight;
            }

            feedbackSectionParent.querySelector(".feedback-text").value = "";
            feedbackSectionParent.querySelector(".feedback-submit-button").innerHTML = "Submitting...";
            toggleFeedbackSubmitButton();

            window.dispatchEvent(
                new CustomEvent("custom:sk:feedback:submitted", {
                    detail: {
                        payload
                    }
                })
            );

            pureJSAjaxPost(feedbackSubmissionUrl, payload, feedbackSuccessCallback, feedbackErrorCallback, null,
                true);
        }

        function toggleFeedbackSubmitButton() {
            if (feedbackSectionParent.querySelector(".feedback-text").value.length > 0) {
                feedbackSectionParent.querySelector(".feedback-submit-button").disabled = false;
            } else {
                feedbackSectionParent.querySelector(".feedback-submit-button").disabled = true;
            }
        }

        function showSuccessModal(event) {
            if(event) {
                var targetElement = event.target.closest("button");
                var feedbackSection = targetElement.getAttribute("data-feedback-section");
                feedbackSectionParent = $(".feedback-parent-container." + feedbackSection);
            }
            var successPopupHolder = feedbackSectionParent.querySelector(".feedback-success-modal-container");
            var successPopupElementTemplate = document.importNode($("#feedback-success-modal-template").cloneNode(true)
                .content, true);

            successPopupHolder.appendChild(successPopupElementTemplate);

            window.setTimeout(function() {
                successPopupHolder.removeChild($(".feedback-success-modal"));
            }, 2500);
        }

        function feedbackSuccessCallback() {
            closeFeedbackPopup();
            showSuccessModal();
        }

        function feedbackErrorCallback() {
            alert("Something went wrong please try again later");
            closeFeedbackPopup();
        }

        function removeExperienceFeedbackPopup() {
            var experienceFeedbackContainer = $('.experience-feedback-popup-holder');
            if (experienceFeedbackContainer && !hasClass(experienceFeedbackContainer, "hidden")) {
                addClass(experienceFeedbackContainer, "hidden");
            }
        }

        function sendPositiveExperience(event) {
            var targetElement = event.target.closest("button");
            var feedbackSheet = targetElement.getAttribute("data-feedback-sheet");
            var feedbackPage = targetElement.getAttribute("data-feedback-page");
            var feedbackSection = targetElement.getAttribute("data-feedback-section");

            feedbackSectionParent = $(".feedback-parent-container." + feedbackSection);

            var feedbackSubmissionUrl = "{$smarty.const.GOTHAM_URL}/static-pages/submission";

            var payload = {
                "page": feedbackSheet || feedbackPage,
                "feedback": "Positive",
                "section": feedbackSection,
                "page_url": window.location.href,
                "device": "{$smarty.const.IS_MOBILE}" ? "Mobile" : "Desktop"
            }

            if (userID) {
                payload["user_id"] = userID;
            }

            if (userMail) {
                payload["user_mail"] = userMail;
            }

            if (userCountry) {
                payload["user_country"] = userCountry;
            }

            if (feedbackSection == "Live" && (typeof currentCommentaryLang !== "undefined")) {
                payload["lang"] = currentCommentaryLang;
            }

            pureJSAjaxPost(feedbackSubmissionUrl, payload);
        }

        function addExperienceFeedbackPopupListeners() {
            var positiveFeedbackBtn = $('.experience-feedback-positive-button');
            if (positiveFeedbackBtn) {
                positiveFeedbackBtn.addEventListener("click", function() {
                    sendPositiveExperience(event);
                    showSuccessModal(event);
                    removeExperienceFeedbackPopup();
                })
            }
            var negativeFeedbackBtn = $('.experience-feedback-negative-button');
            if (negativeFeedbackBtn) {
                negativeFeedbackBtn.addEventListener("click", function() {
                    showFeedbackPopup(event);
                })
            }

            var experienceFeedbackpopupCloseIcon = $(".experience-feedback-popup-box .close-overlay-icon");
            if(experienceFeedbackpopupCloseIcon) {
                experienceFeedbackpopupCloseIcon.addEventListener("click", removeExperienceFeedbackPopup);
            }
        }

        // event listeners
        window.addEventListener("DOMContentLoaded", function() {
            var feedbackCTAElement = $all(".feedback-cta-button");
            for (var i = 0; i < feedbackCTAElement.length; i++) {
                feedbackCTAElement[i].addEventListener("click", function() {
                    showFeedbackPopup(event);
                });
            }

            addExperienceFeedbackPopupListeners();
        });
    }());
</script>
