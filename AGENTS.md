# Proje Vizyonu: VibeParty (Çoklu Oyun Portalı)

Özellikle mobil ve tablet tarayıcıları için tasarlanmış, fütüristik siber-minimalist (neon & glassmorphism) tasarıma sahip, PWA destekli, tamamen çevrimdışı çalışan bir grup/parti oyunları portalıdır.

---

## 🛠️ Mimari Yapı ve Modülerlik

VibeParty, çoklu oyun barındıran modüler bir klasör yapısına sahiptir. Tüm bağımsız oyunlar kendi klasörlerinde tutulur ve kök dizindeki ana menü (Hub) aracılığıyla çalıştırılır.

### 📂 Klasör Yapısı
```text
├── index.html              # Ana Portal Giriş Ekranı (Oyun Seçim Menüsü)
├── manifest.json           # Global PWA Manifest
├── sw.js                   # Global Çevrimdışı Önbellek Kaydı (Service Worker)
├── css/
│   └── styles.css          # Ortak Tasarım Sistemi (Obsidian Glass & Neon)
├── js/
│   └── hub.js              # Portal ana yönetimi ve SW kaydı
└── games/
    ├── taboo/              # VibeTabu Oyunu
    │   ├── index.html      # Tabu Arayüzü
    │   ├── data/
    │   │   └── words.json  # Kelime Paketi
    │   └── js/
    │       ├── app.js      # Tabu Oyun Döngüsü
    │       ├── state.js    # Tabu Durum Makinesi (State Machine)
    │       ├── ui.js       # Tabu DOM Güncellemeleri
    │       └── audio.js    # Tabu Web Audio API Ses Üreteci
    └── [yeni_oyun]/        # Gelecekte eklenecek yeni grup oyunları (Örn: Ajan Kim)
```

---

## ⚠️ Kod Standartları ve Kurallar

1.  **Modüler Oyun Yapısı:** Her oyun kesinlikle `games/` altında kendi klasöründe (HTML, JS, veri setleri) bağımsız çalışmalıdır. Oyunların kendi içindeki script'leri birbirine karışmamalıdır.
2.  **Ortak Tasarım:** Yeni oyunlar tasarlanırken kök dizindeki `./css/styles.css` stil şablonu kullanılmalı ve Obsidian Glass/Neon tasarım çizgisi (lacivert tonları, siber yeşil/turuncu/kırmızı neonlar) korunmalıdır.
3.  **Tek PWA Çatısı:** PWA yapılandırması (`manifest.json` ve `sw.js`) daima kök dizinde kalacaktır. Yeni bir oyun eklendiğinde o oyunun statik dosyaları `sw.js` içindeki `ASSETS_TO_CACHE` dizisine eklenerek çevrimdışı çalışabilmesi sağlanmalıdır.