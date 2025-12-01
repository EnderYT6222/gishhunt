import React, { useState } from 'react';
import { Rod, Ship, Crew, Upgrade } from '../types';
import { RODS, SHIPS, CREW, UPGRADES } from '../constants';

interface ShopProps {
  money: number;
  ownedRodIds: string[];
  equippedRodId: string;
  ownedShipId: string;
  crewCounts: { [id: string]: number };
  ownedUpgradeIds: string[];
  onBuyRod: (rod: Rod) => void;
  onEquipRod: (rodId: string) => void;
  onBuyShip: (ship: Ship) => void;
  onBuyCrew: (crew: Crew) => void;
  onBuyUpgrade: (upgrade: Upgrade) => void;
}

export const Shop: React.FC<ShopProps> = ({ 
  money, 
  ownedRodIds, 
  equippedRodId, 
  ownedShipId,
  crewCounts,
  ownedUpgradeIds,
  onBuyRod, 
  onEquipRod,
  onBuyShip,
  onBuyCrew,
  onBuyUpgrade
}) => {
  const [activeTab, setActiveTab] = useState<'rods' | 'ships' | 'crew' | 'upgrades'>('rods');

  const currentShip = SHIPS.find(s => s.id === ownedShipId) || SHIPS[0];
  const totalCrew = Object.values(crewCounts).reduce((sum, count) => sum + count, 0);

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 text-xs md:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === id ? 'bg-amber-800 text-white shadow-inner' : 'bg-amber-950/40 text-amber-400 hover:bg-amber-900'}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col bg-amber-900 rounded-lg border-2 border-amber-700 text-amber-100 overflow-hidden h-full shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-amber-950 border-b border-amber-800 flex justify-between items-center shadow-md z-10">
        <h2 className="text-xl font-bold pixel-font text-amber-400 flex items-center gap-2">
          <span>⛺</span> Togore's Market
        </h2>
        <div className="bg-black/40 px-3 py-1 rounded border border-amber-800/50">
          <span className="text-xs text-amber-500 uppercase mr-2">Balance</span>
          <span className="text-green-400 font-mono font-bold text-lg">${money.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-amber-800 bg-amber-950/20">
        <TabButton id="rods" label="Rods" icon="🎣" />
        <TabButton id="ships" label="Ships" icon="⛵" />
        <TabButton id="crew" label="Crew" icon="👥" />
        <TabButton id="upgrades" label="Upgrades" icon="⚙️" />
      </div>
      
      {/* Content Area */}
      <div className="overflow-y-auto flex-1 p-4 bg-amber-900/80 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-transparent">
        <div className="grid grid-cols-1 gap-3">
          
          {activeTab === 'rods' && RODS.map(rod => {
            const isOwned = ownedRodIds.includes(rod.id);
            const isEquipped = equippedRodId === rod.id;
            const canAfford = money >= rod.price;

            return (
              <div key={rod.id} className={`p-3 rounded-lg border-2 transition-all flex flex-col ${isEquipped ? 'bg-green-900/30 border-green-500 shadow-green-500/10' : 'bg-amber-950/40 border-amber-800 hover:border-amber-600'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-amber-100">{rod.name}</h3>
                    <div className="flex gap-2 text-[10px] mt-1">
                       <span className="bg-blue-900/50 px-1 rounded text-blue-200">⚡ Speed x{rod.speedMultiplier}</span>
                       <span className="bg-green-900/50 px-1 rounded text-green-200">🍀 Luck x{rod.luckFactor}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {isOwned ? 
                      <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">OWNED</span> : 
                      <span className="text-yellow-400 font-mono font-bold">${rod.price.toLocaleString()}</span>
                    }
                  </div>
                </div>
                <p className="text-xs italic text-amber-300/60 mt-2 mb-3">{rod.description}</p>
                {isOwned ? (
                  <button 
                    onClick={() => onEquipRod(rod.id)} 
                    disabled={isEquipped} 
                    className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider ${isEquipped ? 'bg-transparent text-green-400 border border-green-500/50 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}
                  >
                    {isEquipped ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button 
                    onClick={() => onBuyRod(rod)} 
                    disabled={!canAfford} 
                    className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg' : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'}`}
                  >
                    Buy
                  </button>
                )}
              </div>
            );
          })}

          {activeTab === 'ships' && SHIPS.map((ship, index) => {
            const currentShipIndex = SHIPS.findIndex(s => s.id === ownedShipId);
            const isOwned = ship.id === ownedShipId || SHIPS.findIndex(s => s.id === ship.id) < currentShipIndex;
            const isCurrent = ship.id === ownedShipId;
            const canAfford = money >= ship.price;
            const isNext = SHIPS.findIndex(s => s.id === ship.id) === currentShipIndex + 1;
            const isLocked = !isOwned && !isNext;

            return (
              <div key={ship.id} className={`p-3 rounded-lg border-2 relative overflow-hidden ${isCurrent ? 'bg-blue-900/30 border-blue-400' : isLocked ? 'bg-gray-900/50 border-gray-800 opacity-60' : 'bg-amber-950/40 border-amber-800'}`}>
                {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-4xl pointer-events-none opacity-20">🔒</div>}
                
                <div className="flex justify-between items-start relative z-10">
                  <h3 className="font-bold text-amber-100">{ship.name}</h3>
                  {!isOwned && <span className="text-yellow-400 font-mono font-bold">${ship.price.toLocaleString()}</span>}
                </div>
                
                <div className="text-xs text-amber-200/70 mt-1 relative z-10">
                  <span>⚓ Crew Capacity: {ship.crewCapacity}</span>
                </div>
                <p className="text-xs italic text-amber-300/60 mt-2 mb-3 relative z-10">{ship.description}</p>
                
                <div className="relative z-10">
                  {isCurrent ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-blue-300 bg-blue-900/20 rounded border border-blue-500/30">CURRENT VESSEL</div>
                  ) : isOwned ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-gray-500 bg-gray-800/50 rounded">STORED</div>
                  ) : (
                    <button 
                      onClick={() => onBuyShip(ship)} 
                      disabled={!canAfford || !isNext} 
                      className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider ${canAfford && isNext ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      {isLocked ? 'Locked' : 'Upgrade Ship'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {activeTab === 'crew' && (
            <>
              <div className="bg-black/30 p-3 rounded-lg border border-amber-800/50 mb-2">
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-400 font-bold">Crew Capacity</span>
                    <span className={totalCrew >= currentShip.crewCapacity ? 'text-red-400' : 'text-green-400'}>{totalCrew} / {currentShip.crewCapacity}</span>
                 </div>
                 <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${totalCrew >= currentShip.crewCapacity ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min(100, (totalCrew / currentShip.crewCapacity) * 100)}%` }}
                    ></div>
                 </div>
              </div>

              {CREW.map(member => {
                const count = crewCounts[member.id] || 0;
                const canAfford = money >= member.price;
                const hasSpace = totalCrew < currentShip.crewCapacity;

                return (
                  <div key={member.id} className="p-3 rounded-lg border-2 bg-amber-950/40 border-amber-800 flex flex-col hover:border-amber-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-amber-100">{member.name}</h3>
                        <div className="text-xs text-green-400 mt-1 font-mono">
                          +${member.cps}/s per unit
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-yellow-400 font-mono font-bold">${member.price.toLocaleString()}</div>
                         <div className="text-xs text-amber-500 mt-1">Hired: {count}</div>
                      </div>
                    </div>
                    <p className="text-xs italic text-amber-300/60 mt-2 mb-3">{member.description}</p>
                    <button 
                      onClick={() => onBuyCrew(member)} 
                      disabled={!canAfford || !hasSpace} 
                      className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider ${canAfford && hasSpace ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg' : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'}`}
                    >
                      {!hasSpace ? 'Ship Full' : 'Hire'}
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === 'upgrades' && UPGRADES.map(upgrade => {
            const isOwned = ownedUpgradeIds.includes(upgrade.id);
            const canAfford = money >= upgrade.price;
            
            // Icon logic
            const icon = upgrade.type === 'storage' ? '📦' : '⚓';
            const typeLabel = upgrade.type === 'storage' ? 'Storage' : 'Buoyancy';
            const colorClass = upgrade.type === 'storage' ? 'text-orange-300' : 'text-cyan-300';

            return (
              <div key={upgrade.id} className={`p-3 rounded-lg border-2 flex flex-col ${isOwned ? 'bg-gray-800/50 border-gray-700 opacity-70' : 'bg-amber-950/40 border-amber-800 hover:border-amber-600'}`}>
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <span className="text-2xl">{icon}</span>
                       <div>
                          <h3 className="font-bold text-amber-100">{upgrade.name}</h3>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/30 ${colorClass}`}>{typeLabel}</span>
                       </div>
                    </div>
                    <div>
                       {isOwned ? 
                         <span className="text-xs font-bold text-green-500">✓ ACQUIRED</span> :
                         <span className="text-yellow-400 font-mono font-bold">${upgrade.price.toLocaleString()}</span>
                       }
                    </div>
                 </div>
                 <p className="text-xs italic text-amber-300/60 mt-2 mb-3 ml-1">{upgrade.description}</p>
                 
                 {!isOwned && (
                   <button 
                    onClick={() => onBuyUpgrade(upgrade)} 
                    disabled={!canAfford} 
                    className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'}`}
                  >
                    Purchase
                  </button>
                 )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};