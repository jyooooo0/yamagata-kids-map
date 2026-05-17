/**
 * docs/SPOTS_BY_MUNICIPALITY.md を legacy-places.json から生成する。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "src", "data", "legacy-places.json");
const outPath = path.join(root, "docs", "SPOTS_BY_MUNICIPALITY.md");

const labels = {
  tsuruoka: "鶴岡市",
  sakata: "酒田市",
  mikawa: "三川町",
  shonai: "庄内町（東田川郡）",
  yuza: "遊佐町",
  other: "その他",
};

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

/** @type {Record<string, unknown[]>} */
const by = {};
for (const p of data.places) {
  if (!p.name) continue;
  const m = p.municipality || "tsuruoka";
  (by[m] ||= []).push(p);
}

const order = ["tsuruoka", "sakata", "mikawa", "shonai", "yuza", "other"];

let md = `# スポット掲載一覧（市町別）

2026年時点の静的データ（\`src/data/legacy-places.json\`）に基づき、各スポットの **municipality** を整理した一覧です。

- 行政区域は山形県の市町情報および各施設の所在地表記と照合しています。
- **庄内空港**・**温海・湯温海**・**羽黒**・**大山**・**湯野浜**・**戸沢**・**鼠ヶ関** などは、現行行政区画では **鶴岡市** に属します（\`kyukamura-shonai\` の「庄内」は施設ブランドであり、東田川郡庄内町ではありません）。
- **イオンモール三川** は **東田川郡三川町**（\`mikawa\`）。
- **昭美館（shobikan）** は **東田川郡庄内町**（\`shonai\`）。住所に「鶴岡市」がなくても \`東田川郡庄内町\` であれば町域として正しく分類されています。
- **酒田市**・**遊佐町** に該当する掲載は現データではありません（追加時は住所に「酒田市」「遊佐町」を含めるか、JSON で \`municipality\` を明示）。

`;

for (const code of order) {
  const list = by[code];
  if (!list?.length) continue;
  const label =
    labels[/** @type {keyof typeof labels} */ (code)] ?? labels.other;
  md += `## ${label} (\`${code}\`) — ${list.length}件\n\n`;
  md += "| ID | スポット名 | 住所（データ上） |\n| --- | --- | --- |\n";
  for (const x of list) {
    const addr = String(x.address ?? "").replace(/\|/g, "｜");
    md += `| \`${x.id}\` | ${x.name} | ${addr || "―"} |\n`;
  }
  md += "\n";
}

fs.writeFileSync(outPath, md);
console.log("Wrote", outPath);
