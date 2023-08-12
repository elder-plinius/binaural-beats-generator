let context = new AudioContext();
let oscillator = context.createOscillator();
let gainNode = context.createGain();

oscillator.connect(gainNode);
gainNode.connect(context.destination);

chrome.storage.sync.get('frequency', (data) => {
  oscillator.frequency.value = data.frequency;
});

oscillator.start();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.frequency) {
    oscillator.frequency.value = changes.frequency.newValue;
  }
});