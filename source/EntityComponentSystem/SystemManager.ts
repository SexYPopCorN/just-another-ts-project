import { System } from './System';
import { World } from './World';
import * as Utils from '../Utils';

export class SystemManager {
  private world: World;
  private systems: System[];

  public constructor(world: World) {
    this.world = world;
    this.systems = [];
  }

  public addSystem(system: System): void {
    const query = this.world.queryManager.createQuery(system.getComponentTypes());
    Utils.arrayPush(this.systems, system);
    this.systems.sort(SystemManager.sort);
  }

  private static sort(previous: System, next: System): number {
    return previous.priority - next.priority;
  }
}
