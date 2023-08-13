document.addEventListener('DOMContentLoaded', () => {
    let frequencySlider = document.getElementById('frequencySlider');
    let frequencyDisplay = document.getElementById('frequencyDisplay');
    let deltaSlider = document.getElementById('deltaSlider');
    let deltaDisplay = document.getElementById('deltaDisplay');
    let volumeSlider = document.getElementById('volumeSlider');
    let volumeDisplay = document.getElementById('volumeDisplay');
    let playPauseButton = document.getElementById('togglePlayPause');

    chrome.storage.sync.get(['frequency', 'delta', 'volume'], (data) => {
        frequencySlider.value = data.frequency || 440;
        frequencyDisplay.textContent = `Frequency: ${frequencySlider.value} Hz`;
        deltaSlider.value = data.delta || 10;
        deltaDisplay.textContent = `Delta: ${deltaSlider.value} Hz`;
        volumeSlider.value = data.volume || 0.5;
        volumeDisplay.textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
    });

    frequencySlider.oninput = () => {
        let frequencyValue = frequencySlider.value;
        let brainwaveCategory;

        if (frequencyValue <= 4) {
            brainwaveCategory = "Delta (Deep Sleep)";
        } else if (frequencyValue <= 8) {
            brainwaveCategory = "Theta (Meditation)";
        } else if (frequencyValue <= 14) {
            brainwaveCategory = "Alpha (Relaxation)";
        } else if (frequencyValue <= 30) {
            brainwaveCategory = "Beta (Focus)";
        } else {
            brainwaveCategory = "Gamma (Insight)";
        }

        frequencyDisplay.textContent = `Frequency: ${frequencyValue} Hz - ${brainwaveCategory}`;
        chrome.storage.sync.set({frequency: frequencyValue});
    };

    deltaSlider.oninput = () => {
        deltaDisplay.textContent = `Delta: ${deltaSlider.value} Hz`;
        chrome.storage.sync.set({delta: deltaSlider.value});
    };

    volumeSlider.oninput = () => {
        volumeDisplay.textContent = `Volume: ${Math.round(volumeSlider.value * 100)}%`;
        chrome.storage.sync.set({volume: volumeSlider.value});
    };

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
                if (response.status === 'playing') {
                    playPauseButton.textContent = 'Pause';
                } else {
                    playPauseButton.textContent = 'Play';
                }
            });
        });
    });
});
