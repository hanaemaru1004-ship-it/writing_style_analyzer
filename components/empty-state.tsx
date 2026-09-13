import { Copy, History, Wand2 } from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    title: "文体を分析",
    description: "トーンや文の構造、語彙の傾向をAIが読み解きます。",
  },
  {
    icon: Copy,
    title: "ワンクリックコピー",
    description: "生成されたライティングルールをすぐにコピーできます。",
  },
  {
    icon: History,
    title: "履歴を保存",
    description: "直近5件の分析結果をブラウザに保存します。",
  },
] as const;

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/40 px-6 py-12 text-center backdrop-blur-sm">
      <div className="relative mb-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-xl backdrop-blur-sm sm:h-24 sm:w-24">
          <Wand2 className="h-10 w-10 text-blue-500 sm:h-12 sm:w-12" />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 animate-pulse rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
      </div>
      <h2 className="mb-2 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
        あなたの文章スタイルを分析します
      </h2>
      <p className="mb-8 max-w-md text-sm text-gray-500 sm:text-base">
        文章を入力して「文体を分析する」を押すと、AIがライティングルールを生成します。
      </p>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-white/30 bg-white/50 p-4 text-left shadow-sm backdrop-blur-sm"
          >
            <Icon className="mb-2 h-5 w-5 text-blue-500" />
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
