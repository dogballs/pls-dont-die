import {
  GameLoop,
  GameRenderer,
  ImageLoader,
  Logger,
  SpriteLoader,
} from './core';
import { Creature } from './objects';

const loadingElement = document.querySelector('[data-loading]');

const spriteManifest = {
  borpa: {
    file: 'data/graphics/borpa.png',
    rect: [0, 0, 200, 200],
  },
};

const log = new Logger('main', Logger.Level.Debug);

const imageLoader = new ImageLoader();
const spriteLoader = new SpriteLoader(imageLoader, spriteManifest);

const gameRenderer = new GameRenderer({
  height: 800,
  width: 800,
});

const updateArgs = {
  deltaTime: 0,
  spriteLoader,
};

const gameLoop = new GameLoop();

const creature = new Creature();
creature.position.set(20, 20);

gameLoop.tick.addListener((event) => {
  updateArgs.deltaTime = event.deltaTime;

  creature.invokeUpdate(updateArgs);

  gameRenderer.render(creature);
});

async function main() {
  try {
    log.time('Sprites preload');
    loadingElement.textContent = 'Loading sprites...';
    await spriteLoader.preloadAllAsync();
    log.timeEnd('Sprites preload');

    document.body.removeChild(loadingElement);
    document.body.appendChild(gameRenderer.getDomElement());
    // gameLoop.start();
    gameLoop.next();
  } catch (err) {
    loadingElement.textContent = 'Failed to load';
    log.error(err);
  }
}

main();

window.gameLoop = gameLoop;
