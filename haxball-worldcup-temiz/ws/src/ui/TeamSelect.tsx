'use client';
import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useTournamentStore } from '@/store/useTournamentStore';
import { TEAMS, Team } from '@/game/teams';

type Step = 'team' | 'side';

function pickAiTeam(playerTeam: Team): Team {
  const sameGroup = TEAMS.filter((t) => t.group === playerTeam.group && t.id !== playerTeam.id);
  return sameGroup[Math.floor(Math.random() * sameGroup.length)];
}

function hexToRgb(hex: number): string {
  return `${(hex >> 16) & 0xff},${(hex >> 8) & 0xff},${hex & 0xff}`;
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const TeamSelect: React.FC = () => {
  const { gameState, setSelectedTeam, setAiTeam, setIsHome, setGameState } = useGameStore();
  const { initGroup } = useTournamentStore();
  const [step, setStep] = useState<Step>('team');
  const [pickedTeam, setPickedTeam] = useState<Team | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState('A');

  if (gameState !== 'TEAM_SELECT') return null;

  const grouped = TEAMS.filter((t) => t.group === activeGroup);

  const handleTeamPick = (team: Team) => {
    setPickedTeam(team);
    setStep('side');
  };

  const handleSidePick = (isHome: boolean) => {
    if (!pickedTeam) return;
    const ai = pickAiTeam(pickedTeam);
    setSelectedTeam(pickedTeam);
    setAiTeam(ai);
    setIsHome(isHome);
    initGroup(pickedTeam, pickedTeam.group);
    setGameState('GROUP_STAGE');
  };

  // ── Adım 2: Ev / Deplasman ──
  if (step === 'side' && pickedTeam) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none">
        <div className="flex flex-col items-center mb-8 gap-2">
          <span className="text-5xl font-black text-white tracking-tight drop-shadow-lg">⚽ Dünya Kupası 2026</span>
          <span className="text-white/60 text-base font-semibold">
            {pickedTeam.flag} {pickedTeam.name} ile oynuyorsun
          </span>
        </div>

        <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-6">Ev mi, Deplasman mı?</p>

        <div className="flex gap-6">
          {/* Ev */}
          <button
            onClick={() => handleSidePick(true)}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-red-500/60 bg-red-600/20 hover:bg-red-600/40 hover:scale-105 transition-all cursor-pointer min-w-[200px]"
          >
            <span className="text-6xl">🏠</span>
            <span className="text-white font-black text-2xl">Ev</span>
            <div className="flex flex-col items-center gap-1 text-white/70 text-sm">
              <span>🔴 Kırmızı Forma</span>
              <span>Sol Kale</span>
            </div>
          </button>

          {/* Deplasman */}
          <button
            onClick={() => handleSidePick(false)}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-blue-500/60 bg-blue-600/20 hover:bg-blue-600/40 hover:scale-105 transition-all cursor-pointer min-w-[200px]"
          >
            <span className="text-6xl">✈️</span>
            <span className="text-white font-black text-2xl">Deplasman</span>
            <div className="flex flex-col items-center gap-1 text-white/70 text-sm">
              <span>🔵 Mavi Forma</span>
              <span>Sağ Kale</span>
            </div>
          </button>
        </div>

        <button
          onClick={() => setStep('team')}
          className="mt-8 text-white/40 hover:text-white/70 text-sm cursor-pointer transition-colors"
        >
          ← Takım seçimine dön
        </button>
      </div>
    );
  }

  // ── Adım 1: Takım Seç ──
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none">
      <div className="flex flex-col items-center mb-6">
        <span className="text-5xl font-black text-white tracking-tight drop-shadow-lg">⚽ Dünya Kupası 2026</span>
        <span className="text-white/50 text-sm font-semibold tracking-widest uppercase mt-1">Takımını Seç</span>
      </div>

      <div className="flex gap-2 mb-5">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`w-10 h-10 rounded-xl font-black text-sm transition-all cursor-pointer
              ${activeGroup === g ? 'bg-white text-gray-900 shadow-lg scale-110' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3 px-8 max-w-2xl w-full">
        {grouped.map((team) => (
          <button
            key={team.id}
            onClick={() => handleTeamPick(team)}
            onMouseEnter={() => setHovered(team.id)}
            onMouseLeave={() => setHovered(null)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer"
            style={{
              background: hovered === team.id ? `rgba(${hexToRgb(team.primary)},0.5)` : `rgba(${hexToRgb(team.primary)},0.2)`,
              borderColor: hovered === team.id ? `#${team.primary.toString(16).padStart(6,'0')}` : 'rgba(255,255,255,0.1)',
              transform: hovered === team.id ? 'scale(1.06)' : 'scale(1)',
              boxShadow: hovered === team.id ? `0 0 20px rgba(${hexToRgb(team.primary)},0.5)` : 'none',
            }}
          >
            <span className="text-4xl leading-none">{team.flag}</span>
            <span className="text-white font-bold text-xs text-center leading-tight">{team.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-white/30 text-xs">Tüm grupları gezmek için sekmelere tıkla</p>
    </div>
  );
};
