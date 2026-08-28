# Happy 10 Months, My Bhondu ❤️

A standalone, framework-free anniversary website. Pure HTML / CSS / JS —
no build step, nothing to install, nothing that can break on deploy.

## What's inside

```
site/
├── index.html      → all 3 screens: opening, slideshow, letter+QR
├── style.css        → dark romantic theme, stars, particles, hearts
├── script.js        → slideshow logic, QR generation, music toggle
├── images/
│   ├── photo1.jpg   → your 10 real photos, already renamed
│   ├── ...
│   └── photo10.jpg
└── audio/
    └── README.txt   → how to add background music (optional)
```

## How the photos work

`script.js` has a `PHOTOS` array at the top with 10 entries pointing at
`images/photo1.jpg` … `images/photo10.jpg`, each with a title + caption.
Want different captions or a different photo order? Edit that array —
nothing else needs to change.

## Deploying

This is a **static site** — no `package.json`, no build command needed.

1. Push this whole folder to your GitHub repo (replacing what's there,
   or as a fresh repo — your call).
2. In Vercel: Framework Preset → **Other** (or leave auto-detected as
   static). Build command: none. Output directory: `/` (root).
3. Deploy. `/images/photo1.jpg` etc. will be served directly since
   they're plain files at the project root — no bundler, no missing
   assets after build.

## Adding your song

See `audio/README.txt` — drop an MP3 you have rights to at
`audio/our-song.mp3` and the existing play/pause button will pick it
up automatically. No file yet? The button just does nothing harmful —
no console errors, no broken UI.

## Editing the QR code target

`script.js` → `const SITE_URL = 'https://me-and-my-bhondu.vercel.app/';`
Change this if your deployed URL ever changes.
