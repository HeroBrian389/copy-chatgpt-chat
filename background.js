/* global chrome */

chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension installed - setting up context menu");
  chrome.contextMenus.create({
    id: "copyChatGPTConversation",
    title: "Copy ChatGPT Conversation",
    contexts: ["page"],
    documentUrlPatterns: ["https://chat.openai.com/*", "https://chatgpt.com/*"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log("Context menu clicked", info, tab);
  if (info.menuItemId === "copyChatGPTConversation") {
    console.log("Executing script in tab:", tab.id, "URL:", tab.url);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function() {
        console.log("Script executed in content page");
        chrome.runtime.sendMessage({ action: "copyChat" });
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Background received message:", request, "from:", sender);
  if (request.action === "copyChat") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      console.log("Active tabs found:", tabs);
      if (tabs && tabs.length > 0) {
        console.log("Attempting to send message to tab:", tabs[0].id, "URL:", tabs[0].url);
        try {
          chrome.tabs.sendMessage(tabs[0].id, { action: "extractAndCopy" }, function(response) {
            console.log("Send message callback triggered");
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
              console.log("Checking manifest configuration...");
              var manifest = chrome.runtime.getManifest();
              console.log("Has content_scripts:", !!manifest.content_scripts);
              if (manifest.content_scripts && manifest.content_scripts.length > 0) {
                console.log("Content script matches:", manifest.content_scripts[0].matches);
                console.log("Content script files:", manifest.content_scripts[0].js);
              }
            } else if (response) {
              console.log("Message sent successfully, response:", response);
            } else {
              console.log("Message sent but no response received");
            }
          });
        } catch (error) {
          console.error("Error in message sending:", error);
        }
      } else {
        console.error("No active tab found");
      }
    });
  }
  return true;
}); 