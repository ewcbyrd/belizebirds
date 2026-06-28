import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const birdsPath = join(__dirname, '../src/data/birds.json');
const birds = JSON.parse(readFileSync(birdsPath, 'utf8'));
const validSlugs = new Set(birds.map((b) => b.slug));

const enrichments = {
  'little-tinamou': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Small sooty-brown ground bird',
      'Greyish head, cinnamon-buff underparts',
      'Very short tail, secretive',
    ],
    voice: 'Low mournful whistles, more often heard than seen.',
    funFact:
      'Walks quietly on forest floor; listen for soft whistles at dawn and dusk in humid lowland forest.',
    similarSpecies: ['thicket-tinamou', 'great-tinamou'],
  },
  'plain-breasted-ground-dove': {
    status: 'Resident',
    regions: ['Countrywide'],
    fieldMarks: [
      'Very small dove, possibly smallest by mass',
      'Plain brown head and breast (no scaling)',
      'Dark violet wing spots, rufous underwings',
    ],
    voice: 'Soft cooing on open ground.',
    funFact:
      'Open dry grassland and scrub; lacks the scaled neck pattern of Ruddy Ground-Dove.',
    similarSpecies: ['ruddy-ground-dove', 'blue-ground-dove'],
  },
  'great-black-hawk': {
    status: 'Resident',
    regions: ['Coastal', 'Countrywide'],
    fieldMarks: [
      'Large all-black hawk',
      'Short white tail with broad black tip',
      'Yellow legs and cere, very broad wings',
    ],
    voice: 'Distinctive piping ooo-wheeeeee.',
    funFact:
      'Perches along rivers and coast; white tail base and black tip visible in flight.',
    similarSpecies: ['great-black-hawk'],
  },
  'dot-winged-antwren': {
    status: 'Resident',
    regions: ['Forest interior', 'Forest edges'],
    fieldMarks: [
      'Male black with white wing dots',
      'Female gray above, black throat, rufous underparts',
      'Long graduated tail, active in vine tangles',
    ],
    voice: 'Sharp chips in understory pairs.',
    funFact:
      'Pairs forage actively in vine tangles at forest edge; male white wing spots are distinctive.',
    similarSpecies: ['barred-antshrike', 'dusky-antbird'],
  },
  'slate-headed-tody-flycatcher': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Tiny flycatcher, gray crown and nape',
      'Olive back, yellowish wing bars',
      'Grayish white streaked underparts',
    ],
    voice: 'High thin calls from dense scrub.',
    funFact:
      'Dense scrub at forest edge and secondary growth; smaller and grayer-crowned than Common Tody-Flycatcher.',
    similarSpecies: ['common-tody-flycatcher', 'northern-bentbill'],
  },
  'northern-plain-xenops': {
    status: 'Resident',
    regions: ['Forest interior', 'Countrywide'],
    fieldMarks: [
      'Buff supercilium, white malar stripe',
      'Rufous wings and tail',
      'Wedge-shaped slightly upturned bill',
    ],
    voice: 'Sharp notes while foraging on branches.',
    funFact:
      'Chisels dead branches like a nuthatch, often hanging upside-down; buff eyebrow and rufous wings help ID.',
    similarSpecies: ['wedge-billed-woodcreeper'],
  },
  'canivets-emerald': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Brilliant golden-green male',
      'Red bill with black tip, long forked tail',
      'Female gray below with pale eye stripe',
    ],
    voice: 'Chipping calls at flowers.',
    funFact:
      'Semi-open edges and gardens; wags partly spread tail while feeding at small flowers.',
    similarSpecies: [
      'green-breasted-mango',
      'white-bellied-emerald',
      'rufous-tailed-hummingbird',
    ],
  },
  'tody-motmot': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Smallest motmot (~17 cm)',
      'Green crown, rufous neck, blue supercilium',
      'Black mask with white stripe below',
    ],
    voice: 'Soft hooting notes in understory.',
    funFact:
      'Humid forest understory; tiny motmot with tody-like proportions—listen for soft hoots.',
    similarSpecies: ['lessons-motmot'],
  },
  'red-crowned-ant-tanager': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Male dull red-brown with scarlet crown stripe',
      'Female yellow-brown with buff crown stripe',
      'Crown stripe raised when excited',
    ],
    voice: 'Harsh chattering calls near ant swarms.',
    funFact:
      'Regular army-ant follower in understory; raised scarlet crown stripe visible when agitated.',
    similarSpecies: ['red-throated-ant-tanager', 'gray-headed-tanager'],
  },
  'white-collared-swift': {
    status: 'Resident',
    regions: ['Countrywide'],
    fieldMarks: [
      'Largest swift in range (~21 cm)',
      'Black with bold white collar',
      'Slightly forked tail, long wings',
    ],
    voice: 'Screaming calls in large flocks.',
    funFact:
      'Huge fast-flying flocks over forest and towns; white collar visible even at distance.',
    similarSpecies: ['vauxs-swift', 'lesser-swallow-tailed-swift'],
  },
  'eye-ringed-flatbill': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Bold white eye-ring',
      'Large wide flat bill',
      'Olive-green upperparts, pale yellow belly',
    ],
    voice: 'Whistled notes from midstory.',
    funFact:
      'Midstory flycatcher with conspicuous eye-ring; wide flat bill separates from other flycatchers.',
    similarSpecies: ['yellow-olive-flatbill', 'ochre-bellied-flycatcher'],
  },
  'azure-crowned-hummingbird': {
    status: 'Resident',
    regions: ['Northern Belize', 'Forest edges'],
    fieldMarks: [
      'Bright metallic blue crown',
      'Bronze nape and back',
      'White underparts with bronze-green sides',
    ],
    voice: 'Chipping at flowers and feeders.',
    funFact:
      'Pine-oak foothills and forest edge in the north; blue crown gleams in good light.',
    similarSpecies: ['canivets-emerald', 'scaly-breasted-hummingbird'],
  },
  'white-browed-gnatcatcher': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Tiny, constantly moving',
      'Male black cap with white eyebrow',
      'Long black tail with white outer feathers',
    ],
    voice: 'Thin wheezy calls while foraging.',
    funFact:
      'Hyperactive pairs in scrub and forest edge; tail often cocked while gleaning insects.',
    similarSpecies: ['long-billed-gnatwren'],
  },
  'black-and-white-hawk-eagle': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Striking white head and body',
      'Black wings with white leading edge',
      'Small black crest, barred tail',
    ],
    voice: 'Whistled screams over forest.',
    funFact:
      'Soars over tall forest; unmistakable black-and-white pattern unlike any other local raptor.',
    similarSpecies: [
      'white-hawk',
      'black-hawk-eagle',
      'ornate-hawk-eagle',
    ],
  },
  'rufous-breasted-spinetail': {
    status: 'Resident',
    regions: ['Forest edges', 'Northern Belize'],
    fieldMarks: [
      'Deep cinnamon-rufous breast',
      'Sepia brown upperparts, chestnut wings and tail',
      'Black throat with white streaks',
    ],
    voice: 'Scratchy duets from dense tangles.',
    funFact:
      'Dense scrub and edge tangles; rufous breast and streaked black throat are distinctive.',
    similarSpecies: ['fawn-throated-foliage-gleaner'],
  },
  'purple-crowned-fairy': {
    status: 'Resident',
    regions: ['Forest interior', 'Forest canopy'],
    fieldMarks: [
      'Emerald green above, white below',
      'Long pointed tail, blue-black center',
      'Male violet forecrown',
    ],
    voice: 'Soft chips in canopy.',
    funFact:
      'Canopy hummer; long white-edged tail and violet crown (male) visible at forest gaps.',
    similarSpecies: ['long-billed-hermit', 'white-necked-jacobin'],
  },
  'northern-barred-woodcreeper': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Large woodcreeper (~27 cm)',
      'Barred olive-brown back and buff underparts',
      'Long tail, straight bill',
    ],
    voice: 'Loud descending whistles.',
    funFact:
      'Army-ant follower on vertical trunks; larger and more heavily barred than Olivaceous Woodcreeper.',
    similarSpecies: [
      'ivory-billed-woodcreeper',
      'olivaceous-woodcreeper',
      'tawny-winged-woodcreeper',
    ],
  },
  'ruddy-woodcreeper': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Uniform rufous-chestnut plumage',
      'Brighter reddish crown',
      'Straight bill, short tail',
    ],
    voice: 'Single sharp whistle.',
    funFact:
      'Army-ant follower clinging to trunks; all-rufous plumage unlike barred or olive woodcreepers.',
    similarSpecies: ['tawny-winged-woodcreeper', 'ruddy-woodcreeper'],
  },
  'gray-headed-dove': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Pale bluish-gray crown',
      'Pinkish buff face, white belly',
      'Olive-brown upperparts, black tail with white tips',
    ],
    voice: 'Soft cooing from understory.',
    funFact:
      'Large understory dove; pale gray head and white-tipped tail flash when flushed from forest floor.',
    similarSpecies: [
      'gray-chested-dove',
      'short-billed-pigeon',
      'pale-vented-pigeon',
    ],
  },
  'gray-headed-tanager': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Conspicuous gray head and crest',
      'Yellowish olive body',
      'Pairs in dense understory',
    ],
    voice: 'Soft chips near ant swarms.',
    funFact:
      'Understory pairs often follow army ants; gray crested head stands out in dim forest.',
    similarSpecies: ['red-crowned-ant-tanager', 'red-throated-ant-tanager'],
  },
  'chestnut-colored-woodpecker': {
    status: 'Resident',
    regions: ['Forest interior', 'Coastal'],
    fieldMarks: [
      'Rich chestnut body with black V marks below',
      'Black bars on back, pointed crest',
      'Male red from lores to throat',
    ],
    voice: 'Whinnying calls in forest.',
    funFact:
      'Humid forest and mangroves; male red face and throat; heavily marked chestnut underparts.',
    similarSpecies: [
      'pale-billed-woodpecker',
      'golden-olive-woodpecker',
      'lineated-woodpecker',
    ],
  },
  'mangrove-vireo': {
    status: 'Resident',
    regions: ['Coastal'],
    fieldMarks: [
      'Small vireo, greenish brown above',
      'Yellowish wing bars',
      'Grayish underparts with faint yellow belly',
    ],
    voice: 'Slow whistled song.',
    funFact:
      'Coastal mangroves and scrub; dull vireo best found by song in red mangrove stands.',
    similarSpecies: ['lesser-greenlet'],
  },
  'white-bellied-wren': {
    status: 'Resident',
    regions: ['Northern Belize', 'Forest edges'],
    fieldMarks: [
      'White belly, gray throat and chest',
      'Brown upperparts, buff flanks',
      'Barred tail, white supercilium',
    ],
    voice: 'Bubbling song from thickets.',
    funFact:
      'Thorny scrub and dry forest edge; white belly and gray breast separate from other small wrens.',
    similarSpecies: [
      'southern-house-wren',
      'white-breasted-wood-wren',
      'spot-breasted-wren',
    ],
  },
  'orange-breasted-falcon': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Black head, bluish black upperparts',
      'Buff-orange breast and belly',
      'Black lower breast with reddish bars',
    ],
    voice: 'Loud screaming calls.',
    funFact:
      'Rare cliff and emergent-tree nester; orange breast and heavy build unlike smaller Bat Falcon.',
    similarSpecies: ['bat-falcon'],
  },
  'white-necked-puffbird': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Glossy black with broad white neck and breast',
      'Black band between white upper breast and belly',
      'Very large black bill',
    ],
    voice: 'Whistled calls from open perches.',
    funFact:
      'More open than White-whiskered; bold black-and-white pattern visible on exposed snags.',
    similarSpecies: ['white-whiskered-puffbird'],
  },
  'great-tinamou': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Large ground bird (~40 cm)',
      'Olive-green with rufous crown and neck',
      'Whitish throat and belly, barred flanks',
    ],
    voice: 'Three-note piping call at dusk.',
    funFact:
      'Listen for the three-note whistle at dusk in primary forest; usually walks rather than flies.',
    similarSpecies: ['little-tinamou', 'thicket-tinamou'],
  },
  'gray-chested-dove': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Pinkish gray face, dark brown crown',
      'Reddish gray breast, reddish belly',
      'Yellow eye with bare gray skin',
    ],
    voice: 'Soft cooing from secondary forest.',
    funFact:
      'Secondary forest understory; reddish underparts and yellow eye distinguish from Gray-headed Dove.',
    similarSpecies: ['gray-headed-dove', 'short-billed-pigeon'],
  },
  'smoky-brown-woodpecker': {
    status: 'Resident',
    regions: ['Forest interior', 'Countrywide'],
    fieldMarks: [
      'Uniform olive-brown plumage',
      'Male red crown; female dark crown',
      'Thin white supercilium',
    ],
    voice: 'Rattling calls in midstory.',
    funFact:
      'Midstory woodpecker in varied forest types; plain brown plumage with red crown on male.',
    similarSpecies: ['golden-olive-woodpecker', 'lineated-woodpecker'],
  },
  'hook-billed-kite': {
    status: 'Resident',
    regions: ['Forest interior', 'Coastal'],
    fieldMarks: [
      'Large strongly hooked bill',
      'Slender kite shape, variable plumage',
      'Male dark below; female brown or brick-red',
    ],
    voice: 'Whistled calls near snail-rich forest.',
    funFact:
      'Snail specialist of forest and wetlands; oversized hooked bill is the key field mark.',
    similarSpecies: ['double-toothed-kite'],
  },
  'brown-hooded-parrot': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Reddish brown hood',
      'Green body with blue wing edge',
      'Pink-red patch behind eye',
    ],
    voice: 'Harsh screeching calls in flight.',
    funFact:
      'Small parrot of humid forest canopy; brown hood and red eye patch visible in flight.',
    similarSpecies: ['white-crowned-parrot', 'olive-throated-parakeet'],
  },
  'cabaniss-wren': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Dark gray-brown crown',
      'Rufous-brown back, orange-rufous rump',
      'White supercilium, buffy white belly',
    ],
    voice: 'Rich melodious song.',
    funFact:
      'Garden and forest edge wren; orange rump and gray crown help separate from House Wren.',
    similarSpecies: ['southern-house-wren', 'spot-breasted-wren'],
  },
  'tropical-royal-flycatcher': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Erectile fan crest (red/blue in male)',
      'Dark brown barred upperparts',
      'Warm buff underparts with breast barring',
    ],
    voice: 'Soft whistles; crest raised when alarmed.',
    funFact:
      'Understory near streams; spectacular fan crest usually hidden—look for cinnamon rump and barred back.',
    similarSpecies: ['sulphur-rumped-flycatcher'],
  },
  'northern-potoo': {
    status: 'Resident',
    regions: ['Countrywide'],
    fieldMarks: [
      'Large nocturnal bird, cryptic brown pattern',
      'Huge yellow eyes',
      'Perches upright like a broken branch',
    ],
    voice: 'Mournful wavering song at night.',
    funFact:
      'Scan fence posts and dead snags at dusk; freezes upright and blends perfectly with bark.',
    similarSpecies: [],
  },
  'lesser-yellow-headed-vulture': {
    status: 'Resident',
    regions: ['Coastal', 'Countrywide'],
    fieldMarks: [
      'Black plumage with green sheen',
      'Pale orange bare head and neck',
      'Flies low over wetlands and savanna',
    ],
    voice: 'Hisses and grunts at carrion.',
    funFact:
      'Low-flying vulture of marshes and savanna; pale orange head unlike the King Vulture.',
    similarSpecies: ['king-vulture'],
  },
  'orange-billed-sparrow': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Bright orange bill',
      'Black crown with gray central stripe',
      'White supercilium, black breast band',
    ],
    voice: 'Musical whistled song.',
    funFact:
      'Forest floor and understory; orange bill and black breast band are unmistakable.',
    similarSpecies: ['green-backed-sparrow', 'rusty-sparrow'],
  },
  'sulphur-rumped-flycatcher': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Namesake sulphur-yellow rump patch',
      'Olive-brown head, tawny breast',
      'Grey face and eye ring',
    ],
    voice: 'Soft calls in understory flocks.',
    funFact:
      'Fans tail to flash yellow rump near forest streams; often in mixed-species understory flocks.',
    similarSpecies: ['tropical-royal-flycatcher', 'bright-rumped-attila'],
  },
  'thick-billed-seed-finch': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Male all black with small white wing patch',
      'Female rich brown (very different)',
      'Large straight-edged bill',
    ],
    voice: 'Sweet whistled song.',
    funFact:
      'Grassy edges and scrub; massive bill and white wing patch on black male are distinctive.',
    similarSpecies: ['variable-seedeater', 'morelets-seedeater'],
  },
  'thicket-tinamou': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Medium brown tinamou with barred back',
      'Cinnamon breast, buff supercilium',
      'Heavily barred wings and rump',
    ],
    voice: 'Monotonous steam-engine-like song.',
    funFact:
      'Gallery and moist forest; barred upperparts and steam-engine song separate from Little Tinamou.',
    similarSpecies: ['little-tinamou', 'great-tinamou'],
  },
  'crested-guan': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Large turkey-like bird',
      'Dusky olive brown with chestnut belly',
      'Small red throat wattle',
    ],
    voice: 'Powerful ku LEEErrr! dawn call.',
    funFact:
      'Listen for the steam-whistle dawn song in tall forest; often perches high in canopy.',
    similarSpecies: ['great-curassow'],
  },
  'collared-trogon': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Male green above, red belly',
      'Black face and throat, white collar',
      'Female olive-brown where male is green',
    ],
    voice: 'Soft cooing notes.',
    funFact:
      'Midstory sit-and-wait hunter; white collar between green breast and red belly on male.',
    similarSpecies: [
      'gartered-trogon',
      'black-headed-trogon',
      'slaty-tailed-trogon',
    ],
  },
  'barred-forest-falcon': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Dark slate upperparts',
      'White underparts finely barred black',
      'Tail tipped white with narrow bars',
    ],
    voice: 'Repeated ow calls at dawn.',
    funFact:
      'Secretive forest raptor; fine barring on white underparts unlike Collared Forest-Falcon.',
    similarSpecies: ['collared-forest-falcon', 'laughing-falcon'],
  },
  'yellow-backed-oriole': {
    status: 'Resident',
    regions: ['Northern Belize', 'Forest edges'],
    fieldMarks: [
      'Bright yellow back and underparts',
      'Black wings, tail, throat, and face',
      'Pine-oak and dry scrub specialist',
    ],
    voice: 'Clear whistled song.',
    funFact:
      'Pine-oak woodlands in the north; yellow back contrasts with black wings and tail.',
    similarSpecies: ['yellow-tailed-oriole', 'black-cowled-oriole'],
  },
  'northern-emerald-toucanet': {
    status: 'Resident',
    regions: ['Northern Belize', 'Forest interior'],
    fieldMarks: [
      'Mostly green small toucan',
      'White throat',
      'Bill black below, yellow above with black marks',
    ],
    voice: 'Nasal repeated Wok! calls.',
    funFact:
      'Montane and secondary forest; much smaller than Keel-billed Toucan with colorful small bill.',
    similarSpecies: ['keel-billed-toucan', 'collared-aracari'],
  },
  'fawn-throated-foliage-gleaner': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Large brown foliage-gleaner',
      'Deep buff throat',
      'Dusky-scaled buff breast and belly',
    ],
    voice: 'Chattering calls in mixed flocks.',
    funFact:
      'Pulls prey from dead leaf clumps in undergrowth; often with mixed-species flocks.',
    similarSpecies: ['rufous-breasted-spinetail'],
  },
  'sepia-capped-flycatcher': {
    status: 'Resident',
    regions: ['Forest interior', 'Countrywide'],
    fieldMarks: [
      'Sepia-brown crown',
      'Olive-green upperparts',
      'Yellowish belly, grayish-olive throat',
    ],
    voice: 'Whistled pee-tic notes.',
    funFact:
      'Understory to mid-level forager; sepia cap and yellow belly distinguish from elaenias.',
    similarSpecies: ['ochre-bellied-flycatcher', 'yellow-bellied-tyrannulet'],
  },
  'double-toothed-kite': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Small forest raptor',
      'Gray head, white throat with dark stripe',
      'Rufous breast, barred belly',
    ],
    voice: 'High thin whistles.',
    funFact:
      'Follows monkey troops in canopy; small size and rufous breast unlike Hook-billed Kite.',
    similarSpecies: ['hook-billed-kite', 'bat-falcon'],
  },
  'great-curassow': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Very large black male with curly crest',
      'Yellow bill knob, white belly',
      'Female barred, rufous, or black morph',
    ],
    voice: 'Deep booming calls.',
    funFact:
      'Walks on forest floor for fallen fruit; male black with yellow knob is unmistakable if seen.',
    similarSpecies: ['crested-guan'],
  },
  'spotted-wood-quail': {
    status: 'Resident',
    regions: ['Northern Belize'],
    fieldMarks: [
      'Orange crest',
      'Dark brown upperparts flecked black and rufous',
      'Olive underparts boldly spotted white',
    ],
    voice: 'Distinctive whistled duet.',
    funFact:
      'Montane understory coveys; usually escapes on foot—listen for whistled duets at dawn.',
    similarSpecies: [],
  },
};

// Fix self-references in similarSpecies
enrichments['great-black-hawk'].similarSpecies = ['white-hawk'];
enrichments['ruddy-woodcreeper'].similarSpecies = [
  'tawny-winged-woodcreeper',
  'olivaceous-woodcreeper',
];

function filterSimilar(slugs) {
  return slugs.filter((s) => validSlugs.has(s));
}

let updated = 0;
for (const bird of birds) {
  const data = enrichments[bird.slug];
  if (!data) continue;
  bird.status = data.status;
  bird.regions = data.regions;
  bird.fieldMarks = data.fieldMarks;
  bird.voice = data.voice;
  bird.funFact = data.funFact;
  bird.similarSpecies = filterSimilar(data.similarSpecies);
  updated++;
}

writeFileSync(birdsPath, JSON.stringify(birds, null, 2) + '\n');
console.log(`Enriched ${updated} species (ranks 111–160).`);

const ranks111to160 = birds.filter((b) => b.id >= 111 && b.id <= 160);
const without = ranks111to160.filter((b) => !b.fieldMarks);
if (without.length) {
  console.warn('Still missing fieldMarks:', without.map((b) => b.slug));
  process.exit(1);
}

const total = birds.filter((b) => b.fieldMarks).length;
console.log(`All ranks 111–160 have structured fields. Total enriched: ${total}/160.`);
