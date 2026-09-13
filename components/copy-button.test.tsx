import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CopyButton } from "@/components/copy-button";

describe("CopyButton", () => {
  it("copies the given text and shows feedback", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    render(<CopyButton text="# 見出し" />);

    await user.click(screen.getByRole("button", { name: "コピー" }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("# 見出し");
    await waitFor(() =>
      expect(screen.getByText("コピーしました")).toBeInTheDocument()
    );
  });
});
