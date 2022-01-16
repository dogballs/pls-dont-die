export class DoctorLines {
  static dummySummonToLive() {
    const messages: string[][] = [];
    messages.push(['Here is the device assigned to you.']);
    messages.push(["Let's try it out on a dummy first. Go on and summon it!"]);
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
    messages.push([
      '... Well, the onboarding is pretty much done.',
      'You now have access to new creatures.',
    ]);
    messages.push(['Good luck with your simluations!']);
    return messages;
  }

  static dummyShouldNotDefault() {
    const messages: string[][] = [];
    messages.push(["This time let's try selecting non-default parameters."]);
    return messages;
  }
}
