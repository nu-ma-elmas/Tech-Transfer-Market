# Deadline-Driven Lightweight SDD

24時間以内に小さなWebアプリを公開するための軽量な仕様駆動開発Templateです。良い `docs/init-mvp-spec.md` を正本として、Claude CodeまたはCodexから実行できます。

## 考え方

- **Deadline First** — 開発開始から24時間以内に公開する。超過しそうなら機能を削る。テスト、独立レビュー、本番確認は削らない
- **Scope Before Code** — 実装前に、利用者が最初から最後まで価値を体験できる最小の完成体験を1つに絞り、AIが迷わず実装できるように仕様を固める
- **仕組みは後付け** — 実際に使って問題が起きたら、その対処だけをTemplateへルールとして追記する。最初から問題を想像して仕組みを作らない

## 使い方

1. このTemplateからGitHub Repositoryを作る

2. Claude Codeで `/spec` を実行する

   ```text
   /spec
   ```

   AIが壁打ちで `docs/init-mvp-spec.md` §2（アプリ固有の仕様）を確定し、`independent-spec-reviewer` Subagentによる独立レビューを通してから引き渡す。

3. **人間が** `docs/init-mvp-spec.md` §1のStatusを `CONFIRMED` にする

   `CONFIRMED` にできるのは人間だけである。AIはこれを行わない。

4. Claude Codeで `/goal` を実行する

   ```text
   /goal docs/init-mvp-spec.md
   ```

   AIが§4のワークフロー14手順を順に実行し、結果を報告する。人間の判断が必要になったら停止する。

Codexでは、人間が確定済みの同じ要求入力から次の入口で独立仕様Reviewを行い、承認後に手順1〜14の実装・公開Workflowを実行する。

```text
$impl-mvp docs/init-mvp-spec.md
```

## 開発コンテナ

`.devcontainer/devcontainer.json` は、Hostの `~/.claude/skills/` をContainerの `/home/node/.claude/skills` へ**読み取り専用で**Mountする。Hostに置いたCoding規約（Claude CodeのSkill）を、Container内のClaude Codeから読むためである。

**このMountを使う場合、Hostに `~/.claude/skills/` を先に作っておく。**

```bash
mkdir -p ~/.claude/skills
```

作らずに起動すると、Dockerがそのフォルダを `root` 所有で自動作成する。以後、HostのClaude Codeが自分のHome配下のそのPathへ書けなくなる。**Containerは正常に起動するため、壊れたことに気づきにくい。**

**このMountが不要なら、`mounts` の3行を削除してよい。** Templateの動作はこのMountに依存しない。

Source Pathは `${localEnv:HOME}${localEnv:USERPROFILE}` を連結している。Windowsには `HOME` が無く `USERPROFILE` があり、macOSとLinuxはその逆であるため、存在する側だけが展開される。

Target Pathは `/home/node` に固定している。`remoteUser` が `node` であることに依存する。Base Imageや `remoteUser` を変えるときはTarget Pathも変える。

## ワークフロー14手順

`docs/init-mvp-spec.md` §4が正本です。

```text
 1. Preflight        git/gh/node/npm、gh auth、Working Tree、npm各コマンド、
                     Profileの公開先、実行環境の時刻とTimezone
 2. 仕様確認         §1が CONFIRMED、§2に空欄・矛盾がないこと
 3. 初期化           Placeholder置換、README書き換え、package.json名、
                     Vite base、Deploy素材の配置
 4. 実装
 5. テスト           npm ci / lint / test / build / git diff --check を全PASS
 6. 独立レビュー     2種を両方行う。整合性レビュー（Diffを見る）と
                     ベースラインレビュー（Diffを見ずRepository全体を見る）
 7. BLOCKER修正      最大2周。超えたら停止して人間へ
 8. Mobile確認       375px幅
 9. Security確認     実Credential混入チェック
10. Commit           レビューを通った内容＋プロセス生成物
11. Push             fast-forwardのみ
12. Deploy           Profileの既定方式
13. 本番確認         Production URLで受け入れ条件をMobile幅で確認
14. 証跡の確定       未Commitのプロセス生成物をCommit・Push（自身の行は書かない）
```

`/goal` は進捗を `docs/goal-progress.md` に記録します。中断しても同じCommandで続きから再開し、完了済みの手順をやり直しません。記録は1手順ずつ終えた直後に書き、完了日時はシステム時刻から実際に取得した値だけを書きます（推定値を書きません）。

## 構成

- `docs/init-mvp-spec.md` — 唯一の要求入力。仕様Templateと固定ワークフローを自己完結で持つ
- `CLAUDE.md` — Claude CodeへのProject契約
- `.claude/commands/` — `/spec`（壁打ち）と `/goal`（実装〜公開）
- `.claude/agents/` — `independent-spec-reviewer`、`independent-code-reviewer`、`independent-baseline-reviewer`
- `AGENTS.md` — Codexが常に守るプロジェクト契約
- `.agents/skills/impl-mvp/` — Codexの独立仕様Review・実装・公開ワークフロー入口
- `.codex/agents/` — Codexの独立仕様Reviewer、独立コードReviewer、独立ベースラインReviewer
- `docs/template-reviews/` — このTemplate自体を改造したときの独立レビュー証跡。アプリ開発では使わない。`/goal` が書く `docs/code-review.md` と衝突させないためここに置く
- `profiles/` — 適用範囲と公開先ごとの制約
  - `static-basic` = GitHub Pages / 永続保存なし
  - `daily-local-app` = GitHub Pages / ローカル永続あり・AIなし
  - `on-local-data-use-ai-app` = Vercel / ローカル永続あり・Server API経由のAIあり
- `src/` ほか — Vite + React + TypeScriptのスターター
- `.github/workflow-templates/`, `deploy-templates/` — Deploy素材

## Gate

```bash
npm run lint
npm run test
npm run build
```
