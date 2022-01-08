import {
  GameLoop,
  GameObject,
  GameRenderer,
  ImageLoader,
  Logger,
  MouseIntersector,
  MouseInput,
  SpriteLoader,
} from './core';
import { GameState, GameUpdateArgs } from './game';
import { Cage, Creature, CreatureSelector, ControlPanel } from './objects';

import spriteManifest from '../data/sprite.manifest.json';

const loadingElement = document.querySelector<HTMLElement>('[data-loading]');

const log = new Logger('main', Logger.Level.Debug);

const imageLoader = new ImageLoader();
const spriteLoader = new SpriteLoader(imageLoader, spriteManifest);

const mouseInput = new MouseInput();
mouseInput.listen();
const mouseIntersector = new MouseIntersector(mouseInput);

const CANVAS_BASE_SIZE = {
  HEIGHT: 768,
  WIDTH: 1024,
};

const gameRenderer = new GameRenderer({
  height: CANVAS_BASE_SIZE.HEIGHT,
  width: CANVAS_BASE_SIZE.WIDTH,
  // debug: true,
});

const gameState = new GameState();

const updateArgs: GameUpdateArgs = {
  deltaTime: 0,
  gameState,
  mouseIntersector,
  spriteLoader,
};

const gameLoop = new GameLoop();

const cage = new Cage();
cage.position.set(128, 64);

const creatureSelector = new CreatureSelector();
creatureSelector.position.set(704, 64);

const creature = new Creature();
creature.position.set(290, 192);

const controlPanel = new ControlPanel();
controlPanel.position.set(704, 256);

const scene = new GameObject(CANVAS_BASE_SIZE.WIDTH, CANVAS_BASE_SIZE.HEIGHT);
scene.add(creature);
scene.add(cage);
scene.add(creatureSelector);
scene.add(controlPanel);

gameLoop.tick.addListener((event) => {
  try {
    mouseInput.update(gameRenderer.getScale());

    updateArgs.deltaTime = event.deltaTime;

    scene.traverse((node) => {
      node.invokeUpdate(updateArgs);
    });

    gameRenderer.render(scene);
  } catch (err) {
    log.error('Crashed', err);
    crash();
  }
});

async function main() {
  try {
    log.time('Sprites preload');
    loadingElement.textContent = 'Loading sprites...';
    await spriteLoader.preloadAllAsync();
    log.timeEnd('Sprites preload');

    loadingElement.style.display = 'none';
    document.body.appendChild(gameRenderer.getDomElement());

    gameLoop.start();
    // gameLoop.next();
  } catch (err) {
    console.log('failed');
    loadingElement.textContent = 'Failed to load';
    log.error(err);
  }
}

function crash() {
  gameLoop.stop();
  document.body.removeChild(gameRenderer.getDomElement());
  loadingElement.textContent = 'Game has crashed :(';
  loadingElement.style.display = 'flex';
}

main();

window.gameLoop = gameLoop;
