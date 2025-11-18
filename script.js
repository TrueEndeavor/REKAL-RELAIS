const API_BASE = window.location.origin;

let topics = {};
let currentTopic = null;
let sessionActive = false;
const students = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
let studentStates = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadTopics();
    initializeStudentStates();
});

async function loadTopics() {
    try {
        const response = await fetch('/topics.json');
        topics = await response.json();

        const select = document.getElementById('topic-select');
        for (const [key, value] of Object.entries(topics)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${value.icon} ${value.title}`;
            select.appendChild(option);
        }

        select.addEventListener('change', (e) => {
            document.getElementById('start-session-btn').disabled = !e.target.value;
        });
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

function initializeStudentStates() {
    students.forEach(student => {
        studentStates[student] = {
            currentQuestion: 0,
            score: 0,
            answers: [],
            active: false,
            startTime: null,
            totalTime: 0
        };
    });
}

// Start Session
document.getElementById('start-session-btn').addEventListener('click', () => {
    const topicKey = document.getElementById('topic-select').value;
    if (!topicKey) return;

    currentTopic = topics[topicKey];
    sessionActive = true;

    // Reset all students
    initializeStudentStates();

    // Update teacher dashboard
    updateTeacherDashboard();

    // Start all students
    students.forEach(student => {
        studentStates[student].active = true;
        studentStates[student].startTime = Date.now();
        showQuestionForStudent(student);
    });

    document.getElementById('start-session-btn').textContent = 'Session Active';
    document.getElementById('start-session-btn').disabled = true;
});

function updateTeacherDashboard() {
    const grid = document.getElementById('teacher-grid');

    if (!sessionActive) {
        grid.innerHTML = '<div class="no-session">Select a topic and start a session to see live student progress</div>';
        return;
    }

    // Calculate class statistics
    const totalAnswers = students.reduce((sum, s) => sum + studentStates[s].answers.length, 0);
    const totalCorrect = students.reduce((sum, s) => sum + studentStates[s].score, 0);
    const classAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
    const activeCount = students.filter(s => studentStates[s].currentQuestion < currentTopic.questions.length).length;
    const completedCount = students.length - activeCount;

    let html = `
        <div class="class-stats">
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-info">
                    <div class="stat-label">Class Accuracy</div>
                    <div class="stat-value">${classAccuracy}%</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                    <div class="stat-label">Active Students</div>
                    <div class="stat-value">${activeCount}/${students.length}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value">${completedCount}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-info">
                    <div class="stat-label">Total Answers</div>
                    <div class="stat-value">${totalAnswers}</div>
                </div>
            </div>
        </div>
        <div class="progress-table">
    `;

    html += '<div class="progress-header">';
    html += '<div class="header-cell">Student</div>';
    html += '<div class="header-cell">Progress</div>';
    html += '<div class="header-cell">Score</div>';
    html += '<div class="header-cell">Status</div>';
    html += '</div>';

    students.forEach(student => {
        const state = studentStates[student];
        const progress = (state.currentQuestion / currentTopic.questions.length) * 100;
        const scorePercent = state.answers.length > 0
            ? Math.round((state.score / state.answers.length) * 100)
            : 0;

        let statusClass = 'status-waiting';
        let statusIcon = '⏸️';
        let statusText = 'Waiting';

        if (state.currentQuestion >= currentTopic.questions.length) {
            statusClass = 'status-complete';
            statusIcon = '✅';
            statusText = 'Complete';
        } else if (state.active) {
            statusClass = 'status-active';
            statusIcon = '📝';
            statusText = `Q${state.currentQuestion + 1}`;
        }

        // Performance indicator
        let perfIndicator = '';
        if (state.answers.length > 0) {
            if (scorePercent >= 80) perfIndicator = '🔥';
            else if (scorePercent >= 60) perfIndicator = '👍';
            else perfIndicator = '💪';
        }

        html += `
            <div class="progress-row ${statusClass}">
                <div class="cell student-cell">${student} ${perfIndicator}</div>
                <div class="cell">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${state.currentQuestion}/${currentTopic.questions.length}</span>
                </div>
                <div class="cell score-cell">
                    <span class="score-badge ${scorePercent >= 70 ? 'good' : scorePercent >= 50 ? 'medium' : 'low'}">
                        ${state.score}/${state.answers.length}
                    </span>
                    ${state.answers.length > 0 ? `<span class="percent">${scorePercent}%</span>` : ''}
                </div>
                <div class="cell status-cell">
                    <span class="status-badge ${statusClass}">${statusIcon} ${statusText}</span>
                </div>
            </div>
        `;
    });

    html += '</div>';
    grid.innerHTML = html;
}

function showQuestionForStudent(studentName) {
    const state = studentStates[studentName];
    const panel = document.querySelector(`.student-panel[data-student="${studentName}"]`);
    const content = panel.querySelector('.student-content');
    const statusEl = panel.querySelector('.student-status');

    if (state.currentQuestion >= currentTopic.questions.length) {
        // Completed
        const scorePercent = Math.round((state.score / state.answers.length) * 100);
        const totalTime = Math.round((Date.now() - state.startTime) / 1000);
        content.innerHTML = `
            <div class="completion">
                <div class="completion-icon">${scorePercent >= 80 ? '🎉' : scorePercent >= 60 ? '👍' : '💪'}</div>
                <div class="completion-text">
                    <h3>Complete!</h3>
                    <p class="score-display">${state.score}/${state.answers.length}</p>
                    <p class="percent-display">${scorePercent}%</p>
                    <p class="time-display">⏱️ ${totalTime}s</p>
                </div>
            </div>
        `;
        statusEl.textContent = 'Finished';
        statusEl.className = 'student-status status-complete';
        updateTeacherDashboard();
        return;
    }

    const question = currentTopic.questions[state.currentQuestion];

    statusEl.textContent = `Q${state.currentQuestion + 1}/${currentTopic.questions.length}`;
    statusEl.className = 'student-status status-active';

    content.innerHTML = `
        <div class="question-box">
            <div class="question-number">Question ${state.currentQuestion + 1}</div>
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((opt, idx) => `
                    <button class="option-btn" data-student="${studentName}" data-answer="${idx}">
                        <span class="option-label">${String.fromCharCode(65 + idx)}</span>
                        <span class="option-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Add click handlers
    content.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
    const btn = e.currentTarget;
    const studentName = btn.dataset.student;
    const answerIdx = parseInt(btn.dataset.answer);
    const state = studentStates[studentName];
    const question = currentTopic.questions[state.currentQuestion];
    const isCorrect = answerIdx === question.correct;

    // Disable all buttons
    const panel = document.querySelector(`.student-panel[data-student="${studentName}"]`);
    const content = panel.querySelector('.student-content');
    content.querySelectorAll('.option-btn').forEach(b => {
        b.disabled = true;
        const idx = parseInt(b.dataset.answer);
        if (idx === question.correct) {
            b.classList.add('correct');
        } else if (idx === answerIdx && !isCorrect) {
            b.classList.add('incorrect');
        }
    });

    // Update state
    state.answers.push(isCorrect ? 1 : 0);
    if (isCorrect) state.score++;

    // Show brief feedback then auto-advance
    setTimeout(() => {
        content.innerHTML = `
            <div class="feedback-flash ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
                <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="feedback-text">
                    <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                    <p>${question.explanation}</p>
                </div>
            </div>
        `;

        updateTeacherDashboard();

        // Auto-advance after 2 seconds
        setTimeout(() => {
            state.currentQuestion++;
            showQuestionForStudent(studentName);
        }, 2000);
    }, 500);
}

// Auto-refresh teacher dashboard every 1 second
setInterval(() => {
    if (sessionActive) {
        updateTeacherDashboard();
    }
}, 1000);
