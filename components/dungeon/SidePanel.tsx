"use client";

import { Legend } from "./Legend";
import { TileInfo } from "./TileInfo";
import { CoordinateSearch } from "./CoordinateSearch";
import type { Tile } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidePanelProps {
  hoveredTile: Tile | null;
  currentLevel: number;
  onNavigate: (x: number, y: number, level: number) => void;
}

export const SidePanel = ({
  hoveredTile,
  currentLevel,
  onNavigate,
}: SidePanelProps) => {
  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <CoordinateSearch
            currentLevel={currentLevel}
            onNavigate={onNavigate}
          />
          <Separator />
          <TileInfo tile={hoveredTile} />
          <Separator />
          <Legend />
        </div>
      </ScrollArea>
    </div>
  );
};

