'use client';
import React from 'react';
import { useTournamentStore, KOMatch, roundLabel } from '@/store/useTournamentStore';
import { useGameStore } from '@/store/useGameStore';

interface Props {
  onPlay: () => void;
  onNext: () => void;
}

function MatchCard({ m, playerTeamId }: { m: KOMatch; playerTeamId: string | undefined }) {
  const isPlayer = m.isPlayerMatch;
  const played = m.played && m.homeGoals !== null;
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-1.5 text-sm
      ${isPlayer ? 'bg-yellow-500/20 border border-yellow-400/50' : 'bg-white/5 border border-white/10'}`}>
      <span className={`w-20 text-right font-bold truncate ${m.home?.id === playerTeamId ? 'text-yellow-300' : 'text-white'}`}>
        {m.home ? `${m.home.flag} ${m.home.abbr}` : '?'}
      </span>
      <span className="mx-2 text-white/60 text-xs font-black min-w-[36px] text-center">
        {played ? `${m.homeGoals} – ${m.awayGoals}` : 'vs'}
      </span>
      <span className={`w-20 text-left font-bold truncate ${m.away?.id === playerTeamId ? 'text-yellow-300' : 'text-white'}`}>
        {m.away ? `${m.away.abbr} ${m.away.flag}` : '?'}
      </span>
    </div>
  );
}

export const KnockoutStage: React.FC<Props> = ({ onPlay, onNext }) => {
  const { koMatches, phase, playerTeam, eliminated } = useTournamentStore();
  const { selectedTeam } = useGameStore();

  const currentMatches = koMatches.filter(m => m.round === phase);
  const playerMatch = currentMatches.find(m => m.isPlayerMatch && !m.played);
  const playerMatchDone = currentMatches.some(m => m.isPlayerMatch && m.played);
  const allCurrentDone = currentMatches.length > 0 && currentMatches.every(m => m.played);
  // Oyuncu kendi maçını oynadıysa sonraki tura geçilebilir (diğerleri advanceKO'da simüle edilir)
  const canAdvance = allCurrentDone || eliminated || playerMatchDone;
  const champion = phase === 'DONE'
    ? koMatches.find(m => m.round === 'F' && m.played)
    : null;
  const championTeam = champion
    ? ((champion.homeGoals ?? 0) >= (champion.awayGoals ?? 0) ? champion.home : champion.away)
    : null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none overflow-auto py-6">
      <div className="flex flex-col items-center gap-1 mb-4">
        <span className="text-3xl font-black text-white tracking-tight">
          🏆 {phase === 'DONE' ? 'Turnuva Bitti!' : roundLabel(phase)}
        </span>
        <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">
          FIFA Dünya Kupası 2026
        </span>
      </div>

      {/* Elenme durumu */}
      {eliminated && phase !== 'DONE' && (
        <div className="mb-4 px-6 py-3 bg-red-600/30 border border-red-500/40 rounded-2xl text-white font-bold text-center">
          ❌ Elendiniz — Diğer maçları izleyin
        </div>
      )}

      {/* Şampiyon */}
      {phase === 'DONE' && championTeam && (
        <div className="mb-6 px-10 py-5 bg-yellow-500/20 border-2 border-yellow-400/60 rounded-3xl flex flex-col items-center gap-1">
          <span className="text-yellow-300 text-xs font-bold tracking-widest uppercase">🏆 Dünya Şampiyonu</span>
          <span className="text-4xl">{championTeam.flag}</span>
          <span className="text-white font-black text-2xl">{championTeam.name}</span>
          {championTeam.id === playerTeam?.id && (
            <span className="text-yellow-300 font-bold text-sm mt-1">🎉 Tebrikler! Sen kazandın!</span>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl px-4 flex flex-col gap-4">
        {/* Mevcut round maçları */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
            {phase === 'DONE' ? 'Final Sonucu' : `${roundLabel(phase)} — ${currentMatches.length} Maç`}
          </div>
          {currentMatches.map(m => (
            <MatchCard key={m.id} m={m} playerTeamId={playerTeam?.id} />
          ))}
        </div>

        {/* Aksiyon butonları */}
        {!allCurrentDone && playerMatch && !eliminated && (
          <button
            onClick={onPlay}
            className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl active:scale-95 transition-all cursor-pointer shadow-xl"
          >
            ▶ Maça Başla: {playerMatch.home?.flag} {playerMatch.home?.abbr} vs {playerMatch.away?.abbr} {playerMatch.away?.flag}
          </button>
        )}

        {canAdvance && phase !== 'DONE' && (
          <button
            onClick={onNext}
            className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-lg rounded-2xl active:scale-95 transition-all cursor-pointer shadow-xl"
          >
            {eliminated ? '⏭ Sonraki Tura Geç' : '⏭ Sonraki Tur'}
          </button>
        )}

        {phase === 'DONE' && (
          <button
            onClick={onNext}
            className="w-full py-4 bg-white text-gray-900 font-black text-lg rounded-2xl active:scale-95 transition-all cursor-pointer shadow-xl"
          >
            🏠 Ana Menüye Dön
          </button>
        )}
      </div>
    </div>
  );
};
