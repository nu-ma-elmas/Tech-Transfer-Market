# 独立ベースラインレビュー 周回2（Step 3）

- Verdict: APPROVED
- Blockers: 0
- Ready to merge: YES

## Evidence

- 対象: Repository全体（Branch `feat/lightweight-goal-commands`、HEAD `653ae75`、親 `a1d0800`）。差分ではなく、Templateから作った新Repositoryが最初のcloneで受け取る状態を「Templateをはじめて使う人」として検査した
- 読んだFile: `git ls-files` の36件のうち、`package-lock.json` を除く全件。特に `docs/init-mvp-spec.md`（101行）、`CLAUDE.md`、`README.md`、`.claude/commands/*` 2件、`.claude/agents/*` 2件、`profiles/*/PROFILE.md` 3件、`.github/workflow-templates/deploy-pages.yml.template`、`deploy-templates/vercel.json.template`、`.gitignore`、`src/*` 5件、`index.html`、`package.json`、`vite.config.ts`、`vitest.config.ts`、`tsconfig.app.json`、`eslint.config.js`、`.devcontainer/devcontainer.json` を全文で読んだ
- 前回成果物: `docs/template-reviews/step3-baseline-review-r1.md`（BLOCKER 3、FOLLOW_UP 13）と `docs/template-reviews/step3-consistency-review-r1.md`（APPROVED、FOLLOW_UP 10）を先に読み、各件を実物で再確認した
- 差分の確認: `git diff a1d0800 653ae75`（8 File、499挿入10削除。うち466行は本Reviewの前提となるReview Artifact 2件）
- 網羅の確認: `git grep -nI -e Branch -e branch -e merge -e マージ`、`git grep -nI -e 日付 -e 集計 -e 1日`、`git grep -nI -e 永続` を `docs/init-mvp-spec.md` / `CLAUDE.md` / `README.md` / `.claude` / `profiles` / `.github` / `deploy-templates` に対して実行し、修正の取りこぼしを機械的に洗った
- Commandは実行していない。`npm ci` / `lint` / `test` / `build` を再実行していない（Fileを1件も増やさないため）
- 本Reviewで作成したFileは `docs/template-reviews/step3-baseline-review-r2.md` 1件のみである。他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない

### 検証して問題が無かった点

- ローカル絶対Path・個人情報・実Credential: `git grep -nIE "/home/|/mnt/c|/Users/|elmas|OneDrive|snowman|gmail|sk-|ghp_"` を `docs/template-reviews/` を除いた全Fileに対して実行し、ヒット0件
- 安全既定値: `docs/init-mvp-spec.md:13` は `NOT_CONFIRMED`。`.claude/` 配下は `agents/` 2件と `commands/` 2件だけで、`settings.json` / `settings.local.json` は無い。安全装置を飛ばせる設定は置かれていない
- 出力Pathの衝突: `docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md` はいずれも存在しない
- Working Treeは untracked を含めて clean（`git status --porcelain -uall` が空）
- 既定Branch名の整合: `git remote show` 相当の `origin/HEAD -> origin/main` により既定Branchは `main` であり、`docs/init-mvp-spec.md:45` の「既定Branch（`main`）」と `.github/workflow-templates/deploy-pages.yml.template:5` の `branches: [main]` は実物と一致する
- 手順数の整合: `docs/init-mvp-spec.md:47-75`（§4は1..14）、`CLAUDE.md:14`、`README.md:33,35,40-55` が一致。旧番号の残存はTemplate本体に無い
- `.gitignore:8-14` の追加（`.env` / `.env.*` / `!.env.example` / `.vercel/`）は、§5のプロセス生成物（`docs/init-mvp-spec.md:81`）を巻き込まない。前回baseline FOLLOW_UP 1と consistency FOLLOW_UP 4の後半が解消している

---

## 前回BLOCKER 3件の解消判定

| # | 前回の指摘 | 判定 |
|---|---|---|
| r1 BLOCKER 1 | `daily-local-app` の適用範囲だけが一般化され、本体が日次専用のまま | **RESOLVED** |
| r1 BLOCKER 2 | 「AIあり・永続なし」がどのProfileにも当てはまらない | **PARTIALLY_RESOLVED**（非blocking） |
| r1 BLOCKER 3 | §4が作業Branchを定めず、Deployの発火条件を満たせない | **RESOLVED** |

### r1 BLOCKER 1 — RESOLVED

**文言追加ではなく要件そのものが条件付きになったことを確認した。**

- `profiles/daily-local-app/PROFILE.md:21` — 節見出しが `## 時刻と日付（日付を扱う場合だけ）` へ変わった
- 同 `:23` — 「日付や時刻を扱わないアプリでは、**この節の要求は発生しない。**」。要求の不発生を明言しており、「配慮せよ」型の緩い書き方ではない
- 同 `:25` / `:27` / `:29` — Timezoneと1日の境界は「日付を扱う場合は」、重複防止は「1日に1件という制約を持つ場合は」、集計は「集計や指標を表示する場合は」へ、それぞれ発火条件が付いた
- 同 `:41` — 必須Testが「つねに対象とする」へ分離され、主要操作／保存Dataの正常・不正／Schema不一致／破損からの復旧／Storage読み書き失敗／記録が0件の空状態／Keyboard操作／320 CSS pixel の8項目になった。**買い物リスト、Memo、Checklist、Bookmark集のいずれもこの8項目を書ける**
- 同 `:43` — 日付境界・同一日の重複防止・集計の3種のTestは「仕様で日付を扱うと決めた場合だけ」「1日1件の制約を置いた場合は」「集計を表示する場合は」へ移った

**取りこぼしの機械的確認** — `git grep -nI -e 日付 -e 集計 -e 1日` を `docs/init-mvp-spec.md` / `CLAUDE.md` / `README.md` / `.claude` / `profiles` に対して実行した結果、ヒットは `profiles/daily-local-app/PROFILE.md` の7行（`:21,23,25,27,29,43,47`）だけである。`:47` は Deadline Risk の列挙（「日付Libraryの導入」）であり要件ではない。**日次要件を再導入する記述は他のFileに1件も存在しない**。前回指摘した停止経路（`independent-code-reviewer.md:22`「Profileの制約に反する」で書けないTestを問われる／書けば `docs/init-mvp-spec.md:36`「§2にない機能を追加しない」に当たる）は、両分岐とも成立しなくなった。

**残る名称の不一致** — Profile名 `daily-local-app` が、日次に限定しない適用範囲（`:5`）と一致していない点は変わらない。名称は選択の決定要因ではなく、`:5` と `:7` の適用範囲記述と `profiles/static-basic/PROFILE.md:7` の誘導が選択を一意に決めるため、BLOCKERにもFOLLOW_UPにも上げない。

### r1 BLOCKER 2 — PARTIALLY_RESOLVED（非blocking）

**強制していた側は2箇所とも実際に外れている。**

- `profiles/on-local-data-use-ai-app/PROFILE.md:15` — 「**永続するかどうかを、要求入力（`docs/init-mvp-spec.md`）で先に決める。**」
- 同 `:17` — 「永続しない場合は、Storage機構を持たない。Reloadやタブを閉じることで入力と結果がリセットされる挙動を、受け入れ条件に明示する。永続を『念のため』で足さない」。前回「選択肢に『持たない』が無い」と指摘した箇所に、明示的な選択肢が入った
- 同 `:19` — Schema Version・Validation・復旧・失敗時挙動の確定は「永続する場合は」の配下へ移った
- 同 `:35` — 必須Testの「正常・不正・Schema不一致の保存Data、破損からの復旧、Storageの読み書き失敗」が「永続すると決めた場合だけ加える」へ移った
- `.claude/agents/independent-spec-reviewer.md:23` — BLOCKER条件が「永続保存を**持つProfileなのに**」から「永続すると**決めた仕様なのに**」へ変わった。Profile単位の一律要求ではなくなった
- 同 `:24` — 対称条件「永続しない仕様なのに、Reloadで入力や結果がリセットされる挙動が受け入れ条件に書かれていない」が追加され、`profiles/on-local-data-use-ai-app/PROFILE.md:17` と噛み合っている

したがって「文章を貼ると要約が出る」型のAIアプリは、**Profileを選べ、`/spec` 手順5のGateも通る**。前回の停止経路は閉じている。

**PARTIALLY_RESOLVED とする理由** — 「このProfileは永続する」と断定する記述が、正本の中に2箇所そのまま残っている。

- `docs/init-mvp-spec.md:29` — 「`on-local-data-use-ai-app` — Vercel。**ローカル永続に加え**、秘密Keyを要するAI呼び出しをServer API経由で行う」
- `README.md:69` — 「`on-local-data-use-ai-app` = Vercel / **ローカル永続あり**・Server API経由のAIあり」
- 一方 `CLAUDE.md:33` は永続に言及しない。**同じProfileの説明が3File間で不一致である**

BLOCKERへ上げなかった判断根拠は、`docs/init-mvp-spec.md:26` が「詳細は `profiles/<selected_profile>/PROFILE.md` を**正本とする**」と優先順位を明示しており、`independent-spec-reviewer.md:39` の入力にも選択済みProfileが含まれるため、`:29` と PROFILE.md が食い違ったときにどちらへ従うかが決定できる点にある。選択不能でも決定不能でもない。ただし `independent-spec-reviewer.md:18`（「§2の項目どうしが矛盾している」）が、§2の Profile 行の「ローカル永続に加え」と受け入れ条件の「Reloadでリセットされる」を矛盾と読む余地は残る。**FOLLOW_UP 1（最優先）**として記録する。

### r1 BLOCKER 3 — RESOLVED

- `docs/init-mvp-spec.md:45` — §4冒頭に「このワークフローは既定Branch（`main`）の上で行う。作業Branchを分けない。Deploy Workflowは既定Branchへのpushでだけ発火するため、Branchを分けると手順12のDeployが起きない。分ける必要が生じた場合は製品判断であり、停止して人間に確認する」が追加された。理由・規定・逸脱時の扱いの3点が揃っている

**発火条件との突き合わせ（前回指摘した4つの破綻分岐を1つずつ再検査した）**

1. 手順11（`:69`）のPushは `main` へ行われ、`.github/workflow-templates/deploy-pages.yml.template:4-5` の `push: branches: [main]` に一致する。手順3（`:59`）で複製されたWorkflow Fileは、それを含むPushそのもので起動する。**発火する**
2. `workflow_dispatch`（同 `:6`）への依存が消えたため、「既定Branchに無いWorkflowは手動実行UIに現れない」問題に当たらない
3. Vercel（`profiles/on-local-data-use-ai-app/PROFILE.md:29`）も既定Branch＝Production Branchからのpushとなり、手順13（`:71`）が要求するProduction URLに到達する
4. §4にMerge・PRの手順が無いことは、もはや欠落ではない。作業Branchを作らないため合流自体が発生しない。**未定義の環は消えた**

手順14（`:72`）の再Pushも同じBranchへのfast-forwardであり、`:75` が再Deployを想定済みである。矛盾は無い。

**残る不整合** — `docs/init-mvp-spec.md:47` の手順1が「1つでも満たさない場合は、**Branch**・Commitを作らず」と、Branchを作る前提の字面のまま残っている。`:45` は「作業Branchを分けない」と直接的な命令であり、`:47` は禁止の条件節でしかないため、どちらに従うかは決定できる。**FOLLOW_UP 2** とする。

---

## 回帰の検査 — Profile 3つで境界が閉じているか

「永続の有無 × 秘密Keyを要するAIの有無」の4象限を、3つのPROFILE.mdの適用範囲と誘導だけで判定した。

| | AIなし | AIあり（秘密Key） |
|---|---|---|
| **永続なし** | `static-basic`（`static-basic/PROFILE.md:5,15`） | `on-local-data-use-ai-app`（`on-local-data-use-ai-app/PROFILE.md:15,17`） |
| **永続あり** | `daily-local-app`（`daily-local-app/PROFILE.md:5,15`） | `on-local-data-use-ai-app`（同 `:19`） |

**穴が無いこと** — 4象限すべてに行き先がある。前回の2つの穴（永続あり・AIなし／永続なし・AIあり）はいずれも埋まった。誘導も双方向に張られている。`static-basic/PROFILE.md:7`（永続が要るなら `daily-local-app`、AIが要るなら `on-local-data-use-ai-app`）、`daily-local-app/PROFILE.md:7`（永続不要なら `static-basic`、AIが要るなら `on-local-data-use-ai-app`）、`.claude/commands/spec.md:24`（`/spec` 壁打ち中の振り分け）。

**重なりが無いこと** — 相互排他は次の3本で成立する。`static-basic/PROFILE.md:15`「**このProfileは永続Storageを使わない。**」（永続ありを排除）、`daily-local-app/PROFILE.md:15`「Storage機構をちょうど1つ、要求入力で決める」（永続なしを排除）、`static-basic/PROFILE.md:21` と `daily-local-app/PROFILE.md:33`「このProfileにServerはなく、**秘密Keyを一切扱わない**」（AIありを排除）。`on-local-data-use-ai-app/PROFILE.md:5` は Serverの責務を「秘密Keyが必要なAI呼び出し」だけに限定するため、AIなしの製品を吸い込まない。**同一製品が2つのProfileに当てはまる組み合わせは無い**。

**653ae75 が新たな重なりを作っていないこと** — `on-local-data-use-ai-app` の永続を任意にしたことで、このProfileの適用領域は「永続なし・AIあり」へ広がった。この領域を主張する他のProfileは無い（`static-basic/PROFILE.md:21` が秘密Keyで自ら排除している）。したがって重なりは生じていない。

**前回成立していた事項の再確認（回帰なし）** — 手順番号の全数照合、`/spec` 独自の手順1〜6と§4手順番号の非混同（`docs/init-mvp-spec.md:41` と `.claude/commands/spec.md:31` は `/spec` を明示）、循環・到達不能の不在、再開ロジック（`:91`）が手順3を含むこと、不変条件（正本の§2以外を書き換えない／`CONFIRMED` は人間だけ／独立レビューは別Context／Verdict不可侵／最大2周／プロセス生成物を `.gitignore` へ入れない）。いずれも 653ae75 で壊れていない。`.gitignore` の追加行は `docs/` 配下を対象にしていないため、`:81` の「`.gitignore` へ入れない」に抵触しない。

---

## 新規BLOCKER

**無し。** 653ae75 の4種類の変更（`daily-local-app` の条件化、`on-local-data-use-ai-app` の永続任意化、§4冒頭のBranch規定、`.gitignore` / `README.md:54` / 手順3のTest置換行）を1件ずつ検査したが、`/spec` または `/goal` を機能不全にする欠陥、安全装置を飛ばせる経路、誤った既定値の導入はいずれも見つからなかった。

---

## Templateから作った新Repositoryが公開まで到達できるか

`/spec` 6手順 → 人間が `CONFIRMED` → `/goal` 14手順を、Templateの現物だけを頼りに通した場合の到達性を、手順ごとに検査した。**公開までの連鎖に切断点は無い。** 詰まりうる箇所は次の4つで、いずれも「停止して人間へ報告」という設計された停止か、回復可能な摩擦である。

1. **手順1のPreflightで初回必ず停止しうる** — `docs/init-mvp-spec.md:52` が「PagesのSourceがGitHub Actionsであること」「Vercelの認証と、秘密API KeyのServer Environment Variableが設定済みであること」を要求する。GitHubのTemplateから作った直後のRepositoryはPagesが未有効であり、この条件を満たさない。`README.md:13-31` の「使い方」にはこの事前設定の記述が無いため、はじめて使う人は `/goal` を実行して初めて知る。停止は設計どおり報告を伴うので到達性は失われないが、最初の詰まりはここである（FOLLOW_UP 11）
2. **手順3のTest置き換えの判断** — `docs/init-mvp-spec.md:61` が「Template由来のApp Shell Testは、§2の仕様に対するTestへ置き換える。…これは置き換えであって手順5が禁じるGate緩和や削減ではない」と明記したことで、`src/App.test.tsx:30`（`View the first step` をHard-code）と `:7-9`（Placeholder置換前後の両方でPASSする契約）が手順3と衝突する問題は解消している。`independent-code-reviewer.md:39` の入力に `docs/init-mvp-spec.md` が含まれるため、Reviewerもこの例外を読む。詰まらない（FOLLOW_UP 5に格下げ）
3. **手順11のPushで `.github/workflows/` が拒否されうる** — 手順3が作るWorkflow Fileは、Tokenに `workflow` Scopeが無いとRemoteが拒否する。`docs/init-mvp-spec.md:49` の確認は `gh auth status` が認証済みであることまでで、Scopeを見ていない。失敗は手順11で顕在化する（FOLLOW_UP 12）
4. **手順13のProduction URLが定義されていない** — `docs/init-mvp-spec.md:71` は「Production URL」とだけ述べ、GitHub Project Pagesの `https://<owner>.github.io/<repository_name>/` という形も、Vercelでの取得方法も書いていない。Vite base（`:58`）とは書かれ方が非対称である。導出は可能なので詰まりはしない（FOLLOW_UP 11）

手順3の初期化（Placeholder置換、`package.json` の `name`、Vite base、Deploy素材、文字列検索、Test置換）→ 手順5のGate → 手順6の独立レビュー → 手順9のSecurity確認 → 手順10のCommit → 手順11のPush（`main`）→ Workflow発火 → 手順13の本番確認 → 手順14の証跡確定、という連鎖は全区間つながっている。

---

## 前回FOLLOW_UPの格上げ判定

前回13件と consistency 10件を、653ae75 後の状態で再評価した。**BLOCKERへ格上げすべきものは1件も無い。**

- **解消済み（4件）** — baseline FOLLOW_UP 1（`.gitignore` の `.env` 系と `.vercel/`。`.gitignore:8-14` で解消）、baseline FOLLOW_UP 2 / consistency FOLLOW_UP 1（`src/App.test.tsx` と手順3の衝突。`docs/init-mvp-spec.md:61` で解消）、baseline FOLLOW_UP 4 / consistency FOLLOW_UP 2（`README.md:54` の手順14要約。「未Commitのプロセス生成物をCommit・Push（自身の行は書かない）」へ修正済み）、consistency FOLLOW_UP 7（Branch運用未定義。`docs/init-mvp-spec.md:45` で解消）
- **半分解消（2件）** — consistency FOLLOW_UP 4（手順14の停止条件。`.vercel/` 側は `.gitignore:14` で消えたが、`docs/init-mvp-spec.md:73` が手順1の `:50` と違って正本 `docs/init-mvp-spec.md` を除外していない点は残る）、consistency FOLLOW_UP 8（手順12が手順11のPushで既発火。`:45` が「既定Branchへのpushでだけ発火する」と述べたことで実態の説明は入ったが、手順12の本文 `:70` は書き換わっていない）
- **格上げを検討して見送ったもの** — baseline FOLLOW_UP 10（AI ProfileのServer APIが `tsconfig.app.json:21` の `include: ["src"]` の外にあり `tsc -b` が型検査しない）。秘密Keyを扱うCodeが手順5のbuild Gateを通らないのは重い欠陥だが、型検査を通らないだけで公開自体は到達し、`eslint.config.js:12` のlintと手順6の独立レビュー、手順9のSecurity確認、`independent-code-reviewer.md:21` のBLOCKER条件が残る。「公開まで到達できない」にも「安全装置を飛ばせる」にも当たらないためFOLLOW_UPを維持する（FOLLOW_UP 13）
- **その他は前回と同じ状態で継続**（FOLLOW_UP 6〜15にまとめた）

---

## FOLLOW_UP

### FOLLOW_UP 1: `on-local-data-use-ai-app` を「ローカル永続あり」と断定する記述が正本に残り、3File間で不一致（最優先）

- `docs/init-mvp-spec.md:29` — 「Vercel。**ローカル永続に加え**、秘密Keyを要するAI呼び出しをServer API経由で行う」
- `README.md:69` — 「Vercel / **ローカル永続あり**・Server API経由のAIあり」
- `CLAUDE.md:33` — 永続に言及しない（Vercel、Vite base `/`、秘密KeyのServer Environment Variableのみ）
- `profiles/on-local-data-use-ai-app/PROFILE.md:15,17` — 永続の有無を先に決め、永続しない場合はStorage機構を持たない

653ae75 が PROFILE.md と `independent-spec-reviewer.md:23` を直した一方、Profileを一覧する3箇所のうち2箇所が旧文面のまま残った。`docs/init-mvp-spec.md:26` の「詳細は PROFILE.md を正本とする」で優先順位は決まるため選択不能ではないが、`/spec` の壁打ち（`.claude/commands/spec.md:20-24`）で§2のProfile一覧だけを読むContextは、AIありで永続しないアプリの行き先が無いと誤読しうる。`:29` を「Vercel。秘密Keyを要するAI呼び出しをServer API経由で行う。ローカル永続は仕様で決める（任意）」へ、`README.md:69` を同旨へ揃えれば消える。混入時点は `459067a` の文面が `653ae75` で追随しなかったことによる。

### FOLLOW_UP 2: 手順1の「Branch・Commitを作らず」が、§4冒頭のBranch規定と字面で衝突する

- `docs/init-mvp-spec.md:45` — 「作業Branchを分けない」
- `docs/init-mvp-spec.md:47` — 「1つでも満たさない場合は、**Branch**・Commitを作らず、…停止し」

`:47` はBranchを作る前提で書かれた旧文面の残滓である。`:45` が直接的な命令であるため従うべき側は決まるが、前回BLOCKER 3の残り香であり、`:47` の「Branch・」を削るだけで消える。

### FOLLOW_UP 3: 既定Branch上にいることを確認する手順が無く、Branch規定に検出Gateが対応していない

- `docs/init-mvp-spec.md:45` — 規定はあるが宣言のみ
- `docs/init-mvp-spec.md:47-53` — 手順1のPreflightの確認項目に、現在のBranchが既定Branchであることが無い
- `.claude/agents/independent-code-reviewer.md:15-25` — BLOCKER条件に、`:23` の「手順3の初期化が済んでいない」はあるが、Branchに関する条件が無い

`docs/init-mvp-spec.md:45` は前回のBLOCKERを塞いだが、規定に対応する検出点が無い。Claude Codeの一般的な既定挙動は「既定Branch上なら先にBranchを切る」であり、規定に反した状態は手順12まで気づかれない。手順1の確認項目に「現在のBranchが既定Branchであること」を1行加えれば、Preflightで前倒し検出できる。

### FOLLOW_UP 4: `CLAUDE.md` が「正本を書き換えない」と「問題が起きたら正本へルールを追記する」を同時に指示している

- `CLAUDE.md:7` — 「AIはこのFileの§2以外を書き換えない」
- `CLAUDE.md:39` — 「実際に使って問題が起きたら、その対処だけを `docs/init-mvp-spec.md` へルールとして追記する」
- `docs/init-mvp-spec.md:9` / `:41` — 同じ組み合わせが正本側にもある
- `docs/init-mvp-spec.md:73` — 手順14は「§5のプロセス生成物以外に未Commitの変更があれば、Commitせず停止して人間に報告する」

Template自身の開発モードとアプリ開発モードを区別する記述がどのFileにも無い。新Repositoryの `/goal` 実行中に問題が起きたContextが `:39` に従って正本へルールを追記すると、`:7` / `:41` に反すると同時に、手順14が正本の未Commit変更を検出して最終手順で停止する。`:9` と `:39` を「このTemplate Repository自体を改善するときの方針であり、Templateから作ったアプリのRepositoryでは行わない」と限定すれば消える。混入時点は分岐元より前。

### FOLLOW_UP 5: 手順3のTest置き換え例外が `independent-code-reviewer.md` に反映されていない

- `docs/init-mvp-spec.md:61` — 「これは置き換えであって手順5が禁じるGate緩和や削減ではない」
- `.claude/agents/independent-code-reviewer.md:19` — 「Testが削除、skip、緩和されている」がBLOCKER条件のまま。例外が書かれていない

Reviewerの入力（同 `:39`）に `docs/init-mvp-spec.md` が含まれるため実害は小さいが、`:19` に「ただし§4手順3によるTemplate由来Testの置き換えを除く」を添えれば、解釈の揺れが完全に消える。

### FOLLOW_UP 6: Placeholder残存を検出する自動Gateが無く、判断Gateだけが防波堤である（継続）

- `.claude/agents/independent-code-reviewer.md:23` が唯一の検出点
- `docs/init-mvp-spec.md:63` の手順5（`npm ci` / `lint` / `test` / `build` / `git diff --check`）には `__APP_NAME__` が残っても落ちる仕組みが無い
- `package.json:6-11` の `scripts` に検査Commandが無い

### FOLLOW_UP 7: 手順14の完了判定がPushの成否を見ていない（継続）

- `docs/init-mvp-spec.md:74` — 「完了は、プロセス生成物に未Commitの変更が残っていないことで判定する」
- 同 `:72` — 手順14の内容は「CommitしてPushする」

Commit成功・Push失敗の窓で再開すると、未Commitの変更が無いため完了と判定され、証跡Commitが永久にPushされない。「Local BranchがRemoteより先行していないこと」を判定に加えれば閉じる。

### FOLLOW_UP 8: `CLAUDE.md:25` のGate列挙が正本より狭い（継続）

- `CLAUDE.md:25` — 「Gate（lint、test、build、独立レビュー、Mobile確認、Security確認、本番確認）」
- `docs/init-mvp-spec.md:63` — 手順5は `npm ci` と `git diff --check` も含む
- `docs/init-mvp-spec.md:55-61` — 手順3の初期化も列挙に入っていない

### FOLLOW_UP 9: Mobile幅の基準が375pxと320pxで不統一。AI Profileには幅の必須Testが無い（継続）

- `docs/init-mvp-spec.md:66`、`.claude/agents/independent-code-reviewer.md:24` — 375px
- `profiles/static-basic/PROFILE.md:29`、`profiles/daily-local-app/PROFILE.md:41` — 320 CSS pixel
- `profiles/on-local-data-use-ai-app/PROFILE.md:33` — 653ae75 で「空状態、Keyboard操作」が追加されたが、**画面幅の項目は依然として無い**

### FOLLOW_UP 10: 手順3の検索範囲に上限が無く、置き換えてはならないFileを含む。無主の残存物もある（継続）

- `docs/init-mvp-spec.md:60` — 「Template固有の文字列を検索し、置き換え漏れが1件もないことを確認する」。対象範囲の記述が無い（`:56` は `src/` と `index.html` に限定されている）
- 置き換えてはならない側: `README.md`、`CLAUDE.md`、`docs/init-mvp-spec.md`、`LICENSE`、`docs/template-reviews/` 配下7件
- 手順3が触れず新Repositoryへ残るもの: `index.html:2`（`<html lang="en">`）、`package.json:4`（`"version": "1.0.0"`）、`.devcontainer/devcontainer.json:2`（`"name": "Deadline-Driven Lightweight SDD"`）
- `docs/init-mvp-spec.md:59` は「複製する」であり、選ばなかった側のDeploy素材（`.template`）も残り続ける

### FOLLOW_UP 11: 公開先の事前設定とProduction URLの導出が、正本にもREADMEにも書かれていない

- `docs/init-mvp-spec.md:52` — Preflightは「PagesのSourceがGitHub Actionsであること」を要求するが、有効化の方法も確認Commandも書かれていない
- `README.md:13-31` — 「使い方」の4Stepに、GitHub Pagesの有効化やVercel Projectの用意が無い
- `docs/init-mvp-spec.md:71` — 手順13は「Production URL」とだけ述べ、`https://<owner>.github.io/<repository_name>/` という形を示していない。Vite base（`:58`）が明示されているのと非対称である

はじめて使う人は `/goal` を実行して初めてPreflightで止まる。README「使い方」の2番目あたりに事前設定を1行足せば消える。

### FOLLOW_UP 12: 手順3が `.github/workflows/` を作るのに、Preflightが `gh` Tokenの `workflow` Scopeを確認しない（継続）

- `docs/init-mvp-spec.md:59` — 手順3が `.github/workflows/deploy-pages.yml` を作る
- `docs/init-mvp-spec.md:49` — 手順1の確認は `gh auth status` が認証済みであることまで
- `docs/init-mvp-spec.md:69` — 失敗するのは手順11

### FOLLOW_UP 13: AI ProfileのServer APIが型検査GateとCI Gateの外にある（継続）

- `tsconfig.app.json:21` — `"include": ["src"]`
- `package.json:8` — `"build": "tsc -b && vite build"`
- `profiles/on-local-data-use-ai-app/PROFILE.md:23` — AI処理はすべてServer API経由
- `deploy-templates/vercel.json.template:1-6` — lint・testのStepが無い（`.github/workflow-templates/deploy-pages.yml.template:33-38` にはある）

Vercelの慣例どおり `api/` へServer関数を置くと `tsc -b` が一度も型検査しない。秘密Keyを扱う最も重要なCodeが、Pages側の2Profileには存在するCI Gateも持たない。格上げを検討したが、公開到達性と安全装置の観点では止まらないためFOLLOW_UPを維持する。

### FOLLOW_UP 14: `docs/template-reviews/` が7件1164行へ増え、その一部が現在のTemplateについて事実と異なることを述べたまま新Repositoryへ継承される（継続・悪化）

- `wc -l docs/template-reviews/*.md` — step1系3件419行 + step3系4件745行 = **1164行**（本Reviewでさらに増える）
- 653ae75 によって古くなった記述の例: `docs/template-reviews/step3-baseline-review-r1.md:43,71,100` の3件のBLOCKERは、いずれも本Reviewで RESOLVED / PARTIALLY_RESOLVED と判定した。`docs/template-reviews/step3-baseline-review.md:20` の「13手順」、同 `:27` の「どのProfileにも当てはまらず」も現状と異なる
- `README.md:65` — 「アプリ開発では使わない」との説明はあり、`docs/code-review.md` とのPath衝突も無い

`/spec` と `/goal` の両Agentの入力（`independent-spec-reviewer.md:39`、`independent-code-reviewer.md:39`）にこのDirectoryは含まれないため、判断材料として読まれる経路は無い。ただし新Repositoryが最初から1164行の他人の証跡を持ち、そのうち複数が現在のTemplateについて事実と異なることを述べている状態は望ましくない。`.github/` 配下など `docs/` の外へ移すか、手順3の初期化で削除対象にするのが望ましい。

### FOLLOW_UP 15: 前回から状態が変わっていないもの

- `docs/init-mvp-spec.md:73` の手順14の停止条件が、手順1の `:50` と違って正本 `docs/init-mvp-spec.md` を除外していない（`.vercel/` 側は `.gitignore:14` で解消済み）— consistency FOLLOW_UP 4の残り
- `docs/init-mvp-spec.md:70` の手順12が、手順11のPushで既にDeployが走る実態を反映していない（`:45` が機構を述べたことで説明は入った）— consistency FOLLOW_UP 8
- `.claude/commands/spec.md:34` の `/spec` 手順5のやり直し再入点が、手順3・手順4を明示的に含まない — 前回 FOLLOW_UP 12
- `docs/init-mvp-spec.md:72-73` の手順14のCommitが、手順9のSecurity確認を通らない（範囲を§5のプロセス生成物へ限る保護のみ）— 前回 FOLLOW_UP 13
- `.devcontainer/devcontainer.json:13-15` の `TZ: Asia/Tokyo` 固定と、`:7` の `docker-outside-of-docker` feature — 前回 FOLLOW_UP 11
- `docs/goal-progress.md` の完了日時にTimezone表記が義務づけられていない（`docs/init-mvp-spec.md:87`。§2のDeadlineは `:30` でTimezone必須）— consistency FOLLOW_UP 9
- 3つのPROFILE.md の「TemplateのApp Shellを維持する」（`static-basic:11`、`daily-local-app:11`、`on-local-data-use-ai-app:9`）と、`docs/init-mvp-spec.md:56` の「Template自身の宣伝文・説明文…を残さない」が字面で衝突する。「App Shell」が構造を指し文言を指さないことは文脈から読めるが明示が無い — consistency FOLLOW_UP 10
- `.claude/agents/independent-code-reviewer.md:49,52` の `Ready to merge` Headerは、`docs/init-mvp-spec.md:45` が合流を伴わない運用を定めた現在、指す対象が無い文言になっている（Verdictとの整合規則が `:52` にあるため判定は決定できる）
- 秘密Keyを要するがAI呼び出しではない外部API（有料の非AI API等）を使うMVPは、`static-basic/PROFILE.md:5` と `daily-local-app/PROFILE.md:5` が秘密API Keyで除外し、`on-local-data-use-ai-app/PROFILE.md:5` はServerの責務をAI呼び出しに限定するため、3Profileのどれにも当てはまらない。`.claude/commands/spec.md:25` の対象外リスト（Server Database、認証、複数ユーザー、Device間同期、共有Record、保証されたBackup）にも無い。ただしこのTemplateがどのFileでも支援を約束していない領域であるため、穴として扱わずここに記録する

---

## 総括

前回BLOCKER 3件のうち **RESOLVED 2件（1・3）、PARTIALLY_RESOLVED 1件（2、非blocking）** である。新規BLOCKERは0件である。

- BLOCKER 1 は、節見出しへの条件付与だけでなく、要件本文3段落と必須Test節を「つねに対象」と「条件付き」へ実際に分割している。`git grep` で日次要件の再導入が他Fileに1件も無いことを確認した。表面的な文言追加ではない
- BLOCKER 2 は、強制していた2箇所（`profiles/on-local-data-use-ai-app/PROFILE.md:13` の「Storage機構をちょうど1つ決める」と `independent-spec-reviewer.md:23` の「永続保存を持つProfileなのに」）を両方とも外し、対称の受け入れ条件要求（`:24`）まで足している。停止経路は閉じた。残ったのは Profile 一覧2箇所の文面追随漏れであり、`docs/init-mvp-spec.md:26` の優先順位規定により決定可能なため FOLLOW_UP 1 とした
- BLOCKER 3 は、規定・理由・逸脱時の扱いを1文で揃え、手順11のPush先・Workflowの発火条件・手順12・手順13・手順14の再Pushのすべてと矛盾しない。合流の手順が無いことは、作業Branchを作らない運用では欠落でなくなった

Profile 3つの適用範囲は4象限すべてを覆い、重なりも生じていない。Templateから作った新Repositoryは、`/spec` → 人間の `CONFIRMED` → `/goal` 14手順を通って公開へ到達できる。到達を妨げる切断点は無く、詰まりうる4箇所（Pagesの事前有効化、`workflow` Scope、Production URLの導出、手順3のTest置き換えの判断）はいずれも設計された停止か回復可能な摩擦である。

FOLLOW_UPは15件（新規4件、継続11件）で、うち FOLLOW_UP 1（Profile一覧の文面追随漏れ）、FOLLOW_UP 3（Branch規定に対応する検出Gateの不在）、FOLLOW_UP 13（AI ProfileのServer APIが型検査とCIの外）を優先度の高いものとして挙げる。いずれも単独では公開を止めない。
