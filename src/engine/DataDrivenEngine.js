import { useCallback, useRef } from 'react';
import { useSpriteStore } from '../store/SpriteStore';
import { BLOCK_DEFINITIONS } from '../config/blockDefinitions';
import { EXECUTION_HANDLERS } from './ExecutionHandlers';

export function useDataDrivenEngine() {
  const { state, dispatch } = useSpriteStore();
  const lastCollisionRef = useRef(0);

  const executeBlock = useCallback(async (sprite, animation, dispatchFn = dispatch) => {
    const blockDef = BLOCK_DEFINITIONS[animation.type];
    if (!blockDef) {
      console.warn(`Unknown block type: ${animation.type}`);
      return;
    }

    const handler = EXECUTION_HANDLERS[blockDef.execution.handler];
    if (!handler) {
      console.warn(`No handler found for: ${blockDef.execution.handler}`);
      return;
    }

    // Extract parameters from animation, excluding type
    const { type, ...params } = animation;
    
    return await handler(sprite, params, dispatchFn);
  }, [dispatch]);

  const executeSequence = useCallback(async (spriteId, animations) => {
    const sprite = state.sprites.find(s => s.id === spriteId);
    if (!sprite) return;

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      
      if (animation.type === 'EVENT_FLAG') {
        // Skip EVENT_FLAG blocks during execution
        continue;
      } else if (animation.type === 'REPEAT') {
        // Special handling for repeat blocks
        const handler = EXECUTION_HANDLERS.repeat;
        const { type, ...params } = animation;
        const getCurrentSprite = () => state.sprites.find(s => s.id === spriteId);
        await handler(sprite, params, dispatch, executeBlock, getCurrentSprite);
      } else {
        await executeBlock(sprite, animation);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }, [state.sprites, dispatch, executeBlock]);

  const checkCollisions = useCallback(() => {
    const now = Date.now();
    if (now - lastCollisionRef.current < 500) return;

    const currentSprites = state.sprites;
    for (let i = 0; i < currentSprites.length; i++) {
      for (let j = i + 1; j < currentSprites.length; j++) {
        const a = currentSprites[i];
        const b = currentSprites[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 60) {
          dispatch({
            type: 'SWAP_ANIMATIONS',
            payload: { sprite1Id: a.id, sprite2Id: b.id }
          });
          lastCollisionRef.current = now;
          return;
        }
      }
    }
  }, [state.sprites, dispatch]);

  const runAnimations = useCallback(async () => {
    if (state.isPlaying) return;

    dispatch({ type: 'SET_PLAYING', payload: true });

    try {
      // Only run sprites that have EVENT_FLAG blocks
      const spritesToRun = state.sprites.filter(sprite => 
        sprite.animations.some(anim => anim.type === 'EVENT_FLAG')
      );

      const promises = spritesToRun.map(sprite => 
        executeSequence(sprite.id, sprite.animations)
      );

      // Check collisions periodically during execution
      const collisionInterval = setInterval(checkCollisions, 100);
      
      await Promise.all(promises);
      clearInterval(collisionInterval);
    } finally {
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  }, [state.isPlaying, state.sprites, dispatch, executeSequence, checkCollisions]);

  return { runAnimations, executeBlock, executeSequence };
}