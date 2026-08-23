# 独立解決レビュー

- Verdict: BLOCKED
- Resolved: 5 / 5
- New blockers: 1
- Ready to merge: NO

## Evidence

- 対象Branch: `feat/lightweight-goal-commands` / Base: `feat/lightweight-goal`
- 判定に用いたDiff: `git diff feat/lightweight-goal`（Commit済み＋未Commitの両方）
- BLOCKER修正の実体（`git diff HEAD`）: `.claude/commands/goal.md` と `docs/init-mvp-spec.md` の2Fileのみ。`.claude/agents/*`、`.claude/commands/spec.md`、`CLAUDE.md`、`README.md`、`.gitignore` は今回の修正で触られていない
- 与えられたGate結果（再実行していない）: `lint` PASS / `test` PASS (2 tests) / `build` PASS / `git diff --check` clean
- 本Reviewで作成したFileは `docs/resolution-review.md` 1件のみである。`docs/code-review.md` を含め、他のPathを作成・変更・削除・改名していない。指摘の修正も行っていない

---

## BLOCKER 1: RESOLVED

§3の禁止条項が「§2以外」へ限定され、`/spec` 手順4に対する例外が正本側に明示された。

**File Evidence**

- `docs/init-mvp-spec.md:38` — 「- このFileの§2以外をAIが書き換えない。§2を書くのは `/spec` の手順4だけである」（旧「- このFileをAIが書き換えない」から変更）
- `docs/init-mvp-spec.md:62` — 「§3のとおりAIは `docs/init-mvp-spec.md` の§2以外を書き換えないので、進捗はこのFileへ書く」（§3の無例外前提としての引用が解消）
- `.claude/commands/spec.md:27` — 「4. **§2の書き込み** — 確定した内容を `docs/init-mvp-spec.md` §2へ書く。§1と§3以降は書き換えない。」— §3が許した範囲と、`/spec` が書く範囲が一致する
- `.claude/commands/goal.md:18` — 「`$ARGUMENTS` は人間が確定した入力である。**書き換えない。**」— `/goal` 側は書き換え主体に含まれず、§3:38の「§2を書くのは `/spec` の手順4だけ」と衝突しない

§3を読んだ実装Contextが `/spec` 手順4を拒否する経路は消えた。`CLAUDE.md:7` は「AIはこのFileを書き換えない。§2を書くのは `/spec` だけであり、§1を `CONFIRMED` にするのは人間だけである。」のまま未変更で、第1文が§3:38より広い言い切りになっている。ただし直後の第2文が §2の書き手を `/spec` と名指ししており、これは§3:38が新設した例外そのものである。`/spec` の実行を妨げないため、BLOCKERとしては扱わない（下記「観察」に記す）。

## BLOCKER 2: RESOLVED

Preflightのクリーン条件から、`/spec` が必然的に残す差分が除外された。`CLAUDE.md` の動線が実行可能になった。

**File Evidence**

- `docs/init-mvp-spec.md:45` — 「- Working Treeに、`docs/init-mvp-spec.md` と§5のプロセス生成物を除いた未Commitの変更がないこと」（旧「- Working TreeがCleanであること」から変更）
- `docs/init-mvp-spec.md:64` — 「`docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md` をプロセス生成物と呼ぶ。」— §4:45が参照する「§5のプロセス生成物」が実際に定義されている
- `.claude/agents/independent-spec-reviewer.md:40` — 「`docs/spec-review.md` を書く。」— `/spec` が残すuntracked Fileは除外集合に含まれる
- `.claude/commands/spec.md:27,33` — 手順4で `docs/init-mvp-spec.md` を変更し、手順6で終わる。この2種類の残留物以外を作らない

`/spec` 完了直後の残留物（`docs/init-mvp-spec.md` のmodified、`docs/spec-review.md` のuntracked）と、人間が§1を `CONFIRMED` にした差分は、いずれも§4:45の除外集合に入る。`CLAUDE.md:11-15` の `/spec` →（人間が§1を `CONFIRMED`）→ `/goal docs/init-mvp-spec.md` が、手順1で確定的に停止する経路は消えた。除外は当該Pathに限定されており、無関係な未Commit変更は依然としてPreflightで止まる。

## BLOCKER 3: RESOLVED

やり直しに入る前の `[ ]` 戻しと、その時点でのCounter記録が、正本とCommandの両方に明記された。

**File Evidence**

- `docs/init-mvp-spec.md:52` — 「6. **BLOCKER修正** — `BLOCKED` なら指摘箇所だけ修正し、手順4と5をやり直す。やり直しに入る前に、`docs/goal-progress.md` の手順4と手順5を `[ ]` へ戻し、周回数を1増やして記録する。この記録より先に修正を始めない。」
- `.claude/commands/goal.md:36` — 同内容がCommand側にも記述されている
- `docs/init-mvp-spec.md:66` — 「手順6の周回数は、手順4と手順5を `[ ]` へ戻すのと同時に記録する。」（旧「手順6は、やり直した周回数も書く」から変更。「手順を終えるたび」の更新規則への依存が外れた）
- `docs/init-mvp-spec.md:68` / `.claude/commands/goal.md:24` — 「手順6の周回数も読み戻し、2周を超えて繰り返さない。」

「この記録より先に修正を始めない」により、修正着手より前に手順4・5が `[ ]` になる。したがって修正適用後のどの時点で中断しても、再開時の未Check最小番号は手順4であり、Test Gateと独立レビューを飛ばして手順7以降へ抜ける経路は閉じた。周回数もFile書き込み時点が修正着手前に固定されたため、中断をまたいで保持され、`goal.md:24` と `init-mvp-spec.md:68` が読み戻しを命じている。上限2周のCounterは機能する。「完了済みの手順をやり直さない」との衝突も、`[ ]` へ戻された手順は「完了済み」ではないため解消している。

ただし、手順6自身の `[x]` を戻す指示は追加されていない。これに起因する新規BLOCKER 1を下記に記す。

## BLOCKER 4: RESOLVED

Preflight失敗時のFile作成禁止から `docs/goal-progress.md` が明示的に除外され、かつ再実行時に同Fileが自らPreflightを落とす経路も消えた。

**File Evidence**

- `docs/init-mvp-spec.md:42` — 「1. **Preflight** — 次を全部確認する。1つでも満たさない場合は、Branch・Commitを作らず、`docs/goal-progress.md` 以外のFileも作らず停止し、欠けているものと対処を報告する。」（旧「Branch・Commit・Fileのいずれも作らず停止し」から変更）
- `docs/init-mvp-spec.md:66` — 「停止した場合は `[ ]` のまま理由を書く。」— 書き込み先の `docs/goal-progress.md` は42行目で作成が許可された
- `docs/init-mvp-spec.md:45` — 除外集合に「§5のプロセス生成物」（=`docs/goal-progress.md` を含む、64行目の定義）が入る
- `.claude/commands/goal.md:24` — 「Fileが無ければ§4手順1から始め、このFileを作る。」— 42行目と矛盾しない

初回Preflight失敗時に「Fileを作らず停止」と「停止理由を記録」が同時に満たせる。人間が原因を解消して再実行したとき、追跡外の `docs/goal-progress.md` が残っていてもクリーン条件は§4:45の除外により満たされ、Preflightが二度と通らない恒久デッドロックは解消した。

## BLOCKER 5: RESOLVED

Diffの全文とGate結果をSubagentへ渡す指示が、正本とCommandの両方に具体化された。Reviewerの入力契約とも一致する。

**File Evidence**

- `.claude/commands/goal.md:32` — 「起動時に、変更Diffの全文と§4手順4のGate結果をPromptで渡す。Reviewerは `Read` / `Grep` / `Glob` / `Write` しか持たずgitを実行できないため、渡さなければ判断できない。渡すDiffを要約、抜粋、選別しない。」
- `docs/init-mvp-spec.md:51` — 「5. **独立レビュー** — 実装したContextとは別の新しいSubagent Contextへ、変更Diffの全文と手順4のGate結果を渡してレビューさせ」
- `.claude/agents/independent-code-reviewer.md:38` — 「`/goal` が渡す変更Diffと§4手順4のGate結果、そしてTestを読む。」— 受け側が期待する2入力と、渡す側が渡す2入力が一致する
- `.claude/agents/independent-code-reviewer.md:4,34` — 「tools: Read, Grep, Glob, Write」「§4手順4のGate結果はあなたに与えられる。」— `goal.md:32` のTool列挙が実際のfrontmatterと一致している

「要約、抜粋、選別しない」により、実装Contextの要約だけでVerdictが出る経路も塞がれている。Diffの基準（どのBaseとの差分か）までは指定されていないが、これは前回BLOCKER 5の争点（受け渡し指示の不在）ではないため、解決判定を妨げない。

---

## 新規BLOCKER

### 新規BLOCKER 1: 手順6の `[x]` を戻す指示がなく、2周目以降の `BLOCKED` が中断・再開後に取りこぼされる

**File Evidence**

- `docs/init-mvp-spec.md:52` — 「やり直しに入る前に、`docs/goal-progress.md` の手順4と手順5を `[ ]` へ戻し」（戻す対象は手順4と手順5だけであり、手順6は含まれない）
- `.claude/commands/goal.md:36` — 同上。手順6自身を `[ ]` へ戻す指示はどちらのFileにもない
- `docs/init-mvp-spec.md:66` — 「§4の各手順を終えるたびに、その手順の行を `[x]` にし、完了日時と根拠を1行で書く。」
- `.claude/commands/goal.md:26` — 「各手順を終えるたびに `docs/goal-progress.md` を更新してから次へ進む。」（手順6の「次へ進む」先は手順4のやり直しであるため、手順6は `[x]` にされてから手順4へ戻ることになる）
- `docs/init-mvp-spec.md:68` / `.claude/commands/goal.md:24` — 「`[x]` になっていない最小番号の手順から再開する。完了済みの手順をやり直さない。」

BLOCKER 3の修正は、手順4と手順5の `[x]` を戻すことで「修正Codeが再Testと再レビューを経ずに進む」経路を閉じた。しかし手順6の `[x]` は戻らないため、次の状態が発生する。

1周目: 手順4 `[x]` → 手順5 `[x]`（`BLOCKED`）→ 手順6で手順4・5を `[ ]` へ戻し、周回数1を記録し、修正し、`init-mvp-spec.md:66` の「各手順を終えるたびに `[x]`」に従って手順6を `[x]` にする。
2周目: 手順4 `[x]` → 手順5 `[x]`（再び `BLOCKED`）。**ここで中断する。**
再開時: 進捗Fileは手順4 `[x]`、手順5 `[x]`、手順6 `[x]`、手順7 `[ ]`。`init-mvp-spec.md:68` と `goal.md:24` に従うと未Checkの最小番号は手順7であり、かつ「完了済みの手順をやり直さない」が手順6の再実行を禁じる。2周目の `BLOCKED` は誰にも処理されないまま、手順7 Mobile確認、手順8 Security確認、手順9 Commit、手順10 Push、手順11 Deployへ進む。

BLOCKER 3で塞いだ「Testと独立レビューを飛ばす」経路とは別に、「独立レビューは実行されたが、その `BLOCKED` Verdictが再開時に破棄される」経路が残っている。結果は同じく、BLOCKERを抱えたCodeが本番へ出ることである。`goal.md:34` の「`BLOCKED` を `APPROVED` として扱わない」は反対方向へ働く唯一の記述だが、これはVerdictの保存・報告に関する規定であり、再開時の手順選択規則（`init-mvp-spec.md:68` は正本側の規定である）を上書きする形にはなっていない。安全側のGateが、2つの規則のどちらを読むかで挙動が変わる状態にある。判断基準4（独立レビュー原則の破れ）および判断基準5（ガードレールが書かれ方として機能しない）。

なお、手順6を「手順4・5のやり直しが `APPROVED` で終わるまで `[x]` にしない」と読めば本経路は生じないが、どちらの読みを採るかは正本にもCommandにも書かれていない。この曖昧さ自体が、中断・再開の安全性を読み手の解釈に委ねている。

---

## FOLLOW_UPの混入について（規律の確認）

BLOCKER修正の規律はおおむね守られている。今回のDiffは `.claude/commands/goal.md` と `docs/init-mvp-spec.md` の2Fileに限定され、FOLLOW_UP 1（`README.md`）、2（`goal.md:16` の「既定では」は現存）、3（`/spec` のPreflight部分再掲）、4（`/spec` のBLOCKED経路）、6（`/spec` の進捗記録）、7（Write Toolの境界）は、いずれも未対応のまま正しく残されている。

ただし1件、FOLLOW_UP 5の領域への踏み込みがある。

- `docs/init-mvp-spec.md:64` — 「`docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md` をプロセス生成物と呼ぶ。これらはAIが作り、証跡として手順9でCommitする。`.gitignore` へ入れない。」
- `docs/init-mvp-spec.md:55` — 「9. **Commit** — レビューを通った内容と、§5のプロセス生成物をCommitする。」（旧「レビューを通った内容だけをCommitする。」から変更）

このうち**プロセス生成物の定義**（64行目の第1文）は、BLOCKER 2とBLOCKER 4の修正が§4:45で参照するために不可欠であり、混入ではない。一方、**手順9でCommitする／`.gitignore` へ入れない**という処遇の決定（64行目の第2文と55行目の変更）は、FOLLOW_UP 5「プロセス生成物が `.gitignore` にも§4手順9の扱いにも定義されていない」の解決そのものであり、BLOCKER解消の最小範囲を超えている。実害のある欠陥ではないため新規BLOCKERとしては扱わないが、規律上の逸脱として記録する。なお `.gitignore` 自体は変更されておらず、File単位の逸脱は生じていない。

## 観察（BLOCKERではない）

- `CLAUDE.md:7` — 「AIはこのFileを書き換えない。§2を書くのは `/spec` だけであり」。第1文が `docs/init-mvp-spec.md:38` の「§2以外をAIが書き換えない」より広い言い切りのまま残っている。直後の第2文が例外を名指ししており `/spec` の実行を妨げないため、BLOCKER 1はRESOLVEDとした。
- `docs/init-mvp-spec.md:55` の手順9で `docs/goal-progress.md` をCommitしても、手順9以降（手順9〜12）の進捗追記はそのCommitに含まれない。証跡として不完全になるが、ワークフローの停止や誤進行を招かない。

---

Verdictは本Fileに記載したとおりである。受け取る側は、上書き、再解釈、格下げ、要約による消去のいずれも行ってはならない。
