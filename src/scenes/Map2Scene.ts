import Player from '../objects/Player';

import { Characters, SceneKeys } from '../constants';
import userInterface from './userInterface/MapScene2.json';
import { IMap, PhaserGame, WebSocketMessageContextEmit } from '../types';
import restartSceneWithDelay from './helpers/restartSceneWithDelay';
import changeSceneWithDelay from './helpers/changeSceneWithDelay';
import makeBar from '../objects/helpers/makeBar';

export default class Map1Scene extends Phaser.Scene {
  public player: Player;
  public blob: Array<any>;
  public game: PhaserGame;
  public map: IMap;

  constructor() {
    super({ key: SceneKeys.Map2 });

    this.map = {};
    this.blob = [];
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
  }

  public create() {
    // Send user interface with websocket
    this.game.interactive?.onGame(userInterface);

    // Create map
    this.map.bounds = { top: 525, bottom: 950 };
    this.map.sky = this.add
      .tileSprite(0, -100, 8192, 1025, 'coloredSky')
      .setOrigin(0)
      .setScrollFactor(0);

    this.map.bg1 = this.add
      .tileSprite(0, -75, 8192, 1025, 'walkForestBG')
      .setOrigin(0)
      .setScrollFactor(0);
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#a89b93');
    this.cameras.main.setBounds(0, 0, 4000, 1000);
    this.map.fg = this.add
      .tileSprite(0, 225, 8192, 1025, 'bushForestFG')
      .setOrigin(0)
      .setDepth(225)
      .setScrollFactor(0);
    this.physics.world.setBounds(0, 0, 8192, 2048);

    // Create player and init his position
    this.player = new Player(this, 80, 800);

    // Create settings button
    const button = this.add
      .image(this.registry.get('innerWidth') - 32, 16, 'gear', 0)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setInteractive();
    button.on(
      'pointerup',
      function() {
        changeSceneWithDelay(this, SceneKeys.Menu, 0);
      },
      this
    );

    // HUD
    this.add
      .text(100, 20, this.game.interactive?.data?.displayName || 'Player', {
        fontSize: '32px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2
      })
      .setScrollFactor(0);

    this.game.bar = {
      playerHealth: makeBar(this, {
        x: 100,
        y: 60,
        width: this.registry.get('innerWidth') / 4,
        height: 30,
        color: 0xe74c3c
      }).setScrollFactor(0)
    };

    this.game.bar.playerHealth.scaleX = 1;

    // On press to key '1', we restart the scene
    this.input.keyboard.on('keyup_ONE', () => {
      restartSceneWithDelay(this, 0);
    });

    if (this.game.interactive.status === 1) {
      this.game.interactive.socket.addEventListener('message', this.handleWebSocketMessage, true);
    }
  }

  public handleWebSocketMessage(event: { data: string }) {
    const body: WebSocketMessageContextEmit = JSON.parse(event.data);
    if (body?.context === 'emit' && body?.data) {
      const { type, payload } = body.data;
      const username = payload.username || null;

      if (type === 'action') {
        const teaserQuote = (payload.values && payload.values['ext-teaser-quote']) || null;
        if (payload.id === 'action-rebel') {
          /*this.blob.push(
            new Ninja(this, {
              username: username,
              position: { x: Phaser.Math.Between(100, 2000), y: 700, direction: 'left' },
              sprite: Characters.Ninja
            })
          );*/
        }
      }
    }
  }

  public update(time: number, delta: number) {
    if (this.player.collection.sprite.body.x > 4000) {
      return changeSceneWithDelay(this, SceneKeys.Menu, 0);
    }
    this.player.update(time, delta);
    this.blob.forEach(function(b) {
      b.update(time, delta);
    });

    this.map.sky.tilePositionX = this.player.camera.scrollX / 4;
    this.map.bg1.tilePositionX = this.player.camera.scrollX / 2;
    this.map.fg.tilePositionX = this.player.camera.scrollX;
  }
}
