import 'phaser';
import './assets/index.css';

import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import Map1Scene from './scenes/Map1Scene';
import Map2Scene from './scenes/Map2Scene';
import Map3Scene from './scenes/Map3Scene';

import { GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH } from './constants';

const config = {
  type: Phaser.WEBGL,
  width: GAME_SCREEN_WIDTH,
  height: GAME_SCREEN_HEIGHT,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [LoadScene, MenuScene, Map1Scene, Map2Scene, Map3Scene]
};

window.addEventListener('load', async () => {
  /* Launch the Phaser.Game instance */
  new Phaser.Game(config);
});
