"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";

export function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useClipboard();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => copy(text)}
      className="gap-1.5 rounded-xl border-white/40 bg-white/40 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/60"
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" />
          コピーしました
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          コピー
        </>
      )}
    </Button>
  );
}
