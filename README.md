# Guichet Plus

## 📌 Introduction

This browser extension is an open-source project aimed at enhancing customer support in relation with Guichet 
It's designed to improve the structure of the existing Guichet Website to allow easy and fast access to response templates in four languages: 

**🌐 Supported Languages:**
- 🇬🇧 English (en)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇱🇺 Luxembourgish (lu)


> 🌟 Special Thanks to my company.

## 🚀 Features

- 🏷️ Standard Template Generation: Automatically creates standard templates based on the loaded webpage
- 😎 Reduced Eye Strain: The dark color scheme reduces eye strain during extended use.
- 🗑️ Code Block Removal: Removes unnecessary code blocks from the original webpage to provide more space for essential features.

## 🕊️ Up-Coming Features

- 📑 Quick Access to Non-Standard Templates (also called real Templates)
- 💼 Template Management System
- 🪇 Installing from Chrome Web Store (Future) Once the extension is available on the Chrome Web Store, you can directly install it from there.
- ✨ And more...
  
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

#### 📜 `content.js`

- 🧩 **Dynamic DOM Manipulation**: Alters the Guichet.lu web pages in real-time to enhance functionality.
- 🌐 **Multi-Language Support**: Facilitates quick access to response templates in various languages.
- 📑 **Sidebar Addition**: Adds a sidebar for easier navigation and access to commonly used features.
- 🗑️ **Code Block Removal**: Removes unnecessary code blocks from the original webpage to provide more space for essential features.

### Additional Styles

#### 🌙 `darkmode.css`

- 📖 **Enhanced Readability**: Provides styling that's easier on the eyes, especially in low-light conditions.
- 😎 **Reduced Eye Strain**: The dark color scheme reduces eye strain during extended use.
- 🌓 **Toggleable**: Can be toggled on and off based on user preference.

### Standard Template Builder

#### 🛠️ `standard_template_builder.js`

- 🌐 **Multi-Language Templates**: Core logic for building and customizing standard templates across different languages.
- 🔗 **URL Conversion**: Includes functionality to convert relative URLs to absolute ones.
- 🏢 **Organization Details**: Fetches organization-specific details for use in templates.

**🔑 Key Functions:**
- 🏷️ **Standard Template Generation**: Automatically creates standard templates based on the loaded webpage for consistent Helpdesk support.
- 🔗 **Quick Copy to Clipboard**: Features a quick "Copy to Clipboard" button to instantly save the template in the Windows Clipboard. Supports HTML-formatted text.
- 🏢 **Quick Admin Assignment**: Allows for the quick addition of the administration responsible for the procedure.
- 🖋️ **Breadcrumb Inclusion**: Enhances customer support by adding breadcrumb navigation to the template. Thanks to HTML-formatted text, multiple URLs can be captured and pasted seamlessly.

## 👥 Contribution

Feel free to fork this project and make your contributions. For any major changes, please open an issue first.
