chrome.browserAction.onClicked.addListener(tab => {
  console.warn('click!');
  chrome.tabs.sendMessage(tab.id, {text: 'foo'}, console.warn);
});
