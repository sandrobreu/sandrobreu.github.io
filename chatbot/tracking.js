async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Zeige die Benutzer-Nachricht im Chat-Fenster
    displayMessage('Du', userInput);

     // Überprüfe die Zustimmung des Benutzers
    const consent = localStorage.getItem('userConsent');
    if (consent === 'accepted') {
        // Sende die Eingabe an das Backend zur Protokollierung
        await fetch('https://dein-backend-url.com/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput }),
        });
    }

    // Sende die Nachricht an das Backend zur Verarbeitung
    const response = await fetch('https://dein-backend-url.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
    });
    const data = await response.json();

    // Zeige die Antwort des Chatbots
    displayMessage('Chatbot', data.reply);

    // Eingabefeld leeren
    document.getElementById('user-input').value = '';

    // **Zusätzlich:** Sende die Eingabe an einen Logging-Endpunkt
    await fetch('https://dein-backend-url.com/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
    })

    // Tracke das Ereignis in Google Analytics
    gtag('event', 'chat_message', {
      'event_category': 'Chat',
      'event_label': 'User Message',
      'value': userInput.length // Zum Beispiel die Länge der Nachricht
    });
}