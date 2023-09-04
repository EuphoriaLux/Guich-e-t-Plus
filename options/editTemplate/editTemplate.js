console.log('Hello from the editTemplate.js script!');



document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the template and language from session storage
    const template = JSON.parse(sessionStorage.getItem('editingTemplate'));
    const lang = sessionStorage.getItem('editingLanguage');

    if (template && lang) {
        // Populate input fields
        document.getElementById('templateName').value = template.name;
        
        // Set the innerHTML of the contenteditable div to the template content
        const templateContentDiv = document.getElementById('templateContent');
if (template.contents && template.contents[lang]) {
if (!template.contents[lang]) {
        template.contents[lang] = {data: "", sourceURL: ""};
    }
            templateContentDiv.innerHTML = template.contents[lang].data || '';
}
        templateContentDiv.contentEditable = true;

        document.getElementById('selectedLanguage').value = lang;
    } else {
        console.warn('No template or language data found in session storage.');
        // You can redirect to another page or show an error message as appropriate
    }
        // Populate the URL field
        const urlField = document.getElementById('url');
        urlField.value = template.urls[0] || '';

        // Add the flag selection logic here, inside the DOMContentLoaded event
        const flags = document.querySelectorAll('.language-flag');
        const languageInput = document.getElementById('selectedLanguage');
    
        flags.forEach(flag => {
            flag.addEventListener('click', function() {
                // Remove 'selected' class from all flags
                flags.forEach(f => f.classList.remove('selected'));
    
                // Add 'selected' class to clicked flag
                flag.classList.add('selected');
    
                // Update the hidden input with the language code
                languageInput.value = flag.getAttribute('data-language');
            });
        });
    
        // To automatically select the flag based on the session language
        const selectedFlag = document.querySelector(`.language-flag[data-language="${lang}"]`);
        if (selectedFlag) {
            selectedFlag.click();
        }

    // Logic to save the changes
    document.getElementById('saveChanges').addEventListener('click', function() {

        // Fetch the updated content from the contenteditable div
        const updatedContent = document.getElementById('templateContent').innerHTML;

        // Initialize the structure for the new language if it doesn't exist
        if (!template.contents[lang]) {
            template.contents[lang] = {data: "", sourceURL: ""};
        }

        // Update the template's content for the specific language
        template.contents[lang].data = updatedContent;

        // Update the lastModified timestamp
        template.lastModified = new Date().toISOString();

        
        // Update the lastModified timestamp
        template.lastModified = new Date().toISOString();

        // Save the updated template to the storage
        chrome.storage.local.get('templates', function(result) {
            const templates = result.templates || [];
            const index = templates.findIndex(t => t.id === template.id);
            if (index !== -1) {
                templates[index] = template;  // Update the template
                chrome.storage.local.set({ templates: templates }, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving the updated template:', chrome.runtime.lastError);
                        // Provide feedback to the user about the error
                    } else {
                        console.log('Template updated successfully.');
                        // Redirect to options.html after a successful update
                        window.location.href = '../options.html';
                    }
                });
            } else {
                console.error('Template not found in storage.');
                // Provide feedback to the user about the error
            }
        });
    });
});
