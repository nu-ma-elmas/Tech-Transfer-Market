# Step 5 ベースラインレビュー（独立・Diff非参照）

- Verdict: BLOCKED
- Blockers: 1
- Follow-ups: 10
- Ready to merge: NO

## 前提

このRepositoryはMVPではなく、**MVPを作るためのPUBLIC Templateそのもの**である（`is_template=true`、PUBLIC）。したがって「これから使う人」とは、Templateの作者を知らない第三者である。本レビューは変更Diffを一切参照せず、はじめてこのRepositoryをcloneした第三者としてRepository全体を読んだ。

## Evidence

読んだFile（すべて実体）。

- 正本・契約: `docs/init-mvp-spec.md`（105行、§4の14手順と§5）、`CLAUDE.md`（39行）、`README.md`（81行）
- Command / Subagent: `.claude/commands/spec.md`、`.claude/commands/goal.md`、`.claude/agents/independent-spec-reviewer.md`、`.claude/agents/independent-code-reviewer.md`、`.claude/agents/independent-baseline-reviewer.md`
- Profile: `profiles/static-basic/PROFILE.md`、`profiles/daily-local-app/PROFILE.md`、`profiles/on-local-data-use-ai-app/PROFILE.md`
- 実装とTest: `src/App.tsx`、`src/App.test.tsx`、`src/main.tsx`、`src/test/setup.ts`、`src/styles.css`、`index.html`
- Build / Gate設定: `package.json`、`vite.config.ts`、`vitest.config.ts`、`eslint.config.js`、`tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`、`.gitignore`
- 開発環境とDeploy素材: `.devcontainer/devcontainer.json`、`.devcontainer/devcontainer-lock.json`、`.github/workflow-templates/deploy-pages.yml.template`、`deploy-templates/vercel.json.template`、`LICENSE`

読まなかったFile（プロセス生成物。検査対象にも入力にもしていない）。

- `docs/goal-progress.md`（不存在）、`docs/spec-review.md`（不存在）、`docs/code-review.md`（不存在）、`docs/baseline-review.md`（不存在）
- `docs/template-reviews/` 配下の既存11File

なお本レビューの過程で、ローカル絶対Pathの機械検索が `docs/template-reviews/` 配下の3行にヒットしたが、いずれも過去のレビュー本文であり、内容を判断材料にしていない。実体としてRepositoryの外部Pathを参照しているのは `.devcontainer/devcontainer.json:10` の1件だけである（BLOCKER 1）。

確認して問題を認めなかった主要点。

- `vite.config.ts:6` の `base: '/'` は、Profile未選択のTemplate既定として妥当であり、Profileごとの設定は `docs/init-mvp-spec.md:59` が手順3で要求し、`independent-code-reviewer`（`.claude/agents/independent-code-reviewer.md:23`）と `independent-baseline-reviewer`（同:38）が二重に検査する。責務は無主ではない
- Deploy素材は `.github/workflow-templates/deploy-pages.yml.template` と `deploy-templates/vercel.json.template` に `.template` 拡張子で置かれ、`docs/init-mvp-spec.md:60` が所定Pathへの複製を、両GitHub Pages Profile（`profiles/static-basic/PROFILE.md:25`、`profiles/daily-local-app/PROFILE.md:37`）が複製元を指定している。Template側でCIが暴発しない配置になっている
- `deploy-pages.yml.template:31-38` はlint / test / buildのStepを保持しており、`docs/init-mvp-spec.md:60` の「複製元にあるlint・test・buildのStepを削らない」と整合する
- `eslint.config.js:8` が `dist` と `coverage` をignoreしているため、`npm run build` 後に `npm run lint` を再実行してもBuild成果物をlintして落ちない
- `LICENSE:3` の著作権表示は個人名ではなく `Deadline-Driven Lightweight SDD contributors` であり、第三者がcloneしても不都合がない
- `src/` と `index.html` にTemplate自身の宣伝文とPlaceholderが残っているが、これはTemplate本体として正しい状態であり、除去は `docs/init-mvp-spec.md:56-57` の手順3の責務である
- `.gitignore:9-10` が `.env` / `.env.*` を除外し、`on-local-data-use-ai-app` の秘密Keyの取り違えを防いでいる

---

## BLOCKER

### BLOCKER 1. 開発環境の定義が、cloneした人のホスト環境の外部Pathをbind mountする

**何がどう壊れるか**: cloneした第三者がDevcontainerを開くと、Repositoryに存在しないホスト側Path `~/.claude/skills` をbind mountしようとするため、Container起動が失敗する（macOS/Windows Docker Desktopの共有外Path）か、cloneした人のHome配下にroot所有の空Directoryが勝手に作られる。いずれの場合も、`docs/init-mvp-spec.md:48-49` のPreflightが要求する `claude` / `gh` を備えた開発環境が仕様どおりに立ち上がらない。

**File Evidence**

- `.devcontainer/devcontainer.json:9-11`

```json
  "mounts": [
    "source=${localEnv:HOME}/.claude/skills,target=/home/node/.claude/skills,type=bind,readonly"
  ],
```

**根拠**

1. **参照先がRepositoryの外にあり、Repositoryのどこにも作る手順がない。** このRepositoryの `.claude/` 配下は `agents/`（3File）と `commands/`（2File）だけで、`skills/` は存在しない（`.claude/agents/`、`.claude/commands/` を確認）。mount元 `${localEnv:HOME}/.claude/skills` はTemplate作者のホストにしか存在しない個人設定である。
2. **責務が無主である。** `README.md`、`CLAUDE.md`、`docs/init-mvp-spec.md` のいずれも `.devcontainer/` に一度も言及しない。`README.md:61-73` の「構成」にも `.devcontainer/` の行がない。`docs/init-mvp-spec.md:55-62` の手順3（初期化）にも、このmountを削除・置換・検証する項目がない。したがって、cloneした人がこの前提を知る経路も、満たす経路も、Repository内に存在しない。
3. **ホスト環境への副作用がある。** Linuxホストでは、存在しないbind mount元をDockerがroot所有Directoryとして自動生成する。cloneしただけの人のHome配下に、Repositoryと無関係なDirectoryが残る。
4. **Windowsホストでは解決先が壊れる。** Windowsは `HOME` を標準の環境変数として設定しない（`USERPROFILE` を使う）。Dev Containersの `${localEnv:HOME}` は未定義時に空文字へ解決されるため、mount元が `/.claude/skills` になる。Docker Desktopは共有対象外のPathとしてContainer起動を拒否するか、VM Filesystemのroot直下へ生成する。
5. **`readonly` であっても副作用は消えない。** `readonly` はContainerからの書き込みを禁じるだけで、ホスト側のmount元Directory生成を防がない。

**なぜこの視点でしか見つからないか**: `.devcontainer/devcontainer.json` はTemplateから継承されたまま変更されないFileであり、アプリ開発時のDiffには現れない。整合性レビューからは原理的に見えない。

---

## FOLLOW_UP

FOLLOW_UPは単独では決してblockしない。

### FOLLOW_UP 1. 使われていない `docker-outside-of-docker` Featureが、ホストのDocker Daemonへの制御をContainerへ渡す（Template差し戻し候補）

- `.devcontainer/devcontainer.json:7`、`.devcontainer/devcontainer-lock.json:8-12`

このFeatureはホストの `/var/run/docker.sock` をContainerへmountする。RepositoryにはDockerfileもDocker Composeも無く、`package.json:6-11` のScript、`deploy-pages.yml.template`、`vercel.json.template` のいずれもdockerを呼ばない。使途が無い一方で、Container内で自律実行されるAgentがホストのDocker Daemon（＝ホストの任意Pathのmountを含む）を操作できる状態を作る。公開は壊れないためFOLLOW_UPとするが、削除が妥当である。

### FOLLOW_UP 2. Timezoneが作者のTimezoneに固定されている（Template差し戻し候補）

- `.devcontainer/devcontainer.json:16-18`（`"TZ": "Asia/Tokyo"`）

第三者がcloneすると、`docs/init-mvp-spec.md:30` のDeadlineを自国Timezoneで書いても、実行環境の時刻はJSTになる。`docs/init-mvp-spec.md:53` のPreflightが「両者のTimezoneが異なる場合」の手続きを定めているため公開は壊れないが、PUBLIC Templateの既定値としては作者固有である。

### FOLLOW_UP 3. `.devcontainer/` がRepositoryのどの文書からも参照されていない（Template差し戻し候補）

- `README.md:61-73`（「構成」に `.devcontainer/` の記載なし）、`CLAUDE.md` 全体、`docs/init-mvp-spec.md` 全体

`.devcontainer/devcontainer.json` は `claude-code` と `github-cli` のFeatureを入れており、`docs/init-mvp-spec.md:48-49` のPreflightが要求する `gh` / `claude` の供給元として実質的に必須である。それにもかかわらず、使う人向けの説明が1行も無い。BLOCKER 1の温床でもある。

### FOLLOW_UP 4. `index.html` のmeta descriptionだけがPlaceholderになっていない（Template差し戻し候補）

- `index.html:6`（`content="A lightweight starting point for a deadline-driven static MVP."`）
- `index.html:7`（`<title>__APP_NAME__</title>`）、`src/App.tsx:11`（`__APP_DESCRIPTION__`）

`src/App.tsx` は説明文を `__APP_DESCRIPTION__` としてPlaceholder化しているのに、`index.html` の同じ役割の文字列はTemplate固有の平文である。`docs/init-mvp-spec.md:61` の「Template固有の文字列を検索し、置き換え漏れが1件もないことを確認する」を `__` の検索で行うと、この1件だけがすり抜ける。すり抜けると、公開したAppのHTML headと検索結果・SNSプレビューにTemplateの説明文が出る。公開自体は成立するためFOLLOW_UPとするが、`__APP_DESCRIPTION__` へ揃えるのが妥当である。

### FOLLOW_UP 5. App Shell Testの自己記述が、正本およびProfileと三者で食い違っている（Template差し戻し候補）

- `src/App.test.tsx:6-9`（「must stay independent of the placeholder values and of any specific app name, and pass both before and after the placeholders are replaced」）
- `src/App.test.tsx:30`（`screen.getByRole('link', { name: 'View the first step' })`）
- `docs/init-mvp-spec.md:62`（「Template由来のApp Shell Testは、§2の仕様に対するTestへ置き換える」）
- `profiles/static-basic/PROFILE.md:11`、`profiles/daily-local-app/PROFILE.md:11`、`profiles/on-local-data-use-ai-app/PROFILE.md:9`（いずれも「TemplateのApp Shellを維持する」）

三つが同時に成立しない。Test自身のコメントは「置換の前後どちらでもPASSする」と宣言しているが、`:30` はTemplate固有の文言 `View the first step` に完全依存しており、`docs/init-mvp-spec.md:56` が要求する「`src/` にTemplate自身の宣伝文・説明文を残さない」を実行した時点で必ず落ちる。加えて正本はこのTestを「置き換える」と言い、ProfileはApp Shellを「維持する」と言う。手順5のGateが落ちて気づけるため公開は壊れないが、Deadline下で不要な迷いを生む。`:25-31` の `await user.tab()` を2回という前提も、Focusableな要素の個数に依存しており移植性が無い。

### FOLLOW_UP 6. 狭い画面幅の基準がFile間で不揃いで、AI Profileにだけ幅のTestが無い（Template差し戻し候補）

- `docs/init-mvp-spec.md:70`（手順8、375px幅）、`README.md:54`（「Mobile確認 375px幅」）
- `profiles/static-basic/PROFILE.md:29`、`profiles/daily-local-app/PROFILE.md:41`（いずれも必須Testに「狭い画面幅（320 CSS pixel）」）
- `profiles/on-local-data-use-ai-app/PROFILE.md:33`（必須Testに画面幅の項目が無い）

自動Testが320px、人手のMobile確認が375pxという二重基準の理由がどこにも書かれていない。さらに `on-local-data-use-ai-app` だけ幅のTestが必須から抜けており、他2Profileとの非対称に説明が無い。

### FOLLOW_UP 7. Template自身の開発証跡が、すべてのcloneへ継承される（Template差し戻し候補）

- `docs/template-reviews/`（11File）、`README.md:67`（「このTemplate自体を改造したときの独立レビュー証跡。アプリ開発では使わない」）
- `docs/init-mvp-spec.md:55-62`（手順3に削除の項目が無い）

使わないと明記されているFile群が、`docs/init-mvp-spec.md:85` の§5プロセス生成物にも該当しないまま、公開される第三者のRepositoryへ残る。`README.md:57` が「このRepositoryは公開されるため、残るとトップページを見た人が何のAppか判断できない」という理由でREADMEの書き換えを求めているのと同じ理由が、`docs/` にも当てはまる。手順3へ削除項目を足すか、Template側の置き場をRepository外へ移すのが妥当である。

### FOLLOW_UP 8. `on-local-data-use-ai-app` のServer APIが、型検査Gateの外に落ちる（Template差し戻し候補）

- `tsconfig.app.json:21`（`"include": ["src"]`）、`tsconfig.node.json:15`（`"include": ["vite.config.ts", "vitest.config.ts", "eslint.config.js"]`）
- `package.json:8`（`"build": "tsc -b && vite build"`）
- `profiles/on-local-data-use-ai-app/PROFILE.md:23-25`（AI処理はすべてServer API経由。秘密KeyはServer Environment Variableだけ）

このProfileはVercelのServer APIを必須とするが、Vercelが関数として拾う `api/` Directoryはどちらのtsconfigのincludeにも入っていない。`npm run build` の `tsc -b` はこれを型検査せず、`docs/init-mvp-spec.md:64` の手順5のGateを通過しても、秘密Keyを扱うCodeだけが型検査されないまま公開される。Profileが「既定値もCodeも提供しない」（`profiles/on-local-data-use-ai-app/PROFILE.md:25`）方針である以上、せめてtsconfigのincludeか、Server側Codeの置き場の規定が要る。

### FOLLOW_UP 9. 初期化の対象からCLAUDE.mdだけが外れている（Template差し戻し候補）

- `docs/init-mvp-spec.md:57`（手順3。書き換え対象は `README.md` のみ）
- `CLAUDE.md:3`（「このRepositoryは、24時間以内に小さなWebアプリを公開するためのTemplateである」）

`README.md` をAppの説明へ書き換える理由として `docs/init-mvp-spec.md:57` は「このRepositoryは公開されるため」と述べているが、同じく公開される `CLAUDE.md` は初期化後もRepositoryを「Template」と自称し続ける。動作は壊れないが、手順3の理由づけと対象範囲が一致していない。

### FOLLOW_UP 10. Gateの再掲が正本と一致せず、`.gitignore` に対象の無い否定パターンがある

- `README.md:75-81`（Gateとして `npm run lint` / `npm run test` / `npm run build` の3つだけを提示）に対し、`docs/init-mvp-spec.md:64`（手順5）は `npm ci` と `git diff --check` を含む5つを要求する
- `.gitignore:11`（`!.env.example`）に対し、`.env.example` はRepositoryに存在しない

いずれも動作を壊さない。正本が5つを要求する以上、READMEの再掲は正本へ合わせるか、再掲をやめて正本を指すのが一貫する。

---

## 総括

BLOCKER 1件により `BLOCKED`。単一のBLOCKERは `.devcontainer/devcontainer.json:9-11` の1行であり、この行はTemplateとして機能する上での必要性を持たず、削除すれば解消する。他の10件は、このRepositoryを使う人の公開を止めないためFOLLOW_UPとした。
