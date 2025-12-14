"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DungeonViewerProps {
  level: number;
  onImageLoad?: (width: number, height: number, element: HTMLImageElement) => void;
}

export const DungeonViewer = ({
  level,
  onImageLoad,
}: DungeonViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [opacity, setOpacity] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const previousLevelRef = useRef<number>(level);

  const imagePath = level === 1 ? `/dungeon/${level}.png` : `/dungeon/${level}.jpg`;

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });
      setIsLoading(false);
      setOpacity(1);
      onImageLoad?.(naturalWidth, naturalHeight, imageRef.current);
    }
  };

  // Fade out previous image when level changes, then fade in new one
  useEffect(() => {
    if (previousLevelRef.current !== level) {
      setOpacity(0);
      setIsLoading(true);
      previousLevelRef.current = level;
    }
  }, [level]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center min-w-0 min-h-0">
        <Image
          ref={imageRef}
          src={imagePath}
          alt={`Dungeon Level ${level}`}
          width={638}
          height={640}
          className={cn(
            "max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-200",
            isLoading && "opacity-0 pointer-events-none"
          )}
          style={{ opacity, maxWidth: "100%", maxHeight: "100%" }}
          onLoad={handleImageLoad}
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

