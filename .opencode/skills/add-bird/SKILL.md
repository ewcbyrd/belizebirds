---
name: add-bird
description: Add or update a bird species in the Belize Birds database with automatic image processing
---

## What I do

I help you add or update bird species in the Belize Birds database with the following capabilities:

- Add new bird species with all required fields
- Update existing bird species
- Automatically download and process bird images to 800x600 (4:3 ratio)
- Generate properly formatted filenames from bird names
- Maintain the birds.json database structure

## When to use me

Use this skill when you want to:
- Add a new bird species to the database
- Update information for an existing bird
- Process and standardize bird images

## Usage

When this skill is invoked, I follow these steps:

### 1. Get Species Information

Ask the user for the bird's common name if not provided:
- "What is the common name of the bird you want to add?"

Check if the bird already exists in `src/data/birds.json`:
- If it exists, inform the user: "This bird already exists. I'll update its information."
- If it's new, inform the user: "Adding new bird: [Common Name]"

### 2. Research Bird Information

Use the WebFetch tool to gather information about the bird from Wikipedia:
1. Search for the bird's common name on Wikipedia (e.g., "https://en.wikipedia.org/wiki/Short-billed_Pigeon")
2. Extract the following information from the Wikipedia page:
   - Scientific name
   - Family
   - Habitat (convert to array format, focusing on habitats relevant to Belize/Central America)
   - Physical description
   - Size (categorize as: "Very small", "Small", "Small-medium", "Medium", "Medium-large", "Large")
   - Diet (categorize as: "Nectarivore", "Insectivore", "Frugivore", "Granivore", "Omnivore", "Carnivore")
   - Interesting facts

3. Create a concise description (2-3 sentences) suitable for the database
4. Select an interesting fun fact

**Required fields to gather:**
- `commonName` - Already provided by user
- `scientificName` - From Wikipedia
- `family` - From Wikipedia  
- `habitat` - Array of habitats from Wikipedia
- `description` - Detailed description based on Wikipedia info
- `size` - Categorize based on length/weight info
- `diet` - From Wikipedia behavior/ecology section
- `funFact` - An interesting fact from Wikipedia

**Optional fields:**
- `frequency` - Skip (user would need to provide this)

If the image URL was already provided by the user, skip to step 3. Otherwise, ask for it.

### 3. Process the Image

Execute the following steps to download and crop the image:

1. Generate the filename from the common name:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove apostrophes
   - Example: "Morelet's Seedeater" → "morelets-seedeater.jpg"

2. Download the image to a temporary location:
   
   If the URL is from Macaulay Library (macaulaylibrary.org), extract the asset ID and use the CDN URL:
   ```bash
   # Check if it's a Macaulay Library URL
   if [[ "[IMAGE_URL]" == *"macaulaylibrary.org"* ]]; then
     # Extract asset ID from URL (e.g., /photo/33376791 -> 33376791)
     asset_id=$(echo "[IMAGE_URL]" | grep -oE '[0-9]+' | tail -1)
     # Use CDN URL with asset ID
     curl -L "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${asset_id}/1800" -o /tmp/temp-bird-image.jpg
   else
     # Direct image URL
     curl -L "[IMAGE_URL]" -o /tmp/temp-bird-image.jpg
   fi
   ```

3. Center crop the image to 800x600:
   ```bash
   # Get dimensions
   width=$(sips -g pixelWidth /tmp/temp-bird-image.jpg | grep pixelWidth | awk '{print $2}')
   height=$(sips -g pixelHeight /tmp/temp-bird-image.jpg | grep pixelHeight | awk '{print $2}')
   
   # Calculate crop for 4:3 ratio (centered)
   target_ratio=1.3333
   current_ratio=$(echo "scale=4; $width / $height" | bc)
   
   if (( $(echo "$current_ratio > $target_ratio" | bc -l) )); then
     # Image is wider - crop width
     new_width=$(echo "($height * 4) / 3" | bc)
     crop_x=$(echo "($width - $new_width) / 2" | bc)
     sips --cropToHeightWidth $height $new_width --cropOffset 0 $crop_x /tmp/temp-bird-image.jpg -o /tmp/temp-bird-image.jpg >/dev/null 2>&1
   elif (( $(echo "$current_ratio < $target_ratio" | bc -l) )); then
     # Image is taller - crop height
     new_height=$(echo "($width * 3) / 4" | bc)
     crop_y=$(echo "($height - $new_height) / 2" | bc)
     sips --cropToHeightWidth $new_height $width --cropOffset $crop_y 0 /tmp/temp-bird-image.jpg -o /tmp/temp-bird-image.jpg >/dev/null 2>&1
   fi
   
   # Resize to exactly 800x600
   sips -z 600 800 /tmp/temp-bird-image.jpg -o public/birds/[FILENAME].jpg >/dev/null 2>&1
   
   # Cleanup
   rm /tmp/temp-bird-image.jpg
   ```

4. Verify the image was saved:
   ```bash
   ls -lh public/birds/[FILENAME].jpg
   ```

### 4. Update the Database

Read `src/data/birds.json` and:

**For existing birds (update):**
- Find the bird by matching `commonName` (case-insensitive)
- Update all provided fields
- Keep the same `id`
- Update the `image` path to `/birds/[FILENAME].jpg`
- Update the `audio` path to `/audio/[FILENAME].mp3` (if not already set)

**For new birds (insert):**
- Generate a new `id` by finding the highest existing ID and adding 1
- Create a complete bird object with all required fields
- Set `image` path to `/birds/[FILENAME].jpg`
- Set `audio` path to `/audio/[FILENAME].mp3`
- Add to the array

Write the updated JSON back to `src/data/birds.json` with proper formatting (2-space indentation).

### 5. Confirm Success

Display a success message:
- For updates: "✓ Updated [Common Name] (#[ID])"
- For new birds: "✓ Added [Common Name] (#[ID])"
- Show the image path: "Image saved to: public/birds/[FILENAME].jpg (800x600)"

Remind the user:
- "Note: You'll need to add the bird call audio file to: public/audio/[FILENAME].mp3"

## Example Usage

```
User: /add-bird Short-billed Pigeon https://macaulaylibrary.org/asset/505255691
Assistant: Adding new bird: Short-billed Pigeon
[Researches bird information from Wikipedia]
[Downloads and processes image]
✓ Added Short-billed Pigeon (#51)
Image saved to: public/birds/short-billed-pigeon.jpg (800x600)
Note: You'll need to add the bird call audio file to: public/audio/short-billed-pigeon.mp3
```

## Data Structure Reference

Each bird object in `birds.json` should follow this structure:

```json
{
  "id": 21,
  "commonName": "Great Kiskadee",
  "scientificName": "Pitangus sulphuratus",
  "frequency": "12.50%",
  "family": "Tyrannidae",
  "habitat": ["Open areas", "Forest edges", "Urban areas"],
  "description": "A large, boldly patterned flycatcher...",
  "size": "Medium",
  "diet": "Omnivore",
  "image": "/birds/great-kiskadee.jpg",
  "audio": "/audio/great-kiskadee.mp3",
  "funFact": "One of the most adaptable flycatchers..."
}
```

## Important Notes

- Always preserve the JSON structure and formatting
- Use 2-space indentation when writing the JSON file
- Validate that all required fields are present before saving
- Research bird information from Wikipedia automatically - don't ask the user for details
- Image filenames should be lowercase with hyphens, no apostrophes
- The skill should be non-destructive - always confirm before overwriting data
- Handle errors gracefully (e.g., failed image download, invalid URL)
