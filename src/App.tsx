import React from "react";
import IsometricTerrain from "./components/IsometricTerrain";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Isometric Terrain Viewer</h1>
      <IsometricTerrain />
    </div>
  );
};

export default App;
