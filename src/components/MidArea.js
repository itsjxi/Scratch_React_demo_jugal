import React from "react";
import { useSpriteStore } from "../store/SpriteStore";
import { BLOCK_DEFINITIONS } from "../config/blockDefinitions";

const getAnimationLabel = (animation) => {
  const blockDef = BLOCK_DEFINITIONS[animation.type];
  if (!blockDef) return `Unknown: ${animation.type}`;
  
  let label = blockDef.label;
  
  // Replace input placeholders with actual values
  blockDef.inputs.forEach(input => {
    const placeholder = `{input:${input.name}}`;
    const value = animation[input.name];
    label = label.replace(placeholder, value);
  });
  
  // Remove icon placeholders for display
  label = label.replace(/{icon:[^}]+}/g, '🏁');
  
  return label;
};

export default function MidArea() {
  const { state, dispatch } = useSpriteStore();
  const selectedSprite = state.sprites.find(s => s.id === state.selectedSpriteId);

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const animationData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      // If dragging from existing animation (has sourceIndex), remove original
      if (animationData.sourceIndex !== undefined) {
        const newAnimations = selectedSprite.animations.filter((_, i) => i !== animationData.sourceIndex);
        const { sourceIndex, ...cleanAnimation } = animationData;
        
        dispatch({
          type: 'SET_ANIMATIONS',
          payload: {
            spriteId: state.selectedSpriteId,
            animations: [...newAnimations, cleanAnimation]
          }
        });
      } else {
        // New block from sidebar
        dispatch({
          type: 'ADD_ANIMATION',
          payload: animationData
        });
      }
    } catch (error) {
      console.error('Invalid animation data');
    }
  };

  const clearAnimations = () => {
    dispatch({
      type: 'SET_ANIMATIONS',
      payload: {
        spriteId: state.selectedSpriteId,
        animations: []
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addSprite = () => {
    dispatch({ type: 'ADD_SPRITE' });
  };

  const selectSprite = (spriteId) => {
    dispatch({ type: 'SELECT_SPRITE', payload: spriteId });
  };

  const deleteSprite = (spriteId) => {
    if (state.sprites.length > 1) {
      dispatch({ type: 'DELETE_SPRITE', payload: spriteId });
    }
  };

  return (
    <div className="mid-area" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
        <h2>Animation Sequence for {selectedSprite?.name}</h2>
        <button onClick={addSprite} className="btn btn-primary">
          + Add Sprite
        </button>
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <h3>Sprites:</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
          {state.sprites.map(sprite => (
            <div
              key={sprite.id}
              className={`sprite-item ${
                sprite.id === state.selectedSpriteId ? 'selected' : ''
              }`}
              style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}
            >
              <span onClick={() => selectSprite(sprite.id)}>{sprite.name}</span>
              {state.sprites.length > 1 && (
                <button
                  onClick={() => deleteSprite(sprite.id)}
                  style={{background: 'hsla(260, 60%, 60%, 1)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '12px', cursor: 'pointer'}}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <p>Animations: {selectedSprite?.animations.length || 0}</p>
      
      <div style={{background: 'white', border: '2px dashed #d1d5db', borderRadius: '8px', padding: '16px', minHeight: '128px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <span>Animation Blocks</span>
          {selectedSprite?.animations.length > 0 && (
            <button onClick={clearAnimations} style={{background: 'hsla(260, 60%, 60%, 1)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', padding: '6px 12px', cursor: 'pointer'}}>
              Delete All
            </button>
          )}
        </div>
        {selectedSprite?.animations.length === 0 ? (
          <p style={{color: '#6b7280', textAlign: 'center'}}>Drag blocks here to create animations</p>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {selectedSprite.animations.map((animation, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({
                    ...animation,
                    sourceIndex: index
                  }));
                }}
                style={{background: '#dbeafe', padding: '8px', borderRadius: '6px', border: '1px solid #93c5fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab'}}
              >
                <div style={{flex: 1}}>
                  {getAnimationLabel(animation)}
                </div>
                <button
                  onClick={() => {
                    const newAnimations = selectedSprite.animations.filter((_, i) => i !== index);
                    dispatch({
                      type: 'SET_ANIMATIONS',
                      payload: {
                        spriteId: state.selectedSpriteId,
                        animations: newAnimations
                      }
                    });
                  }}
                  style={{background: 'hsla(260, 60%, 60%, 1)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer'}}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}