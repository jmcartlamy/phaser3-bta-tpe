export default function(
  scene: Phaser.Scene,
  config: { x: number; y: number; width: number; height: number; color: number }
) {
  const bar = scene.add.graphics();

  bar.fillStyle(config.color, 1);

  bar.fillRect(0, 0, config.width, config.height);

  bar.x = config.x;
  bar.y = config.y;

  return bar;
}
