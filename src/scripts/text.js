// text.js
const avatarSpeech = document.getElementById('avatarSpeech');
const avatarAnimation = document.getElementById('avatarAnimation');

const defaultMessages = [
  "Hello! 👋",
  "To begin, you can take a photo 📸",
  "or upload a file from your device 📂",
  "Let's get started!"
];

let currentMessageIndex = 0;

function typeText(text, index = 0, callback) {
  if (index === 0) avatarAnimation.play();

  const formattedText = text.replace(/\n/g, '<br>'); // <-- ADD THIS

  if (index < formattedText.length) {
    avatarSpeech.innerHTML =
      formattedText.substring(0, index + 1) + '<span class="typing-cursor"></span>';
    setTimeout(() => typeText(text, index + 1, callback), 40);
  } else {
    avatarSpeech.innerHTML = formattedText; // Final render with line breaks
    avatarAnimation.stop();
    avatarAnimation.seek(0);
    if (callback) callback();
  }
}


function startTypingSequence() {
  if (currentMessageIndex < defaultMessages.length) {
    typeText(defaultMessages[currentMessageIndex], 0, () => {
      setTimeout(() => {
        currentMessageIndex++;
        startTypingSequence();
      }, 1500);
    });
  }
}

function showPredictionMessage(predictions) {
  if (!Array.isArray(predictions) || predictions.length === 0) {
    typeText("Sorry, I couldn't detect anything.");
    return;
  }

  // Normalize
  const normalized = predictions.map(p => ({
    label: p.label,
    probability: p.probability ?? p.score ?? 0
  }));

  // Sort by probability descending
  const sorted = normalized.sort((a, b) => b.probability - a.probability);

  // Build ranking message
  const lines = sorted.slice(0, 3).map((pred, index) => {
    const rank = ['1st', '2nd', '3rd'][index] || `${index + 1}th`;
    const percent = (pred.probability * 100).toFixed(1);
    return `${rank}: ${pred.label} (${percent}%)`;
  });

  const message = `Top Results:\n${lines.join('\n')}`;
  typeText(message);
}



document.addEventListener('DOMContentLoaded', () => {
  startTypingSequence();
});

export { typeText, showPredictionMessage };
