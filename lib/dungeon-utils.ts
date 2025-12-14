// Demise Dungeon Map Tool - Utility Functions

import type { Tile, TileType } from "./types";

const GRID_SIZE = 45;
// Border offsets: top and left have 4px, bottom and right have 3px
const BORDER_TOP = 4;
const BORDER_LEFT = 4;
const BORDER_BOTTOM = 3;
const BORDER_RIGHT = 3;

/**
 * Calculate tile coordinates from mouse position relative to image
 * Accounts for image borders: 4px top/left, 3px bottom/right
 */
export const getTileCoordinates = (
  mouseX: number,
  mouseY: number,
  imageWidth: number,
  imageHeight: number,
  imageLeft: number,
  imageTop: number
): { x: number; y: number } | null => {
  // Calculate relative position within the image
  const relativeX = mouseX - imageLeft;
  const relativeY = mouseY - imageTop;

  // Check if mouse is within image bounds
  if (
    relativeX < 0 ||
    relativeY < 0 ||
    relativeX > imageWidth ||
    relativeY > imageHeight
  ) {
    return null;
  }

  // Calculate map area (excluding borders)
  const mapWidth = imageWidth - BORDER_LEFT - BORDER_RIGHT;
  const mapHeight = imageHeight - BORDER_TOP - BORDER_BOTTOM;

  // Check if mouse is within the map area (after borders)
  const mapX = relativeX - BORDER_LEFT;
  const mapY = relativeY - BORDER_TOP;

  if (mapX < 0 || mapY < 0 || mapX > mapWidth || mapY > mapHeight) {
    return null;
  }

  // Calculate tile size based on map area
  const tileWidth = mapWidth / GRID_SIZE;
  const tileHeight = mapHeight / GRID_SIZE;

  // Calculate grid coordinates (0-indexed)
  const x = Math.floor(mapX / tileWidth);
  const y = Math.floor(mapY / tileHeight);

  // Clamp to valid range
  const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, x));
  const clampedY = Math.max(0, Math.min(GRID_SIZE - 1, y));

  return { x: clampedX, y: clampedY };
};

/**
 * Get tile size based on image dimensions (accounting for borders)
 */
export const getTileSize = (
  imageWidth: number,
  imageHeight: number
): { width: number; height: number } => {
  const mapWidth = imageWidth - BORDER_LEFT - BORDER_RIGHT;
  const mapHeight = imageHeight - BORDER_TOP - BORDER_BOTTOM;
  return {
    width: mapWidth / GRID_SIZE,
    height: mapHeight / GRID_SIZE,
  };
};

/**
 * Get the map area offset (where the map starts after borders)
 */
export const getMapOffset = (): { left: number; top: number } => {
  return {
    left: BORDER_LEFT,
    top: BORDER_TOP,
  };
};

/**
 * Convert from 0-indexed grid coordinates (top-left origin) to 1-indexed game coordinates (bottom-left origin)
 */
export const toGameCoordinates = (gridX: number, gridY: number): { x: number; y: number } => {
  return {
    x: gridX + 1,
    y: GRID_SIZE - gridY, // Flip Y axis and convert to 1-indexed
  };
};

/**
 * Convert from 1-indexed game coordinates (bottom-left origin) to 0-indexed grid coordinates (top-left origin)
 */
export const toGridCoordinates = (gameX: number, gameY: number): { x: number; y: number } | null => {
  // Validate coordinates
  if (gameX < 1 || gameX > GRID_SIZE || gameY < 1 || gameY > GRID_SIZE) {
    return null;
  }
  return {
    x: gameX - 1,
    y: GRID_SIZE - gameY, // Flip Y axis and convert to 0-indexed
  };
};

/**
 * Create a default tile at given coordinates
 */
export const createDefaultTile = (x: number, y: number): Tile => {
  return {
    x,
    y,
    type: "floor",
    metadata: {
      isNavigable: true,
      isHazardous: false,
    },
  };
};

/**
 * Get tile type name for display
 */
export const getTileTypeName = (type: TileType): string => {
  const names: Record<TileType, string> = {
    floor: "Floor/Path",
    grass: "Grass/Moss",
    dirt: "Dirt/Earth",
    "rock-crystal": "Rock/Crystal",
    wall: "Wall/Rock",
    void: "Void/Dark Room",
    water: "Water",
    lava: "Lava",
    quicksand: "Quicksand",
    pit: "Pit/Chute",
    torch: "Torch",
    "stairs-down-green": "Stairs Down (Green)",
    "stairs-down-blue": "Stairs Down (Blue)",
    "stairs-up-blue": "Stairs Up (Blue)",
    teleporter: "Teleporter",
    rotator: "Rotator",
    "anti-magic-zone": "Anti-Magic Zone",
    "extinguish-zone": "Extinguish Zone",
    "anti-teleport-area": "Anti-Teleport Area",
    "stud-room": "Stud Room",
    character: "Character/NPC",
    monster: "Monster",
    barrel: "Barrel",
    chest: "Chest",
    "item-green": "Item (Green)",
    "item-blue": "Item (Blue)",
    "item-white": "Item (White)",
    structure: "Structure",
  };
  return names[type] || type;
};

/**
 * Get tile type description
 */
export const getTileTypeDescription = (type: TileType): string => {
  const descriptions: Record<TileType, string> = {
    floor: "Navigable walkable paths",
    grass: "Navigable terrain, may have special properties",
    dirt: "Navigable terrain, may indicate special rooms",
    "rock-crystal": "Navigable terrain with crystal formations",
    wall: "Impassable barriers, teleporting into rock causes instant death",
    void: "Inaccessible or very dark rooms",
    water: "Shallow water is harmless, deep water activates breathing timer",
    lava: "Deadly without levitation, items lost permanently",
    quicksand: "Causes damage and item loss unless levitating",
    pit: "Falling causes damage, severity increases with depth",
    torch: "Illumination markers",
    "stairs-down-green": "Descend to lower dungeon level",
    "stairs-down-blue": "Descend to lower dungeon level (different variant)",
    "stairs-up-blue": "Ascend to upper dungeon level",
    teleporter:
      "Transport to specific or random locations, can separate party members",
    rotator: "Randomly changes character direction",
    "anti-magic-zone": "Prevents spell casting",
    "extinguish-zone": "Removes active spells",
    "anti-teleport-area": "Restricts teleportation spells",
    "stud-room": "Contains tougher monsters from deeper levels",
    character: "Player characters or NPCs",
    monster: "Enemy entities",
    barrel: "Containers, may hold items",
    chest: "Containers, may hold items",
    "item-green": "Treasure or special items",
    "item-blue": "Treasure or special items",
    "item-white": "Treasure or special items",
    structure: "Decorative or functional structures",
  };
  return descriptions[type] || "";
};

/**
 * Get tile category for grouping in legend
 */
export const getTileCategory = (type: TileType): string => {
  if (
    ["floor", "grass", "dirt", "rock-crystal"].includes(type)
  ) {
    return "Navigable Terrain";
  }
  if (["wall", "void"].includes(type)) {
    return "Impassable Terrain";
  }
  if (["water", "lava", "quicksand", "pit"].includes(type)) {
    return "Hazardous Terrain";
  }
  if (
    [
      "torch",
      "stairs-down-green",
      "stairs-down-blue",
      "stairs-up-blue",
      "teleporter",
      "rotator",
      "anti-magic-zone",
      "extinguish-zone",
      "anti-teleport-area",
      "stud-room",
    ].includes(type)
  ) {
    return "Special Features";
  }
  if (["character", "monster"].includes(type)) {
    return "Entities";
  }
  if (
    [
      "barrel",
      "chest",
      "item-green",
      "item-blue",
      "item-white",
      "structure",
    ].includes(type)
  ) {
    return "Items/Objects";
  }
  return "Other";
};

/**
 * Get all tile types grouped by category
 */
export const getTileTypesByCategory = (): Record<string, TileType[]> => {
  const categories: Record<string, TileType[]> = {
    "Navigable Terrain": ["floor", "grass", "dirt", "rock-crystal"],
    "Impassable Terrain": ["wall", "void"],
    "Hazardous Terrain": ["water", "lava", "quicksand", "pit"],
    "Special Features": [
      "torch",
      "stairs-down-green",
      "stairs-down-blue",
      "stairs-up-blue",
      "teleporter",
      "rotator",
      "anti-magic-zone",
      "extinguish-zone",
      "anti-teleport-area",
      "stud-room",
    ],
    Entities: ["character", "monster"],
    "Items/Objects": [
      "barrel",
      "chest",
      "item-green",
      "item-blue",
      "item-white",
      "structure",
    ],
  };
  return categories;
};

