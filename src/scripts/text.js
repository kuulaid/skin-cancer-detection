document.addEventListener('DOMContentLoaded', () => {
  const avatarSpeech = document.getElementById('avatarSpeech');
  const avatarAnimation = document.getElementById('avatarAnimation');

  const messages = [
    "Hello! 👋",
    "To begin, you can take a photo 📸",
    "or upload a file from your device 📂",
    "Let's get started!"
  ];

  let currentMessageIndex = 0;

  function typeText(text, index = 0, callback) {
    if (index === 0) {
      avatarAnimation.play(); // Play animation when typing starts
    }

    if (index < text.length) {
      avatarSpeech.innerHTML = text.substring(0, index + 1) + '<span class="typing-cursor"></span>';
      setTimeout(() => typeText(text, index + 1, callback), 50);
    } else {
      avatarSpeech.innerHTML = text; // Remove cursor when done typing
      avatarAnimation.stop(); // Stop animation when typing ends
      avatarAnimation.seek(0); // Reset to frame 0
      if (callback) callback();
    }
  }

  function startTypingSequence() {
    if (currentMessageIndex < messages.length) {
      typeText(messages[currentMessageIndex], 0, () => {
        setTimeout(() => {
          currentMessageIndex++;
          startTypingSequence();
        }, 1500); // Pause between messages
      });
    }
  }

  startTypingSequence();
});
