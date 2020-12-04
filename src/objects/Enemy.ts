import { IEnemy, IEnemyBasePatternParams, IEnemyParams } from '../types';
import { ENEMY_COLLECTION } from '../constants';
import Map1Scene from '../scenes/Map1Scene';

export default class Enemy {
  protected readonly currentScene: Map1Scene;
  protected params: IEnemyParams;
  public collection: IEnemy;

  constructor(scene: Map1Scene, params: IEnemyParams) {
    this.currentScene = scene;
    this.params = params;

    // Create player
    this.collection = {
      ...ENEMY_COLLECTION,
      sprite: scene.physics.add
        .sprite(params.position.x, params.position.y, params.sprite)
        .setDepth(Math.trunc(params.position.y / 10))
        .setCollideWorldBounds(true)
    };

    if (params.position.direction === 'left') {
      this.collection.sprite.setFlipX(true);
    }
  }

  protected baseUpdate(time: number, delta: number) {
    if (!this.collection.sprite) {
      return;
    }

    if (this.currentScene.player.collection.sprite.body.x < this.collection.sprite.body.x) {
      this.collection.sprite.setFlipX(true);
    } else {
      this.collection.sprite.setFlipX(false);
    }

    this.collection.sprite.setDepth(Math.trunc(this.collection.sprite.body.y / 10));
  }

  protected processBaseMovement(time: number, params: IEnemyBasePatternParams) {
    const player = this.currentScene.player.collection.sprite;
    const enemy = this.collection.sprite;
    const canFight = time - this.collection.lastFightAt > params.deltaLastFight;
    const inCombo = time - this.collection.lastComboAt < params.deltaLastCombo;

    if (player.body.x > enemy.body.x + params.distanceToHit) {
      this.collection.lastDirection = 'right';
      this.collection.sprite.anims.play('right', true);
    } else if (player.body.x < enemy.body.x - params.distanceToHit) {
      this.collection.lastDirection = 'left';
      this.collection.sprite.anims.play('left', true);
    } else {
      if (player.depth === enemy.depth) {
        this.collection.sprite.anims.play('idle', true);
      }
    }

    if (player.depth !== enemy.depth) {
      if (this.collection.lastDirection === 'left') {
        this.collection.sprite.anims.play('left', true);
      } else {
        this.collection.sprite.anims.play('right', true);
      }
    }

    if (
      player.body.x < enemy.body.x + params.distanceToHit &&
      player.body.x > enemy.body.x - params.distanceToHit &&
      player.depth === enemy.depth
    ) {
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
