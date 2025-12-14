"use client";

import type { Tile } from "@/lib/types";
import { getTileTypeName, getTileTypeDescription, toGameCoordinates } from "@/lib/dungeon-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TileInfoProps {
  tile: Tile | null;
}

export const TileInfo = ({ tile }: TileInfoProps) => {
  if (!tile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hover over a tile to see information
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Coordinates
          </div>
          <div className="text-sm font-mono">
            {(() => {
              const gameCoords = toGameCoordinates(tile.x, tile.y);
              return `(${gameCoords.x}, ${gameCoords.y})`;
            })()}
          </div>
        </div>

        <Separator />

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Tile Type
          </div>
          <div className="text-sm font-medium">{getTileTypeName(tile.type)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {getTileTypeDescription(tile.type)}
          </div>
        </div>

        {tile.metadata && (
          <>
            <Separator />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Properties
              </div>
              <div className="space-y-1 text-xs">
                {tile.metadata.isNavigable !== undefined && (
                  <div>
                    Navigable: {tile.metadata.isNavigable ? "Yes" : "No"}
                  </div>
                )}
                {tile.metadata.isHazardous !== undefined && (
                  <div>
                    Hazardous: {tile.metadata.isHazardous ? "Yes" : "No"}
                  </div>
                )}
                {tile.metadata.requiresLevitation !== undefined && (
                  <div>
                    Requires Levitation:{" "}
                    {tile.metadata.requiresLevitation ? "Yes" : "No"}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {tile.features && tile.features.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Additional Features
              </div>
              <div className="space-y-1">
                {tile.features.map((feature, index) => (
                  <div key={index} className="text-xs">
                    • {getTileTypeName(feature)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Comments
          </div>
          <div className="text-xs text-muted-foreground italic">
            Comments feature coming soon
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

