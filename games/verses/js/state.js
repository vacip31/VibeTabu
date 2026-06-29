/* Vibe X Verses Oyun Durum Yönetimi (state.js) */

export const STATES = {
    WELCOME: 'WELCOME',
    SETUP: 'SETUP',
    ROLE_DISTRIBUTION: 'ROLE_DISTRIBUTION',
    WRITING: 'WRITING',
    REVEAL: 'REVEAL',
    GAMEOVER: 'GAMEOVER'
};

// Merkezi oyun durumu nesnesi
export const state = {
    currentState: STATES.WELCOME,
    players: [], // Oyuncu isimleri listesi (unique strings)
    spyPlayer: "", // Geriye dönük uyumluluk için (ilk casus)
    spyPlayers: [], // Sahte şairler listesi (Çift casus modu desteği)
    doubleSpyMode: false, // Çift casus modu aktif mi (Sadece >= 6 oyuncu için)
    timerLimit: 0, // Düşünme süresi limiti (0: Kapalı, 45: 45sn, 90: 90sn)
    secondsRemaining: 0, // Kalan saniye
    timerIntervalId: null, // Zamanlayıcı interval ID'si
    category: "", // Aktif kategori
    selectedCategory: null, // Kullanıcının seçtiği kategori (null = rastgele)
    keyword: "", // Aktif kelime
    keywordSynonyms: [], // Aktif kelimenin alternatif eş anlamlı kelimeleri (Fuzzy Matching için)
    spyGuessedCorrectly: false, // Herhangi bir sahte şair kelimeyi bildi mi
    spyGuessText: "", // Sahte şairin tahmini
    totalRounds: 2, // Ayarlanabilir Tur Sayısı (1, 2 veya 3)
    roundNumber: 1, // Aktif tur sayısı (1 veya 2 veya 3)
    shuffledWritingQueue: [], // O turdaki karıştırılmış yazma sırası
    currentWriterIndex: 0, // Sıradaki yazıcının queue içindeki indeksi
    writingHistory: [], // [{ player: string, line: string }]
    
    // Zaman Takibi
    gameStartTime: null,
    gameDurationString: "00:00",
    
    // Rol dağıtımı sırasındaki adımlar için yardımcı durumlar
    distIndex: 0, // Şu an rolü dağıtılan oyuncunun players indeksi
    distSubState: 'A', // 'A' (Kurye), 'B' (Basılı Tut), 'C' (İmha)
    isWritingTurnActive: false, // Kurye onay ekranından yazma paneline geçiş kilidi
    
    // Şiir yazma aşamasındaki kurye adımları
    writingSubState: 'A', // 'A' (Kurye Sıra Bildirimi), 'B' (Yazma Paneli), 'C' (Dize Kaydedildi Geçiş Ekranı)
    
    // Casus Limit & Oylama Takibi
    spyGuessAttemptsThisRound: 0, // Casusun bu tur yaptığı tahmin deneme sayısı (Maks 1)
    spyExposedByGroup: false, // Grubun casusu ifşa edip edemediği kararı
    playedWordsHistory: [] // Tekrarı önlemek için oynanan kelimelerin havuzu
};

/**
 * Yeni oyuncu ekler. İsimlerin benzersiz olmasını garanti eder.
 */
export function addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: 'İsim boş bırakılamaz.' };
    
    // Büyük küçük harf duyarlı benzersizlik kontrolü
    const exists = state.players.some(p => p.toLowerCase() === trimmed.toLowerCase());
    if (exists) return { success: false, error: 'Bu isimde bir oyuncu zaten var.' };
    
    if (state.players.length >= 8) return { success: false, error: 'En fazla 8 oyuncu ekleyebilirsiniz.' };
    
    state.players.push(trimmed);
    saveGameStateToStorage();
    return { success: true };
}

/**
 * Oyuncu siler.
 */
export function removePlayer(name) {
    state.players = state.players.filter(p => p !== name);
    saveGameStateToStorage();
}

/**
 * Toplam tur sayısını belirler (1, 2 veya 3)
 */
export function setTotalRounds(count) {
    state.totalRounds = count;
    saveGameStateToStorage();
}

/**
 * Tüm oyunu ve durumları sıfırlar (Yeni oyuncularla kurulum).
 */
export function resetGame() {
    state.currentState = STATES.WELCOME;
    state.players = [];
    state.spyPlayer = "";
    state.category = "";
    state.selectedCategory = null;
    state.keyword = "";
    state.spyGuessedCorrectly = false;
    state.spyGuessText = "";
    state.roundNumber = 1;
    state.shuffledWritingQueue = [];
    state.currentWriterIndex = 0;
    state.writingHistory = [];
    state.distIndex = 0;
    state.distSubState = 'A';
    state.isWritingTurnActive = false;
    state.writingSubState = 'A';
    state.gameStartTime = null;
    state.gameDurationString = "00:00";
    state.spyGuessAttemptsThisRound = 0;
    state.spyExposedByGroup = false;
    state.doubleSpyMode = false;
    state.timerLimit = 0;
    state.spyPlayers = [];
    if (state.timerIntervalId) {
        clearInterval(state.timerIntervalId);
        state.timerIntervalId = null;
    }
    state.playedWordsHistory = [];
    clearGameStateFromStorage();
}

/**
 * Aynı kadroyla yeniden başlatmak için durumları sıfırlar.
 */
export function resetGameKeepPlayers() {
    state.currentState = STATES.SETUP;
    state.spyPlayer = "";
    state.category = "";
    state.keyword = "";
    state.spyGuessedCorrectly = false;
    state.spyGuessText = "";
    state.roundNumber = 1;
    state.shuffledWritingQueue = [];
    state.currentWriterIndex = 0;
    state.writingHistory = [];
    state.distIndex = 0;
    state.distSubState = 'A';
    state.isWritingTurnActive = false;
    state.writingSubState = 'A';
    state.gameStartTime = null;
    state.gameDurationString = "00:00";
    state.spyGuessAttemptsThisRound = 0;
    state.spyExposedByGroup = false;
    state.spyPlayers = [];
    if (state.timerIntervalId) {
        clearInterval(state.timerIntervalId);
        state.timerIntervalId = null;
    }
    state.playedWordsHistory = [];
    saveGameStateToStorage();
}

/**
 * Oyunu kurulan oyuncularla başlatır, kategori ve sahte şair seçer.
 */
export function initializeGameFlow(categoriesList) {
    if (state.players.length < 4) return false;
    
    // Kategori seç: kullanıcı seçtiyse onu kullan, yoksa rastgele
    let chosenCat;
    if (state.selectedCategory) {
        chosenCat = categoriesList.find(c => c.category === state.selectedCategory) || categoriesList[Math.floor(Math.random() * categoriesList.length)];
    } else {
        chosenCat = categoriesList[Math.floor(Math.random() * categoriesList.length)];
    }
    const randomCat = chosenCat;
    state.category = randomCat.category;
    
    // Tekrar korumalı kelime seçimi
    if (!state.playedWordsHistory) {
        state.playedWordsHistory = [];
    }
    
    let unplayedWords = randomCat.words.filter(word => {
        const wordName = typeof word === 'string' ? word : word.w;
        return !state.playedWordsHistory.includes(wordName);
    });

    if (unplayedWords.length === 0) {
        // Eğer bu kategorideki tüm kelimeler oynandıysa, bu kategoriyi geçmişten temizle
        const catWordNames = randomCat.words.map(word => typeof word === 'string' ? word : word.w);
        state.playedWordsHistory = state.playedWordsHistory.filter(wName => !catWordNames.includes(wName));
        unplayedWords = randomCat.words;
    }

    const pickedWord = unplayedWords[Math.floor(Math.random() * unplayedWords.length)];
    const wordName = typeof pickedWord === 'string' ? pickedWord : pickedWord.w;
    state.playedWordsHistory.push(wordName);
    
    if (typeof pickedWord === 'string') {
        state.keyword = pickedWord;
        state.keywordSynonyms = [];
    } else {
        state.keyword = pickedWord.w;
        // esnek arama kelimelerinin tamamını küçük harfe zorla
        state.keywordSynonyms = (pickedWord.synonyms || []).map(s => s.toLowerCase());
    }
    
    // Casus(ları) seç
    state.spyPlayers = [];
    const shuffledPlayers = shuffle([...state.players]);
    
    if (state.doubleSpyMode && state.players.length >= 6) {
        state.spyPlayers = [shuffledPlayers[0], shuffledPlayers[1]];
    } else {
        state.spyPlayers = [shuffledPlayers[0]];
    }
    state.spyPlayer = state.spyPlayers[0]; // Geriye dönük uyumluluk
    
    // Rol dağıtım değişkenlerini kur
    state.distIndex = 0;
    state.distSubState = 'A';
    state.currentState = STATES.ROLE_DISTRIBUTION;
    
    // Zaman takibini başlat
    state.gameStartTime = Date.now();
    
    saveGameStateToStorage();
    return true;
}

/**
 * Rol dağıtımındaki aşama geçişlerini yönetir (A -> B -> C -> Sonraki oyuncu A)
 */
export function nextDistributionStep() {
    if (state.distSubState === 'A') {
        state.distSubState = 'B';
    } else if (state.distSubState === 'B') {
        state.distSubState = 'C';
    } else if (state.distSubState === 'C') {
        if (state.distIndex < state.players.length - 1) {
            state.distIndex++;
            state.distSubState = 'A';
        } else {
            // Herkes rolünü gördü! Şiir Yazma Aşamasına Geç.
            state.roundNumber = 1;
            startWritingRound();
        }
    }
    saveGameStateToStorage();
}

/**
 * Şiir yazma turunu başlatır, sırayı karıştırır.
 */
export function startWritingRound() {
    let lastWriter = null;
    if (state.writingHistory.length > 0) {
        lastWriter = state.writingHistory[state.writingHistory.length - 1].player;
    }
    
    let queue = shuffle([...state.players]);
    
    // Algoritmik Sınırlamalar:
    // 1. Turun 1. sırasına Sahte Şair gelemez.
    // Turlar arası geçişte son yazan ile ilk yazan aynı kişi olamaz.
    let attempts = 0;
    while (
        (state.roundNumber === 1 && state.spyPlayers.includes(queue[0])) ||
        (lastWriter && queue[0] === lastWriter)
    ) {
        queue = shuffle([...state.players]);
        attempts++;
        if (attempts > 100) break; // Güvenlik kilidi
    }
    
    state.shuffledWritingQueue = queue;
    state.currentWriterIndex = 0;
    state.writingSubState = 'A';
    state.isWritingTurnActive = false;
    state.spyGuessAttemptsThisRound = 0; // Her tur başında tahmin hakkı sıfırlanır
    state.currentState = STATES.WRITING;
    saveGameStateToStorage();
}

/**
 * Yazılan dizeyi kaydeder ve sırayı bir sonraki oyuncuya aktarır.
 */
export function submitPoetryLine(line) {
    const currentWriter = state.shuffledWritingQueue[state.currentWriterIndex];
    state.writingHistory.push({
        player: currentWriter,
        line: line.trim()
    });
    
    state.writingSubState = 'C'; // Ekran C: Geçiş Ekranı
    saveGameStateToStorage();
}

/**
 * Dize onaylandıktan sonra sonraki oyuncuya geçişi tetikler.
 */
export function confirmWritingPass() {
    state.isWritingTurnActive = false;
    state.writingSubState = 'A'; // Sonraki kurye ekranı
    
    if (state.currentWriterIndex < state.players.length - 1) {
        state.currentWriterIndex++;
    } else {
        // Tur tamamlandı!
        if (state.roundNumber < state.totalRounds) {
            state.roundNumber++;
            startWritingRound();
        } else {
            // Belirlenen turlar bitti! Tartışma/İfşa Odasına Geç.
            state.currentState = STATES.REVEAL;
        }
    }
    saveGameStateToStorage();
}

/**
 * Sahte şairin kelime tahminini doğrular.
 */
export function checkSpyGuess(guess) {
    if (state.spyGuessAttemptsThisRound >= 1) return false;
    
    state.spyGuessAttemptsThisRound++;
    state.spyGuessText = guess.trim();
    const normalizedGuess = normalizeText(guess);
    const normalizedKeyword = normalizeText(state.keyword);
    
    let isCorrect = false;
    
    if (normalizedGuess && normalizedKeyword) {
        // Esnek Karşılaştırma (Fuzzy Matching): Tam eşitlik veya kısmi içerme kontrolü
        if (normalizedGuess === normalizedKeyword || 
            normalizedGuess.includes(normalizedKeyword) || 
            normalizedKeyword.includes(normalizedGuess)) {
            isCorrect = true;
        }
    }
    
    // Sinonimleri (Eş anlamlı alternatifleri) kontrol et
    if (!isCorrect && normalizedGuess && state.keywordSynonyms) {
        for (const syn of state.keywordSynonyms) {
            const normalizedSyn = normalizeText(syn);
            if (normalizedGuess === normalizedSyn || 
                normalizedGuess.includes(normalizedSyn) || 
                normalizedSyn.includes(normalizedGuess)) {
                isCorrect = true;
                break;
            }
        }
    }
    
    if (isCorrect) {
        state.spyGuessedCorrectly = true;
        saveGameStateToStorage();
        return true;
    }
    
    saveGameStateToStorage();
    return false;
}

/**
 * Süre hesaplamasını yapar ve string olarak kaydeder.
 */
export function calculateGameDuration() {
    if (!state.gameStartTime) return "00:00";
    
    const diffMs = Date.now() - state.gameStartTime;
    const diffSec = Math.floor(diffMs / 1000);
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    
    state.gameDurationString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return state.gameDurationString;
}

/**
 * Fisher-Yates Shuffle dizilim karıştırma algoritması
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Türkçe karakter duyarlı, noktalama işaretlerini ve boşlukları silen metin eşleştirme normalizasyonu.
 */
function normalizeText(text) {
    if (!text) return "";
    return text.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ç/g, 'c')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

const LOCAL_STORAGE_KEY = 'vibesave_verses_gamestate';

export function saveGameStateToStorage() {
    try {
        const serializedState = {
            currentState: state.currentState,
            players: state.players,
            spyPlayer: state.spyPlayer,
            spyPlayers: state.spyPlayers,
            doubleSpyMode: state.doubleSpyMode,
            timerLimit: state.timerLimit,
            category: state.category,
            keyword: state.keyword,
            keywordSynonyms: state.keywordSynonyms,
            spyGuessedCorrectly: state.spyGuessedCorrectly,
            spyGuessText: state.spyGuessText,
            totalRounds: state.totalRounds,
            roundNumber: state.roundNumber,
            shuffledWritingQueue: state.shuffledWritingQueue,
            currentWriterIndex: state.currentWriterIndex,
            writingHistory: state.writingHistory,
            gameStartTime: state.gameStartTime,
            distIndex: state.distIndex,
            distSubState: state.distSubState,
            isWritingTurnActive: state.isWritingTurnActive,
            writingSubState: state.writingSubState,
            spyGuessAttemptsThisRound: state.spyGuessAttemptsThisRound,
            spyExposedByGroup: state.spyExposedByGroup,
            playedWordsHistory: state.playedWordsHistory
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedState));
    } catch (e) {
        console.error("Save error:", e);
    }
}

export function loadGameStateFromStorage() {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!saved) return false;
        
        const data = JSON.parse(saved);
        state.currentState = data.currentState;
        state.players = data.players;
        state.spyPlayer = data.spyPlayer;
        state.spyPlayers = data.spyPlayers || [data.spyPlayer];
        state.doubleSpyMode = data.doubleSpyMode || false;
        state.timerLimit = data.timerLimit || 0;
        state.category = data.category;
        state.keyword = data.keyword;
        state.keywordSynonyms = data.keywordSynonyms || [];
        state.spyGuessedCorrectly = data.spyGuessedCorrectly;
        state.spyGuessText = data.spyGuessText;
        state.totalRounds = data.totalRounds;
        state.roundNumber = data.roundNumber;
        state.shuffledWritingQueue = data.shuffledWritingQueue;
        state.currentWriterIndex = data.currentWriterIndex;
        state.writingHistory = data.writingHistory;
        state.gameStartTime = data.gameStartTime;
        state.distIndex = data.distIndex;
        state.distSubState = data.distSubState;
        state.isWritingTurnActive = data.isWritingTurnActive;
        state.writingSubState = data.writingSubState;
        state.spyGuessAttemptsThisRound = data.spyGuessAttemptsThisRound || 0;
        state.spyExposedByGroup = data.spyExposedByGroup || false;
        state.playedWordsHistory = data.playedWordsHistory || [];
        
        if (state.currentState === STATES.ROLE_DISTRIBUTION) {
            state.distSubState = 'A';
        } else if (state.currentState === STATES.WRITING) {
            state.writingSubState = 'A';
        }
        
        return true;
    } catch (e) {
        console.error("Load error:", e);
        return false;
    }
}

export function clearGameStateFromStorage() {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
        console.error("Clear error:", e);
    }
}
