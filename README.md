# Sub Loader

A Chrome web extension that lets you load custom subtitles directly onto Netflix videos.

## Features

🎬 **Easy Subtitle Loading**
- Load subtitles from URL or upload from your computer
- Support for VTT, SRT, ASS, and SSA formats
- Real-time subtitle synchronization

⚙️ **Smart Features**
- Auto-load your favorite subtitles automatically
- Recent subtitles history for quick access
- Persistent storage of settings
- One-click subtitle management

🌐 **User-Friendly**
- Simple popup interface
- Multiple language support
- Works seamlessly with Netflix

## Quick Start

1. **Install the extension:**
   - Open `chrome://extensions/` 
   - Enable "Developer Mode"
   - Click "Load unpacked" and select this folder

2. **Use on Netflix:**
   - Navigate to netflix.com and play a video
   - Click the Sub Loader icon
   - Paste a subtitle URL or upload a file
   - Click "Load Subtitles"

## Subtitle Sources

Popular websites to find subtitles:
- **OpenSubtitles.com** - Largest subtitle database
- **Subscene.com** - Multi-language subtitles
- **Podnapisi.net** - Extensive collection
- **TMDB.org** - Movie/TV database

## File Structure

```
sub-loader/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── styles.css            # Styling
├── content-script.js     # Netflix page injection
├── background.js         # Background service worker
├── welcome.html          # Installation welcome page
├── icons/                # Extension icons (16x16, 48x48, 128x128)
├── SETUP.md              # Detailed setup guide
└── README.md             # This file
```

## How It Works

1. **Content Script Injection** - Runs on Netflix pages and monitors video playback
2. **Subtitle Parsing** - Converts SRT/VTT files into subtitle objects
3. **Overlay Display** - Shows subtitles that match the current playback time
4. **Storage** - Saves your settings and recent subtitles

## Supported Subtitle Formats

- **WebVTT (.vtt)** - Modern standard format
- **SubRip (.srt)** - Most common format
- **Advanced SubStation Alpha (.ass)**
- **SubStation Alpha (.ssa)**

## System Requirements

- Chrome, Edge, Brave, or any Chromium-based browser
- Extension must be loaded in Developer Mode
- Netflix account and video playback required

## Permissions

- **storage** - Save settings and subtitle history
- **tabs** - Access current tab information  
- **host_permissions** - Inject into netflix.com

## Troubleshooting

**Subtitles not showing?**
- Ensure a video is currently playing
- Verify subtitle file format (VTT/SRT recommended)
- Try refreshing the Netflix page
- Check browser console for errors

**URL not loading?**
- Verify the URL is correct and publicly accessible
- Check if the subtitle file supports CORS
- Try uploading the file instead

For more detailed troubleshooting, see [SETUP.md](SETUP.md).

## Development

### File Overview

- **manifest.json** - Defines extension permissions and entry points
- **content-script.js** - Core subtitle injection logic
- **popup.js** - User interface and settings management
- **background.js** - Service worker for extension lifecycle

### To Modify

1. Edit files as needed
2. Reload the extension: `chrome://extensions` → Reload button
3. Test on Netflix.com

## Known Limitations

- Desktop browsers only (Netflix app not supported)
- Subtitles must be provided manually
- Fixed positioning at bottom of screen
- Some advanced formatting may not render

## Future Improvements

- [ ] Drag-and-drop subtitle upload
- [ ] Subtitle font/color customization
- [ ] Automatic subtitle searching
- [ ] Support for multiple simultaneous subtitles
- [ ] Keyboard shortcuts for quick control
- [ ] Movie/TV show database integration

## License

Educational use only. Respect copyright and Netflix's terms of service.

## Support

If you encounter issues:
1. Check the troubleshooting section in [SETUP.md](SETUP.md)
2. Review browser console errors (F12)
3. Ensure Netflix video is playing
4. Try disabling other extensions

---

**Version:** 1.0.0  
**Last Updated:** 2026  
**Compatibility:** Chrome, Edge, Brave, Chromium-based browsers

Happy watching! 🍿