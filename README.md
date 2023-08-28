# Guichet.lu Customer Support Enhancer

## 📌 Introduction

This browser extension is an open-source project aimed at enhancing customer support in relation with Guichet.lu. It's designed to improve the structure of the existing Guichet.lu system to allow easy and fast access to response templates in four languages: **English (en), French (fr), German (de), and Luxembourgish (lu)**.

> 🌟 Special Thanks to my company for allowing the development of this extension on behalf of a Helpdesk for Luxembourg.

## 🚀 Features

- 🌐 Multi-language Support (en, fr, de, lu)
- 🌙 Dark Mode
- ✨ And more...

## 🕊️ Up-Coming Features

- 📑 Quick Access to Response Templates

## ⚙️ Installation

1. Clone the repository
2. Load the extension into your browser
3. Follow the setup instructions

## 🛠️ Usage

### Content Scripts

#### `content.js`

JavaScript logic to dynamically manipulate the DOM on Guichet.lu web pages, facilitating features like quick access to response templates and multi-language support.

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
