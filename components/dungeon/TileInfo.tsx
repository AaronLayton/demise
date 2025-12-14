"use client";

import React from "react";
import type { Tile } from "@/lib/types";
import {
  getTileTypeName,
  getTileTypeDescription,
  toGameCoordinates,
} from "@/lib/dungeon-utils";
import { getTeleporterDestination } from "@/lib/teleporter-data";
import { teleporterData } from "@/lib/teleporter-data";
import { getQuestsForLocation } from "@/lib/quest-data";
import type { TeleporterDestination } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TileInfoProps {
  tile: Tile | null;
  currentLevel?: number;
  onNavigate?: (x: number, y: number, level: number) => void;
}

// Helper function to parse and render clickable coordinates in text
const renderClickableCoordinates = (
  text: string,
  defaultLevel: number,
  onNavigate?: (x: number, y: number, level: number) => void
): React.ReactNode => {
  if (!onNavigate) {
    return text;
  }

  // Pattern to match coordinates: "x,y,level" or "x, y, level" or "x,y" (with optional spaces)
  const coordPattern = /(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = coordPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    const level = match[3] ? parseInt(match[3], 10) : defaultLevel;

    // Validate coordinates
    if (x >= 1 && x <= 45 && y >= 1 && y <= 45 && level >= 1 && level <= 32) {
      const coordText = match[0];
      parts.push(
        <button
          key={`coord-${match.index}`}
          onClick={() => onNavigate(x, y, level)}
          className="text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
          title={`Navigate to (${x}, ${y}) on Level ${level}`}
        >
          {coordText}
        </button>
      );
    } else {
      // Invalid coordinates, just add the text as-is
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export const TileInfo = ({ tile, currentLevel = 1, onNavigate }: TileInfoProps) => {
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

        {/* Teleporter Information */}
        {tile.type === "teleporter" && (
          <>
            <Separator />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Teleporter Information
              </div>
              {(() => {
                const gameCoords = toGameCoordinates(tile.x, tile.y);
                const dest: TeleporterDestination | null = tile.metadata?.teleporterDestination ||
                  getTeleporterDestination(currentLevel, gameCoords.x, gameCoords.y, teleporterData);
                
                if (dest) {
                  if (dest.isRandom) {
                    return (
                      <div className="text-xs text-muted-foreground">
                        Random teleporter - destination is random
                      </div>
                    );
                  }
                  return (
                    <div className="text-xs space-y-2">
                      <div className="space-y-1">
                        {(dest as TeleporterDestination & { roomName?: string }).roomName && (
                          <div className="font-medium text-foreground">
                            Takes you to: {(dest as TeleporterDestination & { roomName?: string }).roomName}
                          </div>
                        )}
                        <div>
                          Destination: ({dest.x}, {dest.y})
                        </div>
                        <div>
                          Level: {dest.level}
                          {dest.level !== currentLevel && (
                            <span className="text-muted-foreground ml-1">
                              (different floor)
                            </span>
                          )}
                        </div>
                      </div>
                      {onNavigate && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => onNavigate(dest.x, dest.y, dest.level)}
                        >
                          {dest.level !== currentLevel ? "Follow to Level " + dest.level : "Follow Teleporter"}
                        </Button>
                      )}
                    </div>
                  );
                }
                return (
                  <div className="text-xs text-muted-foreground italic">
                    Teleporter destination data not available
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* Quest Information */}
        {(() => {
          const gameCoords = toGameCoordinates(tile.x, tile.y);
          const quests = getQuestsForLocation(
            currentLevel,
            gameCoords.x,
            gameCoords.y
          );

          if (quests.length > 0) {
            return (
              <>
                <Separator />
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Quest Locations
                  </div>
                  <div className="space-y-2">
                    {quests.map((quest) => (
                      <div
                        key={quest.id}
                        className="text-xs p-2 bg-yellow-500/10 border border-yellow-500/20 rounded"
                      >
                        <div className="font-medium text-foreground mb-1">
                          {quest.characterClass}
                          {quest.levelRequirement !== null && (
                            <span className="text-muted-foreground ml-1">
                              (Lv {quest.levelRequirement})
                            </span>
                          )}
                          {quest.questNumber && (
                            <span className="text-muted-foreground ml-1">
                              - Quest {quest.questNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {quest.description}
                        </div>
                        {quest.searchDescription && (
                          <div className="text-muted-foreground mt-1 italic text-[10px]">
                            {renderClickableCoordinates(
                              quest.searchDescription,
                              currentLevel,
                              onNavigate
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          }
          return null;
        })()}

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

