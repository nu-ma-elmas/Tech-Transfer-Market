# Profile: daily-local-app

## 適用範囲

利用者の記録が同じDeviceに残り続けることを、確定した体験の一部として必要とする静的アプリに使う。1〜数画面で、記録の規模が小さいものを対象とする。Server、Database、認証、複数ユーザー、Device間同期、共有Record、秘密API Key、保証されたBackup、外部の権威ある時刻が必要な製品には使わない。それらはこのTemplateの範囲外であり、Deadline中にこのProfileを拡張せず、別の基盤を選ぶ。

永続が不要なら `static-basic` を選ぶ。AI処理のためにServerと秘密Keyが必要なら `on-local-data-use-ai-app` を選ぶ。

## Frontend

Vite、React、TypeScriptとTemplateのApp Shellを維持する。別のFrontend Frameworkへ切り替えない。画面は1つを基本とし、確定した体験が1画面で成立しない場合にだけ少数の画面を追加する。Router、State管理Library、Analytics、PWAを追加しない。このProfileは問いと制約を示すものであり、実装Codeを生成しない。

## Data

実行時Dataの正本は利用者のBrowserである。Storage機構をちょうど1つ、要求入力（`docs/init-mvp-spec.md`）で決める。`localStorage` は小さなJSONに限り許可し、複数Record、構造化Data、画像Blobを扱う場合はIndexedDBを使う。

実装前に仕様で確定する。KeyまたはObject Store名、明示的なSchema Version、読み取り時のField単位Validation、不正・未知のDataからの安全な復旧、読み書きに失敗したときの挙動。**壊れたDataを黙って正常として扱わない。**

BrowserのData削除で記録が消えること、Device間で同期しないことを利用者へ明示する。

## 時刻と日付（日付を扱う場合だけ）

日付や時刻を扱わないアプリでは、この節の要求は発生しない。書く必要がないものを仕様に書かない。

日付を扱う場合は、利用者に見せるTimezoneと1日の境界を、Codeを書く前に製品判断として決める。Device時計を信頼し、外部の権威ある時刻を取りに行かない。

1日に1件という制約を持つ場合は、同じ日に同じ操作を繰り返しても記録が重複せず、意図せず上書きもされないことを仕様で決める。

集計や指標を表示する場合は、集計に用いる指標、計算式、記録が0件のときの表示を仕様で確定する。集計は論理的な1件を1回だけ数える。このProfileは既定値もCodeも提供しない。

## AI境界

このProfileにServerはなく、秘密Keyを一切扱わない。AI処理が必要なら、このProfileを拡張せず `on-local-data-use-ai-app` を選ぶ。

## 公開

Deploy先はGitHub Project Pagesとし、月額固定費は¥0である。ViteのProduction Build（`dist`）を `.github/workflow-templates/deploy-pages.yml.template` から作るWorkflowで公開する。Vite baseは `/<repository_name>/` とする。

## 必須Test

つねに対象とする。主要操作、保存Dataが正常な場合と不正な場合、Schema不一致、破損からの復旧、Storageの読み書き失敗、記録が0件の空状態、Keyboard操作、狭い画面幅（320 CSS pixel）での挙動。

仕様で日付を扱うと決めた場合だけ加える。日付境界の両側。1日1件の制約を置いた場合は、同一日の操作の繰り返しと重複防止。集計を表示する場合は、集計が0件のときと1件以上のとき。

## Deadline Risk

画面の追加、凝ったVisual、Content取り込みPipeline、複数の代替動線、日付Libraryの導入、投機的なAnalyticsは、いずれもDeadlineを脅かす。品質Gateを緩める前に、これらを削る。
