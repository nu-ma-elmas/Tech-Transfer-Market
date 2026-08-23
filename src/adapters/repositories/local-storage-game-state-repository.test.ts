import { describe, expect, it } from 'vitest'
import { INITIAL_STATE } from '@/domain/types'
import { BACKUP_KEY, loadGameState, resetGameState, saveGameState, STORAGE_KEY } from './local-storage-game-state-repository'
const storage=(initial:Record<string,string>={})=>{const values=new Map(Object.entries(initial));return{values,api:{get length(){return values.size},clear:()=>values.clear(),getItem:(k:string)=>values.get(k)??null,key:()=>null,removeItem:(k:string)=>values.delete(k),setItem:(k:string,v:string)=>values.set(k,v)} as Storage}}
describe('localStorage Adapter',()=>{
 it('正常な保存Dataを読み込んだとき、Season途中が復元されること',()=>{const s=storage({[STORAGE_KEY]:JSON.stringify(INITIAL_STATE)});expect(loadGameState(s.api).state).toEqual(INITIAL_STATE)})
 it('JSONが壊れているとき、Crashせず隔離して初期状態へ戻ること',()=>{const s=storage({[STORAGE_KEY]:'{bad'});expect(loadGameState(s.api).state).toEqual(INITIAL_STATE);expect(s.values.get(BACKUP_KEY)).toBe('{bad');expect(s.values.has(STORAGE_KEY)).toBe(false)})
 it('隔離保存に失敗したとき、Primary Keyを削除しないこと',()=>{const s=storage({[STORAGE_KEY]:'{bad'});s.api.setItem=()=>{throw new Error('quota')};expect(loadGameState(s.api).notice).toMatch(/隔離できません/);expect(s.values.get(STORAGE_KEY)).toBe('{bad')})
 it('読み取りに失敗したとき、自動保存を無効として初期状態を返すこと',()=>{const s=storage();s.api.getItem=()=>{throw new Error('denied')};const loaded=loadGameState(s.api);expect(loaded.state).toEqual(INITIAL_STATE);expect(loaded.persistenceEnabled).toBe(false)})
 it('隔離保存に失敗したとき、自動保存を無効にすること',()=>{const s=storage({[STORAGE_KEY]:'{bad'});s.api.setItem=()=>{throw new Error('quota')};expect(loadGameState(s.api).persistenceEnabled).toBe(false)})
 it('保存に失敗したとき、保存成功を偽装しないこと',()=>{const s=storage();s.api.setItem=()=>{throw new Error('quota')};expect(saveGameState(s.api,INITIAL_STATE)).toMatch(/保存できません/)})
 it('Schema不整合だがParse可能なDataのとき、隔離して初期状態へ戻ること',()=>{const raw=JSON.stringify({...INITIAL_STATE,version:2}),s=storage({[STORAGE_KEY]:raw});expect(loadGameState(s.api).state).toEqual(INITIAL_STATE);expect(s.values.get(BACKUP_KEY)).toBe(raw)})
 it('Reset削除に失敗したとき、以前の保存値を保持して失敗を通知すること',()=>{const s=storage({[STORAGE_KEY]:'season'});s.api.removeItem=()=>{throw new Error('denied')};expect(resetGameState(s.api)).toMatch(/削除できません/);expect(s.values.get(STORAGE_KEY)).toBe('season')})
})
