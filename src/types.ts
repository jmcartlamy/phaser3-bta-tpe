import { SceneKeys } from './constants';
import Interactive from './api/interactive';

export interface PhaserGame extends Phaser.Game {
  // score: Score;
  interactive: Interactive;
  // TODO interactive
}

export interface SceneFactoryParams {
  key: string;
  map: {
    key: string;
    direction: 'right' | 'top';
    nextMap: SceneKeys;
  };
  position: {
    player: IPlayerPosition;
  };
  user: {
    interface: object;
  };
}

export interface Score {
  action: number;
  mouse: number;
  time: number;
  bonus: number;
  total: number;
}

type KeysDirection = 'left' | 'right' | 'bottom';

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
  lastDirection: 'left' | 'right';
}

export interface IPlayerPosition {
  x: number;
  y: number;
}

export interface IEnemy {
  sprite: Phaser.GameObjects.Sprite | null;
  body: any;
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
