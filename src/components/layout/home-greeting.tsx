"use client";

/** ZIP モック準拠：時間帯に応じたあいさつ */
export function HomeGreetingHello() {
  const hour = new Date().getHours();
  const hello =
    hour < 11 ? "おはようございます" : hour < 17 ? "こんにちは" : "こんばんは";

  return <span suppressHydrationWarning>{hello}</span>;
}
