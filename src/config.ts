export const config = {
  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 768,

  STORAGE_NAMESPACE: 'plsdontdie',

  CREATURES: {
    dummy: {
      type: 'dummy',
      name: 'Dummy',
      unknownName: 'Dummy',
      requiredResources: [],
    },
    fish: {
      type: 'fish',
      name: 'Fish',
      unknownName: 'Unknown 1',
      requiredResources: [
        {
          type: 'soulium',
          amount: 1,
        },
        {
          type: 'dummium',
          amount: 1,
        },
      ],
    },
  },
  DEATH_REASONS: {
    dummy_not_neutral: 'Outside of neutral condtions',
    dehydration: 'Dehydration',
    hypothermia: 'Hypothermia',
  },
};
