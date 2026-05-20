/**
 * official-kanko-kids-seeds.json の市町村を名称・概要から再推定
 * Usage: node scripts/enrich-official-seeds.mjs [--write]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEEDS = path.join(ROOT, "src/data/official-kanko-kids-seeds.json");

const MUNICIPALITIES = [
  { code: "tsuruoka", matchers: ["鶴岡市"] },
  {
    code: "sakata",
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
  { code: "mikawa", matchers: ["三川町", "東田川郡三川"] },
  { code: "shonai", matchers: ["庄内町", "東田川郡庄内"] },
  { code: "yuza", matchers: ["遊佐町"] },
  { code: "yamagata", matchers: ["山形市"] },
  { code: "kaminoyama", matchers: ["上山市"] },
  { code: "tendo", matchers: ["天童市"] },
  { code: "sagae", matchers: ["寒河江市"] },
  { code: "higashine", matchers: ["東根市"] },
  { code: "murayama-shi", matchers: ["村山市"] },
  { code: "obanazawa", matchers: ["尾花沢市"] },
  { code: "kahoku", matchers: ["河北町"] },
  { code: "nishikawa", matchers: ["西川町"] },
  { code: "asahi", matchers: ["朝日町", "東村山郡朝日"] },
  { code: "oe", matchers: ["大江町", "西村山郡大江"] },
  { code: "nakayama", matchers: ["中山町", "東村山郡中山"] },
  { code: "yamanobe", matchers: ["山辺町", "東村山郡山辺"] },
  { code: "oishida", matchers: ["大石田町"] },
  { code: "shinjo", matchers: ["新庄市"] },
  { code: "mogami", matchers: ["最上町", "最上郡最上"] },
  { code: "tozawa", matchers: ["戸沢村", "最上郡戸沢"] },
  { code: "kaneyama", matchers: ["金山町", "最上郡金山"] },
  { code: "sakegawa", matchers: ["鮭川村", "最上郡鮭川"] },
  { code: "funagata", matchers: ["舟形町", "最上郡舟形"] },
  { code: "okura", matchers: ["大蔵村", "最上郡大蔵"] },
  { code: "mamurogawa", matchers: ["真室川町", "最上郡真室川"] },
  { code: "yonezawa", matchers: ["米沢市"] },
  { code: "nagai", matchers: ["長井市", "ながい百秋湖", "長井ダム"] },
  { code: "nanyo", matchers: ["南陽市"] },
  { code: "takahata", matchers: ["高畠町", "東置賜郡高畠"] },
  { code: "kawanishi", matchers: ["川西町", "東置賜郡川西"] },
  { code: "oguni", matchers: ["小国町", "西置賜郡小国"] },
  { code: "shirataka", matchers: ["白鷹町", "西置賜郡白鷹"] },
  { code: "iide", matchers: ["飯豊町", "西置賜郡飯豊", "白川湖"] },
];

const SORTED = [...MUNICIPALITIES].sort(
  (a, b) =>
    Math.max(...b.matchers.map((x) => x.length)) -
    Math.max(...a.matchers.map((x) => x.length)),
);

function infer(text) {
  for (const m of SORTED) {
    for (const kw of m.matchers) {
      if (text.includes(kw)) return m.code;
    }
  }
  return "other";
}

const write = process.argv.includes("--write");
const data = JSON.parse(fs.readFileSync(SEEDS, "utf8"));
const stats = {};

for (const p of data.places) {
  const text = [p.name, p.description, p.address].filter(Boolean).join(" ");
  const next = infer(text);
  stats[next] = (stats[next] ?? 0) + 1;
  p.municipality = next;
}

data._meta.municipalityEnrichedAt = new Date().toISOString();
console.log("Municipality distribution:", stats);
console.log("other count:", stats.other ?? 0);

if (write) {
  fs.writeFileSync(SEEDS, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("Wrote", SEEDS);
} else {
  console.log("Dry run — use --write to save");
}
