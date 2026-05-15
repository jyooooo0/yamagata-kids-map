import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CircleCheck,
  Compass,
  Heart,
  Leaf,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "やまがた子育てマップのコンセプト、運営方針、ロードマップについて。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          ABOUT
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          山形・庄内の子育てを、
          <br />
          地域でアップデートしていく地図。
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          「ここは小上がりがあって助かった」「夜間の小児科がやっと見つかった」
          ── 子育て中の親が体験して知った情報を、地域でシェアして使いまわせる場所を目指しています。
        </p>
      </header>

      <section className="mt-14 space-y-6">
        <SectionTitle eyebrow="MISSION" title="このサイトが解決したいこと" />
        <div className="grid gap-5 sm:grid-cols-2">
          <ProblemCard
            icon={Compass}
            title="外出の不安を減らす"
            description="子連れで初めて行くお店、おむつ替えがある場所、雨でも遊べる屋内施設。出かける前のリサーチ時間を短縮します。"
          />
          <ProblemCard
            icon={Leaf}
            title="成長に伴走する"
            description="月齢が変わるたびに必要な情報も変わります。お子さんの誕生日から、健診・補助制度・遊び場の情報を順に届けます（Phase 2）。"
          />
          <ProblemCard
            icon={Users}
            title="親同士でアップデートする"
            description="店舗の最新状況・新しいスポット・知る人ぞ知る情報を、ログインユーザーが投稿して育てていく場所にします（Phase 1 後半）。"
          />
          <ProblemCard
            icon={Heart}
            title="補助制度を分かりやすく"
            description="鶴岡市・酒田市・三川町・庄内町・遊佐町の制度を、ひとつの場所から横断的に見られるようにします。"
          />
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <SectionTitle eyebrow="ROADMAP" title="リリース計画" />

        <ol className="space-y-4">
          <RoadmapItem
            phase="Phase 1A"
            status="completed"
            title="基盤＋スポット閲覧"
            items={[
              "Next.js + Firebase + Tailwind v4 + Cloudflare Pages の基盤構築",
              "鶴岡市を中心とした既存スポットの再構築",
              "カテゴリ・タグ・市町フィルタによる検索",
              "庄内5市町の補助制度リンク集",
            ]}
          />
          <RoadmapItem
            phase="Phase 1B"
            status="next"
            title="ユーザー投稿・口コミ"
            items={[
              "メール／Google／LINE ログイン",
              "スポット追加・口コミ・写真・タグ追加",
              "初回投稿は承認制、信頼スコアによる自動公開",
              "病院・子どもカット対応美容室のカテゴリ充実",
            ]}
          />
          <RoadmapItem
            phase="Phase 2"
            status="planned"
            title="月齢パーソナライズ"
            items={[
              "お子さんの誕生日を登録（複数人対応）",
              "月齢別おすすめスポット・健診タイミング・補助制度の通知",
              "メール／LINE 通知連携",
            ]}
          />
          <RoadmapItem
            phase="Phase 3"
            status="planned"
            title="ルート × おむつ替え"
            items={[
              "出発地・目的地を入れると、道中の赤ちゃんの駅を提案",
              "お気に入り・行きたいリスト",
              "県全域への対応エリア拡大",
            ]}
          />
        </ol>
      </section>

      <section className="mt-14 space-y-4">
        <SectionTitle eyebrow="POLICY" title="運営方針" />
        <Card>
          <CardContent className="space-y-3 p-6 text-sm leading-relaxed">
            <p>
              <strong>非営利・地域貢献を目的に運営します。</strong>{" "}
              掲載店舗・施設からの広告掲載料は受け取りません。
            </p>
            <p>
              <strong>情報の鮮度を大切にします。</strong>{" "}
              投稿・口コミには日付を表示し、古い情報は明示的にマークします。
            </p>
            <p>
              <strong>プライバシーを守ります。</strong>{" "}
              お子さんの誕生日などの個人情報は、通知の最適化以外には利用しません。第三者提供は行いません。
            </p>
            <p>
              <strong>オープンソースです。</strong>{" "}
              コードは GitHub で公開し、誰でも改善提案ができます。
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="mt-14 flex flex-col items-start gap-3 rounded-xl bg-primary/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold">
            「こんな機能ほしい」を聞かせてください
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            このサイトは庄内の親たちの声で育てます。
          </p>
        </div>
        <Button asChild>
          <Link href="/feedback">
            ご意見を送る
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-2xl font-bold tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function ProblemCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Compass;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="font-display mt-3 text-base font-bold tracking-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

type RoadmapStatus = "completed" | "next" | "planned";

function RoadmapItem({
  phase,
  status,
  title,
  items,
}: {
  phase: string;
  status: RoadmapStatus;
  title: string;
  items: string[];
}) {
  const statusLabel: Record<RoadmapStatus, string> = {
    completed: "進行中",
    next: "近日",
    planned: "今後",
  };
  const statusClass: Record<RoadmapStatus, string> = {
    completed: "bg-primary text-primary-foreground",
    next: "bg-accent text-accent-foreground",
    planned: "bg-muted text-muted-foreground",
  };

  return (
    <li className="relative flex gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col items-center gap-1">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass[status]}`}
        >
          {statusLabel[status]}
        </span>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
          {phase}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-display text-base font-bold tracking-tight">
          {title}
        </h3>
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85"
            >
              <CircleCheck
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  status === "completed" ? "text-primary" : "text-muted-foreground/50"
                }`}
                strokeWidth={1.8}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
