import Link from "next/link";

import { CategoryIcon } from "@/components/spots/category-icon";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types/spot";

export function FilterChip({
  href,
  label,
  isActive,
  count,
  icon,
  className,
}: {
  href: string;
  label: string;
  isActive: boolean;
  count?: number;
  icon?: CategoryId;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "filter-chip",
        isActive ? "filter-chip-active" : "filter-chip-inactive",
        className,
      )}
    >
      {icon && (
        <CategoryIcon
          category={icon}
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={2}
        />
      )}
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "filter-chip-count",
            isActive && "filter-chip-count-active",
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export function FilterGroup({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="filter-group-label">{label}</p>
        {hint && (
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function FilterScrollRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-thin-hide -mx-1 px-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
