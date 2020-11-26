export default function(
  target: Phaser.Physics.Arcade.Sprite,
  cam: Phaser.Cameras.Scene2D.Camera,
  smoothFactor = 0
): void {
  cam.scrollX =
    smoothFactor * cam.scrollX +
    (1 - smoothFactor) * (target.x - cam.width * 0.5);
  cam.scrollY =
    smoothFactor * cam.scrollY +
    (1 - smoothFactor) * (target.y - cam.height * 0.5);
}
