import { GameLoop, GameObject, GameRenderer } from './core';

const loadingElement = document.querySelector('[data-loading]');

const gameRenderer = new GameRenderer({
  height: 800,
  width: 800,
});

const gameLoop = new GameLoop();

const scene = new GameObject();

gameLoop.tick.addListener(() => {
  gameRenderer.render(scene);
});

async function main() {
  document.body.removeChild(loadingElement);

  gameLoop.start();
}

main();
