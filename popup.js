function randomizeValues() {
    // Random frequency between 1 and 100
    let randomFrequency = Math.floor(Math.random() * 100) + 1;

    // Random delta between 1 and 30
    let randomDelta = Math.floor(Math.random() * 30) + 1;

    // Set the slider values
    document.getElementById('frequencySlider').value = randomFrequency;
    document.getElementById('deltaSlider').value = randomDelta;

    // Update the displayed values
    document.getElementById('frequencyDisplay').textContent = `Frequency: ${randomFrequency} Hz`;
    document.getElementById('deltaDisplay').textContent = `Delta: ${randomDelta} Hz`;

    // Update the binaural beats if they are playing
    if (isPlaying) {
        updateFrequencies();
    }
}

// Add an event listener to the randomize button
document.getElementById('randomize').addEventListener('click', randomizeValues);
