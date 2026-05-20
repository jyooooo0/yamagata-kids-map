/**
 * Google Maps / 公式サイトで照合した庄内エリアの市町村・住所修正を legacy-places.json に適用
 * Usage: node scripts/apply-shonai-municipality-corrections.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY = path.join(__dirname, "../src/data/legacy-places.json");
const LEGACY_COPY = path.join(__dirname, "../legacy/data/places.json");

/** @type {Record<string, Partial<{ municipality: string; name: string; address: string; url: string; mapsUrl: string; description: string; phone: string }>>} */
const CORRECTIONS = {
  izukiku: {
    municipality: "sakata",
    name: "割烹食堂 伊豆菊・寿し処武蔵",
    address: "山形県酒田市中町2-1-20",
    phone: "0234-22-3216",
    url: "https://www.izugiku-musashi.com/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E5%89%B2%E7%80%95%E9%A3%9F%E5%A0%82+%E4%BC%8A%E8%B1%86%E8%8F%8A+%E9%85%92%E7%94%B0%E5%B8%82",
    description:
      "酒田市の老舗割烹。個室や小上がりが多く、落ち着いた和の空間で食事が楽しめます。子連れ向けには個室のほか授乳室を完備。庄内浜の魚介をゆっくり味わえます（旧データの「鶴岡市」表記を修正）。",
  },
  "k-dining": {
    municipality: "shonai",
    name: "K-Dining（香林塔）",
    address: "山形県東田川郡庄内町余目字上朝丸78-2",
    phone: "0234-42-2253",
    url: "https://k-dining.net/karinto/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=K-Dining+%E9%A6%99%E6%9E%97%E5%A1%94+%E5%BA%84%E5%86%85%E7%94%BA",
    description:
      "庄内町余目のログハウス風レストラン（旧・香林塔どうむ）。庄内豚など地元食材の洋食。個室で子連れにも配慮（旧データの「鶴岡市」表記を修正）。",
  },
  "kissa-mariina": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市のぞみ町1-8",
    phone: "0235-24-5802",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E5%96%91%E8%8C%B6%E3%81%BE%E3%82%8A%E3%83%BC%E3%81%AA+%E9%B6%B4%E5%B2%A1",
  },
  "hair-attache": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市のぞみ町8-34",
    phone: "0235-64-1755",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hair+Make+%E3%82%A2%E3%82%BF%E3%83%83%E3%82%B7%E3%83%A5+%E9%B6%B4%E5%B2%A1",
  },
  "fam-hair": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市文園町5-30",
    phone: "0235-23-3404",
    url: "https://www.famhair2021.com/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=fam+hair+%E9%B6%B4%E5%B2%A1",
  },
  "hair-sol": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市羽黒町赤川熊坂112-4",
    phone: "0235-62-4356",
    url: "https://www.hair-design-sol.com/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=HAIR+DESIGN+SOL+%E9%B6%B4%E5%B2%A1",
  },
  "goten-mari": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市本町1-5-36",
    phone: "0235-22-8140",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E4%B8%8A%E9%87%8E%E5%BE%A1%E6%AE%BF%E3%81%BE%E3%82%8A%E6%95%99%E5%AE%A4",
  },
  "yonabe-usagi": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市大半田字北田",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E5%A4%9C%E3%81%AA%E3%81%B9%E3%81%86%E3%81%95%E3%81%8E%E5%B7%A5%E6%88%BF",
  },
  "ramen-tobiko": {
    municipality: "sakata",
    name: "飛来ラーメン 酒田店",
    address: "山形県酒田市広栄町2-111-10",
    phone: "0234-28-8076",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E9%A3%9B%E6%9D%A5%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3+%E9%85%92%E7%94%B0",
    description:
      "酒田市の人気ラーメン店。小上がりや子供用イス、お子様ラーメンあり。旧掲載名「ラーメン飛粉」・鶴岡市表記を、Googleマップ・公式情報に合わせて修正しました。",
  },
  "ramen-mambi": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市日出1-22-8",
    phone: "0235-25-5338",
    url: "https://ramen-manbi.com/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%82%89%E3%80%9C%E3%82%81%E3%82%93%E6%BA%80%E3%81%B3+%E9%B6%B4%E5%B2%A1",
  },
  "wantan-mangetsu": {
    municipality: "sakata",
    name: "ワンタンメンの満月 酒田本店",
    address: "山形県酒田市東中ノ口町2-1",
    phone: "0234-22-0280",
    url: "http://sakata-mangetsu.com/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E3%83%A1%E3%83%B3%E6%BA%80%E6%9C%88+%E9%85%92%E7%94%B0",
    description:
      "酒田本店。鶴岡の庄内観光物産館内店舗は閉店済みのため、酒田本店情報に更新しました（旧「鶴岡店」表記を修正）。",
  },
  "kenchan-tsuruoka": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市大宝寺字中野116-33",
    phone: "0235-25-6616",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%82%B1%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3+%E9%B6%B4%E5%B2%A1",
  },
  "nomikui-hanabi": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市東原町17-17",
    phone: "0235-26-8893",
    url: "https://shonai-yamagata.com/gourmet/hacchi/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%81%AE%E3%81%BF%E3%81%8F%E3%81%84%E5%87%A6+%E3%83%8F%E3%83%8A%E3%83%93+%E9%B6%B4%E5%B2%A1",
  },
  "washoku-takitaro": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市錦町8-30",
    phone: "0235-24-8780",
    url: "https://takitaro.co.jp/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E6%BB%9E%E5%A4%AA%E9%83%8E+%E9%B6%B4%E5%B2%A1",
  },
  "kappa-zushi-tsuruoka": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市東新斎町1-3",
    phone: "0235-29-1051",
    url: "https://www.kappasushi.jp/shop/0574",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%81%8B%E3%81%A3%E3%81%B1%E5%AF%BF%E5%8F%B8+%E9%B6%B4%E5%B2%A1%E5%BA%97",
  },
  "grand-elsan": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市東原町17-7",
    phone: "0235-24-4639",
    url: "https://www.cafe-east.net/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%82%A8%E3%83%AB%E3%82%B5%E3%83%B3+%E9%B6%B4%E5%B2%A1",
  },
  "yakitori-zubora": {
    municipality: "tsuruoka",
    address: "山形県鶴岡市神明町12-41",
    phone: "0235-23-6349",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E7%84%BC%E9%B3%A5%E3%81%A5%E3%81%BC%E3%82%89+%E9%B6%B4%E5%B2%A1",
  },
  esumall: {
    municipality: "tsuruoka",
    address: "山形県鶴岡市錦町2-21 エスモール2F",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%82%A8%E3%82%B9%E3%83%A2%E3%83%BC%E3%83%AB+%E9%B6%B4%E5%B2%A1",
  },
  tachibanaya: {
    municipality: "tsuruoka",
    address: "山形県鶴岡市湯温海字湯田77",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%E3%81%9F%E3%81%A1%E3%81%B0%E3%81%AA%E3%82%84+%E9%B6%B4%E5%B2%A1",
  },
};

function applyCorrections(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let count = 0;
  for (const place of data.places) {
    const patch = CORRECTIONS[place.id];
    if (!patch) continue;
    Object.assign(place, patch);
    count += 1;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  return count;
}

const n1 = applyCorrections(LEGACY);
const n2 = applyCorrections(LEGACY_COPY);
console.log(`Applied ${Object.keys(CORRECTIONS).length} correction definitions.`);
console.log(`Updated ${n1} places in src/data/legacy-places.json`);
console.log(`Updated ${n2} places in legacy/data/places.json`);
