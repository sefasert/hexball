import * as Phaser from 'phaser';
import { BaseScene } from '@/kit/BaseScene';
import { HAXBALL } from '../config';
import { useGameStore } from '@/store/useGameStore';
import { FLAG_PAINTERS } from '@/game/flagPainters';

export class BootScene extends BaseScene {
  constructor() {
    super('BootScene');
  }

  create() {
    const { selectedTeam, aiTeam, isHome } = useGameStore.getState();

    // Ev = oyuncu kırmızı (sol), Deplasman = oyuncu mavi (sağ)
    const playerColor = selectedTeam?.primary ?? (isHome ? 0xe74c3c : 0x3498db);
    const aiColor     = aiTeam?.primary       ?? (isHome ? 0x3498db : 0xe74c3c);
    const playerId    = selectedTeam?.id ?? 'tur';
    const aiId        = aiTeam?.id       ?? 'ger';

    this._buildFieldTexture();
    // Ev'de oyuncu kırmızı slotta, deplasmanda mavi slotta
    if (isHome) {
      this._buildPlayerWithFlag('player_red',  playerColor, playerId);
      this._buildPlayerWithFlag('player_blue', aiColor,     aiId);
    } else {
      this._buildPlayerWithFlag('player_blue', playerColor, playerId);
      this._buildPlayerWithFlag('player_red',  aiColor,     aiId);
    }
    this._buildBallTexture();
    this._buildGoalTexture();
    this._buildArrowTexture();

    this.scene.start('GameScene');
  }

  private _buildFlagTexture(key: string, flagEmoji: string) {
    const size = 48;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${size * 0.75}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, size, size);
    ctx.fillText(flagEmoji, size / 2, size / 2 + 2);

    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addCanvas(key, canvas);
  }

  private _buildFieldTexture() {
    const W = 1280;
    const H = 720;
    const F = HAXBALL.FIELD;

    const g = this.add.graphics();

    // Dark background
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(0, 0, W, H);

    // Grass field
    g.fillStyle(0x1e7c2e, 1);
    g.fillRect(F.LEFT, F.TOP, F.RIGHT - F.LEFT, F.BOTTOM - F.TOP);

    // Darker stripe pattern on grass
    g.fillStyle(0x186826, 0.6);
    const stripeW = 120;
    for (let x = F.LEFT; x < F.RIGHT; x += stripeW * 2) {
      g.fillRect(x, F.TOP, stripeW, F.BOTTOM - F.TOP);
    }

    // Field border
    g.lineStyle(4, 0xffffff, 0.9);
    g.strokeRect(F.LEFT, F.TOP, F.RIGHT - F.LEFT, F.BOTTOM - F.TOP);

    // Center line
    const cx = (F.LEFT + F.RIGHT) / 2;
    g.lineStyle(3, 0xffffff, 0.8);
    g.beginPath();
    g.moveTo(cx, F.TOP);
    g.lineTo(cx, F.BOTTOM);
    g.strokePath();

    // Center circle
    const cy = (F.TOP + F.BOTTOM) / 2;
    g.lineStyle(3, 0xffffff, 0.8);
    g.strokeCircle(cx, cy, 80);

    // Center dot
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx, cy, 5);

    // Goal areas (left)
    g.lineStyle(3, 0xffffff, 0.7);
    g.strokeRect(F.LEFT - F.GOAL_DEPTH, F.GOAL_TOP, F.GOAL_DEPTH, F.GOAL_BOTTOM - F.GOAL_TOP);

    // Goal areas (right)
    g.strokeRect(F.RIGHT, F.GOAL_TOP, F.GOAL_DEPTH, F.GOAL_BOTTOM - F.GOAL_TOP);

    // Penalty spots
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(F.LEFT + 80, cy, 4);
    g.fillCircle(F.RIGHT - 80, cy, 4);

    g.generateTexture('field', W, H);
    g.destroy();
  }

  private _buildPlayerWithFlag(key: string, color: number, teamId: string) {
    const R = HAXBALL.PLAYER_RADIUS;
    const size = R * 2 + 8;
    const cx = size / 2;
    const cy = size / 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // 1. Clip everything to a circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R - 2, 0, Math.PI * 2);
    ctx.clip();

    // 2. Draw flag inside the clip — scaled/centered inside the circle
    const painter = FLAG_PAINTERS[teamId];
    if (painter) {
      // Translate so flag fills the clipped circle area
      ctx.save();
      ctx.translate(cx - (R - 2), cy - (R - 2));
      painter(ctx, (R - 2) * 2);
      ctx.restore();
    } else {
      // Fallback: solid team color
      const r = (color >> 16) & 0xff;
      const g2 = (color >> 8) & 0xff;
      const b = color & 0xff;
      ctx.fillStyle = `rgb(${r},${g2},${b})`;
      ctx.fillRect(0, 0, size, size);
    }

    ctx.restore(); // remove clip

    // Dış beyaz çizgi halkası
    ctx.beginPath();
    ctx.arc(cx, cy, R - 1, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.stroke();

    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addCanvas(key, canvas);
  }

  private _buildBallTexture() {
    const R = HAXBALL.BALL_RADIUS;
    const size = R * 2 + 12;
    const cx = size / 2;
    const cy = size / 2;

    // Canvas tabanlı çizim — Phaser graphics ile polygon clip zor, canvas daha iyi
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Beyaz top zemini
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();

    // 3. Futbol topu klasik pentagon deseni (clip ile)
    // Merkez pentagon + etrafında 5 tane
    const drawPentagon = (px: number, py: number, pr: number) => {
      ctx.save();
      // Pentagon clip maskesi
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = px + pr * Math.cos(angle);
        const y = py + pr * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();
      ctx.restore();
    };

    // Merkez pentagon
    drawPentagon(cx, cy, R * 0.26);

    // Etraftaki 5 pentagon — açısal konumlandırma
    const outerDist = R * 0.72;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = cx + outerDist * Math.cos(angle);
      const py = cy + outerDist * Math.sin(angle);
      drawPentagon(px, py, R * 0.22);
    }

    // 4. Specular highlight
    const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(255,255,255,0.7)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    if (this.textures.exists('ball')) this.textures.remove('ball');
    this.textures.addCanvas('ball', canvas);
  }

  private _buildGoalTexture() {
    const F = HAXBALL.FIELD;
    const goalH = F.GOAL_BOTTOM - F.GOAL_TOP;
    const depth = F.GOAL_DEPTH;
    const g = this.add.graphics();

    // Net background
    g.fillStyle(0xffffff, 0.08);
    g.fillRect(0, 0, depth, goalH);

    // Net lines horizontal
    g.lineStyle(1, 0xffffff, 0.25);
    const spacing = 20;
    for (let y = 0; y <= goalH; y += spacing) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(depth, y);
      g.strokePath();
    }

    // Net lines vertical
    for (let x = 0; x <= depth; x += spacing) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, goalH);
      g.strokePath();
    }

    // Posts
    g.lineStyle(5, 0xffffff, 1);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(depth, 0);
    g.lineTo(depth, goalH);
    g.lineTo(0, goalH);
    g.strokePath();

    g.generateTexture('goal_net', depth, goalH);
    g.destroy();
  }

  private _buildArrowTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.9);
    // Simple up arrow for kick indicator
    g.fillTriangle(16, 0, 32, 28, 0, 28);
    g.generateTexture('arrow', 32, 32);
    g.destroy();
  }
}
