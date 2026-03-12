# Hosting Castle Mouse on Your GitHub Pages Portfolio

## Your Setup
- Portfolio website: `username.github.io`
- Castle Mouse game: `username.github.io/castle-mouse`
- Other projects: `username.github.io/project-name`

## Understanding the Structure

Your `username.github.io` repository structure should look like this:

```
username.github.io/
├── index.html              # Your portfolio homepage
├── style.css               # Your portfolio styles
├── script.js               # Your portfolio scripts
├── projects/
│   └── index.html          # Projects listing page
├── castle-mouse/           # Castle Mouse game
│   ├── index.html
│   ├── assets/
│   └── ...
├── other-project/          # Another project
│   ├── index.html
│   └── ...
└── README.md
```

---

## Method 1: Deploy Figma Make Projects to GitHub Pages (Recommended)

Since your Castle Mouse is built in Figma Make, here's the proper workflow:

### Step 1: Deploy to Vercel First (You're doing this now!)

Why? Because:
- Vercel/Netlify handle the build process automatically
- You get a working production build
- You can then download it for GitHub Pages

### Step 2: Get the Production Build

**Option A: Download from Vercel (After deployment succeeds)**

Once Vercel deploys your Castle Mouse:

1. **Use wget or curl to download the built site:**
   ```bash
   # Install wget (if not already installed)
   # Mac: brew install wget
   # Windows: Use Git Bash or WSL
   
   # Download the entire deployed site
   wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https://your-project.vercel.app -P castle-mouse-build
   ```

2. **Or use a browser extension:**
   - Install "Save All Resources" or "SingleFile" extension
   - Visit your Vercel deployment
   - Save the complete page with all assets

3. **Or manually from browser:**
   - Open your Vercel deployment
   - Press F12 → Network tab
   - Refresh page
   - Right-click → "Save all as HAR"
   - Extract files from HAR (more complex)

**Option B: Use Vercel CLI to get build output**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to where you have your source code
cd path/to/castle-mouse-source

# Login to Vercel
vercel login

# Link to your deployed project
vercel link

# Pull and build
vercel pull --environment=production
vercel build --prod

# Your production build is now in .vercel/output/static/ or dist/
```

### Step 3: Add to Your GitHub Portfolio Repository

```bash
# Clone your portfolio repo
git clone https://github.com/username/username.github.io.git
cd username.github.io

# Create a folder for Castle Mouse
mkdir castle-mouse

# Copy the production build files into castle-mouse/
cp -r /path/to/downloaded-build/* castle-mouse/

# Commit and push
git add castle-mouse/
git commit -m "Add Castle Mouse game"
git push origin main
```

### Step 4: Link from Your Portfolio

In your portfolio's `index.html`:

```html
<!-- Projects Section -->
<section id="projects">
  <h2>My Projects</h2>
  
  <div class="project-card">
    <h3>🏰 Castle Mouse</h3>
    <p>A puzzle game with strategic animal placement and chain reactions</p>
    <div class="project-links">
      <a href="/castle-mouse/" class="btn-primary">Play Game</a>
      <a href="https://github.com/username/castle-mouse-source" class="btn-secondary">View Code</a>
    </div>
    <div class="project-tech">
      <span class="tech-tag">React</span>
      <span class="tech-tag">TypeScript</span>
      <span class="tech-tag">Framer Motion</span>
    </div>
  </div>
  
  <!-- More projects... -->
</section>
```

---

## Method 2: Keep Source Code Separate, Deploy Build to Portfolio

A cleaner approach that separates source code from deployed builds.

### Repository Structure

You'll have TWO repositories:

1. **`castle-mouse`** - Source code repository
   - Contains your Figma Make source code
   - Private or public (your choice)
   - Not directly accessed by users

2. **`username.github.io`** - Portfolio repository  
   - Contains production builds only
   - Public (required for GitHub Pages)
   - What users actually see

### Workflow

```bash
# 1. Create source code repo (if you haven't)
# On GitHub: Create new repo "castle-mouse"
git clone https://github.com/username/castle-mouse.git
cd castle-mouse
# Add your Figma Make source code
git add .
git commit -m "Initial commit"
git push

# 2. After deploying to Vercel, get production build
# (Use methods from Step 2 above)

# 3. Add to portfolio
cd path/to/username.github.io
mkdir castle-mouse
cp -r /path/to/production-build/* castle-mouse/
git add castle-mouse/
git commit -m "Add Castle Mouse production build"
git push
```

### Advantages
- Clean separation of source vs deployed code
- Source repo can be private
- Portfolio repo stays clean (only HTML/CSS/JS, no build configs)
- Easy to update: rebuild on Vercel, download, copy to portfolio

---

## Method 3: Automate with GitHub Actions (Advanced)

Automatically build and deploy Figma Make projects to your portfolio.

**Note**: This only works if your Figma Make download includes `package.json` and build configs.

### Create `.github/workflows/deploy.yml` in your portfolio repo:

```yaml
name: Deploy Castle Mouse

on:
  push:
    paths:
      - 'castle-mouse-source/**'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd castle-mouse-source
        npm install
    
    - name: Build
      run: |
        cd castle-mouse-source
        npm run build
    
    - name: Deploy to GitHub Pages folder
      run: |
        rm -rf castle-mouse/*
        cp -r castle-mouse-source/dist/* castle-mouse/
        git config user.name "GitHub Actions"
        git config user.email "actions@github.com"
        git add castle-mouse/
        git commit -m "Auto-deploy Castle Mouse" || exit 0
        git push
```

This is **advanced** and only works if you have the proper build setup.

---

## Method 4: Simple HTML/CSS/JS Projects (For Your Hand-Coded Projects)

For projects you write yourself in HTML/CSS/JS (not React/Figma Make):

### Simple Structure

```
username.github.io/
├── index.html              # Portfolio home
├── css/
│   └── style.css
├── js/
│   └── script.js
├── simple-game/            # Your hand-coded game
│   ├── index.html
│   ├── style.css
│   ├── game.js
│   └── assets/
└── another-project/
    └── index.html
```

### Just commit directly:

```bash
cd username.github.io

# Create your project folder
mkdir simple-game
cd simple-game

# Create your files
touch index.html style.css game.js

# Code your game...
# Then commit
git add .
git commit -m "Add simple game"
git push
```

Access at: `username.github.io/simple-game`

---

## Best Practices for Portfolio Projects

### 1. Consistent Navigation

Add a "Back to Portfolio" link in each project:

```html
<!-- In castle-mouse/index.html, add to top -->
<nav class="project-nav">
  <a href="/" class="back-link">← Back to Portfolio</a>
</nav>
```

### 2. Project Metadata

For SEO and social sharing, add to each project's `index.html`:

```html
<head>
  <title>Castle Mouse - Your Name</title>
  <meta name="description" content="A puzzle game with strategic animal placement">
  <meta property="og:title" content="Castle Mouse">
  <meta property="og:description" content="Play my puzzle game!">
  <meta property="og:image" content="/castle-mouse/screenshot.png">
</head>
```

### 3. Add Screenshots

```
castle-mouse/
├── index.html
├── assets/
└── screenshots/
    ├── gameplay.png      # For portfolio showcase
    └── thumbnail.png     # For preview cards
```

Reference in portfolio:

```html
<div class="project-card">
  <img src="/castle-mouse/screenshots/thumbnail.png" alt="Castle Mouse">
  <h3>Castle Mouse</h3>
  <!-- ... -->
</div>
```

### 4. Keep a Projects Index

Create `username.github.io/projects/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>All Projects - Your Name</title>
</head>
<body>
  <h1>All My Projects</h1>
  
  <div class="projects-grid">
    <a href="/castle-mouse/" class="project-tile">
      <img src="/castle-mouse/screenshots/thumbnail.png">
      <h3>Castle Mouse</h3>
      <p>Puzzle Game</p>
    </a>
    
    <a href="/another-project/" class="project-tile">
      <img src="/another-project/thumbnail.png">
      <h3>Another Project</h3>
      <p>Web App</p>
    </a>
  </div>
</body>
</html>
```

---

## Troubleshooting

### Problem: Game loads but assets show 404

**Cause**: Absolute paths instead of relative paths

**Solution**: Make sure your build uses relative paths. In your game's `index.html`:

```html
<!-- Wrong (absolute path) -->
<script src="/assets/index-abc123.js"></script>

<!-- Right (relative path) -->
<script src="./assets/index-abc123.js"></script>

<!-- Also right -->
<script src="assets/index-abc123.js"></script>
```

If using Vite build, add to `vite.config.js` (before building):

```javascript
export default {
  base: '/castle-mouse/', // Match your folder name
}
```

### Problem: React Router shows 404 on refresh

**Cause**: GitHub Pages doesn't support client-side routing by default

**Solution**: Add a `404.html` that redirects to index.html:

```html
<!-- castle-mouse/404.html -->
<!DOCTYPE html>
<html>
<head>
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/castle-mouse/'">
</head>
</html>
```

Or use hash-based routing (`createHashRouter` instead of `createBrowserRouter`).

### Problem: LocalStorage not working

**Cause**: Different origin (GitHub Pages vs local testing)

**Solution**: This is expected - localStorage is per-domain. Data saved on `localhost` won't appear on `username.github.io`.

---

## Complete Workflow Summary

For **Figma Make projects** (like Castle Mouse):

1. ✅ Build in Figma Make
2. ✅ Deploy to Vercel (handles build process)
3. ✅ Download production build from Vercel
4. ✅ Copy to `username.github.io/project-name/`
5. ✅ Commit and push to GitHub
6. ✅ Link from portfolio homepage
7. ✅ Access at `username.github.io/project-name`

For **hand-coded HTML/CSS/JS projects**:

1. ✅ Create folder in `username.github.io/project-name/`
2. ✅ Add your HTML/CSS/JS files
3. ✅ Commit and push
4. ✅ Access at `username.github.io/project-name`

---

## Example Portfolio Structure

```
username.github.io/
├── index.html                    # "Hi, I'm [Name]"
├── about.html                    # About page
├── contact.html                  # Contact page
├── css/
│   └── main.css
├── js/
│   └── main.js
├── images/
│   ├── profile.jpg
│   └── projects/
│       ├── castle-mouse-thumb.png
│       └── other-thumb.png
│
├── projects/
│   └── index.html                # All projects listing
│
├── castle-mouse/                 # Figma Make project (production build)
│   ├── index.html
│   ├── assets/
│   └── screenshots/
│
├── todo-app/                     # Another React project
│   ├── index.html
│   └── assets/
│
├── simple-calculator/            # Hand-coded HTML/CSS/JS
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## Quick Reference Commands

```bash
# Clone your portfolio
git clone https://github.com/username/username.github.io.git
cd username.github.io

# Add a new project
mkdir project-name
cp -r /path/to/built-files/* project-name/

# Commit and push
git add project-name/
git commit -m "Add project-name"
git push origin main

# Wait 1-2 minutes for GitHub Pages to update
# Access at: username.github.io/project-name
```

---

## URLs You'll Have

- **Portfolio Home**: `username.github.io`
- **Castle Mouse**: `username.github.io/castle-mouse`
- **Projects Page**: `username.github.io/projects`
- **Other Project**: `username.github.io/other-project`

All hosted on GitHub Pages for FREE! 🎉

---

## Pro Tips

1. **Keep source code separate** - Don't commit `node_modules/` or source files to portfolio repo
2. **Use relative paths** - Ensures assets load correctly in subdirectories
3. **Add analytics** - Use Google Analytics or Plausible to track visitors
4. **Optimize images** - Compress screenshots/thumbnails for faster loading
5. **Test on mobile** - Make sure projects are responsive
6. **Add README** - Document each project in its folder
7. **Version your builds** - Consider `castle-mouse-v1/`, `castle-mouse-v2/` for iterations

Good luck with your portfolio! 🚀
