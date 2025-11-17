const API_BASE = 'http://localhost:5000';

let currentStudent = '';
let currentCards = [];
let currentCardIndex = 0;

// View switching function
function showView(viewName) {
    document.getElementById('teacher-view').style.display = 'none';
    document.getElementById('student-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById(`${viewName}-view`).style.display = 'block';
    
    if (viewName === 'dashboard') {
        loadDashboard();
    }
}

// Teacher view - Generate MCQ cards
document.getElementById('generate-btn').addEventListener('click', async () => {
    const text = document.getElementById('lesson-text').value.trim();
    
    if (!text) {
        alert('Veuillez entrer le texte de votre leçon.');
        return;
    }
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('cards-display').innerHTML = '';
    document.getElementById('generate-btn').disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) throw new Error('Erreur génération');
        
        const cards = await response.json();
        
        let html = '';
        const levelNames = {
            'Foundation': '📗 Fondation (Débutants)',
            'Standard': '📘 Standard (Intermédiaire)',
            'Advanced': '📕 Avancé (Experts)'
        };
        
        for (const level in cards) {
            if (cards[level].length > 0) {
                html += `<h2>${levelNames[level] || level}</h2>`;
                cards[level].forEach((card, idx) => {
                    html += `
                        <div class="card preview-card">
                            <div class="card-number">Question ${idx + 1}</div>
                            <p class="question-text"><strong>${card.question}</strong></p>
                            <div class="options-preview">
                                ${card.options.map((opt, i) => `
                                    <div class="option-preview ${i === card.correct ? 'correct-preview' : ''}">
                                        ${String.fromCharCode(65 + i)}. ${opt}
                                        ${i === card.correct ? ' ✓' : ''}
                                    </div>
                                `).join('')}
                            </div>
                            <p class="explanation"><em>💡 ${card.explanation}</em></p>
                        </div>
                    `;
                });
            }
        }
        
        document.getElementById('cards-display').innerHTML = html;
        alert('✅ Cartes MCQ générées! Les élèves peuvent maintenant pratiquer.');
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Erreur lors de la génération.');
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('generate-btn').disabled = false;
    }
});

// Student view - Select student and start flashcards
document.getElementById('student-select').addEventListener('change', async (e) => {
    currentStudent = e.target.value;
    if (!currentStudent) {
        document.getElementById('student-info').style.display = 'none';
        document.getElementById('cards-container').innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/student/${currentStudent}`);
        if (!response.ok) throw new Error('Erreur chargement');
        
        const data = await response.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        
        currentCards = data.cards;
        currentCardIndex = 0;
        
        if (currentCards.length === 0) {
            document.getElementById('cards-container').innerHTML = 
                '<p style="text-align:center; color:#666;">Aucune carte disponible. Le professeur doit générer des cartes.</p>';
            return;
        }
        
        document.getElementById('student-info').style.display = 'block';
        document.getElementById('current-level').textContent = 'En cours...';
        
        showFlashcard();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Erreur. Assurez-vous que des cartes ont été générées.');
    }
});

function showFlashcard() {
    if (currentCardIndex >= currentCards.length) {
        document.getElementById('cards-container').innerHTML = `
            <div class="completion-message">
                <h3>🎉 Bravo ${currentStudent}!</h3>
                <p>Vous avez terminé toutes les cartes!</p>
                <button class="primary-btn" onclick="location.reload()">Recommencer</button>
            </div>
        `;
        return;
    }
    
    const card = currentCards[currentCardIndex];
    const html = `
        <div class="flashcard">
            <div class="card-header">
                <span class="card-counter">Carte ${currentCardIndex + 1}/${currentCards.length}</span>
                <span class="student-name">👤 ${currentStudent}</span>
            </div>
            <div class="question-section">
                <h3>${card.question}</h3>
            </div>
            <div class="options-section">
                ${card.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">
                        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="option-text">${option}</span>
                    </button>
                `).join('')}
            </div>
            <div class="feedback-section" id="feedback" style="display:none;"></div>
        </div>
    `;
    
    document.getElementById('cards-container').innerHTML = html;
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedIndex = parseInt(e.currentTarget.dataset.index);
            checkAnswer(selectedIndex, card);
        });
    });
}

async function checkAnswer(selectedIndex, card) {
    const isCorrect = selectedIndex === card.correct;
    const feedbackDiv = document.getElementById('feedback');
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        const btnIndex = parseInt(btn.dataset.index);
        if (btnIndex === card.correct) {
            btn.classList.add('correct');
        } else if (btnIndex === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    feedbackDiv.style.display = 'block';
    feedbackDiv.innerHTML = `
        <div class="feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}">
            <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="feedback-text">
                <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                <p>${card.explanation}</p>
            </div>
        </div>
        <button class="next-btn" onclick="nextCard()">
            ${currentCardIndex < currentCards.length - 1 ? 'Carte suivante →' : 'Terminer ✓'}
        </button>
    `;
    
    try {
        await fetch(`${API_BASE}/update_progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: currentStudent, 
                correct: isCorrect ? 1 : 0 
            })
        });
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

function nextCard() {
    currentCardIndex++;
    showFlashcard();
}

// Dashboard view
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/dashboard`);
        if (!response.ok) throw new Error('Erreur dashboard');
        
        const data = await response.json();
        
        let html = '<div class="dashboard-grid">';
        for (const name in data) {
            const status = data[name];
            const statusText = {
                'green': 'À jour',
                'yellow': 'En retard',
                'red': 'Besoin d\'aide',
                'gray': 'Pas commencé'
            }[status];
            
            html += `
                <div class="student-card ${status}">
                    <div class="student-name-dash">👤 ${name}</div>
                    <div class="status-indicator">
                        <span class="dot ${status}"></span>
                        <span class="status-text">${statusText}</span>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        
        document.getElementById('dashboard').innerHTML = html;
    } catch (error) {
        document.getElementById('dashboard').innerHTML = '<p>Erreur de chargement</p>';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    showView('teacher');
});
