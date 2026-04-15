# Icon Placeholder Files

The following icon files need to be created for the extension:

- **icon-16.png** - 16x16 pixels (browser toolbar)
- **icon-48.png** - 48x48 pixels (extension menu)
- **icon-128.png** - 128x128 pixels (chrome web store)

## Quick Icon Generation Options

### Option 1: Use Online Tool (Easiest)
1. Visit: https://www.favicon-generator.org/ or similar
2. Upload a design or create one
3. Download as PNG
4. Rename and place in this folder

### Option 2: Create SVG and Convert
1. Use any SVG editor or create simple SVG:

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" fill="url(#grad)" rx="24"/>
  <text x="64" y="80" font-size="64" fill="white" text-anchor="middle" font-weight="bold">◄</text>
  <text x="64" y="85" font-size="24" fill="white" text-anchor="middle">CC</text>
</svg>
```

2. Convert to PNG using:
   - Image editing software (Photoshop, GIMP, etc.)
   - Online converter: https://cloudconvert.com/svg-to-png
   - ImageMagick: `convert icon.svg icon-128.png`

### Option 3: Use ImageMagick (if installed)

```bash
#!/bin/bash
# Create a simple gradient icon with ImageMagick

convert -size 128x128 \
  gradient:'#667eea'-'#764ba2' \
  -pointsize 64 \
  -fill white \
  -gravity center \
  -annotate +0+0 '◄' \
  icon-128.png

# Create resized versions
convert icon-128.png -resize 48x48 icon-48.png
convert icon-128.png -resize 16x16 icon-16.png
```

### Option 4: Use Python with Pillow

```python
from PIL import Image, ImageDraw
import io

def create_icon(size):
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)
    # Draw gradient manually if needed
    return img

# Create icons
icon_128 = create_icon(128)
icon_128.save('icon-128.png')

icon_48 = icon_128.resize((48, 48))
icon_48.save('icon-48.png')

icon_16 = icon_128.resize((16, 16))
icon_16.save('icon-16.png')
```

### Design Suggestions
- Use purple/blue gradient (matches extension branding)
- Include subtitle/film strip symbol
- Keep it recognizable at small sizes
- Use white/light colors for top toolbar visibility

Once you have created the PNG files, place them in this directory alongside this file.
