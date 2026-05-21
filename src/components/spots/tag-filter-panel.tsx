import Link from "next/link";

import {
  FilterChip,
  FilterGroup,
  FilterScrollRow,
} from "@/components/layout/filter-chip";
import { TAG_MAP } from "@/lib/categories";
import {
  getTagFilterShortLabel,
  TAG_FILTER_SECTIONS,
  type TagFilterSection,
} from "@/lib/tag-filters";
import type { TagId } from "@/types/spot";

export function TagFilterPanel({
  activeTag,
  buildHref,
  counts,
  sections = TAG_FILTER_SECTIONS,
  showClear = true,
  id,
  hideEmpty = true,
}: {
  activeTag?: TagId | null;
  buildHref: (tagId: TagId | null) => string;
  counts: Partial<Record<TagId, number>>;
  sections?: TagFilterSection[];
  showClear?: boolean;
  id?: string;
  /** 件数0のタグを非表示（選択中は常に表示） */
  hideEmpty?: boolean;
}) {
  const visibleSections = sections
    .map((section) => ({
      ...section,
      tags: section.tags.filter((tagId) => {
        if (!TAG_MAP[tagId]) return false;
        if (activeTag === tagId) return true;
        if (!hideEmpty) return true;
        return (counts[tagId] ?? 0) > 0;
      }),
    }))
    .filter((section) => section.tags.length > 0);

  if (visibleSections.length === 0 && !showClear) {
    return null;
  }

  return (
    <div id={id} className="space-y-3">
      <FilterGroup
        label="設備・条件"
        hint="重要度の高い順。タップで絞り込み"
      >
        {showClear && (
          <FilterScrollRow className="mb-1">
            <FilterChip
              href={buildHref(null)}
              label="指定なし"
              isActive={!activeTag}
            />
          </FilterScrollRow>
        )}

        {visibleSections.map((section) => (
          <div key={section.id} className="space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-0.5">
              <p className="text-[11px] font-semibold text-foreground/80">
                {section.label}
              </p>
              {section.hint && (
                <p className="text-[10px] text-muted-foreground">
                  {section.hint}
                </p>
              )}
            </div>
            <FilterScrollRow>
              {section.tags.map((tagId) => {
                const count = counts[tagId];
                return (
                  <FilterChip
                    key={tagId}
                    href={buildHref(tagId)}
                    label={getTagFilterShortLabel(tagId)}
                    isActive={activeTag === tagId}
                    count={count && count > 0 ? count : undefined}
                  />
                );
              })}
            </FilterScrollRow>
          </div>
        ))}
      </FilterGroup>

      {activeTag && TAG_MAP[activeTag] && (
        <p className="px-0.5 text-xs text-muted-foreground">
          選択中:{" "}
          <span className="font-medium text-foreground">
            {getTagFilterShortLabel(activeTag)}
          </span>
          {" · "}
          <Link
            href={buildHref(null)}
            className="font-medium text-primary hover:underline"
          >
            解除
          </Link>
        </p>
      )}
    </div>
  );
}
