import type { GameState } from '@/domain/types'
export interface GameStateRepository { load(): GameState; save(state:GameState): void; reset(): void }
