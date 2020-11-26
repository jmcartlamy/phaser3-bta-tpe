import tilemap from '../assets/tilemaps/map1.json';
import userInterface from './userInterface/MapScene1.json';
import SceneFactory from './SceneFactory';
import { SceneKeys } from '../constants';

export default class Map1Scene extends SceneFactory {
  constructor() {
    super({
      key: SceneKeys.Map1,
      map: {
        key: 'map1',
        tilemap: tilemap,
        bestTime: 50,
        direction: 'right',
        nextMap: SceneKeys.Map1
      },
      position: {
        player: { x: 160, y: 700 }
      },
      user: {
        interface: userInterface
      }
    });
  }
}
