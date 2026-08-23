# Step 4 整合性レビュー（初回・周回1）

対象: 独立レビューを整合性用とベースライン用の2種にする変更（`feat/baseline-review`）
視点: 変更Diffの全文と、正本・Command・Agent定義・READMEの4者の整合を検査する

---

## 初回

- Verdict: APPROVED
- Blockers: 0
- Follow-ups: 9
- Ready to merge: YES

### BLOCKER

なし。

### FOLLOW_UP

1. `independent-code-reviewer` 側が新しい兄弟Artifactに追随していない — `.claude/agents/independent-code-reviewer.md`:32
2. ベースラインレビュアーの編集禁止規則が自分のArtifactを含んでしまう — `.claude/agents/independent-baseline-reviewer.md`:53 / `docs/init-mvp-spec.md`:84
3. `README.md` の構成説明が `docs/code-review.md` だけを指したまま — `README.md`:66
4. README.mdの初期化責務が手順3に無く、ベースラインレビュアーのBLOCKER条件にだけ存在する — `.claude/agents/independent-baseline-reviewer.md`:40 / `docs/init-mvp-spec.md`:56-60
5. 「公開または利用が実際に壊れるものに限る」と典型例の一部が整合していない — `.claude/agents/independent-baseline-reviewer.md`:33 と :40-42
6. 手順6の通過条件がMarkdownの構造上サブ項目の続きになっている — `docs/init-mvp-spec.md`:67
7. 合流のないワークフローに `Ready to merge` Headerを新規Fileへも複製している — `.claude/agents/independent-baseline-reviewer.md`:66
8. ベースラインレビュアーがRepository名をどこから得るかを自身の定義に持たない — `.claude/agents/independent-baseline-reviewer.md`:38 / `.claude/commands/goal.md`:37
9. Template保守としての正本編集に、規則上の除外がない — `docs/init-mvp-spec.md`:41 と :9 / `CLAUDE.md`:39

> **注**: FOLLOW_UP 4 は、ベースラインレビュー初回が同じ事実を BLOCKER と判定した。2種のレビューが同一箇所で判定を分けた事例である。

---

## 周回1（BLOCKER修正後）

- Verdict: APPROVED
- Blockers: 0
- Follow-ups: 8
- Ready to merge: YES

### 前回BLOCKERの解消判定

**解消した。**

1. 責務の付与 — `docs/init-mvp-spec.md`:57 に §4手順3の項目として `README.md` の書き換えが追加された。手順3は :55 で「次を全部行い、終えるまで手順4へ進まない」と義務化されており任意項目ではない
2. Reviewer条件との対応 — `independent-baseline-reviewer.md`:40 の条件に対し :57 が名指しで除去対象を列挙している
3. 残る確定的BLOCKED経路の探索 — `independent-baseline-reviewer.md`:37-43 の7条件を、手順3実行後の継承物に照らして総当たりした。**手順3を仕様どおり実行した後に確定的に `BLOCKED` を返す経路は残っていない**
4. 自己完結性 — README書き換え後も `CLAUDE.md`:11-17 に `/spec` `/goal` の起動方法が、`docs/init-mvp-spec.md`:43-79 に §4の14手順全文が残る
5. 4者の整合 — 手順6の通過条件、手順7のやり直し範囲、Artifact名、Reviewerへの入力、Agent名の実在をすべて照合し一致を確認
6. 不変条件 — §3の「§2以外を書き換えない」「§1 CONFIRMEDは人間だけ」「Verdict不可侵」「上限2周」「プロセス生成物を `.gitignore` に入れない」「手順14は自身の行を書かない」「完了日時は実測値のみ」いずれも壊れていない
7. 宣言範囲 — FOLLOW_UPへの着手は1件も見当たらない。`independent-code-reviewer.md` が今回未変更のままで既知の不備が残っていることが、混ぜていない証跡でもある

### BLOCKER

なし。

### FOLLOW_UP

1. 手順3の宣伝文除去対象Fileが、Reviewerの検査対象Fileより狭い — `docs/init-mvp-spec.md`:56 / `.claude/agents/independent-baseline-reviewer.md`:37
2. `independent-code-reviewer` の編集禁止列挙に `docs/baseline-review.md` が無い — `.claude/agents/independent-code-reviewer.md`:32
3. Deploy素材のBLOCKER条件が「または」で、複製Semanticsと噛み合っていない — `.claude/agents/independent-baseline-reviewer.md`:39 / `docs/init-mvp-spec.md`:60
4. 未選択Profile側のDeploy素材が未配置であることへのProfile限定が無い — `.claude/agents/independent-baseline-reviewer.md`:39
5. `CLAUDE.md` が派生Repositoryで「このRepositoryはTemplateである」と主張し続ける — `CLAUDE.md`:3 / `docs/init-mvp-spec.md`:57
6. Reviewerの検査対象一覧が閉じた列挙に読め、「はじめてcloneした人」の前提と整合しない — `.claude/agents/independent-baseline-reviewer.md`:21,27
7. 再レビューでArtifactが上書きされ、周回ごとのVerdictが残らない — `docs/init-mvp-spec.md`:69 / `.claude/agents/independent-baseline-reviewer.md`:60
8. `docs/template-reviews/` の存在理由の説明が `docs/baseline-review.md` に更新されていない — `README.md`:67
