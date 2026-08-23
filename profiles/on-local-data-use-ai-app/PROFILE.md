# Profile: on-local-data-use-ai-app

## 適用範囲

実行時Dataを利用者のBrowser内に保持し、Serverの責務を「秘密Keyが必要なAI呼び出し」だけに限定するBrowserアプリに使う。Server Database、認証、複数User、Device間同期、Backend中心の業務System、Queue、Batch処理、常駐Server、有料Infrastructure、AI Agent Orchestrationが必要な製品には使わない。それらはこのTemplateの範囲外であり、Deadline中にこのProfileを拡張せず、別の基盤を選ぶ。

## Frontend

Vite、React、TypeScriptとTemplateのApp Shellを維持する。別のFrontend Frameworkへ切り替えない。Deploy成果物はViteのProduction Build（`dist`）のままとする。

## Data

実行時Dataの正本は利用者のBrowserである。利用者DataをServer Databaseに保存しない。

**永続するかどうかを、要求入力（`docs/init-mvp-spec.md`）で先に決める。**

永続しない場合は、Storage機構を持たない。Reloadやタブを閉じることで入力と結果がリセットされる挙動を、受け入れ条件に明示する。永続を「念のため」で足さない。

永続する場合は、Storage機構をちょうど1つ決める。`localStorage` は小さなJSONに限り許可し、複数Record、構造化Data、画像Blobを扱う場合はIndexedDBを使う。DataはDeviceローカルであるため、BrowserのData削除で消えること、Device間で同期しないことを利用者へ明示する。どちらの機構でも、KeyまたはObject Store名、明示的なSchema Version、読み取り時のField単位Validation、不正・未知のDataからの安全な復旧、読み書き失敗時の挙動を仕様で決める。壊れたDataを黙って正常として扱わない。

## AI境界

Browserは秘密API Keyを直接使わない。AI処理はすべてServer APIを経由し、KeyはServer Environment Variableとしてだけ存在する。KeyをClient Bundle、HTML、ログ、Export Dataへ絶対に含めない。Server APIはAI処理に必要な最小責務に限定し、画像、利用者Record、AI応答をServer側に永続保存しない。

実装前に仕様で確定する: RequestのMethod、最大Request Size、Content Type、Timeout、Rate Limit。AI処理が失敗したときの挙動（Retry方針、利用者に見せるError、手入力Fallbackのいずれか）も定義する。Environment Variable名、Endpoint Path、AI Providerは製品判断であり、このProfileは既定値もCodeも提供しない。

## 公開

Deploy先はVercelとし、月額固定費¥0（Vercel Free Tierで動く構成）に収める。Vercel設定は `deploy-templates/vercel.json.template` の最小構成だけを使い、Vercel固有のDependencyを追加しない。Vite baseは `/` のままとし、GitHub Pages形式の `/<repository_name>/` をこのProfileで使わない。

## 必須Test

つねに対象とする。主要動線、仕様で確定したClient側のRequest境界、TimeoutとError表示を含むAI失敗時の挙動、手入力Fallback（ある場合）、空状態、Keyboard操作。秘密の値がClient Bundleへ到達しないことを、Testまたは明示的な確認で証明する。

永続すると決めた場合だけ加える。正常・不正・Schema不一致の保存Data、破損からの復旧、Storageの読み書き失敗。

## Deadline Risk

画面の追加、凝ったPrompt Engineering、Streaming応答、多段のAgent的挙動、Server側の永続化、投機的なProvider抽象化は、いずれもDeadlineを脅かす。品質Gateを緩める前に、これらを削る。
