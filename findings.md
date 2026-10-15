# findings.md

このリポジトリ固有の実現手段と調査知見の正本です。作業前に全文を読み、行動規範は [AGENTS.md](AGENTS.md) と [COMMON-AGENTS.md](COMMON-AGENTS.md) に従ってください。移動元の本文は以下に保持しています。

## 共通方針の適用と具体的な例外

| 項目                       | このリポジトリでの扱い                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 対象の共通ルール           | 依存更新の互換性条件                                                                                                                    |
| 理由と適用範囲             | TypeScript7はtypescript-eslintのpeer範囲外であるため、既存検証で確認した6系を維持する。この上限はTypeScript/lintの互換性に適用する。    |
| 同等の品質を保つ手段・検証 | peer範囲と実装を確認し、lint・型・ビルド・監査を成功させてから更新する。根拠: `package.json`、`bun.lock`、[検証記録](verification.md)。 |

## 文書の役割と適用範囲

- 共通ルールの対象は「ローカル AGENTS.md との関係」「設計と実装方針」「検証」「ドキュメント」。この文書は本リポジトリの構成と既存運用に適用し、共通の行動規範を弱めません。
- ファイル配置・ツール・環境をここに集約する理由は、作業規範と実装上の事実を分け、次の作業者が根拠を確認できるようにするためです。下記の既存手段は同じ対象の設定・CI・検証記録と照合して使います。
- README は利用開始・操作、更新手順は更新と復旧、verification.md は検証手順と実測証跡、専門の設計・研究文書は詳細な根拠を担います。これらの用途は維持し、この文書から参照します。
- 更新・検証の代替は一律のBunコマンドに固定せず、下記の採用技術と既存CIに対応する検査を使います。実行不能や未検証の条件は成功扱いせず verification.md に残します。

<a id="agents-1"></a>

## パッケージ管理

- パッケージマネージャは Bun を使用する。

移動元: `AGENTS.md`。

<a id="agents-2"></a>

## Dependabot運用の実測知見（2026-09-23）

- 同一ファイル（例: `.github/workflows/deploy.yml`）を触るDependabot PRは連続マージで競合する。1件ずつ `gh pr merge --squash` し、残りに `@dependabot rebase` をコメントして再評価後に次をマージする。
- Dependabotブランチへ手動pushすると `dependabot/fetch-metadata` のclassifyが「not created by Dependabot」で失敗する。品質ゲートは `verify`（CI）の成功で判断し、マージ可否は `gh pr view --json mergeable,mergeStateStatus,statusCheckRollup` で確認する。
- `@vitejs/plugin-react` 6はBabel同梱を廃止し `babel` オプションが型エラーになる。`vite.config.ts` は `react()`＋`@rolldown/plugin-babel` の `reactCompilerPreset()` へ移行する（要 `@rolldown/plugin-babel` 追加）。v6はVite 8必須のためVite 8更新と同時期に扱う。
- TypeScript 7は `typescript-eslint`（peer `typescript <6.1.0`）未対応でlintが失敗する（TS 7.0は安定APIなし、対応は7.1以降待ち）。壊れない最大限としてTypeScript 6.0.3＋`typescript-eslint` 最新へ更新した。
- TypeScript 6で `tsconfig` の `baseUrl` は非推奨エラーになる。`baseUrl` を削除し `paths` の値を `./` 始まり（例: `@/*: ["./src/*"]`）に直す。
- `bun run format`（`prettier --write .`）は本リポジトリで無関係ファイルまで再整形する。実行後は `git diff --name-only` で対象外の churn がないか確認し、不要分は `git checkout -- .` 等で戻して最小差分を保つ。

移動元: `AGENTS.md`。

<a id="agents-3"></a>

## 依存監査で確定した事項（2026-09-23）

- `bun audit fix` だけでは brace-expansion の脆弱版が上流の厳密な依存範囲で残る。`package.json` の既存 `overrides` と `bun.lock` を同時に更新し、`bun audit` と関連テスト・ビルドで確認する。上流が安全版を取り込んだ場合は override の必要性を再評価する。

移動元: `AGENTS.md`。

<a id="agents-4"></a>

## CI監査修復の注意

- 2026-10-05: brace-expansion 5.0.9では新規DoSアドバイザリが残るため、既存overrideとlockを5.0.12へ更新した。版を上げた後はCIと同じBunで固定lock、全依存監査、lint・型・ビルドを確認する。
- 2026-10-11 の Dependabot PR #19〜#23 は共通の `source-map-js` 1.2.1 脆弱性により `verify` の `bun audit` で失敗した。当初は override と lockfile を 1.2.2 へ更新して CI を通した。その後 postcss 8.5.29 の更新で override を外しても lockfile が 1.2.2 を維持し、監査0件を確認した（詳細は `verification.md`）。
- 2026-10-11 時点で `typescript-eslint` 8.71.0、`eslint-plugin-react-hooks` 7.1.1、`eslint-plugin-react-refresh` 0.5.7 の peer 範囲は ESLint 10 を許容した。ESLint 10.12.0 に上げた後も lint・型・ビルド・監査を実行する。TypeScript 7 は `typescript-eslint` の peer 範囲外（`typescript <6.1.0`）なので 6.0.3 を維持する。

移動元: `AGENTS.md`。

<a id="readme-1"></a>

## 依存更新の自動処理

Dependabot は対象の依存関係を毎週確認します。更新 PR は CI のチェックが成功すると自動で squash merge されます。CI の失敗ジョブは 1 回だけ再実行し、再失敗時は指定した lockfile の再生成を試みます。互換性の問題で CI が通らない更新は手動で修正・検証します。マージ後はデプロイ workflow を起動します。

移動元: `README.md`。

## 根拠と検証記録

- [README.md](README.md): 利用者向けの導入と操作。
- [verification.md](verification.md): 検証手順、実測結果、未確認事項。
- [how-to-update.md](how-to-update.md): 更新・復旧の実手順。
