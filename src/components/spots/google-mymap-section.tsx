import Link from "next/link";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getEmbedUrl(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MY_MAP_EMBED_URL?.trim() ?? "";
}

/** iframe だけ（ホーム分割レイアウトなどで再利用） */
export function GoogleMyMapIframe({
  embedUrl,
  className,
  minHeight,
}: {
  embedUrl?: string;
  className?: string;
  minHeight?: string;
}) {
  const url = embedUrl ?? getEmbedUrl();
  const min = minHeight ?? "min-h-[260px]";

  if (!url) {
    return (
      <div
        className={cn(
          "rounded-[1.125rem] border border-dashed border-border bg-card/95 p-8 text-center app-card-shadow",
          className,
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-6 w-6" strokeWidth={2} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          マップのURLがまだなくても、一覧からゆっくりさがせます。
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full shadow-sm">
            <Link href="/spots">一覧をひらく</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a
              href="https://www.google.com/maps/d/u/0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              My Maps をひらく
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "aspect-[16/10] w-full overflow-hidden rounded-[1.125rem] border border-border bg-card app-card-shadow sm:aspect-video sm:min-h-[320px]",
        min,
        className,
      )}
    >
      <iframe
        title="庄内エリアの子育てスポット（Google マイマップ）"
        src={url}
        className="h-full min-h-[inherit] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

type GoogleMyMapSectionProps = {
  omitOuterSection?: boolean;
  omitHeading?: boolean;
  intro?: string;
};

/**
 * Google マイマップの埋め込み（オプション）。
 * `NEXT_PUBLIC_GOOGLE_MY_MAP_EMBED_URL` で iframe を表示。
 */
export function GoogleMyMapSection({
  omitOuterSection = false,
  omitHeading = false,
  intro,
}: GoogleMyMapSectionProps) {
  const embedUrl = getEmbedUrl();

  const body = (
    <>
      {!omitHeading && (
        <>
          <p className="font-display text-sm font-semibold tracking-[0.12em] text-primary">
            マップで見る
          </p>
          <h2 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            ひとつの地図に、気になるピンだけ
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {intro ??
              "リストとあわせて使うと、今日の気分やエリアだけに絞れます。"}
          </p>
        </>
      )}
      <div className={cn(!omitHeading && "mt-8")}>
        <GoogleMyMapIframe embedUrl={embedUrl} />
      </div>
    </>
  );

  if (omitOuterSection) {
    return <>{body}</>;
  }

  return (
    <section
      id="spots-map"
      className="border-y border-border/55 bg-muted/45"
      aria-label="スポットマップ"
    >
      <div className="page-shell-x mx-auto w-full max-w-layout py-12 sm:py-16 lg:py-20">
        {body}
      </div>
    </section>
  );
}
