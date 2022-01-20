import { GameUpdateArgs } from '../game';
import { TalkModal } from '../objects';

import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

const messages: string[][] = [];
messages.push([
  'Greetings, fellow intern!',
  'Welcome to the Synth Labs!',
  '',
  'My name is Peter Dogson and I will be your mentor.',
]);
messages.push([
  'As you might know, our lab specializes in the research',
  'of new elements. We do this with the help of a unique',
  'device that we have developed in our lab.',
]);
messages.push([
  'We use the device to summon the creatures from the',
  'outer worlds. By simulating the environment for these',
  'creatures we are able to extract new elements that',
  "don't exist in our world.",
]);
messages.push([
  "This is completely harmless, because we don't really",
  'interact with real living organizms, but just their',
  'simulations... ahem...',
]);
messages.push(["... Enough of this boring talk, let's try this in action!"]);

export class IntroScene extends GameScene {
  protected setup({ gameStore }: GameUpdateArgs) {
    const doctorModal = new TalkModal(messages);
    doctorModal.updateMatrix();
    doctorModal.setCenter(this.root.getSelfCenter());
    doctorModal.closed.addListener(() => {
      gameStore.setStoryStep('dummy_summon_live');
      gameStore.save();
      this.navigator.push(GameSceneType.Level);
    });
    this.root.add(doctorModal);
  }

  protected update(updateArgs: GameUpdateArgs) {
    super.update(updateArgs);
  }
}
