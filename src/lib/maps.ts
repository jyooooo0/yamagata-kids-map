/**
 * Google マップへの外部リンク生成。
 * 旧サイトは「住所があれば検索URL」のみだったため、
 * 住所が市名のみ／未掲載のスポットで地図ボタンが出ない・ピンがズレる問題があった。
 *
 * 優先順位:
 * 1. データに保存した Google マップ共有URL（地点固定に最適）
 * 2. lat / lng（座標検索）
 * 3. 施設名 + 住所をまとめて検索（粗い住所でも店名で解決しやすい）
 */
import type { Spot } from "@/types/spot";

function hasValidLatLng(spot: Spot): boolean {
  return (
    typeof spot.lat === "number" &&
    Number.isFinite(spot.lat) &&
    typeof spot.lng === "number" &&
    Number.isFinite(spot.lng)
  );
}

/** スポットを Google マップで開くための URL。開けない場合は null */
export function getGoogleMapsUrl(spot: Spot): string | null {
  const custom = spot.mapsUrl?.trim();
  if (custom) return custom;

  if (hasValidLatLng(spot)) {
    return `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`;
  }

  const name = spot.name?.trim() ?? "";
  const addr = spot.address?.trim() ?? "";

  const query = [name, addr].filter((s) => s.length > 0).join(" ").trim();
  if (!query) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
