import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Cake,
  HandHeart,
  MapPinned,
  MessageCircleHeart,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/spots/category-icon";
import { SpotCard } from "@/components/spots/spot-card";
import { CATEGORIES } from "@/lib/categories";
import { getCategoryCounts, getFeaturedSpots } from "@/lib/places";

export default function HomePage() {
  const counts = getCategoryCounts();
  const featured = getFeaturedSpots(6);
  const totalSpots = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <Hero totalSpots={totalSpots} />
      <FeatureBand />
      <CategorySection counts={counts} />
      <FeaturedSpotsSection spots={featured} />
      <FutureFeaturesSection />
      <ContributeCTA />
    </>
  );
}

function Hero({ totalSpots }: { totalSpots: number }) {
  return (
    <section className="relative overflow-hidden bg-rice-field">
      <div
        aria-hidden
        className="absolute inset-0 bg-washi opacity-60"
      />
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3.5 py-1.5 text-xs font-medium text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          庄内エリアから先行リリース中
        </div>

        <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          庄内の子育てを、
          <br className="hidden sm:block" />
          みんなで
          <span className="relative inline-block px-1">
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1.5 h-3 -skew-x-6 rounded-sm bg-primary/30"
            />
            <span className="relative text-primary">あたためる</span>
          </span>
          地図。
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
          小上がりのあるお店、おむつ替えできる場所、夜間の小児科、子どもカット対応の美容室、お住まいの市町の補助制度。
          <br className="hidden md:block" />
          山形・庄内で子育てするときに「ちょっと先に知っておきたかった」を、地域でアップデートしていく場所です。
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="text-base">
            <Link href="/spots">
              スポットを探す
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base">
            <Link href="/subsidies">補助制度を見る</Link>
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-6 border-t border-border/60 pt-6 sm:gap-12">
          <Stat label="掲載スポット" value={`${totalSpots}件`} />
          <Stat label="対象エリア" value="庄内5市町" />
          <Stat label="運営" value="非営利" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        {value}
      </dd>
      <dt className="mt-1 text-xs font-medium tracking-wider text-muted-foreground">
        {label}
      </dt>
    </div>
  );
}

function FeatureBand() {
  const features = [
    {
      icon: MapPinned,
      title: "子連れで行ける場所",
      desc: "小上がり・キッズメニュー・授乳室のタグで絞り込み",
    },
    {
      icon: Baby,
      title: "おむつ替えスペース",
      desc: "目的地までの道中で立ち寄れる場所も探せる",
    },
    {
      icon: Stethoscope,
      title: "病院・健康",
      desc: "小児科・夜間救急・健診をまとめてチェック",
    },
    {
      icon: HandHeart,
      title: "市町の補助制度",
      desc: "鶴岡・酒田・三川・庄内・遊佐の制度リンク集",
    },
  ];
  return (
    <section className="border-y border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-px overflow-hidden bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-3 bg-background px-5 py-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold tracking-tight">
                {title}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategorySection({
  counts,
}: {
  counts: Record<string, number>;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="CATEGORIES"
        title="カテゴリから探す"
        description="目的に合わせて12+1のカテゴリから。1つのスポットに複数のカテゴリを付けられるので、思わぬ発見もあります。"
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/spots?category=${c.id}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon
                  category={c.id}
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>
              <Badge variant="muted" className="font-normal">
                {counts[c.id] ?? 0}件
              </Badge>
            </div>
            <h3 className="font-display text-sm font-bold leading-tight tracking-tight">
              {c.name}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {c.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedSpotsSection({
  spots,
}: {
  spots: ReturnType<typeof getFeaturedSpots>;
}) {
  return (
    <section className="bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            eyebrow="PICK UP"
            title="今日見つかったスポット"
            description="カテゴリを横断して、運営がピックアップした6件。"
            className="max-w-2xl"
          />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/spots">
              すべて見る
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/spots">
              すべて見る
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
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="COMING SOON"
        title="これから増えていく機能"
        description="MVP公開後、地域の声を聞きながら段階的に追加していきます。"
      />

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <ComingSoonCard
          icon={MessageCircleHeart}
          phase="Phase 1 後半"
          title="ユーザー投稿で情報更新"
          description="ログインして、新しいスポットを追加したり、口コミ・写真・タグの付け直しができるように。"
        />
        <ComingSoonCard
          icon={Cake}
          phase="Phase 2"
          title="月齢に合わせた情報配信"
          description="お子さんの誕生日を登録すると、健診・予防接種・離乳食・補助制度などのタイミングをお知らせ。"
        />
        <ComingSoonCard
          icon={MapPinned}
          phase="Phase 3"
          title="ルート上のおむつ替え検索"
          description="出発地と目的地を入れると、道中で立ち寄れる赤ちゃんの駅を提案。庄内は車移動が多いから本当に欲しい機能。"
        />
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
    <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card p-6">
      <Badge variant="muted" className="font-normal">
        {phase}
      </Badge>
      <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-6 w-6" strokeWidth={1.6} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ContributeCTA() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary to-primary/85"
      />
      <div aria-hidden className="absolute inset-0 bg-washi opacity-20" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-start gap-5 px-4 py-16 text-primary-foreground sm:items-center sm:px-6 sm:text-center sm:py-20">
        <Badge
          variant="outline"
          className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground"
        >
          このサイトは地域でつくります
        </Badge>
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          知っている場所、教えてもらえませんか。
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/90">
          「ここは小上がりがあって助かった」「夜間の小児科をやっと見つけた」
          ──そんな一言が、次に同じ場面で困る誰かを助けます。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/contribute">
              スポットを投稿する
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/about">サイトについて</Link>
          </Button>
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
      <h2 className="font-display mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
