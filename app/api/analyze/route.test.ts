import { beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_INPUT_LENGTH } from "@/lib/constants";

const analyzeWritingStyle = vi.fn();

vi.mock("@/lib/gemini", () => ({
  analyzeWritingStyle: (text: string) => analyzeWritingStyle(text),
}));

async function importRoute() {
  return import("@/app/api/analyze/route");
}

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze", () => {
  beforeEach(() => {
    analyzeWritingStyle.mockReset();
  });

  it("returns 400 when text is missing", async () => {
    const { POST } = await importRoute();
    const response = await POST(makeRequest({}));
    expect(response.status).toBe(400);
    expect(analyzeWritingStyle).not.toHaveBeenCalled();
  });

  it("returns 400 when text is empty after trimming", async () => {
    const { POST } = await importRoute();
    const response = await POST(makeRequest({ text: "   " }));
    expect(response.status).toBe(400);
  });

  it("returns 400 when text exceeds the max length", async () => {
    const { POST } = await importRoute();
    const response = await POST(
      makeRequest({ text: "あ".repeat(MAX_INPUT_LENGTH + 1) })
    );
    expect(response.status).toBe(400);
    expect(analyzeWritingStyle).not.toHaveBeenCalled();
  });

  it("returns the markdown result on success", async () => {
    analyzeWritingStyle.mockResolvedValue("# 文体分析結果\n本文");
    const { POST } = await importRoute();
    const response = await POST(makeRequest({ text: "これはテストです。" }));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ markdown: "# 文体分析結果\n本文" });
  });

  it("returns 502 when the Gemini call fails", async () => {
    analyzeWritingStyle.mockRejectedValue(new Error("upstream failure"));
    const { POST } = await importRoute();
    const response = await POST(makeRequest({ text: "これはテストです。" }));

    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBeTruthy();
  });
});
