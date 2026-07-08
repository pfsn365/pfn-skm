<style>
    .multi-user-chat {
        width: 350px;
        display: flex;
        flex-direction: column;
        background: #FFF;
        box-shadow: 0px 4px 4px 0px #E9F2FA;
        border-radius: 8px 8px 5px 5px;
        border: 1px solid #080A3C;
    }

    .multi-user-chat .multi-user-chat-header {
        background-color: #0857C3;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 6px 6px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-style: italic;
        cursor: pointer;
    }

    .multi-user-chat .multi-user-chat-header .chat-header-count-text-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .multi-user-chat-header .chat-header-count-text-container .unread-chat-count {
        height: 20px;
        padding: 8px;
        color: #fff;
        background: #D32F2F;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 25px;
        font-size: 12px;
        line-height: 18px;
        font-style: normal;
    }

    .multi-user-chat .multi-user-chat-content {
        overflow: auto;
        height: 415px;
        border: 1px solid #E9E9E9;
        display: flex;
        flex-direction: column;
        justify-content: end;
        padding: 16px;
    }

    .multi-user-chat-messages .message-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .multi-user-chat-messages .curr-user-message-container {
        flex-direction: row-reverse;
    }

    .multi-user-chat-messages .message-container .msg-sender-img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        border: 1px solid #EDEAEA;
    }

    .multi-user-chat-messages .message-time-ago {
        font-size: 10px;
        font-weight: 400;
        line-height: 15px;
        letter-spacing: 0em;
        text-align: left;
        color: #999999;
    }

    .multi-user-chat-messages .message-sender-info-container {
        align-items: center;
        display: flex;
        gap: 4px;
    }

    .multi-user-chat-messages .message-sender-name {
        font-size: 12px;
        font-weight: 600;
        color: #2d2d2d;
    }


    .multi-user-chat .multi-user-chat-messages {
        max-height: 450px;
        overflow: auto;
        max-height: 450px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .multi-user-chat .multi-user-chat-input {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        gap: 10px;
        justify-content: space-between;
    }

    .multi-user-chat .multi-user-chat-input .user-img {
        height: 32px;
        width: 32px;
        border: 1px solid green;
        border-radius: 50%;
    }

    .multi-user-chat .user-msg-input {
        border: 1px solid #9999991A;
        background-color: #f5f5f5;
        border-radius: 20px;
        padding: 8px 12px;
        width: 100%;
    }

    .multi-user-chat .multi-user-chat-input .user-msg-send-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #0857C3;
        border: unset;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .multi-user-chat .multi-user-chat-messages .message-text {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #2d2d2d;
        word-wrap: break-word;
    }

    .multi-user-chat-messages .message-container .system-message-container {
        margin: 0 auto;
        align-items: center;
        display: flex;
    }

    .multi-user-chat-messages .message-container .system-message-container .system-message-text {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
    }

    .multi-user-chat .multi-user-chat-header .close-icon {
        top: unset;
    }

    .multi-user-chat .multi-user-chat-header .upside-down-button {
        border: unset;
        text-align: center;
        display: flex;
        align-items: center;
    }

    .upside-down-button .transform-btn-upsidedown {
        transform: rotate(180deg);
    }

    .draft-chat-container {
        position: fixed;
        right: 20%;
        bottom: 100px;
        z-index: 2005;
    }

    .draft-chat-container .multi-user-chat-content {
        max-height: 300px;
    }

    .user-msg-input-container,
    .user-msg-input-container input {
        width: 100%;
    }

    .multi-user-chat .message-info-container {
        display: flex;
        flex-direction: column;
        max-width: calc(100% - 42px);
    }

    @media (max-width: 768px) {
        .chat-btn-container .unread-chat-count {
            background: #080A3C;
            font-size: 10px;
            line-height: 15px;
            height: 20px;
            padding: 8px;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 25px;
            font-style: normal;
            position: absolute;
            left: 18px;
            top: 0;
        }

        .multi-user-chat .multi-user-chat-header {
            height: 50px;
        }

        .multi-user-chat .multi-user-chat-content {
            max-height: unset;
            height: 345px;
        }

        .multi-user-chat .multi-user-chat-input {
            height: 50px;
        }
    }
</style>