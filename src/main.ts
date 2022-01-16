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
// sceneRouter.start(GameSceneType.Level);
sceneRouter.start(GameSceneType.MainMenu);
// sceneRouter.start(GameSceneType.Intro);

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

    loadingElement.style.display = 'none';
    document.body.appendChild(gameRenderer.getDomElement());

    mouseInput.listen(gameRenderer.getDomElement());

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
