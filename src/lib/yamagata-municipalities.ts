/**
 * 山形県 35 市町村 + 4 地域ブロック（庄内・村山・最上・置賜）
 * 公式観光・県子育てサイトの表記に合わせた推定用マスタ
 */
import type { Municipality, MunicipalityCode } from "@/types/spot";

export type YamagataAreaId = Municipality["area"];

export interface YamagataMunicipalityDef extends Municipality {
  /** 住所・タイトル・概要からの推定用（長い順でマッチ） */
  matchers: string[];
}

/** 県内すべて（庄内5 + その他30） */
export const YAMAGATA_MUNICIPALITIES: YamagataMunicipalityDef[] = [
  // 庄内
  { code: "tsuruoka", name: "鶴岡市", kana: "つるおかし", area: "shonai", matchers: ["鶴岡市", "つるおか市"] },
  {
    code: "sakata",
    name: "酒田市",
    kana: "さかたし",
    area: "shonai",
    matchers: [
      "酒田市",
      "酒田港",
      "酒田駅",
      "酒田海洋",
      "酒田の花火",
      "最上川河口",
      "飛島",
      "とびしま",
    ],
  },
  { code: "mikawa", name: "三川町", kana: "みかわまち", area: "shonai", matchers: ["三川町", "東田川郡三川"] },
  { code: "shonai", name: "庄内町", kana: "しょうないまち", area: "shonai", matchers: ["庄内町", "東田川郡庄内"] },
  { code: "yuza", name: "遊佐町", kana: "ゆざまち", area: "shonai", matchers: ["遊佐町"] },
  // 村山
  { code: "yamagata", name: "山形市", kana: "やまがたし", area: "murayama", matchers: ["山形市"] },
  { code: "kaminoyama", name: "上山市", kana: "かみのやまし", area: "murayama", matchers: ["上山市"] },
  { code: "tendo", name: "天童市", kana: "てんどうし", area: "murayama", matchers: ["天童市"] },
  { code: "sagae", name: "寒河江市", kana: "さがえし", area: "murayama", matchers: ["寒河江市"] },
  { code: "higashine", name: "東根市", kana: "ひがしねし", area: "murayama", matchers: ["東根市"] },
  { code: "murayama-shi", name: "村山市", kana: "むらやまし", area: "murayama", matchers: ["村山市"] },
  { code: "obanazawa", name: "尾花沢市", kana: "おばなざわし", area: "murayama", matchers: ["尾花沢市"] },
  { code: "kahoku", name: "河北町", kana: "かほくちょう", area: "murayama", matchers: ["河北町"] },
  { code: "nishikawa", name: "西川町", kana: "にしかわまち", area: "murayama", matchers: ["西川町", "西村山郡西川"] },
  { code: "asahi", name: "朝日町", kana: "あさひまち", area: "murayama", matchers: ["朝日町", "東村山郡朝日"] },
  { code: "oe", name: "大江町", kana: "おおえまち", area: "murayama", matchers: ["大江町", "西村山郡大江"] },
  { code: "nakayama", name: "中山町", kana: "なかやままち", area: "murayama", matchers: ["中山町", "東村山郡中山"] },
  { code: "yamanobe", name: "山辺町", kana: "やまのべまち", area: "murayama", matchers: ["山辺町", "東村山郡山辺"] },
  { code: "oishida", name: "大石田町", kana: "おおいしだまち", area: "murayama", matchers: ["大石田町"] },
  // 最上
  { code: "shinjo", name: "新庄市", kana: "しんじょうし", area: "mogami", matchers: ["新庄市"] },
  { code: "mogami", name: "最上町", kana: "もがみまち", area: "mogami", matchers: ["最上町", "最上郡最上"] },
  { code: "tozawa", name: "戸沢村", kana: "とざわむら", area: "mogami", matchers: ["戸沢村", "最上郡戸沢"] },
  { code: "kaneyama", name: "金山町", kana: "かねやままち", area: "mogami", matchers: ["金山町", "最上郡金山"] },
  { code: "sakegawa", name: "鮭川村", kana: "さけがわむら", area: "mogami", matchers: ["鮭川村", "最上郡鮭川"] },
  { code: "funagata", name: "舟形町", kana: "ふながたまち", area: "mogami", matchers: ["舟形町", "最上郡舟形"] },
  { code: "okura", name: "大蔵村", kana: "おおくらむら", area: "mogami", matchers: ["大蔵村", "最上郡大蔵"] },
  { code: "mamurogawa", name: "真室川町", kana: "まむろがわまち", area: "mogami", matchers: ["真室川町", "最上郡真室川"] },
  // 置賜
  { code: "yonezawa", name: "米沢市", kana: "よねざわし", area: "okitama", matchers: ["米沢市"] },
  { code: "nagai", name: "長井市", kana: "ながいし", area: "okitama", matchers: ["長井市", "ながい百秋湖", "長井ダム"] },
  { code: "nanyo", name: "南陽市", kana: "なんようし", area: "okitama", matchers: ["南陽市"] },
  { code: "takahata", name: "高畠町", kana: "たかはたまち", area: "okitama", matchers: ["高畠町", "東置賜郡高畠"] },
  { code: "kawanishi", name: "川西町", kana: "かわにしまち", area: "okitama", matchers: ["川西町", "東置賜郡川西"] },
  { code: "oguni", name: "小国町", kana: "おぐにまち", area: "okitama", matchers: ["小国町", "西置賜郡小国"] },
  { code: "shirataka", name: "白鷹町", kana: "しらたかまち", area: "okitama", matchers: ["白鷹町", "西置賜郡白鷹"] },
  { code: "iide", name: "飯豊町", kana: "いいでまち", area: "okitama", matchers: ["飯豊町", "西置賜郡飯豊", "白川湖"] },
  { code: "other", name: "県内（市町村未特定）", kana: "", area: "murayama", matchers: [] },
];

/** 長い名称からマッチ（「庄内町」が「庄内」より先） */
const SORTED_FOR_MATCH = [...YAMAGATA_MUNICIPALITIES]
  .filter((m) => m.code !== "other")
  .sort((a, b) => {
    const la = Math.max(...a.matchers.map((x) => x.length), a.name.length);
    const lb = Math.max(...b.matchers.map((x) => x.length), b.name.length);
    return lb - la;
  });

export const YAMAGATA_AREA_LABELS: Record<
  YamagataAreaId,
  { label: string; short: string }
> = {
  shonai: { label: "庄内地方", short: "庄内" },
  murayama: { label: "村山地方", short: "村山" },
  mogami: { label: "最上地方", short: "最上" },
  okitama: { label: "置賜地方", short: "置賜" },
};

const AREA_KEYWORDS: { area: YamagataAreaId; words: string[] }[] = [
  { area: "shonai", words: ["庄内地方", "庄内エリア", "庄内地域"] },
  { area: "murayama", words: ["村山地方", "村山エリア", "村山地域"] },
  { area: "mogami", words: ["最上地方", "最上エリア", "最上地域"] },
  { area: "okitama", words: ["置賜地方", "置賜エリア", "置賜地域"] },
];

export const MUNICIPALITY_MAP: Record<MunicipalityCode, Municipality> =
  Object.fromEntries(
    YAMAGATA_MUNICIPALITIES.map((m) => [m.code, m]),
  ) as unknown as Record<MunicipalityCode, Municipality>;

export const VALID_MUNICIPALITY_CODES = new Set<MunicipalityCode>(
  YAMAGATA_MUNICIPALITIES.map((m) => m.code),
);

export function getMunicipality(code: MunicipalityCode): Municipality | undefined {
  return MUNICIPALITY_MAP[code];
}

export function getAreaForMunicipality(code: MunicipalityCode): YamagataAreaId {
  return MUNICIPALITY_MAP[code]?.area ?? "murayama";
}

export function getMunicipalitiesByArea(area: YamagataAreaId): Municipality[] {
  return YAMAGATA_MUNICIPALITIES.filter((m) => m.area === area && m.code !== "other");
}

/**
 * 名称・住所・概要・公式タイトルから市町村コードを推定
 */
export function inferMunicipalityFromText(
  ...parts: (string | undefined)[]
): MunicipalityCode {
  const text = parts.filter(Boolean).join(" ");
  if (!text.trim()) return "other";

  for (const m of SORTED_FOR_MATCH) {
    for (const kw of m.matchers) {
      if (text.includes(kw)) return m.code;
    }
    if (text.includes(m.name)) return m.code;
  }

  return "other";
}

/** 市町村が特定できないとき、地方名だけから area を推定（other のまま） */
export function inferAreaHintFromText(
  text: string,
): YamagataAreaId | null {
  for (const { area, words } of AREA_KEYWORDS) {
    if (words.some((w) => text.includes(w))) return area;
  }
  return null;
}
