import { IPlayer } from '../types';
import { Characters, PLAYER_COLLECTION } from '../constants';
import Map1Scene from '../scenes/Map1Scene';

export default class Player {
  private readonly currentScene: Map1Scene;

  public collection: IPlayer;
  public camera: Phaser.Cameras.Scene2D.Camera;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Map1Scene, positionX: number, positionY: number) {
    this.currentScene = scene;
    this.camera = this.currentScene.cameras.main;

    // Create player
    this.collection = {
      ...PLAYER_COLLECTION,
      sprite: this.currentScene.physics.add
        .sprite(positionX, positionY, Characters.Player)
        .setCollideWorldBounds(true)
    };

    // Create cursor keys for camera
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();

    // Create compound body
    this.createCompoundBody();

    // Animate body
    this.animateBody();

    // Position Camera
    this.camera.setBounds(0, 0, 4000, 1000);
    this.camera.startFollow(this.collection.sprite, false, 1, 0);

    // Set collision
    //this.currentScene.physics.add.collider([this.collection.compoundBody.head, this.collection.compoundBody.buste], enemies);
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

    this.centerBodyOnXY(
      this.collection.compoundBody.head.body,
      this.collection.sprite.body.x + 40,
      this.collection.sprite.body.y + 48
    );

    this.centerBodyOnXY(
      this.collection.compoundBody.buste.body,
      this.collection.sprite.body.x + 40,
      this.collection.sprite.body.y + 90
    );
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
  }

  private animateBody() {
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
  }

  private processHorizontalMovement(time: number) {
    const canJump = time - this.collection.lastJumpedAt > 1000;
    const canFight = time - this.collection.lastFightAt > 250;

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
      if (this.collection.sprite.body.y > 525 && this.cursors.up.isDown) {
        this.collection.sprite.setVelocityY(-150);
        this.collection.sprite.setDepth(Math.trunc(this.collection.sprite.body.y / 10));
      } else if (this.collection.sprite.body.y < 950 && this.cursors.down.isDown) {
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
      this.collection.sprite.anims.play('idle', true);
    }
  }

  private processJumpMovement(time: number) {
    const canJump = time - this.collection.lastJumpedAt > 1000;
    if (!canJump) {
      this.collection.sprite.anims.play('jump', true, 0);
    }
    if (this.cursors.space.isDown && canJump) {
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
    if (canJump) {
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
      if (!canJump) {
        if (this.cursors.shift.isDown && canFight) {
          this.collection.lastComboAt = time;
        }
        if (inCombo) {
          this.collection.sprite.anims.play('jumpFight');
        }
      }
    }
  }

  private centerBodyOnBody(a, b) {
    a.position.set(b.x + b.halfWidth - a.halfWidth, b.y + b.halfHeight - a.halfHeight);
  }

  private centerBodyOnXY(a, x, y) {
    a.position.set(x - a.halfWidth, y - a.halfHeight);
  }
}
