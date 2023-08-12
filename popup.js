document.addEventListener('DOMContentLoaded', () => {
  let slider = document.getElementById('frequencySlider');
  let display = document.getElementById('frequencyDisplay');
  let playPauseButton = document.getElementById('togglePlayPause');

  // Load the stored frequency value and set the slider and display accordingly
  chrome.storage.sync.get('frequency', (data) => {
    slider.value = data.frequency || 440;  // Default to 440Hz if no value is stored
    display.textContent = `Frequency: ${slider.value} Hz`;
  });

  // Update the frequency value when the slider is moved
  slider.oninput = () => {
    display.textContent = `Frequency: ${slider.value} Hz`;
    chrome.storage.sync.set({frequency: slider.value});
  };

  // Handle the play/pause button click
  playPauseButton.addEventListener('click', function() {
    // Send a message to the background script to toggle play/pause
    chrome.runtime.sendMessage({action: 'togglePlayPause'}, (response) => {
      if (response && response.status === 'playing') {
        playPauseButton.textContent = 'Pause';
      } else {
        playPauseButton.textContent = 'Play';
      }
    });

    // Send a message to resume the AudioContext in the background script
    chrome.runtime.sendMessage({action: 'resumeAudioContext'});
  });
});
