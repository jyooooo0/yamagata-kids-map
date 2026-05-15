import Link from "next/link";
import type { Metadata } from "next";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotCard } from "@/components/spots/spot-card";
import { CategoryIcon } from "@/components/spots/category-icon";
import {
  CATEGORIES,
  CATEGORY_MAP,
  MUNICIPALITIES,
  MUNICIPALITY_MAP,
} from "@/lib/categories";
import { getAllSpots, getCategoryCounts } from "@/lib/places";
import type { CategoryId, MunicipalityCode } from "@/types/spot";

export const metadata: Metadata = {
  title: "スポットを探す",
  description:
    "庄内エリアの子連れで行ける場所を、カテゴリ・市町で絞り込んで探せます。",
};

interface SpotsPageProps {
  searchParams: Promise<{
    category?: string;
    municipality?: string;
  }>;
}

export default async function SpotsPage({ searchParams }: SpotsPageProps) {
  const params = await searchParams;
  const activeCategory = isValidCategory(params.category)
    ? (params.category as CategoryId)
    : null;
  const activeMunicipality = isValidMunicipality(params.municipality)
    ? (params.municipality as MunicipalityCode)
    : null;

  const counts = getCategoryCounts();
  let spots = getAllSpots();

  if (activeCategory) {
    spots = spots.filter((s) => s.categories.includes(activeCategory));
  }
  if (activeMunicipality) {
    spots = spots.filter((s) => s.municipality === activeMunicipality);
  }

  const buildHref = (category?: CategoryId | null, municipality?: MunicipalityCode | null) => {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (municipality) sp.set("municipality", municipality);
    const q = sp.toString();
    return q ? `/spots?${q}` : "/spots";
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          SPOTS
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          スポットを探す
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          現在は鶴岡市を中心に庄内エリアのスポットを掲載しています。情報は随時更新中。
          投稿機能は近日公開予定です。
        </p>
      </header>

      <div className="mt-8 space-y-5">
        <FilterRow
          label="カテゴリ"
          activeKey={activeCategory ?? "all"}
          totalCount={Object.values(counts).reduce((a, b) => a + b, 0)}
          items={[
            { key: "all", label: "すべて", href: buildHref(null, activeMunicipality), count: undefined },
            ...CATEGORIES.map((c) => ({
              key: c.id,
              label: c.name,
              href: buildHref(c.id, activeMunicipality),
              count: counts[c.id] ?? 0,
              icon: c.id,
            })),
          ]}
        />

        <FilterRow
          label="市町"
          activeKey={activeMunicipality ?? "all"}
          items={[
            { key: "all", label: "庄内すべて", href: buildHref(activeCategory, null), count: undefined },
            ...MUNICIPALITIES.map((m) => ({
              key: m.code,
              label: m.name,
              href: buildHref(activeCategory, m.code),
              count: undefined,
            })),
          ]}
        />

        {(activeCategory || activeMunicipality) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">適用中の絞り込み：</span>
            {activeCategory && (
              <Badge variant="default" className="gap-1.5">
                {CATEGORY_MAP[activeCategory]?.name}
                <Link
                  href={buildHref(null, activeMunicipality)}
                  className="inline-flex items-center hover:opacity-80"
                  aria-label="カテゴリ絞り込みを解除"
                >
                  <X className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            {activeMunicipality && (
              <Badge variant="secondary" className="gap-1.5">
                {MUNICIPALITY_MAP[activeMunicipality]?.name}
                <Link
                  href={buildHref(activeCategory, null)}
                  className="inline-flex items-center hover:opacity-80"
                  aria-label="市町絞り込みを解除"
                >
                  <X className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link href="/spots">すべて解除</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{spots.length}</span>{" "}
          件のスポット
        </p>
      </div>

      {spots.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <Filter className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-base font-semibold">
            条件に合うスポットはまだ登録されていません
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            絞り込み条件を変更してみてください。
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterItem {
  key: string;
  label: string;
  href: string;
  count?: number;
  icon?: CategoryId;
}

function FilterRow({
  label,
  activeKey,
  items,
  totalCount,
}: {
  label: string;
  activeKey: string;
  items: FilterItem[];
  totalCount?: number;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = activeKey === item.key;
          const count =
            item.key === "all" && totalCount !== undefined ? totalCount : item.count;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              {item.icon && (
                <CategoryIcon
                  category={item.icon}
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                />
              )}
              <span>{item.label}</span>
              {typeof count === "number" && (
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function isValidCategory(value: string | undefined): boolean {
  if (!value) return false;
  return CATEGORIES.some((c) => c.id === value);
}

function isValidMunicipality(value: string | undefined): boolean {
  if (!value) return false;
  return MUNICIPALITIES.some((m) => m.code === value);
}
