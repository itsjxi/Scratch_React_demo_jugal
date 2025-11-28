import React, { useState } from 'react';
import '../../styles/Blocks.css';

export function SayBlock() {
  const [text, setText] = useState('Hello!');
  const [duration, setDuration] = useState(2);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'SAY',
      text: text,
      duration: duration
    }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="block looks-block">
      Say
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      for
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
        onClick={(e) => e.stopPropagation()}
      />
      seconds
    </div>
  );
}

export function ThinkBlock() {
  const [text, setText] = useState('Hmm...');
  const [duration, setDuration] = useState(2);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'THINK',
      text: text,
      duration: duration
    }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="block looks-block">
      Think
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      for
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
        onClick={(e) => e.stopPropagation()}
      />
      seconds
    </div>
  );
}