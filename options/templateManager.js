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



document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode if it is enabled in chrome.storage.local
    chrome.storage.local.get("darkModeActive", function(data) {
        if (data.darkModeActive) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});


function displayTemplates() {
    console.log('displaying templates');
    chrome.storage.local.get('templates', function(result) {
        let templates = result.templates || [];

        // Filtering based on active tags
        const activeTags = Array.from(document.querySelectorAll('.tag-button.active')).map(btn => btn.getAttribute('data-tag'));
        templates = templates.filter(template => {
            return activeTags.every(tag => (template.tags || []).includes(tag));
        });

        console.log("Templates fetched:", templates); // Check the templates fetched
        const missingData = countAndPercentageMissingContent(templates);
        console.log("Missing data:", missingData); // Check the missing data calculated
        displayMissingTemplatesCountsAndPercentages(missingData);
       
        const templateTable = document.getElementById('template-table');
        let templateList;
        if (templateTable) {
            templateList = templateTable.querySelector('tbody');
        }
        
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
    

    if (template.tags && template.tags.length > 0) {
        // row.className = `tr-${template.tags[0].toLowerCase()}`;
const tagCell = createTableCell(row, template.tags.join(", "));
if (template.tags && template.tags.length > 0) {
    tagCell.className = `td-${template.tags[0].toLowerCase()}`;
}
    }

    createTableCell(row, template.id);
    createTableCell(row, template.name);
    const languageFlagsCell = setupFlagIcons(template, languageCounts);
    row.appendChild(languageFlagsCell);
    createTableCell(row, template.urls[0], true);

    createTableCell(row, new Date(template.created).toLocaleDateString());
    createTableCell(row, new Date(template.lastModified).toLocaleDateString());
    createTableCell(row, template.usageCount);
    createTableCell(row, template.status);

    const actionCell = document.createElement('td');
    ['Edit', 'Show', 'Delete'].forEach(action => {
        const btn = document.createElement('button');
        btn.textContent = action;
        btn.classList.add('extension-button'); // Add the class to the button
        btn.addEventListener('click', function() {
            if (action === 'Edit') {
                sessionStorage.setItem('editingTemplate', JSON.stringify(template));
                window.location.href = 'details.html';
            } else if (action === 'Show') {
                ['FR', 'EN', 'DE', 'LU'].forEach(lang => {
                    if (template.contents[lang] && template.contents[lang].data) {
                        const modal = document.getElementById(`template-content-modal-${lang.toLowerCase()}`);
                        const modalContentContainer = document.getElementById(`template-content-container-${lang.toLowerCase()}`);
                        modalContentContainer.innerHTML = template.contents[lang].data;
                        
                        // Set initial values for transition
                        modal.style.opacity = '0';
                        modal.style.transform = 'translateY(-50px)';
                        modal.style.display = 'block';
                        
                        // Apply final values after a short delay
                        setTimeout(() => {
                            modal.style.opacity = '1';
                            modal.style.transform = 'translateY(0)';
                        }, 10);
                    }
                });
            } else if (action === 'Delete') {
                deleteTemplate(templates.indexOf(template));
            }
        });
        actionCell.appendChild(btn);
    });
    row.appendChild(actionCell);
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
        chrome.storage.local.get('templates', function(result) {
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
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.darkModeActive) {
        if (changes.darkModeActive.newValue) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});


export { displayTemplates, deleteTemplate };
