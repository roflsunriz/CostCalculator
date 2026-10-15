# 変更履歴

このプロジェクトの主な変更はこのファイルに記録します。

書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づきます。

## [Unreleased]

### Changed

- 作業規範と実装上の知見を分けて参照できるよう、固有の構成・環境・調査知見を `findings.md` に集約し、元文書の参照と着手前の全文読了指示を整えた。利用者向け手順と既存の検証証跡は保持した。

### Changed

- 開発用の依存関係を安全に保つため、Dependabot PR #19〜#23 の `typescript-eslint`、`autoprefixer`、React Refresh、React Compiler、Vite 更新を CI 成功後に main へ取り込んだ。
- 依存関係の互換範囲と監査結果を確認し、ESLint 10 と残る開発用パッケージの更新版を取り込んだ。TypeScript 7 は `typescript-eslint` の対応範囲外のため 6.0.3 を維持した。
- 不具合・機能提案などの受付とPRの記入形式を揃え、プロジェクト固有の確認項目を残した。 READMEは既存の意味と手順を保ち、実装と異なる説明や読みにくい表現を修正した。

- GitHub Pagesの実行環境を新世代へ追従できるよう、actions/checkout・configure-pages・upload-pages-artifact・deploy-pagesのメジャー更新を取り込んだ。
- ビルド基盤をVite 8へ上げられるよう、vite 7.3.6から8.3.0へ更新した。
- React Compilerの変換処理を維持したままplugin-react 6へ移行できるよう、`@vitejs/plugin-react` を6.1.1へ更新し、`vite.config.ts` を `react()` と `@rolldown/plugin-babel` の `reactCompilerPreset()` 構成へ移行した（`@rolldown/plugin-babel` を追加）。
- lint基盤が壊れない範囲で型基盤を modern 化できるよう、TypeScriptを6.0.3・`typescript-eslint` を8.70.1へ更新した。TypeScript 7.0.2は `typescript-eslint` 未対応のため見送り、7.1以降の対応後に再評価する。
- TypeScript 6の非推奨化に対応し将来のビルド破損を防ぐため、`tsconfig.app.json` の `baseUrl` を廃止して `paths` を `./` 始まりに直した。
- 依存更新を安全に省力化するため、Dependabot PR を既存 CI の全チェック成功後に自動取り込みし、失敗ジョブを一度再実行する設定を追加した。
- 作業開始時の共通指針見落としを防ぐため、調査やコマンド実行より前に `COMMON-AGENTS.md` を先頭から末尾まで読み、EOFを確認する必須ゲートを追加した。

### Fixed

- Viteの将来のnative config loaderでもパス解決を維持するため、ES modules非対応の__dirnameをimport.meta.dirnameへ置換した。
- CI と Dependabot の分類の実行順が前後しても更新を取りこぼさないよう、同じ PR 番号と head SHA を再照合する経路を追加した。

### Security

- brace-expansion の既知DoSを解消するため、既存 override を5.0.12へ更新し、Bunのlockを再生成した。
- Dependabot PR の CI を止めていた依存監査を通すため、`source-map-js` を安全版に固定し、ロックファイルを更新した。
