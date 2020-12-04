import { IEnemy, IPlayer } from '../../types';

export default function(
  player: IPlayer,
  enemy: IEnemy,
  params: {
    velocityX: number;
    velocityY: number;
    gapX: number;
    gapY: number;
    distanceToHit: number;
    bounds: { top: number; bottom: number };
  }
) {
  const spritePlayer = player.sprite;
  const spriteEnemy = enemy.sprite;
  if (player.lastDirection === enemy.lastDirection) {
    if (spritePlayer.depth > spriteEnemy.depth) {
      spriteEnemy.setVelocityY(params.velocityY * 2);
    } else if (spritePlayer.depth < spriteEnemy.depth) {
      spriteEnemy.setVelocityY(-params.velocityY * 2);
    } else {
      spriteEnemy.setVelocityY(0);
    }

    if (spritePlayer.body.x > spriteEnemy.body.x + params.distanceToHit) {
      spriteEnemy.setVelocityX(params.velocityX * 2);
    } else if (spritePlayer.body.x < spriteEnemy.body.x - params.distanceToHit) {
      spriteEnemy.setVelocityX(-params.velocityX * 2);
    } else {
      spriteEnemy.setVelocityX(0);
    }
  } else {
    if (
      ((spritePlayer.depth > spriteEnemy.depth &&
        spritePlayer.depth - spriteEnemy.depth < params.gapY) ||
        (spritePlayer.depth < spriteEnemy.depth &&
          spritePlayer.depth - spriteEnemy.depth < -params.gapY)) &&
      spriteEnemy.depth > Math.trunc(params.bounds.top / 10)
    ) {
      spriteEnemy.setVelocityY(-params.velocityY);
    } else if (
      ((spritePlayer.depth < spriteEnemy.depth &&
        spritePlayer.depth - spriteEnemy.depth > -params.gapY) ||
        (spritePlayer.depth > spriteEnemy.depth &&
          spritePlayer.depth - spriteEnemy.depth > params.gapY)) &&
      spriteEnemy.depth < Math.trunc(params.bounds.bottom / 10)
    ) {
      spriteEnemy.setVelocityY(params.velocityY);
    } else {
      spriteEnemy.setVelocityY(0);
    }
    if (
      (Math.trunc(spritePlayer.body.x) > Math.trunc(spriteEnemy.body.x + params.distanceToHit) &&
        Math.trunc(spritePlayer.body.x) - Math.trunc(spriteEnemy.body.x) < params.gapX) ||
      (Math.trunc(spritePlayer.body.x) < Math.trunc(spriteEnemy.body.x - params.distanceToHit) &&
        Math.trunc(spriteEnemy.body.x) - Math.trunc(spritePlayer.body.x) > params.gapX)
    ) {
      spriteEnemy.setVelocityX(-params.velocityX);
    } else if (
      (Math.trunc(spritePlayer.body.x) < Math.trunc(spriteEnemy.body.x - params.distanceToHit) &&
        Math.trunc(spritePlayer.body.x) - Math.trunc(spriteEnemy.body.x) > -params.gapX) ||
      (Math.trunc(spritePlayer.body.x) > Math.trunc(spriteEnemy.body.x + params.distanceToHit) &&
        Math.trunc(spritePlayer.body.x) - Math.trunc(spriteEnemy.body.x) > params.gapX)
    ) {
      spriteEnemy.setVelocityX(params.velocityX);
    } else {
      spriteEnemy.setVelocityX(0);
    }
  }
}
