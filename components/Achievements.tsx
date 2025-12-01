import React from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementsProps {
  unlockedIds: string[];
}

export const Achievements: React.FC<AchievementsProps> = ({ unlockedIds }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-600 h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold mb-4 pixel-font text-yellow-400">Trophies</h2>
      <div className="overflow-y-auto flex-1 space-y-2 pr-2">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div key={ach.id} className={`p-2 rounded border flex items-center gap-3 ${isUnlocked ? 'bg-slate-700 border-yellow-500/50' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}>
              <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                🏆
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{ach.name}</h3>
                <p className="text-xs text-gray-400">{ach.description}</p>
                {isUnlocked && <p className="text-[10px] text-yellow-500 mt-1">{ach.rewardMessage}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};