import Link from "next/link";
import { MapPin, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/spots", label: "スポットを探す" },
  { href: "/about", label: "このサイトについて" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-foreground"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
          >
            <MapPin className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold tracking-tight">
              やまがた子育てマップ
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
              SHONAI · YAMAGATA
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主要ナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className="font-medium"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/#spots-map">地図で見る</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          aria-label="メニューを開く"
          className="md:hidden"
        >
          <Menu />
        </Button>
      </div>
    </header>
  );
}
