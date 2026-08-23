# 独立コードレビュー

- Verdict: BLOCKED
- Blockers: 5
- Follow-ups: 7
- Ready to merge: NO

## Evidence

- 対象Branch: `feat/lightweight-goal-commands`
- Base: `feat/lightweight-goal`
- Diff: `git diff feat/lightweight-goal...feat/lightweight-goal-commands`
- 変更File: `.claude/agents/independent-code-reviewer.md`（新規）、`.claude/agents/independent-spec-reviewer.md`（新規）、`.claude/commands/goal.md`（新規）、`.claude/commands/spec.md`（新規）、`CLAUDE.md`（変更）、`docs/init-mvp-spec.md`（変更）。6 files changed, 220 insertions(+), 14 deletions(-)
- 与えられたGate結果（再実行していない）: `npm ci` OK / `lint` PASS / `test` PASS (2 tests) / `build` PASS / `git diff --check` clean
- 本Reviewで作成・変更したFileは `docs/code-review.md` 1件のみである。指摘の修正は行っていない。

### 確認できた整合点

- §4の手順番号繰り上げ（11手順→12手順）に対し、外部からの参照は追随している。`.claude/agents/independent-code-reviewer.md:34,38` の「§4手順4のGate結果」は新§4手順4（テスト）を、`.claude/commands/goal.md:30` の「§4手順5」は新§4手順5（独立レビュー）を、`goal.md:34` の「§4手順6」は新§4手順6（BLOCKER修正）を、`CLAUDE.md:14` の「手順1から12」は新しい手順数を、それぞれ正しく指している。判断基準3の手順番号ずれは検出されなかった。
- 参照される節はすべて実在する。`goal.md:16` の§4/§5/§6、`spec.md:13` の§2/§3、`spec.md:39` の§6、`spec.md:13` の `profiles/<selected_profile>/PROFILE.md`（`profiles/static-basic/PROFILE.md`、`profiles/on-local-data-use-ai-app/PROFILE.md` が実在）。判断基準1の参照先不在は検出されなかった。
- Commandのfrontmatter（`description`、`argument-hint`）とSubagentのfrontmatter（`name`、`description`、`tools`）は、いずれもClaude Codeが解釈できる形式である。`$ARGUMENTS` は本文中で使われており記法上は正しい。
- 秘密情報、実Credential、ローカル絶対Pathの混入は検出されなかった（判断基準7）。

## BLOCKER

### BLOCKER 1: 正本§3が `/spec` による§2書き込みを禁じており、`/spec` が定義どおりに動作できない

**File Evidence**

- `docs/init-mvp-spec.md:38` — 「- このFileをAIが書き換えない」（§3 実装ルール。本Diffで変更されていない）
- `docs/init-mvp-spec.md:62` — 「§3のとおりAIは `docs/init-mvp-spec.md` を書き換えないので、進捗はこのFileへ書く」（本Diffで追加。§3を例外なしの絶対規則として再確認している）
- `.claude/commands/spec.md:27` — 「4. **§2の書き込み** — 確定した内容を `docs/init-mvp-spec.md` §2へ書く。」
- `.claude/commands/spec.md:13` — 「`docs/init-mvp-spec.md` が正本である。ここで判断基準を再掲しない。」
- `CLAUDE.md:7` — 「AIはこのFileを書き換えない。§2を書くのは `/spec` だけであり」

`/spec` は自ら正本を `docs/init-mvp-spec.md` と宣言したうえで、その正本§3が絶対禁止している「このFileをAIが書き換える」ことを手順4で必須としている。`CLAUDE.md:7` は `/spec` の例外を作ろうとしているが、正本§3には対応する例外が追加されていないため、`CLAUDE.md` と `docs/init-mvp-spec.md` §3の間にも矛盾が残る。さらに `docs/init-mvp-spec.md:62` は§3を無例外の前提として引用しており、例外の不在を強化している。§3を読んだ実装Contextは `/spec` 手順4を拒否し、`/spec` 手順6の人間への引き渡しに到達できない。判断基準2（内部矛盾）。

### BLOCKER 2: `CLAUDE.md` が示す `/spec` → `/goal` の動線が、§4手順1のPreflightで必ず停止する

**File Evidence**

- `CLAUDE.md:11-15` — `/spec` → （人間が§1を CONFIRMED にする）→ `/goal docs/init-mvp-spec.md`
- `docs/init-mvp-spec.md:45` — §4手順1 Preflight「- Working TreeがCleanであること」（本Diffで追加）
- `docs/init-mvp-spec.md:42` — 「1つでも満たさない場合は、Branch・Commit・Fileのいずれも作らず停止し、欠けているものと対処を報告する。」
- `.claude/commands/spec.md:27,30,33` — 手順4で `docs/init-mvp-spec.md` を変更し、手順5で `docs/spec-review.md` を生成し、手順6で人間に§1変更を求めて終わる。`/spec` にCommitの手順は存在しない
- `.gitignore`（全6行）— `node_modules/` / `dist/` / `coverage/` / `*.local` / `.DS_Store` / `*.log` のみ。`docs/spec-review.md` は無視されない（`git ls-tree` 上、`docs/` の追跡Fileは `docs/init-mvp-spec.md` のみ）

`/spec` 完了直後のWorking Treeは、必ず「`docs/init-mvp-spec.md` がmodified」かつ「`docs/spec-review.md` がuntracked」の状態になる。人間が§1を `CONFIRMED` にすると差分はさらに増える。この状態で `CLAUDE.md:14` のとおり `/goal docs/init-mvp-spec.md` を実行すると、§4手順1のWorking Tree Clean条件が確定的に不成立となり、手順2へ進めず停止する。`CLAUDE.md` が唯一提示している動線が、正本のPreflightと矛盾しており、実行不能である。判断基準2（内部矛盾）および判断基準5（停止条件の書かれ方が実際には機能しない）。

### BLOCKER 3: 手順6のやり直し（手順4と5）と「完了済みの手順をやり直さない」が矛盾し、修正Codeが再Testと独立レビューを経ずにCommit・Deployへ到達しうる

**File Evidence**

- `docs/init-mvp-spec.md:52` — 「6. **BLOCKER修正** — `BLOCKED` なら指摘箇所だけ修正し、手順4と5をやり直す。」
- `docs/init-mvp-spec.md:66` — 「`[x]` になっていない最小番号の手順から再開する。完了済みの手順をやり直さない。」
- `docs/init-mvp-spec.md:64` — 「§4の各手順を終えるたびに、その手順の行を `[x]` にし、完了日時と根拠を1行で書く。」
- `.claude/commands/goal.md:24` — 「`[x]` になっていない最小番号の手順から再開する。完了済みの手順をやり直さない。」
- `.claude/commands/goal.md:26` — 「各手順を終えるたびに `docs/goal-progress.md` を更新してから次へ進む。」

手順6へ到達した時点で手順4と5は必ず `[x]` である。しかし手順6は両者のやり直しを命じ、`docs/init-mvp-spec.md:66` と `goal.md:24` は完了済み手順のやり直しを無条件に禁じる。両者は同じ正本内で直接衝突しており、やり直しに入るとき手順4と5の `[x]` を `[ ]` へ戻す指示はどこにも存在しない。

結果として、修正適用後に手順6を `[x]` にして中断した場合（`init-mvp-spec.md:64` の「各手順を終えるたびに `[x]` にする」に素直に従うとこうなる）、再開Contextは未Checkの最小番号として手順7（Mobile確認）を選び、手順4のTest Gateと手順5の独立レビューを飛ばして手順9 Commit、手順10 Push、手順11 Deployへ進む。BLOCKER指摘を受けて書き換えたCodeが、Testも独立レビューも通らないまま本番へ出る経路が開いている。判断基準4（独立レビュー原則の破れ）、判断基準5（ガードレールが書かれ方として機能しない）、判断基準2（内部矛盾）。

あわせて、2周上限のCounterも同じ書き方に依存している（`init-mvp-spec.md:64`「手順6は、やり直した周回数も書く」は手順を「終えるたび」の更新規則の一部であり、周回途中で中断すると記録されない）。`goal.md:24` の再開手順は周回数を読み戻す指示を持たないため、上限が最初からやり直しになりうる。

### BLOCKER 4: Preflight失敗時、「Fileを作らず停止」と「停止理由を `docs/goal-progress.md` に書く」が両立せず、再開が恒久的に詰まる

**File Evidence**

- `docs/init-mvp-spec.md:42` — 「1つでも満たさない場合は、Branch・Commit・Fileのいずれも作らず停止し」
- `docs/init-mvp-spec.md:64` — 「停止した場合は `[ ]` のまま理由を書く。」（書き込み先は `docs/goal-progress.md`）
- `docs/init-mvp-spec.md:66` — 「Fileが無ければ手順1から始め、このFileを作る。」
- `.claude/commands/goal.md:24` — 「Fileが無ければ§4手順1から始め、このFileを作る。」
- `docs/init-mvp-spec.md:45` — Preflight条件「Working TreeがCleanであること」
- `.gitignore` — `docs/goal-progress.md` を無視しない

初回実行で手順1が失敗した場合、`init-mvp-spec.md:42` はFile作成を禁止し、`init-mvp-spec.md:64` は停止理由を `docs/goal-progress.md` へ書くことを求める。どちらに従っても他方に違反する。

さらに、`goal.md:24` に従って `docs/goal-progress.md` を先に作ってから手順1を実行した場合、手順1が `[ ]` のまま停止すると、人間が原因（例: `gh auth` 未認証）を解消して再実行しても、未Checkの最小番号は手順1のままであり、そのときWorking Treeには追跡外の `docs/goal-progress.md` が残っているためCleanではなく、Preflightは二度と通らない。進捗からの再開が、書かれ方として機能していない。判断基準5および判断基準2。

### BLOCKER 5: `independent-code-reviewer` は判断に必須の入力を自力で取得できず、`/goal` にそれを渡す指示が存在しない

**File Evidence**

- `.claude/agents/independent-code-reviewer.md:4` — 「tools: Read, Grep, Glob, Write」（Bash等、gitを実行できるToolを持たない）
- `.claude/agents/independent-code-reviewer.md:34` — 「あなたはCommandを実行するToolを持たず、必要ともしない。§4手順4のGate結果はあなたに与えられる。」
- `.claude/agents/independent-code-reviewer.md:38` — 「`docs/init-mvp-spec.md`、`profiles/` 配下の選択済みProfile、`/goal` が渡す変更Diffと§4手順4のGate結果、そしてTestを読む。**それ以外を要求しない。**」
- `.claude/commands/goal.md:30` — 「§4手順5では `independent-code-reviewer` Subagentを起動する。」（渡す入力の指定なし）
- `docs/init-mvp-spec.md:51` — 「5. **独立レビュー** — 実装したContextとは別の新しいSubagent Contextでレビューし」（渡す入力の指定なし）

Reviewer側は「変更Diff」と「§4手順4のGate結果」を `/goal` から渡される前提で設計され、Tool構成上それらを自力で取得することも、追加要求すること（「それ以外を要求しない」）もできない。一方、`/goal` 側にも正本§4手順5にも、Diff・Gate結果をSubagentへ受け渡す指示がない。この状態でSubagentを起動すると、Reviewerは判断根拠のない、あるいは実装Contextが要約した情報だけでVerdictを出すことになる。Template全体の中心Gateである独立レビューが、記述どおりには機能しない。判断基準6（Subagentの起動方法が実際には動かない）および判断基準5。

## FOLLOW_UP

### FOLLOW_UP 1: `README.md` が旧動線のまま取り残されている

- `README.md:14` — 「Claude Codeとの壁打ちで `docs/init-mvp-spec.md` §2（アプリ固有の仕様）を確定し」（`/spec` に触れていない）
- `README.md:17-19` — 「`docs/init-mvp-spec.mdを読み込んで実装して`」（`CLAUDE.md:7,11-15` が `/spec` / `/goal` に置き換えた旧入口）
- `README.md:21` — 「実装 → テスト → 独立レビュー → BLOCKER修正 → Mobile確認 → Security確認 → Commit → Push → Deploy → 本番確認」（新§4のPreflightと仕様確認が欠落し、12手順ではなく10手順になっている）

利用者が最初に読むFileが旧仕様を案内している。`CLAUDE.md` との矛盾でもあるが、判断基準2が列挙するFile集合の外なのでFOLLOW_UPとする。

### FOLLOW_UP 2: `/goal` の引数規則に既定値の有無の食い違いがある

- `.claude/commands/goal.md:12` — 「引数なし、複数引数、Option、Repository外のPath、Directory、存在しないFile、空のFileはいずれも拒否する。」
- `.claude/commands/goal.md:16` — 「`$ARGUMENTS`（既定では `docs/init-mvp-spec.md`）が正本である。」

引数なしを拒否する以上「既定値」は存在しない。「既定では」の語が、引数省略時に `docs/init-mvp-spec.md` を補ってよいという読みを許す。

### FOLLOW_UP 3: `/spec` のPreflightが正本Preflightの部分的な再掲になっている

- `.claude/commands/spec.md:13` — 「ここで判断基準を再掲しない。」
- `.claude/commands/spec.md:17` — 手順1 Preflight（`git` / `gh` / `node` / `npm`、`gh auth status` のみ）
- `docs/init-mvp-spec.md:42-47` — §4手順1（上記に加え、Working Tree Clean、`npm ci`/`lint`/`test`/`build` の実行可否、Profileの公開先）

非再掲の宣言に反して部分再掲しており、かつ内容が正本より狭い。今後どちらか一方だけが更新されると乖離する。

### FOLLOW_UP 4: `/spec` のBLOCKED時のやり直し経路が手順3と手順4を飛ばしている

- `.claude/commands/spec.md:30` — 「`BLOCKED` なら、指摘された項目だけを手順2へ戻して直し、手順5をやり直す。」

文面どおりに手順2→手順5と進むと、手順3（曖昧箇所の一括抽出）と手順4（§2への書き込み）が実行されず、直した内容が `docs/init-mvp-spec.md` §2へ反映されないままレビューをやり直すことになる。

### FOLLOW_UP 5: プロセス生成物が `.gitignore` にも§4手順9の扱いにも定義されていない

- `.gitignore`（全6行）— `docs/goal-progress.md` / `docs/spec-review.md` / `docs/code-review.md` のいずれも対象外
- `docs/init-mvp-spec.md:55` — 「9. **Commit** — レビューを通った内容だけをCommitする。」

3つの生成物を成果物としてCommitするのか、Repositoryから除外するのかが未定義である。BLOCKER 2およびBLOCKER 4のWorking Tree Clean問題の直接の背景でもある。

### FOLLOW_UP 6: `/spec` に進捗記録と再開の仕組みがない

- `.claude/commands/goal.md:22-26` — `/goal` は `docs/goal-progress.md` による再開を持つ
- `.claude/commands/spec.md` — 対応する仕組みなし

壁打ちは最も中断されやすい工程だが、`/spec` は中断すると§2への到達状況が失われる。

### FOLLOW_UP 7: Reviewer Subagentの「1 Fileだけ書く」境界がPromptの文章だけで担保されている

- `.claude/agents/independent-code-reviewer.md:4` — 「tools: Read, Grep, Glob, Write」
- `.claude/agents/independent-code-reviewer.md:29` — 「あなたが書くFileはReview Artifact 1件だけである。Write Toolを持つのはそのFile 1件を生成するためであって、境界が緩いからではない。」
- `.claude/agents/independent-spec-reviewer.md:4,30` — 同様

Write Toolは書き込み先を制限しないため、この境界は実行時に強制されない。Claude Codeの現行仕様上の制約であり公開を止めるものではないが、`permissions` によるPath制限などの補強余地がある。

---

Verdictは本Fileに記載したとおりである。受け取る側は、上書き、再解釈、格下げ、要約による消去のいずれも行ってはならない。
