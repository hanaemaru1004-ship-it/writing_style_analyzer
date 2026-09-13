export const THEME_COLORS = [
  {
    name: "サンシャイン",
    class: "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300/30",
    value: "sunshine",
    accent: "#FCD34D",
  },
  {
    name: "ブロッサム",
    class: "bg-gradient-to-br from-pink-100 to-rose-200 border-pink-300/30",
    value: "blossom",
    accent: "#FB7185",
  },
  {
    name: "オーシャン",
    class: "bg-gradient-to-br from-sky-100 to-blue-200 border-blue-300/30",
    value: "ocean",
    accent: "#60A5FA",
  },
  {
    name: "フォレスト",
    class: "bg-gradient-to-br from-emerald-100 to-green-200 border-green-300/30",
    value: "forest",
    accent: "#34D399",
  },
  {
    name: "ラベンダー",
    class: "bg-gradient-to-br from-purple-100 to-violet-200 border-purple-300/30",
    value: "lavender",
    accent: "#A78BFA",
  },
  {
    name: "サンセット",
    class: "bg-gradient-to-br from-orange-100 to-amber-200 border-orange-300/30",
    value: "sunset",
    accent: "#F59E0B",
  },
  {
    name: "ミスト",
    class: "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300/30",
    value: "mist",
    accent: "#64748B",
  },
  {
    name: "ミント",
    class: "bg-gradient-to-br from-teal-100 to-cyan-200 border-teal-300/30",
    value: "mint",
    accent: "#14B8A6",
  },
] as const;

export type ThemeColor = (typeof THEME_COLORS)[number]["value"];

export function getThemeColor(index: number) {
  return THEME_COLORS[((index % THEME_COLORS.length) + THEME_COLORS.length) % THEME_COLORS.length];
}

export function findThemeColor(value: ThemeColor) {
  return THEME_COLORS.find((theme) => theme.value === value) ?? THEME_COLORS[0];
}

/** 分析入力の最大文字数 */
export const MAX_INPUT_LENGTH = 2000;

/** ローカルストレージに保持する履歴の最大件数 */
export const MAX_HISTORY_ITEMS = 5;

export const HISTORY_STORAGE_KEY = "writing-style-analyzer:history";

/**
 * 無料枠の中でレスポンスが速いモデルとして選定。
 * 選定根拠は README.md を参照。
 */
export const GEMINI_MODEL = "gemini-3.5-flash-lite";
