import { ZOMBIE_COLLECTION } from '../constants';
import Map1Scene from '../scenes/Map1Scene';
import { IEnemy, IEnemyBasePatternParams, IEnemyParams, Pattern } from '../types';
import centerBodyOnXY from './helpers/centerBodyOnXY';
import hitBodiesCallback from './helpers/hitBodiesCallback';
import processBehindPattern from './patterns/processBehindPattern';
import processSimplePattern from './patterns/processSimplePattern';
import { DELTA_HIT_PLAYER } from './Player';

const DELTA_HIT_ZOMBIE = 500;

export default class Zombie {
  protected readonly currentScene: Map1Scene;
  protected params: IEnemyParams;
  public collection: IEnemy;

  constructor(scene: Map1Scene, params: IEnemyParams) {
    this.currentScene = scene;
    this.params = params;

    // Create player
    const zombieCollection = JSON.parse(JSON.stringify(ZOMBIE_COLLECTION));
    this.collection = {
      ...zombieCollection,
      sprite: scene.physics.add
        .sprite(params.position.x, params.position.y, params.sprite)
        .setDepth(Math.trunc(params.position.y / 10))
        .setCollideWorldBounds(true)
    };

    if (params.position.direction === 'left') {
      this.collection.sprite.setFlipX(true);
    }

    // Create compound body
    this.createCompoundBody(params.username);

    // Animate body
    this.createAnimation();

    // Set hitboxes
    this.addOverlapWithPlayer();
  }

  public update(time: number, delta: number) {
    if (!this.collection.sprite) {
      return;
    }

    if (this.currentScene.player.collection.sprite?.body.x < this.collection.sprite.body.x) {
      this.collection.sprite.setFlipX(true);
    } else {
      this.collection.sprite.setFlipX(false);
    }

    this.collection.sprite.setDepth(Math.trunc(this.collection.sprite.body.y / 10));

    // Add username above the sprite
    this.collection.compoundBody.text
      .setPosition(
        this.collection.sprite.body.x + this.collection.sprite.body.halfWidth,
        this.collection.sprite.body.y
      )
      .setDepth(Math.trunc(this.collection.sprite.body.y / 10));

    // Handle hitboxes
    this.handleHitboxes();

    // Pattern
    this.processBaseMovement(time, {
      distanceToHit: 60,
      deltaLastCombo: 1000,
      deltaLastFight: 200,
      deltaHit: DELTA_HIT_ZOMBIE
    });

    if (this.currentScene.player.collection.sprite) {
      if (this.params.pattern === Pattern.behind) {
        processBehindPattern(this.currentScene.player.collection, this.collection, {
          velocityX: 100,
          velocityY: 50,
          gapX: 300,
          gapY: 15,
          distanceToHit: 60,
          deltaHit: DELTA_HIT_ZOMBIE,
          bounds: this.currentScene.map.bounds
        });
      } else {
        processSimplePattern(this.currentScene.player.collection, this.collection, {
          velocityX: 200,
          velocityY: 100,
          deltaHit: DELTA_HIT_ZOMBIE,
          distanceToHit: 60
        });
      }
    }
  }

  private processBaseMovement(time: number, params: IEnemyBasePatternParams) {
    const player = this.currentScene.player.collection.sprite;
    const enemy = this.collection.sprite;
    const canFight = time - this.collection.lastFightAt > params.deltaLastFight;
    const inCombo = time - this.collection.lastComboAt < params.deltaLastCombo;
    const isIdle = enemy.body.velocity.x === 0 && enemy.body.velocity.y === 0;
    const isHit = Date.now() - this.collection.status.lastHitAt < params.deltaHit;

    if (player) {
      if (player.body.x > enemy.body.x + params.distanceToHit) {
        this.collection.lastDirection = 'right';
        this.collection.sprite.anims.play(isIdle ? 'idleZombie' : 'rightZombie', true);
      } else if (player.body.x < enemy.body.x - params.distanceToHit) {
        this.collection.lastDirection = 'left';
        this.collection.sprite.anims.play(isIdle ? 'idleZombie' : 'leftZombie', true);
      }

      if (player.depth !== enemy.depth) {
        if (this.collection.lastDirection === 'left') {
          this.collection.sprite.anims.play(isIdle ? 'idleZombie' : 'leftZombie', true);
        } else {
          this.collection.sprite.anims.play(isIdle ? 'idleZombie' : 'rightZombie', true);
        }
      }
    } else {
      this.collection.sprite.anims.play('idleZombie', true);
    }

    if (isHit) {
      this.collection.sprite.anims.play('hitZombie');
    } else {
      if (
        player &&
        player.body.x < enemy.body.x + params.distanceToHit &&
        player.body.x > enemy.body.x - params.distanceToHit &&
        player.depth === enemy.depth
      ) {
        if (!canFight) {
          if (this.collection.combo === 1 || this.collection.combo === 2) {
            this.collection.sprite.anims.play('fight1Zombie');
          }
          if (this.collection.combo === 3) {
            this.collection.sprite.anims.play('fight2Zombie');
          }
          if (this.collection.combo === 4) {
            this.collection.sprite.anims.play('fight3Zombie');
          }
        }
        if (canFight) {
          if (this.collection.combo === 4 || !inCombo) {
            this.collection.combo = 0;
          }

          this.collection.lastFightAt = time;
          this.collection.lastComboAt = time;
          this.collection.combo += 1;
        }
      }
    }
  }

  private createCompoundBody(username: string | null) {
    this.collection.compoundBody.text = this.currentScene.add
      .text(0, 0, username || 'Anonymous', {
        fontSize: '20px',
        fontFamily: 'KenneyFutureNarrow',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 1
      })
      .setOrigin(0.5);

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
      key: 'leftZombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        start: 9,
        end: 10
      }),
      frameRate: 8
    });
    this.currentScene.anims.create({
      key: 'rightZombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        start: 9,
        end: 10
      }),
      frameRate: 8,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'idleZombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [23]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'jumpZombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        start: 1,
        end: 2
      }),
      frameRate: 2,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight1Zombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [14]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight2Zombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [15]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'fight3Zombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [13]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'jumpFightZombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [19]
      }),
      frameRate: 1,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'hitZombie',
      frames: this.currentScene.anims.generateFrameNumbers(this.params.sprite, {
        frames: [21]
      }),
      frameRate: 1,
      repeat: -1
    });

    this.collection.sprite.anims.play('idleZombie', true);
  }

  private handleHitboxes() {
    switch (this.collection.sprite.anims.currentAnim.key) {
      case 'idleZombie':
      case 'leftZombie':
      case 'rightZombie':
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
      case 'jumpZombie':
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
      case 'jumpFightZombie':
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
      case 'fight1Zombie':
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
      case 'fight2Zombie':
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
      case 'fight3Zombie':
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
      case 'hitZombie':
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
        centerBodyOnXY(this.collection.compoundBody.arms.body, -50, -50);
        centerBodyOnXY(this.collection.compoundBody.legs.body, -50, -50);
        break;
      default:
        break;
    }
  }

  addOverlapWithPlayer() {
    // Zombie -> Player
    this.currentScene.physics.add.overlap(
      [this.collection.compoundBody.arms, this.collection.compoundBody.legs],
      [
        this.currentScene.player.collection.compoundBody.head,
        this.currentScene.player.collection.compoundBody.buste
      ],
      () =>
        hitBodiesCallback(
          this.currentScene,
          this.collection,
          this.currentScene.player.collection,
          DELTA_HIT_PLAYER,
          true
        ),
      () => this.collection.sprite?.depth === this.currentScene.player.collection.sprite?.depth
    );
    // Player -> Zombie
    this.currentScene.physics.add.overlap(
      [
        this.currentScene.player.collection.compoundBody.arms,
        this.currentScene.player.collection.compoundBody.legs
      ],
      [this.collection.compoundBody.head, this.collection.compoundBody.buste],
      () =>
        hitBodiesCallback(
          this.currentScene,
          this.currentScene.player.collection,
          this.collection,
          DELTA_HIT_ZOMBIE
        ),
      () => this.collection.sprite?.depth === this.currentScene.player.collection.sprite?.depth
    );
  }
}
