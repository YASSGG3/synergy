# 🚀 Synergy Engine — Deploy to Phone via GitHub Pages

A step-by-step guide to get Synergy Engine installable on any phone in under 10 minutes.

---

## 📁 Files in this folder

```
synergy-pwa/
├── index.html      ← The full app
├── manifest.json   ← PWA config (makes it installable)
├── sw.js           ← Service Worker (enables offline use)
├── icon-192.svg    ← App icon (small)
└── icon-512.svg    ← App icon (large / splash screen)
```

---

## 🔧 STEP-BY-STEP: GitHub → Phone

### Step 1 — Create a GitHub account
Go to **https://github.com** → Sign up (free)

---

### Step 2 — Create a new repository
1. Click the **+** button (top right) → **New repository**
2. Name it: `synergy-engine` *(exact name doesn't matter)*
3. Set it to **Public** ✅ *(required for free GitHub Pages)*
4. Click **Create repository**

---

### Step 3 — Upload your files
1. Inside your new repo, click **"uploading an existing file"**
2. Drag and drop ALL 5 files at once:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.svg`
   - `icon-512.svg`
3. Scroll down → click **"Commit changes"**

---

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. Scroll down to **"Pages"** (left sidebar)
3. Under **"Source"** → select **"Deploy from a branch"**
4. Branch: **main** | Folder: **/ (root)**
5. Click **Save**
6. Wait ~2 minutes, then your URL appears:
   ```
   https://YOUR-USERNAME.github.io/synergy-engine/
   ```

---

### Step 5 — Update manifest.json start_url
Open `manifest.json` and update the `start_url` to match your GitHub Pages path:
```json
"start_url": "/synergy-engine/",
"scope": "/synergy-engine/",
```
Then commit the change.

Also update `sw.js` line 8 — add your path to STATIC_ASSETS:
```js
'/synergy-engine/',
'/synergy-engine/index.html',
```

---

## 📱 Install on Android

1. Open **Chrome** on your phone
2. Go to: `https://YOUR-USERNAME.github.io/synergy-engine/`
3. Wait for the **"Install Synergy Engine"** banner at the top
4. Tap **Install** → it appears on your home screen like a native app ✅

> If the banner doesn't appear, tap the **3-dot menu** → **"Add to Home Screen"**

---

## 🍎 Install on iPhone (iOS)

> iOS uses Safari — Chrome won't show the install option on iOS.

1. Open **Safari** on your iPhone
2. Go to: `https://YOUR-USERNAME.github.io/synergy-engine/`
3. Tap the **Share button** (box with arrow pointing up ↑)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"** → done ✅

The app opens full-screen with no browser bars, just like a native app.

---

## ✅ What works after install

| Feature | Android | iPhone |
|---------|---------|--------|
| Full-screen, no browser bars | ✅ | ✅ |
| Works offline (no internet) | ✅ | ✅ |
| Alarm sound | ✅ | ✅ |
| Push notifications | ✅ | ✅ (iOS 16.4+) |
| Home screen icon | ✅ | ✅ |
| App shortcuts (long-press icon) | ✅ | ✅ |
| Saves data between sessions | ✅ | ✅ |

---

## 🔄 Updating the app later

When you upload new files to GitHub, the Service Worker auto-updates within 60 seconds of the user opening the app.

---

## 🌐 Alternative: Use without GitHub (direct file)

If you just want to test on your phone without GitHub:
1. Send the `index.html` file to your phone (email, WhatsApp, etc.)
2. Open it in **Safari (iPhone)** or **Chrome (Android)**
3. Use **"Add to Home Screen"** from the share menu

> Note: The Service Worker won't work with a local file, but the app fully functions.

---

## ❓ Troubleshooting

**"Install" button doesn't appear on Android?**
→ Make sure you're on **https://** (not http://) and using Chrome

**App doesn't work offline?**
→ Visit the page once while online to let the Service Worker cache everything

**Icon looks wrong?**
→ Clear browser cache and reload

**GitHub Pages shows 404?**
→ Wait 2-3 minutes after enabling Pages, then hard refresh
