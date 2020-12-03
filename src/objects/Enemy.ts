import { IEnemy, IEnemyParams } from '../types';
import { ENEMY_COLLECTION } from '../constants';

export default class Enemy {
  protected readonly currentScene: Phaser.Scene;
  protected params: IEnemyParams;
  public collection: IEnemy;

  constructor(scene: Phaser.Scene, params: IEnemyParams) {
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
    
      // TODO move depending on player
    this.collection.sprite.setDepth(Math.trunc(this.collection.sprite.body.y / 10));
  }
}
