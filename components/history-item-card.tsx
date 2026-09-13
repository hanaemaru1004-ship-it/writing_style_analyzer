"use client";

import { Trash2 } from "lucide-react";
import type { CSSProperties } from "react";

import { findThemeColor } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HistoryItemCardProps {
  item: AnalysisResult;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryItemCard({
  item,
  isActive,
  onSelect,
  onRemove,
}: HistoryItemCardProps) {
  const theme = findThemeColor(item.themeColor);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(item.id);
        }
      }}
      className={cn(
        "group relative w-full cursor-pointer rounded-xl border p-3 text-left backdrop-blur-sm transition-all duration-200 hover:shadow-md",
        theme.class,
        isActive ? "shadow-md ring-2 ring-offset-1" : "shadow-sm"
      )}
      style={isActive ? ({ "--tw-ring-color": theme.accent } as CSSProperties) : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 pr-6 text-xs font-medium text-gray-700">
          {item.inputText}
        </p>
        <button
          type="button"
          aria-label="この履歴を削除"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(item.id);
          }}
          className="absolute top-2 right-2 rounded-lg p-1 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-white/60"
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-600" />
        </button>
      </div>
      <p className="mt-2 text-[11px] text-gray-500">{formatDate(item.createdAt)}</p>
    </div>
  );
}
