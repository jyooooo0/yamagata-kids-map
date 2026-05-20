/**
 * ヘッダー・フッター・モバイルナビで共有する導線定義
 */
export const SITE_NAV_PRIMARY = [
  { href: "/spots", label: "スポット" },
  { href: "/subsidies", label: "補助制度" },
  { href: "/about", label: "このサイトについて" },
] as const;

export const SITE_NAV_CTA = {
  href: "/#spots-map",
  label: "地図で見る",
} as const;

export const SITE_NAV_SECONDARY = [
  { href: "/contribute", label: "情報を投稿" },
] as const;

export const MOBILE_BOTTOM_NAV = [
  { href: "/", label: "ホーム", key: "home" as const },
  { href: "/spots", label: "さがす", key: "spots" as const },
  { href: "/subsidies", label: "支援", key: "subsidies" as const },
  { href: "/#spots-map", label: "マップ", key: "map" as const },
  { href: "/contribute", label: "投稿", key: "contribute" as const },
] as const;

export type MobileNavKey = (typeof MOBILE_BOTTOM_NAV)[number]["key"];
