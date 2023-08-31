console.log('Hello from the main script!');

import './modals.js';
import { displayTemplates } from './templateManager.js';

// Call functions on page load

document.addEventListener('DOMContentLoaded', function() {
    displayTemplates();
});

if (document.querySelector('.storage-monitoring')) {
    updateStorageMonitoring();
}

document.addEventListener("DOMContentLoaded", function() {
  const darkmodeLink = document.getElementById("darkmode-link");
  const darkmodeToggle = document.getElementById("darkmode-toggle");
  
  // Check initial mode using chrome.storage.local
  chrome.storage.local.get("darkModeActive", function(data) {
      if (data.darkModeActive) {
          darkmodeLink.removeAttribute("disabled");
      } else {
          darkmodeLink.setAttribute("disabled", "true");
      }
  });

  // Toggle dark mode
  darkmodeToggle.addEventListener("click", function() {
      chrome.storage.local.get("darkModeActive", function(data) {
          const newStatus = !data.darkModeActive;
          chrome.storage.local.set({"darkModeActive": newStatus}, function() {
              if (newStatus) {
                  darkmodeLink.removeAttribute("disabled");
              } else {
                  darkmodeLink.setAttribute("disabled", "true");
              }
          });
      });
  });
});
