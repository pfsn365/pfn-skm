<style>
    .create-new-room-popup-container {
        background: #fff;
        top: 50%;
        left: 50%;
        position: fixed;
        z-index: 2002;
        transform: translateY(-50%) translateX(-50%);
        width: 430px;
        border-radius: 6px;
    }

    .verify-password-popup-container,
    .enter-username-popup-container {
        background: #fff;
        top: 50%;
        left: 50%;
        position: fixed;
        z-index: 2006;
        transform: translateY(-50%) translateX(-50%);
        width: 430px;
        border-radius: 6px;
    }

    #confirmation-box-container {
        background: #fff;
        top: 50%;
        left: 50%;
        position: fixed;
        z-index: 2006;
        transform: translateY(-50%) translateX(-50%);
        width: 330px;
        border-radius: 6px;
        text-align: center;
        padding: 16px;
    }

    #confirmation-box-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #confirmation-box-container .confirmation-box-text-container {
        padding: 8px 32px;
    }

    #confirmation-box-container .confirmation-box-btn {
        display: flex;
        width: 100%;
        padding: 10px 16px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 6px;
        border: 1px solid #37C77A;
        background: #37C77A;
        color: #fff;
        font-size: 15px;
        font-weight: 500;
    }

    #confirmation-box-container .confirmation-box-head-container {
        width: 100%;
        display: flex;
        justify-content: right;
        padding-bottom: 30px;
    }

    .join-room-popup-container {
        background: #fff;
        border-radius: 8px;
        width: 650px;
        height: 100%;
        border: 1px solid #2d2d2d;
    }

    .join-room-popup-container .popup-content {
        overflow: auto;
        max-height: 500px;
    }

    .select-teams-popup-container {
        background: #fff;
        top: 50%;
        left: 50%;
        position: fixed;
        z-index: 2002;
        transform: translateY(-50%) translateX(-50%);
        width: 600px;
        border-radius: 6px;
    }

    .afc-container .afc-container-header,
    .nfc-container .nfc-container-header {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3px 0;
        border-radius: 12px 12px 0 0;
    }

    .afc-container .afc-container-header {
        background-color: #CE1127;
    }

    .nfc-container .nfc-container-header {
        background-color: #003B74;
    }

    .create-new-room-popup-container .close-icon,
    .select-teams-popup-container .close-icon,
    .join-room-popup-container .close-icon,
    .verify-password-popup-container .close-icon,
    .enter-username-popup-container .close-icon,
    .confirmation-box-head-container .close-icon {
        top: unset;
        filter: brightness(0) saturate(100%) invert(39%) sepia(0%) saturate(1088%) hue-rotate(178deg) brightness(93%) contrast(76%);
    }

    .create-new-room-popup-container .popup-header,
    .select-teams-popup-container .popup-header,
    .join-room-popup-container .popup-header,
    .verify-password-popup-container .popup-header,
    .enter-username-popup-container .popup-header {
        padding: 12px 20px;
        display: flex;
        align-items: center;
        box-shadow: -1px 4px 20px rgba(0, 0, 0, 0.04);
    }

    .join-room-popup-container .refresh-btn {
        border: none;
        display: flex;
        align-items: center;
        color: #2d2d2d;
        padding: 5px 8px;
        border: 1px solid #2d2d2d;
        border-radius: 25px;
        font-size: 13px;
        font-weight: 500;
    }

    .join-room-popup-container .popup-header .header-text {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .join-room-popup-container .popup-header {
        justify-content: space-between;
    }

    .join-room-popup-container .search-room-input {
        position: relative;
        border-radius: 40px;
        background: #F5F5F5;
        border: unset;
        font-size: 14px;
        font-weight: 500;
        color: #999;
        padding: 10px 18px;
        width: 40%;
    }

    .create-new-room-popup-container .popup-content,
    .select-teams-popup-container .popup-content,
    .verify-password-popup-container .popup-content,
    .enter-username-popup-container .popup-content {
        padding: 20px;
    }

    .create-new-room-popup-container .popup-header .header-text,
    .select-teams-popup-container .popup-header .header-text,
    .join-room-popup-container .popup-header .header-text,
    .verify-password-popup-container .popup-header .header-text,
    .enter-username-popup-container .popup-header .header-text {
        color: #666;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .create-new-room-popup-container .popup-content form>div {
        padding: 10px 0;
    }

    .room-name-input-container,
    .user-name-input-container,
    .password-input-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #create-room-form .block-display {
        display: block;
    }

    #create-room-form .radio-group label,
    #create-room-form .radio-group input {
        vertical-align: middle;
    }

    #create-room-form .radio-group {
        display: flex;
        align-items: center;
        vertical-align: middle;
        gap: 12px;
    }

    #create-room-form .type-of-room-input,
    #create-room-form .max-player-container,
    #create-room-form .num-rounds-container {
        display: flex;
        align-items: center;
        vertical-align: middle;
        justify-content: space-between;
    }

    #create-room-form .room-name-input,
    #create-room-form .user-name-input,
    #create-room-form .room-password-input {
        width: 100%;
    }

    #create-room-form label {
        color: #2D2D2D;
        font-size: 14px;
        font-weight: 500;
    }

    #create-room-form input {
        border-radius: 2px;
        border: 1px solid #999;
        background: #FFF;
        padding: 8px 6px;
        font-size: 14px;
        color: #2D2D2D;
        font-weight: 400;

    }

    #create-room-form .submit-form-btn {
        display: flex;
        width: 100%;
        padding: 10px 16px;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        border: 1px solid #37C77A;
        background: #37C77A;
        color: #FFF;
        font-size: 14px;
        font-weight: 500;
    }

    #create-room-form input[type="radio"] {
        width: 20px;
        height: 20px;
        accent-color: #2d2d2d;
    }

    #create-room-form .player-controls {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    #create-room-form .player-controls button {
        padding: 5px 10px;
        cursor: pointer;
        border: none;
        border-radius: 3px;
        background-color: #2d2d2d;
        color: white;
        margin: 0 5px;
    }

    #create-room-form #maxPlayers,
    #create-room-form #numRounds {
        width: 50px;
        text-align: center;
    }

    #create-room-form .max-player-container button,
    #create-room-form .num-rounds-container button {
        width: 25px;
        height: 25px;
        flex-shrink: 0;
        border-radius: 50%;
        color: #2D2D2D;
        border: unset;
        background-color: #E9E9E9;
        font-size: 15px;
        font-weight: 600;
    }

    #create-room-form input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .conference-teams-wrapper {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        text-align: center;
    }

    .conference-teams-wrapper .afc-container,
    .conference-teams-wrapper .nfc-container {
        width: 50%;
        border-radius: 12px;
        border: 1px solid #E2E2E2;
        background: #FFF;
        box-shadow: 0px 4px 4px 0px #E9F2FA;
    }

    .afc-container-teams,
    .nfc-container-teams {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 11px;
        gap: 10px;
    }

    .afc-container-teams .team-container,
    .nfc-container-teams .team-container {
        padding: 8px;
        border-radius: 2px;
        border: 1px solid #E2E2E2;
        color: #999999;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;
        align-items: center;
        cursor: pointer;
    }

    .afc-container-teams .selected,
    .nfc-container-teams .selected {
        border: 1px solid #37C77A;
        background: #E9F7F2;
    }

    .afc-container-teams .disabled,
    .nfc-container-teams .disabled {
        cursor: not-allowed;
        opacity: 0.3;
    }

    .select-teams-popup-container .update-button-conatainer {
        width: 100%;
        padding-top: 16px;
    }

    .select-teams-popup-container .update-button-conatainer button {
        width: 100%;
        display: flex;
        padding: 10px 16px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        color: #fff;
        border-radius: 6px;
        border: 1px solid #37C77A;
        background: #37C77A;
        font-size: 15px;
        font-weight: 500;
    }

    .join-room-popup-container .empty-room-list-text {
        display: flex;
        justify-content: center;
        padding: 16px;
        color: #666;
        font-size: 16px;
        font-weight: 500;
    }

    .verify-password-popup-container .popup-content,
    .enter-username-popup-container .popup-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .verify-password-popup-container .room-password-input,
    .enter-username-popup-container .room-password-input {
        width: 100%;
        padding: 8px 6px;
        color: #2d2d2d;
        height: 45px;
        border-radius: 2px;
        border: 1px solid #999;
        background: #FFF;
        font-size: 14px;
        font-weight: 400;
    }

    .verify-password-popup-container .submit-password-button,
    .enter-username-popup-container .submit-password-button {
        width: 100%;
        padding: 10px 16px;
        gap: 10px;
        border-radius: 6px;
        background: #37C77A;
        color: #fff;
        border: unset;
        font-size: 15px;
        font-weight: 500;
    }

    @media (max-width: 768px) {

        .create-new-room-popup-container {
            top: unset;
            left: unset;
            position: fixed;
            bottom: 0;
            z-index: 2002;
            width: 100%;
            margin: unset;
            transform: unset;
        }

        .join-room-popup-container {
            width: 100%;
            margin: unset;
            transform: unset;
        }

        .join-room-popup-container table .join-room-btn {
            border: unset;
            width: 78px;
            padding: 4px 6px;
        }

        .join-room-popup-container table td {
            padding: 4px 7px;
            font-size: 14px;
        }

        .verify-password-popup-container {
            width: 100%;
        }

        .join-room-popup-container .popup-content {
            max-height: 400px;
            overflow: auto;
        }

        .select-teams-popup-container {
            transform: unset;
            top: unset;
            left: unset;
            bottom: 0;
            width: 100%;
        }

        .afc-container-teams,
        .nfc-container-teams {
            padding: 6px 3px;
        }

        .afc-container-teams .team-container,
        .nfc-container-teams .team-container {
            padding: 4px 2px;
        }

        #confirmation-box-container {
            width: 100%;
        }

        .room-search-container {
            width: 100%;
            padding: 5px 10px;

        }

        .join-room-popup-container .search-room-input {
            width: 100%;
            right: unset;
        }

        .join-room-popup-container table tr th:last-child {
            background: #f5f5f5;
        }

        .join-room-popup-container table tr :last-child {
            position: sticky;
            right: 0;
        }

        .join-room-popup-container .refresh-btn {
            margin-left: 10px;
        }

        .verify-password-popup-container, .enter-username-popup-container {
            width: 100%;
        }
    }
</style>
