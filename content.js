console.log("Content script loading on:", window.location.href);

function extractChatContent() {
  try {
    var conversationContent = "";
    
    // Try to find the main chat container
    var chatContainer = document.querySelector('main');
    
    if (!chatContainer) {
      return "Could not find chat container. Please update the selectors in the extension.";
    }
    
    // Find user messages using the specific class selector
    var userMessages = chatContainer.querySelectorAll('.relative.max-w-\\[var\\(--user-chat-width\\,70\\%\\)\\].rounded-3xl.bg-token-message-surface.px-5.py-2\\.5');
    
    // Find AI messages using the specific class selector
    var aiMessages = chatContainer.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.dark');
    
    // Check if we found any messages
    if (userMessages.length === 0 && aiMessages.length === 0) {
      return "Could not find message elements. Please update the selectors in the extension.";
    }
    
    // Create an array of all message elements with their types for proper ordering
    var allMessages = [];
    
    // Process user messages
    for (var i = 0; i < userMessages.length; i++) {
      var element = userMessages[i];
      // Extract the text content from the first child div which contains the message
      var messageDiv = element.querySelector('div.whitespace-pre-wrap');
      if (messageDiv) {
        var text = messageDiv.textContent.trim();
        // Store with position information for sorting later
        if (text) {
          allMessages.push({
            element: element,
            role: 'User',
            text: text,
            position: getElementPosition(element)
          });
        }
      }
    }
    
    // Process AI messages
    for (var j = 0; j < aiMessages.length; j++) {
      var element = aiMessages[j];
      // Get all text content, excluding the "Sources" button
      var text = element.textContent.trim();
      if (text) {
        allMessages.push({
          element: element,
          role: 'ChatGPT',
          text: text,
          position: getElementPosition(element)
        });
      }
    }
    
    // Sort messages by their position in the DOM
    allMessages.sort(function(a, b) {
      return a.position - b.position;
    });
    
    // Combine all messages into the conversation content
    for (var k = 0; k < allMessages.length; k++) {
      var message = allMessages[k];
      conversationContent += '## ' + message.role + ':\n' + message.text + '\n\n';
    }
    
    return conversationContent || "No conversation content found";
  } catch (error) {
    return "Error extracting conversation: " + error.message;
  }
}

// Helper function to get the vertical position of an element
function getElementPosition(element) {
  var rect = element.getBoundingClientRect();
  return rect.top;
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  // Create a temporary textarea element
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  
  // Select and copy the text
  textarea.select();
  document.execCommand('copy');
  
  // Clean up
  document.body.removeChild(textarea);
  
  // Show a notification
  showNotification('Conversation copied to clipboard!');
}

// Function to show a notification
function showNotification(message) {
  var notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '10px 20px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '9999';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  document.body.appendChild(notification);
  
  setTimeout(function() {
    document.body.removeChild(notification);
  }, 3000);
}

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Content script received message:", request, "from:", sender);
  
  if (request.action === "extractAndCopy") {
    console.log("Executing extractAndCopy action");
    try {
      var chatContent = extractChatContent();
      console.log("Chat content extracted successfully, length:", chatContent.length);
      copyToClipboard(chatContent);
      console.log("Content copied to clipboard");
      sendResponse({ success: true, message: "Content copied successfully" });
    } catch (error) {
      console.error("Error in extractAndCopy:", error);
      sendResponse({ success: false, error: error.message });
    }
  } else {
    console.log("Unknown action received:", request.action);
  }
  return true; // Keep the message channel open for async response
});

// Add a keyboard shortcut listener (Ctrl+Shift+C)
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
    try {
      var chatContent = extractChatContent();
      copyToClipboard(chatContent);
    } catch (error) {
      console.error("Error in keyboard shortcut handler:", error);
      showNotification('Error copying conversation: ' + error.message);
    }
  }
});

// Notify that content script has loaded
console.log("ChatGPT Conversation Copier content script loaded and ready to receive messages");
// Add a simple self-test
setTimeout(function() {
  console.log("Content script is still alive after 1 second");
  console.log("Current URL:", window.location.href);
  console.log("Does URL match patterns?", 
    /^https:\/\/chat\.openai\.com\//.test(window.location.href) || 
    /^https:\/\/chatgpt\.com\//.test(window.location.href));
}, 1000); 