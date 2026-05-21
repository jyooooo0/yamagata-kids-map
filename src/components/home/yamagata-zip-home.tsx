"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MapPin, PenLine, Search } from "lucide-react";

import { HomeGreetingHello } from "@/components/layout/home-greeting";
import {
  FilterChip,
  FilterGroup,
  FilterScrollRow,
} from "@/components/layout/filter-chip";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { GoogleMyMapIframe } from "@/components/spots/google-mymap-section";
import { SpotCard } from "@/components/spots/spot-card";
import { TagFilterPanel } from "@/components/spots/tag-filter-panel";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { SITE_NAV_CTA } from "@/lib/site-nav";
import { getHomeTagFilterSections } from "@/lib/tag-filters";
import { getAreaForMunicipality } from "@/lib/yamagata-municipalities";
import type { CategoryId, Spot, TagId } from "@/types/spot";

const HOME_CATEGORY_IDS: CategoryId[] = [
  "food",
  "cafe",
  "park",
  "indoor-play",
  "babystation",
  "hospital",
];

export function YamagataZipHome({
  spots,
  featured,
  tagCounts,
}: {
  spots: Spot[];
  featured: Spot[];
  tagCounts: Partial<Record<TagId, number>>;
}) {
  const shonaiSpots = useMemo(
    () =>
      spots.filter(
        (s) => getAreaForMunicipality(s.municipality) === "shonai",
      ),
    [spots],
  );

  const mapPreview = shonaiSpots.slice(0, 9);
  const featuredShow = featured.slice(0, 8);

  return (
    <PageShell width="xl">
      <div className="space-y-1">
        <p className="page-eyebrow">SHONAI</p>
        <p className="text-sm text-muted-foreground">
          <HomeGreetingHello />
          <span className="ml-2">📍 庄内エリア</span>
        </p>
        <h1 className="page-title mt-2">
          今日はどこで
          <br />
          遊ぶ？
        </h1>
      </div>

      <Link
        href="/spots"
        className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground"
      >
        <Search className="h-[1.125rem] w-[1.125rem] shrink-0 text-primary" />
        <span>スポット、エリア、ジャンルで検索</span>
      </Link>

      <div className="spots-filters-panel mt-8 space-y-4">
        <FilterGroup label="カテゴリ">
          <FilterScrollRow>
            <FilterChip href="/spots" label="すべて" isActive={false} />
            {HOME_CATEGORY_IDS.map((id) => {
              const cat = CATEGORIES.find((c) => c.id === id);
              if (!cat) return null;
              return (
                <FilterChip
                  key={id}
                  href={`/spots?category=${id}`}
                  label={cat.name}
                  isActive={false}
                  icon={id}
                />
              );
            })}
          </FilterScrollRow>
        </FilterGroup>

        <TagFilterPanel
          buildHref={(tagId) =>
            tagId ? `/spots?tag=${tagId}#tag-filters` : "/spots#tag-filters"
          }
          counts={tagCounts}
          sections={getHomeTagFilterSections()}
          showClear={false}
        />
        <p className="mt-2 text-right">
          <Link
            href="/spots#tag-filters"
            className="text-xs font-semibold text-primary hover:underline"
          >
            すべての設備・条件を見る →
          </Link>
        </p>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold tracking-tight">
            近くのおすすめ
          </h2>
          <Link
            href="/spots?area=shonai"
            className="text-sm font-semibold text-primary hover:underline"
          >
            もっと見る →
          </Link>
        </div>
        <div className="mt-4 flex gap-5 overflow-x-auto pb-2 scrollbar-thin-hide -mx-1 px-1">
          {featuredShow.map((s) => (
            <SpotCard key={s.id} spot={s} variant="carousel" />
          ))}
        </div>
      </section>

      <section id="spots-map" className="mt-12 scroll-mt-24">
        <div className="mb-6">
          <PageHeader
            eyebrow="MAP"
            title="地図でさがす"
            description="庄内エリアのスポットを Google マイマップと一覧で確認できます。カードの見た目はスポット一覧ページと同じです。"
            actions={
              <>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href="/spots?area=shonai">
                    <Search />
                    一覧で絞り込む
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <Link href={SITE_NAV_CTA.href}>
                    <MapPin />
                    マップへ
                  </Link>
                </Button>
              </>
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <GoogleMyMapIframe
              className="rounded-none border-0 shadow-none"
              minHeight="min-h-[min(420px,55vh)]"
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {shonaiSpots.length}
              </span>
              件（庄内）
            </p>
            <div className="grid max-h-[min(520px,65vh)] gap-4 overflow-y-auto pr-0.5 sm:grid-cols-1">
              {mapPreview.map((s) => (
                <SpotCard key={s.id} spot={s} />
              ))}
            </div>
            <Button asChild className="w-full rounded-full" size="lg">
              <Link href="/spots?area=shonai">庄内のスポット一覧へ</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight">
          今週のイベント
        </h2>
        <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            庄内エリア・お知らせ
          </p>
          <p className="mt-2 font-display text-base font-semibold">
            イベント一覧は順次コンテンツ化予定
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            最新情報は各市町や施設の公式サイトでご確認ください。
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold tracking-tight">
          子育てのお役立ち情報
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/subsidies"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/25"
          >
            <span className="text-2xl" aria-hidden>
              🏛️
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold">
                各市町・県の支援制度
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                補助金・総合情報ページへのリンク
              </p>
            </div>
          </Link>
          <Link
            href="/spots?category=hospital"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/25"
          >
            <span className="text-2xl" aria-hidden>
              🩺
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold">
                小児科・クリニック
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                「病院」カテゴリを一覧で表示
              </p>
            </div>
          </Link>
          <a
            href="https://kosodate.pref.yamagata.jp/odekake"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/25"
          >
            <span className="text-2xl" aria-hidden>
              🗺️
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold">
                県公式｜わくわく体験ガイド
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                地図・体験種別から施設や公園を検索
              </p>
            </div>
          </a>
          <Link
            href="/contribute"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/25"
          >
            <span className="text-2xl" aria-hidden>
              ✏️
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold">情報を投稿</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                スポットの追加・修正をお知らせください
              </p>
            </div>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/spots">
              <PenLine />
              スポット一覧へ
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/contribute">投稿フォーム</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
