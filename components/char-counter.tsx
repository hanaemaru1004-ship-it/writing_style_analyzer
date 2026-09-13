import { cn } from "@/lib/utils";
import { MAX_INPUT_LENGTH } from "@/lib/constants";

export function CharCounter({ length }: { length: number }) {
  const isOverLimit = length > MAX_INPUT_LENGTH;
  const isNearLimit = !isOverLimit && length >= MAX_INPUT_LENGTH * 0.9;

  return (
    <span
      role="status"
      className={cn(
        "text-xs font-medium tabular-nums transition-colors",
        isOverLimit && "text-red-500",
        isNearLimit && "text-amber-500",
        !isOverLimit && !isNearLimit && "text-gray-400"
      )}
    >
      {length.toLocaleString("ja-JP")} / {MAX_INPUT_LENGTH.toLocaleString("ja-JP")}
    </span>
  );
}
