import React, { useState } from 'react';
import '../../styles/Blocks.css';

export function RepeatBlock() {
  const [times, setTimes] = useState(10);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'REPEAT',
      times: times
    }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="block control-block">
      Repeat
      <input
        type="number"
        value={times}
        onChange={(e) => setTimes(parseInt(e.target.value) || 1)}
        onClick={(e) => e.stopPropagation()}
      />
      times
    </div>
  );
}