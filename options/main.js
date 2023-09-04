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
    
    // Function to set dark mode
    function setDarkMode(isActive) {
        if (isActive) {
            darkmodeLink.removeAttribute("disabled");
            document.body.setAttribute('data-theme', 'dark');
        } else {
            darkmodeLink.setAttribute("disabled", "true");
            document.body.removeAttribute('data-theme');
        }
    }
    
    // Check initial mode using chrome.storage.local
    chrome.storage.local.get("darkModeActive", function(data) {
        setDarkMode(data.darkModeActive);
    });
  
    // Toggle dark mode
    darkmodeToggle.addEventListener("click", function() {
        chrome.storage.local.get("darkModeActive", function(data) {
            const newStatus = !data.darkModeActive;
            chrome.storage.local.set({"darkModeActive": newStatus}, function() {
                setDarkMode(newStatus);
            });
        });
    });

    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle 'active' class
            this.classList.toggle('active');
            
            // Re-display templates based on new set of active tags
            displayTemplates();
        });
    });
});
