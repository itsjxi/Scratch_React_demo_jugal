import React, { useState } from 'react';
import Icon from './Icon';

// Generic block component that renders any block based on definition
export default function GenericBlock({ definition, onDragStart }) {
  const [inputValues, setInputValues] = useState(
    definition.inputs.reduce((acc, input) => {
      acc[input.name] = input.default;
      return acc;
    }, {})
  );

  const handleInputChange = (inputName, value) => {
    setInputValues(prev => ({ ...prev, [inputName]: value }));
  };

  const handleDragStart = (e) => {
    const blockData = {
      type: definition.id,
      ...inputValues
    };
    onDragStart?.(e, blockData);
  };

  const renderLabel = () => {
    return definition.label.split(/(\{[^}]+\})/).map((part, index) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const content = part.slice(1, -1);
        
        if (content.startsWith('icon:')) {
          const iconName = content.replace('icon:', '');
          return <Icon key={index} name={iconName} size={15} className="text-green-600" />;
        }
        
        if (content.startsWith('input:')) {
          const inputName = content.replace('input:', '');
          const inputDef = definition.inputs.find(i => i.name === inputName);
          
          if (!inputDef) return part;
          
          return (
            <input
              key={index}
              type={inputDef.type === 'text' ? 'text' : 'number'}
              value={inputValues[inputName]}
              onChange={(e) => handleInputChange(inputName, 
                inputDef.type === 'number' ? parseInt(e.target.value) || inputDef.default : e.target.value
              )}
              onClick={(e) => e.stopPropagation()}
              min={inputDef.min}
              max={inputDef.max}
              style={{ 
                width: inputDef.type === 'text' ? '80px' : '50px',
                margin: '0 4px',
                padding: '2px 4px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                backgroundColor: 'white',
                color: 'black',
                fontSize: '12px'
              }}
            />
          );
        }
      }
      return part;
    });
  };

  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="block"
      style={{
        backgroundColor: definition.color,
        color: 'white',
        padding: '8px 12px',
        margin: '4px 0',
        borderRadius: '6px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      {renderLabel()}
    </div>
  );
}