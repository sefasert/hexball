'use client';
import React from 'react';
import { useTournamentStore, GroupTeamStat, Fixture } from '@/store/useTournamentStore';
import { useGameStore } from '@/store/useGameStore';
import { useLangStore } from '@/store/useLangStore';
import { teamName } from '@/game/teams';

export type GroupView = 'table' | 'fixtures' | 'result';

interface Props {
  view: GroupView;
  onPlay: () => void;       // maça başla
  onNext: () => void;       // sonraki maça / bitişe
}

function Standing({ s, isPlayer }: { s: GroupTeamStat; isPlayer: boolean }) {
  return (
    <tr className={`border-b border-white/10 ${isPlayer ? 'bg-white/10' : ''}`}>
      <td className="py-2 px-3 text-left">
        <span className="mr-2">{s.team.flag}</span>
        <span className={`font-bold text-sm ${isPlayer ? 'text-yellow-300' : 'text-white'}`}>{s.team.abbr}</span>
      </td>
      <td className="py-2 px-3 text-center text-white/70 text-sm">{s.played}</td>
      <td className="py-2 px-3 text-center text-white/70 text-sm">{s.won}</td>
      <td className="py-2 px-3 text-center text-white/70 text-sm">{s.drawn}</td>
      <td className="py-2 px-3 text-center text-white/70 text-sm">{s.lost}</td>
      <td className="py-2 px-3 text-center text-white/70 text-sm">{s.gf}:{s.ga}</td>
      <td className="py-2 px-3 text-center font-black text-white">{s.points}</td>
    </tr>
  );
}

function FixtureRow({ f, revealed }: { f: Fixture; revealed: boolean }) {
  const showScore = f.played && revealed;
  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-xl mb-2 ${f.isPlayerMatch ? 'bg-yellow-500/20 border border-yellow-500/40' : 'bg-white/5 border border-white/10'}`}>
      <span className="text-white font-bold text-sm w-24 text-right">{f.home.flag} {f.home.abbr}</span>
      <span className="text-white/60 text-xs mx-3">
        {showScore
          ? <span className="text-white font-black text-base">{f.homeGoals} – {f.awayGoals}</span>
          : <span className="text-white/40">vs</span>}
      </span>
      <span className="text-white font-bold text-sm w-24 text-left">{f.away.abbr} {f.away.flag}</span>
    </div>
  );
}

export const GroupStage: React.FC<Props> = ({ view, onPlay, onNext }) => {
  const { stats, fixtures, playerTeam, groupId } = useTournamentStore();
  const { selectedTeam, isHome } = useGameStore();
  const { t, lang } = useLangStore();

  const sorted = [...stats].sort((a, b) =>
    b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  );

  const playerFixture = fixtures.find((f) => f.isPlayerMatch && !f.played);
  const allDone = fixtures.every((f) => f.played);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d1f2d] select-none overflow-auto py-8">
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-4xl font-black text-white tracking-tight">⚽ {t.colTeam === 'Team' ? 'Group' : 'Grup'} {groupId}</span>
        <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">{t.groupStage}</span>
      </div>

      <div className="w-full max-w-xl px-4 flex flex-col gap-6">
        {/* Puan Tablosu */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="px-4 py-2 bg-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">{t.standings}</div>
          <table className="w-full">
            <thead>
              <tr className="text-white/40 text-xs border-b border-white/10">
                <th className="py-1 px-3 text-left">{t.colTeam}</th>
                <th className="py-1 px-3">{t.colP}</th>
                <th className="py-1 px-3">{t.colW}</th>
                <th className="py-1 px-3">{t.colD}</th>
                <th className="py-1 px-3">{t.colL}</th>
                <th className="py-1 px-3">{t.colGD}</th>
                <th className="py-1 px-3">{t.colPts}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={s.team.id} className={`border-b border-white/10 ${s.team.id === playerTeam?.id ? 'bg-white/10' : ''}`}>
                  <td className="py-2 px-3 text-left">
                    <span className="text-white/40 text-xs mr-2">{i + 1}</span>
                    <span className="mr-2">{s.team.flag}</span>
                    <span className={`font-bold text-sm ${s.team.id === playerTeam?.id ? 'text-yellow-300' : 'text-white'}`}>{s.team.abbr}</span>
                  </td>
                  <td className="py-2 px-3 text-center text-white/70 text-sm">{s.played}</td>
                  <td className="py-2 px-3 text-center text-white/70 text-sm">{s.won}</td>
                  <td className="py-2 px-3 text-center text-white/70 text-sm">{s.drawn}</td>
                  <td className="py-2 px-3 text-center text-white/70 text-sm">{s.lost}</td>
                  <td className="py-2 px-3 text-center text-white/70 text-sm">{s.gf}:{s.ga}</td>
                  <td className="py-2 px-3 text-center font-black text-white">{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fikstür */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-4">
          <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">{t.matches}</div>
          {fixtures.map((f, idx) => {
            // Bir maçın skoru ancak kendisinden önceki tüm maçlar oynanmış ise gösterilir.
            // Oyuncunun kendi maçı henüz oynanmamışsa (isPlayerMatch && !played) önceki sayılmaz.
            const prevAllDone = fixtures.slice(0, idx).every((prev) => prev.played);
            return <FixtureRow key={f.id} f={f} revealed={prevAllDone} />;
          })}
        </div>

        {/* Aksiyon Butonu */}
        {!allDone && playerFixture && (
          <button
            onClick={onPlay}
            className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl active:scale-95 transition-all cursor-pointer shadow-xl"
          >
            {t.playMatch}: {playerFixture.home.flag} {playerFixture.home.abbr} vs {playerFixture.away.abbr} {playerFixture.away.flag}
          </button>
        )}

        {allDone && (
          <div className="flex flex-col items-center gap-3">
            <div className="text-white/60 text-sm font-bold uppercase tracking-widest">{t.groupDone}</div>
            <div className="text-white font-black text-xl">
              {sorted[0].team.id === playerTeam?.id ? t.qualified1 :
               sorted[1].team.id === playerTeam?.id ? t.qualified2 : t.eliminated}
            </div>
            <button
              onClick={onNext}
              className="px-10 py-3 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            >
              {t.continueGroup}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
