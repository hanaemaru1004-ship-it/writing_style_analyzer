# 文体アナライザー (writing_style_analyzer)

文章を貼り付けるだけで、Gemini AI がその文体の特徴を分析し、**再現可能な「ライティングルール」を Markdown 形式で生成する** Web アプリです。

＊公開サイト：https://writing-style-analyzer-gold.vercel.app/

## 1. アプリの概要

### できること

- 文章（最大2000文字）を入力して、文体のライティングルールを AI が自動生成
- 分析結果を Markdown で表示し、ワンクリックでコピー
- 過去の分析履歴を最大5件まで保存・再表示・削除（ブラウザの localStorage に保存。データベースは不使用）
- 分析中はローディングアニメーションを表示

### 特徴

- ログイン・会員登録は不要
- 入力した文章や履歴はサーバーに保存されない（履歴は自分のブラウザ内のみ）
- Apple 風の Glassmorphism デザイン、スマホにも対応（ライトモードのみ）

## 2. 対象ユーザー

- 自分や好きな書き手の文体を言語化したいライター・ブロガー
- 生成 AI に「この文体で書いて」と指示するためのルール（プロンプト素材）が欲しい人
- 文章のトーンや表現を揃えたい編集者・広報・マーケター
- 文体の特徴を学びたい学習者・学生

## 3. 使用方法

1. 入力欄に分析したい文章を貼り付ける（最大2000文字。文字数カウンターで確認できます）
2. 「分析」ボタンを押す
3. 生成されたライティングルール（Markdown）を確認し、必要なら「コピー」ボタンで取得する
4. 右側（スマホでは下）の履歴から過去の結果を選んで見返せる
5. 「新しく分析する」ボタン、またはヘッダーのロゴをクリックすると初期状態に戻る（履歴は保持されます）

## 4. セットアップ（開発者向け）

```bash
npm install
```

`.env.local` に Gemini API キーを設定します（`NEXT_PUBLIC` プレフィックスは**付けないこと**）。

```
GEMINT_API_KEY="your-api-key"
```

※ 変数名は `GEMINT_API_KEY`（綴りに注意）です。`GEMINI_API_KEY` もフォールバックとして読み込まれます。

## 5. コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番ビルドの起動 |
| `npm run lint` | ESLint |
| `npm run test` | Vitest（単体テストを1回実行） |
| `npm run test:watch` | Vitest（ウォッチモード） |

## 6. 使用技術

| 分野 | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router) / React 19 |
| 言語 | TypeScript（strict、`any` 禁止） |
| スタイリング | Tailwind CSS v4（`app/globals.css` で設定、`tailwind.config` は不使用） |
| UI コンポーネント | shadcn/ui（`components/ui/*`） |
| AI | Gemini API（公式 SDK `@google/genai`、サーバー側の Route Handler からのみ呼び出し） |
| Markdown 表示 | `react-markdown` + `remark-gfm` |
| テスト | Vitest + React Testing Library |
| データ保存 | ブラウザの localStorage（DB なし） |

### 処理の流れ

```
ブラウザ（入力フォーム）
   ↓ POST /api/analyze
Route Handler（入力検証）
   ↓
lib/gemini.ts（サーバー専用）→ Gemini API
   ↓
Markdown を返却 → 画面に表示 ＋ localStorage に履歴保存
```

### Gemini モデルの選定

無料枠の範囲でレスポンスが速いモデルとして **`gemini-3.5-flash-lite`** を採用しています（`lib/constants.ts` の `GEMINI_MODEL`）。

- [モデル一覧](https://ai.google.dev/gemini-api/docs/models) では「高スループット向けに設計された、3.5世代で最も高速・低コストなモデル」と説明されています。
- [料金ページ](https://ai.google.dev/gemini-api/docs/pricing) では Standard tier において無料枠（Free of charge）が明記されています。

選定日時点の情報のため、料金・無料枠の条件は変更される可能性があります。運用前に上記2ページで最新情報を再確認してください。

### 無料枠利用に関する表記

本アプリは Gemini API の無料枠を利用しています。無料枠でのご利用内容は、Google のサービス改善のために利用される場合があります（画面上の通知バナーにも表示しています）。

### データ永続化

localStorage キー `writing-style-analyzer:history` に、最新5件の分析結果（入力文・Markdown結果・テーマカラー・日時）を保存します（`lib/storage.ts`）。古いものから順に削除されます。

## 7. セキュリティ

- **API キーの保護**: Gemini API キーはサーバーサイド（`app/api/analyze/route.ts` → `lib/gemini.ts`）でのみ参照します。`server-only` パッケージでガードしており、クライアントバンドルには含まれません。
- **入力検証**: `/api/analyze` は入力の型・空文字・最大文字数（2000文字）を検証します。`Content-Length` が異常に大きいリクエストは、本文を読む前に `413` で拒否します（巨大ペイロードによるリソース消費対策）。
- **XSS 対策**: Gemini の応答は `react-markdown` で描画し、HTML の生埋め込み（`rehype-raw` 等）は使用しません。応答に含まれる HTML／スクリプトはエスケープされ、実行されません。
- **プロンプトインジェクション**: 分析対象の文章は任意のテキストであり、インジェクションの入力元になり得ます。ただし本アプリは Gemini にツール実行や機密情報へのアクセスを与えていないため、影響範囲は限定的です。
- **データの扱い**: 入力文や履歴はサーバーに保存せず、ブラウザの localStorage のみに保存します。

---

## 付録：デザインシステム（Apple風 Glassmorphism）

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
| `AppHeader` | Glassmorphism ヘッダー、ブランドロゴ。クリックでトップ（初期状態）に戻る |
| `FreeTierNotice` | 無料枠利用に関する告知バナー |
| `AnalyzerForm` | 文章入力・文字数カウンター・分析実行ボタン。上限超過時はエラーメッセージを表示 |
| `LoadingIndicator` | 分析中のバウンスアニメーション |
| `ResultView` | Markdown 分析結果の表示・コピー・「新しく分析する」でトップに戻る |
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
