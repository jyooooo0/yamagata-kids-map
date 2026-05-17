"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { GoogleMyMapIframe } from "@/components/spots/google-mymap-section";
import { CATEGORY_MAP, CATEGORIES, MUNICIPALITY_MAP } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategoryId, Spot } from "@/types/spot";

const CATEGORY_IDS = new Set<CategoryId>(
  CATEGORIES.map((c) => c.id) as CategoryId[],
);

const SORTED_CATEGORIES = [...CATEGORIES].sort((a, b) => a.order - b.order);

export function PrototypeHome({ spots: allSpots }: { spots: Spot[] }) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("category");
  const category =
    raw && CATEGORY_IDS.has(raw as CategoryId) ? (raw as CategoryId) : undefined;

  const spots = category
    ? allSpots.filter(
        (s) => s.category === category || s.categories.includes(category),
      )
    : allSpots;

  return (
    <>
      <header className="bg-gradient-to-br from-primary to-[#40916c] px-6 py-8 text-center text-white">
        <div className="mx-auto max-w-[900px]">
          <h1 className="mx-auto mb-2 flex flex-wrap items-center justify-center gap-2 text-[clamp(1.25rem,4vw,1.75rem)] font-bold leading-snug">
            <span className="text-[1.4em] leading-none" aria-hidden>
              👶
            </span>
            鶴岡市 子ども連れで行けるお店・スポット
          </h1>
          <p className="m-0 text-[0.95rem] opacity-95">
            食べ物・遊び・安らぎ・学び・自然まで、子連れにやさしい場所をまとめました。
          </p>
          <nav
            className="mt-4 flex flex-wrap justify-center gap-3"
            aria-label="便利リンク"
          >
            <a
              href="#spots-map"
              className="rounded-lg bg-white/20 px-3 py-1.5 text-[0.9rem] text-white transition-colors hover:bg-white/35"
            >
              📍 マップで見る
            </a>
            <a
              href="#kosodate-info"
              className="rounded-lg bg-white/20 px-3 py-1.5 text-[0.9rem] text-white transition-colors hover:bg-white/35"
            >
              📋 子育ての情報
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1000px] px-6 py-6">
        <section className="mb-6" aria-label="カテゴリ">
          <div className="flex flex-wrap justify-center gap-2">
            <CategoryFilterLink href="/" active={!category}>
              すべて
            </CategoryFilterLink>
            {SORTED_CATEGORIES.map((c) => (
              <CategoryFilterLink
                key={c.id}
                href={`/?category=${c.id}`}
                active={category === c.id}
              >
                {c.name}
              </CategoryFilterLink>
            ))}
          </div>
        </section>

        <section aria-label="スポット一覧">
          <div className="flex flex-col gap-5">
            {spots.map((spot) => (
              <PrototypePlaceCard key={spot.id} spot={spot} />
            ))}
          </div>
          {spots.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              このカテゴリに該当するスポットがまだありません。
            </p>
          )}
        </section>

        <section
          id="spots-map"
          className="mt-10 scroll-mt-[calc(4.125rem+12px)] border-t border-border pt-6"
          aria-label="マップ"
        >
          <h2 className="m-0 mb-2 text-xl font-bold text-primary">
            📍 マップで見る
          </h2>
          <p className="m-0 mb-4 text-[0.95rem] text-muted-foreground">
            各スポットをGoogleマップでピン表示して確認できます。
          </p>
          <div className="relative mx-auto max-w-[800px]">
            <GoogleMyMapIframe variant="legacy" minHeight="min-h-[320px]" />
          </div>
        </section>

        <section
          id="kosodate-info"
          className="mt-10 scroll-mt-[calc(4.125rem+12px)] border-t border-border pt-6"
          aria-label="子育ての情報"
        >
          <h2 className="m-0 mb-2 text-xl font-bold text-primary">
            📋 子育ての情報
          </h2>
          <p className="m-0 mb-4 text-[0.95rem] text-muted-foreground">
            鶴岡市・山形県の子育て支援情報へのリンクです。
          </p>
          <ul className="m-0 list-none space-y-2.5 p-0 text-sm">
            <li>
              <a
                href="https://www.city.tsuruoka.lg.jp/kyoiku/kosodate/kosodate.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary no-underline hover:underline"
              >
                鶴岡市 子育てガイドブック「おおきくなあれ」
              </a>
            </li>
            <li>
              <a
                href="https://www.city.tsuruoka.lg.jp/kyoiku/shisetsu-event/shisetsu/kosodate01manma.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary no-underline hover:underline"
              >
                鶴岡市子育て広場「まんまルーム」
              </a>
            </li>
            <li>
              <a
                href="https://kosodate.pref.yamagata.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary no-underline hover:underline"
              >
                山形県 子育て支援サイト（にんべんネット）
              </a>
            </li>
            <li>
              <a
                href="https://www.pref.yamagata.jp/ou/kosodateshien/052013/sukoyaka.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary no-underline hover:underline"
              >
                山形県 すこやか子育て支援情報
              </a>
            </li>
          </ul>
        </section>
      </div>

      <footer className="mt-8 border-t border-border px-6 py-6 text-center text-[0.85rem] text-muted-foreground">
        <p className="m-0">
          情報は随時更新します。追加・修正のご希望はお問い合わせください。
        </p>
        <p className="mt-2 text-[0.8rem] opacity-90">
          ※住所はGoogleマップの情報を参照しています。営業時間・設備は変更になる場合があります。事前にご確認ください。
        </p>
        <p className="mt-5 text-xs">
          <Link
            href="/spots"
            className="text-primary underline-offset-2 hover:underline"
          >
            スポット一覧（検索・詳細ページ）へ
          </Link>
          {" · "}
          <Link
            href="/subsidies"
            className="text-primary underline-offset-2 hover:underline"
          >
            庄内の補助制度
          </Link>
        </p>
      </footer>
    </>
  );
}

function CategoryFilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg border-2 border-border bg-card px-4 py-2.5 text-[0.9rem] font-medium text-foreground transition-colors hover:border-accent hover:bg-secondary",
        active &&
          "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary hover:brightness-[1.02]",
      )}
    >
      {children}
    </Link>
  );
}

function PrototypePlaceCard({ spot }: { spot: Spot }) {
  const municipality = MUNICIPALITY_MAP[spot.municipality]?.name ?? "";

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-2 pt-5">
        <h3 className="m-0 text-[1.15rem] font-bold text-primary">
          <Link href={`/spots/${spot.slug}`} className="hover:underline">
            {spot.name}
          </Link>
        </h3>
        <div className="flex max-w-full flex-wrap justify-end gap-1.5">
          {spot.categories.map((id) => (
            <span
              key={id}
              className="rounded-full bg-secondary px-2.5 py-1 text-[0.75rem] text-foreground"
            >
              {CATEGORY_MAP[id]?.name ?? id}
            </span>
          ))}
        </div>
      </div>
      <div className="px-5 pb-5">
        {spot.description && (
          <p className="mb-4 mt-0 text-[0.95rem] leading-relaxed text-muted-foreground">
            {spot.description}
          </p>
        )}
        {(municipality || spot.address) && (
          <div className="grid gap-1 text-[0.9rem] sm:grid-cols-[auto_1fr] sm:gap-x-3">
            {municipality && (
              <>
                <span className="font-medium text-foreground">エリア</span>
                <span className="text-muted-foreground">{municipality}</span>
              </>
            )}
            {spot.address && (
              <>
                <span className="font-medium text-foreground">住所</span>
                <span className="text-muted-foreground">{spot.address}</span>
              </>
            )}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/spots/${spot.slug}`}
            className="inline-block rounded-lg bg-primary px-3.5 py-1.5 text-[0.9rem] font-medium text-primary-foreground transition-colors hover:bg-[#40916c]"
          >
            詳しく見る
          </Link>
          {spot.mapsUrl && (
            <a
              href={spot.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg border border-border bg-card px-3.5 py-1.5 text-[0.9rem] font-medium text-primary transition-colors hover:bg-secondary"
            >
              地図で見る
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function PrototypeHomeFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 px-6 py-16 text-muted-foreground">
      <p className="m-0 text-sm">読み込み中…</p>
    </div>
  );
}
