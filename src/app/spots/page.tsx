"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, MapPin, PenLine, X } from "lucide-react";

import {
  FilterChip,
  FilterGroup,
  FilterScrollRow,
} from "@/components/layout/filter-chip";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotCard } from "@/components/spots/spot-card";
import {
  CATEGORIES,
  CATEGORY_MAP,
  MUNICIPALITIES,
  MUNICIPALITY_MAP,
  YAMAGATA_AREA_LABELS,
} from "@/lib/categories";
import { getMunicipalitiesByArea } from "@/lib/municipality";
import { SITE_NAV_CTA } from "@/lib/site-nav";
import {
  getAllSpots,
  getAreaCounts,
  getCategoryCounts,
} from "@/lib/places";
import type { CategoryId, MunicipalityCode } from "@/types/spot";
import type { YamagataAreaId } from "@/lib/yamagata-municipalities";
import { getAreaForMunicipality } from "@/lib/yamagata-municipalities";

const AREA_IDS: YamagataAreaId[] = ["shonai", "murayama", "mogami", "okitama"];

export default function SpotsPage() {
  return (
    <Suspense fallback={<SpotsPageSkeleton />}>
      <SpotsPageContent />
    </Suspense>
  );
}

function SpotsPageContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const rawMunicipality = searchParams.get("municipality");
  const rawArea = searchParams.get("area");

  const activeCategory = isValidCategory(rawCategory)
    ? (rawCategory as CategoryId)
    : null;
  const activeMunicipality = isValidMunicipality(rawMunicipality)
    ? (rawMunicipality as MunicipalityCode)
    : null;
  const activeArea = isValidArea(rawArea) ? (rawArea as YamagataAreaId) : null;

  const counts = useMemo(() => getCategoryCounts(), []);
  const areaCounts = useMemo(() => getAreaCounts(), []);
  const allSpots = useMemo(() => getAllSpots(), []);

  const municipalityOptions = useMemo(() => {
    if (activeArea) return getMunicipalitiesByArea(activeArea);
    return MUNICIPALITIES.filter((m) => m.code !== "other");
  }, [activeArea]);

  const spots = useMemo(() => {
    let list = allSpots;
    if (activeCategory) {
      list = list.filter((s) => s.categories.includes(activeCategory));
    }
    if (activeArea) {
      list = list.filter(
        (s) => getAreaForMunicipality(s.municipality) === activeArea,
      );
    }
    if (activeMunicipality) {
      list = list.filter((s) => s.municipality === activeMunicipality);
    }
    return list;
  }, [allSpots, activeCategory, activeArea, activeMunicipality]);

  const buildHref = (
    category?: CategoryId | null,
    municipality?: MunicipalityCode | null,
    area?: YamagataAreaId | null,
  ) => {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (area) sp.set("area", area);
    if (municipality) sp.set("municipality", municipality);
    const q = sp.toString();
    return q ? `/spots?${q}` : "/spots";
  };

  const totalSpotCount = allSpots.length;
  const legacyCount = allSpots.filter((s) => !s.id.startsWith("kanko-")).length;
  const officialCount = totalSpotCount - legacyCount;
  const hasFilters = Boolean(
    activeCategory || activeMunicipality || activeArea,
  );

  return (
    <PageShell width="xl">
      <PageHeader
        eyebrow="SPOTS"
        title="スポットを探す"
        description={`山形県内の子ども向け・家族向けスポットを地域・カテゴリで絞り込めます。庄内の飲食・施設（${legacyCount}件）と県公式観光情報（${officialCount}件）を掲載。地図は無料の Google マイマップを利用しています。`}
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href={SITE_NAV_CTA.href}>
                <MapPin />
                地図で見る
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/contribute">
                <PenLine />
                情報を投稿
              </Link>
            </Button>
          </>
        }
      />

      <div className="spots-filters-panel mt-8 space-y-4">
        <FilterGroup label="地域">
          <FilterScrollRow>
            <FilterChip
              href={buildHref(activeCategory, null, null)}
              label="県内すべて"
              isActive={!activeArea}
              count={totalSpotCount}
            />
            {AREA_IDS.map((id) => (
              <FilterChip
                key={id}
                href={buildHref(activeCategory, null, id)}
                label={YAMAGATA_AREA_LABELS[id].short}
                isActive={activeArea === id}
                count={areaCounts[id]}
              />
            ))}
          </FilterScrollRow>
        </FilterGroup>

        <FilterGroup label="カテゴリ">
          <FilterScrollRow>
            <FilterChip
              href={buildHref(null, activeMunicipality, activeArea)}
              label="すべて"
              isActive={!activeCategory}
            />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                href={buildHref(c.id, activeMunicipality, activeArea)}
                label={c.name}
                isActive={activeCategory === c.id}
                count={counts[c.id] ?? 0}
                icon={c.id}
              />
            ))}
          </FilterScrollRow>
        </FilterGroup>

        <FilterGroup
          label={activeArea ? `${YAMAGATA_AREA_LABELS[activeArea].short}の市町` : "市町"}
          hint={activeArea ? undefined : "先に地域を選ぶと市町で絞れます"}
        >
          <FilterScrollRow>
            <FilterChip
              href={buildHref(activeCategory, null, activeArea)}
              label={activeArea ? "地域内すべて" : "市町（地域未選択）"}
              isActive={!activeMunicipality}
            />
            {activeArea &&
              municipalityOptions.map((m) => (
                <FilterChip
                  key={m.code}
                  href={buildHref(activeCategory, m.code, activeArea)}
                  label={m.name}
                  isActive={activeMunicipality === m.code}
                />
              ))}
          </FilterScrollRow>
        </FilterGroup>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-card/80 px-3 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">
              適用中
            </span>
            {activeArea && (
              <Badge variant="outline" className="gap-1.5 pr-1">
                {YAMAGATA_AREA_LABELS[activeArea].label}
                <Link
                  href={buildHref(activeCategory, activeMunicipality, null)}
                  className="inline-flex rounded-full p-0.5 hover:bg-muted"
                  aria-label="地域絞り込みを解除"
                >
                  <X className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            {activeCategory && (
              <Badge variant="default" className="gap-1.5 pr-1">
                {CATEGORY_MAP[activeCategory]?.name}
                <Link
                  href={buildHref(null, activeMunicipality, activeArea)}
                  className="inline-flex rounded-full p-0.5 hover:bg-primary-foreground/20"
                  aria-label="カテゴリ絞り込みを解除"
                >
                  <X className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            {activeMunicipality && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                {MUNICIPALITY_MAP[activeMunicipality]?.name}
                <Link
                  href={buildHref(activeCategory, null, activeArea)}
                  className="inline-flex rounded-full p-0.5 hover:bg-muted"
                  aria-label="市町絞り込みを解除"
                >
                  <X className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            <Button asChild variant="ghost" size="sm" className="ml-auto h-7 text-xs">
              <Link href="/spots">すべて解除</Link>
            </Button>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{spots.length}</span> 件
        {totalSpotCount !== spots.length && (
          <span>（全{totalSpotCount}件中）</span>
        )}
      </p>

      {spots.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Filter className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-base font-semibold">
            条件に合うスポットがありません
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            地域やカテゴリを変えるか、フィルタを解除してみてください。
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-full">
            <Link href="/spots">フィルタをすべて解除</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function SpotsPageSkeleton() {
  return (
    <PageShell width="xl">
      <div className="space-y-3">
        <div className="h-3 w-16 rounded-lg bg-muted" />
        <div className="h-9 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-full max-w-md rounded-lg bg-muted" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>
    </PageShell>
  );
}

function isValidCategory(value: string | null): boolean {
  if (!value) return false;
  return CATEGORIES.some((c) => c.id === value);
}

function isValidMunicipality(value: string | null): boolean {
  if (!value) return false;
  return MUNICIPALITIES.some((m) => m.code === value);
}

function isValidArea(value: string | null): value is YamagataAreaId {
  if (!value) return false;
  return AREA_IDS.includes(value as YamagataAreaId);
}
