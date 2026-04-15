// Get DOM elements
const subtitleInput = document.getElementById('subtitle-input');
const browseBtn = document.getElementById('browse-btn');
const languageSelect = document.getElementById('subtitle-language');
const autoLoadCheckbox = document.getElementById('auto-load');
const loadBtn = document.getElementById('load-btn');
const removeBtn = document.getElementById('remove-btn');
const statusDiv = document.getElementById('status');
const recentList = document.getElementById('recent-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadRecentSubtitles();
});

// Load settings from storage
function loadSettings() {
  chrome.storage.local.get(['subtitleUrl', 'language', 'autoLoad'], (result) => {
    if (result.subtitleUrl) {
      subtitleInput.value = result.subtitleUrl;
    }
    if (result.language) {
      languageSelect.value = result.language;
    }
    autoLoadCheckbox.checked = result.autoLoad !== false;
  });
}

// Load recent subtitles from storage
function loadRecentSubtitles() {
  chrome.storage.local.get(['recentSubtitles'], (result) => {
    const recent = result.recentSubtitles || [];
    recentList.innerHTML = '';
    
    if (recent.length === 0) {
      recentList.innerHTML = '<li style="color: #999;">No recent subtitles</li>';
      return;
    }
    
    recent.slice(0, 5).forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.name;
      li.title = item.url;
      li.addEventListener('click', () => {
        subtitleInput.value = item.url;
        languageSelect.value = item.language || 'en';
      });
      recentList.appendChild(li);
    });
  });
}

// Show status message
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status show ${type}`;
  
  if (type !== 'error') {
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 3000);
  }
}

// Browse file
browseBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.vtt,.srt,.ass,.ssa';
  input.style.display = 'none';
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showStatus('File is too large (max 10MB)', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onerror = () => {
        showStatus('Error reading file', 'error');
        console.error('[Sub Loader] FileReader error:', reader.error);
      };
      reader.onload = (event) => {
        try {
          const fileData = event.target.result;
          subtitleInput.value = file.name;
          
          // Store the actual file data for later use
          chrome.storage.local.set({ 
            pendingFileData: fileData,
            pendingFileName: file.name
          }, () => {
            showStatus(`File selected: ${file.name}`, 'success');
          });
        } catch (error) {
          showStatus('Error processing file', 'error');
          console.error('[Sub Loader] Processing error:', error);
        }
      };
      
      reader.readAsText(file);
    }
    
    // Clean up the input element
    document.body.removeChild(input);
  });
  
  // Add to DOM, trigger click, then remove
  document.body.appendChild(input);
  input.click();
});

// Load subtitles button
loadBtn.addEventListener('click', () => {
  const url = subtitleInput.value.trim();
  const language = languageSelect.value;
  
  if (!url) {
    showStatus('Please enter a subtitle URL or select a file', 'error');
    return;
  }
  
  // Save settings
  chrome.storage.local.set({ 
    subtitleUrl: url,
    language: language,
    autoLoad: autoLoadCheckbox.checked
  });
  
  // Get current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0].url.includes('netflix.com')) {
      showStatus('Please use this on Netflix.com', 'error');
      return;
    }
    
    // Check for pending file data
    chrome.storage.local.get(['pendingFileData', 'pendingFileName'], (result) => {
      const messageData = {
        action: 'loadSubtitles',
        url: url,
        language: language,
        fileName: result.pendingFileName || url
      };
      
      if (result.pendingFileData) {
        messageData.fileData = result.pendingFileData;
        chrome.storage.local.remove(['pendingFileData', 'pendingFileName']);
      }
      
      chrome.tabs.sendMessage(tabs[0].id, messageData, (response) => {
        if (response && response.success) {
          showStatus('Subtitles loaded successfully!', 'success');
          
          // Add to recent
          addToRecent(url, language, result.pendingFileName || url);
        } else if (response && response.error) {
          showStatus(response.error, 'error');
        } else {
          showStatus('Failed to load subtitles', 'error');
        }
      });
    });
  });
});

// Remove subtitles button
removeBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0].url.includes('netflix.com')) {
      showStatus('Please use this on Netflix.com', 'error');
      return;
    }
    
    chrome.tabs.sendMessage(tabs[0].id, { action: 'removeSubtitles' }, (response) => {
      if (response && response.success) {
        showStatus('Subtitles removed', 'success');
      } else {
        showStatus('Failed to remove subtitles', 'error');
      }
    });
  });
});

// Add to recent subtitles
function addToRecent(url, language, name) {
  chrome.storage.local.get(['recentSubtitles'], (result) => {
    let recent = result.recentSubtitles || [];
    
    // Remove if already exists
    recent = recent.filter(item => item.url !== url);
    
    // Add to beginning
    recent.unshift({
      url: url,
      language: language,
      name: name,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10
    recent = recent.slice(0, 10);
    
    chrome.storage.local.set({ recentSubtitles: recent });
    loadRecentSubtitles();
  });
}

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Clear all recent subtitles?')) {
    chrome.storage.local.set({ recentSubtitles: [] });
    loadRecentSubtitles();
    showStatus('History cleared', 'success');
  }
});
