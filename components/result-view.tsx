import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CopyButton } from "@/components/copy-button";
import { findThemeColor } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ResultView({ result }: { result: AnalysisResult }) {
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
        <CopyButton text={result.markdown} />
      </div>
      <div className="prose prose-sm sm:prose-base prose-headings:font-semibold prose-headings:text-gray-900 max-w-none text-gray-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {result.markdown}
        </ReactMarkdown>
      </div>
    </section>
  );
}
