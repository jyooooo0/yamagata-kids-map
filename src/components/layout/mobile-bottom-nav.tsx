"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Baby, Home, MapPin, PenLine, Search } from "lucide-react";

const NAV = [
  { href: "/", label: "ホーム", Icon: Home, active: "home" as const },
  {
    href: "/spots",
    label: "さがす",
    Icon: Search,
    active: "spots" as const,
  },
  {
    href: "/#spots-map",
    label: "マップ",
    Icon: MapPin,
    active: "map" as const,
  },
  {
    href: "/spots?category=babystation",
    label: "ベビー",
    Icon: Baby,
    active: "baby" as const,
  },
  {
    href: "/contribute",
    label: "投稿",
    Icon: PenLine,
    active: "contribute" as const,
  },
] satisfies {
  href: string;
  label: string;
  Icon: typeof Home;
  active: "home" | "spots" | "map" | "baby" | "contribute";
}[];

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function current():
    | "home"
    | "spots"
    | "map"
    | "baby"
    | "contribute"
    | null {
    if (pathname === "/") {
      if (hash === "#spots-map") return "map";
      return "home";
    }
    if (pathname.startsWith("/contribute")) return "contribute";
    if (pathname.startsWith("/spots")) {
      if (category === "babystation") return "baby";
      return "spots";
    }
    return null;
  }

  const cur = current();

  return (
    <nav
      className="pb-safe fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-border/80 bg-card/95 py-2 shadow-[0_-1px_0_var(--border)] backdrop-blur-md md:hidden"
      aria-label="メインナビゲーション（モバイル）"
    >
      {NAV.map(({ href, label, Icon, active: key }) => {
        const isOn = cur === key;
        return (
          <Link
            key={key}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium transition-colors ${
              isOn ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span
              className={`transition-transform ${isOn ? "scale-[1.08]" : ""}`}
              aria-hidden
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
