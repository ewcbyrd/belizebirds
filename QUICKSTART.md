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

### Explore the Gallery
- Browse all 20 Belize bird species
- Click any bird card to see detailed information
- Use search to find birds by name
- Filter by habitat or family

### Take a Quiz
- Click "Start Quiz" in the navigation
- Choose between:
  - **Identify the Bird**: Match images to names
  - **Match the Call**: Identify birds by their sounds
- Track your progress and score

## Next Steps

### Add Real Bird Media

The app currently uses placeholder images. To add real photos and audio:

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

- **Add more birds**: Edit `src/data/birds.json`
- **Change colors**: Update the `@theme` section in `src/index.css`
- **Modify quiz length**: Change the number `10` in `Navigation.jsx` (line with `startQuiz`)

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

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Search & filter functionality
- ✅ Interactive bird cards with details
- ✅ Audio player with controls
- ✅ Two quiz modes
- ✅ Score tracking
- ✅ State management with React Context
- ✅ Tailwind CSS styling

For full documentation, see [README.md](./README.md)

Happy birding! 🦜
