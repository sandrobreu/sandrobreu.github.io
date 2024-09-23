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
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


        # Einfaches Retrieval: Suche nach dem relevantesten Kontext
        context = ' '.join(knowledge_base)

        # Generiere die Antwort
        answer = qa_pipeline({
            'question': user_message,
            'context': context
        })

        bot_response = answer['answer']

        # Speichere die Nachricht in einer Datei oder Datenbank
        with open('user_logs.txt', 'a', encoding='utf-8') as f:
            f.write(f"{timestamp} - {user_message} - {bot_response}\n")

        return jsonify({'reply': bot_response})
    except Exception as e:
        print(f"Fehler: {e}")
        return jsonify({'reply': 'Entschuldigung, es ist ein Fehler aufgetreten.'})


if __name__ == '__main__':
    app.run(debug=True)

from flask_cors import CORS

app = Flask(__name__)
CORS(app)