function sendMessage(action, data) {
  chrome.runtime.sendMessage({ action, ...data });
}

document.getElementById('togglePlayPause').addEventListener('click', function() {
  if (this.textContent === 'Play') {
    sendMessage('start');
    this.textContent = 'Pause';
  } else {
    sendMessage('stop');
    this.textContent = 'Play';
  }
});

document.getElementById('frequencySlider').addEventListener('input', function() {
  let frequency = parseFloat(this.value);
  let delta = parseFloat(document.getElementById('deltaSlider').value);
  document.getElementById('frequencyDisplay').textContent = `Frequency: ${frequency} Hz`;
  sendMessage('updateFrequencies', { frequency, delta });
});

document.getElementById('deltaSlider').addEventListener('input', function() {
  let frequency = parseFloat(document.getElementById('frequencySlider').value);
  let delta = parseFloat(this.value);
  document.getElementById('deltaDisplay').textContent = `Delta: ${delta} Hz`;
  sendMessage('updateFrequencies', { frequency, delta });
});

document.getElementById('volumeSlider').addEventListener('input', function() {
  let volume = parseFloat(this.value);
  document.getElementById('volumeDisplay').textContent = `Volume: ${Math.round(volume * 100)}%`;
  sendMessage('updateVolume', { volume });
});

document.getElementById('randomize').addEventListener('click', function() {
  let randomFrequency = Math.floor(Math.random() * 100) + 1;
  let randomDelta = Math.floor(Math.random() * 30) + 1;

  document.getElementById('frequencySlider').value = randomFrequency;
  document.getElementById('deltaSlider').value = randomDelta;

  document.getElementById('frequencyDisplay').textContent = `Frequency: ${randomFrequency} Hz`;
  document.getElementById('deltaDisplay').textContent = `Delta: ${randomDelta} Hz`;

  sendMessage('updateFrequencies', { frequency: randomFrequency, delta: randomDelta });
});
