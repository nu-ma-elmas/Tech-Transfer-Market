import { describe, expect, it } from 'vitest'
import { engineers, calculateOvr, rarityForOvr } from '@/data/engineers'
import { projects } from '@/data/projects'
import { competitors } from '@/data/projects'
import { bestEngineer, budgetGrowthForResult, companyMetrics, competitionRank, evaluateProject, headcountFactor, individualTechMatch, marketValue, projectMvp, ratingForScore, rewardForRating, roleCoverage, teamTechMatch } from './calculations'

describe('ゲーム計算',()=>{
 it.each(['frontend','backend','infrastructure'] as const)('%s能力値からOVRを計算したとき、職種別重みで計算されること',role=>{const engineer=engineers.find(e=>e.role===role)!;expect(calculateOvr(engineer)).toBe(engineer.ovr)})
 it.each([[90,'ELITE'],[85,'STAR'],[80,'PRO'],[75,'SOLID'],[74,'ROOKIE']] as const)('OVR境界値%sを評価したとき、正しいRarityになること',(ovr,rarity)=>expect(rarityForOvr(ovr)).toBe(rarity))
 it('希望年俸が各レンジ位置のとき、正しい市場評価になること',()=>{expect(marketValue(engineers[2])).toBe('GOOD VALUE｜割安');expect(marketValue(engineers[3])).toBe('PREMIUM｜割高')})
 it('案件技術とEngineer Skillが一致したとき、Role補正込みの案件適合率が計算されること',()=>expect(individualTechMatch(engineers[0],projects[2])).toBeGreaterThan(80))
 it('専門Role不在のとき、Cross-role補正だけが適用されること',()=>expect(teamTechMatch([engineers[0]],projects[2])).toBeLessThan(60))
 it.each([[95,'S+'],[94.9,'S'],[88,'S'],[80,'A'],[70,'B'],[60,'C'],[59.9,'D']] as const)('Project Score境界値%sを評価したとき、%sへ分類されること',(score,rating)=>expect(ratingForScore(score)).toBe(rating))
 it('同一ProjectRunを再計算したとき、保存済みRandom Seedにより結果が変化しないこと',()=>{const a=evaluateProject(projects[0],[engineers[2],engineers[8]],2000,1234),b=evaluateProject(projects[0],[engineers[2],engineers[8]],2000,1234);expect(a).toEqual(b);expect(a.teamEngineerIds).toHaveLength(2)})
 it('1人と2人で案件開始したとき、Headcount penaltyが適用されること',()=>{const one=evaluateProject(projects[0],[engineers[0]],2000,42),two=evaluateProject(projects[0],[engineers[0],engineers[5]],2000,42),three=evaluateProject(projects[0],[engineers[0],engineers[5],engineers[10]],4000,42);expect(one.projectScore).toBeLessThan(two.projectScore);expect(two.projectScore).toBeLessThan(three.projectScore)})
 it('Project完了時に人件費枠を計算したとき、増加が500万円へClampされること',()=>{const run=evaluateProject(projects[4],[engineers[0],engineers[5],engineers[10]],4000,1);expect(run.salaryBudgetGrowth).toBeLessThanOrEqual(500)})
 it('会社スコアを計算したとき、4軸から有限値が算出されること',()=>{const runs=[evaluateProject(projects[0],[engineers[2],engineers[8]],2000,1),evaluateProject(projects[1],[engineers[1],engineers[6]],2200,2)];expect(Number.isFinite(companyMetrics(runs).leaguePoints)).toBe(true)})
 it.each([[3,1],[2,.82],[1,.6],[0,0]])('%d人で案件開始したとき、Headcount factorが%sになること',(count,factor)=>expect(headcountFactor(count)).toBe(factor))
 it.each([['S+',1200],['S',1100],['A',1000],['B',900],['C',700],['D',350]] as const)('%s Ratingの報酬を計算したとき、正しいMultiplierが適用されること',(rating,reward)=>expect(rewardForRating(1000,rating)).toBe(reward))
 it('Rating BonusとReward Bonusを計算したとき、500万円へClampされること',()=>{expect(budgetGrowthForResult(1000,'A')).toBe(270);expect(budgetGrowthForResult(5000,'S+')).toBe(500)})
 it('同点Pointsを順位計算したとき、Competition Rankingが適用されること',()=>expect([9200,8800,8400,8400,8050].map(value=>competitionRank(value,[9200,8800,8400,8400,8050]))).toEqual([1,2,3,3,5]))
 it('平均Performanceが同値のとき、出場数・OVR・Seed順でBEST ENGINEERが決まること',()=>{const first=evaluateProject(projects[0],[engineers[0],engineers[1]],2000,3),second={...first,projectId:'project-02',engineerPerformances:{[engineers[0].id]:70,[engineers[1].id]:70}};first.engineerPerformances={[engineers[0].id]:70,[engineers[1].id]:70};expect(bestEngineer([first,second]).engineer.id).toBe(engineers[0].id)})
 it('同Roleを複数配置したとき、2人目へ逓減Contributionが適用されること',()=>{const project={...projects[4],requiredStrength:{...projects[4].requiredStrength,frontend:200}},one=roleCoverage([engineers[0]],project,'frontend'),two=roleCoverage([engineers[0],engineers[1]],project,'frontend');expect(two).toBeGreaterThan(one);expect(two-one).toBeLessThan(one)})
 it('会社スコアを計算したとき、成果・報酬・人件費効率・技術マッチの各軸が反映されること',()=>{const calculated=evaluateProject(projects[1],[engineers[1],engineers[6],engineers[11]],3000,4),run={...calculated,projectScore:50,actualReward:1000,salaryBudgetAtStart:3000,teamCostAtStart:2000,teamTechMatch:50},base=companyMetrics([run,run]).companyIndex,metric=(changes:Partial<typeof run>)=>companyMetrics([{...run,...changes},{...run,...changes}]).companyIndex;expect(metric({projectScore:55})).toBeGreaterThan(base);expect(metric({actualReward:1500})).toBeGreaterThan(base);expect(metric({teamCostAtStart:1500})).toBeGreaterThan(base);expect(metric({teamTechMatch:55})).toBeGreaterThan(base)})
 it('自社Pointsを競合9社へ追加したとき、10社順位が決定されること',()=>{const userPoints=8400,all=[...competitors.map(company=>company.points),userPoints];expect(all).toHaveLength(10);expect(competitionRank(userPoints,all)).toBe(3)})
 it('Project Performanceが同値のとき、OVRとSeed順でMVP ENGINEERが決まること',()=>{const run=evaluateProject(projects[0],[engineers[1],engineers[2]],2000,9),tied={...run,engineerPerformances:{[engineers[1].id]:80,[engineers[2].id]:80}};expect(projectMvp(tied).id).toBe(engineers[1].id);const sameOvr={...tied,teamEngineerIds:[engineers[4].id,engineers[9].id],engineerPerformances:{[engineers[4].id]:80,[engineers[9].id]:80}};expect(projectMvp(sameOvr).id).toBe(engineers[4].id)})
})
