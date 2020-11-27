import buttonBG from '../assets/sprites/button-bg.png';

import { GAME_CONFIG, SceneKeys } from '../constants';
import { PhaserGame } from '../types';
import Interactive from '../api/interactive';

export default class MenuScene extends Phaser.Scene {
  public game: PhaserGame;
  private connectText: Phaser.GameObjects.Text;
  private label: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: SceneKeys.Menu
    });
    this.launchGame = this.launchGame.bind(this);
    this.toggleConnectTwitch = this.toggleConnectTwitch.bind(this);
    this.messageConnectionListener = this.messageConnectionListener.bind(this);
    this.handleInteractiveSetup = this.handleInteractiveSetup.bind(this);
  }

  public preload() {
    this.load.image('buttonBG', buttonBG);
  }

  public create() {
    // Set registry
    this.registry.set(GAME_CONFIG, {});

    // Create an instance of interactive if not exist
    if (!this.game.interactive) {
      this.game.interactive = new Interactive();
    }

    // Send menu user interface if user is connect
    this.game.interactive?.onMenu();

    /**
     * HUD
     */
    this.label = this.add.text(10, 10, '', {
      font: '24px Arial',
      fill: '#00ff00'
    });

    // Play Button
    const playBG = this.add.image(0, 0, 'buttonBG');
    const playText = this.add
      .text(0, 0, 'Jouer', {
        font: '40px Arial',
        fill: '#aace27'
      })
      .setOrigin(0.5, 0.5);
    const playButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2 - 80,
      [playBG, playText]
    );
    playButton.setInteractive(
      new Phaser.Geom.Rectangle(-150, -55, 300, 110),
      Phaser.Geom.Rectangle.Contains
    );
    playButton.on('pointerover', function() {
      playBG.setTint(0x44ff44);
    });
    playButton.on('pointerout', function() {
      playBG.clearTint();
    });
    playButton.once('pointerup', this.launchGame);

    // Connect Button
    const connectBG = this.add.image(0, 0, 'buttonBG');
    this.connectText = this.add
      .text(0, 0, this.game.interactive.status === 1 ? 'Ready ✅' : 'Se connecter', {
        font: '34px Arial',
        fill: '#aace27'
      })
      .setOrigin(0.5, 0.5);
    const connectButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2 + 80,
      [connectBG, this.connectText]
    );
    connectButton.setInteractive(
      new Phaser.Geom.Rectangle(-150, -55, 300, 110),
      Phaser.Geom.Rectangle.Contains
    );
    connectButton.on('pointerover', function() {
      connectBG.setTint(0x44ff44);
    });
    connectButton.on('pointerout', function() {
      connectBG.clearTint();
    });
    connectButton.on('pointerup', this.toggleConnectTwitch);

    /**
     * If user has sent his authorization
     */
    if (window.location.hash) {
      this.connectText.text = 'Connecting...';
      this.label.text = 'Create an interactive game session...';

      const match = window.location.hash.match(new RegExp('access_token=([^&]*)'));
      const accessToken = match && match[1];

      if (accessToken) {
        this.game.interactive.setup(accessToken, this.handleInteractiveSetup);
      } else {
        this.label.text = 'Websocket failed: token missing...';
      }
    }
  }

  private handleInteractiveSetup(status: number) {
    if (status === 1) {
      this.game.interactive.socket.addEventListener('message', this.messageConnectionListener);
    } else {
      this.label.text = 'Websocket error:  server not responding...';
      this.connectText.text = 'Se connecter';
    }
    window.location.hash = '';
  }

  private launchGame() {
    this.scene.start(SceneKeys.Map1);
  }

  private messageConnectionListener(event: { data: string }) {
    const body = JSON.parse(event.data);
    if (body?.context === 'connection') {
      if (body?.status === 'ok') {
        this.data = body?.data;
        this.label.text = body.message + ' "' + body.data.displayName + '"';
        this.connectText.text = 'Ready ✅';
        this.game.interactive.onMenu();
      } else if (body?.status === 'error') {
        this.game.interactive.status = 3; // Error body.message
        this.label.text = 'Failed...\n\n' + body.message;
        this.connectText.text = 'Se connecter';
      }
    }
  }

  private toggleConnectTwitch() {
    if (this.game.interactive.status === 1) {
      this.game.interactive.onDisconnect();
      this.label.text = 'Vous avez bien été déconnecté.';
      this.connectText.text = 'Se connecter';
    } else {
      location.href =
        'https://id.twitch.tv/oauth2/authorize' +
        '?client_id=' +
        process.env.EXT_CLIENT_ID +
        '&redirect_uri=http://localhost:8080' +
        '&response_type=token' +
        '&scope=user:read:email';
    }
  }
}
