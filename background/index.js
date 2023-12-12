chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "querySalesHistory") {
        fetch('https://api.skinport.com/v1/sales/history')
            .then(response => response.json())
            .then(json => sendResponse(json))
            .catch(error => console.log(error));
        return true;  // Will respond asynchronously.
      }
});