// Content script that runs on Netflix pages
console.log('[Sub Loader] Content script loaded on:', window.location.href);

// Global state for subtitle handling
let currentTrack = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Sub Loader] Received message:', request.action);
  
  if (request.action === 'loadSubtitles') {
    loadSubtitles(request, sendResponse);
  } else if (request.action === 'removeSubtitles') {
    removeSubtitles(sendResponse);
  }
  
  return true; // Keep channel open for async response
});

// Parse subtitle file (VTT or SRT)
function parseSubtitles(content) {
  const lines = content.split('\n');
  const subtitles = [];
  
  let i = 0;
  
  // Check if it's VTT format
  if (content.trim().startsWith('WEBVTT')) {
    i = 1; // Skip header
  }
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for timestamp line
    if (line.match(/\d{2}:\d{2}:\d{2}/)) {
      const timecodeLine = line;
      let text = '';
      i++;
      
      // Read text until next blank line
      while (i < lines.length && lines[i].trim() !== '') {
        text += lines[i] + '\n';
        i++;
      }
      
      subtitles.push({
        time: timecodeLine,
        text: text.trim()
      });
    }
    
    i++;
  }
  
  return subtitles;
}

// Convert SRT timecode to seconds
function timeToSeconds(timeStr) {
  // Handle both SRT (00:00:00,000) and VTT (00:00:00.000) formats
  timeStr = timeStr.replace(',', '.');
  const parts = timeStr.split(':');
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
}

// Find the best subtitle for a given time
function findSubtitleAtTime(subtitles, timeStr) {
  const time = timeToSeconds(timeStr);
  
  for (let subtitle of subtitles) {
    const times = subtitle.time.split('-->');
    if (times.length === 2) {
      const start = timeToSeconds(times[0].trim());
      const end = timeToSeconds(times[1].trim());
      
      if (time >= start && time <= end) {
        return subtitle.text;
      }
    }
  }
  
  return '';
}

// Create or update subtitle overlay (Netflix-like styling)
function createSubtitleOverlay() {
  let overlay = document.getElementById('sub-loader-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sub-loader-overlay';
    
    // Netflix-style subtitle container
    overlay.style.cssText = `
      position: fixed;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 85%;
      width: auto;
      z-index: 10001;
      display: none;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    `;
    
    // Create inner text container for better control (matches Netflix styling)
    overlay.innerHTML = `
      <div id="sub-loader-text" style="
        background: rgba(0, 0, 0, 0.85);
        color: #ffffff;
        padding: 14px 24px;
        border-radius: 2px;
        text-align: center;
        font-size: 18px;
        line-height: 1.6;
        font-weight: 400;
        letter-spacing: 0.5px;
        word-wrap: break-word;
        word-break: break-word;
        white-space: normal;
        max-height: 220px;
        overflow: hidden;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      "></div>
    `;
    
    document.body.appendChild(overlay);
    
    // Adjust position based on video element
    setTimeout(() => {
      const video = getNetflixVideoElement();
      if (video) {
        const rect = video.getBoundingClientRect();
        if (rect && rect.bottom) {
          overlay.style.bottom = (window.innerHeight - rect.bottom + 20) + 'px';
        }
      }
    }, 500);
  }
  
  return overlay;
}

// Update subtitle display
function updateSubtitleDisplay(subtitles, videoElement) {
  const overlay = createSubtitleOverlay();
  const textContainer = document.getElementById('sub-loader-text');
  
  // Update subtitle every 100ms
  const updateInterval = setInterval(() => {
    if (!videoElement || videoElement.paused) {
      overlay.style.display = 'none';
      return;
    }
    
    // Adjust position for fullscreen mode
    const isFullscreen = document.fullscreenElement || 
                         document.webkitFullscreenElement || 
                         document.mozFullScreenElement;
    
    if (isFullscreen || videoElement.parentElement?.requestFullscreen) {
      overlay.style.position = 'fixed';
      overlay.style.bottom = '60px';
    }
    
    const currentTime = videoElement.currentTime;
    const subtitle = findSubtitleForTime(subtitles, currentTime);
    
    if (subtitle) {
      // Sanitize and format subtitle text
      const cleanText = subtitle
        .replace(/\r/g, '') // Remove carriage returns
        .replace(/<br>/gi, '\n') // Convert HTML breaks to newlines
        .trim();
      
      // Replace newlines with <br> for proper multi-line display
      textContainer.innerHTML = cleanText.replace(/\n/g, '<br>');
      overlay.style.display = 'block';
    } else {
      overlay.style.display = 'none';
    }
  }, 100);
  
  // Store interval ID for cleanup
  if (!window.subLoaderIntervals) {
    window.subLoaderIntervals = [];
  }
  window.subLoaderIntervals.push(updateInterval);
}

// Find subtitle for a given time
function findSubtitleForTime(subtitles, currentTime) {
  for (let subtitle of subtitles) {
    const times = subtitle.time.split('-->');
    if (times.length === 2) {
      const start = timeToSeconds(times[0].trim());
      const end = timeToSeconds(times[1].trim());
      
      if (currentTime >= start && currentTime <= end) {
        return subtitle.text;
      }
    }
  }
  return null;
}

// Find Netflix video player and container
function getNetflixVideoElement() {
  // Try to find video element in Netflix player
  const videoContainer = document.querySelector('.VideoContainer') || 
                         document.querySelector('[data-videoid]') ||
                         document.querySelector('.player-video-container') ||
                         document.querySelector('video');
  
  if (videoContainer) {
    const video = videoContainer.querySelector('video');
    if (video) return video;
  }
  
  return document.querySelector('video');
}

// Find Netflix subtitle container for better positioning
function getNetflixSubtitleContainer() {
  return document.querySelector('.player-subtitle-container') || 
         document.querySelector('.AkiraPlayer--content') ||
         document.querySelector('[role="presentation"]') ||
         document.querySelector('.VideoContainer');
}

// Load subtitles
function loadSubtitles(request, sendResponse) {
  try {
    const videoElement = getNetflixVideoElement();
    
    if (!videoElement) {
      sendResponse({ 
        success: false, 
        error: 'Could not find Netflix video player. Make sure a video is playing.' 
      });
      return;
    }
    
    let subtitleContent;
    
    // If file data is provided, use it; otherwise fetch from URL
    if (request.fileData) {
      subtitleContent = request.fileData;
    } else if (request.url.startsWith('http')) {
      // Fetch from URL
      fetch(request.url, { mode: 'cors' })
        .then(response => response.text())
        .then(content => {
          processSubtitles(content, videoElement, request, sendResponse);
        })
        .catch(error => {
          console.error('[Sub Loader] Fetch error:', error);
          sendResponse({ 
            success: false, 
            error: 'Failed to load subtitles from URL: ' + error.message 
          });
        });
      return;
    } else {
      sendResponse({ 
        success: false, 
        error: 'Invalid subtitle URL or file' 
      });
      return;
    }
    
    processSubtitles(subtitleContent, videoElement, request, sendResponse);
    
  } catch (error) {
    console.error('[Sub Loader] Error:', error);
    sendResponse({ 
      success: false, 
      error: 'Error loading subtitles: ' + error.message 
    });
  }
}

// Convert subtitles to VTT format and create native track element
function createNativeTrack(subtitles, videoElement) {
  try {
    // Convert parsed subtitles back to VTT format
    let vttContent = 'WEBVTT\n\n';
    
    subtitles.forEach(sub => {
      vttContent += sub.time + '\n';
      vttContent += sub.text + '\n\n';
    });
    
    // Create blob from VTT content
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    
    // Remove existing sub-loader tracks
    const existingTracks = videoElement.querySelectorAll('track[kind="captions"][label="Sub Loader"]');
    existingTracks.forEach(track => track.remove());
    
    // Create native track element
    const track = document.createElement('track');
    track.kind = 'captions';
    track.label = 'Sub Loader';
    track.srclang = 'en';
    track.src = url;
    
    videoElement.appendChild(track);
    console.log('[Sub Loader] Native track added to video element');
    
    return true;
  } catch (error) {
    console.error('[Sub Loader] Error creating native track:', error);
    return false;
  }
}

// Process and display subtitles
function processSubtitles(content, videoElement, request, sendResponse) {
  try {
    const subtitles = parseSubtitles(content);
    
    if (subtitles.length === 0) {
      sendResponse({ 
        success: false, 
        error: 'No subtitles found in file' 
      });
      return;
    }
    
    // Store current subtitles for update
    window.currentSubtitles = subtitles;
    
    // Try to add native track for Netflix integration
    const nativeTrackAdded = createNativeTrack(subtitles, videoElement);
    
    // Always use overlay for better control and visibility
    updateSubtitleDisplay(subtitles, videoElement);
    
    console.log('[Sub Loader] Loaded', subtitles.length, 'subtitles');
    const message = nativeTrackAdded ? 
      `Netflix subtitles loaded: ${subtitles.length} entries` :
      `Custom subtitles loaded: ${subtitles.length} entries (overlay mode)`;
    
    sendResponse({ 
      success: true, 
      count: subtitles.length,
      message: message
    });
    
  } catch (error) {
    console.error('[Sub Loader] Processing error:', error);
    sendResponse({ 
      success: false, 
      error: 'Error processing subtitles: ' + error.message 
    });
  }
}

// Remove subtitles
function removeSubtitles(sendResponse) {
  try {
    // Stop all subtitle update intervals
    if (window.subLoaderIntervals) {
      window.subLoaderIntervals.forEach(interval => clearInterval(interval));
      window.subLoaderIntervals = [];
    }
    
    // Hide overlay
    const overlay = document.getElementById('sub-loader-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    
    // Remove native tracks
    const videoElement = getNetflixVideoElement();
    if (videoElement) {
      const subLoaderTracks = videoElement.querySelectorAll('track[label="Sub Loader"]');
      subLoaderTracks.forEach(track => {
        if (track.src) {
          URL.revokeObjectURL(track.src);
        }
        track.remove();
      });
    }
    
    // Clear stored subtitles
    window.currentSubtitles = null;
    
    console.log('[Sub Loader] Subtitles removed');
    sendResponse({ success: true });
    
  } catch (error) {
    console.error('[Sub Loader] Removal error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Auto-load functionality
chrome.storage.local.get(['autoLoad', 'subtitleUrl'], (result) => {
  if (result.autoLoad && result.subtitleUrl) {
    // Wait for video element to be available
    setTimeout(() => {
      const videoElement = getNetflixVideoElement();
      if (videoElement) {
        console.log('[Sub Loader] Auto-loading subtitles');
        
        if (result.subtitleUrl.startsWith('http')) {
          fetch(result.subtitleUrl, { mode: 'cors' })
            .then(response => response.text())
            .then(content => {
              const subtitles = parseSubtitles(content);
              if (subtitles.length > 0) {
                window.currentSubtitles = subtitles;
                updateSubtitleDisplay(subtitles, videoElement);
              }
            })
            .catch(error => console.error('[Sub Loader] Auto-load error:', error));
        }
      }
    }, 2000);
  }
});

console.log('[Sub Loader] Ready to load subtitles');
