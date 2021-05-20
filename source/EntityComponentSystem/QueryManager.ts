import { BitSet } from '../Container/BitSet';
import { Query } from './Query';
import { World } from './World';

export class QueryManager {
  private world: World;
  private queries: { [key: string]: Query };

  public constructor(wolrd: World) {
    this.world = wolrd;
    this.queries = {};
  }

  public getQuery(key: string): Query | undefined {
    return this.queries[key];
  }

  public createQuery(componentTypes: BitSet): Query {
    const key = componentTypes.toString();
    const query = this.queries[key];
    return query === void 0 ? this.addQuery(key, new Query(componentTypes.clone())) : query;
  }

  public removeQuery(query: Query, force: boolean = false): void {}

  private addQuery(key: string, query: Query): Query {
    this.queries[key] = query;
    const entities = this.world.entityManager.getEntities();
    for (let i = 0; i < entities.length; i++) {
      query.addEntity(entities[i]);
    }
    return query;
  }
}
