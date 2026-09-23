# AGENTS.md

## 作業開始前の必須手順（最優先・例外なし）

1. エージェントは、調査、計画、コマンド実行、スキル利用、ファイル編集、コミット、プッシュを始める前に、必ずリポジトリ直下の `.\COMMON-AGENTS.md` を開き、先頭から末尾まで全文を読む。
2. `COMMON-AGENTS.md` はGit管理外のシンボリックリンクである。`git`や既定のignore設定が有効な`rg --files`の検索結果だけで、ファイルが存在しないと判断してはならない。PowerShellでは最初に次を実行する。

```powershell
Get-Content -Raw -LiteralPath .\COMMON-AGENTS.md
```

3. 読み取りに失敗した場合、出力が省略された場合、または末尾まで読めたことを確認できない場合は、一切の作業を開始せず、パスとシンボリックリンク先を確認して全文を再取得する。必要なら分割して末尾まで読む。
4. 全文を読了するまで、ローカル `AGENTS.md` だけを根拠に作業を続けてはならない。読了後は `COMMON-AGENTS.md` を最優先の指針とし、読了直後の最初の進捗報告で全文を読了したことを明示する。
   このファイルでは `cost-calculator` 固有の補足だけを記載する。

## パッケージ管理

- パッケージマネージャは Bun を使用する。

## Dependabot運用の実測知見（2026-09-23）

- 同一ファイル（例: `.github/workflows/deploy.yml`）を触るDependabot PRは連続マージで競合する。1件ずつ `gh pr merge --squash` し、残りに `@dependabot rebase` をコメントして再評価後に次をマージする。
- Dependabotブランチへ手動pushすると `dependabot/fetch-metadata` のclassifyが「not created by Dependabot」で失敗する。品質ゲートは `verify`（CI）の成功で判断し、マージ可否は `gh pr view --json mergeable,mergeStateStatus,statusCheckRollup` で確認する。
- `@vitejs/plugin-react` 6はBabel同梱を廃止し `babel` オプションが型エラーになる。`vite.config.ts` は `react()`＋`@rolldown/plugin-babel` の `reactCompilerPreset()` へ移行する（要 `@rolldown/plugin-babel` 追加）。v6はVite 8必須のためVite 8更新と同時期に扱う。
- TypeScript 7は `typescript-eslint`（peer `typescript <6.1.0`）未対応でlintが失敗する（TS 7.0は安定APIなし、対応は7.1以降待ち）。壊れない最大限としてTypeScript 6.0.3＋`typescript-eslint` 最新へ更新した。
- TypeScript 6で `tsconfig` の `baseUrl` は非推奨エラーになる。`baseUrl` を削除し `paths` の値を `./` 始まり（例: `@/*: ["./src/*"]`）に直す。
- `bun run format`（`prettier --write .`）は本リポジトリで無関係ファイルまで再整形する。実行後は `git diff --name-only` で対象外の churn がないか確認し、不要分は `git checkout -- .` 等で戻して最小差分を保つ。

## 依存監査で確定した事項（2026-09-23）

- `bun audit fix` だけでは brace-expansion の脆弱版が上流の厳密な依存範囲で残る。`package.json` の既存 `overrides` と `bun.lock` を同時に更新し、`bun audit` と関連テスト・ビルドで確認する。上流が安全版を取り込んだ場合は override の必要性を再評価する。
