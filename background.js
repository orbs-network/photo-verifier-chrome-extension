chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: "/orbs-client-sdk.js"
  });

  chrome.tabs.executeScript({
    file: "/inject.js"
  });
});
