# Step 5 整合性レビュー（周回1 / BLOCKER修正後の再レビュー）

- Verdict: APPROVED
- Blockers: 0
- Follow-ups: 7
- Ready to merge: YES

対象: `.devcontainer/devcontainer.json` の `mounts` 1件（Host側 `~/.claude/skills` をContainerへbind mount）と、`README.md` へ新設された `## 開発コンテナ` 節
視点: 変更Diffの全文と手順5のGate結果を、正本（`docs/init-mvp-spec.md` §3・§4・§5 / `CLAUDE.md` / `README.md` / `profiles/*/PROFILE.md`）に照らして検査する

**本レビューは初回Verdict（BLOCKED / Blockers 2）に拘束されず、独立に判定した。** 初回BLOCKER 2件の解消可否は下記「初回BLOCKERの解消判定」に明記する。

---

## Evidence

### 読んだもの

- `docs/init-mvp-spec.md`（全105行。§3実装ルール:34-41、§4ワークフロー:43-79、§5進捗の記録:81-95、§6停止条件:97-104）
- `CLAUDE.md`（全40行。正本:5-7、実装原則:19-27、Profile:29-35、運用方針:37-39）
- `README.md`（全99行。考え方:5-9、使い方:11-33、**開発コンテナ:35-51（新設）**、ワークフロー14手順:53-77、構成:79-91、Gate:93-99）
- `profiles/static-basic/PROFILE.md`（33行）/ `profiles/daily-local-app/PROFILE.md`（47行）/ `profiles/on-local-data-use-ai-app/PROFILE.md`（39行）全文
- `.devcontainer/devcontainer.json`（変更後の全21行）、`.devcontainer/devcontainer-lock.json`
- `docs/template-reviews/step5-consistency-review.md`（初回。BLOCKER 2件の定義を正確に引くため。**上書きしていない。本Fileは新規作成である**）
- Repository全体の `skills` / `devcontainer` / `mounts` / `localEnv` 出現箇所（`docs/template-reviews/` を除いて全走査。ヒットは `README.md`:37,39,42,47,49 と `.devcontainer/` 配下のみ）

### 変更の全量（実File読解で確認）

`.devcontainer/devcontainer.json`:9-11

```json
"mounts": [
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/.claude/skills,target=/home/node/.claude/skills,type=bind,readonly"
],
```

`README.md`:35-51 に `## 開発コンテナ` 節（17行）。`## ワークフロー14手順`（:53）の直前。記述内容は、(a) Mountの目的:37、(b) Host側 `~/.claude/skills` を先に作る前提:39-43、(c) 作らなかった場合に起きること:45、(d) 不要なら3行削除してよい・Templateの動作は依存しない:47、(e) `${localEnv:HOME}${localEnv:USERPROFILE}` 連結の理由:49、(f) Target Pathの `remoteUser: node` 依存:51。

他Fileの変更は無い。`package.json`、`eslint.config.js`、`vitest.config.ts`、`src/`、`profiles/`、`docs/init-mvp-spec.md`、`CLAUDE.md` はいずれも今回のDiffに現れない。

### 手順5のGate結果（渡された実測値・2026-08-17）

| Gate | 結果 |
|---|---|
| `npm run lint` | エラー0 |
| `npm run test` | 2 tests passed |
| `npm run build` | 成功 |
| `.devcontainer/devcontainer.json` | Valid JSON |

**Gateは1件も緩められていない。** Testの削除・skip・`--passWithNoTests` 等の緩和、Gate設定Fileの変更はDiffに存在しない。`docs/init-mvp-spec.md`:64（手順5）および `CLAUDE.md`:25 への違反は無い。

**ただし初回レビューが指摘したとおり、この4件は今回の変更を1つも検証していない。** lint / test / build は `.devcontainer/` を読まず、JSON構文検査は `mounts` の意味論を検査しない。この状況は今回も変わっていない（FOLLOW_UP 7）。**「全Gate PASS」を、この変更が動くことの根拠としては採用していない。** 本Verdictは正本の記述とDiffの内容だけから導いた。

### BLOCKER判定基準の突き合わせ

| 基準 | 判定 |
|---|---|
| 正本の受け入れ条件を満たさない | **該当なし。** 変更後は正本（`README.md`:35-51）自身がこのMountの前提・症状・削除手段・Path解決の理由・Target Pathの依存を記述しており、設定と正本が整合している。`README.md`:47 が「Templateの動作はこのMountに依存しない」と明示し、`docs/init-mvp-spec.md` §4の14手順の受け入れ条件はこのMountに一切依存しない |
| 正本にない機能が実装されている | **該当なし。** 変更後は `README.md`:35-51 に記述がある。§2（アプリ仕様）は本Repositoryでは空であり、devcontainerはアプリ機能ではない。既存レビューはdevcontainerの作者環境固定をFOLLOW_UP扱いとした前例を持つ |
| Testの削除・skip・Gate緩和 | **該当なし**（上表のとおり） |
| 秘密情報・実Credential・ローカル絶対Path | **該当なし。** `${localEnv:...}` は作者のHome Pathをリテラルで書かないための機構であり、`/home/node/.claude/skills` はContainer内Pathで `remoteUser: node`（:20）と整合する。Commit対象に作者固有の絶対Pathは無い |
| Profileの制約に反する | **該当なし。** 3Profileは適用範囲 / Frontend / Data / AI境界 / 公開 / 必須Test / Deadline Risk を規定し、開発Containerに触れていない（3件全文確認）。`mounts` はBuild成果物にもClient Bundleにも入らない |
| 将来拡張のための抽象化・不要な新規Library | **該当なし。** `package.json` 未変更、依存追加なし。Mountは1件・平文1行で、抽象化層を作っていない |
| `CLAUDE.md` の実装原則・運用方針に反する | **BLOCKER相当としては該当なし。** `CLAUDE.md`:39 は「対処だけを `docs/init-mvp-spec.md` へルールとして追記する」と定めるが、今回の対処は `README.md` へ記述された。14手順のRuleではなく開発環境の説明であり、追記先として `README.md` は不合理でない。**ただし、Skill（＝Coding規約）の正本がRepository外へ分岐する構図は残る**（FOLLOW_UP 5） |

### 実行しなかったこと

**指示によりCommandを実行していない。** Container Build、`git`、`npm` のいずれも実行していない（File一覧の取得と行数確認のみ read-only で行った）。したがって以下は実測ではない。

- Container作成時の実挙動（source不在時にDockerが失敗するか自動作成するか）
- Container内 `/home/node/.claude` の所有者（FOLLOW_UP 1）

これらは `--mount` の**文書化された挙動**にもとづく判定であり、その旨を各項に明記した。**File Evidenceだけで確定するのは、Diffに `initializeCommand` が無いこと**（`.devcontainer/devcontainer.json` 全21行に存在しない）**と、変更後の正本にこのMountの説明が存在すること**（`README.md`:35-51）**の2点である。**

---

## 初回BLOCKERの解消判定

### 初回BLOCKER 1「source が存在しないHostでContainerが作成できない。Diffに防御が無い」 → **解消（判定: BLOCKERから外す）**

**File Evidence**: `README.md`:39-47 / `.devcontainer/devcontainer.json`:9-11

技術的な防御（`initializeCommand` による `mkdir -p`）は**追加されていない。** `.devcontainer/devcontainer.json` の全21行に `initializeCommand` は無い。この事実は変わっていない。

それでもBLOCKERから外す理由は次の3点である。

1. **初回BLOCKER 1の核心は「利用者が原因に到達できない」ことだった**（初回レビュー:89「このRepositoryのどのFileにも説明が無い ... 利用者は原因に到達できない」）。この点は解消した。`README.md`:39 が前提を、:45 が症状を、:47 が「不要なら3行削除してよい」という退避路を、それぞれ明示している。Repositoryを開いた人が原因と対処へ到達する経路が正本上に存在する。
2. **`README.md`:47 が「Templateの動作はこのMountに依存しない」と明言し、この機能をOptionalとして正本に位置づけた。** `README.md`:3 の「必要なのは、良い `docs/init-mvp-spec.md` とClaude Code本体だけです」は、Mountを削除すれば成立する形で整合が取られている。
3. **`initializeCommand` を置かない選択に合理性がある。** `initializeCommand` はHost側のShellで実行されるため、`mkdir -p` はWindowsのcmd.exeでは成立しない。Cross-platformなTemplateとして、壊れる可能性のある自動処理を入れずDocumentで前提を示すのは、`CLAUDE.md`:23（将来拡張のための抽象化をしない）および:39（最初から問題を想像して仕組みを増やさない）と矛盾しない。

**ただし `README.md`:45 の失敗Modeの記述は、`--mount` の文書化された挙動と食い違う。** これは残存する欠陥であり、FOLLOW_UP 2として記録する。**Documentが誤っていることは、Documentが存在しないこととは別の重さである** — 利用者は `.claude/skills` を含むError Messageから `## 開発コンテナ` 節へ到達でき、そこに書かれた対処（`mkdir -p` または3行削除）はどちらの挙動でも有効である。したがって公開を止める理由にはならない。

### 初回BLOCKER 2「Windows Hostで `${localEnv:HOME}` が解決せず、意図しないPathを指す」 → **解消**

**File Evidence**: `.devcontainer/devcontainer.json`:10 / `README.md`:49

`source=${localEnv:HOME}${localEnv:USERPROFILE}/.claude/skills` への変更により、初回が指摘した経路（Windowsで `HOME` が空へ解決し `source=/.claude/skills` がFilesystem Rootを指す）は塞がれた。`${localEnv:VAR}` は未定義時に空文字へ解決されるため、連結は「存在する側だけが展開される」形になる。これはCross-platformなdevcontainer設定の定石であり、初回レビュー:107 が対処として名指ししたものと同一である。

- macOS / Linux / WSL: `HOME` のみ定義 → `$HOME/.claude/skills`（正）
- Windows（既定）: `USERPROFILE` のみ定義 → `%USERPROFILE%/.claude/skills`（正）

加えて `README.md`:49 が連結の理由を記述しており、将来この行を見た人が「冗長だ」と誤って片方を削る事故を防いでいる。

**残余リスクは存在するが、BLOCKERではない。** WindowsでもGit for Windows由来のShellから起動した場合など `HOME` が定義されている環境があり、その場合は両方が展開されて連結された不正Pathになる。ただしこれは即時のContainer作成失敗として表面化し、`README.md`:49 が連結の意図を説明しているため原因に到達できる。FOLLOW_UP 3として記録する。

---

## BLOCKER

**なし。**

判定基準7項目のいずれにも該当しない。Gateは緩められておらず、秘密情報・実Credential・ローカル絶対Pathの混入は無く、Profileの制約に反せず、依存も抽象化も増えていない。初回BLOCKER 2件は上記のとおりいずれも解消と判定した。

---

## FOLLOW_UP

**以下はいずれも単独で公開を止めない。** 1から4は本周回で新たに識別したもの、5から7は初回FOLLOW_UPのうち今回のDiffで扱われなかったものである。初回FOLLOW_UP 5件が意図的に未対応であることは承知しており、**それを理由にBLOCKEDとしていない。**

1. **[新規・未検証] Container内 `/home/node/.claude` の所有者がrootになる可能性** — `.devcontainer/devcontainer.json`:10, 20
   Docker はMount Targetの親Directoryが存在しない場合、Container内にそれをroot所有で作成する。`/home/node/.claude` がImageとFeatureのBuild時点で `node` 所有として作られていない場合、この行によって `/home/node/.claude` がroot所有になり、`remoteUser: node`（:20）で動くContainer内のClaude Codeが自身の設定・認証情報を `~/.claude/` へ書けなくなる余地がある。**これはHost側ではなくContainer側で起きる、`README.md`:45 が述べるのと同型の問題である。**
   **本項は未検証である。** `ghcr.io/anthropics/devcontainer-features/claude-code:1.0`（:6）がBuild時に `/home/node/.claude` を作るなら発生しない。指示によりCommandを実行していないため確認していない。検証方法はContainerをRebuildして `ls -la /home/node/` と `ls -la /home/node/.claude/` を1回見ることである。**Mountを導入した以上、この1回の確認は行う価値がある。**

2. **[新規] `README.md`:45 の失敗Modeの記述が `--mount` の文書化された挙動と食い違う** — `README.md`:45 / `.devcontainer/devcontainer.json`:9-11
   :45 は「作らずに起動すると、Dockerがそのフォルダを `root` 所有で自動作成する」「**Containerは正常に起動するため、壊れたことに気づきにくい**」と書く。しかし devcontainer.json の `mounts` の各要素はDocker CLIの `--mount` 形式として渡され、`--mount type=bind` は `-v` と異なり **source を自動作成せず、`bind source path does not exist` でContainer作成に失敗する**（自動作成は `-v` 側の挙動である）。
   実際の症状は「静かに壊れる」ではなく「即座に失敗する」であり、**記述は利用者に不利な側へではなく、有利な側の現象を過小に描いている**（起動してしまうと書いているが実際は起動しない）。対処（`mkdir -p` または3行削除）はどちらの挙動でも有効なため実害は限定的だが、**Error Messageと節の記述が食い違うと、利用者が「自分の症状は別物だ」と判断して節を読み飛ばす。** :45 を実挙動に合わせるか、実際にsourceを消してRebuildし、観測した症状をそのまま書くのが望ましい。

3. **[新規] `README.md`:49「Windowsには `HOME` が無く」は過度な一般化（初回BLOCKER 2の残余）** — `README.md`:49 / `.devcontainer/devcontainer.json`:10
   Windowsの**既定**では `HOME` は未定義だが、Git for Windows系のShellから起動した場合や利用者が明示設定した場合には定義される。その環境では `${localEnv:HOME}` と `${localEnv:USERPROFILE}` の両方が展開され、`C:\Users\nameC:\Users\name/.claude/skills` のような不正Pathになる。連結という手法自体は正しく、これは定石が元来持つ既知の限界である。:49 を「存在する側だけが展開される」から「**両方が定義されている環境では連結され不正Pathになる。その場合は片方を消す**」まで書き足すと、利用者が症状から対処へ到達できる。

4. **[新規] Mountが既定で有効であり、Opt-outの形になっている** — `.devcontainer/devcontainer.json`:9-11 / `README.md`:39, 47
   現状、cloneした人は「先に `mkdir -p ~/.claude/skills` する」か「3行を削除する」かの**いずれかの行動を取らなければContainerを起動できない。** どちらもDocumentされているため詰まりはしないが、**何もしなくても起動する**状態にはなっていない。Host側資産に依存する機能は既定で無効（JSONにはCommentを書けないため、`mounts` を空にしてREADMEへ追加手順として掲載する等）にすれば、Host前提そのものが消える。`README.md`:3 の宣言と最も素直に整合するのはこの形である。

5. **[継続・初回FOLLOW_UP 1] Coding規約の正本がRepositoryの外へ分岐する** — `CLAUDE.md`:19-27 / `docs/init-mvp-spec.md`:34-41 / `.devcontainer/devcontainer.json`:10
   実装原則の正本は `CLAUDE.md` §実装原則 と `docs/init-mvp-spec.md` §3 である。Host側 `~/.claude/skills` を持ち込むと、Repositoryからは存在も内容もVersionも検証できない第二の規約源がContainer内のClaude Codeへ与えられる。作者の手元で効いている規約が、cloneした人には存在しない。Repository全走査でも `.claude/skills/` は存在せず、配布物は `.claude/commands/` 2件と `.claude/agents/` 3件のみである。Skillをこの Templateの一部にするなら、`commands` / `agents` と同様にRepositoryへ入れるほうが配布物として一貫する。

6. **[継続・初回FOLLOW_UP 2および4] 手順3の初期化が `.devcontainer/` と新設節を対象外にしている** — `docs/init-mvp-spec.md`:55-62 / `README.md`:35-51, 79-91 / `.devcontainer/devcontainer.json`:9-11, 16-18
   初回FOLLOW_UP 2（READMEに記述が無い）は本周回で**解消した**（:35-51 が新設された）。残るのは次の2点である。
   - 「構成」節（:79-91）の9項目に `.devcontainer/` が依然として無い。節は新設されたが、構成一覧との整合は取られていない
   - `docs/init-mvp-spec.md`:57（手順3）が `README.md` から除去を命じるのは「このTemplateからRepositoryを作る手順、ワークフロー14手順の一覧、Template自身の構成説明」であり、`## 開発コンテナ` 節はどれにも該当しない。したがって**この節は派生App Repositoryへそのまま継承される。** :47 の「**Template**の動作はこのMountに依存しない」という文はApp Repositoryでは意味を失い、:39 は用途の無いHost前提をApp利用者へ課す。作者環境固有の継承物は `TZ: Asia/Tokyo`（:16-18）、`docker-outside-of-docker`（:7）に続き3件目である

7. **[継続・初回FOLLOW_UP 5] devcontainerの変更を検証するGateが存在しない** — `docs/init-mvp-spec.md`:64 / `README.md`:93-99
   手順5のGateは `npm ci` / `lint` / `test` / `build` / `git diff --check` であり、いずれも `.devcontainer/` を読まない。今回追加で行われたJSON構文検査も意味論を見ない。**本周回でも、修正が実際に効くかを検証したGateは1つも無い。** BLOCKER 1・2の修正がどちらも「Documentと1行の書き換え」で構成されている以上、この状態は初回より重い。devcontainerを変更したときはContainer Rebuildを1回通すことを追加確認とする、といった取り決めを置く余地がある（FOLLOW_UP 1の検証もこれで同時に片づく）。

---

## 判定の要約

初回BLOCKER 2件は、いずれも解消と判定した。

- **BLOCKER 2は技術的に解消した。** `${localEnv:HOME}${localEnv:USERPROFILE}` の連結により、Windows / macOS / Linux / WSL のいずれでも利用者のHome配下を指す
- **BLOCKER 1は、技術的防御ではなく正本への記述で解消した。** `initializeCommand` は追加されていない。しかし初回BLOCKERの核心だった「Repositoryのどこにも説明が無く、利用者が原因に到達できない」状態は無くなり、退避路（3行削除）も正本に明示された。`README.md`:47 がこのMountをOptionalと位置づけたことで、:3 の宣言との整合も取れている

判定基準7項目のいずれにも該当しない。Gate緩和なし、秘密情報・ローカル絶対Pathなし、Profile違反なし、依存追加なし、抽象化なし。

残る7件はいずれもFOLLOW_UPである。うち**FOLLOW_UP 1（Container内 `/home/node/.claude` の所有者）とFOLLOW_UP 2（失敗Modeの記述が実挙動と食い違う）は、Container Rebuildを1回行えば両方まとめて確定する。** 公開を止める必要は無いが、次に `.devcontainer/` を触るときに最初に片づける2件として推奨する。

Blockers 0 / Follow-ups 7 / Ready to merge: YES。
