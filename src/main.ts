import { GameLoop } from './core/GameLoop';

const loadingElement = document.querySelector('[data-loading]');

const gameLoop = new GameLoop();

gameLoop.tick.addListener((event) => {
  console.log('loop', event);
});

async function main() {
  document.body.removeChild(loadingElement);

  gameLoop.start();
}

main();
