"use client";

import { useEffect, useRef } from "react";
import { getQuestsForLevel } from "@/lib/quest-data";
import { toGridCoordinates, getTileSize, getMapOffset } from "@/lib/dungeon-utils";

interface QuestMarkersProps {
  imageWidth: number;
  imageHeight: number;
  imageElement: HTMLImageElement | null;
  currentLevel: number;
  hoveredTile: { x: number; y: number } | null;
  highlightedTile: { x: number; y: number } | null;
}

export const QuestMarkers = ({
  imageElement,
  currentLevel,
  hoveredTile,
  highlightedTile,
}: QuestMarkersProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvas = () => {
      const imageRect = imageElement.getBoundingClientRect();
      const container = canvas.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      // Set canvas size to match image
      const dpr = window.devicePixelRatio || 1;
      canvas.width = imageRect.width * dpr;
      canvas.height = imageRect.height * dpr;
      ctx.scale(dpr, dpr);

      // Position canvas to match image
      canvas.style.left = `${imageRect.left - containerRect.left}px`;
      canvas.style.top = `${imageRect.top - containerRect.top}px`;
      canvas.style.width = `${imageRect.width}px`;
      canvas.style.height = `${imageRect.height}px`;

      // Clear canvas
      ctx.clearRect(0, 0, imageRect.width, imageRect.height);

      const tileSize = getTileSize(imageRect.width, imageRect.height);
      const mapOffset = getMapOffset();

      // Get quests for current level
      const quests = getQuestsForLevel(currentLevel);

      // Draw quest markers
      quests.forEach((quest) => {
        if (!quest.location) return;

        const gridCoords = toGridCoordinates(
          quest.location.x,
          quest.location.y
        );
        if (!gridCoords) return;

        const x = mapOffset.left + gridCoords.x * tileSize.width + tileSize.width / 2;
        const y = mapOffset.top + gridCoords.y * tileSize.height + tileSize.height / 2;

        // Check if this tile is hovered or highlighted
        const isHovered =
          hoveredTile &&
          hoveredTile.x === gridCoords.x &&
          hoveredTile.y === gridCoords.y;
        const isHighlighted =
          highlightedTile &&
          highlightedTile.x === gridCoords.x &&
          highlightedTile.y === gridCoords.y;

        // Draw quest marker (star icon)
        const size = isHovered || isHighlighted ? 12 : 8;
        const alpha = isHovered || isHighlighted ? 0.9 : 0.6;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4); // Rotate 45 degrees to make it look like a star

        // Draw star shape (diamond rotated)
        ctx.fillStyle = `rgba(234, 179, 8, ${alpha})`; // Yellow/gold color
        ctx.strokeStyle = `rgba(161, 98, 7, ${alpha})`; // Darker yellow for border
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.4, -size * 0.4);
        ctx.lineTo(size, 0);
        ctx.lineTo(size * 0.4, size * 0.4);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.4, size * 0.4);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size * 0.4, -size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });
    };

    updateCanvas();
    const interval = setInterval(updateCanvas, 100);
    window.addEventListener("resize", updateCanvas);
    window.addEventListener("scroll", updateCanvas, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateCanvas);
      window.removeEventListener("scroll", updateCanvas, true);
    };
  }, [imageElement, currentLevel, hoveredTile, highlightedTile]);

  if (!imageElement) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none z-[4]"
      style={{
        position: "absolute",
        pointerEvents: "none",
      }}
    />
  );
};
