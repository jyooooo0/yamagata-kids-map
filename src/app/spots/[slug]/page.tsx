import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  CalendarX,
} from "lucide-react";

import { BackLink, PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/spots/category-icon";
import { SpotCard } from "@/components/spots/spot-card";
import {
  CATEGORY_MAP,
  MUNICIPALITY_MAP,
  TAG_GROUP_LABELS,
  TAG_MAP,
} from "@/lib/categories";
import {
  getAllSpots,
  getSpotBySlug,
  getSpotsByCategory,
} from "@/lib/places";
import { getGoogleMapsUrl } from "@/lib/maps";
import { sortTagsByPriority } from "@/lib/tag-filters";
import type { Tag } from "@/types/spot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSpots().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) {
    return { title: "スポットが見つかりません" };
  }
  return {
    title: spot.name,
    description: spot.description ?? `${spot.name}の情報`,
  };
}

export default async function SpotDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  const primaryCategory = CATEGORY_MAP[spot.category];
  const otherCategories = spot.categories
    .filter((c) => c !== spot.category)
    .map((c) => CATEGORY_MAP[c])
    .filter(Boolean);
  const municipality = MUNICIPALITY_MAP[spot.municipality];

  const tagsByGroup = new Map<Tag["group"], Tag[]>();
  for (const tagId of spot.tags) {
    const tag = TAG_MAP[tagId];
    if (!tag) continue;
    const list = tagsByGroup.get(tag.group) ?? [];
    list.push(tag);
    tagsByGroup.set(tag.group, list);
  }
  for (const [group, list] of tagsByGroup) {
    const sorted = sortTagsByPriority(list.map((t) => t.id))
      .map((id) => TAG_MAP[id])
      .filter(Boolean);
    tagsByGroup.set(group, sorted);
  }
  const orderedGroups: Tag["group"][] = [
    "facility",
    "food",
    "service",
    "vibe",
    "location",
  ];

  const related = getSpotsByCategory(spot.category)
    .filter((s) => s.id !== spot.id)
    .slice(0, 3);

  const mapUrl = getGoogleMapsUrl(spot);

  return (
    <PageShell width="md">
      <BackLink href="/spots">スポット一覧に戻る</BackLink>

      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{primaryCategory?.name}</Badge>
          {otherCategories.map((c) => (
            <Badge key={c.id} variant="secondary">
              {c.name}
            </Badge>
          ))}
          {municipality && (
            <Badge variant="outline">{municipality.name}</Badge>
          )}
        </div>

        <h1 className="page-title">{spot.name}</h1>

        {spot.description && (
          <p className="max-w-3xl text-base leading-relaxed text-foreground/85">
            {spot.description}
          </p>
        )}
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="space-y-6">
            <InfoBlock title="基本情報">
              <dl className="space-y-3 text-sm">
                <InfoRow icon={MapPin} label="住所" value={spot.address} />
                <InfoRow icon={Phone} label="電話" value={spot.phone} />
                <InfoRow icon={Clock} label="営業時間" value={spot.hours} />
                <InfoRow
                  icon={CalendarX}
                  label="定休日"
                  value={spot.closed}
                />
              </dl>
            </InfoBlock>

            {orderedGroups.some((g) => tagsByGroup.get(g)?.length) && (
              <InfoBlock title="子連れ向けの設備・特徴">
                <div className="space-y-4">
                  {orderedGroups.map((group) => {
                    const tags = tagsByGroup.get(group);
                    if (!tags || tags.length === 0) return null;
                    return (
                      <div key={group}>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          {TAG_GROUP_LABELS[group]}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="muted"
                              className="font-normal"
                            >
                              {tag.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfoBlock>
            )}

            <InfoBlock title="情報を更新する">
              <p className="text-sm leading-relaxed text-muted-foreground">
                掲載情報に誤りがある／タグを追加したい場合は、近日公開の投稿機能からお知らせください。それまでは
                <Link
                  href="/contribute"
                  className="ml-1 font-medium text-primary hover:underline"
                >
                  投稿フォーム
                </Link>
                からも受け付けています。
              </p>
            </InfoBlock>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-[5.5rem] lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CategoryIcon
                  category={spot.category}
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">カテゴリ</p>
                <p className="font-display text-sm font-semibold">
                  {primaryCategory?.name}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {mapUrl && (
                <Button asChild className="w-full" size="lg">
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin />
                    Googleマップで開く
                  </a>
                </Button>
              )}
              {spot.url && (
                <Button asChild variant="outline" className="w-full" size="lg">
                  <a href={spot.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    公式サイトを見る
                  </a>
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold tracking-tight">
            同じカテゴリのスポット
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <SpotCard key={s.id} spot={s} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-display mb-3 text-sm font-bold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex gap-3">
      <dt className="flex w-20 shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="flex-1 text-sm text-foreground/85">
        {value ?? <span className="text-muted-foreground">未掲載</span>}
      </dd>
    </div>
  );
}
