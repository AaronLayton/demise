"use client";

import { Legend } from "./Legend";
import { TileInfo } from "./TileInfo";
import { CoordinateSearch } from "./CoordinateSearch";
import { QuestInfo } from "./QuestInfo";
import type { Tile } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidePanelProps {
  hoveredTile: Tile | null;
  selectedTile: Tile | null;
  currentLevel: number;
  onNavigate: (x: number, y: number, level: number) => void;
}

export const SidePanel = ({
  hoveredTile,
  selectedTile,
  currentLevel,
  onNavigate,
}: SidePanelProps) => {
  return (
    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-background flex flex-col h-full max-h-[50vh] md:max-h-none">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <CoordinateSearch
            currentLevel={currentLevel}
            onNavigate={onNavigate}
          />
          <Separator />
          {/* Selected/Pinned Tile */}
          {selectedTile && (
            <>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <span>📌 Selected Tile</span>
                </div>
                <TileInfo 
                  tile={selectedTile} 
                  currentLevel={currentLevel}
                  onNavigate={onNavigate}
                />
              </div>
              <Separator />
            </>
          )}
          {/* Hovered Tile */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              {selectedTile ? "Hovered Tile" : "Tile Information"}
            </div>
            <TileInfo 
              tile={hoveredTile} 
              currentLevel={currentLevel}
              onNavigate={onNavigate}
            />
          </div>
          <Separator />
          <QuestInfo
            currentLevel={currentLevel}
            onNavigate={onNavigate}
          />
          <Separator />
          <Legend />
        </div>
      </ScrollArea>
    </div>
  );
};

