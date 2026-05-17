"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import type { MunicipalityCode } from "@/types/spot";
import { AlertCircle, Loader2 } from "lucide-react";

import { COLLECTIONS, getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { MUNICIPALITY_OPTIONS } from "@/lib/municipality";

export type SpotContributionType = "spot_new" | "spot_correction";

export interface ExistingSpotChoice {
  id: string;
  slug: string;
  name: string;
  municipality: MunicipalityCode;
}

export interface SpotContributionPayloadInput {
  name: string;
  municipality: MunicipalityCode;
  address: string;
  officialUrl: string;
  body: string;
  /** correction のときのみ */
  targetSlug?: string;
  categoryHint: string;
}

function validatePayload(
  type: SpotContributionType,
  p: SpotContributionPayloadInput,
): string | null {
  if (!p.body.trim()) return "伝えたい内容を入力してください";
  if (p.body.trim().length < 10) return "内容は10文字以上で入力してください";
  if (type === "spot_new" && !p.name.trim()) return "スポット名を入力してください";
  if (type === "spot_correction" && !p.targetSlug) return "修正したいスポットを選んでください";
  return null;
}

export async function submitSpotContribution(
  type: SpotContributionType,
  payload: SpotContributionPayloadInput,
  contactEmail: string | null,
): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("認証の準備ができていません。少し待ってから再度お試しください。");

  const db = getFirebaseDb();
  const firestorePayload: Record<string, unknown> = {
    name: payload.name.trim(),
    municipality: payload.municipality,
    address: payload.address.trim() || null,
    officialUrl: payload.officialUrl.trim() || null,
    body: payload.body.trim(),
    categoryHint: payload.categoryHint.trim() || null,
  };
  if (type === "spot_correction" && payload.targetSlug) {
    firestorePayload.correctionTargetSlug = payload.targetSlug;
  }

  await addDoc(collection(db, COLLECTIONS.spotSubmissions), {
    type,
    status: "pending",
    submitterUid: user.uid,
    contactEmail: contactEmail?.trim() || null,
    payload: firestorePayload,
    createdAt: serverTimestamp(),
  });
}

interface ContributeFormProps {
  existingSpots: ExistingSpotChoice[];
}

export function ContributeForm({ existingSpots }: ContributeFormProps) {
  const configured = isFirebaseConfigured();
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [type, setType] = useState<SpotContributionType>("spot_new");
  const [targetSlug, setTargetSlug] = useState("");
  const [name, setName] = useState("");
  const [municipality, setMunicipality] = useState<MunicipalityCode>("tsuruoka");
  const [address, setAddress] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [categoryHint, setCategoryHint] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (cancelled) return;
      if (user) {
        setAuthReady(true);
        setAuthError(null);
        return;
      }
      signInAnonymously(auth)
        .then(() => {
          if (!cancelled) setAuthReady(true);
        })
        .catch((e: unknown) => {
          const msg =
            e instanceof Error ? e.message : "匿名ログインに失敗しました";
          if (!cancelled) {
            setAuthError(msg);
            setAuthReady(false);
          }
        });
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, [configured]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload: SpotContributionPayloadInput = {
      name: type === "spot_correction" ? nameFromSelection() : name,
      municipality,
      address,
      officialUrl,
      body,
      targetSlug: type === "spot_correction" ? targetSlug : undefined,
      categoryHint,
    };
    const err = validatePayload(type, payload);
    if (err) {
      setFormError(err);
      return;
    }
    setSubmitting(true);
    try {
      await submitSpotContribution(type, payload, email || null);
      setDone(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "送信に失敗しました";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  function nameFromSelection(): string {
    const s = existingSpots.find((x) => x.slug === targetSlug);
    return s?.name ?? "";
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
        <p className="flex items-start gap-2 font-medium text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          この環境では Firebase が未設定のため、投稿を受け付けられません。
        </p>
        <p className="mt-3">
          リポジトリの <code className="rounded bg-muted px-1 py-0.5 text-xs">README.md</code>{" "}
          に従い <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>{" "}
          を設定したうえで、匿名認証を Firebase Console で有効化してください。
        </p>
        <Button asChild className="mt-4">
          <Link href="https://github.com/jyooooo0/yamagata-kids-map/blob/main/docs/FIREBASE.md" target="_blank" rel="noopener noreferrer">
            運営向けセットアップ手順（FIREBASE.md）
          </Link>
        </Button>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        {authError}
      </div>
    );
  }

  if (!authReady) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        認証を準備しています…
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-sm leading-relaxed">
        <p className="font-display font-semibold text-foreground">
          送信ありがとうございました
        </p>
        <p className="mt-2 text-muted-foreground">
          内容は運営が Firebase Console の「spotSubmissions」で確認し、問題なければデータに反映します（反映まで数日かかる場合があります）。
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/spots">スポット一覧へ</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">投稿の種類</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="ctype"
              checked={type === "spot_new"}
              onChange={() => setType("spot_new")}
              className="accent-primary"
            />
            新しいスポットを登録したい
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="ctype"
              checked={type === "spot_correction"}
              onChange={() => setType("spot_correction")}
              className="accent-primary"
            />
            既掲載スポットの修正・追記
          </label>
        </div>
      </fieldset>

      {type === "spot_correction" && (
        <div className="space-y-2">
          <label htmlFor="target" className="text-sm font-medium text-foreground">
            修正したいスポット
          </label>
          <select
            id="target"
            required
            value={targetSlug}
            onChange={(e) => {
              const slug = e.target.value;
              setTargetSlug(slug);
              const sel = existingSpots.find((x) => x.slug === slug);
              if (sel) setMunicipality(sel.municipality);
            }}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">選択してください</option>
            {existingSpots.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {type === "spot_new" && (
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            スポット名 <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="例：〇〇児童館"
            maxLength={120}
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="muni" className="text-sm font-medium text-foreground">
          市町 <span className="text-destructive">*</span>
        </label>
        <select
          id="muni"
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value as MunicipalityCode)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {MUNICIPALITY_OPTIONS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="addr" className="text-sm font-medium text-foreground">
          住所（わかる範囲で）
        </label>
        <input
          id="addr"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="山形県鶴岡市…"
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium text-foreground">
          公式サイト・SNS（任意）
        </label>
        <input
          id="url"
          type="url"
          value={officialUrl}
          onChange={(e) => setOfficialUrl(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="https://"
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="cat" className="text-sm font-medium text-foreground">
          カテゴリの希望（任意・自由記述）
        </label>
        <input
          id="cat"
          value={categoryHint}
          onChange={(e) => setCategoryHint(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="例：室内遊び、カフェ、赤ちゃんの駅 など"
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-foreground">
          伝えたい内容 <span className="text-destructive">*</span>
        </label>
        <textarea
          id="body"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="営業時間の訂正、子連れ向け設備、駐車場の有無、公式情報のURL など、具体的に書いてください。"
          maxLength={4000}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          連絡用メール（任意・返信が必要なとき）
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="name@example.com"
          maxLength={200}
        />
      </div>

      {formError && (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            送信中…
          </>
        ) : (
          "Firestore に送信する"
        )}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        送信内容は個人を特定しない範囲でサイト改善に利用します。匿名アカウントで送信されます（Firebase
        Console で uid を確認できます）。
      </p>
    </form>
  );
}
