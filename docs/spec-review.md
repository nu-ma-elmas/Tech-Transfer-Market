- Verdict: BLOCKED
- Blockers: 6
- Ready to implement: NO

## BLOCKER

1. **選択ProfileのFrontend制約と§2の技術スタックが矛盾している**
   - 対象: §2.4、§2.38
   - Evidence: §2.4と§2.38は`Next.js`を要求し、§2.38は「Template / selected Profileの既定FrontendがViteであっても…Next.jsへ置き換える」と明記している。一方、選択された`daily-local-app` Profileは「Vite、React、TypeScriptとTemplateのApp Shellを維持する。別のFrontend Frameworkへ切り替えない」としている。Profile制約違反であり、どちらを実装するか重要な製品・基盤判断が必要になる。

2. **選択Profileの公開先と§2のDeployment要件が矛盾している**
   - 対象: §2.3、§2.4、§2.38、§2.43、§2.47
   - Evidence: §2はVercel ProductionへのDeployとVercel Production URLでのSmokeを要求する。一方、`daily-local-app` Profileは公開先をGitHub Project Pages、成果物をViteの`dist`、Vite baseを`/<repository_name>/`と固定している。Deploy、Build、Production Smokeの実行方式を一意に決められない。

3. **主要機能が3つを超えている**
   - 対象: §2.2、§2.4
   - Evidence: §2.2だけでも会社設立、案件選択、人材比較・獲得、チーム編成、案件実行、結果・個人Performance確認、残留・放出・再補強、リーグ順位確認、Resetという独立した主要機能群を定義している。主要機能を3つ以内に限定したMVP仕様になっていない。

4. **DeadlineとTimezoneが欠落している**
   - 対象: §2全体
   - Evidence: `mvp_target: 1-day playable MVP`は期間目標にすぎず、実日時のDeadlineと、その判定に使うTimezoneが§2にない。PreflightおよびDeadline-drivenな実装・Deploy判断を一意に行えない。

5. **永続化の読み書き失敗時の挙動が未確定である**
   - 対象: §2.40
   - Evidence: JSON Parse失敗とZod Schema不整合時の復旧は定義されているが、`localStorage.getItem`、`setItem`、`removeItem`自体が例外または失敗になった場合のUI、継続可否、利用者への通知、Memory上の状態の扱いがない。Profileが必須とする「読み書きに失敗したときの挙動」を満たしていない。

6. **Project Data Modelと5件のProject SeedでField名が矛盾している**
   - 対象: §2.16.2、§2.20、§2.32、§2.38
   - Evidence: `Project`型と計算LogicはDemandを`demands`として参照するが、5件すべてのProject Seedは同じ値を`requirements`として定義している。さらにSeedは起動時にZod Schemaで検証して全件PASSすることが要求されている。実装側がSchemaまたはSeedのどちらを正として補正するか決めなければBuild・Testを成立させられない。

## FOLLOW_UP

1. **本番Acceptanceの代表操作列とMVP完成条件の範囲が一致していない**
   - 対象: §2.3、§2.42.3、§2.43、§2.47
   - Evidence: §2.3と§2.42.3は2案件完了からSeason Complete、Reload、Resetまでを要求する一方、§2.43のProduction Smokeは1案件完了を「可能なら」、2案件全E2Eを「実行してよい」と任意扱いしている。BLOCKER解消後、本番でMVP完成を証明する必須操作列を統一することが望ましい。

2. **League Points同点時の競合との比較規則が完全ではない**
   - 対象: §2.33
   - Evidence: 自社と固定競合が同点になり得るが、第一Tie Breakerの総獲得報酬と第二Tie Breakerの平均Tech Matchは競合Seedに値がない。該当時の順位を決定的にする規則の明確化が望ましい。
