# Extension Setup Guide

## Sub Loader - Load Custom Subtitles to Netflix!

This is a Chrome/Chromium web extension that allows you to load custom subtitle files (VTT, SRT, ASS, SSA) onto Netflix videos.

### Installation

#### Chrome/Chromium (Recommended)

1. **Clone or download** this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `sub-loader` folder
6. The extension is now installed! You should see it in your toolbar

#### Edge/Brave

The same process works for Edge, Brave, and other Chromium-based browsers:
- Edge: `edge://extensions/`
- Brave: `brave://extensions/`

### Usage

1. **Go to Netflix** and start playing a video
2. **Click the Sub Loader icon** in your browser toolbar
3. **Provide subtitle file** in one of two ways:
   - Paste a **URL** to a subtitle file (VTT, SRT, etc.)
   - Click **"Browse File"** to upload a file from your computer
4. **Select language** (optional) from the dropdown
5. **Click "Load Subtitles"**
6. Subtitles will appear at the bottom of the video!

### Features

✨ **Supported Formats:**
- WebVTT (.vtt)
- SubRip (.srt)
- Advanced SubStation Alpha (.ass)
- SubStation Alpha (.ssa)

⚙️ **Key Features:**
- Load from URL or local file
- Automatic language detection
- Auto-load favorite subtitles
- Recent subtitles history
- One-click removal
- Persistent storage

### Subtitle File Sources

Here are some places to find subtitle files:

- **OpenSubtitles.com** - Largest subtitle database
- **Subscene.com** - Extensive subtitle collection
- **Podnapisi.net** - Multi-language subtitles
- **SubtitleSeeker.com** - Search multiple sources
- **TMDB** - Movie and TV subtitle database

### Troubleshooting

**Subtitles not showing?**
- Make sure a video is currently playing
- Check that the subtitle file format is supported (VTT, SRT, ASS, SSA)
- Try refreshing the Netflix page
- Check browser console (F12) for error messages

**"Could not find Netflix video player" error**
- Start playing a video first
- Wait a few seconds and try again
- Netflix player may take time to fully load

**Subtitles won't load from URL**
- Check that the URL is correct
- Verify the URL is publicly accessible
- The subtitle file must allow CORS requests
- Try downloading and uploading the file instead

**File upload not working**
- Ensure the file is in a supported format
- File should be in UTF-8 encoding
- Maximum file size should be reasonable (typically <10MB)

### File Format Support

#### VTT (WebVTT)
```
WEBVTT

00:00:00.000 --> 00:00:03.000
This is the first subtitle

00:00:04.000 --> 00:00:07.000
This is the second subtitle
```

#### SRT (SubRip)
```
1
00:00:00,000 --> 00:00:03,000
This is the first subtitle

2
00:00:04,000 --> 00:00:07,000
This is the second subtitle
```

### Extension Icons

The extension uses 16x16, 48x48, and 128x128 pixel icons. To customize:

1. Create or generate PNG images for each size
2. Replace the icon files in the `icons/` folder
3. Reload the extension in `chrome://extensions/`

Recommended icon design: A film strip or subtitle symbol with purple/blue gradient

### Development

To modify the extension:

1. **manifest.json** - Extension configuration and permissions
2. **popup.html/js** - The extension popup UI
3. **content-script.js** - Runs on Netflix pages to inject subtitles
4. **background.js** - Background service worker
5. **styles.css** - Styling for the popup

### How It Works

1. When you provide a subtitle file, it's parsed into individual subtitle entries
2. The content script tracks the Netflix video's playback position
3. For each frame, the appropriate subtitle is displayed in an overlay
4. The overlay appears near the bottom of the video player

### Known Limitations

- Only works on `netflix.com` (not mobile apps)
- Requires manual subtitle file provision (no automatic searching)
- Subtitle positioning is fixed at bottom of screen
- Some advanced SRT features may not display correctly

### Permissions

The extension requires:
- **storage** - To save your settings and subtitle history
- **tabs** - To access the current tab information
- **host_permissions for netflix.com** - To inject subtitles on Netflix

### Support

If you encounter issues:

1. Check the browser console (F12 → Console tab)
2. Look for error messages from "[Sub Loader]"
3. Try the troubleshooting section above
4. Report issues with detailed information about what went wrong

### License

This project is for educational purposes. Use responsibly and respect copyright laws in your jurisdiction.

---

Enjoy watching Netflix with your custom subtitles! 🎬
