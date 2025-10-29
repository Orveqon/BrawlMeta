import React from 'react';

// Tip tanımını API yanıtına göre daha sonra detaylandıracağız
interface PlayerProfileProps {
  player: any;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player }) => {
  if (!player) return null;

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center space-x-4">
        <img src={player.profileImageUrl} alt="Profile Icon" className="w-24 h-24 rounded-full border-2 border-yellow-400" />
        <div>
          <h1 className="text-4xl font-bold text-white">{player.name}</h1>
          <p className="text-xl text-gray-300">{player.tag}</p>
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
