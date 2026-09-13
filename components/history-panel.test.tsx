import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HistoryPanel } from "@/components/history-panel";
import type { AnalysisResult } from "@/lib/types";

const item: AnalysisResult = {
  id: "1",
  createdAt: new Date("2026-01-01T00:00:00Z").toISOString(),
  inputText: "テスト文章です。",
  markdown: "# 結果",
  themeColor: "ocean",
};

describe("HistoryPanel", () => {
  it("shows an empty message when there is no history", () => {
    render(
      <HistoryPanel history={[]} activeId={null} onSelect={vi.fn()} onRemove={vi.fn()} />
    );

    expect(screen.getByText("まだ分析履歴がありません。")).toBeInTheDocument();
  });

  it("calls onSelect when an item is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <HistoryPanel
        history={[item]}
        activeId={null}
        onSelect={handleSelect}
        onRemove={vi.fn()}
      />
    );

    await user.click(screen.getByText("テスト文章です。"));
    expect(handleSelect).toHaveBeenCalledWith("1");
  });

  it("calls onRemove when the delete button is clicked without triggering onSelect", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleRemove = vi.fn();

    render(
      <HistoryPanel
        history={[item]}
        activeId={null}
        onSelect={handleSelect}
        onRemove={handleRemove}
      />
    );

    await user.click(screen.getByRole("button", { name: "この履歴を削除" }));
    expect(handleRemove).toHaveBeenCalledWith("1");
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
