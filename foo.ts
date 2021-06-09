// @ts-nocheck
let TO_DRAW = false;
let MAX_ENTITES = 1;

class Component {
  static getID = (() => {
    let id = 0;
    return function () {
      if (this.id === void 0) {
        Object.defineProperty(this, 'id', {
          value: id++,
          configurable: false,
          enumerable: false,
          writable: false
        });
      }
      return this.id;
    };
  })();
}

class Entity {
  constructor() {
    this.components = {};
  }

  addComponent(ComponentType) {
    this.components[ComponentType.getID()] = new ComponentType();
  }
  getComponent(ComponentType) {
    return this.components[ComponentType.getID()];
  }
  getComponentById(id) {
    return this.components[id];
  }

  update(delta, context) {
    const transform = this.getComponent(Transform);
    const graphics = this.getComponent(Graphics);
    const velocity = this.getComponent(Velocity);
    const hp = this.getComponent(HP);
    const transformEx = this.getComponent(TransformEx);
    const graphicsEx = this.getComponent(GraphicsEx);
    const velocityEx = this.getComponent(VelocityEx);
    const hpEx = this.getComponent(HPEx);
    if (transform && velocity) {
      transform.x += velocity.x * delta;
      transform.y += velocity.y * delta;
      transform.rotation += 10 * delta;
    }
    if (transform && graphics) {
      // graphics.width++;
      // graphics.height++;
      if (TO_DRAW) {
        context.fillStyle = graphics.color;
        context.fillRect(transform.x, transform.y, graphics.width, graphics.height);
      }
    }
    if (transform && graphics && hp) {
      hp.hitpoints += 10;
      if (TO_DRAW) {
        context.fillStyle = 'green'
        context.fillRect(transform.x, transform.y - 10, graphics.width, 10);
        context.fillStyle = 'black'
        context.fillText(hp.hitpoints, transform.x, transform.y - 10)
      }
    }
    if (transformEx && velocityEx) {
      transformEx.x += velocityEx.x * delta;
      transformEx.y += velocityEx.y * delta;
      transformEx.rotation += 10 * delta;
    }
    if (transformEx && graphicsEx) {
      // graphicsEx.width++;
      // graphicsEx.height++;
      if (TO_DRAW) {
        context.fillStyle = graphicsEx.color;
        context.fillRect(transformEx.x, transformEx.y, graphicsEx.width, graphicsEx.height);
      }
    }
    if (transformEx && graphicsEx && hpEx) {
      hpEx.hitpoints += 10;
      if (TO_DRAW) {
        context.fillStyle = 'green'
        context.fillRect(transformEx.x, transformEx.y - 10, graphics.width, 10);
        context.fillStyle = 'black'
        context.fillText(hpEx.hitpoints, transformEx.x, transformEx.y - 10)
      }
    }
  }
}

class View {
  constructor(...ComponentTypes) {
    this.types = ComponentTypes.map((Type) => {
      return Type.getID();
    })

    this.archetypes = [];
    this.callbacks = [
      this.callbackA.bind(this),
      this.callbackAB.bind(this),
      this.callbackABC.bind(this),
      this.callbackABCD.bind(this),
      this.callbackABCDE.bind(this)
    ];
    this.callback = this.callbacks[ComponentTypes.length - 1] ?? function () { };
  }

  callbackA(archetype, callback) {
    const components = archetype.components;
    const A = components[this.types[0]];
    for (let i = 0; i < archetype.size; i++) {
      callback(A[i]);
    }
  }
  callbackAB(archetype, callback) {
    const components = archetype.components;
    const A = components[this.types[0]];
    const B = components[this.types[1]];
    for (let i = 0; i < archetype.size; i++) {
      callback(A[i], B[i]);
    }
  }
  callbackABC(archetype, callback) {
    const components = archetype.components;
    const A = components[this.types[0]];
    const B = components[this.types[1]];
    const C = components[this.types[2]];
    for (let i = 0; i < archetype.size; i++) {
      callback(A[i], B[i], C[i]);
    }
  }
  callbackABCD(archetype, callback) {
    const components = archetype.components;
    const A = components[this.types[0]];
    const B = components[this.types[1]];
    const C = components[this.types[2]];
    const D = components[this.types[3]];
    for (let i = 0; i < archetype.size; i++) {
      callback(A[i], B[i], C[i], D[i]);
    }
  }
  callbackABCDE(archetype, callback) {
    const components = archetype.components;
    const A = components[this.types[0]];
    const B = components[this.types[1]];
    const C = components[this.types[2]];
    const D = components[this.types[3]];
    const E = components[this.types[4]];
    for (let i = 0; i < archetype.size; i++) {
      callback(A[i], B[i], C[i], D[i], E[i]);
    }
  }

  addArchetype(archetype) {
    this.archetypes.push(archetype);
  }

  forEach(callback) {
    for (let i = 0; i < this.archetypes.length; i++) {
      const archetype = this.archetypes[i];
      /* const components = [];
      for (let j = 0; j < this.types.length; j++) {
        components.push(archetype.components[this.types[j]]);
      }
      for (let j = 0; j < archetype.size; j++) {
        callback(...components.map((component) => {
          return component[j];
        }));
      } */
      this.callback(archetype, callback);
    }
  }
}

class World {
  constructor() {
    this.archetypes = [];
    this.systems = [];
    this.entities = []
  }

  update(delta, context) {
    for (let i = 0; i < this.systems.length; i++) {
      this.systems[i].update(delta, context);
    }
  }

  query(...ComponentTypes) {
    const view = new View(...ComponentTypes);
    for (let i = 0; i < this.archetypes.length; i++) {
      const archetype = this.archetypes[i];
      if (archetype.matches(...ComponentTypes)) {
        view.addArchetype(archetype);
      }
    }
    return view;
  }

  createEntity(...ComponentTypes) {
    const entity = new Entity();
    this.entities.push(entity);
    ComponentTypes.forEach((ComponentType) => {
      entity.addComponent(ComponentType);
    });
    const archetype = this.createArchetype(...ComponentTypes);
    archetype.addEntity(entity);
    return entity;
  }

  createArchetype(...ComponentTypes) {
    for (let i = 0; i < this.archetypes.length; i++) {
      if (this.archetypes[i].all(...ComponentTypes)) {
        return this.archetypes[i];
      }
    }
    const archetype = new Archetype(...ComponentTypes);
    this.archetypes.push(archetype);
    return archetype;
  }

  addSystem(system) {
    this.systems.push(system);
  }
}

class Archetype {
  constructor(...ComponentTypes) {
    this.components = {};
    this.size = 0;
    ComponentTypes.forEach((ComponentType) => {
      this.components[ComponentType.getID()] = [];
    });
  }

  addEntity(entity) {
    for (const id in this.components) {
      this.components[id][this.size] = entity.getComponentById(id);
    }
    this.size++;
  }

  all(...ComponentTypes) {
    if (Object.keys(this.components).length > ComponentTypes.length) {
      return false;
    }
    return this.matches(...ComponentTypes);
  }

  matches(...ComponentTypes) {
    for (let i = 0; i < ComponentTypes.length; i++) {
      if (this.components[ComponentTypes[i].getID()] === void 0) {
        return false;
      }
    }
    return true;
  }
}

class Transform extends Component {
  constructor() {
    super();
    this.x = Math.random() * 512;
    this.y = Math.random() * 512;
    this.rotation = 0;
  }
}
class Graphics extends Component {
  constructor() {
    super();
    this.width = 50;
    this.height = 50;
    this.color = 'red';
  }
}
class Velocity extends Component {
  constructor() {
    super();
    this.x = Math.round(50 - 1 - (Math.random() * 2)) || 10;
    this.y = Math.round(50 - (Math.random() * 100)) || 10;
  }
}
class HP extends Component {
  constructor() {
    super();
    this.hitpoints = Math.random() * 100;
    this.hitpointsMax = 100;
  }
}
class TransformEx extends Component {
  constructor() {
    super();
    this.x = Math.random() * 512;
    this.y = Math.random() * 512;
    this.rotation = 0;
  }
}
class GraphicsEx extends Component {
  constructor() {
    super();
    this.width = 50;
    this.height = 50;
    this.color = 'red';
  }
}
class VelocityEx extends Component {
  constructor() {
    super();
    this.x = Math.round(50 - (Math.random() * 100)) || 10;
    this.y = Math.round(50 - (Math.random() * 100)) || 10;
  }
}
class HPEx extends Component {
  constructor() {
    super();
    this.hitpoints = Math.random() * 100;
    this.hitpointsMax = 100;
  }
}

class TransformSystem {
  constructor(world) {
    this.query = world.query(Transform, Velocity);
  }
  update(delta, context) {
    this.query.forEach((transform, velocity) => {
      transform.x += velocity.x * delta;
      transform.y += velocity.y * delta;
      transform.rotation += 10 * delta;
    });
  }
}
class DrawSystem {
  constructor(world) {
    this.query = world.query(Transform, Graphics);
  }
  update(delta, context) {
    this.query.forEach((transform, graphics) => {
      // graphics.width++;
      // graphics.height++;
      if (TO_DRAW) {
        context.fillStyle = graphics.color;
        context.fillRect(transform.x, transform.y, graphics.width, graphics.height);
      }
    });
  }
}
class HealthSystem {
  constructor(world) {
    this.query = world.query(Transform, Graphics, HP);
  }
  update(delta, context) {
    this.query.forEach((transform, graphics, hp) => {
      hp.hitpoints += 10;
      if (TO_DRAW) {
        context.fillStyle = 'green'
        context.fillRect(transform.x, transform.y - 10, graphics.width, 10);
        context.fillStyle = 'black'
        context.fillText(hp.hitpoints, transform.x, transform.y - 10)
      }
    });
  }
}
class TransformSystemEx {
  constructor(world) {
    this.query = world.query(TransformEx, VelocityEx);
  }
  update(delta, context) {
    this.query.forEach((transform, velocity) => {
      transform.x += velocity.x * delta;
      transform.y += velocity.y * delta;
      transform.rotation += 10 * delta;
    });
  }
}
class DrawSystemEx {
  constructor(world) {
    this.query = world.query(TransformEx, GraphicsEx);
  }
  update(delta, context) {
    this.query.forEach((transform, graphics) => {
      // graphics.width++;
      // graphics.height++;
      if (TO_DRAW) {
        context.fillStyle = graphics.color;
        context.fillRect(transform.x, transform.y, graphics.width, graphics.height);
      }
    });
  }
}
class HealthSystemEx {
  constructor(world) {
    this.query = world.query(TransformEx, GraphicsEx, HPEx);
  }
  update(delta, context) {
    this.query.forEach((transform, graphics, hp) => {
      hp.hitpoints += 10;
      if (TO_DRAW) {
        context.fillStyle = 'green'
        context.fillRect(transform.x, transform.y - 10, graphics.width, 10);
        context.fillStyle = 'black'
        context.fillText(hp.hitpoints, transform.x, transform.y - 10)
      }
    });
  }
}

class SceneA {
  constructor() {
    this.entities = [];
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.update = this.update.bind(this);
    this.elapsed = performance.now();
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.counter = 0;
    this.fps = 0;
    document.body.appendChild(this.canvas);
    window.requestAnimationFrame(this.update);
  }
  createEntity(...ComponentTypes) {
    const entity = new Entity();
    ComponentTypes.forEach((ComponentType) => {
      entity.addComponent(ComponentType);
    });
    this.entities.push(entity);
  }
  update() {
    const elapsed = performance.now();
    const delta = (elapsed - this.elapsed) / 1000;
    this.fps += 1 / delta;
    this.counter++;
    this.elapsed = elapsed;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].update(delta, this.context);
    }
    this.context.fillStyle = 'black';
    this.context.fillText('FPS:' + (this.fps / this.counter).toFixed(2), 50, 50);
    window.requestAnimationFrame(this.update);
  }
}
class SceneB {
  constructor() {
    this.world = new World();
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.update = this.update.bind(this);
    this.elapsed = performance.now();
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.counter = 0;
    this.fps = 0;
    document.body.appendChild(this.canvas);
    window.requestAnimationFrame(this.update);
  }
  createEntity(...ComponentTypes) {
    this.world.createEntity(...ComponentTypes);
  }
  update() {
    const elapsed = performance.now();
    const delta = (elapsed - this.elapsed) / 1000;
    this.fps += 1 / delta;
    this.counter++;
    this.elapsed = elapsed;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.world.update(delta, this.context);
    this.context.fillStyle = 'black';
    this.context.fillText('FPS:' + (this.fps / this.counter).toFixed(2), 50, 50);
    window.requestAnimationFrame(this.update);
  }
}

const B = (function (B) {
  const createKey = (types) => {
    return types
      .sort()
      .join('.');
  };
  class World {
    constructor() {
      this.systems = [];
      this.views = {};
    }
    update(delta, context) {
      for (let i = 0; i < this.systems.length; i++) {
        const system = this.systems[i];
        const query = this.getView(system.key);
        system.update(query.entities, delta, context);
      }
    }
    createEntity(...ComponentTypes) {
      const entity = new Entity();
      ComponentTypes.forEach((ComponentType) => {
        entity.addComponent(ComponentType);
      });
      for (const key in this.views) {
        const view = this.views[key];
        view.addEntity(entity);
      }
    }
    addSystem(system) {
      const types = system.types;
      this.createView(types);
      this.systems.push(system);
    }
    createView(types) {
      const key = createKey(types);
      let view = this.getView(key);
      if (!view) {
        view = new View(types);
        this.views[key] = view;
      }
      return view;
    }
    getView(key) {
      return this.views[key] ?? null;
    }
  }
  class System {
    constructor(...ComponentTypes) {
      this.types = ComponentTypes.map((Type) => Type.getID());
      this.key = createKey(this.types);
    }
  }
  class TransformSystem extends System {
    constructor() {
      super(Transform, Velocity);
    }
    update(entities, delta, context) {
      entities.forEach((entity) => {
        const transform = entity.getComponent(Transform);
        const velocity = entity.getComponent(Velocity);
        transform.x += velocity.x * delta;
        transform.y += velocity.y * delta;
        transform.rotation += 10 * delta;
      });
    }
  }
  class DrawSystem extends System {
    constructor() {
      super(Transform, Graphics);
    }
    update(entities, delta, context) {
      entities.forEach((entity) => {
        const transform = entity.getComponent(Transform);
        const graphics = entity.getComponent(Graphics);
        // graphics.width++;
        // graphics.height++;
        if (TO_DRAW) {
          context.fillStyle = graphics.color;
          context.fillRect(transform.x, transform.y, graphics.width, graphics.height);
        }
      });
    }
  }
  class HealthSystem extends System {
    constructor() {
      super(Transform, Graphics, HP);
    }
    update(entities, delta, context) {
      entities.forEach((entity) => {
        const transform = entity.getComponent(Transform);
        const graphics = entity.getComponent(Graphics);
        const hp = entity.getComponent(HP);
        hp.hitpoints += 10;
        if (TO_DRAW) {
          context.fillStyle = 'green'
          context.fillRect(transform.x, transform.y - 10, graphics.width, 10);
          context.fillStyle = 'black'
          context.fillText(hp.hitpoints, transform.x, transform.y - 10)
        }
      });
    }
  }
  class TransformSystemEx extends System {
    constructor() {
      super(TransformEx, VelocityEx);
    }
    update(entities, delta, context) {
      entities.forEach((entity) => {
        const transform = entity.getComponent(TransformEx);
        const velocity = entity.getComponent(VelocityEx);
        transform.x += velocity.x * delta;
        transform.y += velocity.y * delta;
        transform.rotation += 10 * delta;
      });
    }
  }
  class DrawSystemEx extends System {
    constructor() {
      super(TransformEx, GraphicsEx);
    }
    update(entities, delta, context) {
      entities.forEach((entity) => {
        const transform = entity.getComponent(TransformEx);
        const graphics = entity.getComponent(GraphicsEx);
        if (TO_DRAW) {
          context.fillStyle = graphics.color;
          context.fillRect(transform.x, transform.y, graphics.width, graphics.height);
        }
      });
    }
  }
  class HealthSystemEx extends System {
    constructor() {
      super(TransformEx, GraphicsEx, HPEx);
    }
    update(entities, delta, context) {
      entities.forEach((entity) => {
        const transform = entity.getComponent(TransformEx);
        const graphics = entity.getComponent(GraphicsEx);
        const hp = entity.getComponent(HPEx);
        hp.hitpoints += 10;
        if (TO_DRAW) {
          context.fillStyle = 'green'
          context.fillRect(transform.x, transform.y - 10, graphics.width, 10);
          context.fillStyle = 'black'
          context.fillText(hp.hitpoints, transform.x, transform.y - 10)
        }
      });
    }
  }
  class View {
    constructor(types) {
      this.types = types;
      this.entities = [];
    }
    addEntity(entity) {
      if (this.matches(entity)) {
        this.entities.push(entity);
      }
    }
    matches(entity) {
      for (let i = 0; i < this.types.length; i++) {
        const type = this.types[i];
        if (!entity.components[type]) {
          return false;
        }
      }
      return true;
    }
  }
  class Foo extends System {
    constructor() {
      super(Transform, Graphics);
    }
  }
  class Scene {
    constructor() {
      this.world = new World();
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.update = this.update.bind(this);
      this.elapsed = performance.now();
      this.canvas.width = 512;
      this.canvas.height = 512;
      this.fps = 0;
      this.counter = 0;
      document.body.appendChild(this.canvas);
      window.requestAnimationFrame(this.update);
    }
    update() {
      const elapsed = performance.now();
      const delta = (elapsed - this.elapsed) / 1000;
      this.fps += 1 / delta;
      this.counter++;
      this.elapsed = elapsed;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.world.update(delta, this.context);
      this.context.fillStyle = 'black';
      this.context.fillText('FPS:' + (this.fps / this.counter).toFixed(2), 50, 50);
      window.requestAnimationFrame(this.update);
    }
  }
  B.Scene = Scene;
  B.World = World;
  B.Foo = Foo;
  B.TransformSystem = TransformSystem;
  B.TransformSystemEx = TransformSystemEx;
  B.DrawSystem = DrawSystem;
  B.DrawSystemEx = DrawSystemEx;
  B.HealthSystem = HealthSystem;
  B.HealthSystemEx = HealthSystemEx;
  return B;
})({});

/* const scene = new SceneA(); */
/* const scene = new SceneB(); */
/* const scene = new B.Scene(); */

TO_DRAW = true;
MAX_ENTITES = 1;

if (scene instanceof SceneA) {
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Velocity, Graphics, TransformEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Graphics, TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Velocity, Graphics, HP, TransformEx, GraphicsEx, HPEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Graphics, Velocity);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Velocity, Graphics);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Graphics, HP, Velocity);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(TransformEx, GraphicsEx, VelocityEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(TransformEx, GraphicsEx, HPEx, VelocityEx);
  }
} else if (scene instanceof SceneB) {
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Velocity, Graphics, TransformEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Graphics, TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Velocity, Graphics, HP, TransformEx, GraphicsEx, HPEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Graphics, Velocity);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Velocity, Graphics);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(Transform, Graphics, HP, Velocity);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(TransformEx, GraphicsEx, VelocityEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    scene.createEntity(TransformEx, GraphicsEx, HPEx, VelocityEx);
  }
  scene.world.addSystem(new TransformSystem(scene.world));
  scene.world.addSystem(new DrawSystem(scene.world));
  scene.world.addSystem(new HealthSystem(scene.world));
  scene.world.addSystem(new TransformSystemEx(scene.world));
  scene.world.addSystem(new DrawSystemEx(scene.world));
  scene.world.addSystem(new HealthSystemEx(scene.world));
} else if (scene instanceof B.Scene) {
  const world = scene.world;
  world.addSystem(new B.TransformSystem());
  world.addSystem(new B.DrawSystem());
  world.addSystem(new B.HealthSystem());
  world.addSystem(new B.TransformSystemEx());
  world.addSystem(new B.DrawSystemEx());
  world.addSystem(new B.HealthSystemEx());
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(Transform, Velocity, Graphics, TransformEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(Transform, Velocity, Graphics, TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(Transform, Velocity, Graphics, HP, TransformEx, GraphicsEx, HPEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(Transform, Velocity, Graphics);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(Transform, Velocity, Graphics);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(Transform, Velocity, Graphics, HP);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(TransformEx, VelocityEx, GraphicsEx);
  }
  for (let i = 0; i < MAX_ENTITES; i++) {
    world.createEntity(TransformEx, GraphicsEx, HPEx, VelocityEx);
  }
}
