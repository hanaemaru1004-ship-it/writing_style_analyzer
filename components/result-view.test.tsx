import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResultView } from "@/components/result-view";
import type { AnalysisResult } from "@/lib/types";

const result: AnalysisResult = {
  id: "1",
  createdAt: new Date("2026-01-01T00:00:00Z").toISOString(),
  inputText: "テスト文章です。",
  markdown: "# 文体分析結果\n\n本文です。",
  themeColor: "ocean",
};

describe("ResultView", () => {
  it("renders the markdown result", () => {
    render(<ResultView result={result} onReset={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: "文体分析結果" })
    ).toBeInTheDocument();
  });

  it("calls onReset when '新しく分析する' is clicked", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(<ResultView result={result} onReset={handleReset} />);

    await user.click(screen.getByRole("button", { name: /新しく分析する/ }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
