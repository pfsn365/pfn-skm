// NASCAR Season Simulator - SKM Bundle
// Combined data.js + app.js with SKM integration
(function () {
  'use strict';

  // GA tracking
  if (!trackGAEventForPage) {
    trackGAEventForPage = function (eventName, eventParams) {
      eventParams = eventParams || {};
      trackGAEvent(eventName, Object.assign(eventParams, {
        "tool": "nascar_predictor",
        "device": isDesktop ? "Desktop" : "Mobile",
      }));
    };
  }

  if (sendPageViewEvent) {
    trackGAEventForPage("page_view");
  }

  // Data URL configuration - use SKM data source path
  const DATA_URL = (STATIC_URL + "/" + DATA_SOURCE_PATH).replace("staticd.pr", "staticj.pr") + "nascarData.json";

/**
 * NASCAR Season Simulator - Data Module
 * Handles drivers, races, and points configuration
 */

const NASCARData = {
    // Configuration
    config: {
        driversCount: 40,
        stagePointsPositions: 10, // Top 10 get stage points
    },

    // Simulation variance settings
    varianceConfig: {
        defaultStage: 40,    // Default variance for stages/duels (higher = more upsets)
        defaultFinish: 20,   // Default variance for final finish (lower = more predictable)
        min: 1,              // Minimum allowed variance
        max: 100             // Maximum allowed variance
    },

    // Points system - NASCAR Cup Series style
    pointsSystem: {
        // Race finish points (1st through 40th)
        finish: [55, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1],
        // Stage points (1st through 10th)
        stage: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        // Bonus points
        win: 0, // Race win bonus (disabled)
        fastestLap: 1 // Fastest lap bonus
    },

    // Chase/Playoff reset points (positions 1-16)
    chaseResetPoints: [2100, 2075, 2065, 2060, 2055, 2050, 2045, 2040, 2035, 2030, 2025, 2020, 2015, 2010, 2005, 2000],

    // Chase configuration
    chaseConfig: {
        qualifiers: 16, // Top 16 make the Chase
        lastRegularSeasonRace: 26 // Race ID of last regular season race
    },

    // Default drivers (will be overwritten by spreadsheet data)
    drivers: [],

    // Default race schedule (will be overwritten by spreadsheet data)
    races: [],

    // Completed race results loaded from spreadsheet (raceId -> { driverId -> result })
    completedResults: {},

    // Default drivers (40 drivers - edit this array to change drivers)
    // races: null means available for all races, otherwise array of race IDs
    defaultDrivers: [
        { id: 1, name: "Cole Custer", number: "41", team: "Haas Factory Team", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/cole-custer.png", races: null },
        { id: 2, name: "Kyle Larson", number: "5", team: "Hendrick Motorsport", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/kyle-larson.png", races: null },
        { id: 3, name: "Chase Elliott", number: "9", team: "Hendrick Motorsport", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/chase-elliott.png", races: null },
        { id: 4, name: "William Byron", number: "24", team: "Hendrick Motorsport", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/william-byron.png", races: null },
        { id: 5, name: "Alex Bowman", number: "48", team: "Hendrick Motorsport", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/alex-bowman.png", races: null },
        { id: 6, name: "Ricky Stenhouse Jr.", number: "47", team: "Hyak Motorsport", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/ricky-stenhouse-jr..png", races: null },
        { id: 7, name: "Ty Dillon", number: "10", team: "Kaulig Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/ty-dillon.png", races: null },
        { id: 8, name: "A.J. Allmendinger", number: "16", team: "Kaulig Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/aj-allmendinger.png", races: null },
        { id: 9, name: "Austin Dillon", number: "3", team: "Richard Childress Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/austin-dillon.png", races: null },
        { id: 10, name: "Kyle Busch", number: "8", team: "Richard Childress Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/kyle-busch.png", races: null },
        { id: 11, name: "Cody Ware", number: "51", team: "Rick Ware Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/cody-ware.png", races: null },
        { id: 12, name: "Daniel Suárez", number: "7", team: "Spire Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/daniel-suarez.png", races: null },
        { id: 13, name: "Michael McDowell", number: "71", team: "Spire Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/michael-mcdowell.png", races: null },
        { id: 14, name: "Carson Hocevar", number: "77", team: "Spire Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/carson-hocevar.png", races: null },
        { id: 15, name: "Ross Chastain", number: "1", team: "Trackhouse Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/ross-chastain.png", races: null },
        { id: 16, name: "Connor Zilisch", number: "88", team: "Trackhouse Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/connor-zilisch.png", races: null },
        { id: 17, name: "Shane van Gisbergen", number: "97", team: "Trackhouse Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/shane-van-gisbergen.png", races: null },
        { id: 18, name: "Noah Gragson", number: "4", team: "Front Row Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/noah-gragson.png", races: null },
        { id: 19, name: "Todd Gilliland", number: "34", team: "Front Row Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/todd-gilliland.png", races: null },
        { id: 20, name: "Zane Smith", number: "38", team: "Front Row Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/zane-smith.png", races: null },
        { id: 21, name: "Brad Keselowski", number: "6", team: "RFK Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/brad-keselowski.png", races: null },
        { id: 22, name: "Chris Buescher", number: "17", team: "RFK Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/chris-buescher.png", races: null },
        { id: 23, name: "Ryan Preece", number: "60", team: "RFK Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/ryan-preece.png", races: null },
        { id: 24, name: "Austin Cindric", number: "2", team: "Team Penske", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/austin-cindric.png", races: null },
        { id: 25, name: "Ryan Blaney", number: "12", team: "Team Penske", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/ryan-blaney.png", races: null },
        { id: 26, name: "Joey Logano", number: "22", team: "Team Penske", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/joey-logano.png", races: null },
        { id: 27, name: "Josh Berry", number: "21", team: "Wood Brothers Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/josh-berry.png", races: null },
        { id: 28, name: "Bubba Wallace", number: "23", team: "23XI Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/bubba-wallace.png", races: null },
        { id: 29, name: "Riley Herbst", number: "35", team: "23XI Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/riley-herbst.png", races: null },
        { id: 30, name: "Tyler Reddick", number: "45", team: "23XI Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/tyler-reddick.png", races: null },
        { id: 31, name: "Denny Hamlin", number: "11", team: "Joe Gibbs Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/denny-hamlin.png", races: null },
        { id: 32, name: "Chase Briscoe", number: "19", team: "Joe Gibbs Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/chase-briscoe.png", races: null },
        { id: 33, name: "Christopher Bell", number: "20", team: "Joe Gibbs Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/christopher-bell.png", races: null },
        { id: 34, name: "Ty Gibbs", number: "54", team: "Joe Gibbs Racing", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/ty-gibbs.png", races: null },
        { id: 35, name: "John Hunter Nemechek", number: "42", team: "Legacy Motor Club", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/john-hunter-nemechek.png", races: null },
        { id: 36, name: "Erik Jones", number: "43", team: "Legacy Motor Club", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/erik-jones.png", races: null },
        { id: 37, name: "Justin Allgaier", number: "40", team: "JR Motorsports", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/justin-allgaier.png", races: [1] },
        { id: 38, name: "Casey Mears", number: "66", team: "Garage 66", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/casey-mears.png", races: [1] },
        { id: 39, name: "Chad Finchum", number: "66", team: "Garage 66", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/chad-finchum.png", races: [8, 11] },
        { id: 40, name: "Jimmie Johnson", number: "84", team: "Legacy Motor Club", logo: "https://staticd.profootballnetwork.com/skm/assets/pfn/nascar/drivers/jimmie-johnson.png", races: [1, 17], pointsEligible: false }
    ],

    // Manual point penalties loaded from spreadsheet: { driverId, raceId, points (negative), reason }
    penalties: [],

    // Race schedule with regular season (first 26) and Chase (last 10)
    defaultRaces: [
        // Regular Season (Races 1-26)
        { id: 1, name: "Daytona 500", track: "Daytona", type: "Oval", location: "Daytona Beach, Florida", date: "February 15", lengthMiles: "500", lengthLaps: "200", stage1Laps: "65", stage2Laps: "130", duels: true, season: "regular" },
        { id: 2, name: "Autotrader 400", track: "EchoPark Speedway", type: "Oval", location: "Hampton, Georgia", date: "February 22", lengthMiles: "400", lengthLaps: "260", stage1Laps: "60", stage2Laps: "160", season: "regular" },
        { id: 3, name: "DuraMAX Grand Prix", track: "Circuit of the Americas", type: "Road", location: "Austin, Texas", date: "March 1", lengthMiles: "228", lengthLaps: "95", stage1Laps: "20", stage2Laps: "65", season: "regular" },
        { id: 4, name: "Straight Talk Wireless 500", track: "Phoenix Raceway", type: "Oval", location: "Avondale, Arizona", date: "March 8", lengthMiles: "312", lengthLaps: "312", stage1Laps: "60", stage2Laps: "185", season: "regular" },
        { id: 5, name: "Pennzoil 400", track: "Las Vegas Motor Speedway", type: "Oval", location: "Las Vegas, Nevada", date: "March 15", lengthMiles: "400", lengthLaps: "267", stage1Laps: "80", stage2Laps: "160", season: "regular" },
        { id: 6, name: "Goodyear 400", track: "Darlington Raceway", type: "Oval", location: "Darlington, South Carolina", date: "March 22", lengthMiles: "400", lengthLaps: "293", stage1Laps: "90", stage2Laps: "185", season: "regular" },
        { id: 7, name: "Cook Out 400", track: "Martinsville Speedway", type: "Oval", location: "Ridgeway, Virginia", date: "March 29", lengthMiles: "400", lengthLaps: "400", stage1Laps: "80", stage2Laps: "180", season: "regular" },
        { id: 8, name: "Food City 500", track: "Bristol Motor Speedway", type: "Oval", location: "Bristol, Tennessee", date: "April 12", lengthMiles: "266.5", lengthLaps: "500", stage1Laps: "125", stage2Laps: "250", season: "regular" },
        { id: 9, name: "AdventHealth 400", track: "Kansas Speedway", type: "Oval", location: "Kansas City, Kansas", date: "April 19", lengthMiles: "400", lengthLaps: "267", stage1Laps: "80", stage2Laps: "165", season: "regular" },
        { id: 10, name: "Jack Link's 500", track: "Talladega Superspeedway", type: "Oval", location: "Lincoln, Alabama", date: "April 26", lengthMiles: "500", lengthLaps: "188", stage1Laps: "60", stage2Laps: "120", season: "regular" },
        { id: 11, name: "Würth 400", track: "Texas Motor Speedway", type: "Oval", location: "Fort Worth, Texas", date: "May 3", lengthMiles: "400", lengthLaps: "267", stage1Laps: "80", stage2Laps: "165", season: "regular" },
        { id: 12, name: "Go Bowling at The Glen", track: "Watkins Glen International", type: "Road", location: "Watkins Glen, New York", date: "May 10", lengthMiles: "245", lengthLaps: "100", stage1Laps: "20", stage2Laps: "50", season: "regular" },
        { id: 13, name: "Coca-Cola 600", track: "Charlotte Motor Speedway", type: "Oval", location: "Concord, North Carolina", date: "May 24", lengthMiles: "600", lengthLaps: "400", stage1Laps: "100", stage2Laps: "200", stage3Laps: "300", stages: 3, season: "regular" },
        { id: 14, name: "Cracker Barrel 400", track: "Nashville Superspeedway", type: "Oval", location: "Lebanon, Tennessee", date: "May 31", lengthMiles: "400", lengthLaps: "300", stage1Laps: "90", stage2Laps: "185", season: "regular" },
        { id: 15, name: "FireKeepers Casino 400", track: "Michigan International Speedway", type: "Oval", location: "Brooklyn, Michigan", date: "June 7", lengthMiles: "400", lengthLaps: "200", stage1Laps: "45", stage2Laps: "120", season: "regular" },
        { id: 16, name: "The Great American Getaway 400", track: "Pocono Raceway", type: "Oval", location: "Long Pond, Pennsylvania", date: "June 14", lengthMiles: "400", lengthLaps: "160", stage1Laps: "30", stage2Laps: "95", season: "regular" },
        { id: 17, name: "Anduril 250", track: "Coronado Street Course", type: "Street", location: "San Diego, California", date: "June 21", lengthMiles: "250", lengthLaps: "74", season: "regular" },
        { id: 18, name: "Toyota/Save Mart 350", track: "Sonoma Raceway", type: "Road", location: "Sonoma, California", date: "June 28", lengthMiles: "219", lengthLaps: "110", stage1Laps: "25", stage2Laps: "60", season: "regular" },
        { id: 19, name: "TBA", track: "Chicagoland Speedway", type: "Oval", location: "Joliet, Illinois", date: "July 5", lengthMiles: "400", lengthLaps: "267", stage1Laps: "80", stage2Laps: "160", season: "regular" },
        { id: 20, name: "Quaker State 400", track: "EchoPark Speedway", type: "Oval", location: "Hampton, Georgia", date: "July 12", lengthMiles: "400", lengthLaps: "260", stage1Laps: "60", stage2Laps: "120", season: "regular" },
        { id: 21, name: "Window World 450", track: "North Wilkesboro Speedway", type: "Oval", location: "North Wilkesboro, North Carolina", date: "July 19", lengthMiles: "281", lengthLaps: "450", season: "regular" },
        { id: 22, name: "Brickyard 400", track: "Indianapolis Motor Speedway", type: "Oval", location: "Speedway, Indiana", date: "July 26", lengthMiles: "400", lengthLaps: "160", stage1Laps: "50", stage2Laps: "100", season: "regular" },
        { id: 23, name: "Iowa Corn 350", track: "Iowa Speedway", type: "Oval", location: "Newton, Iowa", date: "August 9", lengthMiles: "306", lengthLaps: "350", stage1Laps: "70", stage2Laps: "210", season: "regular" },
        { id: 24, name: "Cook Out 400", track: "Richmond Raceway", type: "Oval", location: "Richmond, Virginia", date: "August 15", lengthMiles: "300", lengthLaps: "400", stage1Laps: "70", stage2Laps: "230", season: "regular" },
        { id: 25, name: "Mobil 1 301", track: "New Hampshire Motor Speedway", type: "Oval", location: "Loudon, New Hampshire", date: "August 23", lengthMiles: "318", lengthLaps: "301", stage1Laps: "75", stage2Laps: "185", season: "regular" },
        { id: 26, name: "Coke Zero Sugar 400", track: "Daytona International Speedway", type: "Oval", location: "Daytona Beach, Florida", date: "August 29", lengthMiles: "400", lengthLaps: "160", stage1Laps: "35", stage2Laps: "95", season: "regular" },
        // Chase / Playoffs (Races 27-36)
        { id: 27, name: "Cook Out Southern 500", track: "Darlington Raceway", type: "Oval", location: "Darlington, South Carolina", date: "September 6", lengthMiles: "500", lengthLaps: "367", stage1Laps: "115", stage2Laps: "230", season: "chase" },
        { id: 28, name: "Enjoy Illinois 300", track: "World Wide Technology Raceway", type: "Oval", location: "Madison, Illinois", date: "September 13", lengthMiles: "300", lengthLaps: "240", stage1Laps: "45", stage2Laps: "140", season: "chase" },
        { id: 29, name: "Bass Pro Shops Night Race", track: "Bristol Motor Speedway", type: "Oval", location: "Bristol, Tennessee", date: "September 19", lengthMiles: "266.5", lengthLaps: "500", stage1Laps: "125", stage2Laps: "250", season: "chase" },
        { id: 30, name: "Hollywood Casino 400", track: "Kansas Speedway", type: "Oval", location: "Kansas City, Kansas", date: "September 27", lengthMiles: "400.5", lengthLaps: "267", stage1Laps: "80", stage2Laps: "160", season: "chase" },
        { id: 31, name: "South Point 400", track: "Las Vegas Motor Speedway", type: "Oval", location: "Las Vegas, Nevada", date: "October 4", lengthMiles: "400", lengthLaps: "267", stage1Laps: "80", stage2Laps: "160", season: "chase" },
        { id: 32, name: "Bank of America Roval 400", track: "Charlotte Motor Speedway (Roval)", type: "Road", location: "Concord, North Carolina", date: "October 11", lengthMiles: "252.9", lengthLaps: "109", stage1Laps: "25", stage2Laps: "50", season: "chase" },
        { id: 33, name: "Freeway Insurance 500", track: "Phoenix Raceway", type: "Oval", location: "Avondale, Arizona", date: "October 18", lengthMiles: "312", lengthLaps: "312", stage1Laps: "60", stage2Laps: "185", season: "chase" },
        { id: 34, name: "YellaWood 500", track: "Talladega Superspeedway", type: "Oval", location: "Lincoln, Alabama", date: "October 25", lengthMiles: "500", lengthLaps: "188", stage1Laps: "60", stage2Laps: "120", season: "chase" },
        { id: 35, name: "Xfinity 500", track: "Martinsville Speedway", type: "Oval", location: "Ridgeway, Virginia", date: "November 1", lengthMiles: "263", lengthLaps: "500", stage1Laps: "130", stage2Laps: "260", season: "chase" },
        { id: 36, name: "NASCAR Cup Series Championship Race", track: "Homestead–Miami Speedway", type: "Oval", location: "Homestead, Florida", date: "November 8", lengthMiles: "400", lengthLaps: "267", season: "chase" }
    ],

    /**
     * Initialize data from localStorage or defaults
     */
    init: function() {
        // Try to load from localStorage first
        try {
            const savedDrivers = localStorage.getItem('nascar_drivers');
            const savedRaces = localStorage.getItem('nascar_races');

            if (savedDrivers) {
                this.drivers = JSON.parse(savedDrivers);
            } else {
                this.drivers = [...this.defaultDrivers];
            }

            if (savedRaces) {
                this.races = JSON.parse(savedRaces);
            } else {
                this.races = [...this.defaultRaces];
            }
        } catch (e) {
            console.error('Failed to load data from localStorage:', e);
            this.drivers = [...this.defaultDrivers];
            this.races = [...this.defaultRaces];
        }

        this.config.driversCount = this.drivers.length;
        return this;
    },

    /**
     * Load data from a remote spreadsheet/JSON
     * @param {string} url - URL to fetch data from
     */
    loadFromRemote: async function(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.parseSheetData(data);
            return data;
        } catch (error) {
            console.error('Failed to load remote data:', error);
            return false;
        }
    },

    /**
     * Parse spreadsheet data format
     * Handles both formats:
     * 1. { drivers: [...], races: [...] }
     * 2. { collections: [{ sheetName: "results", data: [...] }, { sheetName: "data", data: [...] }] }
     */
    parseSheetData: function(data) {
        console.log('API Response:', data);
        console.log('API Keys:', Object.keys(data));

        // Handle collections format from spreadsheet
        if (data.collections && Array.isArray(data.collections)) {
            console.log('Parsing collections format...');

            // Get both sheets - 'driver' has race availability, 'data' has ratings
            const driverSheet = data.collections.find(c => c.sheetName === 'driver');
            const ratingsSheet = data.collections.find(c => c.sheetName === 'data');

            // Use driver sheet for main data, fallback to data sheet
            const mainSheet = driverSheet || ratingsSheet;
            console.log('Using sheet for drivers:', driverSheet ? 'driver' : 'data');

            // Build ratings lookup from 'data' sheet (driver number -> { raceId: rating })
            const ratingsLookup = {};
            if (ratingsSheet && ratingsSheet.data && ratingsSheet.data.length > 1) {
                const ratingsHeaders = ratingsSheet.data[0];
                const ratingsNumberIdx = ratingsHeaders.indexOf('No.');

                // Find all race rating columns (Race 1, Race 2, etc.)
                const raceRatingColumns = [];
                ratingsHeaders.forEach((header, idx) => {
                    const match = header.match(/^Race (\d+)$/);
                    if (match) {
                        raceRatingColumns.push({ idx, raceId: parseInt(match[1]) });
                    }
                });

                if (ratingsNumberIdx !== -1 && raceRatingColumns.length > 0) {
                    for (let i = 1; i < ratingsSheet.data.length; i++) {
                        const row = ratingsSheet.data[i];
                        const driverNum = row[ratingsNumberIdx]?.toString();
                        if (!driverNum) continue;

                        ratingsLookup[driverNum] = {};
                        raceRatingColumns.forEach(({ idx, raceId }) => {
                            const rating = parseFloat(row[idx]);
                            if (!isNaN(rating)) {
                                ratingsLookup[driverNum][raceId] = Math.min(100, Math.max(0, rating));
                            }
                        });
                    }
                    console.log('Loaded race-specific ratings for', Object.keys(ratingsLookup).length, 'drivers');
                }
            }

            if (mainSheet && mainSheet.data && mainSheet.data.length > 1) {
                const rows = mainSheet.data;
                const headers = rows[0]; // [Manufacturer, Team, No., Driver, Race 1, Race 2, ...]

                // Find column indices
                const manufacturerIdx = headers.indexOf('Manufacturer');
                const teamIdx = headers.indexOf('Team');
                const numberIdx = headers.indexOf('No.');
                const driverIdx = headers.indexOf('Driver');
                const ratingIdx = headers.indexOf('Rating'); // Direct rating column (if exists)
                const duelIdx = headers.indexOf('Duel#'); // Duel assignment (1 or 2)

                // Find race columns (Race 1, Race 2, etc.)
                const raceColumns = [];
                headers.forEach((header, idx) => {
                    const match = header.match(/^Race (\d+)$/);
                    if (match) {
                        raceColumns.push({ idx, raceId: parseInt(match[1]) });
                    }
                });

                console.log('Found race columns:', raceColumns.length);

                // Parse drivers from rows (skip header)
                const parsedDrivers = [];
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const driverName = row[driverIdx];
                    if (!driverName) continue;

                    const driverNumber = row[numberIdx]?.toString() || String(i);

                    // Determine which races this driver participates in
                    const availableRaces = [];

                    raceColumns.forEach(({ idx, raceId }) => {
                        const val = row[idx];
                        // Driver is available for race only if explicitly marked with "Y"
                        if (val && val.toString().toUpperCase() === 'Y') {
                            availableRaces.push(raceId);
                        }
                    });

                    // If available for all races, set to null; otherwise use the array
                    const allRaces = availableRaces.length === raceColumns.length;

                    // Find matching default driver for logo
                    const defaultDriver = this.defaultDrivers.find(d =>
                        d.name.toLowerCase() === driverName.toLowerCase() ||
                        d.name.toLowerCase().replace(/[^a-z]/g, '') === driverName.toLowerCase().replace(/[^a-z]/g, '')
                    );

                    // Get ratings: race-specific ratings from lookup, or default 50
                    // ratings is an object: { raceId: rating, ... }
                    let ratings = {};
                    if (ratingsLookup[driverNumber]) {
                        ratings = ratingsLookup[driverNumber];
                    }

                    // Parse duel assignment (1 or 2)
                    const duelNum = duelIdx !== -1 ? parseInt(row[duelIdx]) : null;

                    parsedDrivers.push({
                        id: i,
                        name: driverName,
                        number: driverNumber,
                        team: row[teamIdx] || 'Independent',
                        manufacturer: row[manufacturerIdx] || null,
                        logo: defaultDriver ? defaultDriver.logo : null,
                        races: allRaces ? null : (availableRaces.length > 0 ? availableRaces : null),
                        ratings: ratings, // Race-specific ratings object
                        duelNumber: (duelNum === 1 || duelNum === 2) ? duelNum : null,
                        ...(defaultDriver && defaultDriver.pointsEligible === false ? { pointsEligible: false } : {})
                    });
                }

                if (parsedDrivers.length > 0) {
                    console.log('Parsed drivers:', parsedDrivers.length);
                    this.drivers = parsedDrivers;
                    this.config.driversCount = this.drivers.length;
                }
            }

            // Parse schedule sheet for races
            const scheduleSheet = data.collections.find(c => c.sheetName === 'schedule');
            if (scheduleSheet && scheduleSheet.data && scheduleSheet.data.length > 1) {
                const rows = scheduleSheet.data;
                const headers = rows[0];

                // Find column indices
                const seasonIdx = headers.indexOf('Reg or Chase');
                const raceNumIdx = headers.indexOf('Race #');
                const nameIdx = headers.indexOf('Race Name');
                const trackIdx = headers.indexOf('Track');
                const typeIdx = headers.indexOf('Type');
                const locationIdx = headers.indexOf('Location');
                const dateIdx = headers.indexOf('Date');
                const lengthMilesIdx = headers.indexOf('Length (miles)');
                const lengthLapsIdx = headers.indexOf('Length (laps)');
                const stage1Idx = headers.indexOf('Stage 1 lap');
                const stage2Idx = headers.indexOf('Stage 2 lap');
                const stage3Idx = headers.indexOf('Stage 3 lap');
                const stageVarianceIdx = headers.indexOf('stageVariance');
                const finishVarianceIdx = headers.indexOf('finishVariance');

                const parsedRaces = [];
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const raceName = row[nameIdx];
                    if (!raceName) continue;

                    const raceNum = parseInt(row[raceNumIdx]) || i;
                    const seasonVal = row[seasonIdx]?.toLowerCase() || '';
                    const season = seasonVal.includes('chase') || seasonVal.includes('playoff') ? 'chase' : 'regular';

                    // Parse variance values with NaN check and clamping
                    const parseVariance = (val) => {
                        if (val === null || val === undefined || val === '') return null;
                        const parsed = parseFloat(val);
                        if (isNaN(parsed)) return null;
                        // Clamp to configured bounds
                        return Math.max(this.varianceConfig.min, Math.min(this.varianceConfig.max, parsed));
                    };
                    const stageVariance = stageVarianceIdx !== -1 ? parseVariance(row[stageVarianceIdx]) : null;
                    const finishVariance = finishVarianceIdx !== -1 ? parseVariance(row[finishVarianceIdx]) : null;

                    parsedRaces.push({
                        id: raceNum,
                        name: raceName,
                        track: row[trackIdx] || 'Unknown Track',
                        type: row[typeIdx] || 'Oval',
                        location: row[locationIdx] || null,
                        date: row[dateIdx] || null,
                        lengthMiles: row[lengthMilesIdx] || null,
                        lengthLaps: row[lengthLapsIdx] || null,
                        stage1Laps: row[stage1Idx] || null,
                        stage2Laps: row[stage2Idx] || null,
                        stage3Laps: row[stage3Idx] || null,
                        stages: row[stage3Idx] ? 3 : 2,
                        duels: raceNum === 1, // Daytona 500 has duels
                        season: season,
                        stageVariance: stageVariance,  // Variance for stages/duels (null = use default 40)
                        finishVariance: finishVariance // Variance for final finish (null = use default 20)
                    });
                }

                if (parsedRaces.length > 0) {
                    console.log('Parsed races:', parsedRaces.length);
                    this.races = parsedRaces;
                }
            } else {
                // Keep default races if no schedule sheet
                this.races = [...this.defaultRaces];
            }

            // Parse results sheet for completed race results
            const resultsSheet = data.collections.find(c => c.sheetName === 'results');
            if (resultsSheet && resultsSheet.data && resultsSheet.data.length > 2) {
                this.parseResultsSheet(resultsSheet.data);
            }

            // Parse penalties sheet
            const penaltiesSheet = data.collections.find(c => c.sheetName === 'penalties');
            if (penaltiesSheet && penaltiesSheet.data && penaltiesSheet.data.length > 1) {
                this.penalties = [];
                for (let i = 1; i < penaltiesSheet.data.length; i++) {
                    const row = penaltiesSheet.data[i];
                    const driverId = parseInt(row[0]);
                    const raceId = parseInt(row[1]);
                    const points = parseInt(row[2]);
                    const reason = row[3] || '';
                    if (!isNaN(driverId) && !isNaN(raceId) && !isNaN(points)) {
                        this.penalties.push({ driverId, raceId, points, reason });
                    }
                }
                console.log('Loaded penalties:', this.penalties);
            }

            this.saveToLocalStorage();
            return;
        }

        // Handle direct format: { drivers: [...], races: [...] }
        const driversData = data.drivers || data.Drivers || data.DRIVERS;
        const racesData = data.races || data.Races || data.RACES;

        if (driversData && Array.isArray(driversData)) {
            this.drivers = driversData.map((driver, index) => ({
                id: driver.id || index + 1,
                name: driver.name || `Driver ${index + 1}`,
                number: driver.number || String(index + 1),
                team: driver.team || 'Independent',
                manufacturer: driver.manufacturer || null,
                logo: driver.logo || null,
                races: driver.races !== undefined ? driver.races : null,
                rating: driver.rating || 50
            }));
            this.config.driversCount = this.drivers.length;
        }

        if (racesData && Array.isArray(racesData)) {
            this.races = racesData.map((race, index) => ({
                id: race.id || index + 1,
                name: race.name || `Race ${index + 1}`,
                track: race.track || 'Unknown Track',
                type: race.type || 'Oval',
                location: race.location || null,
                date: race.date || null,
                lengthMiles: race.lengthMiles || null,
                lengthLaps: race.lengthLaps || null,
                stage1Laps: race.stage1Laps || null,
                stage2Laps: race.stage2Laps || null,
                stage3Laps: race.stage3Laps || null,
                stages: race.stages || 2,
                duels: race.duels || false,
                season: race.season || 'regular'
            }));
        }

        // Save to localStorage
        this.saveToLocalStorage();
    },

    /**
     * Save current data to localStorage
     */
    saveToLocalStorage: function() {
        try {
            localStorage.setItem('nascar_drivers', JSON.stringify(this.drivers));
            localStorage.setItem('nascar_races', JSON.stringify(this.races));
        } catch (e) {
            console.error('Failed to save data to localStorage:', e);
        }
    },

    /**
     * Get points for a finishing position
     * @param {number} position - Finishing position (1-40)
     * @param {string} type - 'finish', 'stage1', or 'stage2'
     */
    getPoints: function(position, type = 'finish') {
        if (position < 1) return 0;

        if (type === 'finish') {
            return this.pointsSystem.finish[position - 1] || 0;
        } else {
            // Stage points
            if (position <= this.config.stagePointsPositions) {
                return this.pointsSystem.stage[position - 1] || 0;
            }
            return 0;
        }
    },

    /**
     * Calculate total points for a race result
     * @param {Object} result - Race result object
     */
    calculateRacePoints: function(result) {
        let total = 0;

        // Duel 1 points (same as stage points: 10 for 1st down to 1 for 10th)
        if (result.duel1 && result.duel1 <= this.config.stagePointsPositions) {
            total += this.getPoints(result.duel1, 'stage');
        }

        // Duel 2 points
        if (result.duel2 && result.duel2 <= this.config.stagePointsPositions) {
            total += this.getPoints(result.duel2, 'stage');
        }

        // Stage 1 points
        if (result.stage1 && result.stage1 <= this.config.stagePointsPositions) {
            total += this.getPoints(result.stage1, 'stage');
        }

        // Stage 2 points
        if (result.stage2 && result.stage2 <= this.config.stagePointsPositions) {
            total += this.getPoints(result.stage2, 'stage');
        }

        // Stage 3 points
        if (result.stage3 && result.stage3 <= this.config.stagePointsPositions) {
            total += this.getPoints(result.stage3, 'stage');
        }

        // Finish points
        if (result.finish) {
            total += this.getPoints(result.finish, 'finish');
        }

        // Win bonus
        if (result.finish === 1) {
            total += this.pointsSystem.win;
        }

        // Fastest lap bonus
        if (result.fastestLap) {
            total += this.pointsSystem.fastestLap;
        }

        return total;
    },

    /**
     * Get driver by ID
     * @param {number} id - Driver ID
     */
    getDriver: function(id) {
        return this.drivers.find(d => d.id === id);
    },

    /**
     * Get race by ID
     * @param {number} id - Race ID
     */
    getRace: function(id) {
        return this.races.find(r => r.id === id);
    },

    /**
     * Check if a driver is available for a specific race
     * @param {Object} driver - Driver object
     * @param {number} raceId - Race ID
     */
    isDriverAvailable: function(driver, raceId) {
        // If races is null or undefined, driver is available for all races
        if (!driver.races) return true;
        // Otherwise check if raceId is in the array
        return driver.races.includes(raceId);
    },

    /**
     * Get driver's rating for a specific race
     * @param {Object} driver - Driver object
     * @param {number} raceId - Race ID
     * @returns {number} Rating (0-100), defaults to 50 if not found
     */
    getDriverRating: function(driver, raceId) {
        // Check race-specific ratings first
        if (driver.ratings && driver.ratings[raceId] !== undefined) {
            return driver.ratings[raceId];
        }
        // Fallback to legacy single rating if exists
        if (driver.rating !== undefined) {
            return driver.rating;
        }
        // Default rating
        return 50;
    },

    /**
     * Get all drivers available for a specific race
     * @param {number} raceId - Race ID
     */
    getAvailableDrivers: function(raceId) {
        return this.drivers.filter(d => this.isDriverAvailable(d, raceId));
    },

    /**
     * Export data as JSON
     */
    exportData: function() {
        return {
            drivers: this.drivers,
            races: this.races,
            config: this.config,
            pointsSystem: this.pointsSystem
        };
    },

    /**
     * Import data from JSON
     * @param {Object} data - Data object to import
     */
    importData: function(data) {
        if (data.drivers) this.drivers = data.drivers;
        if (data.races) this.races = data.races;
        if (data.config) this.config = { ...this.config, ...data.config };
        if (data.pointsSystem) this.pointsSystem = { ...this.pointsSystem, ...data.pointsSystem };
        this.saveToLocalStorage();
    },

    /**
     * Parse results sheet to extract completed race results
     * Results sheet format:
     * - Row 0: Race headers ("Race 1", "Race 1", ..., "Race 2", ...)
     * - Row 1: Column types ("Position", "Duel 1", "Duel 2", "Stage 1", "Stage 2", "Final", "Fastest Lap")
     * - Row 2+: Position number followed by driver numbers
     * @param {Array} sheetData - 2D array of results sheet data
     */
    parseResultsSheet: function(sheetData) {
        const raceRow = sheetData[0];
        const typeRow = sheetData[1];

        // Build mapping of race -> column indices for each result type
        const raceColumns = {};
        for (let col = 1; col < raceRow.length; col++) {
            const raceHeader = raceRow[col];
            const colType = typeRow[col];
            if (!raceHeader || !colType) continue;

            // Extract race number from "Race X"
            const match = raceHeader.match(/^Race (\d+)$/);
            if (!match) continue;
            const raceId = parseInt(match[1]);

            if (!raceColumns[raceId]) raceColumns[raceId] = {};
            raceColumns[raceId][colType] = col;
        }

        // Parse results for each race
        this.completedResults = {};

        for (const [raceIdStr, columns] of Object.entries(raceColumns)) {
            const raceId = parseInt(raceIdStr);
            const raceResults = {};
            let hasData = false;

            // Process each position row (starting from row 2)
            for (let rowIdx = 2; rowIdx < sheetData.length; rowIdx++) {
                const row = sheetData[rowIdx];
                const position = parseInt(row[0]);
                if (!position || isNaN(position)) continue;

                // Check each result type column
                const resultTypes = {
                    'Duel 1': 'duel1',
                    'Duel 2': 'duel2',
                    'Stage 1': 'stage1',
                    'Stage 2': 'stage2',
                    'Stage 3': 'stage3',
                    'Final': 'finish',
                    'Fastest Lap': 'fastestLap'
                };

                for (const [colName, resultKey] of Object.entries(resultTypes)) {
                    const colIdx = columns[colName];
                    if (colIdx === undefined) continue;

                    const driverNumber = row[colIdx];
                    if (!driverNumber) continue;

                    hasData = true;

                    // Find driver by number
                    const driver = this.drivers.find(d => d.number === driverNumber.toString());
                    if (!driver) continue;

                    // Initialize driver result if needed
                    if (!raceResults[driver.id]) {
                        raceResults[driver.id] = {
                            duel1: null,
                            duel2: null,
                            stage1: null,
                            stage2: null,
                            stage3: null,
                            finish: null,
                            fastestLap: false
                        };
                    }

                    // Set the result
                    if (resultKey === 'fastestLap') {
                        // For fastest lap, only position 1 row has the driver who got it
                        if (position === 1) {
                            raceResults[driver.id].fastestLap = true;
                        }
                    } else {
                        raceResults[driver.id][resultKey] = position;
                    }
                }
            }

            // Only store if we found actual data for this race
            if (hasData && Object.keys(raceResults).length > 0) {
                this.completedResults[raceId] = raceResults;
                console.log(`Loaded completed results for Race ${raceId}`);
            }
        }

        console.log('Completed races loaded:', Object.keys(this.completedResults).length);
    },

    /**
     * Check if a race has completed results from the spreadsheet
     * @param {number} raceId - Race ID
     */
    hasCompletedResults: function(raceId) {
        return this.completedResults.hasOwnProperty(raceId);
    },

    /**
     * Get completed results for a race
     * @param {number} raceId - Race ID
     */
    getCompletedResults: function(raceId) {
        return this.completedResults[raceId] || null;
    },

    /**
     * Check if a specific result type has official data for a race
     * @param {number} raceId - Race ID
     * @param {string} type - Result type (duel1, duel2, stage1, stage2, stage3, finish, fastestLap)
     */
    hasCompletedResultsForType: function(raceId, type) {
        const results = this.completedResults[raceId];
        if (!results) return false;
        return Object.values(results).some(r => {
            if (type === 'fastestLap') return r.fastestLap === true;
            return r[type] !== null && r[type] !== undefined;
        });
    },

    /**
     * Check if ALL result types have official data for a race
     * @param {number} raceId - Race ID
     */
    hasAllCompletedResults: function(raceId) {
        if (!this.completedResults.hasOwnProperty(raceId)) return false;
        const race = this.getRace(raceId);
        if (!race) return false;
        const types = [];
        if (race.duels) types.push('duel1', 'duel2');
        types.push('stage1', 'stage2');
        if (race.stages >= 3) types.push('stage3');
        types.push('finish', 'fastestLap');
        return types.every(type => this.hasCompletedResultsForType(raceId, type));
    },

    /**
     * Get stage/duel variance for a race (used in simulation)
     * @param {number} raceId - Race ID
     * @returns {number} Variance value (uses varianceConfig.defaultStage if not set)
     */
    getStageVariance: function(raceId) {
        const race = this.getRace(raceId);
        if (race && race.stageVariance !== null && race.stageVariance !== undefined) {
            return race.stageVariance;
        }
        return this.varianceConfig.defaultStage;
    },

    /**
     * Get finish variance for a race (used in simulation)
     * @param {number} raceId - Race ID
     * @returns {number} Variance value (uses varianceConfig.defaultFinish if not set)
     */
    getFinishVariance: function(raceId) {
        const race = this.getRace(raceId);
        if (race && race.finishVariance !== null && race.finishVariance !== undefined) {
            return race.finishVariance;
        }
        return this.varianceConfig.defaultFinish;
    }
};

// End of NASCARData module

    'use strict';

    // ============================================
    // State Management
    // ============================================
    const state = {
        drivers: [],
        races: [],
        results: {}, // { raceId: { driverId: { stage1, stage2, finish, fastestLap } } }
        standings: [], // Calculated standings
        regularSeasonStandings: [], // Regular season only standings
        chaseStandings: [], // Chase standings (with reset points)
        currentRaceId: null,
        currentTab: 'stage1',
        currentStandingsView: 'regular', // 'regular' or 'chase'
        standingsSort: { column: 'points', direction: 'desc' }, // Current sort state
        isChaseActive: false,
        regularSeasonComplete: false,
        modalSelections: {
            duel1: {},
            duel2: {},
            stage1: {},
            stage2: {},
            stage3: {},
            finish: {},
            fastestLap: null
        },
        duelAssignments: {
            duel1: [],
            duel2: []
        },
        _savedModalSnapshot: null,
        _downloadType: null // 'standings' or 'race'
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        racesList: document.getElementById('racesList'),
        standingsBody: document.getElementById('standingsBody'),
        regularSeasonTab: document.getElementById('regularSeasonTab'),
        chaseTab: document.getElementById('chaseTab'),
        raceModal: document.getElementById('raceModal'),
        modalRaceTitle: document.getElementById('modalRaceTitle'),
        closeModal: document.getElementById('closeModal'),
        tabButtons: document.querySelectorAll('.nascar-predictor-container .tab-btn'),
        tabContents: document.querySelectorAll('.nascar-predictor-container .tab-content'),
        stage1Positions: document.getElementById('stage1Positions'),
        stage2Positions: document.getElementById('stage2Positions'),
        finishPositions: document.getElementById('finishPositions'),
        fastestLapSelector: document.getElementById('fastestLapSelector'),
        saveRaceBtn: document.getElementById('saveRaceBtn'),
        clearRaceBtn: document.getElementById('clearRaceBtn'),
        simulateRaceBtn: document.getElementById('simulateRaceBtn'),
        resetBtn: document.getElementById('resetBtn'),
        simulateBtn: document.getElementById('simulateBtn'),
        simulateModal: document.getElementById('simulateModal'),
        closeSimulateModal: document.getElementById('closeSimulateModal'),
        simNextRace: document.getElementById('simNextRace'),
        simToRaceSelect: document.getElementById('simToRaceSelect'),
        simToRaceBtn: document.getElementById('simToRaceBtn'),
        simRegularSeason: document.getElementById('simRegularSeason'),
        simFullSeason: document.getElementById('simFullSeason'),
        simulateRaceModal: document.getElementById('simulateRaceModal'),
        closeSimulateRaceModal: document.getElementById('closeSimulateRaceModal'),
        simCurrentEvent: document.getElementById('simCurrentEvent'),
        simCurrentEventDesc: document.getElementById('simCurrentEventDesc'),
        simFullRace: document.getElementById('simFullRace'),
        // Clear modal elements
        clearModal: document.getElementById('clearModal'),
        closeClearModal: document.getElementById('closeClearModal'),
        clearCurrentEvent: document.getElementById('clearCurrentEvent'),
        clearCurrentEventDesc: document.getElementById('clearCurrentEventDesc'),
        clearFullRace: document.getElementById('clearFullRace'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        toastContainer: document.getElementById('toastContainer'),
        regularSeasonCount: document.getElementById('regularSeasonCount'),
        chaseCount: document.getElementById('chaseCount'),
        // Mobile elements
        resetBtnMobile: document.getElementById('resetBtnMobile'),
        simulateBtnMobile: document.getElementById('simulateBtnMobile'),
        mobileTabs: document.querySelectorAll('.mobile-tab'),
        leftColumn: document.querySelector('.left-column'),
        standingsPanel: document.querySelector('.standings-panel'),
        // Download elements
        downloadRaceBtn: document.getElementById('downloadRaceBtn'),
        downloadStandingsBtn: document.getElementById('downloadStandingsBtn'),
        shareRaceBtn: document.getElementById('shareRaceBtn'),
        shareStandingsBtn: document.getElementById('shareStandingsBtn'),
        // Download options modal
        downloadOptionsModal: document.getElementById('downloadOptionsModal'),
        closeDownloadOptionsModal: document.getElementById('closeDownloadOptionsModal'),
        downloadOptionsTitle: document.getElementById('downloadOptionsTitle'),
        downloadTop10: document.getElementById('downloadTop10'),
        downloadFullList: document.getElementById('downloadFullList'),
        // Race info button
        raceInfoBtn: document.getElementById('raceInfoBtn'),
        // Scoring info button
        scoringInfoBtn: document.getElementById('scoringInfoBtn')
    };

    // ============================================
    // Move modals to body to avoid z-index stacking issues
    // ============================================
    var bodyWrapper; // Reference to the body-level wrapper for modals/overlays
    (function attachModalsToBody() {
        bodyWrapper = document.createElement('div');
        bodyWrapper.className = 'nascar-predictor-container';
        bodyWrapper.appendChild(elements.raceModal);
        bodyWrapper.appendChild(elements.simulateModal);
        bodyWrapper.appendChild(elements.simulateRaceModal);
        bodyWrapper.appendChild(elements.clearModal);
        bodyWrapper.appendChild(elements.downloadOptionsModal);
        bodyWrapper.appendChild(elements.toastContainer);
        document.body.appendChild(bodyWrapper);
    })();

    // ============================================
    // Initialization
    // ============================================
    // Use server proxy to fetch data (handles User-Agent header)
    const REMOTE_DATA_URL = DATA_URL; // Using SKM data source path

    async function init() {
        showLoading(true);

        // Initialize with defaults first
        NASCARData.init();

        // Try to load from remote URL via server proxy
        var sheetData = null;
        try {
            sheetData = await NASCARData.loadFromRemote(REMOTE_DATA_URL);
            if (sheetData) {
                console.log('Loaded data from remote API');
            }
        } catch (error) {
            console.log('Using default data, remote load failed:', error);
        }

        // Copy data to state
        state.drivers = [...NASCARData.drivers];
        state.races = [...NASCARData.races];

        // Load saved results
        loadResults();

        // Render UI
        renderRacesList();
        calculateStandings();
        renderStandings();
        updateRaceCount();
        if (sheetData && sheetData.updatedTime) {
            updateTimestamp(sheetData.updatedTime);
        } else {
            updateTimestamp();
        }

        // Set up event listeners
        setupEventListeners();

        showLoading(false);
    }

    function updateTimestamp(timestamp) {
        const timestampContainer = isDesktop ? $(".header-wrapper .updated-timestamp-container") : $(".pfn-header-wrapper .updated-timestamp-container");
        if (timestamp && typeof convertTimestampToESTDateTime === 'function') {
            const updatedTime = convertTimestampToESTDateTime(timestamp);
            timestampContainer.innerHTML = "UPDATED ON " + updatedTime;
        } else {
            const now = new Date();
            const options = {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            const formatted = now.toLocaleString('en-US', options).replace(',', '');
            timestampContainer.textContent = `UPDATED ON ${formatted} EST`;
        }
    }

    // ============================================
    // Event Listeners
    // ============================================
    function setupEventListeners() {
        // Race item clicks
        elements.racesList.addEventListener('click', handleRaceClick);

        // Modal controls
        elements.closeModal.addEventListener('click', closeModal);
        elements.raceModal.addEventListener('click', (e) => {
            if (e.target === elements.raceModal) closeModal();
        });

        // Tab switching
        elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Don't switch tabs if clicking the info button
                if (e.target.classList.contains('tab-info-btn')) return;
                switchTab(btn.dataset.tab);
            });
        });

        // Tab info buttons (mobile)
        setupTabInfoButtons();

        // Modal action buttons
        elements.saveRaceBtn.addEventListener('click', saveRaceResults);
        elements.clearRaceBtn.addEventListener('click', clearRaceResults);
        elements.simulateRaceBtn.addEventListener('click', simulateCurrentRace);

        // Header buttons
        elements.resetBtn.addEventListener('click', resetSeason);
        elements.simulateBtn.addEventListener('click', openSimulateModal);

        // Simulate modal
        elements.closeSimulateModal.addEventListener('click', closeSimulateModal);
        elements.simulateModal.addEventListener('click', (e) => {
            if (e.target === elements.simulateModal) closeSimulateModal();
        });
        elements.simNextRace.addEventListener('click', simulateNextRace);
        elements.simToRaceBtn.addEventListener('click', simulateToRace);
        elements.simRegularSeason.addEventListener('click', simulateRegularSeason);
        elements.simFullSeason.addEventListener('click', simulateFullSeason);

        // Simulate race modal
        elements.closeSimulateRaceModal.addEventListener('click', closeSimulateRaceModal);
        elements.simulateRaceModal.addEventListener('click', (e) => {
            if (e.target === elements.simulateRaceModal) closeSimulateRaceModal();
        });
        elements.simCurrentEvent.addEventListener('click', simulateCurrentEvent);
        elements.simFullRace.addEventListener('click', simulateFullRaceEvent);

        // Clear modal
        elements.closeClearModal.addEventListener('click', closeClearModal);
        elements.clearModal.addEventListener('click', (e) => {
            if (e.target === elements.clearModal) closeClearModal();
        });
        elements.clearCurrentEvent.addEventListener('click', clearCurrentEventOnly);
        elements.clearFullRace.addEventListener('click', clearFullRaceResults);

        // Standings tabs
        elements.regularSeasonTab.addEventListener('click', () => switchStandingsView('regular'));
        elements.chaseTab.addEventListener('click', () => {
            if (state.regularSeasonComplete) {
                switchStandingsView('chase');
            }
        });

        // Keyboard handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.raceModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Mobile controls
        elements.resetBtnMobile.addEventListener('click', resetSeason);
        elements.simulateBtnMobile.addEventListener('click', openSimulateModal);
        elements.mobileTabs.forEach(tab => {
            tab.addEventListener('click', () => switchMobileTab(tab.dataset.mobileTab));
        });

        // Download buttons - open modal instead of downloading directly
        elements.downloadRaceBtn.addEventListener('click', () => openDownloadModal('race'));
        elements.downloadStandingsBtn.addEventListener('click', () => openDownloadModal('standings'));
        elements.shareRaceBtn.addEventListener('click', shareRaceResults);
        elements.shareStandingsBtn.addEventListener('click', shareStandings);

        // Download options modal
        elements.closeDownloadOptionsModal.addEventListener('click', closeDownloadModal);
        elements.downloadOptionsModal.addEventListener('click', (e) => {
            if (e.target === elements.downloadOptionsModal) closeDownloadModal();
        });
        elements.downloadTop10.addEventListener('click', () => {
            closeDownloadModal();
            if (state._downloadType === 'race') downloadRaceResults(10);
            else downloadStandings(10);
        });
        elements.downloadFullList.addEventListener('click', () => {
            closeDownloadModal();
            if (state._downloadType === 'race') downloadRaceResults();
            else downloadStandings();
        });

        // Race info button
        elements.raceInfoBtn.addEventListener('click', showRaceInfo);

        // Scoring info button
        elements.scoringInfoBtn.addEventListener('click', showScoringInfo);

        // Sortable standings headers
        document.querySelectorAll('.sortable-header').forEach(header => {
            header.addEventListener('click', (e) => {
                // Don't sort if clicking the scoring info button
                if (e.target.closest('.btn-scoring-info')) return;
                const column = header.dataset.sortColumn;
                if (column) {
                    sortStandings(column);
                }
            });
        });

        // Initialize mobile view with schedule visible
        initMobileView();
    }

    function initMobileView() {
        // Set initial mobile state - show schedule by default
        if (window.innerWidth <= 1024) {
            elements.leftColumn.classList.add('mobile-visible');
            elements.standingsPanel.classList.remove('mobile-visible');
        }
    }

    function switchMobileTab(tabName) {
        // Update tab buttons
        elements.mobileTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mobileTab === tabName);
        });

        // Show/hide panels
        if (tabName === 'schedule') {
            elements.leftColumn.classList.add('mobile-visible');
            elements.standingsPanel.classList.remove('mobile-visible');
        } else {
            elements.leftColumn.classList.remove('mobile-visible');
            elements.standingsPanel.classList.add('mobile-visible');
        }
    }

    // ============================================
    // Race List Rendering
    // ============================================
    function renderRacesList() {
        if (!state.races || state.races.length === 0) {
            elements.racesList.innerHTML = '<div class="empty-state">No races scheduled</div>';
            return;
        }

        const regularRaces = state.races.filter(r => r.season === 'regular' || !r.season);
        const chaseRaces = state.races.filter(r => r.season === 'chase');

        let html = '';

        // Regular Season races
        html += `<div class="race-section-header">Regular Season</div>`;
        regularRaces.forEach(race => {
            const isCompleted = state.results[race.id] && isRaceComplete(race.id);
            const hasOfficialResults = NASCARData.hasCompletedResults(race.id);
            const allOfficial = NASCARData.hasAllCompletedResults(race.id);
            const statusClass = isCompleted ? 'completed' : 'pending';
            const officialClass = hasOfficialResults ? 'official' : '';
            const officialLabel = allOfficial ? 'Official' : hasOfficialResults ? 'Partial' : '';

            html += `
                <div class="race-item ${statusClass} ${officialClass}" data-race-id="${race.id}">
                    <span class="race-number">${race.id}</span>
                    <div class="race-info">
                        <div class="race-name">${race.name}${officialLabel ? `<span class="race-official-indicator${!allOfficial ? ' partial' : ''}">${officialLabel}</span>` : ''}</div>
                        <div class="race-track">${race.track}</div>
                    </div>
                </div>
            `;
        });

        // Chase races
        if (chaseRaces.length > 0) {
            html += `<div class="race-section-header chase">Chase / Playoffs</div>`;
            chaseRaces.forEach(race => {
                const isCompleted = state.results[race.id] && isRaceComplete(race.id);
                const hasOfficialResults = NASCARData.hasCompletedResults(race.id);
                const allOfficial = NASCARData.hasAllCompletedResults(race.id);
                const statusClass = isCompleted ? 'completed' : 'pending';
                const officialClass = hasOfficialResults ? 'official' : '';
                const officialLabel = allOfficial ? 'Official' : hasOfficialResults ? 'Partial' : '';

                html += `
                    <div class="race-item chase ${statusClass} ${officialClass}" data-race-id="${race.id}">
                        <span class="race-number">${race.id}</span>
                        <div class="race-info">
                            <div class="race-name">${race.name}${officialLabel ? `<span class="race-official-indicator${!allOfficial ? ' partial' : ''}">${officialLabel}</span>` : ''}</div>
                            <div class="race-track">${race.track}</div>
                        </div>
                    </div>
                `;
            });
        }

        elements.racesList.innerHTML = html;
    }

    function handleRaceClick(e) {
        const raceItem = e.target.closest('.race-item');
        if (!raceItem) return;

        const raceId = parseInt(raceItem.dataset.raceId);
        openRaceModal(raceId);
    }

    function updateRaceCount() {
        const regularRaces = state.races.filter(r => r.season === 'regular' || !r.season);
        const chaseRaces = state.races.filter(r => r.season === 'chase');
        const completedRegular = regularRaces.filter(r => state.results[r.id] && isRaceComplete(r.id)).length;
        const completedChase = chaseRaces.filter(r => state.results[r.id] && isRaceComplete(r.id)).length;

        elements.regularSeasonCount.textContent = `${completedRegular} / ${regularRaces.length} Regular Season`;
        elements.chaseCount.textContent = `${completedChase} / ${chaseRaces.length} Chase`;
    }

    // ============================================
    // Points-ineligible driver adjustment
    // ============================================

    /**
     * Build a set of driver IDs that are not eligible for points.
     * Drivers with pointsEligible === false do not score points, and
     * every eligible driver who finishes behind an ineligible driver
     * is awarded points as if the ineligible driver was not in the field
     * (i.e. their "points position" is their finish position minus the
     * number of ineligible drivers who finished ahead of them).
     */
    function getIneligibleDriverIds() {
        const ids = new Set();
        state.drivers.forEach(d => {
            if (d.pointsEligible === false) ids.add(String(d.id));
        });
        return ids;
    }

    /**
     * For a given race's results, compute the number of ineligible drivers
     * that finished at or above each position for a given result field
     * (e.g. 'finish', 'stage1', 'stage2', 'duel1', 'duel2').
     * Returns a Map: driverId → adjustment (number to subtract from position).
     */
    function computePositionAdjustments(raceResults, field, ineligibleIds) {
        const ineligiblePositions = [];
        Object.keys(raceResults).forEach(driverId => {
            if (ineligibleIds.has(driverId) && raceResults[driverId][field]) {
                ineligiblePositions.push(raceResults[driverId][field]);
            }
        });
        ineligiblePositions.sort((a, b) => a - b);

        const adjustments = new Map();
        Object.keys(raceResults).forEach(driverId => {
            const pos = raceResults[driverId][field];
            if (!pos) {
                adjustments.set(driverId, 0);
                return;
            }
            let count = 0;
            for (const ip of ineligiblePositions) {
                if (ip < pos) count++;
                else break;
            }
            adjustments.set(driverId, count);
        });
        return adjustments;
    }

    /**
     * Create a points-adjusted copy of a race result for a given driver,
     * accounting for ineligible drivers in the field.
     * Ineligible drivers get an empty result (all positions nulled out).
     */
    function adjustResultForPoints(result, driverId, raceResults, ineligibleIds, precomputedAdj) {
        if (ineligibleIds.has(String(driverId))) {
            return { finish: null, stage1: null, stage2: null, stage3: null, duel1: null, duel2: null, fastestLap: false };
        }

        const adjusted = { ...result };
        const fields = ['finish', 'stage1', 'stage2', 'stage3', 'duel1', 'duel2'];
        for (const field of fields) {
            if (adjusted[field]) {
                const adj = precomputedAdj?.[field] || computePositionAdjustments(raceResults, field, ineligibleIds);
                const subtract = adj.get(String(driverId)) || 0;
                if (subtract > 0) {
                    adjusted[field] = adjusted[field] - subtract;
                }
            }
        }
        return adjusted;
    }

    /**
     * Precompute position adjustments for all fields in a race.
     */
    function precomputeRaceAdjustments(raceResults, ineligibleIds) {
        const fields = ['finish', 'stage1', 'stage2', 'stage3', 'duel1', 'duel2'];
        const adj = {};
        for (const field of fields) {
            adj[field] = computePositionAdjustments(raceResults, field, ineligibleIds);
        }
        return adj;
    }

    // ============================================
    // Standings Calculation & Rendering
    // ============================================
    function calculateStandings() {
        // Initialize standings for all drivers
        const driverStats = {};

        state.drivers.forEach(driver => {
            driverStats[driver.id] = {
                id: driver.id,
                name: driver.name,
                number: driver.number,
                team: driver.team,
                logo: driver.logo || null,
                points: 0,
                regularSeasonPoints: 0,
                chasePoints: 0,
                chaseResetPoints: 0,
                chaseTotal: 0,
                wins: 0,
                top5: 0,
                top10: 0,
                inChase: false,
                chaseSeedPosition: -1
            };
        });

        // Separate regular season and chase races
        const regularSeasonRaces = state.races.filter(r => r.season === 'regular' || !r.season);
        const chaseRaces = state.races.filter(r => r.season === 'chase');

        // Get set of points-ineligible driver IDs
        const ineligibleIds = getIneligibleDriverIds();

        // Process regular season results
        regularSeasonRaces.forEach(race => {
            const raceResults = state.results[race.id];
            if (!raceResults) return;

            const raceAdj = precomputeRaceAdjustments(raceResults, ineligibleIds);

            Object.keys(raceResults).forEach(driverId => {
                const result = raceResults[driverId];
                const stats = driverStats[driverId];
                if (!stats) return;

                const adjustedResult = adjustResultForPoints(result, driverId, raceResults, ineligibleIds, raceAdj);
                const racePoints = NASCARData.calculateRacePoints(adjustedResult);
                stats.regularSeasonPoints += racePoints;

                // Wins/top5/top10 use actual finish position (not adjusted)
                if (result.finish) {
                    if (result.finish === 1) stats.wins++;
                    if (result.finish <= 5) stats.top5++;
                    if (result.finish <= 10) stats.top10++;
                }
            });
        });

        // Apply manual point penalties (e.g. NASCAR-imposed penalties)
        NASCARData.penalties.forEach(penalty => {
            const stats = driverStats[penalty.driverId];
            if (stats) {
                stats.regularSeasonPoints += penalty.points;
            }
        });

        // Snapshot regular-season-only stats before chase results are added
        Object.values(driverStats).forEach(stats => {
            stats.regularSeasonWins = stats.wins;
            stats.regularSeasonTop5 = stats.top5;
            stats.regularSeasonTop10 = stats.top10;
        });

        // Check if regular season is complete
        const regularSeasonComplete = regularSeasonRaces.every(race =>
            state.results[race.id] && isRaceComplete(race.id)
        );

        // Check if any chase race has results
        const chaseStarted = chaseRaces.some(race =>
            state.results[race.id] && isRaceComplete(race.id)
        );

        // Calculate regular season standings to determine Chase qualifiers
        // Uses regular-season-only stats for tiebreakers
        const regularSeasonStandings = Object.values(driverStats).sort((a, b) => {
            if (b.regularSeasonPoints !== a.regularSeasonPoints) return b.regularSeasonPoints - a.regularSeasonPoints;
            if (b.regularSeasonWins !== a.regularSeasonWins) return b.regularSeasonWins - a.regularSeasonWins;
            return b.regularSeasonTop5 - a.regularSeasonTop5;
        });

        // Mark top 16 as Chase qualifiers and store their chase seed position
        const chaseQualifiers = NASCARData.chaseConfig.qualifiers;
        regularSeasonStandings.slice(0, chaseQualifiers).forEach((driver, index) => {
            driverStats[driver.id].inChase = true;
            driverStats[driver.id].chaseSeedPosition = index;
            driverStats[driver.id].chaseResetPoints = NASCARData.chaseResetPoints[index];
        });

        // Process chase race results
        chaseRaces.forEach(race => {
            const raceResults = state.results[race.id];
            if (!raceResults) return;

            const raceAdj = precomputeRaceAdjustments(raceResults, ineligibleIds);

            Object.keys(raceResults).forEach(driverId => {
                const result = raceResults[driverId];
                const stats = driverStats[driverId];
                if (!stats) return;

                const adjustedResult = adjustResultForPoints(result, driverId, raceResults, ineligibleIds, raceAdj);
                const racePoints = NASCARData.calculateRacePoints(adjustedResult);
                stats.chasePoints += racePoints;

                // Wins/top5/top10 use actual finish position (not adjusted)
                if (result.finish) {
                    if (result.finish === 1) stats.wins++;
                    if (result.finish <= 5) stats.top5++;
                    if (result.finish <= 10) stats.top10++;
                }
            });
        });

        // Calculate chase total points (reset + chase race points)
        Object.values(driverStats).forEach(stats => {
            if (stats.inChase) {
                stats.chaseTotal = stats.chaseResetPoints + stats.chasePoints;
            } else {
                // Non-Chase drivers show regular season + chase points
                stats.chaseTotal = stats.regularSeasonPoints + stats.chasePoints;
            }
            // Regular points always just the regular season total
            stats.points = stats.regularSeasonPoints;
        });

        // Store chase status for UI
        state.isChaseActive = regularSeasonComplete && chaseStarted;
        state.regularSeasonComplete = regularSeasonComplete;

        // Store regular season standings (sorted by regular season points and regular-season-only tiebreakers)
        state.regularSeasonStandings = Object.values(driverStats).map(d => ({...d})).sort((a, b) => {
            if (b.regularSeasonPoints !== a.regularSeasonPoints) return b.regularSeasonPoints - a.regularSeasonPoints;
            if (b.regularSeasonWins !== a.regularSeasonWins) return b.regularSeasonWins - a.regularSeasonWins;
            return b.regularSeasonTop5 - a.regularSeasonTop5;
        });

        // Store chase standings (sorted by chase total points)
        state.chaseStandings = Object.values(driverStats).map(d => ({...d})).sort((a, b) => {
            if (b.chaseTotal !== a.chaseTotal) return b.chaseTotal - a.chaseTotal;
            if (b.wins !== a.wins) return b.wins - a.wins;
            return b.top5 - a.top5;
        });

        // Set main standings based on current view
        state.standings = state.currentStandingsView === 'chase' && state.regularSeasonComplete
            ? state.chaseStandings
            : state.regularSeasonStandings;
    }

    function switchStandingsView(view) {
        if (view === 'chase' && !state.regularSeasonComplete) return;

        state.currentStandingsView = view;

        // Reset sort to points when switching views
        state.standingsSort = { column: 'points', direction: 'desc' };

        // Update tab states
        elements.regularSeasonTab.classList.toggle('active', view === 'regular');
        elements.chaseTab.classList.toggle('active', view === 'chase');

        // Update standings display
        state.standings = view === 'chase' ? state.chaseStandings : state.regularSeasonStandings;
        renderStandings();
    }

    /**
     * Sort standings by a specific column
     * @param {string} column - Column to sort by: 'points', 'wins', 'top5', 'top10'
     */
    function sortStandings(column) {
        // Toggle direction if same column, otherwise default to descending
        if (state.standingsSort.column === column) {
            state.standingsSort.direction = state.standingsSort.direction === 'desc' ? 'asc' : 'desc';
        } else {
            state.standingsSort.column = column;
            state.standingsSort.direction = 'desc';
        }
        renderStandings();
    }

    /**
     * Get sorted standings for display
     * @returns {Array} Standings with original position preserved, sorted by current column
     */
    function getSortedStandings() {
        const isChaseView = state.currentStandingsView === 'chase' && state.regularSeasonComplete;

        // Add original position to each driver
        const standingsWithPos = state.standings.map((driver, index) => ({
            ...driver,
            originalPos: index + 1
        }));

        // Sort by the selected column
        const { column, direction } = state.standingsSort;
        const multiplier = direction === 'desc' ? -1 : 1;

        return standingsWithPos.sort((a, b) => {
            let aVal, bVal;

            switch (column) {
                case 'wins':
                    aVal = isChaseView ? a.wins : a.regularSeasonWins;
                    bVal = isChaseView ? b.wins : b.regularSeasonWins;
                    break;
                case 'top5':
                    aVal = isChaseView ? a.top5 : a.regularSeasonTop5;
                    bVal = isChaseView ? b.top5 : b.regularSeasonTop5;
                    break;
                case 'top10':
                    aVal = isChaseView ? a.top10 : a.regularSeasonTop10;
                    bVal = isChaseView ? b.top10 : b.regularSeasonTop10;
                    break;
                case 'points':
                default:
                    aVal = isChaseView ? a.chaseTotal : a.regularSeasonPoints;
                    bVal = isChaseView ? b.chaseTotal : b.regularSeasonPoints;
                    break;
            }

            // Primary sort by selected column
            if (aVal !== bVal) {
                return (aVal - bVal) * multiplier;
            }
            // Secondary sort by original position (championship order)
            return a.originalPos - b.originalPos;
        });
    }

    /**
     * Update sort indicator icons in table headers
     */
    function updateSortIndicators() {
        const sortableHeaders = document.querySelectorAll('.sortable-header');
        sortableHeaders.forEach(header => {
            const column = header.dataset.sortColumn;
            const indicator = header.querySelector('.sort-indicator');
            if (!indicator) return;

            if (column === state.standingsSort.column) {
                indicator.classList.add('active');
                indicator.textContent = state.standingsSort.direction === 'desc' ? '▼' : '▲';
            } else {
                indicator.classList.remove('active');
                indicator.textContent = '▼';
            }
        });
    }

    function renderStandings() {
        // Update Chase tab state
        if (state.regularSeasonComplete) {
            elements.chaseTab.classList.remove('disabled');
            elements.chaseTab.classList.add('chase-unlocked');
        } else {
            elements.chaseTab.classList.add('disabled');
            elements.chaseTab.classList.remove('chase-unlocked');
        }

        // Handle empty state
        if (!state.standings || state.standings.length === 0) {
            elements.standingsBody.innerHTML = '<tr><td colspan="8" class="empty-state">No drivers available</td></tr>';
            return;
        }

        // Determine which points to show
        const isChaseView = state.currentStandingsView === 'chase' && state.regularSeasonComplete;

        // Hide chase gap column in chase view
        const standingsTable = document.getElementById('standingsTable');
        if (standingsTable) {
            standingsTable.classList.toggle('chase-view', isChaseView);
        }

        const leaderPoints = state.standings.length > 0
            ? (isChaseView ? state.standings[0].chaseTotal : state.standings[0].regularSeasonPoints)
            : 0;

        // Get 16th place points for chase gap calculation
        const chaseLinePoints = state.standings.length >= 16
            ? (isChaseView ? state.standings[15].chaseTotal : state.standings[15].regularSeasonPoints)
            : 0;

        // Get sorted standings for display (preserves original championship position)
        const sortedStandings = getSortedStandings();

        // Update sort indicators in header
        updateSortIndicators();

        elements.standingsBody.innerHTML = sortedStandings.map((driver) => {
            const displayPoints = isChaseView ? driver.chaseTotal : driver.regularSeasonPoints;
            const pointsBehind = driver.originalPos === 1 ? '-' : (leaderPoints - displayPoints);
            const driverIdentifier = driver.logo
                ? `<img src="${driver.logo}" alt="${driver.name}" class="driver-logo" onerror="this.outerHTML='<span class=\\'driver-number\\'>${driver.number}</span>'">`
                : `<span class="driver-number">${driver.number}</span>`;

            // Calculate chase gap based on original championship position
            let chaseGap = '-';
            if (state.standings.length >= 16) {
                const gap = displayPoints - chaseLinePoints;
                if (driver.originalPos <= 15) {
                    chaseGap = `<span class="chase-ahead">+${gap}</span>`;
                } else if (driver.originalPos === 16) {
                    chaseGap = '<span class="chase-line">--</span>';
                } else {
                    chaseGap = `<span class="chase-behind">${gap}</span>`;
                }
            }

            return `
                <tr class="${driver.inChase && state.regularSeasonComplete ? 'chase-qualifier' : ''} driver-row" data-driver-id="${driver.id}">
                    <td class="col-pos">${driver.originalPos}</td>
                    <td class="col-driver">
                        <div class="driver-cell">
                            ${driverIdentifier}
                            <span>${driver.name}</span>
                        </div>
                    </td>
                    <td class="col-points">${displayPoints}</td>
                    <td class="col-behind">${pointsBehind}</td>
                    <td class="col-chase-gap">${chaseGap}</td>
                    <td class="col-wins">${isChaseView ? driver.wins : driver.regularSeasonWins}</td>
                    <td class="col-top5">${isChaseView ? driver.top5 : driver.regularSeasonTop5}</td>
                    <td class="col-top10">${isChaseView ? driver.top10 : driver.regularSeasonTop10}</td>
                </tr>
            `;
        }).join('');

        // Add click handlers for driver rows
        elements.standingsBody.querySelectorAll('.driver-row').forEach(row => {
            row.addEventListener('click', () => {
                const driverId = parseInt(row.dataset.driverId);
                showDriverModal(driverId);
            });
        });
    }

    // ============================================
    // Modal Functions
    // ============================================
    function openRaceModal(raceId) {
        const race = state.races.find(r => r.id === raceId);
        if (!race) return;

        state.currentRaceId = raceId;

        // Check if this race has official completed results
        const hasOfficialResults = NASCARData.hasCompletedResults(raceId);
        const allOfficial = NASCARData.hasAllCompletedResults(raceId);

        // Show OFFICIAL badge only when ALL results are official, PARTIAL when some are
        const officialBadge = allOfficial ? '<span class="official-badge">OFFICIAL</span>' :
                              hasOfficialResults ? '<span class="official-badge partial">PARTIAL</span>' : '';
        elements.modalRaceTitle.innerHTML = `${race.name} ${officialBadge}`;

        // Only fully disable controls when ALL results are official
        elements.clearRaceBtn.disabled = allOfficial;
        elements.simulateRaceBtn.disabled = allOfficial;
        elements.saveRaceBtn.disabled = allOfficial;

        // Add/remove official class for styling
        elements.raceModal.classList.toggle('official-results', allOfficial);
        elements.raceModal.classList.toggle('partial-official', hasOfficialResults && !allOfficial);

        // Determine number of stages (default 2) and if has duels
        const numStages = race.stages || 2;
        const hasDuels = race.duels || false;

        // Update tabs dynamically
        renderModalTabs(numStages, hasDuels);

        // Lock individual tabs that have official data
        if (hasOfficialResults && !allOfficial) {
            elements.tabButtons.forEach(btn => {
                const tabType = btn.dataset.tab;
                if (tabType === 'fastest') {
                    if (NASCARData.hasCompletedResultsForType(raceId, 'fastestLap')) {
                        btn.classList.add('tab-official');
                    }
                } else if (NASCARData.hasCompletedResultsForType(raceId, tabType)) {
                    btn.classList.add('tab-official');
                }
            });
        }

        // Load existing results or initialize empty
        loadModalSelections(raceId);

        // Snapshot modal selections to detect unsaved changes on close
        state._savedModalSnapshot = JSON.stringify(state.modalSelections);

        // If has duels, set up duel assignments
        if (hasDuels) {
            setupDuelAssignments(raceId);
            renderDuelList('duel1');
            renderDuelList('duel2');
        }

        // Default to Finish tab if race already has finish results, otherwise first tab
        const hasFinishResults = Object.keys(state.modalSelections.finish).length > 0;
        if (hasFinishResults) {
            state.currentTab = 'finish';
        } else if (hasDuels) {
            state.currentTab = 'duel1';
        } else {
            state.currentTab = 'stage1';
        }

        // Render all stage tabs
        renderPositionList('stage1');
        renderPositionList('stage2');
        if (numStages >= 3) {
            renderPositionList('stage3');
        }
        renderPositionList('finish');
        renderFastestLapSelector();

        // Reset to first tab
        switchTab(state.currentTab);

        // Show modal
        elements.raceModal.classList.add('active');
    }

    function renderModalTabs(numStages, hasDuels = false) {
        const tabsContainer = document.querySelector('.nascar-predictor-container .modal-tabs');
        const contentContainer = document.querySelector('.nascar-predictor-container .modal-content');

        // Build tabs HTML (with mobile info buttons)
        let tabsHtml = '';
        if (hasDuels) {
            tabsHtml += `
                <button class="tab-btn active" data-tab="duel1">Duel 1<span class="tab-info-btn mobile-only" data-title="Duel 1" data-info="Top 10 earn points (10 for 1st to 1 for 10th)">i</span></button>
                <button class="tab-btn" data-tab="duel2">Duel 2<span class="tab-info-btn mobile-only" data-title="Duel 2" data-info="Top 10 earn points (10 for 1st to 1 for 10th)">i</span></button>
            `;
        }
        tabsHtml += `
            <button class="tab-btn ${!hasDuels ? 'active' : ''}" data-tab="stage1">Stage 1<span class="tab-info-btn mobile-only" data-title="Stage 1" data-info="Top 10 earn stage points">i</span></button>
            <button class="tab-btn" data-tab="stage2">Stage 2<span class="tab-info-btn mobile-only" data-title="Stage 2" data-info="Top 10 earn stage points">i</span></button>
        `;
        if (numStages >= 3) {
            tabsHtml += `<button class="tab-btn" data-tab="stage3">Stage 3<span class="tab-info-btn mobile-only" data-title="Stage 3" data-info="Top 10 earn stage points">i</span></button>`;
        }
        tabsHtml += `
            <button class="tab-btn" data-tab="finish">Finish<span class="tab-info-btn mobile-only" data-title="Finish" data-info="Set final race finishing positions">i</span></button>
            <button class="tab-btn" data-tab="fastest">Fastest Lap<span class="tab-info-btn mobile-only" data-title="Fastest Lap" data-info="Select the driver who set the fastest lap">i</span></button>
        `;
        tabsContainer.innerHTML = tabsHtml;

        // Build content HTML
        let contentHtml = '';
        if (hasDuels) {
            contentHtml += `
                <div class="tab-content active" id="tab-duel1">
                    <div class="stage-info">
                        <p>Duel 1 - Top 10 earn points (10 for 1st down to 1 for 10th)</p>
                    </div>
                    <div class="position-list" id="duel1Positions"></div>
                </div>
                <div class="tab-content" id="tab-duel2">
                    <div class="stage-info">
                        <p>Duel 2 - Top 10 earn points (10 for 1st down to 1 for 10th)</p>
                    </div>
                    <div class="position-list" id="duel2Positions"></div>
                </div>
            `;
        }
        contentHtml += `
            <div class="tab-content ${!hasDuels ? 'active' : ''}" id="tab-stage1">
                <div class="stage-info">
                    <p>Set finishing positions for Stage 1 (Top 10 earn stage points)</p>
                </div>
                <div class="position-list" id="stage1Positions"></div>
            </div>
            <div class="tab-content" id="tab-stage2">
                <div class="stage-info">
                    <p>Set finishing positions for Stage 2 (Top 10 earn stage points)</p>
                </div>
                <div class="position-list" id="stage2Positions"></div>
            </div>
        `;
        if (numStages >= 3) {
            contentHtml += `
                <div class="tab-content" id="tab-stage3">
                    <div class="stage-info">
                        <p>Set finishing positions for Stage 3 (Top 10 earn stage points)</p>
                    </div>
                    <div class="position-list" id="stage3Positions"></div>
                </div>
            `;
        }
        contentHtml += `
            <div class="tab-content" id="tab-finish">
                <div class="stage-info">
                    <p>Set final race finishing positions</p>
                </div>
                <div class="position-list" id="finishPositions"></div>
            </div>
            <div class="tab-content" id="tab-fastest">
                <div class="stage-info">
                    <p>Select the driver who set the fastest lap</p>
                </div>
                <div class="fastest-lap-selector" id="fastestLapSelector"></div>
            </div>
        `;
        contentContainer.innerHTML = contentHtml;

        // Update element references
        elements.tabButtons = document.querySelectorAll('.nascar-predictor-container .tab-btn');
        elements.tabContents = document.querySelectorAll('.nascar-predictor-container .tab-content');
        elements.duel1Positions = document.getElementById('duel1Positions');
        elements.duel2Positions = document.getElementById('duel2Positions');
        elements.stage1Positions = document.getElementById('stage1Positions');
        elements.stage2Positions = document.getElementById('stage2Positions');
        elements.stage3Positions = document.getElementById('stage3Positions');
        elements.finishPositions = document.getElementById('finishPositions');
        elements.fastestLapSelector = document.getElementById('fastestLapSelector');

        // Re-attach tab click listeners
        elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Don't switch tabs if clicking the info button
                if (e.target.classList.contains('tab-info-btn')) return;
                switchTab(btn.dataset.tab);
            });
        });

        // Re-attach info button listeners
        document.querySelectorAll('.nascar-predictor-container .tab-info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showInfoMessage(btn.dataset.title, btn.dataset.info);
            });
        });
    }

    function closeModal() {
        // Check for unsaved changes
        if (state._savedModalSnapshot && JSON.stringify(state.modalSelections) !== state._savedModalSnapshot) {
            if (!confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
                return;
            }
        }

        elements.raceModal.classList.remove('active');
        state.currentRaceId = null;
        state._savedModalSnapshot = null;

        // Clean up any active touch drag state
        if (touchDragClone) {
            touchDragClone.remove();
            touchDragClone = null;
        }
        if (touchDragElement) {
            touchDragElement.classList.remove('dragging');
            touchDragElement = null;
        }
        touchCurrentSlot = null;
        draggedDriver = null;
        draggedFromPosition = null;
        draggedType = null;

        // Close any open driver picker
        closeDriverPicker();
    }

    function switchTab(tabName) {
        state.currentTab = tabName;

        // Update tab buttons
        elements.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });

        // Close any open info message
        closeInfoMessage();
    }

    function setupTabInfoButtons() {
        document.querySelectorAll('.nascar-predictor-container .tab-info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showInfoMessage(btn.dataset.title, btn.dataset.info);
            });
        });
    }

    function showInfoMessage(title, message) {
        // Close any existing info message
        closeInfoMessage();

        // Create overlay and message
        const overlay = document.createElement('div');
        overlay.className = 'nascar-predictor-container info-message-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100000;';

        const messageBox = document.createElement('div');
        messageBox.className = 'info-message';

        const icon = document.createElement('div');
        icon.className = 'info-message-icon';
        icon.textContent = 'i';

        const titleEl = document.createElement('h3');
        titleEl.className = 'info-message-title';
        titleEl.textContent = title || '';
        titleEl.style.cssText = 'display: block; color: #0050A0; font-size: 1.1rem; font-weight: 700; margin: 0 0 8px 0;';

        const textEl = document.createElement('p');
        textEl.className = 'info-message-text';
        textEl.textContent = message || '';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'info-message-close';
        closeBtn.textContent = 'OK';
        closeBtn.style.cssText = 'display: block; margin: 0 auto; background: #0050A0; color: #fff; border: none; padding: 8px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;';
        closeBtn.addEventListener('click', closeInfoMessage);

        messageBox.appendChild(icon);
        messageBox.appendChild(titleEl);
        messageBox.appendChild(textEl);
        messageBox.appendChild(closeBtn);
        overlay.appendChild(messageBox);

        bodyWrapper.appendChild(overlay);

        // Close on overlay click (outside the message)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeInfoMessage();
        });
    }

    function closeInfoMessage() {
        document.querySelectorAll('.info-message-overlay').forEach(o => o.remove());
    }

    function showRaceInfo() {
        if (!state.currentRaceId) return;

        const race = state.races.find(r => r.id === state.currentRaceId);
        if (!race) return;

        // Close any existing info message
        closeInfoMessage();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'nascar-predictor-container info-message-overlay race-info-overlay';

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'race-info-popup';

        // Title
        const titleEl = document.createElement('h3');
        titleEl.className = 'race-info-popup-title';
        titleEl.textContent = race.name;
        titleEl.style.cssText = 'display: block; color: #0050A0; font-size: 1.2rem; font-weight: 700; margin: 0 0 16px 0; text-align: center;';

        // Info grid
        const infoGrid = document.createElement('div');
        infoGrid.className = 'race-info-grid';
        infoGrid.style.cssText = 'display: grid; grid-template-columns: auto auto; gap: 8px 12px; text-align: left; justify-content: start;';

        // Helper to add info row
        function addInfoRow(label, value) {
            if (!value && value !== 0) return;

            const labelEl = document.createElement('span');
            labelEl.className = 'race-info-label';
            labelEl.textContent = label + ':';
            labelEl.style.cssText = 'font-weight: 600; color: #666; text-align: left;';

            const valueEl = document.createElement('span');
            valueEl.className = 'race-info-value';
            valueEl.textContent = value;
            valueEl.style.cssText = 'color: #333; text-align: left;';

            infoGrid.appendChild(labelEl);
            infoGrid.appendChild(valueEl);
        }

        // Add race info from the dynamic data
        addInfoRow('Track', race.track);
        addInfoRow('Type', race.type);
        addInfoRow('Location', race.location);
        addInfoRow('Date', race.date);
        addInfoRow('Length (Miles)', race.lengthMiles);
        addInfoRow('Length (Laps)', race.lengthLaps);
        addInfoRow('Stage 1 Laps', race.stage1Laps);
        addInfoRow('Stage 2 Laps', race.stage2Laps);
        if (race.stage3Laps) {
            addInfoRow('Stage 3 Laps', race.stage3Laps);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'race-info-close-btn';
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = 'display: block; margin: 16px auto 0; background: #0050A0; color: #fff; border: none; padding: 10px 28px; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer;';
        closeBtn.addEventListener('click', closeInfoMessage);

        // Assemble popup
        popup.appendChild(titleEl);
        popup.appendChild(infoGrid);
        popup.appendChild(closeBtn);
        popup.style.cssText = 'background: #fff; padding: 20px 24px; border-radius: 12px; max-width: 400px; width: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';

        overlay.appendChild(popup);
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100000;';

        bodyWrapper.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeInfoMessage();
        });
    }

    function showScoringInfo() {
        // Close any existing info message
        closeInfoMessage();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'nascar-predictor-container info-message-overlay scoring-info-overlay';

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'scoring-info-popup';

        // Title
        const titleEl = document.createElement('h3');
        titleEl.textContent = 'Scoring System';
        titleEl.style.cssText = 'display: block; color: #0050A0; font-size: 1.3rem; font-weight: 700; margin: 0 0 16px 0; text-align: center;';

        // Content container
        const content = document.createElement('div');
        content.style.cssText = 'max-height: 60vh; overflow-y: auto;';

        // Race Finish Points Section
        const finishSection = document.createElement('div');
        finishSection.style.cssText = 'margin-bottom: 16px;';

        const finishTitle = document.createElement('h4');
        finishTitle.textContent = 'Race Finish Points';
        finishTitle.style.cssText = 'color: #333; font-size: 1rem; font-weight: 600; margin: 0 0 8px 0; border-bottom: 2px solid #0050A0; padding-bottom: 4px;';
        finishSection.appendChild(finishTitle);

        const finishGrid = document.createElement('div');
        finishGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; font-size: 0.85rem;';

        const finishPoints = NASCARData.pointsSystem.finish;
        for (let i = 0; i < 20; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = 'display: flex; justify-content: space-between; padding: 4px 8px; background: #f5f5f5; border-radius: 4px;';
            cell.innerHTML = `<span style="color: #666;">${i + 1}.</span><span style="font-weight: 600;">${finishPoints[i]}</span>`;
            finishGrid.appendChild(cell);
        }
        finishSection.appendChild(finishGrid);

        const finishNote = document.createElement('div');
        finishNote.textContent = 'Positions 21-36: 16 down to 1 pt | Positions 37-40: 1 pt each';
        finishNote.style.cssText = 'font-size: 0.75rem; color: #666; margin-top: 6px; text-align: center;';
        finishSection.appendChild(finishNote);

        // Stage Points Section
        const stageSection = document.createElement('div');
        stageSection.style.cssText = 'margin-bottom: 16px;';

        const stageTitle = document.createElement('h4');
        stageTitle.textContent = 'Stage Points (Top 10)';
        stageTitle.style.cssText = 'color: #333; font-size: 1rem; font-weight: 600; margin: 0 0 8px 0; border-bottom: 2px solid #0050A0; padding-bottom: 4px;';
        stageSection.appendChild(stageTitle);

        const stageGrid = document.createElement('div');
        stageGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; font-size: 0.85rem;';

        const stagePoints = NASCARData.pointsSystem.stage;
        for (let i = 0; i < 10; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = 'display: flex; justify-content: space-between; padding: 4px 8px; background: #e8f4e8; border-radius: 4px;';
            cell.innerHTML = `<span style="color: #666;">${i + 1}.</span><span style="font-weight: 600;">${stagePoints[i]}</span>`;
            stageGrid.appendChild(cell);
        }
        stageSection.appendChild(stageGrid);

        const stageNote = document.createElement('div');
        stageNote.innerHTML = 'Stage points awarded at end of Stage 1 & Stage 2 (and Stage 3 for Coca-Cola 600)<br><strong>Duels (Daytona):</strong> Top 10 in each duel also earn stage points';
        stageNote.style.cssText = 'font-size: 0.75rem; color: #666; margin-top: 6px; text-align: center;';
        stageSection.appendChild(stageNote);

        // Bonus Points Section
        const bonusSection = document.createElement('div');
        bonusSection.style.cssText = 'margin-bottom: 16px;';

        const bonusTitle = document.createElement('h4');
        bonusTitle.textContent = 'Bonus Points';
        bonusTitle.style.cssText = 'color: #333; font-size: 1rem; font-weight: 600; margin: 0 0 8px 0; border-bottom: 2px solid #0050A0; padding-bottom: 4px;';
        bonusSection.appendChild(bonusTitle);

        const bonusGrid = document.createElement('div');
        bonusGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9rem;';

        const bonusItems = [
            { label: 'Fastest Lap', value: `+${NASCARData.pointsSystem.fastestLap} pt` }
        ];

        bonusItems.forEach(item => {
            const cell = document.createElement('div');
            cell.style.cssText = 'display: flex; justify-content: space-between; padding: 6px 10px; background: #fff8e8; border-radius: 4px;';
            cell.innerHTML = `<span style="color: #666;">${item.label}</span><span style="font-weight: 600;">${item.value}</span>`;
            bonusGrid.appendChild(cell);
        });
        bonusSection.appendChild(bonusGrid);

        // Assemble content
        content.appendChild(finishSection);
        content.appendChild(stageSection);
        content.appendChild(bonusSection);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = 'display: block; margin: 16px auto 0; background: #0050A0; color: #fff; border: none; padding: 10px 28px; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer;';
        closeBtn.addEventListener('click', closeInfoMessage);

        // Assemble popup
        popup.appendChild(titleEl);
        popup.appendChild(content);
        popup.appendChild(closeBtn);
        popup.style.cssText = 'background: #fff; padding: 20px 24px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';

        overlay.appendChild(popup);
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100000;';

        bodyWrapper.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeInfoMessage();
        });
    }

    function showDriverModal(driverId) {
        // Find driver in state
        const driver = state.drivers.find(d => d.id === driverId);
        if (!driver) return;

        // Get driver stats from standings
        const driverStats = state.standings.find(d => d.id === driverId) || {};

        // Close any existing info message
        closeInfoMessage();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'nascar-predictor-container info-message-overlay driver-modal-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100000;';

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'driver-modal-popup';

        // Header with driver info
        const header = document.createElement('div');
        header.className = 'driver-modal-header';
        header.innerHTML = `
            <div class="driver-modal-identity">
                ${driver.logo
                    ? `<img src="${driver.logo}" alt="${driver.name}" class="driver-modal-logo" onerror="this.style.display='none'">`
                    : ''}
                <div class="driver-modal-info">
                    <h3 class="driver-modal-name">${driver.name}</h3>
                    <div class="driver-modal-details">
                        <span class="driver-modal-team">${driver.team || 'Independent'}</span>
                        ${driver.manufacturer ? `<span class="driver-modal-manufacturer">${driver.manufacturer}</span>` : ''}
                    </div>
                </div>
            </div>
            <button class="driver-modal-close">&times;</button>
        `;

        // Stats summary
        const statsSummary = document.createElement('div');
        statsSummary.className = 'driver-modal-stats';
        statsSummary.innerHTML = `
            <div class="driver-stat">
                <span class="stat-value">${driverStats.regularSeasonPoints || 0}</span>
                <span class="stat-label">Points</span>
            </div>
            <div class="driver-stat">
                <span class="stat-value">${driverStats.wins || 0}</span>
                <span class="stat-label">Wins</span>
            </div>
            <div class="driver-stat">
                <span class="stat-value">${driverStats.top5 || 0}</span>
                <span class="stat-label">Top 5</span>
            </div>
            <div class="driver-stat">
                <span class="stat-value">${driverStats.top10 || 0}</span>
                <span class="stat-label">Top 10</span>
            </div>
        `;

        // Race results table
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'driver-modal-results';

        const resultsTitle = document.createElement('h4');
        resultsTitle.textContent = 'Race Results';
        resultsTitle.className = 'driver-results-title';

        const resultsTable = document.createElement('div');
        resultsTable.className = 'driver-results-grid';

        // Add header row
        resultsTable.innerHTML = `
            <div class="driver-result-row header-row">
                <span class="result-race-num">#</span>
                <span class="result-race-name">Race</span>
                <span class="result-position">Finish</span>
                <span class="result-points">Total Pts</span>
            </div>
        `;

        // Build results for each race
        state.races.forEach(race => {
            const raceResult = state.results[race.id] ? state.results[race.id][driverId] : null;
            const isAvailable = NASCARData.isDriverAvailable(driver, race.id);

            let resultDisplay = '-';
            let resultClass = 'no-result';
            let pointsDisplay = '';

            if (!isAvailable) {
                resultDisplay = 'N/A';
                resultClass = 'not-available';
            } else if (raceResult && raceResult.finish) {
                resultDisplay = `P${raceResult.finish}`;
                const raceResults = state.results[race.id] || {};
                const adjustedResult = adjustResultForPoints(raceResult, driverId, raceResults, getIneligibleDriverIds());
                let points = NASCARData.calculateRacePoints(adjustedResult);

                // Check for manual penalties on this race for this driver
                const racePenalty = NASCARData.penalties.find(p => p.driverId === parseInt(driverId) && p.raceId === race.id);
                if (racePenalty) {
                    points += racePenalty.points;
                    pointsDisplay = `${points} pts (${racePenalty.points} pen.)`;
                } else {
                    pointsDisplay = `${points} pts`;
                }

                if (raceResult.finish === 1) {
                    resultClass = 'win';
                } else if (raceResult.finish <= 5) {
                    resultClass = 'top5';
                } else if (raceResult.finish <= 10) {
                    resultClass = 'top10';
                } else {
                    resultClass = 'finished';
                }
            }

            const isChaseRace = race.season === 'chase';

            resultsTable.innerHTML += `
                <div class="driver-result-row ${resultClass} ${isChaseRace ? 'chase-race' : ''}">
                    <span class="result-race-num">${race.id}</span>
                    <span class="result-race-name">${race.name}</span>
                    <span class="result-position">${resultDisplay}</span>
                    <span class="result-points">${pointsDisplay}</span>
                </div>
            `;
        });

        resultsContainer.appendChild(resultsTitle);
        resultsContainer.appendChild(resultsTable);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'driver-modal-close-btn';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', closeInfoMessage);

        // Assemble popup
        popup.appendChild(header);
        popup.appendChild(statsSummary);
        popup.appendChild(resultsContainer);
        popup.appendChild(closeBtn);

        overlay.appendChild(popup);

        // Add close handler to header X button
        popup.querySelector('.driver-modal-close').addEventListener('click', closeInfoMessage);

        bodyWrapper.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeInfoMessage();
        });
    }

    function loadModalSelections(raceId) {
        const existingResults = state.results[raceId] || {};

        // Reset selections
        state.modalSelections = {
            duel1: {},
            duel2: {},
            stage1: {},
            stage2: {},
            stage3: {},
            finish: {},
            fastestLap: null
        };

        // Load existing results into modal selections
        Object.keys(existingResults).forEach(driverId => {
            const result = existingResults[driverId];
            if (result.duel1) {
                state.modalSelections.duel1[result.duel1] = parseInt(driverId);
            }
            if (result.duel2) {
                state.modalSelections.duel2[result.duel2] = parseInt(driverId);
            }
            if (result.stage1) {
                state.modalSelections.stage1[result.stage1] = parseInt(driverId);
            }
            if (result.stage2) {
                state.modalSelections.stage2[result.stage2] = parseInt(driverId);
            }
            if (result.stage3) {
                state.modalSelections.stage3[result.stage3] = parseInt(driverId);
            }
            if (result.finish) {
                state.modalSelections.finish[result.finish] = parseInt(driverId);
            }
            if (result.fastestLap) {
                state.modalSelections.fastestLap = parseInt(driverId);
            }
        });
    }

    function setupDuelAssignments(raceId) {
        // Only use drivers available for this race
        const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, raceId));

        // Check if drivers have duelNumber from sheet data — this takes priority
        const hasSheetDuelAssignments = availableDrivers.some(d => d.duelNumber === 1 || d.duelNumber === 2);

        if (hasSheetDuelAssignments) {
            // Use duelNumber from sheet data (always overrides saved/random assignments)
            const sheetDuel1 = availableDrivers.filter(d => d.duelNumber === 1).map(d => d.id);
            const sheetDuel2 = availableDrivers.filter(d => d.duelNumber === 2).map(d => d.id);
            // Any drivers without a duelNumber get assigned to the smaller group
            const unassigned = availableDrivers.filter(d => d.duelNumber !== 1 && d.duelNumber !== 2);
            unassigned.forEach(d => {
                if (sheetDuel1.length <= sheetDuel2.length) {
                    sheetDuel1.push(d.id);
                } else {
                    sheetDuel2.push(d.id);
                }
            });
            state.duelAssignments.duel1 = sheetDuel1;
            state.duelAssignments.duel2 = sheetDuel2;
            saveDuelAssignments(raceId);
            return;
        }

        // Try to load persisted assignments
        const savedAssignments = loadDuelAssignments(raceId);
        if (savedAssignments && savedAssignments.duel1 && savedAssignments.duel2) {
            state.duelAssignments = savedAssignments;
            return;
        }

        const existingResults = state.results[raceId] || {};

        // Check if we have existing duel assignments from results
        const duel1Drivers = [];
        const duel2Drivers = [];

        Object.keys(existingResults).forEach(driverId => {
            const result = existingResults[driverId];
            if (result.duel1) {
                duel1Drivers.push(parseInt(driverId));
            }
            if (result.duel2) {
                duel2Drivers.push(parseInt(driverId));
            }
        });

        const hasDuel1Results = duel1Drivers.length > 0;
        const hasDuel2Results = duel2Drivers.length > 0;

        if (hasDuel1Results || hasDuel2Results) {
            // Get drivers not yet assigned to either duel (but available for this race)
            const assignedDrivers = [...duel1Drivers, ...duel2Drivers];
            const unassignedDrivers = availableDrivers
                .filter(d => !assignedDrivers.includes(d.id))
                .sort(() => Math.random() - 0.5);

            // Calculate how many more drivers each duel needs
            const halfCount = Math.ceil(availableDrivers.length / 2);
            const duel1Needed = halfCount - duel1Drivers.length;
            const duel2Needed = halfCount - duel2Drivers.length;

            // Fill duel1 first, then duel2
            state.duelAssignments.duel1 = [...duel1Drivers, ...unassignedDrivers.slice(0, duel1Needed).map(d => d.id)];
            state.duelAssignments.duel2 = [...duel2Drivers, ...unassignedDrivers.slice(duel1Needed, duel1Needed + duel2Needed).map(d => d.id)];
        } else {
            // Randomly assign available drivers to duels
            const shuffled = [...availableDrivers].sort(() => Math.random() - 0.5);
            const halfCount = Math.ceil(shuffled.length / 2);

            state.duelAssignments.duel1 = shuffled.slice(0, halfCount).map(d => d.id);
            state.duelAssignments.duel2 = shuffled.slice(halfCount).map(d => d.id);
        }

        // Persist the new assignments
        saveDuelAssignments(raceId);
    }

    function isDriverInChase(driverId) {
        // Check from regularSeasonStandings if available
        if (state.regularSeasonStandings && state.regularSeasonStandings.length >= 16) {
            const chaseDriverIds = state.regularSeasonStandings.slice(0, 16).map(d => d.id);
            return chaseDriverIds.includes(driverId);
        }
        // Fallback: check if driver has inChase flag in standings
        if (state.standings && state.standings.length > 0) {
            const driver = state.standings.find(d => d.id === driverId);
            return driver && driver.inChase;
        }
        return false;
    }

    function isChaseRace() {
        if (!state.currentRaceId) return false;
        const race = state.races.find(r => r.id === state.currentRaceId);
        return race && race.season === 'chase';
    }

    function renderDuelList(type) {
        const container = type === 'duel1' ? elements.duel1Positions : elements.duel2Positions;
        if (!container) return;

        const selections = state.modalSelections[type];
        const duelDriverIds = state.duelAssignments[type];
        const duelDrivers = duelDriverIds.map(id => state.drivers.find(d => d.id === id)).filter(Boolean);
        const maxPositions = duelDrivers.length;

        // Create 2 columns for duels (since only ~20 drivers)
        const columns = [
            { start: 1, end: 10, label: '1-10' },
            { start: 11, end: maxPositions, label: `11-${maxPositions}` }
        ];

        let html = '';
        columns.forEach(col => {
            if (col.start > maxPositions) return;
            html += `<div class="position-column">`;
            html += `<div class="position-column-header">${col.label}</div>`;

            for (let pos = col.start; pos <= col.end && pos <= maxPositions; pos++) {
                const isTop10 = pos <= 10;
                const driverId = selections[pos];
                const driver = driverId ? state.drivers.find(d => d.id === driverId) : null;
                const showChaseBadge = driver && isChaseRace() && isDriverInChase(driver.id);

                const chipContent = driver
                    ? (driver.logo
                        ? `<img src="${driver.logo}" alt="${driver.name}" class="chip-logo" onerror="this.outerHTML='<span class=\\'chip-number\\'>#${driver.number}</span>'"><span class="chip-name">${driver.name}</span>${showChaseBadge ? '<span class="chase-badge">C</span>' : ''}`
                        : `<span class="chip-number">#${driver.number}</span><span class="chip-name">${driver.name}</span>${showChaseBadge ? '<span class="chase-badge">C</span>' : ''}`)
                    : `<span class="chip-name">Click Here</span>`;

                html += `
                    <div class="position-slot ${isTop10 ? 'top-10' : ''} ${!driver ? 'empty' : ''}"
                         data-position="${pos}" data-type="${type}">
                        <span class="position-label">${pos}</span>
                        ${driver ? `
                            <div class="driver-chip" draggable="true" data-driver-id="${driver.id}">
                                ${chipContent}
                            </div>
                        ` : `
                            <div class="driver-chip">
                                ${chipContent}
                            </div>
                        `}
                    </div>
                `;
            }
            html += `</div>`;
        });

        container.innerHTML = html;

        // Add drag and drop listeners (skip for official tabs)
        const isDuelOfficial = NASCARData.hasCompletedResultsForType(state.currentRaceId, type);
        if (!isDuelOfficial) {
            setupDuelDragAndDrop(container, type);
        }
    }

    function setupDuelDragAndDrop(container, type) {
        const duelDriverIds = state.duelAssignments[type];

        // Click on empty slots to show driver picker (duel-specific)
        container.querySelectorAll('.position-slot.empty').forEach(slot => {
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                showDuelDriverPicker(slot, type, duelDriverIds);
            });
        });

        // Draggable chips
        container.querySelectorAll('.driver-chip[draggable="true"]').forEach(chip => {
            chip.addEventListener('dragstart', (e) => {
                draggedDriver = parseInt(chip.dataset.driverId);
                draggedFromPosition = parseInt(chip.closest('.position-slot').dataset.position);
                draggedType = type;
                chip.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            chip.addEventListener('dragend', (e) => {
                chip.classList.remove('dragging');
                draggedDriver = null;
                draggedFromPosition = null;
                draggedType = null;
                container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            });

            // Touch events for mobile
            chip.addEventListener('touchstart', (e) => handleTouchStart(e, chip, type, container), { passive: false });
            chip.addEventListener('touchmove', (e) => handleTouchMove(e, container), { passive: false });
            chip.addEventListener('touchend', (e) => handleTouchEnd(e, type, container, true), { passive: false });
        });

        // Drop zones
        container.querySelectorAll('.position-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', (e) => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');

                if (draggedDriver === null || draggedType !== type) return;

                const targetPosition = parseInt(slot.dataset.position);
                if (targetPosition === draggedFromPosition) return;

                const selections = state.modalSelections[type];

                // Shift drivers
                if (targetPosition < draggedFromPosition) {
                    for (let pos = draggedFromPosition; pos > targetPosition; pos--) {
                        const driverAbove = selections[pos - 1];
                        if (driverAbove) {
                            selections[pos] = driverAbove;
                        } else {
                            delete selections[pos];
                        }
                    }
                } else {
                    for (let pos = draggedFromPosition; pos < targetPosition; pos++) {
                        const driverBelow = selections[pos + 1];
                        if (driverBelow) {
                            selections[pos] = driverBelow;
                        } else {
                            delete selections[pos];
                        }
                    }
                }

                selections[targetPosition] = draggedDriver;
                renderDuelList(type);
            });
        });
    }

    function showDuelDriverPicker(slot, type, duelDriverIds) {
        closeDriverPicker();

        const position = parseInt(slot.dataset.position);
        const selections = state.modalSelections[type];
        const assignedIds = Object.values(selections);

        // Get available drivers (in this duel, not yet assigned, and available for this race)
        const availableDrivers = state.drivers.filter(d =>
            duelDriverIds.includes(d.id) && !assignedIds.includes(d.id) && NASCARData.isDriverAvailable(d, state.currentRaceId)
        );

        if (availableDrivers.length === 0) {
            showToast('All drivers in this duel are assigned', 'info');
            return;
        }

        const picker = document.createElement('div');
        picker.className = 'driver-picker';
        picker.innerHTML = `
            <div class="driver-picker-header">
                <span>Select Driver for P${position}</span>
                <button class="picker-close">&times;</button>
            </div>
            <div class="driver-picker-search">
                <input type="text" class="picker-search-input" placeholder="Search driver..." autocomplete="off">
            </div>
            <div class="driver-picker-list">
                ${availableDrivers.map(driver => {
                    const pickerIdentifier = driver.logo
                        ? `<img src="${driver.logo}" alt="${driver.name}" class="picker-logo" onerror="this.outerHTML='<span class=\\'picker-number\\'>#${driver.number}</span>'">`
                        : `<span class="picker-number">#${driver.number}</span>`;
                    const showChaseBadge = isChaseRace() && isDriverInChase(driver.id);
                    return `
                        <div class="picker-item" data-driver-id="${driver.id}" data-driver-name="${driver.name.toLowerCase()}" data-driver-number="${driver.number}">
                            ${pickerIdentifier}
                            <span class="picker-name">${driver.name}</span>
                            ${showChaseBadge ? '<span class="chase-badge">C</span>' : ''}
                        </div>
                    `;
                }).join('')}
                <div class="picker-no-results">No drivers found</div>
            </div>
        `;

        const slotRect = slot.getBoundingClientRect();
        const modal = slot.closest('.modal');
        const modalRect = modal.getBoundingClientRect();

        picker.style.position = 'absolute';
        picker.style.left = (slotRect.left - modalRect.left) + 'px';
        // Initially position below the slot
        picker.style.top = (slotRect.bottom - modalRect.top + 5) + 'px';

        modal.style.position = 'relative';
        modal.appendChild(picker);

        // Check if picker goes off bottom of screen or modal and flip if needed
        const pickerRect = picker.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const modalBottom = modalRect.bottom;
        const maxBottom = Math.min(viewportHeight, modalBottom) - 10; // 10px buffer

        if (pickerRect.bottom > maxBottom) {
            // Flip upwards
            picker.style.top = (slotRect.top - modalRect.top - pickerRect.height - 5) + 'px';
        }

        // Search functionality
        const searchInput = picker.querySelector('.picker-search-input');
        const noResultsEl = picker.querySelector('.picker-no-results');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleCount = 0;
            picker.querySelectorAll('.picker-item').forEach(item => {
                const driverName = item.dataset.driverName;
                const driverNumber = item.dataset.driverNumber;
                const nameParts = driverName.split(' ');
                const matches = searchTerm === '' ||
                    driverName.includes(searchTerm) ||
                    nameParts.some(part => part.startsWith(searchTerm)) ||
                    driverNumber.startsWith(searchTerm);
                item.style.display = matches ? '' : 'none';
                if (matches) visibleCount++;
            });
            noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
        });
        searchInput.focus();

        picker.querySelector('.picker-close').addEventListener('click', closeDriverPicker);

        picker.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                const driverId = parseInt(item.dataset.driverId);
                state.modalSelections[type][position] = driverId;
                closeDriverPicker();
                renderDuelList(type);
            });
        });

        setTimeout(() => {
            document.addEventListener('click', handlePickerOutsideClick);
        }, 0);
    }

    // ============================================
    // Position List Rendering (Drag & Drop)
    // ============================================
    let draggedDriver = null;
    let draggedFromPosition = null;
    let draggedType = null;

    // Touch drag state
    let touchDragElement = null;
    let touchDragClone = null;
    let touchStartY = 0;
    let touchStartX = 0;
    let touchCurrentSlot = null;

    function renderPositionList(type) {
        const container = type === 'stage1' ? elements.stage1Positions :
                         type === 'stage2' ? elements.stage2Positions :
                         type === 'stage3' ? elements.stage3Positions :
                         elements.finishPositions;

        if (!container) return;

        const selections = state.modalSelections[type];
        const isStage = type !== 'finish';
        // Only count drivers available for this race
        const availableDriverCount = state.drivers.filter(d => NASCARData.isDriverAvailable(d, state.currentRaceId)).length;
        const maxPositions = availableDriverCount;

        // Create 4 columns: 1-10, 11-20, 21-30, 31-40
        const columns = [
            { start: 1, end: 10, label: '1-10' },
            { start: 11, end: 20, label: '11-20' },
            { start: 21, end: 30, label: '21-30' },
            { start: 31, end: Math.min(40, maxPositions), label: '31-40' }
        ];

        let html = '';
        columns.forEach(col => {
            html += `<div class="position-column">`;
            html += `<div class="position-column-header">${col.label}</div>`;

            for (let pos = col.start; pos <= col.end && pos <= maxPositions; pos++) {
                const isTop10 = pos <= 10 && isStage;
                const driverId = selections[pos];
                const driver = driverId ? state.drivers.find(d => d.id === driverId) : null;
                const showChaseBadge = driver && isChaseRace() && isDriverInChase(driver.id);

                const chipContent = driver
                    ? (driver.logo
                        ? `<img src="${driver.logo}" alt="${driver.name}" class="chip-logo" onerror="this.outerHTML='<span class=\\'chip-number\\'>#${driver.number}</span>'"><span class="chip-name">${driver.name}</span>${showChaseBadge ? '<span class="chase-badge">C</span>' : ''}`
                        : `<span class="chip-number">#${driver.number}</span><span class="chip-name">${driver.name}</span>${showChaseBadge ? '<span class="chase-badge">C</span>' : ''}`)
                    : `<span class="chip-name">Click Here</span>`;

                html += `
                    <div class="position-slot ${isTop10 ? 'top-10' : ''} ${!driver ? 'empty' : ''}"
                         data-position="${pos}" data-type="${type}">
                        <span class="position-label">${pos}</span>
                        ${driver ? `
                            <div class="driver-chip" draggable="true" data-driver-id="${driver.id}">
                                ${chipContent}
                            </div>
                        ` : `
                            <div class="driver-chip">
                                ${chipContent}
                            </div>
                        `}
                    </div>
                `;
            }
            html += `</div>`;
        });

        container.innerHTML = html;

        // Add drag and drop listeners (skip for official tabs)
        const isPositionOfficial = NASCARData.hasCompletedResultsForType(state.currentRaceId, type);
        if (!isPositionOfficial) {
            setupDragAndDrop(container, type);
        }
    }

    function setupDragAndDrop(container, type) {
        // Click on empty slots to show driver picker
        container.querySelectorAll('.position-slot.empty').forEach(slot => {
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                showDriverPicker(slot, type);
            });
        });

        // Draggable chips
        container.querySelectorAll('.driver-chip[draggable="true"]').forEach(chip => {
            chip.addEventListener('dragstart', (e) => {
                draggedDriver = parseInt(chip.dataset.driverId);
                draggedFromPosition = parseInt(chip.closest('.position-slot').dataset.position);
                draggedType = type;
                chip.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            chip.addEventListener('dragend', (e) => {
                chip.classList.remove('dragging');
                draggedDriver = null;
                draggedFromPosition = null;
                draggedType = null;
                // Remove all drag-over states
                container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            });

            // Touch events for mobile
            chip.addEventListener('touchstart', (e) => handleTouchStart(e, chip, type, container), { passive: false });
            chip.addEventListener('touchmove', (e) => handleTouchMove(e, container), { passive: false });
            chip.addEventListener('touchend', (e) => handleTouchEnd(e, type, container, false), { passive: false });
        });

        // Drop zones (position slots)
        container.querySelectorAll('.position-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', (e) => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');

                if (draggedDriver === null || draggedType !== type) return;

                const targetPosition = parseInt(slot.dataset.position);

                // Don't do anything if dropping on same position
                if (targetPosition === draggedFromPosition) return;

                const selections = state.modalSelections[type];

                // Shift drivers between source and target positions
                if (targetPosition < draggedFromPosition) {
                    // Moving up: shift drivers down from target to source-1
                    for (let pos = draggedFromPosition; pos > targetPosition; pos--) {
                        const driverAbove = selections[pos - 1];
                        if (driverAbove) {
                            selections[pos] = driverAbove;
                        } else {
                            delete selections[pos];
                        }
                    }
                } else {
                    // Moving down: shift drivers up from source+1 to target
                    for (let pos = draggedFromPosition; pos < targetPosition; pos++) {
                        const driverBelow = selections[pos + 1];
                        if (driverBelow) {
                            selections[pos] = driverBelow;
                        } else {
                            delete selections[pos];
                        }
                    }
                }

                // Place dragged driver in target position
                selections[targetPosition] = draggedDriver;

                // Re-render
                renderPositionList(type);
            });
        });
    }

    // ============================================
    // Touch Event Handlers for Mobile Drag & Drop
    // ============================================
    function handleTouchStart(e, chip, type, container) {
        // Don't start drag if touching empty slot
        if (chip.closest('.position-slot').classList.contains('empty')) return;

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchDragElement = chip;
        draggedDriver = parseInt(chip.dataset.driverId);
        draggedFromPosition = parseInt(chip.closest('.position-slot').dataset.position);
        draggedType = type;

        // Create clone for visual feedback
        touchDragClone = chip.cloneNode(true);
        touchDragClone.classList.add('touch-drag-clone');
        touchDragClone.style.position = 'fixed';
        touchDragClone.style.left = (touch.clientX - 50) + 'px';
        touchDragClone.style.top = (touch.clientY - 20) + 'px';
        touchDragClone.style.width = chip.offsetWidth + 'px';
        touchDragClone.style.zIndex = '9999';
        touchDragClone.style.pointerEvents = 'none';
        touchDragClone.style.opacity = '0.9';
        touchDragClone.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        touchDragClone.style.transform = 'scale(1.05)';
        document.body.appendChild(touchDragClone);

        chip.classList.add('dragging');

        // Prevent scrolling while dragging
        e.preventDefault();
    }

    function handleTouchMove(e, container) {
        if (!touchDragClone) return;

        const touch = e.touches[0];

        // Move the clone
        touchDragClone.style.left = (touch.clientX - 50) + 'px';
        touchDragClone.style.top = (touch.clientY - 20) + 'px';

        // Find slot under touch point
        const elementsUnder = document.elementsFromPoint(touch.clientX, touch.clientY);
        const slotUnder = elementsUnder.find(el => el.classList.contains('position-slot'));

        // Clear previous highlight
        if (touchCurrentSlot && touchCurrentSlot !== slotUnder) {
            touchCurrentSlot.classList.remove('drag-over');
        }

        // Highlight new slot
        if (slotUnder && slotUnder.dataset.type === draggedType) {
            slotUnder.classList.add('drag-over');
            touchCurrentSlot = slotUnder;
        }

        e.preventDefault();
    }

    function handleTouchEnd(e, type, container, isDuel) {
        if (!touchDragClone) return;

        // Remove clone
        touchDragClone.remove();
        touchDragClone = null;

        // Remove dragging state
        if (touchDragElement) {
            touchDragElement.classList.remove('dragging');
        }

        // Clear highlights
        container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        // Handle drop if over a valid slot
        if (touchCurrentSlot && draggedDriver !== null) {
            const targetPosition = parseInt(touchCurrentSlot.dataset.position);

            if (targetPosition !== draggedFromPosition) {
                const selections = state.modalSelections[type];

                // Shift drivers between source and target positions
                if (targetPosition < draggedFromPosition) {
                    for (let pos = draggedFromPosition; pos > targetPosition; pos--) {
                        const driverAbove = selections[pos - 1];
                        if (driverAbove) {
                            selections[pos] = driverAbove;
                        } else {
                            delete selections[pos];
                        }
                    }
                } else {
                    for (let pos = draggedFromPosition; pos < targetPosition; pos++) {
                        const driverBelow = selections[pos + 1];
                        if (driverBelow) {
                            selections[pos] = driverBelow;
                        } else {
                            delete selections[pos];
                        }
                    }
                }

                selections[targetPosition] = draggedDriver;

                // Re-render appropriate list
                if (isDuel) {
                    renderDuelList(type);
                } else {
                    renderPositionList(type);
                }
            }
        }

        // Reset state
        touchDragElement = null;
        touchCurrentSlot = null;
        draggedDriver = null;
        draggedFromPosition = null;
        draggedType = null;
    }

    // ============================================
    // Driver Picker (for empty slots)
    // ============================================
    function showDriverPicker(slot, type) {
        // Remove any existing picker
        closeDriverPicker();

        const position = parseInt(slot.dataset.position);
        const selections = state.modalSelections[type];

        // Get assigned driver IDs for this type
        const assignedIds = Object.values(selections);

        // Get available drivers (not yet assigned and available for this race)
        const availableDrivers = state.drivers.filter(d =>
            !assignedIds.includes(d.id) && NASCARData.isDriverAvailable(d, state.currentRaceId)
        );

        if (availableDrivers.length === 0) {
            showToast('All drivers are already assigned', 'info');
            return;
        }

        // Create picker dropdown
        const picker = document.createElement('div');
        picker.className = 'driver-picker';
        picker.innerHTML = `
            <div class="driver-picker-header">
                <span>Select Driver for P${position}</span>
                <button class="picker-close">&times;</button>
            </div>
            <div class="driver-picker-search">
                <input type="text" class="picker-search-input" placeholder="Search driver..." autocomplete="off">
            </div>
            <div class="driver-picker-list">
                ${availableDrivers.map(driver => {
                    const pickerIdentifier = driver.logo
                        ? `<img src="${driver.logo}" alt="${driver.name}" class="picker-logo" onerror="this.outerHTML='<span class=\\'picker-number\\'>#${driver.number}</span>'">`
                        : `<span class="picker-number">#${driver.number}</span>`;
                    const showChaseBadge = isChaseRace() && isDriverInChase(driver.id);
                    return `
                        <div class="picker-item" data-driver-id="${driver.id}" data-driver-name="${driver.name.toLowerCase()}" data-driver-number="${driver.number}">
                            ${pickerIdentifier}
                            <span class="picker-name">${driver.name}</span>
                            ${showChaseBadge ? '<span class="chase-badge">C</span>' : ''}
                        </div>
                    `;
                }).join('')}
                <div class="picker-no-results">No drivers found</div>
            </div>
        `;

        // Position the picker near the slot
        const slotRect = slot.getBoundingClientRect();
        const modal = slot.closest('.modal');
        const modalRect = modal.getBoundingClientRect();

        picker.style.position = 'absolute';
        picker.style.left = (slotRect.left - modalRect.left) + 'px';
        // Initially position below the slot
        picker.style.top = (slotRect.bottom - modalRect.top + 5) + 'px';

        modal.style.position = 'relative';
        modal.appendChild(picker);

        // Check if picker goes off bottom of screen or modal and flip if needed
        const pickerRect = picker.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const modalBottom = modalRect.bottom;
        const maxBottom = Math.min(viewportHeight, modalBottom) - 10; // 10px buffer

        if (pickerRect.bottom > maxBottom) {
            // Flip upwards
            picker.style.top = (slotRect.top - modalRect.top - pickerRect.height - 5) + 'px';
        }

        // Search functionality
        const searchInput = picker.querySelector('.picker-search-input');
        const noResultsEl = picker.querySelector('.picker-no-results');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleCount = 0;
            picker.querySelectorAll('.picker-item').forEach(item => {
                const driverName = item.dataset.driverName;
                const driverNumber = item.dataset.driverNumber;
                const nameParts = driverName.split(' ');
                const matches = searchTerm === '' ||
                    driverName.includes(searchTerm) ||
                    nameParts.some(part => part.startsWith(searchTerm)) ||
                    driverNumber.startsWith(searchTerm);
                item.style.display = matches ? '' : 'none';
                if (matches) visibleCount++;
            });
            noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
        });
        searchInput.focus();

        // Add click handlers
        picker.querySelector('.picker-close').addEventListener('click', closeDriverPicker);

        picker.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                const driverId = parseInt(item.dataset.driverId);
                state.modalSelections[type][position] = driverId;
                closeDriverPicker();
                renderPositionList(type);
            });
        });

        // Close picker when clicking outside
        setTimeout(() => {
            document.addEventListener('click', handlePickerOutsideClick);
        }, 0);
    }

    function closeDriverPicker() {
        const picker = document.querySelector('.driver-picker');
        if (picker) {
            picker.remove();
        }
        document.removeEventListener('click', handlePickerOutsideClick);
    }

    function handlePickerOutsideClick(e) {
        if (!e.target.closest('.driver-picker') && !e.target.closest('.position-slot.empty')) {
            closeDriverPicker();
        }
    }

    // ============================================
    // Fastest Lap Selector
    // ============================================
    function renderFastestLapSelector() {
        const selectedId = state.modalSelections.fastestLap;
        // Only show drivers available for this race
        const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, state.currentRaceId));

        elements.fastestLapSelector.innerHTML = availableDrivers.map(driver => {
            const driverIdentifier = driver.logo
                ? `<img src="${driver.logo}" alt="${driver.name}" class="driver-logo-option" onerror="this.outerHTML='<span class=\\'driver-num\\'>${driver.number}</span>'">`
                : `<span class="driver-num">${driver.number}</span>`;
            return `
                <div class="driver-option ${driver.id === selectedId ? 'selected' : ''}"
                     data-driver-id="${driver.id}">
                    ${driverIdentifier}
                    <span class="driver-name">${driver.name}</span>
                </div>
            `;
        }).join('');

        // Add click listeners (skip for official fastest lap)
        const isFastestLapOfficial = NASCARData.hasCompletedResultsForType(state.currentRaceId, 'fastestLap');
        if (!isFastestLapOfficial) {
            elements.fastestLapSelector.querySelectorAll('.driver-option').forEach(option => {
                option.addEventListener('click', () => {
                    const driverId = parseInt(option.dataset.driverId);

                    // Toggle selection
                    if (state.modalSelections.fastestLap === driverId) {
                        state.modalSelections.fastestLap = null;
                    } else {
                        state.modalSelections.fastestLap = driverId;
                    }

                    renderFastestLapSelector();
                });
            });
        }
    }

    // ============================================
    // Save & Clear Results
    // ============================================
    function saveRaceResults() {
        const raceId = state.currentRaceId;
        if (!raceId) return;

        // Convert modal selections to results format
        const raceResults = {};

        state.drivers.forEach(driver => {
            const result = {
                duel1: null,
                duel2: null,
                stage1: null,
                stage2: null,
                stage3: null,
                finish: null,
                fastestLap: false
            };

            // Find positions for this driver
            Object.keys(state.modalSelections.duel1).forEach(pos => {
                if (state.modalSelections.duel1[pos] === driver.id) {
                    result.duel1 = parseInt(pos);
                }
            });

            Object.keys(state.modalSelections.duel2).forEach(pos => {
                if (state.modalSelections.duel2[pos] === driver.id) {
                    result.duel2 = parseInt(pos);
                }
            });

            Object.keys(state.modalSelections.stage1).forEach(pos => {
                if (state.modalSelections.stage1[pos] === driver.id) {
                    result.stage1 = parseInt(pos);
                }
            });

            Object.keys(state.modalSelections.stage2).forEach(pos => {
                if (state.modalSelections.stage2[pos] === driver.id) {
                    result.stage2 = parseInt(pos);
                }
            });

            Object.keys(state.modalSelections.stage3).forEach(pos => {
                if (state.modalSelections.stage3[pos] === driver.id) {
                    result.stage3 = parseInt(pos);
                }
            });

            Object.keys(state.modalSelections.finish).forEach(pos => {
                if (state.modalSelections.finish[pos] === driver.id) {
                    result.finish = parseInt(pos);
                }
            });

            if (state.modalSelections.fastestLap === driver.id) {
                result.fastestLap = true;
            }

            // Only save if driver has at least one result
            if (result.duel1 || result.duel2 || result.stage1 || result.stage2 || result.stage3 || result.finish || result.fastestLap) {
                raceResults[driver.id] = result;
            }
        });

        // Preserve official data — don't allow user edits to overwrite official result types
        if (NASCARData.hasCompletedResults(raceId)) {
            const officialResults = NASCARData.getCompletedResults(raceId);
            for (const [driverId, officialResult] of Object.entries(officialResults)) {
                if (!raceResults[driverId]) {
                    raceResults[driverId] = { duel1: null, duel2: null, stage1: null, stage2: null, stage3: null, finish: null, fastestLap: false };
                }
                for (const [key, value] of Object.entries(officialResult)) {
                    if (key === 'fastestLap' && value === true) {
                        raceResults[driverId].fastestLap = true;
                    } else if (value !== null && value !== undefined) {
                        raceResults[driverId][key] = value;
                    }
                }
            }
        }

        // Save results
        state.results[raceId] = raceResults;
        saveResults();

        // Update snapshot so close warning knows results are saved
        state._savedModalSnapshot = JSON.stringify(state.modalSelections);

        // Update UI
        calculateStandings();
        renderStandings();
        renderRacesList();
        updateRaceCount();

        showToast('Race results saved!', 'success');
    }

    function clearRaceResults() {
        // Open clear options modal
        const tabNames = {
            duel1: 'Duel 1',
            duel2: 'Duel 2',
            stage1: 'Stage 1',
            stage2: 'Stage 2',
            stage3: 'Stage 3',
            finish: 'Final Finish',
            fastest: 'Fastest Lap'
        };
        const currentTabName = tabNames[state.currentTab] || 'Current Event';
        elements.clearCurrentEventDesc.textContent = `Clear ${currentTabName} only`;
        elements.clearModal.classList.add('active');
    }

    function closeClearModal() {
        elements.clearModal.classList.remove('active');
    }

    function openDownloadModal(type) {
        state._downloadType = type;
        elements.downloadOptionsTitle.textContent = type === 'race' ? 'Download Race Results' : 'Download Standings';
        elements.downloadOptionsModal.classList.add('active');
    }

    function closeDownloadModal() {
        elements.downloadOptionsModal.classList.remove('active');
    }

    function clearCurrentEventOnly() {
        closeClearModal();
        const tab = state.currentTab;
        const officialType = tab === 'fastest' ? 'fastestLap' : tab;

        if (NASCARData.hasCompletedResultsForType(state.currentRaceId, officialType)) {
            showToast('Cannot clear official results', 'warning');
            return;
        }

        if (tab === 'duel1' || tab === 'duel2') {
            state.modalSelections[tab] = {};
            renderDuelList(tab);
        } else if (tab === 'fastest') {
            state.modalSelections.fastestLap = null;
            renderFastestLapSelector();
        } else {
            state.modalSelections[tab] = {};
            renderPositionList(tab);
        }

        showToast('Event cleared', 'info');
    }

    function clearFullRaceResults() {
        closeClearModal();

        const raceId = state.currentRaceId;
        const race = state.races.find(r => r.id === raceId);
        const numStages = race ? (race.stages || 2) : 2;
        const hasDuels = race ? (race.duels || false) : false;

        // Only clear non-official types
        const types = ['duel1', 'duel2', 'stage1', 'stage2', 'stage3', 'finish'];
        types.forEach(type => {
            const officialType = type;
            if (!NASCARData.hasCompletedResultsForType(raceId, officialType)) {
                state.modalSelections[type] = {};
            }
        });
        if (!NASCARData.hasCompletedResultsForType(raceId, 'fastestLap')) {
            state.modalSelections.fastestLap = null;
        }

        if (hasDuels) {
            renderDuelList('duel1');
            renderDuelList('duel2');
        }
        renderPositionList('stage1');
        renderPositionList('stage2');
        if (numStages >= 3) {
            renderPositionList('stage3');
        }
        renderPositionList('finish');
        renderFastestLapSelector();

        showToast('Race results cleared (official results preserved)', 'info');
    }

    // ============================================
    // Simulation
    // ============================================
    function simulateCurrentRace() {
        // Open the simulate race modal
        const tabNames = {
            duel1: 'Duel 1',
            duel2: 'Duel 2',
            stage1: 'Stage 1',
            stage2: 'Stage 2',
            stage3: 'Stage 3',
            finish: 'Finish',
            fastest: 'Fastest Lap'
        };
        const currentTabName = tabNames[state.currentTab] || state.currentTab;
        elements.simCurrentEventDesc.textContent = `Simulate ${currentTabName} only`;
        elements.simulateRaceModal.classList.add('active');
    }

    function closeSimulateRaceModal() {
        elements.simulateRaceModal.classList.remove('active');
    }

    function simulateCurrentEvent() {
        closeSimulateRaceModal();
        const race = state.races.find(r => r.id === state.currentRaceId);
        const numStages = race ? (race.stages || 2) : 2;
        const hasDuels = race ? (race.duels || false) : false;
        const tab = state.currentTab;

        const eventNames = {
            duel1: 'Duel 1',
            duel2: 'Duel 2',
            stage1: 'Stage 1',
            stage2: 'Stage 2',
            stage3: 'Stage 3',
            finish: 'Final Finish',
            fastest: 'Fastest Lap'
        };

        // Check if this tab has official data
        const tabTypeForCheck = tab === 'fastest' ? 'fastestLap' : tab;
        if (NASCARData.hasCompletedResultsForType(state.currentRaceId, tabTypeForCheck)) {
            showToast('This event has official results', 'info');
            console.log(`Skipping simulation - ${eventNames[tab]} has official results`);
            return;
        }

        console.group(`🎯 Simulating Single Event: ${eventNames[tab]}`);

        const currentRaceId = state.currentRaceId;

        // Get race-specific variance values
        const stageVariance = NASCARData.getStageVariance(currentRaceId);
        const finishVariance = NASCARData.getFinishVariance(currentRaceId);

        if (tab === 'duel1' && hasDuels) {
            const duel1Drivers = state.duelAssignments.duel1
                .map(id => state.drivers.find(d => d.id === id))
                .filter(Boolean);
            // Preserve manually placed drivers, fill empty positions
            state.modalSelections.duel1 = fillEmptyPositions(
                state.modalSelections.duel1 || {},
                duel1Drivers,
                stageVariance,
                'Duel 1',
                currentRaceId
            );
            renderDuelList('duel1');
        } else if (tab === 'duel2' && hasDuels) {
            const duel2Drivers = state.duelAssignments.duel2
                .map(id => state.drivers.find(d => d.id === id))
                .filter(Boolean);
            // Preserve manually placed drivers, fill empty positions
            state.modalSelections.duel2 = fillEmptyPositions(
                state.modalSelections.duel2 || {},
                duel2Drivers,
                stageVariance,
                'Duel 2',
                currentRaceId
            );
            renderDuelList('duel2');
        } else if (tab === 'stage1' || tab === 'stage2' || tab === 'stage3' || tab === 'finish') {
            const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, currentRaceId));
            // Use race-specific variance (stages use stageVariance, finish uses finishVariance)
            const variance = (tab === 'finish') ? finishVariance : stageVariance;
            // Preserve manually placed drivers, fill empty positions
            state.modalSelections[tab] = fillEmptyPositions(
                state.modalSelections[tab] || {},
                availableDrivers,
                variance,
                eventNames[tab],
                currentRaceId
            );
            renderPositionList(tab);
        } else if (tab === 'fastest') {
            // Only simulate fastest lap if not already set
            if (!state.modalSelections.fastestLap) {
                const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, currentRaceId));
                const selectedDriver = weightedRandomPick(availableDrivers, currentRaceId);
                state.modalSelections.fastestLap = selectedDriver ? selectedDriver.id : null;
            } else {
                console.log('Fastest Lap: Keeping manually selected driver');
            }
            renderFastestLapSelector();
        }

        console.groupEnd();
        showToast('Event simulated!', 'success');
    }

    function simulateFullRaceEvent() {
        closeSimulateRaceModal();
        const race = state.races.find(r => r.id === state.currentRaceId);
        const numStages = race ? (race.stages || 2) : 2;
        const hasDuels = race ? (race.duels || false) : false;

        // Get available drivers for this race
        const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, state.currentRaceId));

        console.group(`🏎️ Simulating Full Race (Modal): ${race ? race.name : 'Unknown'}`);
        console.log(`Track: ${race?.track} | Stages: ${numStages} | Duels: ${hasDuels}`);
        console.log('Preserving manually placed drivers...');

        const currentRaceId = state.currentRaceId;
        // Get race-specific variance values
        const stageVariance = NASCARData.getStageVariance(currentRaceId);
        const finishVariance = NASCARData.getFinishVariance(currentRaceId);

        // Simulate duels if applicable (preserve manual placements, skip official)
        if (hasDuels) {
            if (!NASCARData.hasCompletedResultsForType(currentRaceId, 'duel1')) {
                const duel1Drivers = state.duelAssignments.duel1
                    .map(id => state.drivers.find(d => d.id === id))
                    .filter(Boolean);
                state.modalSelections.duel1 = fillEmptyPositions(
                    state.modalSelections.duel1 || {},
                    duel1Drivers,
                    stageVariance,
                    'Duel 1',
                    currentRaceId
                );
            }
            if (!NASCARData.hasCompletedResultsForType(currentRaceId, 'duel2')) {
                const duel2Drivers = state.duelAssignments.duel2
                    .map(id => state.drivers.find(d => d.id === id))
                    .filter(Boolean);
                state.modalSelections.duel2 = fillEmptyPositions(
                    state.modalSelections.duel2 || {},
                    duel2Drivers,
                    stageVariance,
                    'Duel 2',
                    currentRaceId
                );
            }

            renderDuelList('duel1');
            renderDuelList('duel2');
        }

        // Simulate stages (preserve manual placements, skip official)
        if (!NASCARData.hasCompletedResultsForType(currentRaceId, 'stage1')) {
            state.modalSelections.stage1 = fillEmptyPositions(
                state.modalSelections.stage1 || {},
                availableDrivers,
                stageVariance,
                'Stage 1',
                currentRaceId
            );
        }

        if (!NASCARData.hasCompletedResultsForType(currentRaceId, 'stage2')) {
            state.modalSelections.stage2 = fillEmptyPositions(
                state.modalSelections.stage2 || {},
                availableDrivers,
                stageVariance,
                'Stage 2',
                currentRaceId
            );
        }

        // Simulate stage 3 (if applicable, skip official)
        if (numStages >= 3 && !NASCARData.hasCompletedResultsForType(currentRaceId, 'stage3')) {
            state.modalSelections.stage3 = fillEmptyPositions(
                state.modalSelections.stage3 || {},
                availableDrivers,
                stageVariance,
                'Stage 3',
                currentRaceId
            );
        }

        // Simulate finish (preserve manual placements, skip official)
        if (!NASCARData.hasCompletedResultsForType(currentRaceId, 'finish')) {
            state.modalSelections.finish = fillEmptyPositions(
                state.modalSelections.finish || {},
                availableDrivers,
                finishVariance,
                'Final Finish',
                currentRaceId
            );
        }

        // Weighted fastest lap (only if not already set and not official)
        if (!NASCARData.hasCompletedResultsForType(currentRaceId, 'fastestLap')) {
            if (!state.modalSelections.fastestLap) {
                const fastestLapDriver = weightedRandomPick(availableDrivers, currentRaceId);
                state.modalSelections.fastestLap = fastestLapDriver ? fastestLapDriver.id : null;
            } else {
                console.log('Fastest Lap: Keeping manually selected driver');
            }
        }

        console.groupEnd();

        // Re-render all tabs
        renderPositionList('stage1');
        renderPositionList('stage2');
        if (numStages >= 3) {
            renderPositionList('stage3');
        }
        renderPositionList('finish');
        renderFastestLapSelector();

        // Switch to Finish tab after full race simulation
        switchTab('finish');

        showToast('Race simulated!', 'success');
    }

    // ============================================
    // Simulate Modal Functions
    // ============================================
    function openSimulateModal() {
        // Populate the race dropdown
        const select = elements.simToRaceSelect;
        select.innerHTML = '<option value="">Select a race...</option>';

        state.races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.id;
            option.textContent = `${race.id}. ${race.name}`;
            select.appendChild(option);
        });

        elements.simulateModal.classList.add('active');
    }

    function closeSimulateModal() {
        elements.simulateModal.classList.remove('active');
    }

    function simulateNextRace() {
        closeSimulateModal();

        // Find the next incomplete race
        const nextRace = state.races.find(race =>
            !state.results[race.id] || !isRaceComplete(race.id)
        );

        if (!nextRace) {
            showToast('All races already completed!', 'info');
            return;
        }

        showLoading(true);
        setTimeout(() => {
            simulateRace(nextRace.id);

            calculateStandings();
            renderStandings();
            renderRacesList();
            updateRaceCount();

            showLoading(false);
            showToast(`${nextRace.name} simulated!`, 'success');
        }, 100);
    }

    function simulateToRace() {
        const targetRaceId = parseInt(elements.simToRaceSelect.value);

        if (!targetRaceId) {
            showToast('Please select a race', 'error');
            return;
        }

        closeSimulateModal();

        // Get all incomplete races BEFORE the target race (not including it)
        const racesToSimulate = state.races.filter(race =>
            race.id < targetRaceId && (!state.results[race.id] || !isRaceComplete(race.id))
        );

        if (racesToSimulate.length === 0) {
            showToast(`All races before Race ${targetRaceId} already completed!`, 'info');
            return;
        }

        const targetRace = state.races.find(r => r.id === targetRaceId);
        const targetRaceName = targetRace ? targetRace.name : `Race ${targetRaceId}`;

        showLoading(true);
        setTimeout(() => {
            racesToSimulate.forEach(race => {
                simulateRace(race.id);
            });

            calculateStandings();
            renderStandings();
            renderRacesList();
            updateRaceCount();

            showLoading(false);
            showToast(`${racesToSimulate.length} race${racesToSimulate.length > 1 ? 's' : ''} simulated before ${targetRaceName}!`, 'success');

            // Reset the dropdown
            elements.simToRaceSelect.value = '';
        }, 100);
    }

    function simulateRegularSeason() {
        closeSimulateModal();

        const regularRaces = state.races.filter(r => r.season === 'regular' || !r.season);
        const incompleteRaces = regularRaces.filter(race =>
            !state.results[race.id] || !isRaceComplete(race.id)
        );

        if (incompleteRaces.length === 0) {
            showToast('Regular season already complete!', 'info');
            return;
        }

        showLoading(true);
        setTimeout(() => {
            incompleteRaces.forEach(race => {
                simulateRace(race.id);
            });

            calculateStandings();
            renderStandings();
            renderRacesList();
            updateRaceCount();

            showLoading(false);
            showToast(`${incompleteRaces.length} regular season races simulated!`, 'success');
        }, 100);
    }

    function simulateFullSeason() {
        closeSimulateModal();

        const incompleteRaces = state.races.filter(race =>
            !state.results[race.id] || !isRaceComplete(race.id)
        );

        if (incompleteRaces.length === 0) {
            showToast('All races already completed!', 'info');
            return;
        }

        showLoading(true);
        setTimeout(() => {
            incompleteRaces.forEach(race => {
                simulateRace(race.id);
            });

            calculateStandings();
            renderStandings();
            renderRacesList();
            updateRaceCount();

            showLoading(false);
            showToast(`${incompleteRaces.length} races simulated!`, 'success');
        }, 100);
    }

    /**
     * Weighted shuffle - sorts drivers by rating + random variance
     * Higher rated drivers are more likely to finish higher, but upsets can happen
     * @param {Array} drivers - Array of driver objects with rating property
     * @param {number} variance - Amount of randomness (higher = more upsets)
     * @param {string} eventName - Name of the event for logging
     * @returns {Array} - Drivers sorted by simulated performance (best first)
     */
    function weightedShuffle(drivers, variance = 40, eventName = 'Event', raceId = null) {
        // Guard against empty or invalid array
        if (!drivers || drivers.length === 0) {
            console.warn(`weightedShuffle called with empty drivers array for ${eventName}`);
            return [];
        }

        // Ensure variance is a valid positive number
        if (typeof variance !== 'number' || isNaN(variance) || variance < 0) {
            console.warn(`Invalid variance ${variance} for ${eventName}, using default`);
            variance = NASCARData.varianceConfig.defaultStage;
        }

        // Calculate a performance score for each driver: rating + random variance
        // This creates overlap where lower-rated drivers can occasionally beat higher-rated ones
        const scored = drivers.map(driver => {
            const rating = NASCARData.getDriverRating(driver, raceId);
            const randomBonus = Math.random() * variance;
            const score = rating + randomBonus;
            return {
                driver,
                rating,
                randomBonus,
                score
            };
        });

        // Sort by score descending (highest score = best position)
        scored.sort((a, b) => b.score - a.score);

        // Log results
        console.group(`🏁 ${eventName} - Weighted Simulation (Race ${raceId})`);
        console.log(`Variance: ${variance} | Drivers: ${drivers.length}`);
        console.table(scored.slice(0, 10).map((s, idx) => ({
            Position: idx + 1,
            Driver: s.driver.name,
            'Car #': s.driver.number,
            Rating: s.rating.toFixed(1),
            'Random Bonus': s.randomBonus.toFixed(2),
            'Final Score': s.score.toFixed(2)
        })));
        if (drivers.length > 10) {
            console.log(`... and ${drivers.length - 10} more drivers`);
        }
        console.groupEnd();

        return scored.map(s => s.driver);
    }

    /**
     * Weighted random selection - picks a driver with probability proportional to rating
     * Used for fastest lap selection
     * @param {Array} drivers - Array of driver objects
     * @param {number} raceId - Race ID for race-specific ratings
     * @returns {Object|null} - Selected driver or null if no drivers
     */
    function weightedRandomPick(drivers, raceId = null) {
        // Guard against empty or invalid array
        if (!drivers || drivers.length === 0) {
            console.warn('weightedRandomPick called with empty drivers array');
            return null;
        }

        // Use rating as weight (shifted so 50 becomes baseline)
        const weights = drivers.map(d => Math.max(1, NASCARData.getDriverRating(d, raceId) - 40));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);

        // Guard against zero total weight (shouldn't happen with Math.max(1, ...) but be safe)
        if (totalWeight === 0) {
            console.warn('weightedRandomPick: totalWeight is 0, returning first driver');
            return drivers[0];
        }

        const randomValue = Math.random() * totalWeight;
        let remaining = randomValue;

        for (let i = 0; i < drivers.length; i++) {
            remaining -= weights[i];
            if (remaining <= 0) {
                const selected = drivers[i];
                const rating = NASCARData.getDriverRating(selected, raceId);
                console.log(`⚡ Fastest Lap: ${selected.name} (#${selected.number}) | Rating: ${rating.toFixed(1)} | Weight: ${weights[i].toFixed(1)}/${totalWeight.toFixed(0)} (${(weights[i]/totalWeight*100).toFixed(1)}% chance)`);
                return selected;
            }
        }
        return drivers[drivers.length - 1];
    }

    /**
     * Fill empty positions with simulated results, preserving manually placed drivers
     * @param {Object} currentSelections - Current selections object (e.g., state.modalSelections.stage1)
     * @param {Array} allDrivers - All available drivers for this event
     * @param {number} variance - Variance for weighted shuffle
     * @param {string} eventName - Name for logging
     * @param {number} raceId - Race ID for ratings
     * @returns {Object} - Updated selections with empty positions filled
     */
    function fillEmptyPositions(currentSelections, allDrivers, variance, eventName, raceId) {
        const totalPositions = allDrivers.length;

        // Get already placed driver IDs and filled positions
        const placedDriverIds = new Set(Object.values(currentSelections).filter(id => id !== null && id !== undefined));
        const filledPositions = new Set(Object.keys(currentSelections).map(p => parseInt(p)));

        // Find drivers not yet placed
        const unplacedDrivers = allDrivers.filter(d => !placedDriverIds.has(d.id));

        // Find empty positions
        const emptyPositions = [];
        for (let pos = 1; pos <= totalPositions; pos++) {
            if (!filledPositions.has(pos)) {
                emptyPositions.push(pos);
            }
        }

        // If nothing to fill, return current selections
        if (emptyPositions.length === 0 || unplacedDrivers.length === 0) {
            console.log(`${eventName}: No empty positions to fill (${placedDriverIds.size} drivers already placed)`);
            return { ...currentSelections };
        }

        console.log(`${eventName}: Preserving ${placedDriverIds.size} manually placed drivers, simulating ${emptyPositions.length} positions`);

        // Simulate order for unplaced drivers
        const simulatedOrder = weightedShuffle(unplacedDrivers, variance, eventName, raceId);

        // Create new selections preserving existing and filling empty
        const newSelections = { ...currentSelections };
        emptyPositions.sort((a, b) => a - b).forEach((pos, index) => {
            if (index < simulatedOrder.length) {
                newSelections[pos] = simulatedOrder[index].id;
            }
        });

        return newSelections;
    }

    function simulateRace(raceId) {
        const race = state.races.find(r => r.id === raceId);
        if (!race || !state.drivers || state.drivers.length === 0) {
            return;
        }

        // Skip fully official races, but allow partial official
        const hasPartialOfficial = NASCARData.hasCompletedResults(raceId);
        const allOfficial = NASCARData.hasAllCompletedResults(raceId);
        if (allOfficial) return;

        const numStages = race.stages || 2;
        const hasDuels = race.duels || false;

        // Only include drivers available for this race
        const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, raceId));
        const raceResults = {};

        // Initialize results for all drivers
        availableDrivers.forEach(driver => {
            raceResults[driver.id] = {
                duel1: null,
                duel2: null,
                stage1: null,
                stage2: null,
                stage3: null,
                finish: null,
                fastestLap: false
            };
        });

        // Merge in official data if partially official
        if (hasPartialOfficial) {
            const officialResults = NASCARData.getCompletedResults(raceId);
            for (const [driverId, officialResult] of Object.entries(officialResults)) {
                if (raceResults[driverId]) {
                    Object.assign(raceResults[driverId], officialResult);
                }
            }
        }

        console.group(`🏎️ Simulating Race ${raceId}: ${race.name}`);
        console.log(`Track: ${race.track} | Stages: ${numStages} | Duels: ${hasDuels}`);
        if (hasPartialOfficial) console.log('Partial official results detected - only simulating non-official types');

        // Get race-specific variance values
        const stageVariance = NASCARData.getStageVariance(raceId);
        const finishVariance = NASCARData.getFinishVariance(raceId);
        console.log(`Variance - Stage: ${stageVariance} | Finish: ${finishVariance}`);

        // Simulate duels if applicable (using weighted shuffle)
        if (hasDuels) {
            const duel1Official = NASCARData.hasCompletedResultsForType(raceId, 'duel1');
            const duel2Official = NASCARData.hasCompletedResultsForType(raceId, 'duel2');

            if (!duel1Official || !duel2Official) {
                // Use duelNumber from sheet data if available
                const hasSheetDuels = availableDrivers.some(d => d.duelNumber === 1 || d.duelNumber === 2);
                var duel1Pool, duel2Pool;
                if (hasSheetDuels) {
                    duel1Pool = availableDrivers.filter(d => d.duelNumber === 1);
                    duel2Pool = availableDrivers.filter(d => d.duelNumber === 2);
                    // Unassigned drivers go to smaller group
                    availableDrivers.filter(d => d.duelNumber !== 1 && d.duelNumber !== 2).forEach(d => {
                        if (duel1Pool.length <= duel2Pool.length) duel1Pool.push(d);
                        else duel2Pool.push(d);
                    });
                } else {
                    const halfCount = Math.ceil(availableDrivers.length / 2);
                    duel1Pool = availableDrivers.slice(0, halfCount);
                    duel2Pool = availableDrivers.slice(halfCount);
                }

                if (!duel1Official) {
                    const duel1Drivers = weightedShuffle(duel1Pool, stageVariance, 'Duel 1', raceId);
                    duel1Drivers.forEach((driver, index) => {
                        raceResults[driver.id].duel1 = index + 1;
                    });
                }
                if (!duel2Official) {
                    const duel2Drivers = weightedShuffle(duel2Pool, stageVariance, 'Duel 2', raceId);
                    duel2Drivers.forEach((driver, index) => {
                        raceResults[driver.id].duel2 = index + 1;
                    });
                }
            }
        }

        // Generate results for stages and finish using weighted shuffle
        const stages = ['stage1', 'stage2'];
        if (numStages >= 3) stages.push('stage3');
        stages.push('finish');

        const stageNames = {
            stage1: 'Stage 1',
            stage2: 'Stage 2',
            stage3: 'Stage 3',
            finish: 'Final Finish'
        };

        stages.forEach(type => {
            // Skip types with official data
            if (NASCARData.hasCompletedResultsForType(raceId, type)) return;
            const variance = (type === 'finish') ? finishVariance : stageVariance;
            const sortedDrivers = weightedShuffle(availableDrivers, variance, stageNames[type], raceId);
            sortedDrivers.forEach((driver, index) => {
                raceResults[driver.id][type] = index + 1;
            });
        });

        // Weighted fastest lap - only if not official
        if (!NASCARData.hasCompletedResultsForType(raceId, 'fastestLap')) {
            const fastestLapDriver = weightedRandomPick(availableDrivers, raceId);
            if (fastestLapDriver) {
                raceResults[fastestLapDriver.id].fastestLap = true;
            }
        }

        console.groupEnd();

        state.results[raceId] = raceResults;
    }

    function resetSeason() {
        if (!confirm('Are you sure you want to reset the season? Simulated results will be cleared, but official results from the spreadsheet will be preserved.')) {
            return;
        }

        // Preserve results for races with official data from spreadsheet
        const preservedResults = {};
        Object.keys(state.results).forEach(raceId => {
            if (NASCARData.hasCompletedResults(parseInt(raceId))) {
                preservedResults[raceId] = state.results[raceId];
            }
        });

        state.results = preservedResults;
        saveResults();

        const preservedCount = Object.keys(preservedResults).length;
        console.log(`Season reset: Preserved ${preservedCount} official race results`);

        calculateStandings();
        renderStandings();
        renderRacesList();
        updateRaceCount();

        showToast(preservedCount > 0
            ? `Season reset! ${preservedCount} official result(s) preserved.`
            : 'Season reset!', 'info');
    }

    // ============================================
    // Download / Canvas Generation Functions
    // ============================================
    async function downloadRaceResults(limit) {
        const raceId = state.currentRaceId;
        if (!raceId) return;

        const race = state.races.find(r => r.id === raceId);
        const raceResults = state.results[raceId];

        if (!race || !raceResults) {
            showToast('No results to download', 'error');
            return;
        }

        // Get finish positions sorted
        const finishResults = [];
        Object.keys(raceResults).forEach(driverId => {
            const result = raceResults[driverId];
            if (result.finish) {
                const driver = state.drivers.find(d => d.id === parseInt(driverId));
                if (driver) {
                    finishResults.push({
                        position: result.finish,
                        driver: driver,
                        stage1: result.stage1,
                        stage2: result.stage2,
                        fastestLap: result.fastestLap
                    });
                }
            }
        });

        finishResults.sort((a, b) => a.position - b.position);

        const displayResults = limit ? finishResults.slice(0, limit) : finishResults;

        // Generate canvas
        const canvas = await generateRaceCanvas(race, displayResults);

        // Download
        const suffix = limit ? `_Top${limit}_Results.png` : '_Results.png';
        downloadCanvas(canvas, `${race.name.replace(/[^a-z0-9]/gi, '_')}${suffix}`);
        showToast('Race results downloaded!', 'success');
    }

    async function downloadStandings(limit) {
        const isChaseView = state.currentStandingsView === 'chase' && state.regularSeasonComplete;
        let standings = isChaseView ? state.chaseStandings : state.regularSeasonStandings;
        const title = isChaseView ? 'Chase Standings' : 'Regular Season Standings';

        if (!standings || standings.length === 0) {
            showToast('No standings to download', 'error');
            return;
        }

        // For chase view, only include drivers who qualified for the Chase
        if (isChaseView) {
            standings = standings.filter(driver => driver.inChase);
        }

        const displayStandings = limit ? standings.slice(0, limit) : standings;

        // Generate canvas
        const canvas = await generateStandingsCanvas(displayStandings, title, isChaseView);

        // Download
        const prefix = isChaseView ? 'Chase' : 'Regular_Season';
        const suffix = limit ? `_Top${limit}` : '';
        const filename = `${prefix}_Standings${suffix}.png`;
        downloadCanvas(canvas, filename);
        showToast('Standings downloaded!', 'success');
    }

    function loadImage(url) {
        return new Promise((resolve) => {
            if (!url) { resolve(null); return; }
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }

    async function generateRaceCanvas(race, results) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const dpr = 2; // High resolution
        const width = 800;
        const rowHeight = 36;
        const headerHeight = 90;
        const footerHeight = 40;
        const height = headerHeight + (results.length * rowHeight) + footerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Preload driver logos and PFSN logo
        const logoMap = new Map();
        const pfsnLogoPromise = loadImage(`${STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png?w=40&h=40`);
        const logoPromises = results.map(async (result) => {
            const img = await loadImage(result.driver.logo);
            if (img) logoMap.set(result.driver.id, img);
        });
        const [pfsnLogo] = await Promise.all([pfsnLogoPromise, ...logoPromises]);

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Header background
        ctx.fillStyle = '#0050A0';
        ctx.fillRect(0, 0, width, 65);

        // PFSN logo on the left
        if (pfsnLogo) {
            ctx.drawImage(pfsnLogo, 15, 12, 40, 40);
        }

        // Title right-aligned
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Roboto, sans-serif';
        ctx.fillText(race.name, width - 20, 30);

        ctx.font = '16px Roboto, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText(race.track, width - 20, 52);
        ctx.textAlign = 'left';

        // Column headers
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 65, width, 28);

        ctx.fillStyle = '#666666';
        ctx.font = 'bold 12px Roboto, sans-serif';
        ctx.fillText('POS', 20, 83);
        ctx.fillText('DRIVER', 70, 83);
        ctx.fillText('S1', 530, 83);
        ctx.fillText('S2', 590, 83);
        ctx.fillText('FL', 650, 83);
        ctx.fillText('PTS', 720, 83);

        // Results rows
        let yPos = headerHeight + 5;
        results.forEach((result, index) => {
            // Alternate row background
            if (index % 2 === 0) {
                ctx.fillStyle = '#fafafa';
                ctx.fillRect(0, yPos - 5, width, rowHeight);
            }

            // Top 3 highlight
            if (result.position <= 3) {
                ctx.fillStyle = 'rgba(255, 209, 102, 0.2)';
                ctx.fillRect(0, yPos - 5, width, rowHeight);
            }

            // Position
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 16px Roboto, sans-serif';
            ctx.fillText(result.position.toString(), 20, yPos + 18);

            // Driver logo or number fallback
            const logoImg = logoMap.get(result.driver.id);
            if (logoImg) {
                ctx.drawImage(logoImg, 60, yPos - 1, 24, 24);
            } else {
                ctx.fillStyle = '#0050A0';
                ctx.font = 'bold 14px Roboto, sans-serif';
                ctx.fillText('#' + result.driver.number, 60, yPos + 18);
            }

            // Driver name
            ctx.fillStyle = '#333333';
            ctx.font = '14px Roboto, sans-serif';
            ctx.fillText(result.driver.name, 95, yPos + 18);

            // Stage positions
            ctx.fillStyle = '#666666';
            ctx.font = '14px Roboto, sans-serif';
            ctx.fillText(result.stage1 ? result.stage1.toString() : '-', 530, yPos + 18);
            ctx.fillText(result.stage2 ? result.stage2.toString() : '-', 590, yPos + 18);

            // Fastest lap indicator
            if (result.fastestLap) {
                ctx.fillStyle = '#9c27b0';
                ctx.font = 'bold 14px Roboto, sans-serif';
                ctx.fillText('⚡', 650, yPos + 18);
            } else {
                ctx.fillStyle = '#cccccc';
                ctx.font = '14px Roboto, sans-serif';
                ctx.fillText('-', 655, yPos + 18);
            }

            // Points (adjust for ineligible drivers)
            const rawResult = {
                stage1: result.stage1,
                stage2: result.stage2,
                finish: result.position,
                fastestLap: result.fastestLap
            };
            const canvasRaceResults = state.results[race.id] || {};
            const adjustedCanvasResult = adjustResultForPoints(rawResult, result.driver.id, canvasRaceResults, getIneligibleDriverIds());
            let points = NASCARData.calculateRacePoints(adjustedCanvasResult);
            const canvasPenalty = NASCARData.penalties.find(p => p.driverId === result.driver.id && p.raceId === race.id);
            if (canvasPenalty) points += canvasPenalty.points;
            ctx.fillStyle = canvasPenalty ? '#d32f2f' : '#0050A0';
            ctx.font = 'bold 14px Roboto, sans-serif';
            ctx.fillText(canvasPenalty ? `${points} (${canvasPenalty.points})` : points.toString(), 720, yPos + 18);

            yPos += rowHeight;
        });

        // Footer
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, height - footerHeight, width, footerHeight);

        ctx.fillStyle = '#999999';
        ctx.font = '12px Roboto, sans-serif';
        const footerText = downloadImageURL;
        const footerWidth = ctx.measureText(footerText).width;
        ctx.fillText(footerText, (width - footerWidth) / 2, height - 15);

        return canvas;
    }

    async function generateStandingsCanvas(standings, title, isChaseView) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const dpr = 2; // High resolution
        const width = 800;
        const rowHeight = 36;
        const headerHeight = 80;
        const footerHeight = 40;
        const height = headerHeight + (standings.length * rowHeight) + footerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Preload driver logos and PFSN logo
        const logoMap = new Map();
        const pfsnLogoPromise = loadImage(`${STATIC_URL}/skm/assets/pfn/pfsn-logo-white-ver-2.png?w=40&h=40`);
        const logoPromises = standings.map(async (driver) => {
            const img = await loadImage(driver.logo);
            if (img) logoMap.set(driver.id, img);
        });
        const [pfsnLogo] = await Promise.all([pfsnLogoPromise, ...logoPromises]);

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Header background
        ctx.fillStyle = '#0050A0';
        ctx.fillRect(0, 0, width, 55);

        // PFSN logo on the left
        if (pfsnLogo) {
            ctx.drawImage(pfsnLogo, 15, 8, 40, 40);
        }

        // Title right-aligned
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Roboto, sans-serif';
        ctx.fillText(title, width - 20, 37);
        ctx.textAlign = 'left';

        // Column headers
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 55, width, 28);

        ctx.fillStyle = '#666666';
        ctx.font = 'bold 12px Roboto, sans-serif';
        ctx.fillText('POS', 20, 73);
        ctx.fillText('DRIVER', 75, 73);
        ctx.fillText('PTS', 430, 73);
        ctx.fillText('BEHIND', 510, 73);
        ctx.fillText('WINS', 600, 73);
        ctx.fillText('TOP 5', 670, 73);
        ctx.fillText('TOP 10', 740, 73);

        // Standings rows
        const leaderPoints = isChaseView ? standings[0].chaseTotal : standings[0].regularSeasonPoints;
        let yPos = headerHeight + 5;

        standings.forEach((driver, index) => {
            const displayPoints = isChaseView ? driver.chaseTotal : driver.regularSeasonPoints;
            const behind = index === 0 ? '-' : (leaderPoints - displayPoints).toString();

            // Alternate row background
            if (index % 2 === 0) {
                ctx.fillStyle = '#fafafa';
                ctx.fillRect(0, yPos - 5, width, rowHeight);
            }

            // Chase view: highlight only the leader (champion)
            if (isChaseView && index === 0) {
                ctx.fillStyle = 'rgba(255, 209, 102, 0.3)';
                ctx.fillRect(0, yPos - 5, width, rowHeight);
            }

            // Regular season: Chase qualifier highlight (top 16)
            if (!isChaseView && driver.inChase) {
                ctx.fillStyle = 'rgba(40, 167, 69, 0.1)';
                ctx.fillRect(0, yPos - 5, width, rowHeight);
            }

            // Position
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 14px Roboto, sans-serif';
            ctx.fillText((index + 1).toString(), 20, yPos + 18);

            // Driver logo or number fallback
            const logoImg = logoMap.get(driver.id);
            if (logoImg) {
                ctx.drawImage(logoImg, 60, yPos - 1, 24, 24);
            } else {
                ctx.fillStyle = '#0050A0';
                ctx.font = 'bold 14px Roboto, sans-serif';
                ctx.fillText('#' + driver.number, 60, yPos + 18);
            }

            // Driver name
            ctx.fillStyle = '#333333';
            ctx.font = '14px Roboto, sans-serif';
            ctx.fillText(driver.name, 95, yPos + 18);

            // Points
            ctx.fillStyle = '#0050A0';
            ctx.font = 'bold 14px Roboto, sans-serif';
            ctx.fillText(displayPoints.toString(), 430, yPos + 18);

            // Behind
            ctx.fillStyle = '#666666';
            ctx.font = '14px Roboto, sans-serif';
            ctx.fillText(behind, 520, yPos + 18);

            // Wins
            const driverWins = isChaseView ? driver.wins : (driver.regularSeasonWins || driver.wins);
            const driverTop5 = isChaseView ? driver.top5 : (driver.regularSeasonTop5 || driver.top5);
            const driverTop10 = isChaseView ? driver.top10 : (driver.regularSeasonTop10 || driver.top10);
            ctx.fillStyle = driverWins > 0 ? '#28a745' : '#999999';
            ctx.font = '14px Roboto, sans-serif';
            ctx.fillText(driverWins.toString(), 610, yPos + 18);

            // Top 5
            ctx.fillStyle = '#666666';
            ctx.fillText(driverTop5.toString(), 680, yPos + 18);

            // Top 10
            ctx.fillText(driverTop10.toString(), 750, yPos + 18);

            yPos += rowHeight;
        });

        // Footer
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, height - footerHeight, width, footerHeight);

        ctx.fillStyle = '#999999';
        ctx.font = '12px Roboto, sans-serif';
        const footerText = downloadImageURL;
        const footerWidth = ctx.measureText(footerText).width;
        ctx.fillText(footerText, (width - footerWidth) / 2, height - 15);

        return canvas;
    }

    function downloadCanvas(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    async function shareRaceResults() {
        const raceId = state.currentRaceId;
        if (!raceId) return;

        const race = state.races.find(r => r.id === raceId);
        const raceResults = state.results[raceId];

        if (!race || !raceResults) {
            showToast('No results to share', 'error');
            return;
        }

        // Check if Web Share API is available
        if (!navigator.share) {
            showToast('Sharing not supported on this device', 'error');
            return;
        }

        // Get finish positions sorted
        const finishResults = [];
        Object.keys(raceResults).forEach(driverId => {
            const result = raceResults[driverId];
            if (result.finish) {
                const driver = state.drivers.find(d => d.id === parseInt(driverId));
                if (driver) {
                    finishResults.push({
                        position: result.finish,
                        driver: driver
                    });
                }
            }
        });

        finishResults.sort((a, b) => a.position - b.position);

        // Generate canvas and convert to blob
        const canvas = await generateRaceCanvas(race, finishResults.map(r => ({
            ...r,
            stage1: raceResults[r.driver.id]?.stage1,
            stage2: raceResults[r.driver.id]?.stage2,
            fastestLap: raceResults[r.driver.id]?.fastestLap
        })));

        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], `${race.name.replace(/[^a-z0-9]/gi, '_')}_Results.png`, { type: 'image/png' });

            // Build share text with top 3
            const top3 = finishResults.slice(0, 3);
            const shareText = `Here is my projected podium for the ${race.name}.\n\n🥇 ${top3[0]?.driver.name || '-'}\n🥈 ${top3[1]?.driver.name || '-'}\n🥉 ${top3[2]?.driver.name || '-'}\n\nPredict the ${race.name} and every race of the 2026 NASCAR season with the @PFSN365 NASCAR Season Predictor`;

            await navigator.share({
                title: `${race.name} Results`,
                text: shareText,
                files: [file]
            });

            showToast('Shared successfully!', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                // Try sharing without file if file sharing fails
                try {
                    const top3 = finishResults.slice(0, 3);
                    const shareText = `Here is my projected podium for the ${race.name}.\n\n🥇 ${top3[0]?.driver.name || '-'}\n🥈 ${top3[1]?.driver.name || '-'}\n🥉 ${top3[2]?.driver.name || '-'}\n\nPredict the ${race.name} and every race of the 2026 NASCAR season with the @PFSN365 NASCAR Season Predictor`;

                    await navigator.share({
                        title: `${race.name} Results`,
                        text: shareText
                    });
                    showToast('Shared successfully!', 'success');
                } catch (fallbackErr) {
                    if (fallbackErr.name !== 'AbortError') {
                        showToast('Failed to share', 'error');
                    }
                }
            }
        }
    }

    async function shareStandings() {
        const isChaseView = state.currentStandingsView === 'chase' && state.regularSeasonComplete;
        const standings = isChaseView ? state.chaseStandings : state.regularSeasonStandings;
        const title = isChaseView ? 'Chase Standings' : 'Regular Season Standings';

        if (!standings || standings.length === 0) {
            showToast('No standings to share', 'error');
            return;
        }

        // Check if Web Share API is available
        if (!navigator.share) {
            showToast('Sharing not supported on this device', 'error');
            return;
        }

        // Generate canvas
        const canvas = await generateStandingsCanvas(standings, title, isChaseView);

        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const filename = isChaseView ? 'Chase_Standings.png' : 'Regular_Season_Standings.png';
            const file = new File([blob], filename, { type: 'image/png' });

            // Build share text with top 5
            const top5 = standings.slice(0, 5);
            const points = isChaseView ? 'chaseTotal' : 'regularSeasonPoints';
            const top5Text = top5.map((d, i) =>
                `${i + 1}. ${d.name} - ${d[points]} pts`
            ).join('\n');
            const shareText = `Here is my projected top-5 for the 2026 NASCAR season.\n\n${top5Text}\n\nPredict the entire 2026 season with the @PFSN365 NASCAR Season Predictor`;

            await navigator.share({
                title: title,
                text: shareText,
                files: [file]
            });

            showToast('Shared successfully!', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                // Try sharing without file if file sharing fails
                try {
                    const top5 = standings.slice(0, 5);
                    const points = isChaseView ? 'chaseTotal' : 'regularSeasonPoints';
                    const top5Text = top5.map((d, i) =>
                        `${i + 1}. ${d.name} - ${d[points]} pts`
                    ).join('\n');
                    const shareText = `Here is my projected top-5 for the 2026 NASCAR season.\n\n${top5Text}\n\nPredict the entire 2026 season with the @PFSN365 NASCAR Season Predictor`;

                    await navigator.share({
                        title: title,
                        text: shareText
                    });
                    showToast('Shared successfully!', 'success');
                } catch (fallbackErr) {
                    if (fallbackErr.name !== 'AbortError') {
                        showToast('Failed to share', 'error');
                    }
                }
            }
        }
    }

    // ============================================
    // Helper Functions
    // ============================================
    function isRaceComplete(raceId) {
        const results = state.results[raceId];
        if (!results) return false;

        // Only consider complete if ALL results are official from spreadsheet
        if (NASCARData.hasAllCompletedResults(raceId)) return true;

        const race = state.races.find(r => r.id === raceId);
        if (!race) return false;

        const availableDrivers = state.drivers.filter(d => NASCARData.isDriverAvailable(d, raceId));
        const availableDriverCount = availableDrivers.length;
        const numStages = race.stages || 2;
        const hasDuels = race.duels || false;

        // Check all required elements are complete
        const resultValues = Object.values(results);

        // For duels and stages, only top 10 matter (for points)
        const minStagePositions = 10;

        // Check duels (if applicable) - need top 10 in each
        if (hasDuels) {
            const duel1Count = resultValues.filter(r => r.duel1 !== null && r.duel1 !== undefined).length;
            const duel2Count = resultValues.filter(r => r.duel2 !== null && r.duel2 !== undefined).length;
            if (duel1Count < minStagePositions || duel2Count < minStagePositions) {
                return false;
            }
        }

        // Check stage 1 - need top 10
        const stage1Count = resultValues.filter(r => r.stage1 !== null && r.stage1 !== undefined).length;
        if (stage1Count < minStagePositions) return false;

        // Check stage 2 - need top 10
        const stage2Count = resultValues.filter(r => r.stage2 !== null && r.stage2 !== undefined).length;
        if (stage2Count < minStagePositions) return false;

        // Check stage 3 (if applicable) - need top 10
        if (numStages >= 3) {
            const stage3Count = resultValues.filter(r => r.stage3 !== null && r.stage3 !== undefined).length;
            if (stage3Count < minStagePositions) return false;
        }

        // Check finish positions - need ALL drivers
        const finishCount = resultValues.filter(r => r.finish !== null && r.finish !== undefined).length;
        if (finishCount !== availableDriverCount) return false;

        // Check fastest lap - at least one driver must have it
        const hasFastestLap = resultValues.some(r => r.fastestLap === true);
        if (!hasFastestLap) return false;

        return true;
    }

    function saveResults() {
        try {
            localStorage.setItem('nascar_results', JSON.stringify(state.results));
        } catch (e) {
            console.error('Failed to save results to localStorage:', e);
            showToast('Failed to save results', 'error');
        }
    }

    function loadResults() {
        try {
            const saved = localStorage.getItem('nascar_results');
            if (saved) {
                state.results = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load results from localStorage:', e);
            state.results = {};
        }

        // Merge in completed results from spreadsheet (per-type deep merge)
        if (NASCARData.completedResults) {
            for (const [raceId, officialResults] of Object.entries(NASCARData.completedResults)) {
                if (!state.results[raceId]) {
                    state.results[raceId] = {};
                }
                for (const [driverId, officialResult] of Object.entries(officialResults)) {
                    if (!state.results[raceId][driverId]) {
                        state.results[raceId][driverId] = {
                            duel1: null, duel2: null, stage1: null, stage2: null,
                            stage3: null, finish: null, fastestLap: false
                        };
                    }
                    // Only overwrite types that have actual official data
                    for (const [key, value] of Object.entries(officialResult)) {
                        if (key === 'fastestLap') {
                            if (value === true) state.results[raceId][driverId].fastestLap = true;
                        } else if (value !== null && value !== undefined) {
                            state.results[raceId][driverId][key] = value;
                        }
                    }
                }
            }
            // Save merged results back to localStorage
            saveResults();
        }
    }

    function saveDuelAssignments(raceId) {
        try {
            const allAssignments = JSON.parse(localStorage.getItem('nascar_duel_assignments') || '{}');
            allAssignments[raceId] = state.duelAssignments;
            localStorage.setItem('nascar_duel_assignments', JSON.stringify(allAssignments));
        } catch (e) {
            console.error('Failed to save duel assignments:', e);
        }
    }

    function loadDuelAssignments(raceId) {
        try {
            const allAssignments = JSON.parse(localStorage.getItem('nascar_duel_assignments') || '{}');
            return allAssignments[raceId] || null;
        } catch (e) {
            console.error('Failed to load duel assignments:', e);
            return null;
        }
    }

    function showLoading(show) {
        elements.loadingOverlay.classList.toggle('active', show);
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============================================
    // Initialize on DOM Ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
