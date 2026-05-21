"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HandHeart,
  Home,
  MapPin,
  PenLine,
  Search,
} from "lucide-react";

import { MOBILE_BOTTOM_NAV, type MobileNavKey } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  spots: Search,
  subsidies: HandHeart,
  map: MapPin,
  contribute: PenLine,
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function current(): MobileNavKey | null {
    if (pathname === "/") {
      if (hash === "#spots-map") return "map";
      return "home";
    }
    if (pathname.startsWith("/contribute")) return "contribute";
    if (pathname.startsWith("/subsidies")) return "subsidies";
    if (pathname.startsWith("/spots")) return "spots";
    return null;
  }

  const cur = current();

  return (
    <nav
      className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 shadow-[0_-4px_24px_rgb(120_90_40/0.08)] backdrop-blur-md md:hidden"
      aria-label="メインナビゲーション（モバイル）"
    >
      <div className="grid grid-cols-5 px-1 pt-1.5">
        {MOBILE_BOTTOM_NAV.map(({ href, label, key }) => {
          const Icon = ICONS[key];
          const isOn = cur === key;
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-semibold transition-colors",
                isOn
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                  isOn && "bg-primary/12 scale-105",
                )}
                aria-hidden
              >
                <Icon className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.85} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
