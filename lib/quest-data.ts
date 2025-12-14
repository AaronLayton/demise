// Demise Quest Data - Quest Spoilers and Locations

export interface QuestLocation {
  x: number; // Game coordinates (1-indexed, bottom-left origin)
  y: number;
  level: number;
  description?: string; // Additional context about the location
}

export interface Quest {
  id: string;
  characterClass: string;
  levelRequirement: number | null; // null for Lord Gherrick quests
  questNumber?: number; // For Lord Gherrick quests
  description: string;
  location: QuestLocation | null; // null if location is vague (e.g., "Search Level X")
  searchDescription?: string; // Description when location is vague
}

export type QuestData = Quest[];

// Helper to parse coordinate strings like "9, 36, 4" or "23, 26" (with level context)
const parseCoordinates = (
  coordStr: string,
  defaultLevel?: number
): QuestLocation | null => {
  // Remove common prefixes and clean up
  let cleaned = coordStr
    .replace(/Level \d+,?\s*/i, "")
    .replace(/-\s*/, "")
    .trim();

  // Try to match patterns like "9, 36, 4" or "23, 26"
  const coordMatch = cleaned.match(/(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?/);
  if (coordMatch) {
    const x = parseInt(coordMatch[1], 10);
    const y = parseInt(coordMatch[2], 10);
    const level = coordMatch[3] ? parseInt(coordMatch[3], 10) : defaultLevel;

    if (level && x >= 1 && x <= 45 && y >= 1 && y <= 45) {
      return { x, y, level };
    }
  }

  return null;
};

// Quest data parsed from user input
export const questData: QuestData = [
  // Lord Gherrick Quests
  {
    id: "gherrick-1",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 1,
    description: "Kill one Slave Driver",
    location: parseCoordinates("9, 36, 4", 4),
    searchDescription: "Enter via stairs in anti-magic area on Level 3",
  },
  {
    id: "gherrick-2",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 2,
    description: "Return Blade Of Sacrifice",
    location: parseCoordinates("2, 12, 5", 5),
    searchDescription: "Kill the norns",
  },
  {
    id: "gherrick-3",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 3,
    description: "Return Swamp Key",
    location: parseCoordinates("7, 18, 6", 6),
  },
  {
    id: "gherrick-4",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 4,
    description: "Return Goblin Lord's Head",
    location: parseCoordinates("25, 30, 6", 6),
  },
  {
    id: "gherrick-5",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 5,
    description: "Kill a Shen'gal",
    location: null,
    searchDescription: "Search Level 7",
  },
  {
    id: "gherrick-6",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 6,
    description: "Return the Stone of Jenal",
    location: parseCoordinates("23, 26", 10),
    searchDescription: "Level 10, Gruk lair",
  },
  {
    id: "gherrick-7",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 7,
    description: "Return the Mengu Bone",
    location: null,
    searchDescription: "Graveyard on 13",
  },
  {
    id: "gherrick-8",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 8,
    description: "Return a Morkal Sorceror",
    location: null,
    searchDescription: "Search Level 13-15",
  },
  {
    id: "gherrick-9",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 9,
    description: "Talk to the Flame Dragon",
    location: parseCoordinates("19, 15, 8", 8),
    searchDescription: "May have to talk to him several times",
  },
  {
    id: "gherrick-10",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 10,
    description: "Return the Parchment Of Victims",
    location: parseCoordinates("15, 25, 17", 17),
  },
  {
    id: "gherrick-11",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 11,
    description: "Kill the Flaming Dragons & return the amulet",
    location: null,
    searchDescription: "Search 17-18. You will actually get another special item instead of the amulet",
  },
  {
    id: "gherrick-12",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 12,
    description: "Return Lead Murderer's Head",
    location: null,
    searchDescription: "Level 17",
  },
  {
    id: "gherrick-13",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 13,
    description: "Talk to the Giant King",
    location: null,
    searchDescription: "???",
  },
  {
    id: "gherrick-14",
    characterClass: "Lord Gherrick",
    levelRequirement: null,
    questNumber: 14,
    description: "Kill the Water Sneaks & return the amulet",
    location: null,
    searchDescription: "Take the water teleporter on level 10. (BEWARE! - This will take you down a long way!)",
  },

  // Artisan Quests
  {
    id: "artisan-8",
    characterClass: "Artisan",
    levelRequirement: 8,
    description: "Kill one Orc",
    location: null,
    searchDescription: "Search Level 2",
  },
  {
    id: "artisan-20",
    characterClass: "Artisan",
    levelRequirement: 20,
    description: "Return Journeyman's Key",
    location: parseCoordinates("3, 45, 2", 2),
    searchDescription: "1st Secret door at 24,38,2",
  },
  {
    id: "artisan-31",
    characterClass: "Artisan",
    levelRequirement: 31,
    description: "Kill one Twisted Dwarf",
    location: parseCoordinates("6, 44, 2", 2),
  },
  {
    id: "artisan-40",
    characterClass: "Artisan",
    levelRequirement: 40,
    description: "Return Feather Leather Armor",
    location: null,
    searchDescription: "Morlochs, Zombies",
  },
  {
    id: "artisan-51",
    characterClass: "Artisan",
    levelRequirement: 51,
    description: "Kill one Scyllama",
    location: null,
    searchDescription: "Search Level 7 (rare)",
  },
  {
    id: "artisan-64",
    characterClass: "Artisan",
    levelRequirement: 64,
    description: "Kill one Wyvern",
    location: null,
    searchDescription: "With Goblin Lord or Search Level 7/8",
  },
  {
    id: "artisan-75",
    characterClass: "Artisan",
    levelRequirement: 75,
    description: "Return Aard Of Being",
    location: null,
    searchDescription: "Try Goblin Shaman, Milsae",
  },
  {
    id: "artisan-88",
    characterClass: "Artisan",
    levelRequirement: 88,
    description: "Kill one Purple Ooze",
    location: null,
    searchDescription: "Search Level 9/10",
  },
  {
    id: "artisan-100",
    characterClass: "Artisan",
    levelRequirement: 100,
    description: "Return with Air Elemental",
    location: null,
    searchDescription: "Search Level 10/11",
  },

  // Barbarian Quests
  {
    id: "barbarian-6",
    characterClass: "Barbarian",
    levelRequirement: 6,
    description: "Kill one Kobold",
    location: null,
    searchDescription: "Search Level 2/3",
  },
  {
    id: "barbarian-15",
    characterClass: "Barbarian",
    levelRequirement: 15,
    description: "Kill one Outcast",
    location: null,
    searchDescription: "Search Level 3/4",
  },
  {
    id: "barbarian-29",
    characterClass: "Barbarian",
    levelRequirement: 29,
    description: "Kill one Outcast Goblin",
    location: null,
    searchDescription: "Search Level 3/4",
  },
  {
    id: "barbarian-42",
    characterClass: "Barbarian",
    levelRequirement: 42,
    description: "Return Giant Badger Skull",
    location: parseCoordinates("39, 30, 6", 6),
    searchDescription: "Kill Azure Giant Badger",
  },
  {
    id: "barbarian-55",
    characterClass: "Barbarian",
    levelRequirement: 55,
    description: "Kill one Norn",
    location: parseCoordinates("2, 12, 5", 5),
  },
  {
    id: "barbarian-67",
    characterClass: "Barbarian",
    levelRequirement: 67,
    description: "Kill one Giant Raven",
    location: null,
    searchDescription: "Search Level 7/8",
  },
  {
    id: "barbarian-80",
    characterClass: "Barbarian",
    levelRequirement: 80,
    description: "Kill one Shape Shifter",
    location: null,
    searchDescription: "Search Levels 9/10",
  },
  {
    id: "barbarian-92",
    characterClass: "Barbarian",
    levelRequirement: 92,
    description: "Kill one Elemental Mage",
    location: null,
    searchDescription: "Search Level 9. (fairly rare)",
  },
  {
    id: "barbarian-100",
    characterClass: "Barbarian",
    levelRequirement: 100,
    description: "Kill one Bloodsucker",
    location: null,
    searchDescription: "Level 7 - Central Area",
  },

  // Cleric Quests
  {
    id: "cleric-8",
    characterClass: "Cleric",
    levelRequirement: 8,
    description: "Kill one Floor Slime",
    location: null,
    searchDescription: "Search Level 1/2",
  },
  {
    id: "cleric-20",
    characterClass: "Cleric",
    levelRequirement: 20,
    description: "Return Slaver",
    location: parseCoordinates("10, 39, 4", 4),
    searchDescription: "Enter through stairs in anti-magic area in Level 3",
  },
  {
    id: "cleric-34",
    characterClass: "Cleric",
    levelRequirement: 34,
    description: "Return Holy Cross Of Enlightenment",
    location: parseCoordinates("41, 1, 4", 4),
    searchDescription: "Drek Villains Room",
  },
  {
    id: "cleric-42",
    characterClass: "Cleric",
    levelRequirement: 42,
    description: "Kill one Large Orc",
    location: null,
    searchDescription: "Search Level 5/6",
  },
  {
    id: "cleric-54",
    characterClass: "Cleric",
    levelRequirement: 54,
    description: "Kill one Centaur",
    location: null,
    searchDescription: "Search Level 6/7",
  },
  {
    id: "cleric-67",
    characterClass: "Cleric",
    levelRequirement: 67,
    description: "Return Red Dragon",
    location: null,
    searchDescription: "Search Level 6/7",
  },
  {
    id: "cleric-75",
    characterClass: "Cleric",
    levelRequirement: 75,
    description: "Return Dust Of Life",
    location: null,
    searchDescription: "Try Mummy",
  },
  {
    id: "cleric-88",
    characterClass: "Cleric",
    levelRequirement: 88,
    description: "Return Silver Cross",
    location: null,
    searchDescription: "Try Yakius, Veyasu",
  },
  {
    id: "cleric-100",
    characterClass: "Cleric",
    levelRequirement: 100,
    description: "Return Grey Cloak",
    location: null,
    searchDescription: "Try ???",
  },

  // Explorer Quests
  {
    id: "explorer-8",
    characterClass: "Explorer",
    levelRequirement: 8,
    description: "Return Iron Dagger",
    location: null,
    searchDescription: "Try Rowdys, Warriors",
  },
  {
    id: "explorer-17",
    characterClass: "Explorer",
    levelRequirement: 17,
    description: "Return Glowing Rock",
    location: null,
    searchDescription: "Try Veyasu",
  },
  {
    id: "explorer-31",
    characterClass: "Explorer",
    levelRequirement: 31,
    description: "Return Pseudo Dragon",
    location: null,
    searchDescription: "Search Level 3/4",
  },
  {
    id: "explorer-42",
    characterClass: "Explorer",
    levelRequirement: 42,
    description: "Return Potion Of Youth",
    location: null,
    searchDescription: "Try Norns, Morlochs, Vomitous Goos, Milsae, Sorcerors",
  },
  {
    id: "explorer-56",
    characterClass: "Explorer",
    levelRequirement: 56,
    description: "Kill one Horda Giant",
    location: null,
    searchDescription: "Search Level 5",
  },
  {
    id: "explorer-64",
    characterClass: "Explorer",
    levelRequirement: 64,
    description: "Return Giant Badger",
    location: null,
    searchDescription: "Search Level 7",
  },
  {
    id: "explorer-76",
    characterClass: "Explorer",
    levelRequirement: 76,
    description: "Return Ancient Scrolls Of Discovery",
    location: null,
    searchDescription: "Level 7 - Lower right of the Swamp",
  },
  {
    id: "explorer-88",
    characterClass: "Explorer",
    levelRequirement: 88,
    description: "Return Dalyn's Grin",
    location: null,
    searchDescription: "Try Orange Gremlins, ?",
  },
  {
    id: "explorer-100",
    characterClass: "Explorer",
    levelRequirement: 100,
    description: "Return Thief's Gloves",
    location: null,
    searchDescription: "Try Rashart(rare), Villains & Cutpurses, or Level 10-12",
  },

  // Magi Quests
  {
    id: "magi-7",
    characterClass: "Magi",
    levelRequirement: 7,
    description: "Return Rowdy",
    location: null,
    searchDescription: "Search Level 2/3",
  },
  {
    id: "magi-17",
    characterClass: "Magi",
    levelRequirement: 17,
    description: "Return Sacred Scroll Of The Magi",
    location: parseCoordinates("36, 14, 3", 3),
  },
  {
    id: "magi-30",
    characterClass: "Magi",
    levelRequirement: 30,
    description: "Return Twisted Dwarf",
    location: parseCoordinates("6, 44, 2", 2),
  },
  {
    id: "magi-42",
    characterClass: "Magi",
    levelRequirement: 42,
    description: "Return Dungeon Bear",
    location: null,
    searchDescription: "Search Level 4/5",
  },
  {
    id: "magi-50",
    characterClass: "Magi",
    levelRequirement: 50,
    description: "Return Namana",
    location: null,
    searchDescription: "Search Level 3",
  },
  {
    id: "magi-63",
    characterClass: "Magi",
    levelRequirement: 63,
    description: "Kill one Rashart",
    location: null,
    searchDescription: "Search Level 8",
  },
  {
    id: "magi-78",
    characterClass: "Magi",
    levelRequirement: 78,
    description: "Return Aard Of Being",
    location: null,
    searchDescription: "Try Goblin Shaman, Milsae",
  },
  {
    id: "magi-87",
    characterClass: "Magi",
    levelRequirement: 87,
    description: "Kill one Goblin Lord",
    location: parseCoordinates("24, 31, 6", 6),
  },
  {
    id: "magi-100",
    characterClass: "Magi",
    levelRequirement: 100,
    description: "Return Black Eel",
    location: null,
    searchDescription: "Water area in NW of Level 9/10",
  },

  // Ninja Quests
  {
    id: "ninja-7",
    characterClass: "Ninja",
    levelRequirement: 7,
    description: "Kill one Footpad",
    location: null,
    searchDescription: "Search Level 2/3",
  },
  {
    id: "ninja-19",
    characterClass: "Ninja",
    levelRequirement: 19,
    description: "Kill one Outcast",
    location: null,
    searchDescription: "Search Level 3/4",
  },
  {
    id: "ninja-29",
    characterClass: "Ninja",
    levelRequirement: 29,
    description: "Return Explorer's Guild Floor Plans",
    location: parseCoordinates("10, 41, 3", 3),
    searchDescription: "Antimagic area in room with Pyramids",
  },
  {
    id: "ninja-40",
    characterClass: "Ninja",
    levelRequirement: 40,
    description: "Return Disciple",
    location: parseCoordinates("2, 12, 5", 5),
    searchDescription: "Level 4, or Level 5 in Norn Room",
  },
  {
    id: "ninja-48",
    characterClass: "Ninja",
    levelRequirement: 48,
    description: "Kill one Dark Giant",
    location: null,
    searchDescription: "Search Level 4",
  },
  {
    id: "ninja-60",
    characterClass: "Ninja",
    levelRequirement: 60,
    description: "Return Te-Waza Of Self Infliction",
    location: null,
    searchDescription: "Try Scavenger",
  },
  {
    id: "ninja-75",
    characterClass: "Ninja",
    levelRequirement: 75,
    description: "Return Daemon",
    location: null,
    searchDescription: "Search Level 6",
  },
  {
    id: "ninja-88",
    characterClass: "Ninja",
    levelRequirement: 88,
    description: "Return Aard Of Being",
    location: null,
    searchDescription: "Try Goblin Shaman, Milsae",
  },
  {
    id: "ninja-100",
    characterClass: "Ninja",
    levelRequirement: 100,
    description: "Return Ravager",
    location: null,
    searchDescription: "Try Geeshi, Frost Giant, Kaneeshi.(Level 9-12 Giants)",
  },

  // Paladin Quests
  {
    id: "paladin-9",
    characterClass: "Paladin",
    levelRequirement: 9,
    description: "Kill one Skeleton",
    location: null,
    searchDescription: "Search Level 3/4",
  },
  {
    id: "paladin-21",
    characterClass: "Paladin",
    levelRequirement: 21,
    description: "Kill one Twisted Dwarf",
    location: parseCoordinates("6, 44, 2", 2),
  },
  {
    id: "paladin-32",
    characterClass: "Paladin",
    levelRequirement: 32,
    description: "Return Tome Of Detachment",
    location: null,
    searchDescription: "Try Skuldragl",
  },
  {
    id: "paladin-44",
    characterClass: "Paladin",
    levelRequirement: 44,
    description: "Return Cross Of Redemption",
    location: null,
    searchDescription: "Try Margoyle, Yakius",
  },
  {
    id: "paladin-51",
    characterClass: "Paladin",
    levelRequirement: 51,
    description: "Return Red Dragon",
    location: null,
    searchDescription: "Search Level 6/7",
  },
  {
    id: "paladin-62",
    characterClass: "Paladin",
    levelRequirement: 62,
    description: "Return Holy Beads",
    location: parseCoordinates("12, 43, 8", 8),
  },
  {
    id: "paladin-77",
    characterClass: "Paladin",
    levelRequirement: 77,
    description: "Kill one Kaelmeon",
    location: null,
    searchDescription: "Search Level 9/10",
  },
  {
    id: "paladin-89",
    characterClass: "Paladin",
    levelRequirement: 89,
    description: "Kill one Dungeon Pirate",
    location: null,
    searchDescription: "Search Level 5/(6?)",
  },
  {
    id: "paladin-100",
    characterClass: "Paladin",
    levelRequirement: 100,
    description: "Return Wraith",
    location: null,
    searchDescription: "Search Level 8-10",
  },

  // Sorceror Quests
  {
    id: "sorceror-5",
    characterClass: "Sorceror",
    levelRequirement: 5,
    description: "Kill one I'ssus",
    location: null,
    searchDescription: "Search Level 3",
  },
  {
    id: "sorceror-16",
    characterClass: "Sorceror",
    levelRequirement: 16,
    description: "Return Scroll Of Mallart",
    location: null,
    searchDescription: "Try Summoners, Diviners, Dimeons",
  },
  {
    id: "sorceror-29",
    characterClass: "Sorceror",
    levelRequirement: 29,
    description: "Kill one Razor Boar",
    location: null,
    searchDescription: "Search Level 4/5",
  },
  {
    id: "sorceror-43",
    characterClass: "Sorceror",
    levelRequirement: 43,
    description: "Return Remains Of Patrak",
    location: parseCoordinates("2, 12, 5", 5),
    searchDescription: "Norn Room",
  },
  {
    id: "sorceror-56",
    characterClass: "Sorceror",
    levelRequirement: 56,
    description: "Return Elf",
    location: null,
    searchDescription: "Search Level 6",
  },
  {
    id: "sorceror-70",
    characterClass: "Sorceror",
    levelRequirement: 70,
    description: "Kill one Scyllama",
    location: null,
    searchDescription: "Search Level 7 (rare)",
  },
  {
    id: "sorceror-81",
    characterClass: "Sorceror",
    levelRequirement: 81,
    description: "Kill one Dwarven Guard",
    location: parseCoordinates("43, 26, 5", 5),
    searchDescription: "Dwarven Mines",
  },
  {
    id: "sorceror-92",
    characterClass: "Sorceror",
    levelRequirement: 92,
    description: "Kill Giant Slug",
    location: null,
    searchDescription: "NE side of Level 6, North of swamp",
  },
  {
    id: "sorceror-100",
    characterClass: "Sorceror",
    levelRequirement: 100,
    description: "Return Nakovant",
    location: null,
    searchDescription: "Swamp on Level 7.(Rare on west of Level 6)",
  },

  // Thief Quests
  {
    id: "thief-7",
    characterClass: "Thief",
    levelRequirement: 7,
    description: "Kill one Orc",
    location: null,
    searchDescription: "Search Level 2",
  },
  {
    id: "thief-20",
    characterClass: "Thief",
    levelRequirement: 20,
    description: "Return Nugena Gloves",
    location: null,
    searchDescription: "Try Rowdy, Brave",
  },
  {
    id: "thief-35",
    characterClass: "Thief",
    levelRequirement: 35,
    description: "Kill one Cutthroat",
    location: null,
    searchDescription: "Search Level 4/5 (Hard!)",
  },
  {
    id: "thief-49",
    characterClass: "Thief",
    levelRequirement: 49,
    description: "Return Skuldragl",
    location: null,
    searchDescription: "Search Level 4",
  },
  {
    id: "thief-55",
    characterClass: "Thief",
    levelRequirement: 55,
    description: "Kill one Scavenger",
    location: null,
    searchDescription: "Search Level 4/5",
  },
  {
    id: "thief-66",
    characterClass: "Thief",
    levelRequirement: 66,
    description: "Return Thief's Chest",
    location: parseCoordinates("41, 33, 7", 7),
  },
  {
    id: "thief-79",
    characterClass: "Thief",
    levelRequirement: 79,
    description: "Return Gloves Of The Blackguard",
    location: null,
    searchDescription: "Try Rowdy, Brave",
  },
  {
    id: "thief-91",
    characterClass: "Thief",
    levelRequirement: 91,
    description: "Kill one Slayer",
    location: null,
    searchDescription: "Search Levels 9-11",
  },
  {
    id: "thief-100",
    characterClass: "Thief",
    levelRequirement: 100,
    description: "Return Amulet Of Flames",
    location: null,
    searchDescription: "Try Old Library on Level 7, Pseudo-dragon",
  },

  // Villain Quests
  {
    id: "villain-5",
    characterClass: "Villain",
    levelRequirement: 5,
    description: "Kill one Slave",
    location: null,
    searchDescription: "Search Level 3",
  },
  {
    id: "villain-18",
    characterClass: "Villain",
    levelRequirement: 18,
    description: "Return Tome Of Agility",
    location: null,
    searchDescription: "Try Kobolds, Outcast Goblin, Orc",
  },
  {
    id: "villain-27",
    characterClass: "Villain",
    levelRequirement: 27,
    description: "Kill one Pseudo-Dragon",
    location: null,
    searchDescription: "Search Level 3/4",
  },
  {
    id: "villain-40",
    characterClass: "Villain",
    levelRequirement: 40,
    description: "Return Paladin's Guild Blueprints",
    location: null,
    searchDescription: "Level 6 - West Central",
  },
  {
    id: "villain-52",
    characterClass: "Villain",
    levelRequirement: 52,
    description: "Return Slave Masher",
    location: null,
    searchDescription: "Search Level 3",
  },
  {
    id: "villain-65",
    characterClass: "Villain",
    levelRequirement: 65,
    description: "Return Steel Shield",
    location: null,
    searchDescription: "Try Warriors",
  },
  {
    id: "villain-79",
    characterClass: "Villain",
    levelRequirement: 79,
    description: "Return Dwarven Guard",
    location: parseCoordinates("43, 26, 5", 5),
    searchDescription: "Dwarven Mines",
  },
  {
    id: "villain-91",
    characterClass: "Villain",
    levelRequirement: 91,
    description: "Kill one Cutpurse",
    location: null,
    searchDescription: "??",
  },
  {
    id: "villain-100",
    characterClass: "Villain",
    levelRequirement: 100,
    description: "Return Tengu",
    location: null,
    searchDescription: "Search Level 2+ (VERY RARE!!)",
  },

  // Warlock Quests
  {
    id: "warlock-7",
    characterClass: "Warlock",
    levelRequirement: 7,
    description: "Kill one Giant Centipede",
    location: null,
    searchDescription: "Search Level 3",
  },
  {
    id: "warlock-19",
    characterClass: "Warlock",
    levelRequirement: 19,
    description: "Return Sacred Scroll Of Wizardry",
    location: parseCoordinates("38, 39, 2", 2),
  },
  {
    id: "warlock-32",
    characterClass: "Warlock",
    levelRequirement: 32,
    description: "Return Pandrun",
    location: null,
    searchDescription: "Search Level 6/7",
  },
  {
    id: "warlock-42",
    characterClass: "Warlock",
    levelRequirement: 42,
    description: "Kill one Outcast",
    location: null,
    searchDescription: "Search Level 4",
  },
  {
    id: "warlock-55",
    characterClass: "Warlock",
    levelRequirement: 55,
    description: "Return Warrior Spirit",
    location: null,
    searchDescription: "Search Level 6/7",
  },
  {
    id: "warlock-68",
    characterClass: "Warlock",
    levelRequirement: 68,
    description: "Kill one Elf",
    location: null,
    searchDescription: "Search Level 6/(7?)",
  },
  {
    id: "warlock-79",
    characterClass: "Warlock",
    levelRequirement: 79,
    description: "Return Potion of Fitness",
    location: null,
    searchDescription: "Try Warrior, Green Slime, Green Ooze, Aboleth",
  },
  {
    id: "warlock-90",
    characterClass: "Warlock",
    levelRequirement: 90,
    description: "Return Ball And Chain",
    location: null,
    searchDescription: "Try Red Dragons?",
  },
  {
    id: "warlock-100",
    characterClass: "Warlock",
    levelRequirement: 100,
    description: "Kill one Purple Ooze",
    location: null,
    searchDescription: "Search Level 8/9",
  },

  // Warrior Quests
  {
    id: "warrior-6",
    characterClass: "Warrior",
    levelRequirement: 6,
    description: "Kill one Giant Owl",
    location: null,
    searchDescription: "Search Level 2",
  },
  {
    id: "warrior-18",
    characterClass: "Warrior",
    levelRequirement: 18,
    description: "Kill one Hiksae",
    location: null,
    searchDescription: "Search Level 2/3",
  },
  {
    id: "warrior-30",
    characterClass: "Warrior",
    levelRequirement: 30,
    description: "Kill one Slave Driver",
    location: parseCoordinates("9, 36, 4", 4),
    searchDescription: "Enter through anti-magic area in Level 3",
  },
  {
    id: "warrior-45",
    characterClass: "Warrior",
    levelRequirement: 45,
    description: "Kill one Nastrum",
    location: null,
    searchDescription: "Search Level 5",
  },
  {
    id: "warrior-56",
    characterClass: "Warrior",
    levelRequirement: 56,
    description: "Return Statue Of Ge'tuk",
    location: parseCoordinates("44, 5, 8", 8),
    searchDescription: "Guarded by Black Wyverns",
  },
  {
    id: "warrior-62",
    characterClass: "Warrior",
    levelRequirement: 62,
    description: "Kill one Goblin Guard",
    location: parseCoordinates("26, 33, 6", 6),
  },
  {
    id: "warrior-75",
    characterClass: "Warrior",
    levelRequirement: 75,
    description: "Return Black Chain Mail",
    location: null,
    searchDescription: "Try Warrior, Brave (rare)",
  },
  {
    id: "warrior-84",
    characterClass: "Warrior",
    levelRequirement: 84,
    description: "Kill one Dwarven Lord",
    location: parseCoordinates("44, 22, 5", 5),
  },
  {
    id: "warrior-100",
    characterClass: "Warrior",
    levelRequirement: 100,
    description: "Kill one Flame Dragon",
    location: parseCoordinates("19, 15, 8", 8),
  },
];

// Helper functions to query quest data
export const getQuestsForLevel = (level: number): Quest[] => {
  return questData.filter((quest) => quest.location?.level === level);
};

export const getQuestsForLocation = (
  level: number,
  x: number,
  y: number
): Quest[] => {
  return questData.filter(
    (quest) =>
      quest.location?.level === level &&
      quest.location?.x === x &&
      quest.location?.y === y
  );
};

export const getQuestsByClass = (characterClass: string): Quest[] => {
  return questData.filter((quest) => quest.characterClass === characterClass);
};
