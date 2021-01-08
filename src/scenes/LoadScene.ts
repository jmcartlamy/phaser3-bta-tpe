import { Characters, GAME_CONFIG, SceneKeys } from '../constants';
import { PhaserGame } from '../types';
import buttonBlue1 from '../assets/sprites/blue_button01.png';
import buttonYellow1 from '../assets/sprites/yellow_button01.png';
import gear from '../assets/sprites/gear.png';
import player from '../assets/sprites/player_tilesheet_extruded.png';
import zombie from '../assets/sprites/zombie_tilesheet_extruded.png';
import ninja from '../assets/sprites/ninja_tilesheet_extruded.png';
import rebel from '../assets/sprites/rebel_tilesheet_extruded.png';
import tallTreesBG from '../assets/sprites/tall_trees_bg.png';
import walkTreesBG from '../assets/sprites/walk_trees_bg.png';
import walkForestBG from '../assets/sprites/walk_forest_bg.png';
import bushFG from '../assets/sprites/bush_fg.png';
import bushForestFG from '../assets/sprites/bush_forest_fg.png';
import coloredSky from '../assets/sprites/colored_sky.png';
import hitMarker from '../assets/sprites/hit_marker.png';

export default class LoadScene extends Phaser.Scene {
  public game: PhaserGame;

  constructor() {
    super({
      key: SceneKeys.Load
    });
  }

  public preload() {
    this.registry.set(GAME_CONFIG, {});

    this.add
      .text(window.innerWidth / 2, window.innerHeight / 2 - 100, 'Loading...', {
        fontSize: '42px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF'
      })
      .setOrigin(0.5);

    const progress = this.add.graphics();

    this.load.on('progress', function(value: number) {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(
        window.innerWidth / 4,
        window.innerHeight / 2 - 20,
        (window.innerWidth / 2) * value,
        40
      );
    });

    this.load.on('complete', function() {
      progress.destroy();
    });

    this.load.image('buttonBlue1', buttonBlue1);
    this.load.image('buttonYellow1', buttonYellow1);
    this.load.image('gear', gear);
    this.load.image('coloredSky', coloredSky);
    this.load.image('tallTreesBG', tallTreesBG);
    this.load.image('walkTreesBG', walkTreesBG);
    this.load.image('walkForestBG', walkForestBG);
    this.load.image('bushFG', bushFG);
    this.load.image('bushForestFG', bushForestFG);
    this.load.image('hitMarker', hitMarker);

    this.load.spritesheet(Characters.Player, player, {
      frameWidth: 80,
      frameHeight: 110,
      margin: 1,
      spacing: 2
    });
    this.load.spritesheet(Characters.Zombie, zombie, {
      frameWidth: 80,
      frameHeight: 110,
      margin: 1,
      spacing: 2
    });
    this.load.spritesheet(Characters.Ninja, ninja, {
      frameWidth: 80,
      frameHeight: 110,
      margin: 1,
      spacing: 2
    });
    this.load.spritesheet(Characters.Rebel, rebel, {
      frameWidth: 80,
      frameHeight: 110,
      margin: 1,
      spacing: 2
    });
  }

  public create() {
    this.scene.start(SceneKeys.Menu);
  }
}
