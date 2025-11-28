import React from "react";
import { useSpriteStore } from "../store/SpriteStore";
import { useAnimationEngine } from "./AnimationEngine";
import Sprite from "./Sprite";
import Icon from "./Icon";

export default function PreviewArea() {
  const { state, dispatch } = useSpriteStore();
  const { runAnimations } = useAnimationEngine();

  const handlePlay = () => {
    runAnimations();
  };

  return (
    <div className="preview-area">
      <div className="preview-controls">
        <button
          onClick={handlePlay}
          disabled={state.isPlaying}
          className="btn btn-success"
          style={{width: '60px', height: '60px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}
        >
          <Icon name="flag" size={24} className="text-white" />
        </button>
      </div>
      
      <div className="preview-stage"
        onDrop={(e) => {
          e.preventDefault()
        
          const spriteId = e.dataTransfer.getData("spriteId")
          if (!spriteId) return
        
          const offsetX = parseFloat(e.dataTransfer.getData("offsetX"))
          const offsetY = parseFloat(e.dataTransfer.getData("offsetY"))
        
          const rect = e.currentTarget.getBoundingClientRect()
        
          const x = e.clientX - rect.left - offsetX
          const y = e.clientY - rect.top - offsetY
        
          dispatch({
            type: "UPDATE_SPRITE",
            payload: { id: spriteId, updates: { x, y } }
          })
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
      >
        {state.sprites.map(sprite => (
          <div
            key={sprite.id}
            draggable
            style={{
              position: 'absolute',
              left: sprite.x,
              top: sprite.y,
              cursor: 'grab',
              userSelect: 'none'
            }}
            onDragStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const offsetX = e.clientX - rect.left
              const offsetY = e.clientY - rect.top
            
              e.dataTransfer.setData("spriteId", sprite.id)
              e.dataTransfer.setData("offsetX", offsetX)
              e.dataTransfer.setData("offsetY", offsetY)
            
              const dragImage = document.createElement("div")
              dragImage.innerHTML = e.currentTarget.querySelector("svg").outerHTML
              dragImage.style.position = "absolute"
              dragImage.style.top = "-1000px"
              document.body.appendChild(dragImage)
              e.dataTransfer.setDragImage(dragImage, offsetX, offsetY)
            
              setTimeout(() => document.body.removeChild(dragImage), 0)
            }}
          >
            <Sprite sprite={sprite} />
          </div>
        ))}
      </div>
    </div>
  );
}