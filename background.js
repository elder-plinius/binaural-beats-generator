let audioContext;
let oscillatorLeft;
let oscillatorRight;
let gainNode;
let isPlaying = false;

function startBinauralBeats(frequency, delta, volume) {
    if (audioContext) {
        audioContext.close();
    }

    audioContext = new AudioContext();

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'togglePlayPause') {
        if (isPlaying) {
            stopBinauralBeats();
            sendResponse({ status: 'paused' });
        } else {
            startBinauralBeats(message.frequency, message.delta, message.volume);
            sendResponse({ status: 'playing' });
        }
    }
});
