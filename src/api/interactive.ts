import UIMenuScene from '../scenes/userInterface/MenuScene.json';

class Interactive {
  public status: 0 | 1 | 2 | 3;
  public data: any;
  public socket: WebSocket;
  public lastUserInterface: number;

  constructor() {
    this.status = 0; // Initialization
    this.data = {};
    this.lastUserInterface = 0;
  }

  public setup(token: string, callback?: (status: number) => void): void {
    const url =
      process.env.NODE_ENV === 'production'
        ? 'wss://interactive-sync-ebs.azurewebsites.net/'
        : 'ws://localhost:8081/';

    try {
      this.socket = new WebSocket(
        url + '?client_id=' + process.env.EXT_CLIENT_ID + '&access_token=' + token
      );
    } catch (err) {
      throw Error(err);
    }

    this.socket.onopen = () => {
      this.status = 1; // Connected
      if (callback) callback(1);
    };
    this.socket.onerror = () => {
      this.status = 3; // Error
      if (callback) callback(3);
    };
  }

  public onMenu(): void {
    const DateNow = Date.now();
    if (this.lastUserInterface + 1000 < DateNow) {
      this.socket?.send(JSON.stringify({ context: 'user_interface', data: UIMenuScene }));
      this.lastUserInterface = DateNow;
    }
  }

  public onGame(userInterface: any): void {
    const DateNow = Date.now();
    if (this.lastUserInterface + 1000 < DateNow) {
      this.socket?.send(JSON.stringify({ context: 'user_interface', data: userInterface }));
      this.lastUserInterface = DateNow;
    }
  }

  public onDisconnect(): void {
    this.socket.close();
    this.status = 2; // Disconnected
  }
}

export default Interactive;
