'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { initGame } from '../game/boot';
import { useGameStore } from '@/store/useGameStore';

const GameCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  // matchKey değişince Phaser yeniden mount edilir
  const [matchKey, setMatchKey] = useState(0);

  // GROUP_STAGE → START geçişini izle → Phaser'ı yeniden başlat
  useEffect(() => {
    const unsub = useGameStore.subscribe((s, prev) => {
      if (prev.gameState !== 'START' && s.gameState === 'START') {
        setMatchKey((k) => k + 1);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    // Önceki instance'ı temizle
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    gameRef.current = initGame(containerRef.current.id);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [matchKey]);

  return (
    <div
      id="phaser-game-container"
      ref={containerRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

export default GameCanvas;
