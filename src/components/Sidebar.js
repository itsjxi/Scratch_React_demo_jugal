import React from 'react';
import { BLOCKS_BY_CATEGORY, BLOCK_CATEGORIES } from '../config/blockDefinitions';
import GenericBlock from './GenericBlock';

export default function Sidebar() {
  const handleDragStart = (e, blockData) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(blockData));
  };

  const categoryLabels = {
    [BLOCK_CATEGORIES.EVENTS]: 'Events',
    [BLOCK_CATEGORIES.MOTION]: 'Motion', 
    [BLOCK_CATEGORIES.LOOKS]: 'Looks',
    [BLOCK_CATEGORIES.CONTROL]: 'Control'
  };

  return (
    <div className="sidebar">
      {Object.entries(BLOCKS_BY_CATEGORY).map(([category, blocks]) => (
        <div key={category}>
          <h3>{categoryLabels[category]}</h3>
          {blocks.map(blockDef => (
            <GenericBlock
              key={blockDef.id}
              definition={blockDef}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
