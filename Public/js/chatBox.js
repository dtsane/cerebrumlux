
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

function sendEmailToServer(name,email,date,time) {

    const data = {
        name: name,
        email:email,
        date:date,
        time:time,
    }
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
        //displayMessage('Error getting response', false);
        hideTypingIndicator();
    });
}

function createMeetingButton() {
    var button = document.createElement('button');
    var chatBox = document.querySelector('.chat-box');
    button.textContent = 'Schedule Meeting';
    button.classList.add('meeting-button');
    button.onclick = function() {
        // Handle button click event
        showModal();
        toggleChatBox();
    };
    return button;
}

function displayMessage(message, isUserMessage) {
    var chatMessages = document.getElementById('chat-messages');
    
    var messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Create an icon or image element
    if (!isUserMessage) {
        var img = document.createElement('img');
        img.src = 'assets/img/chat-profile.jpg'; // Path to your server image
        img.className = 'profile-icon';
        messageDiv.appendChild(img);
    } 

    // Add message text
    var textSpan = document.createElement('span');
    textSpan.textContent = message;
    messageDiv.appendChild(textSpan);

    if (isUserMessage) {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('server-message');
        
        // Check for specific server response
        if (message.includes("meeting" || message.includes("for us to connect")|| message.includes("meeting time")|| message.includes(" your contact details"))) {
            var button = createMeetingButton();
            messageDiv.appendChild(button);
        }


        // Append additional info for server messages
        var infoDiv = document.createElement('div');
        infoDiv.textContent = "Micheal Rogers - " + getCurrentTime();
        infoDiv.classList.add('message-info');
        messageDiv.appendChild(infoDiv);

        
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
}

function getCurrentTime() {
    var now = new Date();
    return now.toLocaleTimeString(); // Returns time in HH:MM:SS format
}

// Show the modal
function showModal() {
    var modal = document.getElementById("scheduleModal");
    modal.style.display = "block";

    // Initialize the date picker
    flatpickr('#date-picker', {
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: new Date().fp_incr(14) 
    });

    // Initialize the date and time picker
    flatpickr('#time-picker', {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        minTime: "9:00",
        maxTime: "19:30",
    });
}

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].onclick = function() {
    var modal = document.getElementById("scheduleModal");
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("scheduleModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Handling the confirmation of the date and time
document.getElementById('confirmButton').addEventListener('submit', function(event) {
   
    event.preventDefault(); // Prevent the default form submit action
    let name = document.getElementById('chat-name');
    let email = document.getElementById('chat-email');
    let selectedDate = document.getElementById('date-picker');
    let selectedTime = document.getElementById('time-picker');
    
    // You can add logic here to send this data to the server or process it further
    sendEmailToServer(name.value.trim(),email.value.trim(),selectedDate.value.trim(),selectedTime.value.trim());
    displayMessage("A confirmation email has been sent to: " + email.value.trim(), false);
    toggleChatBox();
    
    // Close the modal
    var modal = document.getElementById("scheduleModal");
    modal.style.display = "none";
});

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