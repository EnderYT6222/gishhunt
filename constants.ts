import { Fish, Rarity, Rod, Ship, Crew, Achievement, Upgrade } from './types';

export const FISH_TYPES: Fish[] = [
  { id: 'tuna_can', name: 'Literal Can of Tuna', basePrice: 5, rarity: Rarity.COMMON, description: 'Someone threw this in the ocean.', imageEmoji: '🥫', weight: 0.5 },
  { id: 'boot', name: 'Old Boot', basePrice: 1, rarity: Rarity.COMMON, description: 'Not a fish. Still smells like one.', imageEmoji: '👢', weight: 1 },
  { id: 'tiny_tuna', name: 'Tiny Tuna', basePrice: 15, rarity: Rarity.COMMON, description: 'It is trying its best.', imageEmoji: '🐟', weight: 2 },
  { id: 'sardine_tuna', name: 'Sardine in Disguise', basePrice: 10, rarity: Rarity.COMMON, description: 'A sardine wearing a tiny tuna mask.', imageEmoji: '🎭', weight: 0.1 },
  { id: 'skipjack', name: 'Skipjack Tuna', basePrice: 45, rarity: Rarity.UNCOMMON, description: 'Good for salad.', imageEmoji: '🐠', weight: 8 },
  { id: 'spicy_tuna', name: 'Naturally Spicy Tuna', basePrice: 60, rarity: Rarity.UNCOMMON, description: 'Ate too many volcanic peppers.', imageEmoji: '🌶️', weight: 12 },
  { id: 'flying_tuna', name: 'Flying Tuna', basePrice: 75, rarity: Rarity.UNCOMMON, description: 'It jumped out of the water and never came down.', imageEmoji: '🕊️', weight: 10 },
  { id: 'yellowfin', name: 'Yellowfin Tuna', basePrice: 120, rarity: Rarity.RARE, description: 'Now we are talking money.', imageEmoji: '🦈', weight: 25 },
  { id: 'ninja_tuna', name: 'Ninja Tuna', basePrice: 150, rarity: Rarity.RARE, description: 'You didn\'t see it coming.', imageEmoji: '🥷', weight: 20 },
  { id: 'ghost_tuna', name: 'Ghost Tuna', basePrice: 200, rarity: Rarity.RARE, description: 'Transparent. Hard to catch.', imageEmoji: '👻', weight: 0 },
  { id: 'bluefin', name: 'Giant Bluefin', basePrice: 500, rarity: Rarity.EPIC, description: 'The king of sushi.', imageEmoji: '🐋', weight: 250 },
  { id: 'mecha_tuna', name: 'Mecha-Tuna MK-IV', basePrice: 800, rarity: Rarity.EPIC, description: 'Built by tuna scientists to fight Togore.', imageEmoji: '🤖', weight: 500 },
  { id: 'golden_tuna', name: 'Solid Gold Tuna', basePrice: 2500, rarity: Rarity.LEGENDARY, description: 'Heavy and shiny. Togore wants this.', imageEmoji: '✨🐟✨', weight: 50 },
  { id: 'void_tuna', name: 'Void Tuna', basePrice: 3500, rarity: Rarity.LEGENDARY, description: 'Stares back into you.', imageEmoji: '⚫', weight: 0 },
  { id: 'cosmic_tuna', name: 'Cosmic Tuna', basePrice: 10000, rarity: Rarity.TOGORE_BLESSED, description: 'It tastes like stars and math.', imageEmoji: '🌌', weight: 0 },
  { id: 'glitch_tuna', name: 'M̷i̷s̷s̷i̷n̷g̷N̷o̷ Tuna', basePrice: 15000, rarity: Rarity.TOGORE_BLESSED, description: 'Run while you can.', imageEmoji: '👾', weight: 999 },
];

export const RODS: Rod[] = [
  { id: 'twig', name: 'Broken Twig', price: 0, speedMultiplier: 1, luckFactor: 1, description: 'Found in the trash.' },
  { id: 'bamboo', name: 'Bamboo Pole', price: 200, speedMultiplier: 1.5, luckFactor: 1.2, description: 'Reliable and flexible.' },
  { id: 'fiberglass', name: 'Fiberglass Pro', price: 1000, speedMultiplier: 2.5, luckFactor: 1.5, description: 'Sleek and modern.' },
  { id: 'magnet', name: 'Tuna Magnet', price: 5000, speedMultiplier: 4, luckFactor: 2.0, description: 'Scientifically questionable.' },
  { id: 'harpoon', name: 'Laser Harpoon', price: 15000, speedMultiplier: 6, luckFactor: 3.5, description: 'Cooks the fish as you catch it.' },
  { id: 'togore_breath', name: 'Togore\'s Breath', price: 50000, speedMultiplier: 10, luckFactor: 5.0, description: 'Smells terrible, attracts everything.' },
];

export const SHIPS: Ship[] = [
  { id: 'raft', name: 'Driftwood Raft', price: 0, crewCapacity: 1, description: 'It barely floats. Don\'t move too much.' },
  { id: 'dinghy', name: 'Leaky Dinghy', price: 2000, crewCapacity: 3, description: 'Requires bailing water every hour.' },
  { id: 'trawler', name: 'Rustbucket Trawler', price: 10000, crewCapacity: 10, description: 'Smells like diesel and regret.' },
  { id: 'yacht', name: 'Tuna Destroyer 3000', price: 50000, crewCapacity: 25, description: 'Has a jacuzzi for the tuna.' },
  { id: 'mothership', name: 'Togore\'s Ark', price: 250000, crewCapacity: 100, description: 'A floating city dedicated to fish.' },
];

export const CREW: Crew[] = [
  { id: 'intern', name: 'Unpaid Intern', price: 100, cps: 1, description: 'Catches 1 fish every now and then.' },
  { id: 'cat', name: 'Hungry Cat', price: 500, cps: 5, description: 'Very motivated by hunger.' },
  { id: 'fisher', name: 'Local Fisherman', price: 1500, cps: 15, description: 'Knows the good spots.' },
  { id: 'bear', name: 'Grizzly Bear', price: 5000, cps: 60, description: 'Terrifyingly efficient.' },
  { id: 'robot', name: 'Tuna-Bot 9000', price: 20000, cps: 250, description: 'Beep boop. Fish located.' },
];

export const UPGRADES: Upgrade[] = [
  { id: 'burlap_sack', name: 'Burlap Sack', type: 'storage', value: 5, price: 150, description: 'Expands inventory by 5.' },
  { id: 'bucket', name: 'Plastic Bucket', type: 'storage', value: 10, price: 500, description: 'Expands inventory by 10.' },
  { id: 'icebox', name: 'Large Icebox', type: 'storage', value: 25, price: 2500, description: 'Expands inventory by 25.' },
  { id: 'freezer', name: 'Walk-in Freezer', type: 'storage', value: 100, price: 10000, description: 'Expands inventory by 100.' },
  { id: 'corks', name: 'Cork Floats', type: 'buoyancy', value: 0.8, price: 300, description: 'Increases stability. Makes reeling 20% easier.' },
  { id: 'outriggers', name: 'Outriggers', type: 'buoyancy', value: 0.6, price: 1500, description: 'Increases stability. Makes reeling 40% easier.' },
  { id: 'gyro', name: 'Gyro Stabilizer', type: 'buoyancy', value: 0.3, price: 8000, description: 'Maximum stability. Fish practically jump in.' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_fish', name: 'First Blood', description: 'Catch your first fish.', condition: (s) => s.totalFishCaught >= 1, rewardMessage: 'You are now a killer of fish.' },
  { id: 'novice', name: 'Weekend Fisher', description: 'Catch 10 fish.', condition: (s) => s.totalFishCaught >= 10, rewardMessage: 'Keep going.' },
  { id: 'rich', name: 'Tuna Tycoon', description: 'Have $5,000 in your pocket.', condition: (s) => s.money >= 5000, rewardMessage: 'Money smells like fish scales.' },
  { id: 'crew_start', name: 'The Boss', description: 'Hire your first crew member.', condition: (s) => Object.values(s.crewMembers).reduce((a, b) => a + b, 0) >= 1, rewardMessage: 'Delegation is key.' },
  { id: 'fleet', name: 'Captain', description: 'Own the Rustbucket Trawler.', condition: (s) => s.ownedShipId === 'trawler' || s.ownedShipId === 'yacht' || s.ownedShipId === 'mothership', rewardMessage: 'Look at me. I am the captain now.' },
  { id: 'hoarder', name: 'Hoarder', description: 'Upgrade your storage twice.', condition: (s) => s.ownedUpgradeIds.filter(id => id.includes('sack') || id.includes('bucket')).length >= 2, rewardMessage: 'So much room for activities.' },
];

export const APPRAISAL_PROMPTS = [
  "Smells fishy...",
  "Togore is sniffing it...",
  "Examining freshness...",
  "Consulting the fish spirits...",
];