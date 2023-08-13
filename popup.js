let frequencySlider = document.getElementById('frequencySlider');
let deltaSlider = document.getElementById('deltaSlider');
let volumeSlider = document.getElementById('volumeSlider');
let playPauseButton = document.getElementById('togglePlayPause');

playPauseButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: {tabId: activeTab.id},
            files: ['content.js']
        }, () => {
            chrome.tabs.sendMessage(activeTab.id, {
                action: 'togglePlayPause',
                frequency: Number(frequencySlider.value),
                delta: Number(deltaSlider.value),
                volume: Number(volumeSlider.value)
            }, (response) => {
                if (response && response.status === 'playing') {
                    playPauseButton.textContent = 'Pause';
                } else {
                    playPauseButton.textContent = 'Play';
                }
            });
        });
    });
});
