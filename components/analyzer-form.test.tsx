import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AnalyzerForm } from "@/components/analyzer-form";
import { MAX_INPUT_LENGTH } from "@/lib/constants";

describe("AnalyzerForm", () => {
  it("disables submit when the input is empty", () => {
    render(
      <AnalyzerForm value="" onChange={vi.fn()} onSubmit={vi.fn()} isLoading={false} />
    );

    expect(screen.getByRole("button", { name: "文体を分析する" })).toBeDisabled();
  });

  it("enables submit once there is text and calls onSubmit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <AnalyzerForm
        value="こんにちは"
        onChange={vi.fn()}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    );

    const button = screen.getByRole("button", { name: "文体を分析する" });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submit and shows an error message when the text exceeds the max length", () => {
    render(
      <AnalyzerForm
        value={"あ".repeat(MAX_INPUT_LENGTH + 1)}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByRole("button", { name: "文体を分析する" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "1文字オーバーしています。2,000文字以内に短くしてください。"
    );
  });

  it("shows no error message when the text is within the limit", () => {
    render(
      <AnalyzerForm value="こんにちは" onChange={vi.fn()} onSubmit={vi.fn()} isLoading={false} />
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the loading label and disables the button while loading", () => {
    render(
      <AnalyzerForm value="こんにちは" onChange={vi.fn()} onSubmit={vi.fn()} isLoading />
    );

    expect(screen.getByRole("button", { name: "分析中…" })).toBeDisabled();
  });
});
