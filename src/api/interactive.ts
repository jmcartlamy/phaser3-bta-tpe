import UIMenuScene from '../scenes/userInterface/MenuScene.json';

class Interactive {
  public status: 0 | 1 | 2 | 3;
  public data: object;
  public socket: WebSocket;

  constructor() {
    this.status = 0; // Initialization
    this.data = {};
  }

  public setup(token: string, callback?: () => void): void {
    const url =
      process.env.NODE_ENV === 'production'
        ? 'wss://interactive-sync-ebs.azurewebsites.net/'
        : 'ws://localhost:8081/';

    try {
      this.socket = new WebSocket(url, [process.env.EXT_CLIENT_ID, token]);
      this.status = 1; // Connected
    } catch (err) {
      this.status = 3; // Error
      throw Error(err);
    }

    if (callback) callback();
  }

  public onMenu(): void {
    this.socket?.send(JSON.stringify({ context: 'user_interface', data: UIMenuScene }));
  }

  public onGame(userInterface: any): void {
    this.socket?.send(JSON.stringify({ context: 'user_interface', data: userInterface }));
  }

  public onDisconnect(): void {
    this.socket.close();
    this.status = 2; // Disconnected
  }
}

export default Interactive;
