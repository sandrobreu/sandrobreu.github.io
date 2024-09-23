from flask import Flask, request, jsonify
from transformers import pipeline
import json

app = Flask(__name__)

# Lade das Frage-Antwort-Modell
qa_pipeline = pipeline("question-answering")

# Beispiel-Dokumentation (Wissensbasis)
with open('knowledge_base.json', 'r') as f:
    knowledge_base = json.load(f)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    # Einfaches Retrieval: Suche nach dem relevantesten Kontext
    context = ' '.join(knowledge_base)

    # Generiere die Antwort
    answer = qa_pipeline({
        'question': user_message,
        'context': context
    })

    bot_response = answer['answer']

    return jsonify({'reply': bot_response})

if __name__ == '__main__':
    app.run(debug=True)

from flask_cors import CORS

app = Flask(__name__)
CORS(app)