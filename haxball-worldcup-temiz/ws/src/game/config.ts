export const GAME = {
  width: 1280,
  height: 720,
  gravity: 0,
  debug: false,
};

export const ASSET_PREFIX = '';

export const HAXBALL = {
  MATCH_DURATION: 180, // seconds
  GOAL_PAUSE: 3000,    // ms pause after a goal
  PLAYER_SPEED: 780,
  PLAYER_RADIUS: 32,
  BALL_RADIUS: 14,
  FRICTION: 0.992,     // velocity multiplier per frame
  BALL_BOUNCE: 0.72,
  PLAYER_BOUNCE: 0.45,

  // Field geometry (relative to game dimensions)
  FIELD: {
    LEFT: 80,
    RIGHT: 1200,
    TOP: 80,
    BOTTOM: 640,
    GOAL_TOP: 260,
    GOAL_BOTTOM: 460,
    GOAL_DEPTH: 60,
  },
};
