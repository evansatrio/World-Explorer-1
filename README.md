# 🌍 World Country Quiz — APK Export Guide

A web-based country guessing game (Leaflet + REST Countries) packaged for export to an Android APK via GitHub.

---

## What's in this folder

```
World Explorer 2/
├── index.html                    ← the game (PWA-ready entry point)
├── country-guess-game.html       ← original file, identical to index.html
├── manifest.json                 ← PWA manifest
├── service-worker.js             ← offline shell + caching
├── icons/                        ← all sizes for PWA + Android
│   ├── icon-1024.png             (Capacitor / Play Store source)
│   ├── icon-512.png, icon-192.png
│   ├── icon-maskable-{192,512}.png  (Android adaptive icons)
│   ├── icon-180.png              (iOS apple-touch-icon)
│   └── favicon-32.png
├── package.json                  ← Node deps for Capacitor build
├── capacitor.config.json         ← Capacitor app config
├── scripts/copy-web.mjs          ← stages web files into ./www/ for build
├── .github/workflows/
│   └── build-android.yml         ← GitHub Actions: builds APK on every push
├── .gitignore
└── README.md                     ← this file
```

---

## Two export paths — pick one

| | **Path A: PWABuilder** | **Path B: Capacitor + GitHub Actions** |
|---|---|---|
| Difficulty | Beginner — point & click | Intermediate — uses Git + Actions |
| Setup time | ~10 min | ~20 min one-time |
| Output | Signed APK from PWABuilder service | Debug APK auto-built on every push |
| Local tools needed | None | Just Git |
| Updates | Re-run PWABuilder each time | Push to GitHub → APK rebuilds automatically |
| Recommended for | Non-developers, quick test builds | Long-term, repeated rebuilds |

---

# Path A — PWABuilder (easiest)

PWABuilder is a free Microsoft tool that turns any PWA into an Android (and iOS / Windows) app package. **No command line, no Android Studio, no Java.** You just need GitHub Pages hosting.

### Step 1 — Create a GitHub repo and push these files

1. Go to https://github.com and sign in (create an account if you don't have one).
2. Click the **+** icon (top-right) → **New repository**.
3. Name it something like `world-country-quiz`. Set to **Public**. Do NOT initialize with README (we already have one). Click **Create repository**.
4. On the next screen, GitHub shows you commands. Use the "**…or push an existing repository from the command line**" section — but easier: scroll up to "**uploading an existing file**" link, click it, and drag-and-drop ALL files in this folder (including subfolders `icons/`, `.github/`, `scripts/`).
   - **Tip:** zip the folder, drop the zip in, then expand. Or use [GitHub Desktop](https://desktop.github.com/) for drag-drop.
5. Commit message: `Initial upload`. Click **Commit changes**.

### Step 2 — Enable GitHub Pages

1. In your repo, click **Settings** (top tab).
2. Left sidebar → **Pages**.
3. Under "Source", choose **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)**. Click **Save**.
5. Wait ~1 minute. The page will refresh and show: **"Your site is live at `https://<your-username>.github.io/world-country-quiz/`"**. Copy that URL.

### Step 3 — Test it as a web app

1. Open the URL in Chrome/Edge on your phone or desktop. The game should run.
2. On a phone, you'll see an "Install app" prompt — confirms PWA is valid.

### Step 4 — Generate APK with PWABuilder

1. Visit https://www.pwabuilder.com.
2. Paste your GitHub Pages URL into the input. Click **Start**.
3. PWABuilder analyzes the PWA. You should see **green checkmarks** for Manifest, Service Worker, and Security. (If anything fails, check that your URL is actually loading the game correctly.)
4. Click **Package for stores** (top-right) → **Android**.
5. PWABuilder offers two package types:
   - **Trusted Web Activity (recommended)** — small APK, opens your live site in a chromeless browser.
   - **APK** — fully bundled, larger but works offline-ish.
6. Click **Generate Package**. Fill in:
   - Package ID: `com.worldquiz.app`
   - App name: `World Quiz`
   - Version: `1.0.0`
   - Signing key: choose **"Generate a new signing key"** (PWABuilder creates one for you — **save the password and download the .keystore** that they email you, you'll need it for future updates and Play Store submission)
7. Click **Generate**, wait ~1 min, download the ZIP.
8. Inside the ZIP: an `.apk` file you can install on Android, plus the keystore file.

### Step 5 — Install on your Android device

1. Email/transfer the `.apk` to your phone.
2. On the phone, tap the file. Android will warn about "Install unknown apps" — tap **Settings**, allow it for your file manager, go back, tap the APK again, **Install**.
3. App icon appears on home screen. Done.

---

# Path B — Capacitor + GitHub Actions (automated)

This sets up GitHub Actions to **build a fresh APK every time you push code**. The APK appears as a downloadable artifact on each workflow run, and tagged releases (e.g. `v1.0.0`) auto-publish to GitHub Releases.

You don't need Android Studio or Java installed locally — GitHub's runners do all the work.

### Step 1 — Push these files to a GitHub repo

Same as Path A Step 1. Create a public repo, upload all files (including `.github/workflows/build-android.yml`).

> **Important:** make sure the upload preserves the `.github/workflows/` subfolder. If GitHub's web upload skips hidden folders, use **GitHub Desktop** or `git push` from a terminal.

### Step 2 — Trigger the first build

Pushing to `main` triggers the workflow automatically. Or trigger it manually:

1. In your repo, click the **Actions** tab.
2. Left sidebar → **Build Android APK** workflow.
3. Click **Run workflow** → branch: `main` → **Run workflow**.
4. A new run appears. Click into it. Wait ~10–15 minutes (first run is slowest — installs Android SDK, Gradle deps, etc.).

### Step 3 — Download the APK

1. When the run finishes (green check), scroll to the bottom of the run page.
2. Under **Artifacts**, you'll see `world-quiz-debug-apk`. Click to download.
3. The downloaded `.zip` contains `app-debug.apk`.

### Step 4 — Install on Android

Same as Path A Step 5.

### Step 5 — For tagged releases (optional)

When you're ready to publish a real version:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers the same workflow, AND creates a GitHub Release with the APK attached at `https://github.com/<you>/<repo>/releases`.

### Subsequent updates

Just edit `index.html` (or whatever you want to change), commit, push to `main`. A fresh APK builds automatically. Download from Actions → latest run → Artifacts.

---

## ⚠️ Things to know

- **Internet is required.** The game fetches map data (Natural Earth GeoJSON), country data (REST Countries API), and Leaflet/Turf libraries from CDNs at runtime. The service worker caches them after first load, but a true offline-first build would require bundling all that data into the APK — a separate (larger) project.
- **The debug APK is unsigned.** Android will warn "developer mode required" or similar. Fine for personal use & testing. To distribute on the Play Store you'll need to add a signed release build (search "Capacitor Android signing keystore github actions").
- **Path B requires a public repo on the free GitHub plan** for Actions to be unlimited. Private repos get 2,000 free minutes/month — still plenty.
- **First Path B build is slow** (~12–15 min). Subsequent builds are faster (~5–8 min) thanks to npm + Gradle caching.

---

## Local testing (optional, for Path B)

If you want to test the Capacitor setup locally before pushing:

```bash
# Prerequisites: Node 18+, JDK 17, Android Studio installed
npm install
npm run build:web
npx cap add android       # one-time
npx cap sync android
cd android
./gradlew assembleDebug
# APK lands in android/app/build/outputs/apk/debug/
```

But honestly — let GitHub Actions do this. That's why we set it up.

---

## Troubleshooting

**PWABuilder gives me red ❌ on Manifest / Service Worker** — your GitHub Pages URL probably isn't serving the files correctly. Visit `https://<you>.github.io/<repo>/manifest.json` directly in a browser; it should display the JSON. If 404, your repo structure is wrong (files need to be at the repo root, not inside a subfolder).

**Actions workflow fails on `npx cap add android`** — usually a Node version mismatch. Workflow already pins Node 20; check the run log for the actual error message.

**APK installs but app shows blank screen** — check Chrome remote debugging (`chrome://inspect` on desktop with phone connected via USB). Likely a missing CDN URL or service worker issue.

**Want to update the icon?** Replace `icons/icon-1024.png` with your new 1024×1024 PNG (square, with reasonable padding). Push to GitHub. The next workflow run regenerates all sizes from your source automatically (via `@capacitor/assets`).

---

## Sources & references

- [Capacitor by Ionic](https://capacitorjs.com/) — web-to-native wrapper used in Path B
- [PWABuilder by Microsoft](https://www.pwabuilder.com/) — used in Path A
- [Natural Earth Data](https://www.naturalearthdata.com/) — country boundary data (CC0)
- [REST Countries API](https://restcountries.com/) — country fact data
