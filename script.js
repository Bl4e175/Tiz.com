// Hide the loading screen after 3 seconds
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 3000);
});

const apiUrl = 'https://opentdb.com/api.php?amount=20&category='; // API base URL for trivia questions

const categories = {
    movies: 11,
    sports: 21,
    animals: 27,
    tech_luxury: 30,
    geography: 22,
    general: 9,
};

let currentTopic = '';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const topicSelect = document.getElementById('topic');
const startBtn = document.getElementById('startBtn');
const triviaContainer = document.querySelector('.trivia-container');
const questionElement = document.getElementById('question');
const answerBtns = document.querySelectorAll('.answer-btn');
const resultElement = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');
const progressElement = document.getElementById('progress');
const topicSelectionDiv = document.getElementById('topicSelection');
const closeAlertBtn = document.getElementById('closeAlertBtn');

// Event listeners
startBtn.addEventListener('click', startTrivia);
nextBtn.addEventListener('click', nextQuestion);
quitBtn.addEventListener('click', returnHome);
answerBtns.forEach(btn => btn.addEventListener('click', checkAnswer));
closeAlertBtn.addEventListener('click', closeCustomAlert);

// Fetch trivia questions from the API
async function fetchQuestions(topic) {
    const categoryId = categories[topic];
    const url = `${apiUrl}${categoryId}&type=multiple`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Format the questions and decode HTML entities
        questions = data.results.map(item => ({
            question: decodeHtml(item.question),
            answers: shuffleArray([...item.incorrect_answers.map(decodeHtml), decodeHtml(item.correct_answer)]),
            correct: decodeHtml(item.correct_answer),
        }));

        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Could not fetch questions. Please try again later.');
    }
}

// Helper function to decode HTML entities
function decodeHtml(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

// Start trivia game
function startTrivia() {
    currentTopic = topicSelect.value;
    if (!currentTopic) {
        showCustomAlert(); // Show custom alert if no topic is selected
        return;
    }

    topicSelectionDiv.style.display = 'none'; // Hide topic selection
    triviaContainer.style.display = 'block';  // Show trivia container

    currentQuestionIndex = 0; // Reset the question index
    score = 0; // Reset the score
    fetchQuestions(currentTopic); // Fetch trivia questions based on the selected topic
}

// Update the displayQuestion function
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        triviaContainer.innerHTML = `
            <h2 style="color: black;">Quiz Completed!</h2>
            <p style="color: black;">You scored ${score} out of ${questions.length}.</p>
            <button id="homeBtn">Home</button>
        `;
        document.getElementById('homeBtn').addEventListener('click', returnHome);
        return;
    }

    const questionData = questions[currentQuestionIndex];
    questionElement.textContent = questionData.question;
    answerBtns.forEach((btn, index) => {
        btn.textContent = questionData.answers[index];
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
        btn.dataset.correct = questionData.answers[index] === questionData.correct;
    });
    resultElement.textContent = '';
    nextBtn.style.display = 'none';
    quitBtn.style.display = 'block';
    updateProgress(); // Update progress after displaying a question
    updateQuestionIndicator(); // Update the question indicator
}

// New function to update the question indicator
function updateQuestionIndicator() {
    const questionIndicator = document.getElementById('questionIndicator');
    const answered = currentQuestionIndex;
    const remaining = questions.length - answered;
    questionIndicator.textContent = `Answered: ${answered} | Remaining: ${remaining}`;
}

// Update the updateProgress function (optional, if you want to integrate it here)
function updateProgress() {
    progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    updateQuestionIndicator(); // Ensure the indicator is updated
}
// Updated function to return to the topic selection and reset the game state
function returnHome() {
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    questions = [];
    currentTopic = '';

    // Hide the trivia container and show the topic selection screen
    triviaContainer.style.display = 'none';
    topicSelectionDiv.style.display = 'block';

    // Reset UI elements
    nextBtn.style.display = 'none';
    quitBtn.style.display = 'none';
    progressElement.textContent = '';
    const questionIndicator = document.getElementById('questionIndicator');
    if (questionIndicator) {
        questionIndicator.textContent = '';
        location.reload(); // Reload the page to restart the entire program
    }
}



// Check if the selected answer is correct
function checkAnswer(event) {
    const selectedBtn = event.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('incorrect');
        answerBtns.forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            }
        });
    }

    answerBtns.forEach(btn => btn.disabled = true);
    nextBtn.style.display = 'block'; // Show the Next button
}

// Load the next question
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Update the progress display
function updateProgress() {
    progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}



// Shuffle the answers array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to show the custom alert modal
function showCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'block';
}
// Fetch trivia questions from the API
async function fetchQuestions(topic) {
    const categoryId = categories[topic];
    const url = `${apiUrl}${categoryId}&type=multiple`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Format the questions and decode HTML entities for all text fields
        questions = data.results.map(item => ({
            question: decodeHtml(item.question),
            answers: shuffleArray([
                ...item.incorrect_answers.map(answer => decodeHtml(answer)),
                decodeHtml(item.correct_answer),
            ]),
            correct: decodeHtml(item.correct_answer),
        }));

        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Could not fetch questions. Please try again later.');
    }
}
// Function to close the custom alert modal
function closeCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none';
}
window.onload = function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const logo = document.getElementById('logo');
    const topicSelection = document.getElementById('topicSelection');

    // Display the loading screen for 3 seconds, then show the main content
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        logo.style.display = 'block';
        topicSelection.style.display = 'block';
    }, 3000);
};
// Hide the loading screen after 3 seconds
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 3000);
});

