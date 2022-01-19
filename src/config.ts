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
      requiredResources: [
        { type: 'dummium', amount: 1 },
        { type: 'techium', amount: 1 },
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
      requiredResources: [
        { type: 'dummium', amount: 1 },
        { type: 'liquium', amount: 1 },
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
      requiredResources: [
        { type: 'dummium', amount: 1 },
        { type: 'sandium', amount: 1 },
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
      requiredResources: [
        {
          type: 'fishium',
          amount: 1,
        },
        {
          type: 'liquium',
          amount: 1,
        },
      ],
      droppedResources: [
        { type: 'fishium', amount: 1 },
        { type: 'liquium', amount: 1 },
      ],
    },
  },
  DEATH_REASONS: {
    dehydration: 'Dehydration (not enough water)',
    overheat: 'Overheat (too hot)',
    hypothermia: 'Hypothermia (too cold)',
    short_circuit: 'Short circuit (water in the system)',
    stuck_mech: 'Mechanisms stuck (sand in the system)',
    drowning: 'Drowning (can not exist in water)',
    discomfort: 'Discomfort (out of comfort zone)',
  },
};
