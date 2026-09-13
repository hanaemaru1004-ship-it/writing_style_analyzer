import { HistoryItemCard } from "@/components/history-item-card";
import type { AnalysisResult } from "@/lib/types";

interface HistoryPanelProps {
  history: AnalysisResult[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export function HistoryPanel({
  history,
  activeId,
  onSelect,
  onRemove,
}: HistoryPanelProps) {
  return (
    <aside className="rounded-2xl border border-white/30 bg-white/40 p-4 backdrop-blur-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">分析履歴</h2>
      {history.length === 0 ? (
        <p className="text-xs text-gray-400">まだ分析履歴がありません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((item) => (
            <HistoryItemCard
              key={item.id}
              item={item}
              isActive={item.id === activeId}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
