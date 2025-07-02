// result.js
import { showPredictionMessage } from './text.js';

export async function handleImageResult(base64, imageSrc) {
  try {
    const res = await fetch('http://localhost:3000/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64 }),
    });

    const data = await res.json();
    console.log("Raw response from server:", data);
    const predictions = Array.isArray(data) ? data : data.result;

    showPredictionMessage(predictions);
  } catch (err) {
    console.error(err);
    showPredictionMessage([]); // fallback message
  }
}

export function toBase64(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileOrBlob);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
}
