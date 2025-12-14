// Demise Dungeon Map Tool - Type Definitions

export type TileType =
  // Navigable Terrain
  | "floor"
  | "grass"
  | "dirt"
  | "rock-crystal"
  // Impassable Terrain
  | "wall"
  | "void"
  // Hazardous Terrain
  | "water"
  | "lava"
  | "quicksand"
  | "pit"
  // Special Features
  | "torch"
  | "stairs-down-green"
  | "stairs-down-blue"
  | "stairs-up-blue"
  | "teleporter"
  | "rotator"
  | "anti-magic-zone"
  | "extinguish-zone"
  | "anti-teleport-area"
  | "stud-room"
  // Entities
  | "character"
  | "monster"
  // Items/Objects
  | "barrel"
  | "chest"
  | "item-green"
  | "item-blue"
  | "item-white"
  | "structure";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  features?: TileType[]; // Additional features on this tile (e.g., floor with torch)
  metadata?: {
    description?: string;
    isNavigable?: boolean;
    isHazardous?: boolean;
    requiresLevitation?: boolean;
  };
}

export interface DungeonLevel {
  level: number;
  imagePath: string;
  tiles?: Tile[][]; // 45x45 grid, optional for now
  metadata?: {
    name?: string;
    description?: string;
  };
}

export interface TileHoverState {
  x: number;
  y: number;
  tile: Tile | null;
}

