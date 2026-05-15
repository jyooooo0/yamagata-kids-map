# アーキテクチャ概要

## サービスの目的

山形県、まずは庄内エリアの子育て世帯のために、

1. 子連れで行ける場所
2. 道中で立ち寄れるおむつ替えスペース
3. 病院（小児科・夜間救急）
4. 子どもカット対応の美容室
5. 市町ごとの補助制度
6. 月齢に合わせたパーソナライズ情報

をひとつの場所で見つけられる情報プラットフォームを提供する。

「外出 × 成長 × コミュニティ」のバランス型コンセプトで、Phase 1 では**外出（スポット情報）**を主軸に据える。

## 技術スタック

| レイヤー | 採用技術 | 理由 |
|---------|---------|------|
| フレームワーク | Next.js 16 (App Router) | RSC でデータ取得を最適化、Phase 1A は静的中心・Phase 1B 以降はサーバーアクション／Route Handler で投稿機能 |
| 言語 | TypeScript (strict) | 型安全を最優先、`any` 禁止 |
| スタイル | Tailwind CSS v4 | ユーティリティファースト、`@theme inline` でデザイントークンを CSS で完結 |
| UI 部品 | shadcn/ui (手書き配置) | Radix UI ベースでアクセシブル、Tailwind v4 対応版を手書きで配置 |
| アイコン | lucide-react | 一貫したアイコンセット |
| データベース | Firestore | スキーマレスでスポット・口コミ・補助制度を柔軟に管理。Edge ランタイム互換のクライアント SDK が利用可能 |
| 認証 | Firebase Authentication | メール／Google ログインをネイティブサポート。LINE は Phase 2 で Custom Auth により実装 |
| ストレージ | Firebase Storage | 投稿写真の保存。`firebasestorage.googleapis.com` を `next.config.ts` の remotePatterns に登録済み |
| ホスティング | Cloudflare Pages（Static Export） | `next.config.ts` で `output: "export"`。`out/` をそのまま公開。Phase 1A は Workers アダプタ不要 |
| バージョン管理 | GitHub | リポジトリ：`jyooooo0/yamagata-kids-map` |

### なぜ Firebase なのか（Supabase ではなく）

- Firestore のスキーマレス性が、進化中の MVP のデータモデル変更に強い
- 認証 SDK が成熟しており、Google ログインを最短ステップで導入可能
- Firebase Storage の CDN 配信がそのまま使えて、画像配信の追加インフラ不要
- 無料枠（Spark Plan）で MVP を始めるのに十分

### Cloudflare Pages × Firebase の注意点

- **クライアント SDK のみ使用**：Edge Runtime と互換性のある `firebase/*` モジュラー SDK を使う。`firebase-admin` は Node 専用のため、必要になったら Cloudflare Workers のサービスバインディングや Route Handler を Node Runtime に切る運用にする。
- **Firebase Auth の承認済みドメイン**：Cloudflare Pages の `*.pages.dev` ドメインとカスタムドメインを Firebase Console に登録する必要がある。

## ディレクトリ構成

```
src/
├── app/                       # App Router（ページとレイアウト）
│   ├── layout.tsx             # ルートレイアウト、日本語フォント、ヘッダー/フッター
│   ├── page.tsx               # トップページ
│   ├── globals.css            # Tailwind v4 デザイントークン
│   ├── spots/
│   │   ├── layout.tsx         # メタデータ（page が Client のため）
│   │   ├── page.tsx           # スポット一覧（Client + useSearchParams でフィルタ）
│   │   └── [slug]/page.tsx    # スポット詳細
│   ├── subsidies/page.tsx     # 補助制度
│   └── about/page.tsx         # サービス紹介
├── components/
│   ├── layout/                # サイト全体のレイアウト部品
│   ├── spots/                 # スポット関連 UI
│   └── ui/                    # shadcn/ui 部品
├── data/
│   └── legacy-places.json     # 旧鶴岡市データ（Firestore 移行前の暫定データソース）
├── lib/
│   ├── categories.ts          # カテゴリ・タグ・市町のマスタ
│   ├── places.ts              # legacy データ → Spot 型への変換層
│   ├── firebase.ts            # Firebase クライアント（App / Auth / Firestore / Storage）
│   └── utils.ts               # cn ヘルパー
└── types/
    └── spot.ts                # 主要な型定義
```

## データソースの段階移行

```
Phase 1A (現在)
└─ src/data/legacy-places.json (静的)
   └─ src/lib/places.ts が変換して提供

Phase 1B (近日)
└─ Firestore コレクション "spots"
   └─ src/lib/places.ts の関数シグネチャは変えず、内部実装だけ Firestore 呼び出しに差し替え
```

Phase 1B 移行時、`src/lib/places.ts` の関数（`getAllSpots`, `getSpotBySlug` 等）は同じ型を返したまま、内部で `firebase/firestore` の `getDocs` を呼ぶように変える。これによりページ側のコード変更は最小限。

## レンダリング戦略

| ページ | 戦略 | 理由 |
|--------|------|------|
| `/` | SSG | 静的データなので完全静的化、CDN にキャッシュ |
| `/spots` | Static Export + Client | `useSearchParams` でクエリ反映、共有 URL はそのまま利用可能 |
| `/spots/[slug]` | SSG (`generateStaticParams`) | Static Export で全スポットを事前生成 |
| `/subsidies` | Static Export | 静的コンテンツ |
| `/about` | Static Export | 静的コンテンツ |

ビルド成果物は `out/`。Cloudflare Pages の **Build output directory** は `out`。

Phase 1B 以降の投稿ページ（`/contribute`, `/spots/[slug]/edit` 等）はクライアントから Firestore へ書き込み（`addDoc` / `updateDoc`）する設計とし、引き続き Static Export と両立させる。

## デザインシステム

### カラー（OKLCH ベース）
- **Primary**: テラコッタ／朱（庄内の街並み・夕陽）— `oklch(0.58 0.16 35)`
- **Accent**: 深い苔緑（月山・羽黒の杉）— `oklch(0.5 0.08 145)`
- **Background**: 暖かいクリーム色（米どころ） — `oklch(0.985 0.012 80)`
- ダークモードも完全対応

### フォント
- 本文：Noto Sans JP（400/500/700）
- ディスプレイ：Zen Kaku Gothic New（500/700/900）
- セリフ装飾：Shippori Mincho B1（500/700）
- すべて `next/font/google` でセルフホスト

### ユーティリティ
- `.bg-washi`：和紙テクスチャ風のドットパターン
- `.bg-rice-field`：稲穂のような縦グラデーション

## セキュリティ・プライバシー

- ログインしなくても閲覧可能（匿名アクセス OK）
- 投稿には認証必須（Phase 1B：メール／Google、Phase 2：LINE Custom Auth）
- 子どもの誕生日などの個人情報は Firestore の Security Rules で `request.auth.uid == resource.data.userId` を強制し、本人以外は読み書き不可
- 第三者提供なし、広告掲載料も受け取らない（非営利運営）

### Firestore Security Rules の方針（Phase 1B）

```
service cloud.firestore {
  match /databases/{database}/documents {
    // スポット：公開済みは誰でも読み取り可
    match /spots/{spotId} {
      allow read: if resource.data.status == "published";
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && (resource.data.createdBy == request.auth.uid
          || request.auth.token.admin == true);
    }
    // 口コミ：誰でも読み取り、自分の口コミのみ書き換え
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
    // 子どもプロフィール：本人のみ
    match /children/{childId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

詳細なルールは Phase 1B 着手時に `firestore.rules` ファイルとしてリポジトリに置く。

## Cloudflare Pages デプロイ方針

Phase 1A は `npm run build` で `out/` を生成し、Cloudflare Pages にそのディレクトリを公開する。
Phase 1B 以降も投稿・認証はブラウザから Firebase SDK で行うため、原則として Static Export を継続できる。サーバー専用処理が必要になった時点で `@opennextjs/cloudflare` 等への移行を検討する。

詳細手順は README.md を参照。
