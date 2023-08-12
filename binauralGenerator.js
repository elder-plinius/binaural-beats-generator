let context;
if (typeof AudioContext !== 'undefined') {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
  context = new webkitAudioContext(); // for older versions of Chrome
} else {
  console.error("Web Audio API is not supported in this browser");
}


let leftOscillator = context.createOscillator();
let rightOscillator = context.createOscillator();

let leftPan = context.createStereoPanner();
let rightPan = context.createStereoPanner();

leftPan.pan.setValueAtTime(-1, context.currentTime);
rightPan.pan.setValueAtTime(1, context.currentTime);

leftOscillator.connect(leftPan);
rightOscillator.connect(rightPan);

leftPan.connect(context.destination);
rightPan.connect(context.destination);

let isPlaying = false;

function togglePlayPause() {
  if (isPlaying) {
    leftOscillator.stop();
    rightOscillator.stop();
    isPlaying = false;
  } else {
    leftOscillator = context.createOscillator();
    rightOscillator = context.createOscillator();
    // ... (set frequencies, connect to panners, etc.)
    leftOscillator.start();
    rightOscillator.start();
    isPlaying = true;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'togglePlayPause') {
    togglePlayPause();
    sendResponse({status: isPlaying ? 'playing' : 'paused'});
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.baseFrequency || changes.beatFrequency) {
    let baseFrequency = changes.baseFrequency ? changes.baseFrequency.newValue : leftOscillator.frequency.value + rightOscillator.frequency.value / 2;
    let beatFrequency = changes.beatFrequency ? changes.beatFrequency.newValue : rightOscillator.frequency.value - leftOscillator.frequency.value;

    leftOscillator.frequency.value = baseFrequency - (beatFrequency / 2);
    rightOscillator.frequency.value = baseFrequency + (beatFrequency / 2);
  }
});
