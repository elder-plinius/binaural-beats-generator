let context = new AudioContext();
let oscillator1, oscillator2;
let isPlaying = false;

function startBinauralBeats(frequency) {
  oscillator1 = context.createOscillator();
  oscillator2 = context.createOscillator();

  oscillator1.frequency.setValueAtTime(440, context.currentTime);
  oscillator2.frequency.setValueAtTime(440 + frequency, context.currentTime);

  oscillator1.connect(context.destination);
  oscillator2.connect(context.destination);

  oscillator1.start();
  oscillator2.start();
}

function stopBinauralBeats() {
  if (oscillator1) oscillator1.stop();
  if (oscillator2) oscillator2.stop();
}

document.addEventListener('DOMContentLoaded', () => {
  let slider = document.getElementById('frequencySlider');
  let display = document.getElementById('frequencyDisplay');
  let playPauseButton = document.getElementById('togglePlayPause');

  chrome.storage.sync.get('frequency', (data) => {
    slider.value = data.frequency || 440;
    display.textContent = `Frequency: ${slider.value} Hz`;
  });

  slider.oninput = () => {
    display.textContent = `Frequency: ${slider.value} Hz`;
    chrome.storage.sync.set({frequency: slider.value});
  };

  playPauseButton.addEventListener('click', function() {
    if (isPlaying) {
      stopBinauralBeats();
      isPlaying = false;
      playPauseButton.textContent = 'Play';
    } else {
      startBinauralBeats(Number(slider.value));
      isPlaying = true;
      playPauseButton.textContent = 'Pause';
    }
  });
});
