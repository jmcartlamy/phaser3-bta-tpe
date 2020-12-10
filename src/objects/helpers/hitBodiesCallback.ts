import { IEnemy, IPlayer } from '../../types';

export default function(
  scene: Phaser.Scene,
  source: IPlayer | IEnemy,
  target: IPlayer | IEnemy,
  delay: number,
  targetIsPlayer?: boolean
) {
  const now = Date.now();
  if (target.status.lastHitAt + delay < now) {
    target.status.lastHitAt = now;
    target.status.health -= source.stats.damage;

    // Add hit marker
    const hitMarker = scene.add
      .image(
        source.compoundBody.arms.body.x +
          (source.sprite.flipX ? 0 : source.compoundBody.arms.body.width),
        source.compoundBody.arms.body.y + source.compoundBody.arms.body.halfHeight,
        'hitMarker'
      )
      .setOrigin(0.5)
      .setDepth(source.compoundBody.arms.body.y / 10);

    scene.tweens.add({
      targets: hitMarker,
      alpha: target.sprite && target.status.health <= 0 ? 0 : 1,
      duration: targetIsPlayer ? delay / 2 : delay,
      onComplete: () => {
        hitMarker.destroy();
      }
    });

    if (target.sprite && target.status.health <= 0) {
      scene.tweens.add({
        targets: target.sprite,
        alpha: 0,
        duration: targetIsPlayer ? delay / 2 : delay,
        onComplete: () => {
          target.sprite?.destroy();
          target.compoundBody.head.destroy();
          target.compoundBody.buste.destroy();
          target.compoundBody.arms.destroy();
          target.compoundBody.legs.destroy();
          target.sprite = null;
        }
      });
    }
  }
}
