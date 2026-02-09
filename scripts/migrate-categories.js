const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'places.json'), 'utf8'));

const NEW_CATEGORIES = {
  eat: {
    id: 'eat',
    name: 'ランチ・ごはん',
    icon: '🍽️',
    order: 1,
    fields: [
      { key: 'kozakai', label: '小上がり', type: 'boolean' },
      { key: 'koshitsu', label: '個室', type: 'boolean' },
      { key: 'junyushitsu', label: '授乳室', type: 'boolean' },
      { key: 'babyChair', label: 'ベビーチェア', type: 'boolean' },
      { key: 'kidsMenu', label: 'キッズメニュー', type: 'boolean' },
      { key: 'omutsu', label: 'オムツ替え台', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  cafe: {
    id: 'cafe',
    name: 'カフェ・スイーツ',
    icon: '☕',
    order: 2,
    fields: [
      { key: 'kozakai', label: '小上がり', type: 'boolean' },
      { key: 'koshitsu', label: '個室', type: 'boolean' },
      { key: 'junyushitsu', label: '授乳室', type: 'boolean' },
      { key: 'babyChair', label: 'ベビーチェア', type: 'boolean' },
      { key: 'kidsMenu', label: 'キッズメニュー', type: 'boolean' },
      { key: 'omutsu', label: 'オムツ替え台', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  babyStation: {
    id: 'babyStation',
    name: '赤ちゃんの駅',
    icon: '🍼',
    order: 3,
    fields: [
      { key: 'junyushitsu', label: '授乳室', type: 'boolean' },
      { key: 'omutsu', label: 'オムツ替え', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  playIndoor: {
    id: 'playIndoor',
    name: '室内で遊ぶ',
    icon: '🎪',
    order: 4,
    fields: [
      { key: 'indoor', label: '屋内/屋外', type: 'text' },
      { key: 'ageRange', label: '対象年齢', type: 'text' },
      { key: 'junyushitsu', label: '授乳室', type: 'boolean' },
      { key: 'omutsu', label: 'オムツ替え', type: 'boolean' },
      { key: 'restSpace', label: '休憩スペース', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  playOutdoor: {
    id: 'playOutdoor',
    name: '公園・外あそび',
    icon: '🛝',
    order: 5,
    fields: [
      { key: 'stroller', label: 'ベビーカー対応', type: 'boolean' },
      { key: 'toilet', label: 'トイレ', type: 'boolean' },
      { key: 'omutsu', label: 'オムツ替え', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  aquarium: {
    id: 'aquarium',
    name: '水族館・動物',
    icon: '🐠',
    order: 6,
    fields: [
      { key: 'indoor', label: '屋内/屋外', type: 'text' },
      { key: 'ageRange', label: '対象年齢', type: 'text' },
      { key: 'junyushitsu', label: '授乳室', type: 'boolean' },
      { key: 'omutsu', label: 'オムツ替え', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  onsen: {
    id: 'onsen',
    name: '温泉・宿泊',
    icon: '♨️',
    order: 7,
    fields: [
      { key: 'familyBath', label: '家族風呂', type: 'boolean' },
      { key: 'babyAmenity', label: 'ベビー備品', type: 'text' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  beauty: {
    id: 'beauty',
    name: '美容室・サロン',
    icon: '✂️',
    order: 8,
    fields: [
      { key: 'kidsSpace', label: 'キッズスペース', type: 'boolean' },
      { key: 'private', label: '個室・貸切', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  library: {
    id: 'library',
    name: '図書館・読み聞かせ',
    icon: '📚',
    order: 9,
    fields: [
      { key: 'ageRange', label: '対象年齢', type: 'text' },
      { key: 'event', label: 'おはなし会など', type: 'text' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  craft: {
    id: 'craft',
    name: 'ものづくり・体験',
    icon: '🎨',
    order: 10,
    fields: [
      { key: 'ageRange', label: '対象年齢', type: 'text' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  museum: {
    id: 'museum',
    name: '博物館・歴史',
    icon: '🏛️',
    order: 11,
    fields: [
      { key: 'ageRange', label: '対象年齢', type: 'text' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  },
  nature: {
    id: 'nature',
    name: '自然・ハイキング',
    icon: '🌿',
    order: 12,
    fields: [
      { key: 'stroller', label: 'ベビーカー対応', type: 'boolean' },
      { key: 'toilet', label: 'トイレ', type: 'boolean' },
      { key: 'parking', label: '駐車場', type: 'text' }
    ]
  }
};

const OLD_TO_NEW = {
  food: { categories: ['eat'], primary: 'eat' },
  play: { categories: ['playIndoor'], primary: 'playIndoor' },
  relax: { categories: ['onsen'], primary: 'onsen' },
  learn: { categories: ['library'], primary: 'library' },
  nature: { categories: ['playOutdoor'], primary: 'playOutdoor' }
};

// 全スポットの正しいカテゴリ（ID で一意に指定。移行の上書きミスを防ぐ）
const ID_TO_CATEGORIES = {
  'izukiku': { categories: ['eat'], primary: 'eat' },
  'k-dining': { categories: ['eat'], primary: 'eat' },
  'kissa-mariina': { categories: ['eat', 'cafe'], primary: 'eat' },
  'uotei-okazaki': { categories: ['eat'], primary: 'eat' },
  'hikawa-cafe': { categories: ['eat', 'cafe'], primary: 'cafe' },
  'chitto-motche': { categories: ['cafe'], primary: 'cafe' },
  'yunohama-kitchen': { categories: ['cafe', 'eat'], primary: 'cafe' },
  'kotohiraso': { categories: ['eat'], primary: 'eat' },
  'omatsuga': { categories: ['eat'], primary: 'eat' },
  'sutamina-taru': { categories: ['eat', 'babyStation'], primary: 'eat' },
  'pisolino': { categories: ['eat', 'babyStation'], primary: 'eat' },
  'starbucks-tsuruoka': { categories: ['cafe', 'babyStation'], primary: 'cafe' },
  'kids-dome-sorai': { categories: ['playIndoor'], primary: 'playIndoor' },
  'hiroppia': { categories: ['playIndoor', 'playOutdoor'], primary: 'playIndoor' },
  'manma-room': { categories: ['playIndoor'], primary: 'playIndoor' },
  'kamo-aquarium': { categories: ['aquarium'], primary: 'aquarium' },
  'oyama-jidoukan': { categories: ['playIndoor'], primary: 'playIndoor' },
  'nakayoshi-hiroba': { categories: ['playIndoor'], primary: 'playIndoor' },
  'namco-small': { categories: ['playIndoor'], primary: 'playIndoor' },
  'tachibanaya': { categories: ['onsen'], primary: 'onsen' },
  'kyukamura-shonai': { categories: ['onsen'], primary: 'onsen' },
  'suiden-terrace': { categories: ['onsen'], primary: 'onsen' },
  'yunose-ryokan': { categories: ['onsen'], primary: 'onsen' },
  'yunohama-onsen': { categories: ['onsen'], primary: 'onsen' },
  'hair-attache': { categories: ['beauty'], primary: 'beauty' },
  'fam-hair': { categories: ['beauty'], primary: 'beauty' },
  'shobikan': { categories: ['beauty'], primary: 'beauty' },
  'hair-sol': { categories: ['beauty'], primary: 'beauty' },
  'lib-main': { categories: ['library'], primary: 'library' },
  'lib-kushibiki': { categories: ['library'], primary: 'library' },
  'lib-asahi': { categories: ['library'], primary: 'library' },
  'lib-atsumi': { categories: ['library'], primary: 'library' },
  'lib-haguro': { categories: ['library'], primary: 'library' },
  'matsugaoka-you': { categories: ['craft'], primary: 'craft' },
  'craft-matsugaoka': { categories: ['craft'], primary: 'craft' },
  'goten-mari': { categories: ['craft'], primary: 'craft' },
  'yonabe-usagi': { categories: ['craft'], primary: 'craft' },
  'chido-museum': { categories: ['museum'], primary: 'museum' },
  'nanbu-koen': { categories: ['playOutdoor'], primary: 'playOutdoor' },
  'oyama-koen': { categories: ['playOutdoor', 'nature'], primary: 'playOutdoor' },
  'haguro-yama': { categories: ['nature'], primary: 'nature' },
  'hiroppia-koen': { categories: ['playOutdoor'], primary: 'playOutdoor' },
  'atsumi-bara': { categories: ['playOutdoor'], primary: 'playOutdoor' },
  'nezugaseki-camp': { categories: ['nature'], primary: 'nature' },
  'esumall': { categories: ['babyStation'], primary: 'babyStation' },
  'nishimatsuya': { categories: ['babyStation'], primary: 'babyStation' },
  'aeon-mikawa': { categories: ['babyStation'], primary: 'babyStation' },
  'bernard-tsuruoka': { categories: ['babyStation'], primary: 'babyStation' },
  'shonai-airport': { categories: ['babyStation'], primary: 'babyStation' }
};

const places = data.places.map(p => {
  const mapping = ID_TO_CATEGORIES[p.id] || (p.category ? OLD_TO_NEW[p.category] : null) || { categories: [p.primaryCategory || 'playIndoor'], primary: p.primaryCategory || 'playIndoor' };
  const { category, details, ...rest } = p;
  return { ...rest, categories: mapping.categories, primaryCategory: mapping.primary, details: details || {} };
});

places.forEach(p => {
  if (p.primaryCategory === 'onsen' && p.details) {
    const d = p.details;
    p.details = {
      familyBath: !!(d.quiet || d.familyBath),
      babyAmenity: (d.quiet && typeof d.quiet === 'string' ? d.quiet : '') || d.babyAmenity || '',
      parking: d.parking || ''
    };
  }
  if (p.primaryCategory === 'beauty' && p.details) {
    const d = p.details;
    p.details = {
      kidsSpace: !!(d.quiet || d.kidsSpace),
      private: !!(d.quiet || d.private),
      parking: d.parking || ''
    };
  }
  if (p.primaryCategory === 'library' && p.details) {
    const d = p.details;
    if (!d.event) p.details.event = d.ageRange || '';
  }
});

const output = {
  categories: NEW_CATEGORIES,
  categoryOrder: ['eat', 'cafe', 'babyStation', 'playIndoor', 'playOutdoor', 'aquarium', 'onsen', 'beauty', 'library', 'craft', 'museum', 'nature'],
  places
};

fs.writeFileSync(path.join(__dirname, '..', 'data', 'places.json'), JSON.stringify(output, null, 2), 'utf8');
console.log('Migrated', places.length, 'places. Categories:', Object.keys(NEW_CATEGORIES).length);
