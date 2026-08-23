# Step 3 整合性レビュー（commit `b13edee`、親 `ef6f96e`）

- Verdict: BLOCKED
- Blockers: 1
- Ready to merge: NO

対象は6ファイル全体（`docs/init-mvp-spec.md` / `CLAUDE.md` / `README.md` / `.claude/commands/spec.md` / `.claude/commands/goal.md` / `.claude/agents/*.md`）と、変更に関係する `.devcontainer/devcontainer.json`、`.github/workflow-templates/deploy-pages.yml.template`、`profiles/`。

## 検査して問題がなかった点（記録）

- **手順番号・手順数の参照は全ファイルで一致している。** `docs/init-mvp-spec.md:50-60`（§4は1..13）、`CLAUDE.md:14`（「手順1から13」）、`README.md:33,35,40-53`（「13手順」と1..13の一覧）、`docs/init-mvp-spec.md:66`（「手順9と手順13でCommit」）。旧「12手順」「1から12」の残存はTemplate本体に存在しない（`docs/template-reviews/` 配下の過去の証跡を除く）。
- **`/spec` 手順3の循環は解消されている。** 発火条件が「手順2で§2の全項目の内容が揃ったら」（`.claude/commands/spec.md:26`）となり、手順4の完了に依存しなくなった。手順3→手順4の依存は一方向であり、新たな循環はない。
- **`/spec` Preflightの範囲明示は正本と一致する。** `.claude/commands/spec.md:18` が `/goal` 側へ委ねる4項目（Working Tree、npm各コマンド、Profileの公開先、実行環境のTimezone）は、`docs/init-mvp-spec.md:45-48` の手順1の項目とすべて対応する。取りこぼしはない。
- **§4手順1の停止規則とTimezone記録は両立する。** 手順1は失敗時「`docs/goal-progress.md` 以外のFileも作らず停止」（`docs/init-mvp-spec.md:42`）であり、新規のTimezone記録先も `docs/goal-progress.md` （同:48）なので、許可された唯一のFileの範囲内に収まっている。
- **Preflight段階で§2が空欄でも詰まらない。** §2未確定なら§1は `NOT_CONFIRMED` であり、`.claude/commands/goal.md:20` と `docs/init-mvp-spec.md:15` により実装開始前に停止する。到達不能経路にはならない。
- **`/goal` の引数規則の食い違いは解消されている。** `.claude/commands/goal.md:12`（引数なしを拒否）と同:16（既定値を補わない）が一致し、`CLAUDE.md:14` と `README.md:30` はいずれも引数付きで提示している。
- **`CLAUDE.md:7` は §3 と一致した。** 「§2以外を書き換えない」「§2を書くのは `/spec` の手順4だけ」が `docs/init-mvp-spec.md:38` および `.claude/commands/spec.md:30` と同じ強さ・同じ範囲になっている。
- **不変条件のうち、独立レビューの別Context性、Verdict不可侵、BLOCKER最大2周、手順7以降の条件、プロセス生成物を `.gitignore` へ入れないことは、いずれも崩れていない。** `.gitignore` にプロセス生成物は含まれない。

## BLOCKER

### BLOCKER 1 — 手順13の自己記録が§5の「先回り禁止」と充足不能に矛盾し、証跡が閉じない

**Evidence**

- `docs/init-mvp-spec.md:60` — 「13. **証跡の確定** — 手順9から12の結果と、**この手順13自身**を `docs/goal-progress.md` へ書き、**CommitしてPush**する。」
- `docs/init-mvp-spec.md:68` — 「§4の各手順を**終えるたびに**、その手順の行を `[x]` にし、**完了日時**と根拠を1行で書く。」
- `docs/init-mvp-spec.md:70` — 「完了日時は、その手順を**終えた時点で**実行環境のシステム時刻から実際に取得した値だけを書く。」
- `docs/init-mvp-spec.md:72` — 「**まだ終えていない手順の行を、先回りして `[x]` にしたり完了日時を書いたりしない。**」
- `docs/init-mvp-spec.md:74` — 「`[x]` になっていない最小番号の手順から再開する。完了済みの手順をやり直さない。」
- 同旨の再掲: `.claude/commands/goal.md:28`（先回り禁止）、同:30（完了日時は実測値のみ）、同:24（再開ロジック）、`CLAUDE.md:17`、`README.md:56`

**矛盾の内容**

手順13の構成要素は「書く → Commit → Push」である。手順13が終わるのはPushが済んだ時点である。ところが手順13は、その**書く**の中に「この手順13自身」を含めることを要求する。§5（`:68`, `:70`, `:72`）は、行を `[x]` にし完了日時を書いてよいのはその手順を終えた後だけであり、終えていない手順を先回りして書くことを明示的に禁じている。

したがって次の2通りしかなく、どちらも規則違反または目的の破綻になる。両者のどちらに従うべきかは正本の文面から決定できない。

- **手順13に従う場合** — Commit/Push前に「13. `[x]` 完了日時」を書くことになり、`:72` の先回り禁止に正面から違反する。さらにその完了日時は必ず実際の完了（Push）より前の値になり、`:70` が要求する「終えた時点の実測値」ではなくなる。これは本Commitが直そうとした欠陥（記録された時刻が実際の書き込み時刻と一致しない）と同じ種類の欠陥を、手順13で構造的に再生産する。
- **§5に従う場合** — 手順13の行を書けるのはPushの後である。しかしその書き込みはCommit済みの内容に含まれないため、手順13の証跡はWorking Treeに未Commitのまま残り、閉じるにはさらにもう1回のCommit/Pushが必要になる。それを繰り返しても同じ状態が再発する（無限後退）。「この手順で証跡を閉じる」（`:60`）という手順13の存在目的そのものが達成不能である。

**具体的な破綻経路（再開ロジックとの相互作用）**

1. 手順13で `docs/goal-progress.md` に「13. `[x]` <日時>」を書く（手順13の指示どおり）。
2. Commit前に中断する（Context切れ、`gh` 認証切れ、人間の中断など）。
3. 同じCommandで再開する。`docs/init-mvp-spec.md:74` と `.claude/commands/goal.md:24` により「`[x]` になっていない最小番号の手順」から再開するが、手順13は既に `[x]` である。
4. 再開対象の手順が存在しないため、ワークフローは完了として扱われる。「完了済みの手順をやり直さない」ため手順13は二度と実行されない。
5. 結果として、証跡のCommitとPushは一度も行われないまま、`goal-progress.md` は手順13完了を主張する。証跡Fileが事実と食い違う状態でRepositoryに残る。

これは「新しいルールが既存のルールと正面から矛盾し、どちらに従うべきか決定できない」および「途中で必ず詰まる経路が存在する」の両方に当たる。

**参考（修正はしない）** — 手順13の完了判定を記録以外の観測可能な事実に置く、手順13を§5の記録規則の適用外として明示する、記録の粒度を「Commit直前までの分」と定義するなど、正本のどこかで自己言及を解消する必要がある。どれを採るかは実装Contextの判断である。

## FOLLOW_UP

### FOLLOW_UP 1 — 手順13の「手順9から12の結果を…書き」が、§5の一括書き禁止と衝突する読みを許す

`docs/init-mvp-spec.md:60` は手順13で「手順9から12の結果」を書くと述べる。一方 `docs/init-mvp-spec.md:72` は「記録は1手順ずつ、その手順を終えた直後に書く。複数の手順の結果をまとめて1回で書かない」と禁じている。§5に従えば手順9〜12の行は手順13の開始時点で既に書かれているはずであり、手順13に残るのはCommit/Pushだけである。本Commitのメッセージが欠陥として挙げた「手順9から12が1回の書き込みでまとめて作られ」た挙動を、手順13の文面が字義どおり再指示している形になっている。禁止規則（`:72`）が明示的なので従うべき側は決定でき、BLOCKERとはしない。手順13を「既に書かれた手順9〜12の記録をCommit・Pushする」と書き換えれば曖昧さは消える。

### FOLLOW_UP 2 — 手順13のCommitは手順8（Security確認）を通らない

`docs/init-mvp-spec.md:55` の手順8は、手順9のCommit予定内容に対する実Credential混入チェックである。手順13（同:60）は手順8より後に生成された内容を新たにCommitするが、それに対応する確認手順が定義されていない。`CLAUDE.md:25` はSecurity確認をGateとして列挙している。Commit対象がAIの書く進捗記録に限られること、`docs/init-mvp-spec.md:36` の「秘密情報とローカル絶対PathをCommitしない」が常時有効であることから公開は止まらないと判断しFOLLOW_UPとするが、手順13にも同等の確認を課すか、手順8の対象を明示的に手順13へ拡張するのが望ましい。

### FOLLOW_UP 3 — 手順13の変更範囲「`docs/` 配下だけ」が、§5のプロセス生成物より広い

`docs/init-mvp-spec.md:60` は変更範囲を「`docs/` 配下だけ」と定める。しかし `docs/` には正本 `docs/init-mvp-spec.md` と独立レビューのVerdict Artifact `docs/code-review.md`（`docs/init-mvp-spec.md:66`、`.claude/agents/independent-code-reviewer.md:42`）が含まれる。文面は上限を定める制限であって書き換えを許可するものではなく、§3（同:38）と `.claude/commands/goal.md:38`（Verdict不可侵）が別途禁じているため不変条件は崩れていない。ただし範囲は「§5のプロセス生成物だけ」と書くほうが、他の規則と同じ強さになる。

### FOLLOW_UP 4 — 手順13のPushが、手順12（本番確認）後に未検証のProduction Deployを1回発火させる

`docs/init-mvp-spec.md:60` は手順13について「Deploy済みの成果物を変えない」と言い切る。しかし `static-basic` のDeploy機構は `.github/workflow-templates/deploy-pages.yml.template:3-5` のとおり `push: branches: [main]` で発火するため、手順13のPushは新たなDeploy Workflowを起動する。`on-local-data-use-ai-app`（`profiles/on-local-data-use-ai-app/PROFILE.md:25`、VercelのGit連携）でも同様である。`src/` は変わらず `package-lock.json` も固定なので生成物の内容は実質同一であり、`actions/deploy-pages` は失敗時に既存Deployを維持するため公開は止まらない。したがってFOLLOW_UPとするが、「成果物を変えない」という言い切りは機構の実態と一致しておらず、「Deployを目的とした変更をしない」等へ弱めるか、手順13のPushが再Deployを起こすことを明記すべきである。手順12で確認した状態と最終Deployが別Runになる点も、証跡としては記録する価値がある。

### FOLLOW_UP 5 — §2のDeadline Timezone必須が、独立仕様レビューの判定基準に反映されていない

`docs/init-mvp-spec.md:27` はDeadlineへのTimezone明記を必須にし、`docs/init-mvp-spec.md:48` の手順1がそれを前提に残り時間を計算できることを求める。一方 `.claude/agents/independent-spec-reviewer.md:15-23` のBLOCKER一覧にはTimezone欠落が無く、「§2に空欄がある」にも該当しない（値は書かれているがTimezoneが無い状態）。このため `/spec` の独立レビューを `APPROVED` で通過し、人間が§1を `CONFIRMED` にした後、`/goal` の手順1で初めて弾かれる経路が残る。停止して人間に報告する挙動なので詰まりはしないが、検出が1段階遅い。

### FOLLOW_UP 6 — `goal-progress.md` の完了日時にはTimezone表記が義務づけられていない

`docs/init-mvp-spec.md:27` は§2のDeadlineにTimezone明記を義務づけた。しかし§5（同:68, :70）と `.claude/commands/goal.md:30` は、完了日時について実測値であることだけを求め、Timezoneの併記を求めていない。`docs/init-mvp-spec.md:48` の記録義務も「両者のTimezoneが異なる場合」に限られるため、一致している場合は時間軸が記録に残らない。本Commitが対象とした「どの時間軸の時刻か誰も検査していない」問題が、`goal-progress.md` 側では再発しうる。あわせて、時間軸を統一する（同:48）ことと「システム時刻から実際に取得した値だけを書く」（同:70）ことの関係——取得値のTimezone変換が許されるのか——も明示されていない。

### FOLLOW_UP 7 — devcontainerの `TZ` がTemplate配布物として `Asia/Tokyo` に固定されている

`.devcontainer/devcontainer.json:13-15` は全利用者のContainerへ `TZ=Asia/Tokyo` を強制する。手順1のTimezone確認（`docs/init-mvp-spec.md:48`）と矛盾はしないが、このRepositoryはTemplateであり、JST以外で使う人間には不整合の原因になりうる。手順1がTimezone差を扱えるようになった以上、固定値の妥当性は再検討の余地がある。

### FOLLOW_UP 8 — `/spec` 手順5のやり直し経路が手順3・手順4を明示的に含まない

`.claude/commands/spec.md:33` は `BLOCKED` 時に「指摘された項目だけを手順2へ戻して直し、手順5をやり直す」と述べる。`independent-spec-reviewer` は `docs/init-mvp-spec.md` を読んで判定する（`.claude/agents/independent-spec-reviewer.md:36`）ため、手順4（§2の書き込み）を経ないと再レビューは同じ内容を読むことになる。本Commitが手順3へ「この手順を終えるまで手順4へ進まない」という絶対条件（`.claude/commands/spec.md:27`）を追加したことで、やり直し時に手順3の一括抽出をどこまで再実行するのかも不明確になった。「手順2へ戻して直し」は通常2→3→4→5と前進する読みが自然であり、必ず詰まる経路とまでは言えないためFOLLOW_UPとする。やり直しの再入点を番号で明示すれば解消する。

### FOLLOW_UP 9 — `README.md:53` の手順13要約が「手順13自身の記録」を落としている

`README.md:53` は「手順9〜12の結果をgoal-progress.mdへ書きCommit・Push」であり、正本（`docs/init-mvp-spec.md:60`）にある「この手順13自身を」が抜けている。`README.md:37` が§4を正本と明記しているため軽微だが、BLOCKER 1を解消する際に文面が変わるので、そのとき合わせて追随させること。
