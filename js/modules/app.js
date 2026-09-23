// app.js - Master Application Entry Point integrating all moodules

import { whdSlogans, defaultTags } from './modules/dataManager.js';
import { renderHashtags } from './modules/hashtagUI.js';
import { CanvasRenderer } from './modules/canvasRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('creatorCanvas');
  const hashtagContainer = document.getElementById('hashtag-container');
  const shuffleBtn = document.getElementById('shuffleSloganBtn');
  const zoomRange = document.getElementById('zoomRange');
  const zoomValue = document.getElementById('zoomValue');
  const userNameInput = document.getElementById('userName');
  const cameraBtn = document.getElementById('cameraBtn');
  const galleryBtn = document.getElementById('galleryBtn');
  const cameraInput = document.getElementById('cameraInput');
  const galleryInput = document.getElementById('galleryInput');

  // Application State
  const state = {
    userImage: null,
    userVideo: null,
    photoScale: 1,
    photoOffsetX: 0,
    photoOffsetY: 0,
    currentSloganIndex: Math.floor(Math.random() * whdSlogans.length),
    userName: ''
  };

  // Initialize Canvas Renderer
  const renderer = new CanvasRenderer(canvas);

  function updateCanvas() {
    renderer.draw({
      ...state,
      sloganText: whdSlogans[state.currentSloganIndex],
      userName: userNameInput.value
    });
  }

  // Render Hashtag Component with flexible flow layout
  renderHashtags(defaultTags, hashtagContainer, (clickedTag) => {
    console.log(`Tag selected: ${clickedTag}`);
  });

  // Event Listeners
  shuffleBtn.addEventListener('click', () => {
    state.currentSloganIndex = (state.currentSloganIndex + 1) % whdSlogans.length;
    updateCanvas();
  });

  zoomRange.addEventListener('input', (e) => {
    state.photoScale = parseFloat(e.target.value);
    zoomValue.textContent = `${state.photoScale.toFixed(1)}×`;
    updateCanvas();
  });

  userNameInput.addEventListener('input', updateCanvas);

  cameraBtn.addEventListener('click', () => cameraInput.click());
  galleryBtn.addEventListener('click', () => galleryInput.click());

  cameraInput.addEventListener('change', handleMedia);
  galleryInput.addEventListener('change', handleMedia);

  function handleMedia(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.src = ev.target.result;
      img.onload = () => {
        state.userImage = img;
        updateCanvas();
      };
    };
    reader.readAsDataURL(file);
  }

  // Initial draw
  updateCanvas();
  console.log('WHD 2026 Modular Creator Studio Initialized Successfully.');
});
