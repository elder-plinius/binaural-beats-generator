let context = new (window.AudioContext || window.webkitAudioContext)();
let oscillator1, oscillator2;
let isPlaying = false;
let panNode1 = context.createStereoPanner();
let panNode2 = context.createStereoPanner();
let gainNode = context.createGain();

panNode1.pan.value = -1; // Left ear
panNode2.pan.value = 1;  // Right ear

function startBinauralBeats(delta) {
    oscillator1 = context.createOscillator();
    oscillator2 = context.createOscillator();

    let baseFrequency = 440; 
    oscillator1.frequency.setValueAtTime(baseFrequency, context.currentTime);
    oscillator2.frequency.setValueAtTime(baseFrequency + Number(delta), context.currentTime);

    oscillator1.connect(panNode1).connect(gainNode).connect(context.destination);
    oscillator2.connect(panNode2).connect(gainNode).connect(context.destination);

    oscillator1.start();
    oscillator2.start();
}

document.addEventListener('DOMContentLoaded', () => {
    let deltaSlider = document.getElementById('deltaSlider');
    let deltaDisplay = document.getElementById('deltaDisplay');
    let playPauseButton = document.getElementById('togglePlayPause');
    let volumeSlider = document.getElementById('volumeSlider');
    let volumeDisplay = document.getElementById('volumeDisplay');

    chrome.storage.sync.get(['delta', 'volume'], (data) => {
        deltaSlider.value = data.delta || 10;
        deltaDisplay.textContent = `Delta: ${deltaSlider.value} Hz`;
        volumeSlider.value = data.volume || 0.5;
        volumeDisplay.textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
    });

    deltaSlider.oninput = () => {
        deltaDisplay.textContent = `Delta: ${deltaSlider.value} Hz`;
        chrome.storage.sync.set({delta: deltaSlider.value});
        if (oscillator1 && oscillator2) {
            oscillator1.frequency.setValueAtTime(440, context.currentTime);
            oscillator2.frequency.setValueAtTime(440 + Number(deltaSlider.value), context.currentTime);
        }
    };

    volumeSlider.oninput = () => {
        volumeDisplay.textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
        gainNode.gain.value = volumeSlider.value;
        chrome.storage.sync.set({volume: volumeSlider.value});
    };

    playPauseButton.addEventListener('click', function() {
        if (context.state === 'suspended') {
            context.resume();
        }

        if (isPlaying) {
            oscillator1.stop();
            oscillator2.stop();
            isPlaying = false;
            playPauseButton.textContent = 'Play';
        } else {
            startBinauralBeats(Number(deltaSlider.value));
            isPlaying = true;
            playPauseButton.textContent = 'Pause';
        }
    });
});
