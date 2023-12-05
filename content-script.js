chrome.runtime.sendMessage({ type: 'fetchData' }, response => {
  console.log(response);
});
