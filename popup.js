document.getElementById('copyButton').addEventListener('click', function() {
  // Update button state to provide feedback
  var button = document.getElementById('copyButton');
  var originalText = button.textContent;
  
  button.textContent = 'Copying...';
  button.disabled = true;
  
  // Send message to background script with error handling
  try {
    chrome.runtime.sendMessage({ action: "copyChat" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
        button.textContent = 'Error!';
        
        setTimeout(function() {
          button.textContent = originalText;
          button.disabled = false;
        }, 1500);
      }
    });
    
    setTimeout(function() {
      button.textContent = 'Copied!';
      
      setTimeout(function() {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    }, 500);
  } catch (error) {
    console.error("Error sending message:", error);
    button.textContent = 'Error!';
    
    setTimeout(function() {
      button.textContent = originalText;
      button.disabled = false;
    }, 1500);
  }
}); 