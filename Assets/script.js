const questions = [{
        questionText: "What does HMTL stand for?",
        options: ["1. Hype Taking Markup Language", "2. Hyper Text Markup Language", "3. Hyper Text Markdown Language", "4. Hyper Texting Mark Language"],
        answer: "2. Hyper Text Markup Language",
    },
    {
        questionText: "How many tags are in a regular element?",
        options: ["1. Three", "2. Five", "3. Two", "4. One"],
        answer: "3. Two",
    },
    {
        questionText: "What is the difference between an opening tag and a closing tag?",
        options: ["1. Opening tag has a / in front", "2. Closing tag has a / in front", "3. There is no difference between them", "4. Both A and C"],
        answer: "2. Closing tag has a / in front",
    },
    {
        questionText: "Where do all items for the same website need to be saved?",
        options: ["1. In the same folder", "2. Where ever is fine", "3. In different folders", "4. None of the Above"],
        answer: "1. In the same folder",
    },
    {
        questionText: "What is an element that does not have a closing tag called?",
        options: ["1. Tag", "2. Open Element", "3. Closed Element", "4. Empty Element"],
        answer: "4. Empty Element",
    },
];

const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

function hideCards() {
    startCard.setAttribute("hidden", true);
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

function hideResultText() {
    resultDiv.style.display = "none";
}

var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
    hideCards();
    questionCard.removeAttribute("hidden");
    currentQuestion = 0;
    displayQuestion();
    time = questions.length * 10;
    intervalID = setInterval(countdown, 1000);
    displayTime();
}

function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}

const timeDisplay = document.querySelector("#time");

function displayTime() {
    timeDisplay.textContent = time;
}

function displayQuestion() {
    let question = questions[currentQuestion];
    let options = question.options;
    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let optionButton = document.querySelector("#option" + i);
        optionButton.textContent = option;
    }
}

document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
}

function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
        resultText.textContent = "Correct!";
        setTimeout(hideResultText, 1000);
    } else {
        resultText.textContent = "Incorrect!";
        setTimeout(hideResultText, 1000);
        if (time >= 10) {
            time = time - 10;
            displayTime();
        } else {
            time = 0;
            displayTime();
            endQuiz();
        }
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

const score = document.querySelector("#score");

function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

submitButton.addEventListener("click", storeScore);

function storeScore(event) {
    event.preventDefault();
    if (!inputElement.value) {
        alert("Please enter your initials before pressing submit!");
        return;
    }
    let leaderboardItem = {
        initials: inputElement.value,
        score: time,
    };

    updateStoredLeaderboard(leaderboardItem);
    hideCards();
    leaderboardCard.removeAttribute("hidden");
    renderLeaderboard();
}

function updateStoredLeaderboard(leaderboardItem) {
    let leaderboardArray = getLeaderboard();
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

function getLeaderboard() {
    let storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
        let leaderboardArray = JSON.parse(storedLeaderboard);
        return leaderboardArray;
    } else {
        leaderboardArray = [];
    }
    return leaderboardArray;
}

function renderLeaderboard() {
    let sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedLeaderboardArray.length; i++) {
        let leaderboardEntry = sortedLeaderboardArray[i];
        let newListItem = document.createElement("li");
        newListItem.textContent =
            leaderboardEntry.initials + " - " + leaderboardEntry.score;
        highscoreList.append(newListItem);
    }
}

function sortLeaderboard() {
    let leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
        return;
    }
    leaderboardArray.sort(function(a, b) {
        return b.score - a.score;
    });
    return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

function returnToStart() {
    hideCards();
    startCard.removeAttribute("hidden");
}

const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
    hideCards();
    leaderboardCard.removeAttribute("hidden");
    clearInterval(intervalID);
    time = undefined;
    displayTime();
    renderLeaderboard();
}