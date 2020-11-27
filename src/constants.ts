import { IGameConfig, IPlayer } from './types';

export const GAME_SCREEN_WIDTH = 1280;
export const GAME_SCREEN_HEIGHT = 720;

export const GAME_CONFIG: IGameConfig = {
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight
};

export enum SceneKeys {
  Load = 'Load',
  Menu = 'Menu',
  Pause = 'Pause',
  Map1 = 'Map1'
}

export enum Characters {
  Player = 'player'
}

export const PLAYER_COLLECTION: IPlayer = {
  sprite: null,
  speed: {
    run: 1
  },
  lastDirection: 'right'
};
