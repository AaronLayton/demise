"use client";

import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { LevelSelector } from "@/components/dungeon/LevelSelector";
import { DungeonViewer } from "@/components/dungeon/DungeonViewer";
import { TileGrid } from "@/components/dungeon/TileGrid";
import { SidePanel } from "@/components/dungeon/SidePanel";
import type { Tile } from "@/lib/types";
import {
  toGridCoordinates,
  createDefaultTile,
  toGameCoordinates,
} from "@/lib/dungeon-utils";
import { useRouter } from "next/navigation";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const [x, setX] = useQueryState("x", {
    parse: (value) => {
      const num = parseInt(value, 10);
      return isNaN(num) || num < 1 || num > 45 ? null : num;
    },
    serialize: (value) => value?.toString() ?? "",
  });
  const [y, setY] = useQueryState("y", {
    parse: (value) => {
      const num = parseInt(value, 10);
      return isNaN(num) || num < 1 || num > 45 ? null : num;
    },
    serialize: (value) => value?.toString() ?? "",
  });

  const levelParam = params?.level as string;
  const parsedLevel = parseInt(levelParam, 10);
  const currentLevel =
    !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 17
      ? parsedLevel
      : 1;

  // Redirect if invalid level
  useEffect(() => {
    if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 17) {
      router.replace("/level/1");
    }
  }, [parsedLevel, router]);

  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const [highlightedTile, setHighlightedTile] = useState<Tile | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

  // Restore highlighted tile from URL on mount or when x/y changes
  useEffect(() => {
    if (x && y && imageElement) {
      const gridCoords = toGridCoordinates(x, y);
      if (gridCoords) {
        const tile = createDefaultTile(gridCoords.x, gridCoords.y);
        setHighlightedTile(tile);
        setHoveredTile(null);
      }
    } else if (!x && !y) {
      setHighlightedTile(null);
    }
  }, [x, y, imageElement]);

  // Clear state when level changes
  useEffect(() => {
    setHoveredTile(null);
    setHighlightedTile(null);
    setImageDimensions(null);
    setImageElement(null);
    // Clear coordinates when changing level
    setX(null);
    setY(null);
  }, [currentLevel, setX, setY]);

  const handleNavigate = (navX: number, navY: number, navLevel: number) => {
    // Navigate to the level first if different
    if (navLevel !== currentLevel) {
      router.push(`/level/${navLevel}?x=${navX}&y=${navY}`);
      setHoveredTile(null);
      setImageDimensions(null);
      setImageElement(null);
    } else {
      // Same level, just update coordinates
      setX(navX);
      setY(navY);
    }
  };

  const handleImageLoad = (
    width: number,
    height: number,
    element: HTMLImageElement
  ) => {
    setImageDimensions({ width, height });
    setImageElement(element);
  };

  const handleTileHover = (tile: Tile | null) => {
    // Only update hover if there's no highlighted tile
    if (!highlightedTile) {
      setHoveredTile(tile);
    }
  };

  const handleTileClick = (tile: Tile | null) => {
    if (!tile) return;

    const gameCoords = toGameCoordinates(tile.x, tile.y);
    setX(gameCoords.x);
    setY(gameCoords.y);
    setHighlightedTile(tile);
    setHoveredTile(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Level Selector */}
      <div className="border-b border-border">
        <LevelSelector currentLevel={currentLevel} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dungeon Viewer */}
        <div className="flex-1 relative overflow-auto">
          <DungeonViewer level={currentLevel} onImageLoad={handleImageLoad} />
          {imageDimensions && imageElement && (
            <TileGrid
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
              imageElement={imageElement}
              onTileHover={handleTileHover}
              onTileClick={handleTileClick}
              highlightedTile={highlightedTile}
            />
          )}
        </div>

        {/* Side Panel */}
        <SidePanel
          hoveredTile={highlightedTile || hoveredTile}
          currentLevel={currentLevel}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

