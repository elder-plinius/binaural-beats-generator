let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillatorLeft, oscillatorRight, gainNode;
let isPlaying = false;

function startBinauralBeats() {
  oscillatorLeft = audioContext.createOscillator();
  oscillatorRight = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillatorLeft.type = 'sine';
  oscillatorRight.type = 'sine';

  updateFrequencies();
  updateVolume();

  oscillatorLeft.connect(gainNode);
  oscillatorRight.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillatorLeft.start();
  oscillatorRight.start();

  isPlaying = true;
}

function stopBinauralBeats() {
  oscillatorLeft.stop();
  oscillatorRight.stop();
  isPlaying = false;
}

function updateFrequencies(frequency, delta) {
  oscillatorLeft.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillatorRight.frequency.setValueAtTime(frequency + delta, audioContext.currentTime);
}

function updateVolume(volume) {
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'start':
      startBinauralBeats();
      break;
    case 'stop':
      stopBinauralBeats();
      break;
    case 'updateFrequencies':
      updateFrequencies(message.frequency, message.delta);
      break;
    case 'updateVolume':
      updateVolume(message.volume);
      break;
  }
});
