"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { HomeGreetingHello } from "@/components/layout/home-greeting";
import { GoogleMyMapIframe } from "@/components/spots/google-mymap-section";
import { CATEGORY_MAP, MUNICIPALITIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategoryId, Spot, TagId } from "@/types/spot";

type TabId = "home" | "explore" | "events" | "support" | "saved";
type ExploreCatId = "all" | CategoryId;

const SAVED_STORAGE = "yamagata-kids-map-saved-slugs";

const QUICK_TILES: {
  label: string;
  icon: TagId | "rainy";
  accent: string;
  kind: "tag" | "category";
  id: TagId | CategoryId;
}[] = [
  {
    label: "おむつ替え",
    icon: "diaper-table",
    accent: "#E76F51",
    kind: "tag",
    id: "diaper-table",
  },
  {
    label: "授乳室",
    icon: "nursing-room",
    accent: "#F4A261",
    kind: "tag",
    id: "nursing-room",
  },
  {
    label: "屋内遊び場",
    icon: "rainy",
    accent: "#2A9D8F",
    kind: "category",
    id: "indoor-play",
  },
  {
    label: "公園",
    icon: "park" as TagId,
    accent: "#94B843",
    kind: "category",
    id: "park",
  },
  {
    label: "キッズメニュー",
    icon: "kids-menu",
    accent: "#7B5BA8",
    kind: "tag",
    id: "kids-menu",
  },
  {
    label: "雨の日OK",
    icon: "rainy",
    accent: "#5B8DEF",
    kind: "tag",
    id: "welcoming",
  },
];

const EXPLORE_CATEGORIES: {
  id: ExploreCatId;
  label: string;
  color: string;
}[] = [
  { id: "all", label: "すべて", color: "#666" },
  { id: "food", label: "飲食", color: "#F4A261" },
  { id: "park", label: "公園", color: "#6B8E4E" },
  { id: "indoor-play", label: "屋内", color: "#E76F51" },
  { id: "babystation", label: "赤ちゃんの駅", color: "#2A9D8F" },
  { id: "hospital", label: "病院", color: "#5B8DEF" },
];

function useWideDesktop(): boolean {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width:980px)");
    const r = () => setWide(mq.matches);
    r();
    mq.addEventListener("change", r);
    return () => mq.removeEventListener("change", r);
  }, []);
  return wide;
}

function slugPhotoColors(slug: string): [string, string, string] {
  let h = 0;
  for (let i = 0; i < slug.length; i++)
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  const c1 = `hsl(${hue} 70% 62%)`;
  const c2 = `hsl(${(hue + 52) % 360} 60% 50%)`;
  const c3 = `hsl(${hue} 85% 90%)`;
  return [c1, c2, c3];
}

function PhotoPlaceholder({
  colors,
  height,
  rounded,
}: {
  colors: readonly [string, string, string];
  height: number;
  rounded?: number;
}) {
  const r = rounded ?? 14;
  return (
    <div
      aria-hidden
      className="w-full shrink-0"
      style={{
        height,
        borderRadius: r,
        background: `linear-gradient(145deg, ${colors[0]} 0%, ${colors[1]} 52%, ${colors[2]} 100%)`,
      }}
    />
  );
}

function useSavedSlugs() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE);
      if (!raw) return;
      const p = JSON.parse(raw) as unknown;
      if (Array.isArray(p) && p.every((x) => typeof x === "string")) {
        setSlugs(p);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setSlugs(next);
    try {
      localStorage.setItem(SAVED_STORAGE, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      persist(
        slugs.includes(slug) ? slugs.filter((x) => x !== slug) : [...slugs, slug],
      );
    },
    [persist, slugs],
  );

  return { slugs, toggle };
}

function ZipLogo() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <circle cx="22" cy="22" r="20" fill="#fff" stroke="#E76F51" strokeWidth="1.5" />
      <path
        d="M14 22 Q22 12 30 22 Q22 32 14 22 Z"
        fill="#E76F51"
        opacity="0.85"
      />
      <circle cx="22" cy="22" r="3" fill="#2A9D8F" />
      <path
        d="M8 30 Q14 26 22 28 Q30 30 36 28"
        fill="none"
        stroke="#2A9D8F"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function MountainBackdrop() {
  return (
    <div className="zip-desktop-backdrop" aria-hidden>
      <svg className="zip-mountain-svg" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice">
        <path
          d="M0,500 L120,380 L220,440 L340,300 L460,420 L580,340 L720,400 L860,280 L1000,400 L1140,330 L1280,420 L1420,360 L1600,460 L1600,600 L0,600 Z"
          fill="#A88B6F"
          opacity="0.08"
        />
        <path
          d="M0,560 L160,460 L320,500 L500,420 L680,490 L860,440 L1040,500 L1240,440 L1440,490 L1600,520 L1600,600 L0,600 Z"
          fill="#E76F51"
          opacity="0.06"
        />
      </svg>
    </div>
  );
}

function ZipWideSiteHeader() {
  return (
    <header className="zip-wide-site-header" aria-label="サイト">
      <div className="zip-wide-brand">
        <ZipLogo />
        <div>
          <div className="zip-wide-brand-title">やまがた子育てマップ</div>
          <div className="zip-wide-brand-tag">庄内エリアの子育て家族のための情報サイト</div>
        </div>
      </div>
      <nav className="zip-wide-nav" aria-label="主要ページ">
        <Link href="/spots/" className="zip-wide-nav-link">
          スポット一覧
        </Link>
        <Link href="/subsidies/" className="zip-wide-nav-link">
          支援制度
        </Link>
        <Link href="/contribute/" className="zip-wide-nav-link">
          情報を投稿
        </Link>
        <Link
          href="https://kosodate.pref.yamagata.jp/odekake"
          className="zip-wide-nav-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          県・おでかけ検索
        </Link>
        <Link
          href="https://yamagatakanko.com/theme/kids/"
          className="zip-wide-nav-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          県観光・こども
        </Link>
      </nav>
    </header>
  );
}

function DesktopMetaAside({ className }: { className?: string }) {
  return (
    <aside className={cn("zip-desktop-meta", className)}>
      <div className="zip-dm-features">
        <div className="zip-dm-feat">
          <span>🗺</span>
          <span>庄内5市町のスポットを一覧とマップで</span>
        </div>
        <div className="zip-dm-feat">
          <span>🍼</span>
          <span>おむつ替え・授乳室など設備から絞れる</span>
        </div>
        <div className="zip-dm-feat">
          <span>📅</span>
          <span>イベント情報は順次コンテンツ化予定</span>
        </div>
        <div className="zip-dm-feat">
          <span>🏛️</span>
          <span>各市町・県の支援制度への入口あり</span>
        </div>
        <div className="zip-dm-feat">
          <span>🩺</span>
          <span>「病院」カテゴリで発見しやすい</span>
        </div>
      </div>
      <div className="zip-dm-note">
        サイト内データは親御さんの投稿・一覧から反映しています。
        <br />
        下のタブでスポットをさがしてください。
      </div>
    </aside>
  );
}

function ChevR() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="ml-auto opacity-40"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TabBarIcons({ id }: { id: TabId }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    fill: "none",
  };
  switch (id) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path
            d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "explore":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M12 3l-9 4v14l9-3 9 3V7l-9-4z" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 3v18M3 7l9 4 9-4" strokeWidth="1.6" />
        </svg>
      );
    case "events":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <rect x="4" y="6" width="16" height="14" rx="2" strokeWidth="1.6" />
          <path d="M4 10h16M9 4v4M15 4v4" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      );
    case "support":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path
            d="M12 21s-7-5-7-11a4 4 0 017-2 4 4 0 017 2c0 6-7 11-7 11z"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path
            d="M6 3h12v18l-6-4-6 4V3z"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function municipalityName(spot: Spot) {
  return MUNICIPALITIES.find((m) => m.code === spot.municipality)?.name ?? "";
}

function categoryLabel(cat: CategoryId) {
  return CATEGORY_MAP[cat]?.name ?? cat;
}

function SupportScreenEmbedded({ onClose }: { onClose: () => void }) {
  const linksOut = [
    {
      title: "やまがたわくわく体験ガイド（おでかけ・県公式）",
      href: "https://kosodate.pref.yamagata.jp/odekake",
    },
    {
      title: "子供が喜ぶ！遊び場＆イベント｜やまがたへの旅（観光・公式）",
      href: "https://yamagatakanko.com/theme/kids/",
    },
    {
      title: "山形県 にんべんネット（子育て支援）",
      href: "https://kosodate.pref.yamagata.jp/",
    },
    {
      title: "山形県 すこやか子育て支援情報",
      href: "https://www.pref.yamagata.jp/ou/kosodateshien/052013/sukoyaka.html",
    },
  ];
  return (
    <div className="screen support">
      <div className="page-header solo px-6">
        <button type="button" className="back" onClick={onClose}>
          ← ホームへ
        </button>
      </div>
      <div className="px-6 pb-28 pt-4">
        <div className="sup-note mb-10">
          <strong>📢 庄内エリアから</strong>
          <p>
            児童手当・助成などは各市町によります。「補助制度・支援ページ」へまずはどうぞ。
          </p>
        </div>
        <Link
          href="/subsidies/"
          className="btn-pri mb-6 inline-flex w-full rounded-full px-6 py-[11px] no-underline hover:opacity-[0.96]"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          庄内 5 市町の支援制度一覧をみる →
        </Link>
        {linksOut.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sup-card mx-0 mb-4 block pb-12 text-[inherit] shadow-[var(--shadow)] no-underline"
          >
            <h3 className="font-display text-[15px] text-[color:var(--accent)]">
              ▶︎ {l.title}
            </h3>
            <p className="mt-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
              {l.href}
            </p>
          </a>
        ))}
        <button
          type="button"
          className="link mt-12 text-[14px] font-semibold underline"
          onClick={onClose}
        >
          ホームにもどる
        </button>
      </div>
    </div>
  );
}

function SavedEmbedded({
  spots,
  saved,
  onNavExplore,
}: {
  spots: Spot[];
  saved: string[];
  onNavExplore: () => void;
}) {
  const items = spots.filter((s) => saved.includes(s.slug));

  return (
    <div className="screen saved">
      <div className="page-header solo px-6">
        <h1>保存したスポット</h1>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-emoji">📌</div>
          <p>
            「さがす」タブ一覧の ♡ をタップすると
            <br />
            ここからすぐひらけます
          </p>
          <button type="button" className="btn-pri px-14" onClick={onNavExplore}>
            探しにいく
          </button>
        </div>
      ) : (
        <div className="card-stack px-6 pb-28">
          {items.map((s) => (
            <Link
              key={s.id}
              href={`/spots/${s.slug}/`}
              className="spot-card wide no-underline"
            >
              <PhotoPlaceholder
                colors={slugPhotoColors(s.slug)}
                height={110}
                rounded={14}
              />
              <div className="sc-body">
                <div className="muted small sc-area">{municipalityName(s)}</div>
                <div className="sc-name">{s.name}</div>
                <div className="sc-meta muted small">
                  {categoryLabel(s.category)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** クイックアイコン（ZIP の UI に近い簡略 SVG） */
function QuickIconGlyph({ id }: { id: TagId | "rainy" | "park" }) {
  if (id === "rainy") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 13a5 5 0 119 0h2a3 3 0 010 6H7a4 4 0 01-1-6z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 21l1-2M12 22l1-2M16 21l1-2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === "diaper-table") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 9h16l-2 7H6L4 9z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "nursing-room") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === "kids-menu") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 4v8c0 2 2 3 3 3v5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M9 4v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M17 4c-2 0-3 2-3 5s1 4 3 4v7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  /* park / default tree */
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22V12M12 22H8M12 22h4M12 12L7 6h14L12 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function YamagataZipHome({
  spots,
  featured,
}: {
  spots: Spot[];
  featured: Spot[];
}) {
  const wide = useWideDesktop();
  const [tab, setTab] = useState<TabId>("home");
  const { slugs: savedSlugs, toggle: toggleSave } = useSavedSlugs();

  const [exploreCat, setExploreCat] = useState<ExploreCatId>("all");
  const [exploreTag, setExploreTag] = useState<TagId | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [exploreSel, setExploreSel] = useState<string>(spots[0]?.slug ?? "");

  const explored = useMemo(() => {
    let r = [...spots];
    if (exploreTag) r = r.filter((s) => s.tags.includes(exploreTag));
    else if (exploreCat !== "all")
      r = r.filter((s) => s.category === exploreCat || s.categories.includes(exploreCat));
    return r;
  }, [spots, exploreCat, exploreTag]);

  useEffect(() => {
    if (explored.length === 0) return;
    if (!explored.some((s) => s.slug === exploreSel))
      setExploreSel(explored[0]?.slug ?? "");
  }, [explored, exploreSel]);

  const openExploreWith = useCallback(
    (partial: Partial<{ cat: ExploreCatId; tag: TagId | null }>) => {
      if ("tag" in partial) setExploreTag(partial.tag ?? null);
      if ("cat" in partial && partial.cat !== undefined) setExploreCat(partial.cat);
      setTab("explore");
      setSheetExpanded(false);
    },
    [],
  );

  const tabs: { id: TabId; label: string }[] = [
    { id: "home", label: "ホーム" },
    { id: "explore", label: "さがす" },
    { id: "events", label: "イベント" },
    { id: "support", label: "子育て情報" },
    { id: "saved", label: "保存" },
  ];

  const featuredShow = featured.slice(0, 8);

  let screen: ReactNode = null;

  switch (tab) {
    case "home":
      screen = (
        <div className="screen home">
          <div className="greet-block">
            <div className="greet-row">
              <span className="greet-hello">
                <HomeGreetingHello />
              </span>
              <span className="greet-loc">📍庄内エリア</span>
            </div>
            <h1 className="greet-title">
              今日はどこで
              <br />
              遊ぶ？
            </h1>
          </div>

          <Link href="/spots/" className="search-bar mb-1">
            <IconSearch />
            <span>スポット、エリア、ジャンルで検索</span>
          </Link>

          <section className="hsec">
            <div className="hsec-head">
              <h2>近くのおすすめ</h2>
              <button type="button" className="link" onClick={() => setTab("explore")}>
                もっと見る →
              </button>
            </div>
            <div className="card-row">
              {featuredShow.map((s) => {
                const colors = slugPhotoColors(s.slug);
                return (
                  <Link
                    key={s.id}
                    href={`/spots/${s.slug}/`}
                    className="spot-card"
                  >
                    <PhotoPlaceholder
                      colors={colors}
                      height={130}
                      rounded={14}
                    />
                    <div className="sc-body">
                      <div className="sc-name">{s.name}</div>
                      <div className="sc-meta muted small">
                        {municipalityName(s)}・{categoryLabel(s.category)}
                      </div>
                      <div className="chip-row">
                        {(s.categories.slice(0, 3) ?? []).map((c) => (
                          <span key={c} className="chip">
                            {categoryLabel(c)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="hsec">
            <div className="hsec-head">
              <h2>今週のイベント</h2>
              <button type="button" className="link" onClick={() => setTab("events")}>
                すべて →
              </button>
            </div>
            <div className="event-stack">
              <div className="event-card">
                <div className="event-date">
                  <span className="ed-mo text-xs">INFO</span>
                  <span className="ed-dy text-lg">!</span>
                </div>
                <div className="event-body">
                  <div className="event-tag text-[color:var(--accent)]">
                    庄内エリア・お知らせ
                  </div>
                  <div className="event-title">イベント一覧は順次コンテンツ化予定</div>
                  <div className="event-kids">
                    <span className="kchip">詳細確認</span>
                    <span className="kchip">各市のサイトへ</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="hsec">
            <h2 style={{ marginBottom: 12 }}>条件で探す</h2>
            <div className="quick-grid">
              {QUICK_TILES.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  className="quick-tile"
                  onClick={() => {
                    if (f.kind === "tag") {
                      openExploreWith({ cat: "all", tag: f.id as TagId });
                    } else {
                      openExploreWith({ cat: f.id as CategoryId, tag: null });
                    }
                  }}
                >
                  <div
                    className="quick-icon text-[inherit]"
                    style={{
                      background: `${f.accent}22`,
                      color: f.accent,
                    }}
                  >
                    <QuickIconGlyph id={f.icon} />
                  </div>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="hsec">
            <div className="hsec-head">
              <h2>子育てのお役立ち情報</h2>
            </div>
            <div className="info-stack">
              <button type="button" className="info-card" onClick={() => setTab("support")}>
                <div className="ic-emoji">🏛️</div>
                <div>
                  <div className="ic-title">各市町・県の支援制度</div>
                  <div className="ic-sub">補助金・総合情報ページへのリンク</div>
                </div>
                <ChevR />
              </button>
              <Link href="/spots/?category=hospital" className="info-card">
                <div className="ic-emoji">🩺</div>
                <div>
                  <div className="ic-title">小児科・クリニック</div>
                  <div className="ic-sub">「病院」カテゴリを一覧で表示</div>
                </div>
                <ChevR />
              </Link>
              <a
                href="https://kosodate.pref.yamagata.jp/odekake"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card"
              >
                <div className="ic-emoji">🗺️</div>
                <div>
                  <div className="ic-title">県公式｜わくわく体験ガイド</div>
                  <div className="ic-sub">
                    地図・体験種別から施設や公園を検索（山形県子育て応援サイト）
                  </div>
                </div>
                <ChevR />
              </a>
              <a
                href="https://yamagatakanko.com/theme/kids/"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card"
              >
                <div className="ic-emoji">🎒</div>
                <div>
                  <div className="ic-title">観光公式｜子どもにおすすめ</div>
                  <div className="ic-sub">
                    県公式観光サイトのこども向け一覧（遊び場・イベント等）
                  </div>
                </div>
                <ChevR />
              </a>
            </div>
          </section>

          <div style={{ height: 20 }} />
        </div>
      );
      break;
    case "explore":
      screen = (
        <div className="screen explore">
          <div className="explore-search">
            <Link href="/spots/" className="search-bar mini inline-flex cursor-pointer items-center gap-3">
              <IconSearch />
              <span>庄内地域のスポット</span>
            </Link>
            <div className="cat-row">
              {EXPLORE_CATEGORIES.map((c) => {
                const on =
                  exploreTag === null && exploreCat === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={cn("cat-chip transition-colors")}
                    style={
                      on
                        ? { background: c.color, color: "#fff", borderColor: c.color }
                        : {}
                    }
                    onClick={() => {
                      setExploreTag(null);
                      setExploreCat(c.id);
                      setExploreSel("");
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="explore-main">
            <div className="map-wrap">
            <div className="h-full min-h-[280px] w-full bg-[#eae3d2] [&_iframe]:min-h-[240px]">
              <GoogleMyMapIframe className="h-full rounded-none border-0 shadow-none" minHeight="min-h-[280px]" />
            </div>
            <button type="button" className="map-locate pointer-events-none" aria-hidden />
            </div>

            <div className={cn("bottom-sheet", sheetExpanded ? "expanded" : "")}>
            <button
              type="button"
              className="sheet-grab w-full border-0 bg-transparent"
              onClick={() => setSheetExpanded(!sheetExpanded)}
            >
              <div className="grab-bar" />
            </button>
            <div className="sheet-head">
              <span>{explored.length}件のスポット</span>
              <button type="button" className="sort link">
                （マップまたは一覧ページで詳しく）
              </button>
            </div>
            <div className="sheet-list pt-2">
              {explored.slice(0, 48).map((s) => {
                const cols = slugPhotoColors(s.slug);
                const sel = exploreSel === s.slug;
                return (
                  <div key={s.id} className="flex gap-4">
                    <Link
                      href={`/spots/${s.slug}/`}
                      className={cn(
                        "list-row min-w-0 flex-1",
                        sel ? "on" : "",
                      )}
                      onFocus={() => setExploreSel(s.slug)}
                      onMouseEnter={() => setExploreSel(s.slug)}
                    >
                      <div className="lr-thumb">
                        <PhotoPlaceholder colors={cols} height={64} rounded={12} />
                      </div>
                      <div className="lr-body min-w-0">
                        <div className="lr-top">
                          <span className="lr-area">{municipalityName(s)}</span>
                          <span className="text-[#888]">
                            · {categoryLabel(s.category)}
                          </span>
                        </div>
                        <div className="lr-name truncate">{s.name}</div>
                        <div className="lr-tags flex flex-wrap gap-1">
                          {s.tags.some((x) => x === "diaper-table") ? (
                            <span className="tag-mini">おむつ</span>
                          ) : null}
                          {s.tags.some((x) => x === "nursing-room") ? (
                            <span className="tag-mini">授乳室</span>
                          ) : null}
                          {s.tags.some((x) => x === "kids-menu") ? (
                            <span className="tag-mini">キッズMENU</span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      className="mt-[10px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 text-lg text-[color:var(--accent)] hover:bg-black/5"
                      aria-label={savedSlugs.includes(s.slug) ? "保存済み" : "保存"}
                      title="保存したスポット"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSave(s.slug);
                      }}
                    >
                      {savedSlugs.includes(s.slug) ? "♥" : "♡"}
                    </button>
                  </div>
                );
              })}
              {explored.length === 0 && (
                <p className="px-6 py-6 text-center text-sm" style={{ color: "var(--muted)" }}>
                  条件にあうスポットがありません。
                  <Link className="font-semibold underline" style={{ color: "var(--accent)" }} href="/spots/">
                    一覧で条件を変更
                  </Link>
                </p>
              )}
            </div>
            </div>
          </div>
        </div>
      );
      break;
    case "events":
      screen = (
        <div className="screen events">
          <div className="page-header solo">
            <button type="button" className="back" onClick={() => setTab("home")}>
              ← 戻る
            </button>
            <h1>イベント</h1>
          </div>
          <div className="event-stack px-6 pb-[90px]">
            <div className="sup-note">
              <strong>コンテンツは準備中です</strong>
              <p>
                イベント情報は現在、各市町や施設サイトでご確認いただける場合が多いです。
                「今週のイベント」一覧は順次コンテンツ化します。
              </p>
            </div>
            <div className="sup-card mb-24">
              <div className="sup-head mb-3">
                <span className="sup-city font-display">庄内</span>
              </div>
              <h3 className="font-display">公式情報を見る（例）</h3>
              <p className="mb-6 text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                市町のサイトで最新の親子イベントをチェックしてください。
              </p>
              <Link className="btn-pri mx-auto mb-10 inline-flex" href="/spots/?category=museum">
                ミュージアム・イベント系スポット
              </Link>
            </div>
          </div>
        </div>
      );
      break;
    case "support":
      screen = (
        <SupportScreenEmbedded onClose={() => setTab("home")} />
      );
      break;
    case "saved":
      screen = (
        <SavedEmbedded
          spots={spots}
          saved={savedSlugs}
          onNavExplore={() => setTab("explore")}
        />
      );
      break;
  }

  const appInner = (
    <div
      id="yamagata-zip-root"
      data-wide-layout={wide ? "true" : "false"}
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col",
        !wide && "min-h-[100dvh] min-h-[100svh]",
      )}
    >
      <div className="app min-h-0 flex-1" data-theme="warm">
        {screen}
        <nav className="tab-bar" aria-label="メイン">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={cn("tab-btn", tab === t.id ? "on" : "")}
              onClick={() => setTab(t.id)}
            >
              <span className="tb-ic" aria-hidden>
                <TabBarIcons id={t.id} />
              </span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return wide ? (
    <div id="yamagata-zip-desktop">
      <div className="zip-desktop-bg zip-desktop-shell zip-shell-wide">
        <MountainBackdrop />
        <ZipWideSiteHeader />
        <div className="zip-wide-body">
          <div className="zip-wide-main">{appInner}</div>
          <DesktopMetaAside />
        </div>
      </div>
    </div>
  ) : (
    <div id="yamagata-zip-desktop" className="zip-mobile-shell">
      {appInner}
    </div>
  );
}