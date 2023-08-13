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

document.getElementById('togglePlayPause').addEventListener('click', function() {
    if (isPlaying) {
        stopBinauralBeats();
        this.textContent = 'Play';
    } else {
        startBinauralBeats();
        this.textContent = 'Pause';
    }
});

document.getElementById('frequencySlider').addEventListener('input', function() {
    document.getElementById('frequencyDisplay').textContent = `Frequency: ${this.value} Hz`;
    if (isPlaying) {
        updateFrequencies();
    }
});

document.getElementById('deltaSlider').addEventListener('input', function() {
    document.getElementById('deltaDisplay').textContent = `Delta: ${this.value} Hz`;
    if (isPlaying) {
        updateFrequencies();
    }
});

document.getElementById('volumeSlider').addEventListener('input', function() {
    document.getElementById('volumeDisplay').textContent = `Volume: ${Math.round(this.value * 100)}%`;
    if (isPlaying) {
        updateVolume();
    }
});
