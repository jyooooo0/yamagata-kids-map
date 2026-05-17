/**
 * Firebase クライアント SDK の一元管理。
 *
 * - クライアントコンポーネント／サーバーコンポーネントの両方から利用可能
 * - Cloudflare Pages の Edge Runtime と互換性のあるモジュラー SDK のみを使用
 * - Phase 1A 時点では Firebase プロジェクトが未接続でも壊れないように、
 *   環境変数が未設定の場合は遅延初期化＋エラー時 fallback を行う
 *
 * 環境変数（.env.local）:
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Firebase 環境変数が一通り揃っているか */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

let cachedApp: FirebaseApp | null = null;

/** Firebase App を遅延初期化。多重初期化を防ぐため getApps() でチェック */
export function getFirebaseApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase の環境変数が未設定です。.env.local に NEXT_PUBLIC_FIREBASE_* を設定してください。",
    );
  }
  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

/** Auth インスタンス取得（メール／Google などのサインインに使用） */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/** Firestore インスタンス取得 */
export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

/** Storage インスタンス取得（投稿画像等） */
export function getFirebaseStorageInstance(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

/**
 * Firestore コレクション名の定数定義。
 * 文字列リテラルを散らさず、ここで一元管理する。
 */
export const COLLECTIONS = {
  spots: "spots",
  reviews: "reviews",
  users: "users",
  children: "children",
  subsidies: "subsidies",
  tagSuggestions: "tagSuggestions",
  /** 匿名／ログインユーザーからの追加・修正依頼（運営が Console で承認処理） */
  spotSubmissions: "spotSubmissions",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
