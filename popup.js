let audioContext = new AudioContext();
let oscillatorLeft;
let oscillatorRight;
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

function startBinauralBeats(frequency, delta, volume) {
    if (oscillatorLeft) oscillatorLeft.stop();
    if (oscillatorRight) oscillatorRight.stop();

    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();

    oscillatorLeft.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillatorRight.frequency.setValueAtTime(frequency + delta, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillatorLeft.connect(gainNode);
    oscillatorRight.connect(gainNode);

    oscillatorLeft.start();
    oscillatorRight.start();
}

document.getElementById('togglePlayPause').addEventListener('click', function() {
    startBinauralBeats(
        parseFloat(document.getElementById('frequencySlider').value),
        parseFloat(document.getElementById('deltaSlider').value),
        parseFloat(document.getElementById('volumeSlider').value)
    );
    this.textContent = this.textContent === 'Play' ? 'Pause' : 'Play';
});

document.getElementById('frequencySlider').addEventListener('input', function() {
    startBinauralBeats(
        parseFloat(this.value),
        parseFloat(document.getElementById('deltaSlider').value),
        parseFloat(document.getElementById('volumeSlider').value)
    );
});

document.getElementById('deltaSlider').addEventListener('input', function() {
    startBinauralBeats(
        parseFloat(document.getElementById('frequencySlider').value),
        parseFloat(this.value),
        parseFloat(document.getElementById('volumeSlider').value)
    );
});

document.getElementById('volumeSlider').addEventListener('input', function() {
    gainNode.gain.setValueAtTime(parseFloat(this.value), audioContext.currentTime);
});
