# Castle Mouse - Deployment Guide

## Overview
This guide explains how to deploy your Castle Mouse game as a standalone web widget on your website.

## Important: Why Opening index.html Directly Doesn't Work

Modern React applications use:
- **ES6 Modules** that require a web server (browser security prevents `file://` protocol from loading modules)
- **Build processes** that bundle and optimize code
- **Import statements** that need proper MIME types served by a server

This is why you see a blank page when opening index.html directly from your file system.

## Deployment Options

### Option 1: Deploy on Your Website (Recommended)

If you have a website with hosting, follow these steps:

#### Step 1: Download from Figma Make
1. Click the download/export button in Figma Make
2. This should give you a production-ready build

#### Step 2: Upload to Your Website
1. Extract the downloaded ZIP file
2. Upload all files to your web server (via FTP, cPanel, or your hosting provider's file manager)
3. You can either:
   - Place in root directory: `yourdomain.com/index.html`
   - Place in a subdirectory: `yourdomain.com/castle-mouse/index.html`

#### Step 3: Embed as Widget (Optional)
To embed Castle Mouse in another page as a widget, use an iframe:

```html
<iframe 
  src="https://yourdomain.com/castle-mouse/index.html" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border: 2px solid #4a3f35; border-radius: 8px;"
  title="Castle Mouse Game"
></iframe>
```

### Option 2: Test Locally with a Simple Server

To test before deploying, you need to run a local web server:

#### Using Python (if installed):
```bash
# Navigate to your extracted folder
cd path/to/castle-mouse

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

#### Using Node.js (if installed):
```bash
# Install a simple server globally
npm install -g http-server

# Navigate to your folder
cd path/to/castle-mouse

# Run server
http-server -p 8000

# Then open: http://localhost:8000
```

#### Using VS Code:
1. Install "Live Server" extension
2. Right-click on index.html
3. Select "Open with Live Server"

### Option 3: Deploy on Free Hosting Platforms

#### Netlify (Easiest):
1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up for free
3. Drag and drop your extracted folder
4. Get instant URL like: `castle-mouse.netlify.app`

#### GitHub Pages:
1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Enable GitHub Pages
5. Get URL like: `yourusername.github.io/castle-mouse`

#### Vercel:
1. Go to [vercel.com](https://vercel.com/)
2. Sign up for free
3. Import your project
4. Get instant URL

## Widget Integration Examples

### Full-Page Embed
```html
<!DOCTYPE html>
<html>
<head>
  <title>Play Castle Mouse</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; }
    iframe { width: 100vw; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe src="https://yourdomain.com/castle-mouse/index.html"></iframe>
</body>
</html>
```

### Responsive Widget
```html
<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <h2>Castle Mouse Game</h2>
  <div style="position: relative; padding-bottom: 120%; height: 0; overflow: hidden;">
    <iframe 
      src="https://yourdomain.com/castle-mouse/index.html"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 3px solid #4a3f35;"
    ></iframe>
  </div>
</div>
```

### WordPress Embed
If you're using WordPress, add this to a page/post (in HTML mode):
```html
[html]
<iframe 
  src="https://yourdomain.com/castle-mouse/index.html" 
  width="100%" 
  height="900px" 
  frameborder="0"
></iframe>
[/html]
```

## Troubleshooting

### Blank Page Issues
- ✅ Make sure you're accessing via HTTP/HTTPS (not file://)
- ✅ Check browser console for errors (F12 → Console tab)
- ✅ Verify all files were uploaded correctly
- ✅ Check that your server supports serving JavaScript files with correct MIME types

### LocalStorage Persistence
- Custom levels are saved in browser localStorage
- Each domain has separate storage (localhost vs yourdomain.com)
- Players will need to recreate custom levels after deployment to new domain

### Cross-Origin Issues (if embedding from different domain)
If the iframe is on a different domain than the game, you might need to adjust iframe permissions:
```html
<iframe 
  src="https://yourdomain.com/castle-mouse/index.html"
  allow="storage-access *"
  sandbox="allow-same-origin allow-scripts allow-forms"
></iframe>
```

## Performance Tips

1. **Enable Compression**: Make sure your web server has gzip/brotli compression enabled for .js and .css files
2. **Use CDN**: Consider using a CDN like Cloudflare for faster global access
3. **Cache Headers**: Set appropriate cache headers for static assets

## Security Notes

- The game stores data only in browser localStorage (client-side)
- No server-side database or backend needed
- No user data is transmitted or stored remotely
- Safe to embed on any website

## Need Help?

Common hosting providers and how to upload:
- **cPanel**: File Manager → Upload → Extract
- **Netlify**: Drag & drop folder
- **GitHub Pages**: Git push to repository
- **WordPress**: Use a plugin like "File Manager" or FTP client

---

**Quick Start**: The fastest way to test your deployment is to use Netlify's drag-and-drop feature - just extract your ZIP and drag the entire folder to netlify.com. You'll have a working game in under 60 seconds!
