export default function centerBodyOnXY(
  a: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
  x: number,
  y: number
) {
  a.position.set(x - a.halfWidth, y - a.halfHeight);
}
