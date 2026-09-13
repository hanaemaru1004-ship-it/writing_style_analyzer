import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppHeader } from "@/components/app-header";

describe("AppHeader", () => {
  it("calls onReset when the logo/title is clicked", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(<AppHeader onReset={handleReset} />);

    await user.click(screen.getByRole("button", { name: "トップページに戻る" }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
