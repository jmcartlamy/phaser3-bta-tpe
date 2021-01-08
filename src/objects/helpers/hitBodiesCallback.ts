import { IEnemy, IPlayer } from '../../types';

export default function(scene: Phaser.Scene, source: IPlayer, target: IEnemy, delay: number) {
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
      duration: delay,
      onComplete: () => {
        hitMarker.destroy();
      }
    });

    if (target.sprite && target.status.health <= 0) {
      scene.tweens.add({
        targets: [target.sprite, target.compoundBody.label],
        alpha: 0,
        duration: delay,
        onComplete: () => {
          target.sprite?.destroy();
          target.compoundBody.label?.destroy();
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
