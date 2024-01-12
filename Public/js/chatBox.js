
document.getElementById('message-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submit action

    var messageInput = document.getElementById('message-input');
    var message = messageInput.value.trim();

    if (message) {
        // Display user's message
        displayMessage(message, true);  // true indicates it's a user message
        showTypingIndicator();
        sendMessageToServer(message);
        messageInput.value = ''; // Clear the input field after sending
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendMessageToServer(message) {
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(async data => {
        await delay(2000);
        hideTypingIndicator();
        // Display ChatGPT's response
        if (data.reply) {
            displayMessage(data.reply, false);  // false indicates it's not a user message
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally display an error message in the chatbox
        displayMessage('Error getting response', false);
        hideTypingIndicator();
    });
}

function displayMessage(message, isUserMessage) {
    var chatMessages = document.getElementById('chat-messages');
    
    var messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = message;

    if (isUserMessage) {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('server-message');
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
}

function toggleChatBox() {
    var chatBox = document.querySelector('.chat-box');
    chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}


// Hide chat box initially
document.querySelector('.chat-box').style.display = 'none';