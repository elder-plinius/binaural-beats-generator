let audioContext;
let oscillatorLeft;
let oscillatorRight;
let gainNode;
let isPlaying = false;

function startBinauralBeats(frequency, delta, volume) {
    if (audioContext) {
        audioContext.close();
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillatorLeft.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillatorRight.frequency.setValueAtTime(frequency + delta, audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillatorLeft.connect(gainNode);
    oscillatorRight.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillatorLeft.start();
    oscillatorRight.start();

    isPlaying = true;
}

function stopBinauralBeats() {
    if (oscillatorLeft) {
        oscillatorLeft.stop();
    }
    if (oscillatorRight) {
        oscillatorRight.stop();
    }
    isPlaying = false;
}

document.getElementById('togglePlayPause').addEventListener('click', function() {
    if (isPlaying) {
        stopBinauralBeats();
        this.textContent = 'Play';
    } else {
        let frequency = Number(document.getElementById('frequencySlider').value);
        let delta = Number(document.getElementById('deltaSlider').value);
        let volume = Number(document.getElementById('volumeSlider').value);
        startBinauralBeats(frequency, delta, volume);
        this.textContent = 'Pause';
    }
});

document.getElementById('frequencySlider').addEventListener('input', function() {
    document.getElementById('frequencyDisplay').textContent = `Frequency: ${this.value} Hz`;
    if (isPlaying) {
        oscillatorLeft.frequency.setValueAtTime(Number(this.value), audioContext.currentTime);
    }
});

document.getElementById('deltaSlider').addEventListener('input', function() {
    document.getElementById('deltaDisplay').textContent = `Delta: ${this.value} Hz`;
    if (isPlaying) {
        let frequency = Number(document.getElementById('frequencySlider').value);
        oscillatorRight.frequency.setValueAtTime(frequency + Number(this.value), audioContext.currentTime);
    }
});

document.getElementById('volumeSlider').addEventListener('input', function() {
    document.getElementById('volumeDisplay').textContent = `Volume: ${Math.round(this.value * 100)}%`;
    if (isPlaying) {
        gainNode.gain.setValueAtTime(Number(this.value), audioContext.currentTime);
    }
});

document.getElementById('randomize').addEventListener('click', function() {
    let randomFrequency = Math.floor(Math.random() * 100) + 1;
    let randomDelta = Math.floor(Math.random() * 30) + 1;

    document.getElementById('frequencySlider').value = randomFrequency;
    document.getElementById('deltaSlider').value = randomDelta;

    document.getElementById('frequencyDisplay').textContent = `Frequency: ${randomFrequency} Hz`;
    document.getElementById('deltaDisplay').textContent = `Delta: ${randomDelta} Hz`;

    if (isPlaying) {
        oscillatorLeft.frequency.setValueAtTime(randomFrequency, audioContext.currentTime);
        oscillatorRight.frequency.setValueAtTime(randomFrequency + randomDelta, audioContext.currentTime);
    }
});
