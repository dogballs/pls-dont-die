export const config = {
  IS_DEV: true,

  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 768,

  STORAGE_NAMESPACE: 'plsdontdie',

  CREATURES: {
    dummy: {
      type: 'dummy',
      name: 'Dummy',
      description: 'Lab test dummy',
      unknownName: 'Creature #0',
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
      unknownName: 'Creature #1',
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
      unknownName: 'Creature #2',
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
    fishy: {
      type: 'fishy',
      name: 'Fishy',
      description: 'Chonky water boy',
      unknownName: 'Creature #3',
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
    wasp: {
      type: 'wasp',
      name: 'Wasper',
      description: 'Get away from me',
      unknownName: 'Creature #4',
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
    drone: {
      type: 'drone',
      name: 'Dummycopter',
      description: 'I see you',
      unknownName: 'Creature #5',
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
    bat: {
      type: 'bat',
      name: 'Betty',
      description: 'Not that bat',
      unknownName: 'Creature #6',
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
    eaglefish: {
      type: 'eaglefish',
      name: 'Fish & Chicks',
      description: 'Born to fly',
      unknownName: 'Creature #7',
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
    dragon: {
      type: 'dragon',
      name: 'I am a dragon',
      description: 'Not a wyvern',
      unknownName: 'Creature #8',
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
    fishsteak: {
      type: 'fishsteak',
      name: 'Fish steak',
      description: 'Everything at stake',
      unknownName: 'Creature #9',
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
    lighter: {
      type: 'lighter',
      name: "Peter's lighter",
      description: 'From under the table',
      unknownName: 'Creature #10',
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
    firebug: {
      type: 'firebug',
      name: 'Firebug',
      description: 'Bug in a fire',
      unknownName: 'Creature #11',
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
    ramsay: 'This fish is so raw (You donkey)',
  },
};
