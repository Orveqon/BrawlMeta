import React from 'react';
import Image from 'next/image';
import { Brawler } from '@/types';

interface BrawlerListProps {
  brawlers: Brawler[];
}

const BrawlerList: React.FC<BrawlerListProps> = ({ brawlers }) => {
  if (!brawlers || brawlers.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-white mb-4">Brawlers</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {brawlers.sort((a, b) => b.trophies - a.trophies).map((brawler) => (
          <div key={brawler.id} className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-2 text-center shadow-md border border-gray-700 hover:border-yellow-400 transition-all duration-200">
            <Image src={brawler.imageUrl} alt={brawler.name} width={80} height={80} className="w-20 h-20 mx-auto" />
            <p className="text-sm font-bold mt-2 truncate text-white">{brawler.name}</p>
            <p className="text-xs text-yellow-400">🏆 {brawler.trophies}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrawlerList;
