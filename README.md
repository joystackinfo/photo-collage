# Photo Collage

Take photos, pick a vibe, share with friends. No signup needed.

**Live Demo → (photocollage-glzou126w-joystackinfos-projects.vercel.app)**

## What it does

Take or upload photos, arrange them into a single frame or a collage, pick from 5 aesthetic themes, adjust brightness/saturation, and either download the result or get a shareable link.

## Themes

-  **Cottagecore** — warm tones, botanical vines and flowers
-  **90s** — cool blues, pixels, CDs, retro icons
-  **Analog** — black and white film strip look
-  **Coastal** — seafoam, shells, starfish
-  **Botanical** — soft greens, monstera leaves, jungle vibes

## Features

- 📷 Camera capture or file upload (works on mobile and desktop)
-  Single frame or multi-photo collage (up to 6 photos)
-  5 custom aesthetic themes with hand-designed stickers
-  Brightness and saturation adjustment per photo
-  Multiple layout options depending on photo count
- Download locally
- 🔗 Shareable links (stored via Supabase, no expiration)
-  Mobile-first, fully responsive

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Rendering:** Canvas API
- **Backend:** Supabase (PostgreSQL + Storage)
- **Routing:** React Router
- **Hosting:** Vercel

## Running locally

```bash
git clone https://github.com/joystackinfo/photo-collage.git
cd photo-collage
npm install
```

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then:

```bash
npm run dev
```
