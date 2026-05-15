# 作業中メモ（再開用）

このファイルは作業を中断するたびに更新します。次回はここを最初に読んで再開してください。

最終更新：2026-05-15

---

## プロジェクト概要

**山形県（まず庄内エリア先行）の子育て世帯向け情報プラットフォーム**

既存の鶴岡市版静的サイト（バニラJS）を、Next.js + Firebase の動的サービスに段階移行する。

### コアコンセプト
「外出 × 成長 × コミュニティ」のバランス型。Phase 1 ではまず**外出（スポット情報）**を主軸に。

### 対象機能
1. 子連れで行けるお店リスト（小上がり等のタグ、ユーザー投稿で更新可）
2. おむつ替えスペース（道中ナビ含む）
3. 病院リスト
4. 子どもカット対応美容室
5. 県内の補助制度リンク（市町村別）
6. 子どもの誕生日登録→月齢別パーソナライズ情報

---

## 決定事項

| 項目 | 決定 |
|------|------|
| 戦略 | 案B：既存静的サイトを `legacy/` に退避し、ルートに Next.js + Firebase を構築 |
| 対象エリア | 庄内エリア先行（鶴岡・酒田・三川・庄内・遊佐）→ 後で県全域 |
| フェーズ | Phase 1 MVP を目指す |
| 認証 | Phase 1B: メール + Google、Phase 2: LINE（Custom Auth）。閲覧は匿名OK |
| タグ運用 | 運営側で固定マスタ管理（ユーザー追加不可、`tagSuggestions` で提案受付） |
| 技術 | Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Tailwind v4 対応版を手書き) + **Firebase**（Firestore / Auth / Storage） + Cloudflare Pages |
| デザイン | 山形・庄内の自然をモチーフにした暖色系（テラコッタ × クリーム × 抹茶緑） |

### 当初は Supabase で着手→ Firebase に切替
ユーザー要望により、データ／認証基盤を Supabase から Firebase に変更。
コードは Firebase 化済み、ドキュメントも全面更新済み（このコミットで）。

---

## 現在の進捗

### 完了済み

**基盤・依存**
- [x] 既存リポジトリを `C:\Users\jmfs2\yamagata-kids-map` にクローン
- [x] 既存の静的サイトファイルを `legacy/` に退避
- [x] Next.js 16 (App Router) + TypeScript + Tailwind v4 プロジェクトを初期化
- [x] `package.json` を更新（依存：`firebase`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `zod`, Radix UI 一式）
- [x] `npm install` 完了
- [x] `.gitignore` 統合

**デザインシステム**
- [x] `src/app/globals.css` を山形カラーパレットで再設計（OKLCH、light/dark 両対応、和紙テクスチャ・稲穂グラデーションのユーティリティクラス含む）
- [x] フォント設定：Noto Sans JP + Zen Kaku Gothic New + Shippori Mincho B1（`next/font/google`）

**コンポーネント**
- [x] shadcn/ui 基本コンポーネント（Tailwind v4 対応）：`button`, `card`, `badge`, `separator`
- [x] `components.json` 設置
- [x] `src/lib/utils.ts`（`cn` ヘルパー）
- [x] `src/components/layout/site-header.tsx`（ロゴ + ナビ）
- [x] `src/components/layout/site-footer.tsx`（リンク・運営情報）
- [x] `src/components/spots/spot-card.tsx`
- [x] `src/components/spots/category-icon.tsx`

**データレイヤー**
- [x] `src/types/spot.ts`（Spot, Category, Tag, Municipality, Subsidy, Review, ChildProfile）
- [x] `src/lib/categories.ts`（カテゴリ13個・タグ20個・庄内5市町のマスタ）
- [x] `src/lib/places.ts`（旧 JSON → Spot 型変換層、`getAllSpots` / `getSpotBySlug` 等）
- [x] `src/data/legacy-places.json`（旧データ移植済み）
- [x] `src/lib/firebase.ts`（App / Auth / Firestore / Storage クライアント、env 未設定でも壊れない安全実装、`COLLECTIONS` 定数）

**ページ**
- [x] `src/app/layout.tsx`（ルートレイアウト、メタデータ、OGP、フォント、ヘッダー／フッター）
- [x] `src/app/page.tsx`（トップ：ヒーロー・FeatureBand・カテゴリグリッド・注目スポット・将来機能・投稿CTA）
- [x] `src/app/spots/page.tsx`（カテゴリ・市町フィルタ + スポットリスト）
- [x] `src/app/spots/[slug]/page.tsx`（詳細、`generateStaticParams` で全件SSG）
- [x] `src/app/subsidies/page.tsx`（庄内5市町の制度リンク集）
- [x] `src/app/about/page.tsx`（サービス紹介・ロードマップ・運営方針）

**設定**
- [x] `next.config.ts`（Cloudflare Pages 用：`images.unoptimized`、`remotePatterns` で Firebase Storage / Google ドメイン許可）

**ドキュメント**
- [x] `README.md`（Firebase ベースに全面更新）
- [x] `docs/ARCHITECTURE.md`（Firebase / Firestore ベース、Security Rules 方針含む）
- [x] `docs/DATA_MODEL.md`（Firestore コレクション設計、インデックス、移行手順）
- [x] `docs/ROADMAP.md`（Phase 1A〜4、Firebase セットアップ手順反映）

### 残作業

1. **動作確認**：`npm run dev` / `npm run typecheck` / `npm run build` でビルドエラーや型エラーがないか確認
2. **初回コミット**：ユーザー確認後にコミット＆プッシュ
3. **Phase 1B 着手**：
   - Firebase プロジェクト作成（鶴岡 or 庄内のリージョン推奨）
   - `.env.local` 設定
   - `firestore.rules` / `firestore.indexes.json` をリポジトリに追加
   - `scripts/seed-firestore.ts`（legacy JSON → Firestore 投入）
   - 認証ページ（メール／Google）
   - 投稿フォーム（スポット・口コミ）
   - Cloud Functions（タグ集計・モデレーション通知）

---

## ディレクトリ構成（現状）

```
yamagata-kids-map/
├── docs/
│   ├── ARCHITECTURE.md            ← Firebase 版に更新済み
│   ├── DATA_MODEL.md              ← Firestore コレクション設計
│   ├── ROADMAP.md                 ← Phase 1A〜4
│   ├── WORK_IN_PROGRESS.md        ← このファイル
│   └── ディープリサーチの依頼フォーマット.md
├── legacy/                        ← 旧静的サイト（参照用に保管）
│   ├── data/places.json
│   ├── scripts/
│   ├── app.js
│   ├── index.html
│   ├── styles.css
│   └── favicon.svg
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── globals.css            ← 山形カラーパレット
│   │   ├── layout.tsx             ← フォント・メタデータ
│   │   ├── page.tsx               ← トップページ
│   │   ├── spots/
│   │   │   ├── page.tsx           ← 一覧 (SSR)
│   │   │   └── [slug]/page.tsx    ← 詳細 (SSG)
│   │   ├── subsidies/page.tsx     ← 補助制度
│   │   └── about/page.tsx         ← サービス紹介
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-header.tsx
│   │   │   └── site-footer.tsx
│   │   ├── spots/
│   │   │   ├── spot-card.tsx
│   │   │   └── category-icon.tsx
│   │   └── ui/
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── separator.tsx
│   ├── data/
│   │   └── legacy-places.json
│   ├── lib/
│   │   ├── categories.ts          ← マスタ
│   │   ├── firebase.ts            ← Firebase クライアント
│   │   ├── places.ts              ← データ変換層
│   │   └── utils.ts               ← cn
│   └── types/
│       └── spot.ts                ← 主要な型
├── .gitignore
├── AGENTS.md                      ← Next.js create-app が生成
├── components.json                ← shadcn 設定
├── next-env.d.ts
├── next.config.ts                 ← Cloudflare Pages 対応、Firebase Storage 許可
├── package.json
├── postcss.config.mjs
├── README.md                      ← Firebase 版に更新済み
└── tsconfig.json
```

---

## カテゴリ／タグの設計メモ

### カテゴリ（13個、`src/lib/categories.ts`）
food / cafe / babystation / indoor-play / park / **hospital（新規追加）** / salon / library / craft / aquarium / museum / nature / onsen

### 旧→新カテゴリIDマッピング
| 旧 | 新 |
|----|----|
| eat | food |
| cafe | cafe |
| babyStation | babystation |
| playIndoor | indoor-play |
| playOutdoor | park |
| aquarium | aquarium |
| onsen | onsen |
| beauty | salon |
| library | library |
| craft | craft |
| museum | museum |
| nature | nature |

### 旧 details フラグ → 新 tags ID マッピング
| 旧 details キー | 新 tag ID |
|----------------|-----------|
| kozakai: true | kozakai |
| koshitsu: true | private-room |
| junyushitsu: true | nursing-room |
| babyChair: true | high-chair |
| kidsMenu: true | kids-menu |
| omutsu: true | diaper-table |
| parking: 非空文字列 | parking-free（"広""多"なら parking-large 追加） |

---

## 環境変数（Phase 1B で設定）

`.env.local` に以下を設定する（Firebase プロジェクト作成後）：

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxxxxxxxx:web:xxxxxxxxxxx
```

未設定のままでも `npm run dev` は動く（`src/lib/firebase.ts` の `isFirebaseConfigured()` で安全に分岐、現状の Phase 1A は静的データのみで完結）。

---

## 再開コマンド

```bash
cd C:\Users\jmfs2\yamagata-kids-map
npm run dev          # 開発サーバー
npm run typecheck    # 型チェック
npm run build        # ビルド
```

PowerShell 実行ポリシーで npm がブロックされる場合：
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
npm run dev
```

---

## 重要：未コミット状態

現在の作業は **すべて未コミット** です。本人の確認が取れてからコミット・プッシュを行います。

### 初回コミット案

```
feat: scaffold Next.js 16 + Firebase MVP for Shonai childcare map

- Move existing static site to legacy/
- Initialize Next.js App Router with TypeScript and Tailwind v4
- Add shadcn/ui (button, card, badge, separator) tailored to Tailwind v4
- Define Yamagata/Shonai-inspired OKLCH color palette
- Set up master data (13 categories, 20 tags, 5 Shonai municipalities)
- Scaffold Firebase client (app/auth/firestore/storage) with safe fallback
- Implement Spot type and legacy JSON → Spot conversion layer
- Build home, spots list, spot detail, subsidies, about pages
- Configure next.config for Cloudflare Pages + Firebase Storage images
- Add architecture/data-model/roadmap docs
```

### コミット時のチェック

- [ ] `npm run typecheck` がパスする
- [ ] `npm run build` が完走する
- [ ] `.env.local` がコミットに含まれていない（`.gitignore` で除外済み）
