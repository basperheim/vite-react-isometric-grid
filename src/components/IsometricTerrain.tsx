import React, { useState, useEffect, useRef, useCallback } from "react";
import cubeGrass from "../images/cube-grass.png";
import cubeDirt from "../images/cube-dirt.png";
import cubeRocky from "../images/cube-rocky.png";
import cubeWater from "../images/cube-water1.png";
import "./IsometricTerrain.css";

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
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  const imageRefs = useRef<Record<string, HTMLImageElement>>({
    grass: new Image(),
    dirt: new Image(),
    rocky: new Image(),
    water: new Image(),
  });

  useEffect(() => {
    imageRefs.current.grass.src = cubeGrass;
    imageRefs.current.dirt.src = cubeDirt;
    imageRefs.current.rocky.src = cubeRocky;
    imageRefs.current.water.src = cubeWater;
  }, []);

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

      const img = imageRefs.current[tile.terrain];
      if (img && img.complete) {
        ctx.save();

        // Apply bobbing effect
        if (selectedTile?.x === tile.x && selectedTile?.y === tile.y) {
          const bobbingOffset = Math.sin(Date.now() / 500) * 5;
          ctx.translate(drawX + tileSize / 2, drawY + tileSize / 2 + bobbingOffset);
          ctx.translate(-tileSize / 2, -tileSize / 2);
        } else {
          ctx.translate(drawX, drawY);
        }

        ctx.drawImage(img, 0, 0, tileSize, tileSize / 2);
        ctx.restore();
      }
    });
  }, [tileSize, camera, tiles, selectedTile]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = WINDOW_WIDTH;
      canvas.height = WINDOW_HEIGHT;
    }
  }, []);

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
  }, []);

  // Handle mouse move to detect tile under the cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert screen coordinates to tile coordinates
    const tileX = Math.floor(((x - WINDOW_WIDTH / 2) / tileSize + camera.x) / 2 + (y + camera.y * tileSize) / (tileSize / 2));
    const tileY = Math.floor(((y + WINDOW_HEIGHT + camera.y * tileSize) / (tileSize / 2) - tileX) / 2 + camera.x);
    console.log(tileX, tileY);

    // Find the tile under the cursor
    const tile = tiles.find((t) => t.x === tileX && t.y === tileY);
    setSelectedTile(tile || null);
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyPress} onMouseMove={handleMouseMove} style={{ outline: "none" }}>
      <canvas id="grid-canvas" ref={canvasRef} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} />
      {selectedTile && (
        <div className="tile-info">
          X: {selectedTile.x}, Y: {selectedTile.y}
        </div>
      )}
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
