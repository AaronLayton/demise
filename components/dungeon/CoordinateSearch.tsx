"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toGridCoordinates } from "@/lib/dungeon-utils";

interface CoordinateSearchProps {
  onNavigate: (x: number, y: number, level: number) => void;
  currentLevel: number;
}

export const CoordinateSearch = ({
  onNavigate,
  currentLevel,
}: CoordinateSearchProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate();
  };

  const handleNavigate = () => {
    // Parse format: "x, y, level" or "x, y"
    const parts = input
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length < 2) {
      return;
    }

    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    const level = parts.length >= 3 ? parseInt(parts[2], 10) : currentLevel;

    if (isNaN(x) || isNaN(y) || isNaN(level)) {
      return;
    }

    // Validate coordinates
    const gridCoords = toGridCoordinates(x, y);
    if (!gridCoords) {
      return;
    }

    // Validate level
    if (level < 1 || level > 17) {
      return;
    }

    onNavigate(x, y, level);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Get pasted text from clipboard
    const pastedText = e.clipboardData.getData("text");
    
    // Small delay to let paste complete, then parse and navigate
    setTimeout(() => {
      // Use the pasted text directly
      const parts = pastedText
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      if (parts.length < 2) {
        return;
      }

      const x = parseInt(parts[0], 10);
      const y = parseInt(parts[1], 10);
      const level = parts.length >= 3 ? parseInt(parts[2], 10) : currentLevel;

      if (isNaN(x) || isNaN(y) || (parts.length >= 3 && isNaN(level))) {
        return;
      }

      // Validate coordinates
      const gridCoords = toGridCoordinates(x, y);
      if (!gridCoords) {
        return;
      }

      // Validate level (only if provided)
      if (parts.length >= 3 && (level < 1 || level > 17)) {
        return;
      }

      onNavigate(x, y, level);
    }, 50);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Navigate to Coordinates</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="text"
              placeholder="x, y, level (e.g., 2, 12, 5)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter coordinates in format: x, y, level
              <br />
              Level is optional (defaults to current level)
            </p>
          </div>
          <Button type="submit" className="w-full" size="sm">
            Navigate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

