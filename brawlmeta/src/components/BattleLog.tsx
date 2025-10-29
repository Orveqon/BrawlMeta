import React from 'react';
import Image from 'next/image';
import { Battle } from '@/types';

interface BattleLogProps {
  battles: Battle[];
  playerTag: string;
}

const BattleLog: React.FC<BattleLogProps> = ({ battles, playerTag }) => {
  if (!battles || battles.length === 0) {
    return (
        <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-4">Savaş Günlüğü</h2>
            <p className="text-gray-400 bg-gray-800 bg-opacity-50 p-4 rounded-lg">Oyuncunun savaş günlüğü bilgisi bulunamadı veya gizli.</p>
        </div>
    );
  }

  const getResultColor = (result: string) => {
    if (result === 'victory') return 'border-green-500';
    if (result === 'defeat') return 'border-red-500';
    return 'border-gray-500';
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-white mb-4">Savaş Günlüğü</h2>
      <div className="space-y-4">
        {battles.map((battle, index) => {
            const playerInfo = battle.battle.teams.flat().find(p => p.tag === playerTag);
            return (
                <div key={index} className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 border-l-4 ${getResultColor(battle.battle.result)}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {playerInfo && <Image src={`https://cdn.brawlify.com/brawler/${playerInfo.brawler.id}.png`} alt={playerInfo.brawler.name} width={48} height={48} className="w-12 h-12" />}
                            <div>
                                <p className="font-bold text-lg text-white">{battle.event.map}</p>
                                <p className="text-sm text-gray-400">{battle.battle.mode}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold text-lg ${battle.battle.result === 'victory' ? 'text-green-400' : battle.battle.result === 'defeat' ? 'text-red-400' : 'text-gray-300'}`}>
                                {battle.battle.result.charAt(0).toUpperCase() + battle.battle.result.slice(1)}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(battle.battleTime).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default BattleLog;
