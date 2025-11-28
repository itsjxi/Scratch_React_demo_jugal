import React from "react";
import Icon from "./Icon";
import { MoveStepsBlock, TurnDegreesBlock, GoToBlock } from "./blocks/MotionBlocks";
import { SayBlock, ThinkBlock } from "./blocks/LooksBlocks";
import { RepeatBlock } from "./blocks/ControlBlocks";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Events</h3>
      <div 
        className="block event-block" 
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'EVENT_FLAG'
          }));
        }}
        style={{cursor: 'grab'}}
      >
        <span>When</span>
        <Icon name="flag" size={15} className="text-green-600" />
        <span>clicked</span>
      </div>
      
      <h3>Motion</h3>
      <MoveStepsBlock />
      <TurnDegreesBlock />
      <GoToBlock />
      
      <h3>Looks</h3>
      <SayBlock />
      <ThinkBlock />
      
      <h3>Control</h3>
      <RepeatBlock />
    </div>
  );
}
