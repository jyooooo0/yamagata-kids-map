import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type PageWidth = "md" | "lg" | "xl";

const WIDTH_CLASS: Record<PageWidth, string> = {
  md: "max-w-3xl",
  lg: "max-w-layout",
  xl: "max-w-6xl",
};

export function PageShell({
  children,
  width = "lg",
  className,
}: {
  children: React.ReactNode;
  width?: PageWidth;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "page-shell-x mx-auto w-full py-10 sm:py-14",
        WIDTH_CLASS[width],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-lead max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {children}
    </Link>
  );
}
