import { handleImageResult, toBase64 } from './result.js';


document.addEventListener('DOMContentLoaded', () => {
  const cameraOptionButtons = document.querySelectorAll('.camera-option');
  const cameraPreviewMessage = document.querySelector('.camera-preview-message');
  const cameraActions = document.querySelector('.camera-actions-container');

  const startCameraButton = document.querySelector('.start-camera');
  const takePhotoButton = document.querySelector('.take-photo');
  const uploadFileButton = document.querySelector('.upload-file');

  const sliderIndicator = document.querySelector('.slider-indicator');
  const avatarSpeech = document.getElementById('avatarSpeech');

  let stream;
  let video;

  // Toggle Camera/File Mode
  cameraOptionButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      cameraOptionButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedOption = button.getAttribute('data-option');
      sliderIndicator.style.left = `${index * 50}%`;

      if (selectedOption === 'camera') {
        cameraPreviewMessage.textContent = 'Preview will appear here.';
        cameraPreviewMessage.classList.remove('drag-drop', 'has-image');

        startCameraButton.style.display = 'block';
        takePhotoButton.style.display = 'block';
        uploadFileButton.style.display = 'none';

        sliderIndicator.style.borderRadius = '10px 0 0 10px';
      } else if (selectedOption === 'file') {
        cameraPreviewMessage.textContent = 'Drag and drop file here or click to select.';
        cameraPreviewMessage.classList.add('drag-drop');
        cameraPreviewMessage.classList.remove('has-image');

        startCameraButton.style.display = 'none';
        takePhotoButton.style.display = 'none';
        uploadFileButton.style.display = 'block';

        sliderIndicator.style.borderRadius = '0 10px 10px 0';

        stopCamera();
      }
    });
  });

  // Start Camera
  startCameraButton.addEventListener('click', async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraPreviewMessage.innerHTML = '<video autoplay playsinline></video>';
      video = cameraPreviewMessage.querySelector('video');
      video.srcObject = stream;
      cameraPreviewMessage.classList.add('video-active');
    }
  });

  // Take Photo
  takePhotoButton.addEventListener('click', () => {
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');

    cameraPreviewMessage.innerHTML = `<img src="${imageDataUrl}" alt="Captured Photo" />`;
    cameraPreviewMessage.classList.remove('video-active');
    cameraPreviewMessage.classList.add('has-image');

    stopCamera();

    classifySkinCancerDataUrl(imageDataUrl);
  });

  // Upload File via Click
  cameraPreviewMessage.addEventListener('click', () => {
    if (cameraPreviewMessage.classList.contains('drag-drop')) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();

      fileInput.addEventListener('change', async () => {
        if (fileInput.files.length > 0) {
          displayUploadedFile(fileInput.files[0]);
          await classifySkinCancer(fileInput.files[0]);
        }
      });
    }
  });

  // Drag and Drop
  cameraPreviewMessage.addEventListener('dragover', (e) => {
    if (cameraPreviewMessage.classList.contains('drag-drop')) {
      e.preventDefault();
      cameraPreviewMessage.style.backgroundColor = '#ddd';
    }
  });

  cameraPreviewMessage.addEventListener('dragleave', (e) => {
    if (cameraPreviewMessage.classList.contains('drag-drop')) {
      e.preventDefault();
      cameraPreviewMessage.style.backgroundColor = '';
    }
  });

  cameraPreviewMessage.addEventListener('drop', async (e) => {
    if (cameraPreviewMessage.classList.contains('drag-drop')) {
      e.preventDefault();
      cameraPreviewMessage.style.backgroundColor = '';
      const file = e.dataTransfer.files[0];
      displayUploadedFile(file);
      await classifySkinCancer(file);
    }
  });

  //Display photo

  function displayUploadedFile(file) {
  const cameraPreviewMessage = document.querySelector('.camera-preview-message');
  const imageUrl = URL.createObjectURL(file);
  cameraPreviewMessage.innerHTML = `<img src="${imageUrl}" alt="Uploaded Image" />`;
  cameraPreviewMessage.classList.add('has-image');
}


  async function classifySkinCancer(file) {
  const base64 = await toBase64(file);
  const previewUrl = URL.createObjectURL(file);
  await handleImageResult(base64, previewUrl);
}

async function classifySkinCancerDataUrl(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const base64 = await toBase64(blob);
  await handleImageResult(base64, dataUrl);
}


  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }



















});
