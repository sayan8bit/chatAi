// Initialize storage and knowledge base
if (!localStorage.getItem("chatHistory")) {
  localStorage.setItem("chatHistory", JSON.stringify([]));
}
if (!localStorage.getItem("knowledgeBase")) {
  localStorage.setItem("knowledgeBase", JSON.stringify({}));
}

const chatbox = document.getElementById("chatbox");

// Send message from input field
function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (userInput) {
    addMessage("You", userInput);
    handleChat(userInput);
    document.getElementById("user-input").value = "";
  }
}

// Handle chat and knowledge base updates
function handleChat(message) {
  let response = generateResponse(message);

  // Store conversation history
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory"));
  chatHistory.push({ user: message, bot: response });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

  // Store learned knowledge
  storeLearnedKnowledge(message, response);

  // Display bot's response
  addMessage("Bot", response);
  speakText(response);
}

// Generate bot response from knowledge base
function generateResponse(userInput) {
  const knowledgeBase = JSON.parse(localStorage.getItem("knowledgeBase"));

  if (knowledgeBase[userInput.toLowerCase()]) {
    return knowledgeBase[userInput.toLowerCase()];
  }

  return " ";
}

// Store learned knowledge
function storeLearnedKnowledge(userInput, response) {
  const knowledgeBase = JSON.parse(localStorage.getItem("knowledgeBase"));

  if (response.startsWith(" ")) {
    const teachingResponse = prompt(
      `I don't know the answer to "${userInput}". Please provide an answer:`
    );

    if (teachingResponse) {
      knowledgeBase[userInput.toLowerCase()] = teachingResponse;
      localStorage.setItem("knowledgeBase", JSON.stringify(knowledgeBase));
      addMessage(
        "Bot",
        `Got it! The answer to "${userInput}" is: "${teachingResponse}".`
      );
    }
  }
}

// Display messages in the chatbox
function addMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender.toLowerCase());
  messageElement.innerText = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Text-to-speech function
function speakText(message) {
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

// Load chat history from local storage
function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory"));
  chatHistory.forEach((entry) => {
    addMessage("You", entry.user);
    addMessage("Bot", entry.bot);
  });
}

// Clear data stored in localStorage
function clearChatData() {
  if (
    confirm(
      "Are you sure you want to clear all data? This will reset all messages and learned knowledge."
    )
  ) {
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("knowledgeBase");
    alert("Data has been cleared.");
    window.location.reload();
  }
}

// Voice recognition for asking questions
let recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = false;

recognition.onstart = function () {
  console.log("Voice recognition started");
};

recognition.onresult = function (event) {
  const voiceInput = event.results[0][0].transcript;
  document.getElementById("user-input").value = voiceInput;
  sendMessage();
};

recognition.onerror = function (event) {
  console.error("Speech recognition error: " + event.error);
};

// Start voice recognition
function startVoiceRecognition() {
  recognition.start();
}

// Load chat history on page load
window.onload = loadChatHistory;
//perfect
