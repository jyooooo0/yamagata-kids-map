"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Heart } from "lucide-react";

import { LogoMark } from "@/components/brand/logo-mark";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }

  return (    <footer className="border-t border-border/60 bg-muted/55">
      <div className="page-shell-x mx-auto w-full max-w-layout py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex items-center justify-center rounded-[1.125rem] border border-primary/30 bg-background p-0.5 app-card-shadow"
              >
                <LogoMark />
              </span>
              <span className="font-display text-base font-bold tracking-tight">
                やまがた子育てマップ
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              庄内エリアの子育て世帯のために、子連れで行ける場所・おむつ替えスペース・病院などを、親同士でアップデートしていく情報サイト。
            </p>
          </div>

          <FooterColumn
            title="サイトを使う"
            links={[
              { href: "/spots", label: "スポットを探す" },
              { href: "/#spots-map", label: "マップで見る" },
              { href: "/about", label: "このサイトについて" },
            ]}
          />

          <FooterColumn
            title="参加する"
            links={[
              { href: "/contribute", label: "スポットを投稿" },
              { href: "/contact", label: "情報の修正依頼" },
              { href: "/feedback", label: "ご意見・ご感想" },
            ]}
          />

          <FooterColumn
            title="運営"
            links={[
              { href: "/privacy", label: "プライバシーポリシー" },
              { href: "/terms", label: "利用規約" },
              {
                href: "https://github.com/jyooooo0/yamagata-kids-map",
                label: "GitHub",
                external: true,
              },
            ]}
          />
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} やまがた子育てマップ. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-1.5">
            Made in
            <span className="font-display font-semibold text-foreground">
              庄内
            </span>
            with
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="mx-1">·</span>
            <Link
              href="https://github.com/jyooooo0/yamagata-kids-map"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Open Source</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
