# Firebase 運営セットアップ（投稿・モデレーション）

ユーザーの情報投稿を Firestore の **`spotSubmissions`** コレクションに保存し、運営が Firebase Console で確認して `legacy-places.json` 等へ反映します。

## 1. Firebase プロジェクト

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを選択（または新規作成）
2. **Build** → **Firestore Database** → データベースを作成（東京 `asia-northeast1` を推奨）
3. **Build** → **Authentication** → **Sign-in method** で **匿名** を有効化  
   （本番ではメール/Google ログイン追加を検討）

## 2. Web アプリ環境変数

リポジトリの `README.md` と同様に、`NEXT_PUBLIC_FIREBASE_*` を `.env.local`（ローカル）および Cloudflare Pages のビルド環境変数に設定します。

匿名ログインのみでも投稿は動作します。

## 3. Firestore セキュリティルール

リポジトリに `firebase/firestore.rules` があります。**ルール未デプロイのままだと書き込みが拒否されます。**

```bash
npm i -g firebase-tools   # 未導入の場合
firebase login
firebase use <YOUR_PROJECT_ID>
firebase deploy --only firestore:rules
```

デプロイ後、Console の **Firestore** → **ルール** タブで反映を確認してください。

### ルールの要点（現版）

| パス             | create | read/update/delete |
|------------------|--------|---------------------|
| `spots/`         | 禁止   | `published` のみ読取（将来用） |
| `spotSubmissions/` | **認証済みユーザーのみ**（`pending`・payload サイズ上限） | 禁止（運営はコンソール） |
| その他           | 禁止   | —                   |

## 4. 投稿のモデレーション

1. Firestore で **`spotSubmissions`** を開く  
2. `status` が `pending` のドキュメントを確認  
3. 問題なければ `src/data/legacy-places.json` を編集（または将来 `spots/` に昇格）  
4. （任意）処理済みドキュメントに `status: processed` は **現行ルールではクライアントから更新不可** のため、Console 上で直接編集するか、将来 Cloud Functions で管理

### フィールド構成（参考）

```
type: "spot_new" | "spot_correction"
status: "pending"
submitterUid: "<Firebase Auth uid>"
contactEmail: string | null
payload: {
  name, municipality, address, officialUrl, body,
  categoryHint, correctionTargetSlug?
}
createdAt: Timestamp
```

## 5. トラブルシュート

- **送信ボタンでエラー**  
  → 匿名認証が OFF、ルール未デプロイ、環境変数の typo を確認してください。  
- **Cloudflare でだけ失敗する**  
  → Pages の環境変数に `NEXT_PUBLIC_FIREBASE_*` が入っているか、再デプロイ後かを確認してください。

関連: [データモデル全体](DATA_MODEL.md) ・ [掲載スポットの市町整理](SPOTS_BY_MUNICIPALITY.md)
