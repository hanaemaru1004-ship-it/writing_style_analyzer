"use client";

import { useMemo, useState } from "react";

import { AnalyzerForm } from "@/components/analyzer-form";
import { AppHeader } from "@/components/app-header";
import { BackgroundLayers } from "@/components/background-layers";
import { EmptyState } from "@/components/empty-state";
import { FreeTierNotice } from "@/components/free-tier-notice";
import { HistoryPanel } from "@/components/history-panel";
import { LoadingIndicator } from "@/components/loading-indicator";
import { ResultView } from "@/components/result-view";
import { useAnalysisHistory } from "@/hooks/use-analysis-history";
import { getThemeColor } from "@/lib/constants";
import type {
  AnalyzeErrorResponse,
  AnalyzeSuccessResponse,
  AnalysisResult,
} from "@/lib/types";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { history, addItem, removeItem } = useAnalysisHistory();

  const activeId = currentResult?.id ?? null;

  const themeIndex = useMemo(() => history.length, [history.length]);

  async function handleSubmit() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data: AnalyzeSuccessResponse | AnalyzeErrorResponse =
        await response.json();

      if (!response.ok || "error" in data) {
        const message = "error" in data ? data.error : "分析に失敗しました。";
        setErrorMessage(message);
        return;
      }

      const result: AnalysisResult = {
        id: createId(),
        createdAt: new Date().toISOString(),
        inputText,
        markdown: data.markdown,
        themeColor: getThemeColor(themeIndex).value,
      };

      setCurrentResult(result);
      addItem(result);
    } catch {
      setErrorMessage(
        "ネットワークエラーが発生しました。接続を確認して再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectHistory(id: string) {
    const item = history.find((entry) => entry.id === id);
    if (item) setCurrentResult(item);
  }

  function handleRemoveHistory(id: string) {
    removeItem(id);
    if (currentResult?.id === id) setCurrentResult(null);
  }

  function handleReset() {
    setInputText("");
    setCurrentResult(null);
    setErrorMessage(null);
  }

  return (
    <div className="min-h-screen">
      <BackgroundLayers />
      <AppHeader onReset={handleReset} />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            <FreeTierNotice />
            <AnalyzerForm
              value={inputText}
              onChange={setInputText}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {errorMessage}
              </p>
            )}

            {isLoading && <LoadingIndicator />}
            {!isLoading && currentResult && (
              <ResultView result={currentResult} onReset={handleReset} />
            )}
            {!isLoading && !currentResult && <EmptyState />}
          </div>

          <HistoryPanel
            history={history}
            activeId={activeId}
            onSelect={handleSelectHistory}
            onRemove={handleRemoveHistory}
          />
        </div>
      </main>
    </div>
  );
}
