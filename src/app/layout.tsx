import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Suspense } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

/**
 * 日本語フォントは globals.css の @import で Google Fonts（Klee One / Zen Maru Gothic）を読み込み。
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://yamagata-kids-map.pages.dev"),
  title: {
    default: "やまがた子育てマップ｜庄内の子連れスポット・補助制度",
    template: "%s｜やまがた子育てマップ",
  },
  description:
    "庄内エリア（鶴岡・酒田・三川・庄内・遊佐）の子育て世帯のために。小上がりのあるお店、おむつ替えスペース、病院、子どもカット対応の美容室、補助制度を地域でアップデートしていく情報プラットフォーム。",
  applicationName: "やまがた子育てマップ",
  keywords: [
    "山形",
    "庄内",
    "鶴岡",
    "酒田",
    "子育て",
    "子連れ",
    "お出かけ",
    "おむつ替え",
    "小上がり",
    "補助金",
  ],
  authors: [{ name: "やまがた子育てマップ運営" }],
  openGraph: {
    title: "やまがた子育てマップ",
    description:
      "庄内エリアの子連れで行ける場所・おむつ替え・病院・補助制度を、親同士でアップデートしていく情報サイト。",
    url: "https://yamagata-kids-map.pages.dev",
    siteName: "やまがた子育てマップ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "やまがた子育てマップ",
    description:
      "庄内エリアの子連れで行ける場所を、親同士でアップデートしていく情報サイト。",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff4e6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1410" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased" data-theme="warm" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex flex-1 flex-col pb-safe-mobile-nav">{children}</main>
        <SiteFooter />
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      </body>
    </html>
  );
}
