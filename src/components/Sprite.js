import React from 'react';
import CatSprite from './CatSprite';

export default function Sprite({ sprite }) {

  return (
    <div
      className="relative transition-all duration-200"
      style={{
        transform: `rotate(${sprite.rotation}deg)`,
        transformOrigin: 'center',
        pointerEvents: 'none'
      }}
    >
      <div className="relative">
        <CatSprite />
        
        {sprite.speechBubble && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-lg px-2 py-1 text-sm whitespace-nowrap">
            {sprite.speechBubble}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}
        
        {sprite.thoughtBubble && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-100 border-2 border-gray-300 rounded-full px-2 py-1 text-sm whitespace-nowrap">
            {sprite.thoughtBubble}
            <div className="absolute top-full left-1/4 w-2 h-2 bg-gray-100 border border-gray-300 rounded-full"></div>
            <div className="absolute top-full left-1/3 mt-1 w-1 h-1 bg-gray-100 border border-gray-300 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}