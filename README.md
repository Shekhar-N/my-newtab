# My New Tab

A custom browser extension that provides a personalized new tab page experience.

## Features

- Custom new tab page design
- Lightweight and fast
- Easy to customize

## Installation

### For Development
1. Clone or download this repository
2. Open your browser's extension management page:
   - **Chrome/Edge**: Navigate to `chrome://extensions` or `edge://extensions`
   - **Firefox**: Navigate to `about:debugging#/runtime/this-firefox`
3. Enable "Developer mode" (Chrome/Edge only)
4. Click "Load unpacked" and select this project folder

### For Users
Once packaged, this extension can be distributed through your browser's extension store.

## Project Structure

```
├── manifest.json      - Extension configuration and metadata
├── newtab.html       - New tab page HTML
├── newtab.css        - New tab page styles
├── newtab.js         - New tab page scripts
├── icons/            - Extension icons
└── README.md         - This file
```

## Development

### Making Changes
1. Edit the HTML, CSS, or JavaScript files
2. Refresh the extension in the browser (or reload the page)
3. Test your changes

### File Descriptions
- **manifest.json**: Defines the extension's permissions, icons, and entry points
- **newtab.html**: The HTML structure displayed on new tabs
- **newtab.css**: Styles for the new tab page
- **newtab.js**: JavaScript functionality for the new tab page

## License

MIT License - feel free to modify and distribute as needed.
