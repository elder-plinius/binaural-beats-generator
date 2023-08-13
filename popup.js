let audioContext = new AudioContext();
let oscillator = audioContext.createOscillator();

oscillator.connect(audioContext.destination);
oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

document.getElementById('togglePlayPause').addEventListener('click', async function() {
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    if (this.textContent === 'Play') {
        oscillator.start();
        this.textContent = 'Pause';
    } else {
        oscillator.stop();
        oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        this.textContent = 'Play';
    }
});
