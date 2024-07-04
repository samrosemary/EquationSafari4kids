const questionEl = document.getElementById("question");
const inputEl = document.getElementById("input");
const formEl = document.getElementById("form");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const leaderboardListEl = document.getElementById("leaderboard-list");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

let score = JSON.parse(localStorage.getItem("score")) || 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let correctAns;
let timeRemaining = 60;
let timerInterval;

// Check if one week has passed since the last update
const lastUpdated = JSON.parse(localStorage.getItem("lastUpdated"));
const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
const now = new Date().getTime();

if (lastUpdated && (now - lastUpdated > oneWeek)) {
    leaderboard = [];
    updateLocalStorage();
}

scoreEl.innerText = `Wilderness Tally: ${score}`;
generateNewQuestion();
updateLeaderboard();

startBtn.addEventListener("click", startQuiz);
resetBtn.addEventListener("click", resetQuiz);

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const userAns = +inputEl.value;
    if (userAns === correctAns) {
        score++;
        correctSound.play(); // Play correct sound
    } else {
        score--;
        wrongSound.play(); // Play wrong sound
    }
    updateLocalStorage();
    scoreEl.innerText = `Wilderness Tally: ${score}`;
    generateNewQuestion();
});

function startQuiz() {
    score = 0; // Reset the score
    scoreEl.innerText = `Wilderness Tally: ${score}`; // Update the score display
    updateLocalStorage(); // Update local storage with the reset score

    timeRemaining = 60;
    timerEl.innerText = `Time remaining: ${timeRemaining}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    generateNewQuestion();
}

function resetQuiz() {
    clearInterval(timerInterval);
    score = 0;
    timeRemaining = 60;
    updateLocalStorage();
    scoreEl.innerText = `Wilderness Tally: ${score}`;
    timerEl.innerText = `Time remaining: ${timeRemaining}s`;
    inputEl.value = '';
    generateNewQuestion();
}

function updateTimer() {
    timeRemaining--;
    timerEl.innerText = `Time remaining: ${timeRemaining}s`;
    if (timeRemaining === 0) {
        clearInterval(timerInterval);
        alert(`Time's up! Your final score is ${score}`);
        saveToLeaderboard();
        resetScore();
        updateLeaderboard();
    }
}

function resetScore() {
    score = 0;
    updateLocalStorage();
    scoreEl.innerText = `Wilderness Tally: ${score}`;
}

function updateLocalStorage() {
    localStorage.setItem("score", JSON.stringify(score));
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    localStorage.setItem("lastUpdated", JSON.stringify(new Date().getTime()));
}

function saveToLeaderboard() {
    const playerName = prompt("Enter your name:");
    if (playerName) {
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Keep only top 10 scores
        updateLocalStorage();
    }
}

function updateLeaderboard() {
    leaderboardListEl.innerHTML = leaderboard
        .map(entry => `<li>${entry.name}: ${entry.score}</li>`)
        .join("");
}

function generateNewQuestion() {
    const num1 = Math.ceil(Math.random() * 20);
    const num2 = Math.ceil(Math.random() * 20);
    questionEl.innerText = `Do you know ${num1} + ${num2}?`;
    correctAns = num1 + num2;
    inputEl.value = '';
    inputEl.focus();
}
