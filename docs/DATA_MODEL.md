# データモデル

Phase 1B 以降に Firestore 上に構築するコレクション設計。
Phase 1A では `src/data/legacy-places.json` をそのまま `src/lib/places.ts` で変換して使う。

## 設計の基本方針

1. **「スポット × タグ」モデル**
   スポットは1つのカテゴリ＋複数タグで表現する。カテゴリ・タグは固定マスタ（運営管理）でクライアント側の `src/lib/categories.ts` にハードコードする。
2. **市町（municipality）で物理的にエリア分離可能**
   将来県全域に拡大しても、絞り込みは `where("municipality", "==", code)` で行ける。
3. **投稿は承認制 → 信頼スコアで自動公開**
   `spots.status` と `users.trustScore` で制御。
4. **行 vs 列の鮮度**
   情報の古さは「最終更新日」「最終口コミ日」「タグ賛同数」で見せる。
5. **Firestore のフラット構造を活かす**
   口コミやタグ投票はサブコレクションではなく、`spotId` を持つトップレベルコレクションとして格納し、複合インデックスで検索する。

---

## コレクション定義

Firestore はスキーマレスなので、ここで定義するのは「保存するときに保たれるべき形」のドキュメント。
TypeScript 側で `src/types/spot.ts` の型と一致させる。

### `spots/{spotId}`

```ts
{
  id: string,                       // ドキュメント ID と一致
  slug: string,                     // URL 用、UNIQUE
  name: string,
  category: CategoryId,             // 一次カテゴリ（'food' 等）
  categories: CategoryId[],         // 複数カテゴリ
  primaryCategory?: CategoryId,
  municipality: MunicipalityCode,   // 'tsuruoka' 等

  address?: string,
  lat?: number,
  lng?: number,

  phone?: string,
  hours?: string,
  closed?: string,
  url?: string,

  description?: string,
  tags: TagId[],                    // 'kozakai', 'nursing-room' 等
  images?: SpotImage[],

  status: "draft" | "published" | "archived",
  createdBy: string | null,         // Firebase Auth uid
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

**必要なインデックス（Firestore Indexes）**

- 単一フィールド：`slug` （UNIQUE は Cloud Functions のトリガーで担保）
- 複合：`status ASC, municipality ASC, updatedAt DESC`
- 複合：`status ASC, category ASC, updatedAt DESC`
- 配列含む：`tags ARRAY_CONTAINS` + `status ASC`（フィルタ用）

### `reviews/{reviewId}`

```ts
{
  id: string,
  spotId: string,
  userId: string,                   // Firebase Auth uid
  rating: number,                   // 1-5
  body: string,
  childAgeMonthsAtVisit?: number,
  images?: SpotImage[],
  createdAt: Timestamp,
}
```

**必要なインデックス**

- 複合：`spotId ASC, createdAt DESC`（スポット詳細での最新口コミ一覧）

### `tagVotes/{voteId}`

スポットへのタグの賛同／非該当投票を 1 ユーザー 1 タグ 1 票で記録。
冪等性のため `voteId` は `${spotId}_${tagId}_${userId}` の決定論的 ID を採用。

```ts
{
  spotId: string,
  tagId: TagId,
  userId: string,
  vote: 1 | -1,                     // 1=該当する / -1=該当しない
  createdAt: Timestamp,
}
```

`spots/{spotId}` の `tags` 配列はクライアントから直接編集せず、Cloud Functions で `tagVotes` を集計して書き戻す（vote 合計が閾値を超えたら追加、下回ったら削除）。

### `subsidies/{subsidyId}`

```ts
{
  id: string,
  municipality: MunicipalityCode,
  title: string,
  summary: string,
  url: string,
  category: "medical" | "childcare" | "birth" | "education" | "housing" | "other",
  targetAgeMinMonths?: number | null,
  targetAgeMaxMonths?: number | null,
  lastVerifiedAt?: Timestamp,       // 運営側の確認ログ
  createdAt: Timestamp,
}
```

**必要なインデックス**

- 複合：`municipality ASC, category ASC, targetAgeMinMonths ASC`

### `users/{uid}`

Firebase Auth の uid をドキュメント ID として、追加情報を持つ。

```ts
{
  uid: string,                      // = Firebase Auth uid
  displayName?: string,
  area?: MunicipalityCode,          // 居住エリア（任意）
  trustScore: number,               // 初期値 0、投稿が承認されるたびに加算
  isModerator: boolean,
  createdAt: Timestamp,
}
```

### `children/{childId}`（Phase 2）

```ts
{
  id: string,
  userId: string,                   // Firebase Auth uid（所有者）
  nickname: string,
  birthday: string,                 // 'YYYY-MM-DD'
  gender?: "boy" | "girl" | "other" | null,
  createdAt: Timestamp,
}
```

**必要なインデックス**

- 単一：`userId`（子ども一覧取得用）

### `ageStageContents/{contentId}`（Phase 2）

```ts
{
  id: string,
  minMonths: number,
  maxMonths: number,
  title: string,
  body: string,                     // Markdown
  relatedCategoryIds: CategoryId[],
  relatedSubsidyIds: string[],
  createdAt: Timestamp,
}
```

### `tagSuggestions/{suggestionId}`

ユーザーから「こういうタグが欲しい」という提案を受け付けるための一時コレクション。
運営側でレビューして、適切なら `src/lib/categories.ts` の固定マスタに追加する。

```ts
{
  id: string,
  label: string,                    // 提案ラベル
  group?: "facility" | "food" | "service" | "vibe" | "location",
  exampleSpotId?: string,
  submittedBy: string,              // Firebase Auth uid
  status: "pending" | "accepted" | "rejected",
  createdAt: Timestamp,
}
```

### `spotSubmissions/{submissionId}`（投稿キュー）

匿名／ログインユーザーからの **`/contribute` フォーム**が作成する運営向けキュー。クライアントは **認証済みのみ `create`** 可、一覧の **read は禁止**（Firebase Console で確認）。

実装済みセキュリティルール：`firebase/firestore.rules`。デプロイ手順は [FIREBASE.md](FIREBASE.md)。

```ts
{
  type: "spot_new" | "spot_correction",
  status: "pending",                // クライアント作成時のみ
  submitterUid: string,           // Firebase Auth uid（匿名可）
  contactEmail: string | null,
  payload: {
    name: string,
    municipality: string,          // MunicipalityCode 相当
    address: string | null,
    officialUrl: string | null,
    categoryHint: string | null,
    body: string,
    correctionTargetSlug?: string | null,
  },
  createdAt: Timestamp,
}
```

---

## Security Rules 方針

基本方針は ARCHITECTURE.md。リポジトリ直下の **`firebase/firestore.rules`** を Firebase CLI でデプロイする（詳細は [FIREBASE.md](FIREBASE.md)）。

要点：

- `spots`: `status == 'published'` は誰でも読める。書き込みは認証必須、更新は本人または管理者のみ。
- `reviews`: 誰でも読める。書き込みは認証ユーザーが自分の `userId` を設定する場合のみ。
- `tagVotes`: 認証ユーザーのみ作成可、`voteId` を決定論的に作ることで 1 ユーザー 1 票を物理的に強制。
- `children`: 本人のみ読み書き可。
- `users`: 本人は自分のドキュメントのみ書き込み可、`trustScore` フィールドは Cloud Functions 経由でのみ更新。

---

## モデレーション

- 新規ユーザー（`trustScore < 10`）の投稿は `status = 'draft'`、運営承認で `'published'`
- 既存ユーザー（`trustScore >= 10`）は即時公開、ただし不適切通報で `'archived'`
- 「最終更新日」「直近の口コミ日付」を UI に明示し、情報鮮度を可視化

---

## Phase 1A → 1B 移行手順

1. Firebase プロジェクトを作成し `.env.local` に設定
2. `firestore.rules`, `firestore.indexes.json` をリポジトリに追加
3. `scripts/seed-firestore.ts` を作成し、`src/data/legacy-places.json` の各レコードを `legacyPlaceToSpot` で変換して Firestore に投入
4. `src/lib/places.ts` の関数本体を Firestore 呼び出しに差し替え（型は維持）
5. ページ側は変更なしで切り替わる
