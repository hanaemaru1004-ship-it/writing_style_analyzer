"use client";

import { Sparkles } from "lucide-react";
import type { FormEvent } from "react";

import { CharCounter } from "@/components/char-counter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_INPUT_LENGTH } from "@/lib/constants";

interface AnalyzerFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function AnalyzerForm({
  value,
  onChange,
  onSubmit,
  isLoading,
}: AnalyzerFormProps) {
  const trimmedLength = value.length;
  const isOverLimit = trimmedLength > MAX_INPUT_LENGTH;
  const isDisabled = isLoading || trimmedLength === 0 || isOverLimit;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isDisabled) onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/30 bg-white/50 p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-white/50 sm:p-6"
    >
      <label htmlFor="source-text" className="mb-2 block text-sm font-semibold text-gray-700">
        分析したい文章を入力してください
      </label>
      <Textarea
        id="source-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ここに文章を貼り付けてください（最大2000文字）"
        className="min-h-40 max-h-96 resize-none overflow-y-auto bg-white/70 text-base"
        disabled={isLoading}
        aria-invalid={isOverLimit}
        aria-describedby={isOverLimit ? "source-text-error" : undefined}
      />
      {isOverLimit && (
        <p
          id="source-text-error"
          role="alert"
          className="mt-2 text-sm font-medium text-red-600"
        >
          {(trimmedLength - MAX_INPUT_LENGTH).toLocaleString("ja-JP")}
          文字オーバーしています。{MAX_INPUT_LENGTH.toLocaleString("ja-JP")}
          文字以内に短くしてください。
        </p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <CharCounter length={trimmedLength} />
        <Button
          type="submit"
          disabled={isDisabled}
          className="group h-10 gap-2 rounded-xl border border-blue-400/20 bg-gradient-to-r from-blue-500 to-blue-600 px-5 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100"
        >
          <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          {isLoading ? "分析中…" : "文体を分析する"}
        </Button>
      </div>
    </form>
  );
}
