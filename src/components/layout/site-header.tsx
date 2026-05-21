"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/brand/logo-mark";
import { MobileHeaderMenu } from "@/components/layout/mobile-header-menu";
import { Button } from "@/components/ui/button";
import {
  SITE_NAV_CTA,
  SITE_NAV_PRIMARY,
  SITE_NAV_SECONDARY,
} from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/55 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="page-shell-x mx-auto flex h-16 w-full max-w-layout items-center justify-between gap-3">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-95"
        >
          <span
            aria-hidden
            className="flex shrink-0 items-center justify-center rounded-[1.125rem] border border-primary/35 bg-background p-0.5 app-card-shadow transition-transform duration-300 group-hover:scale-[1.03]"
          >
            <LogoMark />
          </span>
          <span className="min-w-0 flex flex-col leading-tight">
            <span className="font-display truncate text-[0.95rem] font-bold tracking-tight sm:text-base">
              やまがた子育てマップ
            </span>
            <span className="hidden text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
              山形県 · 子連れで探す
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="主要ナビゲーション"
        >
          {SITE_NAV_PRIMARY.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full font-medium",
                  active && "bg-primary/10 text-primary",
                )}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
          {SITE_NAV_SECONDARY.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full font-medium",
                pathname.startsWith(item.href) && "bg-primary/10 text-primary",
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button
            asChild
            size="sm"
            className="ml-1 rounded-full shadow-sm"
          >
            <Link href={SITE_NAV_CTA.href}>{SITE_NAV_CTA.label}</Link>
          </Button>
        </nav>

        <MobileHeaderMenu />
      </div>
    </header>
  );
}
