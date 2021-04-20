import { SceneKeys } from '../constants';
import { PhaserGame } from '../types';
import Interactive from '../api/interactive';

export default class MenuScene extends Phaser.Scene {
  public game: PhaserGame;
  private connectText: Phaser.GameObjects.Text;
  private demoText: Phaser.GameObjects.Text;
  private modalText: Phaser.GameObjects.Text;
  private label: Phaser.GameObjects.Text;
  private autoplayTimeout: NodeJS.Timeout;
  private autoplayText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: SceneKeys.Menu
    });
    this.launchGame = this.launchGame.bind(this);
    this.toggleConnectTwitch = this.toggleConnectTwitch.bind(this);
    this.autoplayMode = this.autoplayMode.bind(this);
    this.messageConnectionListener = this.messageConnectionListener.bind(this);
    this.handleInteractiveSetup = this.handleInteractiveSetup.bind(this);
  }

  public create() {
    // Create an instance of interactive if not exist
    if (!this.game.interactive) {
      this.game.interactive = new Interactive();
    }

    // Send menu user interface if user is connect
    this.game.interactive?.onMenu();

    this.autoplayText = this.add
      .text(this.registry.get('innerWidth') / 2 - 110, 200, 'Autoplay mode', {
        fontSize: '26px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF'
      })
      .setVisible(false);

    this.autoplayMode();

    /**
     * HUD
     */
    this.label = this.add.text(10, 10, '', {
      fontSize: '16px',
      fontFamily: 'KenneyFutureNarrow',
      fill: '#FFFFFF'
    });
    // Play Button
    const playBG = this.add.image(0, 0, 'buttonBlue1');
    const playText = this.add
      .text(0, 0, 'Play', {
        fontSize: '20px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF'
      })
      .setOrigin(0.5, 0.5);
    const playButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2 - 80,
      [playBG, playText]
    );
    playButton.setInteractive(
      new Phaser.Geom.Rectangle(-95, -25, 190, 45),
      Phaser.Geom.Rectangle.Contains
    );
    playButton.on('pointerover', () => {
      if (!this.registry.get('isDemo')) playBG.setTexture('buttonYellow1');
    });
    playButton.on('pointerout', () => {
      if (!this.registry.get('isDemo')) playBG.setTexture('buttonBlue1');
    });

    if (this.registry.get('isDemo')) {
      playBG.setTint(0xaa3333, 0xaa3333, 0xaa3333, 0xaa3333);
      playText.setFill('#666666');
    }

    playButton.on('pointerup', this.launchGame);

    // Demo Button
    const demoBG = this.add.image(0, 0, 'buttonBlue1');
    this.demoText = this.add
      .text(0, 0, 'Autoplay: ' + (this.registry.get('isDemo') ? 'On' : 'Off'), {
        fontSize: '20px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF'
      })
      .setOrigin(0.5, 0.5);
    const demoButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2,
      [demoBG, this.demoText]
    );
    demoButton.setInteractive(
      new Phaser.Geom.Rectangle(-95, -25, 190, 45),
      Phaser.Geom.Rectangle.Contains
    );
    demoButton.on('pointerover', function() {
      demoBG.setTexture('buttonYellow1');
    });
    demoButton.on('pointerout', function() {
      demoBG.setTexture('buttonBlue1');
    });
    demoButton.on('pointerup', this.toggleAutoplay.bind(this, playBG, playText));

    // Connect Button
    const connectBG = this.add.image(0, 0, 'buttonBlue1');
    this.connectText = this.add
      .text(0, 0, this.game.interactive.status === 1 ? 'Disconnect' : "Let's connect", {
        fontSize: '20px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF'
      })
      .setOrigin(0.5, 0.5);
    const connectButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2 + 80,
      [connectBG, this.connectText]
    );
    connectButton.setInteractive(
      new Phaser.Geom.Rectangle(-95, -25, 190, 45),
      Phaser.Geom.Rectangle.Contains
    );
    connectButton.on('pointerover', function() {
      connectBG.setTexture('buttonYellow1');
    });
    connectButton.on('pointerout', function() {
      connectBG.setTexture('buttonBlue1');
    });
    connectButton.on('pointerup', this.toggleConnectTwitch);
    /**
     * Display a getting started modal
     */
    if (window.location.hash) {
      this.game.hasTouched = true;
    }
    if (!this.game.hasTouched) {
      const modalBG = this.add.image(0, 0, 'panelBlue');
      this.modalText = this.add
        .text(
          0,
          0,
          '                                    ' +
            'Welcome to the\n' +
            '                            ' +
            'Interactive Sync demo' +
            '\n\n\n1. Create or log in on your Twitch account.' +
            '\n\n2. Install the Twitch extension and activate it.' +
            '\n\n3. Launch a stream on your Twitch channel.' +
            "\n\n4. Let's connect with Twitch on this demo." +
            '\n\n\n            Your viewers can interact with you!' +
            '\n\n\n                     Click anywhere to continue.',
          {
            fontSize: '22px',
            fontFamily: 'KenneyFutureNarrow',
            fill: '#000000'
          }
        )
        .setOrigin(0.5, 0.5);
      const modal = this.add.container(
        this.registry.get('innerWidth') / 2,
        this.registry.get('innerHeight') / 2,
        [modalBG, this.modalText]
      );

      this.scene.scene.input.once('pointerdown', () => {
        modal.destroy();
        this.game.hasTouched = true;
      });
    }

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
      this.connectText.text = "Let's connect";
    }
    window.location.hash = '';
  }

  private launchGame() {
    const isDemo = this.registry.get('isDemo');
    if (!isDemo) {
      this.scene.start(SceneKeys.Map1);
    }
  }

  private autoplayMode() {
    // Launch autoplay when we are on demo mode
    const isDemo = this.registry.get('isDemo');

    if (isDemo) {
      this.autoplayTimeout = setTimeout(() => {
        this.scene.start(SceneKeys.Map1);
        clearTimeout(this.autoplayTimeout);
      }, 10000);
      this.autoplayText.setVisible(true);
    }
  }

  private messageConnectionListener(event: { data: string }) {
    const body = JSON.parse(event.data);
    if (body?.context === 'connection') {
      if (body?.status === 'ok') {
        this.game.interactive.data = body?.data;
        this.label.text = body.message + ' "' + body.data.displayName + '"';
        this.connectText.text = 'Disconnect';
        this.game.interactive.onMenu();
      } else if (body?.status === 'error') {
        this.game.interactive.status = 3; // Error body.mess    age
        this.label.text = 'Failed...\n\n' + body.message;
        this.connectText.text = "Let's connect";
      }
    }
  }

  private toggleAutoplay(playBG: Phaser.GameObjects.Image, playText: Phaser.GameObjects.Text) {
    const isDemo = this.registry.get('isDemo');
    if (isDemo) {
      this.registry.set('isDemo', false);
      this.demoText.text = 'Autoplay: Off';
      this.autoplayText.setVisible(false);
      playBG.clearTint();
      playText.setFill('#FFFFFF');
      clearTimeout(this.autoplayTimeout);
    } else {
      this.registry.set('isDemo', true);
      this.demoText.text = 'Autoplay: On';
      playBG.setTint(0xaa3333, 0xaa3333, 0xaa3333, 0xaa3333);
      playText.setFill('#666666');
      this.autoplayMode();
    }
  }

  private toggleConnectTwitch() {
    if (this.game.interactive.status === 1) {
      this.game.interactive.onDisconnect();
      this.label.text = 'You have been disconnected.';
      this.connectText.text = "Let's connect";
    } else {
      const url =
        process.env.NODE_ENV === 'production'
          ? 'https://jmcartlamy.github.io/phaser3-bta-tpe/'
          : 'http://localhost:8080';

      location.href =
        'https://id.twitch.tv/oauth2/authorize' +
        '?client_id=' +
        process.env.EXT_CLIENT_ID +
        '&redirect_uri=' +
        url +
        '&response_type=token';
    }
  }
}
