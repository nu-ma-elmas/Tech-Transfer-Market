export type EngineerRole = 'frontend' | 'backend' | 'infrastructure'
export type Rarity = 'ELITE' | 'STAR' | 'PRO' | 'SOLID' | 'ROOKIE'
export type Rating = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'
export type GamePhase = 'COMPANY_SETUP' | 'PROJECT_1_SELECT' | 'TEAM_1_BUILD' | 'DEVELOPMENT_1' | 'RESULT_1' | 'PROJECT_2_SELECT' | 'RETENTION_DECISION' | 'TEAM_2_BUILD' | 'DEVELOPMENT_2' | 'RESULT_2' | 'SEASON_COMPLETE'

export interface Engineer {
  id: string; name: string; role: EngineerRole; title: string; skills: string[]
  abilities: { implementation: number; speed: number; quality: number; communication: number }
  ovr: number; rarity: Rarity; marketRating: 1 | 2 | 3 | 4 | 5
  transferMarketMin: number; transferMarketMax: number; desiredSalary: number; avatarVariant: string
}

export interface Project {
  id: string; name: string; division: 1 | 2 | 3 | 4 | 5; difficulty: 1 | 2 | 3 | 4 | 5; baseReward: number
  demands: { deadline: 1 | 2 | 3 | 4 | 5; quality: 1 | 2 | 3 | 4 | 5; technicalDifficulty: 1 | 2 | 3 | 4 | 5 }
  requiredStrength: Record<EngineerRole, number>
  techRequirements: { skill: string; role: EngineerRole; importance: number }[]
  recommendedSlots: EngineerRole[]
}

export interface ProjectRun {
  projectId: string; teamEngineerIds: string[]; salaryBudgetAtStart: number; teamCostAtStart: number; randomSeed: number
  projectScore: number; rating: Rating; success: boolean; deadlineScore: number; qualityScore: number; stabilityScore: number
  teamTechMatch: number; actualReward: number; salaryBudgetGrowth: number; engineerPerformances: Record<string, number>
}

export interface GameState {
  version: 1; companyName: string | null; companyCash: number; annualSalaryBudget: number; phase: GamePhase
  selectedProjectId: string | null; completedProjectIds: string[]; teamEngineerIds: string[]; releasedEngineerIds: string[]
  retentionDecisions: Record<string, 'retain' | 'release'>; projectRuns: ProjectRun[]
}

export const INITIAL_STATE: GameState = { version: 1, companyName: null, companyCash: 0, annualSalaryBudget: 2000, phase: 'COMPANY_SETUP', selectedProjectId: null, completedProjectIds: [], teamEngineerIds: [], releasedEngineerIds: [], retentionDecisions: {}, projectRuns: [] }
