"use client";

import React from "react";
import { getQuestsForLevel, getQuestsByClass } from "@/lib/quest-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestInfoProps {
  currentLevel: number;
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

export const QuestInfo = ({
  currentLevel,
  onNavigate,
}: QuestInfoProps) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Get all unique character classes
  const allQuests = getQuestsForLevel(currentLevel);
  const classesWithQuests = Array.from(
    new Set(allQuests.map((q) => q.characterClass))
  ).sort();

  // Get quests to display
  const questsToShow = selectedClass
    ? getQuestsByClass(selectedClass).filter(
        (q) => q.location?.level === currentLevel
      )
    : allQuests;

  // Separate quests with locations from those without
  const questsWithLocations = questsToShow.filter((q) => q.location !== null);
  const questsWithoutLocations = questsToShow.filter(
    (q) => q.location === null
  );

  if (allQuests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quest Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No quest locations found on Level {currentLevel}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quest Locations</CardTitle>
        {classesWithQuests.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Button
              size="sm"
              variant={selectedClass === null ? "default" : "outline"}
              className="text-xs h-6"
              onClick={() => setSelectedClass(null)}
            >
              All
            </Button>
            {classesWithQuests.map((charClass) => (
              <Button
                key={charClass}
                size="sm"
                variant={selectedClass === charClass ? "default" : "outline"}
                className="text-xs h-6"
                onClick={() => setSelectedClass(charClass)}
              >
                {charClass}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quests with specific locations */}
          {questsWithLocations.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Specific Locations ({questsWithLocations.length})
              </div>
              <div className="space-y-2">
                {questsWithLocations.map((quest) => (
                  <div
                    key={quest.id}
                    className="text-xs p-2 bg-yellow-500/10 border border-yellow-500/20 rounded"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
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
                        <div className="text-muted-foreground mt-1">
                          {quest.description}
                        </div>
                      </div>
                      {quest.location && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono shrink-0"
                        >
                          ({quest.location.x}, {quest.location.y})
                        </Badge>
                      )}
                    </div>
                    {quest.location && onNavigate && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs mt-2 h-6"
                        onClick={() =>
                          onNavigate(
                            quest.location!.x,
                            quest.location!.y,
                            quest.location!.level
                          )
                        }
                      >
                        Navigate to Location
                      </Button>
                    )}
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
          )}

          {/* Quests without specific locations */}
          {questsWithoutLocations.length > 0 && (
            <div>
              {questsWithLocations.length > 0 && <Separator className="my-4" />}
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Search Areas ({questsWithoutLocations.length})
              </div>
              <div className="space-y-2">
                {questsWithoutLocations.map((quest) => (
                  <div
                    key={quest.id}
                    className="text-xs p-2 bg-blue-500/10 border border-blue-500/20 rounded"
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};
