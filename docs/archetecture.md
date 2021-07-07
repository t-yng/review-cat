# 設計

## 技術選定
### 言語
- TypeScript@beta(4.4)
- Node.js@16.4.1

### API
- GraphQL

### パッケージマネージャー
- pmpm

### 開発ツール
- vite？
- mrm
- eslint
- prettier
- husky
- lint-staged
- hygen
- Editor Config

### ライブラリ
- Electron
- Relay
- React
- vanilla extract（スタイルライブラリ）[GitHub](https://github.com/seek-oss/vanilla-extract)
- jotai（状態管理ライブラリ）

### テストツール
- Jest
- ts-jest
- React Testing Library

### CI
- Github Actions

## ディレクトリー構成

```
.
├── .husky              # husky の設定ファイルが入る
├── .vscode             # VSCode の設定ファイルが入る
├── app                 # ビルドされたアプリが入る
├── dist                # build された dev のコードが入る
├── dev                 # 開発ディレクトリ
│   ├── public          # Vite を通さず参照するファイルが入る
│   ├── assets      # Vite を通して参照する画像等が入る
│   └── src             # 開発用コードが基本的に入る
│       ├── lib         # 自作ライブラリなどが入る
│       ├── hooks       # Custom hook が入る
│       ├── pages       # Page Component が入る
│       ├── containers  # Container Component
│       └── components  # Presentational Component
└── docs                # ドキュメントが入る
```

このような構成で進める。
後は進めながら決めていく。
