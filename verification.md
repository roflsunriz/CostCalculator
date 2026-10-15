# 検証手順

## 依存監査（2026-10-11）

Dependabot PR #19〜#23 の `verify` は、共通の `bun audit` で `source-map-js` 1.2.1 を検出して失敗した。main で先に修正済みの `brace-expansion` 5.0.12 は維持した。`package.json` の override と `bun.lock` を `source-map-js` 1.2.2 へ更新し、`bun install --frozen-lockfile` と `bun audit`（既知脆弱性 0 件）を確認した。

main の修正コミット `d9c00a8` で CI の `verify` が成功した後、PR #19、#20、#22、#23、#21 の順に main へマージされた。各 PR は Dependabot の rebase 後に `verify` 成功を確認した。最後に open PR 0件、Dependabot リモートブランチ0件を確認した。残る開発依存の更新では ESLint 10.12.0 と各 patch 版を適用した。postcss 更新後は `source-map-js` の override を削除し、lockfile 内の 1.2.2 と監査0件を確認した。Bun 1.4.0 で固定インストール、lint、型チェック、ビルドも成功した。TypeScript 7.0.2 は `typescript-eslint` 8.71.1 の peer 範囲外であり、6.0.3 を維持した。本リポジトリには `test` スクリプトが定義されていない。

## Dependabot 自動処理（2026-09-23）

`.github/workflows/dependabot-automation.yml` を actionlint で検査し、PR 用 workflow 名（CI）と一致することを確認する。現在は Dependabot PR の全チェック成功後に更新種別を問わず取り込む。古い SHA や再失敗の PR は原因を調べて修正する。

## Dependabot Open PRの一括処理（2026-09-23）

- 対象はPR #1〜#6・#9（#7・#8は処理前に取込済み）。`gh pr checks` で #1〜#5の `verify` 成功を確認し、#1→#2→#3→#4→#5の順に `gh pr merge --squash` した。同一ファイル更新の競合は `@dependabot rebase` で再評価させて解消した。
- #6（plugin-react 6.1.1）は `vite.config.ts` の `babel` オプションが型エラーで `verify` 失敗。`react()`＋`@rolldown/plugin-babel` の `reactCompilerPreset()` へ移行し `@rolldown/plugin-babel` 0.2.4を追加して `verify` 成功を確認後にマージした。手動push後の `dependabot / classify` 失敗はfetch-metadataの作成者判定によるもので、品質ゲートは `verify` とした。
- #9（typescript 7.0.2）は `typescript-eslint` がpeer `typescript <6.1.0` でTS7未対応のため `verify`（lint）失敗。TS 7.0自体に安定APIがなく対応は7.1以降待ちのため、PRは理由をコメントしてcloseし、代替としてTypeScript 6.0.3＋`typescript-eslint` 8.70.1＋`tsconfig.app.json` の `baseUrl` 廃止（`paths` を `./` 始まり化）をmainへ適用した。
- main（ffb486d）でCIの `verify` 成功を確認。ローカルでも `bun run lint`・`type-check`・`build` 成功、`bun audit` で脆弱性0件を確認した。`bun run format` は無関係ファイルまで再整形するため差分を確認して戻し、最小差分を保った。
- 処理後にOpen PR 0件、Dependabotリモートブランチ残存0件（`git fetch --prune` で確認）となった。

## 依存脆弱性の確認（2026-09-23）

監査では brace-expansion を含む推移依存の旧版が検出された。Bun 1.4.0 で lockfile の固定インストールと再監査を行い、既知脆弱性 0 件を確認した。lint・型・ビルド成功。

大量の Dependabot PR により CI 完了より分類が遅れる場合でも、分類後の `workflow_dispatch` が現在の PR 番号と head SHA を照合して再評価する。別の作成者、古い SHA、未完了の CI はマージしない。

## 2026-10-05: GitHub受付・READMEの整備（公開前）

- 比較元: `0208e8ee0040d6422a423eeba728b8f6ae56ba22`（`main`）。
- 受付フォーム 2 件のYAML構造、重複キー・ID、入力型、選択肢、予約ファイル名を一括検査し、エラー0件。
- 既存の固有質問・入力例・必須条件を原文と照合。READMEのリンク・画像・コマンド・条件を確認し、裏付けがある誤記だけを訂正した。
- 既存のCI、Dependabot、labeler、ライセンスのファイル内容は比較元から変更していない。
- 製品のビルド・インストール・実機操作、GitHub上のフォーム表示、公開後CIは今回の静的検証に含めない。公開後に実際の受付表示と必要ラベルの適用を確認する。

## 2026-10-05: 公開後の依存監査修復

- 元の受付整備PRはマージ済みだが、同じmainのCIでは依存監査が失敗していた。既存CIや監査条件は変えず、依存定義とlockを修復した。
- 公式npm registryとGitHub Advisory Databaseで修正版と依存範囲を確認した。brace-expansion 5.0.12を採用し、固定lockと全依存監査（0件）、lint・型・ビルドを検証する。
- ローカル結果: CIと同じBun（1.3.8）で固定lockとbun audit成功（既知脆弱性0件）。lint、型検査、本番build成功。単体テストscriptは本repoでは定義されていない。

## 2026-10-16: findings.md への知見分離

- 対象: AGENTS.md、README.md。固有の環境・構成・実行手段・調査知見を [findings.md](findings.md) に分離し、AGENTSには純粋な指示と説明、目的、禁止事項を残した。利用者向けの操作・導入手順、更新・復旧手順、既存の実測証跡は保持した。
- 実測: 移動した5節について、書式上の空白・Markdown表の区切り幅を正規化して移動前本文との一致を確認した。変更文書の相対リンク・参照アンカーはすべて解決し、コードフェンスと見出し構造、文書以外の無関係な差分がないこと、`git diff --check` 成功を確認した。
- GitHub既存のDependabot警告を読み取り、未解決警告0件を確認した。既存Open PRは0件。これはGitHubで既に算出された結果の参照であり、新たなローカル監査の成功を示すものではない。
- ローカル脆弱性監査とレジストリへの最新版照会は、自動承認審査が依存情報のOSV・npm・PyPI等への送信を拒否したため未実行。依存名・版と送信先を承認できる環境で監査・更新確認を再開する。GitHub既存警告の0件だけでは、全依存の現時点の安全性や最新版であることを保証しない。
- アプリコード・依存定義・lockfileを変更しない文書移動のため、製品のビルド・GUI操作・ブラウザ操作・実機書込みは実行していない。製品挙動を新たに検証したとは扱わない。
- 既存ローカルPrettierで変更文書の書式を確認した。
