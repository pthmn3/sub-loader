# Contributing to Sub Loader

Thank you for your interest in contributing to Sub Loader! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives and experiences
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the GitHub issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if possible**
- **Include your browser and OS version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **A clear and descriptive title**
- **A step-by-step description of the suggested enhancement**
- **Specific examples to demonstrate the steps**
- **A description of the current behavior and expected behavior**
- **Why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the JavaScript styleguide
- Include appropriate test cases
- End all files with a newline
- Avoid platform-dependent code

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sub-loader.git
   cd sub-loader
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes
5. Test thoroughly on Netflix.com
6. Commit with clear messages:
   ```bash
   git commit -m "Add feature: description"
   ```
7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. Open a Pull Request

## Styleguide

### JavaScript
- Use `const` by default, `let` if you need to reassign
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await over callbacks when possible

### File Naming
- Use kebab-case for file names (e.g., `content-script.js`)
- Use camelCase for JavaScript variables and functions

### Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line

## Project Structure

```
sub-loader/
├── manifest.json       - Extension configuration
├── popup.html/js       - UI components
├── content-script.js   - Netflix interaction
├── background.js       - Service worker
├── styles.css          - Styling
├── icons/              - Extension icons
└── docs/               - Documentation
```

## Testing

1. Load the extension in Developer Mode
2. Test on Netflix.com with various videos
3. Test with different subtitle formats (VTT, SRT)
4. Test file uploads and URL loading
5. Check browser console for errors

## Need Help?

- Check existing issues and discussions
- Read the [SETUP.md](SETUP.md) guide
- Review [PROJECT.md](PROJECT.md) for technical details
- Open a GitHub Discussion for questions

---

Thank you for contributing! 🎉
