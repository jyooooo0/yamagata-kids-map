import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Cloudflare Pages の制約に合わせ、組み込みの画像最適化サーバーは使わない。
  // 将来必要になったら Cloudflare Images / next/image の loader 設定で対応する。
  images: {
    unoptimized: true,
    remotePatterns: [
      // Firebase Storage（投稿写真の公開 URL）
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      // Google アカウントのプロフィール画像
      { protocol: "https", hostname: "**.googleusercontent.com" },
      // Google 系のCDN（例：lh3.googleusercontent.com）
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // ビルド時の型エラーで止めない設定はあえて入れない（型安全を最優先）。
};

export default nextConfig;
