# Proje Vizyonu: VibeTabu (Mobil Öncelikli PWA Oyunu)

Özellikle mobil ve tablet tarayıcıları için tasarlanmış, şık, yüksek performanslı, tek dosya (veya temiz tek klasör) mimarisine sahip çakma bir Tabu oyunu. Tamamen istemci tarafında (client-side) çalışır ve internet olmadan da (PWA olarak) telefon ana ekranından oynanabilir.

---

## 🛠️ Teknoloji ve Mimari Yapı

### 1. Ön Yüz Tasarımı (`frontend-design`)
* **Tasarım Dili:** Modern, karanlık mod (dark-mode) öncelikli siber-minimalizm. Derin koyu arka planlar (`#0B0F19`) ve yüksek kontrastlı neon vurgular (Başarı/Doğru için Turkuaz, Tabu için Kırmızı, Pas için Kehribar/Turuncu).
* **Ekran Düzeni:** Mobil tarayıcıların alt/üst barlarının tasarımı bozmasını önlemek için dinamik viewport yüksekliği (`100dvh`) kullanılacak. Kesinlikle dikeyde kaydırma (scroll) olmayan, ekrana tam oturan bir arayüz.
* **Mikro Etkileşimler:** Kart geçişlerinde yumuşak CSS animasyonları, butonlara basıldığında hafif küçülme (tıklama hissi) ve süre bitimine doğru panik hissi veren hafif sayaç nabız (pulse) efekti.

### 2. Oyun Mantığı (`modern-javascript-patterns`)
* **Durum Yönetimi (State Management):** Saf JavaScript (Vanilla JS) ile temiz bir **State-Machine (Durum Makinesi)** deseni. Oyun durumları tek bir merkezden yönetilir (`INIT` - Giriş, `PLAYING` - Oyun, `PAUSED` - Duraklatıldı, `GAME_OVER` - Oyun Bitti).
* **Veri Yapısı:** Kelimeler arayüz kodundan tamamen bağımsız, düzenli bir JSON matrisinde (veri setinde) tutulur.
* **Performans:** React/Vue gibi harici kütüphaneler YOK. Mobil cihazlarda tıklama gecikmesini (click delay) sıfırlamak için doğrudan DOM manipülasyonu ve `pointerdown` event'leri kullanılacak.

### 3. Oyun Döngüsü (`brainstorming`)
* **Akış:** Takım Seçimi -> Tur Hazırlığı -> Aktif Oyun (60 saniye geri sayım) -> Tur Sonu İncelemesi -> Skor Tablosu.
* **Kontroller:** Ekranın en altında, baş parmakların rahatça yetişebileceği devasa butonlar: [TABU] [PAS] [DOĞRU].

---

## 📂 Hedef Dosya Yapısı

```text
├── index.html              # Ana giriş kapısı (HTML Yapısı)
├── css/
│   └── styles.css          # Siber-minimalist modern CSS ve animasyonlar
├── js/
│   ├── app.js              # Giriş noktası, servis kaydı ve olay dinleyiciler
│   ├── state.js            # Oyun durum makinesi (State Machine) ve veri yönetimi
│   ├── ui.js               # Arayüz güncellemeleri ve DOM manipülasyonları
│   └── audio.js            # Web Audio API ses sentezleyici
├── data/
│   └── words.json          # Kategorize edilmiş Türkçe Tabu kelime paketi
├── manifest.json           # PWA Manifest
└── sw.js                   # Service Worker (Çevrimdışı önbellek)
```

---

## ⚠️ Kod Standartları ve Kurallar

1. **Kesinlikle Spagetti Kod Yok:** HTML, CSS, JS ve JSON dosyaları kendi ilgili klasörlerinde tutulacaktır. 
2. **Modüler JavaScript:** Oyun mantığı tek bir büyük JS dosyası yerine; durum makinesi (`js/state.js`), arayüz render/güncelleme işlemleri (`js/ui.js`), ses sentezi (`js/audio.js`) ve ana yönetim (`js/app.js`) şeklinde modüllere ayrılarak tasarlanacaktır. Modüller ES6 `import`/`export` yapısı ile birbirine bağlanacaktır.
3. **PWA Kapsamı:** `sw.js` (Service Worker) ve `manifest.json` kök dizinde barındırılacaktır (Service Worker'ın tüm uygulamayı kapsayabilmesi için tarayıcı güvenlik kuralları gereği kök dizinde olması zorunludur).