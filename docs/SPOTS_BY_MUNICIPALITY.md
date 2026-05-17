# スポット掲載一覧（市町別）

2026年時点の静的データ（`src/data/legacy-places.json`）に基づき、各スポットの **municipality** を整理した一覧です。

- 行政区域は山形県の市町情報および各施設の所在地表記と照合しています。
- **庄内空港**・**温海・湯温海**・**羽黒**・**大山**・**湯野浜**・**戸沢**・**鼠ヶ関** などは、現行行政区画では **鶴岡市** に属します（`kyukamura-shonai` の「庄内」は施設ブランドであり、東田川郡庄内町ではありません）。
- **イオンモール三川** は **東田川郡三川町**（`mikawa`）。
- **昭美館（shobikan）** は **東田川郡庄内町**（`shonai`）。住所に「鶴岡市」がなくても `東田川郡庄内町` であれば町域として正しく分類されています。
- **酒田市**・**遊佐町** に該当する掲載は現データではありません（追加時は住所に「酒田市」「遊佐町」を含めるか、JSON で `municipality` を明示）。

## 鶴岡市 (`tsuruoka`) — 60件

| ID | スポット名 | 住所（データ上） |
| --- | --- | --- |
| `izukiku` | ニュー割烹食堂 伊豆菊 | 山形県鶴岡市 |
| `k-dining` | K-Dining | 山形県鶴岡市（旧・香林塔どうむ） |
| `kissa-mariina` | 喫茶まりーな | 山形県鶴岡市 |
| `uotei-okazaki` | 魚亭 岡ざき | 山形県鶴岡市美咲町2-46 |
| `hikawa-cafe` | 日和田カフェ 北極光 | 山形県鶴岡市日和田町21-37 |
| `chitto-motche` | 足湯カフェ Chitto Motche | 山形県鶴岡市湯温海甲170 |
| `yunohama-kitchen` | ゆのはま100年キッチン | 山形県鶴岡市湯野浜1-8-43 |
| `kotohiraso` | 中華そば処 琴平荘 | 山形県鶴岡市三瀬己381-46 旅館琴平荘 |
| `omatsuga` | 大松家 | 山形県鶴岡市水沢行司免43-13 |
| `sutamina-taru` | すたみな太郎 鶴岡店 | 山形県鶴岡市ほなみ町10-18 |
| `pisolino` | ピソリーノ 鶴岡インター店 | 山形県鶴岡市美咲町27-32 |
| `starbucks-tsuruoka` | スターバックス 鶴岡店 | 山形県鶴岡市上畑町3-30 |
| `kids-dome-sorai` | KIDS DOME SORAI（バーンフュージョン ソライ） | 山形県鶴岡市美咲町1-1 |
| `hiroppia` | 鶴岡市中央児童館（ひろっぴあ） | 山形県鶴岡市馬場町2-1 |
| `manma-room` | 子育て広場 まんまルーム | 山形県鶴岡市末広町3-1 マリカ東館3階 |
| `kamo-aquarium` | 鶴岡市立加茂水族館 | 山形県鶴岡市今泉字大久保657-1 |
| `oyama-jidoukan` | 大山児童館 | 山形県鶴岡市大山 |
| `nakayoshi-hiroba` | なかよし広場（にこふる） | 山形県鶴岡市家中新町 子ども家庭支援センター内 |
| `namco-small` | namco S-MALL店 | 山形県鶴岡市錦町2-21 S-MALL内 |
| `tachibanaya` | たちばなや | 山形県鶴岡市湯温海（あつみ温泉） |
| `kyukamura-shonai` | 休暇村 庄内羽黒 | 山形県鶴岡市羽黒町手向字手向7 |
| `suiden-terrace` | スイデンテラス（SHONAI HOTEL SUIDEN TERRASSE） | 山形県鶴岡市北京田字下鳥ノ巣23-1 |
| `yunose-ryokan` | 湯の瀬旅館 | 山形県鶴岡市戸沢字神子谷103-2 |
| `yunohama-onsen` | 湯野浜温泉（各所） | 山形県鶴岡市湯野浜温泉 |
| `hair-attache` | Hair Make アタッシュ | 山形県鶴岡市 |
| `fam-hair` | fam hair | 山形県鶴岡市 |
| `hair-sol` | HAIR DESIGN SOL | 山形県鶴岡市 |
| `lib-main` | 鶴岡市立図書館（本館） | 山形県鶴岡市家中新町14-7 |
| `lib-kushibiki` | 鶴岡市立図書館 櫛引分館 | 山形県鶴岡市櫛引字鶴岡田1 |
| `lib-asahi` | 鶴岡市立図書館 朝日分館 | 山形県鶴岡市朝日町 |
| `lib-atsumi` | 鶴岡市立図書館 温海分館 | 山形県鶴岡市温海戊577-1 |
| `lib-haguro` | 鶴岡市立図書館 羽黒分館 | 山形県鶴岡市羽黒町手向 |
| `matsugaoka-you` | 松ヶ岡窯 | 山形県鶴岡市羽黒町松ヶ岡字松ヶ岡25・28・29 |
| `craft-matsugaoka` | くらふと松ヶ岡「こぅでらいね」 | 山形県鶴岡市羽黒町松ヶ岡 |
| `goten-mari` | 上野御殿まり教室 | 山形県鶴岡市 |
| `yonabe-usagi` | 夜なべうさぎ工房 | 山形県鶴岡市 |
| `chido-museum` | 致道博物館 | 山形県鶴岡市家中新町10-18 |
| `nanbu-koen` | 鶴岡南部公園 | 山形県鶴岡市ほなみ町 |
| `oyama-koen` | 大山公園 | 山形県鶴岡市大山3丁目 |
| `haguro-yama` | 羽黒山（石段詣） | 山形県鶴岡市羽黒町手向 |
| `hiroppia-koen` | 児童遊園（ひろっぴあ） | 山形県鶴岡市馬場町2-1 中央児童館隣接 |
| `atsumi-bara` | あつみ温泉バラ公園 | 山形県鶴岡市湯温海甲63 |
| `nezugaseki-camp` | 鼠ヶ関キャンプ場 | 山形県鶴岡市鼠ケ関字興屋地先 |
| `esumall` | エスモール（2F） | 山形県鶴岡市錦町2-21 2F |
| `nishimatsuya` | 西松屋 鶴岡店 | 山形県鶴岡市美咲町3-15 |
| `bernard-tsuruoka` | ベルナール 鶴岡 | 山形県鶴岡市ほなみ町 |
| `shonai-airport` | 庄内空港（2F） | 山形県鶴岡市浜中字岡曽根根123 |
| `ramen-tobiko` | ラーメン飛粉 | 山形県鶴岡市 |
| `ramen-furin-kazan` | ラーメン風林火山 鶴岡本店 | 山形県鶴岡市宝田3-20-16 |
| `ramen-mambi` | らーめん満び | 山形県鶴岡市 |
| `wantan-mangetsu` | ワンタンメンの満月 鶴岡店 | 山形県鶴岡市 |
| `kenchan-tsuruoka` | ケンチャンラーメン 鶴岡店 | 山形県鶴岡市 |
| `nomikui-hanabi` | のみくい処 ハナビ | 山形県鶴岡市 |
| `irohani-tsuruoka` | いろはにほへと 鶴岡駅前店 | 山形県鶴岡市末広町（鶴岡駅前） |
| `washoku-takitaro` | 和定食 滝太郎 | 山形県鶴岡市 |
| `osteria-lupo` | Osteria Lupo（オステリア ルーポ） | 山形県鶴岡市末広町 マリカ駐車場ビル内 |
| `nozomi-cafe-nanairo` | のぞみカフェnanairo | 山形県鶴岡市北茅原町5-54 |
| `kappa-zushi-tsuruoka` | かっぱ寿司 鶴岡店 | 山形県鶴岡市 |
| `grand-elsan` | グランドエルサン（Cafe East） | 山形県鶴岡市東原町17-7 |
| `yakitori-zubora` | 焼鳥づぼら本店 | 山形県鶴岡市 |

## 三川町 (`mikawa`) — 1件

| ID | スポット名 | 住所（データ上） |
| --- | --- | --- |
| `aeon-mikawa` | イオンモール三川 | 山形県東田川郡三川町大字猪子字和田庫128-1 |

## 庄内町（東田川郡） (`shonai`) — 1件

| ID | スポット名 | 住所（データ上） |
| --- | --- | --- |
| `shobikan` | 昭美館 | 山形県東田川郡庄内町 |

