// Background service worker for Sub Loader extension

console.log('[Sub Loader] Background service worker loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Sub Loader] Extension installed');
    
    // Open welcome page
    chrome.tabs.create({
      url: 'chrome-extension://' + chrome.runtime.id + '/welcome.html'
    });
  } else if (details.reason === 'update') {
    console.log('[Sub Loader] Extension updated');
  }
});

// Handle tab updates to inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('netflix.com')) {
    // Content script is already injected via manifest, but we can log here
    console.log('[Sub Loader] Netflix page loaded:', tab.url);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Sub Loader] Message from content script:', request);
  
  if (request.action === 'logEvent') {
    console.log('[Sub Loader]', request.message);
  }
});
