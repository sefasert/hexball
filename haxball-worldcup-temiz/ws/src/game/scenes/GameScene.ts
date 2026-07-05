import * as Phaser from 'phaser';
import { BaseScene } from '@/kit/BaseScene';
import { useGameStore } from '@/store/useGameStore';
import { HAXBALL, GAME } from '../config';

interface Field {
  LEFT: number; RIGHT: number; TOP: number; BOTTOM: number;
  GOAL_TOP: number; GOAL_BOTTOM: number; GOAL_DEPTH: number;
}

interface PlayerState {
  sprite: Phaser.GameObjects.Image;
  body: Phaser.Physics.Arcade.Body;
  vx: number;
  vy: number;
  team: 'RED' | 'BLUE';
  kickCooldown: number;
}

interface BallState {
  sprite: Phaser.GameObjects.Image;
  body: Phaser.Physics.Arcade.Body;
  vx: number;
  vy: number;
}

export class GameScene extends BaseScene {
  private red!: PlayerState;
  private blue!: PlayerState;
  private ball!: BallState;
  private F!: Field;   // computed from actual canvas size at create()

  private keys!: {
    redUp: Phaser.Input.Keyboard.Key;
    redDown: Phaser.Input.Keyboard.Key;
    redLeft: Phaser.Input.Keyboard.Key;
    redRight: Phaser.Input.Keyboard.Key;
    redKick: Phaser.Input.Keyboard.Key;
    blueUp: Phaser.Input.Keyboard.Key;
    blueDown: Phaser.Input.Keyboard.Key;
    blueLeft: Phaser.Input.Keyboard.Key;
    blueRight: Phaser.Input.Keyboard.Key;
    blueKick: Phaser.Input.Keyboard.Key;
  };

  private gameTimer!: Phaser.Time.TimerEvent;
  private goalPauseActive = false;
  private aiKickTimer = 0;
  private kickoffTeam: 'RED' | 'BLUE' | null = null; // hangi renk santra yapıyor
  private kickoffIsPlayer = false; // santra yapan oyuncu mu AI mı
  private kickoffIndicator!: Phaser.GameObjects.Text;
  private playerGlow!: Phaser.GameObjects.Arc;
  // Oyuncu ve AI referansları — isHome'a göre red/blue'ya işaret eder
  private player!: PlayerState;
  private ai!: PlayerState;

  constructor() {
    super('GameScene');
  }

  create() {
    useGameStore.getState().reset();

    const W = GAME.width;
    const H = GAME.height;
    const padX = W * 0.063;   // ~80px on 1280
    const padY = H * 0.111;   // ~80px on 720
    const goalH = H * 0.278;  // ~200px goal opening
    const midY = H / 2;
    this.F = {
      LEFT:        padX,
      RIGHT:       W - padX,
      TOP:         padY,
      BOTTOM:      H - padY,
      GOAL_TOP:    midY - goalH / 2,
      GOAL_BOTTOM: midY + goalH / 2,
      GOAL_DEPTH:  W * 0.047, // ~60px on 1280
    };

    this._setupWorld();
    this._setupKeys();
    this._spawnPlayers();
    this._spawnBall();
    this._startMatch();
  }

  private _setupWorld() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Field background - scale to fill the screen
    this.add.image(W / 2, H / 2, 'field')
      .setDisplaySize(W, H)
      .setDepth(0);

    // Left goal net
    this.add.image(this.F.LEFT - this.F.GOAL_DEPTH / 2, (this.F.GOAL_TOP + this.F.GOAL_BOTTOM) / 2, 'goal_net')
      .setDepth(1);

    // Right goal net
    this.add.image(this.F.RIGHT + this.F.GOAL_DEPTH / 2, (this.F.GOAL_TOP + this.F.GOAL_BOTTOM) / 2, 'goal_net')
      .setDepth(1);
  }

  private _setupKeys() {
    const kb = this.input.keyboard!;

    // Prevent browser from consuming these keys (SPACE scrolls page, arrows scroll page)
    kb.addCapture([
      Phaser.Input.Keyboard.KeyCodes.X,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);

    this.keys = {
      redUp:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      redDown:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      redLeft:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      redRight: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      redKick:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      // mavi artık AI — bu key'ler kullanılmıyor ama tip uyumu için tutuyoruz
      blueUp:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      blueDown: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      blueLeft: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      blueRight:kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      blueKick: kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };
  }

  private _makePhysicsBody(x: number, y: number, texture: string, radius: number): { sprite: Phaser.GameObjects.Image; body: Phaser.Physics.Arcade.Body } {
    const sprite = this.add.image(x, y, texture).setDepth(5);
    this.physics.add.existing(sprite);
    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.setCircle(radius, (sprite.width - radius * 2) / 2, (sprite.height - radius * 2) / 2);
    body.setCollideWorldBounds(false);
    body.setAllowGravity(false);
    // Phaser'ın kendi fizik güncellemesini kapat — pozisyonu biz yönetiyoruz
    body.setEnable(false);
    return { sprite, body };
  }

  private _spawnPlayers() {
    const cy = (this.F.TOP + this.F.BOTTOM) / 2;
    const cx = (this.F.LEFT + this.F.RIGHT) / 2;
    const isHome = useGameStore.getState().isHome;

    const { sprite: rs, body: rb } = this._makePhysicsBody(cx - 200, cy, 'player_red',  HAXBALL.PLAYER_RADIUS);
    const { sprite: bs, body: bb } = this._makePhysicsBody(cx + 200, cy, 'player_blue', HAXBALL.PLAYER_RADIUS);

    this.red  = { sprite: rs, body: rb, vx: 0, vy: 0, team: 'RED',  kickCooldown: 0 };
    this.blue = { sprite: bs, body: bb, vx: 0, vy: 0, team: 'BLUE', kickCooldown: 0 };

    if (isHome) {
      this.player = this.red;
      this.ai     = this.blue;
    } else {
      this.player = this.blue;
      this.ai     = this.red;
    }

    // Dış beyaz glow halkası — SPACE basılıyken yanıp söner
    const R = HAXBALL.PLAYER_RADIUS;
    this.playerGlow = this.add.circle(
      this.player.sprite.x, this.player.sprite.y, R + 5, 0xffffff, 0
    ).setDepth(6).setStrokeStyle(4, 0xffffff, 1);
  }

  private _spawnBall() {
    const cx = (this.F.LEFT + this.F.RIGHT) / 2;
    const cy = (this.F.TOP + this.F.BOTTOM) / 2;
    const { sprite: bs, body: bb } = this._makePhysicsBody(cx, cy, 'ball', HAXBALL.BALL_RADIUS);
    this.ball = { sprite: bs, body: bb, vx: 0, vy: 0 };
  }

  private _startMatch() {
    useGameStore.getState().setGameState('PLAYING');

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const current = useGameStore.getState().timeLeft;
        const next = current - 1;
        useGameStore.getState().setTimeLeft(next);
        if (next <= 0) {
          this.gameTimer.destroy();
          this._endMatch();
        }
      },
    });
  }

  private _endMatch() {
    const { isOvertime } = useGameStore.getState();

    // Normal süre bitti → her zaman uzatma başlat (1–600 sn arası rastgele, maks 10 dk)
    if (!isOvertime) {
      const extraSeconds = Math.floor(Math.random() * 300) + 30; // 30 sn – 5,5 dk
      useGameStore.getState().setIsOvertime(true);
      useGameStore.getState().setTimeLeft(extraSeconds);
      this.gameTimer = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          const current = useGameStore.getState().timeLeft;
          const next = current - 1;
          useGameStore.getState().setTimeLeft(next);
          if (next <= 0) {
            this.gameTimer.destroy();
            this._finalizeMatch();
          }
        },
      });
      return;
    }

    this._finalizeMatch();
  }

  private _finalizeMatch() {
    const { scoreRed, scoreBlue } = useGameStore.getState();
    if (scoreRed > scoreBlue) useGameStore.getState().setWinner('RED');
    else if (scoreBlue > scoreRed) useGameStore.getState().setWinner('BLUE');
    else useGameStore.getState().setWinner('DRAW');
    this.goalPauseActive = true;
    if (this.gameTimer) this.gameTimer.destroy();
  }

  update(_time: number, delta: number) {
    if (this.goalPauseActive) return;
    const state = useGameStore.getState().gameState;
    if (state !== 'PLAYING') return;

    const dt = delta / 1000;

    // Santra modunda: santra yapacak takım hareket eder, rakip kendi yarısında bekler
    if (this.kickoffTeam !== null) {
      if (this.kickoffIsPlayer) {
        // Oyuncu santra yapıyor — hareket serbest
        this._handlePlayerInput(this.player, dt);
        this.ai.vx = 0; this.ai.vy = 0;
      } else {
        // AI santra yapıyor — doğrudan topa koş ve vur (savunma mantığı yok)
        this._updateAIKickoff(this.ai, dt);
        this.player.vx = 0; this.player.vy = 0;
      }
      this._applyPhysics(dt);
      this._checkGoal();   // santra sırasında da gol kontrolü yap
      this._rotateBall(dt);
      // Top merkezden gerçekten ayrılıp hareket ettiyse kickoff biter
      const cx = (this.F.LEFT + this.F.RIGHT) / 2;
      const cy = (this.F.TOP + this.F.BOTTOM) / 2;
      const distFromCenter = Math.sqrt(
        (this.ball.sprite.x - cx) ** 2 + (this.ball.sprite.y - cy) ** 2
      );
      const ballSpeed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);
      if (distFromCenter > HAXBALL.PLAYER_RADIUS && ballSpeed > 30) {
        this._releasKickoff();
      }
      return;
    }

    this._handlePlayerInput(this.player, dt);
    this._updateAI(this.ai, dt);
    this._applyPhysics(dt);
    this._checkGoal();
    this._rotateBall(dt);

    // Glow her zaman oyuncunun üzerinde — alpha X'e göre
    this.playerGlow.setPosition(this.player.sprite.x, this.player.sprite.y);
    if (this.keys.redKick.isDown) {
      const pulse = 0.5 + 0.5 * Math.sin(_time * 0.015);
      this.playerGlow.setAlpha(pulse);
    } else {
      this.playerGlow.setAlpha(0);
    }
  }

  private _updateAIKickoff(ai: PlayerState, dt: number) {
    const bx = this.ball.sprite.x;
    const by = this.ball.sprite.y;
    const F = this.F;
    const pr = HAXBALL.PLAYER_RADIUS;
    const br = HAXBALL.BALL_RADIUS;
    const speed = HAXBALL.PLAYER_SPEED;
    const minDist = pr + br; // temas mesafesi

    const dx = bx - ai.sprite.x;
    const dy = by - ai.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nx = dist > 0 ? dx / dist : 0;
    const ny = dist > 0 ? dy / dist : 0;

    // Temas mesafesine kadar yaklaş, içine girme
    if (dist > minDist + 2) {
      ai.vx = (ai.vx + nx * 1400 * dt) * 0.88;
      ai.vy = (ai.vy + ny * 1400 * dt) * 0.88;
      const vLen = Math.sqrt(ai.vx ** 2 + ai.vy ** 2);
      if (vLen > speed) { ai.vx = ai.vx / vLen * speed; ai.vy = ai.vy / vLen * speed; }
    } else {
      // Temas — hızı sıfırla, içine girme
      ai.vx = 0; ai.vy = 0;
    }

    ai.sprite.x = Phaser.Math.Clamp(ai.sprite.x + ai.vx * dt, F.LEFT + pr, F.RIGHT - pr);
    ai.sprite.y = Phaser.Math.Clamp(ai.sprite.y + ai.vy * dt, F.TOP + pr, F.BOTTOM - pr);

    // Temas varsa önce _touchBall ile fiziksel itme uygula
    if (dist <= minDist + 4) {
      this._touchBall(ai);
    }

    // Kick — temas mesafesindeyken ve cooldown bittiyse
    if (dist < minDist + 20 && ai.kickCooldown <= 0) {
      const isHome   = useGameStore.getState().isHome;
      const atkGoalX = isHome ? F.LEFT : F.RIGHT;
      const midY     = (F.TOP + F.BOTTOM) / 2;
      const aimX     = atkGoalX - ai.sprite.x;
      const aimY     = midY - ai.sprite.y + Phaser.Math.Between(-50, 50);
      const aimLen   = Math.sqrt(aimX * aimX + aimY * aimY);
      this.ball.vx   = (aimX / aimLen) * 500;
      this.ball.vy   = (aimY / aimLen) * 500;
      ai.kickCooldown = 0.5;
      this.audio.play('kick');
    }
  }

  private _releasKickoff() {
    this.kickoffTeam = null;
    if (this.kickoffIndicator) {
      this.kickoffIndicator.destroy();
      this.kickoffIndicator = null as unknown as Phaser.GameObjects.Text;
    }
  }

  private _handlePlayerInput(player: PlayerState, dt: number) {
    const k = this.keys;
    const speed = HAXBALL.PLAYER_SPEED;

    // Her zaman yön tuşları + SPACE (tek set kontrol)
    const up    = k.redUp.isDown;
    const down  = k.redDown.isDown;
    const left  = k.redLeft.isDown;
    const right = k.redRight.isDown;
    const kick  = Phaser.Input.Keyboard.JustDown(k.redKick);

    let ax = 0;
    let ay = 0;
    if (left) ax -= 1;
    if (right) ax += 1;
    if (up) ay -= 1;
    if (down) ay += 1;

    // Normalize diagonal
    if (ax !== 0 && ay !== 0) {
      ax *= 0.707;
      ay *= 0.707;
    }

    const accel = 3200;
    const drag  = 0.86;

    player.vx = (player.vx + ax * accel * dt) * drag;
    player.vy = (player.vy + ay * accel * dt) * drag;

    // Clamp to max speed
    const len = Math.sqrt(player.vx ** 2 + player.vy ** 2);
    if (len > speed) {
      player.vx = (player.vx / len) * speed;
      player.vy = (player.vy / len) * speed;
    }

    // Apply position
    player.sprite.x += player.vx * dt;
    player.sprite.y += player.vy * dt;

    // Constrain within field
    const pr = HAXBALL.PLAYER_RADIUS;
    player.sprite.x = Phaser.Math.Clamp(player.sprite.x, this.F.LEFT + pr, this.F.RIGHT - pr);
    player.sprite.y = Phaser.Math.Clamp(player.sprite.y, this.F.TOP + pr, this.F.BOTTOM - pr);

    // Kick cooldown
    if (player.kickCooldown > 0) {
      player.kickCooldown -= dt;
    }

    // Kick / touch ball
    if (kick && player.kickCooldown <= 0) {
      this._tryKick(player);
    } else {
      this._touchBall(player);
    }
  }

  private _touchBall(player: PlayerState) {
    const pr = HAXBALL.PLAYER_RADIUS;
    const br = HAXBALL.BALL_RADIUS;
    const dx = this.ball.sprite.x - player.sprite.x;
    const dy = this.ball.sprite.y - player.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = pr + br;

    if (dist < minDist && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = minDist - dist;
      this.ball.sprite.x += nx * overlap * 0.5;
      this.ball.sprite.y += ny * overlap * 0.5;
      player.sprite.x -= nx * overlap * 0.5;
      player.sprite.y -= ny * overlap * 0.5;

      // Transfer momentum
      const relVx = this.ball.vx - player.vx;
      const relVy = this.ball.vy - player.vy;
      const dot = relVx * nx + relVy * ny;
      if (dot < 0) {
        const impulse = dot * (1 + HAXBALL.BALL_BOUNCE);
        this.ball.vx -= impulse * nx;
        this.ball.vy -= impulse * ny;
        player.vx += impulse * nx * 0.3;
        player.vy += impulse * ny * 0.3;
      }
    }
  }

  private _tryKick(player: PlayerState) {
    const pr = HAXBALL.PLAYER_RADIUS;
    const br = HAXBALL.BALL_RADIUS;
    const dx = this.ball.sprite.x - player.sprite.x;
    const dy = this.ball.sprite.y - player.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const kickRange = pr + br + 20;

    if (dist < kickRange && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      const kickPower = 720;
      this.ball.vx = nx * kickPower + player.vx * 0.5;
      this.ball.vy = ny * kickPower + player.vy * 0.5;
      player.kickCooldown = 0.4;
      this.audio.play('kick');
    }
  }

  private _updateAI(ai: PlayerState, dt: number) {
    const bx = this.ball.sprite.x;
    const by = this.ball.sprite.y;
    const ax = ai.sprite.x;
    const ay = ai.sprite.y;
    const F = this.F;
    const pr = HAXBALL.PLAYER_RADIUS;
    const br = HAXBALL.BALL_RADIUS;

    // ── Strength'e göre AI parametreleri (1–100 arası) ──
    const s = useGameStore.getState().aiTeam?.strength ?? 50;
    const t = s / 100; // 0.0 → 1.0 normalize
    // Zayıf takım (t=0.28): yavaş, kısa tahmin, düşük kick
    // Güçlü takım (t=0.98): hızlı, uzun tahmin, güçlü kick
    const speed      = HAXBALL.PLAYER_SPEED;                       // oyuncuyla aynı max hız
    const predictT   = 0.1 + t * 0.7;                              // 0.1s–0.8s tahmin
    const kickPower  = 720;                                        // oyuncuyla aynı sabit güç
    const kickRand   = 120 - t * 90;                               // 120–30 rastgelelik
    const guardRatio = 0.3 + t * 0.25;                             // 0.30–0.55 savunma agresifliği
    const accel      = 2200;                                       // oyuncuyla aynı
    const drag       = 0.88;                                       // oyuncuyla aynı
    const cooldown   = 0.55 - t * 0.25;                            // 0.55s–0.30s

    // ── Decide target position ──
    // isHome=true → AI mavi (sağ taraf) → kendi kalesi RIGHT, saldırı LEFT
    // isHome=false → AI kırmızı (sol taraf) → kendi kalesi LEFT, saldırı RIGHT
    const isHome   = useGameStore.getState().isHome;
    const myGoalX  = isHome ? F.RIGHT : F.LEFT;      // AI'ın savunduğu kale
    const atkGoalX = isHome ? F.LEFT : F.RIGHT;      // AI'ın saldırdığı kale
    const cx = (F.LEFT + F.RIGHT) / 2;
    const midY = (F.TOP + F.BOTTOM) / 2;

    // Topun nereye gideceğini strength'e göre tahmin et
    const pbx = Phaser.Math.Clamp(bx + this.ball.vx * predictT, F.LEFT, F.RIGHT);
    const pby = Phaser.Math.Clamp(by + this.ball.vy * predictT, F.TOP, F.BOTTOM);

    let targetX: number;
    let targetY: number;

    const ballOnMySide = isHome ? bx > cx : bx < cx;
    const distToBall = Phaser.Math.Distance.Between(ax, ay, bx, by);
    const ballHeadingToMyGoal = isHome
      ? (this.ball.vx > 0 && bx > cx)
      : (this.ball.vx < 0 && bx < cx);

    // Strength'e göre AI ne kadar rakip yarısına girebilir:
    // Zayıf (t=0.28): orta sahayı pek geçmez
    // Güçlü (t=0.98): rakip yarısına serbestçe girer
    // attackDepth: AI'nın rakip yarısına ne kadar dalabileceği (0=orta hat, 1=rakip kale çizgisi)
    const attackDepth = t * 0.75; // 0 → 0.75
    const maxAttackX = isHome
      ? cx - (cx - F.LEFT)  * attackDepth   // sol kaleye ne kadar yaklaşabilir
      : cx + (F.RIGHT - cx) * attackDepth;  // sağ kaleye ne kadar yaklaşabilir

    if (ballOnMySide || ballHeadingToMyGoal) {
      // Topu kesmek için öngörülen noktaya koş, ama attackDepth kadar rakip yarıya girebilir
      targetX = isHome
        ? Math.max(pbx, maxAttackX)
        : Math.min(pbx, maxAttackX);
      targetY = pby;
    } else {
      // Top oyuncunun sahasında — AI ileri çıkar ama sınırını aşmaz
      const fwdX = isHome
        ? Phaser.Math.Clamp(pbx, maxAttackX, cx)
        : Phaser.Math.Clamp(pbx, cx, maxAttackX);
      // Savunmaya dönme gereksinimi varsa (top kaleye geliyor) geriye çekil
      const guardX = isHome
        ? Phaser.Math.Clamp(bx + (myGoalX - bx) * guardRatio, cx, myGoalX - pr * 2)
        : Phaser.Math.Clamp(bx + (myGoalX - bx) * guardRatio, myGoalX + pr * 2, cx);
      // Güçlü takım saldırıda kalır, zayıf takım hemen geriye döner
      targetX = bx < cx === isHome ? fwdX : guardX;
      targetY = Phaser.Math.Clamp(by, F.GOAL_TOP + pr, F.GOAL_BOTTOM - pr);
    }

    // ── Move toward target ──
    const dx = targetX - ax;
    const dy = targetY - ay;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const deadzone = 8;

    let moveX = 0;
    let moveY = 0;
    if (dist > deadzone) {
      moveX = dx / dist;
      moveY = dy / dist;
    }

    ai.vx = (ai.vx + moveX * accel * dt) * drag;
    ai.vy = (ai.vy + moveY * accel * dt) * drag;

    const vLen = Math.sqrt(ai.vx ** 2 + ai.vy ** 2);
    if (vLen > speed) {
      ai.vx = (ai.vx / vLen) * speed;
      ai.vy = (ai.vy / vLen) * speed;
    }

    ai.sprite.x += ai.vx * dt;
    ai.sprite.y += ai.vy * dt;
    ai.sprite.x = Phaser.Math.Clamp(ai.sprite.x, F.LEFT + pr, F.RIGHT - pr);
    ai.sprite.y = Phaser.Math.Clamp(ai.sprite.y, F.TOP + pr, F.BOTTOM - pr);

    // ── Kick cooldown ──
    if (ai.kickCooldown > 0) ai.kickCooldown -= dt;
    if (this.aiKickTimer > 0) this.aiKickTimer -= dt;

    // ── Kick: topa yakınsa strength'e göre güç ve isabet ──
    const kickRange = pr + br + 22;
    if (distToBall < kickRange && ai.kickCooldown <= 0 && this.aiKickTimer <= 0) {
      const aimX = atkGoalX - ax;
      const aimY = (midY - ay) + Phaser.Math.Between(-Math.round(kickRand), Math.round(kickRand));
      const aimLen = Math.sqrt(aimX * aimX + aimY * aimY);
      this.ball.vx = (aimX / aimLen) * kickPower + ai.vx * 0.4;
      this.ball.vy = (aimY / aimLen) * kickPower + ai.vy * 0.4;
      ai.kickCooldown = cooldown;
      this.aiKickTimer  = cooldown + 0.1;
      this.audio.play('kick');
    } else if (distToBall < pr + br + 5) {
      this._touchBall(ai);
    }
  }

  private _applyPhysics(dt: number) {
    const fr = HAXBALL.FRICTION;

    // Apply friction
    this.ball.vx *= Math.pow(fr, dt * 60);
    this.ball.vy *= Math.pow(fr, dt * 60);

    // Move ball
    this.ball.sprite.x += this.ball.vx * dt;
    this.ball.sprite.y += this.ball.vy * dt;

    const br = HAXBALL.BALL_RADIUS;

    // Köşe bölgesi tespiti — korner alanında bounce güçlendirilir
    const cornerZone = 120; // sahadan köşeye bu kadar piksel içinde köşe boost aktif
    const bx = this.ball.sprite.x;
    const by = this.ball.sprite.y;
    const nearLeftWall   = bx - br < this.F.LEFT   + cornerZone;
    const nearRightWall  = bx + br > this.F.RIGHT  - cornerZone;
    const nearTopWall    = by - br < this.F.TOP    + cornerZone;
    const nearBottomWall = by + br > this.F.BOTTOM - cornerZone;
    const inCorner = (nearLeftWall || nearRightWall) && (nearTopWall || nearBottomWall);
    const cornerBoost = inCorner ? 1.28 : 1.0; // köşede %28 ekstra enerji

    // Bounce off top/bottom field walls
    if (this.ball.sprite.y - br < this.F.TOP) {
      this.ball.sprite.y = this.F.TOP + br;
      this.ball.vy = Math.abs(this.ball.vy) * HAXBALL.BALL_BOUNCE * cornerBoost;
      if (inCorner) this.ball.vx *= cornerBoost; // köşede yatay hız da artar
      this.audio.play('block');
    }
    if (this.ball.sprite.y + br > this.F.BOTTOM) {
      this.ball.sprite.y = this.F.BOTTOM - br;
      this.ball.vy = -Math.abs(this.ball.vy) * HAXBALL.BALL_BOUNCE * cornerBoost;
      if (inCorner) this.ball.vx *= cornerBoost;
      this.audio.play('block');
    }

    // Bounce off left/right walls — kale bölgesinde arka duvar daha geride
    const inGoalY = this.ball.sprite.y > this.F.GOAL_TOP && this.ball.sprite.y < this.F.GOAL_BOTTOM;

    if (this.ball.sprite.x - br < this.F.LEFT - (inGoalY ? this.F.GOAL_DEPTH : 0)) {
      // Kale içindeyse önce gol kontrolü yap, bounce'u engelle
      if (inGoalY) {
        this._onGoal('BLUE');
        return;
      }
      this.ball.sprite.x = this.F.LEFT + br;
      this.ball.vx = Math.abs(this.ball.vx) * HAXBALL.BALL_BOUNCE * cornerBoost;
      if (inCorner) this.ball.vy *= cornerBoost;
      this.audio.play('block');
    }
    if (this.ball.sprite.x + br > this.F.RIGHT + (inGoalY ? this.F.GOAL_DEPTH : 0)) {
      if (inGoalY) {
        this._onGoal('RED');
        return;
      }
      this.ball.sprite.x = this.F.RIGHT - br;
      this.ball.vx = -Math.abs(this.ball.vx) * HAXBALL.BALL_BOUNCE * cornerBoost;
      if (inCorner) this.ball.vy *= cornerBoost;
      this.audio.play('block');
    }

    // Goal post bouncing (top/bottom of goal)
    this._bounceGoalPosts();

    // Player-player collision
    this._playerCollision();

    // Hard safety clamp — catches any tunneling that slipped through
    const W = this.scale.width;
    const H = this.scale.height;
    this.ball.sprite.x = Phaser.Math.Clamp(this.ball.sprite.x, -br * 2, W + br * 2);
    this.ball.sprite.y = Phaser.Math.Clamp(this.ball.sprite.y, -br * 2, H + br * 2);

    // If ball somehow escaped the field entirely, reset to center
    if (
      this.ball.sprite.x < -br * 4 || this.ball.sprite.x > W + br * 4 ||
      this.ball.sprite.y < -br * 4 || this.ball.sprite.y > H + br * 4
    ) {
      this.ball.sprite.x = W / 2;
      this.ball.sprite.y = H / 2;
      this.ball.vx = 0;
      this.ball.vy = 0;
    }
  }

  private _bounceGoalPosts() {
    const br = HAXBALL.BALL_RADIUS;
    const bx = this.ball.sprite.x;
    const by = this.ball.sprite.y;

    // Left goal posts
    const leftGoalX = this.F.LEFT;
    if (bx < leftGoalX + br * 2) {
      if (Math.abs(by - this.F.GOAL_TOP) < br + 10) {
        this.ball.vy = Math.abs(this.ball.vy) * HAXBALL.BALL_BOUNCE;
        this.ball.sprite.y = this.F.GOAL_TOP + br;
      }
      if (Math.abs(by - this.F.GOAL_BOTTOM) < br + 10) {
        this.ball.vy = -Math.abs(this.ball.vy) * HAXBALL.BALL_BOUNCE;
        this.ball.sprite.y = this.F.GOAL_BOTTOM - br;
      }
    }

    // Right goal posts
    const rightGoalX = this.F.RIGHT;
    if (bx > rightGoalX - br * 2) {
      if (Math.abs(by - this.F.GOAL_TOP) < br + 10) {
        this.ball.vy = Math.abs(this.ball.vy) * HAXBALL.BALL_BOUNCE;
        this.ball.sprite.y = this.F.GOAL_TOP + br;
      }
      if (Math.abs(by - this.F.GOAL_BOTTOM) < br + 10) {
        this.ball.vy = -Math.abs(this.ball.vy) * HAXBALL.BALL_BOUNCE;
        this.ball.sprite.y = this.F.GOAL_BOTTOM - br;
      }
    }
  }

  private _playerCollision() {
    const pr = HAXBALL.PLAYER_RADIUS * 2;
    const dx = this.blue.sprite.x - this.red.sprite.x;
    const dy = this.blue.sprite.y - this.red.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < pr && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = pr - dist;
      this.red.sprite.x -= nx * overlap * 0.5;
      this.red.sprite.y -= ny * overlap * 0.5;
      this.blue.sprite.x += nx * overlap * 0.5;
      this.blue.sprite.y += ny * overlap * 0.5;

      // Velocity exchange
      const relVx = this.blue.vx - this.red.vx;
      const relVy = this.blue.vy - this.red.vy;
      const dot = relVx * nx + relVy * ny;
      if (dot < 0) {
        const impulse = dot * (1 + HAXBALL.PLAYER_BOUNCE) * 0.5;
        this.red.vx += impulse * nx;
        this.red.vy += impulse * ny;
        this.blue.vx -= impulse * nx;
        this.blue.vy -= impulse * ny;
      }
    }
  }

  private _checkGoal() {
    const br = HAXBALL.BALL_RADIUS;
    const bx = this.ball.sprite.x;
    const by = this.ball.sprite.y;
    const inGoalY = by > this.F.GOAL_TOP && by < this.F.GOAL_BOTTOM;

    // Gol: top kale ağının arka duvarına ulaştığında sayılır
    if (inGoalY && bx - br < this.F.LEFT - this.F.GOAL_DEPTH) {
      this._onGoal('BLUE');
    }
    else if (inGoalY && bx + br > this.F.RIGHT + this.F.GOAL_DEPTH) {
      this._onGoal('RED');
    }
  }

  private _onGoal(scorer: 'RED' | 'BLUE') {
    if (this.goalPauseActive) return;
    this.goalPauseActive = true;

    // Eğer santra modundaysak temizle
    this._releasKickoff();

    useGameStore.getState().goalScored(scorer);
    this.audio.play('powerup');

    // Flash effect
    const flashRect = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      scorer === 'RED' ? 0xe74c3c : 0x3498db,
      0.5
    ).setDepth(20);

    this.tweens.add({
      targets: flashRect,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => flashRect.destroy(),
    });

    // Resume after pause — gol yiyen taraf santraya başlar
    this.time.delayedCall(HAXBALL.GOAL_PAUSE, () => {
      const s = useGameStore.getState();
      if (s.gameState === 'GAMEOVER') return;
      const golYiyen: 'RED' | 'BLUE' = scorer === 'RED' ? 'BLUE' : 'RED';
      this._resetPositions(golYiyen);
      useGameStore.getState().setGameState('PLAYING');
      this.goalPauseActive = false;
    });
  }

  private _placeAt(player: PlayerState, x: number, y: number) {
    player.sprite.x = x;
    player.sprite.y = y;
    player.vx = 0;
    player.vy = 0;
    player.kickCooldown = 0; // peş peşe gollerde cooldown sıfırla
  }

  private _resetPositions(golYiyen?: 'RED' | 'BLUE') {
    const cy = (this.F.TOP + this.F.BOTTOM) / 2;
    const cx = (this.F.LEFT + this.F.RIGHT) / 2;

    // Top tam santra ortasına — sadece sprite pozisyonu (body disabled)
    this.ball.sprite.x = cx;
    this.ball.sprite.y = cy;
    this.ball.vx = 0;
    this.ball.vy = 0;

    if (golYiyen === 'RED') {
      // Kırmızı gol yedi → santraya gelir, mavi kendi yarısına çekilir
      this._placeAt(this.red,  cx - 55,  cy);
      this._placeAt(this.blue, cx + 220, cy);
    } else if (golYiyen === 'BLUE') {
      // Mavi gol yedi → santraya gelir, kırmızı kendi yarısına çekilir
      this._placeAt(this.blue, cx + 55,  cy);
      this._placeAt(this.red,  cx - 220, cy);
    } else {
      // Maç başlangıcı
      this._placeAt(this.red,  cx - 180, cy);
      this._placeAt(this.blue, cx + 180, cy);
    }

    // Tüm cooldown'ları sıfırla — peş peşe gollerde takılma olmaz
    this.aiKickTimer = 0;
    this.red.kickCooldown = 0;
    this.blue.kickCooldown = 0;

    // Santra yapacak takımı kaydet
    this.kickoffTeam = golYiyen ?? null;
    // Oyuncu mu santra yapıyor? golYiyen hangi renk ise o player/ai mı diye bak
    this.kickoffIsPlayer = golYiyen !== null && golYiyen === this.player.team;
    this._showKickoffHint(golYiyen);
  }

  private _showKickoffHint(team?: 'RED' | 'BLUE') {
    if (this.kickoffIndicator) this.kickoffIndicator.destroy();
    if (!team) return;
    const cx = this.scale.width / 2;
    const label = team === 'RED' ? '🔴 Santra' : '🔵 Santra';
    this.kickoffIndicator = this.add.text(cx, this.F.TOP - 24, label, {
      fontSize: '18px', color: '#ffffff',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(20);
  }

  private _rotateBall(dt: number) {
    const speed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);
    this.ball.sprite.rotation += (speed * dt * 0.03);
  }
}
