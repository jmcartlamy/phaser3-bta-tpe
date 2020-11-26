import SceneFactory from '../SceneFactory';

export default function(currentScene: SceneFactory, delay: number = 500) {
  currentScene.time.addEvent({
    delay: delay,
    callback: () => {
      currentScene.scene.restart();
    },
    callbackScope: this
  });

  if (currentScene.game.interactive.status === 1) {
    currentScene.game.interactive.socket.removeEventListener(
      'message',
      currentScene.handleWebSocketMessage,
      true
    );
  }
}
