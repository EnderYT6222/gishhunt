export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  TOGORE_BLESSED = 'Togore Blessed'
}

export interface Fish {
  id: string;
  name: string;
  basePrice: number;
  rarity: Rarity;
  description: string;
  imageEmoji: string;
  weight: number;
}

export interface CaughtFish extends Fish {
  uniqueId: string;
  caughtAt: number;
  appraisedValue?: number;
  appraisalComment?: string;
}

export interface Rod {
  id: string;
  name: string;
  price: number;
  speedMultiplier: number; // Higher is faster
  luckFactor: number; // Higher chance of better fish
  description: string;
}

export interface Ship {
  id: string;
  name: string;
  price: number;
  crewCapacity: number;
  description: string;
}

export interface Crew {
  id: string;
  name: string;
  price: number;
  cps: number; // Cash Per Second (passive income)
  description: string;
}

export interface Upgrade {
  id: string;
  name: string;
  type: 'storage' | 'buoyancy';
  value: number;
  price: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
  rewardMessage: string;
}

export interface GameState {
  money: number;
  inventory: CaughtFish[];
  maxInventory: number;
  equippedRodId: string;
  ownedRodIds: string[];
  totalFishCaught: number;
  
  ownedShipId: string;
  crewMembers: { [crewId: string]: number };
  ownedUpgradeIds: string[];
  unlockedAchievements: string[];
}