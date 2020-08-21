const Wiki = require('./wiki');

const SLOT_MAP_RS3 = {
  Legs_slot_items: 'Leg',
  Torso_slot_items: 'Body',
  Back_slot_items: 'Cape',
  Main_hand_slot_items: 'Weapon',
  'Off-hand_slot_items': 'Shield',
  Pocket_slot_items: 'Pocket',
};

const SLOT_MAP = {
  ...SLOT_MAP_RS3,
  Ammunition_slot_items: 'Ammunition',
  Body_slot_items: 'Body',
  Cape_slot_items: 'Cape',
  Feet_slot_items: 'Feet',
  Hand_slot_items: 'Hand',
  Head_slot_items: 'Head',
  Leg_slot_items: 'Leg',
  Neck_slot_items: 'Neck',
  Ring_slot_items: 'Ring',
  Shield_slot_items: 'Shield',
  'Two-handed_slot_items': 'Weapon',
  Weapon_slot_items: 'Weapon',
};

const toSlot = doc => {
  const categories = doc.parse.categories.map(category => category['*']);
  const slotCategory = categories.find(category => category.includes('slot'));

  return SLOT_MAP[slotCategory];
};

const isDiscontinued = doc =>
  doc.parse.categories.map(c => c['*']).includes('Discontinued_content');

const patterns = [
  {pattern: /fire_arrow/, solution: 'Bronze_fire_arrow'},
  {pattern: /Diving_apparatus/, solution: 'Diving_apparatus'},
];

const closestMatch = page =>
  patterns.reduce((target, {pattern, solution}) => {
    if (target) return target;
    return pattern.test(page) ? solution : target;
  }, null) || page;

const isDetailedImage = (image, page) => {
  const isDetail = image.endsWith('detail.png');
  const isAnimated = image.endsWith('detail_animated.gif');
  if (!isDetail && !isAnimated) return false;

  const isEasyMode = image.startsWith(page);
  if (isEasyMode) return true;

  const target = closestMatch(page);

  return image.startsWith(target);
};

const model = config => {
  const wiki = Wiki(config);

  const toImageUrl = file => `${config.url.base}Special:Redirect/file/${file}`;

  const toDetailImage = doc => {
    const page = doc.parse.title.replace(/ /g, '_');
    const images = doc.parse.images;

    const detail = images.find(image => isDetailedImage(image, page));

    return detail ? toImageUrl(detail) : null;
  };

  const toItem = doc => {
    const name = doc.parse.title;
    const pageId = doc.parse.pageid;
    const api = wiki.apiUrl(pageId);
    const link = wiki.wikiUrl(pageId);

    const detail = toDetailImage(doc);
    const slot = toSlot(doc);

    const discontinued = isDiscontinued(doc);

    return {
      discontinued,
      images: {detail},
      name,
      slot,
      wiki: {api, link, pageId},
    };
  };

  return {toItem};
};

module.exports = model;
