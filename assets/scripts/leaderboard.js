// Set basic variables
const DataAPIUrl = "https://script.google.com/macros/s/AKfycbzdW3ZZ5nPQQiYCMOwcQCkV7yhFNGf8-kEsM0gIsniJVGGNL-AT1c1Uq8I4UemGxE7G/exec";
const headers = { "Access-Control-Allow-Origin": "*" }
let gameData;

/**
 * Loads the game data from storage.
 */
function loadGame() {
    let data = localStorage.getItem("gameData");
    if (data) gameData = JSON.parse(data);
}

/**
 * Pushes a name and score to the leaderboard.
 * @param {String} name The name to push to the leaderboard.
 * @param {Number} score The score to push with the name
 * @returns {*} Sends out an alert to warn user of errors.
 */
async function pushToLeaderboard(name, score) {
    // Check for profanity
    const apiURL = "https://www.purgomalum.com/service/containsprofanity?text=";
    let res = await (await fetch(apiURL + new URLSearchParams(name))).text();

    // Tell the user to be child friendly if it's unhappy.
    if(res == "true")
        return sendAlert("Please use a name that does not contain foul language.", "Cannot Add Name");

    // If a bad scroe is sent, complain
    if (isNaN(score))
        return sendAlert("Please try again later.", "Something Went Wrong");

    // Set the body of the response to push.
    let body = {
        "name": name,
        "score": score,
        "sendData": true
    }

    // Send the request to add to the leaderboard.
    res = await (await fetch(DataAPIUrl + `?name=${body.name}&score=${body.score}&sendData=${body.sendData}`, {
        method: "GET"
    })).text();

    // Alert a success and refresh.
    sendAlert("You were succussfully added to the leaderboard.", "Added to Leaderboard");
    window.location = window.location;
}

/**
 * Loads the leaderboard and pushes it into code.
 */
async function handleLeaderboard() {
    // Fetch and preprocess the leaderboard's spreadsheet.
    let res = await(await fetch("https://docs.google.com/spreadsheets/d/19YGFrI05Euv5oEAeKmKdXQbzOBFvXTobdX5w28Vw4_E/export?format=csv")).text();

    let dataArr = res
    .split("\n")
    .slice(1);

    // Use RegEx to parse the data and split it up into JSON safely.
    let jsonArr = [];
    dataArr.forEach(leader => {
        let usableData = leader
        .match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
        .map(value => value.replace(/^"|"$/g, ''));

        jsonArr.push({
            "name": usableData[0],
            "score": usableData[1]
        });
    });

    // Start pushing each person to the table leaderboard.
    let i = 1;
    for (let person of jsonArr) {
        document.getElementById("leaderboard").innerHTML += `<tr><td>${i}</td><td class="personName">${person.name}</td><td>${person.score}</td>`;
        i++;
    }
}

/**
 * Main function to initialize the page.
 */
async function main() {
    handleLeaderboard();
    loadGame();
    document.getElementById("score").innerText = gameData.score;
}

/**
 * Function to handle filtering the list of people
 * when using the leaderboard.
 */
function filterList() {
    // Get basic variables
    let input = document.getElementById("search");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("leaderboard");
    let tr = table.getElementsByTagName('tr');
    let i, txtValue;

    // Handle data to parse table and clear rows.
    for (i = 0; i < tr.length; i++) {
        txtValue = tr[i].innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            if(i==0) continue
            tr[i].style.display = "none";
          }
    }
}

/**
 * Show the name input when submitting a score to the leaderboard.
 */
function submitScoreBtn() {
    document.getElementById("modal").style.display = "block";
    document.getElementById("name-input").value = getCookie("username");
}

/**
 * Push gameData to storage
 */
function saveGame() {
    let data = JSON.stringify(gameData);
    localStorage.setItem("gameData", data);
}

/**
 * Handle to modal submit and push to leaderboard
 */
document.getElementById("name").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";
    setCookie("username", e.target["name-input"].value, 7)
    saveGame();

    pushToLeaderboard(e.target["name-input"].value, gameData.score); // Note: this function is a point of no return
});

// Start the init process.
main();
