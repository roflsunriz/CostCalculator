# 変更履歴

このプロジェクトの主な変更はこのファイルに記録します。

書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づきます。

## [Unreleased]

### Changed

- GitHub Pagesの実行環境を新世代へ追従できるよう、actions/checkout・configure-pages・upload-pages-artifact・deploy-pagesのメジャー更新を取り込んだ。
- ビルド基盤をVite 8へ上げられるよう、vite 7.3.6から8.3.0へ更新した。
- React Compilerの変換処理を維持したままplugin-react 6へ移行できるよう、`@vitejs/plugin-react` を6.1.1へ更新し、`vite.config.ts` を `react()` と `@rolldown/plugin-babel` の `reactCompilerPreset()` 構成へ移行した（`@rolldown/plugin-babel` を追加）。
- lint基盤が壊れない範囲で型基盤を modern 化できるよう、TypeScriptを6.0.3・`typescript-eslint` を8.70.1へ更新した。TypeScript 7.0.2は `typescript-eslint` 未対応のため見送り、7.1以降の対応後に再評価する。
- TypeScript 6の非推奨化に対応し将来のビルド破損を防ぐため、`tsconfig.app.json` の `baseUrl` を廃止して `paths` を `./` 始まりに直した。

### Fixed

- CI と Dependabot の分類の実行順が前後しても更新を取りこぼさないよう、同じ PR 番号と head SHA を再照合する経路を追加した。

### Security

- 既知の脆弱性を解消するため、上流依存が旧版へ固定する brace-expansion を安全な patch 版へ更新し、Bun のロックファイルを再生成した。
- push前監査で検出された既知の依存脆弱性を解消するため、安全版へ依存関係とロックファイルを更新した。

### Changed

- 依存更新を安全に省力化するため、Dependabot の patch／minor PR を既存 CI の全チェック成功後に自動取り込みし、失敗ジョブを一度再実行する設定を追加した。
- 作業開始時の共通指針見落としを防ぐため、調査やコマンド実行より前に `COMMON-AGENTS.md` を先頭から末尾まで読み、EOFを確認する必須ゲートを追加した。
