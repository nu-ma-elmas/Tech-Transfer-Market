# 独立解決レビュー（最終周）

- Verdict: APPROVED
- New blocker resolved: YES
- Regressions: 0
- New blockers: 0
- Ready to merge: YES

## Evidence

- 対象Branch: `feat/lightweight-goal-commands` / Base: `feat/lightweight-goal`
- 判定に用いたDiff: `git diff feat/lightweight-goal`（Commit済み＋未Commitの両方）。修正の実体は `git diff HEAD` にあり、`.claude/commands/goal.md` と `docs/init-mvp-spec.md` の2Fileのみである
- `.claude/agents/independent-code-reviewer.md`、`.claude/agents/independent-spec-reviewer.md`、`.claude/commands/spec.md`、`CLAUDE.md`、`README.md`、`.gitignore` は今回も触られていない
- 与えられたGate結果（再実行していない）: `lint` PASS / `test` PASS (2 tests) / `build` PASS / `git diff --check` clean
- 本Reviewで作成したFileは `docs/final-review.md` 1件のみである。`docs/code-review.md` と `docs/resolution-review.md` を含め、他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない

### 今回の修正の実体

`docs/resolution-review.md` が引用した時点の本文と現在の本文を比較すると、行番号（`init-mvp-spec.md` の 52 / 64 / 66 / 68、`goal.md` の 24 / 36）はいずれも一致しており、行の増減を伴わない文の追記だけが行われている。追記されたのは次の2点である。

- `docs/init-mvp-spec.md:52` / `.claude/commands/goal.md:36` — 「手順6自身は、やり直した手順5が `APPROVED` になった時点で `[x]` にする。それまで `[x]` にしない。」
- `docs/init-mvp-spec.md:66` — 「実行の必要がなかった手順も `[x]` にし、`NOT_RUN` と理由を書く。`PASS` とは書かない。」

前者が新規BLOCKER 1への直接の対処であり、後者はそれによって生じる「手順6が一度も実行されない場合に `[x]` にならない」穴を埋める規則である。`docs/resolution-review.md:107` が「どちらの読みを採るかは正本にもCommandにも書かれていない」と指摘した曖昧さは、安全側の読み（`APPROVED` になるまで `[x]` にしない）を正本とCommandの両方へ明文化することで解消されている。

---

## 新規BLOCKER 1: RESOLVED

**File Evidence**

- `docs/init-mvp-spec.md:52` — 「6. **BLOCKER修正** — `BLOCKED` なら指摘箇所だけ修正し、手順4と5をやり直す。やり直しに入る前に、`docs/goal-progress.md` の手順4と手順5を `[ ]` へ戻し、周回数を1増やして記録する。この記録より先に修正を始めない。**手順6自身は、やり直した手順5が `APPROVED` になった時点で `[x]` にする。それまで `[x]` にしない。** やり直しは最大2周までとする。2周を終えてもなお `BLOCKED` の場合は、修正を続けず停止して人間に判断を求める。」
- `.claude/commands/goal.md:36` — 「§4手順6のやり直しに入る前に、`docs/goal-progress.md` の手順4と手順5を `[ ]` へ戻し、周回数を1増やして記録する。この記録より先に修正を始めない。**手順6自身は、やり直した手順5が `APPROVED` になった時点で `[x]` にする。それまで `[x]` にしない。** やり直しは最大2周までである。」
- `docs/init-mvp-spec.md:66` — 「§4の各手順を終えるたびに、その手順の行を `[x]` にし、完了日時と根拠を1行で書く。停止した場合は `[ ]` のまま理由を書く。実行の必要がなかった手順も `[x]` にし、`NOT_RUN` と理由を書く。`PASS` とは書かない。手順6の周回数は、手順4と手順5を `[ ]` へ戻すのと同時に記録する。」
- `docs/init-mvp-spec.md:68` / `.claude/commands/goal.md:24` — 「`[x]` になっていない最小番号の手順から再開する。完了済みの手順をやり直さない。手順6の周回数も読み戻し、2周を超えて繰り返さない。」

前回の新規BLOCKER 1は、「手順6を `[x]` にしてから手順4へ戻る」読みが許されていたため、2周目の `BLOCKED` が中断・再開をまたいで破棄されることだった。現在は手順6の `[x]` の条件が「やり直した手順5が `APPROVED`」の1点に固定され、それ以外の時点での `[x]` を明示的に禁じている。したがって未処理の `BLOCKED` が存在する限り手順6は必ず `[ ]` であり、再開時の未Check最小番号は手順7以降にならない。

手順6の `[x]` が「手順5の `APPROVED`」に従属したことで、進捗Fileの状態そのものが「独立レビューを通っていない変更は手順7へ進めない」というInvariantを表すようになった。文面上の追記1文だが、規則としての効果は状態機械の遷移条件の変更であり、判定に必要な情報はすべて `docs/goal-progress.md` 内（手順5の `[x]` と根拠に記録されたVerdict、および周回数）に存在する。

---

## 状態遷移の追跡

適用される規則は次の4つである。以下の全経路で同じ規則集合を用いた。

- R1（進行）`docs/init-mvp-spec.md:68` / `.claude/commands/goal.md:24` — 未Checkの最小番号から再開し、完了済みはやり直さない。周回数を読み戻す
- R2（完了記録）`docs/init-mvp-spec.md:66` — 終えた手順は `[x]`、停止は `[ ]` のまま理由、実行の必要がなかった手順は `[x]` + `NOT_RUN`
- R3（手順6の `[x]` 条件）`docs/init-mvp-spec.md:52` / `.claude/commands/goal.md:36` — やり直した手順5が `APPROVED` になった時点でのみ `[x]`
- R4（やり直し前の巻き戻し）同上 — 修正着手より前に手順4と手順5を `[ ]` へ戻し、周回数を1増やして記録する

### 経路A: 手順5が初回で `APPROVED`（手順6は一度も実行されない）

判定: **通る。手順6は `[x]`（`NOT_RUN`）になり、無限停止は生じない。**

追跡:

1. 手順4 `[x]`、手順5 `[x]`（根拠に `APPROVED`）。
2. R1により次は手順6。`docs/init-mvp-spec.md:52` の手順6は冒頭が「`BLOCKED` なら指摘箇所だけ修正し」であり、本体全体が `BLOCKED` を前件とする。`APPROVED` のため実行対象がない。
3. R2の「実行の必要がなかった手順も `[x]` にし、`NOT_RUN` と理由を書く」（`docs/init-mvp-spec.md:66`）が直接適用され、手順6は `[x]` + `NOT_RUN`。
4. R1により手順7へ進む。Testも独立レビューも実行済みであり、飛ばしていない。

R3の「それまで `[x]` にしない」を前件から切り離して絶対規則と読んだ場合でも、恒久的な停止は生じない。その読みでは手順6が `[ ]` のまま残るが、再開時にR1が選ぶのは手順6であり、そこで手順5が `APPROVED` であることを再確認し、R2の `NOT_RUN` 規則が `[x]` を与えて抜けられる。どちらの読みでも終端は同じであり、この経路で手順9以降へ到達するには手順4・手順5がともに `[x]` かつ `APPROVED` であることが必要という条件は変わらない。

なお、R2の `NOT_RUN` 規則だけがあってR3がない状態であれば、`BLOCKED` のときに「修正しないことにしたので `NOT_RUN`」と書いて手順6を `[x]` にする抜け道が開く。R3の「それまで `[x]` にしない」はその抜け道を塞ぐ側に働いており、2つの規則は競合ではなく相補の関係にある。

### 経路B: 1周目 `BLOCKED` → 修正中に中断 → 再開

判定: **手順4から再開する。Testと独立レビューを飛ばさない。**

追跡:

1. 手順4 `[x]`、手順5 `[x]`（根拠に `BLOCKED`）。R1により手順6へ。
2. R4により、修正着手より前に手順4と手順5を `[ ]` へ戻し、周回数=1を記録する（`docs/init-mvp-spec.md:52`「この記録より先に修正を始めない」、`docs/init-mvp-spec.md:66`「手順6の周回数は、手順4と手順5を `[ ]` へ戻すのと同時に記録する」）。
3. R3により手順6は `[ ]` のまま。修正中に中断。
4. 進捗Fileの状態: 手順1〜3 `[x]`、手順4 `[ ]`、手順5 `[ ]`、手順6 `[ ]`、周回数=1。
5. 再開時、R1の未Check最小番号は**手順4**。よって再Test → 手順5の再レビューへ必ず入る。周回数はR1により1として読み戻される。
6. 手順6を経由せずに手順4へ戻るため、周回数が同一周で二重に加算されることもない。

修正が未完了の状態で手順4へ戻るため、手順5の再レビューが同じBLOCKERを再度検出しうる。その場合はR4により周回数=2となり、以降は経路Cと同じ終端に合流する。Gateを飛ばす方向ではなく、余分に1周を消費する安全側の挙動である。

### 経路C: 1周目 `BLOCKED` → 修正 → 2周目の手順5も `BLOCKED` → 中断 → 再開

判定: **手順6から再開する。2周目の `BLOCKED` は破棄されない。2周上限に到達すれば人間へ停止する。**

追跡:

1. 1周目 `BLOCKED` → R4で手順4・手順5を `[ ]`、周回数=1を記録 → 修正 → R3により手順6は `[ ]` のまま。
2. やり直しで手順4 `[x]`、手順5 `[x]`（根拠に `BLOCKED`）。**ここで中断。**
3. 進捗Fileの状態: 手順4 `[x]`、手順5 `[x]`、**手順6 `[ ]`**、手順7 `[ ]`、周回数=1。
4. 再開時、R1の未Check最小番号は**手順6**であり、手順7ではない。前回の新規BLOCKER 1で問題になった「未Check最小番号が手順7になり、2周目の `BLOCKED` が誰にも処理されない」状態は、手順6が `[x]` にならないことによって発生しない。
5. 手順6は周回数=1を読み戻す。上限（`docs/init-mvp-spec.md:52`「やり直しは最大2周までとする」）に未達のため、R4で手順4・手順5を `[ ]` へ戻し周回数=2を記録して2回目のやり直しへ入る。
6. 再々Test → 再々レビューが `APPROVED` ならR3により手順6 `[x]`、手順7へ。なお `BLOCKED` なら、周回数=2であり「2周を終えてもなお `BLOCKED` の場合は、修正を続けず停止して人間に判断を求める」に該当し、手順6は `[ ]` のままR2に従って理由が記録される。手順7以降へは進まない。
7. 手順6が `[ ]` である限り、R1は決して手順7以降を選ばない。すなわち、`BLOCKED` を抱えたまま手順9 Commit・手順10 Push・手順11 Deployへ到達する経路は存在しない。

### 経路D: 2周目の手順5が `APPROVED`

判定: **手順6は `[x]` になり、手順7へ進む。**

追跡:

1. やり直し後の手順4 `[x]`、手順5 `[x]`（根拠に `APPROVED`）。
2. R3（`docs/init-mvp-spec.md:52`「手順6自身は、やり直した手順5が `APPROVED` になった時点で `[x]` にする」）が正面から適用され、手順6は `[x]`。周回数の記録は残るが、R1の「2周を超えて繰り返さない」は以後のやり直しを禁じるだけであり、進行を妨げない。
3. R1により手順7 Mobile確認、手順8 Security確認、手順9 Commitへ進む。到達時点で手順4のTest Gateと手順5の独立レビューはいずれも当該修正後のCodeに対して実行済みであり、Verdictは `APPROVED` である。
4. 手順5の `APPROVED` 直後に中断した場合も、R1の未Check最小番号は手順6であり、そこで手順5の `APPROVED` を確認して `[x]` にしてから手順7へ進む。中断位置による差は生じない。

### 経路の総括

手順7以降へ進む条件は、全経路で「手順6が `[x]`」に一本化されており、手順6が `[x]` になる条件は「手順5が `APPROVED`」（経路D）または「手順5が初回 `APPROVED` で手順6が不要」（経路A）の2つだけである。`BLOCKED` が未処理のまま手順9 Commit以降へ到達する経路は見つからなかった。恒久的に進めなくなる経路も見つからなかった。

---

## 回帰確認（1回目のBLOCKER 5件）

いずれも `docs/resolution-review.md` が `RESOLVED` と判定した根拠の文面が、現在の本文にそのまま残存している。今回の修正は `docs/init-mvp-spec.md:52,66` と `.claude/commands/goal.md:36` への追記のみであり、5件の解決文面に対する削除・後退はない。**回帰0件。**

- BLOCKER 1（`/spec` の§2書き込み禁止との矛盾）: 現存。`docs/init-mvp-spec.md:38` —「- このFileの§2以外をAIが書き換えない。§2を書くのは `/spec` の手順4だけである」。`docs/init-mvp-spec.md:62` —「§3のとおりAIは `docs/init-mvp-spec.md` の§2以外を書き換えないので」。`.claude/commands/spec.md:27` —「§1と§3以降は書き換えない。」と範囲が一致
- BLOCKER 2（`/spec` → `/goal` の動線がPreflightで確定的に停止）: 現存。`docs/init-mvp-spec.md:45` —「- Working Treeに、`docs/init-mvp-spec.md` と§5のプロセス生成物を除いた未Commitの変更がないこと」。参照先の定義は `docs/init-mvp-spec.md:64` に実在
- BLOCKER 3（やり直しと「完了済みをやり直さない」の矛盾）: 現存かつ強化。`docs/init-mvp-spec.md:52` / `.claude/commands/goal.md:36` の巻き戻し指示と「この記録より先に修正を始めない」、`docs/init-mvp-spec.md:66` の周回数記録タイミング、`docs/init-mvp-spec.md:68` / `.claude/commands/goal.md:24` の読み戻しがすべて残存。今回の追記は手順6自身の `[x]` 条件を加えたものであり、巻き戻し規則を弱めていない
- BLOCKER 4（Preflight失敗時のFile作成禁止と停止理由記録の両立不能）: 現存。`docs/init-mvp-spec.md:42` —「Branch・Commitを作らず、`docs/goal-progress.md` 以外のFileも作らず停止し」。`docs/init-mvp-spec.md:45` の除外集合に `docs/goal-progress.md` が含まれるため、再実行時に自らPreflightを落とす経路も再発していない
- BLOCKER 5（Reviewerへの入力受け渡し指示の不在）: 現存。`docs/init-mvp-spec.md:51` —「変更Diffの全文と手順4のGate結果を渡してレビューさせ」。`.claude/commands/goal.md:32` —「起動時に、変更Diffの全文と§4手順4のGate結果をPromptで渡す。（中略）渡すDiffを要約、抜粋、選別しない。」。受け側 `.claude/agents/independent-code-reviewer.md:4,34,38`（`tools: Read, Grep, Glob, Write`／「§4手順4のGate結果はあなたに与えられる。」／「`/goal` が渡す変更Diffと§4手順4のGate結果」）は今回のDiffで未変更であり、契約は一致したままである

## 新たな欠陥の確認

今回の追記が新たに生む欠陥は検出されなかった。**新規BLOCKER 0件。**

- 追記されたR3は手順6の `[x]` 条件を**狭める**方向のみに働く。Gateを緩める方向の変更はない
- 追記されたR2の `NOT_RUN` 条項は経路Aの `[x]` を与えるが、`BLOCKED` が残っている状態への適用はR3が明示的に禁じており、`BLOCKED` を `NOT_RUN` として処理する抜け道は開いていない
- 周回数の記録・読み戻しの規則（`docs/init-mvp-spec.md:66,68`）は変更されておらず、経路B・経路Cのいずれでも二重加算・未加算は生じない

## 観察（BLOCKERではない）

以下は今回の判定を変えるものではない。修正を求めるものでもなく、記録のために残す。

- `docs/init-mvp-spec.md:52` の「それまで `[x]` にしない」は、文の冒頭にある「`BLOCKED` なら」の前件の内側にあると読むのが自然だが、その旨は明示されていない。前件から切り離して読んでも経路Aは `docs/init-mvp-spec.md:66` の `NOT_RUN` 規則で抜けられるため停止は生じないが、手順6の行に `NOT_RUN` と `[x]` の関係が1文で書かれていれば読み手の解釈に委ねる部分はなくなる。
- 2周を終えてもなお `BLOCKED` で人間へ停止したあと、人間が§2を直して `/goal` を再実行した場合、進捗Fileは手順3 `[x]`・手順6 `[ ]`・周回数=2のままである。再開はR1により手順6を選び、上限到達により再び停止する。人間の判断後にワークフローをどう再開するか（進捗Fileの周回数や手順3のReset）は正本にもCommandにも定義されていない。ただしこれは今回の修正が作った状態ではなく、修正前も同一であり、かつ人間が明示的に呼ばれている地点での話であるため、回帰にも新規BLOCKERにも数えない。
- `docs/resolution-review.md:124-125` の観察2件（`CLAUDE.md:7` の第1文が `docs/init-mvp-spec.md:38` より広い言い切りである点、手順9のCommitに手順9〜12の進捗追記が含まれない点）は、今回のDiffでも未変更のまま残っている。前回と同じくワークフローの停止や誤進行を招かないため、BLOCKERとしない。
- 前回までのFOLLOW_UP 7件は今回も未対応であり、BLOCKER修正の規律として正しい。`.claude/agents/*`、`.claude/commands/spec.md`、`CLAUDE.md`、`README.md`、`.gitignore` はいずれも今回のDiffで触られていない。プロセス生成物の追跡・Commit方針は人間が承認済みの方針であり、規律違反として扱わない。

---

Verdictは本Fileに記載したとおりである。受け取る側は、上書き、再解釈、格下げ、要約による消去のいずれも行ってはならない。
