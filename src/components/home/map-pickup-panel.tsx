import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GoogleMyMapIframe } from "@/components/spots/google-mymap-section";
import { SpotCard } from "@/components/spots/spot-card";
import { Button } from "@/components/ui/button";
import type { Spot } from "@/types/spot";

/** マップ＋おすすめ（モバイル横スクロール／タブレット2列／PCはサイド並列） */
export function MapPickupPanel({ picks }: { picks: Spot[] }) {
  return (
    <section
      id="spots-map"
      aria-label="地図でみる場所もおすすめスポット"
      className="scroll-mt-[calc(4.125rem+12px)] border-t border-border/40 bg-secondary/40"
    >
      <div className="page-shell-x mx-auto w-full max-w-layout py-11 sm:py-14 xl:py-16">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold tracking-[0.06em] text-primary">
              📍 マップで見る
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[1.775rem]">
              各スポットを地図のピンで確認できます
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
              ざっくり場所を把握してから、一覧で条件を足しても大丈夫です。
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden shrink-0 rounded-full sm:inline-flex">
            <Link href="/spots">
              リストでひらく
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </header>

        <div className="mt-9 flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12">
          <div className="min-w-0 flex-1">
            <GoogleMyMapIframe className="shadow-[var(--app-shadow)]" />
          </div>

          {/* タブレット以下：統合レイアウト */}
          <div className="w-full xl:hidden">
            <p className="mb-5 font-display text-[1.2rem] font-bold tracking-tight text-foreground md:text-xl">
              ひと休憩ぶんのおすすめ
              <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground md:ml-2 md:inline md:font-normal">

                とりあえずここだけ！
              </span>
            </p>

            <div className="-mx-4 flex snap-x snap-proximity gap-4 overflow-x-auto px-4 pb-1 scrollbar-thin-hide md:hidden">
              {picks.map((spot) => (
                <SpotCard key={spot.id} spot={spot} variant="carousel" />
              ))}
            </div>

            <div className="hidden gap-8 md:grid md:grid-cols-2 md:gap-x-10 xl:hidden">
              {picks.slice(0, 6).map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>

            <div className="mt-7 flex justify-center md:hidden">
              <Button asChild variant="outline" className="rounded-full px-7">
                <Link href="/spots">
                  おすすめをもう少し
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>

            <div className="mt-8 hidden justify-center md:flex xl:hidden">
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/spots">
                  リストでおすすめを増やす
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          {/* デスクトップ：サイド */}
          <aside className="hidden w-full shrink-0 flex-col gap-5 xl:flex xl:w-[min(344px,calc(32vw-48px))]">
            <p className="font-display border-b border-border/65 pb-3 text-lg font-bold tracking-tight text-foreground xl:text-[1.2rem]">
              サイドでもうひとひねり
            </p>
            <div className="flex max-h-none flex-col gap-5 xl:overflow-visible">
              {picks.slice(0, 5).map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  variant="carousel"
                  carouselFullWidth
                />
              ))}
            </div>
            <Button asChild variant="ghost" size="lg" className="rounded-[1rem] bg-muted px-7 font-semibold hover:bg-muted/90">
              <Link href="/spots">
                もっともっといっしょにさがそう
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
