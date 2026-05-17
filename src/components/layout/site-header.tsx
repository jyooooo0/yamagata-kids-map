import Link from "next/link";
import { Menu } from "lucide-react";

import { LogoMark } from "@/components/brand/logo-mark";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/spots", label: "スポットを探す" },
  { href: "/about", label: "このサイトについて" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/55 bg-card/65 backdrop-blur-xl supports-[backdrop-filter]:bg-card/50">
      <div className="mx-auto flex h-[4.125rem] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 text-foreground transition-opacity hover:opacity-95"
        >
          <span
            aria-hidden
            className="flex shrink-0 items-center justify-center rounded-[1.125rem] border border-primary/35 bg-background app-card-shadow p-0.5 transition-transform duration-300 group-hover:scale-[1.03]"
          >
            <LogoMark />
          </span>
          <span className="min-w-0 flex flex-col leading-tight">
            <span className="font-display truncate text-[0.975rem] font-bold tracking-tight sm:text-base">
              やまがた子育てマップ
            </span>
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              SHONAI · YAMAGATA
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="主要ナビゲーション"
        >
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className="font-medium rounded-full"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button
            asChild
            size="sm"
            className="ml-1 rounded-full border-primary/30 bg-secondary/70 shadow-sm hover:bg-secondary"
          >
            <Link href="/#spots-map">地図で見る</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          aria-label="メニューを開く"
          className="shrink-0 rounded-xl md:hidden"
          asChild
        >
          <Link href="/spots">
            <Menu />
          </Link>
        </Button>
      </div>
    </header>
  );
}
