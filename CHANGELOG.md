# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-15

### Added
- Initial release of Sub Loader
- Support for VTT, SRT, ASS, and SSA subtitle formats
- Load subtitles from URL or local file
- Real-time subtitle synchronization with Netflix videos
- Recent subtitles history (last 10 files)
- Auto-load favorite subtitles feature
- Multiple language selection
- Modern popup interface with gradient design
- Welcome page on installation
- Comprehensive documentation (README, SETUP, QUICKSTART guides)
- Browser extension icons (16x16, 48x48, 128x128)
- Test subtitle file for validation

### Technical Details
- Manifest V3 extension architecture
- Service Worker background integration
- Content script for Netflix page injection
- Chrome storage API for persistent settings
- Message-based communication between components
- Responsive popup UI with CSS Grid/Flexbox

## [Unreleased]

### Planned Features
- Drag-and-drop subtitle upload
- Subtitle font size customization
- Subtitle color/style customization
- Automatic subtitle searching and downloading
- Support for multiple simultaneous subtitles
- Keyboard shortcuts for quick control
- Movie/TV show database integration
- Firefox and Safari extension versions
- Advanced subtitle formatting (colors, effects)
- Subtitle offset adjustment
- Language auto-detection

### Improvements
- Enhanced error handling and user feedback
- Performance optimizations for large subtitle files
- Improved subtitle parser for edge cases
- Browser storage optimization
- Unit and integration tests
- Automated CI/CD pipeline

---

## Release Template

### [X.Y.Z] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing features

#### Fixed
- Bug fixes

#### Removed
- Removed features

#### Deprecated
- Soon-to-be removed features

#### Security
- Security fixes and vulnerabilities

---

For more information, see [Keep a Changelog](https://keepachangelog.com/).
