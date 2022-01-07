import {
  GameLoop,
  GameObject,
  GameRenderer,
  ImageLoader,
  Logger,
  MouseInput,
  SpriteLoader,
} from './core';
import { GameUpdateArgs } from './game';
import { Cage, Creature, TemperatureSelector } from './objects';

const loadingElement = document.querySelector('[data-loading]');

const spriteManifest = {
  borpa: {
    file: 'data/graphics/borpa.png',
    rect: [0, 0, 200, 200],
  },
  cage: {
    file: 'data/graphics/cage.png',
    rect: [0, 0, 256, 256],
  },
};

const log = new Logger('main', Logger.Level.Debug);

const imageLoader = new ImageLoader();
const spriteLoader = new SpriteLoader(imageLoader, spriteManifest);

const mouseInput = new MouseInput();
mouseInput.listen();

const CANVAS_BASE_SIZE = {
  HEIGHT: 768,
  WIDTH: 1024,
};

const gameRenderer = new GameRenderer({
  height: CANVAS_BASE_SIZE.HEIGHT,
  width: CANVAS_BASE_SIZE.WIDTH,
  debug: true,
});

const updateArgs: GameUpdateArgs = {
  deltaTime: 0,
  mouseInput,
  spriteLoader,
};

const gameLoop = new GameLoop();

const temperatureSelector = new TemperatureSelector();

const cage = new Cage();
cage.position.set(128, 64);

const creature = new Creature();
creature.position.set(162, 96);
cage.add(creature);

const controlPanel = new GameObject(256, 512);
controlPanel.position.set(704, 64);
controlPanel.add(temperatureSelector);

const scene = new GameObject(CANVAS_BASE_SIZE.WIDTH, CANVAS_BASE_SIZE.HEIGHT);
scene.add(cage);
scene.add(controlPanel);

gameLoop.tick.addListener((event) => {
  mouseInput.update(gameRenderer.getScale());

  updateArgs.deltaTime = event.deltaTime;

  scene.traverse((node) => {
    node.invokeUpdate(updateArgs);
  });

  gameRenderer.render(scene);
});

async function main() {
  try {
    log.time('Sprites preload');
    loadingElement.textContent = 'Loading sprites...';
    await spriteLoader.preloadAllAsync();
    log.timeEnd('Sprites preload');

    document.body.removeChild(loadingElement);
    document.body.appendChild(gameRenderer.getDomElement());

    gameLoop.start();
    // gameLoop.next();
  } catch (err) {
    loadingElement.textContent = 'Failed to load';
    log.error(err);
  }
}

main();

window.gameLoop = gameLoop;
