"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SITE_NAV_CTA,
  SITE_NAV_PRIMARY,
  SITE_NAV_SECONDARY,
} from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function MobileHeaderMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-header-menu"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        className="shrink-0 rounded-xl"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-label="メニューを閉じる"
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-header-menu"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-2 shadow-[var(--app-shadow)]"
            aria-label="モバイルメニュー"
          >
            <ul className="space-y-0.5">
              {SITE_NAV_PRIMARY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {SITE_NAV_SECONDARY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 border-t border-border/80 pt-2">
              <Button asChild className="w-full rounded-xl" size="sm">
                <Link href={SITE_NAV_CTA.href} onClick={() => setOpen(false)}>
                  {SITE_NAV_CTA.label}
                </Link>
              </Button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
