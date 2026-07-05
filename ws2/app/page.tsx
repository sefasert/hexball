'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import GameWrapper from '../components/GameWrapper';

const HUD                  = dynamic(() => import('../ui/HUD'), { ssr: false });
const TeamSelect           = dynamic(() => import('../ui/TeamSelect').then(m => ({ default: m.TeamSelect })), { ssr: false });
const GroupStageController = dynamic(() => import('../ui/GroupStageController').then(m => ({ default: m.GroupStageController })), { ssr: false });

export default function Home() {
  return (
    <main className="game-container block relative w-full h-screen overflow-hidden bg-black select-none">
      <GameWrapper />
      <TeamSelect />
      <GroupStageController />
      <HUD />
    </main>
  );
}
