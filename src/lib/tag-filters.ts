import type { TagId } from "@/types/spot";

/** フィルタチップ用の短い表示名（一覧・ホーム共通） */
export const TAG_FILTER_SHORT_LABELS: Record<TagId, string> = {
  "diaper-table": "おむつ替え",
  "nursing-room": "授乳室",
  "kids-menu": "キッズメニュー",
  kozakai: "小上がり",
  "private-room": "個室",
  "high-chair": "ベビーチェア",
  "wide-seat": "広めの席",
  welcoming: "子連れ歓迎",
  "ok-noisy": "騒いでもOK",
  quiet: "静かめ",
  "parking-free": "無料駐車場",
  "parking-large": "駐車場広い",
  "near-station": "駅近",
  "stroller-ok": "ベビーカーOK",
  "by-road": "道沿い",
  "barrier-free": "バリアフリー",
  elevator: "エレベーター",
  "allergy-support": "アレルギー対応",
  "kids-cut": "子どもカット",
  "online-reserve": "ネット予約",
};

export interface TagFilterSection {
  id: string;
  /** セクション見出し（重要度の高い順） */
  label: string;
  hint?: string;
  tags: TagId[];
}

/**
 * 子連れのお出かけで「先に確認したい順」に並べた設備・条件フィルタ。
 * ホームのクイック絞り込みと /spots の詳細フィルタで共通利用する。
 */
export const TAG_FILTER_SECTIONS: TagFilterSection[] = [
  {
    id: "essentials",
    label: "お出かけの必需品",
    hint: "赤ちゃん連れで最初に確認したい設備",
    tags: ["diaper-table", "nursing-room", "kids-menu"],
  },
  {
    id: "seating",
    label: "席・空間",
    hint: "食事や休憩のときに便利",
    tags: ["kozakai", "private-room", "high-chair", "wide-seat"],
  },
  {
    id: "welcoming",
    label: "子連れ歓迎",
    hint: "雰囲気・受け入れ",
    tags: ["welcoming", "ok-noisy", "quiet"],
  },
  {
    id: "access",
    label: "アクセス・移動",
    hint: "車・電車・ベビーカー",
    tags: [
      "parking-free",
      "parking-large",
      "near-station",
      "stroller-ok",
      "by-road",
    ],
  },
  {
    id: "barrier",
    label: "バリアフリー",
    tags: ["barrier-free", "elevator"],
  },
  {
    id: "other",
    label: "その他",
    tags: ["allergy-support", "kids-cut", "online-reserve"],
  },
];

/** 重要度順のフラットリスト（カード内タグ表示の並び替え用） */
export const PRIORITY_TAG_IDS: TagId[] = TAG_FILTER_SECTIONS.flatMap(
  (section) => section.tags,
);

/** ホームに表示するセクション（必需品 + 子連れ歓迎） */
export const HOME_TAG_FILTER_SECTION_IDS = ["essentials", "welcoming"] as const;

export function getTagFilterShortLabel(tagId: TagId): string {
  return TAG_FILTER_SHORT_LABELS[tagId] ?? tagId;
}

export function sortTagsByPriority(tags: TagId[]): TagId[] {
  const order = new Map(PRIORITY_TAG_IDS.map((id, index) => [id, index]));
  return [...tags].sort(
    (a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999),
  );
}

export function getHomeTagFilterSections(): TagFilterSection[] {
  const ids = new Set<string>(HOME_TAG_FILTER_SECTION_IDS);
  return TAG_FILTER_SECTIONS.filter((section) => ids.has(section.id));
}
