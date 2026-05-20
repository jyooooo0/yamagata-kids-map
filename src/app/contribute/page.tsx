import { BackLink, PageHeader, PageShell } from "@/components/layout/page-shell";
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
    <PageShell width="md">
      <BackLink href="/spots">スポット一覧に戻る</BackLink>

      <div className="mt-6">
        <PageHeader
          eyebrow="CONTRIBUTE"
          title="スポット情報を投稿する"
          description="新しい場所の登録や、住所・市町・設備の訂正を Firebase に保存して運営へ届けられます。公開前に管理者が内容を確認します。"
        />
      </div>

      <div className="mt-10">
        <ContributeForm existingSpots={existingSpots} />
      </div>
    </PageShell>
  );
}
