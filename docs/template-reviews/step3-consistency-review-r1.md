# Step 3 整合性レビュー 周回1（commit `a1d0800`、親 `b13edee`）

- Verdict: APPROVED
- Blockers: 0
- Ready to merge: YES

対象は前回2件のレビュー（`docs/template-reviews/step3-consistency-review.md` のBLOCKER 1件、`docs/template-reviews/step3-baseline-review.md` のBLOCKER 4件）に対する修正である。Repository全体（`git ls-files` の34件）を読み、手順番号の全数照合、新設された手順3、再設計された手順14、Profile 3つ体制、循環・到達不能経路を検査した。Commandは実行していない。本レビューで作成したFileは `docs/template-reviews/step3-consistency-review-r1.md` 1件のみであり、他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない。

---

## 前回BLOCKER 5件の解消判定

| # | 出典 | 指摘 | 判定 |
|---|---|---|---|
| C-1 | consistency BLOCKER 1 | 手順13の自己記録が§5の先回り禁止と充足不能に矛盾し、証跡が閉じない（無限後退・中断時の破綻経路） | **RESOLVED** |
| B-1 | baseline BLOCKER 1 | 「永続化あり・AIなし」のアプリがどのProfileにも当てはまらない | **RESOLVED** |
| B-2 | baseline BLOCKER 2 | Deploy素材を有効化する手順が§4のどこにも無い | **RESOLVED** |
| B-3 | baseline BLOCKER 3 | Placeholder置換の責務が無主で、全Gateを通過して本番へ出る | **RESOLVED** |
| B-4 | baseline BLOCKER 4 | `/spec` が「秘密Key・Serverが要るなら対象外」と述べ、AI Profileと矛盾 | **RESOLVED** |

### C-1 — RESOLVED

**修正内容** — 手順13を手順14へ繰り下げたうえで自己言及を構造的に除去した。`docs/init-mvp-spec.md:71` が「**この手順は自身の行を `docs/goal-progress.md` へ書かない。** 完了は、プロセス生成物に未Commitの変更が残っていないことで判定する」と定め、`docs/init-mvp-spec.md:80` が§5側からも「記録の対象は手順1から手順13である。手順14は自身の行を書かない」と同じことを述べる。再開ロジックは `docs/init-mvp-spec.md:88` と `.claude/commands/goal.md:24` の双方で「手順1から13のうち `[x]` になっていない最小番号」「手順1から13がすべて `[x]` になっていれば手順14を行う」へ揃った。

**検証（無限後退の閉鎖）** — 手順14はもはや自分の完了を記録しないため、「書く→Commit→書く」の後退が生じない。手順10のCommit後に書かれる手順10〜13の行は、手順14の1回のCommitで全部取り込まれ、その後に新たな記録は発生しない。停止不動点が存在する。

**検証（前回の破綻経路）** — 前回の経路は「手順13が自分の行を `[x]` にした直後に中断 → 再開時に全手順 `[x]` → 二度と実行されず証跡が未Commitのまま事実と食い違う」であった。現在は手順14の行が存在しないため、再開判定は「手順1〜13がすべて `[x]`」であり必ず手順14へ入る。入った手順14はプロセス生成物の未Commit変更を見て、あればCommit・Pushする。前回の経路は閉じている。

**検証（§5の記録規則との両立）** — `:86` の先回り禁止・一括書き禁止は手順1〜13にのみ掛かり（`:82`, `:80`）、手順14はその適用外であることが明示された。どちらに従うべきか決定できない状態は解消している。

**検証（手順1のPreflightとの両立）** — 手順1のWorking Tree条件（`:48`）は開始時の1回だけの判定であり、手順14の判定（`:71`）は終了時のプロセス生成物のみの判定である。判定対象と時点が異なり、衝突しない。

**検証（手順9のSecurity確認との両立）** — `:70` が「変更してよいのは§5のプロセス生成物だけである。それ以外のFileに未Commitの変更があれば、Commitせず停止して人間に報告する。手順9のSecurity確認を通っていない内容を混ぜないためである」と、前回のFOLLOW_UP 2・3をまとめて塞いでいる。範囲も前回指摘した「`docs/` 配下だけ」から「§5のプロセス生成物だけ」へ狭まり、正本 `docs/init-mvp-spec.md` とVerdict Artifact `docs/code-review.md` を巻き込む読みが消えた。

**検証（前回FOLLOW_UP 4）** — `:72` が「Push を契機にDeployが再度走る場合がある」と機構の実態を認めた。前回の「Deploy済みの成果物を変えない」という事実に反する言い切りは撤回されている。

冪等性には残穴が1つある（Commit成功・Push失敗の窓。FOLLOW_UP 3）が、公開も証跡のローカル保全も止めないためBLOCKERとしない。

### B-1 — RESOLVED

`profiles/daily-local-app/PROFILE.md` が41行で復活し、`docs/init-mvp-spec.md:28`、`CLAUDE.md:32`、`README.md:68`、`.claude/commands/spec.md:24`、`.claude/agents/independent-spec-reviewer.md:21`、`.claude/agents/independent-code-reviewer.md:22`、`docs/init-mvp-spec.md:50`（Preflightの公開先）、同 `:56`・`:57`（手順3のVite baseとDeploy素材）のすべてに反映されている。3Profileを列挙する箇所（§2、CLAUDE.md、README.md）は3件とも3つを漏れなく挙げ、説明も一致する。

適用範囲の相互排他も成立している。`profiles/static-basic/PROFILE.md:7` と `:15` が永続を要する製品を `daily-local-app` へ、`profiles/daily-local-app/PROFILE.md:7` が永続不要を `static-basic` へ、秘密Keyを要するAIを `on-local-data-use-ai-app` へ送る。永続あり・AIなしの領域は `daily-local-app` が単独で受け持ち、重なりは無い。

前回指摘された「付随する内部矛盾」（`static-basic` のData節が永続追加を許すと読めた点）も解消した。`profiles/static-basic/PROFILE.md:15` は「**このProfileは永続Storageを使わない。** `localStorage`、`sessionStorage`、IndexedDB、Cookieのいずれも追加しない」と例外を残さない書き方になり、「明示的な製品判断なしに追加しない」という抜け道の文言は削除されている。

残る穴は「AIあり・永続なし」の領域だけで、これは選択不能ではなく過剰要求の問題であるためFOLLOW_UP 6として記録する。

### B-2 — RESOLVED

`docs/init-mvp-spec.md:53-58` に手順3（初期化）が新設され、`:56` がVite baseの設定（`static-basic` と `daily-local-app` は `/<repository_name>/`、`on-local-data-use-ai-app` は `/`）、`:57` がDeploy素材の配置（`.github/workflow-templates/deploy-pages.yml.template` → `.github/workflows/deploy-pages.yml`、`deploy-templates/vercel.json.template` → `vercel.json`）を担う。

順序も正しい。手順3は手順10のCommitと手順11のPushより前にあるため、生成物がCommit対象に入る。前回列挙された3つの破綻分岐（Workflow未作成のまま到達／作っても後続にCommit手順が無い／`docs/` 以外を証跡Commitに混ぜる）はいずれも成立しなくなった。`docs/init-mvp-spec.md:67` の手順12も「Vite baseとDeploy素材は手順3で配置済みである」へ書き換えられ、二重責務が消えている。

強制力もある。`.claude/agents/independent-code-reviewer.md:23` に「§4手順3の初期化が済んでいない。…Vite baseがProfileの規定と違う。Deploy素材が `.template` のままで所定のPathへ配置されていない」がBLOCKER条件として追加され、手順6の独立レビューが検出Gateになった。手順3自身にも「次を全部行い、終えるまで手順4へ進まない」（`:53`）という順序拘束がある。

到達不能・循環は無い。手順1のPagesのSource確認（`:50`）はRepository設定の確認であり、手順3が作るWorkflow Fileの存在に依存しない。手順3の発火条件は手順2の完了だけで、後続手順の完了に依存しない。手順3は複製・置換・設定のいずれも再実行可能で、中断後に手順3から再開しても同じ結果になる。

### B-3 — RESOLVED

`docs/init-mvp-spec.md:54` が「Template固有のPlaceholder（`__APP_NAME__`、`__APP_DESCRIPTION__` など）を§2の内容へ置き換える。`src/` と `index.html` に、Template自身の宣伝文・説明文・Placeholderを残さない」と責務を手順3へ明示的に割り当てた。`:58` の「Template固有の文字列を検索し、置き換え漏れが1件もないことを確認する」が漏れ検査を課す。

Gateの網も張り直された。`.claude/agents/independent-code-reviewer.md:23` がPlaceholder残存とTemplate宣伝文残存を名指しでBLOCKERにしており、前回「Gateの網に一切かからない」とされた状態は解消している。`index.html:6` のmeta description（Placeholderですらない説明文）も `:54` の「`index.html` に…説明文…を残さない」で対象に入る。前回のbaseline FOLLOW_UP 1（App Shell本文がTemplateの宣伝で、内容も古い）も同時に塞がれている。

なお `src/App.tsx:5,10,11` と `index.html:7` にPlaceholderが残っているのは正しい。Template配布物として残すべきものであり、置換は `/goal` 実行時に手順3が行う。ただしこの修正は `src/App.test.tsx` との衝突を新たに生む（FOLLOW_UP 1）。

### B-4 — RESOLVED

`.claude/commands/spec.md:24-25` が2行に分割され、正しい案内へ書き換わった。`:24` は「`static-basic` に利用者の記録を残す必要が出たら `daily-local-app`、秘密Keyを要するAI処理が必要になったら `on-local-data-use-ai-app` を検討させる」とProfile間の誘導を行い、`:25` は「Server Database、認証、複数ユーザー、Device間同期、共有Record、保証されたBackupが必要になった場合は、**どのProfileの範囲でもない**」と、Template対象外の範囲を3Profileのいずれもが除外する領域に限定した。

`profiles/on-local-data-use-ai-app/PROFILE.md:5`、`profiles/daily-local-app/PROFILE.md:5`、`docs/init-mvp-spec.md:29`、`CLAUDE.md:33` の記述と矛盾しない。Templateが支援する領域のアプリが入口で追い返される経路は消えている。

---

## 回帰の検査

前回「問題がなかった」と記録した項目を再検査し、修正で壊れたものが無いことを確認した。

- **手順番号・手順数の全数照合（12→13→14の2回の変更に対する追随）** — 全一致。`docs/init-mvp-spec.md:45-72`（§4は1..14）、`docs/init-mvp-spec.md:78`（「手順10と手順14でCommit」）、`:80`・`:82`・`:88`（手順1〜13、手順14、手順7、手順5と手順6）、`CLAUDE.md:14`（「手順1から14」）、`README.md:33`・`:35`（「14手順」）、`README.md:40-54`（1..14の一覧）、`README.md:46`（「手順5のGate結果」）、`.claude/commands/goal.md:24`（手順1〜13/手順14/手順7）、`:34`（§4手順6）、`:36`（§4手順5）、`:40`（§4手順7、手順5と手順6、手順6）、`.claude/agents/independent-code-reviewer.md:23`（§4手順3）、`:35`・`:39`（§4手順5）。旧番号（「13手順」「1から13」「手順4のGate結果」「手順6の周回数」など）の残存はTemplate本体に1件も無い（`docs/template-reviews/` 配下の過去の証跡を除く）。
- **`/spec` 独自の手順1〜6と§4の手順番号の混同** — 無い。`docs/init-mvp-spec.md:41` と `CLAUDE.md:7` の「§2を書くのは `/spec` の手順4だけ」はいずれも `/spec` を明示しており、`.claude/commands/spec.md:31` の手順4（§2の書き込み）と対応する。§4手順4（実装）と取り違える書き方にはなっていない。`.claude/commands/spec.md:18` の「正本§4手順1」も `/goal` 側を正しく指す。
- **循環・到達不能** — 無い。各手順の発火条件は先行手順の完了だけに依存する。手順3は手順2、手順14は手順1〜13。手順7の `[x]` 条件（`docs/init-mvp-spec.md:62`）はやり直した手順6の `APPROVED` に依存するが、手順6は手順7より前であり循環しない。BLOCKER修正周回で手順5・6を `[ ]` へ戻した場合も、再開の最小番号は5となり5→6→7と前進する。
- **手順3が再開ロジックを壊さないこと** — 壊さない。手順3は手順1〜13の一員として `[x]` 管理され、`:88` の「`[x]` になっていない最小番号」の対象に含まれる。中断して手順3から再開しても、置換・複製・設定はいずれも再実行可能で結果が変わらない。
- **手順1のPreflightと手順3の関係** — 破綻しない。Preflightは開始時の1回だけの判定であり、手順3以降が作る未Commit変更を後から違反にしない。
- **不変条件** — いずれも崩れていない。正本の§2以外をAIが書き換えない（`docs/init-mvp-spec.md:41`、`CLAUDE.md:7`。手順3が触るのは `src/`・`index.html`・`package.json`・`vite.config.ts`・`.github/workflows/`・`vercel.json` であり正本に含まれない）／§1のCONFIRMEDは人間だけ（`:15`、`.claude/commands/spec.md:38`）／独立レビューは別Subagent Context（`.claude/commands/goal.md:34`）／Verdict不可侵（同 `:38`）／BLOCKER修正は最大2周（`docs/init-mvp-spec.md:62`、`.claude/commands/goal.md:40`）／プロセス生成物は `.gitignore` に無い（`.gitignore:1-6` は `node_modules/` `dist/` `coverage/` `*.local` `.DS_Store` `*.log` のみ）。
- **Profile 3つ体制の記述の一致** — 3つのPROFILE.md、§2（`:26-29`）、`CLAUDE.md:31-33`、`README.md:67-69`、`.claude/commands/spec.md:24`、両Reviewer（`independent-spec-reviewer.md:21,24`、`independent-code-reviewer.md:22`）で公開先・永続・秘密Keyの記述が一致する。

---

## BLOCKER

無し。

---

## FOLLOW_UP

### FOLLOW_UP 1 — 手順3が消すべきTemplate説明文に、`src/App.test.tsx` が直接依存している（最優先）

**Evidence**

- `docs/init-mvp-spec.md:54` — 「`src/` と `index.html` に、Template自身の宣伝文・説明文・Placeholderを残さない」
- `src/App.tsx:22-29` — `<section id="first-step">` の見出し「Start with the requirement input」と本文「Settle `docs/init-mvp-spec.md` with Claude Code, set its status to `CONFIRMED`, then ask Claude Code to read the file and implement it.」。Template自身の説明文であり、内容も `/goal` 復活前の古い手順である
- `src/App.tsx:17-19` — そのSectionへ飛ぶ `<a className="primary-action" href="#first-step">View the first step</a>`
- `src/App.test.tsx:30` — `expect(screen.getByRole('link', { name: 'View the first step' })).toHaveFocus()`。Template固有の文言をTest側がHard-codeしている
- `src/App.test.tsx:7-9` — 「It must stay independent of the placeholder values … and pass both before and after the placeholders are replaced」。Placeholder置換だけを想定した契約であり、Section削除は想定していない
- `docs/init-mvp-spec.md:60` — 手順5「Testの削除・skip・Gate緩和で通さない」
- `.claude/agents/independent-code-reviewer.md:20` — 「Testが削除、skip、緩和されている」がBLOCKER条件
- `.claude/agents/independent-code-reviewer.md:23` — 「Template自身の宣伝文が残っている」がBLOCKER条件

手順3に従って `#first-step` Sectionと `View the first step` リンクを取り除くと、`src/App.test.tsx` の2つ目の `it` は必ず落ちる。逆に残せば `:23` に抵触する。どちらの分岐にも独立レビュアーのBLOCKER条件が対応しており、この衝突をどう解くかを述べたFileは1つも無い。

BLOCKERとしない理由は、手順5の禁止が「Testの削除・skip・Gate緩和で**通さない**」と目的で限定されており、Template固有のShell Testを§2の受け入れ条件とProfileの必須Test（`profiles/*/PROFILE.md` の「必須Test」節）に対応するTestへ置き換える行為は「通すための削除・緩和」に当たらない、と決定できるためである。判断は可能であり公開は止まらない。ただしこの決定を毎回実装Contextと独立レビュアーの解釈に委ねており、解釈が割れれば手順7で2周を空費して停止する。手順3に「Template固有のTest（`src/App.test.tsx`）は、§2の受け入れ条件と選択したProfileの必須Testに対応するTestへ置き換える」という1文を置き、`independent-code-reviewer.md:20` にその例外を書けば消える。

### FOLLOW_UP 2 — `README.md:54` が、手順14を「記録を書く手順」として説明し続けている

**Evidence**

- `README.md:54` — 「14. 証跡の確定　　　手順10〜13の結果をgoal-progress.mdへ書きCommit・Push」
- `docs/init-mvp-spec.md:69` — 「手順13までの記録を**書き終えたうえで**、§5のプロセス生成物に未Commitの変更が残っていればCommitしてPushする」
- `docs/init-mvp-spec.md:86` — 「記録は1手順ずつ、その手順を終えた直後に書く。複数の手順の結果をまとめて1回で書かない」

C-1の修正の要は「手順14は書かない、既に書かれたものを閉じるだけ」という点にある。`README.md` はそこだけ旧設計（手順10〜13の結果を手順14でまとめて書く）のまま残っており、これは `:86` が明示的に禁じた一括書きそのものである。前回のFOLLOW_UP 9が「BLOCKER 1を解消する際に文面が変わるので、そのとき合わせて追随させること」と述べた箇所で、追随されていない。`README.md:37` が「§4が正本です」と明記しているため従うべき側は決定でき、BLOCKERとしない。「手順13までに書かれた記録をCommit・Push」とすれば一致する。

### FOLLOW_UP 3 — 手順14の完了判定がWorking Treeだけを見るため、Commit成功・Push失敗の窓で証跡がPushされないまま完了扱いになる

**Evidence**

- `docs/init-mvp-spec.md:71` — 「完了は、プロセス生成物に未Commitの変更が残っていないことで判定する。何度実行しても同じ結果になる」
- `docs/init-mvp-spec.md:80` — 同旨（§5側の再掲）
- `docs/init-mvp-spec.md:69` — 手順14の構成要素は「Commitして**Push**する」

手順14がCommitに成功した直後、Push前に中断した場合（認証切れ、Network、Context切れ）、Working Treeにはプロセス生成物の未Commit変更が残らない。再開すると `:71` の判定基準により手順14は完了と判定され、Pushは二度と行われない。証跡Commitはローカルに残るがRemoteへ届かない。「何度実行しても同じ結果になる」という冪等性の主張も、この窓では成立しない（1回目の意図した結果はPush済み、2回目の結果は無操作）。

公開は手順11のPushと手順12のDeployで既に済んでおり、証跡もローカルには存在するためBLOCKERとしない。完了判定に「かつ現在のBranchがupstreamより先行していないこと」を加えれば閉じる。

### FOLLOW_UP 4 — 手順14の停止条件が手順1の除外規則より厳しく、`docs/init-mvp-spec.md` と `.vercel/` で最終手順が停止しうる

**Evidence**

- `docs/init-mvp-spec.md:48` — 手順1は「`docs/init-mvp-spec.md` と§5のプロセス生成物を除いた未Commitの変更がないこと」。正本の未Commit変更を明示的に許容している
- `docs/init-mvp-spec.md:70` — 手順14は「変更してよいのは§5のプロセス生成物だけである。それ以外のFileに未Commitの変更があれば、Commitせず停止して人間に報告する」。`docs/init-mvp-spec.md` に対する除外が無い
- `docs/init-mvp-spec.md:65` — 手順10は「レビューを通った内容と、§5のプロセス生成物をCommitする」
- `.gitignore:1-6` — `.vercel/` と `.env` 系が無い
- `docs/init-mvp-spec.md:50` — 手順1がVercelの認証を要求しており、`vercel` CLIの利用が前提になる。`vercel link` / `vercel deploy` は `.vercel/project.json` を生成する

`/spec` は§2を書くだけでCommitしないため、手順1の時点で `docs/init-mvp-spec.md` が未Commitであることは想定内である（`:48` がそれを許容している）。それが手順10で確実にCommitされるかは「レビューを通った内容」の解釈次第で、手順6へ渡すDiff全文に含まれる以上は含まれると読めるものの明示は無い。含まれなかった場合、手順14は最終手順で停止する。`on-local-data-use-ai-app` では手順12のDeployが生む未追跡の `.vercel/` が同じ停止を引き起こす。

いずれも手順13の本番確認を終えた後の停止であり、公開そのものは止まらない。手順14の除外リストを手順1と揃え、`.gitignore` へ `.env`、`.env.*`、`.vercel/` を追加すれば消える（`.gitignore` は前回のbaseline FOLLOW_UP 3で既に指摘済み、未対応）。

### FOLLOW_UP 5 — 手順3が `.github/workflows/` へFileを追加するが、Preflightが `gh` Tokenの `workflow` Scopeを確認しない

**Evidence**

- `docs/init-mvp-spec.md:57` — 手順3が `.github/workflows/deploy-pages.yml` を作る
- `docs/init-mvp-spec.md:46-47` — 手順1の確認は `gh auth status` が認証済みであることまで
- `docs/init-mvp-spec.md:66` — 手順11でPushする

`.github/workflows/` 配下のFileのPushは、Tokenに `workflow` Scopeが無いとRemote側で拒否される。Scopeが欠けている場合、失敗するのは手順11であり、Preflightで検出できない。手順3の新設によって初めて生じた依存である。`gh auth status` は付与Scopeを表示するため、手順1の確認項目に1行加えるだけで前倒し検出できる。

### FOLLOW_UP 6 — 「AIあり・永続なし」のアプリが、不要な永続の仕様化を強制される

**Evidence**

- `docs/init-mvp-spec.md:29` — 「`on-local-data-use-ai-app` — Vercel。**ローカル永続に加え**、秘密Keyを要するAI呼び出しをServer API経由で行う」
- `profiles/on-local-data-use-ai-app/PROFILE.md:13` — 「要求入力…で確定する仕様の中で、Storage機構を**ちょうど1つ決める**」
- `profiles/static-basic/PROFILE.md:5,21` / `profiles/daily-local-app/PROFILE.md:5,29` — いずれも秘密API Keyを扱わないと明言
- `.claude/agents/independent-spec-reviewer.md:23` — 「永続保存を持つProfileなのに、Storage機構、Schema Version、読み取り時のValidation、壊れたDataからの復旧、読み書き失敗時の挙動のいずれかが決まっていない」がBLOCKER条件
- `docs/init-mvp-spec.md:36` — 「§2にない機能を追加しない。迷ったら作らない」

秘密Keyを要するAIを使うが記録を残さないアプリ（1回きりの要約・変換など、24時間MVPとして現実的な形）は、`static-basic` と `daily-local-app` が秘密Keyで除外するため `on-local-data-use-ai-app` しか選べない。`profiles/on-local-data-use-ai-app/PROFILE.md:5` の適用範囲（「実行時Dataを利用者のBrowser内に保持し」）は一時Stateも含む読みが可能なので**選択自体は成立する**が、同 `:13` がStorage機構の決定を義務づけ、`independent-spec-reviewer.md:23` がそれを欠く仕様をBLOCKERにする。結果として、必要のない永続を仕様へ書き足さないと `/spec` を通過できない。

「どのProfileも選べない」状態ではなく、選んだ後に過剰な要求を受ける状態であるためBLOCKERとしない。前回のB-1（真に選択不能だった穴）とは性質が異なる。`profiles/on-local-data-use-ai-app/PROFILE.md:13` に「永続が不要な場合はStorage機構を持たないと明記する」旨の逃げ道を1行置き、`independent-spec-reviewer.md:23` の条件を「永続保存を持つと仕様が定めたのに」へ限定すれば消える。§2 `:29` の「ローカル永続に加え」も同時に緩める必要がある。

### FOLLOW_UP 7 — Branch運用が未定義のまま、手順3がmain限定のWorkflowを設置する

**Evidence**

- `docs/init-mvp-spec.md:45` — 手順1は「1つでも満たさない場合は、**Branch**・Commitを作らず」とBranchを作る前提で書かれている
- `docs/init-mvp-spec.md:53-68` — 手順3〜13にBranchを作る手順も、どのBranchで作業するかの指定も無い
- `.github/workflow-templates/deploy-pages.yml.template:3-6` — `on: push: branches: [main]` と `workflow_dispatch`

前回のbaseline FOLLOW_UP 6と同じ指摘だが、手順3がWorkflowを実際に設置するようになったことで影響が具体化した。Feature Branchで作業した場合、手順11のPushではWorkflowが発火せず、手順12「Profileの既定方式でDeploy」の実体が `workflow_dispatch` の手動起動になるが、そのことはどこにも書かれていない。mainで作業する読みが既定であればそのまま動くため、必ず詰まるとは言えない。§4に作業Branchを1行で定めれば解消する。

### FOLLOW_UP 8 — 手順12のDeployは、多くの場合すでに手順11のPushで発火している

**Evidence**

- `docs/init-mvp-spec.md:66-67` — 手順11でPush、手順12でDeploy
- `.github/workflow-templates/deploy-pages.yml.template:4-5` — `push: branches: [main]`
- `docs/init-mvp-spec.md:50` — 手順1がVercelの認証と環境変数の事前設定を要求しており、Vercel側にProjectが存在する前提である

GitHub PagesもVercelも、手順11のPushで自動的にDeployが走る。手順12は独立した起動ではなく、実質「Deployの完了待ちと確認」になる。`docs/init-mvp-spec.md:72` は手順14のPushによる再Deployには言及したが、手順11によるDeployには触れていない。手順12を「Deployの完了を待って確認する。GitHub PagesとVercelはいずれも手順11のPushで発火する」と実態に合わせると、手順13の待ち時間の扱いも明確になる。

### FOLLOW_UP 9 — 前回のFOLLOW_UPで未対応のまま残っているもの

BLOCKER修正が優先されたため、次は前回指摘の状態から変わっていない。いずれも単独では公開を止めない。

- `docs/goal-progress.md` の完了日時にTimezone表記が義務づけられていない（`docs/init-mvp-spec.md:84`、`.claude/commands/goal.md:30`。§2のDeadlineは `:30` でTimezone必須になったのに、記録側は実測値であることしか求めない）— 前回 consistency FOLLOW_UP 6
- `/spec` 手順5のやり直し経路が手順3・手順4を明示的に含まない（`.claude/commands/spec.md:34` の「手順2へ戻して直し、手順5をやり直す」。手順3が `:28` で「終えるまで手順4へ進まない」という絶対条件を持つため、やり直し時の再入点がなお不明確）— 前回 consistency FOLLOW_UP 8
- `CLAUDE.md:25` のGate列挙が正本より狭い（`npm ci` と `git diff --check`（`docs/init-mvp-spec.md:60`）、および手順3の初期化が入っていない）— 前回 baseline FOLLOW_UP 8
- `.devcontainer/devcontainer.json:13-15` の `TZ: Asia/Tokyo` 固定と、`:7` の `docker-outside-of-docker` feature — 前回 consistency FOLLOW_UP 7 / baseline FOLLOW_UP 7
- Mobile幅の基準が375px（`docs/init-mvp-spec.md:63`、`.claude/agents/independent-code-reviewer.md:24`）と320px（`profiles/static-basic/PROFILE.md:29`、`profiles/daily-local-app/PROFILE.md:37`）で不統一。`profiles/on-local-data-use-ai-app/PROFILE.md:29` には画面幅の必須Testが無い — 前回 baseline FOLLOW_UP 5
- `package.json:4` の `"version": "1.0.0"` がTemplateのまま（`name` は手順3 `:55` が引き取ったが `version` は無主）— 前回 baseline FOLLOW_UP 2
- `docs/template-reviews/` の証跡が新Repositoryへ継承される（`README.md:65` に説明あり）— 前回 baseline FOLLOW_UP 4

### FOLLOW_UP 10 — 手順3の細部で拾い漏れている箇所

**Evidence**

- `index.html:2` — `<html lang="en">`。手順3 `:54` の対象は「宣伝文・説明文・Placeholder」であり、言語属性は含まれない。運用Documentも想定利用者も日本語である
- `docs/init-mvp-spec.md:57` — 「複製する」であり、複製元の `.template` を削除しない。選ばなかった側のDeploy素材（Pages Profileなら `deploy-templates/vercel.json.template`）も利用者のRepositoryに残り続ける
- `profiles/static-basic/PROFILE.md:11`、`profiles/daily-local-app/PROFILE.md:11`、`profiles/on-local-data-use-ai-app/PROFILE.md:9` — いずれも「TemplateのApp Shellを維持する」。手順3 `:54` の「Template自身の宣伝文・説明文…を残さない」と字面が衝突する。「App Shell」が構造（landmark、header/main/footer）を指し文言を指さないことは文脈から読めるが、明示されていない
- `profiles/on-local-data-use-ai-app/PROFILE.md` — 他の2Profileが持つ相互誘導（`static-basic/PROFILE.md:7`、`daily-local-app/PROFILE.md:7`）に相当する記述が無く、AIが不要になった場合の戻り先が書かれていない

いずれも公開を止めない。手順3に言語属性と未使用Deploy素材の扱いを1行ずつ足し、PROFILE.mdの「App Shellを維持する」を「App Shellの構造（landmarkと基本Layout）を維持する」と限定すれば消える。
