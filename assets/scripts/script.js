// Load game data.
let gameData = {
    score: 0,
    username: "",
    currentProblem: {
        "id": 0,
        "question": "",
        "choices": ["", "", "", ""],
        "correctAnswer": "",
        "topic": "",
        "difficulty": "",
        "type": "",
        "explanation": ""
    }
}

// Init variables and load DOM elements.
let problemBank = [];
const DataAPIUrl = "https://script.google.com/macros/s/AKfycbwSs5gWgIPgjUMCBlg6XgS2EVJW38PQXIu3FqNht2tK79GUOpWF_m7t_PVXsoHWQAfX/exec";

const points = document.getElementById("points");
const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' };

// Question DOM
const qQuestion = document.getElementById("q-question");
const qMeta = document.getElementById("q-meta");
const qDiff = document.getElementById("q-diff");
const qCat = document.getElementById("q-cat");

// Option DOM
const option1 = document.getElementById("option1");
const option1Label = document.getElementById("option1-label"); 
const option2 = document.getElementById("option2");
const option2Label = document.getElementById("option2-label"); 
const option3 = document.getElementById("option3");
const option3Label = document.getElementById("option3-label");
const option4 = document.getElementById("option4");
const option4Label = document.getElementById("option4-label");

// Main form DOM
const form = document.getElementById("answer-form");
const submitButton = document.getElementById("submit-btn");
const resultBox = document.getElementById("result-box");
const result = document.getElementById("q-correct");
const explanation = document.getElementById("q-explanation");
const problemId = document.getElementById("problem-id");

/*
 *  Load the game bank to memory.
 */
async function loadBank() {
    // If it fails, error.
    try {
        problemBank = await (await fetch(`${document.location.href.split("?")[0]}/assets/bank.json`)).json();
    } catch (e) {
        throw new Error(e);
    }
}

// Inject the current problem to the HTML DOM.
function injectProblem() {
    // Uncripple form
    form.style.display = "block";
    submitButton.disabled = false;

    // Hide forward box
    resultBox.style.display = "none";

    // Inject question metadata.
    qQuestion.innerText = gameData.currentProblem.question;
    qDiff.innerText = gameData.currentProblem.difficulty;
    qCat.innerText = gameData.currentProblem.topic;

    // Inject radio values.
    option1.value = gameData.currentProblem.choices[0];
    option2.value = gameData.currentProblem.choices[1];
    option3.value = gameData.currentProblem.choices[2];
    option4.value = gameData.currentProblem.choices[3];

    // Inject labels
    option1Label.innerText = gameData.currentProblem.choices[0];
    option2Label.innerText = gameData.currentProblem.choices[1];
    option3Label.innerText = gameData.currentProblem.choices[2];
    option4Label.innerText = gameData.currentProblem.choices[3];

    problemId.value = gameData.currentProblem.id;

    // Update information
    points.innerText = gameData.score;
}

/**
 * If all problems have been ran through, 
 * inform the user.
 */
function ranThrough() {
    qMeta.style.display = "none";
    qQuestion.style.textAlign = "center";
    qQuestion.innerText = "No more problems available, please refresh the page.";
    resultBox.style.display = "none";
}

/**
 * Get a random problem from the bank using Math.floor and Math.random
 */
function retrieveRandomProblem() {
    const problem = problemBank[Math.floor(Math.random() * problemBank.length)];
    gameData.currentProblem = problem;
}

/**
 * Validate an answer as right or wrong
 * @param {String} ans The answer to validate.
 */
function validateAnswer(ans) {
    // If it was correct update screen
    let wasCorrect = (ans === gameData.currentProblem.correctAnswer);
    resultBox.style.display = "block";
    explanation.innerText = gameData.currentProblem.explanation;

    // Set variables and styles
    result.innerText = (wasCorrect) ? "Correct" : "Incorrect";
    result.style.color = (wasCorrect) ? "var(--green)" : "var(--red)";

    // Process points
    handlePoints(wasCorrect)
}

/**
 * Handle the adding or removal of points
 * @param {Boolean} correct Whether the response is correct or not. 
 */
function handlePoints(correct) {
    // Remove or add points and update display
    if (correct) gameData.score += 1;
    else gameData.score -= 2;

    points.innerText = gameData.score;

    // No score no leaderboard >:(
    if(gameData.score == 0)
        document.getElementById("leaderboard-btn").style.display = "none";
    else
        document.getElementById("leaderboard-btn").style.display = "inline";
}

/**
 * On form submit, begin parsing answer and data
 */
form.addEventListener("submit", (e) => {
    // Prevent page from refreshing.
    e.preventDefault();

    // Clear form selected option to prevent auto
    let ans = e.target["math-ans"].value;
    for (let i=1; i<=4; i++) {
        document.getElementById(`option${i}`).checked = false;
    }

    // Disable form
    submitButton.disabled = true;
    form.style.display = "none";

    // Remove the problem from the problemBank
    problemBank = problemBank.filter(problem => problem.id != e.target["problem-id"].value);

    // Handle correctness.
    validateAnswer(ans);
    saveGame();
});

/**
 * Push gameData to storage
 */
function saveGame() {
    let data = JSON.stringify(gameData);
    localStorage.setItem("gameData", data);
}

/**
 * Load gameData from storage
 */
function loadGame() {
    let data = localStorage.getItem("gameData");
    if (data) gameData = JSON.parse(data);
}

/**
 * Destory all data
 */
function deleteSave() {
    localStorage.clear();
    window.location = window.location;
}

/**
 * Start running the functions in order.
 */
async function startGame() {
    await loadBank();
    loadGame();
    retrieveRandomProblem();
    injectProblem();

    // If there is no score, no leaderboard.
    if(gameData.score == 0)
        document.getElementById("leaderboard-btn").style.display = "none";
}

/**
 * Send the next problem.
 */
function next() {
    if(problemBank.length == 0) return ranThrough();
    retrieveRandomProblem();
    injectProblem();
}

// Start the game
startGame();