import { IEnemy, IPlayer } from '../../types';

export default function(
  player: IPlayer,
  enemy: IEnemy,
  params: {
    velocityX: number;
    velocityY: number;
    distanceToHit: number;
    deltaHit: number;
    deltaTaunt?: number;
  }
) {
  const spritePlayer = player.sprite;
  const spriteEnemy = enemy.sprite;
  const isHit = Date.now() - enemy.status.lastHitAt < params.deltaHit;
  const isTaunt = params.deltaTaunt && Date.now() - enemy.lastTauntedAt < params.deltaTaunt;

  if (isHit) {
    spriteEnemy.body.stop();
  } else if (isTaunt) {
    spriteEnemy.body.stop();
    enemy.hasTaunted = true;
  } else {
    if (
      !enemy.hasTaunted &&
      spritePlayer.body.x + 500 > spriteEnemy.body.x &&
      spritePlayer.body.x - 500 < spriteEnemy.body.x
    ) {
      enemy.lastTauntedAt = Date.now();
    }

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
