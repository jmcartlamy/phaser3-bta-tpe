import Interactive from './api/interactive';

export interface PhaserGame extends Phaser.Game {
  // score: Score;
  interactive: Interactive;
}

export interface IEnemyParams {
  position: IEnemyPosition;
  sprite: string;
}

export interface Score {
  action: number;
  mouse: number;
  time: number;
  bonus: number;
  total: number;
}

export interface IGameConfig {
  innerWidth: number;
  innerHeight: number;
}

export interface IPlayer {
  sprite: Phaser.Physics.Arcade.Sprite;
  compoundBody: {
    head?: Phaser.Physics.Arcade.Image;
    buste?: Phaser.Physics.Arcade.Image;
    arms?: Phaser.Physics.Arcade.Image;
    legs?: Phaser.Physics.Arcade.Image;
  };
  speed: {
    run: number;
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
  };
  speed: {
    run: number;
    jump: number;
  };
  combo: number;
  lastFightAt: number;
  lastComboAt: number;
  lastJumpedAt: number;
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
  data: (DataMouseEvent & DataActionEvent) | null;
}
export interface DataConnectionEvent {
  displayName: string;
  channelId: string;
}

export interface DataMouseEvent {
  type: 'mouse';
  payload: PayloadMouse;
}

export interface DataActionEvent {
  type: 'action';
  payload: PayloadAction;
}

export interface PayloadMouse {
  id: string;
  type: string;
  clientX: number;
  clientY: number;
  clientHeight: number;
  clientWidth: number;
}

export interface PayloadAction {
  id: string;
  username: string | null;
}
