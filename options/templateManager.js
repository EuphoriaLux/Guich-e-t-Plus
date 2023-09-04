import { createTableCell, setupFlagIcons, calculateCompletionPercentage } from './utility.js';


function displayMissingTemplatesCountsAndPercentages(data) {
    const languages = ['FR', 'EN', 'DE', 'LU'];
    languages.forEach(lang => {
        const elementCount = document.getElementById(`missing-${lang}`);
        if (elementCount) {
            elementCount.textContent = `${data.counts[lang]} (${data.percentages[lang].toFixed(2)}%)`;
        }
    });
}

function addInlineStylesToHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Add inline styles to all paragraphs
    doc.querySelectorAll('p').forEach((p) => {
        p.style.fontFamily = 'Calibri, sans-serif';
        p.style.fontSize = '10px';
    });

    // Add inline styles to all divs
    doc.querySelectorAll('div').forEach((div) => {
        div.style.fontFamily = 'Calibri, sans-serif';
        div.style.fontSize = '10px';
    });

    return doc.body.innerHTML;
}

function closeAllModals() {
    const languages = ['fr', 'en', 'de', 'lu']; // Lowercase language codes, adjust as needed
    languages.forEach(lang => {
        const modal = document.getElementById(`template-content-modal-${lang}`);
        if (modal) {
            modal.style.display = "none";
        }
    });
}


function createTemplateInfoDiv(template) {
    // Create a container div for the template information
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('template-info');

    // Create a div for the grid layout
    const gridDiv = document.createElement('div');
    gridDiv.classList.add('template-info-grid');
    infoDiv.appendChild(gridDiv);

    // Populate the grid with the template information
    const fields = ['id', 'name', 'created', 'lastModified', 'status', 'tags', 'usageCount'];
    fields.forEach(field => {
        const fieldDiv = document.createElement('div');
        fieldDiv.classList.add(`template-info-${field}`);

        const fieldName = document.createElement('span');
        fieldName.classList.add('template-info-field-name');
        fieldName.textContent = `${field}: `;

        const fieldValue = document.createElement('span');
        fieldValue.classList.add('template-info-field-value');
        fieldValue.textContent = template[field] || 'N/A';

        fieldDiv.appendChild(fieldName);
        fieldDiv.appendChild(fieldValue);
        gridDiv.appendChild(fieldDiv);
    });

    // Add a div for URLs below the grid layout
    const urlsDiv = document.createElement('div');
    urlsDiv.classList.add('template-info-urls');
    const urlsLabel = document.createElement('span');
    urlsLabel.classList.add('template-info-field-name');
    urlsLabel.textContent = 'URLs: ';
    urlsDiv.appendChild(urlsLabel);

    if (template.urls && template.urls.length > 0) {
        const urlsList = document.createElement('ul');
        template.urls.forEach(url => {
            const urlItem = document.createElement('li');
            urlItem.textContent = url;
            urlsList.appendChild(urlItem);
        });
        urlsDiv.appendChild(urlsList);
    } else {
        const noUrls = document.createElement('span');
        noUrls.classList.add('template-info-field-value');
        noUrls.textContent = 'N/A';
        urlsDiv.appendChild(noUrls);
    }

    infoDiv.appendChild(urlsDiv);

    return infoDiv;
}




document.addEventListener('DOMContentLoaded', function () {
    // Initialize dark mode if it is enabled in chrome.storage.local
    chrome.storage.local.get("darkModeActive", function (data) {
        if (data.darkModeActive) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});


function displayTemplates() {
    console.log('displaying templates');
    chrome.storage.local.get('templates', function (result) {
        let templates = result.templates || [];

        // Filtering based on active tags
        const activeTags = Array.from(document.querySelectorAll('.tag-button.active')).map(btn => btn.getAttribute('data-tag'));
        templates = templates.filter(template => {
            return activeTags.every(tag => (template.tags || []).includes(tag));
        });

        const missingData = countAndPercentageMissingContent(templates);
        displayMissingTemplatesCountsAndPercentages(missingData);

        const templateTable = document.getElementById('template-table');
        let templateList;
        if (templateTable) {
            templateList = templateTable.querySelector('tbody');
        }

        // Clear existing table rows
        if (templateList) {
            templateList.innerHTML = '';
        }

        updateCompletionPercentage(templates);

        const languageCounts = {
            'FR': 0,
            'EN': 0,
            'DE': 0,
            'LU': 0
        };

        templates.forEach(template => {
            console.log(template)
            const row = createTemplateRow(template, languageCounts, templates);
            templateList.appendChild(row);
        });

        updateLanguageCounts(languageCounts);
    });
}

function updateCompletionPercentage(templates) {
    const completionPercentage = calculateCompletionPercentage(templates);
    document.getElementById('completion-progress').value = completionPercentage;
    document.getElementById('completion-percentage').textContent = `${completionPercentage.toFixed(2)}%`;
}


function createTemplateRow(template, languageCounts, templates) {
    const row = document.createElement('tr');

    // Create cell for Tags
    const tags = template.tags || [];
    const tagStr = tags.join(', ');

    // Create the table cell
    const tagCell = createTableCell(row, tagStr || 'N/A');

    // Add a class to the cell based on the tag
    tags.forEach(tag => {
        // Convert the tag to lowercase and replace spaces with hyphens
        const tagClass = tag.toLowerCase().replace(/ /g, '-');

        // Add the class to the cell
        tagCell.classList.add(`td-${tagClass}`);
    });


    createTableCell(row, template.id || 'N/A');
    createTableCell(row, template.name || 'N/A');

    const languageTable = document.createElement('table');
    const languageBody = setupFlagIcons(template, languageCounts);
    languageTable.appendChild(languageBody);
    const languageCell = document.createElement('td');
    languageCell.appendChild(languageTable);
    row.appendChild(languageCell);

    createTableCell(row, new Date(template.created).toLocaleDateString());
    createTableCell(row, new Date(template.lastModified).toLocaleDateString());
    createTableCell(row, template.usageCount || '0');
    createTableCell(row, template.status || 'N/A');

    const actionCell = document.createElement('td');
    ['Edit', 'Delete'].forEach((action, index) => {
        const btn = document.createElement('button');
        btn.textContent = action;
        btn.classList.add('extension-button');
        if (action === 'Delete') {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop the event from triggering the row's click event
                deleteTemplate(templates.indexOf(template)); // Assuming that the index of the template corresponds to its position in the array
            });
        }
        actionCell.appendChild(btn);
    });

    row.appendChild(actionCell);

    row.addEventListener('click', function () {
        // Close any open modals first
        closeAllModals();

        if (template.contents) {
            Object.keys(template.contents).forEach(lang => {
                // This line will add the inline styles to the HTML content
                const styledContent = addInlineStylesToHTML(template.contents[lang].data);


                // Open the modal for the selected language
                const modal = document.getElementById(`template-content-modal-${lang.toLowerCase()}`);
                const contentContainer = document.getElementById(`template-content-container-${lang.toLowerCase()}`);

                // Create a "Copy to Clipboard" button
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy to Clipboard';
                copyButton.addEventListener('click', function () {
                    const clipboardItemInput = new ClipboardItem({ "text/html": new Blob([styledContent], { type: "text/html" }) });
                    navigator.clipboard.write([clipboardItemInput])
                        .then(function () {
                            alert('Content copied to clipboard.');
                        })
                        .catch(function (err) {
                            alert('Unable to copy content: ' + err);
                        });
                });

                // Add the "Copy to Clipboard" button below the information div
                modal.querySelector('.modal-content').insertBefore(copyButton, contentContainer);

                // Add the template information div at the top of the modal
                const templateInfoDiv = createTemplateInfoDiv(template);
                modal.querySelector('.modal-content').insertBefore(templateInfoDiv, contentContainer);


                // Then add the actual template content (now use styledContent)
                contentContainer.innerHTML = styledContent;
                modal.style.display = "block";  // open the modal
            });
        }
    });

    return row;
}

function updateLanguageCounts(languageCounts) {
    document.getElementById('count-fr').textContent = languageCounts['FR'];
    document.getElementById('count-en').textContent = languageCounts['EN'];
    document.getElementById('count-de').textContent = languageCounts['DE'];
    document.getElementById('count-lu').textContent = languageCounts['LU'];
}

function deleteTemplate(index) {
    const userConfirmation = confirm("Are you sure you want to delete this template?");
    if (userConfirmation) {
        chrome.storage.local.get('templates', function (result) {
            let templates = result.templates;
            templates.splice(index, 1);
            chrome.storage.local.set({ templates: templates }, displayTemplates);
        });
    }
}

function countAndPercentageMissingContent(templates) {
    const languages = ['FR', 'EN', 'DE', 'LU'];
    const missingContentCounts = {};
    const missingContentPercentages = {};

    // Initialize counts to 0 for each language
    languages.forEach(lang => {
        missingContentCounts[lang] = 0;
    });

    // Iterate through each template and count missing content for each language
    templates.forEach(template => {
        languages.forEach(lang => {
            if (!template.contents || !template.contents.hasOwnProperty(lang)) {
                missingContentCounts[lang]++;
            }
        });
    });


    // Calculate the percentages
    languages.forEach(lang => {
        missingContentPercentages[lang] = (missingContentCounts[lang] / templates.length) * 100;
    });

    return { counts: missingContentCounts, percentages: missingContentPercentages };
}

// Listen for changes in chrome.storage to update the dark mode
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'local' && changes.darkModeActive) {
        if (changes.darkModeActive.newValue) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});


export { displayTemplates, deleteTemplate };
