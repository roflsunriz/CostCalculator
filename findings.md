# 調査知見

- TypeScript 7はtypescript-eslintのpeer範囲外で安定APIも不足するため、対応確認まで6系を維持する。TS6では `baseUrl` を削除し、`paths` を `./` 始まりへ直す。
- `@vitejs/plugin-react` 6はBabelを同梱せず、旧 `babel` optionは型エラーになる。Vite 8と同時に `react()` + `@rolldown/plugin-babel` の `reactCompilerPreset()` へ移行する。
- 同じworkflowを触るDependabot PRは1件ずつsquashし、残りをrebaseする。手動push後はDependabot由来判定が失敗するため、CIとmergeable状態を根拠に手動判断する。
- `bun audit fix` だけでは厳密な間接依存範囲が残る。overrideとlockfileを同時更新し、上流更新で安全版が自然解決されたらoverrideを外す。
- 2026-10-31の監査でZodとminimatchを修正版へ更新した。Bun 1.3.8の固定インストール、監査、lint、型、buildを確認した。
- `bun run format` は対象外ファイルも再整形するため、実行後に変更一覧を監査して今回の対象だけを残す。
