import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { INITIAL_STATE } from '@/domain/types'
import { completeRetention, retainEngineer, revealResult, selectProject, startProject } from '@/usecases/game-actions'
import Home from './page'

function installStorage(){const values=new Map<string,string>();const api={get length(){return values.size},clear:()=>values.clear(),getItem:(key:string)=>values.get(key)??null,key:(index:number)=>[...values.keys()][index]??null,removeItem:(key:string)=>values.delete(key),setItem:(key:string,value:string)=>values.set(key,value)} as Storage;Object.defineProperty(window,'localStorage',{configurable:true,value:api});return values}
function seasonStates(){const teamOne={...selectProject({...INITIAL_STATE,companyName:'Viewport Club',phase:'PROJECT_1_SELECT'},'project-01'),teamEngineerIds:['infra-05','fe-03','be-04']},developmentOne=startProject(teamOne,1),resultOne=revealResult(developmentOne),projectTwo={...resultOne,phase:'PROJECT_2_SELECT' as const,selectedProjectId:null};let retention=selectProject(projectTwo,'project-02');for(const id of retention.projectRuns[0].teamEngineerIds)retention=retainEngineer(retention,id);const teamTwo=completeRetention(retention),developmentTwo=startProject(teamTwo,2),resultTwo=revealResult(developmentTwo),season={...resultTwo,phase:'SEASON_COMPLETE' as const};return{teamOne,developmentOne,resultOne,retention,teamTwo,developmentTwo,resultTwo,season}}
describe('会社設立', () => {
  beforeEach(()=>{installStorage();vi.restoreAllMocks();Object.defineProperty(window,'matchMedia',{configurable:true,value:vi.fn().mockReturnValue({matches:false})})})
  afterEach(()=>vi.useRealTimers())
  it('Company Setupを表示したとき、ゲーム名と開始説明が表示されること', async () => {
    window.localStorage.clear()
    render(<Home />)
    expect(await screen.findByRole('heading', { name: /Build your/ })).toBeInTheDocument()
    expect(screen.getByText('TECH TRANSFER MARKET')).toBeInTheDocument()
  })
  it('会社名を入力して設立したとき、Project選択からMarket採用までKeyboardで操作できること', async () => {
    window.localStorage.clear()
    const user=userEvent.setup()
    render(<Home />)
    const input=await screen.findByPlaceholderText('会社名を入力')
    await user.click(input)
    await user.keyboard('Keyboard Club')
    await user.tab()
    expect(screen.getByRole('button',{name:'会社を設立する'})).toHaveFocus()
    await user.keyboard('{Enter}')
    const projectButton=screen.getByRole('button',{name:/地域ECリニューアル/})
    await user.click(projectButton)
    expect(screen.getByRole('button',{name:'閉じる'})).toHaveFocus()
    await user.tab({shift:true})
    expect(screen.getByRole('button',{name:'この案件を選ぶ'})).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button',{name:'閉じる'})).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(projectButton).toHaveFocus()
    await user.click(projectButton)
    expect(screen.getByText('推奨3スロット')).toBeInTheDocument()
    await user.click(screen.getByRole('button',{name:'この案件を選ぶ'}))
    expect(await screen.findByText('TRANSFER MARKET')).toBeInTheDocument()
    expect(screen.getByRole('navigation',{name:'メインナビゲーション'})).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('並び替え'),'salary')
    await user.click(screen.getByRole('button',{name:'Backend'}))
    expect(screen.getByText('小林 莉奈')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button',{name:'獲得する'})[0])
    await user.click(screen.getByRole('dialog',{name:'獲得確認'}).querySelector('button.primary')!)
    expect(await screen.findByText(/NEW SIGNING/)).toBeInTheDocument()
  })
  it.each([320,375,390,768])('%dpx幅でMarket・Formation・Modalが操作可能であること',async width=>{
    const values=installStorage(),state=seasonStates().teamOne
    values.set('tech-transfer-market:v1',JSON.stringify(state))
    Object.defineProperty(window,'innerWidth',{configurable:true,value:width})
    window.dispatchEvent(new Event('resize'))
    render(<Home />)
    await userEvent.click(await screen.findByRole('button',{name:'MARKET'}))
    expect(screen.getByLabelText('My Team')).toBeInTheDocument()
    expect(screen.getByText(/Match .*\/3人/)).toBeInTheDocument()
    await userEvent.click(screen.getByText('加藤 結衣'))
    expect(screen.getByRole('dialog',{name:'加藤 結衣'})).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    const navigation=screen.getByRole('navigation',{name:'メインナビゲーション'})
    expect(navigation.querySelectorAll('button')).toHaveLength(3)
    await userEvent.click(screen.getByRole('button',{name:'PROJECTS'}))
    await userEvent.click(screen.getByRole('button',{name:/B2B SaaS MVP/}))
    expect(screen.getByRole('dialog',{name:'B2B SaaS MVP'})).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button',{name:'CLUB'}))
    expect(screen.getByLabelText('My Team')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button',{name:'MARKET'}))
    expect(document.querySelectorAll('.engineer-card')).toHaveLength(12)
    expect(document.querySelector('.compact-sticky')).toBeInTheDocument()
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width)
  })
  it.each([
    ['Development',()=>seasonStates().developmentOne,/Building/],
    ['Project 1 Result',()=>seasonStates().resultOne,/FINAL SCORE/],
    ['Retention',()=>seasonStates().retention,/RETENTION DECISION/],
    ['Project 2 Result',()=>seasonStates().resultTwo,/シーズン結果を見る/],
    ['Season Complete',()=>seasonStates().season,/LEAGUE TABLE/],
  ] as const)('%sの保存StateをReloadしたとき、主要画面が復元されること',async(_name,makeState,expected)=>{
    const values=installStorage();values.set('tech-transfer-market:v1',JSON.stringify(makeState()))
    render(<Home />)
    expect(await screen.findByText(expected)).toBeInTheDocument()
  })
  it('Developmentを開始したとき、Timerが再登録されずResultへ一度だけ遷移すること',async()=>{
    vi.useFakeTimers()
    const values=installStorage();values.set('tech-transfer-market:v1',JSON.stringify(seasonStates().developmentOne))
    render(<Home />)
    await act(async()=>{await vi.advanceTimersByTimeAsync(0)})
    expect(screen.getByText('Building…')).toBeInTheDocument()
    await act(async()=>{await vi.advanceTimersByTimeAsync(3600)})
    expect(screen.getByText(/FINAL SCORE/)).toBeInTheDocument()
    expect(screen.getAllByText(/FINAL SCORE/)).toHaveLength(1)
  })
  it('ResultをPROJECT COMPLETE、Reward、評価、MVP、Performanceの順に段階Revealすること',async()=>{
    vi.useFakeTimers()
    const values=installStorage();values.set('tech-transfer-market:v1',JSON.stringify(seasonStates().resultOne))
    render(<Home />)
    await act(async()=>{await vi.advanceTimersByTimeAsync(0)})
    expect(screen.getByText('PROJECT COMPLETE')).toBeInTheDocument()
    expect(screen.queryByText('実獲得報酬')).not.toBeInTheDocument()
    await act(async()=>{await vi.advanceTimersByTimeAsync(200)})
    expect(screen.getByText('実獲得報酬')).toBeInTheDocument()
    expect(screen.queryByText('納期')).not.toBeInTheDocument()
    await act(async()=>{await vi.advanceTimersByTimeAsync(200)})
    expect(screen.getByText('納期')).toBeInTheDocument()
    expect(screen.queryByText('MVP ENGINEER')).not.toBeInTheDocument()
    await act(async()=>{await vi.advanceTimersByTimeAsync(200)})
    expect(screen.getByText('MVP ENGINEER')).toBeInTheDocument()
    expect(document.querySelectorAll('.performances article')).toHaveLength(0)
    await act(async()=>{await vi.advanceTimersByTimeAsync(200)})
    expect(document.querySelectorAll('.performances article')).toHaveLength(3)
    expect(screen.getByRole('button',{name:'次の案件を選ぶ'})).toBeInTheDocument()
  })
  it('reduced motionでは待機せず同じ順序でResult全体を静的表示すること',async()=>{
    Object.defineProperty(window,'matchMedia',{configurable:true,value:vi.fn().mockReturnValue({matches:true})})
    const values=installStorage();values.set('tech-transfer-market:v1',JSON.stringify(seasonStates().resultOne))
    render(<Home />)
    await screen.findByText('PROJECT COMPLETE')
    const stages=[document.querySelector('.result-reveal'),document.querySelector('.reward'),document.querySelector('.result-scores'),document.querySelector('.mvp'),document.querySelector('.performances')]
    expect(stages.every(Boolean)).toBe(true)
    for(let index=0;index<stages.length-1;index++)expect(stages[index]!.compareDocumentPosition(stages[index+1]!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
  it.each([320,375,390,768])('%dpx幅でDevelopment・Result・Season Rankingが閲覧可能であること',async width=>{
    Object.defineProperty(window,'innerWidth',{configurable:true,value:width});window.dispatchEvent(new Event('resize'))
    for(const [state,expected] of [[seasonStates().developmentOne,/Building/],[seasonStates().resultOne,/FINAL SCORE/],[seasonStates().season,/LEAGUE TABLE/]] as const){const values=installStorage();values.set('tech-transfer-market:v1',JSON.stringify(state));const view=render(<Home/>);expect(await screen.findByText(expected)).toBeInTheDocument();expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);if(state.phase==='RESULT_1'){await screen.findByRole('button',{name:'次の案件を選ぶ'});expect(document.querySelectorAll('.performances article')).toHaveLength(3)}if(state.phase==='SEASON_COMPLETE')expect(document.querySelectorAll('.league div')).toHaveLength(10);view.unmount()}
  })
  it('会社設立から2案件完了・Reload・10社順位・Resetまで連続操作できること',async()=>{
    vi.spyOn(window,'confirm').mockReturnValue(true)
    const user=userEvent.setup(),hire=async(name:string)=>{await user.click(screen.getByText(name));await user.click(screen.getByRole('dialog',{name}).querySelector('button.primary')!);await user.click(screen.getByRole('dialog',{name:'獲得確認'}).querySelector('button.primary')!);await act(async()=>{await new Promise(resolve=>setTimeout(resolve,1800))})}
    const view=render(<Home/>);await screen.findByPlaceholderText('会社名を入力')
    await user.type(screen.getByPlaceholderText('会社名を入力'),'E2E Club');await user.click(screen.getByRole('button',{name:'会社を設立する'}));await user.click(screen.getByRole('button',{name:/地域ECリニューアル/}));await user.click(screen.getByRole('button',{name:'この案件を選ぶ'}))
    await hire('加藤 結衣');await hire('小林 莉奈');await hire('林 翼')
    await user.click(screen.getByRole('button',{name:'CLUB'}));await user.click(screen.getByRole('button',{name:'開発開始'}));await user.click(screen.getByRole('dialog',{name:'開発開始'}).querySelector('button.primary')!);expect(await screen.findByText(/FINAL SCORE/ ,{}, {timeout:5000})).toBeInTheDocument()
    view.unmount();const reloaded=render(<Home/>);expect(await screen.findByText(/FINAL SCORE/)).toBeInTheDocument();await user.click(await screen.findByRole('button',{name:'次の案件を選ぶ'}));await user.click(screen.getByRole('button',{name:/B2B SaaS MVP/}));await user.click(screen.getByRole('button',{name:'この案件を選ぶ'}))
    for(const button of screen.getAllByRole('button',{name:'残留'}))await user.click(button)
    await user.click(screen.getByRole('button',{name:'判断を確定する'}));await user.click(screen.getByRole('button',{name:'開発開始'}));await user.click(screen.getByRole('dialog',{name:'開発開始'}).querySelector('button.primary')!);expect(await screen.findByText(/FINAL SCORE/ ,{}, {timeout:5000})).toBeInTheDocument();await user.click(await screen.findByRole('button',{name:'シーズン結果を見る'}));expect(document.querySelectorAll('.league div')).toHaveLength(10);await user.click(screen.getByRole('button',{name:'最初からやり直す'}));expect(screen.getByRole('button',{name:'会社を設立する'})).toBeInTheDocument();reloaded.unmount()
  },30000)
  it('Season CompleteでResetしたとき、Company Setupへ戻ること',async()=>{
    const values=installStorage();values.set('tech-transfer-market:v1',JSON.stringify(seasonStates().season));vi.spyOn(window,'confirm').mockReturnValue(true)
    const user=userEvent.setup();render(<Home />);await user.click(await screen.findByRole('button',{name:'最初からやり直す'}));expect(await screen.findByRole('button',{name:'会社を設立する'})).toBeInTheDocument()
  })
  it('破損Dataの隔離保存に失敗したとき、初期表示後もPrimary Keyを上書きしないこと',async()=>{
    const raw='{broken',values=new Map([['tech-transfer-market:v1',raw]])
    const failingStorage={get length(){return values.size},clear:()=>values.clear(),getItem:(key:string)=>values.get(key)??null,key:()=>null,removeItem:(key:string)=>values.delete(key),setItem:(key:string,value:string)=>{if(key.endsWith('corrupt-backup'))throw new Error('quota');values.set(key,value)}} as Storage
    Object.defineProperty(window,'localStorage',{configurable:true,value:failingStorage})
    render(<Home />)
    expect(await screen.findByText(/保存データを隔離できません/)).toBeInTheDocument()
    expect(values.get('tech-transfer-market:v1')).toBe(raw)
  })
})
