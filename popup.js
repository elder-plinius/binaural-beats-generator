let audioContext;
let oscillatorLeft;
let oscillatorRight;
let gainNode;

if (!audioContext) {
    audioContext = new AudioContext();
    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillatorLeft.connect(gainNode);
    oscillatorRight.connect(gainNode);
    gainNode.connect(audioContext.destination);
}

function updateBinauralBeats(frequency, delta, volume) {
    oscillatorLeft.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillatorRight.frequency.setValueAtTime(frequency + delta, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

document.getElementById('togglePlayPause').addEventListener('click', function() {
    if (oscillatorLeft && oscillatorRight) {
        oscillatorLeft.stop();
        oscillatorRight.stop();
        oscillatorLeft = null;
        oscillatorRight = null;
        this.textContent = 'Play';
    } else {
        oscillatorLeft = audioContext.createOscillator();
        oscillatorRight = audioContext.createOscillator();
        oscillatorLeft.connect(gainNode);
        oscillatorRight.connect(gainNode);
        updateBinauralBeats(
            parseFloat(document.getElementById('frequencySlider').value),
            parseFloat(document.getElementById('deltaSlider').value),
            parseFloat(document.getElementById('volumeSlider').value)
        );
        oscillatorLeft.start();
        oscillatorRight.start();
        this.textContent = 'Pause';
    }
});

document.getElementById('frequencySlider').addEventListener('input', function() {
    updateBinauralBeats(
        parseFloat(this.value),
        parseFloat(document.getElementById('deltaSlider').value),
        parseFloat(document.getElementById('volumeSlider').value)
    );
});

document.getElementById('deltaSlider').addEventListener('input', function() {
    updateBinauralBeats(
        parseFloat(document.getElementById('frequencySlider').value),
        parseFloat(this.value),
        parseFloat(document.getElementById('volumeSlider').value)
    );
});

document.getElementById('volumeSlider').addEventListener('input', function() {
    gainNode.gain.setValueAtTime(parseFloat(this.value), audioContext.currentTime);
});
