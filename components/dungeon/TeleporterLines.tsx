"use client";

import { useEffect, useRef } from "react";
import type { Tile } from "@/lib/types";
import { getTeleporterDestination } from "@/lib/teleporter-data";
import { teleporterData } from "@/lib/teleporter-data";
import { toGameCoordinates, toGridCoordinates, getTileSize, getMapOffset } from "@/lib/dungeon-utils";

interface TeleporterLinesProps {
  imageWidth: number;
  imageHeight: number;
  imageElement: HTMLImageElement | null;
  hoveredTile: Tile | null;
  highlightedTile: Tile | null;
  currentLevel: number;
}

export const TeleporterLines = ({
  imageWidth,
  imageHeight,
  imageElement,
  hoveredTile,
  highlightedTile,
  currentLevel,
}: TeleporterLinesProps) => {
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

      // Helper to get tile center position
      const getTileCenter = (tile: Tile) => {
        return {
          x: mapOffset.left + tile.x * tileSize.width + tileSize.width / 2,
          y: mapOffset.top + tile.y * tileSize.height + tileSize.height / 2,
        };
      };

      // Draw line for hovered tile if it's a teleporter
      if (hoveredTile && hoveredTile.type === "teleporter") {
        const gameCoords = toGameCoordinates(hoveredTile.x, hoveredTile.y);
        const dest = getTeleporterDestination(
          currentLevel,
          gameCoords.x,
          gameCoords.y,
          teleporterData
        );

        if (dest && !dest.isRandom) {
          const start = getTileCenter(hoveredTile);
          const destGrid = toGridCoordinates(dest.x, dest.y);
          
          if (destGrid) {
            const end = {
              x: mapOffset.left + destGrid.x * tileSize.width + tileSize.width / 2,
              y: mapOffset.top + destGrid.y * tileSize.height + tileSize.height / 2,
            };

            const isSameLevel = dest.level === currentLevel;
            
            // Same level - solid green line, different level - dashed blue line
            ctx.strokeStyle = isSameLevel 
              ? "rgba(34, 197, 94, 0.6)" 
              : "rgba(59, 130, 246, 0.6)";
            ctx.lineWidth = 2;
            ctx.setLineDash(isSameLevel ? [] : [5, 5]);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw arrowhead
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const arrowLength = 8;
            const arrowAngle = Math.PI / 6;

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle - arrowAngle),
              end.y - arrowLength * Math.sin(angle - arrowAngle)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle + arrowAngle),
              end.y - arrowLength * Math.sin(angle + arrowAngle)
            );
            ctx.stroke();
          }
        }
      }

      // Draw line for highlighted tile if it's a teleporter
      if (highlightedTile && highlightedTile.type === "teleporter") {
        const gameCoords = toGameCoordinates(highlightedTile.x, highlightedTile.y);
        const dest = getTeleporterDestination(
          currentLevel,
          gameCoords.x,
          gameCoords.y,
          teleporterData
        );

        if (dest && !dest.isRandom) {
          const start = getTileCenter(highlightedTile);
          const destGrid = toGridCoordinates(dest.x, dest.y);
          
          if (destGrid) {
            const end = {
              x: mapOffset.left + destGrid.x * tileSize.width + tileSize.width / 2,
              y: mapOffset.top + destGrid.y * tileSize.height + tileSize.height / 2,
            };

            const isSameLevel = dest.level === currentLevel;
            
            // Same level - solid green line, different level - dashed blue line
            ctx.strokeStyle = isSameLevel 
              ? "rgba(34, 197, 94, 0.8)" 
              : "rgba(59, 130, 246, 0.8)";
            ctx.lineWidth = 3;
            ctx.setLineDash(isSameLevel ? [] : [5, 5]);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw arrowhead
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const arrowLength = 10;
            const arrowAngle = Math.PI / 6;

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle - arrowAngle),
              end.y - arrowLength * Math.sin(angle - arrowAngle)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle + arrowAngle),
              end.y - arrowLength * Math.sin(angle + arrowAngle)
            );
            ctx.stroke();
          }
        }
      }
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
  }, [imageElement, hoveredTile, highlightedTile, currentLevel, imageWidth, imageHeight]);

  if (!imageElement) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none z-[5]"
      style={{
        position: "absolute",
        pointerEvents: "none",
      }}
    />
  );
};

