import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スポットを探す",
  description:
    "庄内エリアの子連れで行ける場所を、カテゴリ・市町で絞り込んで探せます。",
};

export default function SpotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
