import { RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { findThemeColor } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultView({ result, onReset }: ResultViewProps) {
  const theme = findThemeColor(result.themeColor);

  return (
    <section
      className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-sm duration-300 sm:p-6"
      style={{
        boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px ${theme.accent}22`,
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.accent }}
            aria-hidden
          />
          <span className="text-xs font-medium text-gray-500">
            {formatDate(result.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-1.5 rounded-xl border-white/40 bg-white/40 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/60"
          >
            <RotateCcw className="h-4 w-4" />
            新しく分析する
          </Button>
          <CopyButton text={result.markdown} />
        </div>
      </div>
      <div className="prose prose-sm sm:prose-base prose-headings:font-semibold prose-headings:text-gray-900 max-w-none text-gray-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {result.markdown}
        </ReactMarkdown>
      </div>
    </section>
  );
}
