# Guichet.lu Customer Support Enhancer

## 📌 Introduction

This browser extension is an open-source project aimed at enhancing customer support in relation with Guichet.lu. It's designed to improve the structure of the existing Guichet.lu system to allow easy and fast access to response templates in four languages: **English (en), French (fr), German (de), and Luxembourgish (lu)**.

> 🌟 Special Thanks to my company for allowing the development of this extension on behalf of a Helpdesk for Luxembourg.

## 🚀 Features

- 🌐 Multi-language Support (en, fr, de, lu)
- 🌙 Dark Mode


## 🕊️ Up-Coming Features

- 📑 Quick Access to Response Templates
- 💼 Template Management System
- ✨ And more...
- 🪇 Installing from Chrome Web Store (Future) Once the extension is available on the Chrome Web Store, you can directly install it from there.

## ⚙️ Installation

1. Download the code

2. **Navigate to Chrome Extensions**:  
Open Google Chrome, click on the three-dot menu on the top-right corner, and go to `Extensions`.

3. **Enable Developer Mode**:  
Toggle the "Developer mode" switch on the top-right corner of the Extensions page.

4. **Load Unpacked Extension**:  
Click on the "Load unpacked" button that appears after enabling Developer mode. Navigate to the directory where you cloned the repository and select it.

5. **Extension Loaded**:  
You should now see your extension in the list, and it should be automatically enabled.



## 🛠️ Usage

### Content Scripts

#### `content.js`

JavaScript logic to dynamically manipulate the DOM on Guichet.lu web pages, facilitating features like adding a sidebar and leaving unneccessary code block from original webpage, who provide more place for quick access to response templates and more...

#### `content.css`

Works in tandem with `content.js` to style the HTML elements manipulated or added by the JavaScript, including buttons, text areas, and more.

### Additional Styles

#### `darkmode.css`

Provides the dark mode styling, enhancing readability and reducing eye strain during extended use.

#### `standard_template_builder.css`

Stylesheet specific to the standard template builder, affecting elements like buttons, form fields, and layout.

### Standard Template Builder

#### `standard_template_builder.js`

Core logic for building and customizing standard templates for different languages. Includes functionalities like converting relative URLs to absolute ones, fetching organization details, and more.

**Key Functions:**
- `createElementWithId(tagName, id)`: Creates HTML elements with specific IDs.
- `convertRelativeToAbsoluteURLs(element)`: Converts relative URLs to absolute ones.
- `getOrganizationDetails()`: Fetches organization-specific details for template customization.
- `getLastBreadcrumbLink(language, id)`: Retrieves the last breadcrumb link based on the specified language and ID.

## 👥 Contribution

Feel free to fork this project and make your contributions. For any major changes, please open an issue first.
