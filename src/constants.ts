import { IEnemy, IGameConfig, IPlayer } from './types';

export const GAME_SCREEN_WIDTH = 1280;
export const GAME_SCREEN_HEIGHT = 720;

export const GAME_CONFIG: IGameConfig = {
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
  isDemo: false
};

export enum SceneKeys {
  Load = 'Load',
  Menu = 'Menu',
  Pause = 'Pause',
  Map1 = 'Map1',
  Map2 = 'Map2',
  Map3 = 'Map3'
}

export enum Characters {
  Player = 'player',
  Zombie = 'zombie',
  Ninja = 'ninja',
  Rebel = 'rebel'
}

export const PLAYER_COLLECTION: IPlayer = {
  sprite: null,
  compoundBody: {},
  stats: {
    damage: 20,
    speed: 1,
    jump: 1
  },
  status: {
    health: 100,
    lastHitAt: 0
  },
  combo: 0,
  lastFightAt: 0,
  lastPressDownShiftAt: 0,
  lastComboAt: 0,
  lastJumpedAt: 0,
  lastDirection: 'right'
};

export const ZOMBIE_COLLECTION: IEnemy = {
  sprite: null,
  compoundBody: {},
  stats: {
    damage: 10,
    speed: 1,
    jump: 1
  },
  status: {
    health: 40,
    lastHitAt: 0
  },
  combo: 0,
  lastFightAt: 0,
  lastComboAt: 0,
  lastJumpedAt: 0,
  lastDirection: 'right'
};

export const NINJA_COLLECTION: IEnemy = {
  sprite: null,
  compoundBody: {},
  stats: {
    damage: 15,
    speed: 1.5,
    jump: 1
  },
  status: {
    health: 60,
    lastHitAt: 0
  },
  combo: 0,
  lastFightAt: 0,
  lastComboAt: 0,
  lastJumpedAt: 0,
  lastDirection: 'right'
};

export const REBEL_COLLECTION: IEnemy = {
  sprite: null,
  compoundBody: {},
  stats: {
    damage: 10,
    speed: 1,
    jump: 1
  },
  status: {
    health: 80,
    lastHitAt: 0
  },
  combo: 0,
  lastFightAt: 0,
  lastComboAt: 0,
  lastJumpedAt: 0,
  lastTauntedAt: 0,
  hasTaunted: false,
  lastDirection: 'right'
};
