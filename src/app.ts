import 'phaser';

import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import Map1Scene from './scenes/Map1Scene';

import { GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH } from './constants';

const config = {
  type: Phaser.AUTO,
  width: GAME_SCREEN_WIDTH,
  height: GAME_SCREEN_HEIGHT,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [LoadScene, MenuScene, Map1Scene]
};

window.addEventListener('load', async () => {
  /* Launch the Phaser.Game instance */
  new Phaser.Game(config);
});
