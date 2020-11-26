import player from '../assets/sprites/player.png';
import tileMaps from '../assets/tilemaps/kenny_platformer_64x64-extruded.png';

import TileMap from '../objects/TileMap';
import Player from '../objects/Player';

import { Characters } from '../constants';
import { PhaserGame, SceneFactoryParams, WebSocketMessageContextEmit } from '../types';
import restartSceneWithDelay from './helpers/restartSceneWithDelay';

export default class SceneFactory extends Phaser.Scene {
  public player: Player;
  public game: PhaserGame;
  protected params: SceneFactoryParams;

  constructor(params: SceneFactoryParams) {
    super({
      key: params.key
    });
    this.params = params;
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
  }

  public preload() {
    this.load.spritesheet(Characters.Player, player, {
      frameWidth: 32,
      frameHeight: 42
    });
    // @ts-ignore
    this.load.tilemapTiledJSON(this.params.map.key, this.params.map.tilemap);
    this.load.image('tileMaps', tileMaps);
    this.load.image('tileMapsNC', tileMaps);
  }

  public create() {
    // Send user interface with websocket
    this.game.interactive?.onGame(this.params.user.interface);

    // Create map following json loaded
    const tilemap = new TileMap(this, this.params.map.key);

    // Create player and init his position
    this.player = new Player(
      this,
      tilemap,
      this.params.position.player.x,
      this.params.position.player.y
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
  }
}
