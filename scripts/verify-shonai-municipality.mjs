/**
 * 庄内5市町の legacy スポットを Nominatim で照合し、市町村の食い違いを検出する。
 * Usage: node scripts/verify-shonai-municipality.mjs [--fix-report]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LEGACY = path.join(ROOT, "src/data/legacy-places.json");

const SHONAI = new Set(["tsuruoka", "sakata", "mikawa", "shonai", "yuza"]);
const CITY_TO_CODE = {
  鶴岡市: "tsuruoka",
  酒田市: "sakata",
  三川町: "mikawa",
  庄内町: "shonai",
  遊佐町: "yuza",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function inferFromNominatim(displayName) {
  for (const [city, code] of Object.entries(CITY_TO_CODE)) {
    if (displayName.includes(city)) return code;
  }
  if (displayName.includes("東田川郡")) {
    if (displayName.includes("三川")) return "mikawa";
    if (displayName.includes("庄内")) return "shonai";
  }
  return null;
}

async function geocode(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("countrycodes", "jp");
  url.searchParams.set("limit", "3");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "yamagata-kids-map-municipality-verify/1.0 (local dev)",
    },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  return res.json();
}

const data = JSON.parse(fs.readFileSync(LEGACY, "utf8"));
const targets = data.places.filter((p) => SHONAI.has(p.municipality || "tsuruoka"));

const mismatches = [];
const enriched = [];

for (const p of targets) {
  const query = p.address?.includes("山形県")
    ? `${p.name} ${p.address}`
    : `${p.name} 山形県${p.municipality === "mikawa" ? "三川町" : p.municipality === "shonai" ? "庄内町" : p.municipality === "sakata" ? "酒田市" : "鶴岡市"}`;

  await sleep(1100);
  let results;
  try {
    results = await geocode(query);
  } catch (e) {
    console.error("FAIL", p.id, e.message);
    continue;
  }

  const hit = results[0];
  if (!hit) {
    console.log("NO_HIT", p.id, p.name);
    continue;
  }

  const inferred = inferFromNominatim(hit.display_name);
  const current = p.municipality || "tsuruoka";
  const row = {
    id: p.id,
    name: p.name,
    current,
    inferred,
    query,
    display_name: hit.display_name,
    lat: hit.lat,
    lon: hit.lon,
  };
  enriched.push(row);

  if (inferred && inferred !== current) {
    mismatches.push(row);
    console.log("MISMATCH", JSON.stringify(row, null, 0));
  } else {
    console.log("OK", p.id, inferred || "?", hit.display_name.slice(0, 80));
  }
}

const outDir = path.join(ROOT, "scripts/output");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "shonai-municipality-verify.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), mismatches, enriched }, null, 2),
);
console.log("\nMismatches:", mismatches.length);
console.log("Wrote scripts/output/shonai-municipality-verify.json");
