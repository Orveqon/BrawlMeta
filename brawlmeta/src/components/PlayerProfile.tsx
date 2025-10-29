import React from 'react';
import Image from 'next/image';
import { Player } from '@/types';

interface PlayerProfileProps {
  player: Player;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player }) => {
  if (!player) return null;

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center space-x-4">
        <Image src={player.profileImageUrl} alt="Profile Icon" width={96} height={96} className="w-24 h-24 rounded-full border-2 border-yellow-400" />
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white">{player.name}</h1>
          <p className="text-xl text-gray-300">{player.tag}</p>
            {player.club && player.club.name && (
                <div className="flex items-center mt-2 bg-gray-900 bg-opacity-50 rounded-full p-1 pr-3 max-w-max">
                    <Image src={player.club.badgeUrl!} alt={player.club.name} width={32} height={32} className="w-8 h-8"/>
                    <p className="ml-2 text-sm font-bold text-white">{player.club.name}</p>
                </div>
            )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Trophies</p>
          <p className="text-2xl font-bold text-yellow-400">{player.trophies}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Highest Trophies</p>
          <p className="text-2xl font-bold text-yellow-400">{player.highestTrophies}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">3v3 Victories</p>
          <p className="text-2xl font-bold text-green-400">{player['3vs3Victories']}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Solo Victories</p>
          <p className="text-2xl font-bold text-blue-400">{player.soloVictories}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
