import { BaseScene } from '@/kit/BaseScene';
import { useGameStore } from '@/store/useGameStore';
import * as Phaser from 'phaser';

export class StartScene extends BaseScene {
  private startKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('StartScene');
  }

  create() {
    if (!useGameStore.getState().selectedTeam) {
      useGameStore.getState().setGameState('TEAM_SELECT');
      return;
    }
    // Direkt maça geç — bekleme yok
    this.time.delayedCall(50, () => this._startGame());
  }

  private _startGame() {
    // Remove all key listeners before switching scene to prevent bleed-over
    this.input.keyboard!.clearCaptures();
    this.input.keyboard!.removeAllKeys(true);
    this.scene.start('BootScene');
    useGameStore.getState().setGameState('PLAYING');
  }
}
