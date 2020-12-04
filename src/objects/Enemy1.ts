import Map1Scene from '../scenes/Map1Scene';
import { IEnemyParams } from '../types';
import Enemy from './Enemy';
import centerBodyOnXY from './helpers/centerBodyOnXY';
import processBehindPattern from './patterns/processBehindPattern';
import processSimplePattern from './patterns/processSimplePattern';

export default class Enemy1 extends Enemy {
  constructor(scene: Map1Scene, params: IEnemyParams) {
    super(scene, params);

    // Create compound body
    this.createCompoundBody();

    // Animate body
    this.createAnimation();

    this.collection.sprite.anims.play('idle', true);
  }

  public update(time: number, delta: number) {
    this.baseUpdate(time, delta);

    // Handle hitboxes
    this.handleHitboxes();

    // Pattern
    this.processBaseMovement(time, {
      distanceToHit: 60,
      deltaLastCombo: 1000,
      deltaLastFight: 200
    });

    /*processSimplePattern(this.currentScene.player.collection.sprite, this.collection.sprite, {
      velocityX: 200,
      velocityY: 100,
      distanceToHit: 60
    });*/

    processBehindPattern(this.currentScene.player.collection, this.collection, {
      velocityX: 100,
      velocityY: 50,
      gapX: 300,
      gapY: 15,
      distanceToHit: 60,
      bounds: this.currentScene.map.bounds
    });
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
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        start: 9,
        end: 10
      }),
      frameRate: 8
    });
    this.currentScene.anims.create({
      key: 'right',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        start: 9,
        end: 10
      }),
      frameRate: 8,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'idle',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [23]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'jump',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        start: 1,
        end: 2
      }),
      frameRate: 2,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight1',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [14]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight2',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [15]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight3',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [13]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'jumpFight',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [19]
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
        centerBodyOnXY(this.collection.compoundBody.arms.body, -50, -50);
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
          this.collection.sprite.body.y + 85
        );
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
      default:
        break;
    }
  }
}
