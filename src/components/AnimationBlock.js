import React from 'react';
import { BLOCK_DEFINITIONS } from '../config/blockDefinitions';

const getAnimationLabel = (animation) => {
  const blockDef = BLOCK_DEFINITIONS[animation.type];
  if (!blockDef) return `Unknown: ${animation.type}`;
  
  let label = blockDef.label;
  
  blockDef.inputs.forEach(input => {
    const placeholder = `{input:${input.name}}`;
    const value = animation[input.name];
    label = label.replace(placeholder, value);
  });
  
  label = label.replace(/{icon:[^}]+}/g, '🏁');
  
  return label;
};

export default function AnimationBlock({ 
  animation, 
  index, 
  onDelete, 
  onDragStart, 
  isNested = false,
  children 
}) {
  const baseStyle = {
    background: animation.type === 'REPEAT' ? '#fef3c7' : '#dbeafe',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #93c5fd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    cursor: 'grab',
    margin: isNested ? '4px 0' : '0'
  };

  return (
    <div 
      draggable={!isNested}
      onDragStart={onDragStart}
      style={baseStyle}
    >
      <div style={{flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {getAnimationLabel(animation)}
        </div>
        {children}
      </div>
      <button
        onClick={onDelete}
        style={{
          background: 'hsla(260, 60%, 60%, 1)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        ×
      </button>
    </div>
  );
}