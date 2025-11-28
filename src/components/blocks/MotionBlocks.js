import React, { useState } from 'react';
import { useSpriteStore } from '../../store/SpriteStore';
import '../../styles/Blocks.css';

export function MoveStepsBlock() {
  const [steps, setSteps] = useState(10);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'MOVE_STEPS',
      steps: steps
    }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="block motion-block">
      Move
      <input
        type="number"
        value={steps}
        onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
        onClick={(e) => e.stopPropagation()}
      />
      steps
    </div>
  );
}

export function TurnDegreesBlock() {
  const [degrees, setDegrees] = useState(15);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'TURN_DEGREES',
      degrees: degrees
    }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="block motion-block">
      Turn
      <input
        type="number"
        value={degrees}
        onChange={(e) => setDegrees(parseInt(e.target.value) || 0)}
        onClick={(e) => e.stopPropagation()}
      />
      degrees
    </div>
  );
}

export function GoToBlock() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'GO_TO',
      x: x,
      y: y
    }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="block motion-block">
      Go to x:
      <input
        type="number"
        value={x}
        onChange={(e) => setX(parseInt(e.target.value) || 0)}
        onClick={(e) => e.stopPropagation()}
      />
      y:
      <input
        type="number"
        value={y}
        onChange={(e) => setY(parseInt(e.target.value) || 0)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}