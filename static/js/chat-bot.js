  document.addEventListener('DOMContentLoaded', () => {
            const chatHistory = document.getElementById('chat-history');
            const userInput = document.getElementById('user-input');
            const sendButton = document.getElementById('send-button');
            const microphoneButton = document.getElementById('microphone-button');
            // const particleBg = document.getElementById('particle-bg');
            const aboutButton = document.getElementById('about-button');
            const githubButton = document.getElementById('github-button');
            const aboutModal = document.getElementById('about-modal');
            const githubModal = document.getElementById('github-modal');


            // --- Chat Functionality ---
            function appendMessage(sender, message) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container', sender);
                messageContainer.style.animationDelay = '0.1s'; // Slight delay for animation effect

                const avatar = document.createElement('div');
                avatar.classList.add('message-avatar');
                avatar.textContent = sender === 'user' ? 'You' : 'A';

                const messageBubble = document.createElement('div');
                messageBubble.classList.add('message-bubble');
                messageBubble.textContent = message;

                if (sender === 'user') {
                    messageContainer.appendChild(messageBubble);
                    messageContainer.appendChild(avatar);
                } else {
                    messageContainer.appendChild(avatar);
                    messageContainer.appendChild(messageBubble);
                }
                chatHistory.appendChild(messageContainer);
                chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
            }

            function showLoadingIndicator() {
                const loadingContainer = document.createElement('div');
                loadingContainer.classList.add('message-container', 'agent');
                loadingContainer.id = 'loading-indicator';

                const avatar = document.createElement('div');
                avatar.classList.add('message-avatar');
                avatar.textContent = 'A';

                const loadingBubble = document.createElement('div');
                loadingBubble.classList.add('loading-indicator');
                loadingBubble.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;

                loadingContainer.appendChild(avatar);
                loadingContainer.appendChild(loadingBubble);
                chatHistory.appendChild(loadingContainer);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }

            function removeLoadingIndicator() {
                const loadingIndicator = document.getElementById('loading-indicator');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
            }

            const aiResponses = [
                "I'm still under development, but I'm learning fast!",
                "That's an interesting query. Can you tell me more?",
                "My current capabilities allow me to process text and provide information.",
                "Thank you for your input. I'm always improving.",
                "I'm designed to assist with a variety of tasks. What's on your mind?",
                "Processing your request... Please hold.",
                "My knowledge base is constantly expanding.",
                "I understand. Let me look into that for you.",
                "Is there anything else I can assist with?",
                "I am ready for your next command."
            ];

            function getAiResponse(userMessage) {
                // Simple keyword-based responses
                userMessage = userMessage.toLowerCase();
                if (userMessage.includes("hello") || userMessage.includes("hi")) {
                    return "Hello there! How may I be of service?";
                } else if (userMessage.includes("how are you")) {
                    return "As an AI, I don't experience feelings, but I'm operating optimally. How are you?";
                } else if (userMessage.includes("your name")) {
                    return "I am Alogio Assistant.";
                } else if (userMessage.includes("github")) {
                    return "You can find more about my developer on GitHub: https://ailogio.github.io/";
                } else if (userMessage.includes("time")) {
                    const now = new Date();
                    return `The current time is ${now.toLocaleTimeString()}.`;
                } else if (userMessage.includes("date")) {
                    const now = new Date();
                    return `Today's date is ${now.toLocaleDateString()}.`;
                } else {
                    const randomIndex = Math.floor(Math.random() * aiResponses.length);
                    return aiResponses[randomIndex];
                }
            }



            // 1. Create a variable to hold the preferred voice globally
let selectedVoice = null;

// 2. Function to load the voice specifically
function loadVoice() {
    const voices = window.speechSynthesis.getVoices();
    selectedVoice = voices.find(v => v.name.includes("Daniel")) ||
                    voices.find(v => v.lang === "en-GB") ||
                    voices.find(v => v.lang.startsWith("en"));
}

// 3. Trigger loading immediately and when voices change
loadVoice();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoice;
}

function sendMessage() {
    // ... your existing code (message logic, showLoading, etc.) ...
      const message = userInput.value.trim();
                if (message === '') return;

                appendMessage('user', message);
                userInput.value = '';

                showLoadingIndicator();

    setTimeout(() => {
        removeLoadingIndicator();
        const aiResponse = getAiResponse(message);
        appendMessage('agent', aiResponse);

        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(aiResponse);
            
            // Use the pre-loaded voice if it exists
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                // Final fallback just in case
                loadVoice();
                utterance.voice = selectedVoice;
            }

            utterance.rate = 0.84;
            utterance.pitch = 1.0;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }, Math.random() * 1500 + 800);
}



            sendButton.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            // --- Voice Input (Web Speech API Simulation) ---
            let recognition;
            let isRecording = false;

            if ('webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = false; // Only one result per recording
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    isRecording = true;
                    microphoneButton.classList.add('recording');
                    userInput.placeholder = "Listening...";
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    userInput.value = transcript;
                    sendMessage(); // Send message automatically after speech
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    userInput.placeholder = "Error listening. Type your message.";
                    if (event.error === 'not-allowed') {
                        // User denied microphone access
                        alert('Microphone access denied. Please allow microphone in your browser settings to use voice input.');
                    } else {
                         // Fallback for alerts. In a real app, use a custom modal.
                        alert(`Voice input error: ${event.error}. Please type your message.`);
                    }
                };

                recognition.onend = () => {
                    isRecording = false;
                    microphoneButton.classList.remove('recording');
                    userInput.placeholder = "Type your message...";
                };

                microphoneButton.addEventListener('click', () => {
                    if (isRecording) {
                        recognition.stop();
                    } else {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.error('Recognition start error:', e);
                            alert('Failed to start voice recognition. Please ensure your browser supports it and microphone access is granted.');
                        }
                    }
                });
            } else {
                // Browser doesn't support Web Speech API
                microphoneButton.style.display = 'none'; // Hide microphone button
                console.warn('Web Speech API not supported in this browser.');
                userInput.placeholder = "Voice input not supported. Type your message...";
            }

        });
