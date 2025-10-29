# Brawl Meta - Brawl Stars Oyuncu İstatistikleri

Bu proje, Brawl Stars oyuncu verilerini [Resmi Brawl Stars API](https://developer.brawlstars.com/) ve [Brawlify](https://brawlify.com/) CDN'ini kullanarak gösteren bir web uygulamasıdır.

Uygulama, Next.js ve Vercel Serverless Functions kullanılarak oluşturulmuştur. Bu mimari, API anahtarlarının güvenli bir şekilde sunucu tarafında saklanmasını sağlar.

## Kurulum ve Çalıştırma

### 1. Proje Bağımlılıklarını Yükleyin

Proje dizininde aşağıdaki komutu çalıştırarak gerekli tüm paketleri yükleyin:

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

Projenin ana dizininde (`brawlmeta/`) `.env.local` adında yeni bir dosya oluşturun. İçine size verilen Brawl Stars API anahtarını aşağıdaki gibi ekleyin:

```
BRAWLSTARS_API_TOKEN="BURAYA_API_ANAHTARINIZI_YAPIŞTIRIN"
```

**Not:** `.env.local` dosyası, gizli anahtarlarınızı saklar ve `git` tarafından takip edilmez, bu da anahtarınızın güvende kalmasını sağlar.

### 3. Geliştirme Sunucusunu Başlatın

Tüm kurulum tamamlandıktan sonra, aşağıdaki komutla geliştirme sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Proje Yapısı

- `/src/app/page.tsx`: Kullanıcı arayüzünün bulunduğu ana sayfa.
- `/src/app/api/player/[tag]/route.ts`: Brawl Stars API'sine istekleri yönlendiren ve API anahtarını güvenli bir şekilde kullanan sunucu tarafı API rotası (proxy).
- `/src/components/`: Tekrar kullanılabilir React bileşenleri.
  - `PlayerProfile.tsx`: Oyuncu profil bilgilerini gösteren kart.
  - `BrawlerList.tsx`: Oyuncunun savaşçılarını listeleyen grid.
- `/.env.local`: Gizli API anahtarının saklandığı dosya.

---

## Test Senaryoları

Uygulamanın doğru çalıştığını doğrulamak için aşağıdaki senaryoları test edebilirsiniz:

1.  **Geçerli Token + Geçerli Oyuncu Etiketi:**
    -   **Adım:** Arama kutusuna geçerli bir oyuncu etiketi (ör: `Y2LQRR9J`) girin ve "Ara" butonuna tıklayın.
    -   **Beklenen Sonuç:** Oyuncu profili ve savaşçı listesi doğru bir şekilde yüklenir (HTTP 200).

2.  **Geçersiz (Yanlış) Token:**
    -   **Adım:** `.env.local` dosyasındaki API anahtarını kasıtlı olarak bozun (ör: son birkaç karakteri silin).
    -   **Beklenen Sonuç:** Arama yapıldığında "API yetkilendirme hatası..." şeklinde bir uyarı mesajı gösterilir (HTTP 401/403).

3.  **Geçersiz (Bulunamayan) Oyuncu Etiketi:**
    -   **Adım:** Arama kutusuna geçersiz veya var olmayan bir etiket (ör: `ABC`) girin.
    -   **Beklenen Sonuç:** "Oyuncu bulunamadı..." şeklinde bir hata mesajı gösterilir (HTTP 404).

4.  **Boş Etiket ile Arama:**
    -   **Adım:** Arama kutusunu boş bırakıp "Ara" butonuna tıklayın.
    -   **Beklenen Sonuç:** "Lütfen bir oyuncu etiketi girin." uyarısı gösterilir.

5.  **API Rate Limit (İstek Limiti):**
    -   **Adım:** Çok kısa bir süre içinde aynı etiketle tekrar tekrar arama yapın.
    -   **Beklenen Sonuç:** İlk arama başarılı olur, sonrakiler önbellekten (cache) gelir. Eğer önbellek olmasaydı ve API limitine takılsaydınız, "İstek limiti aşıldı..." mesajı gösterilirdi (HTTP 429).

6.  **CDN Resim Hatası (Fallback):**
    -   **Not:** Mevcut kodda, resim bulunamazsa tarayıcı varsayılan olarak kırık resim ikonu gösterir. Tam bir production uygulamasında, `<img>` elementi için `onError` olayı kullanılarak yerel bir placeholder resim gösterilebilir.

---

## Alternatif: No-Code Platform (Bubble) ile Kurulum

Bu projeyi Bubble gibi bir no-code platformda yapmak isterseniz, izlemeniz gereken adımlar şunlardır:

1.  **API Connector Kurulumu:**
    -   Bubble'da "Plugins" sekmesine gidin ve "API Connector" eklentisini kurun.
    -   Yeni bir API ekleyin ve adını "Brawl Stars API" olarak belirleyin.

2.  **API Çağrısını Tanımlama (Oyuncu Verisi):**
    -   Yeni bir API çağrısı (`call`) oluşturun ve adını "GetPlayer" yapın.
    -   **Method:** `GET`
    -   **URL:** `https://api.brawlstars.com/v1/players/[player_tag]`
        -   URL'deki `[player_tag]` kısmını dinamik bir değer yapın ve "private" (gizli) olarak işaretlemeyin.
    -   **Headers:**
        -   `Authorization` key'i için value olarak `Bearer [api_key]` yazın. `[api_key]` kısmını dinamik bir değer yapın ve **"private" (gizli)** olarak işaretleyin. Bu, anahtarın client tarafına sızmasını engeller.

3.  **Gizli Anahtarı Saklama:**
    -   API Connector ayarlarında, `[api_key]` için gelen kutucuğa Brawl Stars API anahtarınızı yapıştırın. Bu anahtar Bubble'ın sunucularında güvenli bir şekilde saklanır.

4.  **Arayüz (UI) Tasarımı:**
    -   Bir `Input` elementi (oyuncu etiketini girmek için) ve bir `Button` elementi ("Ara") ekleyin.
    -   Sonuçları göstermek için bir `Group` elementi oluşturun.

5.  **Workflow (İş Akışı) Oluşturma:**
    -   "Ara" butonuna tıklandığında yeni bir workflow başlatın.
    -   **Adım 1:** "Get data from an external API" aksiyonunu seçin.
    -   **API Provider:** Kurduğunuz "Brawl Stars API - GetPlayer" çağrısını seçin.
    -   **player_tag:** Input elementinin değerini `URL encoded` olarak buraya bağlayın.
    -   **api_key:** Gizli olarak kaydettiğiniz API anahtarını buraya bağlayın.
    -   **Adım 2:** Gelen veriyi bir `custom state`'e (örneğin, sayfanın `playerData` state'i) kaydedin.

6.  **Veriyi Gösterme:**
    -   Sonuçları gösteren `Group` elementinin veri kaynağını (data source) bu `playerData` state'i yapın.
    -   Group içindeki `Text` elementlerini `Parent group's PlayerData's name`, `Parent group's PlayerData's trophies` gibi ifadelere bağlayın.
    -   Savaşçı listesi için bir `RepeatingGroup` kullanın ve veri kaynağını `playerData's brawlers` listesi yapın.
    -   Resimler için `Image` elementinin URL'sini dinamik olarak `https://cdn.brawlify.com/brawler/[brawler_id].png` şeklinde oluşturun.

Bu adımlar, kod yazmadan benzer bir işlevselliği Bubble üzerinde kurmanızı sağlar.