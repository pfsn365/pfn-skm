<script>
    function drawFuturePickToCanvas(ctx, xPos, yPos, futurePick) {
        ctx.fillStyle = "#000";
        ctx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText(futurePick.year + " " + futurePick.team + " " + futurePick.round, xPos + futurePick.colStarting +
            95, yPos + 40);
    }

    function drawTradedPlayerToCanvas(ctx, xPos, yPos, tradedPlayer) {
        if (tradedPlayer.teamFlag) {
            ctx.drawImage(tradedPlayer.teamFlag, xPos + 40 + tradedPlayer.colStarting, yPos + 18, 40, 27);
        }
        ctx.fillStyle = "#000";
        ctx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        var text = tradedPlayer.name;
        if (tradedPlayer.position) {
            text += " (" + tradedPlayer.position + ")";
        }
        ctx.fillText(text, xPos + tradedPlayer.colStarting + 95, yPos + 35);
    }

    function drawDividerLine(ctx, yPos, canvasWidth, colStarting) {
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(colStarting + 10, yPos - 5);
        ctx.lineTo(colStarting + canvasWidth - 10, yPos - 5);
        ctx.stroke();
    }

    var gradeBarColors = {
        'A+': '#F5C518', 'A': '#2e7d32', 'A-': '#388e3c',
        'B+': '#43a047', 'B': '#66bb6a', 'B-': '#9ccc65',
        'C+': '#cddc39', 'C': '#ef6c00', 'C-': '#f57c00',
        'D+': '#fb8c00', 'D': '#e53935', 'D-': '#c62828',
        'F': '#7f0000'
    };

    function drawGradeToCanvas(ctx, xPos, yPos, grade) {
        if (!grade) return;
        var color = gradeBarColors[grade] || '#737373';
        ctx.fillStyle = color;
        ctx.fillRect(xPos, yPos, 3, 18);
        ctx.fillStyle = '#374151';
        ctx.font = "800 13px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText(grade, xPos + 8, yPos + 14);
    }

    function drawOverallGradeBanner(ctx, yPos, canvasWidth, grade) {
        ctx.fillStyle = "#FFD166";
        ctx.fillRect(0, yPos, canvasWidth, 35);
        ctx.fillStyle = "#000";
        ctx.font = "500 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        var label = "OVERALL DRAFT GRADE:";
        var labelWidth = ctx.measureText(label).width;
        ctx.fillText(label, canvasWidth / 2 - (labelWidth / 2) - 20, yPos + 23);
        ctx.font = "500 22px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText(grade, canvasWidth / 2 + (labelWidth / 2) - 10, yPos + 25);
    }

    function drawTradeGradesToCanvas(ctx, xPos, yPos, tradeGrades, canvasWidth) {
        drawDividerLine(ctx, yPos, canvasWidth, 0);
        yPos += 20;
        ctx.fillStyle = "#666";
        ctx.font = "600 13px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText("Trade Grades", xPos, yPos);
        yPos += 18;

        var assetLineHeight = 22;
        var useTwoColTrades = tradeGrades.length > 1;
        var colWidth = useTwoColTrades ? (canvasWidth - xPos * 2 - 15) / 2 : canvasWidth - xPos * 2;
        var startY = yPos;
        var col1MaxY = yPos;

        for (var i = 0; i < tradeGrades.length; i++) {
            var tg = tradeGrades[i];
            var totalAssets = tg.sentAssets.length + tg.recAssets.length;
            var cardHeight = 40 + (totalAssets * assetLineHeight) + 95;

            var colX = xPos;
            if (useTwoColTrades && i % 2 === 1) {
                colX = xPos + colWidth + 15;
            }
            if (useTwoColTrades && i % 2 === 0 && i > 0) {
                yPos = Math.max(yPos, col1MaxY);
            }
            if (useTwoColTrades && i % 2 === 0) {
                startY = yPos;
            }

            // Card background + border
            ctx.fillStyle = "#f9fafb";
            ctx.fillRect(colX, yPos, colWidth, cardHeight);
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 1;
            ctx.strokeRect(colX, yPos, colWidth, cardHeight);

            // Header: title + grade
            ctx.fillStyle = "#1a1a1a";
            ctx.font = "700 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText(tg.title, colX + 8, yPos + 18);
            drawGradeToCanvas(ctx, colX + colWidth - 45, yPos + 6, tg.grade);

            // Divider
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(colX + 8, yPos + 28);
            ctx.lineTo(colX + colWidth - 8, yPos + 28);
            ctx.stroke();

            var itemY = yPos + 38;

            // RECEIVED section
            ctx.fillStyle = "#9ca3af";
            ctx.font = "700 9px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText("RECEIVED", colX + 8, itemY);
            itemY += 4;
            for (var s = 0; s < tg.sentAssets.length; s++) {
                itemY += assetLineHeight;
                ctx.fillStyle = "#374151";
                ctx.font = "400 11px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                var sentLabel = tg.sentAssets[s].label;
                if (sentLabel.length > 28) sentLabel = sentLabel.substring(0, 27) + "..";
                ctx.fillText(sentLabel, colX + 8, itemY);
                ctx.fillStyle = "#6b7280";
                ctx.font = "600 11px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                ctx.fillText(Math.round(tg.sentAssets[s].value), colX + colWidth - 40, itemY);
            }

            // Total Received
            itemY += 6;
            ctx.strokeStyle = "#d1d5db";
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(colX + 8, itemY);
            ctx.lineTo(colX + colWidth - 8, itemY);
            ctx.stroke();
            ctx.setLineDash([]);
            itemY += 14;
            ctx.fillStyle = "#374151";
            ctx.font = "700 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText("Total Received", colX + 8, itemY);
            ctx.fillText(Math.round(tg.sentTotal), colX + colWidth - 40, itemY);

            // SENT section
            itemY += 18;
            ctx.fillStyle = "#9ca3af";
            ctx.font = "700 9px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText("SENT", colX + 8, itemY);
            itemY += 4;
            for (var r = 0; r < tg.recAssets.length; r++) {
                itemY += assetLineHeight;
                ctx.fillStyle = "#374151";
                ctx.font = "400 11px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                var recLabel = tg.recAssets[r].label;
                if (recLabel.length > 28) recLabel = recLabel.substring(0, 27) + "..";
                ctx.fillText(recLabel, colX + 8, itemY);
                ctx.fillStyle = "#6b7280";
                ctx.font = "600 11px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                ctx.fillText(Math.round(tg.recAssets[r].value), colX + colWidth - 40, itemY);
            }

            // Total Sent
            itemY += 6;
            ctx.strokeStyle = "#d1d5db";
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(colX + 8, itemY);
            ctx.lineTo(colX + colWidth - 8, itemY);
            ctx.stroke();
            ctx.setLineDash([]);
            itemY += 14;
            ctx.fillStyle = "#374151";
            ctx.font = "700 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText("Total Sent", colX + 8, itemY);
            ctx.fillText(Math.round(tg.recTotal), colX + colWidth - 40, itemY);

            // Net value
            itemY += 16;
            var netText = "Net: " + (tg.netValue >= 0 ? "+" : "") + Math.round(tg.netValue);
            ctx.fillStyle = "#374151";
            ctx.font = "600 10px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            var netWidth = ctx.measureText(netText).width;
            ctx.fillText(netText, colX + (colWidth / 2) - (netWidth / 2), itemY);

            var cardEndY = yPos + cardHeight + 10;
            if (useTwoColTrades && i % 2 === 0) {
                col1MaxY = cardEndY;
                yPos = startY;
            } else {
                yPos = Math.max(cardEndY, col1MaxY);
            }
        }

        if (useTwoColTrades && tradeGrades.length % 2 === 1) {
            yPos = col1MaxY;
        }

        return yPos;
    }

    function drawOnePlayerToCanvas(ctx, xPos, yPos, player) {
        ctx.drawImage(player.teamFlag, xPos + 40 + player.colStarting, yPos + 18, 40, 27);

        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#000";
        ctx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText(player.pickNumber + ".", xPos + player.colStarting, yPos + 35);

        ctx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText(player.name, xPos + 95 + player.colStarting, yPos + 30);

        ctx.fillStyle = "#9b9b9b";
        ctx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        ctx.fillText(player.subText, xPos + 95 + player.colStarting, yPos + 50);

        if (player.grade && player.gradeX !== undefined) {
            drawGradeToCanvas(ctx, player.gradeX, yPos + 22, player.grade);
        }

        if (player.tradeIcon) {
            ctx.drawImage(player.tradeIcon, xPos + 75 + player.colStarting, yPos + 40, 15, 15);
        }

        if (player.draftedBy) {
            ctx.fillStyle = "#999999";
            ctx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText("Drafted", xPos + 290 + player.colStarting, yPos + 30);

            ctx.fillStyle = "#2D2D2D";
            ctx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText(player.draftedBy, xPos + 295 + player.colStarting, yPos + 50);
        }
    }

    function getPickDraftedBy(teamName, pickNumber) {
        let member = simFinishedRoomData.members.find(member => {
            if (member.teams.includes(teamName)) {
                return true;
            }
        });

        if (member) {
            let userLeft = usersLeftInfo.find(userInfo => {
                if (member.socketId === userInfo[0] && pickNumber > userInfo[1]) {
                    return true;
                }
            });

            if (!userLeft) {
                return member.userName;
            }
        }
    }

    function generateCanvas(baseX, baseY, canvasWidth, canvasHeight, scaleFactor, simPicks, nearFuturePicks, isTeam,
        roundNumber, currentTeam, noteText, acquiredPlayers, tradedAwayPicks, tradedAwayPlayers, overallGrade, tradeGrades, showGrades) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        var width = canvasWidth;
        var height = canvasHeight;

        var dpr = scaleFactor || window.devicePixelRatio;

        var acquiredPlayersCount = acquiredPlayers ? acquiredPlayers.length : 0;
        var tradedAwayPicksCount = tradedAwayPicks ? tradedAwayPicks.length : 0;
        var tradedAwayPlayersCount = tradedAwayPlayers ? tradedAwayPlayers.length : 0;
        var totalTradedAwayCount = tradedAwayPicksCount + tradedAwayPlayersCount;
        var tradedPlayersCount = acquiredPlayersCount + totalTradedAwayCount;
        var totalUpperItems = simPicks.length + nearFuturePicks.length + tradedPlayersCount;
        if (!isTeam || (isTeam && totalUpperItems > 5)) {
            // Measure longest second column content to determine canvas width
            var tempCanvas = document.createElement("canvas");
            var tempCtx = tempCanvas.getContext("2d");
            var maxCol2Width = 0;
            var halfItems = Math.ceil(totalUpperItems / 2);
            if (isTeam && totalUpperItems > 5) {
                for (var wi = halfItems; wi < simPicks.length; wi++) {
                    if (simPicks[wi] && simPicks[wi].playerSelection) {
                        tempCtx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                        var nw = tempCtx.measureText(simPicks[wi].playerSelection.name).width;
                        tempCtx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                        var sw = tempCtx.measureText(simPicks[wi].playerSelection.position + " " + simPicks[wi].playerSelection.draftFrom).width;
                        var tw = Math.max(nw, sw) + 80;
                        if (tw > maxCol2Width) maxCol2Width = tw;
                    }
                }
            } else if (!isTeam && showGrades) {
                var fullHalfPicks = Math.ceil(simPicks.length / 2);
                for (var wi = fullHalfPicks; wi < simPicks.length; wi++) {
                    if (simPicks[wi] && simPicks[wi].playerSelection) {
                        tempCtx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                        var nw = tempCtx.measureText(simPicks[wi].playerSelection.name).width;
                        tempCtx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                        var sw = tempCtx.measureText(simPicks[wi].playerSelection.position + " " + simPicks[wi].playerSelection.draftFrom).width;
                        var tw = Math.max(nw, sw) + 80;
                        if (tw > maxCol2Width) maxCol2Width = tw;
                    }
                }
            }
            var minTwoColWidth = 320 + ((!isTeam && showGrades) ? 20 : 0) + maxCol2Width + 50;
            var canvasLogicalWidth = Math.max(width * 1.60, minTwoColWidth);
            canvas.width = canvasLogicalWidth * dpr;
        } else {
            canvas.width = width * dpr;
        }
        canvas.height = height * dpr;

        ctx.scale(dpr, dpr);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var yPos = baseY;

        if (brand === "pfn") {
            ctx.fillStyle = "#0957c3";
        } else if (brand === "cfn") {
            ctx.fillStyle = "#2d2d2d";
        } else {
            ctx.fillStyle = "#080A3C";
        }

        ctx.fillRect(0, 0, canvas.width, 50);
        yPos += 50;

        var simulatorLogo;
        if (brand === "pfn") {
            simulatorLogo = $('img[data-logo="pfn-mock-simulator"]');
            ctx.drawImage(simulatorLogo, canvas.width / 2 - 50, 7, 30, 30);
        } else if (brand === "cfn") {
            simulatorLogo = $('img[data-logo="cfn-mock-simulator"]');
            ctx.drawImage(simulatorLogo, canvas.width / 2 - 110, 7, 100, 35);
        } else {
            var simulatorLogo = $('img[data-logo="sk-mock-simulator"]');
            ctx.drawImage(simulatorLogo, canvas.width / 2 - 180, 10, 163, 36);
        }

        let widgetExtraSpacing = 0;
        if (mdsWidgetDistinction && widgetLogoPath) {
            widgetExtraSpacing = 180;
            const thirdPartyLogo = $('img[data-logo="fansided"]');
            ctx.drawImage(thirdPartyLogo, 10, 14, 100, 20);
        }
        var teamLogo = simPicks.length ? simPicks[0].currentTeam.teamLogo : currentTeam.teamLogo;
        var teamShortName = simPicks.length ? simPicks[0].currentTeam.shortName : currentTeam.shortName;
        if (isTeam) {
            if (mdsWidgetDistinction && widgetLogoPath) {
                widgetExtraSpacing -= 30;
            }
            var teamImage = $('img[data-teamlogo="' + teamLogo + '"]');
            ctx.drawImage(teamImage, 10 + widgetExtraSpacing, 10, 45, 33);
            ctx.font = "600 18px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillStyle = "#fff";
            ctx.fillText(teamShortName, 60 + widgetExtraSpacing, 30);
        } else {
            ctx.font = "600 20px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillStyle = "#fff";
            ctx.fillText("FULL MOCK DRAFT RESULTS", 10 + widgetExtraSpacing, 30);
        }

        if (isTeam && overallGrade) {
            drawOverallGradeBanner(ctx, yPos - 15, canvas.width / dpr, overallGrade);
            yPos += 35;
        }

        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, yPos - 15, canvas.width, 25);

        ctx.fillStyle = "#000";
        ctx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        var headerSubtext;

        if (isTeam) {
            headerSubtext = "My Draft Picks"
        } else {
            headerSubtext = "Round " + roundNumber;
        }
        ctx.fillText(headerSubtext, 10, yPos + 3);

        yPos += 10;

        var oneSpotHeight = 50;
        var yPosSet = false;
        var colStarting = 0;
        var colStartYPos = yPos;
        var leftColMaxY = yPos;
        var totalItemCount = simPicks.length + (nearFuturePicks ? nearFuturePicks.length : 0) + acquiredPlayersCount;

        // Pre-calculate grade X position per column from longest player name in each column
        var maxTextWidthCol1 = 0;
        var maxTextWidthCol2 = 0;
        var halfItemCount = Math.ceil(totalItemCount / 2);
        var shouldRenderGrades = (isTeam && overallGrade) || (!isTeam && showGrades);
        if (shouldRenderGrades) {
            var fullResultHalfPicks = Math.ceil(simPicks.length / 2);
            for (var mn = 0; mn < simPicks.length; mn++) {
                if (simPicks[mn].playerSelection) {
                    ctx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                    var nameW = ctx.measureText(simPicks[mn].playerSelection.name).width;
                    ctx.font = "300 14px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
                    var subW = ctx.measureText(simPicks[mn].playerSelection.position + " " + simPicks[mn].playerSelection.draftFrom).width;
                    var maxW = Math.max(nameW, subW);
                    var isCol2;
                    if (isTeam) {
                        isCol2 = totalItemCount > 5 && mn >= halfItemCount;
                    } else {
                        isCol2 = mn >= fullResultHalfPicks;
                    }
                    if (isCol2) {
                        if (maxW > maxTextWidthCol2) maxTextWidthCol2 = maxW;
                    } else {
                        if (maxW > maxTextWidthCol1) maxTextWidthCol1 = maxW;
                    }
                }
            }
        }
        var fullResultGradeColGap = (!isTeam && showGrades) ? 20 : 0;
        var fullResultColOffset = (multiUserDraft ? 345 : 320) + fullResultGradeColGap;
        var gradeXPosCol1 = 10 + 95 + maxTextWidthCol1 + 18;
        var gradeXPosCol2 = 10 + 95 + (isTeam ? 320 : fullResultColOffset) + maxTextWidthCol2 + 18;

        for (var i = 0; i < simPicks.length; i++) {
            var tradeIcon;
            if (simPicks[i].currentTeam.shortName !== simPicks[i].originalTeam.shortName) {
                tradeIcon = $('img[data-icon="trade-icon"]');
            } else {
                tradeIcon = "";
            }
            if ((!isTeam && i >= Math.ceil(simPicks.length / 2)) || (isTeam && i >= totalItemCount / 2 && totalItemCount > 5)) {
                if (multiUserDraft) {
                    colStarting = 345;
                } else {
                    colStarting = 320;
                }
                if (!isTeam) {
                    colStarting += fullResultGradeColGap;
                }

                if (!yPosSet) {
                    leftColMaxY = yPos;
                    yPos = colStartYPos;
                    yPosSet = true;
                }
            }

            let draftedBy;
            if (!isTeam && multiUserDraft && (simPicks[i].number > pickstart)) {
                draftedBy = getPickDraftedBy(simPicks[i].currentTeam.shortName, simPicks[i].number);
            }

            var player = {
                teamFlag: $('img[data-teamlogo="' + simPicks[i].currentTeam.teamLogo + '"]'),
                pickNumber: simPicks[i].number,
                name: simPicks[i].playerSelection.name,
                subText: [
                    simPicks[i].playerSelection.position,
                    simPicks[i].playerSelection.draftFrom,
                ].join(" "),
                colStarting: colStarting,
                tradeIcon,
                draftedBy,
                grade: (shouldRenderGrades && simPicks[i].pickGradeData) ? simPicks[i].pickGradeData.grade : null,
                gradeX: colStarting > 0 ? gradeXPosCol2 : gradeXPosCol1,
            };

            drawOnePlayerToCanvas(ctx, 10, yPos, player);

            yPos += oneSpotHeight;
        }

        if (nearFuturePicks) {
            for (var i = 0; i < nearFuturePicks.length; i++) {
                if (isTeam && (simPicks.length + i) >= totalItemCount / 2 && totalItemCount > 5) {
                    colStarting = 320;
                    if (!yPosSet) {
                        leftColMaxY = yPos;
                        yPos = colStartYPos;
                        yPosSet = true;
                    }
                }
                var futurePick = {
                    year: nearFuturePicks[i].futurePickYear,
                    team: nearFuturePicks[i].futureOriginalTeam,
                    round: nearFuturePicks[i].futureRound,
                    colStarting: colStarting,
                }

                drawFuturePickToCanvas(ctx, 10, yPos, futurePick);
                yPos += oneSpotHeight;
            }
        }

        if (acquiredPlayers && acquiredPlayers.length) {
            var prevItemCount = simPicks.length + (nearFuturePicks ? nearFuturePicks.length : 0);
            for (var i = 0; i < acquiredPlayers.length; i++) {
                if (isTeam && (prevItemCount + i) >= totalItemCount / 2 && totalItemCount > 5) {
                    colStarting = 320;
                    if (!yPosSet) {
                        leftColMaxY = yPos;
                        yPos = colStartYPos;
                        yPosSet = true;
                    }
                }
                acquiredPlayers[i].colStarting = colStarting;
                if (acquiredPlayers[i].teamLogo) {
                    acquiredPlayers[i].teamFlag = $('img[data-teamlogo="' + acquiredPlayers[i].teamLogo + '"]');
                }
                drawTradedPlayerToCanvas(ctx, 10, yPos, acquiredPlayers[i]);
                yPos += oneSpotHeight;
            }
        }

        if (yPosSet) {
            yPos = Math.max(yPos, leftColMaxY);
        }

        if (totalTradedAwayCount > 0) {
            var tradedAwayRows = totalTradedAwayCount > 3 ? Math.ceil(totalTradedAwayCount / 2) : totalTradedAwayCount;
            yPos += 30;
            drawDividerLine(ctx, yPos, canvas.width / dpr, 0);
            yPos += 25;
            ctx.fillStyle = "#666";
            ctx.font = "600 13px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText("Traded Away", 10, yPos);
            yPos += 15;
            var tradedAwayColStarting = 0;
            var tradedAwayYPosSet = false;
            var tradedAwayStartY = yPos;
            var tradedAwayMaxY = yPos;
            var allTradedAwayItems = (tradedAwayPicks || []).concat(tradedAwayPlayers || []);
            for (var i = 0; i < allTradedAwayItems.length; i++) {
                if (totalTradedAwayCount > 2 && i >= Math.ceil(totalTradedAwayCount / 2)) {
                    tradedAwayColStarting = 320;
                    if (!tradedAwayYPosSet) {
                        tradedAwayMaxY = yPos;
                        yPos = tradedAwayStartY;
                        tradedAwayYPosSet = true;
                    }
                }
                allTradedAwayItems[i].colStarting = tradedAwayColStarting;
                if (allTradedAwayItems[i].teamLogo) {
                    allTradedAwayItems[i].teamFlag = $('img[data-teamlogo="' + allTradedAwayItems[i].teamLogo + '"]');
                }
                drawTradedPlayerToCanvas(ctx, 10, yPos, allTradedAwayItems[i]);
                yPos += oneSpotHeight;
            }
            yPos = Math.max(yPos, tradedAwayMaxY);
        }

        if (isTeam && tradeGrades && tradeGrades.length) {
            yPos += 10;
            yPos = drawTradeGradesToCanvas(ctx, 10, yPos, tradeGrades, canvas.width / dpr);
        }

        yPos += 20;

        if (noteText) {
            ctx.fillStyle = "#000";
            ctx.font = "italic 400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
            ctx.fillText(noteText, 10, yPos);
            yPos += 20;
        }

        ctx.fillStyle = "#F5F5F5"
        ctx.fillRect(0, yPos, canvas.width, 50);

        var simulatorUrl = "{$download_image_bottom_url}";

        ctx.fillStyle = "#000";
        ctx.letterSpacing = "1px";
        if (isTeam) {
            ctx.font = "400 12px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        } else {
            ctx.font = "400 16px Poppins,Calibri,Roboto,Open Sans,Helvetica,sans-serif";
        }
        var urlWidth = ctx.measureText(simulatorUrl).width;
        ctx.fillText(simulatorUrl, (canvas.width / dpr / 2) - (urlWidth / 2), yPos + 25);

        var finalHeight = (yPos + 45) * dpr;
        if (finalHeight < canvas.height) {
            var trimmedCanvas = document.createElement("canvas");
            trimmedCanvas.width = canvas.width;
            trimmedCanvas.height = finalHeight;
            var trimmedCtx = trimmedCanvas.getContext("2d");
            trimmedCtx.drawImage(canvas, 0, 0);
            return trimmedCanvas;
        }

        return canvas;
    };
</script>
