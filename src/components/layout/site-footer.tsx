import Link from "next/link";
import { MapPin, Github, Heart } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <MapPin className="h-[18px] w-[18px]" strokeWidth={2.4} />
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
          <p className="flex items-center gap-1.5">
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
