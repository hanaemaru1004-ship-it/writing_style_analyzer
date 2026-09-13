import { NextResponse } from "next/server";

import { MAX_INPUT_LENGTH } from "@/lib/constants";
import { analyzeWritingStyle } from "@/lib/gemini";
import type { AnalyzeRequestBody, AnalyzeSuccessResponse } from "@/lib/types";

export const runtime = "nodejs";

// 2000文字(UTF-8で最大約6000バイト)のJSONペイロードとして十分な余裕を持たせた上限。
// Content-Length を騙る/省略するリクエストは通過しうるが、素朴な巨大ペイロードによる
// リソース消費を安価に防ぐための多層防御として設定している。
const MAX_REQUEST_BODY_BYTES = 20_000;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    return errorResponse("リクエストサイズが大きすぎます。", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("リクエストの形式が正しくありません。", 400);
  }

  const text = (body as Partial<AnalyzeRequestBody> | null)?.text;

  if (typeof text !== "string" || text.trim().length === 0) {
    return errorResponse("分析する文章を入力してください。", 400);
  }

  if (text.length > MAX_INPUT_LENGTH) {
    return errorResponse(
      `文章は${MAX_INPUT_LENGTH}文字以内で入力してください。`,
      400
    );
  }

  try {
    const markdown = await analyzeWritingStyle(text);
    const payload: AnalyzeSuccessResponse = { markdown };
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Gemini API analyze error:", error);
    return errorResponse(
      "文体の分析中にエラーが発生しました。しばらくしてから再度お試しください。",
      502
    );
  }
}
