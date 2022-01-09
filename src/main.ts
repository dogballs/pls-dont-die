import {
  GameLoop,
  GameRenderer,
  ImageLoader,
  Logger,
  MouseIntersector,
  MouseInput,
  SpriteLoader,
} from './core';
import { GameState, GameUpdateArgs } from './game';
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

const gameState = new GameState();

const updateArgs: GameUpdateArgs = {
  deltaTime: 0,
  gameState,
  mouseIntersector,
  spriteLoader,
};

const sceneRouter = new GameSceneRouter();
sceneRouter.start(GameSceneType.Level);

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
