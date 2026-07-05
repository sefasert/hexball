'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useTournamentStore } from '@/store/useTournamentStore';
import { useLangStore } from '@/store/useLangStore';
import { Lang } from '@/i18n/translations';
import { teamName, Team } from '@/game/teams';
import { FLAG_PAINTERS } from '@/game/flagPainters';

function FlagCanvas({ team, size = 32 }: { team: Team | null; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !team) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    const painter = FLAG_PAINTERS[team.id];
    if (painter) painter(ctx, size);
    else { ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, size, size); }
  }, [team?.id, size]);
  if (!team) return null;
  return <canvas ref={ref} width={size} height={size} style={{ display: 'block', borderRadius: 2 }} />;
}

const LANG_FLAGS: Record<Lang, string> = { tr: '🇹🇷', en: 'EN', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸' };
const LANGS: Lang[] = ['tr', 'en', 'fr', 'de', 'es'];

const HUD: React.FC = () => {
  const { scoreRed, scoreBlue, gameState, timeLeft, isOvertime, lastGoalTeam, winner, selectedTeam, aiTeam, isHome } = useGameStore();
  const { lang, t, setLang } = useLangStore();

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
  const isUrgent = timeLeft <= 30 && !isOvertime;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50 select-none">

      {/* ── Menü Butonu ── */}
      {(gameState === 'PLAYING' || gameState === 'GOAL') && (
        <button
          className="absolute left-4 w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all pointer-events-auto cursor-pointer z-50"
          style={{ top: '3vh' }}
          onClick={() => setShowPauseMenu(true)}
        >💧 {lang === 'tr' ? 'Su Molası' : lang === 'fr' ? 'Pause' : lang === 'de' ? 'Pause' : lang === 'es' ? 'Pausa' : 'Break'}</button>
      )}

      {/* Dil seçici — sadece oyun dışında görünür */}
      {(gameState === 'TEAM_SELECT' || gameState === 'GROUP_STAGE') && (
        <div className="absolute right-4 flex items-center gap-2 pointer-events-auto z-50" style={{ top: '3vh' }}>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{lang === 'tr' ? 'Oyun Dili' : lang === 'fr' ? 'Langue' : lang === 'de' ? 'Sprache' : lang === 'es' ? 'Idioma' : 'Language'}</span>
          <div className="flex gap-1">
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all cursor-pointer ${lang === l ? 'bg-white/30 scale-110' : 'bg-white/10 hover:bg-white/20 opacity-60'}`}
              >{LANG_FLAGS[l]}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── FIFA WC 2026 Scoreboard ── */}
      {(gameState === 'PLAYING' || gameState === 'GOAL') && (
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: '1.5vh' }}>
          {/* Üst bar: FIFA WORLD CUP 2026 */}
          <div className="flex items-center justify-center w-full px-4 py-0.5 rounded-t-lg"
            style={{ background: '#1a1e6e' }}>
            <span className="text-white text-[9px] font-black tracking-[0.2em] uppercase">⚽ World Cup 2026™</span>
          </div>

          {/* Ana scoreboard */}
          <div className="flex items-stretch shadow-2xl overflow-hidden" style={{ minWidth: 340 }}>

            {/* Sol takım: renkli kutu + bayrak + abbr + skor */}
            <div className="flex items-center gap-0" style={{ background: '#c8102e' }}>
              {/* Bayrak kutusu */}
              <div className="flex items-center justify-center px-3 py-2" style={{ background: 'rgba(0,0,0,0.25)', minWidth: 48 }}>
                <FlagCanvas team={leftTeam} size={32} />
              </div>
              {/* Abbr */}
              <div className="flex items-center px-3 py-2">
                <span className="text-white font-black text-sm tracking-widest uppercase">{leftTeam?.abbr ?? '---'}</span>
              </div>
              {/* Skor */}
              <div className="flex items-center justify-center px-4 py-2" style={{ background: 'rgba(0,0,0,0.3)', minWidth: 42 }}>
                <span className="text-white font-black text-2xl leading-none">{scoreRed}</span>
              </div>
            </div>

            {/* Orta: timer */}
            <div className={`flex flex-col items-center justify-center px-4 py-1 ${isOvertime ? 'bg-orange-600' : 'bg-[#1a1e6e]'}`} style={{ minWidth: 72 }}>
              {isOvertime && (
                <span className="text-orange-200 text-[8px] font-black tracking-widest uppercase animate-pulse leading-none mb-0.5">{t.overtime}</span>
              )}
              <span className={`font-mono font-black text-xl leading-none ${isUrgent && !isOvertime ? 'text-yellow-300 animate-pulse' : 'text-white'}`}>
                {minutes}:{seconds}
              </span>
            </div>

            {/* Sağ takım: skor + abbr + bayrak */}
            <div className="flex items-center gap-0" style={{ background: '#004f9f' }}>
              {/* Skor */}
              <div className="flex items-center justify-center px-4 py-2" style={{ background: 'rgba(0,0,0,0.3)', minWidth: 42 }}>
                <span className="text-white font-black text-2xl leading-none">{scoreBlue}</span>
              </div>
              {/* Abbr */}
              <div className="flex items-center px-3 py-2">
                <span className="text-white font-black text-sm tracking-widest uppercase">{rightTeam?.abbr ?? '---'}</span>
              </div>
              {/* Bayrak kutusu */}
              <div className="flex items-center justify-center px-3 py-2" style={{ background: 'rgba(0,0,0,0.25)', minWidth: 48 }}>
                <FlagCanvas team={rightTeam} size={32} />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Maçı Hızlandır — sağ üst */}
      {(gameState === 'PLAYING' || gameState === 'GOAL') && (
        <button
          className="absolute right-4 h-8 px-3 rounded-lg bg-yellow-500/80 border border-yellow-400/50 flex items-center justify-center text-white text-[10px] font-bold hover:bg-yellow-400 active:scale-95 transition-all pointer-events-auto cursor-pointer shadow whitespace-nowrap"
          style={{ top: '3vh' }}
          onClick={() => {
            const current = useGameStore.getState().timeLeft;
            useGameStore.getState().setTimeLeft(Math.max(1, current - 30));
          }}
        >{t.speedUp}</button>
      )}

      {/* ── Controls hint ── */}
      {gameState === 'PLAYING' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-60 items-center">
          <div className="flex gap-2 text-white/70 text-xs items-center">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">↑↓←→</kbd>
            <span className="text-white/40">{t.move}</span>
            <span className="text-white/20">·</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">X</kbd>
            <span className="text-white/40">{t.shoot}</span>
          </div>
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
            <span className="text-white text-7xl font-black tracking-tight drop-shadow-lg">{t.goal}</span>
            <span className="text-white/80 text-xl font-bold tracking-widest uppercase">
              {lastGoalTeam === 'RED' ? (leftTeam ? teamName(leftTeam, lang) : '') : (rightTeam ? teamName(rightTeam, lang) : '')} {t.scored}
            </span>
          </div>
        </div>
      )}



      {/* ── Game Over Screen ── */}
      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="flex flex-col items-center gap-8 p-12 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl min-w-[420px]">
            <div className="text-5xl font-black text-white tracking-tight">
              {winner === 'DRAW'
                ? t.draw
                : (() => {
                    const playerWon = (isHome && winner === 'RED') || (!isHome && winner === 'BLUE');
                    const winnerTeam = playerWon ? selectedTeam : aiTeam;
                    return `${winnerTeam?.flag ?? ''} ${winnerTeam ? teamName(winnerTeam, lang) : ''} ${t.won}`;
                  })()}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-red-600/30 border border-red-500/40">
                <span className="text-red-300 font-bold text-xs uppercase tracking-widest">{leftTeam?.abbr ?? '—'}</span>
                <span className="text-white font-black text-5xl">{scoreRed}</span>
              </div>
              <span className="text-white/40 text-3xl font-black">:</span>
              <div className="flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-blue-600/30 border border-blue-500/40">
                <span className="text-blue-300 font-bold text-xs uppercase tracking-widest">{rightTeam?.abbr ?? '—'}</span>
                <span className="text-white font-black text-5xl">{scoreBlue}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {!tournamentActive && (
                <button
                  className="px-8 py-4 bg-white text-gray-900 font-black text-lg rounded-2xl hover:bg-gray-100 active:scale-95 transition-all shadow-xl pointer-events-auto cursor-pointer"
                  onClick={() => { useGameStore.getState().reset(); window.location.reload(); }}
                >
                  {t.playAgain}
                </button>
              )}
              {tournamentActive && (
                <div className="px-8 py-4 text-white/50 text-base font-bold text-center">
                  {t.returningToGroup}
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
                {t.changeTeam}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pause Menüsü ── */}
      {showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto z-50">
          <div className="flex flex-col items-center gap-4 p-10 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl min-w-[300px]">
            <span className="text-3xl font-black text-white mb-2">💧 Su Molası</span>

            <button
              className="w-full px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20 cursor-pointer"
              onClick={() => setShowPauseMenu(false)}
            >
              {t.resume}
            </button>

            <button
              className="w-full px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20 cursor-pointer"
              onClick={() => {
                setShowPauseMenu(false);
                useGameStore.getState().reset();
                window.location.reload();
              }}
            >
              {t.restart}
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
              {t.mainMenu}
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
