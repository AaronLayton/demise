"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  currentLevel: number;
  totalLevels?: number;
}

const TOTAL_LEVELS = 17;

export const LevelSelector = ({
  currentLevel,
  totalLevels = TOTAL_LEVELS,
}: LevelSelectorProps) => {
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {levels.map((level) => (
        <Button
          key={level}
          asChild
          variant={currentLevel === level ? "default" : "outline"}
          size="sm"
          className={cn(
            "min-w-[3rem]",
            currentLevel === level && "font-bold"
          )}
        >
          <Link href={`/level/${level}`} aria-label={`Select level ${level}`}>
            {level}
          </Link>
        </Button>
      ))}
    </div>
  );
};

