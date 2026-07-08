<style>
    .feedback-parent-container .feedback-cta-container {
        display: inline-flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        margin: 10px 0 15px 0;
    }

    .feedback-parent-container .feedback-cta-container .feedback-cta-holder {
        padding: 5px;
        border: 1px solid hsl(148, 57%, 50%);
        border-radius: 4px;
        background: #E9F7F2;
    }

    .feedback-parent-container .feedback-cta-container .feedback-cta-button {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        color: #37C77A;
        border: none;
        background: none;
        cursor: pointer;
    }

    /* feed back css */
    .feedback-parent-container .feedback-popup-holder {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        top: 0;
        left: 0;
        z-index: 99999;
    }

    .experience-feedback-popup-holder {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        top: 0;
        left: 0;
        z-index: 99998;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-content-holder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px 10px;
        gap: 10px;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-content-holder .experience-content-text-large {
        font-size: 14px;
        font-weight: 600;
        color: #2D2D2D;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-content-holder .experience-content-text-small {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-buttons {
        display: flex;
        padding: 15px;
        justify-content: center;
        align-items: center;
        gap: 15%;
    }

    .experience-feedback-popup-buttons .experience-feedback-btn-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-buttons button {
        background-color: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #ECECEC;
        height: 85px;
        width: 85px;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-buttons button img {
        background-color: unset;
        color: unset;
    }

    .experience-feedback-popup-holder .experience-feedback-popup-buttons button span {
        color: #666666;
        font-size: 12px;
        font-weight: 400;
    }

    .feedback-parent-container .feedback-popup-box,
    .feedback-parent-container .experience-feedback-popup-box {
        width: 462px;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        box-shadow: -1px 4px 20px rgba(0, 0, 0, 0.04);
        border-radius: 6px;
    }

    .feedback-parent-container .feedback-popup-header,
    .feedback-parent-container .experience-feedback-popup-header {
        border: 1px solid #E9E9E9;
        box-shadow: -1px 4px 20px rgba(0, 0, 0, 0.04);
        width: 100%;
        gap: 5px;
        padding: 18px 20px;
        border-radius: 5px 5px 0 0;
    }

    .feedback-parent-container .feedback-popup-header span,
    .feedback-parent-container .experience-feedback-popup-header span {
        font-size: 16px;
        line-height: 20px;
        color: #474747;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
    }

    .feedback-parent-container .feedback-popup-content-text {
        font-size: 16px;
        font-weight: 600;
        color: #2D2D2D;
    }

    .feedback-manual-popup-content .feedback-manual-popup-content-text {
        font-size: 14px;
        font-weight: 500;
        color: #2D2D2D;
    }

    .feedback-parent-container .feedback-popup-header .close-overlay-icon,
    .feedback-parent-container .experience-feedback-popup-header .close-overlay-icon {
        background: transparent;
        margin: 0px;
        cursor: pointer;
        width: 15px;
        height: 15px;
        margin-left: auto;
        margin-bottom: 5px;
    }

    .feedback-parent-container .feedback-popup-header .brand-logo,
    .feedback-parent-container .experience-feedback-popup-header .brand-logo {
        background: transparent;
        margin: 0px;
        cursor: pointer;
        width: auto;
        height: 24px;
    }

    .feedback-parent-container .feedback-popup-content-holder,
    .feedback-parent-container .feedback-manual-popup-content {
        padding: 18px 20px 0 20px;
    }

    .feedback-parent-container .feedback-manual-popup-content {
        padding-top: 10px;
    }

    .feedback-parent-container .feedback-popup-data h2,
    .feedback-manual-popup-content .feedback-manual-popup-data h2 {
        font-weight: 600 !important;
        font-size: 20px;
        line-height: 24px;
        color: #2D2D2D;
        margin-bottom: 10px;
    }

    .feedback-parent-container .feedback-popup-data textarea,
    .feedback-manual-popup-content .feedback-manual-popup-data textarea {
        width: 100%;
        resize: none;
        background: #F5F5F5;
        border: 1px solid rgba(153, 153, 153, 0.1);
        border-radius: 8px;
        padding: 12px;
        overflow: scroll;
        margin-top: 14px;
        font-family: inherit;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .feedback-parent-container .feedback-popup-data textarea::-webkit-scrollbar {
        display: none;
    }

    .feedback-parent-container .feedback-popup-buttons {
        margin-bottom: 24px;
        padding: 20px 20px 0 20px;
    }

    .feedback-parent-container .feedback-popup-buttons button {
        width: 50%;
        background: transparent;
        border: none;
        color: #666666;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        padding: 10px 16px;
        cursor: pointer;
    }

    .feedback-parent-container .feedback-popup-buttons button.feedback-submit-button {
        background: #D32F2F;
        border-radius: 74px;
        color: #FFFFFF;
    }

    .feedback-parent-container .feedback-popup-buttons button.feedback-submit-button[disabled] {
        opacity: 0.5;
    }

    .feedback-parent-container .flex-box {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* feedback success */
    .feedback-parent-container .feedback-success-modal {
        position: relative;
        width: 100vw;
        height: 100vh;
    }

    .feedback-parent-container .success-popup-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0.6;
        background-color: #808080;
        z-index: 99990;
    }

    .feedback-parent-container .feedback-success-modal-msg {
        position: fixed;
        background-color: white;
        color: black;
        width: 350px;
        height: 350px;
        padding: 40px;
        top: calc(50vh - 175px);
        left: calc(50vw - 175px);
        z-index: 99993;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }

    .feedback-parent-container .feedback-success-modal-msg .success-img {
        background: url('{$smarty.const.STATIC_URL}/newsletter/tick-success.gif') no-repeat center;
        background-size: contain;
        width: 180px;
        height: 180px;
    }

    @media (max-width: 768px) {
        .feedback-parent-container .feedback-cta-container .feedback-cta-button {
            font-size: 12px;
        }

        .feedback-parent-container .flex-box {
            align-items: center;
        }

        .experience-feedback-popup-holder .experience-feedback-popup-buttons button img {
            height: 25px;
            width: 25px;
        }
    }
</style>
