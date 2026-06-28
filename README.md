# Belize Birds Field Guide

A modern, offline-capable field guide to the birds of Belize. Built with React, Vite, and Tailwind CSS.

**Live Site:** [https://ewcbyrd.github.io/belizebirds/](https://ewcbyrd.github.io/belizebirds/)

## Features

### Bird Gallery
- Browse 160+ bird species found in Belize
- Card-based layout with species photos
- **Shareable species pages** at `/species/[slug]` for each bird
- **Personal checklist** — mark species seen in the field (saved locally)
- Detailed species accounts including:
  - Common and scientific names
  - Family classification (scientific and common names)
  - Structured identification (field marks when available)
  - Voice description and audio playback
  - Habitat preferences
  - Diet and size information
  - Status and regions (when available)
  - Similar species links
  - Field notes on behavior and identification
  - eBird reporting rate (when available)

### Search & Filter
- Real-time search by common or scientific name
- Filter by habitat, family, size, and diet
- Filter checklist by seen / unseen
- Sort by taxonomic order, A–Z, or most common
- View filtered results count
- Easy-to-use clear filters button

### Audio Player
- Listen to bird calls for each species (when available)
- Play/stop controls
- Visual feedback when audio is playing
- Only one audio plays at a time
- Buttons are disabled when audio is not available

### Offline Field Use
- Progressive Web App (PWA) with offline image caching
- Works in the field without a network connection
- Install to home screen on mobile devices

### Responsive Design
- Mobile-first approach
- Works seamlessly on phones, tablets, and desktops
- Touch-friendly interface

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended, 24+ for production deployment)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd belizebirds
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Deployment

This site is automatically deployed to GitHub Pages via GitHub Actions:

1. Push changes to the `main` branch
2. GitHub Actions automatically builds and deploys the site
3. Site is live at [https://ewcbyrd.github.io/belizebirds/](https://ewcbyrd.github.io/belizebirds/) within 2-3 minutes

**Manual Deployment:** If you need to trigger a deployment manually, go to Actions → Deploy to GitHub Pages → Run workflow.

### Preview Production Build

```bash
npm run preview
```

## Adding Bird Images and Audio

### Bird Images

1. Place bird images in the `public/birds/` directory
2. Use kebab-case filenames matching the bird's common name
3. Recommended format: JPG
4. Recommended size: 800x600px (4:3 aspect ratio)

**Filename format:**
- Lowercase
- Replace spaces with hyphens
- Remove apostrophes
- Example: "Morelet's Seedeater" → `morelets-seedeater.jpg`

### Bird Audio Files

1. Place bird call audio files in the `public/audio/` directory
2. Use the same kebab-case naming as images
3. Recommended format: MP3
4. Recommended duration: 5-30 seconds
5. Audio buttons will be automatically disabled if files are missing

**Filename format:**
- Same as images but with `.mp3` extension
- Example: "Morelet's Seedeater" → `morelets-seedeater.mp3`

### Where to Find Bird Media

Here are some excellent resources for bird images and audio:

**Images:**
- [Macaulay Library](https://www.macaulaylibrary.org/) - Cornell Lab of Ornithology
- [eBird](https://ebird.org/) - Global bird database with photos
- [Wikimedia Commons](https://commons.wikimedia.org/) - Free media (check licenses)
- [iNaturalist](https://www.inaturalist.org/) - Community science platform

**Audio:**
- [Xeno-canto](https://www.xeno-canto.org/) - Free bird sound database
- [Macaulay Library](https://www.macaulaylibrary.org/) - Cornell Lab audio archive

**Important:** Always check and respect the licensing terms for any media you use. Attribute photographers and recordists as required by their licenses.

## Project Structure

```
belizebirds/
├── public/
│   ├── birds/              # Bird images
│   └── audio/              # Bird call audio files
├── src/
│   ├── components/
│   │   ├── AudioPlayer.jsx     # Audio playback component
│   │   ├── BirdCard.jsx        # Gallery card linking to species page
│   │   ├── BirdGallery.jsx     # Main gallery grid view
│   │   ├── SpeciesPage.jsx     # Full species account page
│   │   ├── NotFound.jsx        # Unknown route / species
│   │   └── SearchBar.jsx       # Search, filter, and sort controls
│   ├── hooks/
│   │   └── useChecklist.js     # LocalStorage life list
│   ├── utils/
│   │   └── birdSlugs.js        # Slug helpers
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── data/
│   │   ├── birds.json          # Bird data
│   │   └── familyNames.js      # Family common names
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## Bird Species Database

The app includes bird data for species found in Belize. Each bird entry includes:
- Common and scientific names
- Family classification
- Habitat preferences
- Physical description
- Size and diet information
- Field notes (behavior, voice, identification tips)
- Observation frequency (when available, based on eBird data)

**Note:** The database is designed to be easily expandable. See the "Adding More Birds" section below for instructions on adding new species.

## Customization

### Adding More Birds

To add more birds to the app, you can use the built-in add-bird skill:

1. **Using Cursor Skill** (Recommended):
   - The repository includes a custom skill at `.cursor/skills/add-bird/`
   - This skill automates the process of adding birds with images
   - It downloads images, processes them to 4:3 ratio, and updates the database
   - See `QUICKSTART.md` for details on using the skill

2. **Manual Method**:
   - Open `src/data/birds.json`
   - Add a new bird object following the existing structure:

```json
{
  "id": 26,
  "commonName": "Bird Name",
  "scientificName": "Genus species",
  "frequency": "X.XX%",
  "family": "Family Name",
  "habitat": ["Habitat 1", "Habitat 2"],
  "description": "Description of the bird...",
  "size": "Very small/Small/Small-medium/Medium/Medium-large/Large",
  "diet": "Nectarivore/Insectivore/Frugivore/Granivore/Omnivore/Carnivore",
  "image": "/birds/bird-name.jpg",
  "audio": "/audio/bird-name.mp3",
  "funFact": "A field note on behavior, voice, or identification..."
}
```

3. Add corresponding image and audio files to `public/birds/` and `public/audio/`

### Customizing Colors

The app uses Belize-themed colors defined in `tailwind.config.js`:

```javascript
colors: {
  belize: {
    blue: '#003F87',
    red: '#CE1126',
    green: {
      light: '#86BC42',
      DEFAULT: '#00843D',
      dark: '#004D29',
    },
    sand: '#F4E4C1',
  },
}
```

Modify these to match your preferred color scheme.

## Future Enhancement Ideas (Phase 3)

- **Bird comparison**: View multiple species side-by-side
- **Location-based filters**: Filter by region within Belize (once `regions` data is backfilled)
- **Habitat normalization**: Standardize habitat taxonomy for reliable filtering
- **Audio library**: Populate bird call recordings for all species
- **Dark mode**: Toggle for light/dark theme
- **Checklist export**: Export life list or sync with eBird

## Contributing

Contributions are welcome! Feel free to:
- Add more bird data
- Improve the UI/UX
- Add new features
- Fix bugs
- Improve documentation

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Bird data based on eBird frequency reports for Belize
- Built with React and Vite
- Styled with Tailwind CSS
- Inspired by the incredible biodiversity of Belize

## Support

If you encounter any issues or have questions:
1. Check this README for common solutions
2. Review the code comments in source files
3. Open an issue on GitHub

---

**Happy Birding!** 🦜🇧🇿
