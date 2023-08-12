document.addEventListener('DOMContentLoaded', () => {
  let slider = document.getElementById('frequencySlider');
  let display = document.getElementById('frequencyDisplay');

  chrome.storage.sync.get('frequency', (data) => {
    slider.value = data.frequency;
    display.textContent = `Frequency: ${data.frequency} Hz`;
  });

  slider.oninput = () => {
    display.textContent = `Frequency: ${slider.value} Hz`;
    chrome.storage.sync.set({frequency: slider.value});
  };
});