import React, { useState, useEffect } from 'react';
import { CaughtFish, GameState, Rod, Ship, Crew, Upgrade } from './types';
import { RODS, SHIPS, CREW, UPGRADES, ACHIEVEMENTS } from './constants';
import { FishingZone } from './components/FishingZone';
import { Inventory } from './components/Inventory';
import { Shop } from './components/Shop';
import { Achievements } from './components/Achievements';

const App: React.FC = () => {
  // Load initial state or defaults
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('togore_tuna_hunt_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for old saves and new features
      if (!parsed.ownedShipId) parsed.ownedShipId = SHIPS[0].id;
      if (!parsed.crewMembers) parsed.crewMembers = {};
      if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
      if (!parsed.maxInventory) parsed.maxInventory = 10;
      if (!parsed.ownedUpgradeIds) parsed.ownedUpgradeIds = [];
      return parsed;
    }
    return {
      money: 0,
      inventory: [],
      maxInventory: 10,
      equippedRodId: RODS[0].id,
      ownedRodIds: [RODS[0].id],
      totalFishCaught: 0,
      ownedShipId: SHIPS[0].id,
      crewMembers: {},
      ownedUpgradeIds: [],
      unlockedAchievements: []
    };
  });

  const [showSettings, setShowSettings] = useState(false);

  // Persist state
  useEffect(() => {
    localStorage.setItem('togore_tuna_hunt_v2', JSON.stringify(gameState));
  }, [gameState]);

  // Derived state
  const currentRod = RODS.find(r => r.id === gameState.equippedRodId) || RODS[0];
  const currentShip = SHIPS.find(s => s.id === gameState.ownedShipId) || SHIPS[0];

  // Calculate stats from upgrades
  const calculateBuoyancyMultiplier = () => {
    let multiplier = 1;
    gameState.ownedUpgradeIds.forEach(id => {
      const upgrade = UPGRADES.find(u => u.id === id);
      if (upgrade && upgrade.type === 'buoyancy') {
        multiplier *= upgrade.value; // Multiplicative stacking for ease (0.8 * 0.8 = 0.64 difficulty)
      }
    });
    return multiplier;
  };

  const buoyancyDifficulty = calculateBuoyancyMultiplier();

  // Calculate Passive Income
  const calculateCPS = () => {
    let cps = 0;
    Object.entries(gameState.crewMembers).forEach(([crewId, count]) => {
      const crew = CREW.find(c => c.id === crewId);
      if (crew) {
        cps += crew.cps * count;
      }
    });
    return cps;
  };

  const currentCPS = calculateCPS();

  // Passive Income Loop
  useEffect(() => {
    if (currentCPS === 0) return;
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        money: prev.money + currentCPS
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentCPS]);

  // Achievement Check Loop
  useEffect(() => {
    const checkAchievements = () => {
      const newUnlocks: string[] = [];
      ACHIEVEMENTS.forEach(ach => {
        if (!gameState.unlockedAchievements.includes(ach.id) && ach.condition(gameState)) {
          newUnlocks.push(ach.id);
        }
      });

      if (newUnlocks.length > 0) {
        setGameState(prev => ({
          ...prev,
          unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocks]
        }));
      }
    };
    
    checkAchievements();
  }, [gameState.money, gameState.totalFishCaught, gameState.inventory, gameState.crewMembers, gameState.ownedShipId, gameState.ownedUpgradeIds]);


  const handleCatch = (fish: CaughtFish) => {
    if (gameState.inventory.length >= gameState.maxInventory) return; // double check

    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, fish],
      totalFishCaught: prev.totalFishCaught + 1
    }));
  };

  const handleSell = (fishId: string, price: number) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + price,
      inventory: prev.inventory.filter(f => f.uniqueId !== fishId)
    }));
  };

  const handleBuyRod = (rod: Rod) => {
    if (gameState.money >= rod.price && !gameState.ownedRodIds.includes(rod.id)) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - rod.price,
        ownedRodIds: [...prev.ownedRodIds, rod.id],
        equippedRodId: rod.id // Auto equip
      }));
    }
  };

  const handleEquipRod = (rodId: string) => {
    if (gameState.ownedRodIds.includes(rodId)) {
      setGameState(prev => ({ ...prev, equippedRodId: rodId }));
    }
  };

  const handleBuyShip = (ship: Ship) => {
    if (gameState.money >= ship.price) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - ship.price,
        ownedShipId: ship.id
      }));
    }
  };

  const handleBuyCrew = (crew: Crew) => {
    const currentCrewCount = Object.values(gameState.crewMembers).reduce((a, b) => a + b, 0);
    if (gameState.money >= crew.price && currentCrewCount < currentShip.crewCapacity) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - crew.price,
        crewMembers: {
          ...prev.crewMembers,
          [crew.id]: (prev.crewMembers[crew.id] || 0) + 1
        }
      }));
    }
  };

  const handleBuyUpgrade = (upgrade: Upgrade) => {
    if (gameState.money >= upgrade.price && !gameState.ownedUpgradeIds.includes(upgrade.id)) {
      setGameState(prev => {
        let newMaxInv = prev.maxInventory;
        if (upgrade.type === 'storage') {
          newMaxInv += upgrade.value;
        }
        
        return {
          ...prev,
          money: prev.money - upgrade.price,
          ownedUpgradeIds: [...prev.ownedUpgradeIds, upgrade.id],
          maxInventory: newMaxInv
        };
      });
    }
  };

  const handleResetGame = () => {
    if (confirm("WAIT! Are you sure you want to delete your save? Togore will eat all your progress.")) {
      localStorage.removeItem('togore_tuna_hunt_v2');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-2 lg:p-6 font-sans relative">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 p-6 rounded-lg border-2 border-slate-600 max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 pixel-font text-yellow-400">Settings</h2>
            
            <div className="mb-6 space-y-2">
              <p className="text-gray-300 text-sm">Game saves automatically.</p>
              <div className="flex items-center gap-2 text-green-400 text-xs font-mono border border-green-900 bg-green-900/20 p-2 rounded">
                <span className="animate-pulse">●</span> Autosave Active
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
              <button 
                onClick={handleResetGame}
                className="w-full bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white border border-red-800 p-3 rounded font-bold transition-colors"
              >
                HARD RESET GAME
              </button>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white p-2 rounded font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <header className="mb-6 text-center relative">
        <button 
          onClick={() => setShowSettings(true)}
          className="absolute right-0 top-0 p-2 text-slate-500 hover:text-white transition-colors"
          title="Settings"
        >
          ⚙️
        </button>

        <h1 className="text-3xl lg:text-5xl text-yellow-400 pixel-font drop-shadow-lg mb-2">
          TOGORE'S TUNA HUNT
        </h1>
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-wrap justify-center gap-4 text-sm lg:text-base font-mono bg-black/40 p-2 rounded-full px-6 border border-gray-700">
             <span className="flex items-center gap-2">💰 <span className="text-green-400 text-lg font-bold">${gameState.money.toLocaleString()}</span></span>
             <span className="text-gray-500">|</span>
             <span className="flex items-center gap-2">🐟 <span>{gameState.totalFishCaught}</span></span>
             <span className="text-gray-500">|</span>
             <span className="flex items-center gap-2 text-blue-300">🚢 {currentShip.name}</span>
          </div>
          {currentCPS > 0 && (
            <div className="text-xs text-green-400 animate-pulse font-mono">
              +${currentCPS}/sec from Crew
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Fishing Zone (Top on Mobile) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <FishingZone 
            currentRod={currentRod}
            onCatch={handleCatch}
            inventoryFull={gameState.inventory.length >= gameState.maxInventory}
            difficultyMultiplier={buoyancyDifficulty}
          />
          
          <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800 shadow-lg">
            <h3 className="text-blue-300 font-bold mb-2 text-sm uppercase tracking-wider">Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-950 p-2 rounded">
                 <span className="block text-[10px] text-gray-400 uppercase">Rod</span>
                 <span className="font-bold text-white text-xs">{currentRod.name}</span>
              </div>
              <div className="bg-blue-950 p-2 rounded">
                 <span className="block text-[10px] text-gray-400 uppercase">Multipliers</span>
                 <span className="font-bold text-yellow-400 text-xs">⚡{currentRod.speedMultiplier}x <span className="text-gray-600">|</span> 🍀{currentRod.luckFactor}x</span>
              </div>
              <div className="bg-blue-950 p-2 rounded">
                 <span className="block text-[10px] text-gray-400 uppercase">Stability</span>
                 <span className="font-bold text-cyan-400 text-xs">{Math.round((1 - buoyancyDifficulty) * 100)}% Boost</span>
              </div>
              <div className="bg-blue-950 p-2 rounded">
                 <span className="block text-[10px] text-gray-400 uppercase">Capacity</span>
                 <span className={`font-bold text-xs ${gameState.inventory.length >= gameState.maxInventory ? 'text-red-500' : 'text-orange-400'}`}>
                   {gameState.inventory.length} / {gameState.maxInventory}
                 </span>
              </div>
            </div>
          </div>

           <div className="h-64 lg:h-auto lg:flex-1">
              <Achievements unlockedIds={gameState.unlockedAchievements} />
           </div>
        </div>

        {/* Right Column: Inventory & Shop */}
        {/* Adjusted to be auto height on mobile, fixed on desktop */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:h-[600px]">
          <div className="h-[500px] md:h-full overflow-hidden shadow-lg">
            <Inventory 
              items={gameState.inventory} 
              maxInventory={gameState.maxInventory}
              onSell={handleSell} 
            />
          </div>
          <div className="h-[500px] md:h-full overflow-hidden shadow-lg">
            <Shop 
              money={gameState.money}
              ownedRodIds={gameState.ownedRodIds}
              equippedRodId={gameState.equippedRodId}
              ownedShipId={gameState.ownedShipId}
              crewCounts={gameState.crewMembers}
              ownedUpgradeIds={gameState.ownedUpgradeIds}
              onBuyRod={handleBuyRod}
              onEquipRod={handleEquipRod}
              onBuyShip={handleBuyShip}
              onBuyCrew={handleBuyCrew}
              onBuyUpgrade={handleBuyUpgrade}
            />
          </div>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-slate-600 text-xs pb-4">
        <p>Game data saves automatically to your browser.</p>
        <p className="mt-1 font-mono">v2.1.0 • Togore Industries</p>
      </footer>
    </div>
  );
};

export default App;