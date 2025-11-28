// Execution handlers for different block types
export const EXECUTION_HANDLERS = {
  // Motion handlers
  moveSteps: async (sprite, params, dispatch) => {
    const radians = (sprite.rotation * Math.PI) / 180;
    const newX = sprite.x + params.steps * Math.cos(radians);
    const newY = sprite.y + params.steps * Math.sin(radians);
    
    dispatch({
      type: 'UPDATE_SPRITE',
      payload: { id: sprite.id, updates: { x: newX, y: newY } }
    });
  },

  turnDegrees: async (sprite, params, dispatch) => {
    dispatch({
      type: 'UPDATE_SPRITE', 
      payload: { id: sprite.id, updates: { rotation: sprite.rotation + params.degrees } }
    });
  },

  goTo: async (sprite, params, dispatch) => {
    dispatch({
      type: 'UPDATE_SPRITE',
      payload: { id: sprite.id, updates: { x: params.x, y: params.y } }
    });
  },

  // Display handlers
  say: async (sprite, params, dispatch) => {
    dispatch({
      type: 'UPDATE_SPRITE',
      payload: { id: sprite.id, updates: { speechBubble: params.text } }
    });
    
    await new Promise(resolve => setTimeout(resolve, params.duration * 1000));
    
    dispatch({
      type: 'UPDATE_SPRITE', 
      payload: { id: sprite.id, updates: { speechBubble: null } }
    });
  },

  think: async (sprite, params, dispatch) => {
    dispatch({
      type: 'UPDATE_SPRITE',
      payload: { id: sprite.id, updates: { thoughtBubble: params.text } }
    });
    
    await new Promise(resolve => setTimeout(resolve, params.duration * 1000));
    
    dispatch({
      type: 'UPDATE_SPRITE',
      payload: { id: sprite.id, updates: { thoughtBubble: null } }
    });
  },

  // Control handlers
  repeat: async (sprite, params, dispatch, executeBlock, animationList, currentIndex) => {
    const blocksToRepeat = animationList.slice(0, currentIndex).filter(a => a.type !== 'REPEAT');
    
    for (let i = 0; i < params.times; i++) {
      for (const block of blocksToRepeat) {
        await executeBlock(sprite, block, dispatch);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
  },

  wait: async (sprite, params, dispatch) => {
    await new Promise(resolve => setTimeout(resolve, params.seconds * 1000));
  }
};