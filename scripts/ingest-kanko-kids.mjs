/**
 * 県公式観光サイト「やまがたへの旅」テーマ kids の一覧ページを巡回し、
 * attractions/festivals の詳細ページからタイトル・概要を取得して seeds JSON を書き出す。
 *
 * Usage:
 *   node scripts/ingest-kanko-kids.mjs           # stdout にプレビュー（冒頭のみ）
 *   node scripts/ingest-kanko-kids.mjs --write   # src/data/official-kanko-kids-seeds.json へ保存
 *
 * 写真は取得しない（サイト側の権利・容量のため）。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_JSON = path.join(ROOT, "src/data/official-kanko-kids-seeds.json");

const UA =
  "yamagata-kids-map-ingest/1.0 (+https://github.com/jyooooo0/yamagata-kids-map)";

/** sitemap と整合した一覧 URL（ページ番号のみ変化） */
function listingUrl(page) {
  return `https://yamagatakanko.com/theme/kids/index_${page}_0__________.html`;
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function decodeHtmlEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) =>
      String.fromCodePoint(Number.parseInt(n, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(Number.parseInt(h, 16)),
    );
}

/** Legacy primaryCategory 文字列へ（places.ts の CATEGORY_REMAP と整合） */
function guessCategory(titleText, detailKind) {
  const t = titleText;
  if (/水族館|動物園|クラゲ/i.test(t)) return "aquarium";
  if (/いちご|さくらんぼ|ぶどう|りんご|果樹|もぎとり|収穫体験|フルーツ|野菜狩り/i.test(t))
    return "craft";
  if (/温泉|かまくら|スパ|足湯/i.test(t)) return "onsen";
  if (/公園|遊具|アスレチック|広場/i.test(t)) return "park";
  if (/室内遊戯|児童館|キッズ|プレイ/i.test(t)) return "playIndoor";
  if (/スキー|ゴンドラ|リフト|高原/i.test(t)) return "playOutdoor";
  if (/舟下り|カヌー|ラフティング|遊覧船|バス\s*in/i.test(t)) return "playOutdoor";
  if (/キャンプ|バーベキュー|BBQ/i.test(t)) return "playOutdoor";
  if (/花火|フェス|祭|イベント|芋煮会/i.test(t)) return "museum";
  if (/博物館|美術館|資料館|科学館/i.test(t)) return "museum";
  if (detailKind === "festivals") return "museum";
  return "craft";
}

function guessMunicipality(text) {
  const pairs = [
    ["鶴岡市", "tsuruoka"],
    ["酒田市", "sakata"],
    ["三川町", "mikawa"],
    ["庄内町", "shonai"],
    ["遊佐町", "yuza"],
  ];
  for (const [jp, code] of pairs) {
    if (text.includes(jp)) return code;
  }
  return "other";
}

async function fetchHtml(url, label = "") {
  const ctrl = AbortSignal.timeout(25_000);
  const r = await fetch(url, {
    headers: {
      "user-agent": UA,
      accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    },
    signal: ctrl,
  });
  if (!r.ok) throw new Error(`${label || url}: HTTP ${r.status}`);
  return r.text();
}

/** 一覧ページから詳細 URL を一意抽出 */
function extractDetailUrls(html) {
  const set = new Set();
  const re = /\/(attractions|festivals)\/detail_(\d+)\.html/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    set.add(`https://yamagatakanko.com/${m[1]}/detail_${m[2]}.html`);
  }
  return [...set];
}

async function collectAllDetailUrls(maxListingPages = 80) {
  const all = new Set();
  for (let page = 1; page <= maxListingPages; page++) {
    const url = listingUrl(page);
    let html;
    try {
      html = await fetchHtml(url, `listing ${page}`);
    } catch (e) {
      console.warn(String(e.message ?? e));
      break;
    }
    const batch = extractDetailUrls(html);
    if (batch.length === 0) {
      console.log(`listing page ${page}: 0 links — stop`);
      break;
    }
    let added = 0;
    for (const u of batch) {
      if (!all.has(u)) {
        all.add(u);
        added++;
      }
    }
    console.log(`listing page ${page}: +${added} new (${all.size} total)`);
    await sleep(220);
  }
  return [...all];
}

async function detailUrlToPlace(url) {
  const html = await fetchHtml(url, url.slice(-40));
  await sleep(180);

  const titleRaw =
    html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  const title = decodeHtmlEntities(titleRaw);
  const name =
    title.split(/[｜|]/)[0]?.trim()?.replace(/\s+/g, " ") || "名称未取得";

  let description =
    decodeHtmlEntities(
      html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]
        ?.trim() ?? "",
    ) || "";

  description = description.replace(/\s+/g, " ").slice(0, 880);

  const detailKind = url.includes("/festivals/") ? "festivals" : "attractions";
  const num = url.match(/detail_(\d+)/)?.[1] ?? "0";
  const id = `kanko-${detailKind}-${num}`;
  const category = guessCategory(name + description, detailKind);
  const municipality = guessMunicipality(title + description);

  const footer =
    "※開催・料金・アクセスはリンク先のやまがたへの旅（公式）でご確認ください（当サイトからの自動取り込み・写真なし）。";

  return {
    id,
    name,
    municipality,
    description: description ? `${description}\n\n${footer}` : footer,
    categories: [category],
    primaryCategory: category,
    details: {},
    url,
  };
}

async function main() {
  const write = process.argv.includes("--write");
  console.log("Collecting listing URLs…");
  const urls = await collectAllDetailUrls();
  console.log(`Unique detail URLs: ${urls.length}`);

  const places = [];
  let i = 0;
  for (const u of urls) {
    i++;
    try {
      places.push(await detailUrlToPlace(u));
      if (i % 25 === 0) console.log(`  fetched ${i}/${urls.length}`);
    } catch (e) {
      console.warn(`SKIP ${u}: ${String(e.message ?? e)}`);
    }
  }

  const payload = {
    _meta: {
      sourceTheme: "https://yamagatakanko.com/theme/kids/",
      listingPattern: "/theme/kids/index_{page}_0__________.html",
      generatedAt: new Date().toISOString(),
      count: places.length,
      note: "自動生成。著作権は各公式サイトに帰属。詳細本文はリンク先を正としてください。",
    },
    places,
  };

  if (write) {
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log("Wrote", OUT_JSON);
  } else {
    console.log(JSON.stringify({ ...payload, places: places.slice(0, 3) }, null, 2));
    console.log(`… (${places.length} places total; use --write for full file)`);
  }
}

await main();
