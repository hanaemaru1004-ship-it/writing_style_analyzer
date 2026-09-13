import type { ThemeColor } from "@/lib/constants";

export interface AnalysisResult {
  id: string;
  createdAt: string;
  inputText: string;
  markdown: string;
  themeColor: ThemeColor;
}

export interface AnalyzeRequestBody {
  text: string;
}

export interface AnalyzeSuccessResponse {
  markdown: string;
}

export interface AnalyzeErrorResponse {
  error: string;
}
