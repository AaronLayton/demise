// Demise Teleporter Data
// This file will store teleporter destination information
// Format: level -> { x, y } -> destination

import type { TeleporterDestination } from "./types";

// Teleporter data structure: level -> source coordinates -> destination
// Coordinates are in game format (1-indexed, bottom-left origin)
export type TeleporterData = Record<
  number,
  Record<string, TeleporterDestination>
>;

// Helper to create a teleporter key from coordinates
export const getTeleporterKey = (x: number, y: number): string => {
  return `${x},${y}`;
};

// Get teleporter destination for a given level and coordinates
export const getTeleporterDestination = (
  level: number,
  x: number,
  y: number,
  data: TeleporterData
): TeleporterDestination | null => {
  const levelData = data[level];
  if (!levelData) return null;

  const key = getTeleporterKey(x, y);
  return levelData[key] || null;
};

// Teleporter data from: https://zimlab.com/demise/sbeast/iwtele.htm
// Format: level -> "x,y" -> { x, y, level, isRandom? }
// Coordinates are in game format (1-indexed, bottom-left origin)
export const teleporterData: TeleporterData = {
  1: {
    "2,9": { x: 0, y: 0, level: 1, isRandom: true },
    "13,33": { x: 0, y: 0, level: 1, isRandom: true },
    "18,40": { x: 0, y: 0, level: 1, isRandom: true },
    "19,27": { x: 0, y: 0, level: 1, isRandom: true },
    "23,12": { x: 11, y: 35, level: 5, roomName: "Old Library" },
    "25,38": { x: 25, y: 35, level: 1 },
    "32,45": { x: 0, y: 0, level: 1, isRandom: true },
    "39,11": { x: 36, y: 21, level: 2 },
  },
  2: {
    "4,12": { x: 14, y: 21, level: 10 },
    "3,12": { x: 4, y: 3, level: 9, roomName: "Morgoth's Lair" },
    "10,4": { x: 26, y: 35, level: 2, roomName: "Slimy Room" },
    "12,37": { x: 0, y: 0, level: 2, isRandom: true },
    "24,34": { x: 0, y: 0, level: 2, isRandom: true },
    "33,28": { x: 0, y: 0, level: 2, isRandom: true },
    "36,12": { x: 0, y: 0, level: 2, isRandom: true },
    "38,41": { x: 0, y: 0, level: 2, isRandom: true },
    "40,31": { x: 42, y: 42, level: 4, roomName: "Water" },
  },
  3: {
    "5,12": { x: 17, y: 13, level: 4, roomName: "Spinnerville" },
    "38,31": { x: 0, y: 0, level: 3, isRandom: true },
    "7,41": { x: 25, y: 6, level: 3, roomName: "Next to altar in entry room" },
    "42,14": { x: 0, y: 0, level: 3, isRandom: true },
    "4,20": { x: 0, y: 0, level: 3, isRandom: true },
    "38,9": { x: 18, y: 19, level: 1, roomName: "Fountain & Mana orb room" },
  },
  4: {
    "39,7": { x: 0, y: 0, level: 4, isRandom: true },
    "21,37": { x: 0, y: 0, level: 4, isRandom: true },
    "27,23": { x: 0, y: 0, level: 4, isRandom: true },
    "5,2": { x: 0, y: 0, level: 4, isRandom: true },
    "5,1": { x: 44, y: 27, level: 2, roomName: "Outside Aboleth Room" },
    "12,32": { x: 0, y: 0, level: 4, isRandom: true },
    "2,15": { x: 0, y: 0, level: 4, isRandom: true },
    "1,14": { x: 0, y: 0, level: 4, isRandom: true },
  },
  5: {
    "10,45": { x: 0, y: 0, level: 5, isRandom: true },
    "19,8": { x: 0, y: 0, level: 5, isRandom: true },
    "44,45": { x: 0, y: 0, level: 5, isRandom: true },
    "40,1": { x: 0, y: 0, level: 5, isRandom: true },
    "2,16": { x: 0, y: 0, level: 5, isRandom: true },
    "2,13": { x: 0, y: 0, level: 5, isRandom: true },
    "34,22": { x: 0, y: 0, level: 5, isRandom: true },
  },
};

