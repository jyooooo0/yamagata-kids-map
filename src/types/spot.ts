/**
 * スポット（場所）に関する型定義。
 *
 * 将来 Firestore コレクションのドキュメントとして格納するため、
 * 現状の静的データ（legacy/data/places.json）の構造に近い形を保ちつつ、
 * 追加のフィールド（id, slug, municipality など）を盛り込んでいます。
 * 日付フィールドは Firestore Timestamp → ISO 文字列 への変換層を介する想定。
 */

/** 山形県内の市町村コード（庄内5 + 村山14 + 最上8 + 置賜8 + 未特定） */
export type MunicipalityCode =
  | "tsuruoka"
  | "sakata"
  | "mikawa"
  | "shonai"
  | "yuza"
  | "yamagata"
  | "kaminoyama"
  | "tendo"
  | "sagae"
  | "higashine"
  | "murayama-shi"
  | "obanazawa"
  | "kahoku"
  | "nishikawa"
  | "asahi"
  | "oe"
  | "nakayama"
  | "yamanobe"
  | "oishida"
  | "shinjo"
  | "mogami"
  | "tozawa"
  | "kaneyama"
  | "sakegawa"
  | "funagata"
  | "okura"
  | "mamurogawa"
  | "yonezawa"
  | "nagai"
  | "nanyo"
  | "takahata"
  | "kawanishi"
  | "oguni"
  | "shirataka"
  | "iide"
  | "other";

export interface Municipality {
  code: MunicipalityCode;
  name: string;
  area: "shonai" | "murayama" | "mogami" | "okitama";
  kana: string;
}

/** スポットの一次カテゴリ。複数カテゴリを付与する場合は categories 配列を使う */
export type CategoryId =
  | "food"
  | "cafe"
  | "babystation"
  | "indoor-play"
  | "park"
  | "aquarium"
  | "onsen"
  | "salon"
  | "library"
  | "craft"
  | "museum"
  | "nature"
  | "hospital";

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  /** トップページなどでの並び順 */
  order: number;
}

/**
 * 設備・属性タグ。
 * フェーズ1では運営側が固定マスタとして管理する。
 * ユーザーは「該当する」「該当しなくなった」を投票でき、頻出した自由記述は運営が新タグとして追加する想定。
 */
export type TagId =
  // 飲食店・食事系
  | "kozakai" // 小上がり
  | "private-room" // 個室
  | "kids-menu" // キッズメニュー
  | "high-chair" // ベビーチェア / ハイチェア
  | "allergy-support" // アレルギー対応
  | "welcoming" // 子連れウェルカム
  | "ok-noisy" // 騒いでも大丈夫
  // 設備
  | "nursing-room" // 授乳室
  | "diaper-table" // おむつ替え台
  | "stroller-ok" // ベビーカーOK
  | "elevator" // エレベーターあり
  | "barrier-free" // バリアフリー
  // 立地・利便
  | "parking-free" // 無料駐車場
  | "parking-large" // 駐車場広い
  | "near-station" // 駅近
  | "by-road" // 道沿い・立ち寄りやすい
  // サービス
  | "kids-cut" // 子どもカット可
  | "online-reserve" // ネット予約可
  // 雰囲気
  | "quiet" // 静かめ
  | "wide-seat"; // 広めの席

export interface Tag {
  id: TagId;
  label: string;
  /** タグのグループ。UIでセクション分けする */
  group: "facility" | "service" | "vibe" | "location" | "food";
}

export interface SpotImage {
  url: string;
  alt?: string;
  /** クレジット表記（投稿者名等） */
  credit?: string;
}

/** スポット本体 */
export interface Spot {
  id: string;
  slug: string;
  name: string;
  /** 一次カテゴリ（旧 data 互換） */
  category: CategoryId;
  /** 複数カテゴリ（飲食×赤ちゃんの駅 など） */
  categories: CategoryId[];
  primaryCategory?: CategoryId;
  municipality: MunicipalityCode;

  address?: string;
  /** 緯度経度（地図表示用） */
  lat?: number;
  lng?: number;
  /**
   * Google マップの地点URL（共有リンク・/maps/place/ 等）。
   * 公式の正確なピン位置がある場合に JSON から指定する。
   */
  mapsUrl?: string;

  phone?: string;
  hours?: string;
  closed?: string;
  url?: string;

  description?: string;
  /** スポットに付与されたタグ。投票数や直近の更新でランキングできるよう将来拡張予定 */
  tags: TagId[];

  images?: SpotImage[];

  /** 投稿・更新メタ */
  createdAt?: string;
  updatedAt?: string;
  /** Firebase Auth の uid（フェーズ2以降） */
  createdBy?: string | null;
  /** モデレーションステータス */
  status?: "draft" | "published" | "archived";
}

/** ユーザー投稿の口コミ */
export interface Review {
  id: string;
  spotId: string;
  userId: string;
  rating: number; // 1-5
  body: string;
  childAgeMonthsAtVisit?: number;
  images?: SpotImage[];
  createdAt: string;
}

/** 補助制度（市町村別） */
export interface Subsidy {
  id: string;
  municipality: MunicipalityCode;
  title: string;
  /** 対象月齢の下限・上限（null=制限なし） */
  targetAgeMinMonths?: number | null;
  targetAgeMaxMonths?: number | null;
  summary: string;
  url: string;
  /** カテゴリ：医療費・保育・出産・育休・住宅 など */
  category:
    | "medical"
    | "childcare"
    | "birth"
    | "education"
    | "housing"
    | "other";
  /** 最終確認日（運営側の確認ログ） */
  lastVerifiedAt?: string;
}

/** 子どもプロフィール（フェーズ2で使用） */
export interface ChildProfile {
  id: string;
  userId: string;
  nickname: string;
  birthday: string; // YYYY-MM-DD
  /** "boy" | "girl" | "other" | null（任意） */
  gender?: "boy" | "girl" | "other" | null;
}
