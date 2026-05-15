/**
 * 旧 places.json（legacy/data/places.json をコピーした src/data/legacy-places.json）を
 * 新しい Spot 型に変換するレイヤー。
 *
 * Phase 1A の MVP では Firebase（Firestore）への移行前のため、このモジュールが唯一のスポットデータソースになる。
 * Firestore 接続後はこの関数群の内部実装だけを fetchSpotsFromFirestore に差し替える設計（シグネチャは維持）。
 */

import legacyPlacesRaw from "@/data/legacy-places.json";
import type {
  CategoryId,
  MunicipalityCode,
  Spot,
  TagId,
} from "@/types/spot";

interface LegacyPlace {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  closed?: string;
  description?: string;
  categories?: string[];
  primaryCategory?: string;
  category?: string;
  details?: Record<string, unknown>;
  url?: string;
}

interface LegacyData {
  places: LegacyPlace[];
}

const legacyData = legacyPlacesRaw as unknown as LegacyData;

const CATEGORY_REMAP: Record<string, CategoryId> = {
  eat: "food",
  food: "food",
  cafe: "cafe",
  babyStation: "babystation",
  babystation: "babystation",
  playIndoor: "indoor-play",
  playOutdoor: "park",
  aquarium: "aquarium",
  onsen: "onsen",
  beauty: "salon",
  salon: "salon",
  library: "library",
  craft: "craft",
  museum: "museum",
  nature: "nature",
  hospital: "hospital",
};

const VALID_CATEGORY_IDS: ReadonlySet<CategoryId> = new Set<CategoryId>([
  "food",
  "cafe",
  "babystation",
  "indoor-play",
  "park",
  "aquarium",
  "onsen",
  "salon",
  "library",
  "craft",
  "museum",
  "nature",
  "hospital",
]);

function remapCategory(legacyId: string | undefined): CategoryId | null {
  if (!legacyId) return null;
  const mapped = CATEGORY_REMAP[legacyId];
  if (mapped && VALID_CATEGORY_IDS.has(mapped)) return mapped;
  return null;
}

/**
 * 旧 details オブジェクトを新しいタグ配列に変換する。
 * 既知のキーのみ採用し、不明なキーは無視する（ログに残す目的でも安全）。
 */
function detailsToTags(details: Record<string, unknown> | undefined): TagId[] {
  if (!details) return [];
  const tags = new Set<TagId>();

  const addIfTruthy = (value: unknown, tag: TagId) => {
    if (value === true) tags.add(tag);
  };

  addIfTruthy(details.kozakai, "kozakai");
  addIfTruthy(details.koshitsu, "private-room");
  addIfTruthy(details.junyushitsu, "nursing-room");
  addIfTruthy(details.babyChair, "high-chair");
  addIfTruthy(details.kidsMenu, "kids-menu");
  addIfTruthy(details.omutsu, "diaper-table");
  addIfTruthy(details.restSpace, "wide-seat");
  addIfTruthy(details.stroller, "stroller-ok");
  addIfTruthy(details.familyBath, "private-room");
  addIfTruthy(details.kidsSpace, "wide-seat");
  addIfTruthy(details.private, "private-room");

  // parking は文字列フィールド：非空かつ「あり」「広い」「無料」を含むかで分岐
  const parking = details.parking;
  if (typeof parking === "string" && parking.trim().length > 0) {
    const text = parking.trim();
    if (text.includes("無料")) tags.add("parking-free");
    if (text.includes("広") || text.includes("多")) tags.add("parking-large");
    if (
      !text.includes("無料") &&
      !text.includes("広") &&
      !text.includes("多")
    ) {
      // ただ「あり」「駅周辺」等の場合は parking-free をデフォルトで付与
      tags.add("parking-free");
    }
  }

  return Array.from(tags);
}

/**
 * 住所文字列から庄内エリアの市町コードを推定。
 * 鶴岡市が圧倒的多数なのでデフォルトは tsuruoka。
 */
function inferMunicipality(address: string | undefined): MunicipalityCode {
  if (!address) return "tsuruoka";
  if (address.includes("酒田市")) return "sakata";
  if (address.includes("三川町")) return "mikawa";
  if (address.includes("庄内町")) return "shonai";
  if (address.includes("遊佐町")) return "yuza";
  return "tsuruoka";
}

function makeSlug(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function legacyPlaceToSpot(place: LegacyPlace): Spot | null {
  const rawCategories =
    place.categories && place.categories.length > 0
      ? place.categories
      : place.category
        ? [place.category]
        : place.primaryCategory
          ? [place.primaryCategory]
          : [];

  const mappedCategories = rawCategories
    .map(remapCategory)
    .filter((c): c is CategoryId => c !== null);

  if (mappedCategories.length === 0) return null;

  const primary =
    remapCategory(place.primaryCategory) ?? mappedCategories[0];

  return {
    id: place.id,
    slug: makeSlug(place.id),
    name: place.name,
    category: primary,
    categories: Array.from(new Set([primary, ...mappedCategories])),
    primaryCategory: primary,
    municipality: inferMunicipality(place.address),
    address: place.address?.trim() || undefined,
    phone: place.phone?.trim() || undefined,
    hours: place.hours?.trim() || undefined,
    closed: place.closed?.trim() || undefined,
    url: place.url?.trim() || undefined,
    description: place.description?.trim() || undefined,
    tags: detailsToTags(place.details),
    status: "published",
  };
}

let cachedSpots: Spot[] | null = null;

/** すべてのスポット（既存JSONから変換） */
export function getAllSpots(): Spot[] {
  if (cachedSpots) return cachedSpots;
  cachedSpots = legacyData.places
    .map(legacyPlaceToSpot)
    .filter((s): s is Spot => s !== null);
  return cachedSpots;
}

export function getSpotBySlug(slug: string): Spot | undefined {
  return getAllSpots().find((s) => s.slug === slug);
}

export function getSpotsByCategory(category: CategoryId): Spot[] {
  return getAllSpots().filter((s) => s.categories.includes(category));
}

export function getSpotsByMunicipality(code: MunicipalityCode): Spot[] {
  return getAllSpots().filter((s) => s.municipality === code);
}

export function getSpotsByTag(tag: TagId): Spot[] {
  return getAllSpots().filter((s) => s.tags.includes(tag));
}

/** トップページの「注目スポット」用にランダム＆カテゴリ分散ピック */
export function getFeaturedSpots(count = 6): Spot[] {
  const spots = getAllSpots();
  const byCategory = new Map<CategoryId, Spot[]>();
  for (const s of spots) {
    const arr = byCategory.get(s.category) ?? [];
    arr.push(s);
    byCategory.set(s.category, arr);
  }
  const picked: Spot[] = [];
  const categoryIter = Array.from(byCategory.keys());
  let i = 0;
  while (picked.length < count && categoryIter.length > 0) {
    const cat = categoryIter[i % categoryIter.length];
    const list = byCategory.get(cat);
    if (list && list.length > 0) {
      picked.push(list.shift() as Spot);
    } else {
      categoryIter.splice(i % categoryIter.length, 1);
      continue;
    }
    i += 1;
  }
  return picked;
}

/** カテゴリ別の件数（マップ表示やナビのバッジ用） */
export function getCategoryCounts(): Record<CategoryId, number> {
  const counts = {} as Record<CategoryId, number>;
  for (const cat of VALID_CATEGORY_IDS) counts[cat] = 0;
  for (const spot of getAllSpots()) {
    for (const c of spot.categories) counts[c] = (counts[c] ?? 0) + 1;
  }
  return counts;
}
