import React, { useState } from 'react';
import { CaughtFish, Rarity } from '../types';
import { appraiseFish } from '../services/geminiService';

interface InventoryProps {
  items: CaughtFish[];
  maxInventory: number;
  onSell: (fishId: string, price: number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, maxInventory, onSell }) => {
  const [selectedFish, setSelectedFish] = useState<CaughtFish | null>(null);
  const [isAppraising, setIsAppraising] = useState(false);
  const [appraisal, setAppraisal] = useState<{value: number, comment: string} | null>(null);

  const handleSelect = (fish: CaughtFish) => {
    setSelectedFish(fish);
    setAppraisal(null); // Reset appraisal when selecting new fish
  };

  const handleAskTogore = async () => {
    if (!selectedFish) return;
    setIsAppraising(true);
    const result = await appraiseFish(selectedFish);
    setAppraisal(result);
    setIsAppraising(false);
  };

  const handleSell = () => {
    if (!selectedFish) return;
    const price = appraisal ? appraisal.value : selectedFish.basePrice;
    onSell(selectedFish.uniqueId, price);
    setSelectedFish(null);
    setAppraisal(null);
  };

  const getRarityColor = (r: Rarity) => {
    switch (r) {
      case Rarity.COMMON: return 'text-gray-400';
      case Rarity.UNCOMMON: return 'text-green-400';
      case Rarity.RARE: return 'text-blue-400';
      case Rarity.EPIC: return 'text-purple-400';
      case Rarity.LEGENDARY: return 'text-yellow-400';
      case Rarity.TOGORE_BLESSED: return 'text-red-500 animate-pulse';
      default: return 'text-white';
    }
  };

  const isFull = items.length >= maxInventory;

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg p-4 border-2 border-slate-600 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold pixel-font text-yellow-400">Cool Box</h2>
        <div className={`px-2 py-1 rounded text-xs font-bold ${isFull ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-gray-300'}`}>
          {items.length} / {maxInventory}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2 mb-4 pr-2 content-start">
        {items.length === 0 && (
          <div className="col-span-4 text-center text-gray-500 py-10">
            No tuna yet. Get fishing!
          </div>
        )}
        {items.map(fish => (
          <button
            key={fish.uniqueId}
            onClick={() => handleSelect(fish)}
            className={`aspect-square rounded flex items-center justify-center text-2xl transition-all relative group ${selectedFish?.uniqueId === fish.uniqueId ? 'bg-blue-600 ring-2 ring-white scale-110 z-10' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {fish.imageEmoji}
            <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full m-1 ${fish.rarity === Rarity.LEGENDARY ? 'bg-yellow-400' : 'bg-transparent'}`}></div>
          </button>
        ))}
        
        {/* Empty slots visualization (optional, showing first few empty) */}
        {Array.from({ length: Math.min(4, Math.max(0, maxInventory - items.length)) }).map((_, i) => (
           <div key={`empty-${i}`} className="aspect-square rounded bg-slate-900/30 border border-slate-700/50 flex items-center justify-center">
             <span className="text-slate-700 text-xs">Empty</span>
           </div>
        ))}
      </div>

      {/* Selected Fish Details Panel */}
      <div className="h-64 bg-slate-900 rounded p-4 flex flex-col justify-between border-t-4 border-slate-700 shadow-xl">
        {selectedFish ? (
          <>
            <div>
              <div className="flex justify-between items-start">
                <h3 className={`font-bold text-lg ${getRarityColor(selectedFish.rarity)}`}>{selectedFish.name}</h3>
                <span className="text-[10px] bg-slate-700 px-2 py-1 rounded uppercase tracking-wider text-gray-300">{selectedFish.rarity}</span>
              </div>
              <p className="text-gray-400 text-sm italic mt-1 line-clamp-2">{selectedFish.description}</p>
              
              <div className="mt-4 p-2 bg-slate-800 rounded border border-slate-700 min-h-[80px] flex flex-col justify-center">
                 {appraisal ? (
                   <div className="animate-fade-in">
                     <p className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-wide">Togore Says:</p>
                     <p className="text-sm text-white italic">"{appraisal.comment}"</p>
                     <p className="text-right font-bold text-green-400 mt-1">Valued at: ${appraisal.value}</p>
                   </div>
                 ) : (
                    <div className="flex justify-between items-center px-2">
                      <span className="text-gray-400 text-sm">Base Value:</span>
                      <span className="font-bold text-white">${selectedFish.basePrice}</span>
                    </div>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
               {!appraisal && (
                 <button 
                  onClick={handleAskTogore}
                  disabled={isAppraising}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
                >
                  {isAppraising ? 'Asking...' : 'Ask Togore'}
                </button>
               )}
               
               <button 
                onClick={handleSell}
                className={`bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-lg shadow-green-900/20 ${appraisal ? 'col-span-2' : ''}`}
              >
                Sell for ${appraisal ? appraisal.value : selectedFish.basePrice}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm opacity-50">
            <span className="text-4xl mb-2">🐟</span>
            Select a fish to inspect
          </div>
        )}
      </div>
    </div>
  );
};