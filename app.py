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
    """Generate sample cards based on lesson text for demo purposes"""
    # Extract first few words for context
    context = lesson_text[:50] + "..." if len(lesson_text) > 50 else lesson_text
    
    return {
        'Foundation': [
            {'question': f'Qu\'est-ce que {context}?', 'answer': 'C\'est un concept de base important.'},
            {'question': 'Pouvez-vous donner un exemple simple?', 'answer': 'Oui, par exemple...'},
            {'question': 'Pourquoi est-ce important?', 'answer': 'C\'est important car...'},
            {'question': 'Comment l\'utiliser?', 'answer': 'On l\'utilise en...'},
            {'question': 'Où trouve-t-on cela?', 'answer': 'On le trouve dans...'}
        ],
        'Standard': [
            {'question': f'Expliquez le concept de {context}', 'answer': 'Ce concept signifie que...'},
            {'question': 'Quelles sont les applications pratiques?', 'answer': 'Les applications incluent...'},
            {'question': 'Comment cela fonctionne-t-il?', 'answer': 'Le fonctionnement est basé sur...'},
            {'question': 'Quels sont les avantages?', 'answer': 'Les avantages principaux sont...'},
            {'question': 'Quelles sont les limites?', 'answer': 'Les limites incluent...'}
        ],
        'Advanced': [
            {'question': f'Analysez en profondeur {context}', 'answer': 'Une analyse approfondie révèle que...'},
            {'question': 'Quelles sont les implications théoriques?', 'answer': 'Les implications théoriques sont...'},
            {'question': 'Comment résoudre des problèmes complexes?', 'answer': 'Pour résoudre des problèmes complexes...'},
            {'question': 'Quelles sont les recherches récentes?', 'answer': 'Les recherches récentes montrent...'},
            {'question': 'Comment innover dans ce domaine?', 'answer': 'L\'innovation peut se faire par...'}
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
    app.run(debug=True)