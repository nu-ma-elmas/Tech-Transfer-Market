# Step 3 整合性レビュー 周回2（commit `653ae75`、親 `a1d0800`）

- Verdict: APPROVED
- Blockers: 0
- Ready to merge: YES

対象は `docs/template-reviews/step3-baseline-review-r1.md` のBLOCKER 3件に対する修正Commit `653ae75` である。周回1で `APPROVED` とした整合性が、この修正で壊れていないかを主眼に検査した。`git diff a1d0800 653ae75` の全差分（Template本体6File）を読み、Repository全体（`git ls-files` の35件）に対して手順番号の全数照合、循環・到達不能・充足不能の探索、手順14の冪等性の再検査を行った。Commandは実行していない。

本レビューで作成したFileは `docs/template-reviews/step3-consistency-review-r2.md` 1件のみである。他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない。

`653ae75` が触ったFile（証跡2件を除く）:

| File | 変更 |
|---|---|
| `docs/init-mvp-spec.md` | §4冒頭にBranch規定（`:45`）、手順3にTest置き換えのbullet（`:61`） |
| `.gitignore` | `.env` / `.env.*` / `!.env.example` / `.vercel/` を追加（`:7-14`） |
| `.claude/agents/independent-spec-reviewer.md` | 永続の判定基準を条件分岐化（`:23-24`） |
| `profiles/on-local-data-use-ai-app/PROFILE.md` | Data節（`:13-19`）と必須Test（`:33-35`）を永続の有無で分岐 |
| `profiles/daily-local-app/PROFILE.md` | 時刻と日付節（`:21-29`）と必須Test（`:41-43`）を日付・集計の有無で分岐 |
| `README.md` | 手順14の要約行（`:54`）を実態へ修正 |

---

## 回帰の検査

### 結論

**回帰は無い。** 周回1で「問題なし」と記録した項目は7件すべて維持されている。加えて、周回1のFOLLOW_UP 2は解消、FOLLOW_UP 4は半分解消、FOLLOW_UP 1とFOLLOW_UP 7は正本側の手当てが入って残存リスクが下がった。

### 1. §4冒頭のBranch規定 vs 手順1・11・12・14

**矛盾しない。**

- `docs/init-mvp-spec.md:45` — 「このワークフローは既定Branch（`main`）の上で行う。作業Branchを分けない。Deploy Workflowは既定Branchへのpushでだけ発火するため、Branchを分けると手順12のDeployが起きない。分ける必要が生じた場合は製品判断であり、停止して人間に確認する」
- `docs/init-mvp-spec.md:47` — 手順1「1つでも満たさない場合は、Branch・Commitを作らず、`docs/goal-progress.md` 以外のFileも作らず停止し」
- `docs/init-mvp-spec.md:69` — 手順11「Push — fast-forwardのみ。force pushしない」
- `docs/init-mvp-spec.md:70` — 手順12「Profileの既定方式でDeployする」
- `docs/init-mvp-spec.md:72` — 手順14「CommitしてPushする。fast-forwardのみ」
- `.github/workflow-templates/deploy-pages.yml.template:5` — `branches: [main]`

`:45` と `:47` はいずれも「Branchを作るな」の側であり、命令の向きが同じである。`:47` は失敗時の禁止であって、成功時にBranchを作る許可を与えていない。`:45` が§4全体に掛かる無条件の規定であるため、両者を同時に満たすことは可能であり、どちらに従うか決定できない状態も生じない。`:47` の「Branch・」が `:45` 導入後に不要な語になっている点だけが残る（FOLLOW_UP 3）。

手順11・12・14との関係は、`:45` によってむしろ閉じた。手順11のPush先が `main` に確定したことで `deploy-pages.yml.template:5` の `branches: [main]` が発火し、手順12の「Profileの既定方式でDeploy」に実体が伴う。baseline BLOCKER 3が指摘した「公開連鎖で未定義のまま残った最後の環」は塞がっている。手順14のPushも同じBranchであり、`:75` の「Push を契機にDeployが再度走る場合がある」という記述と整合する（Branchが分かれていれば再Deployは起きず、`:75` が空文になっていた）。

到達不能経路も新設されない。`:45` の「分ける必要が生じた場合は…停止して人間に確認する」が、Branchを分けたい場合の出口を§6の停止条件と同じ形で用意している。

残る隙は既定Branch名が `main` でないRepositoryの場合だけで、これはFOLLOW_UP 2に記録する。

### 2. 手順3のTest置き換え vs 手順5 および `independent-code-reviewer`

**決定可能な形で両立する。**

- `docs/init-mvp-spec.md:61` — 「Template由来のApp Shell Testは、§2の仕様に対するTestへ置き換える。Template固有のDOMを前提としたTestは、置き換え後には対象が存在しないため成立しない。**これは置き換えであって手順5が禁じるGate緩和や削減ではない。** 置き換え後のTestが§2の受け入れ条件と計算の境界を覆うこと」
- `docs/init-mvp-spec.md:63` — 手順5「Testの削除・skip・Gate緩和で通さない」
- `.claude/agents/independent-code-reviewer.md:19` — 「Testが削除、skip、緩和されている。Gateの設定が緩められている」がBLOCKER条件
- `.claude/agents/independent-code-reviewer.md:23` — 「Template自身の宣伝文が残っている」がBLOCKER条件
- `.claude/agents/independent-code-reviewer.md:13` — 判断基準の正本に `docs/init-mvp-spec.md` を挙げる
- `.claude/agents/independent-code-reviewer.md:39` — 入力として `docs/init-mvp-spec.md` を読む
- `src/App.test.tsx:30` — `getByRole('link', { name: 'View the first step' })`
- `src/App.tsx:17-29` — その Link と `#first-step` Section

周回1のFOLLOW_UP 1（およびbaseline FOLLOW_UP 2）が指摘した「同一Reviewerの2つのBLOCKER基準が同じ1行の上で衝突する」状態に対し、正本側が明示的な例外規定を置いた。判定手順は次のとおり一意に定まる。

1. Reviewerは `:39` により `docs/init-mvp-spec.md` の全文を読む。`:23` で既に§4手順3を参照しているとおり、§4は判断材料に入っている
2. `:61` は「これは置き換えであって手順5が禁じるGate緩和や削減ではない」と、`:63` および `independent-code-reviewer.md:19` が禁じる集合から明示的に除外している
3. `:61` は代わりに「置き換え後のTestが§2の受け入れ条件と計算の境界を覆うこと」という検査可能な下限を課しており、除外が無条件の抜け穴になっていない。Testを消して終わりにする経路は、この下限で塞がれる
4. `.claude/agents/independent-code-reviewer.md:13` が正本を `docs/init-mvp-spec.md` としているため、Reviewerの箇条書き `:19` と正本 `:61` の粒度が違う場合は正本が優先される

したがって、`#first-step` Sectionを消して `src/App.test.tsx` を§2向けTestへ差し替える行為は、`:19` にも `:23` にも触れないと決定できる。周回1はこの決定を「文面の目的解釈」から導いていたが、いまは正本の明文で導ける。前進である。

`independent-code-reviewer.md:19` の側に例外への言及が無い点だけが残る（FOLLOW_UP 4）。

手順の順序も破綻しない。`:55` の「終えるまで手順4へ進まない」により、Test置き換えは実装（手順4）より前に完了する。この時点で `npm run test` はREDになりうるが、Gateを回すのは手順5（`:63`）であり手順3ではないため、充足不能な要求の組にならない。中断して手順3から再開しても置き換えは再実行可能で、`:91` の再開ロジック（`[x]` でない最小番号）を壊さない。

### 3. `.gitignore` への追加 vs 「プロセス生成物を `.gitignore` へ入れない」

**衝突しない。**

- `.gitignore:1-14` — `node_modules/` / `dist/` / `coverage/` / `*.local` / `.DS_Store` / `*.log` / `.env` / `.env.*` / `!.env.example` / `.vercel/`
- `docs/init-mvp-spec.md:81` — 「`docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md` をプロセス生成物と呼ぶ。…証跡として手順10と手順14でCommitする。`.gitignore` へ入れない」

追加された4Patternのいずれも、3件のプロセス生成物のPathに一致しない。`.env.*` は `docs/` 配下に及ばず、`.vercel/` は末尾スラッシュによりDirectoryのみを対象とするため、手順3（`:59`）が作る `vercel.json` も除外されない。`git ls-files -i -c --exclude-standard` は空であり、追跡中のFileが新たに無視対象へ入った事実も無い（Working Treeは `git status --porcelain -uall` が空でclean）。

副次的に、周回1のFOLLOW_UP 4のうち `.vercel/` に起因する停止経路が閉じた。`docs/init-mvp-spec.md:73`（手順14は§5のプロセス生成物以外に未Commit変更があれば停止）に対し、手順12のVercel Deployが生む `.vercel/project.json` は無視対象となり、最終手順を止めなくなった。`docs/init-mvp-spec.md:39`（秘密情報をCommitしない）と `profiles/on-local-data-use-ai-app/PROFILE.md:23` に対する機械的な防波堤も新設された。baseline FOLLOW_UP 1は解消である。

### 4. 3つのPROFILE.mdの条件分岐 vs `independent-spec-reviewer`

**食い違っていない。** 3Profile × 永続の有無のすべての組で、Reviewerの判定が一意に定まることを確認した。

- `.claude/agents/independent-spec-reviewer.md:23` — 「永続するかどうかが決まっていない。永続すると決めた仕様なのに、Storage機構、Schema Version、読み取り時のValidation、壊れたDataからの復旧、読み書き失敗時の挙動のいずれかが決まっていない」
- `.claude/agents/independent-spec-reviewer.md:24` — 「永続しない仕様なのに、Reloadで入力や結果がリセットされる挙動が受け入れ条件に書かれていない」
- `.claude/agents/independent-spec-reviewer.md:39` — 入力は `docs/init-mvp-spec.md` と選択済みProfile

| Profile | 永続の決まり方 | `:23` の充足 | `:24` の充足 |
|---|---|---|---|
| `static-basic` | 常に永続しない（`profiles/static-basic/PROFILE.md:15`「このProfileは永続Storageを使わない」） | Profileが決めるので「決まっていない」に当たらない | `profiles/static-basic/PROFILE.md:17` が受け入れ条件へのReset挙動の明示を要求。一致 |
| `daily-local-app` | 常に永続する（`profiles/daily-local-app/PROFILE.md:15`「Storage機構をちょうど1つ、要求入力で決める」） | 同 `:17` がKey名・Schema Version・Validation・復旧・失敗時挙動を仕様で確定させる。`:23` の列挙と一致 | 該当しない |
| `on-local-data-use-ai-app` | 仕様で決める（`profiles/on-local-data-use-ai-app/PROFILE.md:15`「永続するかどうかを、要求入力で先に決める」） | `:15` が決定を義務づけ、`:19` が永続する場合の確定事項を `:23` と同じ5点で列挙 | `:17` が「Reloadやタブを閉じることで入力と結果がリセットされる挙動を、受け入れ条件に明示する」。`:24` と一致 |

`:24` の旧文が `static-basic` 名指しだったのを「永続しない仕様なのに」へ一般化した変更は、`on-local-data-use-ai-app` の非永続分岐（`PROFILE.md:17`）を新たに射程へ入れるためのものであり、`static-basic` に対する効力は `PROFILE.md:17` により従前どおり維持される。取りこぼしは無い。

必須Testの条件分岐も、Reviewer側と衝突しない。`independent-spec-reviewer` は必須Testを判定対象にしておらず、`independent-code-reviewer.md:22` の「Profileの制約に反する」だけが経路である。`profiles/daily-local-app/PROFILE.md:41-43` と `profiles/on-local-data-use-ai-app/PROFILE.md:33-35` はいずれも「つねに対象とする」節と「〜の場合だけ加える」節に分かれ、発火条件が仕様の内容（日付を扱うか／集計を出すか／永続するか）だけで決まる。後続手順の完了に依存する条件は無い。

baseline BLOCKER 1（`daily-local-app` の適用範囲と本体のずれ）については、`profiles/daily-local-app/PROFILE.md:5` の適用範囲（日次への限定なし）と `:21-29`・`:41-43`（日付・1日1件・集計をいずれも条件付き）が対応した。買い物リストやMemoのような非日次の永続アプリが、書きようのない要件を課されて停止する経路は消えている。Profile名 `daily-local-app` だけが日次を示唆したまま残るが、`docs/init-mvp-spec.md:28`、`CLAUDE.md:32`、`README.md:68` のいずれも日次を条件にしていないため、名前から追加要件が導かれる経路は無い。

baseline BLOCKER 2（AIあり・永続なし）については、`profiles/on-local-data-use-ai-app/PROFILE.md:17` が「永続しない場合は、Storage機構を持たない」と明示し、`independent-spec-reviewer.md:23` の旧文「永続保存を持つProfileなのに」が「永続すると決めた仕様なのに」へ変わったことで、`/spec` 手順5で必ずBLOCKERになる経路は消えた。周回1のFOLLOW_UP 6も同時に解消である。ただし正本§2とREADMEの記述が追随していない（FOLLOW_UP 1）。

### 5. 手順番号の全数照合

**全一致。ズレは1件も無い。** `docs/template-reviews/` 配下の過去の証跡を除く全Fileを対象に照合した。

- `docs/init-mvp-spec.md:47,54,55,62,63,64,65,66,67,68,69,70,71,72` — §4は 1..14 の連番で欠番・重複なし
- §4内の相互参照 — `:45`（手順12）、`:55`（手順4）、`:61`（手順5）、`:65`（手順5と6、手順7自身）、`:70`（手順3）、`:72`（手順13まで、手順10、手順10以降）、`:73`（手順9）。すべて実在の番号を正しく指す
- §5 — `:81`（手順10と手順14）、`:83`（手順1から手順13、手順14）、`:85`（手順1から13、手順7、手順5と手順6）、`:91`（手順1から13、手順14、手順7、手順1）
- `CLAUDE.md:14` — 「§4の手順1から14」
- `README.md:33`（14手順）、`:35`（ワークフロー14手順）、`:40-54`（1..14の一覧。表題は§4の各手順名と一致）、`:46`（手順5のGate結果）
- `.claude/commands/goal.md:24`（手順1から13／手順14／手順7／§4手順1）、`:34`（§4手順6）、`:36`（§4手順5）、`:40`（§4手順7、手順5と手順6、手順6）
- `.claude/agents/independent-code-reviewer.md:23`（§4手順3）、`:35`（§4手順5）、`:39`（§4手順5）
- `/spec` 独自の手順1〜6との混同 — 無い。`.claude/commands/spec.md:17,20,27,31,33,37` が自身の1..6を定義し、`:28,29,34,35` の相互参照は自身の番号系に閉じる。§4を指す唯一の箇所 `:18` は「正本§4手順1」と明示する。`docs/init-mvp-spec.md:41` と `CLAUDE.md:7` の「§2を書くのは `/spec` の手順4だけ」も `/spec` を明示しており、`spec.md:31` の手順4と対応する
- 旧番号の残存 — 「13手順」「手順1から13を実行」「手順4のGate結果」「手順6の周回数」等はTemplate本体に0件

`653ae75` は手順の追加・削除・繰り下げを行っていないため、この照合結果は周回1から変わっていない。新設された `:45` と `:61` が参照する手順12・手順4・手順5もすべて正しい。

### 6. 循環・到達不能・充足不能

**いずれも無い。**

- 発火条件の前方依存 — 各手順の発火条件は先行手順の完了だけに依存する。新設された `:45` はBranchに関する静的な規定であり、どの手順の完了にも依存しない。`:61` は手順3の内部要件であり、手順2の完了だけを前提とする
- 手順7の `[x]` 条件（`:65`）はやり直した手順6の `APPROVED` に依存するが、手順6は手順7より前であり循環しない。BLOCKER修正周回で手順5・6を `[ ]` へ戻した場合も、`:91` の再開最小番号は5となり 5→6→7 と前進する
- 到達不能 — 手順1のPagesのSource確認（`:52`）はRepository設定の確認であり、手順3が作るWorkflow Fileの存在に依存しない。`:45` によって手順11のPush先が確定したため、手順12→13→14の経路がすべて到達可能になった
- 充足不能の組 — 探した4組はすべて同時に満たせる。(a) 手順3のTest置き換え ∧ 手順5のTest削除禁止 → `:61` の明文除外で解消。(b) 手順3のPlaceholder除去 ∧ `independent-code-reviewer.md:23` → 同方向。(c) `on-local-data-use-ai-app` の非永続 ∧ `independent-spec-reviewer.md:23` → `PROFILE.md:15,17` で解消。(d) 非日次の永続アプリ ∧ `daily-local-app` の必須Test → `PROFILE.md:43` の条件化で解消
- 不変条件 — 6件すべて維持。正本の§2以外をAIが書き換えない（`docs/init-mvp-spec.md:41`、`CLAUDE.md:7`。手順3が触るのは `src/`・`index.html`・`package.json`・`vite.config.ts`・`.github/workflows/`・`vercel.json`・`src/App.test.tsx` であり正本に含まれない）／§1の `CONFIRMED` は人間だけ（`docs/init-mvp-spec.md:15`、`.claude/commands/spec.md:38`）／独立レビューは別Subagent Context（`.claude/commands/goal.md:34`、`docs/init-mvp-spec.md:64`）／Verdict不可侵（`.claude/commands/goal.md:38`、`.claude/commands/spec.md:33`）／BLOCKER修正は最大2周（`docs/init-mvp-spec.md:65`、`.claude/commands/goal.md:40`、`.claude/commands/spec.md:34`）／プロセス生成物は `.gitignore` に無い（上記3節）

### 7. 手順14の冪等性

**`653ae75` による変化は無く、周回1の判定を維持する。** 手順14の本文（`docs/init-mvp-spec.md:72-75`）はこのCommitで変更されていない。周辺との整合を再確認した。

- §5の記録規則との両立 — `:83`「記録の対象は手順1から手順13である。手順14は自身の行を書かない」が§4 `:74` と同文。`:89` の先回り禁止・一括書き禁止は手順1〜13にのみ掛かり、手順14はその適用外である。従うべき規則が二重にならない
- 再開ロジックとの両立 — `:91` と `.claude/commands/goal.md:24` がいずれも「手順1から13のうち `[x]` でない最小番号」「手順1から13がすべて `[x]` なら手順14」で一致。手順14の行が存在しないため、`[x]` にした直後の中断で手順14が飛ばされる周回1以前の破綻経路は無い。無限後退の停止不動点も維持されている
- 手順1のPreflightとの両立 — `:50` は開始時1回の判定、`:74` は終了時のプロセス生成物のみの判定。対象と時点が異なり衝突しない
- 手順9のSecurity確認との両立 — `:73` が変更可能範囲を§5のプロセス生成物だけに限り、手順9を通っていない内容の混入を塞ぐ
- Branch規定との両立 — `:45` により手順14のPush先も `main` であり、`:72` の「fast-forwardのみ」と `:75` の再Deploy記述が整合する

残る穴はCommit成功・Push失敗の窓（周回1 FOLLOW_UP 3／baseline FOLLOW_UP 5）と、正本 `docs/init-mvp-spec.md` の未Commit変更による停止（周回1 FOLLOW_UP 4の残り半分）の2つで、いずれも `653ae75` の前から存在し、公開も証跡のローカル保全も止めない。FOLLOW_UP 7・8へ再掲する。

---

## BLOCKER

無し。

---

## FOLLOW_UP

### FOLLOW_UP 1 — baseline BLOCKER 2の修正が正本§2とREADMEへ伝播しておらず、AI Profileの永続が必須のままと読める（最優先）

**Evidence**

- `profiles/on-local-data-use-ai-app/PROFILE.md:15` — 「**永続するかどうかを、要求入力（`docs/init-mvp-spec.md`）で先に決める。**」
- `profiles/on-local-data-use-ai-app/PROFILE.md:17` — 「永続しない場合は、Storage機構を持たない」
- `docs/init-mvp-spec.md:29` — 「`on-local-data-use-ai-app` — Vercel。**ローカル永続に加え**、秘密Keyを要するAI呼び出しをServer API経由で行う」（未修正）
- `README.md:69` — 「`on-local-data-use-ai-app` = Vercel / **ローカル永続あり**・Server API経由のAIあり」（未修正）
- `docs/init-mvp-spec.md:26` — 「詳細は `profiles/<selected_profile>/PROFILE.md` を正本とする」
- `CLAUDE.md:33` — 永続に言及しない（矛盾なし）
- `.claude/agents/independent-spec-reviewer.md:20` — 「§2の項目どうしが矛盾している」がBLOCKER条件
- `.claude/agents/independent-spec-reviewer.md:39` — 入力は `docs/init-mvp-spec.md` と選択済みProfile

「文章を貼ると要約が出る」型の非永続AIアプリを `/spec` に通すと、独立仕様レビュアーは §2 `:29` の「ローカル永続に加え」と `PROFILE.md:17` の「永続しない場合は、Storage機構を持たない」を同時に読む。`:29` を選択済みProfileの要件と解釈すると `:20`（§2の項目どうしの矛盾）でBLOCKERを出しうる。

BLOCKERとしない理由は、`docs/init-mvp-spec.md:26` が「詳細は `profiles/<selected_profile>/PROFILE.md` を正本とする」と明示的な優先順位を置いており、`:29` の一行要約が細部について権威を持たないと決定できるためである。`.claude/agents/independent-code-reviewer.md:13` も `profiles/` を正本に含めている。判断は可能であり公開は止まらない。

ただし、これは修正が半分しか適用されていない箇所であり、誤射が起きた場合に手順5の2周を空費する。`:29` を「Vercel。秘密Keyを要するAI呼び出しをServer API経由で行う。ローカル永続の有無は仕様で決める」、`README.md:69` を「Vercel / Server API経由のAIあり・ローカル永続は任意」とすれば消える。

### FOLLOW_UP 2 — 既定Branch名が `main` であることを、§4も手順1のPreflightも検証しない

**Evidence**

- `docs/init-mvp-spec.md:45` — 「このワークフローは既定Branch（`main`）の上で行う」。既定Branch名が `main` であることを前提として断言する
- `docs/init-mvp-spec.md:48-53` — 手順1のPreflight。現在のBranchも既定Branch名も確認項目に無い
- `.github/workflow-templates/deploy-pages.yml.template:5` — `branches: [main]` とHard-codeされている
- `docs/init-mvp-spec.md:59` — 手順3はTemplateを「複製する」だけで、Branch名を書き換えない
- `docs/init-mvp-spec.md:70` — 手順12「Vite baseとDeploy素材は手順3で配置済みである」

既定Branchが `master` などに設定されたAccount・Organizationでこのテンプレートから作ると、手順11のPushは `master` へ行われ、`branches: [main]` に一致せずWorkflowが発火しない。`workflow_dispatch` は既定Branch上にWorkflow Fileが存在すれば使えるため回復経路はあるが、そのことは書かれていない。

baseline BLOCKER 3が塞いだ穴の残りの薄片である。GitHubの既定は2020年以降 `main` であり、失敗経路は少数構成に限られるうえ `:45` が前提を明文で宣言しているため、BLOCKERとしない。手順1のPreflightへ「現在のBranchがRepositoryの既定Branchであり、その名前が `main` であること」を1行加えるか、手順3へ「Workflowの `branches:` を既定Branch名に合わせる」を加えれば閉じる。

### FOLLOW_UP 3 — 手順1の「Branch・Commitを作らず」が、§4冒頭のBranch規定の導入で不要な語になっている

**Evidence**

- `docs/init-mvp-spec.md:45` — 「作業Branchを分けない」
- `docs/init-mvp-spec.md:47` — 手順1「1つでも満たさない場合は、**Branch**・Commitを作らず、`docs/goal-progress.md` 以外のFileも作らず停止し」

`:45` の導入により、Preflightを通ってもBranchは作られない。`:47` の「Branch・」は、Preflight成功時にはBranchを作るという旧設計の名残である。命令の向きは `:45` と同じ（どちらも作るなの側）なので矛盾は生じず、決定不能にもならない。「Commitを作らず」だけにすれば消える。

### FOLLOW_UP 4 — `independent-code-reviewer.md:19` に、手順3のTest置き換えが例外である旨の言及が無い

**Evidence**

- `docs/init-mvp-spec.md:61` — 「これは置き換えであって手順5が禁じるGate緩和や削減ではない」
- `.claude/agents/independent-code-reviewer.md:19` — 「Testが削除、skip、緩和されている。Gateの設定が緩められている」。例外への言及が無い
- `.claude/agents/independent-code-reviewer.md:13` — 判断基準の正本に `docs/init-mvp-spec.md` を含む
- `src/App.test.tsx:7-9` — 「It must stay independent of the placeholder values … and **pass both before and after the placeholders are replaced**」。Placeholderが残った状態でPASSすることを要件として述べる旧Comment
- `src/App.test.tsx:30` — `getByRole('link', { name: 'View the first step' })`

正本 `:61` が明文で除外したため判定は一意に定まる（回帰検査2節）が、Reviewerの箇条書きだけを見て機械的に照合するContextは `:19` で誤射しうる。`:19` へ「§4手順3によるTemplate由来Testの置き換えを除く」を添えれば消える。あわせて `src/App.test.tsx:7-9` のComment（置き換え後もPlaceholder前後で通ることを要件と述べる）が `:61` と方向が逆であり、Template配布物として更新する余地がある。

### FOLLOW_UP 5 — §2に、永続の有無・Storage機構・Schema Versionを書く項目が無い

**Evidence**

- `.claude/agents/independent-spec-reviewer.md:23` — 「**永続するかどうかが決まっていない**。永続すると決めた仕様なのに、Storage機構、Schema Version、読み取り時のValidation、壊れたDataからの復旧、読み書き失敗時の挙動のいずれかが決まっていない」がBLOCKER条件
- `docs/init-mvp-spec.md:21-32` — §2の項目一覧。App名／目的／主要機能／Scope外／画面とDesign／Profile／Deadline／受け入れ条件／秘密情報。永続の有無もStorage機構も項目が無い
- `profiles/on-local-data-use-ai-app/PROFILE.md:15` — 「永続するかどうかを、要求入力（`docs/init-mvp-spec.md`）で先に決める」
- `profiles/daily-local-app/PROFILE.md:17`、`profiles/on-local-data-use-ai-app/PROFILE.md:19` — Key名・Schema Version・Validation・復旧・失敗時挙動を「仕様で確定する」

`:23` の後段（Storage機構等）は `653ae75` 以前から同じ構造だが、前段の「永続するかどうかが決まっていない」は新設された条件である。`on-local-data-use-ai-app` では永続の有無がProfileから導けなくなったため、§2のどこかに明示的に書く必要が生じたが、書く欄が用意されていない。

充足不能ではない。「受け入れ条件」（`:31`）や「主要機能」（`:23`）へ書けば満たせるうえ、非永続の場合は `independent-spec-reviewer.md:24` がReset挙動を受け入れ条件に要求するため、そこに自然に現れる。BLOCKERとしない。§2へ「Data永続（`なし` / 機構名。永続する場合はKey名、Schema Version、Validation、復旧、失敗時挙動）」の1項目を足せば、記入場所と検査場所が一致する。

### FOLLOW_UP 6 — `README.md:43` の手順3要約が、追加されたTest置き換えを含まない

**Evidence**

- `README.md:43` — 「 3. 初期化           Placeholder置換、package.json名、Vite base、Deploy素材の配置」
- `docs/init-mvp-spec.md:56-61` — 手順3のbulletは6件（Placeholder置換、`package.json` の `name`、Vite base、Deploy素材、置き換え漏れ確認、**App Shell Testの置き換え**）
- `README.md:37` — 「`docs/init-mvp-spec.md` §4が正本です」

`653ae75` は `README.md:54`（手順14）を正本へ追随させたが、同じCommitで変わった手順3（`:61`）は `README.md:43` に反映されていない。`:37` が正本を明示しているためBLOCKERとしない。要約行へ「App Shell Testの置き換え」を加えれば揃う。なお周回1のFOLLOW_UP 2（`README.md:54` の手順14要約）とbaseline FOLLOW_UP 4は、この修正で**解消済み**である。

### FOLLOW_UP 7 — 手順14の完了判定がPushの成否を見ない（周回1 FOLLOW_UP 3／baseline FOLLOW_UP 5・未解消）

**Evidence**

- `docs/init-mvp-spec.md:74` — 「完了は、プロセス生成物に未Commitの変更が残っていないことで判定する。何度実行しても同じ結果になる」
- `docs/init-mvp-spec.md:83` — 同旨（§5側の再掲）
- `.claude/commands/goal.md:24` — 同旨
- `docs/init-mvp-spec.md:72` — 手順14の構成要素は「CommitしてPushする」

Commit成功・Push失敗の窓（認証切れ、Network断、非fast-forward）で再開すると、未Commitの変更が無いため完了と判定され、Pushは二度と行われない。公開は手順11・12で済んでおり証跡もローカルには残るためBLOCKERとしない。完了判定へ「かつ現在のBranchがupstreamより先行していないこと」を加えれば閉じる。

### FOLLOW_UP 8 — 手順14の停止条件が手順1の除外規則より厳しく、`docs/init-mvp-spec.md` の未Commit変更で最終手順が停止しうる（周回1 FOLLOW_UP 4・半分未解消）

**Evidence**

- `docs/init-mvp-spec.md:50` — 手順1は「`docs/init-mvp-spec.md` と§5のプロセス生成物を除いた未Commitの変更がないこと」。正本の未Commit変更を明示的に許容する
- `docs/init-mvp-spec.md:73` — 手順14は「変更してよいのは§5のプロセス生成物だけである。それ以外のFileに未Commitの変更があれば、Commitせず停止して人間に報告する」。`docs/init-mvp-spec.md` の除外が無い
- `docs/init-mvp-spec.md:68` — 手順10は「レビューを通った内容と、§5のプロセス生成物をCommitする」
- `.claude/commands/spec.md:31` — `/spec` 手順4は§2を書くだけでCommitしない

`.vercel/` に起因していた側は `.gitignore:14` の追加で閉じた。残るのは正本自身で、`/spec` が書いた§2が手順10で確実にCommitされるかは「レビューを通った内容」の解釈次第である。含まれなかった場合、手順13の本番確認を終えた後に手順14が停止する。公開そのものは止まらない。手順14の除外リストを手順1と揃えれば消える。

### FOLLOW_UP 9 — 手順3の「App Shellを維持する」と「説明文を残さない」の字面の衝突（周回1 FOLLOW_UP 10・未解消）

**Evidence**

- `profiles/static-basic/PROFILE.md:11`、`profiles/daily-local-app/PROFILE.md:11`、`profiles/on-local-data-use-ai-app/PROFILE.md:9` — いずれも「TemplateのApp Shellを維持する」
- `docs/init-mvp-spec.md:56` — 「`src/` と `index.html` に、Template自身の宣伝文・説明文・Placeholderを残さない」
- `docs/init-mvp-spec.md:61` — 「Template由来のApp Shell **Test**は…置き換える」

`:61` が「App Shell Test」を置き換え対象と明言したことで、「App Shell」という語が「維持するもの」と「置き換えるもの」の両方に使われるようになった。文脈から「App Shell」＝構造（landmark、header/main/footer）、「App Shell Test」＝Template固有DOMを前提としたTest、と読み分けられるためBLOCKERとしない。PROFILE.md側を「App Shellの構造（landmarkと基本Layout）を維持する」と限定すれば消える。

### FOLLOW_UP 10 — 前回から状態が変わっていないもの

いずれも単独では公開を止めない。`653ae75` はこれらに触れていない。

- `docs/goal-progress.md` の完了日時にTimezone表記が義務づけられていない（`docs/init-mvp-spec.md:87`、`.claude/commands/goal.md:30`。§2のDeadlineは `:30` でTimezone必須）— 周回1 FOLLOW_UP 9
- `/spec` 手順5のやり直し再入点が手順3・手順4を明示的に含まない（`.claude/commands/spec.md:34`。`:28` の「手順3を終えるまで手順4へ進まない」との関係が不明確）— 周回1 FOLLOW_UP 9／baseline FOLLOW_UP 12
- `CLAUDE.md:25` のGate列挙が正本より狭い（`npm ci` と `git diff --check`（`docs/init-mvp-spec.md:63`）、および手順3の初期化が入っていない）— baseline FOLLOW_UP 6
- Mobile幅の基準が375px（`docs/init-mvp-spec.md:66`、`.claude/agents/independent-code-reviewer.md:24`）と320px（`profiles/static-basic/PROFILE.md:29`、`profiles/daily-local-app/PROFILE.md:41`）で不統一。`profiles/on-local-data-use-ai-app/PROFILE.md:33` には画面幅の必須Testが無い — baseline FOLLOW_UP 7
- Placeholder残存を検出する自動Gateが無く、`.claude/agents/independent-code-reviewer.md:23` の判断Gateだけが防波堤である — baseline FOLLOW_UP 3
- 手順3の「Template固有の文字列を検索」（`docs/init-mvp-spec.md:60`）に範囲の上限が無く、`LICENSE:3` や `docs/template-reviews/` を含みうる — baseline FOLLOW_UP 8
- AI ProfileのServer API（`api/`）が `tsconfig.app.json:21` / `tsconfig.node.json:15` のどの `include` にも入らず `tsc -b` の型検査を受けない。`deploy-templates/vercel.json.template` にlint・testのStepが無い — baseline FOLLOW_UP 10
- `index.html:2` の `<html lang="en">`、`package.json:4` の `"version": "1.0.0"`、`.devcontainer/devcontainer.json:2` の Template名 が手順3の対象外 — 周回1 FOLLOW_UP 10／baseline FOLLOW_UP 8
- `.devcontainer/devcontainer.json:13-15` の `TZ: Asia/Tokyo` 固定と `:7` の `docker-outside-of-docker` feature — baseline FOLLOW_UP 11
- 手順3が複製元の `.template` を削除せず、選ばなかった側のDeploy素材も利用者のRepositoryに残る（`docs/init-mvp-spec.md:59`）— 周回1 FOLLOW_UP 10
- `docs/template-reviews/` の証跡が新Repositoryへ継承される。本Fileの追加で8件となる（`README.md:65` に説明あり）— baseline FOLLOW_UP 9
- 手順12のDeployは多くの場合すでに手順11のPushで発火しており、手順12は実質「完了待ちと確認」である（`docs/init-mvp-spec.md:69-70`、`deploy-pages.yml.template:5`）— 周回1 FOLLOW_UP 8
- 手順14のCommitが手順9のSecurity確認を通らない。範囲を§5のプロセス生成物に限る保護（`docs/init-mvp-spec.md:73`）はある — baseline FOLLOW_UP 13
- 手順3が `.github/workflows/` へFileを追加するが、手順1のPreflight（`docs/init-mvp-spec.md:49`）が `gh` Tokenの `workflow` Scopeを確認しない — 周回1 FOLLOW_UP 5

---

## 総括

`653ae75` はbaseline BLOCKER 3件を、いずれも整合性を壊さずに解消した。

- BLOCKER 1（`daily-local-app` の範囲と要件のずれ）— `profiles/daily-local-app/PROFILE.md:21-29,41-43` の条件分岐化で解消。他Fileに日次を要求する記述は無く、波及先は無い
- BLOCKER 2（AIあり・永続なし）— `profiles/on-local-data-use-ai-app/PROFILE.md:15-19,33-35` と `.claude/agents/independent-spec-reviewer.md:23-24` で解消。ただし `docs/init-mvp-spec.md:29` と `README.md:69` へ伝播していない（FOLLOW_UP 1）
- BLOCKER 3（作業Branch未定義）— `docs/init-mvp-spec.md:45` で解消。手順1・11・12・14のいずれとも矛盾せず、むしろ手順12の発火条件と `:75` の再Deploy記述に実体を与えた

副次的に、周回1のFOLLOW_UP 2と6、baseline FOLLOW_UP 1と4が解消し、周回1 FOLLOW_UP 4は半分閉じた。周回1 FOLLOW_UP 1（手順3とApp Shell Testの衝突）は正本 `:61` の明文により、解釈に依存しない決定手続きへ格上げされた。

手順番号は全File・全参照で一致し、循環・到達不能・充足不能の組は見つからなかった。手順14の冪等性は `653ae75` で変化しておらず、`.gitignore` への `.vercel/` 追加によって停止経路が1つ減った。不変条件6件はすべて維持されている。

FOLLOW_UPは10件で、うち新規は5件（1〜5）、周回1またはbaselineからの持ち越しが5件（6〜10）である。最優先はFOLLOW_UP 1（BLOCKER 2の修正が正本§2とREADMEへ届いていない）で、これは半分適用された修正であり、放置すると `/spec` 手順5で誤射が起きうる。ただし `docs/init-mvp-spec.md:26` の優先順位規定により判定は一意に定まるため、Mergeを止める理由にはならない。
