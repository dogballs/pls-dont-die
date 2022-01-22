export class TalkLines {
  static spiritFirst() {
    const messages: string[][] = [];
    messages.push(['.......................']);
    messages.push(['Hom many times do we have to ask you...']);
    messages.push(['You are abducting and killing us!']);
    messages.push(['It has to stop!']);
    return messages;
  }

  static spiritSecond() {
    const messages: string[][] = [];
    messages.push(['......']);
    messages.push(["I don't recognize you, you must be new."]);
    messages.push(["Don't listen to what they have told you."]);
    messages.push(['This device of yours is actually killing us.']);
    messages.push(['You have to help us!']);
    return messages;
  }

  static spiritThird() {
    const messages: string[][] = [];
    messages.push(['...']);
    messages.push([
      'You must extract my soul and combine',
      'it with all of the spirit elements',
    ]);
    messages.push([
      'It will destroy the harvesting device',
      'and free our world from the terror',
    ]);
    messages.push(['Help us!']);
    return messages;
  }

  static spiritFourth(resLeft) {
    const messages: string[][] = [];
    messages.push([
      'You must combine my soul with the spirit elements!',
      `We need ${resLeft} more!`,
    ]);
    return messages;
  }

  static spiritEnd() {
    const messages: string[][] = [];
    messages.push(['.......']);
    messages.push(['You did it!']);
    messages.push(['Thank you........ <3']);
    messages.push(['I can finally...']);
    messages.push(['...I can now destroy you world ;-)']);
    return messages;
  }

  static dummySummonToLive() {
    const messages: string[][] = [];
    messages.push(['Here is the device assigned to you.']);
    messages.push([
      'To summon a creature you need to create a',
      'reaction between two elements.',
    ]);
    messages.push(["Let's run our reactor using stock elements!"]);
    return messages;
  }

  static dummySimulateToLive() {
    const messages: string[][] = [];
    messages.push(['Voila! Our dummy test subject!']);
    messages.push(['On the right you can see the control panel.']);
    messages.push([
      'It is used to configure the environment for our',
      'test subject.',
    ]);
    messages.push([
      "Let's run a simulation for our dummy with default",
      'parameters!',
    ]);
    return messages;
  }

  static dummyLivedAndSummonToDie() {
    const messages: string[][] = [];
    messages.push([
      'Perfect! When the conditions perfectly suit the',
      'creature, we are able to harvest unique elements.',
    ]);
    messages.push([
      "The nuance is that we don't know these perfect",
      'conditions beforehand.',
    ]);
    messages.push([
      'And it is up to you to figure them out by fine',
      'fine tuning the controls.',
    ]);
    messages.push([
      "Let's try summon the dummy again, but this time",
      'selecting non-default parameters for simulation.',
    ]);
    return messages;
  }

  static dummyDied() {
    const messages: string[][] = [];
    messages.push([
      'Sweet! If the conditions are not perfect',
      'the simulation is considered failed ...',
    ]);
    messages.push([
      '... but we are still able to extract different kinds',
      'of elements in the event of death.',
    ]);
    messages.push([
      "But don't worry, they ... don't actualy die.",
      "It's just a simulation ... ahem ...",
    ]);
    messages.push(['... Well, the onboarding is pretty much done.']);
    messages.push(['You can use new elements to summon new creatues!']);
    messages.push([
      "And don't forget to occasionaly check the",
      'database to track you progress.',
    ]);
    messages.push(['Good luck!']);
    return messages;
  }

  static dummyShouldNotDefault() {
    const messages: string[][] = [];
    messages.push(["This time let's try selecting non-default parameters."]);
    return messages;
  }
}
