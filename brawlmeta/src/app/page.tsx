'use client';

import { useState } from 'react';
import PlayerProfile from '@/components/PlayerProfile';
import BrawlerList from '@/components/BrawlerList';
import BattleLog from '@/components/BattleLog';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Player } from '@/types';

export default function Home() {
  const [tag, setTag] = useState('');
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) {
      setError('Lütfen bir oyuncu etiketi girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setPlayerData(null);

    const formattedTag = tag.startsWith('#') ? tag.substring(1) : tag;

    // Gelişmiş ön yüz etiket formatı doğrulaması
    const validTagRegex = /^[0289PYLQGRJCUV]{3,9}$/;
    if (!validTagRegex.test(formattedTag)) {
        let errorMessage = 'Geçersiz etiket formatı.';
        if (formattedTag.length < 3 || formattedTag.length > 9) {
            errorMessage = 'Etiket 3 ila 9 karakter uzunluğunda olmalıdır.';
        } else {
            errorMessage = 'Etiket sadece şu karakterleri içerebilir: 0,2,8,9,P,Y,L,Q,G,R,J,C,U,V';
        }
        setError(errorMessage);
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`/api/player/${formattedTag}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu.');
      }

      setPlayerData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-yellow-400">Brawl Meta</h1>
          <p className="text-gray-300 mt-2">Brawl Stars Oyuncu İstatistikleri</p>
        </header>

        <form onSubmit={handleSearch} className="flex items-center justify-center mb-8">
            <div className="relative w-full max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">#</span>
                <input
                    type="text"
                    value={tag.startsWith('#') ? tag.substring(1) : tag}
                    onChange={(e) => setTag('#' + e.target.value.toUpperCase().replace(/O/g, '0'))}
                    placeholder="OYUNCUETİKETİ"
                    className="w-full pl-8 pr-28 py-3 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-300"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-6 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {loading ? 'Aranıyor...' : 'Ara'}
                </button>
            </div>
        </form>

        <div className="mt-4 w-full">
          {loading && <SkeletonLoader />}

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg text-center">
              <p>Hata: {error}</p>
            </div>
          )}

          {playerData && (
            <div className="animate-fade-in">
              <PlayerProfile player={playerData} />
              <BrawlerList brawlers={playerData.brawlers} />
              <BattleLog battles={playerData.battlelog} playerTag={playerData.tag} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}