from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for local testing

# Blackbox AI API endpoint (free tier available)
BLACKBOX_API_URL = "https://api.blackbox.ai/v1/chat/completions"
BLACKBOX_API_KEY = os.environ.get('BLACKBOX_API_KEY', '')  # Optional: set via environment variable

# Data file for cards and students (fake data for demo)
DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {'cards': {}, 'students': {
        'Alice': {'level': 'Foundation', 'progress': []},
        'Bob': {'level': 'Standard', 'progress': []},
        'Charlie': {'level': 'Advanced', 'progress': []},
        'Diana': {'level': 'Foundation', 'progress': []},
        'Eve': {'level': 'Standard', 'progress': []}
    }}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/topics.json')
def topics():
    return send_from_directory('.', 'topics.json')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/generate', methods=['POST'])
def generate_cards():
    lesson_text = request.json.get('text')
    if not lesson_text:
        return jsonify({'error': 'Texte de leçon requis'}), 400
    
    try:
        # Blackbox AI prompt to generate 3 levels of Q&A (5 cards each)
        prompt = f"""Basé sur ce texte de leçon : '{lesson_text}'

Générez exactement 5 paires de questions-réponses pour CHAQUE niveau (Fondation, Standard, Avancé).

Format STRICT à suivre:

NIVEAU: Fondation
Q1: [Question très simple pour débutants]
R1: [Réponse courte et claire]
Q2: [Question simple]
R2: [Réponse courte]
Q3: [Question simple]
R3: [Réponse courte]
Q4: [Question simple]
R4: [Réponse courte]
Q5: [Question simple]
R5: [Réponse courte]

NIVEAU: Standard
Q1: [Question de difficulté moyenne]
R1: [Réponse détaillée]
Q2: [Question moyenne]
R2: [Réponse détaillée]
Q3: [Question moyenne]
R3: [Réponse détaillée]
Q4: [Question moyenne]
R4: [Réponse détaillée]
Q5: [Question moyenne]
R5: [Réponse détaillée]

NIVEAU: Avancé
Q1: [Question difficile pour experts]
R1: [Réponse complète et approfondie]
Q2: [Question difficile]
R2: [Réponse complète]
Q3: [Question difficile]
R3: [Réponse complète]
Q4: [Question difficile]
R4: [Réponse complète]
Q5: [Question difficile]
R5: [Réponse complète]

Respectez exactement ce format."""

        # Call Blackbox AI API
        headers = {
            'Content-Type': 'application/json',
        }
        if BLACKBOX_API_KEY:
            headers['Authorization'] = f'Bearer {BLACKBOX_API_KEY}'
        
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": "blackboxai",
            "max_tokens": 2000,
            "temperature": 0.7
        }
        
        response = requests.post(BLACKBOX_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code != 200:
            # Fallback: generate sample cards for demo
            print(f"API Error: {response.status_code}, using fallback data")
            cards = generate_fallback_cards(lesson_text)
        else:
            response_data = response.json()
            generated_text = response_data['choices'][0]['message']['content'].strip()
            
            # Parse the generated text into structured cards
            cards = parse_generated_cards(generated_text)
            
            # If parsing failed, use fallback
            if not any(cards.values()):
                cards = generate_fallback_cards(lesson_text)
        
        data = load_data()
        data['cards'] = cards
        save_data(data)
        return jsonify(cards)
    
    except Exception as e:
        print(f"Error generating cards: {str(e)}")
        # Return fallback cards for demo purposes
        cards = generate_fallback_cards(lesson_text)
        data = load_data()
        data['cards'] = cards
        save_data(data)
        return jsonify(cards)

def parse_generated_cards(text):
    """Parse the AI-generated text into structured cards"""
    cards = {'Foundation': [], 'Standard': [], 'Advanced': []}
    lines = text.split('\n')
    current_level = None
    current_q = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect level
        if 'Fondation' in line or 'FONDATION' in line:
            current_level = 'Foundation'
        elif 'Standard' in line or 'STANDARD' in line:
            current_level = 'Standard'
        elif 'Avancé' in line or 'AVANCÉ' in line or 'Avance' in line:
            current_level = 'Advanced'
        # Detect Q&A pairs
        elif line.startswith('Q') and ':' in line:
            current_q = line
        elif line.startswith('R') and ':' in line and current_q and current_level:
            cards[current_level].append({
                'question': current_q.split(':', 1)[1].strip(),
                'answer': line.split(':', 1)[1].strip()
            })
            current_q = None
    
    return cards

def generate_fallback_cards(lesson_text):
    """Generate MCQ flashcards based on lesson text for quick assessment"""
    # Extract key concept from lesson text
    words = lesson_text.split()
    key_concept = ' '.join(words[:5]) if len(words) >= 5 else lesson_text
    
    return {
        'Foundation': [
            {
                'question': f'Qu\'est-ce qu\'une fraction?',
                'options': ['Un nombre entier', 'Une partie d\'un tout', 'Un nombre négatif', 'Un pourcentage'],
                'correct': 1,
                'explanation': 'Une fraction représente une partie d\'un tout.'
            },
            {
                'question': 'Dans la fraction 3/4, quel est le numérateur?',
                'options': ['4', '3', '7', '1'],
                'correct': 1,
                'explanation': 'Le numérateur est le nombre du haut, donc 3.'
            },
            {
                'question': 'Que représente le dénominateur?',
                'options': ['Le nombre de parties prises', 'Le nombre total de parties', 'La somme', 'La différence'],
                'correct': 1,
                'explanation': 'Le dénominateur indique en combien de parties le tout est divisé.'
            },
            {
                'question': 'Quelle fraction représente "la moitié"?',
                'options': ['1/4', '1/2', '2/1', '1/3'],
                'correct': 1,
                'explanation': '1/2 signifie 1 partie sur 2, donc la moitié.'
            },
            {
                'question': 'Comment lit-on 1/4?',
                'options': ['Un quart', 'Un demi', 'Un tiers', 'Un cinquième'],
                'correct': 0,
                'explanation': '1/4 se lit "un quart".'
            }
        ],
        'Standard': [
            {
                'question': 'Quelle est la fraction équivalente à 2/4?',
                'options': ['1/2', '2/8', '4/2', '1/4'],
                'correct': 0,
                'explanation': '2/4 = 1/2 car on peut simplifier en divisant par 2.'
            },
            {
                'question': 'Comment additionner 1/4 + 1/4?',
                'options': ['2/8', '1/2', '2/4', '1/8'],
                'correct': 1,
                'explanation': '1/4 + 1/4 = 2/4 = 1/2 (simplifié).'
            },
            {
                'question': 'Quelle fraction est la plus grande: 1/3 ou 1/4?',
                'options': ['1/4', '1/3', 'Égales', 'Impossible à dire'],
                'correct': 1,
                'explanation': '1/3 est plus grand car le dénominateur est plus petit.'
            },
            {
                'question': 'Comment simplifier 4/8?',
                'options': ['2/4', '1/2', '8/16', 'Les deux: 2/4 et 1/2'],
                'correct': 3,
                'explanation': '4/8 = 2/4 = 1/2 en divisant par 2 puis encore par 2.'
            },
            {
                'question': 'Que signifie "fraction irréductible"?',
                'options': ['Fraction très petite', 'Fraction qu\'on ne peut plus simplifier', 'Fraction négative', 'Fraction décimale'],
                'correct': 1,
                'explanation': 'Une fraction irréductible ne peut plus être simplifiée.'
            }
        ],
        'Advanced': [
            {
                'question': 'Comment multiplier 2/3 × 3/4?',
                'options': ['6/12 = 1/2', '5/7', '2/4', '6/7'],
                'correct': 0,
                'explanation': 'On multiplie les numérateurs (2×3=6) et les dénominateurs (3×4=12), puis on simplifie: 6/12 = 1/2.'
            },
            {
                'question': 'Comment diviser 1/2 ÷ 1/4?',
                'options': ['1/8', '2', '1/6', '4'],
                'correct': 1,
                'explanation': 'Diviser par une fraction = multiplier par son inverse: 1/2 × 4/1 = 4/2 = 2.'
            },
            {
                'question': 'Quelle est la fraction décimale de 3/4?',
                'options': ['0.25', '0.5', '0.75', '0.34'],
                'correct': 2,
                'explanation': '3÷4 = 0.75'
            },
            {
                'question': 'Comment additionner 1/3 + 1/4?',
                'options': ['2/7', '7/12', '5/12', '4/12'],
                'correct': 1,
                'explanation': 'On trouve le dénominateur commun (12): 4/12 + 3/12 = 7/12.'
            },
            {
                'question': 'Quelle fraction est équivalente à 150%?',
                'options': ['1/2', '3/2', '2/3', '15/10'],
                'correct': 1,
                'explanation': '150% = 150/100 = 3/2 (simplifié).'
            }
        ]
    }

@app.route('/student/<name>', methods=['GET'])
def get_student_deck(name):
    data = load_data()
    if name not in data['students']:
        return jsonify({'error': 'Étudiant non trouvé'}), 404
    level = data['students'][name]['level']
    cards = data['cards'].get(level, [])
    return jsonify({'cards': cards[:5]})  # 3-5 cards

@app.route('/update_progress', methods=['POST'])
def update_progress():
    name = request.json.get('name')
    correct = request.json.get('correct')
    data = load_data()
    if name in data['students']:
        progress = data['students'][name]['progress']
        progress.append(correct)
        # Simple adaptive logic: if last 3 correct, level up; if 2 wrong, level down
        if len(progress) >= 3:
            recent = progress[-3:]
            if all(recent):
                levels = ['Foundation', 'Standard', 'Advanced']
                idx = levels.index(data['students'][name]['level'])
                if idx < 2:
                    data['students'][name]['level'] = levels[idx+1]
            elif sum(recent) <= 1:
                idx = levels.index(data['students'][name]['level'])
                if idx > 0:
                    data['students'][name]['level'] = levels[idx-1]
        save_data(data)
    return jsonify({'status': 'OK'})

@app.route('/dashboard', methods=['GET'])
def get_dashboard():
    data = load_data()
    dashboard = {}
    for name, info in data['students'].items():
        progress = info['progress']
        if len(progress) == 0:
            status = 'gray'  # Not started
        elif sum(progress) / len(progress) > 0.7:
            status = 'green'  # On track
        elif sum(progress) / len(progress) > 0.4:
            status = 'yellow'  # Behind
        else:
            status = 'red'  # Needs help
        dashboard[name] = status
    return jsonify(dashboard)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)