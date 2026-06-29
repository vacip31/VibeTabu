/* Vibe X Verses Web Audio API Ses Sentez ve Dokunsal Geri Bildirim Modülü (audio.js) */

let audioCtx = null;

/**
 * Tarayıcı ses bağlamını (AudioContext) başlatır veya mevcut olanı döndürür.
 */
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Kullanıcının ilk etkileşiminde ses modülünü ısıtır (unlock).
 */
export function initAudio() {
    try {
        getAudioContext();
    } catch (e) {
        console.warn("Verses Ses bağlamı başlatılamadı:", e);
    }
}

/**
 * Mobil cihazlarda titreşim (Haptic Feedback) tetikler.
 */
export function playVibration(pattern) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.warn("Verses Titreşim tetiklenemedi:", e);
        }
    }
}

/**
 * Ekran Geçiş Sesi: Yumuşak yükselen sinüs dalgası (whoosh etkisi).
 */
export function playTransition() {
    playVibration(15);
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
    } catch (e) {
        console.warn("Ses çalma hatası:", e);
    }
}

/**
 * Başarı / Rol İfşa Sesi: Neşeli ve hızlı yükselen iki nota chimi.
 */
export function playSuccess() {
    playVibration(60);
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // 1. Nota
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        gain1.gain.setValueAtTime(0.06, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);
        
        // 2. Nota (Hafif gecikmeli)
        const delay = 0.08;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + delay); // E5
        osc2.frequency.exponentialRampToValueAtTime(783.99, now + delay + 0.12); // G5
        gain2.gain.setValueAtTime(0.06, now + delay);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + delay);
        osc2.stop(now + delay + 0.2);
        
    } catch (e) {
        console.warn("Ses çalma hatası:", e);
    }
}

/**
 * Hata Sesi (Yanlış Blöf Tahmini): Bas frekanslı kare dalga uyarısı.
 */
export function playFailure() {
    playVibration([80, 50, 80]);
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.25);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.25);
    } catch (e) {
        console.warn("Ses çalma hatası:", e);
    }
}

/**
 * Klavye Yazım Klik Sesi: Hızlıca sönen ufak bir klik.
 */
export function playTick() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.012);
    } catch (e) {
        // Hata bastırılır (tıklamalar sessiz geçebilir)
    }
}
