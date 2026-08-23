# MVP要求入力（init-mvp-spec）

このFileがMVP実装の唯一の要求入力である。

新しいアプリを作るときは、§2のアプリ固有部分を人間との壁打ちで確定し、§1を `CONFIRMED` にする。

§3以降は固定のワークフローとルールであり、アプリごとに書き換えない。

実際の開発で問題が起きた場合は、その問題への対処だけを必要に応じて固定ルールへ追加する。最初から問題を想像して仕組みを増やさない。

## 1. 確定Status

- Status: `NOT_CONFIRMED`

`CONFIRMED` にするのは人間だけである。`NOT_CONFIRMED` のあいだ、AIは実装を開始せず停止して報告する。

## 2. アプリ固有の仕様（壁打ちで確定する）

壁打ちのゴールは、AIが迷わず実装できるように仕様を固めることである。実装中にAIが製品判断で停止しない粒度まで各項目を具体化してから、§1を `CONFIRMED` にする。

- App名:
- 目的（誰のどんな課題を解決するか）:
- 主要機能（MVP Scope。3つ以内）:
- Scope外（今回作らないもの）:
- 画面とDesign（Figma URL。なければ「なし」と書き、シンプルなUIをAIに任せる）:
- Profile: 次のどれか1つ。詳細は `profiles/<selected_profile>/PROFILE.md` を正本とする
    - `static-basic` — GitHub Pages。永続保存なし。Reloadで入力が消える
    - `daily-local-app` — GitHub Pages。利用者のBrowserへローカル永続する。Serverと秘密Keyなし
    - `on-local-data-use-ai-app` — Vercel。ローカル永続に加え、秘密Keyを要するAI呼び出しをServer API経由で行う
- Deadline（Timezoneを必ず明記する。例: `2026-08-15 18:00 JST`）:
- 受け入れ条件（これが本番で動けば公開してよい、という具体的な操作の列）:
- 秘密情報（AI Profileのみ。使うAPI Keyの名前。実値はここに書かない）:

## 3. 実装ルール

- §2にない機能を追加しない。迷ったら作らない
- 既存Dependencyで実装できるなら新規Libraryを追加しない
- 将来拡張のための抽象化をしない
- 秘密情報とローカル絶対PathをCommitしない
- 製品判断が必要になったら、AIが判断を発明せず停止して人間に確認する
- このFileの§2以外をAIが書き換えない。§2を書くのは `/spec` の手順4だけである

## 4. ワークフロー（この順にすべて行う）

このワークフローは既定Branch（`main`）の上で行う。作業Branchを分けない。Deploy Workflowは既定Branchへのpushでだけ発火するため、Branchを分けると手順12のDeployが起きない。分ける必要が生じた場合は製品判断であり、停止して人間に確認する。

1. **Preflight** — 次を全部確認する。1つでも満たさない場合は、Branch・Commitを作らず、`docs/goal-progress.md` 以外のFileも作らず停止し、欠けているものと対処を報告する。
    - `git` / `gh` / `node` / `npm` が使えること
    - `gh auth status` が認証済みであること
    - Working Treeに、`docs/init-mvp-spec.md` と§5のプロセス生成物を除いた未Commitの変更がないこと
    - `npm ci` / `npm run lint` / `npm run test` / `npm run build` が実行できること
    - Profileの公開先が使えること。GitHub Pagesへ公開する `static-basic` と `daily-local-app` はPagesのSourceがGitHub Actionsであること。`on-local-data-use-ai-app` はVercelの認証と、秘密API KeyのServer Environment Variableが設定済みであること
    - 実行環境の現在時刻とTimezoneを実際に取得し、§2のDeadlineと同じ時間軸で残り時間を計算できること。両者のTimezoneが異なる場合は、以降のすべての時刻をどちらの時間軸で書くかを決め、`docs/goal-progress.md` の冒頭に取得した現在時刻とTimezoneとともに記録する
2. **仕様確認** — §1が `CONFIRMED` であること、§2に空欄や矛盾がないことを確認する。欠けていれば停止する。
3. **初期化** — Templateのままでは公開できないため、§2と選択したProfileに合わせて本Repository用に整える。次を全部行い、終えるまで手順4へ進まない。
    - Template固有のPlaceholder（`__APP_NAME__`、`__APP_DESCRIPTION__` など）を§2の内容へ置き換える。`src/` と `index.html` に、Template自身の宣伝文・説明文・Placeholderを残さない
    - `README.md` を本Appの説明へ書き換える。§2のApp名・目的・主要機能を書き、Template自身の使い方の説明（このTemplateからRepositoryを作る手順、ワークフロー14手順の一覧、Template自身の構成説明）を残さない。このRepositoryは公開されるため、残るとトップページを見た人が何のAppか判断できない
    - `package.json` の `name` をRepository名に合わせる
    - Vite baseを設定する。`static-basic` と `daily-local-app` は `/<repository_name>/`、`on-local-data-use-ai-app` は `/`
    - Deploy素材を配置する。GitHub Pagesへ公開する2つのProfileは `.github/workflow-templates/deploy-pages.yml.template` を `.github/workflows/deploy-pages.yml` へ複製する。`on-local-data-use-ai-app` は `deploy-templates/vercel.json.template` を `vercel.json` へ複製する。複製元にあるlint・test・buildのStepを削らない
    - Template固有の文字列を検索し、置き換え漏れが1件もないことを確認する
    - Template由来のApp Shell Testは、§2の仕様に対するTestへ置き換える。Template固有のDOMを前提としたTestは、置き換え後には対象が存在しないため成立しない。これは置き換えであって手順5が禁じるGate緩和や削減ではない。置き換え後のTestが§2の受け入れ条件と計算の境界を覆うこと
4. **実装** — §2の仕様を実装する。
5. **テスト** — `npm ci` / `npm run lint` / `npm run test` / `npm run build` / `git diff --check` を全部実行し、全PASSにする。Testの削除・skip・Gate緩和で通さない。
6. **独立レビュー** — 実装したContextとは別の新しいSubagent Contextで、次の2種を**両方**行い、それぞれの `APPROVED` / `BLOCKED` を記録する。片方だけで先へ進まない。実装した本人は承認しない。
    - **整合性レビュー**（`independent-code-reviewer`）— 変更Diffの全文と手順5のGate結果を渡し、§2の仕様との整合を検査させる。Reviewerはgitを実行するToolを持たないため、渡さなければ判断できない
    - **ベースラインレビュー**（`independent-baseline-reviewer`）— 変更Diffを渡さない。Repository全体を、はじめてcloneした人として検査させる。Templateから継承されたまま変更されていない記述・設定・Fileは、このRepositoryのDiffに現れないため、整合性レビューからは原理的に見えない。手順3の初期化が実際に済んでいるかは、この視点でしか検査できない
    2つのReviewerは互いのVerdictを入力にしない。同時に起動してよい。**両方が `APPROVED` のときにだけこの手順を `[x]` にする。** どちらかが `BLOCKED` なら手順7へ進む。
7. **BLOCKER修正** — 手順6の2種のどちらかが `BLOCKED` なら、`BLOCKED` になったレビューの指摘箇所だけ修正し、手順5と6をやり直す。やり直しでは2種のレビューを両方やり直す。実装が変わった以上、前回 `APPROVED` だった側のVerdictは失効しているためである。やり直しに入る前に、`docs/goal-progress.md` の手順5と手順6を `[ ]` へ戻し、周回数を1増やして記録する。この記録より先に修正を始めない。手順7自身は、やり直した手順6の2種が両方 `APPROVED` になった時点で `[x]` にする。それまで `[x]` にしない。やり直しは最大2周までとする。2周を終えてもなお `BLOCKED` の場合は、修正を続けず停止して人間に判断を求める。2回直して消えないBLOCKERは、実装ではなく§2の仕様に原因がある。
8. **Mobile確認** — 375px幅で§2の受け入れ条件の動線が使えることを確認する。
9. **Security確認** — Commit予定の内容に実Credentialや秘密情報がないことを確認する。見つけたら削除して誤魔化さず、停止して人間に報告する。
10. **Commit** — レビューを通った内容と、§5のプロセス生成物をCommitする。履歴の書き換えをしない。
11. **Push** — fast-forwardのみ。force pushしない。
12. **Deploy** — Profileの既定方式でDeployする。Vite baseとDeploy素材は手順3で配置済みである。Vercelの場合、秘密API KeyはServer Environment Variableだけに置く。
13. **本番確認** — Production URLで受け入れ条件の動線をMobile幅で確認し、結果を人間に報告する。
14. **証跡の確定** — 手順13までの記録を書き終えたうえで、§5のプロセス生成物に未Commitの変更が残っていればCommitしてPushする。fast-forwardのみ。手順10のCommitには手順10以降の結果を含められないため、この手順で証跡を閉じる。
    - 変更してよいのは§5のプロセス生成物だけである。それ以外のFileに未Commitの変更があれば、Commitせず停止して人間に報告する。手順9のSecurity確認を通っていない内容を混ぜないためである
    - **この手順は自身の行を `docs/goal-progress.md` へ書かない。** 完了は、プロセス生成物に未Commitの変更が残っていないことで判定する。何度実行しても同じ結果になる
    - このCommitはBuild成果物を変えないが、Push を契機にDeployが再度走る場合がある。生成物が変わらないため手順13の確認結果は失効しない

## 5. 進捗の記録

進捗は `docs/goal-progress.md` に記録する。§3のとおりAIは `docs/init-mvp-spec.md` の§2以外を書き換えないので、進捗はこのFileへ書く。

`docs/goal-progress.md`、`docs/spec-review.md`、`docs/code-review.md`、`docs/baseline-review.md` をプロセス生成物と呼ぶ。これらはAIが作り、証跡として手順10と手順14でCommitする。`.gitignore` へ入れない。

記録の対象は手順1から手順13である。手順14は自身の行を書かない。手順14の完了は、プロセス生成物に未Commitの変更が残っていないことで判定する。

手順1から13の各手順を終えるたびに、その手順の行を `[x]` にし、完了日時と根拠を1行で書く。停止した場合は `[ ]` のまま理由を書く。実行の必要がなかった手順も `[x]` にし、`NOT_RUN` と理由を書く。`PASS` とは書かない。手順7の周回数は、手順5と手順6を `[ ]` へ戻すのと同時に記録する。

完了日時は、その手順を終えた時点で実行環境のシステム時刻から実際に取得した値だけを書く。推定値、概算値、他から伝えられた時刻を起点に足し引きした値を書かない。取得できなかった場合は日時を書かず `時刻未取得` と書く。

記録は1手順ずつ、その手順を終えた直後に書く。複数の手順の結果をまとめて1回で書かない。まだ終えていない手順の行を、先回りして `[x]` にしたり完了日時を書いたりしない。

ワークフローを始めるときは、まず `docs/goal-progress.md` を読み、手順1から13のうち `[x]` になっていない最小番号の手順から再開する。完了済みの手順をやり直さない。手順1から13がすべて `[x]` になっていれば手順14を行う。手順7の周回数も読み戻し、2周を超えて繰り返さない。Fileが無ければ手順1から始め、このFileを作る。

## 6. 停止条件

次に当たる場合はワークフローを続けず、停止して人間に判断を求める。

- 仕様の欠落・矛盾により製品判断が必要
- 外部Serviceの初回認証、API Key発行、課金契約など人間にしかできない操作が必要
- Deadline超過が見込まれ、Scope削減の判断が必要
- 実Credentialの混入を検出した
