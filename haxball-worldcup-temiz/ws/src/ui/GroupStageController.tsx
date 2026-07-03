'use client';
import React, { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useTournamentStore } from '@/store/useTournamentStore';
import { GroupStage } from './GroupStage';
import { KnockoutStage } from './KnockoutStage';

export const GroupStageController: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const { setGameState, setAiTeam, setIsHome } = useGameStore();
  const {
    fixtures, koMatches, playerTeam, phase,
    simulateRound, recordPlayerMatch,
    buildR32, recordKOMatch, advanceKO,
  } = useTournamentStore();

  // Maç bitti → skoru kaydet
  useEffect(() => {
    if (gameState !== 'GAMEOVER') return;
    const { scoreRed, scoreBlue, isHome: ih } = useGameStore.getState();
    const playerScore = ih ? scoreRed : scoreBlue;
    const aiScore    = ih ? scoreBlue : scoreRed;

    if (phase === 'GROUP') {
      // Fikstürdeki gerçek pozisyona göre belirle (kullanıcı tercihi değil)
      const { fixtures, playerTeam: pt } = useTournamentStore.getState();
      const fx = fixtures.find(f => f.isPlayerMatch && !f.played);
      const fixturePlayerIsHome = fx ? fx.home.id === pt?.id : ih;
      recordPlayerMatch(playerScore, aiScore, fixturePlayerIsHome);
      simulateRound();
    } else {
      // KO turu — oyuncu skorunu doğrudan kaydet
      const match = koMatches.find(m => m.isPlayerMatch && !m.played && m.round === phase);
      if (match) {
        const { playerTeam: pt } = useTournamentStore.getState();
        const playerIsHomeInMatch = match.home?.id === pt?.id;
        const hg = playerIsHomeInMatch ? playerScore : aiScore;
        const ag = playerIsHomeInMatch ? aiScore : playerScore;
        recordKOMatch(match.id, hg, ag);
      }
    }

    const t = setTimeout(() => {
      useGameStore.getState().resetMatch();
    }, 3000);
    return () => clearTimeout(t);
  }, [gameState]);

  if (gameState !== 'GROUP_STAGE') return null;

  // ── Grup aşaması ──
  if (phase === 'GROUP') {
    const allDone = fixtures.every(f => f.played);

    const handlePlay = () => {
      if (!playerTeam) return;
      const fixture = fixtures.find(f => f.isPlayerMatch && !f.played);
      if (!fixture) return;
      const opponent = fixture.home.id === playerTeam.id ? fixture.away : fixture.home;
      // isHome kullanıcının seçtiği değeri korur — fikstür sırasına bağlı değil
      const { isHome } = useGameStore.getState();
      setIsHome(isHome);
      setAiTeam(opponent);
      setGameState('START');
    };

    const handleGroupDone = () => {
      buildR32(); // grup bitti → R32 kur
    };

    return (
      <GroupStage
        view={allDone ? 'result' : 'table'}
        onPlay={handlePlay}
        onNext={handleGroupDone}
      />
    );
  }

  // ── KO aşamaları (R32 → F → DONE) ──
  const handleKOPlay = () => {
    if (!playerTeam) return;
    const match = koMatches.find(m => m.isPlayerMatch && !m.played && m.round === phase);
    if (!match || !match.home || !match.away) return;
    const opponent = match.home.id === playerTeam.id ? match.away : match.home;
    // isHome kullanıcının seçtiği değeri korur
    const { isHome } = useGameStore.getState();
    setIsHome(isHome);
    setAiTeam(opponent);
    setGameState('START');
  };

  const handleKONext = () => {
    if (phase === 'DONE') {
      useTournamentStore.getState().reset();
      useGameStore.getState().reset();
      useGameStore.getState().setSelectedTeam(null as never);
      useGameStore.getState().setGameState('TEAM_SELECT');
      window.location.reload();
      return;
    }
    advanceKO(); // mevcut round'ı simüle et, sonrakine geç
  };

  return (
    <KnockoutStage
      onPlay={handleKOPlay}
      onNext={handleKONext}
    />
  );
};
