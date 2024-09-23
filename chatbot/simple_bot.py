#pip install flask

from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Beispielantworten des Chatbots
RESPONSES = [
    "Hallo! Wie kann ich dir helfen?",
    "Das klingt interessant!",
    "Kannst du mir mehr darüber erzählen?",
    "Ich bin hier, um deine Fragen zu beantworten."
]


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    # Hier könntest du deine RAG-Pipeline integrieren
    # Für dieses einfache Beispiel wählen wir eine zufällige Antwort

    bot_response = random.choice(RESPONSES)

    return jsonify({'reply': bot_response})


if __name__ == '__main__':
    app.run(debug=True)