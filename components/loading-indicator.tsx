export function LoadingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/30 bg-white/50 p-10 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-br from-blue-500 to-purple-600 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-br from-blue-500 to-purple-600 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">文体を分析しています…</p>
    </div>
  );
}
