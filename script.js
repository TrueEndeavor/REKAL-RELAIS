const API_BASE = 'http://localhost:5000'; // Replace with deployed backend URL

// View switching function
function showView(viewName) {
    // Hide all views
    document.getElementById('teacher-view').style.display = 'none';
    document.getElementById('student-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    
    // Show selected view
    document.getElementById(`${viewName}-view`).style.display = 'block';
    
    // Load dashboard data if switching to dashboard
    if (viewName === 'dashboard') {
        loadDashboard();
    }
}

// Teacher view - Generate cards
document.getElementById('generate-btn').addEventListener('click', async () => {
    const text = document.getElementById('lesson-text').value.trim();
    
    if (!text) {
        alert('Veuillez entrer le texte de votre leçon.');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('cards-display').innerHTML = '';
    document.getElementById('generate-btn').disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la génération');
        }
        
        const cards = await response.json();
        
        // Display cards by level
        let html = '';
        const levelNames = {
            'Foundation': '📗 Fondation (Débutants)',
            'Standard': '📘 Standard (Intermédiaire)',
            'Advanced': '📕 Avancé (Experts)'
        };
        
        for (const level in cards) {
            if (cards[level].length > 0) {
                html += `<h2>${levelNames[level] || level}</h2>`;
                cards[level].forEach((card, index) => {
                    html += `<div class="card">
                        <strong>Q${index + 1}:</strong> ${card.question}<br>
                        <strong>R${index + 1}:</strong> ${card.answer}
                    </div>`;
                });
            }
        }
        
        document.getElementById('cards-display').innerHTML = html;
        
        // Show success message
        alert('✅ Cartes générées avec succès! Vous pouvez maintenant aller dans la vue Élève pour tester.');
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Erreur lors de la génération des cartes. Veuillez réessayer.');
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('generate-btn').disabled = false;
    }
});

// Student view - Select student and load cards
document.getElementById('student-select').addEventListener('change', async (e) => {
    const name = e.target.value;
    if (!name) {
        document.getElementById('student-info').style.display = 'none';
        document.getElementById('cards-container').innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/student/${name}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement');
        }
        
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }
        
        // Show student info
        document.getElementById('student-info').style.display = 'block';
        
        // Get student level from backend
        const studentResponse = await fetch(`${API_BASE}/dashboard`);
        const dashboardData = await studentResponse.json();
        
        // Display current level (we'll need to fetch this from backend)
        document.getElementById('current-level').textContent = 'Chargement...';
        
        // Display cards
        if (data.cards.length === 0) {
            document.getElementById('cards-container').innerHTML = '<p style="text-align:center; color:#666;">Aucune carte disponible. Le professeur doit d\'abord générer des cartes.</p>';
            return;
        }
        
        let html = '';
        data.cards.forEach((card, index) => {
            html += `<div class="card" data-index="${index}" data-student="${name}">
                <p><strong>Question ${index + 1}:</strong> ${card.question}</p>
                <input type="text" placeholder="Tapez votre réponse ici..." class="answer-input">
                <button class="submit-answer">✓ Soumettre</button>
                <div class="result"></div>
            </div>`;
        });
        
        document.getElementById('cards-container').innerHTML = html;
        
        // Add event listeners to submit buttons
        document.querySelectorAll('.submit-answer').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const cardDiv = e.target.parentElement;
                const answerInput = cardDiv.querySelector('.answer-input');
                const answer = answerInput.value.trim();
                const resultDiv = cardDiv.querySelector('.result');
                const index = parseInt(cardDiv.dataset.index);
                const studentName = cardDiv.dataset.student;
                
                if (!answer) {
                    alert('Veuillez entrer une réponse.');
                    return;
                }
                
                // Disable button and input
                btn.disabled = true;
                answerInput.disabled = true;
                
                // Simple answer checking (contains key words from answer)
                const correctAnswer = data.cards[index].answer.toLowerCase();
                const userAnswer = answer.toLowerCase();
                
                // Check if answer is somewhat correct (simple matching)
                const correct = correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer.substring(0, 10)) ? 1 : 0;
                
                try {
                    // Update progress on backend
                    await fetch(`${API_BASE}/update_progress`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: studentName, correct })
                    });
                    
                    // Show result
                    if (correct) {
                        resultDiv.innerHTML = '<p style="color: #28a745; font-weight: 600;">✓ Correct ! Bien joué !</p>';
                        cardDiv.style.borderColor = '#28a745';
                    } else {
                        resultDiv.innerHTML = `<p style="color: #dc3545; font-weight: 600;">✗ Incorrect. La bonne réponse était : ${data.cards[index].answer}</p>`;
                        cardDiv.style.borderColor = '#dc3545';
                    }
                    
                } catch (error) {
                    console.error('Error:', error);
                    alert('Erreur lors de la soumission.');
                    btn.disabled = false;
                    answerInput.disabled = false;
                }
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Erreur lors du chargement des cartes. Assurez-vous que le professeur a généré des cartes.');
    }
});

// Dashboard view - Load and display student progress
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/dashboard`);
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du tableau de bord');
        }
        
        const data = await response.json();
        
        let html = '';
        for (const name in data) {
            const status = data[name];
            let statusText = '';
            
            switch(status) {
                case 'green':
                    statusText = 'À jour';
                    break;
                case 'yellow':
                    statusText = 'En retard';
                    break;
                case 'red':
                    statusText = 'Besoin d\'aide';
                    break;
                case 'gray':
                    statusText = 'Pas commencé';
                    break;
            }
            
            html += `<p>
                <span>${name}</span>
                <span class="dot ${status}" title="${statusText}"></span>
            </p>`;
        }
        
        document.getElementById('dashboard').innerHTML = html || '<p style="text-align:center; color:#666;">Aucune donnée disponible.</p>';
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('dashboard').innerHTML = '<p style="text-align:center; color:#dc3545;">❌ Erreur lors du chargement du tableau de bord.</p>';
    }
}

// Initialize - show teacher view by default
window.addEventListener('DOMContentLoaded', () => {
    showView('teacher');
});
