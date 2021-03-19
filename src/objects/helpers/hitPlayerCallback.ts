import { SceneKeys } from '../../constants';
import changeSceneWithDelay from '../../scenes/helpers/changeSceneWithDelay';
import Map1Scene from '../../scenes/Map1Scene';
import { IEnemy, IPlayer } from '../../types';

export default function(scene: Map1Scene, source: IEnemy, target: IPlayer, delay: number) {
  const now = Date.now();
  if (target.status.lastHitAt + delay < now) {
    target.status.lastHitAt = now;
    target.status.health -= source.stats.damage;

    // Draine health bar
    scene.game.bar.playerHealth.scaleX =
      target.status.health / 100 > 0 ? target.status.health / 100 : 0;

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
      duration: delay / 2,
      onComplete: () => {
        hitMarker.destroy();
      }
    });

    if (target.sprite && target.status.health <= 0) {
      scene.tweens.add({
        targets: target.sprite,
        alpha: 0,
        duration: delay / 2,
        onComplete: () => {
          target.sprite?.destroy();
          target.compoundBody.text?.destroy();
          target.compoundBody.head.destroy();
          target.compoundBody.buste.destroy();
          target.compoundBody.arms.destroy();
          target.compoundBody.legs.destroy();
          target.sprite = null;

          changeSceneWithDelay(scene, SceneKeys.Menu, 5000);

          scene.add
            .text(scene.registry.get('innerWidth') / 2 - 200, 200, 'Viewers win !', {
              fontSize: '64px',
              fontFamily: 'KenneyFutureNarrow',
              fill: '#000000'
            })
            .setScrollFactor(0);
        }
      });
    }
  }
}
