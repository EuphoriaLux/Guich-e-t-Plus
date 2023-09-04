// Function to create and append child elements
function createAndAppendChild(parent, elementType, id, innerHTML = "") {
    const element = document.createElement(elementType);
    element.id = id;
    element.innerHTML = innerHTML;
    parent.appendChild(element);
    return element;
}

function initializeDarkMode() {
    // Check initial dark mode state from chrome.storage.local
    chrome.storage.local.get('darkModeActive', function (data) {
        if (data.darkModeActive) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}


const geoportailCheckInterval = setInterval(() => {
    const geoportail = document.querySelector('.geoportail');
    if (geoportail) {
        clearInterval(geoportailCheckInterval);

        const geoportailAddresses = geoportail.querySelector('.geoportail-addresses');
        if (geoportailAddresses) {
            const newDiv = document.createElement('div');
            newDiv.className = 'custom-geoportail-container';

            const clonedGeoportailAddresses = geoportailAddresses.cloneNode(true);
            if (clonedGeoportailAddresses.id) {
                clonedGeoportailAddresses.removeAttribute('id');
            }

            // Set width to auto
            clonedGeoportailAddresses.style.width = 'auto';

            newDiv.appendChild(clonedGeoportailAddresses);

            const pageTextElement = document.querySelector('.page-text');
            if (pageTextElement) {
                pageTextElement.appendChild(newDiv);

                const listItems = newDiv.querySelectorAll('li');
                listItems.forEach((item, index) => {
                    const innerDiv = item.querySelector('.vcard');
                    if (innerDiv) {
                        // Start with a collapsed state
                        innerDiv.classList.add('collapsed');
                        innerDiv.style.maxHeight = '35px';  // Initially set max-height to 20px to match the CSS
                    }

                    if (index >= 5) {
                        item.classList.add('hidden');
                    }
                });

                const toggleButton = document.createElement('button');
                toggleButton.id = 'toggleButton';
                toggleButton.textContent = 'Show More';
                newDiv.appendChild(toggleButton);

                toggleButton.addEventListener('click', function () {
                    listItems.forEach(item => {
                        if (item.classList.contains('hidden')) {
                            if (item.classList.contains('show')) {
                                item.classList.remove('show');
                                toggleButton.textContent = 'Show More';
                            } else {
                                item.classList.add('show');
                                toggleButton.textContent = 'Show Less';
                            }
                        }
                    });
                });

                // Add a click event listener for each list item
                listItems.forEach((item) => {
                    item.addEventListener('click', function () {
                        const innerDiv = item.querySelector('.vcard');
                        if (innerDiv) {
                            const isCollapsed = innerDiv.classList.toggle('collapsed');
                            if (isCollapsed) {
                                innerDiv.style.maxHeight = '35px';
                            } else {
                                innerDiv.style.maxHeight = `${innerDiv.scrollHeight}px`;
                            }
                        }
                    });
                });
            }
        }
    }
}, 1000);


console.log("Before async function");

(async function () {
    console.log("Inside async function");

    // Add the 'dark-mode' class to the body by default
    document.body.classList.add('dark-mode');
    initializeDarkMode();  // Add this line here

    const mainElement = document.getElementById("main");
    console.log("#main exists:", Boolean(mainElement));
    if (!mainElement) {
        console.log('Main element not found');
        return;
    }

    const flexContainer = createAndAppendChild(mainElement, 'div', 'main-container');
    const wrapper = createAndAppendChild(flexContainer, 'div', 'main-wrapper', mainElement.innerHTML);
    const toolContainer = createAndAppendChild(flexContainer, 'div', 'tool-container');

    const buttonMenuContainer = createAndAppendChild(toolContainer, 'div', 'button-menu-container');

    const toggleDarkModeButton = createAndAppendChild(buttonMenuContainer, 'button', 'toggle-dark-mode-button', 'Black-Mode - BETA in Progress');
    toggleDarkModeButton.className = "extension-button";
    for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        toggleDarkModeButton.appendChild(span); // Changed from exampleButton.appendChild(span)
    }

    const toggleStandardTemplateButton = createAndAppendChild(buttonMenuContainer, 'button', 'toggle-standard-template-button', 'Standard Template Builder');
    toggleStandardTemplateButton.className = "extension-button";
    for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        toggleStandardTemplateButton.appendChild(span); // Changed from exampleButton2.appendChild(span)
    }

    const openOptionsButton = createAndAppendChild(buttonMenuContainer, 'button', 'open-options-button', 'Open Options');
    openOptionsButton.className = "extension-button";


    const standardTemplateContainer = await buildStandardTemplate(toolContainer);

    mainElement.innerHTML = '';
    mainElement.appendChild(flexContainer);

    toggleDarkModeButton.addEventListener("click", function () { // Changed from exampleButton.addEventListener
        const isDarkModeActive = document.body.classList.toggle('dark-mode');
        chrome.storage.local.set({ 'darkModeActive': isDarkModeActive });
    });


    toggleStandardTemplateButton.addEventListener("click", function () { // Changed from exampleButton2.addEventListener
        if (standardTemplateContainer) {
            standardTemplateContainer.style.display = (standardTemplateContainer.style.display === 'none') ? 'block' : 'none';
        }
    });

// Add an event listener to open the options page when clicked
openOptionsButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({action: "openOptionsPage"});
});



    console.log("Async function completed");
})();

console.log("After async function");

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'darkModeActive') {
            if (newValue) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }
});


