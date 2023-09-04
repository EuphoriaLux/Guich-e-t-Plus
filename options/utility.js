function createTableCell(row, content, isHTML) {
    const cell = document.createElement('td');
    if (isHTML) {
        cell.innerHTML = content;
    } else {
        cell.textContent = content;
    }
    row.appendChild(cell);
    return cell;  // Return the created cell
}



function setupFlagIcons(template, languageCounts) {
    const languageBody = document.createElement('tbody');

    ['FR', 'EN', 'DE', 'LU'].forEach(lang => {
        const langRow = document.createElement('tr');

        const flagIcon = document.createElement('img');
        flagIcon.className = 'language-flag';
        flagIcon.src = `./media/png/${lang}.png`;
        flagIcon.alt = `${lang} Flag`;

        flagIcon.addEventListener('click', function() {
            sessionStorage.setItem('editingTemplate', JSON.stringify(template));
            sessionStorage.setItem('editingLanguage', lang);
            window.open('./addTemplate/addTemplate.html', '_blank');  // Open in a new tab
        });
        

        let urlCellContent;
        if (template.contents && template.contents[lang] && template.contents[lang].sourceURL) {
            urlCellContent = `<a href="${template.contents[lang].sourceURL}" target="_blank">${template.contents[lang].sourceURL}</a>`;
        } else {
            urlCellContent = "Content is missing";
            flagIcon.classList.add('missing-content');
        }

        const flagCell = document.createElement('td');
        flagCell.appendChild(flagIcon);
        langRow.appendChild(flagCell);

        createTableCell(langRow, lang);
        createTableCell(langRow, urlCellContent, true);

        languageCounts[lang] = (languageCounts[lang] || 0) + 1;

        languageBody.appendChild(langRow);
    });

    return languageBody;
}

function calculateCompletionPercentage(templates) {
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
    return (currentCompletionPoints / totalPossibleCompletionPoints) * 100;
}



export { createTableCell, setupFlagIcons, calculateCompletionPercentage };
