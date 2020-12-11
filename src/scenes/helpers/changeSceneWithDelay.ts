import Map1Scene from '../Map1Scene';

export default function(currentScene: Map1Scene, nextScene: string, delay: number = 500) {
  currentScene.time.addEvent({
    delay: delay,
    callback: () => {
      // Stop the current scene
      currentScene.scene.stop();
      currentScene.scene.start(nextScene);
    },
    callbackScope: this
  });

  // Reinitialize enemies
  if (currentScene.blob) {
    currentScene.blob.forEach(function(b) {
      b.collection.sprite?.destroy();
    });
    currentScene.blob = [];
  }

  if (currentScene.game.interactive.status === 1) {
    currentScene.game.interactive.socket.removeEventListener(
      'message',
      currentScene.handleWebSocketMessage,
      true
    );
  }
}
