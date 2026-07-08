<style>
    .join-room-popup-container table {
        align-items: center;
        text-align: center;
    }

    .join-room-popup-container table thead {
        background-color: #F5F5F5;
    }

    .join-room-popup-container table thead th {
        color: #2D2D2D;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    .join-room-popup-container table thead td {
        color: #2D2D2D;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    .join-room-popup-container table td {
        padding: 12px;
    }

    .join-room-popup-container table th {
        padding: 4px;
    }

    .join-room-popup-container table .join-room-btn {
        display: inline-flex;
        padding: 6px 12px;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        background: #37C77A;
        color: #fff;
        border: unset;
        font-weight: 500;
        width: 90px;
    }

    .join-room-popup-container table .room-full-btn {
        background: #FFF8F8;
        color: #D32F2F;
        cursor: not-allowed;
    }

    .join-room-popup-container table .room-drafting {
        background: #FFF8EB;
        color: #EEA517;
        cursor: not-allowed;
    }

    .join-room-popup-container .room-limit-drafting {
        color: #EEA517;
    }

    .join-room-popup-container .room-limit-full {
        color: #D32F2F;
    }

    .overlay2 {
        width: 100%;
        height: 100%;
        position: fixed;
        background: #000;
        opacity: 0.5;
        left: 0;
        top: 50px;
        z-index: 2004;
    }

    .multi-user-room-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        width: 100%;
        flex-direction: column;
        padding: 20px;
        border: 1px solid #E9E9E9;
        background: #F6F7FF;
    }

    .multi-user-room-section {
        display: flex;
        justify-content: center;
        gap: 20px;
        width: 100%;
    }

    .multi-user-room-header {
        color: #172B4D;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        text-transform: capitalize;
        padding: 8px;
        border-left: 3px solid #172B4D;
    }

    .room-players-table {
        margin-bottom: 100px;
    }

    .room-content .room-players-table .selected-teams-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        flex-direction: row;
        gap: 1px;
    }

    .room-content .room-players-table .selected-teams-container .selected-team-container {
        background-color: #FFF;
        stroke-width: 1px;
        stroke: #F5F5F5;
        box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.08);
        height: 32px;
        width: 32px;
        height: 31px;
        width: 31px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        border-radius: 50%;
    }

    .room-content .room-players-table .selected-teams-container button {
        padding: unset;
    }

    .room-content .room-players-table .no-team-selected-text {
        color: #999;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        border-radius: 4px;
        background-color: #F5F5F5;
        padding: 2px 6px;
    }

    .room-players-table .current-player-table-row {
        background: #EEFFF6;
    }

    .room-players-table .player-table-row {

        border-bottom: 1px solid #E9E9E9;
        height: 56px;
    }

    .room-players-table thead {
        background-color: #F5F5F5;
    }

    .player-img-container {
        background-color: #fff;
        border: 1px solid #E9E9E9;
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }

    .room-players-table .curr-user-player-img-container {
        border: 1px solid #29BA20;
    }


    .player-details-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 16px;
    }


    .room-players-table thead th {
        padding: 8px;
        font-size: 13px;
        font-weight: 500;
    }

    .room-players-table thead th:nth-child(2) {
        text-align: left;
        padding-left: 16px;
    }

    .room-players-table .player-table-row td {
        vertical-align: middle;
    }

    .remove-icon {
        cursor: pointer;
        filter: brightness(0) saturate(100%) invert(39%) sepia(0%) saturate(1088%) hue-rotate(178deg) brightness(93%) contrast(76%);
    }

    .multi-user-room-section .select-team-btn {
        display: inline-flex;
        padding: 6px 12px;
        align-items: center;
        gap: 4px;
        border-radius: 30px;
        background: #37C77A;
        color: #fff;
        border: unset;
    }

    .copy-btn-tooltip {
        position: fixed;
        background-color: #222;
        color: #fff;
        padding: 2px 4px;
        border-radius: 5px;
        z-index: 999;
        font-size: 9px;
        opacity: 0.7;
    }

    @media (max-width: 768px) {

        .multi-user-room-section .select-team-btn {
            padding: 6px 8px;
        }

        .multi-user-room table td {
            padding: unset;
        }

        .room-players-table thead th {
            padding: 4px 0;
        }

        .room-bottom-controls {
            position: fixed;
            bottom: 60px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            background: white;
            padding: 12px 24px;
            align-items: center;
        }

        .room-bottom-controls .chat-btn-container {
            width: 35%;
            position: relative;
        }

        .room-bottom-controls .chat-btn-container .chat-btn {
            border-radius: 28px;
            border: 1px solid #000;
            background: #FFF;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
            display: inline-flex;
            padding: 6px 4px;
            align-items: center;
            justify-content: center;
            gap: 4px;
            width: 100%;
        }

        .room-bottom-controls .draft-now-btn-container {
            width: 58%;
        }

        .multi-user-room-section .multi-user-chat-popup {
            display: block;
            position: fixed;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2005;
            width: 100%;
            height: 450px;
        }

        .room-bottom-controls .draft-now-btn-container .draft-now-btn {
            width: 65%;
            border: unset;
            display: flex;
            width: 100%;
            padding: 10px 16px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 6px;
            background: #37C77A;
            color: #fff;
        }

        .room-footer-text span {
            font-size: 14px;
        }
    }
</style>
