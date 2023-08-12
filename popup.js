document.addEventListener('DOMContentLoaded', () => {
  let slider = document.getElementById('frequencySlider');
  let display = document.getElementById('frequencyDisplay');
  let playPauseButton = document.getElementById('togglePlayPause');

  chrome.storage.sync.get('frequency', (data) => {
    slider.value = data.frequency;
    display.textContent = `Frequency: ${data.frequency} Hz`;
  });

  slider.oninput = () => {
    display.textContent = `Frequency: ${slider.value} Hz`;
    chrome.storage.sync.set({frequency: slider.value});
  };

  playPauseButton.addEventListener('click', function() {
    // Send a message to the background script to toggle play/pause
    chrome.runtime.sendMessage({action: 'togglePlayPause'}, (response) => {
      if (response.status === 'playing') {
        playPauseButton.textContent = 'Pause';
      } else {
        playPauseButton.textContent = 'Play';
      }
    });
  });
});
