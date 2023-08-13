let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillatorLeft, oscillatorRight, gainNode;
let isPlaying = false;

let frequencySlider = document.getElementById('frequencySlider');
let deltaSlider = document.getElementById('deltaSlider');
let volumeSlider = document.getElementById('volumeSlider');
let playPauseButton = document.getElementById('togglePlayPause');

function startBinauralBeats(frequency, delta, volume) {
    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillatorLeft.type = 'sine';
    oscillatorRight.type = 'sine';

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
    oscillatorLeft.stop();
    oscillatorRight.stop();
    isPlaying = false;
}

playPauseButton.addEventListener('click', function() {
    if (isPlaying) {
        stopBinauralBeats();
        playPauseButton.textContent = 'Play';
    } else {
        startBinauralBeats(Number(frequencySlider.value), Number(deltaSlider.value), Number(volumeSlider.value));
        playPauseButton.textContent = 'Pause';
    }
});

frequencySlider.addEventListener('input', function() {
    document.getElementById('frequencyDisplay').textContent = `Frequency: ${frequencySlider.value} Hz`;
    if (isPlaying) {
        oscillatorLeft.frequency.setValueAtTime(Number(frequencySlider.value), audioContext.currentTime);
        oscillatorRight.frequency.setValueAtTime(Number(frequencySlider.value) + Number(deltaSlider.value), audioContext.currentTime);
    }
});

deltaSlider.addEventListener('input', function() {
    document.getElementById('deltaDisplay').textContent = `Delta: ${deltaSlider.value} Hz`;
    if (isPlaying) {
        oscillatorRight.frequency.setValueAtTime(Number(frequencySlider.value) + Number(deltaSlider.value), audioContext.currentTime);
    }
});

volumeSlider.addEventListener('input', function() {
    document.getElementById('volumeDisplay').textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
    if (isPlaying) {
        gainNode.gain.setValueAtTime(Number(volumeSlider.value), audioContext.currentTime);
    }
});
