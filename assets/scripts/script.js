// Load game data.
const gameData = {
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

const qQuestion = document.getElementById("q-question");
const qMeta = document.getElementById("q-meta");
const qDiff = document.getElementById("q-diff");
const qCat = document.getElementById("q-cat");
const qExplanation = document.getElementById("q-explanation");

const option1 = document.getElementById("option1");
const option1Label = document.getElementById("option1-label"); 
const option2 = document.getElementById("option2");
const option2Label = document.getElementById("option2-label"); 
const option3 = document.getElementById("option3");
const option3Label = document.getElementById("option3-label");
const option4 = document.getElementById("option4");
const option4Label = document.getElementById("option4-label");  

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
}

// Set a random problem to memory.
function retrieveRandomProblem() {
    const problem = problemBank[Math.floor(Math.random() * problemBank.length)];
    gameData.currentProblem = problem;
}


// Start running the functions in order.
async function startGame() {
    await loadBank();
    retrieveRandomProblem();
    injectProblem();
}

// Start the game
startGame();