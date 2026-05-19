/**
 * 市町村コードの解決（県内35市町村 + 未特定）
 */
import {
  inferMunicipalityFromText,
  VALID_MUNICIPALITY_CODES,
  YAMAGATA_MUNICIPALITIES,
} from "@/lib/yamagata-municipalities";
import type { MunicipalityCode } from "@/types/spot";

export {
  YAMAGATA_AREA_LABELS,
  YAMAGATA_MUNICIPALITIES,
  getAreaForMunicipality,
  getMunicipalitiesByArea,
  getMunicipality,
  inferAreaHintFromText,
  inferMunicipalityFromText,
} from "@/lib/yamagata-municipalities";

/** 投稿フォーム・管理用（庄内を先頭、other は末尾） */
export const MUNICIPALITY_OPTIONS: { code: MunicipalityCode; label: string }[] =
  YAMAGATA_MUNICIPALITIES.filter((m) => m.code !== "other").map((m) => ({
    code: m.code,
    label: m.name,
  })).concat([{ code: "other", label: "県内（市町村が特定できない）" }]);

export function parseMunicipalityCode(
  value: unknown,
): MunicipalityCode | null {
  if (typeof value !== "string") return null;
  const v = value.trim() as MunicipalityCode;
  return VALID_MUNICIPALITY_CODES.has(v) ? v : null;
}

/** JSON の明示値 → 住所 → 名称などのテキスト推定 */
export function resolveMunicipality(
  explicit: string | undefined,
  address: string | undefined,
  name?: string,
  description?: string,
): MunicipalityCode {
  const parsed = parseMunicipalityCode(explicit);
  if (parsed && parsed !== "other") return parsed;
  const inferred = inferMunicipalityFromText(name, address, description);
  if (inferred !== "other") return inferred;
  if (parsed === "other") return "other";
  return inferMunicipalityFromText(address) ?? "other";
}

/** @deprecated 住所のみ。resolveMunicipality を使用 */
export function inferMunicipalityFromAddress(
  address: string | undefined,
): MunicipalityCode {
  return inferMunicipalityFromText(address);
}
