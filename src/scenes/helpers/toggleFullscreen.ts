export default function(scene: Phaser.Scene) {
  return function() {
    if (scene.scale.isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      scene.scale.startFullscreen();
    }
  };
}
