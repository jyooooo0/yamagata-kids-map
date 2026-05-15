import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * 親ディレクトリに別の package-lock.json があると Next が workspace root を誤検知する。
   * このプロジェクトを明示的に Turbopack のルートに固定する。
   */
  turbopack: {
    root: path.resolve(__dirname),
  },

  /**
   * Static Export モード。
   *
   * Cloudflare Pages の純粋な静的サイト機能でホスティングするため、`out/` ディレクトリに
   * 完全に静的な HTML/CSS/JS を出力する。SSR・API Routes・middleware は使えないが、
   * Phase 1A では不要。動的なフィルタリング（/spots）は useSearchParams で
   * クライアント側で処理する設計に揃えている。
   *
   * Phase 1B 以降で Firebase 連携が始まっても、Firestore はクライアント SDK で直接
   * 呼べるため、静的サイトのままで投稿機能まで実装できる。
   */
  output: "export",

  /** /spots → /spots/ のように末尾スラッシュを付けて、CDN/Pages との相性を良くする */
  trailingSlash: true,

  /**
   * Cloudflare Pages の制約 + Static Export では Node.js ベースの画像最適化サーバーは使えない。
   * 将来必要になったら Cloudflare Images / next/image の loader 設定で対応する。
   */
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
