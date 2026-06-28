export const toSlug = (commonName) =>
  commonName
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\s+/g, '-');

export const slugFromImagePath = (imagePath) =>
  imagePath.replace(/^\/birds\//, '').replace(/\.jpg$/, '');

export const findBirdBySlug = (birds, slug) =>
  birds.find((bird) => bird.slug === slug);
