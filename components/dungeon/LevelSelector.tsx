"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  currentLevel: number;
  totalLevels?: number;
}

const TOTAL_LEVELS = 32;

export const LevelSelector = ({
  currentLevel,
  totalLevels = TOTAL_LEVELS,
}: LevelSelectorProps) => {
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2 p-2 md:p-4 overflow-x-auto">
      {levels.map((level) => (
        <Button
          key={level}
          asChild
          variant={currentLevel === level ? "default" : "outline"}
          size="sm"
          className={cn(
            "min-w-[2.5rem] md:min-w-[3rem] text-xs md:text-sm",
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

