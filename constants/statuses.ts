import { Region } from './types';

const COMBAT = 'combat';
const ROUND = 'round';

export type StatusType = {
  name: string;
  effect: string | null;
  duration: 'combat' | 'round';
  regions: Region[];
};

const SUNDESSA = 'Sundessa';
const MANTORA = 'Mantora';
const TORGUL = 'Torgul';
const RIDIAN = 'Ridian';
const JAKKAR = 'Jakkar';
const OLMA = 'Olma';

export const statuses: StatusType[] = [
  {
    name: 'Thousand Teeth',
    effect: 'DEF -1',
    duration: COMBAT,
    regions: [SUNDESSA],
  },
  {
    name: 'Death Charge',
    effect: 'DEF -1',
    duration: 'round',
    regions: [SUNDESSA],
  },
  {
    name: 'Blind',
    effect: 'DEF -2',
    duration: COMBAT,
    regions: [MANTORA, TORGUL],
  },
  {
    name: 'Scream',
    effect: 'Lose your next Primary Action',
    duration: COMBAT,
    regions: [MANTORA],
  },
  {
    name: 'Bone Spike',
    effect:
      'Take 1 DMG each time you take a Primary Action. To remove the spike take a Free Action and pass a Check (4).',
    duration: COMBAT,
    regions: [MANTORA],
  },
  {
    name: 'Bone Spur',
    effect:
      'Take 1 DMG each time you take a Primary Action. To remove the spike take a Free Action and pass a Check (4).',
    duration: COMBAT,
    regions: [JAKKAR],
  },
  {
    name: 'Terrify',
    effect: 'ATK -1 & DEF -1',
    duration: COMBAT,
    regions: [MANTORA, RIDIAN],
  },
  {
    name: 'Terrify',
    effect: 'ATK -2 & DEF -1',
    duration: COMBAT,
    regions: [OLMA],
  },
  {
    name: 'Cursed',
    effect: 'Cannot be healed or buffed',
    duration: COMBAT,
    regions: [TORGUL, JAKKAR, OLMA],
  },
  {
    name: 'Cripple',
    effect: 'ATK -2',
    duration: COMBAT,
    regions: [MANTORA, JAKKAR],
  },
  {
    name: 'Snare',
    effect: 'Lose your next Primary action',
    duration: 'round',
    regions: [MANTORA],
  },
  {
    name: 'Soul Shatter',
    effect: "Next time you're attacked, you don't get a DEF roll",
    duration: COMBAT,
    regions: [TORGUL],
  },
  {
    name: 'Elemental Vines',
    effect: 'You cannot gain new Surges',
    duration: COMBAT,
    regions: [TORGUL],
  },
  {
    name: 'Burn',
    effect: 'Take 1 DMG at the end of each round',
    duration: COMBAT,
    regions: [TORGUL, RIDIAN],
  },
  {
    name: 'Sludge',
    effect:
      'Your Equipped weapons become unusable until you take a Primary action to clean them',
    duration: COMBAT,
    regions: [TORGUL],
  },
  {
    name: 'Mayhem',
    effect: 'DEF -2',
    duration: COMBAT,
    regions: [TORGUL],
  },
  {
    name: 'Talon Grab',
    effect:
      "Primary actions can only be used to Check (3) to free yourself. If you're still held at the end of your turn, take 1 DMG.",
    duration: COMBAT,
    regions: [TORGUL],
  },
  {
    name: 'Stun',
    effect: 'Hero misses their next turn',
    duration: ROUND,
    regions: [TORGUL, OLMA],
  },
  {
    name: 'Webshot',
    effect: 'Lose your next Primary Action',
    duration: COMBAT,
    regions: [RIDIAN],
  },
  {
    name: 'Claw Latch',
    effect: 'DEF -2',
    duration: COMBAT,
    regions: [RIDIAN],
  },
  {
    name: 'Stalked',
    effect: 'Take 1 DMG any time you use a Surge from any source',
    duration: COMBAT,
    regions: [RIDIAN],
  },
  {
    name: 'Bleed',
    effect: 'Take 1 DMG at the start of your turn',
    duration: COMBAT,
    regions: [RIDIAN, OLMA, TORGUL, JAKKAR],
  },
  {
    name: 'Swarming Limbs',
    effect: 'Lose all Free Actions until the end of your next turn',
    duration: ROUND,
    regions: [RIDIAN],
  },
  {
    name: 'Claw Bash',
    effect: 'Lose your defense rolls until the start of your next turn',
    duration: ROUND,
    regions: [JAKKAR],
  },
  {
    name: 'Feeble',
    effect: 'Take +1 DMG each time you are hit by an attack',
    duration: COMBAT,
    regions: [JAKKAR, OLMA],
  },
  {
    name: 'Poison',
    effect:
      'Check (4) or suffer ATK -1 and DEF -1 at the start of each turn (stacking)',
    duration: COMBAT,
    regions: [OLMA],
  },
  {
    name: 'Earthstrike',
    effect: 'Suffer DEF -3 until your next turn',
    duration: ROUND,
    regions: [OLMA],
  },
  {
    name: 'ATK +1',
    effect: '',
    duration: COMBAT,
    regions: [SUNDESSA, MANTORA, TORGUL, RIDIAN, JAKKAR, OLMA],
  },
  {
    name: 'ATK +2',
    effect: '',
    duration: COMBAT,
    regions: [SUNDESSA, MANTORA, TORGUL, RIDIAN, JAKKAR, OLMA],
  },
  {
    name: 'DEF +1',
    effect: '',
    duration: COMBAT,
    regions: [SUNDESSA, MANTORA, TORGUL, RIDIAN, JAKKAR, OLMA],
  },
  {
    name: 'DEF +2',
    effect: '',
    duration: COMBAT,
    regions: [SUNDESSA, MANTORA, TORGUL, RIDIAN, JAKKAR, OLMA],
  },
  {
    name: 'ATK +3',
    effect: '',
    duration: COMBAT,
    regions: [SUNDESSA, MANTORA, TORGUL, RIDIAN, JAKKAR, OLMA],
  },
  {
    name: 'DEF +3',
    effect: '',
    duration: COMBAT,
    regions: [SUNDESSA, MANTORA, TORGUL, RIDIAN, JAKKAR, OLMA],
  },
];
