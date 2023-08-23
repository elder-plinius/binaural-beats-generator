let audioContext = null;
let oscillatorLeft = null;
let oscillatorRight = null;
let gainNode = null;

function startBinauralBeats(frequency = 440, delta = 10) {
  if (audioContext) {
    stopBinauralBeats();
  }

  audioContext = new AudioContext();

  oscillatorLeft = audioContext.createOscillator();
  oscillatorRight = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillatorLeft.frequency.value = frequency;
  oscillatorRight.frequency.value = frequency + delta;

  oscillatorLeft.connect(gainNode);
  oscillatorRight.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillatorLeft.start();
  oscillatorRight.start();
}

function stopBinauralBeats() {
  if (oscillatorLeft) oscillatorLeft.stop();
  if (oscillatorRight) oscillatorRight.stop();
  if (audioContext) audioContext.close();

  oscillatorLeft = null;
  oscillatorRight = null;
  audioContext = null;
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    switch (message.action) {
      case 'start':
        startBinauralBeats();
        break;
      case 'stop':
        stopBinauralBeats();
        break;
      case 'updateFrequencies':
        if (oscillatorLeft && oscillatorRight) {
          oscillatorLeft.frequency.value = message.frequency;
          oscillatorRight.frequency.value = message.frequency + message.delta;
        }
        break;
      case 'updateVolume':
        if (gainNode) {
          gainNode.gain.value = message.volume;
        }
        break;
    }
  });
});
