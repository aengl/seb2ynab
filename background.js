chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {text: 'foo'}, data => {
    console.log(data);
    if (data) {
      chrome.downloads.download({
        url: 'data:text/plain,' + encodeURIComponent(data),
        filename: 'seb.csv',
      });
    }
  });
});
