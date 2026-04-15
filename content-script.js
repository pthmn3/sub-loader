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

// Create or update subtitle overlay
function createSubtitleOverlay() {
  let overlay = document.getElementById('sub-loader-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sub-loader-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      text-align: center;
      z-index: 10000;
      max-width: 90%;
      max-height: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      font-family: Arial, sans-serif;
      display: none;
      line-height: 1.4;
    `;
    document.body.appendChild(overlay);
  }
  
  return overlay;
}

// Update subtitle display
function updateSubtitleDisplay(subtitles, videoElement) {
  const overlay = createSubtitleOverlay();
  
  // Update subtitle every 100ms
  const updateInterval = setInterval(() => {
    if (!videoElement || videoElement.paused) {
      overlay.style.display = 'none';
      return;
    }
    
    const currentTime = videoElement.currentTime;
    const subtitle = findSubtitleForTime(subtitles, currentTime);
    
    if (subtitle) {
      overlay.innerHTML = subtitle.replace(/\n/g, '<br>');
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

// Find Netflix video player
function getNetflixVideoElement() {
  // Try to find video element in Netflix player
  const videoContainer = document.querySelector('.VideoContainer') || 
                         document.querySelector('[data-videoid]') ||
                         document.querySelector('video');
  
  if (videoContainer) {
    const video = videoContainer.querySelector('video');
    if (video) return video;
  }
  
  return document.querySelector('video');
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
    
    // Start displaying subtitles
    updateSubtitleDisplay(subtitles, videoElement);
    
    console.log('[Sub Loader] Loaded', subtitles.length, 'subtitles');
    sendResponse({ 
      success: true, 
      count: subtitles.length 
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
