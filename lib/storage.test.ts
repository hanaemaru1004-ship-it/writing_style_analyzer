import { beforeEach, describe, expect, it } from "vitest";

import { MAX_HISTORY_ITEMS } from "@/lib/constants";
import { addToHistory, loadHistory, removeFromHistory } from "@/lib/storage";
import type { AnalysisResult } from "@/lib/types";

function makeResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    inputText: overrides.inputText ?? "サンプルの文章です。",
    markdown: overrides.markdown ?? "# 文体分析結果",
    themeColor: overrides.themeColor ?? "sunshine",
  };
}

describe("lib/storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty array when nothing is stored", () => {
    expect(loadHistory()).toEqual([]);
  });

  it("adds a new result to the front of history and persists it", () => {
    const first = makeResult({ id: "1" });
    const afterFirst = addToHistory([], first);
    expect(afterFirst).toEqual([first]);
    expect(loadHistory()).toEqual([first]);

    const second = makeResult({ id: "2" });
    const afterSecond = addToHistory(afterFirst, second);
    expect(afterSecond.map((item) => item.id)).toEqual(["2", "1"]);
  });

  it("keeps at most MAX_HISTORY_ITEMS entries, dropping the oldest", () => {
    let history: AnalysisResult[] = [];
    for (let i = 0; i < MAX_HISTORY_ITEMS + 2; i += 1) {
      history = addToHistory(history, makeResult({ id: String(i) }));
    }

    expect(history).toHaveLength(MAX_HISTORY_ITEMS);
    // 最新のものが残り、最も古い "0", "1" は落ちている
    expect(history.map((item) => item.id)).not.toContain("0");
    expect(history.map((item) => item.id)).not.toContain("1");
    expect(history[0]?.id).toBe(String(MAX_HISTORY_ITEMS + 1));
  });

  it("removes an item by id", () => {
    const first = makeResult({ id: "1" });
    const second = makeResult({ id: "2" });
    const history = addToHistory(addToHistory([], first), second);

    const updated = removeFromHistory(history, "1");
    expect(updated.map((item) => item.id)).toEqual(["2"]);
    expect(loadHistory().map((item) => item.id)).toEqual(["2"]);
  });

  it("ignores corrupted localStorage content", () => {
    window.localStorage.setItem("writing-style-analyzer:history", "{not json");
    expect(loadHistory()).toEqual([]);
  });
});
