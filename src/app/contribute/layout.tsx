import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "スポットを投稿",
  description:
    "庄内エリアの子育てスポットを投稿・訂正。Firebase Firestore の spotSubmissions に保存されます。",
};

export default function ContributeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
