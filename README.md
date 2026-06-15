# Belize Birds Learning App 🦜

A modern, interactive web application for learning about the most common birds of Belize. Built with React, Vite, and Tailwind CSS.

## Features

### 🎨 Bird Gallery
- Browse the most common birds of Belize
- Beautiful card-based layout with bird images
- Detailed information including:
  - Common and scientific names
  - Family classification
  - Habitat preferences
  - Diet and size information
  - Fun facts about each species
  - Bird call frequency data (when available)

### 🔍 Search & Filter
- Real-time search by common or scientific name
- Filter by habitat type
- Filter by bird family
- View filtered results count
- Easy-to-use clear filters button

### 🎵 Audio Player
- Listen to bird calls for each species (when available)
- Play/stop controls
- Visual feedback when audio is playing
- Only one audio plays at a time
- Buttons are disabled when audio is not available

### 🎯 Interactive Quiz
Two quiz modes to test your knowledge:

1. **Identify the Bird**: View a bird image and select the correct name from 4 options
2. **Match the Call**: Listen to a bird call and identify which bird it belongs to (for species with audio)

Quiz features:
- Randomized questions
- Progress tracking
- Score display
- Visual feedback for correct/incorrect answers
- Retry option

### 📱 Responsive Design
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

- Node.js (version 16 or higher)
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
│   │   ├── BirdCard.jsx        # Individual bird card with details modal
│   │   ├── BirdGallery.jsx     # Main gallery grid view
│   │   ├── Navigation.jsx      # App header and navigation
│   │   ├── Quiz.jsx            # Quiz mode component
│   │   └── SearchBar.jsx       # Search and filter controls
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── data/
│   │   └── birds.json          # Bird data
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

The app includes bird data for common species found in Belize. Each bird entry includes:
- Common and scientific names
- Family classification
- Habitat preferences
- Physical description
- Size and diet information
- Fun facts
- Observation frequency (when available, based on eBird data)

**Note:** The database is designed to be easily expandable. See the "Adding More Birds" section below for instructions on adding new species.

## Customization

### Adding More Birds

To add more birds to the app, you can use the built-in add-bird skill:

1. **Using OpenCode Skill** (Recommended):
   - The repository includes a custom skill at `.opencode/skills/add-bird/`
   - This skill automates the process of adding birds with images
   - It downloads images, processes them to 800x600, and updates the database
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
  "funFact": "An interesting fact..."
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

## Future Enhancement Ideas

- **LocalStorage**: Save quiz high scores and favorites
- **Dark Mode**: Toggle for light/dark theme
- **Bird Comparison**: View multiple birds side-by-side
- **Location-based**: Filter by region within Belize
- **Advanced Filters**: Size, diet, behavior
- **PWA Support**: Offline functionality
- **Export Results**: Share quiz scores
- **Learning Paths**: Guided tours through bird families
- **Sighting Log**: Track birds you've seen in the wild

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
