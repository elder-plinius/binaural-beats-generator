let context;
if (typeof AudioContext !== 'undefined') {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
  context = new webkitAudioContext(); // for older versions of Chrome
} else {
  console.error("Web Audio API is not supported in this browser");
}

let oscillator1, oscillator2;
let isPlaying = false;

function startBinauralBeats(frequency) {
  oscillator1 = context.createOscillator();
  oscillator2 = context.createOscillator();

  oscillator1.frequency.setValueAtTime(440, context.currentTime); // 440Hz
  oscillator2.frequency.setValueAtTime(440 + frequency, context.currentTime); // 440Hz + binaural frequency

  oscillator1.connect(context.destination);
  oscillator2.connect(context.destination);

  oscillator1.start();
  oscillator2.start();
}

function stopBinauralBeats() {
  if (oscillator1) oscillator1.stop();
  if (oscillator2) oscillator2.stop();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'togglePlayPause') {
    if (isPlaying) {
      stopBinauralBeats();
      isPlaying = false;
      sendResponse({status: 'paused'});
    } else {
      chrome.storage.sync.get('frequency', (data) => {
        startBinauralBeats(Number(data.frequency));
        isPlaying = true;
        sendResponse({status: 'playing'});
      });
    }
  } else if (message.action === 'resumeAudioContext' && context.state === 'suspended') {
    context.resume();
  }
});

