console.log('Hello from the addTemplateSave.js')

const templateSubmissionForm = document.getElementById('template-submission-form');
if (templateSubmissionForm) {
    templateSubmissionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const templateId = document.getElementById('template-id').value;
        const templateName = document.getElementById('template-name').value;
        const templateContent = document.getElementById('template-content').innerHTML;


        chrome.storage.local.get('templates', function(result) {
            let templates = result.templates || [];
            if (templateId) {
                templates[templateId] = {
                    name: templateName,
                    contents: {
                        [language]: {
                            data: templateContent,
                            sourceURL: ""
                        }
                    }
                };
            } else {
                templates.push({
                    name: templateName,
                    contents: {
                        [language]: {
                            data: templateContent,
                            sourceURL: ""
                        }
                    }
                });
            }
            chrome.storage.local.set({ templates: templates }, function() {
                document.getElementById('template-submission-form').reset();
                document.getElementById('template-submit-button').textContent = 'Add Template';
                displayTemplates();
            });
        });
    });
}

const newTemplateForm = document.getElementById('new-template-form');
const flags = document.querySelectorAll('.language-flag');
const languageInput = document.getElementById('language');

flags.forEach(flag => {
    flag.addEventListener('click', function() {
        flags.forEach(f => f.classList.remove('selected'));
        flag.classList.add('selected');
        languageInput.value = flag.getAttribute('data-language');
    });
});

const urlField = document.getElementById('url');
const categoryField = document.getElementById('category');

if (urlField && categoryField) {
    urlField.addEventListener('input', function() {
        const urlSegments = new URL(urlField.value).pathname.split('/');
        const languageSegment = urlSegments[1].toUpperCase();
        flags.forEach(flag => {
            if (flag.getAttribute('data-language') === languageSegment) {
                flag.click();
            }
        });
        if (urlSegments.length > 2) {
            categoryField.value = urlSegments[3];
        } else {
            categoryField.value = '';
        }
    });
}

if (newTemplateForm) {
    newTemplateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const templateName = document.getElementById('template-name').value;
        const templateContent = document.getElementById('template-content').innerHTML;

        const language = document.getElementById('language').value;
        const url = document.getElementById('url').value;
        const category = document.getElementById('category').value;

        const newTemplate = {
            id: 'template_' + new Date().getTime(),
            name: templateName,
            contents: {
                [language]: {
                    data: templateContent,
                    sourceURL: url
                }
            },
            urls: [url],
            tags: [category],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            usageCount: 0,
            status: 'pending'
        };

        // Save the new template to chrome.storage.local
        chrome.storage.local.get('templates', function(result) {
            let templates = result.templates || [];
            templates.push(newTemplate);
            chrome.storage.local.set({ templates: templates }, function() {
                newTemplateForm.reset();
                alert('Template saved successfully!');

            });
        });
    });
}

