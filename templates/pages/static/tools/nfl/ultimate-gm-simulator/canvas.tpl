<script>
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawHeader(ctx, W, teamShortName) {
    const H = 50;

    // Blue background
    ctx.fillStyle = "#0957C3";
    ctx.fillRect(0, 0, W, H);

    // Team circle
    ctx.beginPath();
    ctx.arc(24, H / 2, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    const teamLogoSelector = "." + teamShortName;
    const teamLogo = $(teamLogoSelector);
    if (teamLogo) {
      ctx.drawImage(teamLogo, H / 2 - 15, 16, 30, 20);
    }

    // Team Name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(teamShortName, 52, H / 2);

    const pfsnLogo = $(".pfn-white-logo-full-download");
    if (pfsnLogo) {
      ctx.drawImage(pfsnLogo, W - 55, 6, 40, 40);
    }
  }

  //x -> x-axis point on canvas
  //y -> y-axis point on canvas
  //w -> width
  function drawPerformanceCards(ctx, x, y, w, teamRecord) {
    const gap = 16;
    const cardW = (w - gap) / 2;
    const cardH = 110;

    // Left card
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, x, y, cardW, cardH, 8);
    ctx.fill();

    const radius = "12";
    const height = "50";
    ctx.strokeStyle = "#dfdfdf";
    ctx.beginPath();
    ctx.roundRect(17, 70, 315, 90, 12);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText("{$current_season}" + " Performance", x + 10, y + 24);

    ctx.fillStyle = "#000000";
    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Record: ", x + 10, y + 48);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(teamRecord.runningYearRecord, x + 55, y + 48);

    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Conf. Rank: ", x + cardW / 2 - 47, y + 48);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(addOrdinalSuffix(teamRecord.runningYearConferenceRank), x + cardW / 2 - 47 + 65, y + 48);

    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Div. Rank: ", x + 11, y + 72);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(addOrdinalSuffix(teamRecord.runningYearDivisionRank), x + 71, y + 72);

    let playoffRound = teamRecord.runningYearPlayoffLevel ? getRoundShortNames(teamRecord.runningYearPlayoffLevel) : "-";
    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Playoff Round: ", x + cardW / 2 - 47, y + 72);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(playoffRound, x + cardW / 2 - 47 + 80, y + 72);

    // Right card
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, x + cardW + gap, y, cardW, cardH, 8);
    ctx.fill();

    ctx.strokeStyle = "#dfdfdf";
    ctx.beginPath();
    ctx.roundRect(365, 70, 315, 90, 12);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText("Predicted Performance", x + cardW + gap + 16, y + 24);

    ctx.fillStyle = "#000000";
    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Record: ", x + cardW + gap + 17, y + 48);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(teamRecord.nextYearRecord, x + cardW + gap + 62, y + 48);

    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Conf. Rank: ", x + cardW + gap + cardW / 2 - 42, y + 48);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(addOrdinalSuffix(teamRecord.nextYearConferenceRank), x + cardW + gap + cardW / 2 + 25, y + 48);

    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Div. Rank: ", x + cardW + gap + 18, y + 72);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(addOrdinalSuffix(teamRecord.nextYearDivisionRank), x + cardW + gap + 79, y + 72);

    playoffRound = teamRecord.nextYearPlayoffLevel ? getRoundShortNames(teamRecord.nextYearPlayoffLevel) : "-";
    ctx.font = "400 12px Roboto, sans-serif";
    ctx.fillText("Playoff Round: ", x + cardW + gap + cardW / 2 - 42, y + 72);
    ctx.font = "600 16px Roboto, sans-serif";
    ctx.fillText(playoffRound, x + cardW + gap + cardW / 2 - 42 + 80, y + 72);
  }

  //x -> x-axis point on canvas
  //y -> y-axis point on canvas
  //w -> width
  function sectionHeader(ctx, x, y, w, title) {
    const headerHeight = 36;
    const gradient = ctx.createLinearGradient(0, y, w, y);
    gradient.addColorStop(0, '#022049');
    gradient.addColorStop(0.5, '#136DE8');
    gradient.addColorStop(1, '#022049');

    ctx.fillStyle = gradient;
    roundRect(ctx, 0, y - 10, w + 50, headerHeight, 0);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "500 16px Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, x + w / 2, y + 10);
    ctx.textAlign = "left";
  }

  //x -> x-axis point on canvas
  //y -> y-axis point on canvas
  //w -> width
  function drawRosterChanges(ctx, x, y, w, modifiedPlayers = []) {
    sectionHeader(ctx, x, y, w, "{$upcoming_season}" + " ROSTER CHANGES");

    const startY = y + 50;
    const colW = w / 3;
    const rowH = 38;

    // Column headers
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, startY - 25, w + 32, 28);
    ctx.fillStyle = "#999999";
    ctx.font = "500 11px Roboto, sans-serif";
    for (let c = 0; c < 3; c++) {
      ctx.fillText("Player", x + c * colW, startY - 10);
      ctx.fillText("Status", x + c * colW + colW - 60, startY - 10);
    }

    // Calculate number of rows needed (players distributed across 3 columns)
    const totalRows = Math.ceil(modifiedPlayers.length / 3);

    // Rows
    ctx.font = "400 12px Roboto, sans-serif";

    // Status display mapping
    const statusMap = {
      "drafted": "Draft",
      "cut": "Cut",
      "restructured": "Rest.",
      "re-signed": "Re-sign",
      "franchise": "Fr.Tag",
      "freeagent": "FA",
      "Signed": "Sign",
    };

    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < 3; c++) {
        const playerIndex = r + c * totalRows;

        // Skip if no player for this cell
        if (playerIndex >= modifiedPlayers.length) continue;

        const player = modifiedPlayers[playerIndex];
        const rx = x + c * colW;
        const ry = startY + r * rowH;

        // Border line
        ctx.strokeStyle = "#f5f5f5";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rx - 16, ry + 40);
        ctx.lineTo(rx - 16 + colW, ry + 40);
        ctx.stroke();

        // Player name
        ctx.fillStyle = "#2d2d2d";
        ctx.font = "500 11px Roboto, sans-serif";
        ctx.fillText(player.name, rx, ry + 16);

        // Position
        ctx.fillStyle = "#999999";
        ctx.font = "400 10px Roboto, sans-serif";
        ctx.fillText(player.position, rx, ry + 30);
        ctx.font = "400 12px Roboto, sans-serif";

        // Status pill
        const status = statusMap[player.status.toLowerCase()] || player.status;
        const pillW = 50;
        const pillH = 22;
        const pillX = rx + colW - pillW - 12;
        const pillY = ry + 8;

        ctx.fillStyle = "#2d2d2d";
        ctx.font = "500 11px Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(status, pillX + pillW / 2 - 10, pillY + 15);
        ctx.textAlign = "left";
        ctx.font = "400 12px Roboto, sans-serif";
      }
    }

    return startY + totalRows * rowH + 20;
  }

  //x -> x-axis point on canvas
  //y -> y-axis point on canvas
  //w -> width
  function drawMatchPredictions(ctx, x, y, w, matchesWinloss, teamShortName) {
    sectionHeader(ctx, x, y, w, "{$upcoming_season}" + " GAME PREDICTIONS");

    const startY = y + 50;
    const colW = w / 3;
    const rowH = 32;

    // Column headers
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, startY - 25, w + 32, 28);
    ctx.fillStyle = "#888888";
    ctx.font = "600 11px Roboto, sans-serif";
    for (let c = 0; c < 3; c++) {
      const cx = x + c * colW;
      ctx.fillText("Weeks", cx, startY - 10);
      ctx.fillText("Opp", cx + 110, startY - 10);
      ctx.fillText("Result", cx + 160, startY - 10);
    }

    // Normalize & sort data dynamically
    const roundOrder = ["Wildcard", "Divisional", "Conference", "Superbowl", "Champion"];

    const sortedMatches = [...matchesWinloss].sort((a, b) => {
      if (a.Week && b.Week) return a.Week - b.Week; // sort by week number
      if (a.Week) return -1; // week games before rounds
      if (b.Week) return 1;
      return roundOrder.indexOf(a.round) - roundOrder.indexOf(b.round);
    });

    // Transform into displayable array
    const weeks = sortedMatches.map((match) => ({
      label: match.Week ? match.Week : getRoundShortNames(match.round),
      opp: (match["Away"] === teamShortName || match["teamA"] === teamShortName) ? (match["Home"] || match[
        "teamB"]) : (match["Away"] || match["teamA"]),
      result: (match.winner === teamShortName || match.Winner === teamShortName) ? "Win" : "Loss",
    }));

    // Split into 3 columns evenly
    const colCount = 3;
    const perCol = Math.ceil(weeks.length / colCount);
    const cols = [];
    for (let i = 0; i < colCount; i++) {
      cols.push(weeks.slice(i * perCol, (i + 1) * perCol));
    }

    // Draw table content
    for (let c = 0; c < cols.length; c++) {
      const col = cols[c];
      for (let r = 0; r < col.length; r++) {
        const item = col[r];
        const cx = x + c * colW;
        const ry = startY + r * rowH;

        // Row line
        ctx.strokeStyle = "#f5f5f5";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 16, ry);
        ctx.lineTo(cx + colW - 12, ry);
        ctx.stroke();

        // Week label
        ctx.fillStyle = "#2d2d2d";
        ctx.font = "500 11px Roboto, sans-serif";
        ctx.fillText(item.label, cx + 4, ry + 20);

        // Opponent
        const teamLogoSelector = "." + item["opp"];
        const teamLogo = $(teamLogoSelector);
        if (teamLogo) {
          ctx.drawImage(teamLogo, cx + 110, ry + 16, 18, 12);
        }

        // Result
        ctx.fillStyle = "#2d2d2d";
        ctx.font = "500 11px Roboto, sans-serif";
        ctx.fillText(item.result, cx + 165, ry + 20);
      }
    }

    // Return bottom Y for next section
    const maxRows = Math.max(...cols.map((c) => c.length));
    return startY + maxRows * rowH + 20;
  }

  function drawCanvas(teamShortName, modifiedPlayers, matchesWinloss, teamRecord) {
    // const scaleFactor = window.devicePixelRatio || 1;
    const scaleFactor = 2;
    const W = 700;
    // Calculate temp height based on actual content instead of fixed 3000px
    var rosterRows = Math.ceil((modifiedPlayers ? modifiedPlayers.length : 0) / 3);
    var matchRows = Math.ceil((matchesWinloss ? matchesWinloss.length : 0) / 3);
    var tempHeight = 250 + (rosterRows * 38) + 80 + (matchRows * 32) + 100;

    // Create temp canvas for drawing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = W * scaleFactor;
    canvas.height = tempHeight * scaleFactor;
    ctx.scale(scaleFactor, scaleFactor);

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, tempHeight);

    // Draw all sections
    drawHeader(ctx, W, teamShortName);
    drawPerformanceCards(ctx, 16, 66, W - 32, teamRecord);
    const rosterEnd = drawRosterChanges(ctx, 16, 192, W - 5, modifiedPlayers);
    const matchEnd = drawMatchPredictions(ctx, 16, rosterEnd, W, matchesWinloss, teamShortName);

    const dynamicHeight = matchEnd + 20; // Add footer padding

    // Footer
    ctx.fillStyle = "#2d2d2d";
    ctx.font = "500 12px Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("{$canonical_url}", W / 2, dynamicHeight - 20);
    ctx.textAlign = "left";

    // === Now crop to actual content ===
    // Create a *new* canvas with correct dimensions
    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");

    finalCanvas.width = W * scaleFactor;
    finalCanvas.height = dynamicHeight * scaleFactor;

    // Copy visible portion (at real pixel resolution)
    finalCtx.drawImage(
      canvas,
      0,
      0,
      W * scaleFactor,
      dynamicHeight * scaleFactor,
      0,
      0,
      W * scaleFactor,
      dynamicHeight * scaleFactor
    );

    // Release temp canvas memory
    canvas.width = 0;
    canvas.height = 0;

    // For correct on-screen rendering, scale for display too
    finalCanvas.style.width = W + "px";
    finalCanvas.style.height = dynamicHeight + "px";

    return finalCanvas;
  }
</script>
