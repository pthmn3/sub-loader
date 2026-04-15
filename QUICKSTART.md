# Quick Start Guide

Get your Netflix subtitle loader extension up and running in 5 minutes!

## Step 1: Load the Extension (Chrome/Edge/Brave)

1. Open your browser and go to the **extensions page**:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`

2. **Enable "Developer Mode"** (toggle in top-right corner)

3. Click **"Load unpacked"** button

4. Navigate to your `/workspaces/sub-loader` folder and select it

5. ✅ You should see the Sub Loader extension installed!

## Step 2: Find Subtitles

You'll need a subtitle file in one of these formats:
- `.vtt` (WebVTT) - Recommended
- `.srt` (SubRip) - Common
- `.ass` or `.ssa` - Advanced formats

**Where to find subtitles:**
- 🌐 [OpenSubtitles.com](https://www.opensubtitles.com)
- 🎬 [Subscene.com](https://subscene.com)
- 🌍 [Podnapisi.net](https://podnapisi.net)
- 📺 [TMDB.org](https://www.themoviedb.org)

**Get a URL** by:
- Right-clicking the download link and copying the URL, OR
- Downloading the file and uploading it from your computer

## Step 3: Use on Netflix

1. Go to **netflix.com** and **start playing a video**

2. Click the **Sub Loader icon** in your toolbar (purple icon)

3. **One of two options:**
   - **Paste URL**: Enter the subtitle file URL
   - **Upload File**: Click "Browse File" to select from your computer

4. **Select language** (optional)

5. Click **"Load Subtitles"** 🎉

6. Subtitles will appear at the bottom of the video!

## Troubleshooting

### Subtitles not showing?
- ✅ Make sure a **video is currently playing** on Netflix
- ✅ Check the subtitle file **format** (VTT/SRT recommended)
- ✅ Try **refreshing** the Netflix page
- ✅ Check **browser console** for errors (F12 → Console)

### Upload not working?
- ✅ Use a **UTF-8 encoded** file
- ✅ File should be **under 10MB**
- ✅ Check file extension: `.srt` or `.vtt`

### URL not loading subtitles?
- ✅ Verify the URL is **correct**
- ✅ The file must be **publicly accessible**
- ✅ Try uploading the **file instead**

## Features Guide

### 📌 Recent Subtitles
Your last 10 subtitle files are saved:
- Click any recent subtitle to quickly reload it
- Or click "Clear History" to remove them

### ⚙️ Auto-Load
Enable "Auto-load on Netflix pages" to:
- Automatically load your favorite subtitles
- Works across all Netflix videos

### ❌ Remove Subtitles
Click "Remove Subtitles" to:
- Hide the current subtitle overlay
- Stop tracking video playback

## Advanced Usage

### Keyboard Shortcuts (Coming Soon)
Future plans include:
- Quick load/unload shortcuts
- Subtitle positioning adjustments
- Font size customization

### Subtitle File Examples

**VTT Format (.vtt):**
```
WEBVTT

00:00:01.000 --> 00:00:03.000
Welcome to Netflix

00:00:04.000 --> 00:00:06.000
Enjoy your show!
```

**SRT Format (.srt):**
```
1
00:00:01,000 --> 00:00:03,000
Welcome to Netflix

2
00:00:04,000 --> 00:00:06,000
Enjoy your show!
```

## Tips & Tricks

💡 **Sync issues?**
- If subtitles are out of sync, they may need adjustment
- Look for adjusted subtitle files on OpenSubtitles

💡 **Multiple languages?**
- A single file can only contain one language
- Select different subtitle files for different languages

💡 **Test files?**
- Use VTT format test file: Copy the example above into a `.txt` file and rename to `.vtt`

## Still Need Help?

1. Check the [README.md](README.md) for more details
2. Review [SETUP.md](SETUP.md) for troubleshooting
3. Check browser console (F12) for error messages
4. Ensure Netflix.com video is playing

## Version Info

- **Extension**: Sub Loader v1.0.0
- **Supported Browsers**: Chrome, Edge, Brave, Chromium
- **Designed for**: netflix.com (not Netflix apps)

---

Happy watching! 🎬🍿

Got stuck? Most issues are solved by:
1. Refreshing Netflix page
2. Checking subtitle file format
3. Verifying video is playing
