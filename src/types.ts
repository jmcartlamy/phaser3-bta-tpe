import Interactive from './api/interactive';

export interface PhaserGame extends Phaser.Game {
  // score: Score;
  bar: {
    playerHealth: Phaser.GameObjects.Graphics;
  };
  interactive: Interactive;
  hasFinishGettingStarted: boolean;
}

export interface IEnemyParams {
  position: IEnemyPosition;
  username: string | null;
  sprite: string;
  pattern?: Pattern;
  teaserQuote?: string;
}

export interface Score {
  input: number;
  mouse: number;
  time: number;
  bonus: number;
  total: number;
}

export interface IGameConfig {
  innerWidth: number;
  innerHeight: number;
  isDemo: boolean;
}

export interface IMap {
  bounds?: {
    top: number;
    bottom: number;
  };
  sky?: Phaser.GameObjects.TileSprite;
  bg1?: Phaser.GameObjects.TileSprite;
  bg2?: Phaser.GameObjects.TileSprite;
  fg?: Phaser.GameObjects.TileSprite;
}

export interface IPlayer {
  sprite: Phaser.Physics.Arcade.Sprite;
  compoundBody: {
    head?: Phaser.Physics.Arcade.Image;
    buste?: Phaser.Physics.Arcade.Image;
    arms?: Phaser.Physics.Arcade.Image;
    legs?: Phaser.Physics.Arcade.Image;
    text?: Phaser.GameObjects.Text;
  };
  stats: {
    damage: number;
    speed: number;
    jump: number;
  };
  status: {
    health: number;
    lastHitAt: number;
  };
  combo: number;
  lastFightAt: number;
  lastComboAt: number;
  lastJumpedAt: number;
  lastPressDownShiftAt: number;
  lastDirection: 'left' | 'right';
}

export interface IEnemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  compoundBody: {
    head?: Phaser.Physics.Arcade.Image;
    buste?: Phaser.Physics.Arcade.Image;
    arms?: Phaser.Physics.Arcade.Image;
    legs?: Phaser.Physics.Arcade.Image;
    label?: Phaser.GameObjects.Text;
  };
  stats: {
    damage: number;
    speed: number;
    jump: number;
  };
  status: {
    health: number;
    lastHitAt: number;
  };
  combo: number;
  lastFightAt: number;
  lastComboAt: number;
  lastJumpedAt: number;
  lastTauntedAt?: number;
  hasTaunted?: boolean;
  lastDirection: 'left' | 'right';
}

export interface IPlayerPosition {
  x: number;
  y: number;
}

export interface IEnemyPosition {
  x: number;
  y: number;
  direction: 'left' | 'right';
}

export type Pattern = 'simple' | 'behind';

export interface IEnemyBasePatternParams {
  distanceToHit: number;
  deltaLastFight: number;
  deltaLastCombo: number;
  deltaHit: number;
}

export interface WebSocketMessageContextConnection {
  status: 'ok' | 'error';
  context: 'connection';
  message: string | null;
  data: DataConnectionEvent | null;
}

export interface WebSocketMessageContextMessage {
  status: 'ok' | 'error';
  context: 'message';
  message: string | null;
  data: null;
}

export interface WebSocketMessageContextEmit {
  status: 'ok';
  context: 'emit';
  message: null;
  data: (DataMouseEvent | DataInputEvent) | null;
}
export interface DataConnectionEvent {
  displayName: string;
  channelId: string;
}

export interface DataMouseEvent {
  type: 'mouseup' | 'mousedown';
  payload: PayloadMouse;
}

export interface DataInputEvent {
  type: 'input';
  payload: PayloadInput;
}

export interface PayloadMouse {
  id: string;
  type: string;
  clientX: number;
  clientY: number;
  clientHeight: number;
  clientWidth: number;
  username: string | null;
  values?: never;
}

export interface PayloadInput {
  id: string;
  username: string | null;
  values: {
    [key: string]: string | boolean;
  };
}
