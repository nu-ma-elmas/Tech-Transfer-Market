# 独立ベースラインレビュー（step5 / 周回1）

- Verdict: APPROVED
- Blockers: 0
- Follow-ups: 13
- Ready to merge: YES

## Evidence

変更Diffを読まず、はじめてこのRepositoryをcloneした第三者としてRepository全体を読んだ。プロセス生成物（`docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md`、`docs/baseline-review.md`、`docs/template-reviews/` 配下の既存File）は検査対象にも入力にもしていない。

読んだFile。

- `README.md`（1-99行）、`CLAUDE.md`（1-39行）、`LICENSE`（1-21行）
- `docs/init-mvp-spec.md`（1-105行。§4の14手順と§5を含む）
- `package.json`、`package-lock.json`（存在確認のみ）、`vite.config.ts`、`vitest.config.ts`、`eslint.config.js`、`tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`、`.gitignore`、`index.html`
- `src/App.tsx`、`src/App.test.tsx`、`src/main.tsx`、`src/styles.css`、`src/test/setup.ts`
- `.devcontainer/devcontainer.json`、`.devcontainer/devcontainer-lock.json`
- `.github/workflow-templates/deploy-pages.yml.template`、`deploy-templates/vercel.json.template`
- `profiles/static-basic/PROFILE.md`、`profiles/daily-local-app/PROFILE.md`、`profiles/on-local-data-use-ai-app/PROFILE.md`
- `.claude/commands/spec.md`、`.claude/commands/goal.md`、`.claude/agents/*.md`（3件）

### 検査した結果、成立していたこと

**ローカル絶対Path・他Repository固有の設定の混入は無い。** `elmas` / `/mnt/c` / `C:\Users` / `/home/<user>/` を全File（`node_modules`、`dist`、`.git`、`docs/template-reviews` を除く）に対して検索し、該当0件。`__APP_NAME__` / `__APP_DESCRIPTION__` の出現は `index.html:7`、`src/App.tsx:5,10,11`、および置換を指示する側の記述（`docs/init-mvp-spec.md:56`、`.claude/agents/independent-code-reviewer.md:23`、`.claude/agents/independent-baseline-reviewer.md:37`）だけであり、Placeholderは意図した位置にだけある。

**置換・配置・検証を前提とするFileに、いずれも所有者がいる。** `index.html` / `src/` のPlaceholder、`README.md` の書き換え、`package.json` の `name`、`vite.config.ts` の `base`、`.github/workflow-templates/deploy-pages.yml.template` と `deploy-templates/vercel.json.template` の複製、Template由来のApp Shell Testの置き換えは、すべて `docs/init-mvp-spec.md:55-62`（§4手順3）が担当を明示している。加えて `.claude/agents/independent-code-reviewer.md:23` と `.claude/agents/independent-baseline-reviewer.md:37-43` が事後の検査を担う。

**Deploy素材は所定のPathに、`.template` 拡張子で置かれている。** `.github/workflows/` は存在せず、Templateをcloneしただけの状態でDeployが暴発しない。複製先（`.github/workflows/deploy-pages.yml`、`vercel.json`）は §4手順3（`docs/init-mvp-spec.md:60`）が指定する。`deploy-pages.yml.template:31-38` はlint・test・buildのStepを保持しており、同行の「複製元にあるlint・test・buildのStepを削らない」と整合する。

**正本・Profile・実装・Testの4者に相互矛盾は見つからなかった。** `CLAUDE.md:31-33` のProfile要約と `profiles/*/PROFILE.md` の「公開」節（`static-basic:25`、`daily-local-app:37`、`on-local-data-use-ai-app:29`）のVite base規定が一致する。`README.md:57-75` の14手順要約は `docs/init-mvp-spec.md:43-79` と手順名・順序・周回上限（最大2周）で一致する。`src/App.test.tsx` は `src/App.tsx` の実際のDOM（`banner` / `main` / `h1` / `.description` / 2番目のTab focus先である `.primary-action`）に対して成立する。

**`.gitignore` は §5 のプロセス生成物を除外していない**（`.gitignore:1-14`）。`docs/` 配下は追跡対象であり、`docs/init-mvp-spec.md:85` の「`.gitignore` へ入れない」と整合する。

**Repositoryが前提条件を明示している箇所を評価した。** Preflight（`docs/init-mvp-spec.md:47-53`）は `gh auth status`、Working Treeの清潔さ、npm各コマンドの実行可否、Pages SourceがGitHub Actionsであること／Vercelの認証とServer Environment Variable、実行環境の現在時刻とTimezoneを、いずれも実装開始前に確認し、満たさなければFileを作らず停止すると定めている。以下のFOLLOW_UPのうち環境依存のもの（3, 5）は、この明示と `README.md:39-47` の回避手順によって、使う人が事前に回避できる。したがってBLOCKERとしない。

### 判断

以上より、**このRepositoryは、これから使う第三者にとって成立している。** 公開または利用が実際に壊れる経路を具体的に書ける項目は見つからなかった。BLOCKER 0件、`Ready to merge: YES`。

以下はすべて、単独ではblockしないFOLLOW_UPである。

---

## FOLLOW_UP

### FOLLOW_UP 1: `docs/template-reviews/` の13Fileに削除の所有者がいない（Template差し戻し候補）

File Evidence: `docs/template-reviews/`（追跡されている13File）、`README.md:85`、`docs/init-mvp-spec.md:55-62`

`README.md:85` は「このTemplate自体を改造したときの独立レビュー証跡。アプリ開発では使わない」と説明しているが、§4手順3にこれらを削除する指示が無い。しかも同手順は `README.md` からTemplate自身の構成説明を消すよう求めるため、**削除の指示が無いFile群だけが残り、それを説明していた文だけが消える。** cloneした人のPUBLIC Repositoryに、本Appと無関係なレビュー証跡が13件残る。公開は壊れない。

### FOLLOW_UP 2: `CLAUDE.md` が初期化後も自身をTemplateと名乗る（Template差し戻し候補）

File Evidence: `CLAUDE.md:3`、`docs/init-mvp-spec.md:55-62`

`CLAUDE.md:3` は「このRepositoryは、24時間以内に小さなWebアプリを公開するためのTemplateである」と書く。§4手順3は `README.md`・`index.html`・`src/`・`package.json` の書き換えを列挙するが `CLAUDE.md` を含まない。初期化後、AIへのProject契約だけが「これはTemplateである」と述べ続ける。`/goal` の再開に必要な記述はそのまま要るため、1行の書き換え指示があれば足りる。

### FOLLOW_UP 3: devcontainerのSkills Mountが、Host環境の前提に依存する（Template差し戻し候補）

File Evidence: `.devcontainer/devcontainer.json:9-11`、`README.md:37-51`

`README.md:39-47` は「Hostに `~/.claude/skills/` を先に作る」「不要なら `mounts` の3行を削除してよい」と前提条件と回避手順を明示しており、この明示によって使う人は回避できる。ただし `README.md:49` の「Windowsには `HOME` が無く `USERPROFILE` があり」は常に真ではない（Git for Windows / MSYS / 手動設定で `HOME` が定義されている環境がある）。両方が定義されている場合、`source=${localEnv:HOME}${localEnv:USERPROFILE}/.claude/skills` は2つの絶対Pathの連結になり、Containerが起動しない。また、Target Pathの親 `/home/node/.claude` がImageに存在しない場合、Dockerがこれを `root` 所有で作成しうる。**回避手順が明示されているためFOLLOW_UPだが、`README.md:49` の断定は「両方が定義されている場合」を含めて書き直す価値がある。**

### FOLLOW_UP 4: `docker-outside-of-docker` featureが、どこからも使われず説明もされていない

File Evidence: `.devcontainer/devcontainer.json:7`、`README.md:35-51`

このfeatureはHostのDocker socketをContainerへ渡す。`docs/init-mvp-spec.md` の14手順にも `profiles/` にもDockerを使う手順は無く、`README.md` の「開発コンテナ」節はSkills Mountだけを説明してこのfeatureに触れていない。使わない権限を既定で渡している。動作は壊れない。

### FOLLOW_UP 5: `containerEnv.TZ` が作者のTimezoneに固定されている（Template差し戻し候補）

File Evidence: `.devcontainer/devcontainer.json:16-18`、`docs/init-mvp-spec.md:53`

`TZ: Asia/Tokyo` は他Repository（他の利用者）固有の値である。ただし §4手順1（`docs/init-mvp-spec.md:53`）が「実行環境の現在時刻とTimezoneを実際に取得し」「両者のTimezoneが異なる場合は…`docs/goal-progress.md` の冒頭に記録する」と定めているため、Deadline計算は壊れない。JSTは実在するTimezoneであり時刻は絶対値として正しい。第三者にはこの固定値の理由が読み取れない点だけが残る。

### FOLLOW_UP 6: `index.html` の `description` と `lang` が、機械的な置換漏れ検査に掛からない（Template差し戻し候補）

File Evidence: `index.html:2,6`、`src/App.tsx:11`、`docs/init-mvp-spec.md:56,61`

`src/App.tsx:11` は `__APP_DESCRIPTION__` というPlaceholderを使うのに、`index.html:6` の `<meta name="description">` は英語のTemplate説明文そのもの（`A lightweight starting point for a deadline-driven static MVP.`）であり、Placeholder形式ではない。§4手順3（`docs/init-mvp-spec.md:56`）は散文で「`index.html` にTemplate自身の説明文を残さない」と求めているが、同61行の「Template固有の文字列を検索し」で機械的に拾えるのは `__...__` 形式だけである。`index.html:2` の `lang="en"` も同様に、どの手順も言及していない。公開は壊れない。

### FOLLOW_UP 7: 既定のVite baseが3Profile中1つにしか一致しない（Template差し戻し候補）

File Evidence: `vite.config.ts:6`、`docs/init-mvp-spec.md:59`、`profiles/static-basic/PROFILE.md:25`、`profiles/daily-local-app/PROFILE.md:37`

出荷時の `base: '/'` は `on-local-data-use-ai-app` にだけ一致し、GitHub Pagesの2Profileでは §4手順3で書き換えなければ本番でassetが404になる。この書き換えには所有者（§4手順3）があり、2種の独立Reviewerも検査項目に挙げているためBLOCKERとしない。ただし**機械的に検知するTestもGateも無く、失敗の現れ方が本番の白画面である。** 既定値をProfile未選択と分かる形にする、またはbaseとProfileの一致を検査するTestを持つ余地がある。

### FOLLOW_UP 8: Deploy Workflowの既定Branch前提とdeployのcancel設定（Template差し戻し候補）

File Evidence: `.github/workflow-templates/deploy-pages.yml.template:3-6,13-15`、`docs/init-mvp-spec.md:45,47-53`

(a) `branches: [main]` は、cloneした人の既定Branch名が `main` であることを前提とする。`docs/init-mvp-spec.md:45` はこれを前提として宣言するが、Preflight（同47-53行）は既定Branch名を確認する項目を持たない。既定Branch名が異なる場合、手順12のDeployが発火しない。`workflow_dispatch:`（同6行）が手動での回避路になり、手順13の本番確認で気づけるため、壊れたまま公開されることはない。

(b) `concurrency: cancel-in-progress: true` は、Deployment用のconcurrency groupに対するGitHubの推奨（実行中の本番Deployは打ち切らない）と逆である。`docs/init-mvp-spec.md:79` が想定する「手順14のPushを契機に再度走るDeploy」が、直前のDeployを打ち切りうる。成果物が同一であるため結果は変わらない。

### FOLLOW_UP 9: AI ProfileのServer APIに、置き場所も型検査も規定が無い（Template差し戻し候補）

File Evidence: `profiles/on-local-data-use-ai-app/PROFILE.md:23-25,29`、`deploy-templates/vercel.json.template:1-6`、`tsconfig.app.json:21`、`package.json:8`

Profileは「AI処理はすべてServer APIを経由し」と要求し、Endpoint Pathは製品判断だと述べるが、**Repositoryのどこにも、そのServer CodeがどのDirectoryに置かれ、何が型検査するのかが書かれていない。** `tsconfig.app.json:21` は `include: ["src"]` であり、`npm run build`（`tsc -b && vite build`）はServer側のCodeを一切型検査しない。Profile:29は「Vercel固有のDependencyを追加しない」と定めるため、型定義を足す道も閉じている。ESLintは `**/*.{js,mjs,ts,tsx}` を対象とするため構文レベルの検査だけは掛かる。Vercelの規約に従って実装すればDeployは成立するため、公開は壊れない。

### FOLLOW_UP 10: `README.md` の「使い方」に前提条件が書かれていない

File Evidence: `README.md:11-33`、`docs/init-mvp-spec.md:47-53`

`README.md` の「使い方」は4手順を示すが、`git` / `gh` / `node` / `npm`、`gh auth status`、Pages SourceをGitHub Actionsにしておくこと、Vercelの認証とServer Environment Variableのいずれにも触れない。これらは §4手順1にだけ書かれており、人間は `/goal` が停止して初めて知る。Preflightが停止して報告する設計であるため利用は壊れないが、Repositoryのトップページから前提が読めない。

### FOLLOW_UP 11: Template自身の同一性がFileに残り、初期化の所有者がいない

File Evidence: `LICENSE:3`、`.devcontainer/devcontainer.json:2`、`profiles/`（3Profileすべて）

`LICENSE:3` の `Copyright (c) 2026 Deadline-Driven Lightweight SDD contributors`、`.devcontainer/devcontainer.json:2` の `"name": "Deadline-Driven Lightweight SDD"`、選択しなかった2つのProfileは、いずれも §4手順3の対象に入っていない。動作は壊れない。LICENSEの扱いはTemplateの方針判断（意図的に継承させている可能性がある）だが、方針がどこにも書かれていない。

### FOLLOW_UP 12: `README.md` の「Gate」が §4手順5と一致しない

File Evidence: `README.md:93-99`、`docs/init-mvp-spec.md:64`

`README.md` の「Gate」は `npm run lint` / `npm run test` / `npm run build` の3つを挙げるが、§4手順5は `npm ci` と `git diff --check` を含む5つを全PASSにすると定める。正本の要約が正本より緩い。正本は §4であると `README.md:55` が明記しているため実行は壊れないが、重複した要約が正本から乖離している。

### FOLLOW_UP 13: `.gitignore` が存在しないFileを否定している

File Evidence: `.gitignore:11`

`!.env.example` があるが `.env.example` はRepositoryに存在しない。`on-local-data-use-ai-app` のEnvironment Variable名は製品判断（`profiles/on-local-data-use-ai-app/PROFILE.md:25`）であるため空のExampleを置く必然性は無いが、否定Patternだけが残っている。動作は壊れない。
