export default function(
  player: Phaser.Physics.Arcade.Sprite,
  enemy: Phaser.Physics.Arcade.Sprite,
  params: {
    velocityX: number;
    velocityY: number;
    distanceToHit: number;
  }
) {
  if (player.depth > enemy.depth) {
    enemy.setVelocityY(params.velocityY);
  } else if (player.depth < enemy.depth) {
    enemy.setVelocityY(-params.velocityY);
  } else {
    enemy.setVelocityY(0);
  }

  if (player.body.x > enemy.body.x + params.distanceToHit) {
    enemy.setVelocityX(params.velocityX);
  } else if (player.body.x < enemy.body.x - params.distanceToHit) {
    enemy.setVelocityX(-params.velocityX);
  } else {
    enemy.setVelocityX(0);
  }
}
