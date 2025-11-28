import React from "react";
import { SpriteProvider } from "./store/SpriteStore";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import "./styles/Layout.css";

export default function App() {
  return (
    <SpriteProvider>
      <div className="app-container">
        <Sidebar />
        <MidArea />
        <PreviewArea />
      </div>
    </SpriteProvider>
  );
}
