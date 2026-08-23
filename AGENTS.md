# Codexプロジェクト契約

このRepositoryは、24時間以内に小さなWebアプリを公開するためのTemplateである。`docs/init-mvp-spec.md` を唯一の要求入力とし、選択された `profiles/<profile>/PROFILE.md` をProfile制約の正本とする。

## 恒常ルール

- 人間が確定した仕様だけを実装する。判断に迷う場合は、製品判断やScope外の機能を発明しない。
- 既存のVite、React、TypeScriptのApp ShellとRepository規約を維持する。確定したMVPに不可欠で、既存Dependencyでは実現できない場合を除き、Dependencyや抽象化を追加しない。
- WorkflowのGateを並べ替え、削除、統合、弱体化、自己承認してはならない。Codex用Delivery Workflowの正本は `.agents/skills/impl-mvp/SKILL.md` とする。
- 独立Reviewerは、実装Contextとは別の新しいSubagent Contextで実行する。Orchestratorは各Verdictをそのまま保持し、`BLOCKED` を承認として扱う、複数のVerdictを合成する、Reviewer Context内で対象を修正する、のいずれも行わない。
- 仕様または実装を修正した場合、その修正により失効したGateと独立Reviewをすべて再実行する。
- PASSさせるためにTestやGate設定を削除、skip、緩和してはならない。TemplateのApp Shell Testは、`docs/init-mvp-spec.md` §4手順3が求める場合に限り、仕様を検証するTestへ置き換える。
- Errorを握り潰さない。未実行の確認をPASSとして扱わず、発生していないDeployを報告しない。
- 実Credential、秘密情報、ローカル絶対PathをCommitしない。AI Profileの秘密情報はServer Environment Variableだけに置き、Client Bundle、HTML、ログ、Export Dataへ到達させない。
- Production URLを取得し、本番の受け入れ動線をMobile幅で確認する前に `COMPLETE` と報告しない。
- 仕様に製品判断が必要、外部Serviceに人間だけが行える操作が必要、Deadline RiskによりScope削減が必要、実Credentialを検出、固定Workflowとの意味的互換性を維持できない、のいずれかでは `HUMAN_DECISION_REQUIRED` として停止する。
- Delivery中に `docs/init-mvp-spec.md` を編集しない。§2を編集できるのは仕様確定Workflowだけであり、§1を `CONFIRMED` にできるのは人間だけである。
- `main` 上で作業する。人間がDeploy Workflowの変更を明示的に決めない限り、作業Branchを作らない。履歴を書き換えず、force pushしない。

## Repository規約

- Application Codeは `src/` に置く。Testは `*.test.ts` または `*.test.tsx` とし、確定した受け入れ動線と選択Profileの必須Testを覆う。
- Profileは `profiles/<profile>/PROFILE.md`、Deploy素材は `.github/workflow-templates/` と `deploy-templates/` に置く。
- Delivery証跡は `docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md`、`docs/baseline-review.md` とする。これらを `.gitignore` へ入れない。
- 機械的Gateは `npm ci`、`npm run lint`、`npm run test`、`npm run build`、`git diff --check` とする。

