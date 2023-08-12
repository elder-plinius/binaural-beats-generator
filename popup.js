let context = new AudioContext();
let oscillator1, oscillator2;
let isPlaying = false;
let panNode1 = context.createStereoPanner();
let panNode2 = context.createStereoPanner();
let gainNode = context.createGain();

panNode1.pan.value = -1; // Left ear
panNode2.pan.value = 1;  // Right ear

function startBinauralBeats(frequency) {
    oscillator1 = context.createOscillator();
    oscillator2 = context.createOscillator();

    oscillator1.frequency.setValueAtTime(440, context.currentTime);
    oscillator2.frequency.setValueAtTime(440 + frequency, context.currentTime);

    oscillator1.connect(panNode1).connect(gainNode).connect(context.destination);
    oscillator2.connect(panNode2).connect(gainNode).connect(context.destination);

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
    let volumeSlider = document.getElementById('volumeSlider');
    let volumeDisplay = document.getElementById('volumeDisplay');

    chrome.storage.sync.get(['frequency', 'volume'], (data) => {
        slider.value = data.frequency || 440;
        display.textContent = `Frequency: ${slider.value} Hz`;
        volumeSlider.value = data.volume || 0.5;
        volumeDisplay.textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
    });

    slider.oninput = () => {
        display.textContent = `Frequency: ${slider.value} Hz`;
        chrome.storage.sync.set({frequency: slider.value});
    };

    volumeSlider.oninput = () => {
        volumeDisplay.textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
        gainNode.gain.value = volumeSlider.value;
        chrome.storage.sync.set({volume: volumeSlider.value});
    };

    playPauseButton.addEventListener('click', function() {
        if (isPlaying) {
            stopBinauralBeats();
            isPlaying = false;
            playPauseButton.textContent = 'Play';
        } else {
            startBinauralBeats(Number(slider.value
