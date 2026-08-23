# MVP要求入力（init-mvp-spec）

このファイルは **Tech Transfer Market MVP** のHuman-confirmed requirement inputであり、実装時の最上位の製品仕様である。

Codexは本書にない重要な製品判断を勝手に追加しない。実装詳細で合理的に一意に決められる事項は自律的に決定してよいが、MVPの機能範囲・ゲームルール・主要UI・データ意味を変更してはならない。

---

# 1. 実装開始条件

```yaml
status: CONFIRMED
product_name: Tech Transfer Market
primary_implementation_agent: codex
runtime_validation: zod
required_implementation_skills:
  - frontend-patterns
  - coding-standards
selected_profile: daily-local-app
deployment_target: vercel
primary_device: iPhone Safari
mvp_target: 1-day playable MVP
delivery_timezone: Asia/Tokyo
delivery_start: 2026-08-23T15:49:00+09:00
absolute_deadline: 2026-08-24T15:49:00+09:00
```

`status` が `CONFIRMED` でない場合はImplementationへ進まない。

本ProjectではHuman Decisionにより、`daily-local-app` ProfileのFrontend Framework、Deploy Target、画面数に関する制約だけを上書きし、Next.js App Router、Vercel、および既存Game Flowに必要な7種類の主要画面を採用する。Profileのその他の制約およびMandatory Gateは維持する。Deadlineは仕様修正時刻へリセットしない。

---

# 2. アプリ固有仕様

## 2.1 プロダクト概要

**Tech Transfer Market** は、サッカーの移籍市場・クラブ経営ゲームの体験を、現実の日本のITエンジニア採用市場へ置き換えた、1ユーザー向けのモバイルファーストWebゲームである。

プレイヤーはスタートアップのCEO / Product Managerとして会社を設立し、案件を選び、移籍市場に並ぶ架空のエンジニアを技術スタック・能力・市場相場・希望年俸・案件適合度で比較して獲得する。

獲得したエンジニアで3人までのチームを組み、案件を実行し、結果・個人Performance・報酬を確認する。1案件目の成果を使って2案件目で残留・放出・補強を行い、2案件終了時に10社リーグでシーズン順位を確認する。

コンセプトは次で固定する。

> **現実の日本エンジニア市場 × サッカー移籍市場 × 技術スタック適合 × チーム経営ゲーム**

アプリの差別化の中心は、単にOVRの高い人材を獲得するのではなく、**案件適合・移籍市場レンジ・希望年俸・人件費効率から「掘り出し物」を見つけること**にある。

---

## 2.2 プロダクトゴール

MVPの主要機能は次の3つと定義する。

1. **Project / Season Progression**: Company Setup、Project選択、2案件で1Season、Project 2選択後のRetention Decision、Season Reset。
2. **Transfer Market / Team Management**: Engineer Market、Filter / Sort、Engineer Detail、最大3人のTeam編成、Hire / Retain / Release、Salary Budget管理、Project適合表示。
3. **Development / Evaluation**: Development進行、Project Score計算、Result、Individual Performance、Reward、Salary Budget Growth、10社League Ranking、CEO Rating、BEST ENGINEER。

各画面、Modal、Animation、Sticky Header、Bottom Navigation、市場評価、計算処理などは上記3主要機能を成立させるSub-featureまたはPresentation要件であり、独立したMajor Featureとして数えない。既存のゲームループとAcceptance Criteriaは削除しない。

MVPで利用者が達成できることは次の通り。

1. 自分の会社名を決めて会社を設立する。
2. 5件の案件から1件を選ぶ。
3. 案件の必要戦力・推奨技術を確認する。
4. 15人の移籍市場からエンジニアを比較する。
5. 年間人件費枠2,000万円以内で最大3人を獲得する。
6. 案件適合を確認し、チームを編成する。
7. 短い開発演出を見て案件結果を確認する。
8. チーム結果と個人Performanceを確認する。
9. 1案件目の成果で増えた人件費枠を使い、2案件目を選ぶ。
10. 1案件目のPerformanceと2案件目の要件を見て残留・放出を判断する。
11. 必要なら移籍市場から再補強する。
12. 2案件目を完了する。
13. 10社リーグの最終順位、CEO RATING、BEST ENGINEERを確認する。
14. 「最初からやり直す」で新しいシーズンを開始する。

---

## 2.3 MVP完成条件

以下をすべて満たした場合だけMVP完成とする。

- Vercel Productionへ公開されている。
- Production URLが取得できる。
- iPhone優先のモバイルUIで主要操作が成立する。
- 会社設立から2案件完了・シーズン順位表示まで1シーズンを完走できる。
- ブラウザを閉じて再度開いてもlocalStorageからシーズン途中を復元できる。
- 「最初からやり直す」で初期状態へ戻せる。
- 15人のEngineer Seed、5件のProject Seed、9社のCompetitor Seedが仕様どおり存在する。
- OVR、案件適合、移籍市場評価、案件結果、Performance、人件費枠増加、会社スコア、リーグ順位が本書の計算ルールに従う。
- lint / test / buildがPASSする。
- Independent Specification ReviewがPASSする。
- `frontend-patterns` / `coding-standards` SkillがCodexから検出され、Implementationで使用される。
- Independent Code ReviewがPASSする。
- Secret / Security GateがPASSする。
- Production SmokeがPASSする。
- Mobile / Responsive GateがPASSする。
- 重大なconsole error、未処理例外、横方向ページoverflowがない。

人間による最終的な見た目・操作感・実機Safariの好みの確認はHuman Smartphone Acceptanceとして自動Gateの外に残す。

---

## 2.4 MVPに含むもの

- 1ユーザー向けWebアプリ。
- Next.js + React + TypeScript。
- ZodによるRuntime Validation。
- iPhone Safariを第一対象とするレスポンシブUI。
- Vercel Production Deployment。
- localStorageによる端末内保存。
- 会社設立。
- 5案件。
- 15人の架空エンジニア。
- Frontend / Backend / Infrastructureの3職種。
- 3人までの自由編成。
- 案件別の推奨職種スロット。
- 技術スタックによる案件適合。
- OVR。
- `ELITE / STAR / PRO / SOLID / ROOKIE` のレアリティ。
- 市場評価1〜5。
- `移籍市場 750〜850万円` 形式の相場表示。
- 希望年俸。
- `GOOD VALUE｜割安 / FAIR VALUE｜適正 / PREMIUM｜割高` の移籍市場評価。
- 職種フィルター。
- 並び替え。
- Engineer詳細モーダル。
- Project詳細モーダル。
- 獲得確認。
- 放出。
- 1〜2人での案件開始と警告。
- 3〜5秒程度の開発演出。
- プロジェクト総合評価 `S+ / S / A / B / C / D`。
- 納期 / 品質 / 安定性評価。
- 個人Performance。
- MVP ENGINEER。
- 個人コメント。
- 案件報酬。
- 会社資金。
- 人件費枠増加。
- 2案件で1シーズン。
- 1案件目後の残留 / 放出 / 再補強。
- 10社リーグ順位。
- CEO RATING。
- BEST ENGINEER。
- リセット。

---

## 2.5 MVPに含めないもの

以下はMVPで実装しない。

- 認証。
- 複数ユーザー。
- Django。
- Django REST Framework。
- PostgreSQLその他のServer Database。
- Server API。
- クラウド同期。
- 複数端末同期。
- 実在人物データ。
- 実在企業データ。
- 求人サイトAPIとのリアルタイム連携。
- 市場年俸の自動更新。
- 給与交渉。
- オファー拒否。
- 移籍金。
- 昇給交渉。
- 契約年数。
- 退職。
- 解雇補償。
- 3案件以上のシーズン。
- 次シーズンへの永続成長。
- 動的な競合AI。
- 他社の実時間シミュレーション。
- ランダムイベント本文（仕様変更、障害など）。
- 個人へのタスク割り当て。
- スプリント管理。
- 待ち時間が数分以上の実時間ゲーム。
- ネイティブiOSアプリ。
- 課金。
- 広告。
- SNS共有。
- 管理画面。
- 外部画像検索。
- 実在人物の顔写真。
- 生成AI API。

将来のDjango / PostgreSQL化を見越してRepository境界は作るが、MVPでBackendを先回り実装しない。

---

## 2.6 1シーズンのゲームフロー

状態遷移は次で固定する。

```text
COMPANY_SETUP
↓
PROJECT_1_SELECT
↓
TEAM_1_BUILD
↓
DEVELOPMENT_1
↓
RESULT_1
↓
PROJECT_2_SELECT
↓
RETENTION_DECISION
↓
TEAM_2_BUILD
↓
DEVELOPMENT_2
↓
RESULT_2
↓
SEASON_COMPLETE
↓
RESET → COMPANY_SETUP
```

重要な順序を変更しない。

### 2.6.1 1案件目

```text
会社設立
→ 5案件から1件選択
→ Marketで採用
→ Clubで最終確認
→ Development
→ Result
```

案件を選ぶ前にMarketで採用させない。会社設立後の初期遷移先はProjectsとする。

### 2.6.2 2案件目

```text
1案件目Result
→ 残り4案件から2案件目を選択
→ 次案件の要件を確認
→ 既存3人について残留 / 放出を判断
→ 空いた枠をMarketで補強
→ Clubで最終確認
→ Development
→ Result
→ Season
```

1案件目で選んだ案件を2案件目に再選択できない。

---

## 2.7 ナビゲーション

本アプリでは既存Game Flowを成立させるため、主要画面をCompany Setup、Project Select、Club / Team、Transfer Market、Development、Project Result、Season Completeの7種類とする。Engineer DetailとProject DetailなどのModalは独立した主要画面として数えない。`daily-local-app` Profileの「1〜数画面」という制約は画面数に限って例外とし、追加機能、追加Backend、追加Architecture、追加Workflowを許可しない。既に確定した3 Major Features分類、2案件1Season、最大3人Team、MVP OUT、その他の軽量化制約は維持する。

通常の計画フェーズでは画面下部に固定Bottom Navigationを表示する。

```text
CLUB | MARKET | PROJECTS
```

- `MARKET`を中央に配置し、3タブの中で最も存在感を強くする。
- 選択中タブはApple的なピル型背景または同等の明確な選択状態で示す。
- 通常時はDark Surfaceへ自然に溶け込ませ、過度な発光や常時派手なGradientを使わない。
- Bottom NavigationはiPhone Safe Areaを考慮する。
- `DEVELOPMENT`、`RESULT`、`SEASON_COMPLETE` は専用画面とし、Bottom Navigationを表示しない。
- `COMPANY_SETUP` も専用画面とする。
- Project未選択時はMarketを操作不可とし、案件選択を促す。
- 2案件目の残留判断フェーズではClubを主画面とする。

---

## 2.8 Company Setup仕様

初回起動またはReset後は会社設立画面を表示する。

表示:

- `TECH TRANSFER MARKET`
- `Build your engineering club.`
- Company Name入力欄
- Company Name入力欄および開始CTA付近の小さな補足Textとして、次を表示する。Modal、同意Checkbox、Blocking Dialogにはしない。

  ```text
  ゲームデータはこの端末・ブラウザ内に保存されます。
  ブラウザデータの削除や端末変更などにより、
  データが失われる場合があります。
  ```

- `会社を設立する`

ルール:

- 会社名はtrim後1〜30文字。
- 空文字では開始できない。
- 初期会社資金は `0万円`。
- 初期年間人件費枠は `2,000万円`。
- 初期チームは0人。
- 初期実績は0案件。
- 会社設立後はProjectsへ移動する。

---

## 2.9 Club画面仕様

Clubは会社・チーム・案件・予算の最終確認画面である。

### 2.9.1 表示項目

- 会社名。
- 現在のSeason進捗 `PROJECT 1 / 2` または `PROJECT 2 / 2`。
- 会社資金。
- 年間人件費枠。
- 使用中年俸。
- 残り年俸枠。
- 選択中案件の要約。
- My Team 3枠。
- Team案件適合率。
- `開発開始`。

### 2.9.2 My Team 3枠

My Teamは、単なる3枚横並びではなく、**サッカーのフォーメーションを想起させる3枠配置**で表示する。

- 3枠すべてをiPhone viewport内で同時に認識できる。
- 基本配置は上段1枠＋下段2枠など、3人チームとして視覚的にまとまる構図とする。
- 各枠は小型Engineer CardまたはEngineer Chipとして表示する。
- 空き枠は`EMPTY`と表示する。
- 選択中案件の`recommendedSlots`を、各枠の背景またはLabelとして薄く表示する。
- 推奨職種はガイドであり強制ではない。
- Frontend×3、Backend×2+Infrastructure×1など自由編成を許可する。
- Engineerを配置した後も、その枠の推奨Roleを補助情報として確認できる。
- Engineer CardをTapすると詳細を確認できる。
- 狭いViewportでも3枠を縦に単純積み上げてフォーメーション性を失わせない。必要ならCard内部情報を減らす。

### 2.9.3 開発開始

0人では開始不可。

1人または2人の場合は確認前に警告する。

```text
チームが3人揃っていません
成功率が大きく下がります。
現在: 2 / 3人
案件適合: 61%
```

`戻る / このまま開始`

3人の場合、通常の最終確認へ進む。

```text
このチームで開発を開始しますか？
案件: <project name>
チームコスト: 1,920 / 2,000万円
技術マッチ: 86%
```

`キャンセル / 開発開始`

開始を確定した時点でProject Random Seedを1回だけ生成して保存する。

---

## 2.10 Projects画面仕様

5案件を表示する。

### 2.10.1 一覧Card

一覧では情報量を抑える。

表示:

- DIVISION。
- 案件名。
- 基本報酬。
- 主要推奨技術3件程度。
- 選択状態。

一覧では★難易度を表示しない。

### 2.10.2 詳細モーダル

Card Tapで詳細モーダルを表示する。

表示:

- DIVISION。
- ★難易度。
- 基本報酬。
- 納期要求 1〜5。
- 品質要求 1〜5。
- 技術難易度 1〜5。
- Frontend必要戦力。
- Backend必要戦力。
- Infrastructure必要戦力。
- 推奨技術と重要度。
- 推奨3スロット。
- `この案件を選ぶ`。

### 2.10.3 案件変更

Development開始前なら選択案件を変更できる。

既に別案件が選択済みの場合は確認する。

```text
選択中の案件を変更しますか？
獲得済みのチームは維持されます。
```

`キャンセル / 変更する`

獲得済みEngineerを自動で放出しない。

2案件目では1案件目に完了した案件を一覧から選択不可にする。DIVISIONによる案件解放条件は設けず、1案件目から5件すべて選択可能とする。

---

## 2.11 Market画面仕様

Marketは本アプリの中心画面であり、最も「移籍市場を眺めて補強を考える楽しさ」が出る画面とする。

上から次の順で表示する。

1. 選択中案件のコンパクト要約。
2. フォーメーション型My Team 3枠。
3. 人件費サマリー。
4. Filter / Sort。
5. Transfer Market一覧。

一覧は**1列の縦スクロール**とし、390×844程度のiPhoneで通常スクロール中に約1.5〜2枚のEngineer Cardが視界に入る情報密度を目安とする。小型カードを大量に詰め込む一覧にはしない。

### 2.11.1 選択中案件要約

例:

```text
選択中: B2B SaaS MVP
Next.js / FastAPI / AWS
FE 60 | BE 72 | INFRA 50
基本報酬 1,400万円
```

### 2.11.2 Compact Sticky Header

Marketを下方向へスクロールしたとき、上部の案件要約・My Team・人件費サマリーはそのまま大きく固定しない。

代わりに、一定量スクロールした後は**1行または2行のCompact Sticky Headerへ縮小**する。

表示例:

```text
B2B SaaS MVP | Match 82% | 1,420 / 2,000万円 | 2/3人
```

必須:

- 選択案件名。
- 現在のTeam Tech Match。
- 使用中年俸 / 年間人件費枠。
- Team人数 / 3。
- HeaderはMarket Cardの閲覧領域を過度に圧迫しない。
- Sticky HeaderがEngineer Cardの獲得ButtonやModal操作を覆わない。
- 上へ戻った場合は元の案件要約＋My Team表示へ自然に戻る。
- Transitionはtransform / opacity中心で短く行う。

### 2.11.3 Filter

次のみを実装する。

```text
ALL | Frontend | Backend | Infrastructure
```

技術スタック文字検索はMVPで実装しない。

### 2.11.4 Sort

Defaultは **案件適合率の高い順**。

利用者は次へ変更できる。

- 案件適合: 高い順。
- OVR: 高い順。
- 希望年俸: 安い順。
- 市場評価: 高い順。

同値の場合はSeed配列順をTie Breakerとし、表示が不安定に入れ替わらないようにする。

### 2.11.5 Engineer一覧Card

Engineer Cardは、**上部でゲームとして惹きつけ、下部で経営判断できる**二層構造を基本とする。

上部のVisual Zone:

- Rarity Badge。
- OVRをCard内の最重要数値として大きく表示。
- 3D / illustration Avatarを十分な存在感で表示。
- 氏名。
- Role / Title。

下部のDecision Zone:

- 主要技術最大3件。
- 案件適合率。
- 市場評価 ★1〜5。
- `移籍市場 xxx〜xxx万円`。
- `希望年俸 xxx万円`。
- 移籍市場評価。
- `獲得する` または不可理由。

**「市場年俸」など別の用語へ変更しない。**

必ず次の語を使用する。

```text
移籍市場 750〜850万円
希望年俸 780万円
```

Cardは1列表示とし、390×844程度のiPhoneで約1.5〜2枚が見える高さを目安とする。情報を詰め込むためにAvatarやOVRを極端に小さくしない。

Rarityに応じてCardの質感を変えてよいが、判断情報の可読性を優先する。

### 2.11.6 Engineer詳細モーダル

一覧Card Tapで表示する。一覧より大きいEngineer Card表現と詳細能力を組み合わせ、気になる人材をじっくり比較する画面とする。

表示:

- 大きめAvatar。
- 氏名。
- Role / Title。
- Rarity / OVR。
- 市場評価。
- 移籍市場。
- 希望年俸。
- 移籍市場評価。
- 案件適合率。
- 全技術スタック。
- 実装力。
- 速度。
- 品質。
- コミュニケーション。
- `獲得する`。

### 2.11.7 獲得確認

獲得ボタンで即加入させない。

```text
<Engineer Name>を獲得しますか？
希望年俸 780万円
残り人件費枠 1,220万円
```

`キャンセル / 獲得する`

獲得成功後、空いているMy Team slotの先頭へ入れる。

### 2.11.8 獲得演出

獲得成功時はRarityに応じて演出を変える。

#### ROOKIE / SOLID / PRO

- Cardがわずかに浮く、縮小する、またはMy Team方向へ移動する短いAnimation。
- 加入先Team Slotを短くHighlightする。
- 操作テンポを妨げない。

#### STAR / ELITE

通常演出に加えて、短い特別演出を表示する。

```text
NEW SIGNING
STAR · OVR 87
<Engineer Name>
```

- STAR / ELITE獲得が明確に特別だと感じられる。
- Full-screenまたはProminent Overlayでよいが、数秒以上操作を拘束しない。
- ELITEを最もPremiumに見せる。
- Skip不能な長尺演出にしない。
- `prefers-reduced-motion: reduce`では簡略化する。

### 2.11.9 予算不足

残り人件費枠を超えるEngineerはCardを視覚的に抑制し、獲得不可にする。

例:

```text
希望年俸 1,050万円
あと230万円不足
```

Buttonは`予算不足`。

### 2.11.10 チーム満員

3人所属時は新規獲得不可。

Buttonは`チーム満員`。

### 2.11.11 放出

Development開始前はEngineerを放出できる。

- 放出するとそのEngineerの年俸枠が即時に空く。
- 放出したEngineerはそのシーズン中、移籍市場から消える。
- 再獲得不可。
- `releasedEngineerIds`へ保存する。
- 誤操作防止の確認を表示する。

---

## 2.12 Development画面仕様

開発計算自体は即時に完了してよいが、利用者には **3〜5秒程度** の短い演出を見せる。

順序:

```text
Building...
↓
Testing...
↓
Deploying...
↓
PROJECT COMPLETE
```

途中にFrontend / Backend / Infrastructureの状態を簡潔に表示してよい。

例:

```text
Frontend      順調
Backend       順調
Infrastructure 遅延
```

これは結果計算から導出した表示であり、新しいランダムイベントシステムを作らない。

`prefers-reduced-motion: reduce` の場合はAnimationを最小化し、待ち時間も短縮してよい。ただし処理段階の意味は維持する。

ページReload時は保存済みProject Random Seedと進行状態から同じ結果へ復元し、結果ガチャを許可しない。

---

## 2.13 Result画面仕様

Resultは、**スポーツ中継の高揚感 × Apple Event的な余白と段階表示**を組み合わせる。

結果を一度に表形式で出し切らず、原則として次の順で短く段階表示する。

```text
PROJECT COMPLETE — A
↓
実獲得報酬 / 会社資金変化
↓
納期 / 品質 / 安定性
↓
MVP ENGINEER
↓
各Engineer Performance
```

- 各Revealは短く、全体で不必要に待たせない。
- Tapしなければ進まない方式にはしない。
- Scroll中も結果のHierarchyが崩れない。
- `prefers-reduced-motion: reduce`ではAnimationを省略し、同じ順序の静的表示にしてよい。

### 2.13.1 チーム結果

表示:

- `PROJECT COMPLETE` または `PROJECT FAILED`。
- 総合評価 `S+ / S / A / B / C / D`。
- Final Project Score。
- 納期評価。
- 品質評価。
- 安定性評価。
- Team Tech Match。
- Team Cost。
- 基本報酬。
- 実獲得報酬。
- 会社資金 Before → After。
- 年間人件費枠 Before → After。

Final Project Scoreが60未満の場合を`PROJECT FAILED`とする。

### 2.13.2 個人結果

参加Engineerごとに表示する。

- 氏名。
- Role。
- Performance 0〜100。
- 案件適合率。
- 1〜2文の決定的コメント。

最もPerformanceが高いEngineerを、

```text
MVP ENGINEER
```

として強調する。

同値の場合はOVRが高いEngineer、さらに同値ならSeed順を優先する。

### 2.13.3 1案件目完了後

Result画面ではすぐ残留・放出を決めない。

`次の案件を選ぶ` でProjectsへ進む。

2案件目選択後、Clubで次案件要件と1案件目Performanceを同時に見ながら残留・放出を決める。

### 2.13.4 2案件目完了後

`シーズン結果を見る` でSeason画面へ進む。

---

## 2.14 2案件目の残留・放出仕様

2案件目を選択した後、ClubをRetention modeにする。

各既存Engineerについて次を表示する。

- 1案件目Performance。
- 2案件目案件適合率。
- 希望年俸。
- `残留`。
- `放出`。

全Engineerについて判断が完了するまで通常の`開発開始`を表示しない。

### 残留

- 同じEngineerを維持する。
- 追加年俸は発生しない。
- 使用中年俸枠は維持する。

### 放出

- Teamから削除する。
- 年俸枠を即時解放する。
- そのシーズン中はMarketから削除する。
- 再獲得不可。

全員の判断後、空き枠がある場合はMarketで補強できる。

---

## 2.15 Season画面仕様

2案件完了で表示する。

見出し:

```text
SEASON COMPLETE
```

表示:

- 会社名。
- 最終順位。
- 10社リーグテーブル。
- 2案件のSUCCESS / FAILED数。
- 総獲得報酬。
- 最終会社資金。
- 最終年間人件費枠。
- 平均Project Score。
- 平均Tech Match。
- BEST ENGINEER。
- CEO RATING。
- `最初からやり直す`。

競合9社は実シミュレーションしない。固定Pointsと自社Pointsを比較して順位を決定する。

---

## 2.16 データモデル

実装時に同等の型へ変更してよいが、意味を変更しない。

### 2.16.1 Engineer

```ts
type EngineerRole = 'frontend' | 'backend' | 'infrastructure';
type Rarity = 'ELITE' | 'STAR' | 'PRO' | 'SOLID' | 'ROOKIE';

type Engineer = {
  id: string;
  name: string;
  role: EngineerRole;
  title: string;
  skills: string[];
  abilities: {
    implementation: number;
    speed: number;
    quality: number;
    communication: number;
  };
  ovr: number;
  rarity: Rarity;
  marketRating: 1 | 2 | 3 | 4 | 5;
  transferMarketMin: number; // 万円
  transferMarketMax: number; // 万円
  desiredSalary: number; // 万円
  avatarVariant: string;
};
```

### 2.16.2 Project

```ts
type ProjectTechRequirement = {
  skill: string;
  role: EngineerRole;
  importance: number;
};

type Project = {
  id: string;
  name: string;
  division: 1 | 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5;
  baseReward: number; // 万円
  demands: {
    deadline: 1 | 2 | 3 | 4 | 5;
    quality: 1 | 2 | 3 | 4 | 5;
    technicalDifficulty: 1 | 2 | 3 | 4 | 5;
  };
  requiredStrength: {
    frontend: number;
    backend: number;
    infrastructure: number;
  };
  techRequirements: ProjectTechRequirement[];
  recommendedSlots: EngineerRole[]; // 必ず3件
};
```

### 2.16.3 GameState

```ts
type GamePhase =
  | 'COMPANY_SETUP'
  | 'PROJECT_1_SELECT'
  | 'TEAM_1_BUILD'
  | 'DEVELOPMENT_1'
  | 'RESULT_1'
  | 'PROJECT_2_SELECT'
  | 'RETENTION_DECISION'
  | 'TEAM_2_BUILD'
  | 'DEVELOPMENT_2'
  | 'RESULT_2'
  | 'SEASON_COMPLETE';

type GameState = {
  version: 1;
  companyName: string | null;
  companyCash: number; // 万円
  annualSalaryBudget: number; // 万円
  phase: GamePhase;
  selectedProjectId: string | null;
  completedProjectIds: string[];
  teamEngineerIds: string[]; // max 3
  releasedEngineerIds: string[];
  retentionDecisions: Record<string, 'retain' | 'release'>;
  projectRuns: ProjectRun[];
};
```

### 2.16.4 ProjectRun

最低限次を保存する。

```ts
type ProjectRun = {
  projectId: string;
  teamEngineerIds: string[];
  salaryBudgetAtStart: number;
  teamCostAtStart: number;
  randomSeed: number;
  projectScore: number;
  rating: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  success: boolean;
  deadlineScore: number;
  qualityScore: number;
  stabilityScore: number;
  teamTechMatch: number;
  actualReward: number;
  salaryBudgetGrowth: number;
  engineerPerformances: Record<string, number>;
};
```

---

## 2.17 OVR計算

OVRはSeedで独立設定せず、4能力から職種別重み付き平均で決定する。

値は整数へ四捨五入する。

### Frontend

```text
implementation 35%
speed          25%
quality        25%
communication  15%
```

### Backend

```text
implementation 40%
quality        30%
speed          20%
communication  10%
```

### Infrastructure

```text
quality        35%
implementation 30%
speed          20%
communication  15%
```

Seedに記載されたOVRと計算結果が一致しない場合は、能力値からの計算結果を正とし、Spec Reviewで不整合として扱う。

---

## 2.18 Rarity計算

OVRから機械的に決定する。

```text
90〜100: ELITE
85〜89 : STAR
80〜84 : PRO
75〜79 : SOLID
0〜74  : ROOKIE
```

Rarityを職位と混同しない。

---

## 2.19 移籍市場評価

Cardに必ず次のどれかを表示する。

```text
GOOD VALUE｜割安
FAIR VALUE｜適正
PREMIUM｜割高
```

計算:

```text
position = (desiredSalary - transferMarketMin)
           / (transferMarketMax - transferMarketMin)
```

分類:

```text
position <= 0.35          → GOOD VALUE｜割安
0.35 < position <= 0.70   → FAIR VALUE｜適正
position > 0.70           → PREMIUM｜割高
```

レンジ外の場合も同じ式を使用する。

これは「実際の移籍金」を意味しない。`移籍市場`は当該人材の年収相場レンジをサッカー移籍市場風のUIで表現したゲーム上の名称である。

---

## 2.20 案件別Ability Weight

案件ごとに納期・品質・技術難易度の重要度を変える。

Communicationは常に15%。残り85%を案件Demand比率で分配する。

```text
sum = deadline + quality + technicalDifficulty

implementationWeight = 0.85 * technicalDifficulty / sum
speedWeight          = 0.85 * deadline / sum
qualityWeight        = 0.85 * quality / sum
communicationWeight  = 0.15
```

Engineerの案件別Ability Fit:

```text
abilityFit =
  implementation * implementationWeight +
  speed          * speedWeight +
  quality        * qualityWeight +
  communication  * communicationWeight
```

0〜100へClampする。

---

## 2.21 個人案件適合率

技術スタックは完全一致で判定し、曖昧一致・類義語推測をしない。

EngineerのRoleと同じRoleに割り当てられたProject TechnologyをPrimary Requirementとする。

```text
ownCoverage =
  一致した同Role requirement importance合計
  / 同Role requirement importance合計
  * 100
```

他RoleのRequirementにEngineerが偶然一致するSkillを持つ場合はCross-role補正として小さく評価する。

```text
crossCoverage =
  一致した他Role requirement importance合計
  / 他Role requirement importance合計
  * 100
```

```text
individualTechMatch = clamp(
  ownCoverage + crossCoverage * 0.10,
  0,
  100
)
```

該当する他Role requirementがない場合の`crossCoverage`は0。

MarketのDefault Sortでこの値を使用する。

---

## 2.22 Team Tech Match

Roleごとに、Team内の同Role Engineerが持つSkillのUnionでProject Requirementを満たす割合を計算する。

同Role Engineerが0人の場合、他Role Engineerが持つ一致Skillは35%のCross-role Contributionとして扱う。

Role Tech Coverage:

```text
roleTechCoverage(role) =
  matched importance / total importance for role * 100
```

Role specialist不在時:

```text
roleTechCoverage = crossRoleMatchedCoverage * 0.35
```

最終Team Tech Matchは`requiredStrength`をWeightとして3 Roleを平均する。

```text
teamTechMatch = weightedAverage(
  frontendTechCoverage,
  backendTechCoverage,
  infrastructureTechCoverage,
  weights = requiredStrength
)
```

0〜100へClampする。

---

## 2.23 Role Coverage

各Engineerの案件別Ability Fitを使用する。

各Roleに対してEngineer Contributionを計算する。

```text
same role       → abilityFit * 1.00
other role      → abilityFit * 0.20
```

Contributionを高い順に並べ、重複人員には逓減をかける。

```text
rolePower =
  firstContribution
  + secondContribution * 0.35
  + thirdContribution * 0.15
```

```text
roleCoverage = clamp(
  rolePower / project.requiredStrength[role] * 100,
  0,
  100
)
```

全Roleの`roleCoverage`を`requiredStrength`で加重平均し、`roleCoverageScore`とする。

これによりFrontend×2などの自由編成は可能だが、不在Roleには大きなペナルティが発生する。

---

## 2.24 Project Result計算

### 2.24.1 Team Ability Score

参加Engineerの`abilityFit`平均。

### 2.24.2 Headcount Factor

```text
3人 → 1.00
2人 → 0.82
1人 → 0.60
0人 → 開始不可
```

### 2.24.3 Random

Development開始確定時に1回だけ`randomSeed`を生成してProjectRunへ保存する。

このSeedから `-10〜+10` の整数 `randomAdjustment` を決定する。

Reloadしても同一ProjectRunでは同じ値を使用する。

Project結果確定後にRandomを再生成しない。

### 2.24.4 Final Project Score

```text
baseScore =
  roleCoverageScore * 0.40 +
  teamTechMatch     * 0.35 +
  teamAbilityScore  * 0.25

projectScore = clamp(
  baseScore * headcountFactor + randomAdjustment,
  0,
  100
)
```

### 2.24.5 Success

```text
projectScore >= 60 → SUCCESS
projectScore < 60  → FAILED
```

### 2.24.6 Rating

```text
95〜100 → S+
88〜94  → S
80〜87  → A
70〜79  → B
60〜69  → C
0〜59   → D
```

境界は丸め前Project Scoreに適用し、表示時のみ整数へ丸める。

---

## 2.25 納期・品質・安定性

Team平均Abilityを`avgSpeed`、`avgQuality`、`avgImplementation`、`avgCommunication`とする。

Infrastructure Role Coverageを`infraCoverage`とする。

同じProject Randomから導出した`randomAdjustment`を弱く反映する。

```text
deadlineScore = clamp(
  avgSpeed * 0.55 +
  roleCoverageScore * 0.25 +
  teamTechMatch * 0.20 +
  randomAdjustment * 0.50,
  0, 100
)
```

```text
qualityScore = clamp(
  avgQuality * 0.55 +
  avgImplementation * 0.25 +
  teamTechMatch * 0.20 +
  randomAdjustment * 0.30,
  0, 100
)
```

```text
stabilityScore = clamp(
  infraCoverage * 0.40 +
  avgQuality * 0.30 +
  teamTechMatch * 0.20 +
  avgCommunication * 0.10 +
  randomAdjustment * 0.30,
  0, 100
)
```

各Scoreの表示ランクも`S+ / S / A / B / C / D`の同一閾値を使用する。

---

## 2.26 Engineer Performance

Project開始時Random SeedからEngineer IDごとに決定的な`individualRandom`（-5〜+5）を導出する。

```text
roleNeedFactor = project.requiredStrength[engineer.role]

performance = clamp(
  abilityFit * 0.55 +
  individualTechMatch * 0.30 +
  roleNeedFactor * 0.15 +
  individualRandom,
  0,
  100
)
```

表示は整数へ四捨五入する。

### コメント生成

生成AIを使用しない。数値から決定的テンプレートで1〜2文を生成する。

優先例:

- Tech Match 85以上 → `案件技術との相性が高く、専門領域で大きく貢献。`
- 高Quality要求かつQuality 85以上 → `高い品質要求に応え、成果の安定性を押し上げた。`
- 高Deadline要求かつSpeed 85以上 → `厳しい納期条件で開発速度を牽引した。`
- InfrastructureでStability寄与が高い → `インフラ要件を満たし、安定性に大きく貢献。`
- Performance 65未満 → `案件要件に対して適合度が不足し、期待した成果を出し切れなかった。`

複数条件では最も寄与の高い1〜2条件だけを使用する。

---

## 2.27 Project Reward

Project Seedの`baseReward`へRating Multiplierを掛ける。

```text
S+ → 1.20
S  → 1.10
A  → 1.00
B  → 0.90
C  → 0.70
D  → 0.35
```

```text
actualReward = round(baseReward * multiplier)
```

単位は万円。

`actualReward`を会社資金へ加算する。

希望年俸を会社資金から差し引かない。希望年俸は年間人件費枠だけを消費する。会社資金の残高はMVPで獲得可否を制限しない。

---

## 2.28 年間人件費枠の成長

Project完了ごとに年間人件費枠を増やす。

Rating Bonus:

```text
S+ → +350万円
S  → +300万円
A  → +220万円
B  → +140万円
C  → +60万円
D  → +0万円
```

Reward Bonus:

```text
floor(actualReward * 0.05 / 10) * 10万円
```

Projectごとの増加上限:

```text
+500万円
```

```text
salaryBudgetGrowth = min(500, ratingBonus + rewardBonus)
```

1案件目で増加した枠は2案件目の残留・放出・補強時点から即時利用可能。

2案件目完了後も増加計算し、Seasonの最終人件費枠として表示する。

---

## 2.29 Company Score / League Points

2案件完了後に算出する。

### 2.29.1 Average Project Score

2案件の`projectScore`平均。

### 2.29.2 Reward Score

```text
rewardScore = clamp(
  totalActualReward / 5000 * 100,
  0,
  100
)
```

### 2.29.3 Cost Efficiency

各Projectについて次を計算する。

```text
salaryUtilization = teamCostAtStart / salaryBudgetAtStart

projectCostEfficiency = clamp(
  projectScore + (1 - salaryUtilization) * 25,
  0,
  100
)
```

2案件平均を`costEfficiencyScore`とする。

### 2.29.4 Average Tech Match

2案件の`teamTechMatch`平均。

### 2.29.5 Company Index

```text
companyIndex =
  averageProjectScore * 0.40 +
  rewardScore         * 0.20 +
  costEfficiencyScore * 0.20 +
  averageTechMatch    * 0.20
```

### 2.29.6 League Points

```text
leaguePoints = round(companyIndex * 100)
```

0〜10000程度の表示とする。

### 2.29.7 CEO RATING

`companyIndex`へProject Ratingと同じ閾値を適用する。

```text
95〜100 → S+
88〜94  → S
80〜87  → A
70〜79  → B
60〜69  → C
0〜59   → D
```

---

## 2.30 BEST ENGINEER

シーズン中にProjectへ参加したEngineerについてPerformance平均を算出する。

最も平均Performanceが高いEngineerをBEST ENGINEERとする。

Tie Breaker:

1. 出場Project数が多い。
2. OVRが高い。
3. Seed順が早い。

---

## 2.31 Engineer Seed — 15人

すべて架空人物である。

### 2.31.1 Frontend 5人

| ID | 名前 | Title | Skills | 実装 | 速度 | 品質 | コミュ | OVR | Rarity | 市場評価 | 移籍市場 | 希望年俸 | Avatar |
|---|---|---|---|---:|---:|---:|---:|---:|---|---:|---|---:|---|
| fe-01 | 高橋 葵 | Senior Frontend Engineer | React, Next.js, TypeScript, GraphQL, Testing Library | 94 | 89 | 92 | 85 | 91 | ELITE | 5 | 900〜1,200万円 | 1,050万円 | avatar-fe-01 |
| fe-02 | 中村 蓮 | Frontend Engineer | React, TypeScript, Vite, TanStack Query, Storybook | 88 | 87 | 85 | 82 | 86 | STAR | 4 | 750〜950万円 | 820万円 | avatar-fe-02 |
| fe-03 | 藤本 芽衣 | Frontend Engineer | Next.js, React, TypeScript, Tailwind CSS | 84 | 85 | 81 | 78 | 83 | PRO | 4 | 650〜850万円 | 680万円 | avatar-fe-03 |
| fe-04 | 石川 颯太 | Frontend Engineer | React, TypeScript, GraphQL, Cypress | 79 | 82 | 77 | 80 | 79 | SOLID | 3 | 580〜760万円 | 720万円 | avatar-fe-04 |
| fe-05 | 加藤 結衣 | Junior Frontend Engineer | React, JavaScript, CSS, Vite | 73 | 78 | 70 | 76 | 74 | ROOKIE | 2 | 480〜620万円 | 520万円 | avatar-fe-05 |

### 2.31.2 Backend 5人

| ID | 名前 | Title | Skills | 実装 | 速度 | 品質 | コミュ | OVR | Rarity | 市場評価 | 移籍市場 | 希望年俸 | Avatar |
|---|---|---|---|---:|---:|---:|---:|---:|---|---:|---|---:|---|
| be-01 | 田中 健 | Senior Backend Engineer | Python, Django, PostgreSQL, Redis, REST | 94 | 86 | 93 | 82 | 91 | ELITE | 5 | 900〜1,200万円 | 980万円 | avatar-be-01 |
| be-02 | 佐藤 美咲 | Backend Engineer | Python, FastAPI, PostgreSQL, Redis, Docker | 89 | 88 | 86 | 83 | 87 | STAR | 5 | 780〜1,000万円 | 920万円 | avatar-be-02 |
| be-03 | 山本 悠斗 | Backend Engineer | Node.js, NestJS, PostgreSQL, Redis, GraphQL | 85 | 83 | 82 | 80 | 83 | PRO | 4 | 680〜880万円 | 820万円 | avatar-be-03 |
| be-04 | 小林 莉奈 | Backend Engineer | Python, Django, PostgreSQL, Celery | 82 | 78 | 80 | 76 | 80 | PRO | 4 | 620〜800万円 | 650万円 | avatar-be-04 |
| be-05 | 伊藤 大輝 | Junior Backend Engineer | PHP, Laravel, MySQL, Redis | 74 | 77 | 72 | 73 | 74 | ROOKIE | 2 | 480〜650万円 | 610万円 | avatar-be-05 |

### 2.31.3 Infrastructure 5人

| ID | 名前 | Title | Skills | 実装 | 速度 | 品質 | コミュ | OVR | Rarity | 市場評価 | 移籍市場 | 希望年俸 | Avatar |
|---|---|---|---|---:|---:|---:|---:|---:|---|---:|---|---:|---|
| infra-01 | 渡辺 駿 | Senior Infrastructure Engineer | AWS, Terraform, Kubernetes, Docker, GitHub Actions | 90 | 84 | 94 | 82 | 89 | STAR | 5 | 900〜1,200万円 | 1,150万円 | avatar-infra-01 |
| infra-02 | 吉田 彩 | Cloud Engineer | AWS, Docker, GitHub Actions, CloudWatch | 86 | 82 | 88 | 80 | 85 | STAR | 5 | 750〜950万円 | 800万円 | avatar-infra-02 |
| infra-03 | 松本 光希 | Infrastructure Engineer | AWS, Terraform, Docker, GitHub Actions | 84 | 80 | 85 | 77 | 82 | PRO | 4 | 680〜900万円 | 760万円 | avatar-infra-03 |
| infra-04 | 井上 七海 | Infrastructure Engineer | GCP, Kubernetes, Docker, Terraform | 80 | 76 | 82 | 75 | 79 | SOLID | 3 | 600〜800万円 | 760万円 | avatar-infra-04 |
| infra-05 | 林 翼 | Junior Infrastructure Engineer | AWS, Linux, Docker, Nginx | 74 | 72 | 76 | 70 | 74 | ROOKIE | 2 | 480〜650万円 | 500万円 | avatar-infra-05 |

### 2.31.4 Seed制約

- OVRは§2.17の式と一致すること。
- Rarityは§2.18と一致すること。
- `marketRating`はSeed固定値でありOVRから自動算出しない。
- 初期年間人件費枠2,000万円で複数の3人編成が成立すること。
- 高OVRだけを3人揃えることは困難なバランスを維持する。
- Seed不足をRuntimeで自動生成しない。

---

## 2.32 Project Seed — 5件

全Projectの`techRequirements.importance`合計は100とする。

### project-01 — 地域ECリニューアル

```yaml
id: project-01
name: 地域ECリニューアル
division: 5
difficulty: 1
baseReward: 1000
demands:
  deadline: 4
  quality: 2
  technicalDifficulty: 2
requiredStrength:
  frontend: 65
  backend: 55
  infrastructure: 40
recommendedSlots:
  - frontend
  - frontend
  - backend
techRequirements:
  - { skill: React, role: frontend, importance: 35 }
  - { skill: TypeScript, role: frontend, importance: 15 }
  - { skill: Django, role: backend, importance: 25 }
  - { skill: PostgreSQL, role: backend, importance: 10 }
  - { skill: AWS, role: infrastructure, importance: 15 }
```

特徴: 納期優先。Frontendを厚くすると有利。Infrastructureなしでも挑戦可能だが安定性が落ちる。

### project-02 — B2B SaaS MVP

```yaml
id: project-02
name: B2B SaaS MVP
division: 4
difficulty: 2
baseReward: 1400
demands:
  deadline: 5
  quality: 3
  technicalDifficulty: 3
requiredStrength:
  frontend: 60
  backend: 72
  infrastructure: 50
recommendedSlots:
  - frontend
  - backend
  - backend
techRequirements:
  - { skill: Next.js, role: frontend, importance: 25 }
  - { skill: TypeScript, role: frontend, importance: 15 }
  - { skill: FastAPI, role: backend, importance: 25 }
  - { skill: PostgreSQL, role: backend, importance: 15 }
  - { skill: AWS, role: infrastructure, importance: 10 }
  - { skill: Docker, role: infrastructure, importance: 10 }
```

特徴: 納期が非常に厳しくBackend比重が高い。FastAPI人材が強い。

### project-03 — 会員制マーケットプレイス刷新

```yaml
id: project-03
name: 会員制マーケットプレイス刷新
division: 3
difficulty: 3
baseReward: 1800
demands:
  deadline: 4
  quality: 4
  technicalDifficulty: 4
requiredStrength:
  frontend: 78
  backend: 80
  infrastructure: 65
recommendedSlots:
  - frontend
  - backend
  - infrastructure
techRequirements:
  - { skill: React, role: frontend, importance: 20 }
  - { skill: Next.js, role: frontend, importance: 15 }
  - { skill: Django, role: backend, importance: 20 }
  - { skill: PostgreSQL, role: backend, importance: 10 }
  - { skill: Redis, role: backend, importance: 10 }
  - { skill: AWS, role: infrastructure, importance: 15 }
  - { skill: GitHub Actions, role: infrastructure, importance: 10 }
```

特徴: 3職種バランス型。React / Django / AWS系の王道チームが強い。

### project-04 — リアルタイム業務基盤

```yaml
id: project-04
name: リアルタイム業務基盤
division: 2
difficulty: 4
baseReward: 2400
demands:
  deadline: 4
  quality: 5
  technicalDifficulty: 5
requiredStrength:
  frontend: 72
  backend: 88
  infrastructure: 85
recommendedSlots:
  - backend
  - infrastructure
  - infrastructure
techRequirements:
  - { skill: Next.js, role: frontend, importance: 15 }
  - { skill: TypeScript, role: frontend, importance: 10 }
  - { skill: NestJS, role: backend, importance: 20 }
  - { skill: PostgreSQL, role: backend, importance: 10 }
  - { skill: Redis, role: backend, importance: 10 }
  - { skill: Kubernetes, role: infrastructure, importance: 15 }
  - { skill: Terraform, role: infrastructure, importance: 10 }
  - { skill: Docker, role: infrastructure, importance: 10 }
```

特徴: Backend / Infrastructure重視。Node / NestJSとKubernetes系を高く評価する。

### project-05 — 高可用性FinTech基盤

```yaml
id: project-05
name: 高可用性FinTech基盤
division: 1
difficulty: 5
baseReward: 3000
demands:
  deadline: 5
  quality: 5
  technicalDifficulty: 5
requiredStrength:
  frontend: 82
  backend: 94
  infrastructure: 96
recommendedSlots:
  - backend
  - infrastructure
  - infrastructure
techRequirements:
  - { skill: React, role: frontend, importance: 10 }
  - { skill: TypeScript, role: frontend, importance: 10 }
  - { skill: Django, role: backend, importance: 20 }
  - { skill: PostgreSQL, role: backend, importance: 10 }
  - { skill: Redis, role: backend, importance: 10 }
  - { skill: AWS, role: infrastructure, importance: 15 }
  - { skill: Terraform, role: infrastructure, importance: 10 }
  - { skill: Kubernetes, role: infrastructure, importance: 10 }
  - { skill: GitHub Actions, role: infrastructure, importance: 5 }
```

特徴: MVP最高難度。品質・技術・納期すべて高要求。1案件目の成長後に挑む選択肢として強くする。

---

## 2.33 Competitor Seed — 9社

固定Pointsを持つ架空企業とする。

| Rank基準 | Company | Points |
|---:|---|---:|
| 1 | Vertex Systems | 9200 |
| 2 | Orbit Labs | 8800 |
| 3 | NexaWorks | 8400 |
| 4 | Pixel Forge | 8050 |
| 5 | Cloud Nine | 7700 |
| 6 | Stackline | 7350 |
| 7 | BluePeak | 7000 |
| 8 | Northstar Tech | 6600 |
| 9 | LoopWorks | 6200 |

Season完了時に自社`leaguePoints`を加えて降順Sortし、10社順位を表示する。

同点Tie Breaker:

1. 自社の場合は総獲得報酬が高い方を優先する。
2. 次に平均Tech Match。
3. それでも同じ場合はCompany Nameの昇順。

固定競合側は同点しないSeedとする。

---

## 2.34 2026年日本市場データの扱い

本MVPの`移籍市場`は現実の日本のITエンジニア採用市場を参考にするが、給与推定サービスではない。

参考基準:

- Robert Half Japan 2026 Salary Guideでは、Frontend Engineerの開始年収目安が約750 / 1,000 / 1,250万円（25th / 50th / 75th percentile）、Backend Engineerが約750 / 1,050 / 1,500万円、Cloud Engineerが約630 / 830 / 1,250万円とされている。
- LAPRASの2025年求人データでは求人提示年収の平均レンジが概ね659〜1,059万円。
- LAPRASの2026年主要エンジニア職種の提示年収は概ね600〜1,200万円前後で推移している。

MVP Seedでは、Juniorを含む15人の比較と初期人件費枠2,000万円でのゲーム性を成立させるため、概ね480〜1,200万円へレンジを広げて調整する。

この調整を「現実の正確な年収査定」と表示してはならない。

参考URL:

- https://www.roberthalf.com/jp/en/insights/salary-guide/technology
- https://hr-tech-lab.lapras.com/knowledge/research-report/revenue-trends-2025/
- https://hr-tech-lab.lapras.com/knowledge/research-report/trends_in_job_openings_and_offered_annual_salaries202602/

---

## 2.35 Avatar仕様

15人にはそれぞれ異なる架空Avatarを表示する。

方向性:

- Apple的な洗練された3D / illustration avatarの雰囲気。
- 写実的人物写真にはしない。
- 実在人物に似せない。
- 外部画像URLへ依存しない。
- 著作権のあるゲーム画像・EA FCカードAssetをコピーしない。
- Seedの`avatarVariant`から決定的に描画する。
- Engineer Card上で人物として認識できる程度に顔・上半身のシルエットや個性を持たせる。
- 15人が同一人物の色違いに見えないよう、髪型・輪郭・服装・Accessory等の組み合わせを変える。
- Avatarそのものの作り込みがMVP DeliveryをBlockしない。

MVPでは、ローカルSVG / CSS gradient / geometric illustrationを組み合わせたオリジナルAvatarでよい。

15枚を完全な手描き画像として作り込むためにMVPを遅延させない。

---

## 2.36 UI / Visual Design

本MVPではFigmaを使用しない。**本節をVisual Specificationの正本**とし、実装Agentが「普通のSaaS Dashboard」へ寄せないこと。

デザインコンセプト:

> **EA FC / Ultimate Team的なカードを集める楽しさ × Apple的な余白と洗練**

ただし既存ゲームのUI・ロゴ・Asset・Card shapeをコピーしない。

### 2.36.1 Base Palette

- 全体はBlack / Near-black / Graphite / White / Silver系を基本とする。
- App Shell、Club、Projects等の通常UIは落ち着いたMonochrome Surfaceを基本とする。
- 色は主にRarity、OVR、状態、成功/失敗など意味のある箇所へ限定する。
- 画面全体へNeon Gradientを常用しない。
- 派手なソーシャルゲーム風UIではなくPremium Sports Productとして見せる。

### 2.36.2 Surface / Material

通常UI:

- Flatまたは非常に控えめなTranslucent Surface。
- Border、Shadow、Surface階層で情報を整理する。
- Glassmorphismを全Panelへ適用しない。

Engineer CardのみRarityに応じて質感を強くしてよい。

```text
ROOKIE → 最も簡素でNeutral
SOLID  → 控えめなBorder / Surface差
PRO    → わずかな光沢・Depth
STAR   → Glass / Metallic感を少し強める
ELITE  → 最もPremium。上品なHighlight / Glow / Metallic Detail
```

Gold / rainbowなどの固定色名を強制しない。Dark Theme上のContrastと高級感を優先する。

### 2.36.3 Engineer Card Hierarchy

Engineer Cardでは以下の優先順位を視覚的に守る。

1. OVR。
2. Avatar + Engineer identity。
3. 案件適合率。
4. 希望年俸。
5. 移籍市場評価。
6. 主要技術・市場評価・移籍市場。

Card上半分はOVR＋Avatar＋Identityでゲーム性を出し、下半分は採用判断情報を整理する。

カード全体を数値表のようにしない。

### 2.36.4 Typography

- 基本TextはApple的に読みやすいSystem Fontを使用する。
- 大きな数字、十分な余白、明確なHierarchyを重視する。
- 外部Font依存をMVPへ追加しない。
- `OVR`、`DIVISION`、`NEW SIGNING`、`PROJECT COMPLETE`、`SEASON COMPLETE`等のゲーム上重要なLabelだけ、Uppercase・Letter Spacing・Condensed風Sizing等でスポーツゲーム的な強さを出す。
- 本文や年俸情報までスポーツゲーム風Typographyにしない。

### 2.36.5 Navigation

- Bottom Navigationは`CLUB | MARKET | PROJECTS`。
- `MARKET`を中央に配置し、視覚的にわずかに強調する。
- 選択中Tabはピル型Backgroundまたは同等のApple的な選択表現。
- Bottom Navigation自体は常時派手に光らせない。

### 2.36.6 My Team

- サッカーフォーメーションを連想できる3枠配置。
- 選択案件の推奨Roleを背景Guideとして表示。
- UIはRoleを強制せず、自由編成であることを阻害しない。
- Team全体を一目で見て「どのポジションが空いているか」「何を補強したいか」が分かる。

### 2.36.7 Market Experience

- Marketは1列縦スクロール。
- 390×844程度で約1.5〜2枚のEngineer Cardが見える密度。
- Scroll開始後、案件＋Team＋Budget情報はCompact Sticky Headerへ縮小する。
- Sticky Headerにより、15人を見ている途中でも「何の案件のための補強か」を見失わせない。
- Engineer DetailはModalで大Card化し、一覧より多い情報を見せる。

### 2.36.8 Motion

通常Micro Interaction:

- 150〜300ms程度。
- transform / opacity中心。
- Button、Modal、Sticky Header、Team Slot Highlight等に限定する。

獲得:

- ROOKIE / SOLID / PROは短い加入Animation。
- STAR / ELITEは`NEW SIGNING`特別演出。

Development:

- Building → Testing → Deployingを3〜5秒。

Result:

- PROJECT COMPLETE → 報酬 → 各評価 → MVP ENGINEER → Performanceを段階Reveal。

Animationが主目的にならないようにし、操作待ち時間を増やさない。

### 2.36.9 General UX Rules

- 数字の情報密度は高くしてよいが、iPhoneで一目で優先順位が分かるHierarchyにする。
- Positive stateは明快にする。
- Budget不足・失敗・Rarityは色だけに依存しない。
- Touch targetは原則44px以上。
- Modalは小さいiPhone viewportで画面外へはみ出さず、必要なら内部Scrollする。
- Long textは折返し・省略を適切に使い、横overflowを発生させない。
- UI詳細が本書で未指定の場合、**Apple的な簡潔さ > 装飾追加**を優先する。

---

## 2.37 Mobile / Responsive

主対象はiPhone Safari。

自動Gateは最低限次のViewportで実行する。

```text
320 x 720
375 x 720
390 x 844
768 x 720
```

390×844を主要Reference Viewportとする。

必須:

- ページ全体の意図しない横スクロールがない。
- Bottom NavigationがSafe Areaと干渉しない。
- `CLUB | MARKET | PROJECTS`が320pxでも操作可能。
- Marketが中央Tabとして認識できる。
- My Team 3枠のフォーメーションが320pxでも同時に認識できる。
- My Team内は情報を絞り、全文を詰め込まない。
- Transfer Market Cardは1列。
- 390×844でMarket Cardが極端に小さくならず、約1.5〜2枚が通常閲覧の目安となる。
- Compact Sticky Headerが本文・Button・Modalを隠さない。
- Engineer Detail ModalはViewport内でScroll可能。
- Project Detail ModalはViewport内でScroll可能。
- Button / input / tabがTap可能。
- Fixed Bottom Navigationが本文を隠さない。
- STAR / ELITEのNEW SIGNING演出がViewport外へはみ出さず、終了後に操作へ戻れる。
- Resultの段階表示後、全結果を縦Scrollで確認できる。
- Long Company NameやEngineer Nameでレイアウト崩れしない。
- 会社名30文字でも横overflowしない。
- 768pxでは単純な拡大だけでなく余白を調整する。

Human Smartphone Acceptanceでは実機iPhone Safariで、機械Gateでは判断しきれないPremium感・カードの気持ちよさ・情報量・操作感を確認する。

---

## 2.38 技術スタック

MVP:

```text
Frontend / App:
Next.js
React
TypeScript

Runtime Validation:
Zod

Persistence:
localStorage

Deployment:
Vercel
```

将来候補だがMVP対象外:

```text
Backend:
Python
Django
Django REST Framework

Database:
PostgreSQL
```

### 技術制約

- Next.jsはApp Routerを使用する。Client-side game stateが必要な箇所だけClient Componentとする。
- Zodを必須Dependencyとして使用し、ブラウザ入力・Seed Data・localStorage復元など、Runtimeで不正値が入り得る境界をSchemaで検証する。
- TypeScriptの型だけでRuntime Validationを代替しない。
- Company NameはZodでtrim後1〜30文字を検証する。
- Engineer / Project / CompetitorのSeed Dataは起動時またはModule初期化時にZod Schemaで検証し、仕様不整合を早期検出する。
- localStorageは`JSON.parse`後に`GameStateSchema.safeParse`相当で検証し、不正SchemaをDomainへ渡さない。
- ZodはValidation境界に使用し、Game Result等の純粋な計算ロジックをSchemaへ押し込まない。
- Template / selected Profileの既定FrontendがViteであっても、本アプリ固有要件であるNext.jsを優先し、Delivery Gateやレビュー契約を維持したままApp scaffoldをNext.jsへ置き換える。Viteを製品Frontendとして残さない。
- このHuman DecisionによるProfile上書きはFrontend Framework、Deploy Target、画面数だけに限定する。`daily-local-app` Profileのその他の制約とMandatory Gateは維持する。
- MVPにDjangoを追加しない。
- MVPにPostgreSQLを追加しない。
- API Routeを製品機能のために追加しない。
- Server永続化を追加しない。
- Authenticationを追加しない。
- 外部Salary APIを追加しない。
- 不要な状態管理Libraryを追加しない。
- Repositoryに既存の適切なLibraryがある場合は再利用する。
- 新Dependencyは、MVP機能に必要で既存手段より明確に単純になる場合だけ追加する。

---

### Codex実装時のECC Frontend Skill利用

Implementationでは、ECC由来の次のSkillを必須の実装補助Skillとして明示的に利用する。

```text
frontend-patterns
coding-standards
```

利用目的:

- `frontend-patterns`: React / Next.jsのComponent設計、Client/Server境界、State、Form、Zod、レスポンシブ、アクセシビリティ、パフォーマンスの実装判断。
- `coding-standards`: TypeScript / Reactコードの命名、可読性、イミュータビリティ、重複回避、保守性の基準。

実装AgentはImplementation開始前に上記SkillがCodexから検出可能か確認する。どちらか一方でも検出できない場合は、Skillを黙って無視して実装へ進まず`BLOCKED`として報告する。検出できた場合は、本書とAGENTS.mdに従う補助知識として必ず使用する。

優先順位は常に次とする。

```text
docs/init-mvp-spec.md
> AGENTS.md / impl-mvp Delivery契約
> ECC Skill
> Agentの一般知識
```

ECC Skillと本書が衝突した場合は本書を優先する。

今回、ECC全体のGlobal Sync、Full Install、Hook、Memory、追加Orchestratorは導入しない。

また、既存の`.codex/agents/independent-code-reviewer.toml`がCode Review責務を持つため、ECCの`code-reviewer` Agentを重複追加しない。Frontend専用Reviewer Agentも追加しない。

`design-system` Skillを使って別途Design System構築プロジェクトを開始しない。UIのVisual Source of Truthは§2.36とし、必要な共通Token / Componentは本アプリの実装内部として最小限定義する。

---

## 2.39 コードアーキテクチャ

機能はMVPだが、コードは修正箇所を判断しやすい構造にする。

基本構造:

```text
src/
  app/

  domain/
    engineer/
    project/
    team/
    season/

  usecases/
    hire-engineer/
    release-engineer/
    select-project/
    run-project/
    evaluate-project/
    calculate-performance/
    calculate-salary-budget/
    calculate-league-ranking/
    reset-season/

  repositories/
    engineer-repository.ts
    project-repository.ts
    game-state-repository.ts

  adapters/
    repositories/
      seed-engineer-repository.ts
      seed-project-repository.ts
      local-storage-game-state-repository.ts

  features/
    club/
    market/
    projects/
    development/
    result/
    season/

  shared/
    components/
    lib/
    schemas/
      company.schema.ts
      engineer.schema.ts
      project.schema.ts
      game-state.schema.ts
    types/

  data/
    engineers.ts
    projects.ts
    competitors.ts
```

実際のNext.js configurationに合わせて最小調整してよいが、責務を崩さない。

### domain

- React / Next.js / Browser APIへ依存しない。
- Engineer、Project、Team、Seasonの意味と純粋な計算ルール。

### usecases

`services/`は作らない。

ユーザー操作とゲーム進行のApplication Logicを`usecases/`へ統一する。

- 獲得。
- 放出。
- 案件選択。
- 案件評価。
- Performance。
- 人件費枠。
- League Ranking。
- Reset。

### repositories

データ取得・保存境界のInterface。

将来localStorageからDjango APIへ変更できる境界は持つが、MVPで汎用Repository frameworkを作らない。

### adapters

- Seed data。
- localStorage。

など具体技術への接続。

### features

React UIと画面固有状態。

### shared

本当に複数Featureから利用するものだけ置く。

`shared/schemas/`には、UI入力・Seed・Persistence境界で共有するZod Schemaだけを置く。Schemaを置くためだけに追加のValidation LayerやService Layerを作らない。

最初から共通化するためだけの抽象化を作らない.

---

## 2.40 localStorage契約

Key:

```text
tech-transfer-market:v1
```

Corrupt Backup Key:

```text
tech-transfer-market:v1:corrupt-backup
```

Corrupt Backupは1世代だけ保持し、新しい破損値を隔離する場合は既存値を上書きしてよい。利用者がCorrupt Backupを操作または復元するための画面や管理機能は作らない。

保存対象:

- GameState全体。
- ProjectRunのRandom Seedと確定結果。

保存しない:

- React component stateの一時的なModal open状態。
- Sort / Filterは保存しなくてよい。
- Development animationのframe位置。

### 復元

- 起動時にlocalStorageを読む。
- `localStorage.getItem`が例外を送出した場合はCrashせず、安全な初期GameStateで起動する。
- Readに失敗した場合はPersistenceが利用できないことを非Blockingで利用者へ示す。
- `JSON.parse`後にZodの`GameStateSchema.safeParse`相当でRuntime Validationする。
- 正常なv1 stateなら復元する。
- JSON Parse失敗またはZod Schema不整合時はCrashしない。
- Primary Keyから取得したRaw ValueがJSON Parse失敗またはZod Schema不整合の場合、そのRaw Valueを破損データとして扱い、Corrupt Backup Keyへ隔離保存することを試みる。
- 隔離保存に成功した場合だけPrimary Keyの破損値を削除し、安全な初期GameStateをMemory上で生成して起動する。保存データを読み込めなかったため初期状態へ復旧したことを非Blockingで利用者へ示す。
- 隔離保存が`localStorage.setItem`の例外で失敗した場合、Primary Keyの破損値を上書きも削除もせずRaw Valueを可能な限り保持する。安全な初期GameStateをMemory上で使用してSessionを継続し、Persistenceが利用できないことを非Blockingで利用者へ示す。保存成功を偽装しない。
- 破損値を正常なGameStateとしてDomainへ渡さない。
- Consoleへ機密情報は出さない。本アプリにはSecret自体を保存しない。

### 保存

- `localStorage.setItem`が例外を送出した場合はCrashしない。
- Writeに失敗しても現在のSessionではMemory上のGameStateで操作を継続する。
- 保存できていないこと、およびReloadで変更が失われる可能性を非Blockingで利用者へ示す。
- 保存成功を偽装しない。

### Reset

`最初からやり直す`でKeyを削除し、Company Setupへ戻る。

- `localStorage.removeItem`が例外を送出した場合はCrashせず、現在のSessionのMemory上では初期GameStateへ戻す。
- Keyを削除できなかったこと、およびReload時に以前の保存状態が復元される可能性を非Blockingで利用者へ示す。
- 削除成功を偽装しない。

Resetは確認を出す。

```text
シーズンデータを削除して最初からやり直しますか？
```

---

## 2.41 実装禁止事項

- 仕様にない画面を増やす。
- 仕様にない4職種目を追加する。
- Mobile / AI / QA / ManagerをMVPへ追加する。
- 15人を超えるEngineerを追加する。
- 5案件を超えるProjectを追加する。
- 2案件を超えるSeasonへ拡張する。
- 実在人物のプロフィールを追加する。
- 実在企業をCompetitorへ追加する。
- 外部求人サイトをScrapeする。
- Backendを作る。
- Djangoを導入する。
- PostgreSQLを導入する。
- 認証を導入する。
- PWA化をMVP必須にする。
- Redux等の状態管理を必要性なく導入する。
- Zod以外のValidation Libraryを重複導入する。
- Zod Schemaを理由にDomain LogicをValidation Layerへ移動する。
- ECC全体をGlobal SyncまたはFull Installする。
- ECCのHook / Memory / Orchestratorを追加する。
- ECCのCode Reviewerを既存Independent Code Reviewerと重複追加する。
- `services/` layerを追加する。
- Clean Architectureのためだけの追加Layerを増やす。
- Generic Factory / DI Containerを導入する。
- OVRやResult計算式を独自変更する。
- Salary rangeをRuntimeで乱数生成する。
- Engineer SeedをRuntime生成する。
- Project SeedをRuntime生成する。
- Random結果をReloadのたびに再計算する。
- 放出済みEngineerを再獲得可能にする。
- 会社資金から年俸を直接減算する。
- 1案件目で増えた年俸枠を2案件目で使えない仕様へ変更する。
- Bottom Tabを4個以上にする。
- Marketを左右2カラムにする。
- Desktop優先UIへ変更する。
- EA FCその他既存ゲームの画像・ロゴ・Cardをコピーする。
- Figma導入をMVP必須にする。
- Visual Specification不足を理由に新しいDesign System構築プロジェクトを始める。
- 仕組みを改善する目的で新Skill / Agent / SDD frameworkを追加する。

問題が実際に発生していない箇所へルールを追加しない。

---

## 2.42 テスト要件

テスト名は人間向けに日本語で、原則として次の形式にする。

> **「〜したとき、〜されること」**

Arrange / Act / Assertを基本とする。

### 2.42.1 Unit

最低限:

- Frontend能力値からOVRを計算したとき、職種別重みで計算されること。
- Backend能力値からOVRを計算したとき、職種別重みで計算されること。
- Infrastructure能力値からOVRを計算したとき、職種別重みで計算されること。
- OVR境界値を評価したとき、正しいRarityになること。
- 希望年俸がレンジ下側のとき、GOOD VALUEになること。
- 希望年俸がレンジ中央のとき、FAIR VALUEになること。
- 希望年俸がレンジ上側のとき、PREMIUMになること。
- 案件技術とEngineer Skillが一致したとき、Role補正込みの案件適合率が計算されること。
- 専門Role不在のとき、Cross-role補正だけが適用されること。
- 同Roleを複数配置したとき、逓減Contributionが適用されること。
- 3人で案件開始したとき、Headcount penaltyが発生しないこと。
- 2人で案件開始したとき、0.82のHeadcount factorが適用されること。
- 1人で案件開始したとき、0.60のHeadcount factorが適用されること。
- 同一ProjectRunを再計算したとき、保存済みRandom Seedにより結果が変化しないこと。
- Project Score境界値を評価したとき、S+〜Dへ正しく分類されること。
- RatingからRewardを計算したとき、正しいMultiplierが適用されること。
- Project完了時に人件費枠を計算したとき、Rating BonusとReward Bonusが反映されること。
- 人件費枠増加が500万円を超えるとき、500万円にClampされること。
- 会社スコアを計算したとき、成果・報酬・人件費効率・技術マッチの4軸が反映されること。
- 自社Pointsを競合へ追加したとき、10社順位が降順で決定されること。
- Performanceが同値のとき、MVP ENGINEERのTie Breakerが適用されること。
- 会社名が前後空白込みで入力されたとき、Zodでtrimした値が1〜30文字として検証されること。
- 会社名がtrim後31文字のとき、Zod validationで会社設立できないこと。
- Engineer Seed 15件をZod Schemaで検証したとき、全件PASSすること。
- Project Seed 5件をZod Schemaで検証したとき、全件PASSすること。
- Competitor Seed 9件をZod Schemaで検証したとき、全件PASSすること。
- Schema不整合のGameStateをZodで検証したとき、Domainへ渡されないこと。

### 2.42.2 Integration

最低限:

- 会社名を入力して設立したとき、Projectsへ遷移すること。
- Company Setupを表示したとき、端末・Browser内保存とデータ消失可能性の補足Textが開始CTA付近に表示されること。
- Project未選択のとき、Marketで獲得操作ができないこと。
- Projectを選択したとき、Marketに案件要約が表示されること。
- Engineerを獲得したとき、My Teamの空き枠へ追加され年俸枠が減ること。
- 年俸枠を超えるEngineerを表示したとき、不足額が表示され獲得できないこと。
- 3人所属しているとき、新しいEngineerを獲得できないこと。
- Engineerを放出したとき、年俸枠が戻りそのSeasonのMarketから消えること。
- Projectを変更したとき、確認後もTeamが維持されること。
- 0人のとき、Project開始できないこと。
- 2人のとき、警告確認後にProject開始できること。
- Project開始を確定したとき、Random Seedが1回だけ保存されること。
- 1案件目を完了したとき、Rewardが会社資金へ加算され年俸枠が増えること。
- 1案件目完了後に2案件目を選ぶとき、完了済み案件を再選択できないこと。
- 2案件目を選んだとき、残留・放出判断が表示されること。
- Engineerを残留させたとき、追加年俸が発生しないこと。
- Engineerを放出したとき、2案件目の補強枠として即時利用できること。
- 2案件目を完了したとき、Season Completeへ進めること。
- Season Completeで自社を含む10社ランキングが表示されること。
- Resetしたとき、会社名・Team・結果が削除されCompany Setupへ戻ること。
- 再読み込みしたとき、localStorageからSeason途中が復元されること。
- localStorageのJSONが壊れているとき、Crashせず初期状態へ安全に戻ること。
- localStorageのJSONはParseできるがGameState Schemaに不整合があるとき、Crashせず初期状態へ安全に戻ること。
- 破損Dataの隔離保存に成功したとき、Raw ValueがCorrupt Backup Keyへ保存されPrimary Keyが削除されること。
- 破損Dataの隔離保存に失敗したとき、Primary Keyを上書き・削除せずMemory上の初期状態でSessionを継続し、Persistence障害が通知されること。

### 2.42.3 UI / E2E Critical Flow

Production SmokeおよびE2Eの主要Flow:

1. 初期localStorageをClearする。
2. 会社を設立する。
3. Project 1を選択する。
4. Marketで3人以内を獲得する。
5. ClubでDevelopmentを開始する。
6. Development → Resultまで完了する。
7. ResultからProject 2選択へ進む。
8. 残留 / 放出を決める。
9. 必要に応じて補強する。
10. Project 2を完了する。
11. Season Completeで10社順位を見る。
12. Reloadして状態が壊れないことを確認する。
13. ResetしてCompany Setupへ戻る。

E2Eのためだけにゲームルールを弱めない。

### 2.42.4 Mobile Mechanical Check

320 / 375 / 390 / 768 widthで最低限:

- Horizontal overflowなし。
- `CLUB | MARKET | PROJECTS`のBottom Navigationが操作可能で、Marketが中央にある。
- My Team 3枠のフォーメーションが同時に認識できる。
- Engineer CardがViewportを超えず、390×844では約1.5〜2枚が見える密度である。
- MarketのCompact Sticky Headerが表示されても主要操作を妨げない。
- Project Detail Modalが操作可能。
- Engineer Detail Modalが操作可能。
- Development画面が崩れない。
- Resultが縦Scrollで閲覧可能。
- Season Rankingが横overflowしない。

---

## 2.43 Production Smoke

Vercel Production URLで最低限次を検証する。

- HTTP到達可能。
- HTML / JS / CSS assetが正常にLoadする。
- 初回Company Setupが表示される。
- Company Setupの開始CTA付近に端末・Browser内保存とデータ消失可能性の補足Textが表示される。
- Company作成ができる。
- Project一覧5件が表示される。
- Marketに15人が表示される。
- 1人以上獲得できる。
- localStorageへ保存される。
- Page Reload後にStateを復元できる。
- 主要なconsole errorなし。
- Productionで意図しない404なし。
- MarketのSticky Header縮小が実操作で成立する。
- Engineer Detail Modalを開閉できる。
- Bottom NavigationのMarket中央配置とTab操作が成立する。

可能ならProduction Smokeで1案件完了まで実行する。Production上で2案件全E2Eが安定して実行可能なら実行してよいが、Production Smoke自体を過度に長くしてDeliveryを不安定化させない。

---

## 2.44 Accessibility最低要件

- Interactive elementはbutton / input等適切なSemantic elementを使う。
- Keyboard focusが失われない。
- Modal open中は背景操作を抑制する。
- Modal close手段を明確にする。
- 色だけでRarity、失敗、Budget不足を表現しない。
- `prefers-reduced-motion`へ対応する。
- 主要Textで十分なContrastを確保する。
- Avatarには意味のあるaltまたはdecorative扱いを設定する。

---

## 2.45 Performance最低要件

- 15人 / 5案件規模で不要な最適化をしない。
- Market Sort / Filterで体感Lagを発生させない。
- AvatarはLocal Asset / SVGとし、大容量画像を15枚読み込まない。
- Animationはtransform / opacity中心。
- localStorageへ巨大なDerived Dataを重複保存しない。
- Derived値は必要に応じて再計算できるが、ProjectRunのRandom Seedと確定結果は保持する。

---

## 2.46 将来拡張の境界

MVP完成後、次フェーズで検討してよいもの:

- BackendをPython / Django / Django REST Frameworkへ移行。
- PostgreSQL保存。
- User Account。
- Season継続。
- 昇給。
- 解雇。
- 年俸交渉。
- 移籍金。
- Engineer成長。
- 年齢 / 経験年数 / Potential / Condition。
- Mobile / AI / QA / Engineering Manager Role。
- 個人タスク割り当て。
- ランダムイベント。
- 動的Competitor。
- 実市場データ更新。

これらのためにMVPコードへ先回り機能を追加しない。

---

## 2.47 Acceptance Criteria

以下をすべて満たす。

### Product

1. 会社名を入力して会社設立できる。
2. 初期会社資金0万円、年間人件費枠2,000万円で始まる。
3. 5案件から1件を選べる。
4. Project一覧はDIVISION、名前、基本報酬、主要技術を表示する。
5. Project詳細で★難易度、3Demand、3Role必要戦力、技術要件を確認できる。
6. Development前ならProjectを確認付きで変更でき、Teamは維持される。
7. Marketに15人のEngineerが存在する。
8. Frontend / Backend / Infrastructure各5人である。
9. Market Default Sortは案件適合率順である。
10. `ALL / Frontend / Backend / Infrastructure`でFilterできる。
11. OVR / 希望年俸 / 市場評価 / 案件適合でSortできる。
12. Engineer CardにOVR、Rarity、Role、主要技術、案件適合、市場評価、移籍市場、希望年俸、移籍市場評価が表示される。
13. `移籍市場 xxx〜xxx万円` と `希望年俸 xxx万円` の文言を使用する。
14. Engineer詳細で4能力と全Skillを確認できる。
15. 獲得時に確認Modalが表示される。
16. 予算不足時に不足額が表示される。
17. Teamは最大3人である。
18. Teamの3枠は職種自由である。
19. My Teamは3枠のフォーメーション型で表示され、Projectに応じた推奨Roleが各枠へ表示される。
20. 0人ではDevelopment開始不可である。
21. 1〜2人では警告後にDevelopment開始可能である。
22. Development開始前に案件、Team Cost、Tech Matchの最終確認が表示される。
23. Development演出がBuilding → Testing → Deployingの順で表示される。
24. Project Randomは開始時に1回だけ確定しReloadで変わらない。
25. ResultでS+〜Dの総合評価が表示される。
26. Resultで納期、品質、安定性が表示される。
27. Resultで各EngineerのPerformanceとコメントが表示される。
28. MVP ENGINEERが表示される。
29. 実獲得報酬が会社資金へ加算される。
30. Project結果と報酬から年間人件費枠が増える。
31. 1案件目の増加枠を2案件目補強で即時利用できる。
32. 2案件目は残り4案件から選ぶ。
33. 2案件目を選んだ後に残留 / 放出を決める。
34. 放出したEngineerは再獲得できない。
35. 残留Engineerへ追加年俸は発生しない。
36. 2案件目を完了できる。
37. Season Completeで自社＋競合9社の10社Rankingが表示される。
38. Company Scoreは成果・報酬・人件費効率・技術マッチを反映する。
39. CEO RATINGが表示される。
40. BEST ENGINEERが表示される。
41. Resetで最初からやり直せる。
42. ReloadしてSeason途中から復元できる。

### Architecture

43. `domain / usecases / repositories / adapters / features`の責務が分離される。
44. `services/`を作らない。
45. DomainがReact / localStorageへ直接依存しない。
46. localStorageアクセスはAdapter側へ閉じる。
47. Django / PostgreSQL /認証を追加しない。

### Quality / Production

48. lint PASS。
49. test PASS。
50. build PASS。
51. Independent Code Review PASS。
52. Secret Gate PASS。
53. Vercel Production Deploy成功。
54. Production URL取得成功。
55. Production Smoke PASS。
56. Mobile / Responsive Gate PASS。
57. 320 / 375 / 390 / 768で意図しない横overflowなし。
58. Productionで主要console errorなし。
59. Human Smartphone Acceptance前の自動MVP Gateをすべて通過している。

### UI / Visual

60. 全体がBlack / Graphite / White / Silver基調で、色の主用途がRarity・OVR・状態表示に限定されている。
61. 通常PanelはFlat寄りで、Engineer CardだけRarityに応じて質感が変わる。
62. Engineer Card上部でOVR＋Avatar＋Identity、下部で案件適合・移籍市場・希望年俸・VALUEを判断できる。
63. 390×844のMarketでEngineer Cardが約1.5〜2枚見える密度になっている。
64. Engineer Card Tapで一覧より大きい詳細Card / Modalを確認できる。
65. My Teamが3人フォーメーションとして認識でき、推奨Role Guideが表示される。
66. MarketをScrollしたとき、案件名・Tech Match・Budget・人数を含むCompact Sticky Headerへ縮小される。
67. ROOKIE / SOLID / PRO獲得時に短い加入Animationがあり、STAR / ELITEでは`NEW SIGNING`特別演出が表示される。
68. Bottom Navigationは`CLUB | MARKET | PROJECTS`でMarketが中央にあり、選択TabがApple的なピル型または同等の表現で分かる。
69. Resultは`PROJECT COMPLETE`→報酬→納期/品質/安定性→MVP ENGINEER→Performanceの順で視覚的にRevealされる。
70. 基本TypographyはSystem Font中心で、`OVR / DIVISION / NEW SIGNING / PROJECT COMPLETE / SEASON COMPLETE`等だけスポーツゲーム的に強調される。
71. Figmaや外部Design Assetなしで、本書のVisual Specificationだけを正本として実装されている。

---

# 3. 固定Delivery Workflow契約

この§3以降はアプリ固有機能を増やす場所ではない。Deadline-Driven Lightweight SDD Templateの固定Workflowとして扱う。

Codexの実行入口はRepositoryに定義された`impl-mvp` Skillとする。

本書のProduct仕様を実装するために、新しいSkill / Agent / Orchestratorを追加しない。

## 3.1 Source Priority

仕様差異は次の順で解決する。

```text
1. docs/init-mvp-spec.md
   Human-confirmed requirement input

2. docs/mvp-spec.md
   AI-compiled implementation-ready spec

3. Current Project Repository

4. Obsidian / external knowledge
   advisory only
```

`docs/init-mvp-spec.md`をImplementation Agentが勝手に変更して製品判断を解消してはいけない。

## 3.2 Stage Result / Block State

```text
Stage Result:
PASS
FAIL
NOT_RUN
```

```text
Block State:
NONE
AI_AUTO_RECOVERABLE
HUMAN_DECISION_REQUIRED
```

両者を混ぜない。

## 3.3 Independent Review

Independent Reviewerは次を満たす。

- fresh / separate context。
- implementationに関与していない。
- read-only。
- Reviewer verdictをOrchestratorが上書きしない。
- FAIL / BLOCKED修正後はfresh reviewを再実行する。
- self approval禁止。

## 3.4 Delivery Stages

既存`impl-mvp` Skillの詳細契約を正本とするが、少なくとも次の順を維持する。

```text
Input Validation
↓
Preflight
↓
Optional Context Read
↓
Project Initialization
↓
Spec Compilation
↓
Independent Specification Review
↓
Implementation
↓
Lint / Test / Build
↓
Independent Code Review
↓
Bounded Auto Recovery
↓
Security / Secret Gate
↓
Commit
↓
Push
↓
Vercel Deploy
↓
Production URL Gate
↓
Production Smoke
↓
Mobile / Responsive Gate
↓
Final Report
```

Independent Specification Reviewが`FAIL`または`BLOCKED`の場合はImplementationを開始しない。

Production SmokeおよびMobile / Responsive Gateのブラウザ実操作は、`impl-mvp` Skillに定義されたとおりPlaywright MCPを第一選択とする。Playwright MCP unavailable時も未確認GateをPASSにしない。

## 3.5 Recovery

機械的・実装上の問題で、製品判断を変更せず修正可能なものは`AI_AUTO_RECOVERABLE`としてbounded recoveryしてよい。

次は`HUMAN_DECISION_REQUIRED`とする。

- 本書に重大な矛盾があり、複数の製品仕様が成立する。
- GitHub / Vercelの認証を利用者が行う必要がある。
- 課金・契約・利用規約への同意が必要。
- Secret値の入力が必要。
- Production外部設定について人間の所有権判断が必要。
- 既存Product Invariantを変更しなければ解決できない。

## 3.6 Gate削減禁止

期限や実装難易度を理由に、次を削除してMVP_COMPLETEとしてはならない。

- Specification Review。
- lint / test / build。
- Independent Code Review。
- Mobile / Responsive Gate。
- Security / Secret Gate。
- Production Deployment。
- Production URL Gate。
- Production Smoke。

## 3.7 Completion

全mandatory GateがPASSし、Vercel Productionが到達可能で、Production SmokeがPASSした場合だけ、最終結果をMVP_COMPLETEとする。

Final Reportには最低限次を含める。

- 最終Status。
- Production URL。
- Commit SHA。
- 変更ファイル概要。
- lint / test / build結果。
- Independent Specification Review結果。
- ECC Frontend Skill検出・利用結果（`frontend-patterns` / `coding-standards`）。
- Independent Code Review結果。
- Mobile / Responsive Gate結果。
- Security / Secret Gate結果。
- Production Smoke結果。
- Remaining FOLLOW_UP。
- Human Smartphone Acceptanceで確認する項目。

---

# 4. 最終指示

本書で確定しているProduct仕様は追加確認なしで実装してよい。

実装Agentは、UIの余白・Component内部構造・変数名など、製品判断ではない詳細を自律的に決める。

一方、次を勝手に変更しない。

- MVP Scope。
- Game Flow。
- Seed数とSeed値。
- 計算式。
- 用語。
- 2案件 / 1Season。
- 3人自由編成。
- 初期年間人件費枠2,000万円。
- localStorage。
- Next.js。
- ZodをRuntime Validationに使用すること。
- Implementationでは`frontend-patterns` / `coding-standards` Skillを必ず使うこと。
- Vercel。
- Architecture責務。
- Mobile-first UI。
- §2.36のVisual Specification。
- Figmaを前提にしないこと。

最優先は、開発システムの追加改善ではなく **Tech Transfer MarketのMVPをProductionまで完成させること** である。
