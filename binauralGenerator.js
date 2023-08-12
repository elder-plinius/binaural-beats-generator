let context = new AudioContext();

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

chrome.storage.sync.get(['baseFrequency', 'beatFrequency'], (data) => {
  let baseFrequency = data.baseFrequency || 300;
  let beatFrequency = data.beatFrequency || 10;

  leftOscillator.frequency.value = baseFrequency - (beatFrequency / 2);
  rightOscillator.frequency.value = baseFrequency + (beatFrequency / 2);
});

leftOscillator.start();
rightOscillator.start();

chrome.storage.onChanged.addListener((changes) => {
  if (changes.baseFrequency || changes.beatFrequency) {
    let baseFrequency = changes.baseFrequency ? changes.baseFrequency.newValue : leftOscillator.frequency.value + rightOscillator.frequency.value / 2;
    let beatFrequency = changes.beatFrequency ? changes.beatFrequency.newValue : rightOscillator.frequency.value - leftOscillator.frequency.value;

    leftOscillator.frequency.value = baseFrequency - (beatFrequency / 2);
    rightOscillator.frequency.value = baseFrequency + (beatFrequency / 2);
  }
});
