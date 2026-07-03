'use client';
import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useTournamentStore } from '@/store/useTournamentStore';

const HUD: React.FC = () => {
  const { scoreRed, scoreBlue, gameState, timeLeft, lastGoalTeam, winner, selectedTeam, aiTeam, isHome } = useGameStore();

  // Sol slot = kırmızı takım, Sağ slot = mavi takım
  // Ev: oyuncu kırmızı (sol), AI mavi (sağ)
  // Deplasman: AI kırmızı (sol), oyuncu mavi (sağ)
  const leftTeam  = isHome ? selectedTeam : aiTeam;
  const rightTeam = isHome ? aiTeam : selectedTeam;
  const [showGoalBanner, setShowGoalBanner] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const tournamentActive = useTournamentStore((s) => s.active);

  // Show GOAL banner briefly
  useEffect(() => {
    if (gameState === 'GOAL') {
      setShowGoalBanner(true);
      const t = setTimeout(() => setShowGoalBanner(false), 2500);
      return () => clearTimeout(t);
    }
    if (gameState === 'GROUP_STAGE' || gameState === 'TEAM_SELECT') {
      setShowGoalBanner(false);
      setShowPauseMenu(false);
    }
  }, [gameState, scoreRed, scoreBlue]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const isUrgent = timeLeft <= 30;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50 select-none">

      {/* ── Menü Butonu ── */}
      {(gameState === 'PLAYING' || gameState === 'GOAL') && (
        <button
          className="absolute left-4 w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all pointer-events-auto cursor-pointer z-50"
          style={{ top: '3vh' }}
          onClick={() => setShowPauseMenu(true)}
        >☰</button>
      )}

      {/* ── Top Scoreboard — sahanın dışında, üst boşlukta ortalı ── */}
      {(gameState === 'PLAYING' || gameState === 'GOAL') && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ top: '1.5vh' }}>
        <div className="flex items-center gap-0 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          {/* Sol (Kırmızı) */}
          <div className="flex items-center gap-3 bg-red-600/90 px-6 py-3 backdrop-blur-md">
            {leftTeam
              ? <span className="text-2xl leading-none">{leftTeam.flag}</span>
              : <div className="w-4 h-4 rounded-full bg-white/90 shadow" />}
            <span className="text-white font-black text-3xl leading-none drop-shadow">{scoreRed}</span>
            <span className="text-red-200 text-xs font-bold tracking-widest uppercase">
              {leftTeam ? leftTeam.abbr : 'RED'}
            </span>
          </div>

          {/* Timer */}
          <div className={`flex flex-col items-center px-6 py-3 backdrop-blur-md ${isUrgent ? 'bg-yellow-500/90' : 'bg-gray-900/90'}`}>
            <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">Süre</span>
            <span className={`font-mono font-black text-2xl leading-none ${isUrgent ? 'text-gray-900 animate-pulse' : 'text-white'}`}>
              {minutes}:{seconds}
            </span>
          </div>

          {/* Sağ (Mavi) */}
          <div className="flex items-center gap-3 bg-blue-600/90 px-6 py-3 backdrop-blur-md flex-row-reverse">
            {rightTeam
              ? <span className="text-2xl leading-none">{rightTeam.flag}</span>
              : <div className="w-4 h-4 rounded-full bg-white/90 shadow" />}
            <span className="text-white font-black text-3xl leading-none drop-shadow">{scoreBlue}</span>
            <span className="text-blue-200 text-xs font-bold tracking-widest uppercase">
              {rightTeam ? rightTeam.abbr : 'BLU'}
            </span>
          </div>
        </div>

        {/* Süre Hızlandır butonu — skor tablosunun sağında */}
        <button
          className="h-10 px-3 rounded-xl bg-yellow-500/80 border border-yellow-400/50 flex items-center justify-center text-white text-xs font-bold hover:bg-yellow-400 active:scale-95 transition-all pointer-events-auto cursor-pointer shadow-lg whitespace-nowrap"
          title="30 saniye azalt"
          onClick={() => {
            const current = useGameStore.getState().timeLeft;
            useGameStore.getState().setTimeLeft(Math.max(10, current - 30));
          }}
        >⚡ 30 sn azalt</button>
        </div>
      )}

      {/* ── Controls hint ── */}
      {gameState === 'PLAYING' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-60 items-center">
          <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Sen (Kırmızı):</span>
          <div className="flex gap-2 text-white/70 text-xs items-center">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">↑↓←→</kbd>
            <span>hareket</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">X</kbd>
            <span>vuruş</span>
          </div>
          <span className="text-white/30 mx-2">·</span>
          <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Mavi: AI 🤖</span>
        </div>
      )}

      {/* ── GOAL Banner ── */}
      {showGoalBanner && gameState !== 'GROUP_STAGE' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="px-16 py-8 rounded-3xl shadow-2xl border-4 flex flex-col items-center gap-2"
            style={{
              background: lastGoalTeam === 'RED' ? 'rgba(220,38,38,0.95)' : 'rgba(37,99,235,0.95)',
              borderColor: lastGoalTeam === 'RED' ? '#fca5a5' : '#93c5fd',
              animation: 'goalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <span className="text-white text-7xl font-black tracking-tight drop-shadow-lg">GOL!</span>
            <span className="text-white/80 text-xl font-bold tracking-widest uppercase">
              {lastGoalTeam === 'RED' ? `🔴 ${leftTeam?.name ?? 'Kırmızı Takım'}` : `🔵 ${rightTeam?.name ?? 'Mavi Takım'}`} GOL ATTI!
            </span>
          </div>
        </div>
      )}

      {/* ── Start Screen ── */}
      {gameState === 'START' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-8 p-12 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl font-black text-white tracking-tight drop-shadow-lg">⚽ Dünya Kupası 2026</span>
              {selectedTeam && (
                <span className="text-2xl font-bold text-white/80 flex items-center gap-2">
                  {selectedTeam.flag} {selectedTeam.name} olarak oynuyorsun
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm text-white/80">
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-red-600/30 border border-red-500/40">
                <span className="text-red-300 font-black uppercase tracking-widest text-xs mb-1">🔴 Sen (Kırmızı)</span>
                <span><kbd className="font-mono bg-white/10 px-1 rounded">↑ ↓ ← →</kbd> — Hareket</span>
                <span><kbd className="font-mono bg-white/10 px-1 rounded">X</kbd> — Vuruş</span>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-blue-600/30 border border-blue-500/40">
                <span className="text-blue-300 font-black uppercase tracking-widest text-xs mb-1">🔵 Rakip (AI 🤖)</span>
                <span className="text-white/50 text-xs">Yapay zeka kontrol eder</span>
              </div>
            </div>

            <div className="text-white/50 text-sm text-center">
              <span>3 dakika · AI rakibini yenebilir misin?</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Game Over Screen ── */}
      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="flex flex-col items-center gap-8 p-12 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl min-w-[420px]">
            <div className="text-5xl font-black text-white tracking-tight">
              {winner === 'DRAW'
                ? '🤝 Berabere!'
                : (() => {
                    // winner RED/BLUE → hangi takımın kazandığını doğru bul
                    const playerWon = (isHome && winner === 'RED') || (!isHome && winner === 'BLUE');
                    const winnerTeam = playerWon ? selectedTeam : aiTeam;
                    return `${winnerTeam?.flag ?? ''} ${winnerTeam?.name ?? 'Takım'} Kazandı!`;
                  })()}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-red-600/30 border border-red-500/40">
                <span className="text-red-300 font-bold text-xs uppercase tracking-widest">{leftTeam?.abbr ?? 'EV'}</span>
                <span className="text-white font-black text-5xl">{scoreRed}</span>
              </div>
              <span className="text-white/40 text-3xl font-black">:</span>
              <div className="flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-blue-600/30 border border-blue-500/40">
                <span className="text-blue-300 font-bold text-xs uppercase tracking-widest">{rightTeam?.abbr ?? 'DEP'}</span>
                <span className="text-white font-black text-5xl">{scoreBlue}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {!tournamentActive && (
                <button
                  className="px-8 py-4 bg-white text-gray-900 font-black text-lg rounded-2xl hover:bg-gray-100 active:scale-95 transition-all shadow-xl pointer-events-auto cursor-pointer"
                  onClick={() => { useGameStore.getState().reset(); window.location.reload(); }}
                >
                  Yeniden Oyna
                </button>
              )}
              {tournamentActive && (
                <div className="px-8 py-4 text-white/50 text-base font-bold text-center">
                  ⏳ Grup tablosuna dönülüyor...
                </div>
              )}
              <button
                className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20 pointer-events-auto cursor-pointer"
                onClick={() => {
                  useTournamentStore.getState().reset();
                  useGameStore.getState().reset();
                  useGameStore.getState().setSelectedTeam(null as never);
                  useGameStore.getState().setGameState('TEAM_SELECT');
                  window.location.reload();
                }}
              >
                Takım Değiştir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pause Menüsü ── */}
      {showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto z-50">
          <div className="flex flex-col items-center gap-4 p-10 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl min-w-[300px]">
            <span className="text-3xl font-black text-white mb-2">⏸ Duraklat</span>

            <button
              className="w-full px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20 cursor-pointer"
              onClick={() => setShowPauseMenu(false)}
            >
              ▶ Devam Et
            </button>


            <button
              className="w-full px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20 cursor-pointer"
              onClick={() => {
                setShowPauseMenu(false);
                useGameStore.getState().reset();
                window.location.reload();
              }}
            >
              🔄 Yeniden Başla
            </button>

            <button
              className="w-full px-8 py-3 bg-red-600/30 text-white font-bold rounded-2xl hover:bg-red-600/50 active:scale-95 transition-all border border-red-500/40 cursor-pointer"
              onClick={() => {
                useGameStore.getState().reset();
                useGameStore.getState().setSelectedTeam(null as never);
                useGameStore.getState().setGameState('TEAM_SELECT');
                window.location.reload();
              }}
            >
              🏠 Ana Menüye Dön
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes goalPop {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HUD;
