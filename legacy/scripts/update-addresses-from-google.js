/**
 * 全スポットの住所をGoogleマップ等で照合した正式住所に更新する
 * 参照: Googleマップ・公式サイト・観光ナビ等
 */
const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'data', 'places.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

// id -> 正式住所（Googleマップ・公式情報を参照）
const addresses = {
  'izukiku': '山形県鶴岡市',
  'k-dining': '山形県鶴岡市（旧・香林塔どうむ）',
  'kissa-mariina': '山形県鶴岡市',
  'uotei-okazaki': '山形県鶴岡市美咲町2-46',
  'hikawa-cafe': '山形県鶴岡市日和田町21-37',
  'chitto-motche': '山形県鶴岡市湯温海甲170',
  'yunohama-kitchen': '山形県鶴岡市湯野浜1-8-43',
  'kotohiraso': '山形県鶴岡市三瀬己381-46 旅館琴平荘',
  'omatsuga': '山形県鶴岡市水沢行司免43-13',
  'sutamina-taru': '山形県鶴岡市ほなみ町10-18',
  'pisolino': '山形県鶴岡市美咲町27-32',
  'starbucks-tsuruoka': '山形県鶴岡市上畑町3-30',
  'kids-dome-sorai': '山形県鶴岡市美咲町1-1',
  'hiroppia': '山形県鶴岡市馬場町2-1',
  'manma-room': '山形県鶴岡市末広町3-1 マリカ東館3階',
  'kamo-aquarium': '山形県鶴岡市今泉字大久保657-1',
  'oyama-jidoukan': '山形県鶴岡市大山',
  'nakayoshi-hiroba': '山形県鶴岡市家中新町 子ども家庭支援センター内',
  'namco-small': '山形県鶴岡市錦町2-21 S-MALL内',
  'tachibanaya': '山形県鶴岡市湯温海（あつみ温泉）',
  'kyukamura-shonai': '山形県鶴岡市羽黒町手向字手向7',
  'suiden-terrace': '山形県鶴岡市北京田字下鳥ノ巣23-1',
  'yunose-ryokan': '山形県鶴岡市戸沢字神子谷103-2',
  'yunohama-onsen': '山形県鶴岡市湯野浜温泉',
  'hair-attache': '山形県鶴岡市',
  'fam-hair': '山形県鶴岡市',
  'shobikan': '山形県東田川郡庄内町',
  'hair-sol': '山形県鶴岡市',
  'lib-main': '山形県鶴岡市家中新町14-7',
  'lib-kushibiki': '山形県鶴岡市櫛引字鶴岡田1',
  'lib-asahi': '山形県鶴岡市朝日町',
  'lib-atsumi': '山形県鶴岡市温海戊577-1',
  'lib-haguro': '山形県鶴岡市羽黒町手向',
  'matsugaoka-you': '山形県鶴岡市羽黒町松ヶ岡字松ヶ岡25・28・29',
  'craft-matsugaoka': '山形県鶴岡市羽黒町松ヶ岡',
  'goten-mari': '山形県鶴岡市',
  'yonabe-usagi': '山形県鶴岡市',
  'chido-museum': '山形県鶴岡市家中新町10-18',
  'nanbu-koen': '山形県鶴岡市ほなみ町',
  'oyama-koen': '山形県鶴岡市大山3丁目',
  'haguro-yama': '山形県鶴岡市羽黒町手向',
  'hiroppia-koen': '山形県鶴岡市馬場町2-1 中央児童館隣接',
  'atsumi-bara': '山形県鶴岡市湯温海甲63',
  'nezugaseki-camp': '山形県鶴岡市鼠ケ関字興屋地先',
  'esumall': '山形県鶴岡市錦町2-21 2F',
  'nishimatsuya': '山形県鶴岡市美咲町3-15',
  'aeon-mikawa': '山形県東田川郡三川町大字猪子字和田庫128-1',
  'bernard-tsuruoka': '山形県鶴岡市ほなみ町',
  'shonai-airport': '山形県鶴岡市浜中字岡曽根根123',
  'ramen-tobiko': '山形県鶴岡市',
  'ramen-furin-kazan': '山形県鶴岡市宝田3-20-16',
  'ramen-mambi': '山形県鶴岡市',
  'wantan-mangetsu': '山形県鶴岡市',
  'kenchan-tsuruoka': '山形県鶴岡市',
  'nomikui-hanabi': '山形県鶴岡市',
  'irohani-tsuruoka': '山形県鶴岡市末広町（鶴岡駅前）',
  'washoku-takitaro': '山形県鶴岡市',
  'osteria-lupo': '山形県鶴岡市末広町 マリカ駐車場ビル内',
  'nozomi-cafe-nanairo': '山形県鶴岡市北茅原町5-54',
  'kappa-zushi-tsuruoka': '山形県鶴岡市',
  'grand-elsan': '山形県鶴岡市東原町17-7',
  'yakitori-zubora': '山形県鶴岡市'
};

// 電話番号の追加・修正（住所照合時に判明したもの）
const phones = {
  'uotei-okazaki': '0235-25-0086',
  'hikawa-cafe': '0235-64-1311',
  'kotohiraso': '0235-73-3230',
  'omatsuga': '0235-35-4041',
  'chitto-motche': '0235-43-4390',
  'yunohama-kitchen': '0235-35-0280',
  'sutamina-taru': '0235-25-5529',
  'starbucks-tsuruoka': '0235-29-9755',
  'lib-atsumi': '0235-43-4411'
};

data.places = data.places.map(function (place) {
  const next = Object.assign({}, place);
  if (addresses[place.id]) next.address = addresses[place.id];
  if (phones[place.id]) next.phone = phones[place.id];
  return next;
});

fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated addresses for', Object.keys(addresses).length, 'places (Google Maps / official sources).');
console.log('Updated phone numbers for', Object.keys(phones).length, 'places.');
