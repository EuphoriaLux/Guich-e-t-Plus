console.log('Hello from the addTemplateSave.js');

function stripStyles(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const allElements = doc.querySelectorAll('*');
    allElements.forEach((element) => {
        element.removeAttribute('style');
    });
    return doc.body.innerHTML;
}

function addSourceUrlField(language) {
    const container = document.getElementById('source-url-container');
    container.innerHTML = '';

    const label = document.createElement('label');
    label.setAttribute('for', `source-url-${language}`);
    label.innerText = `Source URL for ${language}:`;

    const input = document.createElement('input');
    input.setAttribute('id', `source-url-${language}`);
    input.setAttribute('type', 'text');
    input.required = true;

    container.appendChild(label);
    container.appendChild(input);
}

function handleFormSubmission(event) {
    event.preventDefault();

    const templateId = document.getElementById('template-id').value;
    const templateName = document.getElementById('template-name').value;
    const rawTemplateContent = document.getElementById('template-content').innerHTML;
    const languageInput = document.getElementById('language');
    const language = languageInput.value;
    const sourceURL = document.getElementById(`source-url-${language}`).value;
    const tags = document.getElementById(`tags`).value;
    const url = document.getElementById(`url`).value;

    if (!templateName || !rawTemplateContent || !language) {
        alert("All fields are required.");
        return;
    }

    const templateContent = stripStyles(rawTemplateContent);

    chrome.storage.local.get('templates', function (result) {
        let templates = result.templates || [];
        let templateToUpdate = templates.find(t => t.id === templateId);

        if (templateToUpdate) {
            // Update existing template
            templateToUpdate.name = templateName;
            templateToUpdate.contents[language] = {
                data: templateContent,
                sourceURL: sourceURL
            };
        } else {
            // Create new template
            const newTemplate = {
                id: 'template_' + new Date().getTime(),
                name: templateName,
                contents: {
                    [language]: {
                        data: templateContent,
                        sourceURL: sourceURL
                    }
                },
                created: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                status: 'pending',
                tags: [tags], // Replace with your own tag array
                urls:[url],
                usageCount: 0
            };
            templates.push(newTemplate);
        }

        chrome.storage.local.set({ templates: templates }, function () {
            if (chrome.runtime.lastError) {
                alert("An error occurred: " + chrome.runtime.lastError.message);
                return;
            }
            document.getElementById('new-template-form').reset();
            alert("Template saved successfully.");
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const newTemplateForm = document.getElementById('new-template-form');
    const flags = document.querySelectorAll('.language-flag');

    if (newTemplateForm) {
        newTemplateForm.addEventListener('submit', handleFormSubmission);
    }

    flags.forEach(flag => {
        flag.addEventListener('click', function () {
            flags.forEach(f => f.classList.remove('selected'));
            flag.classList.add('selected');
            const selectedLanguage = flag.getAttribute('data-language');
            document.getElementById('language').value = selectedLanguage;
            addSourceUrlField(selectedLanguage);
        });
    });
});

const editingTemplate = sessionStorage.getItem('editingTemplate');
const editingLanguage = sessionStorage.getItem('editingLanguage');

if (editingTemplate && editingLanguage) {
    const template = JSON.parse(editingTemplate);

    const templateIdElement = document.getElementById('template-id');
    const templateNameElement = document.getElementById('template-name');
    const templateContentElement = document.getElementById('template-content');
    const languageElement = document.getElementById('language');
    const urlElement = document.getElementById('url');

    if (templateIdElement) templateIdElement.value = template.id;
    if (templateNameElement) templateNameElement.value = template.name;
    if (templateContentElement) {
        if (template.contents && template.contents[editingLanguage] && template.contents[editingLanguage].data) {
            templateContentElement.innerHTML = template.contents[editingLanguage].data;
        } else {
            templateContentElement.innerHTML = "";  // Initialize with empty content
        }
    }
    

    if (languageElement) languageElement.value = editingLanguage;
    if (urlElement && template.urls && template.urls.length > 0) {
        urlElement.value = template.urls[0];
    } else {
        if (urlElement) urlElement.value = template.contents[editingLanguage].sourceURL;
    }

    addSourceUrlField(editingLanguage);  // This will create the input field for sourceURL for the given language
    const sourceUrlElement = document.getElementById(`source-url-${editingLanguage}`);
    if (sourceUrlElement && template.contents && template.contents[editingLanguage]) {
        sourceUrlElement.value = template.contents[editingLanguage].sourceURL;
    }

    sessionStorage.removeItem('editingTemplate');
    sessionStorage.removeItem('editingLanguage');

    const flags = document.querySelectorAll('.language-flag');
    flags.forEach(flag => {
        if (flag.getAttribute('data-language') === editingLanguage) {
            flag.classList.add('selected');
        } else {
            flag.classList.remove('selected');
        }
    });

    const languageInput = document.getElementById('language');
    if (languageInput) {
        languageInput.value = editingLanguage;
    }
}



document.getElementById('template-content').addEventListener('paste', function (e) {
    e.preventDefault();
    let clipboardData = e.clipboardData || window.clipboardData;
    let pastedHtml = clipboardData.getData('text/html');

    if (pastedHtml) {
        const strippedHtml = stripStyles(pastedHtml);
        document.execCommand('insertHTML', false, strippedHtml);
    } else {
        let pastedText = clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, pastedText);
    }

    document.querySelectorAll('#template-content *').forEach((element) => {
        element.style.fontFamily = 'Calibri';
        element.style.fontSize = '10px';
    });
});
