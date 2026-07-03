import { create } from 'zustand';
import type { Team } from '@/game/teams';

type GameStatus = 'TEAM_SELECT' | 'GROUP_STAGE' | 'START' | 'PLAYING' | 'GOAL' | 'GAMEOVER';

interface GameState {
  scoreRed: number;
  scoreBlue: number;
  gameState: GameStatus;
  timeLeft: number;
  lastGoalTeam: 'RED' | 'BLUE' | null;
  winner: 'RED' | 'BLUE' | 'DRAW' | null;
  selectedTeam: Team | null;
  aiTeam: Team | null;
  isHome: boolean; // true = ev (kırmızı/sol), false = deplasman (mavi/sağ)

  // Actions
  goalScored: (team: 'RED' | 'BLUE') => void;
  setGameState: (state: GameStatus) => void;
  setTimeLeft: (t: number) => void;
  setWinner: (w: 'RED' | 'BLUE' | 'DRAW') => void;
  setSelectedTeam: (team: Team) => void;
  setAiTeam: (team: Team) => void;
  setIsHome: (v: boolean) => void;
  reset: () => void;
  resetMatch: () => void; // sadece skor/timer sıfırla, takım/mod koru
}

export const useGameStore = create<GameState>((set) => ({
  scoreRed: 0,
  scoreBlue: 0,
  gameState: 'TEAM_SELECT',
  timeLeft: 180,
  lastGoalTeam: null,
  winner: null,
  selectedTeam: null,
  aiTeam: null,
  isHome: true,

  goalScored: (team) =>
    set((state) => ({
      scoreRed: team === 'RED' ? state.scoreRed + 1 : state.scoreRed,
      scoreBlue: team === 'BLUE' ? state.scoreBlue + 1 : state.scoreBlue,
      lastGoalTeam: team,
      gameState: 'GOAL',
    })),

  setGameState: (s) => set({ gameState: s }),
  setTimeLeft: (t) => set({ timeLeft: t }),
  setWinner: (w) => set({ winner: w, gameState: 'GAMEOVER' }),
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setAiTeam: (team) => set({ aiTeam: team }),
  setIsHome: (v) => set({ isHome: v }),

  resetMatch: () =>
    set((s) => ({
      scoreRed: 0,
      scoreBlue: 0,
      gameState: 'GROUP_STAGE',
      timeLeft: 180,
      lastGoalTeam: null,
      winner: null,
      selectedTeam: s.selectedTeam,
      aiTeam: s.aiTeam,
      isHome: s.isHome,
    })),



  reset: () =>
    set((s) => ({
      scoreRed: 0,
      scoreBlue: 0,
      gameState: 'TEAM_SELECT',
      timeLeft: 180,
      lastGoalTeam: null,
      winner: null,
      selectedTeam: s.selectedTeam,
      aiTeam: s.aiTeam,
      isHome: s.isHome,
    })),
}));
