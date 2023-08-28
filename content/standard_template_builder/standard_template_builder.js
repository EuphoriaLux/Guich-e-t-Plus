const getInnerText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
};

const langConfig = {
    'fr': {
        prefix: "Préfixe personnalisé: ",
        suffix: " :Suffixe personnalisé",
        customText: 'Votre texte spécifique ici'
    },
    'de': {
        prefix: "Benutzerdefiniertes Präfix: ",
        suffix: " :Benutzerdefiniertes Suffix",
        customText: 'Ihr spezifischer Text hier'
    },
    'lb': {
        prefix: "Benotzerdefinéierten Präfix: ",
        suffix: " :Benotzerdefinéierten Suffix",
        customText: 'Däin spezifeschen Text hei'
    },
    'en': {
        prefix: "Custom Prefix: ",
        suffix: " :Custom Suffix",
        customText: 'Your Specific Text Here'
    }
};

function createElementWithId(tagName, id) {
    const element = document.createElement(tagName);
    element.id = id;
    return element;
}

function convertRelativeToAbsoluteURLs(element) {
    const anchors = element.querySelectorAll('a');
    const pageOrigin = window.location.origin;
    anchors.forEach(anchor => {
        if (anchor.href && anchor.href.startsWith('/')) {
            anchor.href = `${pageOrigin}${anchor.href}`;
        }
    });
}

function getOrganizationDetails() {
    return {
        orgName: getInnerText('div[itemprop="name"]'),
        postalAddress: getInnerText('div[itemprop="address"]'),
        phoneNumber: getInnerText('span[itemprop="telephone"]')
    };
}

function getLastBreadcrumbLink(language, id) {
    const breadcrumbNav = document.querySelector('nav.breadcrumb');
    if (!breadcrumbNav) return null;

    const items = breadcrumbNav.querySelectorAll('li a');
    if (items.length === 0) return null;

    const lastLink = items[items.length - 1].cloneNode(true);
    const { prefix, suffix } = langConfig[language] || langConfig['en'];

    const wrapperDiv = createElementWithId('div', id);
    wrapperDiv.append(document.createTextNode(prefix), lastLink, document.createTextNode(suffix));
    return wrapperDiv;
}

function waitForElement(selector, maxAttempts = 10, interval = 500) {
    let attempts = 0;
    return new Promise((resolve, reject) => {
        const check = () => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, interval);
            } else {
                reject(new Error(`Element ${selector} not found after ${maxAttempts} attempts.`));
            }
        };
        check();
    });
}

function copyToClipboard(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
}

function createAndAppendChild(parent, tagName, id, innerHTML = null, extraClass = null) {
    const element = createElementWithId(tagName, id);
    if (extraClass) element.className = extraClass;
    if (innerHTML) element.innerHTML = innerHTML;
    parent.appendChild(element);
    return element;
}

async function buildStandardTemplate(toolContainer) {
    const standardTemplateContainer = createAndAppendChild(toolContainer, 'div', 'standard-template-container');
    standardTemplateContainer.style.display = 'none';

    const standardTemplateHeader = createAndAppendChild(standardTemplateContainer, 'div', 'standard-template-header');
    const standardTemplateDisplay = createAndAppendChild(standardTemplateContainer, 'div', 'standard-template-display');
    const standardTemplateFooter = createAndAppendChild(standardTemplateContainer, 'div', 'standard-template-footer');
    const customTextContainer = createAndAppendChild(standardTemplateDisplay, 'div', 'customTextContainer');

    const url = window.location.href;
    const language = url.split('/')[3];
    const breadcrumbId = 'breadcrumb-wrapper';

    const lang = langConfig[language] || langConfig['en'];
    customTextContainer.innerHTML = lang.customText;

    const lastBreadcrumbLinkWithText = getLastBreadcrumbLink(language, breadcrumbId);


    // Add a checkbox for Luxembourgish language
    const luxCheckbox = createAndAppendChild(standardTemplateFooter, 'input', 'lux-checkbox');
    luxCheckbox.type = 'checkbox';
    const luxCheckboxLabel = createAndAppendChild(standardTemplateFooter, 'label', 'lux-checkbox-label', ' Use Luxembourgish Text');

    // Event listener for Luxembourgish checkbox
    luxCheckbox.addEventListener('change', function () {
        const existingBreadcrumb = document.getElementById(breadcrumbId);
        let newBreadcrumb = null;

        if (this.checked) {
            customTextContainer.innerHTML = langConfig['lb'].customText;
            newBreadcrumb = getLastBreadcrumbLink('lb', breadcrumbId);
        } else {
            customTextContainer.innerHTML = lang.customText;
            newBreadcrumb = getLastBreadcrumbLink(language, breadcrumbId);
        }

        if (existingBreadcrumb && newBreadcrumb) {
            existingBreadcrumb.replaceWith(newBreadcrumb);
        } else if (newBreadcrumb) {
            standardTemplateDisplay.appendChild(newBreadcrumb);
        }
    });

    try {
        const pageTextDiv = await waitForElement('.page-text');
        const orgDetails = getOrganizationDetails();
        const orgDetailsDiv = createElementWithId('div', 'org-details');
        orgDetailsDiv.innerHTML = `
            <strong>Organization Details:</strong><br/>
            Name: ${orgDetails.orgName}<br/>
            Address: ${orgDetails.postalAddress}<br/>
            Phone: ${orgDetails.phoneNumber}<br/>
        `;

        const elementsBeforeBloub1 = document.createDocumentFragment();
        let child = pageTextDiv.firstChild;
        while (child) {
            if (child.nodeType === 1 && child.id === 'bloub-1') {
                break;
            }
            if (!(child.nodeType === 1 && child.classList.contains("messenger") && child.classList.contains("messenger--old"))) {
                elementsBeforeBloub1.appendChild(child.cloneNode(true));
            }
            child = child.nextSibling;
        }

        standardTemplateDisplay.appendChild(elementsBeforeBloub1);
        if (lastBreadcrumbLinkWithText) {
            standardTemplateDisplay.appendChild(lastBreadcrumbLinkWithText);
        }

        const copyButton = createAndAppendChild(standardTemplateFooter, 'button', 'copyButton', 'Copy to Clipboard');
        copyButton.className = "extension-button";
        for (let i = 0; i < 4; i++) {
            const span = document.createElement('span');
            copyButton.appendChild(span);
        }
    
        // Event listener for "Copy to Clipboard" button
        copyButton.addEventListener('click', function() {
            copyToClipboard(standardTemplateDisplay);
        });
        
        standardTemplateDisplay.appendChild(orgDetailsDiv);

    } catch (error) {
        console.error(error.message);
    }

    return standardTemplateContainer;
}
