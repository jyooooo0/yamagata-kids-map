import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Cake,
  ChevronRight,
  Map,
  MapPinned,
  MessageCircleHeart,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { HomeGreetingHello } from "@/components/layout/home-greeting";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/spots/category-icon";
import { GoogleMyMapSection } from "@/components/spots/google-mymap-section";
import { SpotCard } from "@/components/spots/spot-card";
import { CATEGORIES } from "@/lib/categories";
import { getCategoryCounts, getFeaturedSpots } from "@/lib/places";
import type { CategoryId } from "@/types/spot";

/** ヒーロー直下のワンタップ検索（カテゴリ ID は既存クエリと整合） */
const QUICK_CONDITIONS: {
  id: CategoryId;
  emoji: string;
  label: string;
  sub: string;
  tint: string;
}[] = [
  {
    id: "food",
    emoji: "🍜",
    label: "ごはん",
    sub: "小上がり・キッズメニュー",
    tint: "bg-[color-mix(in_srgb,var(--app-soft)_75%,transparent)] border-[rgb(231_130_91/0.22)]",
  },
  {
    id: "cafe",
    emoji: "☕",
    label: "カフェ",
    sub: "甘味・テイクアウト",
    tint: "bg-secondary/85 border-secondary-foreground/10",
  },
  {
    id: "babystation",
    emoji: "🍼",
    label: "赤ちゃんの駅",
    sub: "授乳・おむつ替え",
    tint: "bg-[rgb(42_157_143/0.14)] border-[rgb(42_157_143/0.28)]",
  },
  {
    id: "indoor-play",
    emoji: "🧸",
    label: "室内で遊ぶ",
    sub: "児童館・キッズスペース",
    tint: "bg-muted border-border",
  },
  {
    id: "park",
    emoji: "🌳",
    label: "公園",
    sub: "外あそび・休日おでかけ",
    tint: "bg-[rgb(148_184_67/0.18)] border-[rgb(120_150_50/0.25)]",
  },
  {
    id: "hospital",
    emoji: "🩺",
    label: "病院・健康",
    sub: "小児科・救急情報",
    tint: "bg-[rgb(91_139_239/0.16)] border-[rgb(91_139_239/0.26)]",
  },
];

export default function HomePage() {
  const counts = getCategoryCounts();
  const featured = getFeaturedSpots(10);
  const totalSpots = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <Hero totalSpots={totalSpots} />
      <SearchBarShortcut />
      <QuickConditionTiles />
      <FeatureBand />
      <GoogleMyMapSection />
      <FeaturedCarousel spots={featured} />
      <FutureFeaturesSection />
      <CategorySection counts={counts} />
      <ContributeCTA />
    </>
  );
}

function Hero({ totalSpots }: { totalSpots: number }) {
  return (
    <section className="relative overflow-hidden bg-warm-shell">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-washi-soft opacity-65"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-[22rem] w-[22rem] rounded-full bg-primary/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -left-16 h-[20rem] w-[20rem] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-28 pt-10 sm:px-6 sm:pb-36 sm:pt-14 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-foreground/90 backdrop-blur app-card-shadow">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <HomeGreetingHello />
            {' · '}
            <span className="font-medium text-muted-foreground">
              今日はどこへ行く？
            </span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-accent/35 bg-accent/12 px-3 py-1.5 text-xs font-semibold text-accent">
            <MapPinned className="h-3.5 w-3.5 shrink-0" aria-hidden />
            庄内エリア
          </span>

          <Badge
            variant="secondary"
            className="rounded-full border border-border/70 bg-secondary/95 px-3 py-1 font-semibold"
          >
            掲載 {totalSpots} スポット
          </Badge>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="font-display text-[1.875rem] font-bold leading-[1.28] tracking-tight text-foreground sm:text-[2.5rem] sm:leading-snug lg:text-[3rem]">
            庄内の子育て、
            <br className="sm:hidden" />
            ゆる〜く広げていくマップ。
          </h1>

          <p className="max-w-[40rem] text-sm leading-relaxed text-foreground/78 sm:text-base">
            小上がりのあるお店、おむつ替えできる場所、夜間対応の小児科。
            「知らなかった」を減らすために、親同士で情報を書き足していくサイトです。
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-[3.125rem] rounded-full px-8 text-[0.95rem] shadow-md app-card-shadow"
            >
              <Link href="/spots">
                はじめる
                <ChevronRight className="opacity-90" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[3.125rem] rounded-full border-2 bg-card/85 px-7 text-[0.95rem] backdrop-blur"
            >
              <Link href="/#spots-map">マップを見る</Link>
            </Button>
          </div>
        </div>

        <MountainSilhouette />
      </div>
    </section>
  );
}

function MountainSilhouette() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 select-none overflow-hidden text-primary/[0.2] sm:h-[4.75rem]"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 90 L180 42 L290 74 L438 34 L596 62 L734 26 L892 54 L1036 38 L1200 68 L1200 90 Z" />
      </svg>
    </div>
  );
}

/** ヒーローと重なる検索バー風リンク */
function SearchBarShortcut() {
  return (
    <div className="relative z-10 -mt-14 px-4 sm:-mt-[4.75rem] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/spots"
          className="flex items-center gap-3 rounded-[1.375rem] border border-border/90 bg-card/95 px-5 py-[0.9375rem] text-sm text-muted-foreground shadow-[var(--app-shadow)] backdrop-blur transition-all hover:border-primary/35 hover:bg-card"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
            <Search className="h-[1.1875rem] w-[1.1875rem]" strokeWidth={2.25} />
          </span>
          <span className="truncate text-left leading-snug">
            ジャンル・タグからスポットをさがす
          </span>
          <ChevronRight
            className="ml-auto h-5 w-5 shrink-0 text-primary opacity-75"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}

function QuickConditionTiles() {
  return (
    <section className="relative z-[1] mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8">
      <SectionHeader
        eyebrow="QUICK"
        title="いま気になる条件"
        description="気分に合わせてまずカテゴリで絞り込み。そのあと一覧で細かく探せます。"
        className="max-w-xl"
      />
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {QUICK_CONDITIONS.map((q) => (
          <Link
            key={q.id}
            href={`/spots?category=${q.id}`}
            className={[
              "group relative flex flex-col gap-3 overflow-hidden rounded-[1.125rem] border px-4 py-4 shadow-sm transition-all",
              "app-card-shadow hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--app-shadow)]",
              q.tint,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-2xl leading-none" aria-hidden>
                {q.emoji}
              </span>
              <span className="rounded-full bg-card/95 px-2 py-1 text-[0.625rem] font-semibold leading-none uppercase tracking-[0.12em] text-muted-foreground">
                tap
              </span>
            </div>
            <div>
              <h3 className="font-display text-[0.95rem] font-bold tracking-tight text-foreground">
                {q.label}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {q.sub}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[0.8rem] font-semibold text-primary">
              <span>さがしてみる</span>
              <ChevronRight
                className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeatureBand() {
  const features = [
    {
      icon: MapPinned,
      title: "子連れで行ける場所",
      desc: "タグやカテゴリで、家族に合わせて拾い読みできる設計です。",
    },
    {
      icon: Baby,
      title: "おむつ・授乳情報",
      desc: "立ち寄りスポットをまとめて確認。外出の不安をひとつ減らすために。",
    },
    {
      icon: Stethoscope,
      title: "健康・クリニック",
      desc: "小児科や夜間情報もカテゴリで整理。応急でも迷わないように。",
    },
    {
      icon: Map,
      title: "マップとリスト",
      desc: "マイマップのピンと一覧を両方用意。現在地からの検討にも使えます。",
    },
  ];
  return (
    <section className="mt-14 border-y border-border/45 bg-muted/55">
      <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex min-h-[5.75rem] items-start gap-3 rounded-[1.125rem] border border-border/60 bg-card/95 px-5 py-[1.125rem] app-card-shadow"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedCarousel({
  spots,
}: {
  spots: ReturnType<typeof getFeaturedSpots>;
}) {
  return (
    <section className="bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="PICK UP"
            title="おすすめスポット"
            description="一覧からいくつかピックアップ。横スクロールで順番にチェック。"
            className="max-w-lg"
          />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link href="/spots">
              もっと見る
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="relative mt-8">
          <div
            className="-mx-4 flex snap-x snap-proximity gap-4 overflow-x-auto px-4 pb-3 scrollbar-thin-hide sm:-mx-6 sm:gap-5 sm:px-6 lg:gap-6"
          >
            {spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                variant="carousel"
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/spots">
              もっと見る
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FutureFeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <div className="rounded-[1.125rem] border border-dashed border-border/85 bg-muted/65 px-5 py-8 sm:p-10">
        <SectionHeader
          eyebrow="COMING SOON"
          title="これからも育てていく機能"
          description="ご意見を見ながら、少しずつ足していく予定のことです。"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ComingSoonCard
            icon={MessageCircleHeart}
            phase="フェーズ 1 後半"
            title="みんなの投稿・更新"
            description="ログイン後にスポット追加や情報の修正案を書き込めるように。"
          />
          <ComingSoonCard
            icon={Cake}
            phase="フェーズ 2"
            title="月齢に合わせたお知らせ"
            description="健診・予防接種など、時期ごとのポイントをお届け。"
          />
          <ComingSoonCard
            icon={MapPinned}
            phase="フェーズ 3"
            title="ルート途中の休憩スポット"
            description="出発地〜目的地を入れて道中の赤ちゃんの駅などをひらめく機能。"
          />
        </div>
      </div>
    </section>
  );
}

function ComingSoonCard({
  icon: Icon,
  phase,
  title,
  description,
}: {
  icon: typeof MapPinned;
  phase: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-border/65 bg-card/95 px-5 py-[1.375rem] app-card-shadow">
      <Badge variant="muted" className="rounded-full font-medium">
        {phase}
      </Badge>
      <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <h3 className="font-display mt-3 text-[0.95rem] font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function CategorySection({
  counts,
}: {
  counts: Record<string, number>;
}) {
  return (
    <section className="border-t border-border/40 bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-[4.75rem] sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CATEGORIES"
          title="カテゴリから探す"
          description="12+1 のカテゴリ。複数タグがあるスポットは、ねらってない種類にも出てくるかも。"
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/spots?category=${c.id}`}
              className="group flex flex-col gap-[0.65rem] rounded-[1.125rem] border border-border bg-card p-5 transition-all app-card-shadow hover:border-primary/38 hover:bg-card hover:shadow-[var(--app-shadow)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-[2.625rem] w-[2.625rem] shrink-0 items-center justify-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <CategoryIcon
                    category={c.id}
                    className="h-[1.15rem] w-[1.15rem]"
                    strokeWidth={1.95}
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full font-normal tabular-nums"
                >
                  {counts[c.id] ?? 0}件
                </Badge>
              </div>
              <h3 className="font-display text-sm font-bold leading-snug tracking-tight text-foreground">
                {c.name}
              </h3>
              <p className="text-[0.7rem] leading-relaxed text-muted-foreground line-clamp-3 sm:text-[0.75rem]">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContributeCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 pb-24 md:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-secondary/85"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-washi-soft opacity-40 mix-blend-multiply dark:opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-14 h-[18rem] w-[18rem] rounded-full bg-primary/12 blur-[3.75rem]"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 pt-14 sm:px-6 sm:text-center lg:px-8">
        <div className="rounded-[1.25rem] border border-border bg-card px-6 py-[2.375rem] app-card-shadow sm:px-[2.875rem]">
          <Badge
            variant="outline"
            className="rounded-full border-accent/35 bg-accent/10 font-semibold text-accent"
          >
            ひとことが宝になる
          </Badge>
          <h2 className="font-display mt-4 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[1.825rem]">
            気づいたこと、ひとこと書いてみませんか
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            「この席は離乳食のこぼしても大丈夫そうだった」など一言があとから来る親のヒントになります。
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-[3rem] rounded-full px-10">
              <Link href="/contribute">
                スポットを投稿
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[3rem] rounded-full border-2 bg-background/90 px-8"
            >
              <Link href="/about">このサイトについて</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[1.725rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          {description}
        </p>
      )}
    </div>
  );
}
