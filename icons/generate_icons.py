#!/usr/bin/env python3
"""
Generate PNG icons from the SVG file.
This script requires Pillow, Cairosvg, or ImageMagick.

Installation:
    pip install pillow cairosvg
    
or install ImageMagick:
    # Ubuntu/Debian
    sudo apt-get install imagemagick
    
    # macOS
    brew install imagemagick
"""

import os
import subprocess
import sys

def create_icons_with_imagemagick():
    """Create icons using ImageMagick convert command."""
    icon_path = os.path.join(os.path.dirname(__file__), 'icon.svg')
    
    sizes = [
        ('icon-128.png', '128x128'),
        ('icon-48.png', '48x48'),
        ('icon-16.png', '16x16'),
    ]
    
    for filename, size in sizes:
        output_path = os.path.join(os.path.dirname(__file__), filename)
        cmd = ['convert', '-background', 'none', '-density', '300', '-resize', size, icon_path, output_path]
        
        try:
            subprocess.run(cmd, check=True)
            print(f"✓ Created {filename}")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to create {filename}: {e}")
            return False
        except FileNotFoundError:
            print("✗ ImageMagick (convert) not found. Please install it:")
            print("  Ubuntu/Debian: sudo apt-get install imagemagick")
            print("  macOS: brew install imagemagick")
            return False
    
    return True

def create_icons_with_pillow():
    """Create icons using Pillow library."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        print("✗ Pillow not installed. Install with: pip install pillow")
        return False
    
    # Create a base image with gradient background
    base_size = 128
    img = Image.new('RGB', (base_size, base_size), color='#667eea')
    
    # Draw gradient manually (simple two-color gradient)
    pixels = img.load()
    for y in range(base_size):
        for x in range(base_size):
            # Simple diagonal gradient from #667eea to #764ba2
            r = int(102 + (118 - 102) * (x + y) / (2 * base_size))
            g = int(126 + (75 - 126) * (x + y) / (2 * base_size))
            b = int(234 + (162 - 234) * (x + y) / (2 * base_size))
            pixels[x, y] = (r, g, b)
    
    draw = ImageDraw.Draw(img)
    
    # Draw film strip frames
    for i, x in enumerate([16, 44, 72]):
        draw.rectangle([x, 32, x + 20, 52], fill='white', outline=None)
        # Add opacity effect with grey
        draw.rectangle([x, 32, x + 20, 52], fill=(255, 255, 255, 50))
    
    # Draw subtitle lines
    draw.rectangle([16, 64, 112, 68], fill='white')
    draw.rectangle([16, 74, 96, 78], fill='white')
    draw.rectangle([16, 84, 86, 88], fill='white')
    
    # Draw CC badge
    draw.ellipse([90, 90, 118, 118], fill='#ff6b6b')
    draw.text((104, 101), 'CC', fill='white')
    
    # Save base icon
    output_path = os.path.join(os.path.dirname(__file__), 'icon-128.png')
    img.save(output_path, 'PNG')
    print(f"✓ Created icon-128.png")
    
    # Create resized versions
    for size, filename in [(48, 'icon-48.png'), (16, 'icon-16.png')]:
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        output_path = os.path.join(os.path.dirname(__file__), filename)
        resized.save(output_path, 'PNG')
        print(f"✓ Created {filename}")
    
    return True

def main():
    print("Sub Loader Icon Generator")
    print("=" * 40)
    
    # Try ImageMagick first (better quality)
    if create_icons_with_imagemagick():
        print("\n✓ Icons created successfully with ImageMagick!")
        return 0
    
    # Fall back to Pillow
    print("\nTrying Pillow as fallback...")
    if create_icons_with_pillow():
        print("\n✓ Icons created successfully with Pillow!")
        return 0
    
    # If both fail, provide instructions
    print("\n✗ Could not create icons. Please install one of:")
    print("  1. ImageMagick: sudo apt-get install imagemagick")
    print("  2. Pillow: pip install pillow")
    return 1

if __name__ == '__main__':
    sys.exit(main())
