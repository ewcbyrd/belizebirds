import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const birdsPath = join(__dirname, '../src/data/birds.json');
const birds = JSON.parse(readFileSync(birdsPath, 'utf8'));
const validSlugs = new Set(birds.map((b) => b.slug));

const enrichments = {
  'white-whiskered-puffbird': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'White whisker tufts at bill base',
      'Brown to chestnut upperparts',
      'Large bill, sit-and-wait posture',
    ],
    voice: 'Low whistled notes from a perch.',
    funFact:
      'Sits motionless on low perches at forest edges; watch for sudden darting sallies after insects and small prey.',
    similarSpecies: ['white-necked-puffbird'],
  },
  'crimson-collared-tanager': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Black body with crimson collar and rump',
      'Heavy silver-gray bill',
      'Red flashes in flight',
    ],
    voice: 'Sharp chip notes, often in pairs.',
    funFact:
      'Often in pairs at forest edges and clearings; the crimson collar and rump flash when it flies.',
    similarSpecies: ['golden-hooded-tanager', 'yellow-winged-tanager'],
  },
  'bare-throated-tiger-heron': {
    status: 'Resident',
    regions: ['Countrywide', 'Coastal'],
    fieldMarks: [
      'Large heron with barred upperparts',
      'Bare yellow-orange throat',
      'Black crown, motionless along water',
    ],
    voice: 'Booming hrrrowwr! at sunset.',
    funFact:
      'Stands motionless along river and lake banks; listen for the booming call at dusk from gallery forest.',
    similarSpecies: [],
  },
  'rufous-tailed-jacamar': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Metallic green above, rufous tail and belly',
      'Long straight black bill',
      'Male white throat; female buff throat',
    ],
    voice: 'High-pitched peeping calls.',
    funFact:
      'Perches horizontally with bill tilted up at woodland edges; sallies out for flying insects.',
    similarSpecies: [],
  },
  'black-faced-grosbeak': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Black face, yellow head and breast',
      'Olive back and wings',
      'Heavy pale bill',
    ],
    voice: 'Loud calls in canopy flocks.',
    funFact:
      'Noisy flocks of up to 20 birds often mix with honeycreepers and tanagers at fruiting trees.',
    similarSpecies: ['blue-black-grosbeak', 'yellow-winged-tanager'],
  },
  'black-hawk-eagle': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'All-dark plumage with barred wings',
      'Long tail with gray bars',
      'Powerful broad-winged silhouette',
    ],
    voice: 'Whistled screams in flight.',
    funFact:
      'Soars high over rainforest; scan the sky above primary forest for the long barred tail.',
    similarSpecies: ['ornate-hawk-eagle', 'black-and-white-hawk-eagle'],
  },
  'fork-tailed-flycatcher': {
    status: 'Migrant',
    regions: ['Open areas', 'Coastal'],
    fieldMarks: [
      'Gray back, white underparts, black cap',
      'Extremely long forked tail streamers',
      'Slender build in open country',
    ],
    voice: 'Harsh churrs and squeaky notes.',
    funFact:
      'Open pastures and savannas; tail streamers make it unmistakable even at a distance in flight.',
    similarSpecies: ['social-flycatcher', 'boat-billed-flycatcher'],
  },
  'variable-seedeater': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Belize male all black with small white wing patch',
      'Black conical bill',
      'Female olive-brown above, paler below',
    ],
    voice: 'Sweet whistled song from exposed perch.',
    funFact:
      'Belize males (S. c. corvina) are all black except a white wing patch; common in gardens and weedy edges.',
    similarSpecies: [
      'morelets-seedeater',
      'yellow-faced-grassquit',
      'blue-black-grassquit',
    ],
  },
  'collared-forest-falcon': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Long tail, dark back, white collar',
      'Three color morphs (pale, tawny, dark)',
      'Secretive in dense forest',
    ],
    voice: 'Low human-like ow or ahr call.',
    funFact:
      'Hear the eerie call at dawn from dense forest; rarely seen despite being vocally common.',
    similarSpecies: ['barred-forest-falcon', 'laughing-falcon'],
  },
  'green-honeycreeper': {
    status: 'Resident',
    regions: ['Forest interior', 'Forest canopy'],
    fieldMarks: [
      'Male blue-green with black head, yellow bill',
      'Female all grass-green',
      'Long decurved bill',
    ],
    voice: 'Sharp tseet calls in canopy.',
    funFact:
      'Canopy frugivore; male black hood and decurved bill distinguish it from similarly colored tanagers.',
    similarSpecies: ['red-legged-honeycreeper'],
  },
  'lesser-swallow-tailed-swift': {
    status: 'Resident',
    regions: ['Countrywide'],
    fieldMarks: [
      'Long forked tail, slender body',
      'Black with white throat and upper breast',
      'Very fast flight above canopy',
    ],
    voice: 'Mostly silent in flight.',
    funFact:
      'Flies fast and high above forest; white throat patch helps separate it from other dark swifts.',
    similarSpecies: ['white-collared-swift'],
  },
  'green-breasted-mango': {
    status: 'Resident',
    regions: ['Coastal', 'Forest edges'],
    fieldMarks: [
      'Male bronze-green with velvety black chest stripe',
      'Female white-tipped outer tail feathers',
      'Slightly decurved black bill',
    ],
    voice: 'Sharp chip notes at flowers.',
    funFact:
      'Gardens and semi-open edges; male velvety black throat and chest stripe is distinctive in good light.',
    similarSpecies: [
      'rufous-tailed-hummingbird',
      'canivets-emerald',
      'scaly-breasted-hummingbird',
    ],
  },
  'buff-throated-saltator': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Slate-gray head, white supercilium',
      'Buff throat edged with black',
      'Thick convex black bill',
    ],
    voice: 'Melodious cheery cheery duets.',
    funFact:
      'Pairs sing antiphonal duets from understory at forest edges; thick bill is saltator hallmark.',
    similarSpecies: ['black-headed-saltator', 'cinnamon-bellied-saltator'],
  },
  'yellow-bellied-tyrannulet': {
    status: 'Resident',
    regions: ['Forest edges', 'Countrywide'],
    fieldMarks: [
      'Tiny flycatcher, bright yellow belly',
      'Slate-gray crown, white forehead',
      'Olive upperparts',
    ],
    voice: 'High peevish peet notes.',
    funFact:
      'Active leaf-gleaning in canopy; warbler-like foraging unlike typical sit-and-wait flycatchers.',
    similarSpecies: [
      'greenish-elaenia',
      'yellow-bellied-elaenia',
      'common-tody-flycatcher',
    ],
  },
  'stub-tailed-spadebill': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Broad flat bill, yellow breast',
      'Very short stubby tail',
      'No crown patch (unique in genus here)',
    ],
    voice: 'Soft whistled notes in understory.',
    funFact:
      'Forest understory specialist; flat spade bill and nearly absent crown separate it from other spadebills.',
    similarSpecies: ['common-tody-flycatcher', 'northern-bentbill'],
  },
  'yellow-tailed-oriole': {
    status: 'Resident',
    regions: ['Countrywide', 'Coastal'],
    fieldMarks: [
      'Mostly yellow with black back and wings',
      'Yellow margins in tail (unique among orioles)',
      'Black lower face and upper breast',
    ],
    voice: 'Mellow whistled song.',
    funFact:
      'Only oriole with prominent yellow in the tail; often in open country with scattered trees.',
    similarSpecies: ['black-cowled-oriole'],
  },
  'blue-ground-dove': {
    status: 'Resident',
    regions: ['Forest interior'],
    fieldMarks: [
      'Male blue-gray with black-spotted wings',
      'Female brown with chestnut tail and wing spots',
      'Red or yellow iris, green eyering',
    ],
    voice: 'Soft cooing from forest floor.',
    funFact:
      'Pairs flush from forest floor; a blue-gray and brown bird flying together through understory is diagnostic.',
    similarSpecies: ['ruddy-ground-dove', 'plain-breasted-ground-dove'],
  },
  'tawny-winged-woodcreeper': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Straight bill, tawny wing panels',
      'Cinnamon belly, ruffled nape',
      'Buffy supercilium',
    ],
    voice: 'Rapid descending trill.',
    funFact:
      'Near-obligate army-ant follower; look for it hopping near ant swarms on the forest floor.',
    similarSpecies: [
      'olivaceous-woodcreeper',
      'ivory-billed-woodcreeper',
      'wedge-billed-woodcreeper',
    ],
  },
  'rusty-sparrow': {
    status: 'Resident',
    regions: ['Northern Belize', 'Forest edges'],
    fieldMarks: [
      'Chestnut crown streaked black',
      'Bold black-streaked brown upperparts',
      'Grayish buff underparts',
    ],
    voice: 'Rich cheet-cheet-swing-you song.',
    funFact:
      'Large sparrow of scrub and forest edge in the north; sings from exposed perches.',
    similarSpecies: ['green-backed-sparrow'],
  },
  'ornate-hawk-eagle': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Rufous cowl and long erectile crest',
      'Bold black barring on white underparts',
      'White-tipped shoulders on dark upperparts',
    ],
    voice: 'Whistled screams overhead.',
    funFact:
      'Primary rainforest raptor; crest and rufous nape visible when perched below a canopy gap.',
    similarSpecies: ['black-hawk-eagle', 'black-and-white-hawk-eagle'],
  },
  'blue-bunting': {
    status: 'Resident',
    regions: ['Forest edges', 'Northern Belize'],
    fieldMarks: [
      'Male deep blue with sky-blue forehead',
      'Female plain brown with reddish belly',
      'Skulks in dense understory',
    ],
    voice: 'Sweet, rather sad warbled song.',
    funFact:
      'Skulks in dense tangles; male electric blue is startling when it sings from a low perch.',
    similarSpecies: [],
  },
  'mottled-owl': {
    status: 'Resident',
    regions: ['Countrywide'],
    fieldMarks: [
      'No ear tufts, round head',
      'Brown mottled upperparts',
      'Bold vertical streaks on whitish underparts',
      'Dark brown eyes',
    ],
    voice: 'Who-cooks-for-you owl call at night.',
    funFact:
      'Calls from woodland edge at night; dark eyes help separate from many other Neotropical owls.',
    similarSpecies: [],
  },
  'ruddy-crake': {
    status: 'Resident',
    regions: ['Coastal'],
    fieldMarks: [
      'Bright chestnut body',
      'Gray head with blackish crown',
      'Olive-green legs and feet',
    ],
    voice: 'Sharp rattling calls from dense cover.',
    funFact:
      'Wet marsh edges; bright rufous bird darting through vegetation—listen for rattling calls.',
    similarSpecies: ['russet-naped-wood-rail'],
  },
  'ochre-crowned-greenlet': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Yellow-brown crown, olive upperparts',
      'Ochraceous breast, bright yellow belly',
      'Active acrobat in understory',
    ],
    voice: 'Simple whistled song.',
    funFact:
      'Understory acrobat often hangs upside-down; ochre crown and gray face separate it from other greenlets.',
    similarSpecies: ['lesser-greenlet'],
  },
  'black-throated-shrike-tanager': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Male yellow-orange with black hood, wings, and tail',
      'Female olive with gray head',
      'Relatively large hooked bill',
    ],
    voice: 'Loud sharp calls in canopy.',
    funFact:
      'Aggressive canopy tanager with shrike-like bill; male black hood is bold in good light.',
    similarSpecies: [
      'yellow-winged-tanager',
      'golden-hooded-tanager',
      'crimson-collared-tanager',
    ],
  },
  'vauxs-swift': {
    status: 'Migrant',
    regions: ['Countrywide'],
    fieldMarks: [
      'Tiny cigar-shaped body',
      'Long crescent wings, squared tail',
      'Pale gray throat, dusky above',
    ],
    voice: 'Varied chattering chips in flocks.',
    funFact:
      'Winters in Belize in flocks over forest and towns; smaller and browner than White-collared Swift.',
    similarSpecies: ['white-collared-swift', 'lesser-swallow-tailed-swift'],
  },
  'violet-sabrewing': {
    status: 'Resident',
    regions: ['Forest interior', 'Northern Belize'],
    fieldMarks: [
      'Largest hummingbird in Central America',
      'Male violet-blue underparts, green upperparts',
      'Female green with violet-blue throat',
    ],
    voice: 'Loud chips at flower patches.',
    funFact:
      'Largest regional hummer; males aggressively defend flower patches in humid forest and gardens.',
    similarSpecies: ['wedge-tailed-sabrewing', 'white-necked-jacobin'],
  },
  'rufous-capped-warbler': {
    status: 'Resident',
    regions: ['Northern Belize', 'Forest edges'],
    fieldMarks: [
      'Rufous cap, white eyebrow, dark eyeline',
      'Yellow throat and chest, white belly',
      'Long tail often cocked upright',
    ],
    voice: 'Rapid accelerating chip series (not a warble).',
    funFact:
      'Pine-oak scrub and thickets in the north; cocked tail and loud chipping song reveal this skulker.',
    similarSpecies: ['gray-crowned-yellowthroat'],
  },
  'wedge-billed-woodcreeper': {
    status: 'Resident',
    regions: ['Forest interior', 'Countrywide'],
    fieldMarks: [
      'Smallest woodcreeper (~13–16 cm)',
      'Short upturned wedge-shaped bill',
      'Fulvous spots and streaks on breast',
    ],
    voice: 'High thin trills.',
    funFact:
      'Tiny woodcreeper in mixed flocks; upturned wedge-shaped bill is unique among local woodcreepers.',
    similarSpecies: ['olivaceous-woodcreeper', 'tawny-winged-woodcreeper'],
  },
};

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
console.log(`Enriched ${updated} species (ranks 81–110, excluding band-backed-wren).`);

const missing = Object.keys(enrichments).filter(
  (slug) => !birds.some((b) => b.slug === slug)
);
if (missing.length) {
  console.warn('Missing slugs:', missing);
  process.exit(1);
}

const ranks81to110 = birds.filter((b) => b.id >= 81 && b.id <= 110);
const without = ranks81to110.filter((b) => !b.fieldMarks);
if (without.length) {
  console.warn('Still missing fieldMarks:', without.map((b) => b.slug));
  process.exit(1);
}

console.log('All ranks 81–110 have structured fields.');
