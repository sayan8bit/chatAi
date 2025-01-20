// Check for microphone permissions and start voice recognition
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = false;

let isListening = false;
let isTouchDevice = "ontouchstart" in window; // Check if it's a touch device

// Start voice recognition
recognition.onstart = function () {
  console.log("Voice recognition started");
  isListening = true;
};

// Handle recognized voice input
recognition.onresult = function (event) {
  const voiceInput = event.results[0][0].transcript;
  document.getElementById("user-input").value = voiceInput; // Display recognized text
  sendMessage();
};

// Handle errors
recognition.onerror = function (event) {
  console.error("Speech recognition error: " + event.error);
};

// Start and stop voice recognition on mobile or desktop
function startVoiceRecognition() {
  if (!isListening) {
    recognition.start();
  }
}

function stopVoiceRecognition() {
  if (isListening) {
    recognition.stop();
  }
}

// Event listeners for mic button to work on mobile and desktop
document.getElementById("mic-button").addEventListener("mousedown", startVoiceRecognition); // For desktop (mouse)
document.getElementById("mic-button").addEventListener("mouseup", stopVoiceRecognition); // For desktop (mouse)

if (isTouchDevice) {
  document.getElementById("mic-button").addEventListener("touchstart", startVoiceRecognition); // For mobile (touch start)
  document.getElementById("mic-button").addEventListener("touchend", stopVoiceRecognition); // For mobile (touch end)
}

// Voice input processing from the mic button
document.getElementById("mic-button").addEventListener("click", () => {
  if (!isListening) {
    startVoiceRecognition(); // For initial click, start recognition
  } else {
    stopVoiceRecognition(); // For further clicks, stop the recognition
  }
});

// Send message using the input box
function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (userInput) {
    addMessage("You", userInput);
    handleChat(userInput);
    document.getElementById("user-input").value = "";
  }
}

// Add message to the chatbox
function addMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender.toLowerCase());
  messageElement.innerText = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Generate response (simple echo logic for testing)
function handleChat(message) {
  const response = "You said: " + message;
  addMessage("Bot", response);
  speakText(response);
}

// Speak out the response text (Text-to-Speech)
function speakText(message) {
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

// Test functionality to clear chat data (for example purposes)
function clearChatData() {
  if (confirm("Are you sure you want to clear chat data?")) {
    chatbox.innerHTML = "";
  }
}

// Debugging: log status of mic usage
recognition.onend = function() {
  console.log("Voice recognition ended");
  isListening = false;
};
