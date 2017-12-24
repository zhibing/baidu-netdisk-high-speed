chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", details.url, false);
    xhr.send();
    const result = JSON.parse(xhr.responseText);
    const url = result.dlink[0].dlink;

    chrome.tabs.create({'url': chrome.extension.getURL("url.html"),
      'active': true}, function(tab){
      var selfTabId = tab.id;
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == "complete" && tabId == selfTabId){
          // send the data to the page's script:
          var tabs = chrome.extension.getViews({type: "tab"});
          tabs[0].setURL(url);
        }
      });
    });

    return { cancel: true };
  },
  {urls: ["*://*.baidu.com/api/download?*"]},
  ["blocking"]
);