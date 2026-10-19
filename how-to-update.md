# 更新手順

## Dependabot PR の更新



Dependabot version update は毎月28日00:00、検証済み PR の自動マージは同日18:00（いずれも `Asia/Tokyo`）にまとめます。28日より前に自動マージせず、現在の head SHA と全 PR チェックを月末処理で再確認します。
前提は `.github/dependabot.yml` と PR 用 CI（CI）です。更新 PR の head SHA と `gh pr checks <PR番号>` の結果を確認してください。更新は全チェック成功後に自動取り込みされます。初回 CI 失敗は failed jobs のみを 1 回再実行し、再失敗時は指定した lockfile を再生成し、CI を再実行します。互換性の問題はコードを修正して CI を通します。

設定を変えたときは `actionlint .github/workflows/dependabot-automation.yml` と実際の PR の Actions 結果を確認します。問題があれば呼び出し先の共通 workflow SHA を直前の検証済み値へ戻すコミットを push します。取り込まれた依存更新に問題があれば通常の revert コミットで復旧します。

## メジャー更新の手動対応

- `@vitejs/plugin-react` 6更新時は `vite.config.ts` の `babel` オプションを廃止し、`react()`＋`@rolldown/plugin-babel` の `reactCompilerPreset()` 構成へ移行する（Vite 8と同時期に扱う）。
- TypeScript 6更新時は `tsconfig` の `baseUrl` を削除し `paths` を `./` 始まりに直す。TypeScript 7は `typescript-eslint` 対応（7.1以降待ち）を確認してから再評価する。
- ESLint 10 更新時は `typescript-eslint`、React Hooks、React Refresh の peer 範囲と実際の lint を確認する。2026-10-11 時点ではこれらと ESLint 10.12.0 の組み合わせで lint が成功した。
- 同一ファイルを触るDependabot PRは1件ずつマージし、残りは `@dependabot rebase` で再評価させる。Dependabotブランチへ手動pushした場合は `verify` の成功を品質ゲートにする。

## 依存脆弱性の更新

`package.json` の `overrides` は、上流パッケージが brace-expansion の旧版を固定している間に安全な patch 版を選ぶために使う。上流が安全版を採用したら override を減らせるか確認する。更新時は `bun install --lockfile-only --ignore-scripts`、`bun install --frozen-lockfile`、`bun audit` を実行し、該当する lint・型・テスト・ビルドを確認する。問題があれば更新コミットを revert し、lockfile と package.json を同じ版へ戻す。

`bun audit` が新たな脆弱性を報告した場合は、対象の推移依存と修正版の範囲を監査結果で確認し、直接依存の更新で解消できるか調べる。必要な場合だけ `overrides` と `bun.lock` を同時に更新する。2026-10-11 時点では `brace-expansion` の override を維持し、`source-map-js` は postcss 更新後に override を外しても安全版が選ばれることを確認した。

CI 完了より Dependabot の分類が遅れる場合は、`callback_workflow_file` が指す呼び出し側 workflow を `workflow_dispatch` し、同じ PR 番号・head SHA・全チェックを再確認する。呼び出し側のファイル名を変える際はこの入力も一緒に更新する。
