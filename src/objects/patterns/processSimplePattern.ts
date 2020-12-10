import { IEnemy, IPlayer } from '../../types';

export default function(
  player: IPlayer,
  enemy: IEnemy,
  params: {
    velocityX: number;
    velocityY: number;
    distanceToHit: number;
    deltaHit: number;
  }
) {
  const spritePlayer = player.sprite;
  const spriteEnemy = enemy.sprite;
  const isHit = Date.now() - enemy.status.lastHitAt < params.deltaHit;
  if (isHit) {
    spriteEnemy.body.stop();
  } else {
    if (spritePlayer.depth > spriteEnemy.depth) {
      spriteEnemy.setVelocityY(params.velocityY);
    } else if (spritePlayer.depth < spriteEnemy.depth) {
      spriteEnemy.setVelocityY(-params.velocityY);
    } else {
      spriteEnemy.setVelocityY(0);
    }

    if (spritePlayer.body.x > spriteEnemy.body.x + params.distanceToHit) {
      spriteEnemy.setVelocityX(params.velocityX);
    } else if (spritePlayer.body.x < spriteEnemy.body.x - params.distanceToHit) {
      spriteEnemy.setVelocityX(-params.velocityX);
    } else {
      spriteEnemy.setVelocityX(0);
    }
  }
}
