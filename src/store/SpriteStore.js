import React, { createContext, useContext, useReducer } from 'react';

const SpriteContext = createContext();

const initialState = {
  sprites: [
    {
      id: 'sprite1',
      name: 'Cat',
      x: 0,
      y: 0,
      rotation: 0,
      animations: [],
      speechBubble: null,
      thoughtBubble: null
    }
  ],
  selectedSpriteId: 'sprite1',
  isPlaying: false
};

function spriteReducer(state, action) {
  switch (action.type) {
    case 'ADD_SPRITE':
      const newSprite = {
        id: `sprite${Date.now()}`,
        name: `Sprite ${state.sprites.length + 1}`,
        x: Math.random() * 200 + 30,
        y: Math.random() * 200 + 30,
        rotation: 0,
        animations: [],
        speechBubble: null,
        thoughtBubble: null
      };
      return {
        ...state,
        sprites: [...state.sprites, newSprite],
        selectedSpriteId: newSprite.id
      };

    case 'SELECT_SPRITE':
      return { ...state, selectedSpriteId: action.payload };

    case 'UPDATE_SPRITE':
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.id
            ? { ...sprite, ...action.payload.updates }
            : sprite
        )
      };

    case 'ADD_ANIMATION':
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === state.selectedSpriteId
            ? { ...sprite, animations: [...sprite.animations, action.payload] }
            : sprite
        )
      };

    case 'SET_ANIMATIONS':
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.spriteId
            ? { ...sprite, animations: action.payload.animations }
            : sprite
        )
      };

    case 'SWAP_ANIMATIONS':
      const { sprite1Id, sprite2Id } = action.payload;
      const sprite1 = state.sprites.find(s => s.id === sprite1Id);
      const sprite2 = state.sprites.find(s => s.id === sprite2Id);
      
      if (!sprite1 || !sprite2) return state;
      
      const sprite1Animations = [...sprite1.animations];
      const sprite2Animations = [...sprite2.animations];
      
      return {
        ...state,
        sprites: state.sprites.map(sprite => {
          if (sprite.id === sprite1Id) {
            return { ...sprite, animations: sprite2Animations };
          }
          if (sprite.id === sprite2Id) {
            return { ...sprite, animations: sprite1Animations };
          }
          return sprite;
        })
      };

    case 'DELETE_SPRITE':
      const remainingSprites = state.sprites.filter(sprite => sprite.id !== action.payload);
      const newSelectedId = remainingSprites.length > 0 
        ? (state.selectedSpriteId === action.payload ? remainingSprites[0].id : state.selectedSpriteId)
        : null;
      return {
        ...state,
        sprites: remainingSprites,
        selectedSpriteId: newSelectedId
      };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    default:
      return state;
  }
}

export function SpriteProvider({ children }) {
  const [state, dispatch] = useReducer(spriteReducer, initialState);

  return (
    <SpriteContext.Provider value={{ state, dispatch }}>
      {children}
    </SpriteContext.Provider>
  );
}

export function useSpriteStore() {
  const context = useContext(SpriteContext);
  if (!context) {
    throw new Error('useSpriteStore must be used within SpriteProvider');
  }
  return context;
}