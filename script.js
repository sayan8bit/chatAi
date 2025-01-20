// Voice recognition setup
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = false;

let isListening = false;

recognition.onstart = function () {
  console.log("Voice recognition started");
};

recognition.onresult = function (event) {
  const voiceInput = event.results[0][0].transcript;
  document.getElementById("user-input").value = voiceInput;
  sendMessage(); // Send the recognized input as a message
};

recognition.onerror = function (event) {
  console.error("Speech recognition error: " + event.error);
};

// Function to start voice recognition
function startVoiceRecognition() {
  if (!isListening) {
    recognition.start();
    isListening = true;
  }
}

// Function to stop voice recognition
function stopVoiceRecognition() {
  if (isListening) {
    recognition.stop();
    isListening = false;
  }
}

// Handle the mic button on both desktop and mobile
document.getElementById("mic-button").addEventListener("mousedown", startVoiceRecognition); // For desktop (mouse)
document.getElementById("mic-button").addEventListener("mouseup", stopVoiceRecognition); // For desktop (mouse)

document.getElementById("mic-button").addEventListener("touchstart", startVoiceRecognition); // For mobile (touch)
document.getElementById("mic-button").addEventListener("touchend", stopVoiceRecognition); // For mobile (touch)

// Handle the chat functionality
function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (userInput) {
    addMessage("You", userInput);
    handleChat(userInput);
    document.getElementById("user-input").value = "";
  }
}

function addMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender.toLowerCase());
  messageElement.innerText = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function handleChat(message) {
  const response = generateResponse(message);
  addMessage("Bot", response);
  speakText(response);
}

function generateResponse(userInput) {
  return "Your message: " + userInput; // For demonstration purposes
}

function speakText(message) {
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

// Clear chat history (for testing)
function clearChatData() {
  if (confirm("Are you sure you want to clear all chat data?")) {
    chatbox.innerHTML = "";
  }
}
