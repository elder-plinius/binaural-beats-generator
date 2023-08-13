let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillatorLeft, oscillatorRight, gainNode;
let isPlaying = false;

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'togglePlayPause') {
        if (isPlaying) {
            stopBinauralBeats();
            sendResponse({status: 'stopped'});
        } else {
            startBinauralBeats(message.frequency, message.delta, message.volume);
            sendResponse({status: 'playing'});
        }
    } else if (message.action === 'updateAudio') {
        if (isPlaying) {
            oscillatorLeft.frequency.setValueAtTime(message.frequency, audioContext.currentTime);
            oscillatorRight.frequency.setValueAtTime(message.frequency + message.delta, audioContext.currentTime);
            gainNode.gain.setValueAtTime(message.volume, audioContext.currentTime);
        }
    }
});
