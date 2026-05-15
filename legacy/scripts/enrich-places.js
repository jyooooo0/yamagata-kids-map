/**
 * data/places.json の各スポットに url を追加し、
 * 住所・電話・公式サイト・紹介文を充実させる
 */
const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'data', 'places.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

const enrich = {
  'manma-room': {
    address: '山形県鶴岡市末広町3-1 マリカ東館3階（鶴岡駅前）',
    url: 'https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate01manma.html',
    description: '主に0～3歳の未就学児と保護者が利用できる自由来館型の子育て広場。年齢別の遊びスペース、絵本コーナー、ボールプール、滑り台のほか、授乳室・おむつ交換台・親子サロン（飲食可・電子レンジ完備）を完備。絵本は1人2冊まで2週間借りられます。子育て講座や栄養相談も実施。鶴岡駅から徒歩約3～5分、駐車場3時間無料。'
  },
  'kamo-aquarium': {
    address: '山形県鶴岡市今泉字大久保657-1',
    phone: '0235-33-3036',
    url: 'https://kamo-kurage.jp/',
    description: 'クラゲの展示種類数でギネス認定。庄内の海の生きものや「ひれあしの時間」、裏側見学など体験プログラムも豊富。授乳室・オムツ替え台ありで乳幼児連れでも安心。全年齢楽しめる人気施設。※増築・改修に伴う臨時休館あり。詳細は公式サイトでご確認ください。'
  },
  'hiroppia': {
    address: '山形県鶴岡市馬場町2-1（鶴岡駅前・マリカ向かい）',
    url: 'https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate02hiroppia.html',
    description: '幼児遊び室、プレイルーム、巨大な屋外遊園を備えた鶴岡市中央児童館。0～18歳まで利用可能。行事が多く、弁当持参で一日中過ごせる滞在型施設。授乳室・おむつ交換台・休憩スペースあり。無料。'
  },
  'kids-dome-sorai': {
    address: '山形県鶴岡市美咲町1-1',
    phone: '0235-26-8801',
    url: 'https://www.sorai.shonai.inc/',
    description: '建築家・坂茂氏設計の全天候型児童施設。大型アスレチック「アソビバ」と工作・アートの「ツクルバ」を併設。庄内地域在住の中学生以下は「ソライ子育て応援フリーパス」で利用料無料。授乳室・オムツ替え台あり。水曜休館（祝日除く）。'
  },
  'chido-museum': {
    address: '山形県鶴岡市家中新町10-18',
    phone: '0235-22-1199',
    url: 'https://www.chido.jp/',
    description: '鶴岡公園西隣。旧庄内藩主・酒井家の御用屋敷跡にあり、国指定重要文化財の旧西田川郡役所・旧鶴岡警察署庁舎・旧渋谷家住宅など歴史的建造物を移築展示。子どもから大人まで歴史に触れられる。入館料：一般1,000円、小中生300円。水曜・年末年始休館。'
  },
  'lib-main': {
    address: '山形県鶴岡市家中新町14-7',
    phone: '0235-25-2525',
    url: 'https://www.city.tsuruoka.lg.jp/tosyokan/',
    description: '本館2階に郷土資料館を併設。おはすい・おはどん（週2回）、おはちび（0～2歳・月2回）など乳幼児向けおはなし会や、幼児・小学生向けの読み聞かせ・手遊びを実施。月曜・祝日・年末年始休館。'
  },
  'lib-kushibiki': {
    address: '山形県鶴岡市櫛引字鶴岡田1',
    url: 'https://www.city.tsuruoka.lg.jp/tosyokan/',
    description: 'おはなしひろば（毎月第3土曜）で絵本、紙芝居、人形劇などを実施。幼児から楽しめる。'
  },
  'lib-asahi': {
    address: '山形県鶴岡市朝日町',
    url: 'https://www.city.tsuruoka.lg.jp/tosyokan/',
    description: 'おはなし会（毎月第2土曜）。地域ボランティアによる読み聞かせで、絵本の世界を楽しめます。'
  },
  'lib-atsumi': {
    address: '山形県鶴岡市温海地域',
    url: 'https://www.city.tsuruoka.lg.jp/tosyokan/',
    description: '七夕・クリスマスなど季節のイベントに合わせたおはなし会を開催。温海地域の子どもたちの読書の拠点です。'
  },
  'lib-haguro': {
    address: '山形県鶴岡市羽黒地域',
    url: 'https://www.city.tsuruoka.lg.jp/tosyokan/',
    description: 'おはなし会（奇数月の第3土曜）。羽黒地域で絵本や読み聞かせを楽しめます。'
  },
  'matsugaoka-you': {
    address: '山形県鶴岡市羽黒町松ヶ岡字松ヶ岡25・28・29',
    phone: '0235-62-4824',
    url: 'https://tsuruoka-matsugaoka.jp/',
    description: '松ヶ岡開墾場内の貯桑土蔵を利用した陶芸教室。手びねり・電動ろくろ・絵付け・タイル体験など要予約。子どもから大人まで参加可能。水曜休（祝日は翌平日）、年末年始休業。'
  },
  'craft-matsugaoka': {
    address: '山形県鶴岡市羽黒町松ヶ岡',
    url: 'https://tsuruoka-matsugaoka.jp/',
    description: '松ヶ岡開墾場（クラフトパーク）内。まゆ細工、木の実細工など多彩なクラフト体験が可能。明治期の建築の中でものづくりを楽しめます。要予約・問い合わせ。'
  },
  'nanbu-koen': {
    address: '山形県鶴岡市ほなみ町（鶴岡南部公園）',
    description: '大型遊具、多目的コート、噴水広場を備えた広い公園。多目的トイレ内にオムツ替えシート完備。ベビーカーで散策しやすく、休日は家族連れでにぎわいます。'
  },
  'oyama-koen': {
    address: '山形県鶴岡市大山',
    description: '四季の自然が楽しめる公園。ハイキングコースや広場があり、トイレ・駐車場（6箇所）完備。ベビーカーはコースにより難しい場合あり。'
  },
  'hiroppia-koen': {
    address: '山形県鶴岡市馬場町2-1 中央児童館隣接',
    description: '約8,859㎡の児童遊園。ツリーハウスや親水公園があり、中央児童館（ひろっぴあ）と合わせて一日中遊べます。トイレ・駐車場あり。'
  },
  'nakayoshi-hiroba': {
    address: '山形県鶴岡市家中新町 子ども家庭支援センター内',
    url: 'https://www.city.tsuruoka.lg.jp/kyoiku/kosodate/kosodate.html',
    description: '未就学児と保護者が気軽に利用できる広場。子育て相談窓口と一体化しており、育児の相談も可能。授乳室・おむつ交換台あり。無料。'
  },
  'kyukamura-shonai': {
    address: '山形県鶴岡市羽黒町手向字手向7',
    url: 'https://www.qkamura.or.jp/shonai/',
    description: '羽黒山麓の休暇村。大浴場にベビーチェア、ステップやおねしょマット・枕などベビー備品が充実。クラフトコーナーなど子ども向けプログラムも。家族でのんびり過ごせます。'
  },
  'suiden-terrace': {
    address: '山形県鶴岡市北京田字下鳥ノ巣23-1',
    url: 'https://www.suiden-terrasse.jp/',
    description: '田んぼに浮かぶデザインホテル。知育玩具・絵本完備の「ソライルーム」や、KIDS DOME SORAIとの連携プランが豊富。乳幼児連れの滞在に配慮された設備が充実。'
  },
  'tachibanaya': {
    address: '山形県鶴岡市鶴岡字湯田77（あつみ温泉）',
    url: 'https://www.tachibanaya.com/',
    description: 'ウェルカムベビー認定宿。ベビーソープ・ベッド・専用客室のほか、貸切展望露天風呂が1回無料。あつみ温泉で子連れに人気の宿です。'
  },
  'yunohama-onsen': {
    address: '山形県鶴岡市湯野浜温泉',
    description: '夏は海水浴、冬は日本海の景色を楽しめる温泉街。各宿で家族風呂やベビー対応を用意している施設が多く、リフレッシュに最適。施設ごとに駐車・設備は異なります。'
  },
  'esumall': {
    address: '山形県鶴岡市末広町（鶴岡駅前エスモール2F）',
    description: '赤ちゃんの駅登録。授乳室・オムツ替え・調乳用温湯を完備。買い物の合間に休憩やお世話ができる駅前の拠点です。'
  },
  'shonai-airport': {
    address: '山形県鶴岡市浜中字岡曽根根123',
    url: 'https://www.shonai-airport.co.jp/',
    description: '庄内空港2Fに授乳室・オムツ替えスペースあり。空路利用時の安心拠点として利用できます。'
  },
  'izukiku': {
    address: '山形県鶴岡市',
    description: '庄内浜の新鮮な魚介を味わえる割烹食堂。個室が充実しており、乳幼児連れでも落ち着いて食事ができます。小上がり・授乳室あり。'
  },
  'sutamina-taru': {
    address: '山形県鶴岡市',
    description: 'バイキング形式で家族それぞれの好みに合わせて選べる。オムツ替え台・授乳室・ベビーチェア・キッズメニュー完備で、子連れに人気の定番店です。'
  },
  'starbucks-tsuruoka': {
    address: '山形県鶴岡市',
    url: 'https://www.starbucks.co.jp/',
    description: '授乳やオムツ替えが可能な「赤ちゃんの駅」登録店。コーヒーを飲みながらひと息つける駅周辺の拠点。'
  },
  'namco-small': {
    address: '山形県鶴岡市 S-MALL内',
    description: 'ショッピングモール内のアミューズメント。雨の日の気軽な遊び場として人気。入場無料エリアもあり、全年齢利用可能。'
  },
  'osteria-lupo': {
    address: '山形県鶴岡市末広町 マリカ駐車場ビル内',
    description: '本格イタリアンながら子供用イス・オムツ替え台を完備。10名以上で貸切対応可能。鶴岡駅前で子連れディナーに便利。'
  },
  'ramen-tobiko': {
    address: '山形県鶴岡市',
    description: '小上がりや子供用イスを完備。小盛りのお子様ラーメンもあり、家族連れに配慮した清潔な店内で人気。'
  },
  'kappa-zushi-tsuruoka': {
    address: '山形県鶴岡市',
    url: 'https://www.kappasushi.co.jp/',
    description: '回転寿司チェーン。オムツ替え台（1台）完備で清潔。平日・休日ともに子連れで利用しやすい定番店。ベビーチェア・キッズメニューあり。'
  },
  'grand-elsan': {
    address: '山形県鶴岡市',
    description: '披露宴会場併設の高級感ある空間。個室やキッズメニューが充実し、館内に授乳室あり。子連れの会食やお祝いにも。'
  }
};

data.places = data.places.map(function (place) {
  const id = place.id;
  const add = enrich[id];
  const next = Object.assign({}, place);
  if (!next.url) next.url = '';
  if (add) {
    if (add.address) next.address = add.address;
    if (add.phone !== undefined) next.phone = add.phone;
    if (add.url) next.url = add.url;
    if (add.description) next.description = add.description;
  }
  return next;
});

fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
console.log('Enriched', data.places.length, 'places. URLs/address/description updated for', Object.keys(enrich).length, 'entries.');
