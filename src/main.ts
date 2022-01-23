import {
  GameLoop,
  GameRenderer,
  ImageLoader,
  LocalStorage,
  Logger,
  MouseIntersector,
  MouseInput,
  SpriteLoader,
} from './core';
import { GameState, GameStore, GameUpdateArgs } from './game';
import { GameSceneRouter, GameSceneType } from './scenes';
import { config } from './config';
import spriteManifest from '../data/sprite.manifest.json';

const loadingElement = document.querySelector<HTMLElement>('[data-loading]');
const crashElement = document.querySelector<HTMLElement>('[data-crash]');

const log = new Logger('main', Logger.Level.Debug);

const imageLoader = new ImageLoader();
const spriteLoader = new SpriteLoader(imageLoader, spriteManifest);

const mouseInput = new MouseInput();
const mouseIntersector = new MouseIntersector(mouseInput);

const gameRenderer = new GameRenderer({
  width: config.CANVAS_WIDTH,
  height: config.CANVAS_HEIGHT,
  // debug: true,
});

const storage = new LocalStorage(config.STORAGE_NAMESPACE);

const gameStore = new GameStore(storage);
const gameState = new GameState();

const updateArgs: GameUpdateArgs = {
  deltaTime: 0,
  gameState,
  gameStore,
  mouseIntersector,
  spriteLoader,
};

const sceneRouter = new GameSceneRouter();
if (config.IS_DEV) {
  sceneRouter.start(GameSceneType.About);
  // sceneRouter.start(GameSceneType.Intro);
  // sceneRouter.start(GameSceneType.MainMenu);
  // sceneRouter.start(GameSceneType.Level);
  // sceneRouter.start(GameSceneType.Final);
} else {
  sceneRouter.start(GameSceneType.MainMenu);
}

const gameLoop = new GameLoop();

sceneRouter.transitionStarted.addListener(() => {
  mouseIntersector.resetListeners();
});

gameLoop.tick.addListener((event) => {
  try {
    mouseInput.update(gameRenderer.getScale());
    mouseIntersector.update();

    updateArgs.deltaTime = event.deltaTime;

    const scene = sceneRouter.getCurrentScene();
    scene.invokeUpdate(updateArgs);

    gameRenderer.render(scene.getRoot());
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

    log.time('Storage preload');
    loadingElement.textContent = 'Loading store...';
    await gameStore.load();
    log.timeEnd('Storage preload');

    document.body.appendChild(gameRenderer.getDomElement());

    mouseInput.listen(gameRenderer.getDomElement());

    gameLoop.start();
    // gameLoop.next();
  } catch (err) {
    crash();

    log.error(err);
  } finally {
    loadingElement.style.display = 'none';
  }
}

function crash() {
  gameLoop.stop();
  try {
    document.body.removeChild(gameRenderer.getDomElement());
  } catch (err) {}
  crashElement.style.display = 'flex';
}

main();

window.gameLoop = gameLoop;
window.gameStore = gameStore;
