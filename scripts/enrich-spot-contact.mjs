/**
 * スポットの電話・公式URL・Googleマップ（座標または検索URL）を一括更新
 * Usage: node scripts/enrich-spot-contact.mjs [--write]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LEGACY = path.join(ROOT, "src/data/legacy-places.json");
const LEGACY_COPY = path.join(ROOT, "legacy/data/places.json");
const OFFICIAL = path.join(ROOT, "src/data/official-kanko-kids-seeds.json");

function mapsSearch(name, address) {
  const q = [name, address].filter(Boolean).join(" ").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function mapsLatLng(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * @type {Record<string, { phone?: string; url?: string; mapsUrl?: string; lat?: number; lng?: number; address?: string; hours?: string; closed?: string; description?: string; name?: string; municipality?: string }>}
 */
const CONTACT = {
  izukiku: {
    municipality: "sakata",
    name: "割烹食堂 伊豆菊・寿し処武蔵",
    address: "山形県酒田市中町2-1-20",
    phone: "0234-22-3216",
    url: "https://www.izugiku-musashi.com/",
    lat: 38.9142,
    lng: 139.8398,
  },
  "k-dining": {
    municipality: "shonai",
    name: "K-Dining（香林塔）",
    address: "山形県東田川郡庄内町余目字上朝丸78-2",
    phone: "0234-42-2253",
    url: "https://k-dining.net/karinto/",
    lat: 38.8441,
    lng: 139.9038,
  },
  "kissa-mariina": {
    address: "山形県鶴岡市のぞみ町1-8",
    phone: "0235-24-5802",
    lat: 38.7358,
    lng: 139.8489,
  },
  "uotei-okazaki": {
    address: "山形県鶴岡市美咲町2-46",
    phone: "0235-25-0086",
    url: "https://www.sakanatei-okazaki.com/",
    lat: 38.7486,
    lng: 139.8485,
  },
  "hikawa-cafe": {
    address: "山形県鶴岡市日和田町21-37",
    phone: "0235-64-1311",
    url: "https://shonai-yamagata.com/detail/240/",
    lat: 38.7369,
    lng: 139.8642,
  },
  "chitto-motche": {
    address: "山形県鶴岡市湯温海甲170",
    phone: "0235-43-4390",
    url: "https://chittomotche.com/",
    lat: 38.7812,
    lng: 139.7756,
  },
  "yunohama-kitchen": {
    address: "山形県鶴岡市湯野浜1-8-43",
    phone: "0235-35-0280",
    url: "https://yunohama100.jp/",
    lat: 38.8638,
    lng: 139.8234,
  },
  kotohiraso: {
    address: "山形県鶴岡市三瀬己381-46 旅館琴平荘",
    phone: "0235-73-3230",
    lat: 38.8012,
    lng: 139.7123,
  },
  omatsuga: {
    address: "山形県鶴岡市水沢行司免43-13",
    phone: "0235-35-4041",
    lat: 38.7589,
    lng: 139.7891,
  },
  "sutamina-taru": {
    address: "山形県鶴岡市ほなみ町10-18",
    phone: "0235-25-5529",
    url: "https://www.sutamina-ya.com/",
    lat: 38.7312,
    lng: 139.8412,
  },
  pisolino: {
    address: "山形県鶴岡市美咲町27-32",
    phone: "0235-64-1414",
    closed: "2021年1月閉店",
    description:
      "菜園ブッフェのイタリアン（2021年1月閉店）。掲載は参考情報です。営業再開・別店舗利用時は公式でご確認ください。",
    lat: 38.7491,
    lng: 139.8512,
  },
  "starbucks-tsuruoka": {
    address: "山形県鶴岡市上畑町3-30",
    phone: "0235-29-9755",
    url: "https://www.starbucks.co.jp/store/store_info.php?id=1048",
    lat: 38.7348,
    lng: 139.8368,
  },
  "kids-dome-sorai": {
    address: "山形県鶴岡市美咲町1-1",
    phone: "0235-26-8801",
    url: "https://www.sorai.shonai.inc/",
    lat: 38.7489,
    lng: 139.8482,
  },
  hiroppia: {
    address: "山形県鶴岡市馬場町2-1",
    phone: "0235-24-4608",
    url: "https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate02hiroppia.html",
    lat: 38.7275,
    lng: 139.8265,
  },
  "manma-room": {
    address: "山形県鶴岡市末広町3-1 マリカ東館3階",
    phone: "0235-24-5635",
    url: "https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate01manma.html",
    lat: 38.7278,
    lng: 139.8258,
  },
  "kamo-aquarium": {
    address: "山形県鶴岡市今泉字大久保657-1",
    phone: "0235-33-3036",
    url: "https://kamo-kurage.jp/",
    lat: 38.7626,
    lng: 139.8249,
  },
  "oyama-jidoukan": {
    address: "山形県鶴岡市大山3丁目",
    phone: "0235-62-2111",
    url: "https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate01zidoukan.html",
    lat: 38.7356,
    lng: 139.9234,
  },
  "nakayoshi-hiroba": {
    address: "山形県鶴岡市家中新町 子ども家庭支援センター内",
    phone: "0235-24-2841",
    url: "https://www.city.tsuruoka.lg.jp/kyoiku/kosodate/kosodate.html",
    lat: 38.7282,
    lng: 139.8268,
  },
  "namco-small": {
    address: "山形県鶴岡市錦町2-21 S-MALL 2F",
    url: "https://www.namco.co.jp/",
    lat: 38.7289,
    lng: 139.8278,
  },
  tachibanaya: {
    address: "山形県鶴岡市湯温海字湯田77",
    phone: "0235-43-2611",
    url: "https://www.tachibanaya.com/",
    lat: 38.7815,
    lng: 139.7762,
  },
  "kyukamura-shonai": {
    address: "山形県鶴岡市羽黒町手向字手向7",
    phone: "0235-62-4270",
    url: "https://www.qkamura.or.jp/shonai/",
    lat: 38.7296,
    lng: 139.9486,
  },
  "suiden-terrace": {
    address: "山形県鶴岡市北京田字下鳥ノ巣23-1",
    phone: "0235-62-8000",
    url: "https://www.suiden-terrasse.jp/",
    lat: 38.7189,
    lng: 139.9512,
  },
  "yunose-ryokan": {
    address: "山形県鶴岡市戸沢字神子谷103-2",
    phone: "0235-35-1111",
    url: "https://www.yunose-ryokan.jp/",
    lat: 38.7523,
    lng: 139.8012,
  },
  "yunohama-onsen": {
    address: "山形県鶴岡市湯野浜温泉",
    url: "https://www.city.tsuruoka.lg.jp/kanko/spot/yunohama.html",
    lat: 38.8641,
    lng: 139.8238,
  },
  "hair-attache": {
    address: "山形県鶴岡市のぞみ町8-34",
    phone: "0235-64-1755",
    url: "https://shonai-yamagata.com/detail/393/",
    lat: 38.7362,
    lng: 139.8495,
  },
  "fam-hair": {
    address: "山形県鶴岡市文園町5-30",
    phone: "0235-23-3404",
    url: "https://www.famhair2021.com/",
    lat: 38.7318,
    lng: 139.8345,
  },
  shobikan: {
    municipality: "shonai",
    address: "山形県東田川郡庄内町余目字町183",
    phone: "0234-42-1423",
    lat: 38.8438,
    lng: 139.9045,
  },
  "hair-sol": {
    address: "山形県鶴岡市羽黒町赤川熊坂112-4",
    phone: "0235-62-4356",
    url: "https://www.hair-design-sol.com/",
    lat: 38.7412,
    lng: 139.9345,
  },
  "lib-main": {
    address: "山形県鶴岡市家中新町14-7",
    phone: "0235-25-2525",
    url: "https://www.city.tsuruoka.lg.jp/tosyokan/",
    lat: 38.7285,
    lng: 139.8272,
  },
  "lib-kushibiki": {
    address: "山形県鶴岡市櫛引字鶴岡田1",
    phone: "0235-25-2525",
    url: "https://www.city.tsuruoka.lg.jp/tosyokan/",
    lat: 38.6989,
    lng: 139.8123,
  },
  "lib-asahi": {
    address: "山形県鶴岡市朝日町",
    phone: "0235-25-2525",
    url: "https://www.city.tsuruoka.lg.jp/tosyokan/",
    lat: 38.6892,
    lng: 139.8456,
  },
  "lib-atsumi": {
    address: "山形県鶴岡市温海戊577-1",
    phone: "0235-43-4411",
    url: "https://www.city.tsuruoka.lg.jp/tosyokan/",
    lat: 38.7818,
    lng: 139.7745,
  },
  "lib-haguro": {
    address: "山形県鶴岡市羽黒町手向",
    phone: "0235-62-2111",
    url: "https://www.city.tsuruoka.lg.jp/tosyokan/",
    lat: 38.7298,
    lng: 139.9492,
  },
  "matsugaoka-you": {
    address: "山形県鶴岡市羽黒町松ヶ岡字松ヶ岡25・28・29",
    phone: "0235-62-4824",
    url: "https://tsuruoka-matsugaoka.jp/",
    lat: 38.7368,
    lng: 139.9456,
  },
  "craft-matsugaoka": {
    address: "山形県鶴岡市羽黒町松ヶ岡",
    phone: "0235-62-4824",
    url: "https://tsuruoka-matsugaoka.jp/",
    lat: 38.7368,
    lng: 139.9456,
  },
  "goten-mari": {
    address: "山形県鶴岡市本町1-5-36",
    phone: "0235-22-8140",
    url: "https://tsurumap.com/seeing/experience/id125/",
    lat: 38.7289,
    lng: 139.8298,
  },
  "yonabe-usagi": {
    address: "山形県鶴岡市大半田字北田",
    phone: "090-2355-5079",
    url: "https://www.jalan.net/kankou/spt_guide000000230546/",
    lat: 38.7512,
    lng: 139.8123,
  },
  "chido-museum": {
    address: "山形県鶴岡市家中新町10-18",
    phone: "0235-22-1199",
    url: "https://www.chido.jp/",
    lat: 38.7279,
    lng: 139.8254,
  },
  "nanbu-koen": {
    address: "山形県鶴岡市ほなみ町",
    url: "https://www.city.tsuruoka.lg.jp/kanko/spot/nanbu.html",
    lat: 38.7315,
    lng: 139.8418,
  },
  "oyama-koen": {
    address: "山形県鶴岡市大山3丁目",
    url: "https://www.city.tsuruoka.lg.jp/kanko/spot/oyama.html",
    lat: 38.7356,
    lng: 139.9234,
  },
  "haguro-yama": {
    address: "山形県鶴岡市羽黒町手向",
    url: "https://www.hagurokanko.jp/",
    lat: 38.7372,
    lng: 139.9498,
  },
  "hiroppia-koen": {
    address: "山形県鶴岡市馬場町2-1 中央児童館隣接",
    url: "https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate02hiroppia.html",
    lat: 38.7275,
    lng: 139.8265,
  },
  "atsumi-bara": {
    address: "山形県鶴岡市湯温海甲63",
    url: "https://atsumi-spa.or.jp/",
    lat: 38.7812,
    lng: 139.7768,
  },
  "nezugaseki-camp": {
    address: "山形県鶴岡市鼠ケ関字興屋地先",
    url: "https://www.city.tsuruoka.lg.jp/kanko/spot/nezugaseki.html",
    lat: 38.8489,
    lng: 139.7123,
  },
  esumall: {
    address: "山形県鶴岡市錦町2-21 エスモール2F",
    url: "https://www.s-mall.jp/",
    lat: 38.7289,
    lng: 139.8278,
  },
  "nishimatsuya": {
    address: "山形県鶴岡市美咲町3-15",
    phone: "070-3332-1648",
    url: "https://www.24028.jp/tenpo/detail.php?id=24028",
    lat: 38.7495,
    lng: 139.8502,
  },
  "aeon-mikawa": {
    municipality: "mikawa",
    address: "山形県東田川郡三川町大字猪子字和田庫128-1",
    phone: "0234-56-1111",
    url: "https://www.aeon.com/sc/shop/1114/",
    lat: 38.8353,
    lng: 139.8236,
  },
  "bernard-tsuruoka": {
    address: "山形県鶴岡市ほなみ町",
    phone: "0235-25-4150",
    url: "https://www.bernard.co.jp/",
    lat: 38.7318,
    lng: 139.8415,
  },
  "shonai-airport": {
    address: "山形県鶴岡市浜中字岡曽根根123",
    phone: "0235-38-1111",
    url: "https://www.shonai-airport.co.jp/",
    lat: 38.8122,
    lng: 139.7872,
  },
  "ramen-tobiko": {
    municipality: "sakata",
    name: "飛来ラーメン 酒田店",
    address: "山形県酒田市広栄町2-111-10",
    phone: "0234-28-8076",
    lat: 38.9012,
    lng: 139.8456,
  },
  "ramen-furin-kazan": {
    address: "山形県鶴岡市宝田3-20-16",
    phone: "090-2275-5328",
    url: "https://www.mokkedanofoods.com/view/page/hurinkazan_tsuruoka",
    lat: 38.7398,
    lng: 139.8523,
  },
  "ramen-mambi": {
    address: "山形県鶴岡市日出1-22-8",
    phone: "0235-25-5338",
    url: "https://ramen-manbi.com/",
    lat: 38.7389,
    lng: 139.8412,
  },
  "wantan-mangetsu": {
    municipality: "sakata",
    name: "ワンタンメンの満月 酒田本店",
    address: "山形県酒田市東中ノ口町2-1",
    phone: "0234-22-0280",
    url: "http://sakata-mangetsu.com/",
    lat: 38.9145,
    lng: 139.8412,
  },
  "kenchan-tsuruoka": {
    address: "山形県鶴岡市大宝寺字中野116-33",
    phone: "0235-25-6616",
    lat: 38.7512,
    lng: 139.8689,
  },
  "nomikui-hanabi": {
    address: "山形県鶴岡市東原町17-17",
    phone: "0235-26-8893",
    url: "https://shonai-yamagata.com/gourmet/hacchi/",
    lat: 38.7298,
    lng: 139.8312,
  },
  "irohani-tsuruoka": {
    address: "山形県鶴岡市末広町6-2 ちぐさビル1F",
    phone: "0235-29-4535",
    url: "https://www.umai-iroha.jp/shop/%E9%B6%B4%E5%B2%A1%E9%A7%85%E5%89%8D%E5%BA%97/",
    lat: 38.7394,
    lng: 139.8372,
  },
  "washoku-takitaro": {
    address: "山形県鶴岡市錦町8-30",
    phone: "0235-24-8780",
    url: "https://takitaro.co.jp/",
    lat: 38.7282,
    lng: 139.8289,
  },
  "osteria-lupo": {
    address: "山形県鶴岡市末広町15-16 マリカ駐車場ビル1F",
    phone: "0235-33-9600",
    url: "https://osteria-lupo.com/",
    lat: 38.7392,
    lng: 139.8368,
  },
  "nozomi-cafe-nanairo": {
    address: "山形県鶴岡市北茅原町5-53",
    phone: "0235-26-1787",
    lat: 38.7412,
    lng: 139.8456,
  },
  "kappa-zushi-tsuruoka": {
    address: "山形県鶴岡市東新斎町1-3",
    phone: "0235-29-1051",
    url: "https://www.kappasushi.jp/shop/0574",
    lat: 38.7389,
    lng: 139.8398,
  },
  "grand-elsan": {
    address: "山形県鶴岡市東原町17-7",
    phone: "0235-24-4639",
    url: "https://www.cafe-east.net/",
    lat: 38.7298,
    lng: 139.8312,
  },
  "yakitori-zubora": {
    address: "山形県鶴岡市神明町12-41",
    phone: "0235-23-6349",
    lat: 38.7323,
    lng: 139.8334,
  },
};

function applyContact(data) {
  let touched = 0;
  for (const place of data.places) {
    const patch = CONTACT[place.id];
    if (patch) {
      Object.assign(place, patch);
      touched += 1;
    }
    if (!place.mapsUrl?.trim()) {
      if (
        typeof place.lat === "number" &&
        Number.isFinite(place.lat) &&
        typeof place.lng === "number" &&
        Number.isFinite(place.lng)
      ) {
        place.mapsUrl = mapsLatLng(place.lat, place.lng);
      } else if (place.name || place.address) {
        place.mapsUrl = mapsSearch(place.name, place.address);
      }
    }
  }
  return touched;
}

function enrichOfficial(data) {
  let n = 0;
  for (const place of data.places) {
    if (!place.mapsUrl?.trim()) {
      if (place.url) {
        place.mapsUrl = mapsSearch(place.name, place.description?.slice(0, 80));
      } else {
        place.mapsUrl = mapsSearch(place.name);
      }
      n += 1;
    }
  }
  return n;
}

const write = process.argv.includes("--write");
const legacy = JSON.parse(fs.readFileSync(LEGACY, "utf8"));
const legacyCopy = JSON.parse(fs.readFileSync(LEGACY_COPY, "utf8"));
const official = JSON.parse(fs.readFileSync(OFFICIAL, "utf8"));

const t1 = applyContact(legacy);
const t2 = applyContact(legacyCopy);
const t3 = enrichOfficial(official);

const stats = (data) => {
  const total = data.places.length;
  const phone = data.places.filter((p) => p.phone?.trim()).length;
  const url = data.places.filter((p) => p.url?.trim()).length;
  const maps = data.places.filter((p) => p.mapsUrl?.trim()).length;
  const coords = data.places.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number",
  ).length;
  return { total, phone, url, maps, coords };
};

console.log("Legacy before write:", stats(legacy));
console.log("Official maps fill:", t3, "entries");

if (write) {
  official._meta.contactEnrichedAt = new Date().toISOString();
  fs.writeFileSync(LEGACY, JSON.stringify(legacy, null, 2) + "\n", "utf8");
  fs.writeFileSync(LEGACY_COPY, JSON.stringify(legacyCopy, null, 2) + "\n", "utf8");
  fs.writeFileSync(OFFICIAL, JSON.stringify(official, null, 2) + "\n", "utf8");
  console.log("Wrote", LEGACY);
  console.log("After:", stats(legacy));
} else {
  console.log("Dry run. Use --write to apply.");
}
