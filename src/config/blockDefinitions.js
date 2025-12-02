// Data-driven block configuration
export const BLOCK_CATEGORIES = {
  EVENTS: 'events',
  MOTION: 'motion', 
  LOOKS: 'looks',
  CONTROL: 'control'
};

export const BLOCK_DEFINITIONS = {
  // Events
  EVENT_FLAG: {
    id: 'EVENT_FLAG',
    category: BLOCK_CATEGORIES.EVENTS,
    label: 'When {icon:flag} clicked',
    color: '#ffab19',
    inputs: [],
    execution: { type: 'trigger', event: 'flag_click' }
  },

  // Motion blocks
  MOVE_STEPS: {
    id: 'MOVE_STEPS',
    category: BLOCK_CATEGORIES.MOTION,
    label: 'Move {input:steps} steps',
    color: '#4c97ff',
    inputs: [
      { name: 'steps', type: 'number', default: 10, min: -999, max: 999 }
    ],
    execution: {
      type: 'transform',
      handler: 'moveSteps'
    }
  },

  TURN_DEGREES: {
    id: 'TURN_DEGREES', 
    category: BLOCK_CATEGORIES.MOTION,
    label: 'Turn {input:degrees} degrees',
    color: '#4c97ff',
    inputs: [
      { name: 'degrees', type: 'number', default: 15, min: -360, max: 360 }
    ],
    execution: {
      type: 'transform',
      handler: 'turnDegrees'
    }
  },

  GO_TO: {
    id: 'GO_TO',
    category: BLOCK_CATEGORIES.MOTION, 
    label: 'Go to x: {input:x} y: {input:y}',
    color: '#4c97ff',
    inputs: [
      { name: 'x', type: 'number', default: 0, min: -240, max: 240 },
      { name: 'y', type: 'number', default: 0, min: -180, max: 180 }
    ],
    execution: {
      type: 'transform',
      handler: 'goTo'
    }
  },

  // Looks blocks
  SAY: {
    id: 'SAY',
    category: BLOCK_CATEGORIES.LOOKS,
    label: 'Say {input:text} for {input:duration} seconds',
    color: '#9966ff',
    inputs: [
      { name: 'text', type: 'text', default: 'Hello!' },
      { name: 'duration', type: 'number', default: 2, min: 0.1, max: 10 }
    ],
    execution: {
      type: 'display',
      handler: 'say'
    }
  },

  THINK: {
    id: 'THINK',
    category: BLOCK_CATEGORIES.LOOKS,
    label: 'Think {input:text} for {input:duration} seconds', 
    color: '#9966ff',
    inputs: [
      { name: 'text', type: 'text', default: 'Hmm...' },
      { name: 'duration', type: 'number', default: 2, min: 0.1, max: 10 }
    ],
    execution: {
      type: 'display', 
      handler: 'think'
    }
  },

  // Control blocks
  REPEAT: {
    id: 'REPEAT',
    category: BLOCK_CATEGORIES.CONTROL,
    label: 'Repeat {input:times} times',
    color: '#ffab19',
    inputs: [
      { name: 'times', type: 'number', default: 10, min: 1, max: 999 }
    ],
    execution: {
      type: 'control',
      handler: 'repeat'
    },
    isContainer: true,
    children: []
  },

  WAIT: {
    id: 'WAIT',
    category: BLOCK_CATEGORIES.CONTROL,
    label: 'Wait {input:seconds} seconds',
    color: '#ffab19',
    inputs: [
      { name: 'seconds', type: 'number', default: 1, min: 0.1, max: 10 }
    ],
    execution: {
      type: 'control',
      handler: 'wait'
    }
  }
};

// Group blocks by category for sidebar rendering
export const BLOCKS_BY_CATEGORY = Object.values(BLOCK_DEFINITIONS).reduce((acc, block) => {
  if (!acc[block.category]) acc[block.category] = [];
  acc[block.category].push(block);
  return acc;
}, {});

// Helper to create repeat block with children
export const createRepeatBlock = (times, children = []) => ({
  type: 'REPEAT',
  times,
  children
});