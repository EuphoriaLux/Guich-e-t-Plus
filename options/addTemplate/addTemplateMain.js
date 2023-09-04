console.log('Hello from the addTemplateMain.js script!');

import '../modals.js';
import './addTemplateSave.js';


// Function to display all available templates
function displayAvailableTemplates() {
    chrome.storage.local.get('templates', function(result) {
        const templates = result.templates || [];

        // Clear existing displayed templates if any
        const displayContainer = document.getElementById('template-display-container');
        if (displayContainer) {
            displayContainer.innerHTML = '';
        }

        // Display each template
        templates.forEach(template => {
            const templateDiv = document.createElement('div');
            templateDiv.className = 'template-item';
            
            // Add template name
            const nameDiv = document.createElement('div');
            nameDiv.className = 'template-name';
            nameDiv.innerHTML = `Name: ${template.name}`;
            templateDiv.appendChild(nameDiv);
            
            // Add template language and content
            Object.keys(template.contents).forEach(lang => {
                const langDiv = document.createElement('div');
                langDiv.className = 'template-language';
                langDiv.innerHTML = `Language: ${lang}, Content: ${template.contents[lang].data}`;
                templateDiv.appendChild(langDiv);
            });

            // Append to the main display container
            if (displayContainer) {
                displayContainer.appendChild(templateDiv);
            }
        });
    });
}

// Run display function on document load
document.addEventListener('DOMContentLoaded', function() {
    displayAvailableTemplates();
});
