"use client";

import { useState, useRef, useEffect } from "react";
import { getTileCoordinates, getTileSize, createDefaultTile, getMapOffset } from "@/lib/dungeon-utils";
import type { Tile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TileGridProps {
  imageWidth: number;
  imageHeight: number;
  imageElement: HTMLImageElement | null;
  onTileHover: (tile: Tile | null) => void;
  onTileClick?: (tile: Tile | null) => void;
  highlightedTile?: Tile | null;
}

export const TileGrid = ({
  imageElement,
  onTileHover,
  onTileClick,
  highlightedTile,
}: TileGridProps) => {
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
      const tile = createDefaultTile(tileCoords.x, tileCoords.y);
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
      const tile = createDefaultTile(tileCoords.x, tileCoords.y);
      onTileClick(tile);
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

  if (!imageElement) return null;

  const imageRect = imageElement.getBoundingClientRect();
  const tileSize = getTileSize(imageRect.width, imageRect.height);
  const mapOffset = getMapOffset();

  // Use highlightedTile if provided, otherwise use hoveredTile
  const activeTile = highlightedTile || hoveredTile;

  return (
    <div
      ref={overlayRef}
      className="absolute pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {activeTile && (
        <div
          className={cn(
            "absolute border-2 transition-all duration-75 pointer-events-none",
            highlightedTile
              ? "border-blue-400 bg-blue-400/30"
              : "border-yellow-400 bg-yellow-400/20"
          )}
          style={{
            left: mapOffset.left + activeTile.x * tileSize.width,
            top: mapOffset.top + activeTile.y * tileSize.height,
            width: tileSize.width,
            height: tileSize.height,
          }}
        />
      )}
    </div>
  );
};

