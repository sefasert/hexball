import { BaseScene } from '@/kit/BaseScene';
import { useGameStore } from '@/store/useGameStore';
import * as Phaser from 'phaser';

export class StartScene extends BaseScene {
  private startKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('StartScene');
  }

  create() {
    // If no team selected yet, stay in TEAM_SELECT (React UI handles it)
    if (!useGameStore.getState().selectedTeam) {
      useGameStore.getState().setGameState('TEAM_SELECT');
    } else {
      useGameStore.getState().setGameState('START');
    }

    this.startKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    if (useGameStore.getState().selectedTeam) {
      const enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      enterKey.once('down', () => this._startGame());
      this.startKey.once('down', () => this._startGame());
      this.input.once('pointerdown', () => this._startGame());
    }

    // "Maça Başla" veya GROUP_STAGE → START geçişini izle
    const unsub = useGameStore.subscribe((s) => {
      if (s.gameState === 'START') {
        unsub();
        this.time.delayedCall(50, () => this._startGame());
      }
    });
  }

  private _startGame() {
    // Remove all key listeners before switching scene to prevent bleed-over
    this.input.keyboard!.clearCaptures();
    this.input.keyboard!.removeAllKeys(true);
    this.scene.start('BootScene');
    useGameStore.getState().setGameState('PLAYING');
  }
}
