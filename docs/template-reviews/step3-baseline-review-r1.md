# 独立ベースラインレビュー 周回1（Step 3）

- Verdict: BLOCKED
- Blockers: 3
- Ready to merge: NO

## Evidence

- 対象: Repository全体（Branch `feat/lightweight-goal-commands`、HEAD `a1d0800`）。差分ではなく、Templateから作った新Repositoryが最初のcloneで受け取る状態を「Templateをはじめて使う人」として検査した
- 読んだFile: `git ls-files` の34件すべて（`docs/init-mvp-spec.md`、`CLAUDE.md`、`README.md`、`.claude/commands/*`、`.claude/agents/*`、`profiles/*/PROFILE.md` 3件、`.devcontainer/*`、`.github/workflow-templates/*`、`deploy-templates/*`、`src/*`、`index.html`、`package.json`、`tsconfig*.json`、`vite.config.ts`、`vitest.config.ts`、`eslint.config.js`、`.gitignore`、`LICENSE`、`docs/template-reviews/*` 5件）
- 前回成果物: `docs/template-reviews/step3-baseline-review.md`（BLOCKER 4）と `docs/template-reviews/step3-consistency-review.md`（BLOCKER 1）を先に読み、各件を実物で再確認した
- 削除物の調査: `git show 3a57051:profiles/daily-local-app/PROFILE.md` で復元前の原文を取得し、`a1d0800` の復元版と突き合わせた。`git log --oneline -- <path>` で各指摘の混入時点を特定した
- Command実行はしていない。`npm ci` / `lint` / `test` / `build` を再実行していない（Fileを1件も増やさないため）
- 本Reviewで作成したFileは `docs/template-reviews/step3-baseline-review-r1.md` 1件のみである。他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない

### 検証して問題が無かった点

- ローカル絶対Path・個人情報・実Credential: `git grep -nIE "/home/|/mnt/c|C:\\|/Users/|elmas|OneDrive|snowman|gmail"` のヒットは `docs/template-reviews/step3-baseline-review.md:17`（前回レビューが検査対象として引用した文字列そのもの）1件のみ。実体の混入は0件
- `/spec` `/goal` の出力Pathとの衝突: `docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md` はいずれも存在しない（`git ls-files` で確認）
- 安全既定値: `docs/init-mvp-spec.md:13` は `NOT_CONFIRMED`。Templateが `CONFIRMED` の状態で配布されていない
- 権限の先回り承認: `.claude/` 配下は `agents/` と `commands/` のみで、`settings.json` / `settings.local.json` は存在しない。安全装置を飛ばせる設定は置かれていない
- Working Treeは untracked を含めて clean（`git status --porcelain -uall` が空）。`dist/` と `node_modules/` は `.gitignore` 済み
- 手順数の整合: `docs/init-mvp-spec.md:43-72`（§4は1..14）、`CLAUDE.md:14`（「手順1から14」）、`README.md:33,35,40-55`（「14手順」と1..14の一覧）が一致している。旧13手順の残存はTemplate本体に無い
- Profileの重なり: `profiles/static-basic/PROFILE.md:15`（永続Storageを使わない）と `profiles/daily-local-app/PROFILE.md:7`（永続が不要なら `static-basic`）、`profiles/daily-local-app/PROFILE.md:29`（AIが必要なら `on-local-data-use-ai-app`）により、3Profileの境界に重なりは無い。決定不能にはならない
- 前回のFOLLOW_UP 4（Verdict Artifactの衝突）は解消状態を維持している。`README.md:65` が `docs/template-reviews/` の位置づけを説明している

---

## 前回BLOCKERの解消判定

| # | 前回の指摘 | 判定 | 根拠 |
|---|---|---|---|
| baseline 1 | 「永続化あり・AIなし」がどのProfileにも当てはまらない | **PARTIALLY_RESOLVED** | `profiles/daily-local-app/PROFILE.md` が復元され（41行）、`docs/init-mvp-spec.md:28`・`CLAUDE.md:32`・`README.md:68`・`.claude/commands/spec.md:24`・`.claude/agents/independent-spec-reviewer.md:21`・`.claude/agents/independent-code-reviewer.md:22` の6箇所すべてから参照されている。`static-basic` のData節の自己矛盾も `profiles/static-basic/PROFILE.md:15` で解消済み。**ただし復元されたProfileの本体が日次アプリ専用のままであり、適用範囲だけが一般化された（新BLOCKER 1）。さらに鏡像の穴「AIあり・永続なし」が残っている（新BLOCKER 2）** |
| baseline 2 | Deploy素材を有効化する手順が§4に無い | **PARTIALLY_RESOLVED** | §4に手順3「初期化」が新設され（`docs/init-mvp-spec.md:53-58`）、Vite base（:56）とDeploy素材の配置先Path（:57）が実行可能な粒度で書かれた。手順3は手順10のCommit（:65）より前にあり、前回の「Commit後にbaseを直す」順序破綻は解消。手順12（:67）も「手順3で配置済み」と整合。`.claude/agents/independent-code-reviewer.md:23` に検出基準も追加された。**ただしPush先Branchが§4のどこにも定義されておらず、Deployの発火条件を満たせない経路が残る（新BLOCKER 3）** |
| baseline 3 | Placeholder置換の責務が無主 | **RESOLVED** | `docs/init-mvp-spec.md:54` が置換を手順3の必須項目として明記し、:58 が置き換え漏れ0件の確認を義務づけた。`.claude/agents/independent-code-reviewer.md:23` が「Placeholder…やTemplate自身の宣伝文が残っている」をBLOCKER基準に加え、Gateの網に入った。自動検出Testが無い点と、`src/App.test.tsx` が手順3と衝突する点はFOLLOW_UP 2・3として残す |
| baseline 4 | `/spec` がAI Profileを追い返す | **RESOLVED** | `.claude/commands/spec.md:24` が3Profileへの振り分けを明示し（記録が必要→`daily-local-app`、秘密Key必要なAI→`on-local-data-use-ai-app`）、:25 の「Templateの対象外」は Server Database・認証・複数ユーザー・Device間同期・共有Record・保証されたBackup に限定された。この6項目は3つのPROFILE.mdの適用範囲（`static-basic:5`、`daily-local-app:5`、`on-local-data-use-ai-app:5`）すべてが除外している集合と一致する。単独の食い違いは消えた |
| consistency 1 | 手順13の自己言及が§5と充足不能に矛盾 | **RESOLVED**（参考） | 手順14へ再構成され、`docs/init-mvp-spec.md:71` が「この手順は自身の行を書かない」、完了判定を「プロセス生成物に未Commitの変更が残っていないこと」に置いた。`docs/init-mvp-spec.md:80` と `.claude/commands/goal.md:24` も追随。先回り禁止（:86）との矛盾と無限後退は消え、再実行しても同じ結果になる。完了判定がPushを見ていない点はFOLLOW_UP 7 |

---

## BLOCKER

### BLOCKER 1: 復元された `daily-local-app` は適用範囲だけが一般化され、本体が日次アプリ専用のまま。日次でない永続アプリはこのProfileの必須要件を満たせない

**File Evidence**

- `profiles/daily-local-app/PROFILE.md:5` — 「利用者の記録が同じDeviceに残り続けることを、確定した体験の一部として必要とする静的アプリに使う。1〜数画面で、記録の規模が小さいものを対象とする」。日次性への言及は無く、**あらゆるローカル永続アプリ**を受け入れる範囲になっている
- `profiles/static-basic/PROFILE.md:7` — 「利用者の記録が同じDeviceに残り続けることが確定した体験の一部なら `daily-local-app` を選ぶ」。永続が要る非AIアプリの行き先はここ1つしかない
- `docs/init-mvp-spec.md:28` — 「`daily-local-app` — GitHub Pages。利用者のBrowserへローカル永続する。Serverと秘密Keyなし」。日次の限定なし
- `CLAUDE.md:32`、`README.md:68` — いずれも「ローカル永続あり・AIなし」とだけ述べ、日次を条件にしていない
- しかし本体は日次前提のまま:
    - `profiles/daily-local-app/PROFILE.md:23` — 「利用者に見せるTimezoneと**1日の境界**を、Codeを書く前に**製品判断として決める**」
    - `profiles/daily-local-app/PROFILE.md:25` — 「**同じ日に**同じ操作を繰り返しても記録が重複せず、意図せず上書きもされないことを仕様で決める。**集計**は論理的な1件を1回だけ数える。集計に用いる指標、計算式、記録が0件のときの表示を仕様で確定する」
    - `profiles/daily-local-app/PROFILE.md:37` — 必須Testに「**日付境界の両側**、…**同一日の操作の繰り返しと重複防止**、**集計が0件のときと1件以上のとき**」

**なぜ止まるか**

`.claude/agents/independent-code-reviewer.md:13` は「`profiles/` 配下の選択済みProfileが正本である」と定め、同:22 は「Profileの制約に反する」をBLOCKERとしている。日付の概念も集計も持たない永続アプリ（買い物リスト、Memo、Checklist、Bookmark集）は、`:23` が要求する「1日の境界」の製品判断も、`:37` が必須と列挙する「日付境界の両側」「同一日の重複防止」「集計が0件のとき」のTestも**書きようがない**。

- 書かなければ、手順6の独立レビューが「Profileの必須Testが無い」でBLOCKERを出しうる。手順7は最大2周（`docs/init-mvp-spec.md:62`）で、2周しても消えないため停止に至る
- 書こうとすれば、存在しない日付境界と集計を発明することになり、`docs/init-mvp-spec.md:36`「§2にない機能を追加しない」と `.claude/agents/independent-code-reviewer.md:18`「§2にない機能が実装されている」に正面から当たる

どちらへ進んでも公開へ到達しない。前回BLOCKER 1が塞ごうとした穴（「永続化あり・AIなし」）は、`static-basic` から追い出された非日次の永続アプリに対しては**塞がっていない**。Profile名 `daily-local-app` 自体も、一般化された適用範囲と一致していない。

**混入時点**

`a1d0800`（2026-08-15、本Branch）。`git show 3a57051:profiles/daily-local-app/PROFILE.md` の削除前原文は "an app whose approved experience includes **one local daily item or action** and small local history" であり、適用範囲が明確に日次に限定されていたため、本体の日次要件と整合していた。復元時に適用範囲だけを「日次に限定しない形」へ広げ（`a1d0800` のCommit本文が明言）、`時刻と日付` 節と `必須Test` 節を原文のまま日本語化したため、範囲と要件がずれた。差分内の混入だが、Profileどうしの網羅関係を見ないと検出できない種類である。

---

### BLOCKER 2: 「AIあり・永続なし」がどのProfileにも当てはまらない。唯一のAI Profileが永続Storageを必須にしている

**File Evidence**

- `profiles/static-basic/PROFILE.md:21` — 「このProfileにServerはなく、**秘密Keyを一切扱わない**。AI処理が必要なら、このProfileを拡張せず `on-local-data-use-ai-app` を選ぶ」
- `profiles/daily-local-app/PROFILE.md:29` — 同文。AIを扱えるProfileは `on-local-data-use-ai-app` ただ1つである
- `profiles/on-local-data-use-ai-app/PROFILE.md:13` — 「実行時Dataの正本は利用者のBrowserである。要求入力（`docs/init-mvp-spec.md`）で確定する仕様の中で、**Storage機構をちょうど1つ決める**」。選択肢に「持たない」が無い
- `profiles/on-local-data-use-ai-app/PROFILE.md:15` — 「どちらの機構でも、KeyまたはObject Store名、明示的なSchema Version、読み取り時のField単位Validation、不正・未知のDataからの安全な復旧、読み書き失敗時の挙動を仕様で決める」
- `.claude/agents/independent-spec-reviewer.md:23` — 「**永続保存を持つProfileなのに**、Storage機構、Schema Version、読み取り時のValidation、壊れたDataからの復旧、読み書き失敗時の挙動のいずれかが決まっていない」をBLOCKERとする
- `docs/init-mvp-spec.md:29` — 「`on-local-data-use-ai-app` — Vercel。**ローカル永続に加え**、秘密Keyを要するAI呼び出しをServer API経由で行う」
- `CLAUDE.md:33`、`README.md:69` — いずれもこのProfileを「ローカル永続あり」と記述。永続が任意であるとはどこにも書かれていない

**なぜ止まるか**

「文章を貼ると要約が出る」「画像を貼ると説明文が出る」のような、保存を一切行わないAIアプリは24時間MVPの典型である。しかしこの製品は:

- `static-basic` / `daily-local-app` — 秘密Keyを扱えないため選べない
- `on-local-data-use-ai-app` — 選べるが、`:13` が Storage機構の決定を義務づけ、`:15` が Schema Version・Validation・復旧・失敗時挙動の確定を義務づける

§2でこれらを空欄にすれば `.claude/agents/independent-spec-reviewer.md:23` が `/spec` 手順5でBLOCKERを出す。`.claude/commands/spec.md:34` のやり直しは最大2周で、2周しても「そのアプリに永続は存在しない」ため消えず、停止して人間判断となる。埋めれば、使わないlocalStorage Schemaという§2に本来不要な機能を仕様と実装へ持ち込むことになり、`docs/init-mvp-spec.md:36-38`（機能を追加しない／将来拡張のための抽象化をしない）に反する。

前回BLOCKER 1が指摘した穴（永続あり・AIなし）と同じ構造の、鏡像の穴である。Profileの2軸（永続の有無 × AIの有無）4象限のうち、いま埋まっているのは「永続なし・AIなし」「永続あり・AIなし」「永続あり・AIあり」の3つで、「永続なし・AIあり」が空いている。

**混入時点**

`459067a`（2026-08-04「feat: add local AI profile and Claude Code workflow」）でAI Profileが追加された時点から。`7e57283`・`87b1d4a` の日本語化・見出し統一を経ても「Storage機構をちょうど1つ決める」は不変。分岐元より前の混入であり、差分レビューでは原理的に検出できない。前回のベースラインレビューも「永続あり・AIなし」側だけを見て、この対称な穴を見落としている。

---

### BLOCKER 3: §4が作業Branchを一切定めておらず、Deployの発火条件を満たせない経路が残る。手順3でWorkflowを配置しても公開されない

**File Evidence**

- `.github/workflow-templates/deploy-pages.yml.template:3-6` — `on: push: branches: [main]` と `workflow_dispatch`。発火するPushは `main` へのものだけである
- `docs/init-mvp-spec.md:57` — 手順3は「`.github/workflows/deploy-pages.yml` へ複製する」とだけ述べ、どのBranchでこれを行うかを定めない
- `docs/init-mvp-spec.md:65-66` — 「10. **Commit** …」「11. **Push** — fast-forwardのみ。force pushしない」。**Branch名もPush先も書かれていない**
- `docs/init-mvp-spec.md:67` — 「12. **Deploy** — Profileの既定方式でDeployする。Vite baseとDeploy素材は手順3で配置済みである」。追加の操作が要らない前提になっている
- `docs/init-mvp-spec.md:68` — 「13. **本番確認** — **Production URL**で受け入れ条件の動線をMobile幅で確認し」
- `docs/init-mvp-spec.md:45` — 「1つでも満たさない場合は、**Branch**・Commitを作らず」。§4で唯一Branchに言及する行であり、**Branchを作る前提**で書かれている
- `git grep -nIi "pull request|merge|マージ|default branch"` を `docs/init-mvp-spec.md` / `CLAUDE.md` / `README.md` / `.claude` / `profiles` に対して実行した結果、ヒットは `.claude/agents/independent-code-reviewer.md:49,52` の `Ready to merge` Header文言のみ。**PR・Merge・既定Branchへの合流を指示する記述は全Fileに存在しない**

**なぜ止まるか**

`docs/init-mvp-spec.md:45` がBranchの作成を前提とした文面である一方、どのBranchで手順3〜11を行うかは定義されていない。Feature Branchで作業した場合:

1. 手順11のPushはFeature Branchへ行われる。`branches: [main]` に一致しないためPages Workflowは起動しない
2. `workflow_dispatch` は救済にならない。GitHub Actionsは**既定Branchに存在するWorkflow Fileしか手動実行の対象にしない**ため、`main` に `deploy-pages.yml` が無いこの時点では実行UI/APIに現れない
3. Vercel（`profiles/on-local-data-use-ai-app/PROFILE.md:25`）も同様で、Git連携のProduction DeployはProduction Branchからのみ発生し、他Branchは Preview になる。手順13が要求する「Production URL」に到達しない
4. §4にはMergeもPRも手順として存在しないため、手順12でDeployできず、規定の手順内に回復経路が無い

前回はFOLLOW_UP 6として記録された項目だが、`a1d0800` で状況が変わった。手順3がDeploy素材の配置を担い、手順12が「手順3で配置済みである」と言い切ったことで、公開連鎖の中で**未定義のまま残った唯一の環が作業Branchになった**。Templateから作った人が§4だけを読んで公開へ到達できるかという観点では、ここが最後の切断点である。加えてClaude Codeの既定挙動は「既定Branch上なら先にBranchを切る」であり、失敗経路のほうが選ばれやすい。よってBLOCKERへ格上げする。

**混入時点**

`dc064b9`（2026-08-13）以降の§4整備で一貫して未定義。`.github/workflow-templates/deploy-pages.yml.template` の `branches: [main]` は `c68ec59`（2026-08-03）から不変。分岐元より前からの欠落である。

---

## FOLLOW_UP

### FOLLOW_UP 1: `.gitignore` が3つのProfileに対して不十分。`.env` 系と `.vercel/` を素通りさせる

- `.gitignore:1-6` — `node_modules/` / `dist/` / `coverage/` / `*.local` / `.DS_Store` / `*.log` のみ
- `docs/init-mvp-spec.md:50` — Preflightが「`on-local-data-use-ai-app` はVercelの認証と、秘密API KeyのServer Environment Variableが設定済みであること」を要求する。利用者は `vercel link` / `vercel env pull` を実行する
- `profiles/on-local-data-use-ai-app/PROFILE.md:19` — 「KeyをClient Bundle、HTML、ログ、Export Dataへ絶対に含めない」
- `docs/init-mvp-spec.md:39` — 「秘密情報とローカル絶対PathをCommitしない」

`*.local` は `.env.local` を拾うが、`.env`、`.env.production`、および `vercel link` が作る `.vercel/project.json`（orgId / projectId を含む）は素通りする。現状の防波堤は手順9（`docs/init-mvp-spec.md:64`）の人間・AIによる目視Gateだけである。3Profile体制で秘密Keyを正式に扱うようになった以上、機械的な防御を持つべき最優先のFOLLOW_UPである。混入時点は `c68ec59`（2026-08-03）で、`.gitignore` は以後一度も変更されていない。

### FOLLOW_UP 2: 唯一のTestが手順3と正面から衝突する。Template文字列をハードコードし、Placeholder残存を要件として肯定している

- `src/App.test.tsx:6-9` — 「It must stay independent of the placeholder values … and **pass both before and after the placeholders are replaced**」。Placeholderが残った状態でPASSすることを**要件として明記**している。`docs/init-mvp-spec.md:54`（Placeholderを残さない）と方向が逆である
- `src/App.test.tsx:30` — `screen.getByRole('link', { name: 'View the first step' })`。Template固有の英語文字列をハードコードしている
- `src/App.tsx:17-19` — その `View the first step` Link。`src/App.tsx:12-16`（Templateの宣伝文）と `:22-28`（`docs/init-mvp-spec.md` の使い方説明）に隣接する
- `docs/init-mvp-spec.md:54` — 「`src/` と `index.html` に、Template自身の宣伝文・説明文・Placeholderを残さない」

手順3を指示どおり行うと、この宣伝Sectionを消すことになり、`src/App.test.tsx` の2件目のTestが必ず落ちる。手順3にはTestの扱いが書かれていない。落ちたTestを直すと、`docs/init-mvp-spec.md:60`「Testの削除・skip・Gate緩和で通さない」と `.claude/agents/independent-code-reviewer.md:19`「Testが削除、skip、緩和されている」に触れるおそれがあり、逆に消さなければ同:23「Template自身の宣伝文が残っている」に触れる。同一Reviewerの2つのBLOCKER基準が同じ1行の上で衝突する。UIの作り替えに伴うTestの作り替えは通常許容されるため必ず詰まるとは言えず、FOLLOW_UPとする。手順3に「App Shell Testを新しいUIに合わせて置き換える」ことを明記すれば消える。混入時点は `c68ec59`（2026-08-03）／`72531ca`／`c1ca87f`（2026-08-13）。

### FOLLOW_UP 3: Placeholder残存を検出する自動Gateが無く、判断Gateだけが防波堤である

- `.claude/agents/independent-code-reviewer.md:23` が唯一の検出点であり、`Read` / `Grep` によるReviewerの判断に依存する
- `docs/init-mvp-spec.md:60` の手順5（`npm ci` / `lint` / `test` / `build` / `git diff --check`）には、`__APP_NAME__` が残っていても落ちる仕組みが無い
- 対になっていた `scripts/validate-template.mjs`（`npm run template:validate`）と `tests/template/app-shell-placeholders.test.tsx` は `c1ca87f`（2026-08-13）で削除されたまま復活していない

責務は明文化されたので前回BLOCKER 3はRESOLVEDとするが、機械的な検出は失われたままである。`package.json:6-11` の `scripts` に検査Commandを1本戻すのが最小の回復策である。

### FOLLOW_UP 4: `README.md:54` の手順14要約が正本と食い違い、`a1d0800` が直した欠陥を再導入する読みを許す

- `README.md:54` — 「14. 証跡の確定　　　　手順10〜13の結果を**goal-progress.mdへ書き**Commit・Push」
- `docs/init-mvp-spec.md:69` — 「手順13までの記録を**書き終えたうえで**、…未Commitの変更が残っていればCommitしてPush」
- `docs/init-mvp-spec.md:86` — 「記録は1手順ずつ、その手順を終えた直後に書く。**複数の手順の結果をまとめて1回で書かない**」

READMEの文面は「手順14で手順10〜13を一括して書く」と読め、`a1d0800` 以前の欠陥（`b13edee` のCommit本文が対象とした一括書き）をそのまま指示している。`README.md:37` が§4を正本と明記し、`README.md:57` が1手順ずつと述べているためFOLLOW_UPとするが、要約行だけを読むContextが誤る。混入時点は `a1d0800`（2026-08-15）。

### FOLLOW_UP 5: 手順14の完了判定がPushの成否を見ていない

- `docs/init-mvp-spec.md:71` — 「完了は、プロセス生成物に**未Commitの変更が残っていない**ことで判定する」
- `docs/init-mvp-spec.md:80`、`.claude/commands/goal.md:24` — 同旨
- `docs/init-mvp-spec.md:69` — 手順14の内容は「CommitしてPushする」

Commitに成功しPushに失敗した状態（認証切れ、非fast-forward、Network断）で再開すると、未Commitの変更が無いため手順14は完了と判定され、証跡Commitは永久にPushされない。自己言及の破綻（consistency BLOCKER 1）は解消されたが、判定基準が手順14の構成要素の片方しか見ていない。「Local BranchがRemoteより先行していないこと」を判定に加えれば閉じる。混入時点は `a1d0800`（2026-08-15）。

### FOLLOW_UP 6: `CLAUDE.md:25` のGate列挙が正本より狭い（前回FOLLOW_UP 8・未解消）

- `CLAUDE.md:25` — 「Gate（lint、test、build、独立レビュー、Mobile確認、Security確認、本番確認）を削らない」
- `docs/init-mvp-spec.md:60` — 手順5は `npm ci` と `git diff --check` も含む

`CLAUDE.md` だけを読んだContextが `npm ci` と `git diff --check` を任意と解釈しうる。`a1d0800` の `CLAUDE.md` 改稿でも未修正。

### FOLLOW_UP 7: Mobile幅の基準が375pxと320pxで不統一。AI Profileには幅の要件が無い（前回FOLLOW_UP 5・未解消）

- `docs/init-mvp-spec.md:63` — 「8. **Mobile確認** — **375px**幅で」
- `.claude/agents/independent-code-reviewer.md:24` — 「**375px**幅で受け入れ条件の動線が使えない」
- `profiles/static-basic/PROFILE.md:29` — 「狭い画面幅（**320 CSS pixel**）…320 px幅でContentがはみ出さない」
- `profiles/daily-local-app/PROFILE.md:37` — 同じく「狭い画面幅（**320 CSS pixel**）」
- `profiles/on-local-data-use-ai-app/PROFILE.md:29` — 必須Testの列挙に**画面幅の項目が一切無い**

320は375より厳しいため矛盾ではないが、どちらを満たせばよいかが正本から一意に読めない。AI Profileを選ぶと自動Testでの狭幅検証要件が消え、手順8の目視だけになる。復元された `daily-local-app` も320側を採ったため、不統一は3Profileへ広がった。

### FOLLOW_UP 8: 手順3の「Template固有の文字列を検索」に範囲の上限が無く、置き換えてはならないFileを含む

- `docs/init-mvp-spec.md:58` — 「Template固有の文字列を検索し、置き換え漏れが1件もないことを確認する」。対象範囲の記述が無い
- `docs/init-mvp-spec.md:54` は `src/` と `index.html` に限定しているが、:58 は無限定である
- 置き換えてはならない側: `README.md`、`CLAUDE.md`、`docs/init-mvp-spec.md`、`LICENSE:3`（`Copyright (c) 2026 Deadline-Driven Lightweight SDD contributors`）、`docs/template-reviews/` 配下5件
- 手順3が触れていないが新Repositoryへ残るもの: `.devcontainer/devcontainer.json:2`（`"name": "Deadline-Driven Lightweight SDD"`）、`index.html:2`（`<html lang="en">`。運用Documentも想定利用者も日本語）、`package.json:4`（`"version": "1.0.0"`）

範囲を「`src/`、`index.html`、`package.json`、`vite.config.ts`」等へ明示すれば、過剰な置換と取りこぼしの両方が消える。混入時点は `a1d0800`（2026-08-15）と `c68ec59`（2026-08-03）。

### FOLLOW_UP 9: `docs/template-reviews/` が5件698行へ増え、内容が現在のTemplateと食い違ったまま新Repositoryへ継承される

- `wc -l docs/template-reviews/*.md` — step1-code 148 / step1-final 142 / step1-resolution 129 / step3-baseline 189 / step3-consistency 90 = **698行**
- 内容が現在の実物と食い違う例:
    - `docs/template-reviews/step3-baseline-review.md:20` — 「いずれも**13手順**で一致している」（現在は14手順）
    - `docs/template-reviews/step3-baseline-review.md:27` — 「どのProfileにも当てはまらず」（`daily-local-app` は復元済み）
    - `docs/template-reviews/step3-baseline-review.md:59` — 「`.github/workflows/` は存在しない」（手順3で作る前提へ変更済み）
    - `docs/template-reviews/step1-code-review.md:10-11`、`step1-final-review.md:11` — 利用者のRepositoryに存在しないBranch名 `feat/lightweight-goal-commands` / `feat/lightweight-goal`
- `README.md:65` — 「アプリ開発では使わない」との説明はあり、Path衝突も無い

Path衝突が無く説明もあるためFOLLOW_UPだが、新Repositoryが最初から `docs/` 配下に698行の他人の証跡を持ち、そのうちの一部が現在のTemplateについて**事実と異なることを述べている**状態は、Templateの利用者にとって誤った判断材料になりうる。本Reviewの追加でさらに増える。Template側は `.github/` 配下など `docs/` の外へ移すか、初期化手順で削除対象にするのが望ましい。混入時点は `198f662`（2026-08-14）と `a1d0800`（2026-08-15）。

### FOLLOW_UP 10: AI ProfileのServer APIが型検査Gateの外にある

- `tsconfig.app.json:21` — `"include": ["src"]`
- `tsconfig.node.json:15` — `"include": ["vite.config.ts", "vitest.config.ts", "eslint.config.js"]`
- `package.json:8` — `"build": "tsc -b && vite build"`
- `profiles/on-local-data-use-ai-app/PROFILE.md:19` — 「AI処理はすべてServer APIを経由し、KeyはServer Environment Variableとしてだけ存在する」

Vercelの慣例どおり `api/` へServer関数を置くと、どのtsconfigの `include` にも入らないため `tsc -b` が一度も型検査しない。秘密Keyを扱う最も重要なCodeが、手順5のGateのうちbuild（型検査）を通らないことになる。`eslint.config.js:12` の `files: ['**/*.{js,mjs,ts,tsx}']` は拾うため、lintだけは効く。あわせて、`docs/init-mvp-spec.md:57` は「複製元にあるlint・test・buildのStepを削らない」と述べるが、`deploy-templates/vercel.json.template:1-6` にはそもそもlint・testのStepが無く、AI ProfileにはCI側のGateが存在しない。混入時点は `c68ec59`（2026-08-03、tsconfig）と `459067a`（2026-08-04、AI Profile）。

### FOLLOW_UP 11: devcontainerの環境固定と過剰なfeature（前回FOLLOW_UP 7・未解消）

- `.devcontainer/devcontainer.json:13-15` — `"containerEnv": { "TZ": "Asia/Tokyo" }`。Template利用者のTimezoneがJSTとは限らない。`docs/init-mvp-spec.md:51` が実測を義務づけたため実害は無いが、配布物の既定値としては作者環境固定である
- `.devcontainer/devcontainer.json:7` — `ghcr.io/devcontainers/features/docker-outside-of-docker:1`。Viteの開発とnpm Gateしか行わないTemplateに対し、HostのDocker Socketを渡す権限は過大である

### FOLLOW_UP 12: `/spec` 手順5のやり直し再入点が手順3・手順4を明示的に含まない（前回consistency FOLLOW_UP 8・未解消）

- `.claude/commands/spec.md:34` — 「指摘された項目だけを手順2へ戻して直し、**手順5をやり直す**」
- `.claude/agents/independent-spec-reviewer.md:39` — Reviewerは `docs/init-mvp-spec.md` を読んで判定する

手順4（§2の書き込み）を経ずに手順5だけをやり直すと、Reviewerは同じ内容を読む。2→3→4→5と前進する読みが自然なため詰まりはしないが、再入点を番号で明示すれば消える。

### FOLLOW_UP 13: 手順14のCommitが手順9（Security確認）を通らない（前回consistency FOLLOW_UP 2・未解消）

- `docs/init-mvp-spec.md:64` — 手順9は手順10のCommit予定内容に対する実Credential混入チェック
- `docs/init-mvp-spec.md:69-70` — 手順14は手順9より後に生成された内容を新たにCommitする。範囲を「§5のプロセス生成物だけ」に限る保護はあるが、Security確認そのものは課されていない

---

## 総括

前回BLOCKER 4件のうち、**RESOLVED 2件（3・4）、PARTIALLY_RESOLVED 2件（1・2）**である。consistency BLOCKER 1もRESOLVEDである。修正の方向は正しく、手順3の新設によって「初期化の責務が無主」という構造的欠陥そのものは解消されている。

残る3件のBLOCKERは、いずれも前回の修正が**片側だけを塞いだ**ことによる。

- BLOCKER 1 — Profileを復元する際、適用範囲だけを一般化して本体（時刻と日付・必須Test）を日次のまま残した。範囲と要件がずれている
- BLOCKER 2 — 「永続あり・AIなし」を塞いだが、対称にある「永続なし・AIあり」を見ていない。前回のベースラインレビュー自身が持っていた盲点である
- BLOCKER 3 — Deploy素材の配置は手順3で解決したが、その素材が発火する条件（`branches: [main]`）に対応する作業Branchの定義が§4に無い。公開連鎖で未定義のまま残った最後の環であり、前回FOLLOW_UP 6からの格上げである

混入時点の内訳は、分岐元より前が2件（BLOCKER 2 = `459067a`、BLOCKER 3 = `c68ec59` / `dc064b9`）、本Branch内が1件（BLOCKER 1 = `a1d0800`）である。BLOCKER 1は差分内にありながら、Profileどうしの網羅関係と、Profile内部の適用範囲と必須要件の対応を突き合わせないと見えないため、差分を1件ずつ読む形式のレビューでは検出されにくい。

FOLLOW_UPは13件で、うち前回から未解消のものが5件（6・7・11・12・13）である。FOLLOW_UP 1（`.gitignore` の `.env` / `.vercel/`）は、3Profile体制で秘密Keyを正式に扱うようになった現在、最優先で対処すべきものである。
