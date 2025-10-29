import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

// Basit in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 dakika

async function fetchFromApi(url: string, token: string) {
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });
    if (!response.ok) {
        // Hata durumunda null dönebiliriz, böylece Promise.all çökmez
        console.error(`API Error for ${url}: ${response.status}`);
        return null; 
    }
    return response.json();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag: playerTag } = await params;

  if (!playerTag) {
    return NextResponse.json({ message: 'Oyuncu etiketi (tag) gerekli.' }, { status: 400 });
  }

  const formattedTag = '#' + playerTag.toUpperCase().replace(/O/g, '0');
  const encodedTag = encodeURIComponent(formattedTag);

  const cachedEntry = cache.get(encodedTag);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
    console.log(`CACHE HIT: ${formattedTag}`);
    return NextResponse.json(cachedEntry.data);
  }
  console.log(`CACHE MISS: ${formattedTag}`);

  const BRAWLSTARS_TOKEN = process.env.BRAWLSTARS_API_TOKEN;
  if (!BRAWLSTARS_TOKEN) {
    console.error('BRAWLSTARS_API_TOKEN bulunamadı.');
    return NextResponse.json({ message: 'Sunucu hatası: API anahtarı yapılandırılmamış.' }, { status: 500 });
  }

  try {
    const playerUrl = `https://api.brawlstars.com/v1/players/${encodedTag}`;
    const battlelogUrl = `https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`;

    const playerData = await fetchFromApi(playerUrl, BRAWLSTARS_TOKEN);

    if (!playerData) {
        return NextResponse.json({ message: `Oyuncu bulunamadı: ${formattedTag}` }, { status: 404 });
    }

    // Oyuncu verisi başarılıysa, diğer verileri paralel olarak çek
    const clubTag = playerData.club?.tag;
    const clubUrl = clubTag ? `https://api.brawlstars.com/v1/clubs/${encodeURIComponent(clubTag)}` : null;

    const [battlelogData, clubData] = await Promise.all([
        fetchFromApi(battlelogUrl, BRAWLSTARS_TOKEN),
        clubUrl ? fetchFromApi(clubUrl, BRAWLSTARS_TOKEN) : Promise.resolve(null)
    ]);

    // Tüm verileri tek bir objede birleştir
    const combinedData: ApiResponse = {
        ...playerData,
        profileImageUrl: `https://cdn.brawlify.com/profile/${playerData.icon.id}.png`,
        brawlers: playerData.brawlers.map((brawler: any) => ({
            ...brawler,
            imageUrl: `https://cdn.brawlify.com/brawler/${brawler.id}.png`
        })),
        battlelog: battlelogData?.items || [],
        club: clubData
    };

    if (combinedData.club && combinedData.club.badgeId) {
        combinedData.club.badgeUrl = `https://cdn.brawlify.com/club/${combinedData.club.badgeId}.png`;
    }

    cache.set(encodedTag, { data: combinedData, timestamp: Date.now() });

    return NextResponse.json(combinedData);

  } catch (error) {
    console.error('Beklenmedik sunucu hatası:', error);
    return NextResponse.json({ message: 'Beklenmedik bir sunucu hatası oluştu.' }, { status: 500 });
  }
}