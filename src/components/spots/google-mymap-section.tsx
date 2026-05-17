import Link from "next/link";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Google マイマップの埋め込み（任意）。
 * Cloudflare Pages のビルド時に `NEXT_PUBLIC_GOOGLE_MY_MAP_EMBED_URL` を渡すと iframe を表示。
 */
export function GoogleMyMapSection() {
  const embedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MY_MAP_EMBED_URL?.trim() ?? "";

  return (
    <section
      id="spots-map"
      className="border-y border-border/60 bg-secondary/20"
      aria-label="スポットマップ"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          MAP
        </p>
        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          マップで見る
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Google マイマップでまとめたピンと、サイトのスポット一覧をあわせてご利用ください。
        </p>

        <div className="mt-8">
          {embedUrl ? (
            <div className="aspect-[16/10] w-full min-h-[280px] overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:aspect-video sm:min-h-[320px]">
              <iframe
                title="庄内エリアの子育てスポット（Google マイマップ）"
                src={embedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/80 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                運営用のマイマップを用意すると、ここに埋め込んで表示できます。
                <br className="hidden sm:block" />
                公開まではスポット一覧からお探しください。
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/spots">スポット一覧を開く</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://www.google.com/maps/d/u/0/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google My Maps を開く
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
