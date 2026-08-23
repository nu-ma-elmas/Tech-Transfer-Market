---
name: impl-mvp
description: Repository内の人間が確定した要求入力1件をもとに、独立仕様Review、実装、独立コードReview、Deploy、本番確認までDeadline-Driven Lightweight SDDのMVPを一気通貫で届ける。仕様の作成や確定には使用しない。
---

# MVPを実装する

引数で指定されたMVPを、このRepositoryの固定Workflowに従って公開まで届ける。起動形式は `$impl-mvp docs/init-mvp-spec.md` とする。

## 引数を検証する

引数をちょうど1件だけ受け取り、このRepository内の要求入力Fileとして扱う。引数なし、複数引数、Option、Repository外のPath、Directory、存在しないFile、空のFileは拒否する。

引数のFileを唯一の要求入力とする。Workflow、進捗記録、停止条件を含む全文と、選択された `profiles/<profile>/PROFILE.md` を読む。既定値を補わず、要求入力を編集しない。§1が `CONFIRMED` でない、または入力に欠落や矛盾がある場合は実装せず、必要な判断とともに `HUMAN_DECISION_REQUIRED` を報告する。

## 実行前に再開位置を確認する

最初に `docs/goal-progress.md` を読む。存在しない場合は手順1から13の記録を作り、手順1から開始する。存在する場合は、未完了の最小番号から再開し、完了済みの手順を繰り返さない。手順1から13が完了済みなら手順14を行う。記録済みの手順7の周回数を読み戻し、修正を2周より多く繰り返さない。

手順2を完了済みとして再開するには、現在の要求入力に対する `docs/spec-review.md` の整合した `APPROVED` Verdictも必要である。Artifactがない、壊れている、またはReview後に要求入力が変更されている場合は、実装へ進まず、新しい独立Contextで仕様Reviewを再実行する。

各手順の完了直後、次へ進む前に、その手順だけを `docs/goal-progress.md` へ記録する。複数手順をまとめて更新せず、未完了の手順を先回りして完了にしない。完了時刻は、その時点のシステム時刻から実際に取得した値だけを書く。取得できなければ `時刻未取得` と書く。実行不要の手順は理由とともに `NOT_RUN` とし、`PASS` と書かない。

## 正本のWorkflowを実行する

`docs/init-mvp-spec.md` §4の手順1から14を、詳細を弱めず記載順に実行する。次の説明はCodexでの実行契約を定めるものであり、§4を置き換えない。独立仕様Reviewは、Codex版で手順2を完了するための追加Gateである。

1. Application変更前にPreflightをすべて行う。必要Toolと認証、許可されたWorking Tree状態、install・lint・test・buildの実行可能性、選択Profileの公開先、実際の現在時刻・TimezoneとDeadlineを確認する。FAILの場合は `docs/goal-progress.md` だけを作成または更新し、BranchやCommitを作らず停止する。
2. §1と§2の全項目、項目間およびProfileとの整合性を確認する。続けて、後述の `independent-spec-reviewer` を新しい独立Contextで実行する。整合した `APPROVED` と `Ready to implement: YES` を得て `docs/spec-review.md` に記録するまで、この手順を完了せず、初期化・Application Code変更・実装へ進まない。製品判断の欠落または `BLOCKED` は `HUMAN_DECISION_REQUIRED` とする。
3. §4の規定どおりTemplateを初期化する。PlaceholderとTemplate説明、READMEとpackage名、Profileに合うVite baseとDeploy素材、置換漏れ、Template App Shell Testの仕様Testへの置換をすべて完了する。
4. §2だけを実装する。
5. `npm ci`、`npm run lint`、`npm run test`、`npm run build`、`git diff --check` を実行する。Testの削除・skip・緩和、Errorの抑制、Gateの弱体化を行わず、すべてPASSさせる。
6. 後述の `independent-code-reviewer` と `independent-baseline-reviewer` を両方実行する。別々の `APPROVED` Verdictが2件揃った場合だけこのGateを完了する。
7. 手順6のいずれかが `BLOCKED` の場合は、修正前に手順5と6を未完了へ戻し、修正周回数を増やす。指摘されたBLOCKERだけを修正し、手順5と両方のReviewを新しいContextで再実行する。2周を終えても承認されなければ `HUMAN_DECISION_REQUIRED` として停止する。
8. 375px幅で受け入れ条件の全動線を確認する。Browserを操作できるToolがなければ、視覚確認をPASSと報告しない。
9. Commit予定の全内容に実Credentialや秘密情報がないことを確認する。検出した場合は、単に削除して続行せず、人間へ報告して停止する。
10. Review済みの実装とプロセス生成物を、履歴を書き換えずCommitする。
11. fast-forwardだけでPushし、force pushしない。
12. 選択Profileの既定方式でDeployする。AIのKeyはServer Environment Variableだけに置く。
13. 実際のProduction URLを取得する。後述のブラウザ検証契約に従い、まず本番で受け入れ条件のProduction Smokeを行い、PASS後に同じ本番環境でMobile・Responsive確認を行う。両方がPASSするまで本番確認を完了しない。
14. プロセス生成物だけに未Commit変更が残る場合は、それらをCommitしてfast-forwardでPushする。それ以外の未Review変更があれば停止する。手順14自身の進捗行は追加しない。

## Productionブラウザ検証

手順13のProduction SmokeとMobile・Responsive確認では、利用可能な場合はPlaywright MCPをブラウザ検証の第一選択とし、利用できない場合だけ既存のBrowser操作Toolを代替手段として使用する。Playwright MCPを利用するためだけに、対象Repositoryへ `@playwright/test`、`playwright`、`playwright.config.*`、`e2e/` その他のPlaywright Test基盤を追加しない。要求入力がRepository内のE2E Test実装を明示的に求める場合は、その要求に従う。

確認内容はアプリ固有に固定せず、常に `docs/init-mvp-spec.md` の主要ユーザーフロー、Acceptance Criteria、Mobile要件、Production要件を正本として決定する。Production Smokeは取得した実際のProduction URLに対して行い、ローカルURLではPASSにしない。最低限、Production URLへのアクセス、初期画面と主要UIの描画、MVP成立性を確認できる最小の代表的な主要ユーザーフロー、主要なボタン・リンク・モーダル等の操作、致命的な描画崩れと操作を妨げるRuntime Errorの不在、本番で確認可能な主要Acceptance Criteriaを実際のブラウザ操作で確認する。仕様に複数の主要フローがある場合は、MVPの成立性を確認するために必要な最小の代表フローを選ぶ。`curl` 等はURL到達確認の補助に使用できるが、Playwright MCPまたは代替Browser操作Toolが利用可能なときにHTTP到達確認だけでProduction SmokeをPASSにしてはならず、ページが200を返すだけでもPASSにしない。

Production SmokeがPASSした後、同じProduction URLをモバイルViewportで確認する。要求入力にViewportまたは対象Deviceの指定があればそれを優先し、なければ `width: 390`、`height: 844` を使用する。横方向の意図しないoverflowがないこと、主要ContentがViewport内に収まること、固定HeaderまたはSticky UIが操作を妨げないこと、Bottom Navigationがある場合に表示・操作できること、ModalがViewport外へはみ出さないこと、主要CTAをtapできること、Textが重ならないこと、Cardや一覧を操作できること、主要ユーザーフローを完走できること、scroll不能等の重大な操作障害がないことを、表示確認と実際の主要操作の両方で確認する。ScreenshotだけではPASSにしない。

Playwright MCPでScreenshotを取得できる場合は、Production SmokeとMobile・Responsive確認の根拠として必要最小限を取得してよい。全画面の大量撮影、Screenshot管理System、Visual Regression基盤は追加しない。

Playwright MCPの起動または接続に失敗した場合は黙ってGateを省略せず、既存のBrowser操作Toolで同等の確認が可能かを確認する。同等のブラウザ操作確認ができなければ、確認していないGateをPASSにせず、既存のBlock State規則に従って `BLOCKED` または既存Skillが定める適切な停止状態を報告する。Production SmokeまたはMobile・Responsive確認がFAILした場合も手順13を完了せず、`COMPLETE` を報告しない。

## 独立仕様Review Gate

手順2で `independent-spec-reviewer` を、実装Contextとは別の新しいSubagent Contextとして起動する。要求入力Pathと選択Profileだけを渡し、実装計画、Orchestratorの推論、他ReviewerのVerdictを渡さない。

Reviewerはread-onlyで実行し、`docs/spec-review.md` に入れるArtifact全文を応答として返す。Orchestratorはその応答を一字一句変更せず `docs/spec-review.md` へ転記する。これは機械的な転記であり、OrchestratorによるReviewや承認ではない。応答の形式または値の整合性が壊れている場合、そのReviewはPASSしていないため、新しいContextで再実行する。

`APPROVED` はBLOCKER 0件かつ `Ready to implement: YES` の場合だけ成立する。`BLOCKED`、`FAIL`、または `Ready to implement: NO` の場合は、初期化と実装を開始せず `HUMAN_DECISION_REQUIRED` として停止する。OrchestratorとReviewerは要求入力を修正しない。人間または仕様確定Workflowが要求入力を修正した後に同じCommandで再開し、古いVerdictを失効させて新しい独立ContextでReviewを再実行する。FOLLOW_UPだけではblockしない。

## 独立実装Review Gate

手順6で `independent-code-reviewer` と `independent-baseline-reviewer` を、それぞれ実装Contextとは別の新しいSubagent Contextとして起動する。同時実行してよい。実装Contextが代行せず、一方のReviewを他方へ渡さず、実装時の推論や作業メモも渡さない。

`independent-code-reviewer` には次を渡す。

- 要求入力Pathと選択Profile
- 省略、要約、抜粋、選別していない変更Diff全文
- 手順5の正確なGate結果
- 関連するTest

`independent-baseline-reviewer` には、要求入力Path、選択Profile名、Repository名だけを渡す。変更Diffとプロセス生成物を読まないよう明示する。

両Reviewerはread-onlyで実行し、それぞれ `docs/code-review.md` または `docs/baseline-review.md` に入れるArtifact全文を応答として返す。Orchestratorは応答を一字一句変更せず所定のFileへ転記する。応答の形式または値の整合性が壊れている場合、そのReviewはPASSしていないため、新しいContextで再実行する。Verdictを変更、合成、格下げ、再解釈、上書きしてはならない。Reviewerは指摘を修正しない。実装を変更した場合、両方のVerdictが失効する。

`APPROVED` はBLOCKER 0件かつ `Ready to merge: YES` の場合だけ成立する。`BLOCKED` はBLOCKER 1件以上かつ `Ready to merge: NO` を要する。FOLLOW_UPだけでは公開をblockしない。

## 停止と報告

`docs/init-mvp-spec.md` §6に該当する、必要なGateを実行できない、またはReviewerが2周の修正後も `BLOCKED` の場合は、権限を発明せず停止する。停止した手順、根拠、人間に必要な判断または操作を報告する。未実行のStageをPASSとして報告しない。

手順1から13がPASSし、手順14後にプロセス生成物の未Commit変更がない場合だけ `COMPLETE` を報告する。3件の独立Verdict、Gate結果、Production URL、本番Smoke・Mobile確認の結果、公開をblockしないFOLLOW_UPを含める。
