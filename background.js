chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: "/inject.js",
    allFrames: true
  });
});
