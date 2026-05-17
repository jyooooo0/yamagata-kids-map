import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAllSpots } from "@/lib/places";
import { ContributeForm } from "./contribute-form";

export default function ContributePage() {
  const existingSpots = getAllSpots().map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    municipality: s.municipality,
  }));

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        トップへ
      </Link>

      <header className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          CONTRIBUTE
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          スポット情報を投稿する
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          新しい場所の登録や、住所・市町・設備の訂正を Firebase に保存して運営へ届けられます。
          公開前に管理者が内容を確認します。
        </p>
      </header>

      <div className="mt-10">
        <ContributeForm existingSpots={existingSpots} />
      </div>
    </div>
  );
}
