# 検証手順

## Dependabot 自動処理（2026-09-23）

`.github/workflows/dependabot-automation.yml` を actionlint で検査し、PR 用 workflow 名（CI）と一致することを確認する。Dependabot の patch／minor かつ全 PR チェック成功の場合だけ取り込み、major・古い SHA・再失敗は残す。

## Dependabot Open PRの一括処理（2026-09-23）

- 対象はPR #1〜#6・#9（#7・#8は処理前に取込済み）。`gh pr checks` で #1〜#5の `verify` 成功を確認し、#1→#2→#3→#4→#5の順に `gh pr merge --squash` した。同一ファイル更新の競合は `@dependabot rebase` で再評価させて解消した。
- #6（plugin-react 6.1.1）は `vite.config.ts` の `babel` オプションが型エラーで `verify` 失敗。`react()`＋`@rolldown/plugin-babel` の `reactCompilerPreset()` へ移行し `@rolldown/plugin-babel` 0.2.4を追加して `verify` 成功を確認後にマージした。手動push後の `dependabot / classify` 失敗はfetch-metadataの作成者判定によるもので、品質ゲートは `verify` とした。
- #9（typescript 7.0.2）は `typescript-eslint` がpeer `typescript <6.1.0` でTS7未対応のため `verify`（lint）失敗。TS 7.0自体に安定APIがなく対応は7.1以降待ちのため、PRは理由をコメントしてcloseし、代替としてTypeScript 6.0.3＋`typescript-eslint` 8.70.1＋`tsconfig.app.json` の `baseUrl` 廃止（`paths` を `./` 始まり化）をmainへ適用した。
- main（ffb486d）でCIの `verify` 成功を確認。ローカルでも `bun run lint`・`type-check`・`build` 成功、`bun audit` で脆弱性0件を確認した。`bun run format` は無関係ファイルまで再整形するため差分を確認して戻し、最小差分を保った。
- 処理後にOpen PR 0件、Dependabotリモートブランチ残存0件（`git fetch --prune` で確認）となった。

## 依存脆弱性の確認（2026-09-23）

監査では brace-expansion を含む推移依存の旧版が検出された。Bun 1.4.0 で lockfile の固定インストールと再監査を行い、既知脆弱性 0 件を確認した。lint・型・ビルド成功。

大量の Dependabot PR により CI 完了より分類が遅れる場合でも、分類後の `workflow_dispatch` が現在の PR 番号と head SHA を照合して再評価する。別の作成者、古い SHA、未完了の CI はマージしない。
