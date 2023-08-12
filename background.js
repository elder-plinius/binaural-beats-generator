chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({frequency: '440'});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ['binauralGenerator.js']
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['binauralGenerator.js']
  });
});