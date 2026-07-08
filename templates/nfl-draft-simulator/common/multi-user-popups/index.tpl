{include file="./styles.tpl"}

<template id="create-new-room-popup">
    <div class="create-new-room-popup-container">
        <div class="popup-header">
            <span class="header-text">CREATE A NEW ROOM</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="popup-content">
            <form id="create-room-form">
                <div class="room-name-input-container">
                    <label class="block-display" for="roomName">Room Name:</label>
                    <input type="text" class="room-name-input" id="roomName" name="roomName"
                        placeholder="Enter Room Name" required>
                </div>

                <div class="user-name-input-container">
                    <label class="block-display" for="userName">User Name:</label>
                    <input type="text" class="user-name-input" id="userName" name="userName" maxlength="5"
                        placeholder="Character Limit is 5" required>
                </div>

                <div class="type-of-room-input">
                    <label>Type of Room:</label><br>
                    <div class="radio-group">
                        <div class="radio-group-container">
                            <input type="radio" id="publicRoom" name="roomType" value="public" checked>
                            <label for="publicRoom">Public</label>
                        </div>
                        <div class="radio-group-container">
                            <input type="radio" id="privateRoom" name="roomType" value="private">
                            <label for="privateRoom">Private</label>
                        </div>
                    </div>
                </div>

                <div class="password-input-container hidden" id="passwordField">
                    <label class="block-display" for="userName">Password:</label>
                    <input type="password" class="room-password-input" id="password" name="password"
                        placeholder="Type Room password" autocomplete="new-password">
                </div>

                <div class="max-player-container">
                    <label for="maxPlayers">Maximum Players:</label>
                    <div>
                        <button class="max-player-decrement-btn" type="button">-</button>
                        <input type="number" value="2" id="maxPlayers" name="maxPlayers" min="2" max="32">
                        <button class="max-player-increment-btn" type="button">+</button>
                    </div>
                </div>

                <div class="num-rounds-container">
                    <label for="numRounds">Number of Rounds:</label>
                    <div>
                        <button class="rounds-decrement-btn" type="button">-</button>
                        <input type="number" value="1" id="numRounds" name="numRounds" min="1" max="7">
                        <button class="rounds-increment-btn" type="button">+</button>
                    </div>
                </div>

                <div class="error-message-container">
                </div>

                <button class="submit-form-btn" type="submit">Create Room</button>
            </form>
        </div>
    </div>
</template>

<template id="select-teams-popup">
    <div class="select-teams-popup-container">
        <div class="popup-header">
            <span class="header-text">SELECT YOUR TEAM</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="draft-start-counter">
            <span class="draft-start-counter-text">THE DRAFT BEGINS IN <span class="countdown-timer"></span></span>
        </div>
        <div class="popup-content">
            <div class="conference-teams-wrapper">
                <div class="afc-container">
                    <div class="afc-container-header">
                        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/afc-logo.png" width="46" height="21"
                            alt="conference-logo">
                    </div>
                    <div class="afc-container-teams"></div>
                </div>
                <div class="nfc-container">
                    <div class="nfc-container-header">
                        <img src="{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/nfc-logo.png" width="46" height="21"
                            alt="conference-logo">
                    </div>
                    <div class="nfc-container-teams"></div>
                </div>
            </div>
            <div class="update-button-conatainer">
                <button class="update-teams-button">Confirm</button>
            </div>
        </div>
    </div>
</template>

<template id="confirmationBox">
    <div class="confirmation-box-content" id="confirmation-box-container">
        <div class="confirmation-box-head-container">
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="confirmation-box-image-container hidden">
            <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="40"
                height="40" alt="confirmation-image">
        </div>
        <div class="confirmation-box-text-container">
            <span class="confirmation-box-text">Are you sure?</span>
        </div>
        <div class="confirmation-box-btn-container">
            <button class="confirmation-box-btn" id="confirmBtn">Confirm</button>
        </div>
    </div>
</template>

<template id="join-room-popup">
    <div class="join-room-popup-container">
        <div class="popup-header">
            <span class="header-text">Available Rooms <span class="available-room-text"></span> <button
                    class="refresh-btn" onclick="refreshAvailableRooms()">Refresh
                </button></span>
            {if $is_desktop}
                <input class="search-room-input hidden" title="Search Room with room name"
                    placeholder="Enter Room ID" />
            {/if}
        </div>
        {if !$is_desktop}
            <div class="room-search-container">
                <input class="search-room-input hidden" title="Search Room with room name"
                    placeholder="Enter Room ID" />
            </div>
        {/if}
        <div class="popup-content">
        </div>
    </div>
</template>

<template id="verify-password-popup">
    <div class="verify-password-popup-container">
        <div class="popup-header">
            <span class="header-text">password</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="popup-content">
        </div>
    </div>
</template>

<template id="enter-username-popup">
    <div class="enter-username-popup-container">
        <div class="popup-header">
            <span class="header-text">User Name</span>
            <button class="close-icon">
                <img src="{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png" width="24"
                    height="24" alt="close-icon">
            </button>
        </div>
        <div class="popup-content">
        </div>
    </div>
</template>
