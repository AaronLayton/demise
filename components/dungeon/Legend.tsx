"use client";

import { getTileTypesByCategory, getTileTypeName, getTileTypeDescription } from "@/lib/dungeon-utils";
import type { TileType } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const getTileColor = (type: TileType): string => {
  const colors: Record<TileType, string> = {
    floor: "bg-white",
    grass: "bg-green-500",
    dirt: "bg-amber-700",
    "rock-crystal": "bg-purple-500",
    wall: "bg-gray-800",
    void: "bg-black",
    water: "bg-blue-600",
    lava: "bg-red-600",
    quicksand: "bg-amber-500",
    pit: "bg-gray-600",
    torch: "bg-yellow-400",
    "stairs-down-green": "bg-green-600",
    "stairs-down-blue": "bg-blue-500",
    "stairs-up-blue": "bg-blue-400",
    teleporter: "bg-white border-2 border-black",
    rotator: "bg-orange-400",
    "anti-magic-zone": "bg-red-800",
    "extinguish-zone": "bg-red-900",
    "anti-teleport-area": "bg-indigo-800",
    "stud-room": "bg-pink-600",
    character: "bg-blue-300",
    monster: "bg-red-500",
    barrel: "bg-amber-800",
    chest: "bg-yellow-600",
    "item-green": "bg-green-300",
    "item-blue": "bg-blue-300",
    "item-white": "bg-white",
    structure: "bg-amber-600",
  };
  return colors[type] || "bg-gray-400";
};

interface LegendItemProps {
  type: TileType;
}

const LegendItem = ({ type }: LegendItemProps) => {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={cn(
          "w-8 h-8 flex-shrink-0 rounded border border-gray-300 dark:border-gray-600",
          getTileColor(type)
        )}
        aria-label={`${getTileTypeName(type)} color indicator`}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground">
          {getTileTypeName(type)}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {getTileTypeDescription(type)}
        </div>
      </div>
    </div>
  );
};

export const Legend = () => {
  const tileTypesByCategory = getTileTypesByCategory();

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Tile Legend</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {Object.entries(tileTypesByCategory).map(
            ([category, types], categoryIndex) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {category}
                </h3>
                <div className="space-y-1">
                  {types.map((type) => (
                    <LegendItem key={type} type={type} />
                  ))}
                </div>
                {categoryIndex < Object.keys(tileTypesByCategory).length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

