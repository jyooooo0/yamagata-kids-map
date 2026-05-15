import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MUNICIPALITIES } from "@/lib/categories";
import type { MunicipalityCode } from "@/types/spot";

export const metadata: Metadata = {
  title: "補助制度・支援",
  description:
    "庄内エリア（鶴岡市・酒田市・三川町・庄内町・遊佐町）の子育てに関する補助制度・支援情報の入口。",
};

/**
 * Phase 1 ではまず「公式情報への入口」として各市町の子育て支援ページへリンク集を提供する。
 * Phase 1C で詳細な制度データ（対象月齢、金額、申請方法など）を Firestore で管理する予定。
 */

type SubsidyCategory =
  | "medical"
  | "childcare"
  | "birth"
  | "education"
  | "housing"
  | "general";

const SUBSIDY_CATEGORY_LABEL: Record<SubsidyCategory, string> = {
  general: "総合窓口",
  medical: "医療費",
  childcare: "保育・教育",
  birth: "出産・産後",
  education: "就学・進学",
  housing: "住まい・移住",
};

interface MunicipalityLink {
  category: SubsidyCategory;
  title: string;
  url: string;
  note?: string;
}

const MUNICIPALITY_LINKS: Record<MunicipalityCode, MunicipalityLink[]> = {
  tsuruoka: [
    {
      category: "general",
      title: "鶴岡市 子育て情報サイト",
      url: "https://www.city.tsuruoka.lg.jp/kosodate/",
      note: "市の子育て支援の入口。妊娠・出産・健診・保育・手当などを横断的に案内。",
    },
    {
      category: "medical",
      title: "鶴岡市 こども医療費助成",
      url: "https://www.city.tsuruoka.lg.jp/kenko/iryo/iryohi-josei.html",
    },
    {
      category: "childcare",
      title: "鶴岡市 保育園・幼稚園・認定こども園",
      url: "https://www.city.tsuruoka.lg.jp/kosodate/hoiku/",
    },
  ],
  sakata: [
    {
      category: "general",
      title: "酒田市 子育て応援ページ",
      url: "https://www.city.sakata.lg.jp/kosodate/",
    },
    {
      category: "medical",
      title: "酒田市 子ども医療費給付",
      url: "https://www.city.sakata.lg.jp/kenko_iryo/kenko/iryo/index.html",
    },
  ],
  mikawa: [
    {
      category: "general",
      title: "三川町 子育て支援",
      url: "https://www.town.mikawa.yamagata.jp/kurashi/kodomo/",
    },
  ],
  shonai: [
    {
      category: "general",
      title: "庄内町 子育て情報",
      url: "https://www.town.shonai.lg.jp/soshiki/kosodate/",
    },
  ],
  yuza: [
    {
      category: "general",
      title: "遊佐町 子育て・教育",
      url: "https://www.town.yuza.yamagata.jp/kurashi/kosodate/",
    },
  ],
  other: [],
};

export default function SubsidiesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          SUPPORT
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          補助制度・支援
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          庄内5市町の子育てに関する制度ページへの入口です。
          詳しい対象月齢・金額・申請方法は各市町の公式情報をご確認ください。
        </p>
      </header>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Phase 1 では公式情報へのリンク集として提供
          </p>
          <p className="text-muted-foreground">
            次フェーズで、各制度の対象月齢・金額・申請窓口を構造化したデータで横断検索できるようにする予定です。
            子どもの誕生日を登録すると「いま使える制度」がレコメンドされる機能も予定しています。
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {MUNICIPALITIES.map((m) => {
          const links = MUNICIPALITY_LINKS[m.code] ?? [];
          return (
            <section key={m.code} className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium tracking-wider text-muted-foreground">
                    {m.kana.toUpperCase()}
                  </p>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {m.name}
                  </h2>
                </div>
                <Badge variant="outline">{links.length}件</Badge>
              </div>

              {links.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                  この市町の制度リンクはこれから整理して追加していきます。
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {links.map((link) => (
                    <Card key={link.url} className="h-full">
                      <CardHeader className="pb-2">
                        <Badge variant="muted" className="mb-2 w-fit font-normal">
                          {SUBSIDY_CATEGORY_LABEL[link.category]}
                        </Badge>
                        <CardTitle className="text-base">{link.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {link.note && (
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {link.note}
                          </p>
                        )}
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            公式ページを開く
                            <ExternalLink />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-16 rounded-xl border border-border bg-secondary/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          掲載している制度・リンクが古い、抜けている等あれば
        </p>
        <p className="mt-2">
          <Link
            href="/contact"
            className="font-medium text-primary hover:underline"
          >
            修正依頼フォームから教えてください →
          </Link>
        </p>
      </div>
    </div>
  );
}
