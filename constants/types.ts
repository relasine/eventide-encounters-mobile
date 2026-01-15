import { FREE_ACTION, PRIMARY_ACTION } from './index';

export type Blunder = {
  name: string;
  action: string;
};

export type Region =
  | 'Sundessa'
  | 'Mantora'
  | 'Torgul'
  | 'Ridian'
  | 'Jakkar'
  | 'Olma';

export type Encounter = {
  encounterType: string;
  encounterSubtype: string;
  dungeon: Dungeon;
};

export type Dungeon = {
  roomType: string;
  roomSubtype: string | null;
  enemyTable: string | null;
  description: string;
  reward: string | null;
};

export type Enemy = {
  name: string;
  level: number;
  qty: string;
  blunder: Blunder;
  description: string;
  reward: string;
};

export type Behemoth = Omit<Enemy, 'qty'> & {
  health: number;
  attacksPerRound: number;
  attacks:
    | undefined
    | {
        d6: number;
        action: string;
      };
};

export type Ability = {
  name: string;
  action: string;
  trigger: string;
};

export type Escalation = {
  threshold: number;
  description: string;
};

export type BackInTown = string[];

export type MasterBehemoth = {
  name: string;
  region: Region;
  health: number;
  level: number;
  attacksPerRound: number;
  abilities: Ability[];
  rewards: string[];
  description: string[];
  escalation: Escalation[];
  backInTown: BackInTown;
};

export type Event = {
  id: number;
  action: string;
};

export type Lore = {
  name: string;
  description: string;
};

export type Location = {
  name: string;
  description: string;
};

export type Altar = {
  name: string;
  action: string;
  reward: string | null;
};

export type Search = {
  name: string;
  action: string;
};

export type Peril = {
  name: string;
  action: string;
  affects: string;
};

export type WeaponSkill = {
  name: string;
  charges: number;
  actionType: typeof FREE_ACTION | typeof PRIMARY_ACTION;
  action: string;
};

export type Treasure = {
  name: string;
  action: string;
};

export type LuniteShardOrShield = {
  name: string;
  type: 'Lunite Shard' | 'Shield';
  action: string;
  stacking: null | 'stacking' | 'non-stacking' | 'stacking x2';
};

export type LuniteShard = {
  name: string;
  action: string;
  stacking: null | 'stacking' | 'non-stacking' | 'stacking x2';
  isEquipped: boolean | null;
};

export type DungeonWithImage = Dungeon & {
  image: string;
};

export type GeneratedDungeon = DungeonWithImage & {
  dungeonNumber: number;
} & ({ enemy: Behemoth | Enemy } | { peril: Peril } | { event: Event });

export type BehemothDungeon = DungeonWithImage & {
  dungeonNumber: number;
  enemy: Behemoth;
};

export type EnemyDungeon = DungeonWithImage & {
  dungeonNumber: number;
  enemy: Enemy;
};

export type EventDungeon = DungeonWithImage & {
  dungeonNumber: number;
  event: Event;
};

export type PerilDungeon = DungeonWithImage & {
  dungeonNumber: number;
  peril: Peril;
};

export type BacktrackResult = {
  ambushed: boolean;
  ambushResult: Enemy | null;
};

export type randomRolls = 'd4' | 'd6' | '2d6' | '2d6^';

export type Character = {
  name: string;
  race: RaceType;
  class: ClassType;
  level: number;
  attack: string;
  surges: number;
  defense: string;
  maxHealth: number;
  currentHealth: number;
  position: 1 | 2 | 3 | 4 | null;
  id: string;
  glowstone: number;
  essence: number;
  statuses: string[];
  backpack: BackpackItem[];
  weaponsAndShield: EquippedWeaponsOrShields;
};

export type EquippedWeaponOrShield = Weapon | Shield;

export type Weapon = {
  handed: 1 | 2;
  type: 'melee' | 'ranged' | 'arcane';
  name: string;
  maxCharges: 1 | 2 | 3 | 4 | 5 | null;
  currentCharge: 0 | 1 | 2 | 3 | 4 | 5 | null;
  abilityName: string | null;
  ability: string | null;
  actionType: 'free action' | 'primary action' | null;
};

export type Shield = {
  name: string;
  ability: string;
};

export type EquippedWeaponsOrShields =
  | []
  | [EquippedWeaponOrShield]
  | [EquippedWeaponOrShield, EquippedWeaponOrShield]
  | [EquippedWeaponOrShield, EquippedWeaponOrShield, EquippedWeaponOrShield]
  | [
      EquippedWeaponOrShield,
      EquippedWeaponOrShield,
      EquippedWeaponOrShield,
      EquippedWeaponOrShield,
    ];

export type BackpackItem =
  | {
      name: string;
      description: string;
    }
  | LuniteShard;

export type RaceType = {
  name: string;
  archetypes: string[];
  health: number;
  attack: string;
  defense: string;
  racialAbility: {
    name: string;
    ability: string;
  };
  description: string;
};

export type ClassType = {
  name: string;
  tier: string;
  archetype: string[];
  classAbility: {
    name: string;
    ability: string;
  };
  classPassive: string;
  description: string;
};
