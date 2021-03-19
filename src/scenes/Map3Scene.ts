import Player from '../objects/Player';

import { Characters, SceneKeys } from '../constants';
import userInterface from './userInterface/MapScene3.json';
import { IMap, PhaserGame, WebSocketMessageContextEmit } from '../types';
import restartSceneWithDelay from './helpers/restartSceneWithDelay';
import Zombie from '../objects/Zombie';
import changeSceneWithDelay from './helpers/changeSceneWithDelay';
import makeBar from '../objects/helpers/makeBar';
import translateCoordinateToScreen from '../objects/helpers/translateCoordinateToScreen';

export default class Map3Scene extends Phaser.Scene {
  public player: Player;
  public blob: Array<Zombie>;
  public game: PhaserGame;
  public map: IMap;

  constructor() {
    super({ key: SceneKeys.Map3 });

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
      .tileSprite(0, -100, 4096, 1025, 'coloredSky')
      .setOrigin(0)
      .setScrollFactor(0);

    this.map.bg1 = this.add
      .tileSprite(0, -80, 4096, 1025, 'tallPyramidsBG')
      .setOrigin(0)
      .setScrollFactor(0);
    this.map.bg2 = this.add
      .tileSprite(0, -80, 4096, 1025, 'walkSendBG')
      .setOrigin(0)
      .setScrollFactor(0);

    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#dbceaf');
    this.cameras.main.setBounds(0, 0, 4000, 1000);
    this.physics.world.setBounds(0, 0, 4096, 2048);

    // Create player and init his position
    this.player = new Player(this, 160, 700);

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
      if (type === 'mousedown') {
        // @ts-ignore
        const { x, y } = translateCoordinateToScreen(this, payload);
        this.blob.push(
          new Zombie(this, {
            username: username,
            position: { x, y, direction: 'left' },
            sprite: Characters.Zombie,
            pattern: 'behind'
          })
        );
      }
    }
  }

  public update(time: number, delta: number) {
    if (this.player.collection.sprite?.body.x > 4000) {
      this.add
        .text(this.registry.get('innerWidth') / 2 - 200, 200, 'Player win !', {
          fontSize: '64px',
          fontFamily: 'KenneyFutureNarrow',
          fill: '#000000'
        })
        .setScrollFactor(0);
      return changeSceneWithDelay(this, SceneKeys.Menu, 5000);
    }
    this.player.update(time, delta);
    this.blob.forEach(function(b) {
      b.update(time, delta);
    });

    this.map.sky.tilePositionX = this.player.camera.scrollX / 4;
    this.map.bg1.tilePositionX = this.player.camera.scrollX / 3;
    this.map.bg2.tilePositionX = this.player.camera.scrollX / 1.33;
  }
}
