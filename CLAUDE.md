# Claude Code Project契約

このRepositoryは、24時間以内に小さなWebアプリを公開するためのTemplateである。

## 正本

`docs/init-mvp-spec.md` が唯一の要求入力であり、アプリ固有の仕様Templateと固定の実装ワークフローの両方を持つ。AIはこのFileの§2以外を書き換えない。§2を書くのは `/spec` の手順4だけであり、§1を `CONFIRMED` にするのは人間だけである。

## Command

```text
/spec                          §2を壁打ちで確定し、独立レビューを通して人間へ引き渡す
（人間が§1を CONFIRMED にする）
/goal docs/init-mvp-spec.md    §4の手順1から14を実行し、本番確認と証跡の確定まで届ける
```

`/goal` は `docs/goal-progress.md` に進捗を記録し、中断しても同じCommandで続きから再開する。完了済みの手順をやり直さない。記録は1手順ずつ、終えた直後に書き、完了日時はシステム時刻から実際に取得した値だけを書く。

## 実装原則

- 仕様にない機能を追加しない。迷ったら作らない
- 既存Dependencyで実装できるなら新規Libraryを追加しない
- 将来拡張のための抽象化をしない
- 秘密情報とローカル絶対PathをCommitしない
- Gate（lint、test、build、独立レビュー、Mobile確認、Security確認、本番確認）を削らない。Testの削除・skip・Gate緩和で通さない
- 独立レビューは実装したContextとは別の新しいSubagent Contextで行い、実装した本人は承認しない
- 製品判断が必要になったら、判断を発明せず停止して人間に確認する

## Profile

- `static-basic`: GitHub Pagesへ公開する。Vite baseは `/<repository_name>/`。永続保存を持たず、Reloadで入力が消える
- `daily-local-app`: GitHub Pagesへ公開する。Vite baseは `/<repository_name>/`。利用者のBrowserへローカル永続する。Serverと秘密Keyを持たない
- `on-local-data-use-ai-app`: Vercelへ公開する。Vite baseは `/`。秘密API KeyはServer Environment Variableだけに置き、Client Bundle、HTML、ログ、Export Dataへ含めない

詳細は `profiles/<selected_profile>/PROFILE.md` を正本とする。

## 運用方針

実際に使って問題が起きたら、その対処だけを `docs/init-mvp-spec.md` へルールとして追記する。最初から問題を想像して仕組みを増やさない。
