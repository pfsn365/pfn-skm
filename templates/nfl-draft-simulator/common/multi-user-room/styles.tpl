<style>
    .multi-user-room {
        width: 70%;
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-radius: 8px;
        border: 1px solid #E9E9E9;
        background: #FFF;
        box-shadow: 0px 4px 4px 0px #E9F2FA;
    }

    .room-name-text {
        color: #2D2D2D;
        font-size: 16px;
        text-transform: capitalize;
    }

    .room-id-info-container,
    .room-password-info-container {
        display: flex;
        gap: 4px;
    }

    .room-id-copy,
    .room-password-copy {
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .room-header {
        display: flex;
        justify-content: space-between;
        padding: 10px 16px;
    }

    .draft-now-btn {
        background: #37C77A;
        padding: 10px 40px;
        border-radius: 6px;
        color: #fff;
        border: unset;
        font-size: 15px;
        font-weight: 500;
    }

    .draft-now-btn.disabled {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.4;
    }

    .room-info-container {
        display: flex;
        gap: 8px;
    }

    .room-id-info-label,
    .room-password-info-label {
        color: #999;
        font-size: 14px;
        font-weight: 400;
    }

    .room-id-info-text,
    .room-password-info-text {
        color: #474747;
        font-size: 14px;
        font-weight: 400;
    }

    .multi-user-room .room-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .circle-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 45px;
        justify-content: center;
        padding: 8px;
        cursor: pointer;
        gap: 3px;
    }

    .circle {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #D9D9D9;
    }

    .room-content {
        min-height: 350px;
        overflow: auto;
        height: 380px;
    }

    .room-footer {
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
    }

    .room-footer-text {
        color: #666;
        font-size: 13px;
        font-weight: 400;
        width: 70%;
    }

    .multi-user-room table td {
        color: #2D2D2D;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding: 4px;
        text-align: center;
    }

    .room-controls {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .room-settings-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .room-settings-container .share-btn {
        padding: 8px 16px;
        border: 1px solid #D1D1D1;
        border-radius: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 4px;
    }

    .room-controls .room-controls-options {
        background-color: #E9E9E9;
        z-index: 2;
        width: 150px;
        position: absolute;

        border-radius: 6px;
        border: 1px solid #E9E9E9;
        background: #FFF;
        box-shadow: -1px 4px 20px 0px rgba(0, 0, 0, 0.04);
        top: 16px;
        left: -135px;
    }

    .room-controls .room-controls-options .room-controls-option {
        display: inline-block;
        padding: 8px 12px;
        width: 100%;
        border-radius: 6px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
    }

    .draft-start-counter {
        background: #FFF8E0;
        color: #E3B100;
        font-size: 14px;
        line-height: 21px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
    }

    .draft-start-counter.urgent {
        background: #FFF8F8;
        color: #D32F2F;
    }

    .room-name-container {
        max-width: 280px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
        .multi-user-room-section .multi-user-room {
            width: 100%;
        }

        .room-info-container {
            flex-direction: column;
            gap: 2px;
        }

        .room-footer .draft-now-btn {
            display: none;
        }

        .room-footer-text {
            width: 100%;
        }

        .selected-teams-container .selected-team-container img {
            height: 16px;
            width: 24px;
        }

        .selected-teams-container .selected-team-container .edit-icon {
            height: 16px;
            width: 16px;
        }

        .multi-user-room-container {
            margin-top: 68px;
            padding: unset;
        }

        .room-settings-container {
            align-items: flex-start;
        }

        .room-settings-container .share-btn {
            padding: 6px 16px;
        }

        .circle-container {
            height: 35px;
            padding: unset;
        }

        .multi-user-room .room-info {
            gap: 14px;
        }

        .room-name-container {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .multi-user-room {
            border: unset;
            box-shadow: unset;
            border-radius: unset;
        }

        .room-footer {
            position: fixed;
            bottom: 116px;
            background: #f5f5f5;
            margin: 0 10px;
        }

        .multi-user-room-container {
            border: unset;
        }

        .draft-start-counter.main {
            position: fixed;
            bottom: 190px;
            width: 100%;
        }

        .room-content {
            height: 400px;
        }
    }
</style>
