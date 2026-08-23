# Step 5 整合性レビュー（初回）

対象: `.devcontainer/devcontainer.json` へ `mounts` を1件追加する変更（Host側 `~/.claude/skills` をContainerへbind mountする）
視点: 変更Diffの全文と手順5のGate結果を、正本（`docs/init-mvp-spec.md` §4・§5 / `CLAUDE.md` / `README.md` / `profiles/*/PROFILE.md`）に照らして検査する

---

- Verdict: BLOCKED
- Blockers: 2
- Follow-ups: 5
- Ready to merge: NO

---

## Evidence

### 読んだもの

- `docs/init-mvp-spec.md`（全105行。§3実装ルール:34-41、§4ワークフロー14手順:43-79、§5進捗の記録:81-95、§6停止条件:97-104）
- `CLAUDE.md`（全40行。正本:5-7、実装原則:19-27、Profile:29-35、運用方針:37-39）
- `README.md`（全81行。考え方:5-9、使い方:11-33、ワークフロー14手順:35-59、構成:61-73、Gate:75-81）
- `profiles/static-basic/PROFILE.md` / `profiles/daily-local-app/PROFILE.md` / `profiles/on-local-data-use-ai-app/PROFILE.md`（3件全文）
- `.devcontainer/devcontainer.json`（変更後の全21行）、`.devcontainer/devcontainer-lock.json`、`.gitignore`
- 既存の独立レビュー証跡（`docs/template-reviews/` 11件のうち devcontainer に言及する `step3-baseline-review.md`:169-172、`step3-baseline-review-r1.md`:220-223、`step3-consistency-review.md`:80-82、`step4-consistency-review.md`）
- `.claude/` 配下の配布物一覧（`commands/spec.md`、`commands/goal.md`、`agents/independent-spec-reviewer.md`、`agents/independent-code-reviewer.md`、`agents/independent-baseline-reviewer.md`。**`.claude/skills/` はRepositoryに存在しない**）

### 変更の全量

`.devcontainer/devcontainer.json`:9-11 の3行追加のみ。他Fileの変更なし。

```json
"mounts": [
  "source=${localEnv:HOME}/.claude/skills,target=/home/node/.claude/skills,type=bind,readonly"
],
```

### 手順5のGate結果（渡された実測値・2026-08-17）

| Gate | 結果 |
|---|---|
| `npm run lint` | エラー0 |
| `npm run test` | `src/App.test.tsx` 2 tests passed |
| `npm run build` | 成功（`dist/index.html` 0.50 kB / `dist/assets/index-*.js` 194.42 kB） |
| `python3 -m json.tool` | Valid JSON |

**Gateは1件も緩められていない。** Testの削除・skip・`--passWithNoTests` 等の緩和、`eslint.config.js` / `vitest.config.ts` / `package.json` の scripts 変更は Diff に存在しない。`docs/init-mvp-spec.md`:64（手順5）および `CLAUDE.md`:25 への違反は無い。

**ただしこの4件は、今回の変更を1つも検証していない。** lint / test / build はいずれも `src/` と Vite の設定を対象とし、`.devcontainer/devcontainer.json` を読まない。`python3 -m json.tool` はJSONの**構文**のみを検査し、`mounts` の意味論（source が存在するか、変数が解決するか、Containerが起動するか）を一切検査しない。**したがって「全Gate PASS」は、この変更が動くことの証拠にならない。**

### BLOCKER判定基準の突き合わせ

| 基準 | 判定 |
|---|---|
| 正本の受け入れ条件を満たさない | **該当**（BLOCKER 1・2。`README.md`:3 が宣言する前提条件を壊す） |
| 正本にない機能が実装されている | グレー。devcontainerの設定は §2 のアプリ機能ではない。既存レビューは devcontainer の作者環境固定を FOLLOW_UP として扱った前例がある（`step3-baseline-review.md`:169-172、`step3-baseline-review-r1.md`:220-223）。**この前例に従い、単に「正本に無い」ことだけを理由にBLOCKERとはしない**（下記「前例との差」を参照） |
| Testの削除・skip・Gate緩和 | 該当なし（上表のとおり） |
| 秘密情報・実Credential・ローカル絶対Path | **該当なし。** `${localEnv:HOME}` は作者のHome Pathをリテラルで書かないための正しい機構であり、`/home/node/.claude/skills` はContainer内Pathで `remoteUser: node`（:20）と整合する。作者固有の絶対PathはCommit対象に入っていない |
| Profileの制約に反する | 該当なし。3Profileはいずれも Frontend / Data / AI境界 / 公開 / 必須Test を規定し、開発Containerに触れていない。`mounts` はBuild成果物にもClient Bundleにも入らない |
| 将来拡張のための抽象化・不要な新規Library | 該当なし。`package.json` は未変更、依存追加なし |
| `CLAUDE.md` の実装原則・運用方針に反する | **一部該当**（下記） |

`CLAUDE.md`:39（運用方針）は「実際に使って問題が起きたら、**その対処だけを `docs/init-mvp-spec.md` へルールとして追記する**」と定める。今回の変更は、対処を正本のルールとしてではなく、Documentのない環境設定として入れている。実装Contextは「Skillを読めるようにする」意図を主張しているが、その主張の当否とは独立に、**正本に1行も現れないまま配布物の起動条件が変わっている**。これはBLOCKER 1・2の背景であり、単独では FOLLOW_UP 1・2 として扱う。

### 前例との差（なぜ今回はFOLLOW_UPで済ませないか）

`.devcontainer/devcontainer.json`:16-18 の `TZ: Asia/Tokyo` と :7 の `docker-outside-of-docker` は、過去2回の独立レビューで「作者環境固定」として FOLLOW_UP 判定を受けている。今回も同種に見えるが、**壊れ方の種類が違う。**

- `TZ` 固定は劣化が緩やかである。JST以外の利用者でも Container は起動し、`docs/init-mvp-spec.md`:53（手順1）が実測を義務づけているため実害が吸収される
- `mounts` の bind は劣化しない。**source が解決できなければContainerが作成されない。** 手順1のPreflight（:47-53）は `git` / `gh` / `node` / `npm` / `gh auth` / Working Tree / npm各コマンド / 公開先 / 時刻を確認するが、**そのPreflightはContainerの中で走る。** Containerが起動しない利用者は手順1へ到達できず、Templateが用意した停止・報告の経路そのものが機能しない

`README.md`:3 は「必要なのは、良い `docs/init-mvp-spec.md` とClaude Code本体だけです」と宣言する。この変更は、そこに書かれていない**Host側の前提条件**を無言で追加する。PUBLIC Templateとして、この宣言は受け入れ条件に相当する。

### 実行しなかったこと

指示によりCommandを実行していない。Container Buildによる再現確認は行っていない。BLOCKER 1・2 は、`--mount` 形式と `${localEnv:...}` の**文書化された挙動**にもとづく判定である。**ただし、どちらの挙動に転んでも Diff に防御が無いことは、File Evidence だけで確定する** — `.devcontainer/devcontainer.json` に `initializeCommand` は無く（全21行に存在しない）、`mounts` を条件付きにする記述も、Host前提を述べるDocumentも、Repositoryのどこにも無い。

---

## BLOCKER

### BLOCKER 1: source が存在しないHostでContainerが作成できない。Diffに防御が無い

**File Evidence**: `.devcontainer/devcontainer.json`:9-11 / `README.md`:3 / `docs/init-mvp-spec.md`:47-53

`mounts` の各要素は Docker の `--mount` 形式でそのまま渡される。`--mount type=bind` は、`-v` と違い **source を自動作成しない。** source が存在しなければ Container の作成が失敗する（`bind source path does not exist`）。devcontainer の設定例で `initializeCommand` に `mkdir -p` を置く定石があるのは、この挙動への対処である。**この変更には `initializeCommand` が無い**（`.devcontainer/devcontainer.json` 全21行に存在しない）。

`~/.claude/skills/` は Claude Code が全利用者に必ず作るDirectoryではない。Skillを1つも置いていない利用者のHostには存在しない。**このTemplateをcloneする人の多数がその状態にある**と考えるのが自然である。Repository自身に `.claude/skills/` が無いこと（`.claude/` 配下は `commands/` 2件と `agents/` 3件のみ）が、Skillがこのテンプレートの配布物ではなく作者Host固有の資産であることを裏づける。

結果として、cloneした人が最初に行う「Reopen in Container」が失敗する。失敗Messageは `/home/node/.claude/skills` を指し、**このRepositoryのどのFileにも説明が無い**（`README.md`:11-33 の使い方、:61-73 の構成、`CLAUDE.md` 全文、`docs/init-mvp-spec.md` 全文のいずれにも `skills` および `mounts` の記述が無い）。利用者は原因に到達できない。

仮に環境によって source が自動作成される側に転んだ場合でも、**Repositoryをcloneしただけの人のHomeへ、Documentのない空Directoryが作られる**という副作用が残り、mount自体は空で機能しない。どちらに転んでも、`README.md`:3 の「必要なのは spec と Claude Code 本体だけ」は成立しなくなる。

`docs/init-mvp-spec.md`:47-53 の Preflight は Container 内で実行されるため、この失敗を検出も報告もできない。停止条件（:97-104）にも該当しない。**Templateが持つ唯一の防御機構より手前で壊れる。**

### BLOCKER 2: Windows Hostで `${localEnv:HOME}` が解決せず、意図しないPathを指す

**File Evidence**: `.devcontainer/devcontainer.json`:10

`${localEnv:VAR}` は、Host側にその環境変数が無い場合**空文字へ解決される**。Windowsは既定で `HOME` を定義せず、`USERPROFILE`（および `HOMEDRIVE`/`HOMEPATH`）を使う。したがってWindows HostでVS Codeを起動した場合、この行は

```text
source=/.claude/skills,target=/home/node/.claude/skills,type=bind,readonly
```

となり、利用者のHomeではなく**Filesystem Rootの `/.claude/skills`** を指す。この経路でも結果はBLOCKER 1と同じ（存在しないためContainer作成が失敗する）だが、**原因も対処も別である。** BLOCKER 1 を `initializeCommand` で塞いでも、この行は依然として誤ったPathを作りに行く。

Cross-platform を意図するなら `${localEnv:HOME}${localEnv:USERPROFILE}` の形が必要になる。この定石が存在すること自体が、`HOME` 単独が移植可能でないことの傍証である。

このRepositoryはWSL上に置かれており、作者の環境では `HOME` が定義されるため問題が表面化しない。**PUBLIC Templateは作者以外のHostで動く必要がある。** 手順5のGate（lint / test / build / JSON構文）はいずれもこの差を検出できない。

---

## FOLLOW_UP

1. **コーディング規約の正本がRepositoryの外へ分岐する** — `CLAUDE.md`:19-27 / `docs/init-mvp-spec.md`:34-41 / `.devcontainer/devcontainer.json`:10
   実装原則の正本は `CLAUDE.md` §実装原則 と `docs/init-mvp-spec.md` §3 である。Host側 `~/.claude/skills` を持ち込むと、**Repositoryからは存在も内容もVersionも検証できない第二の規約源**がContainer内のClaude Codeに与えられる。作者の手元で効いている規約が、cloneした人には存在しない。「同じTemplateから同じ手順で作れば同じ結果になる」という性質が、静かに失われる。Skillをこの Template の一部にするなら `.claude/commands/` `.claude/agents/` と同様にRepositoryへ入れる（`.claude/skills/`）ほうが、配布物としての一貫性がある。

2. **`README.md` にdevcontainerとHost前提の記述が無い** — `README.md`:11-33, 61-73 / `.devcontainer/devcontainer.json`:9-11
   「使い方」は `/spec` → 人間が `CONFIRMED` → `/goal` の3手順のみで、Containerに触れない。「構成」の列挙にも `.devcontainer/` が無い（`docs/`、`CLAUDE.md`、`.claude/commands/`、`.claude/agents/`、`docs/template-reviews/`、`profiles/`、`src/`、`.github/workflow-templates/`、`deploy-templates/` の9項目）。BLOCKER 1・2 を技術的に解決した後も、**Host側に何を置けば何が有効になるのか**を利用者が知る手段が無い状態は残る。

3. **target Pathが `remoteUser` と image に暗黙依存している** — `.devcontainer/devcontainer.json`:3, 10, 20
   `/home/node/.claude/skills` は `"remoteUser": "node"`（:20）と `javascript-node` image（:3）を前提とする。将来 `remoteUser` や image を変えると、この1行だけが取り残されて無言で機能しなくなる。`${containerEnv:HOME}` 等で追随させる余地がある。

4. **手順3の初期化が `.devcontainer/devcontainer.json` を対象外にしており、継承される作者固有設定が1件増えた** — `docs/init-mvp-spec.md`:55-62 / `.devcontainer/devcontainer.json`:9-11, 16-18
   手順3が触れるのは Placeholder、`README.md`、`package.json` の `name`、Vite base、Deploy素材であり、`.devcontainer/devcontainer.json` は対象に含まれない。既存の `TZ: Asia/Tokyo`（:16-18）と `docker-outside-of-docker`（:7）は、過去2回のレビューで同じ理由により FOLLOW_UP 判定を受けている（`docs/template-reviews/step3-baseline-review.md`:169-172、`step3-baseline-review-r1.md`:220-223）。今回の `mounts` で、**このTemplateから作られる全アプリRepositoryへ無言で引き継がれる作者環境固有の設定が3件目になった。** アプリ側では `~/.claude/skills` を使う手順がどこにも無いため、継承された時点で用途を持たない。

5. **devcontainerの変更を検証するGateが存在しない** — `docs/init-mvp-spec.md`:64 / `README.md`:75-81
   手順5のGateは `npm ci` / `lint` / `test` / `build` / `git diff --check` であり、いずれも `.devcontainer/` を読まない。今回追加で行われた `python3 -m json.tool` もJSON構文までしか見ない。**「Gate全PASS」が「devcontainerの変更が安全」を意味しないこと**が今回の事例で実証された。devcontainerを変更する場合に何をもって検証とするかを決めておく余地がある（例: Container のRebuildを実際に1回通すことを、devcontainer変更時の追加確認とする）。

---

## 判定の要約

Gateは緩められておらず、秘密情報もローカル絶対Pathも混入しておらず、依存も増えていない。**この変更が止まるのは、実装の質ではなく、PUBLIC Templateとしての起動条件が壊れるためである。**

3行の追加はすべて作者Hostの状態を前提としており、その前提はRepositoryのどこにも書かれておらず、失敗しても防御・検出・報告の経路が無い。`README.md`:3 が宣言する「必要なのは spec と Claude Code 本体だけ」は、この変更後は成立しない。

Blockers 2 / Follow-ups 5 / Ready to merge: NO。
