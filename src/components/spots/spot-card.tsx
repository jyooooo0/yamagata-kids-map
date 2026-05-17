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
import type { Spot } from "@/types/spot";

interface SpotCardProps {
  spot: Spot;
  /**
   * 詳細ページへの「詳細を見る」リンクを末尾に表示するか。
   * 地図リンクや公式サイトリンクとネストせず安全に共存させるため、
   * カード全体ではなく明示的なリンクで遷移する設計。
   */
  showDetailLink?: boolean;
}

export function SpotCard({ spot, showDetailLink = true }: SpotCardProps) {
  const primaryCategory = CATEGORY_MAP[spot.category];
  const otherCategories = spot.categories
    .filter((c) => c !== spot.category)
    .map((c) => CATEGORY_MAP[c])
    .filter(Boolean);
  const municipality = MUNICIPALITY_MAP[spot.municipality];

  const displayedTags = spot.tags.slice(0, 6);
  const remainingTagCount = Math.max(0, spot.tags.length - displayedTags.length);
  const googleMapsUrl = getGoogleMapsUrl(spot);

  return (
    <Card className="group relative h-full overflow-hidden bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-accent/70 opacity-70 transition-opacity group-hover:opacity-100"
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CategoryIcon
                category={spot.category}
                className="h-5 w-5"
                strokeWidth={2}
              />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base sm:text-lg">
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
                <Badge variant="default" className="bg-primary/90">
                  {primaryCategory?.name}
                </Badge>
                {otherCategories.slice(0, 2).map((c) => (
                  <Badge key={c.id} variant="secondary">
                    {c.name}
                  </Badge>
                ))}
                {municipality && (
                  <Badge variant="outline">{municipality.name}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {spot.description && (
          <CardDescription className="line-clamp-3">
            {spot.description}
          </CardDescription>
        )}

        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {spot.address && (
            <li className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
              <span>{spot.address}</span>
            </li>
          )}
          {spot.phone && (
            <li className="flex items-start gap-1.5">
              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
              <span>{spot.phone}</span>
            </li>
          )}
          {spot.hours && (
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
