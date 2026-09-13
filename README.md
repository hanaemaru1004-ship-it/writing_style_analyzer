# 文体アナライザー (writing_style_analyzer)

文章を入力すると、Gemini AI がその文体を分析し、再現可能な「ライティングルール」を Markdown 形式で生成する Web アプリです。

## セットアップ

```bash
npm install
```

`.env.local` に Gemini API キーを設定します（`NEXT_PUBLIC` プレフィックスは付けないこと）。

```
GEMINT_API_KEY="your-api-key"
```

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番ビルドの起動 |
| `npm run lint` | ESLint |
| `npm run test` | Vitest（単体テストを1回実行） |
| `npm run test:watch` | Vitest（ウォッチモード） |

## 機能

- 文章入力（最大2000文字）からライティングルールを Gemini AI で生成
- 分析結果を Markdown 形式で表示・ワンクリックコピー
- 分析履歴を localStorage に保存（最大5件、データベースは使用しない）
- 分析中のローディングアニメーション

## Gemini モデルの選定

無料枠の範囲でレスポンスが速いモデルとして **`gemini-3.5-flash-lite`** を採用しています（`lib/constants.ts` の `GEMINI_MODEL`）。

- [モデル一覧](https://ai.google.dev/gemini-api/docs/models) では「高スループット向けに設計された、3.5世代で最も高速・低コストなモデル」と説明されています。
- [料金ページ](https://ai.google.dev/gemini-api/docs/pricing) では Standard tier において無料枠（Free of charge）が明記されています。

選定日時点の情報のため、料金・無料枠の条件は変更される可能性があります。運用前に上記2ページで最新情報を再確認してください。

### 無料枠利用に関する表記

本アプリは Gemini API の無料枠を利用しています。無料枠でのご利用内容は、Google のサービス改善のために利用される場合があります（画面上の通知バナーにも表示しています）。

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript（strict, any禁止）
- Tailwind CSS v4（`app/globals.css` で設定、`tailwind.config` は使用しない）
- shadcn/ui（`components/ui/*`）
- Vitest + React Testing Library
- `@google/genai`（Gemini API 公式 SDK、サーバーサイドの Route Handler からのみ呼び出し）

## デザインシステム（Apple風 Glassmorphism）

ライトモードのみ対応。ダークモードには対応しません。

### カラーシステム

`lib/constants.ts` の `THEME_COLORS` に8色のグラデーションテーマ（サンシャイン / ブロッサム / オーシャン / フォレスト / ラベンダー / サンセット / ミスト / ミント）を定義し、分析履歴の各アイテムに順番に割り当てて視覚的な区別をつけています。

- グラデーション: `from-{color}-100 to-{color}-200`
- ボーダー: `border-{color}-300/30`
- アクセント: 各色に対応する HEX カラー（結果カードの枠線・履歴アイテムの選択状態に使用）

### 背景・レイアウト構造

- 3層構造のグラデーション背景（`components/background-layers.tsx`）: ベース + 装飾レイヤー2層（`blur-3xl` の低透明度円形グラデーション）
- 固定 Glassmorphism ヘッダー（`bg-white/70 backdrop-blur-xl`）
- モバイルファーストのレスポンシブグリッド（`grid-cols-1` → `lg:grid-cols-[1fr_280px]`）

### コンポーネント

| コンポーネント | 役割 |
| --- | --- |
| `AppHeader` | Glassmorphism ヘッダー、ブランドロゴ |
| `FreeTierNotice` | 無料枠利用に関する告知バナー |
| `AnalyzerForm` | 文章入力・文字数カウンター・分析実行ボタン |
| `LoadingIndicator` | 分析中のバウンスアニメーション |
| `ResultView` | Markdown 分析結果の表示・コピー |
| `EmptyState` | 初回表示時のウェルカム画面（機能紹介グリッド） |
| `HistoryPanel` / `HistoryItemCard` | 分析履歴の一覧・選択・削除 |

### マイクロインタラクション

- ボタン: `hover:scale-105`、アイコンの `hover:rotate-90`
- カード: `hover:shadow-md`、選択状態は `ring-2` + アクセントカラー
- トランジション: `duration-200 ease-out` を基本、アイコン回転のみ `duration-300`
- 結果カードの出現には `animate-in fade-in slide-in-from-bottom-2` を使用

### アクセシビリティ

- フォーム要素にはラベルを明示（`label htmlFor`）
- ローディング領域は `role="status" aria-live="polite"`
- エラーメッセージは `role="alert"`
- 装飾用の背景レイヤーは `aria-hidden`
- コントラスト比は WCAG 2.1 AA を意識した配色（本文はグレー700〜900系、背景は白〜薄いグラデーション）

## データ永続化

localStorage キー `writing-style-analyzer:history` に、最新5件の分析結果（入力文・Markdown結果・テーマカラー・日時）を保存します（`lib/storage.ts`）。データベースは使用していません。

## セキュリティ

Gemini API キーはサーバーサイド（`app/api/analyze/route.ts` → `lib/gemini.ts`）でのみ参照し、クライアントバンドルに含めないよう `server-only` パッケージでガードしています。
