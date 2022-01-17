export const config = {
  IS_DEV: false,

  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 768,

  STORAGE_NAMESPACE: 'plsdontdie',

  CREATURES: {
    dummy: {
      type: 'dummy',
      name: 'Dummy',
      description: 'Lab test dummy',
      unknownName: 'Dummy',
      requiredResources: [],
      droppedResources: [{ type: 'dummium' }, { type: 'soulium' }],
    },
    fish: {
      type: 'fish',
      name: 'Fish',
      description: 'Regular chonky fish',
      unknownName: 'New creature 1',
      requiredResources: [
        {
          type: 'dummium',
        },
        {
          type: 'soulium',
        },
      ],
      droppedResources: [{ type: 'fishium' }, { type: 'soulium' }],
    },
  },
  DEATH_REASONS: {
    dummy_not_neutral: 'Non-neutral condtions',
    dehydration: 'Dehydration (not enough water)',
    hypothermia: 'Hypothermia (too cold)',
  },
};
