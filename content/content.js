// Function to create and append child elements
function createAndAppendChild(parent, elementType, id, innerHTML = "") {
    const element = document.createElement(elementType);
    element.id = id;
    element.innerHTML = innerHTML;
    parent.appendChild(element);
    return element;
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

                toggleButton.addEventListener('click', function() {
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
                    item.addEventListener('click', function() {
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

// ... (rest of your existing code)


// ... (rest of your existing code)


console.log("Before async function");

(async function () {
    console.log("Inside async function");

    // Add the 'dark-mode' class to the body by default
    document.body.classList.add('dark-mode');
    
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

    const exampleButton = createAndAppendChild(buttonMenuContainer, 'button', 'example-button', 'Black-Mode - BETA in Progress');
    exampleButton.className = "extension-button";
    for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        exampleButton.appendChild(span);
    }

    const exampleButton2 = createAndAppendChild(buttonMenuContainer, 'button', 'example-button2', 'Standard Template Builder');
    exampleButton2.className = "extension-button";
    for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        exampleButton2.appendChild(span);
    }

    const standardTemplateContainer = await buildStandardTemplate(toolContainer);

    mainElement.innerHTML = '';
    mainElement.appendChild(flexContainer);

    exampleButton.addEventListener("click", function () {
        document.body.classList.toggle('dark-mode');
    });
    
    

    exampleButton2.addEventListener("click", function () {
        if (standardTemplateContainer) {
            standardTemplateContainer.style.display = (standardTemplateContainer.style.display === 'none') ? 'block' : 'none';
        }
    });
    // ... (rest of your async function code here)
    console.log("Async function completed");
})();

console.log("After async function");

