import Player from '../objects/Player';

import { SceneKeys } from '../constants';
import userInterface from './userInterface/MapScene1.json';
import { PhaserGame, WebSocketMessageContextEmit } from '../types';
import restartSceneWithDelay from './helpers/restartSceneWithDelay';

export default class Map1Scene extends Phaser.Scene {
  public player: Player;
  public game: PhaserGame;
  private map: any; // TODO

  constructor() {
    super({ key: SceneKeys.Map1 });

    this.map = {};
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
  }

  public create() {
    // Send user interface with websocket
    this.game.interactive?.onGame(userInterface);

    // Create map
    this.map.sky = this.add
      .tileSprite(0, -100, 4096, 1025, 'coloredSky')
      .setOrigin(0)
      .setScrollFactor(0);
    this.map.bg1 = this.add
      .tileSprite(0, -100, 4096, 1025, 'tallTreesBG')
      .setOrigin(0)
      .setScrollFactor(0);

    this.map.bg2 = this.add.tileSprite(0, -75, 4096, 1025, 'walkTreesBG').setOrigin(0);
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#b8d1a7');
    this.cameras.main.setBounds(0, 0, 4000, 1000);
    this.map.fg = this.add
      .tileSprite(0, 225, 4096, 1025, 'bushFG')
      .setOrigin(0)
      .setDepth(225)
      .setScrollFactor(0);
    this.physics.world.setBounds(0, 525, 4096, 500);

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
        this.scene.start(SceneKeys.Menu);
      },
      this
    );

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
      if (type === 'mouse') {
        // TODO
      }
      if (type === 'action') {
        // TODO
      }
    }
  }

  public update(time: number, delta: number) {
    this.player.update(time, delta);
    this.map.sky.tilePositionX = this.player.camera.scrollX / 4;
    this.map.bg1.tilePositionX = this.player.camera.scrollX / 2;
    this.map.fg.tilePositionX = this.player.camera.scrollX * 1.5;
  }
}
