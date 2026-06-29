/* VibeParty Portal Hub Script (hub.js) */

// Sayfa yüklendiğinde Service Worker kaydet ve geçişleri bağla
window.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    setupPageTransitions();
});

/**
 * Service Worker kaydını yapar (Tüm oyun portalını kapsayacak şekilde kök sw.js dosyasını bağlar).
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('VibeParty SW Başarıyla Kaydedildi. Kapsam:', reg.scope))
                .catch(err => console.warn('VibeParty SW Kayıt Hatası:', err));
        });
    }
}

/**
 * Sayfa geçiş animasyonunu dinler.
 */
function setupPageTransitions() {
    document.querySelectorAll('a').forEach(link => {
        if (link.href && link.hostname === window.location.hostname && !link.target && !link.href.includes('#') && !link.href.startsWith('javascript:')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.href;
                document.body.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
                document.body.style.opacity = '0';
                document.body.style.transform = 'translateY(-6px)';
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 250);
            });
        }
    });
}
