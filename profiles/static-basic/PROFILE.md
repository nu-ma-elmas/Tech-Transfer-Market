# Profile: static-basic

## 適用範囲

入力・計算・表示を一時的なReact stateで完結できる、1〜数画面の静的アプリに使う。Server、Database、認証、Device間同期、秘密API Key、必須の永続履歴、複雑なRoutingが必要な製品には使わない。

利用者の記録が同じDeviceに残り続けることが確定した体験の一部なら `daily-local-app` を選ぶ。AI処理のためにServerと秘密Keyが必要なら `on-local-data-use-ai-app` を選ぶ。

## Frontend

Vite、React、TypeScriptとTemplateのApp Shellを維持する。別のFrontend Frameworkへ切り替えない。画面は1つを基本とし、確定した体験が1画面で成立しない場合にだけ少数の画面を追加する。Router、State管理Library、Analytics、PWAを追加しない。このProfileは問いと制約を示すものであり、実装Codeを生成しない。

## Data

実行時Dataは一時的なReact stateだけで持つ。**このProfileは永続Storageを使わない。** `localStorage`、`sessionStorage`、IndexedDB、Cookieのいずれも追加しない。永続が必要だと分かった時点で、このProfileを拡張せず `daily-local-app` を選ぶ。

Reloadやタブを閉じることで一時Stateがリセットされる挙動を、要求入力（`docs/init-mvp-spec.md`）の受け入れ条件に明示する。

## AI境界

このProfileにServerはなく、秘密Keyを一切扱わない。AI処理が必要なら、このProfileを拡張せず `on-local-data-use-ai-app` を選ぶ。

## 公開

Deploy先はGitHub Project Pagesとし、月額固定費は¥0である。ViteのProduction Build（`dist`）を `.github/workflow-templates/deploy-pages.yml.template` から作るWorkflowで公開する。Vite baseは `/<repository_name>/` とする。

## 必須Test

主要操作、入力の境界値、存在する空状態とError状態、Keyboard操作、狭い画面幅（320 CSS pixel）での挙動を対象とする。例: Keyboardだけで主要動線を完了できる。不正な入力に文言のMessageが表示される。空状態が次の行動を説明する。320 px幅でContentがはみ出さない。

## Deadline Risk

画面の追加、凝ったVisual、永続Storage、Content取り込みPipeline、複数の代替動線は、いずれもDeadlineを脅かす。品質Gateを緩める前に、これらを削る。
