import * as Phaser from 'phaser';
import { GAME, ASSET_PREFIX } from './config';
import { BaseScene } from '@/kit/BaseScene';
import { StartScene } from './scenes/StartScene';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

export function initGame(containerId: string): Phaser.Game {
  BaseScene.assetPrefix = ASSET_PREFIX;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME.width,
    height: GAME.height,
    parent: containerId,
    backgroundColor: '#1a1a2e',
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: GAME.debug },
    },
    scene: [StartScene, BootScene, GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: false,
      antialias: true,
      roundPixels: false,
    },
  };

  return new Phaser.Game(config);
}
