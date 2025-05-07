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

const points = document.getElementById("points");

const qQuestion = document.getElementById("q-question");
const qMeta = document.getElementById("q-meta");
const qDiff = document.getElementById("q-diff");
const qCat = document.getElementById("q-cat");

const option1 = document.getElementById("option1");
const option1Label = document.getElementById("option1-label"); 
const option2 = document.getElementById("option2");
const option2Label = document.getElementById("option2-label"); 
const option3 = document.getElementById("option3");
const option3Label = document.getElementById("option3-label");
const option4 = document.getElementById("option4");
const option4Label = document.getElementById("option4-label");

const form = document.getElementById("answer-form");
const submitButton = document.getElementById("submit-btn");
const resultBox = document.getElementById("result-box");
const result = document.getElementById("q-correct");
const explanation = document.getElementById("q-explanation");

// Load the game bank to memory.
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

    // Update information
    points.innerText = gameData.score;
}

// Set a random problem to memory.
function retrieveRandomProblem() {
    const problem = problemBank[Math.floor(Math.random() * problemBank.length)];
    gameData.currentProblem = problem;
}

function validateAnswer(ans) {
    let wasCorrect = (ans === gameData.currentProblem.correctAnswer);
    resultBox.style.display = "block";
    explanation.innerText = gameData.currentProblem.explanation;

    result.innerText = (wasCorrect) ? "Correct" : "Incorrect";
    result.style.color = (wasCorrect) ? "var(--green)" : "var(--red)";

    handlePoints(wasCorrect)
}

function handlePoints(correct) {
    if (correct) gameData.score += 1;
    else gameData.score -= 2;

    points.innerText = gameData.score;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ans = e.target["math-ans"].value;
    for (let i=1; i<=4; i++) {
        document.getElementById(`option${i}`).checked = false;
    }

    submitButton.disabled = true;
    form.style.display = "none";

    validateAnswer(ans);
    saveGame();
});

function saveGame() {
    let data = JSON.stringify(gameData);
    localStorage.setItem("gameData", data);
}

function loadGame() {
    let data = localStorage.getItem("gameData");
    if (data) gameData = JSON.parse(data);
}

function deleteSave() {
    localStorage.clear();
    window.location = window.location;
}

// Start running the functions in order.
async function startGame() {
    await loadBank();
    loadGame();
    retrieveRandomProblem();
    injectProblem();
}

function next() {
    retrieveRandomProblem();
    injectProblem();
}

// Start the game
startGame();