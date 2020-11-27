import { Characters, GAME_CONFIG, SceneKeys } from '../constants';
import { PhaserGame } from '../types';
import buttonBlue1 from '../assets/sprites/blue_button01.png';
import buttonYellow1 from '../assets/sprites/yellow_button01.png';
import gear from '../assets/sprites/gear.png';
import player from '../assets/sprites/player_tilesheet.png';

export default class LoadScene extends Phaser.Scene {
  public game: PhaserGame;

  constructor() {
    super({
      key: SceneKeys.Load
    });
  }

  public preload() {
    const progress = this.add.graphics();

    this.load.on('progress', function(value: number) {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, 270, 800 * value, 60);
    });

    this.load.on('complete', function() {
      progress.destroy();
    });

    this.load.image('buttonBlue1', buttonBlue1);
    this.load.image('buttonYellow1', buttonYellow1);
    this.load.image('gear', gear);

    this.load.spritesheet(Characters.Player, player, {
      frameWidth: 80,
      frameHeight: 110
    });
  }

  public create() {
    this.registry.set(GAME_CONFIG, {});
    this.scene.start(SceneKeys.Menu);
  }
}
