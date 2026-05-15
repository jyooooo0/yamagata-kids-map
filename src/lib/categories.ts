import type {
  Category,
  CategoryId,
  Municipality,
  MunicipalityCode,
  Tag,
  TagId,
} from "@/types/spot";

export const CATEGORIES: Category[] = [
  {
    id: "food",
    name: "ランチ・ごはん",
    icon: "UtensilsCrossed",
    description: "小上がりやキッズメニューのある、家族で行ける食事処",
    order: 1,
  },
  {
    id: "cafe",
    name: "カフェ・スイーツ",
    icon: "Coffee",
    description: "子連れ歓迎のカフェ、甘味処、テイクアウトできるお店",
    order: 2,
  },
  {
    id: "babystation",
    name: "赤ちゃんの駅",
    icon: "Baby",
    description: "授乳室・おむつ替えができる立ち寄りスポット",
    order: 3,
  },
  {
    id: "indoor-play",
    name: "室内で遊ぶ",
    icon: "Blocks",
    description: "雨や雪の日でも遊べる児童館・キッズスペース",
    order: 4,
  },
  {
    id: "park",
    name: "公園・外あそび",
    icon: "Trees",
    description: "遊具のある公園や、広い芝生でのびのび遊べる場所",
    order: 5,
  },
  {
    id: "hospital",
    name: "病院・健康",
    icon: "Stethoscope",
    description: "小児科、夜間救急、子育て世帯に優しい医療機関",
    order: 6,
  },
  {
    id: "salon",
    name: "美容室・サロン",
    icon: "Scissors",
    description: "子どもカット・親子で通えるサロン",
    order: 7,
  },
  {
    id: "library",
    name: "図書館・読み聞かせ",
    icon: "BookOpen",
    description: "絵本コーナーが充実した図書館、おはなし会",
    order: 8,
  },
  {
    id: "craft",
    name: "ものづくり・体験",
    icon: "Palette",
    description: "陶芸・クラフト・農業体験など、思い出に残る体験",
    order: 9,
  },
  {
    id: "aquarium",
    name: "水族館・動物",
    icon: "Fish",
    description: "加茂水族館や動物とふれあえるスポット",
    order: 10,
  },
  {
    id: "museum",
    name: "博物館・歴史",
    icon: "Landmark",
    description: "致道博物館など、学びにつながる施設",
    order: 11,
  },
  {
    id: "nature",
    name: "自然・ハイキング",
    icon: "Mountain",
    description: "羽黒山・大山・キャンプ場など、自然を感じる場所",
    order: 12,
  },
  {
    id: "onsen",
    name: "温泉・宿泊",
    icon: "Bath",
    description: "家族湯やキッズ歓迎の温泉旅館",
    order: 13,
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id: CategoryId | string): Category | undefined {
  return CATEGORY_MAP[id as CategoryId];
}

export const MUNICIPALITIES: Municipality[] = [
  { code: "tsuruoka", name: "鶴岡市", kana: "つるおかし", area: "shonai" },
  { code: "sakata", name: "酒田市", kana: "さかたし", area: "shonai" },
  { code: "mikawa", name: "三川町", kana: "みかわまち", area: "shonai" },
  { code: "shonai", name: "庄内町", kana: "しょうないまち", area: "shonai" },
  { code: "yuza", name: "遊佐町", kana: "ゆざまち", area: "shonai" },
];

export const MUNICIPALITY_MAP: Record<MunicipalityCode, Municipality> =
  Object.fromEntries(MUNICIPALITIES.map((m) => [m.code, m])) as Record<
    MunicipalityCode,
    Municipality
  >;

export const TAGS: Tag[] = [
  // facility（設備）
  { id: "kozakai", label: "小上がりあり", group: "facility" },
  { id: "private-room", label: "個室あり", group: "facility" },
  { id: "high-chair", label: "ベビーチェアあり", group: "facility" },
  { id: "nursing-room", label: "授乳室あり", group: "facility" },
  { id: "diaper-table", label: "おむつ替え台あり", group: "facility" },
  { id: "elevator", label: "エレベーターあり", group: "facility" },
  { id: "barrier-free", label: "バリアフリー", group: "facility" },
  { id: "stroller-ok", label: "ベビーカーOK", group: "facility" },
  // food
  { id: "kids-menu", label: "キッズメニュー", group: "food" },
  { id: "allergy-support", label: "アレルギー対応", group: "food" },
  // service
  { id: "kids-cut", label: "子どもカット可", group: "service" },
  { id: "online-reserve", label: "ネット予約可", group: "service" },
  // vibe
  { id: "welcoming", label: "子連れウェルカム", group: "vibe" },
  { id: "ok-noisy", label: "騒いでも大丈夫", group: "vibe" },
  { id: "quiet", label: "静かめ", group: "vibe" },
  { id: "wide-seat", label: "広めの席", group: "vibe" },
  // location
  { id: "parking-free", label: "無料駐車場", group: "location" },
  { id: "parking-large", label: "駐車場広い", group: "location" },
  { id: "near-station", label: "駅近", group: "location" },
  { id: "by-road", label: "道沿いで寄りやすい", group: "location" },
];

export const TAG_MAP: Record<TagId, Tag> = Object.fromEntries(
  TAGS.map((t) => [t.id, t]),
) as Record<TagId, Tag>;

export function getTag(id: TagId | string): Tag | undefined {
  return TAG_MAP[id as TagId];
}

export const TAG_GROUP_LABELS: Record<Tag["group"], string> = {
  facility: "設備",
  food: "食事",
  service: "サービス",
  vibe: "雰囲気",
  location: "立地・アクセス",
};
