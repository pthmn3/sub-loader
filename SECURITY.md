# Security Policy

## Reporting Security Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report any security vulnerabilities to the maintainers privately.

### Process

1. Contact the maintainers through GitHub
2. Describe the vulnerability in detail
3. Include any proof-of-concept code if applicable
4. Allow time for the team to respond and patch

## Security Considerations

### Extension Permissions

This extension uses the following permissions:
- `storage` - To save user settings and subtitle history
- `tabs` - To access current tab information
- `host_permissions` for netflix.com - To inject and run scripts on Netflix pages

These permissions are minimal and necessary for core functionality.

### Data Privacy

- **No user data is collected or transmitted**
- **All subtitle files are processed locally**
- **Settings are stored only in browser's local storage**
- **No external APIs or services are used**
- **No telemetry or analytics**

### Safe Browsing

This extension:
- Does not inject malicious code
- Does not modify Netflix's functionality beyond subtitle injection
- Does not track user activity
- Does not steal credentials or personal information
- Works only on netflix.com domain

## Browser Security

The extension uses Chrome's sandbox model for content scripts:
- Content scripts have limited access
- Cannot access extension's page data
- Cannot access other websites
- Communication is message-based

## Staying Up to Date

Keep the extension updated to receive security patches:
1. Check GitHub releases regularly
2. Follow security advisories
3. Report any suspicious behavior

---

For any security concerns, please get in touch with the maintainers privately.
