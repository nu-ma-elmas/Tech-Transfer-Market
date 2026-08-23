import { describe, expect, it } from 'vitest'
import { engineers } from '@/data/engineers'
import { projects, competitors } from '@/data/projects'
import { INITIAL_STATE } from '@/domain/types'
import { evaluateProject } from '@/domain/calculations'
import { CompanyNameSchema, GameStateSchema } from './game-state.schema'
describe('Runtime Validation',()=>{
 it('会社名が前後空白込みで入力されたとき、trimした値が検証されること',()=>expect(CompanyNameSchema.parse('  Club  ')).toBe('Club'))
 it('会社名がtrim後31文字のとき、会社設立できないこと',()=>expect(CompanyNameSchema.safeParse('a'.repeat(31)).success).toBe(false))
 it('Engineer Seed 15件、Project Seed 5件、Competitor Seed 9件が存在すること',()=>{expect(engineers).toHaveLength(15);expect(projects).toHaveLength(5);expect(competitors).toHaveLength(9)})
 it('Schema不整合のGameStateを検証したとき、Domainへ渡されないこと',()=>expect(GameStateSchema.safeParse({...INITIAL_STATE,unknown:true}).success).toBe(false))
 it.each([
  ['TEAM_1_BUILD',{companyName:'Club',phase:'TEAM_1_BUILD'}],
  ['PROJECT_2_SELECT',{companyName:'Club',phase:'PROJECT_2_SELECT'}],
  ['RETENTION_DECISION',{companyName:'Club',phase:'RETENTION_DECISION',selectedProjectId:'project-02'}],
 ] as const)('%sの必須状態が欠けているとき、復元Dataを拒否すること',(_phase,changes)=>expect(GameStateSchema.safeParse({...INITIAL_STATE,...changes}).success).toBe(false))
 it('RESULT_1で完了Project IDが欠けているとき、復元Dataを拒否すること',()=>{const run=evaluateProject(projects[0],[engineers[2]],2000,1);expect(GameStateSchema.safeParse({...INITIAL_STATE,companyName:'Club',phase:'RESULT_1',projectRuns:[run],selectedProjectId:null}).success).toBe(false)})
 it('DEVELOPMENT_1でTeamが空のとき、復元Dataを拒否すること',()=>{const run=evaluateProject(projects[0],[engineers[2]],2000,1);expect(GameStateSchema.safeParse({...INITIAL_STATE,companyName:'Club',phase:'DEVELOPMENT_1',projectRuns:[run],selectedProjectId:'project-01'}).success).toBe(false)})
})
