import React, { useState, useEffect, useCallback } from 'react';
import { Rod, CaughtFish, Fish, Rarity } from '../types';
import { FISH_TYPES } from '../constants';

interface FishingZoneProps {
  currentRod: Rod;
  onCatch: (fish: CaughtFish) => void;
  inventoryFull: boolean;
  difficultyMultiplier: number; // Controlled by Buoyancy upgrades (lower is easier)
}

export const FishingZone: React.FC<FishingZoneProps> = ({ currentRod, onCatch, inventoryFull, difficultyMultiplier }) => {
  const [fishingState, setFishingState] = useState<'idle' | 'casting' | 'waiting' | 'reeling'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Click to Cast!");
  
  const determineCatch = useCallback(() => {
    // Calculate total weight based on rarity
    // Luck factor increases chance of better fish
    const roll = Math.random() * (1 + (currentRod.luckFactor * 0.2)); 
    
    let pool: Fish[] = [];
    
    if (roll > 0.98) pool = FISH_TYPES.filter(f => f.rarity === Rarity.TOGORE_BLESSED || f.rarity === Rarity.LEGENDARY);
    else if (roll > 0.90) pool = FISH_TYPES.filter(f => f.rarity === Rarity.EPIC);
    else if (roll > 0.75) pool = FISH_TYPES.filter(f => f.rarity === Rarity.RARE);
    else if (roll > 0.50) pool = FISH_TYPES.filter(f => f.rarity === Rarity.UNCOMMON);
    else pool = FISH_TYPES.filter(f => f.rarity === Rarity.COMMON);

    if (pool.length === 0) pool = FISH_TYPES.filter(f => f.rarity === Rarity.COMMON);

    const fish = pool[Math.floor(Math.random() * pool.length)];
    return fish;
  }, [currentRod]);

  const startFishing = () => {
    if (inventoryFull) {
      setMessage("Inventory Full! Sell Fish!");
      return;
    }
    if (fishingState !== 'idle') return;
    setFishingState('casting');
    setMessage("Casting...");
    
    setTimeout(() => {
      setFishingState('waiting');
      setMessage("Waiting for bite...");
    }, 500);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (fishingState === 'waiting') {
      // Random wait time reduced by rod speed
      const waitTime = Math.max(500, (Math.random() * 4000) / (currentRod.speedMultiplier * 0.5));
      
      timeout = setTimeout(() => {
        setFishingState('reeling');
        setMessage("HOOKED! CLICK FAST!");
        setProgress(30); // Start with some tension
      }, waitTime);
    }

    return () => clearTimeout(timeout);
  }, [fishingState, currentRod]);

  const handleReelClick = () => {
    if (fishingState !== 'reeling') return;

    // Add progress based on rod speed
    const increment = 10 * Math.sqrt(currentRod.speedMultiplier);
    const newProgress = progress + increment;

    if (newProgress >= 100) {
      // Caught!
      const caughtFishTemplate = determineCatch();
      const newFish: CaughtFish = {
        ...caughtFishTemplate,
        uniqueId: Math.random().toString(36).substr(2, 9),
        caughtAt: Date.now()
      };
      
      onCatch(newFish);
      setFishingState('idle');
      setProgress(0);
      setMessage(`Caught ${newFish.name}!`);
      setTimeout(() => setMessage("Click to Cast!"), 2000);
    } else {
      setProgress(newProgress);
    }
  };

  // Tension decay mechanic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (fishingState === 'reeling') {
      interval = setInterval(() => {
        setProgress(prev => {
          // Difficulty affected by Buoyancy (difficultyMultiplier)
          const baseDrop = 5; 
          const drop = baseDrop * difficultyMultiplier;
          const next = prev - drop;
          if (next <= 0) {
            setFishingState('idle');
            setMessage("It got away...");
            setTimeout(() => setMessage("Click to Cast!"), 2000);
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [fishingState, difficultyMultiplier]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-sky-300 rounded-xl shadow-inner border-4 border-sky-500 relative overflow-hidden h-96 w-full max-w-2xl mx-auto group select-none">
      {/* Visual Ocean Background */}
      <div className="absolute bottom-0 w-full h-1/2 bg-blue-600 opacity-50 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10px] w-full h-1/2 bg-blue-700 opacity-40 animate-float pointer-events-none"></div>
      
      {/* Character / Rod Visualization */}
      <div className="z-10 text-6xl mb-4 animate-wiggle cursor-pointer transition-transform active:scale-95" onClick={fishingState === 'idle' ? startFishing : handleReelClick}>
        {fishingState === 'idle' && (inventoryFull ? '🚫' : '🎣')}
        {fishingState === 'casting' && '🗯️'}
        {fishingState === 'waiting' && '💤'}
        {fishingState === 'reeling' && '❗🎣❗'}
      </div>

      <div className="z-10 text-2xl font-bold text-blue-900 pixel-font text-center mb-4 min-h-[64px]">
        {message}
      </div>

      {fishingState === 'reeling' && (
        <div className="w-64 h-8 bg-gray-700 rounded-full border-2 border-white relative z-10 overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${progress > 70 ? 'bg-green-500' : progress > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {fishingState === 'idle' && (
        <button 
          onClick={startFishing}
          disabled={inventoryFull}
          className={`z-10 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-full shadow-lg transform transition border-b-4 border-yellow-600 pixel-font ${inventoryFull ? 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-600' : 'hover:scale-105 active:scale-95'}`}
        >
          {inventoryFull ? 'FULL' : 'CAST LINE'}
        </button>
      )}

      {fishingState === 'reeling' && (
         <button 
         onClick={handleReelClick}
         className="z-10 mt-4 bg-red-500 hover:bg-red-400 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.7)] transform active:scale-90 pixel-font animate-pulse"
       >
         REEL!!!
       </button>
      )}
      
      {inventoryFull && fishingState === 'idle' && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-bounce">
          FULL!
        </div>
      )}
    </div>
  );
};