import "server-only";

import { GoogleGenAI } from "@google/genai";

import { GEMINI_MODEL } from "@/lib/constants";

let client: GoogleGenAI | null = null;

function getApiKey(): string {
  const key = process.env.GEMINT_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINT_API_KEY が設定されていません。.env.local を確認してください。"
    );
  }
  return key;
}

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return client;
}

const SYSTEM_INSTRUCTION = `あなたは日本語の文章スタイル分析の専門家です。
与えられた文章を分析し、その文章の「書き方のルール」を Markdown 形式でまとめてください。

出力は必ず次の見出し構成の Markdown のみとし、前置きや後書きの文章は含めないでください。

# 文体分析結果

## 概要
文章全体の印象を2〜3文で要約する。

## トーン・語調
丁寧語かカジュアルか、断定的か柔らかいか、などを具体的に説明する。

## 文の構造的特徴
文の長さの傾向、句読点の使い方、接続詞の傾向などを説明する。

## 語彙の傾向
頻出する言葉遣いや表現、専門用語の有無などを説明する。

## ライティングルール
この文体を再現するための具体的なルールを箇条書きで5〜8個挙げる。`;

/**
 * 入力文章を Gemini API で分析し、Markdown 形式の文体分析結果を返す。
 * サーバーサイド（Route Handler）からのみ呼び出すこと。
 */
export async function analyzeWritingStyle(text: string): Promise<string> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `以下の文章を分析してください。\n\n---\n${text}\n---`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.4,
    },
  });

  const markdown = response.text;
  if (!markdown) {
    throw new Error("分析結果を取得できませんでした。");
  }

  return markdown;
}
