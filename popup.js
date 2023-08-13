let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillatorLeft, oscillatorRight, gainNode;
let isPlaying = false;

// Initialize the audio components once
function initAudio() {
    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillatorLeft.type = 'sine';
    oscillatorRight.type = 'sine';

    oscillatorLeft.connect(gainNode);
    oscillatorRight.connect(gainNode);

    oscillatorLeft.start();
    oscillatorRight.start();
}

function togglePlayPause() {
    if (isPlaying) {
        gainNode.disconnect(audioContext.destination);
        isPlaying = false;
    } else {
        gainNode.connect(audioContext.destination);
        isPlaying = true;
    }
}

function updateFrequencies() {
    let frequency = parseFloat(document.getElementById('frequencySlider').value);
    let delta = parseFloat(document.getElementById('deltaSlider').value);
    oscillatorLeft.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillatorRight.frequency.setValueAtTime(frequency + delta, audioContext.currentTime);
}

function updateVolume() {
    let volume = parseFloat(document.getElementById('volumeSlider').value);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

function randomizeValues() {
    let randomFrequency = Math.floor(Math.random() * 100) + 1;
    let randomDelta = Math.floor(Math.random() * 30) + 1;

    document.getElementById('frequencySlider').value = randomFrequency;
    document.getElementById('deltaSlider').value = randomDelta;

    document.getElementById('frequencyDisplay').textContent = `Frequency: ${randomFrequency} Hz`;
    document.getElementById('deltaDisplay').textContent = `Delta: ${randomDelta} Hz`;

    updateFrequencies();
}

// Initialize audio components when the popup is loaded
initAudio();

document.getElementById('togglePlayPause').addEventListener('click', function() {
    togglePlayPause();
    this.textContent = isPlaying ? 'Pause' : 'Play';
});

document.getElementById('frequencySlider').addEventListener('input', function() {
    document.getElementById('frequencyDisplay').textContent = `Frequency: ${this.value} Hz`;
    updateFrequencies();
});

document.getElementById('deltaSlider').addEventListener('input', function() {
    document.getElementById('deltaDisplay').textContent = `Delta: ${this.value} Hz`;
    updateFrequencies();
});

document.getElementById('volumeSlider').addEventListener('input', function() {
    document.getElementById('volumeDisplay').textContent = `Volume: ${Math.round(this.value * 100)}%`;
    updateVolume();
});

document.getElementById('randomize').addEventListener('click', randomizeValues);
