# Castle Mouse - Offline Version Creation Guide

## Overview
This guide provides multiple methods to create a truly offline version of Castle Mouse that can run on a computer without internet access.

---

## Method 1: Portable Web Server Package (Easiest)

This method bundles your game with a tiny web server so users can run it locally.

### Prerequisites
- Your production build from Vercel (download after deployment)
- Node.js installed (for initial setup)

### Step-by-Step Instructions

#### Step 1: Get Your Production Build
After Vercel deploys successfully:

```bash
# Clone your deployed site
npx degit your-vercel-url castle-mouse-offline

# Or manually download:
# 1. Visit your Vercel deployment URL
# 2. Use browser dev tools (F12) → Network tab
# 3. Refresh page and download all assets
# 4. Or use a website downloader tool like HTTrack
```

Better approach - **Download from Vercel CLI**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Pull your production build
vercel pull --environment=production
vercel build --prod

# Your build will be in .vercel/output/static or dist/
```

#### Step 2: Create a Portable Server

**Option A - Node.js Based (Windows/Mac/Linux)**

Create a file called `start-castle-mouse.js`:

```javascript
#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const PUBLIC_DIR = path.join(__dirname, 'dist'); // or 'build' depending on your build output

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - serve index.html for client-side routing
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('=================================');
  console.log('🏰 Castle Mouse is running!');
  console.log('=================================');
  console.log(`\nOpen your browser and go to:`);
  console.log(`\n    http://localhost:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server');
  console.log('=================================\n');
  
  // Auto-open browser (optional)
  const open = require('open');
  open(`http://localhost:${PORT}`);
});
```

Create `package.json`:

```json
{
  "name": "castle-mouse-offline",
  "version": "1.0.0",
  "description": "Castle Mouse - Offline Version",
  "main": "start-castle-mouse.js",
  "scripts": {
    "start": "node start-castle-mouse.js"
  },
  "dependencies": {
    "open": "^8.4.0"
  }
}
```

**Option B - Python Based (Simpler)**

Create `start-castle-mouse.py`:

```python
#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = "dist"  # or "build"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("=" * 40)
print("🏰 Castle Mouse is running!")
print("=" * 40)
print(f"\nOpen your browser and go to:")
print(f"\n    http://localhost:{PORT}\n")
print("Press Ctrl+C to stop the server")
print("=" * 40 + "\n")

# Auto-open browser
webbrowser.open(f'http://localhost:{PORT}')

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
        sys.exit(0)
```

#### Step 3: Create User-Friendly Launchers

**Windows - `START_GAME.bat`:**
```batch
@echo off
echo Starting Castle Mouse...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js server...
    node start-castle-mouse.js
    goto :end
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python server...
    python start-castle-mouse.py
    goto :end
)

echo ERROR: Neither Node.js nor Python found!
echo Please install Node.js from https://nodejs.org/
echo or Python from https://www.python.org/
pause

:end
```

**Mac/Linux - `start-game.sh`:**
```bash
#!/bin/bash

echo "Starting Castle Mouse..."
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "Using Node.js server..."
    node start-castle-mouse.js
    exit 0
fi

# Check if Python 3 is installed
if command -v python3 &> /dev/null; then
    echo "Using Python server..."
    python3 start-castle-mouse.py
    exit 0
fi

# Check if Python is installed
if command -v python &> /dev/null; then
    echo "Using Python server..."
    python start-castle-mouse.py
    exit 0
fi

echo "ERROR: Neither Node.js nor Python found!"
echo "Please install Node.js from https://nodejs.org/"
echo "or Python from https://www.python.org/"
```

Make it executable:
```bash
chmod +x start-game.sh
```

#### Step 4: Package for Distribution

Your final folder structure:
```
castle-mouse-offline/
├── dist/                    # Your production build files
│   ├── index.html
│   ├── assets/
│   └── ...
├── start-castle-mouse.js    # Node.js server
├── start-castle-mouse.py    # Python server
├── package.json             # Node dependencies
├── START_GAME.bat           # Windows launcher
├── start-game.sh            # Mac/Linux launcher
└── README.txt               # Instructions for users
```

Create `README.txt`:
```
🏰 CASTLE MOUSE - Offline Version
==================================

SYSTEM REQUIREMENTS:
- Windows, Mac, or Linux
- Node.js OR Python (one of them must be installed)

FIRST TIME SETUP:
1. Make sure you have Node.js or Python installed
   - Node.js: https://nodejs.org/
   - Python: https://www.python.org/
   
2. (Node.js only) Open terminal/command prompt in this folder and run:
   npm install

HOW TO PLAY:
- Windows: Double-click "START_GAME.bat"
- Mac/Linux: Double-click "start-game.sh" or run: ./start-game.sh

The game will open in your default browser automatically!

TO STOP:
- Close the terminal/command window
- Or press Ctrl+C in the terminal

TROUBLESHOOTING:
- If nothing happens, make sure Node.js or Python is installed
- If browser doesn't open automatically, manually go to: http://localhost:8080
- Your custom levels are saved in browser localStorage (per-browser storage)

Enjoy the game!
```

Zip it all up and distribute!

---

## Method 2: Electron Desktop App (True Standalone App)

Convert Castle Mouse into a native desktop application for Windows, Mac, and Linux.

### Prerequisites
- Node.js installed
- Your production build

### Step-by-Step Instructions

#### Step 1: Set Up Electron Project

Create a new folder `castle-mouse-desktop`:

```bash
mkdir castle-mouse-desktop
cd castle-mouse-desktop
npm init -y
npm install electron electron-builder --save-dev
```

#### Step 2: Create Electron Main Process

Create `main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 800,
    minHeight: 700,
    backgroundColor: '#2b2621',
    icon: path.join(__dirname, 'build/icon.png'), // Add your game icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Castle Mouse',
    autoHideMenuBar: true, // Hide menu bar for cleaner look
  });

  // Load the game
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

#### Step 3: Update package.json

```json
{
  "name": "castle-mouse",
  "version": "1.0.0",
  "description": "Castle Mouse - A puzzle game adventure",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.castlemouse.game",
    "productName": "Castle Mouse",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": ["nsis"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "build/icon.icns",
      "category": "public.app-category.games"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png",
      "category": "Game"
    }
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4"
  }
}
```

#### Step 4: Add Your Production Build

Copy your production build into the `dist` folder:
```
castle-mouse-desktop/
├── dist/           # Your production build from Vercel
├── main.js
├── package.json
└── build/          # Icons for different platforms
    ├── icon.png    # 512x512 PNG
    ├── icon.ico    # Windows icon
    └── icon.icns   # Mac icon
```

#### Step 5: Build the Desktop App

```bash
# Test it first
npm start

# Build for your platform
npm run build

# Or build for specific platform
npm run build:win    # Creates Windows installer
npm run build:mac    # Creates Mac DMG
npm run build:linux  # Creates Linux AppImage/deb
```

The built apps will be in the `release/` folder!

### Distribution
- **Windows**: Distribute the `.exe` installer from `release/`
- **Mac**: Distribute the `.dmg` file
- **Linux**: Distribute the `.AppImage` or `.deb` file

Users just double-click to install and play - **completely offline!**

---

## Method 3: Progressive Web App (PWA) - Offline After First Visit

Make Castle Mouse installable and work offline using Service Workers.

### How It Works
- User visits your game online once
- Browser caches all files
- Game works offline afterward
- Can be "installed" to desktop/home screen

### Implementation

#### Step 1: Create Service Worker

Create `public/service-worker.js`:

```javascript
const CACHE_NAME = 'castle-mouse-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  // Add all your assets
];

// Install event - cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### Step 2: Register Service Worker

Add to your `index.html` or main app file:

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
```

#### Step 3: Create Web App Manifest

Create `public/manifest.json`:

```json
{
  "name": "Castle Mouse",
  "short_name": "Castle Mouse",
  "description": "A puzzle game adventure with chain reactions",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2b2621",
  "theme_color": "#4a3f35",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `index.html` head:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4a3f35">
```

**Note**: This requires initial online access but works offline afterward.

---

## Method 4: Single HTML File (Limited Functionality)

Bundle everything into one HTML file - works offline but loses some features.

### Limitations
- No code splitting
- Larger initial file size
- May not work with all React features
- Custom levels might not persist

### Tools to Try
- **Vite Plugin**: `vite-plugin-singlefile`
- **Inline Source**: Bundle all JS/CSS inline

This method is **not recommended** for Castle Mouse due to complexity.

---

## Recommendation by Use Case

| Use Case | Best Method |
|----------|-------------|
| Share with friends (tech-savvy) | Method 1: Portable Server |
| Distribute to non-technical users | Method 2: Electron App |
| Professional distribution | Method 2: Electron App |
| Quick offline access | Method 3: PWA |
| Keep online but add offline support | Method 3: PWA |

---

## Storage Considerations

### LocalStorage Behavior
- **Portable Server**: Each browser has separate storage
- **Electron**: Dedicated storage per app instance
- **PWA**: Online and offline share same storage

### Backing Up Custom Levels
Since custom levels use localStorage, consider adding an export/import feature to your game for transferring levels between devices.

---

## Final Checklist

Before distributing offline version:

- [ ] Test on clean machine without internet
- [ ] Verify all assets load correctly
- [ ] Test localStorage persistence
- [ ] Include clear README instructions
- [ ] Specify system requirements (Node.js/Python/etc)
- [ ] Test on target operating system
- [ ] Create proper icons for desktop apps
- [ ] Include license/attribution if needed

---

## Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify all file paths are relative (no absolute URLs)
3. Make sure no external CDN dependencies exist
4. Test server MIME types for .js and .css files

Good luck with your offline Castle Mouse distribution! 🏰🐭
