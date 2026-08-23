# Step 4 ベースラインレビュー（初回・周回1）

対象: 独立レビューを整合性用とベースライン用の2種にする変更（`feat/baseline-review`）
視点: 変更Diffを読まず、Repository全体をはじめてcloneした人として検査する

---

## 初回

- Verdict: BLOCKED
- Blockers: 1
- Follow-ups: 8
- Ready to merge: NO

### BLOCKER

1. `README.md` をこのAppの説明へ書き換える責務が無主で、手順6のベースラインレビューが確定的に `BLOCKED` を返す
   - File Evidence: `docs/init-mvp-spec.md`:56 / `.claude/agents/independent-baseline-reviewer.md`:37,40 / `README.md`:1,3,13
   - 何がどう壊れるか: 手順3の置換対象は `src/` と `index.html`（:56）と `package.json` の `name`（:57）だけで、`README.md` を扱う手順がRepositoryのどこにも無い。一方 `independent-baseline-reviewer` は `README.md` を検査対象に含め（:27,37）、「`README.md` が本Appではなく、このTemplate自身を説明している」を典型的BLOCKERとして明示する（:40）。よってこのTemplateから作られたどのMVPでも、手順3を仕様どおり実行した結果として手順6が必ず `BLOCKED` になり、手順7の上限2周のうち1周が無条件に消費される。修正されなければ、公開されたPUBLIC Repositoryのトップに「このTemplateからGitHub Repositoryを作る」（`README.md`:13）というTemplate自身の使用説明が残り、訪問者は何のAppか判断できない。

### FOLLOW_UP

1. `on-local-data-use-ai-app` のProfile説明が実体と食い違う（永続を必須と読ませる） — `docs/init-mvp-spec.md`:29 / `CLAUDE.md`:33 / `README.md`:70 vs `profiles/on-local-data-use-ai-app/PROFILE.md`:15-17
2. Vercel Profileの手順12に、Deployを起こす実体がRepository内に無い — `docs/init-mvp-spec.md`:73,45 / `profiles/on-local-data-use-ai-app/PROFILE.md`:29
3. `src/App.test.tsx` のコメントが手順3の指示と正面から矛盾する — `src/App.test.tsx`:6-9 vs `docs/init-mvp-spec.md`:61
4. Placeholder残存を機械的に落とすGateが無く、手順5を素通りする — `src/App.test.tsx`:16-23 / `docs/init-mvp-spec.md`:63
5. `docs/template-reviews/` 9件が新Repositoryへ継承され、削除する手順が無い — `README.md`:66 / `.claude/agents/independent-baseline-reviewer.md`:29,47
6. Template自身の名称・自己記述が複数Fileで継承され、更新する手順が無い — `CLAUDE.md`:3 / `.devcontainer/devcontainer.json`:2 / `LICENSE`:3 / `package.json`:4
7. AI Profileで作る `api/` 配下が、どのtsconfigの `include` にも入らず型検査を受けない — `tsconfig.app.json`:21 / `tsconfig.node.json`:15 / `package.json`:8
8. `.gitignore` の否定パターンに対応するFileが無い — `.gitignore`:11

---

## 周回1（BLOCKER修正後）

- Verdict: APPROVED
- Blockers: 0
- Follow-ups: 10
- Ready to merge: YES

> 公開または利用が確定的に壊れる経路は見つからなかった。

### 整合を確認して問題が無かった点（記録として）

14手順の番号と内容が `docs/init-mvp-spec.md`:43-79 と `README.md`:39-57 で一致する。Agent名3件は frontmatter の `name` と参照側が一致し、Artifact名も `docs/spec-review.md` / `docs/code-review.md` / `docs/baseline-review.md` で対になっている。Profile名3件はディレクトリ実体と一致する。手順5が要求する `lint` / `test` / `build` は `package.json`:9-10,8 に実在し、`package-lock.json`（lockfileVersion 3）も実在する。手順3が指す複製元2件は指定Pathに実在し、Pages側の複製元には lint / test / build のStepが残っている。Placeholder は実体（`index.html`:7、`src/App.tsx`:5,10,11）と定義側（`docs/init-mvp-spec.md`:56）が対応している。App Shell Test は現状のDOMと一致し出荷状態で成立する。Profileの被覆は `profiles/on-local-data-use-ai-app/PROFILE.md`:15-19 が「永続する／しない」を両方許すため、永続 × AI の4象限に穴が無い。`.vercel/`・`dist/`・`coverage/` は `.gitignore` 済み。手順14は自身の行を書かず、再実行しても no-op になる。

### BLOCKER

なし。

### FOLLOW_UP

1. `on-local-data-use-ai-app` のDeploy実行方式が、Repositoryのどこにも定義されていない — `docs/init-mvp-spec.md`:74 / `profiles/on-local-data-use-ai-app/PROFILE.md`:29 / `deploy-templates/vercel.json.template`:1-6
2. 正本§2とREADMEのProfile説明が `PROFILE.md` の実体と食い違う（AI Profileの永続要否） — `docs/init-mvp-spec.md`:29 / `README.md`:71 vs `profiles/on-local-data-use-ai-app/PROFILE.md`:15-19
3. 手順3の「Template固有の文字列を検索し、置き換え漏れが1件もないことを確認する」が、記述どおりには満たせない — `docs/init-mvp-spec.md`:61 / `LICENSE`:3、`.devcontainer/devcontainer.json`:2、`package-lock.json`:2,8
4. `docs/template-reviews/` を新Repositoryから外す責務が無主である — `README.md`:67 / `docs/init-mvp-spec.md`:55-62 / `.claude/agents/independent-baseline-reviewer.md`:29,47
5. `package.json` の `name` 変更に `package-lock.json` の `name` が追随しない — `docs/init-mvp-spec.md`:58 / `package-lock.json`:2,8
6. `.gitignore` に Claude Code のローカル設定が無い — `.gitignore`:1-15 / `docs/init-mvp-spec.md`:50,77
7. 手順3が `index.html` の `lang` と `package.json` の `version` を扱わない — `index.html`:2 / `package.json`:4
8. Deploy経路によってGateの実行有無が非対称である — `.github/workflow-templates/deploy-pages.yml.template`:31-38 vs `deploy-templates/vercel.json.template`:4
9. Template自身に `.github/workflows/` が無く、出荷状態のGateが機械的に検証されていない — `.github/` 配下は複製元1件のみ
10. `index.html` のmeta descriptionがPlaceholderではなくTemplateの宣伝文である — `index.html`:6

---

## この2周で分かったこと

初回に整合性レビューが FOLLOW_UP 4 とした事実を、ベースラインレビューは BLOCKER と判定した。**同一箇所で2種の判定が割れた。** 差分を見る側からは「READMEの記述の不足」に見え、Repository全体を見る側からは「どのMVPでも確定的に手順6が失敗する構造」に見えた。

この欠陥は、本変更が `independent-baseline-reviewer` を追加したことによって確定的に発火するようになったものである。README継承の問題自体は分岐元より前から存在した。
