document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    toggleButton.addEventListener('click', () => {
      // Send a message to content.js to toggle its state
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggle"}, function(response) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
          } else {
            console.log('Message sent successfully');
          }
        });
      });    
    });
  });
  