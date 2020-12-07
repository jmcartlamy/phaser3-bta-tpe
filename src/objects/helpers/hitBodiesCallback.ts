import { IEnemy, IPlayer } from '../../types';

export default function(
  scene: Phaser.Scene,
  source: IPlayer | IEnemy,
  target: IPlayer | IEnemy,
  delay: number
) {
  const now = Date.now();
  if (target.status.lastHitAt + delay < now) {
    target.status.lastHitAt = now;
    target.status.health -= source.stats.damage;
    if (target.status.health <= 0) {
      target.sprite.destroy();
      target.compoundBody.head.destroy();
      target.compoundBody.buste.destroy();
      target.compoundBody.arms.destroy();
      target.compoundBody.legs.destroy();
      target.sprite = null;
    } else {
      scene.tweens.add({
        targets: target.sprite,
        alpha: 0,
        duration: 125,
        repeat: 4,
        yoyo: true,
        onComplete: () => target.sprite?.clearAlpha()
      });
    }
  }
}
