# やまがた子育てマップ

山形県・庄内エリアの子育て世帯のための情報プラットフォーム。
子連れで行ける場所、おむつ替えスペース、病院、子どもカット対応の美容室、補助制度を、
地域でアップデートしていく地図サービス。

> Phase 1A 開発中。Cloudflare Pages へのデプロイで MVP 公開を目指します。

---

## 機能

- **スポット一覧**：13カテゴリ × 庄内5市町 × 設備・サービスのタグで絞り込み
- **スポット詳細**：住所・電話・営業時間・設備タグ、Googleマップ・公式サイト連携
- **補助制度**：庄内5市町（鶴岡・酒田・三川・庄内・遊佐）の制度リンク集
- **サービス紹介**：コンセプト、ロードマップ、運営方針

### 近日公開（Phase 1B / Phase 2）

- ユーザー投稿（スポット追加・口コミ・写真・タグ）
- メール / Google ログイン（Phase 1B）／ LINE ログイン（Phase 2、Custom Auth で実装）
- 子どもの誕生日登録 → 月齢別パーソナライズ
- ルート上のおむつ替えスポット検索

詳細は [docs/ROADMAP.md](docs/ROADMAP.md) を参照。

---

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript (strict)
- **スタイル**: Tailwind CSS v4 + shadcn/ui（手書き配置）
- **アイコン**: lucide-react
- **データ／認証**: Firebase
  - **Firestore**: スポット・口コミ・補助制度・子どもプロフィール
  - **Firebase Authentication**: メール／Google／（Phase 2 で LINE Custom Auth）
  - **Firebase Storage**: 投稿写真
- **ホスティング**: Cloudflare Pages
- **バージョン管理**: GitHub

詳細は [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)、[docs/DATA_MODEL.md](docs/DATA_MODEL.md) を参照。

---

## 開発を始める

### 必要環境

- Node.js 20+ （推奨: 24 系）
- npm 10+

### セットアップ

```bash
git clone https://github.com/jyooooo0/yamagata-kids-map.git
cd yamagata-kids-map
npm install
```

Windows PowerShell で `npm` がブロックされる場合：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```

### 開発サーバー

```bash
npm run dev
```

→ http://localhost:3000

### 型チェック

```bash
npm run typecheck
```

### ビルド

```bash
npm run build
```

---

## 環境変数

Firebase に接続する場合のみ、プロジェクトルートに `.env.local` を作成：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxxxxxxxx:web:xxxxxxxxxxx
```

Phase 1A では未設定でも動作します（`src/lib/places.ts` が静的データを返すため）。
`src/lib/firebase.ts` の `isFirebaseConfigured()` で安全にフォールバックします。

### Firebase プロジェクトの作成（Phase 1B〜）

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成
2. **Build** → **Authentication** → **Sign-in method** で「メール／パスワード」「Google」を有効化
3. **Build** → **Firestore Database** → ロケーションは `asia-northeast1`（東京）を推奨
4. **Build** → **Storage** → 同じく `asia-northeast1` で有効化
5. **Project settings** → **General** → **Your apps** → **Web app** を追加し、`firebaseConfig` を取得
6. 上記の値を `.env.local` に転記

---

## ディレクトリ構成

```
yamagata-kids-map/
├── docs/                       # 設計ドキュメント
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── ROADMAP.md
│   └── WORK_IN_PROGRESS.md
├── legacy/                     # 旧静的サイト（参照用）
│   └── data/places.json        # 旧データソース
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx            # トップ
│   │   ├── layout.tsx
│   │   ├── globals.css         # デザイントークン
│   │   ├── spots/              # スポット一覧・詳細
│   │   ├── subsidies/          # 補助制度
│   │   └── about/              # サービス紹介
│   ├── components/
│   │   ├── layout/             # SiteHeader / SiteFooter
│   │   ├── spots/              # SpotCard / CategoryIcon
│   │   └── ui/                 # shadcn 部品
│   ├── data/legacy-places.json # 暫定データソース
│   ├── lib/
│   │   ├── categories.ts       # マスタ
│   │   ├── places.ts           # 旧JSON → Spot 変換層
│   │   ├── firebase.ts         # Firebase クライアント
│   │   └── utils.ts
│   └── types/spot.ts
├── components.json             # shadcn 設定
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Cloudflare Pages へのデプロイ

### 初回セットアップ

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. `jyooooo0/yamagata-kids-map` を選択
3. ビルド設定（**Static Export**：`next.config.ts` で `output: "export"` を指定済み）：
   - **Framework preset**: **`None` に必ずする**（「Next.js」を選ぶと `@cloudflare/next-on-pages` 系の前提になり、このリポジトリの **`out/` 静的出力と一致せず、デプロイ後に HTTP 404 になることがあります**）
   - **Root directory**: `/`（空のまま）。モノレポでない限りサブフォルダを指定しない
   - **Build command**: `npm run build`
   - **Build output directory**: **`out`**（先頭スラッシュなし・小文字。`.next` や `.vercel/output/static` にしない）
   - **Node version**: `20` 以上（環境変数 `NODE_VERSION=20`。リポジトリ直下の `.node-version` にも `20` を記載済み）
   - **メモ**：ビルドがメモリ不足で落ちる場合は Cloudflare の環境変数に  
     `NODE_OPTIONS=--max-old-space-size=8192` を追加（`package.json` の `build` でも同様に指定済み）
4. **ヒント**：ホーム直下に別の `package-lock.json` があると Next が workspace root を誤検知することがあります。不要なら親フォルダの lockfile を削除するか、`next.config.ts` の `turbopack.root` でプロジェクト直下を明示しています。
5. 環境変数（Firebase を接続する Phase 1B 以降で必要）：
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NODE_VERSION=20`
6. **Save and Deploy**

### Firebase Auth で「承認済みドメイン」に Cloudflare Pages のドメインを追加

Firebase Console → **Authentication** → **Settings** → **Authorized domains** に以下を追加：

- `your-project.pages.dev`（Cloudflare の自動ドメイン）
- カスタムドメインを設定した場合はそれも追加

### 更新の反映

`main` ブランチに push すると自動で再デプロイされます。

### デプロイ後に HTTP 404（このサイトが見つかりません）のとき

ほとんどは **ビルド成果物がアップロードされていない** 状態です。次を順に確認してください。

0. **GitHub 連携のリポジトリ URL を確認する**（よくある原因）  
   正しくは **`github.com/jyooooo0/yamagata-kids-map`**（ユーザー名の **o は 5 個**）です。  
   `jyoooooo0`（o が 6 個）など **別アカウント／別リポジトリ** に繋がっていると、意図したコードがデプロイされず 404 や古い内容になります。  
   Cloudflare → プロジェクト **設定** → **ビルド** にある接続先を GitHub 上の URL と照合してください。

1. Cloudflare Dashboard → 該当プロジェクト → **Deployments** → **最新**を開く → ステータスが **Success** か（**Failed** のときはルート URL が更新されず、404 が続くことがあります）→ **Build log** 全文の**エラー行**を確認する
2. ログ末尾付近に **`Export`** / **`out`** に関する記述があり、`next build` が完走しているか
3. **Settings** → **Builds & deployments** で  
   **Build output directory** が **`out`** になっているか（Typo で `dist` / `build` / `.next` になっていないか）
4. **Framework preset** が誤って **Next.js** のままになっていないか → **`None`** に変更して **Retry deployment**
5. リポジトリ直下の **`wrangler.toml`** に `name` / `pages_build_output_dir = "out"` を記載済みです（Dashboard の Build output と矛盾させないこと）

ビルドが **Failed** のときはログに npm / Node / メモリエラーが出ているので、その文言をコピーして共有してください。

**補足**：リポジトリには GitHub Actions（`.github/workflows/ci.yml`）があり、`main` へ push すると **`out/index.html` が生成できるか**を検証します。**CI が成功しているのに `pages.dev` だけ 404** のときは、Cloudflare 側の **Build output directory / Framework preset** の不一致が原因です。

---

## 開発状況メモ

進行中の作業の詳細は [docs/WORK_IN_PROGRESS.md](docs/WORK_IN_PROGRESS.md) を参照。

---

## ライセンス・運営方針

- 非営利運営。掲載店舗からの広告料は受け取りません。
- コードは MIT ライセンスで公開予定。
- データの利用・改変は自由。ただしクレジット表記をお願いします。

---

## コントリビュート

- バグ報告・機能要望は [GitHub Issues](https://github.com/jyooooo0/yamagata-kids-map/issues) へ
- スポット情報の追加・修正依頼は、サイト内の修正依頼フォーム（近日公開）から

「庄内の子育てを、みんなであたためる地図。」
