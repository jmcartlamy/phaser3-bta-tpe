import centerBodyOnXY from './helpers/centerBodyOnXY';
import { IPlayer } from '../types';
import { Characters, PLAYER_COLLECTION } from '../constants';
import Map1Scene from '../scenes/Map1Scene';

export const DELTA_HIT_PLAYER = 1000;

export default class Player {
  private readonly currentScene: Map1Scene;

  public collection: IPlayer;
  public camera: Phaser.Cameras.Scene2D.Camera;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Map1Scene, positionX: number, positionY: number) {
    this.currentScene = scene;
    this.camera = this.currentScene.cameras.main;

    // Create player
    const playerCollection = JSON.parse(JSON.stringify(PLAYER_COLLECTION));
    this.collection = {
      ...playerCollection,
      sprite: this.currentScene.physics.add
        .sprite(positionX, positionY + 60, Characters.Player)
        .setDepth(Math.trunc(positionY / 10))
        .setCollideWorldBounds(true)
    };

    // Create cursor keys for camera
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();

    // Create compound body
    this.createCompoundBody();

    // Animate body
    this.createAnimation();

    // Position Camera
    this.camera.setBounds(0, 0, 4000, 1000);
    this.camera.startFollow(this.collection.sprite, false, 1, 0);
  }

  public update(time: number, delta: number) {
    if (!this.collection.sprite) {
      return;
    }

    // Horizontal movement
    this.processHorizontalMovement(time);

    // Jump movement
    this.processJumpMovement(time);

    // Fight movement
    this.processFightMovement(time);

    // Handle hitboxes
    this.handleHitboxes();
  }

  private createCompoundBody() {
    // @ts-ignore HEAD
    this.collection.compoundBody.head = this.currentScene.physics.add.image();
    this.collection.compoundBody.head.body.setCircle(22);
    this.collection.compoundBody.head.setDebugBodyColor(0xffff00);

    // @ts-ignore BUSTE
    this.collection.compoundBody.buste = this.currentScene.physics.add.image();
    this.collection.compoundBody.buste.body.setSize(50, 40);
    this.collection.compoundBody.buste.setDebugBodyColor(0xffff00);

    // @ts-ignore ARMS
    this.collection.compoundBody.arms = this.currentScene.physics.add.image();
    this.collection.compoundBody.arms.body.setSize(24, 70);
    this.collection.compoundBody.arms.setDebugBodyColor(0xff0000);

    // @ts-ignore LEGS
    this.collection.compoundBody.legs = this.currentScene.physics.add.image();
    this.collection.compoundBody.legs.body.setSize(16, 52);
    this.collection.compoundBody.legs.setDebugBodyColor(0xff0000);
  }

  private createAnimation() {
    this.currentScene.anims.create({
      key: 'left',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 9,
        end: 10
      }),
      frameRate: 8
    });
    this.currentScene.anims.create({
      key: 'right',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 9,
        end: 10
      }),
      frameRate: 8,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'idle',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        frames: [23]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'jump',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 1,
        end: 2
      }),
      frameRate: 2,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight1',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        frames: [14]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight2',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        frames: [15]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight3',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        frames: [13]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'jumpFight',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        frames: [19]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'hit',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        frames: [21]
      }),
      frameRate: 1,
      repeat: -1
    });
  }

  private handleHitboxes() {
    switch (this.collection.sprite.anims.currentAnim.key) {
      case 'idle':
      case 'left':
      case 'right':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + 40,
          this.collection.sprite.body.y + 48
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + 40,
          this.collection.sprite.body.y + 90
        );
        centerBodyOnXY(this.collection.compoundBody.arms.body, -50, -50);
        centerBodyOnXY(this.collection.compoundBody.legs.body, -100, -100);

        break;
      case 'jump':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 37 : 43),
          this.collection.sprite.body.y + 42
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 37 : 43),
          this.collection.sprite.body.y + 80
        );
        centerBodyOnXY(this.collection.compoundBody.arms.body, -50, -50);
        centerBodyOnXY(this.collection.compoundBody.legs.body, -50, -50);
        break;
      case 'jumpFight':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 54 : 26),
          this.collection.sprite.body.y + 55
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 42 : 38),
          this.collection.sprite.body.y + 85
        );
        centerBodyOnXY(this.collection.compoundBody.arms.body, -50, -50);
        centerBodyOnXY(
          this.collection.compoundBody.legs.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 8 : 72),
          this.collection.sprite.body.y + 77
        );
        break;
      case 'fight1':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 48 : 32),
          this.collection.sprite.body.y + 50
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 50 : 30),
          this.collection.sprite.body.y + 90
        );
        centerBodyOnXY(
          this.collection.compoundBody.arms.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 12 : 68),
          this.collection.sprite.body.y + 75
        );
        break;
      case 'fight2':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 48 : 32),
          this.collection.sprite.body.y + 50
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 50 : 30),
          this.collection.sprite.body.y + 90
        );
        centerBodyOnXY(
          this.collection.compoundBody.arms.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 12 : 68),
          this.collection.sprite.body.y + 75
        );
        break;
      case 'fight3':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 52 : 28),
          this.collection.sprite.body.y + 50
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 50 : 30),
          this.collection.sprite.body.y + 90
        );
        centerBodyOnXY(
          this.collection.compoundBody.arms.body,
          this.collection.sprite.body.x + (this.collection.sprite.flipX ? 12 : 68),
          this.collection.sprite.body.y + 70
        );
        break;
      case 'hit':
        centerBodyOnXY(
          this.collection.compoundBody.head.body,
          this.collection.sprite.body.x + 40,
          this.collection.sprite.body.y + 42
        );
        centerBodyOnXY(
          this.collection.compoundBody.buste.body,
          this.collection.sprite.body.x + 40,
          this.collection.sprite.body.y + 80
        );
        centerBodyOnXY(this.collection.compoundBody.arms.body, -200, -200);
        centerBodyOnXY(this.collection.compoundBody.legs.body, -200, -200);
        break;
      default:
        break;
    }
  }

  private processHorizontalMovement(time: number) {
    const canJump = time - this.collection.lastJumpedAt > 1000;
    const canFight = time - this.collection.lastFightAt > 250;
    const isHit = Date.now() - this.collection.status.lastHitAt < DELTA_HIT_PLAYER / 2;
    const isDemo = this.currentScene.registry.get('isDemo');

    if (!isHit) {
      // LEFT <-> RIGHT
      if ((this.cursors.left.isDown || this.cursors.right.isDown) && canFight) {
        if (this.cursors.left.isDown) {
          this.collection.sprite.setVelocityX(-250);
          if (canJump) {
            this.collection.sprite.anims.play('left', true);
          }
          this.collection.lastDirection = 'left';
          this.collection.sprite.setFlipX(true);
        } else if (this.cursors.right.isDown) {
          this.collection.sprite.setVelocityX(250);
          if (canJump) {
            this.collection.sprite.anims.play('right', true);
          }
          this.collection.lastDirection = 'right';
          this.collection.sprite.setFlipX(false);
        }
      } else {
        this.collection.sprite.setVelocityX(0);
      }

      // UP <-> DOWN
      if ((this.cursors.up.isDown || this.cursors.down.isDown) && canJump && canFight) {
        if (
          this.collection.sprite.body.y > this.currentScene.map.bounds.top &&
          this.cursors.up.isDown
        ) {
          this.collection.sprite.setVelocityY(-150);
          this.collection.sprite.setDepth(Math.trunc(this.collection.sprite.body.y / 10));
        } else if (
          this.collection.sprite.body.y < this.currentScene.map.bounds.bottom &&
          this.cursors.down.isDown
        ) {
          this.collection.sprite.setVelocityY(150);
          this.collection.sprite.setDepth(Math.trunc(this.collection.sprite.body.y / 10));
        } else {
          this.collection.sprite.setVelocityY(0);
        }
        if (this.collection.lastDirection === 'left') {
          this.collection.sprite.anims.play('left', true);
        } else {
          this.collection.sprite.anims.play('right', true);
        }
      } else {
        this.collection.sprite.setVelocityY(0);
      }

      // IDLE
      if (
        this.cursors.up.isUp &&
        this.cursors.down.isUp &&
        this.cursors.left.isUp &&
        this.cursors.right.isUp &&
        canJump &&
        canFight
      ) {
        if (!isDemo) {
          this.collection.sprite.anims.play('idle', true);
        } else {
          this.collection.sprite.anims.play('left', true);
          this.collection.sprite.setVelocityX(175);
        }
      }
    }
  }

  private processJumpMovement(time: number) {
    const canJump = time - this.collection.lastJumpedAt > 1000;
    const isHit = Date.now() - this.collection.status.lastHitAt < DELTA_HIT_PLAYER / 2;

    if (!canJump) {
      this.collection.sprite.anims.play('jump', true, 0);
    }
    if (this.cursors.space.isDown && canJump && !isHit) {
      this.collection.lastJumpedAt = time;
      this.collection.lastPressDownShiftAt = time;
      this.collection.lastFightAt = 0;
      this.collection.lastComboAt = 0;
      this.currentScene.tweens.add({
        targets: this.collection.sprite,
        y: this.collection.sprite.body.y - 50,
        ease: 'Power1',
        yoyo: true,
        duration: 500
      });
    }
  }

  private processFightMovement(time: number) {
    const canJump = time - this.collection.lastJumpedAt > 1000;
    const canFight = time - this.collection.lastFightAt > 250;
    const inCombo = time - this.collection.lastComboAt < 1000;
    const canRehit = this.cursors.shift.timeUp - this.collection.lastPressDownShiftAt >= 0;
    const isHit = Date.now() - this.collection.status.lastHitAt < DELTA_HIT_PLAYER / 2;

    if (canJump && !isHit) {
      if (!canFight) {
        if (this.collection.combo === 1 || this.collection.combo === 2) {
          this.collection.sprite.anims.play('fight1');
        }
        if (this.collection.combo === 3) {
          this.collection.sprite.anims.play('fight2');
        }
        if (this.collection.combo === 4) {
          this.collection.sprite.anims.play('fight3');
        }
      }
      if (canFight) {
        if (this.collection.combo === 4) {
          this.collection.combo = 0;
        }
        if (this.cursors.shift.isDown && canRehit) {
          this.collection.lastPressDownShiftAt = time;
          this.collection.lastFightAt = time;
          this.collection.lastComboAt = time;

          this.collection.combo += 1;
        } else if (!inCombo) {
          this.collection.combo = 0;
        }
      }
    } else {
      if (isHit) {
        this.collection.sprite.anims.play('hit');
        this.collection.sprite.body.stop();
      } else if (!canJump) {
        if (this.cursors.shift.isDown && canFight) {
          this.collection.lastComboAt = time;
        }
        if (inCombo) {
          this.collection.sprite.anims.play('jumpFight');
        }
      }
    }
  }
}
