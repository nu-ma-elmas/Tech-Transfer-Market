# Profile: local-web-app

## 適用範囲

利用者の記録をBrowser内に永続化する、AIなし・Server DatabaseなしのWeb Applicationに使う。要求入力で確定した体験に必要な複数画面を許可する。認証、複数ユーザー、Device間同期、共有Record、秘密API Key、Server API、保証されたBackupが必要な製品には使わない。それらをDeadline中にこのProfileへ追加しない。

## Frontend

Frontend Frameworkは要求入力（`docs/init-mvp-spec.md`）で明示されたものを正本とし、Agent判断で別のFrameworkへ変更しない。ReactとTypeScriptを使用するかどうか、およびRouterやRendering方式を含むFramework固有の構成も要求入力に従う。

要求入力で定義された画面だけを実装する。複数画面を許可するが、Profileを理由に画面、機能、代替動線、Architectureを追加しない。

## Data

実行時Dataの正本は利用者のBrowserである。Storage機構を要求入力でちょうど1つ決め、Agent判断で変更または追加しない。`localStorage`を指定した場合は、要求入力で確定したBrowser内DataだけをJSONとして保存する。

Storage境界ではRuntime Validationを行い、不正なDataをDomainへ渡さない。実装前に、KeyまたはObject Store名、明示的なSchema Version、読み取り時のField単位Validation、不正・未知・破損Dataからの安全な復旧、読み書きに失敗したときの挙動を要求入力で確定する。壊れたDataを黙って正常として扱わず、保存成功を偽装しない。

BrowserのData削除により記録が消えること、Device間で同期しないことを利用者へ明示する。

## AI境界

このProfileではAI、秘密API Key、Server APIを使用しない。Agent判断で追加しない。Client Bundle、HTML、ログ、Export Dataへ秘密情報を含めない。

## 公開

Deploy Targetは要求入力で明示されたものを正本とし、Agent判断で別の公開先へ変更しない。FrameworkとDeploy Targetに適合する既存の最小構成を使用し、要求入力にないServer、Database、認証、外部Serviceを追加しない。

実際のProduction URLを取得し、本番環境でProduction SmokeとMobile / Responsive確認を行う。URL到達確認だけでProduction SmokeをPASSにしない。

## 必須Test / Gate

`npm run lint`、`npm run test`、`npm run build`をPASSさせる。主要操作、正常な保存Data、不正Data、Schema不一致、破損からの復旧、Storageの読み書き失敗、空状態、Keyboard操作、要求入力で指定されたMobile Viewportでの挙動を対象とする。

Production URL確認、Production Smoke、Mobile / Responsive確認を必須とする。Repositoryの固定Workflowが定めるその他のMandatory Gateも維持し、削除、skip、緩和しない。

## Deadline Risk

要求入力にない画面、機能、Backend、Server API、AI、凝ったVisual、複数の代替動線、投機的な抽象化はDeadlineを脅かす。品質Gateを緩めず、確定Scope外を追加しない。
