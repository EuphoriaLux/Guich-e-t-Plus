function createTableCell(row, content, isLink = false) {
    const cell = document.createElement('td');
    if (isLink) {
        const link = document.createElement('a');
        link.href = content;
        link.target = "_blank"; // To open in a new tab
        link.textContent = content;
        cell.appendChild(link);
    } else {
        cell.textContent = content;
    }
    row.appendChild(cell);
    return cell;
}

function setupFlagIcons(template, languageCounts) {
    const languageCell = document.createElement('td');

    ['FR', 'EN', 'DE', 'LU'].forEach(lang => {
        const flagIcon = document.createElement('img');
        flagIcon.className = 'flag-icon';
        flagIcon.src = chrome.runtime.getURL(`options/media/png/${lang}.png`);
        flagIcon.alt = lang;
        flagIcon.title = lang;

        if (!template.contents[lang] || !template.contents[lang].data) {
            flagIcon.style.opacity = '0.2';
            // Add event listener for non-existing language content
            flagIcon.addEventListener('click', function() {
                // Store the template and selected language in the session for retrieval in editTemplate.html
                sessionStorage.setItem('editingTemplate', JSON.stringify(template));
                sessionStorage.setItem('editingLanguage', lang);
                window.location.href = 'editTemplate/editTemplate.html';
            });
        } else {
            // Add event listener for existing language content
            flagIcon.addEventListener('click', function() {
                // Store the template and selected language in the session for retrieval in editTemplate.html
                sessionStorage.setItem('editingTemplate', JSON.stringify(template));
                sessionStorage.setItem('editingLanguage', lang);
                window.location.href = 'editTemplate/editTemplate.html';
            });
            languageCounts[lang]++;
        }
        languageCell.appendChild(flagIcon);
    });

    return languageCell;
}

function calculateCompletionPercentage(templates) {
    console.log("calculateCompletionPercentage called");
    if (!templates || templates.length === 0) return 0;  // Return 0% if no templates exist

    const totalPossibleCompletionPoints = templates.length * 4;
    let currentCompletionPoints = 0;

    templates.forEach(template => {
        ['FR', 'EN', 'DE', 'LU'].forEach(lang => {
            if (template.contents[lang] && template.contents[lang].data) {
                currentCompletionPoints++;
            }
        });
    });

    console.log("Total Possible:", totalPossibleCompletionPoints);
    console.log("Current Completion:", currentCompletionPoints);

    return (currentCompletionPoints / totalPossibleCompletionPoints) * 100;
}



export { createTableCell, setupFlagIcons, calculateCompletionPercentage };
