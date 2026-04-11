<div align="center">
<img width="1200" height="475" alt="Perfect Fit Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Perfect Fit — Profesyonel Bulmaca Oyunu

Kısa açıklama
- *Perfect Fit* hızlı tempolu, mantık ve çeviklik gerektiren bir bulmaca/platform oyunudur. Oyuncular şekilleri doğru pozisyona yerleştirerek seviyeleri tamamlar, engelleri aşar ve en iyi puanı elde etmeye çalışır.

**Özellikler**
- Düşük gecikmeli, akıcı oynanış
- Katmanlandırılmış seviye tasarımları ve zorluk eğrisi
- Klavye tabanlı kontroller ve sezgisel arayüz
- Ses efektleri ve basit müzik döngüsü
- Kolayca genişletilebilir TypeScript + Vite kod tabanı

## Nasıl Oynanır
- Amaç: Her seviyede verilen biçimleri doğru yere yerleştirip çıkışı açmak.
- Her seviye farklı engeller ve hareketli duvarlar içerir.
- Puanlama: Hız, doğru yerleştirme ve bonus toplama ile hesaplanır.

## Kontroller
- Hareket: `A` / `D` veya `←` / `→`
- Zıplama: `Space` veya `W`
- Etkileşim / Döndürme: `E`
- Menü / Duraklat: `Esc`

## Geliştirici Kurulumu
**Gereksinimler:** Node.js (LTS önerilir) ve `npm` veya `pnpm`/`yarn`.

1. Depoyu klonlayın:

   `git clone <repo-url>`
   `cd Perfect-Fit-Game`

2. Bağımlılıkları yükleyin:

   `npm install`

3. Geliştirme sunucusunu başlatın:

   `npm run dev`

4. Üretim için build oluşturma:

   `npm run build`
   `npm run preview` (üretim önizlemesi)

## Proje Yapısı (kısa)
- `src/` — Oyun kaynak kodu
  - `main.tsx`, `App.tsx` — Başlangıç ve uygulama kabuğu
  - `World.tsx`, `Player.tsx`, `Wall.tsx` — Oyun nesneleri ve mantık
  - `levels.ts` — Seviye tanımları
  - `sound.ts` — Ses yönetimi
  - `store.ts` — Oyun durumu
  - `UI.tsx` — Kullanıcı arayüzü

## Öneriler ve Geliştirme Notları
- Yeni seviye eklerken `levels.ts` formatını takip edin.
- Sesleri küçük, döngüsel parçalar halinde ekleyin; `sound.ts` üzerinden yönetin.
- Performans: Fizik ve çarpışma çözümlerini optimize etmek için `requestAnimationFrame` kullanın.

## Katkıda Bulunma
Katkılara açığız. Bug raporu, iyileştirme veya yeni seviye teklifleri için lütfen bir issue açın veya pull request gönderin. Kodlama standartlarına uymak için TypeScript tiplerini ve mevcut stil rehberini takip edin.

## Lisans
Bu proje MIT lisansı altında yayınlanmıştır. (LICENSE dosyası eklemeyi unutmayın.)

## İletişim
Proje sahibi ve iletişim bilgileri için repository sahip profilini kullanın.

---
Geri bildirim veya profesyonel metin düzenlemeleri isterseniz, README üzerinde daha fazla ince ayar yapabilirim.
