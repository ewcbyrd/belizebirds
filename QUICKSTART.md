# Quick Start Guide

## Running the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Then open http://localhost:5173 in your browser.

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Preview production build:**
   ```bash
   npm run preview
   ```

## What You Can Do Now

### Browse the Field Guide
- Browse 160+ curated bird species plus eBird-synced species across all Belize districts
- Click any bird card to open its shareable species page at `/species/[slug]`
- Search by common or scientific name
- Filter by district, habitat, family, size, or diet; filter checklist by seen/unseen
- Sort by taxonomic order, A–Z, or most common (eBird reporting rate for Cayo curated species)

## Next Steps

### Add Real Bird Media

The app currently uses placeholder images for some species. To add real photos and audio:

1. **Download bird images** from sources like:
   - [Macaulay Library](https://www.macaulaylibrary.org/)
   - [Xeno-canto](https://www.xeno-canto.org/)
   - [Wikimedia Commons](https://commons.wikimedia.org/)

2. **Place images** in `public/birds/` with exact filenames:
   - `melodious-blackbird.jpg`
   - `rufous-tailed-hummingbird.jpg`
   - etc. (see `src/data/birds.json` for all filenames)

3. **Place audio files** in `public/audio/` with exact filenames:
   - `melodious-blackbird.mp3`
   - `rufous-tailed-hummingbird.mp3`
   - etc.

### Customize the App

- **Add more birds**: Edit `src/data/birds.json` or use the add-bird skill
- **Change colors**: Update the `@theme` section in `src/index.css`

## Troubleshooting

**Issue**: Images not showing
- Check that filenames in `public/birds/` match exactly those in `birds.json`
- File extensions must match (.jpg, .png, etc.)

**Issue**: Audio not playing
- Check that filenames in `public/audio/` match exactly those in `birds.json`
- Use MP3 format for best browser compatibility
- Check browser console for errors

**Issue**: Build fails
- Run `npm install` to ensure all dependencies are installed
- Check for syntax errors in any files you've modified

## Features Overview

- Responsive design (mobile, tablet, desktop)
- Search, filter, and sort functionality
- Interactive bird cards linking to species pages
- Audio player with controls
- Offline PWA support for field use
- State management with React Context
- Tailwind CSS styling

For full documentation, see [README.md](./README.md)

Happy birding!
