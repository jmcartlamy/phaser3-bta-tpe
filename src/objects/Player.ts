import { IPlayer } from '../types';
import smoothMoveCameraTowards from './helpers/smoothMoveCameraTowards';
import { Characters, PLAYER_COLLECTION } from '../constants';
import SceneFactory from '../scenes/SceneFactory';
import TileMap from './TileMap';

export default class Player {
  private readonly currentScene: SceneFactory;
  private currentMap: Phaser.Tilemaps.Tilemap;

  public collection: IPlayer;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: SceneFactory, tilemap: TileMap, positionX: number, positionY: number) {
    this.currentScene = scene;
    this.currentMap = tilemap.map;
    this.camera = this.currentScene.cameras.main;

    // Create player
    this.collection = {
      ...PLAYER_COLLECTION,
      sprite: this.currentScene.physics.add
        .sprite(positionX, positionY, Characters.Player)
        .setCollideWorldBounds(true)
    };

    // Create cursor keys for camera
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();

    // Create a collection's bodies to be a compound body.
    this.animateCompoundBody();

    // Position Camera
    this.camera.setBounds(0, 0, this.currentMap.widthInPixels, this.currentMap.heightInPixels);
    this.camera.startFollow(this.collection.sprite, false, 1, 1);

    // Set collision
    this.currentScene.physics.add.collider(this.collection.sprite, tilemap.layer);
  }

  public update(time: number, delta: number) {
    if (!this.collection.sprite) {
      return;
    }

    // Horizontal movement
    this.processHorizontalMovement(delta);
  }

  private animateCompoundBody() {
    this.currentScene.anims.create({
      key: 'left',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 9,
        end: 10
      }),
      frameRate: 8
    });
    this.currentScene.anims.create({
      key: 'right',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 9,
        end: 10
      }),
      frameRate: 8,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'idle',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 23,
        end: 23
      }),
      frameRate: 1,
      repeat: -1
    });
  }

  private processHorizontalMovement(delta: number) {
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      if (this.cursors.left.isDown) {
        this.collection.sprite.setVelocityX(-200);
        this.collection.sprite.anims.play('left', true);
        this.collection.lastDirection = 'left';
        this.collection.sprite.setFlipX(true);
      } else if (this.cursors.right.isDown) {
        this.collection.sprite.setVelocityX(200);
        this.collection.sprite.anims.play('right', true);
        this.collection.lastDirection = 'right';
        this.collection.sprite.setFlipX(false);
      }
    } else {
      this.collection.sprite.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.cursors.down.isDown) {
      if (this.cursors.up.isDown) {
        this.collection.sprite.setVelocityY(-125);
      } else if (this.cursors.down.isDown) {
        this.collection.sprite.setVelocityY(125);
      }
      if (this.collection.lastDirection === 'left') {
        this.collection.sprite.anims.play('left', true);
      } else {
        this.collection.sprite.anims.play('right', true);
      }
    } else {
      this.collection.sprite.setVelocityY(0);
    }

    if (
      this.cursors.up.isUp &&
      this.cursors.down.isUp &&
      this.cursors.left.isUp &&
      this.cursors.right.isUp
    ) {
      this.collection.sprite.anims.play('idle', true);
    }
  }
}
