import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/20 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
            文体アナライザー
          </h1>
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            AI があなたの文章のライティングルールを見つけます
          </p>
        </div>
      </div>
    </header>
  );
}
