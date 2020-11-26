export default class TileMap {
  public map: Phaser.Tilemaps.Tilemap;
  public layer: Phaser.Tilemaps.DynamicTilemapLayer;

  constructor(scene: Phaser.Scene, key: string) {
    this.map = scene.make.tilemap({ key });

    // Map with collision
    const tilesetImage = this.map.addTilesetImage('tileMaps', 'tileMaps', 64, 64, 1, 2);
    this.layer = this.map.createDynamicLayer(0, tilesetImage, 0, 0);

    // Set colliding tiles
    //this.layer.setCollisionByProperty({ collides: true });

    // Map without collision
    //const tilesetImageNC = this.map.addTilesetImage('tileMapsNC', 'tileMapsNC', 64, 64, 1, 2);
    //this.map.createStaticLayer(0, tilesetImageNC, 0, 0);

    // @ts-ignore
    scene.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    scene.cameras.main.setScroll(95, 100);
  }
}
