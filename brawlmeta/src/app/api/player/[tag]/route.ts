import { NextResponse } from 'next/server';

// Önbellek (basit in-memory cache)
// Daha gelişmiş bir çözüm için Vercel KV veya Redis kullanılabilir.
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 dakika

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const playerTag = params.tag;

  if (!playerTag) {
    return NextResponse.json({ message: 'Oyuncu etiketi (tag) gerekli.' }, { status: 400 });
  }

  // URL uyumluluğu için '#' karakterini %23 ile değiştir
  const formattedTag = '#' + playerTag.toUpperCase().replace('O', '0');
  const encodedTag = encodeURIComponent(formattedTag);

  // 1. Önbelleği kontrol et
  const cachedEntry = cache.get(encodedTag);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
    console.log(`CACHE HIT: ${formattedTag}`);
    return NextResponse.json(cachedEntry.data);
  }
  console.log(`CACHE MISS: ${formattedTag}`);


  const BRAWLSTARS_TOKEN = process.env.BRAWLSTARS_API_TOKEN;

  if (!BRAWLSTARS_TOKEN) {
    console.error('BRAWLSTARS_API_TOKEN bulunamadı.');
    return NextResponse.json(
      { message: 'Sunucu hatası: API anahtarı yapılandırılmamış.' },
      { status: 500 }
    );
  }

  const API_URL = `https://api.brawlstars.com/v1/players/${encodedTag}`;
  
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${BRAWLSTARS_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    // Hata durumlarını yönet
    if (!response.ok) {
      let message = 'Bilinmeyen bir hata oluştu.';
      switch (response.status) {
        case 400:
          message = 'Geçersiz istek. Oyuncu etiketini kontrol edin.';
          break;
        case 401:
        case 403:
          message = 'API yetkilendirme hatası. Sunucu yapılandırmasını kontrol edin.';
          break;
        case 404:
          message = `Oyuncu bulunamadı: ${formattedTag}`;
          break;
        case 429:
          message = 'İstek limiti aşıldı. Lütfen birkaç saniye sonra tekrar deneyin.';
          break;
        case 500:
        case 503:
          message = 'Brawl Stars API sunucusunda bir sorun var. Lütfen daha sonra tekrar deneyin.';
          break;
      }
      console.error(`API Hatası: ${response.status} - ${response.statusText}`);
      return NextResponse.json({ message }, { status: response.status });
    }

    const data = await response.json();

    // Başarılı yanıtı önbelleğe al
    cache.set(encodedTag, { data, timestamp: Date.now() });

    // Oyuncu verisine Brawlify CDN'den alınacak profil resmi URL'sini ekle
    if (data.icon && data.icon.id) {
        data.profileImageUrl = `https://cdn.brawlify.com/profile/${data.icon.id}.png`;
    }

    // Brawler'ların görsellerini ekle
    if (data.brawlers && Array.isArray(data.brawlers)) {
        data.brawlers = data.brawlers.map((brawler: any) => ({
            ...brawler,
            imageUrl: `https://cdn.brawlify.com/brawler/${brawler.id}.png`
        }));
    }


    return NextResponse.json(data);

  } catch (error) {
    console.error('Beklenmedik sunucu hatası:', error);
    return NextResponse.json(
      { message: 'Beklenmedik bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
