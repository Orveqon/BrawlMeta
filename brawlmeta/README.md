# Brawl Meta - Gelişmiş Brawl Stars İstatistik Uygulaması

Brawl Meta, Brawl Stars oyuncu profillerini, detaylı istatistiklerini, savaş günlüklerini ve kulüp bilgilerini modern ve kullanıcı dostu bir arayüzde sunan bir web uygulamasıdır.

---

## ✨ Temel Özellikler

- **Oyuncu Profili Arama:** Oyuncu etiketini kullanarak detaylı profil verilerini anında getirin.
- **Detaylı İstatistikler:** Maksimum kupa, mevcut kupa, 3v3 zaferleri, solo/duo zaferleri gibi istatistikleri görüntüleyin.
- **Savaşçı Listesi:** Oyuncunun tüm savaşçılarını, kupa sayılarını ve seviyelerini ilgili görselleriyle birlikte listeleyin.
- **Kulüp Bilgileri:** Oyuncunun mevcut kulübünün adını ve rozetini profil kartında görün.
- **Savaş Günlüğü:** Oyuncunun son maçlarının detaylı dökümünü (sonuç, harita, mod, kullanılan savaşçı) inceleyin.
- **Güvenli API Kullanımı:** Brawl Stars API anahtarı, sadece sunucu tarafında çalışan bir proxy katmanı üzerinden güvenli bir şekilde kullanılır, asla kullanıcı tarafına sızdırılmaz.
- **Verimli Önbellekleme:** Tekrarlanan sorguları hızlandırmak ve API limitlerini aşmamak için sunucu tarafında 2 dakikalık önbellekleme mekanizması bulunur.
- **Gelişmiş Kullanıcı Deneyimi (UX):**
  - Veriler yüklenirken modern iskelet (skeleton) animasyonları gösterilir.
  - Hatalı veya geçersiz oyuncu etiketleri girildiğinde (hem karakter hem de uzunluk kontrolü) kullanıcı anında bilgilendirilir.

---

## 🛠️ Kullanılan Teknolojiler

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Stil:** [Tailwind CSS](https://tailwindcss.com/)
- **Platform:** [Vercel](https://vercel.com/) (Sunucusuz API Rotaları için)
- **Veri Kaynakları:**
  - [Resmi Brawl Stars API](https://developer.brawlstars.com/)
  - [Brawlify CDN](https://brawlify.com/) (Görseller için)

---

## 🚀 Kurulum ve Çalıştırma

Uygulamayı yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Bağımlılıkları Yükleyin

Proje dizininde bir terminal açın ve gerekli tüm paketleri yüklemek için aşağıdaki komutu çalıştırın:

```bash
npm install
```

### 2. API Anahtarını Tanımlayın

Projenin ana klasöründe (`brawlmeta/`) `.env.local` adında yeni bir dosya oluşturun. İçine, [Brawl Stars Geliştirici Portalı](https://developer.brawlstars.com/)'ndan aldığınız API anahtarınızı aşağıdaki formatta yapıştırın:

```
# .env.local

BRAWLSTARS_API_TOKEN="COK_GIZLI_API_ANAHTARINIZ_BURAYA_GELECEK"
```

> **Önemli:** `.env.local` dosyası `git` tarafından yok sayılır, bu sayede gizli anahtarınızın güvende kalması sağlanır.

### 3. Geliştirme Sunucusunu Başlatın

Tüm kurulum tamamlandıktan sonra, aşağıdaki komutla geliştirme sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Tarayıcınızda **[http://localhost:3000](http://localhost:3000)** adresini açarak çalışan uygulamayı görüntüleyebilirsiniz.

---

## 📂 Proje Yapısı

```
brawlmeta/
├── src/
│   ├── app/
│   │   ├── api/player/[tag]/route.ts  # Güvenli, sunucu tarafı API proxy rotası
│   │   ├── globals.css                # Global stil dosyası
│   │   └── page.tsx                   # Ana sayfanın arayüzü (UI) ve mantığı
│   └── components/
│       ├── PlayerProfile.tsx            # Oyuncu profil kartı bileşeni
│       ├── BrawlerList.tsx              # Savaşçı listesi bileşeni
│       ├── BattleLog.tsx                # Savaş günlüğü bileşeni
│       └── SkeletonLoader.tsx           # Yükleme animasyonu bileşeni
├── .env.local                         # Gizli API anahtarının saklandığı dosya
└── README.md                          # Bu dosya
```
