import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/spots/category-icon";
import { CATEGORY_MAP, MUNICIPALITY_MAP, TAG_MAP } from "@/lib/categories";
import { getGoogleMapsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { Spot } from "@/types/spot";

interface SpotCardProps {
  spot: Spot;
  /**
   * 詳細ページへの「詳細を見る」リンクを末尾に表示するか。
   * 地図リンクや公式サイトリンクとネストせず安全に共存させるため、
   * カード全体ではなく明示的なリンクで遷移する設計。
   */
  showDetailLink?: boolean;
  /** トップページの横スクロール一覧向けレイアウト */
  variant?: "default" | "carousel";
}

export function SpotCard({
  spot,
  showDetailLink = true,
  variant = "default",
}: SpotCardProps) {
  const primaryCategory = CATEGORY_MAP[spot.category];
  const otherCategories = spot.categories
    .filter((c) => c !== spot.category)
    .map((c) => CATEGORY_MAP[c])
    .filter(Boolean);
  const municipality = MUNICIPALITY_MAP[spot.municipality];

  const displayedTags = spot.tags.slice(0, variant === "carousel" ? 4 : 6);
  const remainingTagCount = Math.max(0, spot.tags.length - displayedTags.length);
  const googleMapsUrl = getGoogleMapsUrl(spot);

  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden bg-card transition-all hover:border-primary/30",
        variant === "default" &&
          "hover:-translate-y-0.5 hover:shadow-lg",
        variant === "carousel" &&
          "max-w-none shrink-0 snap-start hover:shadow-xl",
        variant === "carousel" &&
          "w-[min(20rem,calc(100vw-4.75rem))] md:w-[19.25rem]",
        variant === "carousel" &&
          "rounded-[1.125rem] border-[0.0625rem] app-card-shadow",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-accent/70 opacity-70 transition-opacity group-hover:opacity-100"
      />
      <CardHeader
        className={cn("pb-3", variant === "carousel" && "px-4 pt-4 pb-2")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                variant === "carousel" ? "h-9 w-9" : "h-10 w-10",
              )}
            >
              <CategoryIcon
                category={spot.category}
                className={
                  variant === "carousel"
                    ? "h-[1.125rem] w-[1.125rem]"
                    : "h-5 w-5"
                }
                strokeWidth={2}
              />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle
                className={cn(
                  variant === "carousel" &&
                    "text-sm leading-snug sm:text-[0.9375rem]",
                )}
              >
                {showDetailLink ? (
                  <Link
                    href={`/spots/${spot.slug}`}
                    className="transition-colors hover:text-primary focus:outline-none focus-visible:underline"
                  >
                    {spot.name}
                  </Link>
                ) : (
                  spot.name
                )}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <Badge variant="default" className="bg-primary/90 px-2 py-0">
                  {primaryCategory?.name}
                </Badge>
                {otherCategories.slice(0, variant === "carousel" ? 1 : 2).map((c) => (
                  <Badge key={c.id} variant="secondary" className="px-2 py-0">
                    {c.name}
                  </Badge>
                ))}
                {municipality && (
                  <Badge variant="outline" className="px-2 py-0">
                    {municipality.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn("space-y-3", variant === "carousel" && "space-y-2 px-4 pb-4")}
      >
        {spot.description && (
          <CardDescription
            className={cn(
              variant === "carousel" ? "line-clamp-2" : "line-clamp-3",
            )}
          >
            {spot.description}
          </CardDescription>
        )}

        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {spot.address && (
            <li className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
              <span className="line-clamp-2">{spot.address}</span>
            </li>
          )}
          {variant !== "carousel" && spot.phone && (
            <li className="flex items-start gap-1.5">
              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
              <span>{spot.phone}</span>
            </li>
          )}
          {variant !== "carousel" && spot.hours && (
            <li className="flex items-start gap-1.5">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
              <span>{spot.hours}</span>
            </li>
          )}
        </ul>

        {displayedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {displayedTags.map((tagId) => {
              const tag = TAG_MAP[tagId];
              if (!tag) return null;
              return (
                <Badge key={tagId} variant="muted" className="font-normal">
                  {tag.label}
                </Badge>
              );
            })}
            {remainingTagCount > 0 && (
              <Badge variant="muted" className="font-normal">
                +{remainingTagCount}
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <MapPin className="h-3.5 w-3.5" />
              地図で開く
            </a>
          )}
          {spot.url && (
            <a
              href={spot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              公式サイト
            </a>
          )}
          {showDetailLink && (
            <Link
              href={`/spots/${spot.slug}`}
              className="ml-auto inline-flex items-center gap-1 font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              詳細を見る
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
