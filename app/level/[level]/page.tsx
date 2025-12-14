"use client";

import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { LevelSelector } from "@/components/dungeon/LevelSelector";
import { DungeonViewer } from "@/components/dungeon/DungeonViewer";
import { TileGrid } from "@/components/dungeon/TileGrid";
import { TeleporterLines } from "@/components/dungeon/TeleporterLines";
import { QuestMarkers } from "@/components/dungeon/QuestMarkers";
import { SidePanel } from "@/components/dungeon/SidePanel";
import type { Tile } from "@/lib/types";
import {
  toGridCoordinates,
  createDefaultTile,
  toGameCoordinates,
  getTileTypeForLocation,
} from "@/lib/dungeon-utils";
import { getTeleporterDestination } from "@/lib/teleporter-data";
import { teleporterData } from "@/lib/teleporter-data";
import { useRouter } from "next/navigation";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const [xStr, setXStr] = useQueryState("x");
  const [yStr, setYStr] = useQueryState("y");

  // Parse x and y as integers
  const x = xStr ? (() => {
    const num = parseInt(xStr, 10);
    return isNaN(num) || num < 1 || num > 45 ? null : num;
  })() : null;
  const y = yStr ? (() => {
    const num = parseInt(yStr, 10);
    return isNaN(num) || num < 1 || num > 45 ? null : num;
  })() : null;

  const levelParam = params?.level as string;
  const parsedLevel = parseInt(levelParam, 10);
  const currentLevel =
    !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 32
      ? parsedLevel
      : 1;

  // Redirect if invalid level
  useEffect(() => {
    if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 32) {
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
    if (x !== null && y !== null && imageElement) {
      const gridCoords = toGridCoordinates(x, y);
      if (gridCoords) {
        const tileType = getTileTypeForLocation(
          currentLevel,
          gridCoords.x,
          gridCoords.y
        );
        const tile = createDefaultTile(gridCoords.x, gridCoords.y, tileType);
        setHighlightedTile(tile);
        setHoveredTile(null);
      }
    } else if (x === null && y === null) {
      setHighlightedTile(null);
    }
  }, [x, y, imageElement, currentLevel]);

  // Clear state when level changes (but preserve URL params if they exist)
  useEffect(() => {
    setHoveredTile(null);
    setHighlightedTile(null);
    setImageDimensions(null);
    setImageElement(null);
    // Don't clear coordinates - let them persist in URL
  }, [currentLevel]);

  const handleNavigate = async (navX: number, navY: number, navLevel: number) => {
    // Navigate to the level first if different
    if (navLevel !== currentLevel) {
      // Navigate to new level with query params
      // The router.push will trigger navigation and the component will remount
      // The URL params (x, y) will be read by NUQS and restored in the useEffect
      router.push(`/level/${navLevel}?x=${navX}&y=${navY}`);
    } else {
      // Same level, just update coordinates using NUQS
      await setXStr(navX.toString());
      await setYStr(navY.toString());
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
    // Always update hover state - it will be shown when not clicking
    setHoveredTile(tile);
  };

  const handleTileClick = (tile: Tile | null) => {
    if (!tile) {
      // Clicked outside the map - deselect
      setXStr(null);
      setYStr(null);
      setHighlightedTile(null);
      return;
    }

    const gameCoords = toGameCoordinates(tile.x, tile.y);
    setXStr(gameCoords.x.toString());
    setYStr(gameCoords.y.toString());
    setHighlightedTile(tile);
    setHoveredTile(null);
  };

  const handleTileDoubleClick = (tile: Tile | null) => {
    if (!tile || tile.type !== "teleporter") return;

    const gameCoords = toGameCoordinates(tile.x, tile.y);
    const dest = getTeleporterDestination(
      currentLevel,
      gameCoords.x,
      gameCoords.y,
      teleporterData
    );

    if (dest && !dest.isRandom) {
      // Navigate to teleporter destination
      // This will navigate to the new level and the URL params will be preserved
      handleNavigate(dest.x, dest.y, dest.level);
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if click is outside the image
    if (!imageElement) return;

    const imageRect = imageElement.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    // Check if click is outside image bounds
    if (
      clickX < imageRect.left ||
      clickX > imageRect.right ||
      clickY < imageRect.top ||
      clickY > imageRect.bottom
    ) {
      // Clicked outside - deselect
      setXStr(null);
      setYStr(null);
      setHighlightedTile(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Level Selector */}
      <div className="border-b border-border">
        <LevelSelector currentLevel={currentLevel} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Dungeon Viewer */}
        <div
          className="flex-1 relative overflow-auto min-h-0"
          onClick={handleContainerClick}
        >
          <DungeonViewer level={currentLevel} onImageLoad={handleImageLoad} />
          {imageDimensions && imageElement && (
            <>
              <QuestMarkers
                imageWidth={imageDimensions.width}
                imageHeight={imageDimensions.height}
                imageElement={imageElement}
                currentLevel={currentLevel}
                hoveredTile={hoveredTile ? { x: hoveredTile.x, y: hoveredTile.y } : null}
                highlightedTile={highlightedTile ? { x: highlightedTile.x, y: highlightedTile.y } : null}
              />
              <TeleporterLines
                imageWidth={imageDimensions.width}
                imageHeight={imageDimensions.height}
                imageElement={imageElement}
                hoveredTile={hoveredTile}
                highlightedTile={highlightedTile}
                currentLevel={currentLevel}
              />
            <TileGrid
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
              imageElement={imageElement}
              onTileHover={handleTileHover}
              onTileClick={handleTileClick}
              onTileDoubleClick={handleTileDoubleClick}
              highlightedTile={highlightedTile}
              currentLevel={currentLevel}
            />
            </>
          )}
        </div>

        {/* Side Panel */}
        <SidePanel
          hoveredTile={hoveredTile}
          selectedTile={highlightedTile}
          currentLevel={currentLevel}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

