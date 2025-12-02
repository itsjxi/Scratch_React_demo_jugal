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
    
    return { ...sprite, x: newX, y: newY };
  },

  turnDegrees: async (sprite, params, dispatch) => {
    const newRotation = sprite.rotation + params.degrees;
    dispatch({
      type: 'UPDATE_SPRITE', 
      payload: { id: sprite.id, updates: { rotation: newRotation } }
    });
    return { ...sprite, rotation: newRotation };
  },

  goTo: async (sprite, params, dispatch) => {
    dispatch({
      type: 'UPDATE_SPRITE',
      payload: { id: sprite.id, updates: { x: params.x, y: params.y } }
    });
    
    return { ...sprite, x: params.x, y: params.y };
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
  repeat: async (sprite, params, dispatch, executeBlock, getCurrentSprite) => {
    const times = params.times || 1;
    const children = params.children || [];
    
    if (children.length === 0) return;
    
    let currentSprite = sprite;
    
    for (let i = 0; i < times; i++) {
      for (const block of children) {
        const result = await executeBlock(currentSprite, block, dispatch);
        // Use returned sprite data if available, otherwise get fresh data
        currentSprite = result || (getCurrentSprite ? getCurrentSprite() : currentSprite);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
  },

  wait: async (sprite, params, dispatch) => {
    await new Promise(resolve => setTimeout(resolve, params.seconds * 1000));
  }
};