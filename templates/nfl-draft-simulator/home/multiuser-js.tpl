<script>
    let countdownTimerIdList = [];

    function loadSocketIO() {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initSocket() {
        try {
            await loadSocketIO();

            socket = io("https://wscr.profootballnetwork.com");
            console.log("Socket connected");
            initSocketEvents();

        } catch (err) {
            console.error("Failed to load Socket.IO", err);
        }
    }
    
    function initSocketEvents() {
        socket.on("all_rooms", function(data) {
            addRoomsTable(data);
            showRoomSearchBox(data);
            if (paramRoomId && joinRoomFlag) {
                joinRoomBtnWithRoomId(paramRoomId);
            }
        });

        socket.on("room_joining_failed", (data) => {
            console.log("joining failed data->", data);
            infoPopup = document.getElementById("multi-user-info-container").content.cloneNode(true);
            infoPopup = infoPopup.querySelector(".multi-user-info-container-popup");
            if (infoPopup) {
                let infoText = infoPopup.querySelector(".info-text");
                if (infoText) {
                    if (data.error === "draft_in_progress") {
                        infoText.innerHTML = "Draft is in progress, please try again Later";
                    } else if (data.error === "room_full") {
                        infoText.innerHTML = "Room is currently full, please try again Later";
                    } else {
                        infoText.innerHTML = "Room not found, please join another room";
                    }
                }

                let closePopupBtn = infoPopup.querySelector(".close-info-popup-btn");
                closePopupBtn.removeAttribute("onclick");
                closePopupBtn.setAttribute("onclick", "closeInfoPopup(true)");
            }

            closeEnterUserNamePopup();
            closeVerifyPasswordPopup();
            closeJoinRoomPopup();

            document.body.appendChild(infoPopup);
            showOverlay(true);
        });

        socket.on("kicked-out", () => {
            showHomePage();
        });

        socket.on("removed_from_room", () => {
            infoPopup = document.getElementById("multi-user-info-container").content.cloneNode(true);
            infoPopup = infoPopup.querySelector(".multi-user-info-container-popup");
            if (infoPopup) {
                let infoText = infoPopup.querySelector(".info-text");
                if (infoText) {
                    infoText.innerHTML = "You have been removed from the draft room";
                }

                let roomListBtn = infoPopup.querySelector(".room-list-btn");
                if (roomListBtn) {
                    addClass(roomListBtn, "hidden");
                }
            }

            document.body.appendChild(infoPopup);
            showOverlay(true);

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });

        socket.on("pause-list", (list) => {
            console.log("received sim pause list->", list);
            multiUserDraftPauseList = list;
            let participantsContainer = $(".multi-user-remove-participants-popup");
            if (participantsContainer) {
                let allStatus = participantsContainer.querySelectorAll(".resume-status span");
                if (allStatus.length) {
                    for (let i = 0; i < allStatus.length; i++) {
                        if (multiUserDraftPauseList.includes(allStatus[i].dataset.socketid)) {
                            allStatus[i].innerHTML = "Yes";
                        } else {
                            allStatus[i].innerHTML = "No";
                        }
                    }
                }
            }
        });

        socket.on("simulation-input", (data) => {
            console.log("received sim inputs->", data);
            data.teamsList.forEach(team => {
                let newTeamLogo = team.teamLogo.replace("/mockdraft/nfl-team-logos/", "");
                newTeamLogo = newTeamLogo.replace("gif", "png");
                team.teamLogo = newTeamLogo;
            });

            data.picksList.forEach(pick => {
                let team = data.teamsList.find(team => team.shortName === pick.shortName);
                if (team) {
                    pick["teamLogo"] = team.teamLogo;
                }
            });
            picksList = data.picksList;
            teamsList = data.teamsList;
            teamNeedsList = JSON.parse(JSON.stringify(data.teamsList));
            playersList = data.playersList;
            playersListAll = JSON.parse(JSON.stringify(data.playersList));

            for (let i = 0; i < roundends.length; i++) {
                roundends[i] = data.simConstants.roundends[i];
            }
        });

        socket.on("start_simulation_banner", () => {
            clearCountdownTimers();
            if (currentRoomData.roomType === "private") {
                let counterHoldersList = $all(".draft-start-counter");
                counterHoldersList.forEach(holder => {
                    removeClass(holder, "hidden");
                })
            }

            const countDownBannerList = $all(".draft-start-counter .countdown-timer");
            if (countDownBannerList.length) {
                countDownBannerList.forEach((countDownTimer) => {
                    addClass(countDownTimer, "banner");
                    countDownTimer.dataset.minutes = 0;
                    countDownTimer.dataset.seconds = 5;
                    const timerId = setInterval(() => {
                        if (countDownTimer) {
                            const minutes = parseInt(countDownTimer.dataset.minutes);
                            const seconds = parseInt(countDownTimer.dataset.seconds);
                            if (minutes > 0 && seconds >= 0) {
                                if (seconds >= 10) {
                                    countDownTimer.innerHTML = minutes + ":" + seconds;
                                } else {
                                    countDownTimer.innerHTML = minutes + ":0" + seconds;
                                }
                            } else if (minutes === 0 && seconds > 0) {
                                if (seconds >= 10) {
                                    countDownTimer.innerHTML = "0:" + seconds;
                                } else {
                                    countDownTimer.innerHTML = "0:0" + seconds;
                                }

                                if (seconds <= 10) {
                                    let parent = countDownTimer.closest(".draft-start-counter");
                                    if (parent && !hasClass(parent, "urgent")) {
                                        addClass(parent, "urgent");
                                    }
                                }
                            } else if (minutes === 0 && seconds === 0) {
                                countDownTimer.innerHTML = "0:00";
                            }

                            if (seconds > 0) {
                                countDownTimer.dataset.seconds -= 1;
                            } else if (seconds === 0 && minutes > 0) {
                                countDownTimer.dataset.seconds = 59;
                                countDownTimer.dataset.minutes -= 1;
                            } else if (seconds === 0 && minutes === 0) {
                                countDownTimer.dataset.seconds = 0;
                                countDownTimer.dataset.minutes = 0;
                                clearCountdownTimers();
                            }

                        }
                    }, 1000, countDownTimer);

                    countdownTimerIdList.push(timerId);
                })
            }
        });

        socket.on("simulation_started", function() {
            addStartMockDraftFn();
            updateMultiUserNextPickAndTeamNeeds();
        });

        socket.on("room_joined", function(data) {
            currentUserSocketId = data.socketId;
            let newSearchParam = "roomId=" + data.roomId;
            let currentUrl = window.location.href;
            if (currentUrl.includes("?")) {
                if (currentUrl.includes("roomId")) {
                    currentUrl = currentUrl.replace(/(roomId=)[^\&]+/, '$1' + data.roomId);
                } else {
                    currentUrl += "&" + newSearchParam;
                }
            } else {
                currentUrl += "?" + newSearchParam;
            }
            window.history.replaceState('', '', currentUrl);
            if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
                let dashboardEventData = {
                    userId: mdsLoggedInUserId,
                    draftType: "multiUser",
                    properties: [{
                        propertyName: "multiUserDraftsJoinedCount",
                        propertyValue: 1,
                    }, ]
                }
                sendUserDashboardData(dashboardEventData);
            }
        });

        socket.on("chat", function(data) {
            console.log("chat received->", data);
            if (data["type"] == "msg") {
                addMessageToChat(data.msg, data.userName);
            } else if (data["type"] == "join_room") {
                addSystemMessageToChat(createYouText(data["socketId"], data["userName"]) + " has joined the room");
            } else if (data["type"] == "leave_room") {
                addSystemMessageToChat(data["userName"] + " has left the room");
                removeUserDraftInfo(data.socketId);
                setUsersLeftInfo(data.socketId);
            } else if (data["type"] == "remove_from_room") {
                addSystemMessageToChat(data["removedUserName"] + " was removed from the room");
                removeUserDraftInfo(data.socketId);
                setUsersLeftInfo(data.socketId);
            } else if (data["type"] == "proposal_offer") {
                let teamName = getTeamNameFromSocket(data["socketId"]);
                addSystemMessageToChat(teamName + " is creating a trade proposal");
            } else if (data["type"] == "proposal_pause") {
                let teamName = getTeamNameFromSocket(data["socketId"]);
                addSystemMessageToChat(teamName + " has paused the draft");
            } else if (data["type"] == "proposal_resume") {
                let teamName = getTeamNameFromSocket(data["socketId"]);
                addSystemMessageToChat(teamName + " has resumed the draft");
            } else if (data["type"] == "proposal_cancelled") {
                let teamName = getTeamNameFromSocket(data["socketId"]);
                addSystemMessageToChat(teamName + " has cancelled the trade proposal");
            } else if (data["type"] == "trade_offer") {
                addSystemMessageToChat(data["offeringTeam"] + " has proposed a trade to " + data["toTeam"]);
            } else if (data["type"] == "counter_offer") {
                addSystemMessageToChat(data["toTeam"] + " has received a counter offer from " + data[
                    "offeringTeam"]);
            } else if (data["type"] == "trade_offer_accepted") {
                addSystemMessageToChat(data["offeringTeam"] + "'s trade proposal has been accepted by " + data[
                    "toTeam"]);
            } else if (data["type"] == "counter_offer_accepted") {
                addSystemMessageToChat(data["offeringTeam"] + "'s counter offer has been accepted by " + data[
                    "toTeam"]);
            } else if (data["type"] == "trade_offer_rejected") {
                addSystemMessageToChat(data["offeringTeam"] + "'s trade proposal has been rejected by " + data[
                    "toTeam"]);
            } else if (data["type"] == "counter_offer_rejected") {
                addSystemMessageToChat(data["offeringTeam"] + "'s counter offer has been rejected by " + data[
                    "toTeam"]);
            }

            if (IS_DESKTOP) {
                let upsideDownButton = $('.multi-user-chat-header .upside-down-button');
                if (upsideDownButton) {
                    let upsideDownIcon = upsideDownButton.querySelector("img");
                    if (hasClass(upsideDownIcon, "transform-btn-upsidedown")) {
                        let chatCountContainer = $(".multi-user-chat .unread-chat-count");
                        if (chatCountContainer) {
                            let count = parseInt(chatCountContainer.dataset.count);
                            chatCountContainer.innerHTML = count + 1;
                            chatCountContainer.dataset.count = count + 1;
                            removeClass(chatCountContainer, "hidden");
                        }
                    }
                }
            } else {
                let chatContainer = $(".multi-user-chat.multi-user-chat-popup");
                if (chatContainer && hasClass(chatContainer, "hidden")) {
                    let chatCountContainer = $(".chat-btn-container .unread-chat-count");
                    if (chatCountContainer) {
                        let count = parseInt(chatCountContainer.dataset.count);
                        chatCountContainer.innerHTML = count + 1;
                        chatCountContainer.dataset.count = count + 1;
                        removeClass(chatCountContainer, "hidden");
                    }
                }
            }
        });

        socket.on("room_created", function(roomData) {
            let newSearchParam = "roomId=" + roomData.roomId;
            let currentUrl = window.location.href;
            if (currentUrl.includes("?")) {
                if (currentUrl.includes("roomId")) {
                    currentUrl = currentUrl.replace(/(roomId=)[^\&]+/, '$1' + roomData.roomId);
                } else {
                    currentUrl += "&" + newSearchParam;
                }
            } else {
                currentUrl += "?" + newSearchParam;
            }
            window.history.replaceState('', '', currentUrl);
            multiUserDraft = true;
            currentUserIsAdmin = true;
            currentUserSocketId = roomData.members[0].socketId;
            setCurrentRoomData(roomData);
            window.addEventListener("beforeunload", disconnectUser);
            if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
                let dashboardEventData = {
                    userId: mdsLoggedInUserId,
                    draftType: "multiUser",
                    properties: [{
                        propertyName: "multiUserDraftsHostedCount",
                        propertyValue: 1,
                    }, ]
                }
                sendUserDashboardData(dashboardEventData);
            }
        });

        socket.on("error", function(errMsg) {
            console.log(errMsg);
        });

        socket.on("room_updated", function(data) {
            console.log("room-updated-data->", data);
            setCurrentRoomData(data);
            if (!multiUserDraft) {
                multiUserDraft = true;
                closeJoinRoomPopup();
                closeVerifyPasswordPopup();
                closeEnterUserNamePopup();
            }
        });

        socket.on("drafting_info", (pickNumber) => {
            console.log("drafting info received->", pickNumber);
            updateCurrentPick(pickNumber);
            fillDraftingUserInfo("Drafting");
        });

        socket.on("pick_processed_with_trades", function(data) {
            console.log("received trades for user team->", data);
            let fillOffers = true;
            var addPlayerIcon = $(".players-list .add-player");
            if (addPlayerIcon && !hasClass(addPlayerIcon, "hidden")) {
                fillOffers = false;
            }
            if (!offersList.length && fillOffers) {
                enableSimProposeTradeBtn();
                let currentPickContainer = $(".pick-number-" + data.pickNumber);
                if (currentPickContainer && userSelectedTeams.includes(data.currentTeamName)) {
                    updateCurrentPick(data.pickNumber);
                    multiUserSystemOffersList = data.availableTrades;
                    offersList = [];
                    let currentTeam = teamsList.find(team => team.shortName === data.currentTeamName);
                    data.availableTrades.forEach(teamTrade => {
                        let offerList = [];
                        let allUserPicksToTrade = [];
                        let offeringTeam = teamsList.find(team => team.shortName === teamTrade
                            .offeringTeamShortName);
                        teamTrade.offerList.forEach(tradePick => {
                            let offeredDraftPick = offeringTeam.draftPicks.find(teamPick =>
                                teamPick
                                .number === tradePick
                                .number && teamPick.futureRound === tradePick.futureRound &&
                                teamPick.futurePickYear ===
                                tradePick.futurePickYear);
                            offerList.push(offeredDraftPick);
                        });

                        teamTrade.allUserPicksToTrade.forEach(tradePick => {
                            let currentTeamOfferedDraftPick = currentTeam.draftPicks.find(
                                teamPick =>
                                teamPick.number ===
                                tradePick.number && teamPick.futureRound === tradePick
                                .futureRound && teamPick
                                .futurePickYear === tradePick.futurePickYear && teamPick
                                .futureOriginalTeam === tradePick.futureOriginalTeam);
                            allUserPicksToTrade.push(currentTeamOfferedDraftPick);
                        });

                        offeringTeam.offerList = offerList;
                        offeringTeam.allUserPicksToTrade = allUserPicksToTrade;
                        offeringTeam.offerPlayersList = [];
                        offeringTeam.allUserPlayersToTrade = [];
                        offersList.push(offeringTeam);
                        let counteredTeamIndex = counteredTeams.findIndex(teamName => teamName ===
                            offeringTeam.shortName);
                        if (!(counteredTeamIndex > -1)) {
                            counteredTeams.push(offeringTeam.shortName);
                        }
                    });


                    showOffer(currentPickContainer.dataset.shortname, data.pickNumber, currentTeam.teamLogo, 0,
                        true);
                    unhideUserSelectionIcon();
                    disableResumeDraftBtn();
                    socket.emit("proposal-resume", {
                        socketId: currentUserSocketId,
                        roomId: currentRoomData.roomId,
                        runSim: false,
                    });
                }
            }
        });

        socket.on("disconnect", () => {});

        socket.on("pick_processed_with_user_selection", function(data) {
            console.log("user needs to choose a player", data);
            enableSimProposeTradeBtn();
            updateCurrentPick(data.pickNumber);
            unhideUserSelectionIcon();
            disableResumeDraftBtn();
            socket.emit("proposal-resume", {
                socketId: currentUserSocketId,
                roomId: currentRoomData.roomId,
                runSim: false,
            });
            if (!IS_DESKTOP && currentSection !== "pool") {
                toggleSimView("pool", true);
            }
        });

        socket.on("auto_pick_player", function() {
            let timerContainer = $(".simulation-management-buttons-container .pick-timer-container");
            if (timerContainer) {
                removeClass(timerContainer, "urgent");
                timerContainer.style.display = "none";
                let pickTimer = timerContainer.querySelector(".pick-timer");
                if (pickTimer) {
                    let intervalId = parseInt(pickTimer.dataset.intervalid);
                    if (intervalId) {
                        pickTimer.dataset.intervalid = "";
                        clearInterval(intervalId);
                    }
                }
            }

            let allPlayers = $(".players-holder .players-list");
            if (allPlayers && allPlayers.children.length) {
                console.log("all players");
                let randomIndex = Math.floor(Math.random() * 5);
                let player = allPlayers.children[randomIndex];
                if (player) {
                    console.log("player=>", player);
                    let selectionBtn = player.querySelector(".player-buttons-container .add-player");
                    if (selectionBtn) {
                        console.log("player clicked=>");
                        selectionBtn.click();
                    }
                }
            }
        })

        socket.on("set_trading_timer", function() {
            console.log("trading text setting event");
            let timerContainer = $(".simulation-management-buttons-container .pick-timer-container");
            if (timerContainer) {
                let infoContainer = timerContainer.querySelector(".drafting-info");
                if (infoContainer) {
                    infoContainer.innerHTML = "Trade Deadline";
                }
            }
        });

        socket.on("remove_user_pick_timer", function() {
            console.log("remove user pick timer event");
            let timerContainer = $(".simulation-management-buttons-container .pick-timer-container");
            if (timerContainer) {
                removeClass(timerContainer, "urgent");
                timerContainer.style.display = "none";
                timerContainer.style.backgroundColor = "#FFF";
                let infoContainer = timerContainer.querySelector(".drafting-info");
                if (infoContainer) {
                    infoContainer.innerHTML = "";
                }

                let pickTimer = timerContainer.querySelector(".pick-timer");
                if (pickTimer) {
                    let intervalId = parseInt(pickTimer.dataset.intervalid);
                    if (intervalId) {
                        pickTimer.dataset.intervalid = "";
                        console.log("pick timer removed");
                        clearInterval(intervalId);
                    }
                }
            }

            offersList.length = 0;
            multiUserSystemOffersList.length = 0;
            multiUserCounterOffersList.length = 0;
            multiUserTradeOffersList.length = 0;
            proposedTeamsData.length = 0;
            currentOfferTeam = "";
            counteredTeams.length = 0;
            disableShowOffersBtn();
            disableResumeDraftBtn();
            clearOffers();

            let proposalContainer = $(".trade-proposal-all-teams-conatiner");
            if (proposalContainer) {
                proposalContainer.remove();
            }

            var overlay = $(".overlay");
            if (overlay && !checkForAlreadyOpenPopup()) {
                addClass(overlay, "hidden");
            }
        });

        socket.on("all_offers_expired", function() {
            let timerContainer = $(".simulation-management-buttons-container .pick-timer-container");
            if (timerContainer) {
                removeClass(timerContainer, "urgent");
                timerContainer.style.display = "none";
                timerContainer.style.backgroundColor = "#FFF";
                let infoContainer = timerContainer.querySelector(".drafting-info");
                if (infoContainer) {
                    infoContainer.innerHTML = "";
                }

                let pickTimer = timerContainer.querySelector(".pick-timer");
                if (pickTimer) {
                    let intervalId = parseInt(pickTimer.dataset.intervalid);
                    if (intervalId) {
                        pickTimer.dataset.intervalid = "";
                        console.log("pick timer removed");
                        clearInterval(intervalId);
                    }
                }
            }
            console.log("current pick is mine=>", currentPickIsMine);
            tradeProposalResponseContainer = document.getElementById("trade-proposal-response").content.cloneNode(
                true);
            tradeProposalResponseContainer = tradeProposalResponseContainer.querySelector(
                ".trade-proposal-response-popup");
            if (tradeProposalResponseContainer) {
                let headerTextContainer = tradeProposalResponseContainer.querySelector(
                    ".trade-proposal-response-header-text");
                if (headerTextContainer) {
                    headerTextContainer.innerHTML = "Trade Deadline";
                }

                let proposalDescriptionContainer = tradeProposalResponseContainer.querySelector(
                    ".trade-proposal-response-container .trade-proposal-response-description");
                if (proposalDescriptionContainer) {
                    if (currentPickIsMine) {
                        proposalDescriptionContainer.innerHTML =
                            "The system has drafted the player as you were not able to select a player in the allotted time";
                    } else {
                        proposalDescriptionContainer.innerHTML =
                            "Your trade offer(s) have elapsed as the time allotted to complete the trade is over";
                    }
                }

                if (currentPickIsMine || offersList.length || proposedTeamsData.length) {
                    let overlay = $(".overlay");
                    if (overlay) {
                        removeClass(overlay, "hidden");
                    }
                    document.body.appendChild(tradeProposalResponseContainer);

                    setTimeout(() => {
                        let responsePopup = $(".trade-proposal-response-popup");
                        if (responsePopup) {
                            responsePopup.remove();

                            let overlay = $(".overlay");
                            if (overlay && !checkForAlreadyOpenPopup()) {
                                addClass(overlay, "hidden");
                            }
                        }
                    }, 3500);
                }
            }
            offersList.length = 0;
            multiUserSystemOffersList.length = 0;
            multiUserCounterOffersList.length = 0;
            multiUserTradeOffersList.length = 0;
            proposedTeamsData.length = 0;
            currentOfferTeam = "";
            counteredTeams.length = 0;
            disableShowOffersBtn();
            disableResumeDraftBtn();
            clearOffers();
            let proposalContainer = $(".trade-proposal-all-teams-conatiner");
            if (proposalContainer) {
                proposalContainer.remove();
            }
            var overlay = $(".overlay");
            if (overlay && !checkForAlreadyOpenPopup()) {
                addClass(overlay, "hidden");
            }
        });

        socket.on("pick_processed_with_player_selection", function(data) {
            console.log("player selected data received", data);
            fillMultiUserPlayerInPick(data);
            fillDraftingUserInfo("Drafted");
            checkTradeProposalPicks(data.pickNumber);
        });

        socket.on("prev_pick_processing_finished", function() {
            socket.emit("process_simulation", currentRoomData.roomId);
        });

        socket.on("simulation_finished", function() {
            console.log("simulation finished event received");
            trackGAEventForPage("multi_user_draft_end");
            stopCollectiongDashboardTimeSpentData();
            disableResumeDraftBtn();
            disableShowOffersBtn();
            hideUserSelectionIcon();
            if (!IS_DESKTOP) {
                showFinalTrades();
            } else {
                showFinalResult();
            }
            // addFeedbackForm();
            window.scrollTo(0, 0);
            if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
                stopCollectiongDashboardTimeSpentData();
                let dashboardEventData = {
                    userId: mdsLoggedInUserId,
                    draftType: "multiUser",
                    properties: [{
                            propertyName: "totalRounds",
                            propertyValue: rounds,
                        },
                        {
                            propertyName: "mostPlayersDraftedInSingleDraft",
                            propertyValue: checkMostDraftedPlayersCountInSingleDraft(),
                        },
                        {
                            propertyName: "mostTradesInSingleDraft",
                            propertyValue: checkMostTradesInSingleDraft(),
                        },
                        {
                            propertyName: "biggestReach",
                            propertyValue: 1
                        },
                        {
                            propertyName: "biggestSteal",
                            propertyValue: 1,
                        },
                        {
                            propertyName: "draftsFinishedCount",
                            propertyValue: 1,
                        },
                    ],
                    biggestReach: getBiggestReach(),
                    biggestSteal: getBiggestSteal(),
                }
                sendUserDashboardData(dashboardEventData);
            }
        });

        socket.on("populate_trade_data", function(data) {
            suggestProposalChange(data);
            let currentPickContainer = $(".pick-number-" + data.pickNumber);
            if (currentPickContainer) {
                updateCurrentPick(data.pickNumber);

                if (currentPickContainer.dataset.shortname === data.offeringTeamShortName) {
                    let currentTeamNameTemp = data.currentTeamName;
                    let allUserPicksToTradeTemp = data.allUserPicksToTrade;
                    let allUserPlayersToTradeTemp = data.allUserPlayersToTrade;
                    data.currentTeamName = data.offeringTeamShortName;
                    data.allUserPicksToTrade = data.offerList;
                    data.allUserPlayersToTrade = data.offerPlayersList;
                    data.offeringTeamShortName = currentTeamNameTemp;
                    data.offerList = allUserPicksToTradeTemp;
                    data.offerPlayersList = allUserPlayersToTradeTemp;
                }

                let currentTeam = teamsList.find(team => team.shortName === data.currentTeamName);
                let offerList = [];
                let allUserPicksToTrade = [];
                let offeringTeam = teamsList.find(team => team.shortName === data.offeringTeamShortName);
                data.offerList.forEach(tradePick => {
                    let offeredDraftPick = offeringTeam.draftPicks.find(teamPick => teamPick.number ===
                        tradePick
                        .number && teamPick.futureRound === tradePick.futureRound && teamPick
                        .futurePickYear ===
                        tradePick.futurePickYear && teamPick.futureOriginalTeam === tradePick
                        .futureOriginalTeam);
                    offerList.push(offeredDraftPick);
                });

                data.allUserPicksToTrade.forEach(tradePick => {
                    let currentTeamOfferedDraftPick = currentTeam.draftPicks.find(teamPick => teamPick
                        .number ===
                        tradePick.number && teamPick.futureRound === tradePick.futureRound &&
                        teamPick
                        .futurePickYear === tradePick.futurePickYear && teamPick
                        .futureOriginalTeam === tradePick.futureOriginalTeam && teamPick
                        .futureOriginalTeam === tradePick.futureOriginalTeam);
                    allUserPicksToTrade.push(currentTeamOfferedDraftPick);
                });

                offeringTeam.offerList = offerList;
                offeringTeam.allUserPicksToTrade = allUserPicksToTrade;
                offeringTeam.offerPlayersList = data.offerPlayersList || [];
                offeringTeam.allUserPlayersToTrade = data.allUserPlayersToTrade || [];

                multiUserCurrentOfferTeam = offeringTeam;
                populateAcceptedOffer();
            }
        });

        socket.on("pick_processed_with_system_trades", function(data) {
            console.log("system trades received->", data);
            offersList.length = 0;
            multiUserSystemOffersList.length = 0;
            multiUserCounterOffersList.length = 0;
            multiUserTradeOffersList.length = 0;
            let currentPickContainer = $(".pick-number-" + data.pickNumber);
            if (currentPickContainer) {
                updateCurrentPick(data.pickNumber);
                offersList = [];
                let currentTeam = teamsList.find(team => team.shortName === data.currentTeamName);
                let offerList = [];
                let allUserPicksToTrade = [];
                let offeringTeam = teamsList.find(team => team.shortName === data.availableTrades[0]
                    .offeringTeamShortName);
                data.availableTrades[0].offerList.forEach(tradePick => {
                    let offeredDraftPick = offeringTeam.draftPicks.find(teamPick => teamPick.number ===
                        tradePick
                        .number && teamPick.futureRound === tradePick.futureRound && teamPick
                        .futurePickYear ===
                        tradePick.futurePickYear && teamPick.futureOriginalTeam === tradePick
                        .futureOriginalTeam);
                    offerList.push(offeredDraftPick);
                });

                data.availableTrades[0].allUserPicksToTrade.forEach(tradePick => {
                    let currentTeamOfferedDraftPick = currentTeam.draftPicks.find(teamPick => teamPick
                        .number ===
                        tradePick.number && teamPick.futureRound === tradePick.futureRound &&
                        teamPick
                        .futurePickYear === tradePick.futurePickYear && teamPick
                        .futureOriginalTeam === tradePick.futureOriginalTeam);
                    allUserPicksToTrade.push(currentTeamOfferedDraftPick);
                });

                offeringTeam.offerList = offerList;
                offeringTeam.allUserPicksToTrade = allUserPicksToTrade;
                offeringTeam.offerPlayersList = [];
                offeringTeam.allUserPlayersToTrade = [];
                offersList.push(offeringTeam);

                multiUserCurrentOfferTeam = offeringTeam;
                populateAcceptedOffer();

                fillMultiUserPlayerInPick(data);
            }

            offersList.length = 0;
            multiUserSystemOffersList.length = 0;
            multiUserCounterOffersList.length = 0;
            multiUserTradeOffersList.length = 0;
        });

        socket.on("counter-offer", function(data) {
            console.log("counter offer received data->", data);
            let counteringTeamIndex = counteredTeams.findIndex(teamName => teamName === data
                .offeringTeamShortName);
            if (counteringTeamIndex > -1) {
                counteredTeams.splice(counteringTeamIndex, 1);
            }

            let proposedTeamIndex = proposedTeamsData.findIndex(propsedTeamData => {
                let teamName = Object.keys(propsedTeamData)[0];
                if (teamName === data
                    .offeringTeamShortName || teamName === data.currentTeamName) {
                    return true;
                }
            });
            if (proposedTeamIndex > -1) {
                proposedTeamsData.splice(proposedTeamIndex, 1);
            }

            let tradeOfferIndex = multiUserTradeOffersList.findIndex(offer => offer.offeringTeamShortName ===
                data
                .offeringTeamShortName || offer.currentTeamName === data.offeringTeamShortName);
            if (tradeOfferIndex > -1) {
                multiUserTradeOffersList.splice(tradeOfferIndex, 1);
            }

            let counterOfferIndex = multiUserCounterOffersList.findIndex(offer => offer
                .offeringTeamShortName ===
                data.offeringTeamShortName || offer.currentTeamName === data.offeringTeamShortName);
            if (counterOfferIndex > -1) {
                multiUserCounterOffersList.splice(counterOfferIndex, 1);
            }

            showUserOffers(data, "CounterOffer");
        });

        socket.on("trade-offer", function(data) {
            console.log("trade offer data received->", data);
            showUserOffers(data, "TradeOffer");
        });

        socket.on("counter-offer-accepted", function(data) {
            console.log("counter-offer-accepted data received->", data);
            handleAcceptedOffer(data, "Counter Offer");
        });

        socket.on("trade-offer-accepted", function(data) {
            if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
                let dashboardEventData = {
                    userId: mdsLoggedInUserId,
                    draftType: "multiUser",
                    properties: [{
                        propertyName: "tradesCompletedCount",
                        propertyValue: 1,
                    }]
                }
                sendUserDashboardData(dashboardEventData);
            }
            console.log("trade-offer-accepted data received->", data);
            handleAcceptedOffer(data, "Trade Proposal");
        });

        socket.on("handle-accumulated-offers", function() {
            handleAccumulatedOffers();
        });

        socket.on("counter-offer-rejected", function(data) {
            console.log("counter offer rejected data received", data);
            handleRejectedOffer(data, "Counter Offer");
        });

        socket.on("trade-offer-rejected", function(data) {
            console.log("trade offer rejected data received", data);
            handleRejectedOffer(data, "Trade Proposal");
        });

        socket.on("offer-reverted", function(data) {
            console.log("offer-reverted-data received->", data);
            let offerIndex = offersList.findIndex(offer => data.offeringTeamShortName === offer
                .shortName);
            if (offerIndex > -1) {
                offersList.splice(offerIndex, 1);
            }

            let tradeOfferIndex = multiUserTradeOffersList.findIndex(offer => data.offeringTeamShortName ===
                offer
                .offeringTeamShortName);
            if (tradeOfferIndex > -1) {
                multiUserTradeOffersList.splice(tradeOfferIndex, 1);
            }

            let counterOfferIndex = multiUserCounterOffersList.findIndex(offer => data.offeringTeamShortName ===
                offer.offeringTeamShortName);
            if (counterOfferIndex > -1) {
                multiUserCounterOffersList.splice(counterOfferIndex, 1);
            }

            let counteredTeamIndex = counteredTeams.findIndex(teamName => data.offeringTeamShortName ===
                teamName);
            if (counteredTeamIndex > -1) {
                counteredTeams.splice(counteredTeamIndex, 1);
            }
            tradeProposalResponseContainer = document.getElementById("trade-proposal-response").content
                .cloneNode(
                    true);
            tradeProposalResponseContainer = tradeProposalResponseContainer.querySelector(
                ".trade-proposal-response-popup");
            if (tradeProposalResponseContainer) {
                removeClass(tradeProposalResponseContainer, "hidden");
                let proposalDescriptionContainer = tradeProposalResponseContainer.querySelector(
                    ".trade-proposal-response-container .trade-proposal-response-description");
                if (proposalDescriptionContainer) {

                    if (data.reason == "player-selected") {
                        proposalDescriptionContainer.innerHTML = "Trade offer from " + data
                            .offeringTeamShortName +
                            " has expired as the user has already drafted a player";
                    } else if (data.reason == "offer-accepted") {
                        proposalDescriptionContainer.innerHTML = "Trade offer from " + data
                            .offeringTeamShortName +
                            " has expired as the user has traded this pick with " + data
                            .acceptedOfferTeamShortName;
                    } else if (data.reason == "offer-accepted-by-other") {
                        proposalDescriptionContainer.innerHTML = "Trade offer from " + data
                            .offeringTeamShortName +
                            " has expired since the user's offer was accepted by " + data
                            .acceptedOfferTeamShortName;
                    } else if (data.reason == "user-disconnected") {
                        proposalDescriptionContainer.innerHTML = "Trade offer from " + data
                            .offeringTeamShortName +
                            " has expired since the user has been disconnected";
                    }
                }

                let offersContainer = $(".offer-container");
                if (offersContainer) {
                    addClass(offersContainer, "hidden");
                    if (!multiUserCounterOffersList.length && !multiUserTradeOffersList.length) {
                        disableShowOffersBtn();
                    }
                }

                document.body.appendChild(tradeProposalResponseContainer);
                let overlay = $(".overlay");
                if (overlay) {
                    removeClass(overlay, "hidden");
                }

                setTimeout(() => {
                    let responsePopup = $(".trade-proposal-response-popup");
                    if (responsePopup) {
                        responsePopup.remove();

                        let overlay = $(".overlay");
                        if (overlay && !checkForAlreadyOpenPopup()) {
                            addClass(overlay, "hidden");
                        }
                    }
                }, 3500);
            }
        });
    }

    function sendData(formData) {
        let generatedRoomId = String(Date.now());
        let isPublicRoom = formData["roomType"] == "public";

        let createRoomData = {
            roomName: formData["roomName"],
            roomId: generatedRoomId,
            roomType: formData["roomType"],
            roomLimit: formData["maxPlayers"],
            rounds: formData["numRounds"],
            password: isPublicRoom ? "" : formData["password"],
            admin: formData["currentUserName"],
            createdAt: Date.now(),
        };

        socket.emit("create_room", createRoomData);
    }

    function updateTeams(teamList, roomId) {
        userSelectedTeams = teamList;
        socket.emit("update_teams", {
            teams: teamList,
            roomId: roomId
        });
    }

    function createYouText(socketId, userNameToCheck) {
        if (socketId == currentUserSocketId) return "You";
        return userNameToCheck;
    }

    function sendStartDraftEvent(e) {
        socket.emit("start_simulation_banner", currentRoomData.roomId);
        addClass(e.target, "disabled");
    }

    function showRoomsList() {
        let infoPopup = $(".multi-user-info-container-popup");
        if (infoPopup) {
            infoPopup.remove();
        }

        showOverlay();
        showAvailableRoomsContainer();
    }

    function closeInfoPopup(flag) {
        let infoPopup = $(".multi-user-info-container-popup");
        if (infoPopup) {
            infoPopup.remove();
        }

        showOverlay();
        if (!flag) {
            showHomePage();
        }
    }

    updateMultiUserNextPickAndTeamNeeds = (pickNumber) => {
        console.log("updating next pick and team needs");
        updateNextPick(pickNumber);
        updateTeamNeeds(pickNumber);
    };

    function setUsersLeftInfo(socketId) {
        usersLeftInfo.push([socketId, currentMultiUserPick]);
    }

    function getTeamNameFromSocket(socketId) {
        let member = currentRoomData.members.find(member => member.socketId === socketId);
        if (member) {
            return member.teams[0];
        } else {
            return "user";
        }
    }

    function sendMessage(message) {
        if (message) {
            socket.emit("chat", {
                roomId: currentRoomData["roomId"],
                msg: message,
                userName: currentUserName,
                type: "msg",
            });
        }
    }

    function sendJoiningData(roomId, userName, password) {
        socket.emit("join_room", {
            roomId: roomId,
            userName: userName,
            password: password
        });
    }

    function getAllRoomsData() {
        socket.emit("get_all_rooms");
    }

    function fillDraftingUserInfo(draftText) {
        if (currentMultiUserPick > pickstart) {
            let currentPickContainer = $(".pic-container.pick-number-" + currentMultiUserPick);
            let currentPickTeamName = picksList[currentMultiUserPick - 1].currentTeam.shortName;
            let userName;
            for (let i = 0; i < currentRoomData.members.length; i++) {
                if (currentRoomData.members[i].teams.includes(currentPickTeamName)) {
                    userName = currentRoomData.members[i].userName;
                }
            }

            if (currentPickContainer && userName) {
                let draftInfoContainer = currentPickContainer.querySelector(".drafting-info-container");
                if (draftInfoContainer) {
                    removeClass(draftInfoContainer, "hidden");
                    let draftTextHolder = draftInfoContainer.querySelector(".draft-text");
                    if (draftTextHolder) {
                        draftTextHolder.innerHTML = draftText;
                    }

                    let draftByHolder = draftInfoContainer.querySelector(".draft-by");
                    if (draftByHolder) {
                        draftByHolder.innerHTML = userName;
                    }
                }

                if (draftText === "Drafting") {
                    let timerContainer = $(".simulation-management-buttons-container .pick-timer-container");
                    if (timerContainer) {
                        let pickTimer = timerContainer.querySelector(".pick-timer");
                        if (pickTimer && pickTimer.dataset.intervalid) {
                            return;
                        }
                        removeClass(timerContainer, "urgent");
                        timerContainer.style.display = "flex";
                        timerContainer.style.backgroundColor = "#FFF8E0";
                        let infoContainer = timerContainer.querySelector(".drafting-info");
                        if (infoContainer) {
                            infoContainer.innerHTML = "Drafting: " + userName;
                        }

                        if (pickTimer) {
                            pickTimer.innerHTML = "1:15";
                            pickTimer.dataset.minutes = 1;
                            pickTimer.dataset.seconds = 15;

                            let intervalId = setInterval(() => {
                                let minutes = parseInt(pickTimer.dataset.minutes);
                                let seconds = parseInt(pickTimer.dataset.seconds) - 1;

                                if (minutes === 1 && seconds > 0) {
                                    pickTimer.dataset.minutes = 1;
                                    pickTimer.dataset.seconds = seconds;
                                    if (seconds >= 10) {
                                        pickTimer.innerHTML = 1 + ":" + (seconds);
                                    } else {
                                        pickTimer.innerHTML = 1 + ":0" + (seconds);
                                    }
                                } else if (minutes === 1 && seconds === 0) {
                                    pickTimer.dataset.minutes = 0;
                                    pickTimer.dataset.seconds = 59;
                                    pickTimer.innerHTML = "0:59";
                                } else if (minutes === 0 && seconds > 0) {
                                    pickTimer.dataset.seconds = seconds;
                                    if (seconds >= 10) {
                                        pickTimer.innerHTML = "0:" + (seconds);
                                    } else {
                                        let timerContainer = $(
                                            ".simulation-management-buttons-container .pick-timer-container"
                                        );
                                        if (timerContainer) {
                                            addClass(timerContainer, "urgent");
                                        }
                                        pickTimer.innerHTML = "0:0" + (seconds);
                                    }
                                } else if (minutes === 0 && seconds === 0) {
                                    let intervalId = parseInt(pickTimer.dataset.intervalid);
                                    if (intervalId) {
                                        pickTimer.dataset.intervalid = "";
                                        clearInterval(intervalId);
                                    }
                                    let timerContainer = $(
                                        ".simulation-management-buttons-container .pick-timer-container");
                                    if (timerContainer) {
                                        removeClass(timerContainer, "urgent");
                                        timerContainer.style.display = "none";
                                    }
                                }
                            }, 1000, pickTimer);

                            pickTimer.dataset.intervalid = intervalId;
                        }
                    }
                }
            } else if (draftText === "Drafted") {
                offersList.length = 0;
                multiUserSystemOffersList.length = 0;
                multiUserCounterOffersList.length = 0;
                multiUserTradeOffersList.length = 0;
            }
        }
    }

    function removeDraftingUserInfo() {
        let currentPickContainer = $(".pic-container.pick-number-" + currentMultiUserPick);
        if (currentPickContainer) {
            let draftInfoContainer = currentPickContainer.querySelector(".drafting-info-container");
            if (draftInfoContainer) {
                addClass(draftInfoContainer, "hidden");
            }
        }
    }


    function disconnectUser() {
        socket.disconnect(true);
    }

    updateCurrentPick = (pickNumber) => {
        currentMultiUserPick = pickNumber;
        if (pickNumber != 1) {
            let previoudPick = picksList[pickNumber - 2];
            previoudPick.onTheClock = false;
        }

        let currentPick = picksList[pickNumber - 1];
        if (userSelectedTeams.includes(currentPick.currentTeam.shortName)) {
            currentPickIsMine = true;
        } else {
            currentPickIsMine = false;
        }
        currentPick.onTheClock = true;
        updateMultiUserNextPickAndTeamNeeds(pickNumber);

        var tradeProposalBtn = $(".simulation-management-buttons-container .user-proposal");
        if (tradeProposalBtn && !tradeProposalBtn.disabled) {
            checkPicksForUserSelectedTeams(pickNumber - 1, tradeProposalBtn);
        }
    }

    function checkTradeProposalPicks(pickNumber) {
        let proposalContainer = $(".trade-proposal-all-teams-conatiner");
        if (proposalContainer) {
            let allPicksHolders = proposalContainer.querySelectorAll(".picks-input-holder");
            if (allPicksHolders.length) {
                for (let i = 0; i < allPicksHolders.length; i++) {
                    if (parseInt(allPicksHolders[i].dataset.number) === pickNumber) {
                        suggestProposalChange("", pickNumber);
                        break;
                    }
                }
            }
        }
    }

    function suggestProposalChange(data, pickNumber) {
        let proposalContainer = $(".trade-proposal-all-teams-conatiner");
        let info;
        let opposingTeamName;
        if (proposalContainer) {
            let opposingTeamContainer = proposalContainer.querySelector(
                ".competing-teams-container .opposing-team-container");
            if (opposingTeamContainer && opposingTeamContainer.dataset.teamname) {
                opposingTeamName = opposingTeamContainer.dataset.teamname;
                if (data && (opposingTeamName === data.offeringTeamShortName || opposingTeamName === data
                        .currentTeamName)) {
                    info = opposingTeamName + "'s picks have been traded, kindly create a fresh proposal";
                } else if (pickNumber) {
                    info = opposingTeamName + " has already drafted a player for Pick " + pickNumber +
                        ", kindly create a fresh proposal";
                }

                if (info) {
                    let header = proposalContainer.querySelector(".proposal-header");
                    if (header) {
                        let closeBtn = header.querySelector(".close-btn");
                        if (closeBtn) {
                            addClass(closeBtn, "hidden");
                        }

                        let allChild = proposalContainer.children;
                        if (allChild.length) {
                            for (let i = allChild.length - 1; i >= 0; i--) {
                                if (allChild[i] !== header) {
                                    allChild[i].remove();
                                }
                            }
                        }

                        let infoContainer = document.createElement("div");
                        addClass(infoContainer, "info-container");
                        let infoHolder = document.createElement("span");
                        addClass(infoHolder, "info-holder");
                        infoContainer.appendChild(infoHolder);
                        infoHolder.innerHTML = info;
                        proposalContainer.appendChild(infoContainer);

                        setTimeout(() => {
                            let proposalContainer = $(".trade-proposal-all-teams-conatiner");
                            if (proposalContainer) {
                                proposalContainer.remove();
                            }

                            var overlay = $(".overlay");
                            if (overlay && !checkForAlreadyOpenPopup()) {
                                addClass(overlay, "hidden");
                            }
                        }, 3500);
                    }
                }
            }
        }
    }



    function checkUserPicksAreAvailable(data, type) {
        console.log("last acceptedoffer->", lastAcceptedOffer);
        if (lastAcceptedOffer) {
            console.log("last acceptedoffer first pick->", lastAcceptedOffer.allUserPicksToTrade[0].number);
            let allUserPicks = data.allUserPicksToTrade;
            let offerRejected = false;
            for (let i = 0; i < allUserPicks.length; i++) {
                let pickAvailable = false;
                lastAcceptedOffer.allUserPicksToTrade.forEach(pick => {
                    if (pick.number ===
                        allUserPicks[i]
                        .number && pick.futureRound === allUserPicks[i].futureRound && pick
                        .futurePickYear ===
                        allUserPicks[i].futurePickYear && pick.futureOriginalTeam === allUserPicks[i]
                        .futureOriginalTeam) {
                        pickAvailable = true;
                    }
                });

                console.log("common pick available->", pickAvailable);
                if (pickAvailable) {
                    offerRejected = true;
                    let rejectedOffer = {
                        allUserPicksToTrade: "",
                        offerList: "",
                        currentTeamName: "",
                        offeringTeamShortName: "",
                        pickNumber: currentMultiUserPick,
                        roomId: currentRoomData.roomId,
                    };

                    rejectedOffer.allUserPicksToTrade = data.allUserPicksToTrade;
                    rejectedOffer.offerList = data.offerList;
                    rejectedOffer.currentTeamName = data.currentTeamName;
                    rejectedOffer.offeringTeamShortName = data.offeringTeamShortName;

                    if (type === "CounterOffer") {
                        socket.emit("counter-offer-rejected", rejectedOffer);
                    } else if ("TradeOffer") {
                        socket.emit("trade-offer-rejected", rejectedOffer);
                    }

                    break;
                }
            }

            if (offerRejected) {
                return true;
            }

            return false;
        } else if (lastPlayerSelectedForPick) {
            let allUserPicks = data.allUserPicksToTrade;
            let offerRejected = false;
            for (let i = 0; i < allUserPicks.length; i++) {
                let pickAvailable = false;
                if (allUserPicks[i].number === lastPlayerSelectedForPick) {
                    pickAvailable = true;
                }

                console.log("common pick available->", pickAvailable);
                if (pickAvailable) {
                    offerRejected = true;
                    let rejectedOffer = {
                        allUserPicksToTrade: "",
                        offerList: "",
                        currentTeamName: "",
                        offeringTeamShortName: "",
                        pickNumber: currentMultiUserPick,
                        roomId: currentRoomData.roomId,
                    };

                    rejectedOffer.allUserPicksToTrade = data.allUserPicksToTrade;
                    rejectedOffer.offerList = data.offerList;
                    rejectedOffer.currentTeamName = data.currentTeamName;
                    rejectedOffer.offeringTeamShortName = data.offeringTeamShortName;

                    if (type === "CounterOffer") {
                        socket.emit("counter-offer-rejected", rejectedOffer);
                    } else if ("TradeOffer") {
                        socket.emit("trade-offer-rejected", rejectedOffer);
                    }

                    break;
                }
            }

            if (offerRejected) {
                return true;
            }

            return false;
        }
    }

    function showUserOffers(data, type) {
        if (checkUserPicksAreAvailable(data, type)) return;
        let counteredTeamIndex = counteredTeams.findIndex(teamName => data.currentTeamName === teamName || data
            .offeringTeamShortName === teamName);
        if (counteredTeamIndex > -1) {
            counteredTeams.splice(counteredTeamIndex, 1);
        }

        let proposalContainer = $(".trade-proposal-all-teams-conatiner");
        let opposingTeamName;
        if (proposalContainer) {
            let opposingTeamContainer = proposalContainer.querySelector(
                ".competing-teams-container .opposing-team-container");
            if (opposingTeamContainer && opposingTeamContainer.dataset.teamname) {
                opposingTeamName = opposingTeamContainer.dataset.teamname;
                if (data && (opposingTeamName === data.offeringTeamShortName || opposingTeamName === data
                        .currentTeamName)) {
                    proposalContainer.remove();
                }
            }
        }

        let currentPickContainer = $(".pick-number-" + data.pickNumber);
        if (currentPickContainer) {
            updateCurrentPick(data.pickNumber);
            let counterOffer = {
                offerList: [],
                allUserPicksToTrade: [],
                offeringTeamShortName: "",
            };
            let currentTeam = teamsList.find(team => team.shortName === data.currentTeamName);
            let offerList = [];
            let allUserPicksToTrade = [];
            let offeringTeam = teamsList.find(team => team.shortName === data.offeringTeamShortName);
            data.offerList.forEach(tradePick => {
                let offeredDraftPick = offeringTeam.draftPicks.find(teamPick => teamPick.number ===
                    tradePick
                    .number && teamPick.futureRound === tradePick.futureRound && teamPick
                    .futurePickYear ===
                    tradePick.futurePickYear && teamPick.futureOriginalTeam === tradePick
                    .futureOriginalTeam
                );
                offerList.push(offeredDraftPick);
            });

            data.allUserPicksToTrade.forEach(tradePick => {
                let currentTeamOfferedDraftPick = currentTeam.draftPicks.find(teamPick => teamPick
                    .number ===
                    tradePick.number && teamPick.futureRound === tradePick.futureRound && teamPick
                    .futurePickYear === tradePick.futurePickYear && teamPick
                    .futureOriginalTeam === tradePick.futureOriginalTeam);
                if (currentTeamOfferedDraftPick) {
                    allUserPicksToTrade.push(currentTeamOfferedDraftPick);
                } else {
                    pickNotFound = true;
                }
            });

            offeringTeam.offerList = offerList;
            offeringTeam.allUserPicksToTrade = allUserPicksToTrade;
            counterOffer.offerList = data.offerList;
            counterOffer.allUserPicksToTrade = data.allUserPicksToTrade;
            counterOffer.offerPlayersList = data.offerPlayersList || [];
            counterOffer.allUserPlayersToTrade = data.allUserPlayersToTrade || [];
            counterOffer.offeringTeamShortName = data.offeringTeamShortName;
            counterOffer.currentTeamName = data.currentTeamName;
            if (type === "CounterOffer") {
                multiUserCounterOffersList.push(counterOffer);
            } else if (type === "TradeOffer") {
                multiUserTradeOffersList.push(counterOffer);
            }
            offeringTeam.offerPlayersList = data.offerPlayersList || [];
            offeringTeam.allUserPlayersToTrade = data.allUserPlayersToTrade || [];
            offersList.push(offeringTeam);
            let counteredTeamIndex = counteredTeams.findIndex(teamName => teamName === offeringTeam.shortName);
            if (!(counteredTeamIndex > -1)) {
                counteredTeams.push(offeringTeam.shortName);
            }

            let offersContainer = $(".offer-container");
            if (offersContainer) {
                let offerNumberHolder = offersContainer.querySelector(".offer-number");
                if (offerNumberHolder) {
                    if (!multiUserCounterOffersList.length) {
                        offerNumberHolder.innerHTML = "You have " + offersList.length + " Trade Offer(s)";
                    } else if (offersList.length === multiUserCounterOffersList.length) {
                        offerNumberHolder.innerHTML = "You have " + multiUserCounterOffersList.length +
                            " Counter Offer(s)";
                    } else if (offersList.length > multiUserCounterOffersList.length) {
                        offerNumberHolder.innerHTML = "You have " + (offersList.length -
                                multiUserCounterOffersList
                                .length) + " Trade Offer(s) & " +
                            multiUserCounterOffersList.length + " Counter Offer(s)";
                    }
                }

                if (offersContainer.classList.contains("hidden")) {
                    showOffer(currentTeam.shortName, data.pickNumber, currentTeam.teamLogo, 0, true);
                } else {
                    var btnNextHolder = offersContainer.querySelector(".nav-next");
                    if (btnNextHolder) {
                        if (hasClass(btnNextHolder, "disabled")) {
                            removeClass(btnNextHolder, "disabled");
                            btnNextHolder.disabled = false;
                        }
                    }
                }
            } else {
                showOffer(currentTeam.shortName, data.pickNumber, currentTeam.teamLogo, 0, true);
            }
        }
    }

    function removeCommonOffers(data) {
        let remainingOffers = [];
        offersList.forEach(offer => {
            let commonFound = false;
            for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
                if (!commonFound) {
                    for (let j = 0; j < data.offerList.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.offerList[j].number && offer
                            .allUserPicksToTrade[i].futureRound === data.offerList[j].futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.offerList[j]
                            .futurePickYear &&
                            offer.allUserPicksToTrade[i].futureOriginalTeam === data.offerList[j]
                            .futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }

                if (!commonFound) {
                    for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.allUserPicksToTrade[j]
                            .number && offer
                            .allUserPicksToTrade[i].futureRound === data.allUserPicksToTrade[j]
                            .futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.allUserPicksToTrade[j]
                            .futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === data
                            .allUserPicksToTrade[j].futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }
            }

            if (!commonFound) {
                for (let i = 0; i < offer.offerList.length; i++) {
                    if (!commonFound) {
                        for (let j = 0; j < data.offerList.length; j++) {
                            if (offer.offerList[i].number === data.offerList[j].number && offer
                                .offerList[i]
                                .futureRound === data.offerList[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.offerList[j]
                                .futurePickYear && offer
                                .offerList[i].futureOriginalTeam === data.offerList[j]
                                .futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }

                    if (!commonFound) {
                        for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                            if (offer.offerList[i].number === data.allUserPicksToTrade[j].number &&
                                offer
                                .offerList[i].futureRound === data.allUserPicksToTrade[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.allUserPicksToTrade[j]
                                .futurePickYear && offer.offerList[i].futureOriginalTeam === data
                                .allUserPicksToTrade[j].futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!commonFound) {
                remainingOffers.push(offer);
            } else {
                let counteredTeamIndex = counteredTeams.findIndex(teamName => offer.shortName ===
                    teamName);
                if (counteredTeamIndex > -1) {
                    counteredTeams.splice(counteredTeamIndex, 1);
                }
            }
        });

        offersList = [...remainingOffers];
        remainingOffers = [];

        multiUserSystemOffersList.forEach(offer => {
            let commonFound = false;
            for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
                if (!commonFound) {
                    for (let j = 0; j < data.offerList.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.offerList[j].number && offer
                            .allUserPicksToTrade[i].futureRound === data.offerList[j].futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.offerList[j]
                            .futurePickYear &&
                            offer.allUserPicksToTrade[i].futureOriginalTeam === data.offerList[j]
                            .futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }

                if (!commonFound) {
                    for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.allUserPicksToTrade[j]
                            .number && offer
                            .allUserPicksToTrade[i].futureRound === data.allUserPicksToTrade[j]
                            .futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.allUserPicksToTrade[j]
                            .futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === data
                            .allUserPicksToTrade[j].futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }
            }

            if (!commonFound) {
                for (let i = 0; i < offer.offerList.length; i++) {
                    if (!commonFound) {
                        for (let j = 0; j < data.offerList.length; j++) {
                            if (offer.offerList[i].number === data.offerList[j].number && offer
                                .offerList[i]
                                .futureRound === data.offerList[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.offerList[j]
                                .futurePickYear && offer
                                .offerList[i].futureOriginalTeam === data.offerList[j]
                                .futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }

                    if (!commonFound) {
                        for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                            if (offer.offerList[i].number === data.allUserPicksToTrade[j].number &&
                                offer
                                .offerList[i].futureRound === data.allUserPicksToTrade[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.allUserPicksToTrade[j]
                                .futurePickYear && offer.offerList[i].futureOriginalTeam === data
                                .allUserPicksToTrade[j].futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!commonFound) {
                remainingOffers.push(offer);
            }
        });

        multiUserSystemOffersList = [...remainingOffers];
        remainingOffers = [];

        let rejectedOffers = [];
        multiUserTradeOffersList.forEach(offer => {
            let commonFound = false;
            for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
                if (!commonFound) {
                    for (let j = 0; j < data.offerList.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.offerList[j].number && offer
                            .allUserPicksToTrade[i].futureRound === data.offerList[j].futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.offerList[j]
                            .futurePickYear &&
                            offer.allUserPicksToTrade[i].futureOriginalTeam === data.offerList[j]
                            .futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }

                if (!commonFound) {
                    for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.allUserPicksToTrade[j]
                            .number && offer
                            .allUserPicksToTrade[i].futureRound === data.allUserPicksToTrade[j]
                            .futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.allUserPicksToTrade[j]
                            .futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === data
                            .allUserPicksToTrade[j].futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }
            }

            if (!commonFound) {
                for (let i = 0; i < offer.offerList.length; i++) {
                    if (!commonFound) {
                        for (let j = 0; j < data.offerList.length; j++) {
                            if (offer.offerList[i].number === data.offerList[j].number && offer
                                .offerList[i]
                                .futureRound === data.offerList[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.offerList[j]
                                .futurePickYear && offer
                                .offerList[i].futureOriginalTeam === data.offerList[j]
                                .futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }

                    if (!commonFound) {
                        for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                            if (offer.offerList[i].number === data.allUserPicksToTrade[j].number &&
                                offer
                                .offerList[i].futureRound === data.allUserPicksToTrade[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.allUserPicksToTrade[j]
                                .futurePickYear && offer.offerList[i].futureOriginalTeam === data
                                .allUserPicksToTrade[j].futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!commonFound) {
                remainingOffers.push(offer);
            } else {
                rejectedOffers.push(offer);
            }
        });

        multiUserTradeOffersList = [...remainingOffers];
        remainingOffers = [];

        rejectedOffers.forEach((offer) => {
            let rejectedOffer = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
            };

            rejectedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
            rejectedOffer.offerList = offer.offerList;
            rejectedOffer.currentTeamName = offer.currentTeamName;
            rejectedOffer.offeringTeamShortName = offer.offeringTeamShortName;

            toBeHandledOffers.rejectedTradeOffers.push(rejectedOffer);
        });

        rejectedOffers = [];

        multiUserCounterOffersList.forEach(offer => {
            let commonFound = false;
            for (let i = 0; i < offer.allUserPicksToTrade.length; i++) {
                if (!commonFound) {
                    for (let j = 0; j < data.offerList.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.offerList[j].number && offer
                            .allUserPicksToTrade[i].futureRound === data.offerList[j].futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.offerList[j]
                            .futurePickYear &&
                            offer.allUserPicksToTrade[i].futureOriginalTeam === data.offerList[j]
                            .futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }

                if (!commonFound) {
                    for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                        if (offer.allUserPicksToTrade[i].number === data.allUserPicksToTrade[j]
                            .number && offer
                            .allUserPicksToTrade[i].futureRound === data.allUserPicksToTrade[j]
                            .futureRound &&
                            offer.allUserPicksToTrade[i].futurePickYear === data.allUserPicksToTrade[j]
                            .futurePickYear && offer.allUserPicksToTrade[i].futureOriginalTeam === data
                            .allUserPicksToTrade[j].futureOriginalTeam) {
                            commonFound = true;
                            break;
                        }
                    }
                }
            }

            if (!commonFound) {
                for (let i = 0; i < offer.offerList.length; i++) {
                    if (!commonFound) {
                        for (let j = 0; j < data.offerList.length; j++) {
                            if (offer.offerList[i].number === data.offerList[j].number && offer
                                .offerList[i]
                                .futureRound === data.offerList[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.offerList[j]
                                .futurePickYear && offer
                                .offerList[i].futureOriginalTeam === data.offerList[j]
                                .futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }

                    if (!commonFound) {
                        for (let j = 0; j < data.allUserPicksToTrade.length; j++) {
                            if (offer.offerList[i].number === data.allUserPicksToTrade[j].number &&
                                offer
                                .offerList[i].futureRound === data.allUserPicksToTrade[j].futureRound &&
                                offer.offerList[i].futurePickYear === data.allUserPicksToTrade[j]
                                .futurePickYear && offer.offerList[i].futureOriginalTeam === data
                                .allUserPicksToTrade[j].futureOriginalTeam) {
                                commonFound = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!commonFound) {
                remainingOffers.push(offer);
            } else {
                rejectedOffers.push(offer);
            }
        });

        multiUserCounterOffersList = [...remainingOffers];
        remainingOffers = [];

        rejectedOffers.forEach((offer) => {
            let rejectedOffer = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
            };

            rejectedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
            rejectedOffer.offerList = offer.offerList;
            rejectedOffer.currentTeamName = offer.currentTeamName;
            rejectedOffer.offeringTeamShortName = offer.offeringTeamShortName;

            toBeHandledOffers.rejectedCounterOffers.push(rejectedOffer);
        });
    }

    function revertCommonCounteredTradeOffers(data, acceptedTeamName, reason) {
        let revertedOffers = [];
        let proposedTeamIndex = proposedTeamsData.findIndex(propsedTeamData => {
            let teamName = Object.keys(propsedTeamData)[0];
            if (teamName === data.offeringTeamShortName || teamName === data.currentTeamName) {
                return true;
            }
        });

        if (proposedTeamIndex > -1) {
            proposedTeamsData.splice(proposedTeamIndex, 1);
        }

        proposedTeamsData.forEach(propsedTeamData => {
            for (const [key, value] of Object.entries(propsedTeamData)) {
                let commonPickFound = false;
                data.offerList.forEach(trade => {
                    value.allUserPicksToTrade.forEach(userPick => {
                        if (trade.number === userPick.number && trade.futureRound ===
                            userPick
                            .futureRound && trade.futurePickYear === userPick
                            .futurePickYear &&
                            trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                            commonPickFound = true;
                        }
                    });

                    value.offerList.forEach(userPick => {
                        if (trade.number === userPick.number && trade.futureRound ===
                            userPick
                            .futureRound && trade.futurePickYear === userPick
                            .futurePickYear &&
                            trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                            commonPickFound = true;
                        }
                    });
                });

                data.allUserPicksToTrade.forEach(trade => {
                    value.allUserPicksToTrade.forEach(userPick => {
                        if (trade.number === userPick.number && trade.futureRound ===
                            userPick
                            .futureRound && trade.futurePickYear === userPick
                            .futurePickYear &&
                            trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                            commonPickFound = true;
                        }
                    });

                    value.offerList.forEach(userPick => {
                        if (trade.number === userPick.number && trade.futureRound ===
                            userPick
                            .futureRound && trade.futurePickYear === userPick
                            .futurePickYear &&
                            trade.futureOriginalTeam === userPick.futureOriginalTeam) {
                            commonPickFound = true;
                        }
                    });
                });

                if (commonPickFound) {
                    revertedOffers.push(value);
                }
            }
        });

        console.log("reverted offers->", revertedOffers);
        revertedOffers.forEach((offer) => {
            let offeredMember = currentRoomData.members.find(member => member.teams.includes(offer
                .currentTeamName));
            let revertedOffer = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
                acceptedByTeamShortName: acceptedTeamName,
                revertedForSocketId: offeredMember.socketId,
                event: reason,
            };

            revertedOffer.allUserPicksToTrade = offer.allUserPicksToTrade;
            revertedOffer.offerList = offer.offerList;
            revertedOffer.currentTeamName = offer.currentTeamName;
            revertedOffer.offeringTeamShortName = offer.offeringTeamShortName;

            toBeHandledOffers.revertedOffers.push(revertedOffer);

            let revertedTeamName;
            let proposedTeamIndex = proposedTeamsData.findIndex(proposedData => {
                revertedTeamName = Object.keys(proposedData)[0];
                if (revertedTeamName === offer.currentTeamName || revertedTeamName === offer
                    .offeringTeamShortName) {
                    return true;
                }
            });

            if (proposedTeamIndex > -1) {
                proposedTeamsData.splice(proposedTeamIndex, 1);
            }

            if (revertedTeamName) {
                let counteredTeamIndex = counteredTeams.findIndex(counteredTeamName =>
                    counteredTeamName ===
                    revertedTeamName);
                if (counteredTeamIndex > -1) {
                    let removedCounteredTeam = counteredTeams.splice(counteredTeamIndex, 1);
                }
            }
        });
    }

    function handleAcceptedOffer(data, offerText) {
        removeCommonOffers(data);
        let acceptedByTeamName;
        if (userSelectedTeams.includes(data.offeringTeamShortName)) {
            acceptedByTeamName = data.currentTeamName;
        } else {
            acceptedByTeamName = data.offeringTeamShortName;
        }

        let myTeam = userSelectedTeams[0];
        let proposedTeamIndex = proposedTeamsData.findIndex(propsedTeamData => {
            let keys = Object.keys(propsedTeamData);
            if (data.offeringTeamShortName === myTeam) {
                if (keys[0] === data.currentTeamName) return true;
            } else {
                if (keys[0] === data.offeringTeamShortName) return true;
            }
        });

        if (proposedTeamIndex > -1) {
            proposedTeamsData.splice(proposedTeamIndex, 1);
        }

        revertCommonCounteredTradeOffers(data, acceptedByTeamName, "offer-accepted-by-other");
        if (currentPickIsMine || (currentMultiUserPick === 1 && userSelectedTeams.includes(picksList[0]
                .shortName))) {
            let pauseRemovalFlag = false;
            data.allUserPicksToTrade.forEach(pick => {
                if (pick.number === currentMultiUserPick) {
                    pauseRemovalFlag = true;
                }
            });

            if (pauseRemovalFlag) {
                socket.emit("proposal-resume", {
                    socketId: currentUserSocketId,
                    roomId: currentRoomData.roomId,
                    runSim: false,
                });
            }
        }

        toBeHandledOffers.acceptedOffer = data;
        if (offerText === "Counter Offer") {
            toBeHandledOffers.acceptedOfferType = "counter-offer-accepted";
        } else if (offerText === "Trade Proposal") {
            toBeHandledOffers.acceptedOfferType = "trade-offer-accepted";
        }

        setTimeout(() => {
            handleAccumulatedOffers();
        }, 100);

        let tradeProposalPopup = $(".trade-proposal-all-teams-conatiner");
        if (tradeProposalPopup) {
            tradeProposalPopup.remove();
        }

        let counteredTeamIndex = counteredTeams.findIndex(teamName => data.currentTeamName === teamName || data
            .offeringTeamShortName === teamName);
        if (counteredTeamIndex > -1) {
            let team = counteredTeams.splice(counteredTeamIndex, 1);
            enableTeamForProposal(team[0]);
        }

        tradeProposalResponseContainer = document.getElementById("trade-proposal-response").content.cloneNode(
            true);
        tradeProposalResponseContainer = tradeProposalResponseContainer.querySelector(
            ".trade-proposal-response-popup");
        if (tradeProposalResponseContainer) {
            removeClass(tradeProposalResponseContainer, "hidden");
            let proposalDescriptionContainer = tradeProposalResponseContainer.querySelector(
                ".trade-proposal-response-container .trade-proposal-response-description");
            if (proposalDescriptionContainer) {
                let opposingTeamName;
                if (userSelectedTeams.includes(data.currentTeamName)) {
                    opposingTeamName = data.offeringTeamShortName;
                } else {
                    opposingTeamName = data.currentTeamName;
                }

                proposalDescriptionContainer.innerHTML = offerText + " has been accepted by " +
                    opposingTeamName;
            }

            let overlay = $(".overlay");
            if (overlay) {
                removeClass(overlay, "hidden");
            }
            document.body.appendChild(tradeProposalResponseContainer);

            setTimeout(() => {
                let responsePopup = $(".trade-proposal-response-popup");
                if (responsePopup) {
                    responsePopup.remove();

                    let overlay = $(".overlay");
                    if (overlay && !checkForAlreadyOpenPopup()) {
                        addClass(overlay, "hidden");
                    }
                }
            }, 3500);
        }
    }

    function enableTeamForProposal(teamName) {
        let proposalContainer = $(".trade-proposal-all-teams-conatiner");
        if (proposalContainer) {
            let allTeams = proposalContainer.querySelectorAll(".all-teams-holder .team-btn");
            if (allTeams) {
                for (let i = 0; i < allTeams.length; i++) {
                    if (allTeams[i].dataset.teamname === teamName) {
                        allTeams[i].style.opacity = 1;
                        allTeams[i].style.cursor = "pointer";
                        allTeams[i].disabled = false;

                        break;
                    }
                }
            }
        }
    }

    function handleRejectedOffer(data, offerText) {
        let counteredTeamIndex = counteredTeams.findIndex(teamName => data.currentTeamName === teamName || data
            .offeringTeamShortName === teamName);
        if (counteredTeamIndex > -1) {
            let team = counteredTeams.splice(counteredTeamIndex, 1);
            enableTeamForProposal(team[0]);

            let proposedTeamIndex = proposedTeamsData.findIndex(proposedData => {
                let teamName = Object.keys(proposedData)[0];
                if (teamName === data.currentTeamName || teamName === data.offeringTeamShortName) {
                    return true;
                }
            });
            if (proposedTeamIndex > -1) {
                proposedTeamsData.splice(proposedTeamIndex, 1);
            }
        }
        tradeProposalResponseContainer = document.getElementById("trade-proposal-response").content.cloneNode(
            true);
        tradeProposalResponseContainer = tradeProposalResponseContainer.querySelector(
            ".trade-proposal-response-popup");
        if (tradeProposalResponseContainer) {
            removeClass(tradeProposalResponseContainer, "hidden");
            let proposalDescriptionContainer = tradeProposalResponseContainer.querySelector(
                ".trade-proposal-response-container .trade-proposal-response-description");
            if (proposalDescriptionContainer) {
                let opposingTeamName;
                if (userSelectedTeams.includes(data.currentTeamName)) {
                    opposingTeamName = data.offeringTeamShortName;
                } else {
                    opposingTeamName = data.currentTeamName;
                }

                proposalDescriptionContainer.innerHTML = offerText + " has been rejected by " +
                    opposingTeamName;
            }

            document.body.appendChild(tradeProposalResponseContainer);
            let overlay = $(".overlay");
            if (overlay) {
                removeClass(overlay, "hidden");
            }

            setTimeout(() => {
                let responsePopup = $(".trade-proposal-response-popup");
                if (responsePopup) {
                    responsePopup.remove();

                    let overlay = $(".overlay");
                    if (overlay && !checkForAlreadyOpenPopup()) {
                        addClass(overlay, "hidden");
                    }
                }
            }, 3500);
        }
    }
</script>
<script>
    let currentUserName = "";

    let teamsLists = {$teamsList|json_encode};

    let afcTeams = ["BAL", "BUF", "CIN", "CLE", "DEN", "HOU", "IND", "JAX", "KC", "LV", "LAC", "MIA", "NE", "NYJ",
        "PIT", "TEN"
    ];
    let nfcTeams = ["ARI", "ATL", "CAR", "CHI", "DAL", "DET", "GB", "LAR", "MIN", "NO", "NYG", "PHI", "SF", "SEA",
        "TB", "WAS"
    ];

    let paramRoomId = "{$roomIdParam}";
    let params = new URLSearchParams(window.location.search);
    let joinRoomFlag = params.get("joinRoom");

    let teamsData = {};

    for (let teamIndex = 0; teamIndex < teamsLists.length; teamIndex++) {
        teamsData[teamsLists[teamIndex]["shortName"]] = teamsLists[teamIndex];
    }

    function setCountdownTimer(timerHolder) {
        const currentTime = Date.now();
        let minDiff = Math.floor(((currentTime - currentRoomData.createdAt) / 1000 / 60));
        let secondsDiff = 59 - (Math.abs(Math.floor((currentTime - currentRoomData.createdAt) / 1000)) % 60);

        if (minDiff < 3) {
            if (minDiff < 0) {
                minDiff = 0;
            }

            minDiff = 2 - minDiff;
        }

        if (timerHolder) {
            timerHolder.dataset.minutes = minDiff;
            timerHolder.dataset.seconds = secondsDiff;
        }


        const timerId = setInterval(() => {
            const countDownTimer = timerHolder;
            if (countDownTimer) {
                const minutes = parseInt(countDownTimer.dataset.minutes);
                const seconds = parseInt(countDownTimer.dataset.seconds);
                if (minutes > 0 && seconds >= 0) {
                    if (seconds >= 10) {
                        countDownTimer.innerHTML = minutes + ":" + seconds;
                    } else {
                        countDownTimer.innerHTML = minutes + ":0" + seconds;
                    }
                } else if (minutes === 0 && seconds > 0) {
                    if (seconds >= 10) {
                        countDownTimer.innerHTML = "0:" + seconds;
                    } else {
                        countDownTimer.innerHTML = "0:0" + seconds;
                    }

                    if (seconds <= 10) {
                        let parent = countDownTimer.closest(".draft-start-counter");
                        if (parent && !hasClass(parent, "urgent")) {
                            addClass(parent, "urgent");
                        }
                    }
                } else if (minutes === 0 && seconds === 0) {
                    clearCountdownTimers();
                    countDownTimer.innerHTML = "0:00";
                }

                if (seconds > 0) {
                    countDownTimer.dataset.seconds -= 1;
                } else if (seconds === 0 && minutes > 0) {
                    countDownTimer.dataset.seconds = 59;
                    countDownTimer.dataset.minutes -= 1;
                } else if (seconds === 0 && minutes === 0) {
                    countDownTimer.dataset.seconds = 0;
                    countDownTimer.dataset.minutes = 0;
                }

            }
        }, 1000, timerHolder);

        countdownTimerIdList.push(timerId);
    }

    function setCurrentRoomData(roomData) {
        let isUserPresent = false;

        let selectedTeams = [];

        for (let memberIndex = 0; memberIndex < roomData["members"].length; memberIndex++) {
            if (currentUserSocketId == roomData["members"][memberIndex]["socketId"]) {
                isUserPresent = true;
                currentUserMultiDraftData = roomData.members[memberIndex];
            }
            selectedTeams = selectedTeams.concat(roomData["members"][memberIndex]["teams"]);
        }

        if (currentUserSocketId === roomData.admin) {
            currentUserIsAdmin = true;
            let showParticipantsBtn = $(".multi-user-draft-participants");
            if (showParticipantsBtn) {
                removeClass(showParticipantsBtn, "hidden");
                showParticipantsBtn.style.opacity = 1;
                showParticipantsBtn.style.cursor = "pointer";
                showParticipantsBtn.disabled = false;
            }
        } else {
            currentUserIsAdmin = false;
        }

        if (!isUserPresent) {
            showHomePage();
            return;
        }


        currentRoomData = roomData;
        let multiUserRoom = $(".simulator-content-holder .multi-user-room");
        if (!hasClass(multiUserRoom, "hidden")) {
            if (currentRoomData.roomType !== "private" && !currentRoomData.simulationStarted && !countdownTimerIdList
                .length) {
                let timerHolder = $(".draft-start-counter.main .countdown-timer");
                if (timerHolder) {
                    let timerContainer = $(".draft-start-counter.main");
                    if (timerContainer) {
                        removeClass(timerContainer, "hidden");
                        removeClass(timerContainer, "urgent");
                    }
                    setCountdownTimer(timerHolder);
                }
            }
        }

        if (currentRoomData.roomType === "private") {
            let countDownStrip = $(".draft-start-counter.main");
            if (countDownStrip && !hasClass(countDownStrip, "banner")) {
                addClass(countDownStrip, "hidden");
            }
        }

        currentRoomData["selectedTeams"] = selectedTeams;

        let teamSelectPopup = $(".select-teams-popup-container");
        if (teamSelectPopup) {
            let afcTeamsHolder = teamSelectPopup.querySelector(".afc-container-teams");
            if (afcTeamsHolder) {
                let allTeams = afcTeamsHolder.children;
                for (let i = 0; i < allTeams.length; i++) {
                    let currentTeamName = allTeams[i].dataset.teamName;
                    if (currentRoomData.selectedTeams.includes(currentTeamName) && !currentUserMultiDraftData.teams
                        .includes(currentTeamName)) {
                        addClass(allTeams[i], "disabled");
                        removeClass(allTeams[i], "selected");
                    } else {
                        removeClass(allTeams[i], "disabled");
                    }
                }
            }

            let nfcTeamsHolder = teamSelectPopup.querySelector(".nfc-container-teams");
            if (nfcTeamsHolder) {
                let allTeams = nfcTeamsHolder.children;
                for (let i = 0; i < allTeams.length; i++) {
                    let currentTeamName = allTeams[i].dataset.teamName;
                    if (currentRoomData.selectedTeams.includes(currentTeamName) && !currentUserMultiDraftData.teams
                        .includes(currentTeamName)) {
                        addClass(allTeams[i], "disabled");
                        removeClass(allTeams[i], "selected");
                    } else {
                        removeClass(allTeams[i], "disabled");
                    }
                }
            }
        }
        showRoomForMultiUser();

        let draftNowBtn = $(".draft-now-btn");
        let bottomDraftNowBtn = $('.room-bottom-controls .draft-now-btn');
        if (currentUserIsAdmin) {
            if (draftNowBtn && hasClass(draftNowBtn, "hidden")) {
                removeClass(draftNowBtn, "hidden");
                draftNowBtn.style.width = "148px";
                draftNowBtn.style.height = "38px";
            }

            if (bottomDraftNowBtn) {
                removeClass("hidden");
            }

            if (IS_DESKTOP) {
                let roomFooterText = $(".room-footer .room-footer-text");
                if (roomFooterText) {
                    roomFooterText.style.width = "70%";
                }
            }

            let membersWithTeams = 0;
            if (currentRoomData.members.length > 1) {
                for (let i = 0; i < currentRoomData.members.length; i++) {
                    if (currentRoomData.members[i].teams.length) {
                        membersWithTeams += 1;
                        if (membersWithTeams === 2) {
                            if (draftNowBtn) {
                                removeClass(draftNowBtn, "disabled");
                            }

                            if (bottomDraftNowBtn) {
                                removeClass(bottomDraftNowBtn, "disabled");
                            }

                            break;
                        } else {
                            if (draftNowBtn) {
                                addClass(draftNowBtn, "disabled");
                            }

                            if (bottomDraftNowBtn) {
                                addClass(bottomDraftNowBtn, "disabled");
                            }
                        }
                    }
                }
            } else {
                if (draftNowBtn) {
                    addClass(draftNowBtn, "disabled");
                }

                if (bottomDraftNowBtn) {
                    addClass(bottomDraftNowBtn, "disabled");
                }
            }

            if (bottomDraftNowBtn && hasClass(bottomDraftNowBtn, "hidden")) {
                removeClass(bottomDraftNowBtn, "hidden");
            }
        } else {
            if (draftNowBtn && !hasClass(draftNowBtn, "hidden")) {
                addClass(draftNowBtn, "hidden");
                draftNowBtn.style.width = "0px";
                draftNowBtn.style.padding = "0px";

                let roomFooterText = $(".room-footer .room-footer-text");
                if (roomFooterText) {
                    roomFooterText.style.width = "unset";
                }
            }

            if (bottomDraftNowBtn && !hasClass(bottomDraftNowBtn, "hidden")) {
                addClass(bottomDraftNowBtn, "hidden");
            }
        }
    }


    function showSelectTeamPopUp(e) {
        showOverlay(true);

        let currentPlayerData;

        for (let memberIndex = 0; memberIndex < currentRoomData["members"].length; memberIndex++) {
            if (currentRoomData["members"][memberIndex]["socketId"] == currentUserSocketId) {
                currentPlayerData = currentRoomData["members"][memberIndex];
            }
        }

        let selectTeamPopup = document
            .getElementById("select-teams-popup")
            .content.cloneNode(true);

        let closeIcon = selectTeamPopup.querySelector(".close-icon");
        closeIcon.addEventListener("click", closeSelectTeamPopup);

        let afcTeamContainer = selectTeamPopup.querySelector(".afc-container-teams");

        for (let teamIndex = 0; teamIndex < afcTeams.length; teamIndex++) {
            let teamContainer = document.createElement("div");
            addClass(teamContainer, "team-container");
            teamContainer.setAttribute("data-team-name", afcTeams[teamIndex]);

            if (currentPlayerData["teams"].indexOf(afcTeams[teamIndex]) != -1) {
                addClass(teamContainer, "selected");
                teamContainer.addEventListener("click", toggleSelectTeam);
            } else if (currentRoomData["selectedTeams"].indexOf(afcTeams[teamIndex]) != -1 && !(currentPlayerData[
                    "teams"].indexOf(afcTeams[teamIndex]) != -1)) {
                addClass(teamContainer, "disabled");
            } else {
                teamContainer.addEventListener("click", toggleSelectTeam);
            }

            let teamName = document.createElement("span");
            teamName.innerHTML = afcTeams[teamIndex];
            teamContainer.appendChild(teamName);

            let teamLogo = document.createElement("img");
            teamLogo.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + teamsData[afcTeams[
            teamIndex]]["teamLogo"] + "?w=80&tag=" + imageRefreshTag);
    teamLogo.setAttribute("height", "22px");
    teamLogo.setAttribute("width", "33px");
    teamLogo.setAttribute("alt", afcTeams[teamIndex] + " Logo");
    teamContainer.appendChild(teamLogo);

    afcTeamContainer.appendChild(teamContainer);
    }

    let nfcTeamContainer = selectTeamPopup.querySelector(".nfc-container-teams");

    for (let teamIndex = 0; teamIndex < nfcTeams.length; teamIndex++) {
        let teamContainer = document.createElement("div");
        addClass(teamContainer, "team-container");
        teamContainer.setAttribute("data-team-name", nfcTeams[teamIndex]);

        if (currentPlayerData["teams"].indexOf(nfcTeams[teamIndex]) != -1) {
            addClass(teamContainer, "selected");
            teamContainer.addEventListener("click", toggleSelectTeam);
        } else if (currentRoomData["selectedTeams"].indexOf(nfcTeams[teamIndex]) != -1 && !(currentPlayerData["teams"]
                .indexOf(afcTeams[teamIndex]) != -1)) {
            addClass(teamContainer, "disabled");
        } else {
            teamContainer.addEventListener("click", toggleSelectTeam);
        }

        let teamName = document.createElement("span");
        teamName.innerHTML = nfcTeams[teamIndex];
        teamContainer.appendChild(teamName);

        let teamLogo = document.createElement("img");
        teamLogo.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + teamsData[nfcTeams[teamIndex]]["teamLogo"] + "?w=80&tag=" + imageRefreshTag);
        teamLogo.setAttribute("height", "22px");
        teamLogo.setAttribute("width", "33px");
        teamLogo.setAttribute("alt", nfcTeams[teamIndex] + " Logo");
        teamContainer.appendChild(teamLogo);

        nfcTeamContainer.appendChild(teamContainer);
    }

    let updateTeamsBtn = selectTeamPopup.querySelector(".update-teams-button");
    updateTeamsBtn.addEventListener("click", updateSelectedTeam);

    document.body.appendChild(selectTeamPopup);

    let timerHolder = $(".select-teams-popup-container .countdown-timer");
    let countDownStrip = $(".draft-start-counter.main");
    if (countDownStrip && hasClass(countDownStrip, "hidden")) {
        let timerContainer = $(".select-teams-popup-container .draft-start-counter");
        if (timerContainer) {
            addClass(timerContainer, "hidden");
        }
    } else if (timerHolder) {
        if (currentRoomData.roomType === "private") {
            let timerContainer = $(".select-teams-popup-container .draft-start-counter");
            if (timerContainer) {
                removeClass(timerContainer, "hidden");
            }
        }

        if (countdownTimerIdList.length > 1) {
            clearInterval(countdownTimerIdList[1]);
            countdownTimerIdList.length = 1;
        }

        setCountdownTimer(timerHolder);
    }
    }


    function updateSelectedTeam() {

        let selectedTeams = [];
        let teamsPopupContainer = $('.select-teams-popup-container');

        if (teamsPopupContainer) {
            let teamContainersList = teamsPopupContainer.querySelectorAll('.team-container');
            teamContainersList.forEach(teamElement => {
                if (hasClass(teamElement, "selected")) {
                    selectedTeams.push(teamElement.getAttribute("data-team-name"));
                }
            });
        }

        updateTeams(selectedTeams, currentRoomData["roomId"]);


        closeSelectTeamPopup();
    }


    function toggleSelectTeam(e) {
        let currentPlayerData;
        for (let memberIndex = 0; memberIndex < currentRoomData["members"].length; memberIndex++) {
            if (currentRoomData["members"][memberIndex]["userName"] == currentUserName) {
                currentPlayerData = currentRoomData["members"][memberIndex];
            }
        }
        let teamContainer = e.target.closest("div");
        let allTeams = $all(".conference-teams-wrapper .team-container");
        if (!hasClass(teamContainer, "selected")) {
            allTeams.forEach(team => {
                if (currentRoomData.selectedTeams.includes(team.getAttribute("data-team-name")) && !
                    currentPlayerData.teams.includes(team.getAttribute("data-team-name"))) {
                    addClass(team, "disabled");
                } else {
                    removeClass(team, "selected");
                }
            });
            addClass(teamContainer, "selected");
        }
    }

    function closeSelectTeamPopup() {
        let container = $(".select-teams-popup-container");

        if (container) {
            container.remove();
        }

        showOverlay(false);
    }

    function createStatusElement(playerData) {
        let userName = playerData["userName"];
        let maxTeamInContainer = 4;
        let selectedTeamList = playerData["teams"];

        if (currentUserMultiDraftData.socketId == playerData.socketId) {
            if (selectedTeamList.length > 0) {
                let selectedTeamContainer = document.createElement("div");
                addClass(selectedTeamContainer, "selected-teams-container");
                for (let playerTeamIndex = 0; playerTeamIndex < Math.min(selectedTeamList.length,
                        maxTeamInContainer); playerTeamIndex++) {
                    let currTeamName = selectedTeamList[playerTeamIndex];
                    let teamImageContainer = document.createElement("div");
                    addClass(teamImageContainer, "selected-team-container");
                    let teamImage = document.createElement("img");
                    teamImage.setAttribute("height", "16px");
                    teamImage.setAttribute("width", "24px");
                    teamImage.setAttribute("alt", currTeamName + " Logo");
                    teamImage.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + teamsData[currTeamName]["teamLogo"] + "?w=80&tag=" + imageRefreshTag);
                    teamImageContainer.appendChild(teamImage);
                    selectedTeamContainer.appendChild(teamImageContainer);
                }

                if (selectedTeamList.length > maxTeamInContainer) {
                    let remainingTeamsContainer = document.createElement("div");
                    addClass(remainingTeamsContainer, "selected-team-container");
                    let remainingTeamsText = document.createElement("span");
                    remainingTeamsText.innerHTML = "+" + (selectedTeamList.length - maxTeamInContainer);
                    remainingTeamsContainer.appendChild(remainingTeamsText);
                    selectedTeamContainer.appendChild(remainingTeamsContainer);
                }

                let editTeamsButtonContainer = document.createElement("button");
                addClass(editTeamsButtonContainer, "selected-team-container");
                editTeamsButtonContainer.setAttribute("data-player-id", userName);
                let editTeamImg = document.createElement("img");
                addClass(editTeamImg, "edit-icon");
                editTeamImg.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/edit-icon.png");
                editTeamImg.setAttribute("height", "16px");
                editTeamImg.setAttribute("width", "16px");
                editTeamImg.setAttribute("alt", "edit icon");
                editTeamsButtonContainer.appendChild(editTeamImg);
                editTeamsButtonContainer.addEventListener("click", showSelectTeamPopUp);
                selectedTeamContainer.appendChild(editTeamsButtonContainer);

                return selectedTeamContainer;
            } else {
                let selectTeamBtn = document.createElement("button");
                addClass(selectTeamBtn, "select-team-btn");
                selectTeamBtn.setAttribute("data-player-id", userName);

                let addTeamImg = document.createElement("img");
                addClass(addTeamImg, "add-icon");
                addTeamImg.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/add-team-icon.png");
                addTeamImg.setAttribute("height", "16px");
                addTeamImg.setAttribute("width", "16px");
                addTeamImg.setAttribute("alt", "add icon");
                selectTeamBtn.appendChild(addTeamImg);

                let addTeamText = document.createElement("span");
                addTeamText.innerHTML = "Select Team";
                selectTeamBtn.appendChild(addTeamText);

                selectTeamBtn.addEventListener("click", showSelectTeamPopUp);
                return selectTeamBtn;
            }
        } else {
            if (selectedTeamList.length == 0) {
                let selectedTeamText = document.createElement("span");
                addClass(selectedTeamText, "no-team-selected-text");
                selectedTeamText.innerHTML = "No Team Selected";
                return selectedTeamText;
            }

            let selectedTeamContainer = document.createElement("div");
            addClass(selectedTeamContainer, "selected-teams-container");
            for (let playerTeamIndex = 0; playerTeamIndex < Math.min(selectedTeamList.length,
                    maxTeamInContainer); playerTeamIndex++) {
                let currTeamName = selectedTeamList[playerTeamIndex];
                let teamImageContainer = document.createElement("div");
                addClass(teamImageContainer, "selected-team-container");
                let teamImage = document.createElement("img");
                teamImage.setAttribute("height", "16px");
                teamImage.setAttribute("width", "24px");
                teamImage.setAttribute("alt", currTeamName + " Logo");
                teamImage.setAttribute("src", "{$smarty.const.STATIC_URL}" + teamLogoPath + teamsData[
                currTeamName]["teamLogo"] + "?w=80&tag=" + imageRefreshTag);
        teamImageContainer.appendChild(teamImage);
        selectedTeamContainer.appendChild(teamImageContainer);
    }

    if (selectedTeamList.length > maxTeamInContainer) {
        let remainingTeamsContainer = document.createElement("div");
        addClass(remainingTeamsContainer, "selected-team-container");
        let remainingTeamsText = document.createElement("span");
        remainingTeamsText.innerHTML = "+" + (selectedTeamList.length - maxTeamInContainer);
        remainingTeamsContainer.appendChild(remainingTeamsText);
        selectedTeamContainer.appendChild(remainingTeamsContainer);
    }

    return selectedTeamContainer;
    }
    }

    function showHomePage() {
        let infoPopup = $(".multi-user-info-container-popup");
        if (!infoPopup) {
            let currentUrl = window.location.href;
            if (currentUrl.includes("?")) {
                let urlArray = currentUrl.split("?");
                currentUrl = urlArray[0];
                if (urlArray[1].includes("debug__proxy_tools=true")) {
                    currentUrl += "?debug__proxy_tools=true";
                }
            }

            window.history.replaceState('', '', currentUrl);
            window.location.reload();
        }
    }

    function showRoomForMultiUser() {
        let landingPageHolder = $('.pfn-content-container .landing-page-container');
        if (landingPageHolder && !hasClass(landingPageHolder, "hidden")) {
            addClass(landingPageHolder, "hidden");
        }

        let multiUserRoomContainer = $('.multi-user-room-container');
        if (multiUserRoomContainer && hasClass(multiUserRoomContainer, "hidden")) {
            removeClass(multiUserRoomContainer, "hidden");
        }

        let bottomBtns = $('.room-bottom-controls');
        if (bottomBtns && hasClass(bottomBtns, "hidden")) {
            removeClass(bottomBtns, "hidden");
        }


        if (multiUserRoomContainer) {
            let roomNameContainer = multiUserRoomContainer.querySelector(".room-name-text");
            roomNameContainer.innerHTML = currentRoomData["roomName"];

            let roomIdContainer = multiUserRoomContainer.querySelector(".room-id-info-text");
            roomIdContainer.innerHTML = currentRoomData["roomId"];

            let roomPasswordWrapper = multiUserRoomContainer.querySelector(".room-password-info-container");

            if (currentRoomData["password"]) {
                let roomPasswordContainer = multiUserRoomContainer.querySelector(".room-password-info-text");
                roomPasswordContainer.innerHTML = "************";

                if (hasClass(roomPasswordWrapper, "hidden")) {
                    removeClass(roomPasswordWrapper, "hidden");
                }

            } else {
                if (!hasClass(roomPasswordWrapper, "hidden")) {
                    addClass(roomPasswordWrapper, "hidden");
                }
            }

            let roomContentContainer = multiUserRoomContainer.querySelector(".room-content");
            roomContentContainer.innerHTML = "";

            let playersTable = document.createElement('table');
            addClass(playersTable, "room-players-table");

            let playersTableHead = document.createElement('thead');
            let tableHeadRow = document.createElement('tr');

            let roomStrengthHeaderText = "(" + currentRoomData["members"].length + "/" + currentRoomData["roomLimit"] +
                ")";
            let headerRowData = ["#", "Player " + roomStrengthHeaderText, "Team"];
            if (currentUserIsAdmin) {
                headerRowData.push("Action");
            } else {
                headerRowData.push("Role");
            }

            for (let headerRowIndex = 0; headerRowIndex < headerRowData.length; headerRowIndex++) {
                let tableHeadRowEl = document.createElement('th');
                tableHeadRowEl.innerHTML = headerRowData[headerRowIndex];
                tableHeadRow.appendChild(tableHeadRowEl);
            }

            playersTableHead.appendChild(tableHeadRow);
            playersTable.appendChild(playersTableHead);


            let playersList = currentRoomData["members"];

            playersList.sort((a, b) => {
                if (a["socketId"] === currentUserSocketId) return -1;
                if (b["socketId"] === currentUserSocketId) return 1;
                return 0;
            });

            let playersTableBody = document.createElement('tbody');


            for (let playerIndex = 0; playerIndex < playersList.length; playerIndex++) {
                let playerData = playersList[playerIndex];
                let tableBodyRow = document.createElement('tr');
                if (playerData["socketId"] == currentUserSocketId) {
                    addClass(tableBodyRow, "current-player-table-row");
                }
                addClass(tableBodyRow, "player-table-row");

                let tableBodyRowEl = document.createElement('td');
                tableBodyRowEl.innerHTML = playerIndex + 1;
                tableBodyRow.appendChild(tableBodyRowEl);

                tableBodyRowEl = document.createElement('td');


                let playerDetailsContainer = document.createElement("div");
                addClass(playerDetailsContainer, "player-details-container");

                let playerNameText = document.createElement("span");
                addClass(playerNameText, "player-name-text");
                playerNameText.innerHTML = playerData["socketId"] == currentUserSocketId ? "You" : playerData[
                    "userName"];
                playerDetailsContainer.appendChild(playerNameText);

                tableBodyRowEl.appendChild(playerDetailsContainer);

                tableBodyRow.appendChild(tableBodyRowEl);

                tableBodyRowEl = document.createElement('td');
                tableBodyRowEl.appendChild(createStatusElement(playerData));
                tableBodyRow.appendChild(tableBodyRowEl);

                tableBodyRowEl = document.createElement('td');
                if (currentUserIsAdmin) {
                    tableBodyRowEl.appendChild(createAdminActionButton(playerData));
                } else if (playerData["socketId"] == currentRoomData.admin) {
                    tableBodyRowEl.innerHTML = "Owner";
                } else {
                    tableBodyRowEl.innerHTML = "-";
                }

                tableBodyRow.appendChild(tableBodyRowEl);

                playersTableBody.appendChild(tableBodyRow);
            }

            playersTable.appendChild(playersTableBody);

            roomContentContainer.appendChild(playersTable);

            if (IS_DESKTOP) {
                window.scrollTo(0, 35);
            } else {
                window.scrollTo(0, 0);
            }
        }
    }

    function createAdminActionButton(playerData) {
        if (playerData["socketId"] == currentUserSocketId) {
            let adminText = document.createElement("span");
            adminText.innerHTML = "Owner";
            return adminText;
        } else {
            let removeButton = document.createElement("div");

            let removeIcon = document.createElement("img");
            addClass(removeIcon, "remove-icon");
            removeIcon.setAttribute("height", "20px");
            removeIcon.setAttribute("width", "20px");
            removeIcon.setAttribute("alt", "Remove icon");
            removeIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/playoff-predictor/icons/close-icon.png");

            removeButton.appendChild(removeIcon);
            removeButton.setAttribute("data-player-socket-id", playerData["socketId"]);
            removeButton.setAttribute("data-player-name", playerData["userName"]);
            removeButton.addEventListener("click", removePlayerFromRoom);

            return removeButton;
        }
    }

    function hideRoomControls(e) {
        if (!e.target.closest(".room-controls-options") && !e.target.closest(".multi-user-room .room-controls")) {
            let roomControlsContainer = $(".room-controls-options");
            if (roomControlsContainer) {
                addClass(roomControlsContainer, "hidden");
            }
        }
    }

    async function leaveRoom() {
        let currentPlayerData;

        for (let memberIndex = 0; memberIndex < currentRoomData["members"].length; memberIndex++) {
            if (currentRoomData["members"][memberIndex]["userName"] == currentUserName) {
                currentPlayerData = currentRoomData["members"][memberIndex];
            }
        }

        const confirmed = await showConfirmationBox("Are you sure you want to leave the draft room?", "Confirm",
            "leave-room.png");

        if (confirmed) {
            socket.emit("chat", {
                type: "leave_room",
                roomId: currentRoomData.roomId,
                socketId: currentUserSocketId,
                userName: currentUserMultiDraftData.userName,
            });

            socket.emit('leave_room', {
                roomId: currentRoomData["roomId"],
                socketId: currentPlayerData["socketId"],
                userName: currentPlayerData["userName"]
            });
            paramRoomId = "";

            showHomePage();
        } else {

        }
    }

    async function removePlayerFromRoom(e) {
        let targetButton = e.target.closest("div");

        let playerNameToRemove = targetButton.getAttribute("data-player-name");

        const confirmed = await showConfirmationBox("Are you sure you want to remove <strong>" +
            playerNameToRemove +
            "</strong>" + " from the room?",
            "Remove", "remove-user.png");

        if (confirmed) {
            let playerSocketId = targetButton.getAttribute("data-player-socket-id");

            socket.emit('remove_from_room', {
                roomId: currentRoomData["roomId"],
                socketId: playerSocketId,
                adminName: currentUserName,
                removedUserName: playerNameToRemove,
            });
        }
    }

    function showOverlay(check) {
        let overlay = $(".overlay");
        if (check) {
            if (overlay && hasClass(overlay, "hidden")) {
                removeClass(overlay, "hidden");
            }
        } else {
            if (overlay && !hasClass(overlay, "hidden")) {
                addClass(overlay, "hidden");
            }
        }
    }

    function showOverlay2(check) {
        let overlay = $(".overlay2");
        if (check) {
            if (overlay && hasClass(overlay, "hidden")) {
                removeClass(overlay, "hidden");
            }
        } else {
            if (overlay && !hasClass(overlay, "hidden")) {
                addClass(overlay, "hidden");
            }
        }
    }

    function createFormAPIResponse(formData) {
        sendData(formData);
    }

    function submitCreateRoomFormData() {
        trackGAEventForPage("create_room");
        const roomName = document.getElementById('roomName').value;
        currentUserName = document.getElementById('userName').value;
        const roomType = document.querySelector('input[name="roomType"]:checked').value;
        const password = document.getElementById('password').value;
        const maxPlayers = parseInt(document.getElementById('maxPlayers').value);
        const numRounds = parseInt(document.getElementById('numRounds').value);

        var formData = {
            roomName,
            currentUserName,
            roomType,
            password,
            maxPlayers,
            numRounds,
        };

        createFormAPIResponse(formData);
        closeCreateRoomPopup();
    }

    function incrementRoundNum() {
        var numRoundsInput = document.getElementById('numRounds');
        var currentValue = parseInt(numRoundsInput.value);
        if (currentValue && currentValue < 7) {
            numRoundsInput.value = currentValue + 1;
        } else if (currentValue != 7) {
            numRoundsInput.value = 1;
        }
    }

    function decrementRoundNum() {
        var numRoundsInput = document.getElementById('numRounds');
        var currentValue = parseInt(numRoundsInput.value);
        if (currentValue > 1) {
            numRoundsInput.value = currentValue - 1;
        }
    }

    function incrementMaxPlayer() {
        var maxPlayersInput = document.getElementById('maxPlayers');
        var currentValue = parseInt(maxPlayersInput.value);
        if (currentValue && currentValue < 32) {
            maxPlayersInput.value = currentValue + 1;
        } else if (currentValue != 32) {
            maxPlayersInput.value = 2;
        }
    }

    function decrementMaxPlayer() {
        var maxPlayersInput = document.getElementById('maxPlayers');
        var currentValue = parseInt(maxPlayersInput.value);
        if (currentValue > 2) {
            maxPlayersInput.value = currentValue - 1;
        }
    }


    function showCreateRoomPopup() {
        showOverlay(true);

        let createNewRoomPopup = document
            .getElementById("create-new-room-popup")
            .content.cloneNode(true);

        let closeIcon = createNewRoomPopup.querySelector(".close-icon");
        closeIcon.addEventListener("click", closeCreateRoomPopup);

        var privateRadio = createNewRoomPopup.getElementById('privateRoom');
        var publicRadio = createNewRoomPopup.getElementById('publicRoom');
        var passwordField = createNewRoomPopup.getElementById('passwordField');

        let incrPlayerBtn = createNewRoomPopup.querySelector(".max-player-increment-btn");
        if (incrPlayerBtn) {
            incrPlayerBtn.addEventListener("click", incrementMaxPlayer);
        }

        let decPlayerBtn = createNewRoomPopup.querySelector(".max-player-decrement-btn");
        if (decPlayerBtn) {
            decPlayerBtn.addEventListener("click", decrementMaxPlayer);
        }

        let roundIncBtn = createNewRoomPopup.querySelector(".rounds-increment-btn");
        if (roundIncBtn) {
            roundIncBtn.addEventListener("click", incrementRoundNum);
        }

        let roundDecBtn = createNewRoomPopup.querySelector(".rounds-decrement-btn");
        if (roundDecBtn) {
            roundDecBtn.addEventListener("click", decrementRoundNum);
        }

        createNewRoomPopup.getElementById('create-room-form').addEventListener('submit', function(event) {
            event.preventDefault();
            submitCreateRoomFormData();
        });

        privateRadio.addEventListener('change', function() {
            if (this.checked) {
                removeClass(passwordField, "hidden");
            }
        });
        publicRadio.addEventListener('change', function() {
            if (this.checked) {
                addClass(passwordField, "hidden");
            }
        })

        document.body.appendChild(createNewRoomPopup);
    }

    function closeCreateRoomPopup(e) {
        let container = $(".create-new-room-popup-container");

        if (container) {
            container.remove();
        }

        showOverlay(false);
    }

    function refreshAvailableRooms() {
        clearCountdownTimers();
        showAvailableRoomsContainer();
    }

    function showAvailableRoomsContainer() {
        const joinRoomContainer = $(
            ".draft-options-view-container .multi-user-create-join-room-container .join-room-container");
        if (joinRoomContainer) {
            joinRoomContainer.innerHTML = "";
            let createRoomBtn = $(".multi-user-create-join-room-container .create-room-btn");

            if (createRoomBtn) {
                createRoomBtn.addEventListener("click", showCreateRoomPopup);
            }
            clearCountdownTimers();

            getAllRoomsData();

            let joinRoomPopup = document
                .getElementById("join-room-popup")
                .content.cloneNode(true);

            joinRoomContainer.appendChild(joinRoomPopup);
        }
    }

    function showRoomSearchBox(roomList) {
        let searcRoomInput = $('.join-room-popup-container .search-room-input');
        if (searcRoomInput && hasClass(searcRoomInput, "hidden")) {
            removeClass(searcRoomInput, "hidden");
        }

        searcRoomInput.addEventListener("input", function(e) {
            let inputValue = searcRoomInput.value;
            if (inputValue) {
                let filteredRooms = roomList.filter(room => room[1]["roomId"].includes(
                    inputValue.toLowerCase()));
                addRoomsTable(filteredRooms);
            } else {
                addRoomsTable(roomList);
            }
        });
    }

    function joinRoomBtnWithRoomId(roomIdInput) {
        let joinRoomPopupContainer = $(".join-room-popup-container");
        let joinRoomPopupContent = joinRoomPopupContainer.querySelector(".popup-content");

        let allJoinRoomBtns = joinRoomPopupContent.querySelectorAll('.join-room-btn');

        for (let joinBtnIndex = 0; joinBtnIndex < allJoinRoomBtns.length; joinBtnIndex++) {
            if (allJoinRoomBtns[joinBtnIndex].getAttribute("data-room-id") == roomIdInput) {
                allJoinRoomBtns[joinBtnIndex].click();
                break;
            }
        }

    }

    function camelize(str) {
        return str[0].toUpperCase() + str.substr(1);
    }

    function getAvailableRoomsCount(roomsList) {
        var availableRooms = 0;
        roomsList.forEach(roomData => {
            var roomInfo = roomData[1];
            if (roomInfo.members.length < roomInfo.roomLimit && roomInfo.simulationStarted == false)
                availableRooms++;
        });
        return availableRooms;
    }

    function addRoomsTable(roomsList) {
        let joinRoomPopupContainer = $(".join-room-popup-container");
        let joinRoomPopupContent = joinRoomPopupContainer.querySelector(".popup-content");

        joinRoomPopupContent.innerHTML = "";

        let table = document.createElement("table");

        let thead = document.createElement("thead");
        let theadList = ["#", "Room Id", "Room Name", "Type", "Rounds", "Limit", "Action"];
        let tr = document.createElement("tr");
        for (let theadIndex = 0; theadIndex < theadList.length; theadIndex++) {
            let th = document.createElement("th");
            th.innerHTML = theadList[theadIndex];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        if (!roomsList || !roomsList.length) {
            joinRoomPopupContent.appendChild(table);
            let noRoomAvaiableText = document.createElement("span");
            addClass(noRoomAvaiableText, "empty-room-list-text");
            noRoomAvaiableText.innerHTML = "No Room Available";
            joinRoomPopupContent.appendChild(noRoomAvaiableText);
            return;
        }

        let availableRoomsCount = getAvailableRoomsCount(roomsList);

        var availableRoomCountElement = joinRoomPopupContainer.querySelector(".available-room-text");
        availableRoomCountElement.innerHTML = "(" + availableRoomsCount + "/" + roomsList.length + ")";

        let tbody = document.createElement("tbody");
        let notAvailableRooms = [];
        let availableRooms = [];
        let privateRooms = [];

        for (let roomIndex = 0; roomIndex < roomsList.length; roomIndex++) {
            let roomData = roomsList[roomIndex][1];

            let tr = document.createElement("tr");

            let td = document.createElement("td");
            td.innerHTML = roomIndex + 1;
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = roomData["roomId"];
            tr.appendChild(td);

            td = document.createElement("td");
            addClass(td, "room-name-text");
            td.innerHTML = roomData["roomName"];
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = camelize(roomData["roomType"]);
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = roomData["rounds"];
            tr.appendChild(td);

            td = document.createElement("td");
            let isFull = (roomData["members"].length == roomData["roomLimit"]);
            if (roomData.simulationStarted) {
                addClass(td, "room-limit-drafting");
            } else if (isFull) {
                addClass(td, "room-limit-full");
            }
            td.innerHTML = roomData["members"].length + "/" + roomData["roomLimit"];
            tr.appendChild(td);

            td = document.createElement("td");
            let joinBtn = createJoinRoomButton(roomData);
            td.appendChild(joinBtn);
            tr.appendChild(td);

            tr.dataset.createdat = roomData.createdAt;

            if (joinBtn.dataset.available === "true") {
                if (roomData.roomType === "public") {
                    availableRooms.push(tr);
                } else {
                    privateRooms.push(tr);
                }
            } else {
                notAvailableRooms.push(tr);
            }
        }

        availableRooms.sort((x, y) => {
            return parseInt(x.dataset.createdat) - parseInt(y.dataset.createdat);
        });
        availableRooms.forEach(tr => tbody.appendChild(tr));
        privateRooms.forEach(tr => tbody.appendChild(tr));
        notAvailableRooms.forEach(tr => tbody.appendChild(tr));

        table.appendChild(tbody);
        joinRoomPopupContent.appendChild(table);
    }

    function createJoinRoomButton(roomData) {
        let isFull = (roomData["members"].length == roomData["roomLimit"]);
        let joinBtn = document.createElement("button");
        addClass(joinBtn, "join-room-btn");
        joinBtn.setAttribute("data-room-id", roomData["roomId"]);
        if (roomData.simulationStarted || (roomData.roomType === "public" && roomData.autoStartTimerId === "")) {
            addClass(joinBtn, "room-drafting");
            joinBtn.innerHTML = "Drafting";
            joinBtn.dataset.available = "false";
        } else if (isFull) {
            addClass(joinBtn, "room-full-btn");
            joinBtn.innerHTML = "Room Full";
            joinBtn.dataset.available = "false";
        } else {
            joinBtn.dataset.available = "true";
            if (roomData["roomType"] == "private") {
                joinBtn.innerHTML = "Join";
            } else {
                const currentTime = Date.now();
                let minDiff = Math.floor(((currentTime - roomData.createdAt) / 1000 / 60));
                let secondsDiff = 59 - (Math.abs(Math.floor((currentTime - roomData.createdAt) / 1000)) % 60);

                if (minDiff < 3) {
                    if (minDiff < 0) {
                        minDiff = 0;
                    }

                    minDiff = 2 - minDiff;
                }

                joinBtn.dataset.minutes = minDiff;
                joinBtn.dataset.seconds = secondsDiff;
                const timerId = setInterval(() => {
                    const countDownTimer = joinBtn;
                    if (countDownTimer) {
                        const minutes = parseInt(countDownTimer.dataset.minutes);
                        const seconds = parseInt(countDownTimer.dataset.seconds);
                        if (minutes > 0 && seconds >= 0) {
                            if (seconds >= 10) {
                                countDownTimer.innerHTML = "Join (" + minutes + ":" + seconds + ")";
                            } else {
                                countDownTimer.innerHTML = "Join (" + minutes + ":0" + seconds + ")";
                            }
                        } else if (minutes === 0 && seconds > 0) {
                            if (seconds >= 10) {
                                countDownTimer.innerHTML = "Join (" + "0:" + seconds + ")";
                            } else {
                                countDownTimer.innerHTML = "Join (" + "0:0" + seconds + ")";
                            }
                        } else if (minutes === 0 && seconds === 0) {
                            addClass(joinBtn, "room-drafting");
                            joinBtn.innerHTML = "Drafting";
                            joinBtn.dataset.available = "false";
                            let timerId = parseInt(joinBtn.dataset.intervalid);
                            clearInterval(timerId);
                        }

                        if (seconds > 0) {
                            countDownTimer.dataset.seconds -= 1;
                        } else if (seconds === 0 && minutes > 0) {
                            countDownTimer.dataset.seconds = 59;
                            countDownTimer.dataset.minutes -= 1;
                        } else if (seconds === 0 && minutes === 0) {
                            countDownTimer.dataset.seconds = 0;
                            countDownTimer.dataset.minutes = 0;
                        }

                    }
                }, 1000, joinBtn);

                joinBtn.dataset.intervalid = timerId;
                countdownTimerIdList.push(timerId);
                joinBtn.innerHTML = "Join";
            }

            joinBtn.addEventListener("click", function() {
                showEnterUserNamePopup(roomData);
            })
        }

        return joinBtn;
    }

    function showEnterUserNamePopup(roomData) {
        showOverlay2(true);

        let enterUserNamePopupContainer = document.getElementById("enter-username-popup").content.cloneNode(true);
        enterUserNamePopupContainer = enterUserNamePopupContainer.querySelector(".enter-username-popup-container");

        let closeIcon = enterUserNamePopupContainer.querySelector(".close-icon");
        closeIcon.addEventListener("click", closeEnterUserNamePopup);
        let popupContent = enterUserNamePopupContainer.querySelector(".popup-content");

        let userNameInput = document.createElement("input");
        userNameInput.setAttribute("type", "text");
        userNameInput.setAttribute("maxlength", "5");
        userNameInput.setAttribute("required", "required");
        userNameInput.setAttribute("placeholder", "Character Limit is 5");
        userNameInput.style.padding = "8px 6px";
        userNameInput.style.height = "45px";
        userNameInput.style.border = "1px solid #2d2d2d";
        userNameInput.style.borderRadius = "3px";
        addClass(userNameInput, "username-input");
        popupContent.appendChild(userNameInput);

        let submitUserNameButton = document.createElement("button");
        addClass(submitUserNameButton, "submit-password-button");
        submitUserNameButton.innerHTML = "Enter";
        submitUserNameButton.addEventListener("click", function() {
            let inputValue = enterUserNamePopupContainer.querySelector('.username-input').value;
            if (inputValue) {
                currentUserName = inputValue;
                let isPrivate = (roomData["roomType"] == "private");
                let password = roomData["password"];
                if (isPrivate && password) {
                    showVerifyPasswordPopUp(roomData);
                } else {
                    trackGAEventForPage("join_room");
                    clearCountdownTimers();
                    submitUserNameButton.style.opacity = "0.4";
                    submitUserNameButton.innerHTML = "Joining...";
                    submitUserNameButton.disabled = true;
                    sendJoiningData(roomData.roomId, inputValue, "");
                }
            } else {
                alert("Enter username");
            }
        });

        popupContent.appendChild(submitUserNameButton);


        document.body.appendChild(enterUserNamePopupContainer);
    }

    function clearCountdownTimers() {
        if (countdownTimerIdList.length) {
            countdownTimerIdList.forEach(timerId => clearInterval(
                timerId));
            countdownTimerIdList.length = 0;
        }
    }

    function showVerifyPasswordPopUp(roomData) {
        showOverlay2(true);

        let password = roomData["password"];
        let verifyPasswordPopup = document
            .getElementById("verify-password-popup")
            .content.cloneNode(true);

        let closeIcon = verifyPasswordPopup.querySelector(".close-icon");
        closeIcon.addEventListener("click", closeVerifyPasswordPopup);
        let popupContent = verifyPasswordPopup.querySelector(".popup-content");

        let passwordInput = document.createElement("input");
        passwordInput.setAttribute("type", "password");
        passwordInput.setAttribute("required", "required");
        passwordInput.setAttribute("placeholder", "Enter room password");
        addClass(passwordInput, "room-password-input");
        popupContent.appendChild(passwordInput);

        let submitPasswordButton = document.createElement("button");
        addClass(submitPasswordButton, "submit-password-button");
        submitPasswordButton.innerHTML = "Join Now";
        submitPasswordButton.addEventListener("click", function() {
            let inputValue = popupContent.querySelector('.room-password-input').value;
            if (inputValue == password) {
                trackGAEventForPage("join_room");
                clearCountdownTimers();
                submitPasswordButton.style.opacity = "0.4";
                submitPasswordButton.innerHTML = "Joining...";
                submitPasswordButton.disabled = true;
                sendJoiningData(roomData["roomId"], currentUserName, inputValue);
            } else if (!inputValue) {
                alert("Enter password");
            } else {
                alert("Password didnt match");

            }
        });

        popupContent.appendChild(submitPasswordButton);


        document.body.appendChild(verifyPasswordPopup);
    }


    function closeVerifyPasswordPopup() {
        let container = $(".verify-password-popup-container");

        if (container) {
            container.remove();
        }

        showOverlay2(false);
    }

    function closeEnterUserNamePopup() {
        let container = $(".enter-username-popup-container");

        if (container) {
            container.remove();
        }

        closeJoinRoomPopup();
        showOverlay2(false);
    }


    function closeJoinRoomPopup() {
        let container = $(".join-room-popup-container");

        if (container) {
            container.remove();
        }

        showOverlay(false);
    }

    function showConfirmationBox(confirmationBoxText = "Are you sure ??", confirmationBtnText = "Yes", imageUrl =
        false) {
        showOverlay(true);

        let confirmationBox = document
            .getElementById('confirmationBox')
            .content.cloneNode(true);

        document.body.appendChild(confirmationBox);

        let confirmationBoxContainer = document.getElementById('confirmation-box-container');

        if (imageUrl) {
            var imageContainer = confirmationBoxContainer.querySelector('.confirmation-box-image-container');
            if (imageContainer) {
                if (hasClass(imageContainer, "hidden")) {
                    removeClass(imageContainer, "hidden");
                }
                var imageElement = imageContainer.querySelector('img');
                imageElement.setAttribute('src', "{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/" + imageUrl);
            }
        }

        confirmationBoxContainer.querySelector('.confirmation-box-text').innerHTML = confirmationBoxText;
        confirmationBoxContainer.querySelector('.confirmation-box-btn').innerHTML = confirmationBtnText;

        return new Promise((resolve) => {
            document.getElementById('confirmBtn').addEventListener('click', () => {
                if (confirmationBoxContainer) {
                    confirmationBoxContainer.remove();
                }
                showOverlay(false);
                resolve(true);
            });

            confirmationBoxContainer.addEventListener('click', (event) => {
                if (event.target != document.getElementById('confirmBtn')) {
                    showOverlay(false);
                    if (confirmationBoxContainer) {
                        confirmationBoxContainer.remove();
                    }
                    resolve(false);
                }
            });
        });
    }

    function removeUserDraftInfo(socketId) {
        let allDraftInfoContainers = $all(".drafting-info-container");
        if (allDraftInfoContainers) {
            allDraftInfoContainers.forEach(elm => {
                if (elm.dataset.socketid === socketId && elm.dataset.picknumber >= currentMultiUserPick) {
                    addClass(elm, "hidden");
                }
            })
        }
    }

    function addSystemMessageToChat(message) {
        if (message) {
            let messageContainer = document.createElement('div');
            addClass(messageContainer, "message-container");

            let systemMessageContainer = document.createElement('div');
            addClass(systemMessageContainer, "system-message-container");

            let systemMessageText = document.createElement('span');
            addClass(systemMessageText, "system-message-text");
            systemMessageText.innerHTML = message;

            systemMessageContainer.appendChild(systemMessageText);
            messageContainer.appendChild(systemMessageContainer);

            let messageContainerInChat = $('.multi-user-chat .multi-user-chat-messages');
            messageContainerInChat.appendChild(messageContainer);
            messageContainerInChat.scrollTop = messageContainerInChat.scrollHeight;
        }
    }

    function addMessageToChat(message, sender) {
        if (message && sender) {
            let messageContainer = document.createElement('div');
            addClass(messageContainer, "message-container");

            let messageSenderImgContainer = document.createElement('div');
            let messageSenderImage = document.createElement('div');
            addClass(messageSenderImage, "msg-sender-img");
            messageSenderImgContainer.appendChild(messageSenderImage);
            messageContainer.appendChild(messageSenderImgContainer);


            let messageInfoContainer = document.createElement('div');
            addClass(messageInfoContainer, "message-info-container");

            let messageSenderInfo = document.createElement('div');
            addClass(messageSenderInfo, "message-sender-info-container");

            let messageSenderName = document.createElement('span');
            addClass(messageSenderName, "message-sender-name");
            messageSenderName.innerHTML = sender == currentUserName ? "You" : sender;
            messageSenderInfo.appendChild(messageSenderName);

            let messageTimeAgo = document.createElement('span');
            addClass(messageTimeAgo, "message-time-ago");
            let currMin = 0;
            messageTimeAgo.innerHTML = "- 0 mins ago";
            setInterval(() => {
                currMin = currMin + 1;
                messageTimeAgo.innerHTML = "- " + currMin + " mins ago";
            }, 1000 * 60);
            messageSenderInfo.appendChild(messageTimeAgo);

            messageInfoContainer.appendChild(messageSenderInfo);

            let messageText = document.createElement('div');
            addClass(messageText, "message-text");
            messageText.innerHTML = message;
            messageInfoContainer.appendChild(messageText);

            messageContainer.appendChild(messageInfoContainer);
            let messageContainerInChat = $('.multi-user-chat .multi-user-chat-messages');
            messageContainerInChat.appendChild(messageContainer);
            messageContainerInChat.scrollTop = messageContainerInChat.scrollHeight;
        }
    }

    function adjustingChatPopupPos() {
        let multiUserChatContainer = $(".multi-user-room-section .multi-user-chat");
        if (IS_DESKTOP) {
            if (multiUserChatContainer && hasClass(multiUserChatContainer, "multi-user-chat-popup")) {
                removeClass(multiUserChatContainer, "multi-user-chat-popup");
            }
        } else {
            if (multiUserChatContainer && !hasClass(multiUserChatContainer, "multi-user-chat-popup")) {
                addClass(multiUserChatContainer, "multi-user-chat-popup");
                addClass(multiUserChatContainer, "hidden");
            }
        }

        if (!IS_DESKTOP) {
            let chatHeader = $(".multi-user-chat-header");
            if (chatHeader) {
                chatHeader.addEventListener("click", closeChatPopup);
            }
        }

        let chatButton = $('.room-bottom-controls .chat-btn-container .chat-btn');
        if (chatButton) {
            chatButton.addEventListener("click", showChatPopup);
        }
    }

    function showChatPopup() {
        let multiUserChatContainer = $(".multi-user-room-section .multi-user-chat");
        if (multiUserChatContainer && hasClass(multiUserChatContainer, "hidden")) {
            removeClass(multiUserChatContainer, "hidden");

            let upsideDownBtn = $(".multi-user-chat-header .upside-down-button");
            if (upsideDownBtn) {
                removeClass(upsideDownBtn, "hidden");
            }

            let chatCountContainer = $(".chat-btn-container .unread-chat-count");
            if (chatCountContainer) {
                chatCountContainer.innerHTML = 0;
                chatCountContainer.dataset.count = 0;
                addClass(chatCountContainer, "hidden");
            }
        }
    }

    function closeChatPopup() {
        let multiUserChatContainer = $(".multi-user-room-section .multi-user-chat");
        if (multiUserChatContainer && !hasClass(multiUserChatContainer, "hidden")) {
            addClass(multiUserChatContainer, "hidden");
        }
    }

    function addStartMockDraftFn() {
        let filtersContainer = $('.teams-filters-container');
        if (filtersContainer && !hasClass(filtersContainer, "hidden")) {
            addClass(filtersContainer, "hidden");
        }

        let roomBottomControls = $('.room-bottom-controls .draft-now-btn');
        if (roomBottomControls && !hasClass(roomBottomControls, "hidden")) {
            addClass(roomBottomControls, "hidden");
        }

        let multiUserRoomContainer = $(".multi-user-room-container");
        if (multiUserRoomContainer) {
            multiUserRoomContainer.style.padding = "0px";
            multiUserRoomContainer.style.border = "unset";
            multiUserRoomContainer.style.width = "0px";
        }

        hideRoom();
        startMultiUserDraft();
    }

    function hideRoom() {
        let multiUserRoomContainer = $('.multi-user-room-container .multi-user-room');
        if (multiUserRoomContainer && !hasClass(multiUserRoomContainer, "hidden")) {
            addClass(multiUserRoomContainer, "hidden");
        }

        let multiUserChatConatiner = $('.multi-user-room-container .multi-user-chat');
        addClass(multiUserChatConatiner, "draft-chat-container");

        closeSelectTeamPopup();


        if (IS_DESKTOP) {
            let multiUserChatHeader = $(".multi-user-chat-header");
            let upsideDownButton = $('.multi-user-chat-header .upside-down-button');
            if (upsideDownButton && hasClass(upsideDownButton, "hidden")) {
                removeClass(upsideDownButton, "hidden");
            }

            if (upsideDownButton) {
                multiUserChatHeader.removeEventListener("click", hideRoomHandler);
                multiUserChatHeader.addEventListener("click", hideRoomHandler);
            }

            let closeButton = $('.multi-user-chat-header .close-icon');
            if (closeButton && !hasClass(closeButton, "hidden")) {
                addClass(closeButton, "hidden");
            }
        } else {
            let mwebMultiChatPopup = $('.multi-user-room-section .draft-chat-container');
            if (mwebMultiChatPopup) {
                addClass(mwebMultiChatPopup, "mweb-draft-multi-user-chat");
            }
        }
    }

    function hideRoomHandler() {
        let chatContent = $('.multi-user-chat-content');
        if (chatContent) {
            chatContent.classList.toggle("hidden");
        }

        let chatInputs = $('.multi-user-chat-input');
        if (chatInputs) {
            chatInputs.classList.toggle("hidden");
        }

        let upsideDownButton = $('.multi-user-chat-header .upside-down-button');
        let downIcon = upsideDownButton.querySelector('img');
        if (downIcon) {
            downIcon.classList.toggle("transform-btn-upsidedown");
        }

        let chatCountContainer = $(".multi-user-chat .unread-chat-count");
        if (chatCountContainer) {
            chatCountContainer.dataset.count = 0;
            chatCountContainer.innerHTML = "";
            addClass(chatCountContainer, "hidden");
        }
    }

    function showCopiedTooltip(e) {

        let button = e.target;

        let tooltip = document.createElement('div');
        tooltip.className = 'copy-btn-tooltip';
        tooltip.textContent = 'Copied';

        let rect = button.getBoundingClientRect();
        tooltip.style.top = rect.bottom + 'px';
        tooltip.style.left = rect.right + 'px';

        document.body.appendChild(tooltip);

        tooltip.style.display = 'block';

        setTimeout(function() {
            document.body.removeChild(tooltip);
        }, 1000);

    }

    async function initMultiUser() {
        await initSocket();
        let overlay = document.createElement("div");
        addClass(overlay, "hidden");
        addClass(overlay, "overlay");
        document.body.appendChild(overlay);

        overlay = document.createElement("div");
        addClass(overlay, "hidden");
        addClass(overlay, "overlay2");
        document.body.appendChild(overlay);

        let roomControlsButton = $(".multi-user-room .room-controls");
        if (roomControlsButton) {
            roomControlsButton.addEventListener("click", function() {
                let roomControlOption = roomControlsButton.querySelector(".room-controls-options");
                if (roomControlOption && hasClass(roomControlOption, "hidden")) {
                    removeClass(roomControlOption, "hidden");
                }
            })

            let leaveRoomBtn = roomControlsButton.querySelector(".leave-room-btn");
            if (leaveRoomBtn) {
                leaveRoomBtn.addEventListener("click", leaveRoom);
            }

            document.addEventListener("click", hideRoomControls);
        }


        let copyRoomIdBtn = $(".room-id-copy");
        let copyPasswordBtn = $(".room-password-copy");

        if (copyRoomIdBtn) {
            copyRoomIdBtn.addEventListener("click", function(e) {
                showCopiedTooltip(e);
                navigator.clipboard.writeText(currentRoomData["roomId"]);
            });
        }

        if (copyPasswordBtn) {
            copyPasswordBtn.addEventListener("click", function(e) {
                showCopiedTooltip(e);
                navigator.clipboard.writeText(currentRoomData["password"]);
            });
        }

        let shareRoomBtn = $(".share-btn-container .share-btn");

        if (!navigator || !navigator.share) {
            let shareIcon = shareRoomBtn.querySelector('img');
            shareIcon.setAttribute("src", "{$smarty.const.STATIC_URL}/skm/assets/nfl-mockup/copy-btn-icon.png");
        }

        if (shareRoomBtn) {
            shareRoomBtn.addEventListener("click", function(e) {

                let currentURL = window.location.href;

                let separator = currentURL.indexOf('?') !== -1 ? '&' : '?';

                let updatedURL = currentURL + separator + 'roomId=' + currentRoomData["roomId"] +
                    "&joinRoom=true";


                if (!navigator || !navigator.share) {
                    navigator.clipboard.writeText(updatedURL);
                    showCopiedTooltip(e);
                } else {
                    navigator.share({ url: updatedURL });
                }
            });
        }

        if (paramRoomId && joinRoomFlag) {
            joinRoomBtn.click();
        }
        let sendMessageButton = $('.multi-user-chat .user-msg-send-btn');
        if (sendMessageButton) {
            sendMessageButton.addEventListener("click", function() {
                let userMsgInput = $('.multi-user-chat .user-msg-input');
                if (userMsgInput && userMsgInput.value) {
                    sendMessage(userMsgInput.value);
                    userMsgInput.value = '';
                }
            });
        }

        let userMsgInput = $('.multi-user-chat .user-msg-input');
        if (userMsgInput) {
            userMsgInput.addEventListener("keypress", function(e) {
                let key = e.which && e.which || e.keyCode();
                if (key === 13) {
                    if (userMsgInput.value) {
                        sendMessage(userMsgInput.value);
                        userMsgInput.value = '';
                    }
                }
            });
        }

        adjustingChatPopupPos();


        let roomDraftNowBtn = $('.room-footer .draft-now-btn');
        let bottomDraftNowBtn = $('.room-bottom-controls .draft-now-btn-container .draft-now-btn');

        if (roomDraftNowBtn) {
            roomDraftNowBtn.addEventListener("click", sendStartDraftEvent);
        }

        if (bottomDraftNowBtn) {
            bottomDraftNowBtn.addEventListener("click", sendStartDraftEvent);
        }
    }

    function sendMultiUserSelectedPlayerInfo(target) {
        lastPlayerSelectedForPick = currentMultiUserPick;
        setTimeout(() => {
            lastPlayerSelectedForPick = "";
        }, 3000);
        socket.emit("proposal-resume", {
            socketId: currentUserSocketId,
            roomId: currentRoomData.roomId,
            runSim: false,
        });
        fillDraftingUserInfo("Drafted");
        var roomId = currentRoomData["roomId"];
        var parent = target.closest(".player");
        var playerNumber = parseInt(parent.dataset.number);

        var selectionInfo = {
            pickNumber: currentMultiUserPick,
            playerNumber,
            roomId,
        }

        if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
            for (var i = 0; i < playersList.length; i++) {
                if (playersList[i].number === playerNumber) {
                    player = playersList[i];
                }
            }

            let roundIndex = roundends.findIndex(num => num >= currentMultiUserPick);
            if (roundIndex === 0) {
                roundIndex = 1;
            }
            let dashboardEventData = {
                userId: mdsLoggedInUserId,
                draftType: "multiUser",
                properties: [{
                    propertyName: "playerDrafted",
                    propertyValue: 1,
                }],
                draftedPlayer: {
                    playerName: player.name,
                    position: player.position,
                    round: roundText[roundIndex - 1],
                    college: player.draftFrom,
                    conference: player.Conference,
                }
            }
            sendUserDashboardData(dashboardEventData);
            dashboardDraftedPlayers.push([player, currentMultiUserPick]);
        }

        console.log("selected player info->", selectionInfo);

        multiUserCounterOffersList.forEach((offer) => {
            let offerResponse = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
                runSim: false,
            };

            offerResponse.allUserPicksToTrade = offer.allUserPicksToTrade;
            offerResponse.offerList = offer.offerList;
            offerResponse.currentTeamName = offer.currentTeamName;
            offerResponse.offeringTeamShortName = offer.offeringTeamShortName;
            toBeHandledOffers.rejectedCounterOffers.push(offerResponse);
        })

        multiUserTradeOffersList.forEach((offer) => {
            let offerResponse = {
                allUserPicksToTrade: "",
                offerList: "",
                currentTeamName: "",
                offeringTeamShortName: "",
                pickNumber: currentMultiUserPick,
                roomId: currentRoomData.roomId,
                runSim: false,
            };

            offerResponse.allUserPicksToTrade = offer.allUserPicksToTrade;
            offerResponse.offerList = offer.offerList;
            offerResponse.currentTeamName = offer.currentTeamName;
            offerResponse.offeringTeamShortName = offer.offeringTeamShortName;
            toBeHandledOffers.rejectedTradeOffers.push(offerResponse);
        })

        offersList.length = 0;
        multiUserSystemOffersList.length = 0;
        multiUserCounterOffersList.length = 0;
        multiUserTradeOffersList.length = 0;
        proposedTeamsData.length = 0;
        currentOfferTeam = "";
        counteredTeams.length = 0;
        currentPickIsMine = false;
        hideUserSelectionIcon();
        clearOffers();
        toBeHandledOffers.selectedPlayer = selectionInfo;

        setTimeout(() => {
            handleAccumulatedOffers();
        }, 100);
    }

    function startMultiUserDraft() {
        startCollectiongDashboardTimeSpentData();
        if (mdsUserIsLoggedIn && mdsLoggedInUserId) {
            let dashboardEventData = {
                userId: mdsLoggedInUserId,
                draftType: "multiUser",
                properties: [{
                    propertyName: "draftsStartedCount",
                    propertyValue: 1,
                }]
            }
            sendUserDashboardData(dashboardEventData);
        }
        trackGAEventForPage("multi_user_draft_start");
        clearCountdownTimers();
        simFinishedRoomData = currentRoomData;
        if (brand) {
            var simContentHolder = $(".simulator-content-holder");
            if (simContentHolder) {
                simContentHolder.style.marginBottom = "10px";
            }
        }

        let rankingUpdatesBtn = $(".ranking-updates-btn");
        if (rankingUpdatesBtn) {
            addClass(rankingUpdatesBtn, "hidden");
        }

        let playPauseButtonsContainer = $(".sim-pause-play-buttons");
        if (playPauseButtonsContainer) {
            let pauseDraftBtn = playPauseButtonsContainer.querySelector(".pause-draft");
            if (pauseDraftBtn) {
                addClass(pauseDraftBtn, "hidden");
            }

            let resumeDraftBtn = playPauseButtonsContainer.querySelector(".resume-draft");
            if (resumeDraftBtn) {
                removeClass(resumeDraftBtn, "hidden");
                resumeDraftBtn.disabled = true;
                resumeDraftBtn.style.opacity = "0.4";
                resumeDraftBtn.style.cursor = "not-allowed";
            }
        }

        let restartBtn = $(".restart-simulation");
        if (restartBtn) {
            addClass(restartBtn, "hidden");
        }

        let revertPickBtn = $(".revert-pick");
        if (revertPickBtn) {
            addClass(revertPickBtn, "hidden");
        }

        let leaveRoomBtn = $(".leave-multi-user-draft");
        if (leaveRoomBtn) {
            removeClass(leaveRoomBtn, "hidden");
        }

        let showParticipantsBtn = $(".multi-user-draft-participants");
        if (showParticipantsBtn) {
            removeClass(showParticipantsBtn, "hidden");
        }

        rounds = currentRoomData.rounds;

        var seoHeaderText = $(".seo-header-text");
        if (seoHeaderText) {
            addClass(seoHeaderText, "hidden");
        }

        var draftSelectionContainer = $(".teams-filters-container");
        if (draftSelectionContainer) {
            addClass(draftSelectionContainer, "hidden");
        }

        var infoSection = $(".page-info");
        if (infoSection) {
            addClass(infoSection, "hidden");
        }

        var sectionSeparator = $(".section-separator");
        if (sectionSeparator) {
            addClass(sectionSeparator, "hidden");
        }

        var draftSimulationContainer = $(".draft-simulation-container");
        if (draftSimulationContainer) {
            removeClass(draftSimulationContainer, "hidden");
        }

        currentSection = "result";
        disableShowOffersBtn();
        assignPicks();
        calculateAllTeamsNeeds();
        fillRoundPics();
        fillPlayersList();

        var roundsPicksHolder = $(".rounds-pics-container");
        if (roundsPicksHolder) {
            roundsPicksHolder.scrollTo(0, 0);
        }

        var seoContent = $(".tag-page-info-container");
        if (seoContent) {
            addClass(seoContent, "hidden");
        }
        var relatedStories = $(".tag-page-related-stories-section");
        if (relatedStories) {
            addClass(relatedStories, "hidden");
        }

        let upsideDownButton = $('.multi-user-chat-header .upside-down-button');
        if (upsideDownButton) {
            upsideDownButton.click();
        }

        let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
        if (myPicksBtn) {
            myPicksBtn.innerHTML = "OUR PICKS";
        }

        let myDraftBtn = $(".result-btns-holder .my-draft-btn");
        if (myDraftBtn) {
            myDraftBtn.innerHTML = "Our Draft";
        }

        const toolContainer = $(".pfn-content-container");
        if (toolContainer) {
            toolContainer.style.marginBottom = "unset";
        }

        if (!IS_DESKTOP) {
            let myPicksBtn = $(".sim-nav-container .my-picks");
            if (myPicksBtn) {
                myPicksBtn.innerHTML = "OUR PICKS";
            }

            let myDraftBtn = $(".bottom-controls .my-draft-btn");
            if (myDraftBtn) {
                myDraftBtn.innerHTML = "<span>Our Draft</span>";
            }

            let bottomControls = $(".room-bottom-controls");
            if (bottomControls) {
                bottomControls.style.width = "35%";
                bottomControls.style.bottom = "105px";
                bottomControls.style.left = "0px";
                bottomControls.style.backgroundColor = "transparent";
                bottomControls.style.padding = "0 10px";
                let draftNowBtn = bottomControls.querySelector(".draft-now-btn-container");
                if (draftNowBtn) {
                    addClass(draftNowBtn, "hidden");
                }

                let chatBtn = bottomControls.querySelector(".chat-btn-container");
                if (chatBtn) {
                    chatBtn.style.width = "100%";
                }
            }
        }
    }

    function fillMultiUserPlayerInPick(data) {
        let selectedPick;
        let selectedPlayer;
        for (let i = 0; i < picksList.length; i++) {
            if (picksList[i].number == data.pickNumber) {
                selectedPick = picksList[i];
                break;
            }
        }
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].number == data.playerNumber) {
                selectedPlayer = playersList[i];
                break;
            }
        }

        processMultiUserCurrentPick(selectedPick, selectedPlayer);
    }

    function processMultiUserCurrentPick(pick, player) {
        pick.currentTeam.targetPlayer = "";
        pick.playerSelection = player;
        computeAndStorePickGrade(pick);
        var pickContainer = $(".pick-number-" + pick.number);
        if (pick && pickContainer) {
            var playersContainer = $(".players-holder .players-list");
            var playerHolders;
            if (playersContainer) {
                playerHolders = playersContainer.children;
            }
            var playerContainer;
            for (var j = 0; j < playerHolders.length; j++) {
                if (playerHolders[j].dataset.name == player.name) {
                    playerContainer = playerHolders[j];
                    break;
                }
            }
            if (pickContainer && playerContainer) {
                fillSelectedPlayerInPick(pickContainer, playerContainer, player);
                if (IS_DESKTOP) {
                    let myPicksBtn = $(".mypicks-btn-holder .my-picks-btn");
                    if (myPicksBtn && myPicksBtn.classList.contains("selected")) {
                        let selectedTeamBtn = $(
                            ".selected-user-teams-container .team-logo-btn-container.selected button.team-logo-btn");
                        if (selectedTeamBtn) {
                            selectedTeamBtn.click();
                        }
                    }
                }
            }
        }
        pick.currentTeam.draftedPlayers.push(player);
        player.draftedBy = pick.currentTeam;
        for (var j = 0; j < playersList.length; j++) {
            if (playersList[j].name === player.name) {
                playersList.splice(j, 1);
            }
        }
        
        if (!pick.currentTeam.doNotDraft.includes(player.position)) {
            pick.currentTeam.doNotDraft.push(player.position);
        }
        if (pick.currentTeam.teamNeed1 === player.position) {
            pick.currentTeam.teamNeed1 = "";
        }
        if (pick.currentTeam.teamNeed2 === player.position) {
            pick.currentTeam.teamNeed2 = "";
        }
        if (pick.currentTeam.teamNeed3 === player.position) {
            pick.currentTeam.teamNeed3 = "";
        }
        if (player.position === "QB") {
            if (pick.currentTeam.needQB < 1) {
                pick.currentTeam.needQB *= 0;
            } else if (pick.currentTeam.needQB === 1) {
                pick.currentTeam.needQB *= 0.1;
            } else {
                pick.currentTeam.needQB = 0.5;
            }
        } else if (player.position === "RB") {
            if (pick.currentTeam.needRB < 1) {
                pick.currentTeam.needRB *= 0;
            } else if (pick.currentTeam.needRB === 1) {
                pick.currentTeam.needRB *= 0.1;
            } else {
                pick.currentTeam.needRB = 1;
            }
        } else if (player.position === "WR") {
            if (pick.currentTeam.needWR < 1) {
                pick.currentTeam.needWR *= 0;
            } else if (pick.currentTeam.needWR === 1) {
                pick.currentTeam.needWR *= 0.1;
            } else {
                pick.currentTeam.needWR = 1;
            }
        } else if (player.position === "TE") {
            if (pick.currentTeam.needTE < 1) {
                pick.currentTeam.needTE *= 0;
            } else if (pick.currentTeam.needTE === 1) {
                pick.currentTeam.needTE *= 0.1;
            } else {
                pick.currentTeam.needTE = 1;
            }
        } else if (player.position === "OT") {
            if (pick.currentTeam.needOT < 1) {
                pick.currentTeam.needOT *= 0;
            } else if (pick.currentTeam.needOT === 1) {
                pick.currentTeam.needOT *= 0.1;
            } else {
                pick.currentTeam.needOT = 1;
            }
        } else if (player.position === "OG") {
            if (pick.currentTeam.needOG < 1) {
                pick.currentTeam.needOG *= 0;
            } else if (pick.currentTeam.needOG === 1) {
                pick.currentTeam.needOG *= 0.1;
            } else {
                pick.currentTeam.needOG = 1;
            }
        } else if (player.position === "OC") {
            if (pick.currentTeam.needOC < 1) {
                pick.currentTeam.needOC *= 0;
            } else if (pick.currentTeam.needOC === 1) {
                pick.currentTeam.needOC *= 0.1;
            } else {
                pick.currentTeam.needOC = 1;
            }
        } else if (player.position === "EDGE") {
            if (pick.currentTeam.needEDGE < 1) {
                pick.currentTeam.needEDGE *= 0;
            } else if (pick.currentTeam.needEDGE === 1) {
                pick.currentTeam.needEDGE *= 0.1;
            } else {
                pick.currentTeam.needEDGE = 1;
            }
        } else if (player.position === "LB") {
            if (pick.currentTeam.needLB < 1) {
                pick.currentTeam.needLB *= 0;
            } else if (pick.currentTeam.needLB === 1) {
                pick.currentTeam.needLB *= 0.1;
            } else {
                pick.currentTeam.needLB = 1;
            }
        } else if (player.position === "CB") {
            if (pick.currentTeam.needCB < 1) {
                pick.currentTeam.needCB *= 0;
            } else if (pick.currentTeam.needCB === 1) {
                pick.currentTeam.needCB *= 0.1;
            } else {
                pick.currentTeam.needCB = 1;
            }
        } else if (player.position === "S") {
            if (pick.currentTeam.needS < 1) {
                pick.currentTeam.needS *= 0;
            } else if (pick.currentTeam.needS === 1) {
                pick.currentTeam.needS *= 0.1;
            } else {
                pick.currentTeam.needS = 1;
            }
        }
        if (player.position === "QB") {
            pick.currentTeam.qbCount = pick.currentTeam.qbCount + 1;
        }
    }

    function closeRemoveMultiUserParticipantsPopup(event) {
        let participantsContainer = $(".multi-user-remove-participants-popup");
        let overlay = $(".overlay");
        if (participantsContainer && (!event.target.closest(
                ".multi-user-remove-participants-popup") || event.target.closest(
                ".close-remove-participants-popup-btn")) &&
            !event.target.closest(".multi-user-draft-participants")) {
            participantsContainer.remove();
            if (overlay && !checkForAlreadyOpenPopup()) {
                addClass(overlay, "hidden");
            }
        }
    }

    function removeMultiUserParticipantsFromRoom() {
        let participantsContainer = $(".multi-user-remove-participants-popup");
        let membersList = [];
        if (participantsContainer) {
            let allInputs = participantsContainer.querySelectorAll("input");
            if (allInputs.length) {
                for (let i = 0; i < allInputs.length; i++) {
                    if (allInputs[i].checked) {
                        let member = {
                            roomId: currentRoomData.roomId,
                            socketId: allInputs[i].value,
                            adminName: currentUserName,
                            removedUserName: allInputs[i].dataset.username,
                        };

                        membersList.push(member);
                    }
                }
            }
        }

        if (membersList.length) {
            socket.emit('remove_multiple_from_room', membersList);
        }

        let closePopupBtn = participantsContainer.querySelector(".close-remove-participants-popup-btn");
        if (closePopupBtn) {
            closePopupBtn.click();
        }
    }

    function checkParticipantsForRemoval(e) {
        let participantsContainer = $(".multi-user-remove-participants-popup");
        let btnEnabled = false;
        let removePlayersBtn = participantsContainer.querySelector(".remove-participants-btn");
        if (participantsContainer) {
            let allInputs = participantsContainer.querySelectorAll("input");
            if (allInputs.length) {
                for (let i = 0; i < allInputs.length; i++) {
                    if (allInputs[i].checked) {
                        btnEnabled = true;
                        if (removePlayersBtn) {
                            removePlayersBtn.disabled = false;
                            removeClass(removePlayersBtn, "disabled");
                        }

                        break;
                    }
                }
            }

            if (!btnEnabled && removePlayersBtn) {
                removePlayersBtn.disabled = true;
                addClass(removePlayersBtn, "disabled");
            }
        }
    }

    function showParticipantsForRemoval() {
        let participantsContainer = document.getElementById("multi-user-remove-participants").content.cloneNode(true);
        participantsContainer = participantsContainer.querySelector(".multi-user-remove-participants-popup");

        if (participantsContainer) {
            closePopupBtn = participantsContainer.querySelector(".close-remove-participants-popup-btn");
            if (closePopupBtn) {
                closePopupBtn.addEventListener("click", closeRemoveMultiUserParticipantsPopup);
            }

            let participantsTable = document.createElement("table");
            addClass(participantsTable, "participants-table");
            let thead = document.createElement("thead");
            let tableRow = document.createElement("tr");
            let heading1 = document.createElement("th");
            let heading1Text = document.createElement("span");
            addClass(heading1Text, "player-text");
            heading1Text.innerHTML = "Player";
            heading1.appendChild(heading1Text);
            tableRow.appendChild(heading1);

            let heading2 = document.createElement("th");
            let heading2Text = document.createElement("span");
            heading2Text.innerHTML = "Team";
            heading2.appendChild(heading2Text);
            tableRow.appendChild(heading2);

            let heading3 = document.createElement("th");
            let heading3Text = document.createElement("span");
            heading3Text.innerHTML = "Resume Pending";
            heading3.appendChild(heading3Text);
            tableRow.appendChild(heading3);
            thead.appendChild(tableRow);
            participantsTable.appendChild(thead);

            let tbody = document.createElement("tbody");
            participantsTable.appendChild(tbody);

            let participantsListContainer = participantsContainer.querySelector(".participants-list-container");
            if (participantsListContainer) {
                currentRoomData.members.forEach(member => {
                    let tableRow = document.createElement("tr");
                    let playerContent = document.createElement("td");
                    let memberContainer = document.createElement("div");
                    addClass(memberContainer, "participant-holder");
                    if (currentUserIsAdmin) {
                        let input = document.createElement("input");
                        input.addEventListener("change", checkParticipantsForRemoval);
                        input.type = "checkbox";
                        input.id = member.socketId;
                        input.name = member.socketId;
                        input.value = member.socketId;
                        input.dataset.username = member.userName;
                        memberContainer.appendChild(input);
                    }

                    let label = document.createElement("label");
                    label.htmlFor = member.socketId;
                    if (member.socketId === currentRoomData.admin) {
                        label.innerHTML = member.userName + " (Owner)";
                    } else {
                        label.innerHTML = member.userName;
                    }
                    memberContainer.appendChild(label);
                    playerContent.appendChild(memberContainer);
                    tableRow.appendChild(playerContent);

                    let teamContent = document.createElement("td");
                    let teamHolder = document.createElement("div");
                    addClass(teamHolder, "team-content");
                    let teamImgHolder = document.createElement("div");
                    addClass(teamImgHolder, "team-logo-holder");
                    let teamImg = document.createElement("img");
                    let teamLogo;
                    for (let i = 0; i < teamsList.length; i++) {
                        if (teamsList[i].shortName === member.teams[0]) {
                            teamLogo = teamsList[i].teamLogo;
                            break;
                        }
                    }
                    teamImg.src = STATIC_URL + teamLogoPath + teamLogo + "?w=80&tag=" + imageRefreshTag;
                    teamImg.style.width = "25px";
                    teamImgHolder.appendChild(teamImg);
                    teamHolder.appendChild(teamImgHolder);

                    let teamName = document.createElement("span");
                    teamName.innerHTML = member.teams[0];
                    teamHolder.appendChild(teamName);
                    teamContent.appendChild(teamHolder);
                    tableRow.appendChild(teamContent);

                    let resumeStatus = document.createElement("td");
                    addClass(resumeStatus, "resume-status");
                    let status = document.createElement("span");
                    status.dataset.socketid = member.socketId;
                    if (multiUserDraftPauseList.includes(member.socketId)) {
                        status.innerHTML = "Yes";
                    } else {
                        status.innerHTML = "No";
                    }

                    resumeStatus.appendChild(status);
                    tableRow.appendChild(resumeStatus);
                    tbody.appendChild(tableRow);

                })
            }

            participantsListContainer.appendChild(participantsTable);
            let removeMembersBtnContainer = participantsContainer.querySelector(".remove-participants-btn-container");
            let headerText = participantsContainer.querySelector(".remove-participants-popup-header-text");
            if (!currentUserIsAdmin) {
                addClass(removeMembersBtnContainer, "hidden");

                if (headerText) {
                    headerText.innerHTML = "Participants";
                }
            } else {
                if (headerText) {
                    headerText.innerHTML = "Select participants to remove";
                }
            }

            addClass(participantsContainer, "popup");
            document.body.appendChild(participantsContainer);

            var overlay = $(".overlay");
            if (overlay) {
                removeClass(overlay, "hidden");
            }
        }
    }

    initMultiUser();
</script>
