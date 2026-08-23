# 独立ベースラインレビュー（Step 3）

- Verdict: BLOCKED
- Blockers: 4
- Ready to merge: NO

## Evidence

- 対象: Repository全体（Branch `feat/lightweight-goal-commands`、HEAD `b13edee`）。差分ではなく、Templateから作った新Repositoryが受け取る現在の状態を「はじめて読む人」として検査した
- 読んだFile: `git ls-files` の30件すべて（`docs/init-mvp-spec.md`、`CLAUDE.md`、`README.md`、`.claude/commands/*`、`.claude/agents/*`、`profiles/*/PROFILE.md`、`.devcontainer/*`、`.github/workflow-templates/*`、`deploy-templates/*`、`src/*`、`index.html`、`package.json`、`tsconfig*.json`、`vite.config.ts`、`vitest.config.ts`、`eslint.config.js`、`.gitignore`、`LICENSE`、`docs/template-reviews/*`）
- 削除物の調査: `git log --all` および `git show 3a57051:...` / `git show --stat c1ca87f` で、`profiles/daily-local-app/PROFILE.md`、`.agents/skills/initialize-project/SKILL.md`、`scripts/validate-template.mjs`、`tests/template/app-shell-placeholders.test.tsx` の内容と削除時点を確認した
- Command実行はしていない。`npm ci` / `lint` / `test` / `build` を再実行していない（Fileを1件も増やさないため）
- 本Reviewで作成したFileは `docs/template-reviews/step3-baseline-review.md` 1件のみである。他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない

### 検証して問題が無かった点

- ローカル絶対Path・個人情報の混入: `/home/`、`/mnt/c`、`C:\`、`/Users/`、`elmas`、`OneDrive` を全Fileへgrepして0件。`ef6f96e`（2026-08-14）のVault mount削除は現在も維持されている
- 実Credential: 検出なし。`.devcontainer/devcontainer-lock.json` はfeatureのdigestのみ
- `/goal` の出力Pathとの衝突: `docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md` はいずれも最初から存在しない（`b13edee` で `docs/template-reviews/` へ退避済み）
- 手順番号の整合: `README.md:35-54`・`CLAUDE.md:14`・`docs/init-mvp-spec.md:40-60` はいずれも13手順で一致している
- Working Treeは clean（`dist/` と `node_modules/` は `.gitignore` 済み）

---

## BLOCKER

### BLOCKER 1: 「永続化あり・AIなし」のアプリがどのProfileにも当てはまらず、`/spec` でProfileを選択できない

**File Evidence**

- `docs/init-mvp-spec.md:26` — 「- Profile: `static-basic`（GitHub Pages） / `on-local-data-use-ai-app`（Vercel + Server API）のどちらか」。二択を強制している
- `profiles/static-basic/PROFILE.md:5` — 「入力・計算・表示を一時的なReact stateで完結できる…**必須の永続履歴**…が必要な製品には**使わない**」
- `profiles/static-basic/PROFILE.md:13` — 「実行時Dataは一時的なReact stateだけで持つ。…Reloadで一時Stateがリセットされる挙動を…受け入れ条件に明示する」
- `profiles/on-local-data-use-ai-app/PROFILE.md:5` — 「実行時Dataを利用者のBrowser内に保持し、**Serverの責務を「秘密Keyが必要なAI呼び出し」だけに限定する**Browserアプリに使う」
- `profiles/on-local-data-use-ai-app/PROFILE.md:19` — 「AI処理はすべてServer APIを経由し」。Server APIの存在が前提であり、AIを使わないアプリはこのProfileの定義に入らない

localStorage / IndexedDB で記録を残すが AI を使わないアプリ（習慣記録、家計メモ、Checklistなど、このTemplateが最も想定しそうな24時間MVP）は、`static-basic` が明示的に除外し、`on-local-data-use-ai-app` は前提を満たさない。`/spec` 手順2でProfileを埋められず、`independent-spec-reviewer` の判断基準（`.claude/agents/independent-spec-reviewer.md:21`「Profileが選ばれていない…」）で必ずBLOCKERになる。

**混入時点**

`c1ca87f`（2026-08-13「refactor: 旧プロセス層を削除して最小構成にする」）で `profiles/daily-local-app/PROFILE.md` が削除された。削除前の内容（`git show 3a57051:profiles/daily-local-app/PROFILE.md`）は「a static, single-device app whose approved experience includes one local daily item or action and small local history」であり、まさにこの領域を埋めていた。`459067a`（2026-08-04）でAI Profileを追加したときは3Profile体制で穴が無く、削除時に穴が生まれている。分岐元より前の混入であり、差分レビューでは原理的に検出できない。

**付随する内部矛盾**

`profiles/static-basic/PROFILE.md:13` は「実行時Dataは一時的なReact stateだけで持つ」と断じた直後に「永続Storageは必須ではなく、明示的な製品判断なしに追加しない」と続く。後半は「製品判断があれば追加してよい」と読めてしまい、:5 の除外条項および同じ:13 の「Reloadでリセットされる挙動を受け入れ条件に明示する」と両立しない。この曖昧さのせいで、上記の穴が「static-basic で押し通せる」と誤読される経路まで用意されている。

---

### BLOCKER 2: Deploy素材を有効化する手順が§4のどこにも無く、`static-basic` の公開が構造的に成立しない

**File Evidence**

- `vite.config.ts:6` — `base: '/'`
- `profiles/static-basic/PROFILE.md:21` — 「ViteのProduction Build（`dist`）を `.github/workflow-templates/deploy-pages.yml.template` から作るWorkflowで公開する。Vite baseは `/<repository_name>/` とする」
- `docs/init-mvp-spec.md:58` — 「11. **Deploy** — Profileの既定方式でDeployする。GitHub Pagesの場合、Vite baseは `/<repository_name>/`」
- `docs/init-mvp-spec.md:56` — 「9. **Commit** — レビューを通った内容と、§5のプロセス生成物をCommitする」
- `docs/init-mvp-spec.md:57` — 「10. **Push** — fast-forwardのみ」
- `docs/init-mvp-spec.md:60` — 「13. **証跡の確定** — …**変更するのは `docs/` 配下だけ**であり、Deploy済みの成果物を変えない」
- `.github/workflow-templates/deploy-pages.yml.template` は `.template` 拡張子のままで、`.github/workflows/` は存在しない（`ls .github` で `workflow-templates` のみ）
- `deploy-templates/vercel.json.template:1-6` も同様に `.template` のまま

GitHub Pages（Actions Source）で公開するには、(a) `.github/workflows/deploy-pages.yml` が **Commit・Push されている**こと、(b) `vite.config.ts` の `base` が `/<repository_name>/` に **なった状態でBuildされる**ことの両方が必要である。ところが§4は、手順9でCommit、手順10でPushしたあと、手順11ではじめてbaseに言及する。手順11で `vite.config.ts` を書き換えても、それをCommit/Pushする手順はもう無い（手順13は `docs/` 配下限定）。手順3「実装」がこれらを担うとはどこにも書かれておらず、`.template` を `.github/workflows/` へ配置せよという指示も全Fileに存在しない（`grep -rn "workflows"` のヒットは `README.md:67` の構成説明のみ）。

結果として、指示どおりに`/goal`を実行すると次のどれかになる:

1. Workflowを作らないまま手順11に到達し、GitHub Pagesへ何もDeployされない
2. 手順11でWorkflowと`base`を作るが、Commitする手順が無く、Push済みのTreeには反映されない
3. 手順13で`docs/`以外をCommitして、正本の制約に違反する

`base` が `/` のままDeployされた場合、Project Pages（`https://<owner>.github.io/<repo>/`）では `/assets/*.js` を取りに行って404となり、白画面になる。手順12「本番確認」ではじめて失覚するが、そこから直す正規の経路は§4に無い。

**混入時点**

`vite.config.ts:6` の `base: '/'` は `c68ec59`（2026-08-03、最初のscaffold）から不変。Deploy素材の有効化は当時 `.agents/skills/initialize-project/SKILL.md` の「Mutations, in order」手順4・5（`Set Vite base to /<repository_name>/` / `Create .github/workflows/deploy-pages.yml from the workflow template and remove the template`）が担っていた。`459067a` のCommit本文も「initialization activates exactly one and removes both templates」と明言している。この Skill が `c1ca87f`（2026-08-13）で削除され、責務が誰にも移らないまま `.template` だけが残った。分岐元より前の混入である。

---

### BLOCKER 3: Placeholder `__APP_NAME__` / `__APP_DESCRIPTION__` を置換する責務が無主で、検出Testも削除済みのため全Gateを通過して本番へ出る

**File Evidence**

- `src/App.tsx:5` — `<a className="brand" href="#main-content">__APP_NAME__</a>`
- `src/App.tsx:10` — `<h1 id="page-title">__APP_NAME__</h1>`
- `src/App.tsx:11` — `<p className="description">__APP_DESCRIPTION__</p>`
- `index.html:7` — `<title>__APP_NAME__</title>`
- `src/App.test.tsx:7-9` — 「It must stay independent of the placeholder values … and pass both **before and after** the placeholders are replaced」
- `src/App.test.tsx:18` — `expect(title.textContent?.trim()).not.toBe('')` — `__APP_NAME__` でもPASSする
- `grep -rn "APP_NAME"`（`node_modules`・`dist`・`.git` 除く）のヒットは上記4箇所のみ。置換を指示するDocumentもCommandも存在しない

`docs/init-mvp-spec.md:50` の手順3「実装」も、`.claude/commands/goal.md` も、Placeholderの存在自体に言及していない。`/goal` が §2 の受け入れ条件だけを見て実装した場合、`<title>` とHeaderに `__APP_NAME__` を残したまま手順4（lint/test/build）を全PASSし、手順5の独立レビュー（判断基準は `.claude/agents/independent-code-reviewer.md:16-24` にありPlaceholder項目は無い）も通り、手順12「本番確認」も受け入れ条件の動線しか見ないため、Placeholder入りのSiteが公開される。Gateの網に一切かからない。

**混入時点**

Placeholder自体は `c68ec59`（2026-08-03）から存在する。当時は `.agents/skills/initialize-project/SKILL.md`（置換の実行者）、`scripts/validate-template.mjs`（`npm run template:validate` による検査）、`tests/template/app-shell-placeholders.test.tsx`（Placeholder残存の検出Test）の3つが対になっていた。`c1ca87f`（2026-08-13）が3つとも削除し、Placeholderだけが残った。`src/App.test.tsx:7-9` のコメントは「置換前後どちらでもPASSする」ことを**要件として明記**しているため、現存する唯一のTestは設計上この欠陥を検出できない。分岐元より前の混入である。

---

### BLOCKER 4: `/spec` が「秘密Key・Serverが要るならこのTemplateの対象外」と述べ、`on-local-data-use-ai-app` Profileの存在と矛盾する

**File Evidence**

- `.claude/commands/spec.md:24` — 「`static-basic` にServer、DB、認証、複数ユーザー、秘密Keyが必要になった場合、それは**このTemplateの対象外**である。Scopeを削るか、**別の基盤を選ぶ**かを人間に判断させる」
- `docs/init-mvp-spec.md:26` — Profileの選択肢に `on-local-data-use-ai-app`（Vercel + **Server API**）が挙がっている
- `CLAUDE.md:32` — 「`on-local-data-use-ai-app`: Vercelへ公開する。…**秘密API Key**はServer Environment Variableだけに置き」
- `profiles/on-local-data-use-ai-app/PROFILE.md:19` — 「AI処理はすべて**Server API**を経由し、KeyはServer Environment Variableとしてだけ存在する」

Server と秘密Key は、まさに `on-local-data-use-ai-app` Profileが引き受けるために用意された要件である。`/spec` 手順2はそれを「このTemplateの対象外」と断じ、人間に「別の基盤を選ぶ」ことまで提案する。`/spec` は Profile を確定させる唯一のCommandであり、この一文に従うと、Templateが正式に支援している領域のアプリが入口で追い返される。正本・CLAUDE.md・PROFILE.md の三者に対する単独の食い違いであり、`/spec` の中核機能（Profile選択）を誤動作させる。

正しくは「`static-basic` の制約に反するので `on-local-data-use-ai-app` へ切り替えるか、Scopeを削る」であり、Template対象外なのは AI Profile も除外する領域（Server DB、認証、複数User、Device間同期など。`profiles/on-local-data-use-ai-app/PROFILE.md:5`）だけである。

**混入時点**

`8aa13c4`（2026-08-14「feat: `/spec` と `/goal` のCommandを追加する」）でこの一文が新設された。Branch内の変更でありながら、`docs/template-reviews/` の3件の独立レビュー（step1-code / step1-resolution / step1-final）はいずれも検出していない。3件とも「参照先が実在するか」「手順番号がずれていないか」という参照整合性の観点で読んでおり、**他Fileが述べる事実との突き合わせ**を行っていないためである。

---

## FOLLOW_UP

### FOLLOW_UP 1: Template自身を宣伝するApp Shellの本文が新Repositoryへ継承され、内容も古い

- `src/App.tsx:9` — `<p className="eyebrow">Vite Static template</p>`（AI Profileでは事実として誤り）
- `src/App.tsx:13-16` — 「Deadline-Driven Lightweight SDD keeps a 24-hour MVP focused: settle the smallest complete experience before implementation, then retain every quality gate.」Templateの宣伝文がそのまま利用者のSiteに出る
- `src/App.tsx:22-28` — 「Settle `docs/init-mvp-spec.md` with Claude Code, set its status to `CONFIRMED`, then **ask Claude Code to read the file and implement it**」。`79907b4`（2026-08-13）で `/goal` を削除して自然言語指示へ一本化した時代の記述であり、`8aa13c4` で `/spec` と `/goal` が復活した現在の `README.md:15-31` と食い違う
- `index.html:6` — `<meta name="description" content="A lightweight starting point for a deadline-driven static MVP." />`。Placeholderですらなく、置換対象として認識されない
- `index.html:2` — `<html lang="en">`。運用Documentも想定利用者も日本語である

混入時点は `c68ec59`（2026-08-03）／`c1ca87f`（2026-08-13、App Shell本文の書き換え）。BLOCKER 3 と同じ「初期化Skill喪失」の残骸だが、こちらは置換されなくてもSiteが壊れないためFOLLOW_UPとする。

### FOLLOW_UP 2: `package.json` の識別子がTemplateのまま

- `package.json:2` — `"name": "deadline-driven-lightweight-sdd"`
- `package.json:4` — `"version": "1.0.0"`

`.agents/skills/initialize-project/SKILL.md` の Mutations 手順2（`set name to app_slug`）が担っていた。`c1ca87f`（2026-08-13）で責務が消えた。`private: true` なので実害は小さい。

### FOLLOW_UP 3: `.gitignore` に `.env` 系と `.vercel/` が無い

- `.gitignore:1-6` — `node_modules/` / `dist/` / `coverage/` / `*.local` / `.DS_Store` / `*.log` のみ
- `profiles/on-local-data-use-ai-app/PROFILE.md:19` — 秘密API Keyを扱うProfileが存在する
- `docs/init-mvp-spec.md:36` — 「秘密情報とローカル絶対PathをCommitしない」

`vercel env pull` が生む `.env.local` は `*.local` で拾えるが、`.env`、`.env.production`、および `vercel link` が作る `.vercel/`（`project.json` に orgId / projectId を含む）は素通りする。§4手順8「Security確認」という人間・AIの目視Gateだけが防波堤になっている。混入時点は `c68ec59`（2026-08-03、`.gitignore` は以後一度も変更されていない）。

### FOLLOW_UP 4: `docs/template-reviews/` の3件が新Repositoryへ継承される

- `docs/template-reviews/step1-final-review.md:3-7` — 「Verdict: APPROVED / Ready to merge: YES」
- `docs/template-reviews/step1-code-review.md:10-11` — 「対象Branch: `feat/lightweight-goal-commands` / Base: `feat/lightweight-goal`」。利用者のRepositoryには存在しないBranch名
- `README.md:64` が「アプリ開発では使わない」と説明しているため、`b13edee` 以前のような「実装前のAPPROVEDが `docs/code-review.md` に居座る」形の実害は解消済み

Path衝突が無く説明もあるためFOLLOW_UPだが、Template固有の証跡が新Repositoryに残り続ける点は変わらない。`b13edee`（2026-08-14）の移設で現在の形になった。

### FOLLOW_UP 5: Mobile幅の基準が 375px と 320px で不統一、AI Profileには幅の要件が無い

- `docs/init-mvp-spec.md:54` — 「7. **Mobile確認** — 375px幅で」
- `.claude/agents/independent-code-reviewer.md:23` — 「375px幅で受け入れ条件の動線が使えない」
- `profiles/static-basic/PROFILE.md:25` — 「狭い画面幅（320 CSS pixel）での挙動を対象とする…320 px幅でContentがはみ出さない」
- `profiles/on-local-data-use-ai-app/PROFILE.md:29` — 必須Testの列挙に画面幅の項目が一切無い

320は375より厳しいため矛盾ではないが、どちらを満たせばよいかが正本から一意に読めない。またAI Profileを選ぶと自動Testでの狭幅検証要件が消え、手順7の目視だけになる。混入時点は `87b1d4a`（2026-08-13、2Profileの見出し構成統一）以前から。

### FOLLOW_UP 6: §4がBranch運用を定めていない

- `docs/init-mvp-spec.md:42` — 「1つでも満たさない場合は、**Branch**・Commitを作らず」。Branchを作る前提で書かれている
- しかし§4の手順1〜13に、Branchを作る手順も、どのBranchで作業するかの指定も無い
- `.github/workflow-templates/deploy-pages.yml.template:4-5` — `on: push: branches: [main]`

手順10でFeature Branchへpushした場合、Pages Workflowは発火しない。BLOCKER 2 を直す際に併せて決めるべき項目。混入時点は `dc064b9`（2026-08-13）以降の§4整備。

### FOLLOW_UP 7: devcontainerの環境固定と過剰なfeature

- `.devcontainer/devcontainer.json:13-15` — `"containerEnv": { "TZ": "Asia/Tokyo" }`。`b13edee`（2026-08-14）でTimezone不整合対策として追加されたものだが、Template利用者のTimezoneがJSTとは限らない。§4手順1が実測を義務づけたため実害は無いが、既定値としては作者環境固定である
- `.devcontainer/devcontainer.json:7` — `ghcr.io/devcontainers/features/docker-outside-of-docker:1`。Viteの開発とnpm Gateしか行わないTemplateに対し、HostのDocker Socketを渡す権限は過大である。`c1ca87f` 以前のTemplate開発用途の名残とみられる

### FOLLOW_UP 8: `CLAUDE.md` のGate列挙が正本より狭い

- `CLAUDE.md:25` — 「Gate（lint、test、build、独立レビュー、Mobile確認、Security確認、本番確認）を削らない」
- `docs/init-mvp-spec.md:51` — 手順4は `npm ci` と `git diff --check` も含む

`CLAUDE.md` だけを読んだContextが `git diff --check` を任意と解釈しうる。混入時点は `b13edee`（2026-08-14）でのCLAUDE.md改稿時点でも未修正。

---

## 総括

BLOCKER 4件のうち3件（1・2・3）は、いずれも `c1ca87f`（2026-08-13「refactor: 旧プロセス層を削除して最小構成にする」）で **削除された側にあった責務が、残された側へ移らなかった** ことに起因する。削除されたのは `profiles/daily-local-app/PROFILE.md`、`.agents/skills/initialize-project/SKILL.md`、`scripts/validate-template.mjs`、`tests/template/app-shell-placeholders.test.tsx` であり、残されたのは Placeholder、`.template` 拡張子のDeploy素材、`base: '/'` である。「最小構成にする」リファクタが、対になっていた片側だけを消した結果である。

BLOCKER 4 のみBranch内（`8aa13c4`）の混入だが、既存の3件の独立レビューはいずれも参照整合性の観点でしか読んでおらず、他Fileが述べる事実との突き合わせを行っていないため検出されなかった。

いずれも差分レビューの視野外にあり、Templateから作った新Repositoryが最初のcloneで受け取る状態である。
