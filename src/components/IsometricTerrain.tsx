import React, { useState, useEffect, useRef, useCallback } from "react";
import cubeGrass from "../images/cube-grass.png";
import cubeDirt from "../images/cube-dirt.png";

const GRID_SIZE = 128;
const INITIAL_TILE_SIZE = 64;
const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 720;

interface Camera {
  x: number;
  y: number;
}

interface Tile {
  x: number;
  y: number;
  terrain: string;
  height: number;
}

const IsometricTerrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [tileSize, setTileSize] = useState<number>(INITIAL_TILE_SIZE);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const imageRefs = useRef<Record<string, HTMLImageElement>>({
    grass: new Image(),
    dirt: new Image(),
    rocky: new Image(),
    water: new Image(),
  });

  const imageRef = useRef<HTMLImageElement>(new Image());

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    tiles.forEach((tile) => {
      const isoX = ((tile.x - tile.y) * tileSize) / 2;
      const isoY = ((tile.x + tile.y) * tileSize) / 7 - tile.height;
      const drawX = WINDOW_WIDTH / 2 + isoX - camera.x * tileSize;
      const drawY = isoY - camera.y * tileSize;

      if (imageRef.current.complete) {
        // Draw each block
        ctx.drawImage(imageRef.current, drawX, drawY, tileSize, tileSize / 2);
      }
    });
  }, [tileSize, camera]);

  useEffect(() => {
    imageRef.current.src = cubeGrass; // Set the image source
    imageRef.current.onload = () => drawGrid(); // Redraw the grid once the image is loaded
  }, [drawGrid]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  useEffect(() => {
    const newTiles: Tile[] = [];
    const terrains = ["grass", "dirt", "rocky", "water"];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        newTiles.push({
          x: x,
          y: y,
          terrain: terrains[Math.floor(Math.random() * terrains.length)],
          height: Math.floor(Math.random() * 10),
        });
      }
    }
    setTiles(newTiles);

    // Initialize image sources
    imageRefs.current.grass.src = cubeGrass;
    imageRefs.current.dirt.src = cubeDirt;
  }, []);

  return (
    <div tabIndex={0} onKeyDown={handleKeyPress} style={{ outline: "none" }}>
      <canvas id="grid-canvas" ref={canvasRef} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} />
    </div>
  );

  function handleKeyPress(e: React.KeyboardEvent): void {
    switch (e.key) {
      case "ArrowUp":
        setCamera((old: Camera) => ({ ...old, y: old.y - 1 }));
        break;
      case "ArrowDown":
        setCamera((old: Camera) => ({ ...old, y: old.y + 1 }));
        break;
      case "ArrowLeft":
        setCamera((old: Camera) => ({ ...old, x: old.x - 1 }));
        break;
      case "ArrowRight":
        setCamera((old: Camera) => ({ ...old, x: old.x + 1 }));
        break;
      case "=":
        handleZoom(1);
        break;
      case "-":
        handleZoom(-1);
        break;
    }
  }

  function handleZoom(inOrOut: number): void {
    setTileSize((oldSize) => oldSize + inOrOut * 16);
  }
};

export default IsometricTerrain;
