/**
 * 提供デザイン（山形子どもマップ.zip）のブランド記号を Web 向けに再現。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="44"
      height="44"
      viewBox="0 0 44 44"
      aria-hidden
    >
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
