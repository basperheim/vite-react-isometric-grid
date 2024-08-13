import React, { useState, useEffect, useRef, useCallback } from "react";
import cubeGrass from "../images/cube-grass.png";
import cubeDirt from "../images/cube-dirt.png";
import cubeRocky from "../images/cube-rocky.png";
import cubeWater from "../images/cube-water1.png";
import "./IsometricTerrain.css";

const GRID_SIZE = 128;
const INITIAL_TILE_SIZE = 64;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

interface Camera {
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface Tile {
  x: number;
  y: number;
  terrain: string;
  height: number;
  drawX: number;
  drawY: number;
}

const IsometricTerrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [tileSize, setTileSize] = useState<number>(INITIAL_TILE_SIZE);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  // const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

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
          drawX: 0, // Initialize with dummy value
          drawY: 0, // Initialize with dummy value
        });
      }
    }
    setTiles(newTiles);
  }, []);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    tiles.forEach((tile) => {
      const isoX = ((tile.x - tile.y) * tileSize) / 2;
      const isoY = ((tile.x + tile.y) * tileSize) / 7 - tile.height;
      const drawX = CANVAS_WIDTH / 2 + isoX - camera.x * tileSize;
      const drawY = isoY - camera.y * tileSize;

      // Update each tile's respective draw position on the canvas
      tile.drawX = drawX;
      tile.drawY = drawY;

      const img = imageRefs.current[tile.terrain];
      if (img && img.complete) {
        ctx.save();

        if (hoveredTile?.x === tile.x && hoveredTile?.y === tile.y) {
          ctx.translate(drawX, drawY - 20);
        } else {
          ctx.translate(drawX, drawY);
        }

        ctx.drawImage(img, 0, 0, tileSize, tileSize / 2);
        ctx.restore();
      }
    });
  }, [tiles, tileSize, camera, hoveredTile]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  /**
   * Handles mouse movements
   * @param {MouseEvent} e
   * @returns {void}
   */
  const handleMouseMove = (e: React.MouseEvent): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePosition({ x: mouseX, y: mouseY });

    // Short-circuit the function if mouse is NOT over canvas
    if (mouseX < 0 || mouseX > CANVAS_WIDTH || mouseY < 0 || mouseY > CANVAS_HEIGHT) {
      setHoveredTile(null);
      return;
    }

    const tileSizeHalf = tileSize / 2;
    const targetMinX = mouseX - tileSize;
    const targetMaxX = mouseX;

    const targetMinY = mouseY - tileSizeHalf / 2;
    const targetMaxY = mouseY + tileSize;

    // Find the tile under the cursor
    const tile = tiles.find((t) => {
      return t.drawX > targetMinX && t.drawX < targetMaxX && t.drawY > targetMinY && t.drawY < targetMaxY;
    });

    setHoveredTile(tile || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowUp":
        setCamera((old) => ({ ...old, y: old.y - 1 }));
        break;
      case "ArrowDown":
        setCamera((old) => ({ ...old, y: old.y + 1 }));
        break;
      case "ArrowLeft":
        setCamera((old) => ({ ...old, x: old.x - 1 }));
        break;
      case "ArrowRight":
        setCamera((old) => ({ ...old, x: old.x + 1 }));
        break;
      case "=":
        handleZoom(1);
        break;
      case "-":
        handleZoom(-1);
        break;
    }
  };

  const handleZoom = (inOrOut: number): void => {
    setTileSize((oldSize) => oldSize + inOrOut * 16);
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyPress} onMouseMove={handleMouseMove} style={{ outline: "none" }}>
      <canvas id="grid-canvas" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />

      <div id="text-container">
        <div className="hover-text">
          <span>X:</span> {hoveredTile ? hoveredTile.x : "N/A"}, <span>Y:</span> {hoveredTile ? hoveredTile.y : "N/A"}
        </div>
        <div className="mouse-text">
          <span>Mouse X:</span> {mousePosition.x}, <span>Y:</span> {mousePosition.y}
        </div>
        <div className="mouse-text">
          <span>Mouse perc:</span> {((mousePosition.x / CANVAS_WIDTH) * 100).toFixed(1)}%, <span>Y:</span>
          {((mousePosition.y / CANVAS_HEIGHT) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default IsometricTerrain;
