import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.inputText === "string" &&
    typeof record.markdown === "string" &&
    typeof record.themeColor === "string"
  );
}

export function loadHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isAnalysisResult).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

function persistHistory(items: AnalysisResult[]): AnalysisResult[] {
  const trimmed = items.slice(0, MAX_HISTORY_ITEMS);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // 保存領域が満杯などの理由で失敗しても、アプリの動作は継続する
    }
  }

  return trimmed;
}

/** 履歴の先頭に新しい結果を追加し、最大件数を超えた古いものを取り除く */
export function addToHistory(
  history: AnalysisResult[],
  result: AnalysisResult
): AnalysisResult[] {
  return persistHistory([result, ...history]);
}

export function removeFromHistory(
  history: AnalysisResult[],
  id: string
): AnalysisResult[] {
  return persistHistory(history.filter((item) => item.id !== id));
}
