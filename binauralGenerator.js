chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'someFutureAction') {
    // Handle any future actions you might want to implement in the background script
    sendResponse({status: 'handled'});
  }
});
