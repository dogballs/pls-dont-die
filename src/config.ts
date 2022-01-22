export const config = {
  IS_DEV: true,

  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 768,

  STORAGE_NAMESPACE: 'plsdontdie',

  CREATURES: {
    // Dummium + modifier
    dummy: {
      type: 'dummy',
      name: 'Dummy',
      description: 'Lab test dummy',
      unknownName: 'Creature #1',
      requiredResourceGroups: [
        [
          { type: 'dummium', amount: 1 },
          { type: 'techium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'dummium', amount: 1 },
        { type: 'techium', amount: 1 },
        { type: 'liquium', amount: 1 },
        { type: 'sandium', amount: 1 },
      ],
    },
    dummyfish: {
      type: 'dummyfish',
      name: 'Dummyfish',
      description: 'Jealous ocean waste',
      unknownName: 'Creature #2',
      requiredResourceGroups: [
        [
          { type: 'dummium', amount: 1 },
          { type: 'liquium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'fishium', amount: 1 },
        { type: 'liquium', amount: 1 },
        { type: 'techium', amount: 1 },
      ],
    },
    scorporate: {
      type: 'scorporate',
      name: 'Scorporate',
      description: 'Toxic manager',
      unknownName: 'Creature #3',
      requiredResourceGroups: [
        [
          { type: 'dummium', amount: 1 },
          { type: 'sandium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'arachium', amount: 1 },
        { type: 'sandium', amount: 1 },
        { type: 'techium', amount: 1 },
      ],
    },
    drone: {
      type: 'drone',
      name: 'Dummycopter',
      description: 'I see you',
      unknownName: 'Creature #4',
      requiredResourceGroups: [
        [
          { type: 'dummium', amount: 1 },
          { type: 'windium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'dummium', amount: 1 },
        { type: 'techium', amount: 1 },
        { type: 'windium', amount: 1 },
      ],
    },
    lighter: {
      type: 'lighter',
      name: "Peter's lighter",
      description: 'From under the table',
      unknownName: 'Creature #5',
      requiredResourceGroups: [
        [
          { type: 'dummium', amount: 1 },
          { type: 'flamium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'dummium', amount: 1 },
        { type: 'techium', amount: 1 },
        { type: 'flamium', amount: 1 },
      ],
    },
    // arachium + modifier
    snake: {
      type: 'snake',
      name: 'Snek',
      description: 'ssssssssssssssssssssssss',
      unknownName: 'Creature #6',
      requiredResourceGroups: [
        [
          { type: 'arachium', amount: 1 },
          { type: 'liquium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'reptilium', amount: 1 },
        { type: 'sandium', amount: 1 },
        { type: 'liquium', amount: 1 },
      ],
    },
    wasp: {
      type: 'wasp',
      name: 'Wasper',
      description: 'Get away from me',
      unknownName: 'Creature #7',
      requiredResourceGroups: [
        [
          { type: 'arachium', amount: 1 },
          { type: 'sandium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'arachium', amount: 1 },
        { type: 'sandium', amount: 1 },
        { type: 'windium', amount: 1 },
      ],
    },
    bat: {
      type: 'bat',
      name: 'Betty',
      description: 'Not that bat',
      unknownName: 'Creature #8',
      requiredResourceGroups: [
        [
          { type: 'arachium', amount: 1 },
          { type: 'windium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'arachium', amount: 1 },
        { type: 'sandium', amount: 1 },
        { type: 'windium', amount: 1 },
      ],
    },
    firebug: {
      type: 'firebug',
      name: 'Firebug',
      description: 'Bug in a fire',
      unknownName: 'Creature #9',
      requiredResourceGroups: [
        [
          { type: 'arachium', amount: 1 },
          { type: 'flamium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'arachium', amount: 1 },
        { type: 'flamium', amount: 1 },
        { type: 'sandium', amount: 1 },
      ],
    },
    // fishium + modifier
    fishy: {
      type: 'fishy',
      name: 'Fishy',
      description: 'Chonky water boy',
      unknownName: 'Creature #10',
      requiredResourceGroups: [
        [
          { type: 'fishium', amount: 1 },
          { type: 'liquium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'fishium', amount: 1 },
        { type: 'liquium', amount: 1 },
      ],
    },
    dragon: {
      type: 'dragon',
      name: 'I am a dragon',
      description: 'Not a wyvern',
      unknownName: 'Creature #11',
      requiredResourceGroups: [
        [
          { type: 'fishium', amount: 1 },
          { type: 'sandium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'reptilium', amount: 1 },
        { type: 'windium', amount: 1 },
        { type: 'flamium', amount: 1 },
      ],
    },
    eaglefish: {
      type: 'eaglefish',
      name: 'Fish & Chicks',
      description: 'Born to fly',
      unknownName: 'Creature #12',
      requiredResourceGroups: [
        [
          { type: 'fishium', amount: 1 },
          { type: 'windium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'fishium', amount: 1 },
        { type: 'liquium', amount: 1 },
        { type: 'windium', amount: 1 },
      ],
    },
    fishsteak: {
      type: 'fishsteak',
      name: 'Fish steak',
      description: 'Everything at stake',
      unknownName: 'Creature #13',
      requiredResourceGroups: [
        [
          { type: 'fishium', amount: 1 },
          { type: 'flamium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'fishium', amount: 1 },
        { type: 'sandium', amount: 1 },
      ],
    },
    // reptilium + modifier
    // TODO

    firesnail: {
      type: 'firesnail',
      name: 'Snail gotta bail',
      description: 'My house is on fire',
      unknownName: 'Creature #14',
      requiredResourceGroups: [
        [
          { type: 'reptilium', amount: 1 },
          { type: 'flamium', amount: 1 },
        ],
      ],
      droppedResources: [
        { type: 'reptilium', amount: 1 },
        { type: 'flamium', amount: 1 },
      ],
    },

    // soulium + modifier
    spirit: {
      type: 'spirit',
      name: 'Spirit',
      description: 'Tormented soul',
      unknownName: 'Creature X',
      requiredResourceGroups: [
        [
          { type: 'fishium', amount: 1 },
          { type: 'techium', amount: 1 },
        ],
        [
          { type: 'arachium', amount: 1 },
          { type: 'techium', amount: 1 },
        ],
        // [
        //   { type: 'reptilium', amount: 1 },
        //   { type: 'techium', amount: 1 },
        // ],
        [
          { type: 'soulium', amount: 1 },
          { type: 'techium', amount: 1 },
        ],
        [
          { type: 'soulium', amount: 1 },
          { type: 'liquium', amount: 1 },
        ],
        [
          { type: 'soulium', amount: 1 },
          { type: 'sandium', amount: 1 },
        ],
        [
          { type: 'soulium', amount: 1 },
          { type: 'windium', amount: 1 },
        ],
        [
          { type: 'soulium', amount: 1 },
          { type: 'flamium', amount: 1 },
        ],
      ],
      droppedResources: [{ type: 'soulium', amount: 1 }],
    },
  },
  DEATH_REASONS: {
    dehydration: 'Dehydration (not enough water)',
    overheat: 'Overheat (too hot)',
    hypothermia: 'Hypothermia (too cold)',
    short_circuit: 'Short circuit (water in the system)',
    stuck_mech: 'Mechanisms stuck (sand in the system)',
    drowning: 'Drowning (can not exist in water)',
    drought: 'Drought (too dry)',
    discomfort: 'Discomfort (out of comfort zone)',
    gravity: 'Gravity (fell down)',
    boredom: 'Boredom (Nothing to do)',
    thirst: 'Thirst (Would like a drink)',
    curse: 'Curse (must be freed)',
    confusion: 'Confusion (where am I)',
    viceversa: 'Vice versa (the other way around)',
    why: 'Why? (Who does that?)',
    burned: 'Burned down (Put out the fire, fast!)',
    ramsay: 'This fish is so raw (You donkey)',
  },
};
