'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useTournamentStore } from '@/store/useTournamentStore';
import { TEAMS, Team, teamName } from '@/game/teams';
import { FLAG_PAINTERS } from '@/game/flagPainters';
import { useLangStore } from '@/store/useLangStore';

function FlagCanvas({ teamId, size = 40 }: { teamId: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    const painter = FLAG_PAINTERS[teamId];
    if (painter) painter(ctx, size);
    else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, size, size);
    }
  }, [teamId, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: 4, display: 'block' }} />;
}

type Mode = 'menu' | 'tournament' | 'quickmatch';
type Step = 'team' | 'opponent' | 'side';

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
  const { t, lang } = useLangStore();
  const [mode, setMode] = useState<Mode>('menu');
  const [step, setStep] = useState<Step>('team');
  const [pickedTeam, setPickedTeam] = useState<Team | null>(null);
  const [pickedOpponent, setPickedOpponent] = useState<Team | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState('A');

  if (gameState !== 'TEAM_SELECT') return null;

  const grouped = TEAMS.filter((t) => t.group === activeGroup);

  const handleTeamPick = (team: Team) => {
    setPickedTeam(team);
    // Hemen ekrandan çıkma — kullanıcı Devam Et'e basar
  };

  const handleTeamConfirm = () => {
    if (!pickedTeam) return;
    if (mode === 'tournament') setStep('side');
    else setStep('opponent');
  };

  const handleOpponentPick = (team: Team) => {
    setPickedOpponent(team);
    // Hemen ekrandan çıkma — kullanıcı Devam Et'e basar
  };

  const handleOpponentConfirm = () => {
    if (!pickedOpponent) return;
    setStep('side');
  };

  const handleSidePick = (isHome: boolean) => {
    if (!pickedTeam) return;
    if (mode === 'tournament') {
      const ai = pickAiTeam(pickedTeam);
      setSelectedTeam(pickedTeam);
      setAiTeam(ai);
      setIsHome(isHome);
      initGroup(pickedTeam, pickedTeam.group);
      setGameState('GROUP_STAGE');
    } else {
      // Hızlı maç — direkt START
      const ai = pickedOpponent ?? pickAiTeam(pickedTeam);
      setSelectedTeam(pickedTeam);
      setAiTeam(ai);
      setIsHome(isHome);
      setGameState('START');
    }
  };

  // ── Ana Menü ──
  if (mode === 'menu') {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none">
        <div className="flex flex-col items-center mb-10 gap-2">
          <span className="text-5xl font-black text-white tracking-tight drop-shadow-lg">{t.worldCup}</span>
        </div>
        <div className="flex flex-col gap-4 w-72">
          <button
            onClick={() => { setMode('tournament'); setStep('team'); }}
            className="flex flex-col items-center gap-1 py-6 rounded-3xl border-2 border-yellow-500/60 bg-yellow-500/10 hover:bg-yellow-500/25 hover:scale-105 transition-all cursor-pointer"
          >
            <span className="text-4xl">🏆</span>
            <span className="text-white font-black text-xl">{t.tournament}</span>
            <span className="text-white/50 text-xs">{t.tournamentSub}</span>
          </button>
          <button
            onClick={() => { setMode('quickmatch'); setStep('team'); }}
            className="flex flex-col items-center gap-1 py-6 rounded-3xl border-2 border-green-500/60 bg-green-500/10 hover:bg-green-500/25 hover:scale-105 transition-all cursor-pointer"
          >
            <span className="text-4xl">⚡</span>
            <span className="text-white font-black text-xl">{t.quickMatch}</span>
            <span className="text-white/50 text-xs">{t.quickMatchSub}</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Hızlı Maç: Rakip Seç ──
  if (mode === 'quickmatch' && step === 'opponent' && pickedTeam) {
    const opponents = TEAMS.filter(t => t.id !== pickedTeam.id);
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none overflow-hidden">

        {/* Başlık */}
        <div className="flex flex-col items-center pt-5 pb-2 shrink-0">
          <span className="text-3xl font-black text-white tracking-tight">{t.pickOpponent}</span>
        </div>

        {/* Takım vs Rakip göstergesi */}
        <div className="flex items-center justify-center gap-4 px-6 py-2 shrink-0">
          {/* Kendi takımım — sol */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-green-500/60 bg-green-500/10">
            <FlagCanvas teamId={pickedTeam.id} size={28} />
            <span className="text-white font-black text-sm">{teamName(pickedTeam, lang)}</span>
          </div>

          <span className="text-white/40 font-black text-xl">VS</span>

          {/* Rakip — sağ */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all ${pickedOpponent ? 'border-red-500/60 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
            {pickedOpponent
              ? <><FlagCanvas teamId={pickedOpponent.id} size={28} /><span className="text-white font-black text-sm">{teamName(pickedOpponent, lang)}</span></>
              : <span className="text-white/30 text-sm font-bold">{t.pickOpponentPlaceholder}</span>
            }
          </div>

          {pickedOpponent && (
            <button
              onClick={handleOpponentConfirm}
              className="px-6 py-2 bg-green-500 hover:bg-green-400 text-white font-black text-sm rounded-2xl active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              {t.continueBtn}
            </button>
          )}
        </div>

        {/* Rakip listesi */}
        <div className="overflow-y-auto flex-1 w-full px-5 pb-2">
          <div className="grid grid-cols-6 gap-2 max-w-3xl mx-auto">
            {opponents.map((team) => {
              const isSelected = pickedOpponent?.id === team.id;
              return (
                <button key={team.id} onClick={() => handleOpponentPick(team)}
                  onMouseEnter={() => setHovered(team.id)} onMouseLeave={() => setHovered(null)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer"
                  style={{
                    background: isSelected ? `rgba(${hexToRgb(team.primary)},0.55)` : hovered === team.id ? `rgba(${hexToRgb(team.primary)},0.35)` : `rgba(${hexToRgb(team.primary)},0.12)`,
                    borderColor: isSelected ? `#${team.primary.toString(16).padStart(6,'0')}` : hovered === team.id ? `rgba(${hexToRgb(team.primary)},0.8)` : 'rgba(255,255,255,0.07)',
                    transform: isSelected ? 'scale(1.08)' : hovered === team.id ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 16px rgba(${hexToRgb(team.primary)},0.6)` : 'none',
                  }}
                >
                  <FlagCanvas teamId={team.id} size={34} />
                  <span className="text-white font-black text-xs tracking-wide">{team.abbr}</span>
                  <span className="text-white/60 font-medium text-[10px] text-center leading-tight">{teamName(team, lang)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={() => setStep('team')} className="py-2 text-white/40 hover:text-white/70 text-sm cursor-pointer transition-colors text-center shrink-0">
          {t.back}
        </button>
      </div>
    );
  }

  // ── Adım 2: Ev / Deplasman ──
  if (step === 'side' && pickedTeam) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none">
        <div className="flex flex-col items-center mb-8 gap-2">
          <span className="text-5xl font-black text-white tracking-tight drop-shadow-lg">{t.worldCup}</span>
          <span className="text-white/60 text-base font-semibold">
            {pickedTeam.flag} {teamName(pickedTeam, lang)} {t.playingAs}
          </span>
        </div>

        <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-6">{t.whichSide}</p>

        <div className="flex gap-6">
          <button
            onClick={() => handleSidePick(true)}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-red-500/60 bg-red-600/20 hover:bg-red-600/40 hover:scale-105 transition-all cursor-pointer min-w-[200px]"
          >
            <span className="text-6xl">⬅️</span>
            <span className="text-white font-black text-2xl">{t.leftSide}</span>
          </button>
          <button
            onClick={() => handleSidePick(false)}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-blue-500/60 bg-blue-600/20 hover:bg-blue-600/40 hover:scale-105 transition-all cursor-pointer min-w-[200px]"
          >
            <span className="text-6xl">➡️</span>
            <span className="text-white font-black text-2xl">{t.rightSide}</span>
          </button>
        </div>

        <button
          onClick={() => mode === 'quickmatch' ? setStep('opponent') : setStep('team')}
          className="mt-8 text-white/40 hover:text-white/70 text-sm cursor-pointer transition-colors"
        >
          {t.back}
        </button>
      </div>
    );
  }

  // ── Adım 1: Takım Seç ──
  const teamList = mode === 'quickmatch' ? TEAMS : grouped;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none overflow-hidden">

      {/* Başlık */}
      <div className="flex flex-col items-center pt-5 pb-2 gap-1 shrink-0">
        <span className="text-3xl font-black text-white tracking-tight drop-shadow-lg">{t.worldCup}</span>
        <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">
          {mode === 'tournament' ? t.tournamentPick : t.quickPick}
        </span>
      </div>

      {/* Seçili takım göstergesi */}
      <div className="flex items-center justify-center gap-3 py-2 px-6 shrink-0">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all ${pickedTeam ? 'border-green-500/60 bg-green-500/10' : 'border-white/10 bg-white/5'}`}>
          {pickedTeam
          ? <><FlagCanvas teamId={pickedTeam.id} size={28} /><span className="text-white font-black text-sm">{teamName(pickedTeam, lang)}</span></>
              : <span className="text-white/30 text-sm font-bold">{t.pickTeamPlaceholder}</span>
          }
        </div>
        {pickedTeam && (
          <button
            onClick={handleTeamConfirm}
            className="px-6 py-2 bg-green-500 hover:bg-green-400 text-white font-black text-sm rounded-2xl active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            {t.continueBtn}
          </button>
        )}
      </div>

      {/* Grup tabları — sadece turnuvada */}
      {mode === 'tournament' && (
        <div className="flex gap-2 justify-center mb-2 shrink-0">
          {GROUPS.map((g) => (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`w-9 h-9 rounded-xl font-black text-sm transition-all cursor-pointer
                ${activeGroup === g ? 'bg-white text-gray-900 shadow-lg scale-110' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
            >{g}</button>
          ))}
        </div>
      )}

      {/* Takım listesi */}
      <div className="overflow-y-auto flex-1 w-full px-5 pb-2">
        <div className={`grid gap-2 mx-auto ${mode === 'quickmatch' ? 'grid-cols-6 max-w-3xl' : 'grid-cols-4 max-w-2xl'}`}>
          {teamList.map((team) => {
            const isSelected = pickedTeam?.id === team.id;
            return (
              <button key={team.id} onClick={() => handleTeamPick(team)}
                onMouseEnter={() => setHovered(team.id)} onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer"
                style={{
                  background: isSelected ? `rgba(${hexToRgb(team.primary)},0.55)` : hovered === team.id ? `rgba(${hexToRgb(team.primary)},0.35)` : `rgba(${hexToRgb(team.primary)},0.12)`,
                  borderColor: isSelected ? `#${team.primary.toString(16).padStart(6,'0')}` : hovered === team.id ? `rgba(${hexToRgb(team.primary)},0.8)` : 'rgba(255,255,255,0.07)',
                  transform: isSelected ? 'scale(1.08)' : hovered === team.id ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 16px rgba(${hexToRgb(team.primary)},0.6)` : 'none',
                }}
              >
                <FlagCanvas teamId={team.id} size={mode === 'quickmatch' ? 34 : 40} />
                <span className="text-white font-black text-xs tracking-wide">{team.abbr}</span>
                <span className="text-white/60 font-medium text-[10px] text-center leading-tight">{teamName(team, lang)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => setMode('menu')} className="py-2 text-white/40 hover:text-white/70 text-sm cursor-pointer transition-colors text-center shrink-0">
        {t.backMenu}
      </button>
    </div>
  );
};
