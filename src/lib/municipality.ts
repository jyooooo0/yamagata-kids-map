/**
 * 庄内エリアの市町コード解決。
 * legacy-places は住所表記ゆれがあるため、必要に応じて JSON の municipality を優先する。
 */
import type { MunicipalityCode } from "@/types/spot";

const VALID_CODES = new Set<MunicipalityCode>([
  "tsuruoka",
  "sakata",
  "mikawa",
  "shonai",
  "yuza",
  "other",
]);

/** 住民向け一覧・フォーム用 */
export const MUNICIPALITY_OPTIONS: { code: MunicipalityCode; label: string }[] =
  [
    { code: "tsuruoka", label: "鶴岡市" },
    { code: "sakata", label: "酒田市" },
    { code: "mikawa", label: "三川町" },
    { code: "shonai", label: "庄内町（東田川郡）" },
    { code: "yuza", label: "遊佐町" },
    { code: "other", label: "上記以外（山形県内など）" },
  ];

/** 住所文字列のみから市区町町村を推定（誤検知が少ない順に並べる） */
export function inferMunicipalityFromAddress(
  address: string | undefined,
): MunicipalityCode {
  const a = (address ?? "").trim();
  if (!a) return "tsuruoka";

  if (a.includes("酒田市")) return "sakata";

  /** あつみ温泉・湯野浜などはすべて鶴岡市域。「遊佐」の文字は遊佐町のみで使う */
  if (a.includes("遊佐町")) return "yuza";

  /**
   * 東田川郡三川町。誤って「庄内」を鶴岡に寄せない。
   * （「東田川郡庄内町」には「三川町」という部分文字列が含まれない）
   */
  if (a.includes("三川町")) return "mikawa";

  /** 東田川郡庄内町（県内に「〇〇庄内町」があるため「庄内町」をキーにする） */
  if (a.includes("庄内町")) return "shonai";

  return "tsuruoka";
}

export function parseMunicipalityCode(
  value: unknown,
): MunicipalityCode | null {
  if (typeof value !== "string") return null;
  const v = value.trim() as MunicipalityCode;
  return VALID_CODES.has(v) ? v : null;
}

/** JSON の明示値があれば最優先。なければ住所から推定。 */
export function resolveMunicipality(
  explicit: string | undefined,
  address: string | undefined,
): MunicipalityCode {
  const parsed = parseMunicipalityCode(explicit);
  if (parsed) return parsed;
  return inferMunicipalityFromAddress(address);
}
