function validateMatricule() {
    let matricule = document.getElementById("matricule").value;
    let feedback = document.getElementById("matriculeFeedback");
    let fieldset = document.getElementById("matricule").closest("fieldset"); // Get the parent fieldset

    if (!/^\d{13}$/.test(matricule)) {
        feedback.textContent = "Le matricule doit être un numéro à 13 chiffres.";
        fieldset.classList.remove("validated-fieldset");
        return false;
    } else {
        feedback.textContent = "Matricule valide!";
        feedback.className = "valid-feedback";
        fieldset.classList.add("validated-fieldset"); // Make the fieldset green

        // Calculate Modulo 97 when matricule is valid
        validateModulo97();
        
        return true;
    }
}


function validateSSN() {
    let ssn = document.getElementById("ssn").value;
    let feedback = document.getElementById("ssnFeedback");
    let ssnDigitsPlaceholder = document.getElementById("ssnDigitsPlaceholder");
    let fieldset = document.getElementById("ssn").closest("fieldset");

    if (!/^\d{20}$/.test(ssn)) {
        feedback.textContent = "Le SSN doit être un numéro à 20 chiffres.";
        feedback.className = "feedback";
        fieldset.classList.remove("validated-fieldset");
        ssnDigitsPlaceholder.textContent = "Invalid SSN";
        return false;
    } else {
        let isValidModulo = validateModulo97();
        ssnDigitsPlaceholder.textContent = ssn.substring(6, 8);
        if (isValidModulo) {
            fieldset.classList.add("validated-fieldset"); // Make the fieldset green if SSN and Modulo97 are valid
        } else {
            fieldset.classList.remove("validated-fieldset");
        }
        return isValidModulo;
    }
}


// Modulo97 analysis
function validateModulo97() {
    let ssn = document.getElementById("ssn").value;

    let birthDateText = document.getElementById("birthdateDisplay").textContent;

    let moduloPlaceholder = document.getElementById("moduloPlaceholder");

    let day = birthDateText.substring(0, 2);
    let month = birthDateText.substring(3, 5);
    let year = birthDateText.substring(6, 10);
    
    let birthDate = day + month + year;
    let modulo = parseInt(birthDate, 10) % 97; // Parsing birthDate to integer before modulo operation
    let formattedModulo = String(modulo).padStart(2, '0');  // Ensure it's two digits

    console.log(modulo);
    console.log(birthDate)
    let ssnDigits = parseInt(ssn.substring(8, 10), 10); // Parsing the substring to integer

    let feedback = document.getElementById("ssnFeedback");

    if (modulo !== ssnDigits) {
        feedback.textContent = "Le SSN ne correspond pas à la date de naissance.";
        feedback.className = "feedback";
        moduloPlaceholder.textContent = modulo;
        moduloPlaceholder.textContent = formattedModulo;
        return false;
    } else {
        feedback.textContent = "Le SSN est valide.";
        feedback.className = "valid-feedback";
        moduloPlaceholder.textContent = modulo;
        moduloPlaceholder.textContent = formattedModulo;
        return true;
    }
}




// Function to display validation message based on results
function displayValidationMessage(isValid) {
    let validationMessage = document.getElementById("validationMessage");
    if (isValid) {
        validationMessage.textContent = "Validation Successful! All fields are correct.";
        validationMessage.style.backgroundColor = "#D4EDDA"; // Greenish background for success
        validationMessage.style.color = "#155724"; // Dark green text for success
    } else {
        validationMessage.textContent = "Validation Failed! Please check the highlighted fields.";
        validationMessage.style.backgroundColor = "#F8D7DA"; // Reddish background for error
        validationMessage.style.color = "#721C24"; // Dark red text for error
    }
    validationMessage.style.display = "block";
}

function validateForm() {
    let isValidMatricule = validateMatricule();
    let isValidSSN = validateSSN();
    let isValidNameMatching = validateNameMatching(); // Assuming this function checks both names and surnames for matching
    let isValidModulo97 = validateModulo97(); // This function should return true or false based on the analysis

    let validationMessage = document.getElementById("validationMessage");
    if (isValidMatricule && isValidSSN && isValidNameMatching && isValidModulo97) {
        validationMessage.textContent = "Validation Successful! All fields are correct.";
        validationMessage.style.backgroundColor = "#D4EDDA";
        validationMessage.style.color = "#155724";
        validationMessage.style.display = "block";
    } else {
        validationMessage.textContent = "Validation failed. Please correct the highlighted fields.";
        validationMessage.style.backgroundColor = "#f8d7da";
        validationMessage.style.color = "#721c24";
        validationMessage.style.display = "block";
    }
    populateSummary();
}


function displayDetailedValidationMessage(message) {
    let validationMessage = document.getElementById("validationMessage");
    validationMessage.textContent = message;
    validationMessage.style.backgroundColor = "#F8D7DA"; // Reddish background for error
    validationMessage.style.color = "#721C24"; // Dark red text for error
    validationMessage.style.display = "block";
}


// Adding event listeners for real-time validation
document.getElementById("matricule").addEventListener("input", validateMatricule);
document.getElementById("ssn").addEventListener("input", validateSSN);

// Function to validate general input fields
function validateInput(inputId, feedbackId) {
    let input = document.getElementById(inputId).value;
    let feedback = document.getElementById(feedbackId);
    
    if (input.trim() === "") {
        feedback.textContent = "Ce champ ne peut pas être vide.";
        feedback.className = "feedback";
        return false;
    } else {
        feedback.textContent = "Valide!";
        feedback.className = ""; feedback.className = "valid-feedback";
        return true;
    }
}

function validateNameMatching() {
    let rnppName = document.getElementById("rnppName").value;
    let cardIdName = document.getElementById("cardIdName").value;
    let rnppPrenom = document.getElementById("rnppPrenom").value;
    let cardIdPrenom = document.getElementById("cardIdPrenom").value;
    let rnppFeedback = document.getElementById("rnppFeedback");
    let fieldset = document.getElementById("rnppName").closest("fieldset"); // Get the parent fieldset
    
    if (rnppName !== cardIdName || rnppPrenom !== cardIdPrenom) {
        if (rnppName !== cardIdName) {
            rnppFeedback.textContent = "Le nom RNPP ne correspond pas au nom de la ?Carte ID?";
        } else if (rnppPrenom !== cardIdPrenom) {
            rnppFeedback.textContent = "Le prénom RNPP ne correspond pas au prénom de la ?Carte ID?";
        }
        
        rnppFeedback.className = "feedback"; 
        fieldset.classList.remove("validated-fieldset");
        return false;
    } else {
        rnppFeedback.textContent = "Les noms et prénoms correspondent à ceux de la Carte ID!";
        rnppFeedback.className = "valid-feedback";
        fieldset.classList.add("validated-fieldset"); // Make the fieldset green
        return true;
    }
}

function displayBirthDateFromMatricule() {
    let matricule = document.getElementById("matricule").value;
    let birthdateDisplay = document.getElementById("birthdateDisplay");

    if (/^\d{13}$/.test(matricule)) {
        let year = matricule.substring(0, 4);
        let month = matricule.substring(4, 6);
        let day = matricule.substring(6, 8);
        birthdateDisplay.textContent = `${day}/${month}/${year}`;
    } else {
        birthdateDisplay.textContent = "---";
    }
}



document.getElementById("toggleScriptBtn").addEventListener("click", function() {
    var scriptDiv = document.getElementById("helpdeskScript");
    if (scriptDiv.style.display === "none") {
        scriptDiv.style.display = "block";
        this.textContent = "Masquer le Script";
    } else {
        scriptDiv.style.display = "none";
        this.textContent = "Afficher le Script";
    }
});

function populateSummary() {
    document.getElementById("summaryRnppNom").textContent = document.getElementById("rnppName").value;
    document.getElementById("summaryRnppPrenom").textContent = document.getElementById("rnppPrenom").value;
    document.getElementById("summaryLuxtrustNom").textContent = document.getElementById("cardIdName").value;
    document.getElementById("summaryLuxtrustPrenom").textContent = document.getElementById("cardIdPrenom").value;
    
    let ssnValue = document.getElementById("ssn").value;
    let highlightedSSN = ssnValue.substring(0, 6) + "<span class='highlight'>" + ssnValue.substring(6, 8) + "</span>" + ssnValue.substring(7);
    document.getElementById("summarySSN").innerHTML = highlightedSSN;

    document.getElementById("summaryMatricule").textContent = document.getElementById("matricule").value;
    document.getElementById("summaryModulo97").textContent = document.getElementById("moduloPlaceholder").textContent;
    
    document.getElementById("summaryData").style.display = "block";
}

function copyToClipboard() {
    let range = document.createRange();
    range.selectNode(document.getElementById("summaryData"));
    window.getSelection().removeAllRanges();  // clear current selection
    window.getSelection().addRange(range);    // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();  // to deselect
    alert("Summary copied to clipboard!");    // Optional: Provide feedback to the user
}


// Adding event listener to Matricule input for real-time birthdate display
document.getElementById("matricule").addEventListener("input", displayBirthDateFromMatricule);

document.getElementById("rnppName").addEventListener("input", validateNameMatching);
document.getElementById("rnppPrenom").addEventListener("input", validateNameMatching);
document.getElementById("cardIdName").addEventListener("input", validateNameMatching);
document.getElementById("cardIdPrenom").addEventListener("input", validateNameMatching);
document.getElementById("ssn").addEventListener("input", validateSSN);
document.getElementById("matricule").addEventListener("input", function() {
    validateMatricule();
    displayBirthDateFromMatricule();
});



// Function to toggle the visibility of the tutorial section
function toggleTutorial() {
    var tutorialSection = document.getElementById("tutorialSection");
    if (tutorialSection.style.display === "none") {
        tutorialSection.style.display = "block";
    } else {
        tutorialSection.style.display = "none";
    }
}

document.getElementById("validateButton").addEventListener("click", validateForm);


// Add event listener to the tutorial toggle button
document.getElementById("toggleTutorialBtn").addEventListener("click", toggleTutorial);
