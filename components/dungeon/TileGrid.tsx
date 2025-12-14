"use client";

import { useState, useRef, useEffect } from "react";
import {
  getTileCoordinates,
  getTileSize,
  createDefaultTile,
  getMapOffset,
  getTileTypeForLocation,
} from "@/lib/dungeon-utils";
import type { Tile } from "@/lib/types";

interface TileGridProps {
  imageWidth: number;
  imageHeight: number;
  imageElement: HTMLImageElement | null;
  onTileHover: (tile: Tile | null) => void;
  onTileClick?: (tile: Tile | null) => void;
  onTileDoubleClick?: (tile: Tile | null) => void;
  highlightedTile?: Tile | null;
  currentLevel?: number;
}

export const TileGrid = ({
  imageElement,
  onTileHover,
  onTileClick,
  onTileDoubleClick,
  highlightedTile,
  currentLevel = 1,
}: TileGridProps) => {
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageElement) return;

    const imageRect = imageElement.getBoundingClientRect();

    const tileCoords = getTileCoordinates(
      e.clientX,
      e.clientY,
      imageRect.width,
      imageRect.height,
      imageRect.left,
      imageRect.top
    );

    if (tileCoords) {
      const tileType = getTileTypeForLocation(
        currentLevel,
        tileCoords.x,
        tileCoords.y
      );
      const tile = createDefaultTile(tileCoords.x, tileCoords.y, tileType);
      setHoveredTile(tile);
      onTileHover(tile);
    } else {
      setHoveredTile(null);
      onTileHover(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTile(null);
    onTileHover(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageElement || !onTileClick) return;

    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    const imageRect = imageElement.getBoundingClientRect();

    const tileCoords = getTileCoordinates(
      e.clientX,
      e.clientY,
      imageRect.width,
      imageRect.height,
      imageRect.left,
      imageRect.top
    );

    if (tileCoords) {
      const tileType = getTileTypeForLocation(
        currentLevel,
        tileCoords.x,
        tileCoords.y
      );
      const tile = createDefaultTile(tileCoords.x, tileCoords.y, tileType);

      // Delay the single click to allow double-click to fire first
      clickTimeoutRef.current = setTimeout(() => {
        onTileClick(tile);
        clickTimeoutRef.current = null;
      }, 150); // 150ms delay to detect double-click (balance between responsiveness and double-click detection)
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageElement || !onTileDoubleClick) return;

    e.preventDefault(); // Prevent text selection on double-click

    // Cancel the pending single click
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    const imageRect = imageElement.getBoundingClientRect();

    const tileCoords = getTileCoordinates(
      e.clientX,
      e.clientY,
      imageRect.width,
      imageRect.height,
      imageRect.left,
      imageRect.top
    );

    if (tileCoords) {
      const tileType = getTileTypeForLocation(
        currentLevel,
        tileCoords.x,
        tileCoords.y
      );
      const tile = createDefaultTile(tileCoords.x, tileCoords.y, tileType);
      onTileDoubleClick(tile);
    }
  };

  // Update overlay position to match image
  useEffect(() => {
    if (!imageElement || !overlayRef.current) return;

    const updatePosition = () => {
      const imageRect = imageElement.getBoundingClientRect();
      const container = overlayRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      if (overlayRef.current) {
        overlayRef.current.style.left = `${imageRect.left - containerRect.left}px`;
        overlayRef.current.style.top = `${imageRect.top - containerRect.top}px`;
        overlayRef.current.style.width = `${imageRect.width}px`;
        overlayRef.current.style.height = `${imageRect.height}px`;
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [imageElement]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  if (!imageElement) return null;

  const imageRect = imageElement.getBoundingClientRect();
  const tileSize = getTileSize(imageRect.width, imageRect.height);
  const mapOffset = getMapOffset();

  return (
    <div
      ref={overlayRef}
      className="absolute pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Highlighted tile (blue) - always shows when set */}
      {highlightedTile && (
        <>
          {/* Pulsing ring effect - grows outward from center */}
          <div
            className="absolute border-2 border-blue-400 pointer-events-none z-10"
            style={{
              left: mapOffset.left + highlightedTile.x * tileSize.width + tileSize.width / 2,
              top: mapOffset.top + highlightedTile.y * tileSize.height + tileSize.height / 2,
              width: tileSize.width,
              height: tileSize.height,
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
              animation: "tile-pulse-ring 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
              borderRadius: "2px",
            }}
          />
          {/* Second pulsing ring for layered effect */}
          <div
            className="absolute border-2 border-blue-300 pointer-events-none z-10"
            style={{
              left: mapOffset.left + highlightedTile.x * tileSize.width + tileSize.width / 2,
              top: mapOffset.top + highlightedTile.y * tileSize.height + tileSize.height / 2,
              width: tileSize.width,
              height: tileSize.height,
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
              animation: "tile-pulse-ring 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.75s",
              borderRadius: "2px",
            }}
          />
          {/* Main highlighted tile */}
          <div
            className="absolute border-2 border-blue-400 bg-blue-400/30 transition-all duration-75 pointer-events-none z-10"
            style={{
              left: mapOffset.left + highlightedTile.x * tileSize.width,
              top: mapOffset.top + highlightedTile.y * tileSize.height,
              width: tileSize.width,
              height: tileSize.height,
              boxShadow: "0 0 12px rgba(96, 165, 250, 0.8), inset 0 0 8px rgba(96, 165, 250, 0.3)",
            }}
          />
        </>
      )}
      {/* Hovered tile (yellow/orange) - always shows when hovering, even if highlighted tile exists */}
      {hoveredTile && (
        <div
          className="absolute border-2 border-yellow-400 bg-yellow-400/20 transition-all duration-75 pointer-events-none z-20"
          style={{
            left: mapOffset.left + hoveredTile.x * tileSize.width,
            top: mapOffset.top + hoveredTile.y * tileSize.height,
            width: tileSize.width,
            height: tileSize.height,
          }}
        />
      )}
    </div>
  );
};

