/**
 * DEEN App v8.9.3 - Smart Mastery & Focus Engine
 * 
 * KRİTİK ÖZELLİKLER:
 * 1. ASLA Üst Üste Aynı Format (Özellikle ABCD):
 *    - ABCD -> ABCD kesinlikle yasak
 *    - ABCD -> True/False da yasak (aynı aile)
 *    - Format havuzu daralsa bile format değiştirilir
 * 
 * 2. ODAKLANMA MODU (Mastery Learning):
 *    - Yanlış cevapta oyun DURUR, bitmez
 *    - Sadece yanlış yapılan soru tekrar sorulur
 *    - Soru, doğru cevap verene kadar FARKLI FORMATLARDA sorulur
 *    - Doğru yapıldığında "Harika! Öğrendin!" mesajı
 *    - Bölüm sonunda 100/100 başarı gösterilir
 * 
 * 3. DOPAMİN SİSTEMİ:
 *    - Her doğru cevapta confetti + ses efekti
 *    - Odaklanma modunu kırınca ÖZEL animasyon
 *    - Seri sayacı (3 üst üste doğru = bonus)
 */

class SmartMasteryEngine {
    constructor() {
        // Format geçmişi (son 5 soru)
        this.formatHistory = [];
        this.lastFormat = null;
        this.lastQuestionId = null;
        
        // Format Aileleri (Birbirine benzeyenler)
        this.formatFamilies = {
            'multiple_choice': ['abcd_classic', 'abcd_image', 'true_false', 'yes_no'],
            'drag_interaction': ['drag_drop', 'puzzle_place', 'match_drag'],
            'audio_visual': ['listen_select', 'point_object', 'color_match', 'find_item'],
            'sequence': ['order_items', 'sequence_complete', 'pattern_match']
        };
        
        // Odaklanma Modu (Yanlış cevapta aktif olur)
        this.focusMode = {
            active: false,
            targetQuestion: null,
            attempts: 0,
            usedFormats: [] // Bu soruda kullanılan formatlar
        };
        
        // İstatistikler
        this.stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            focusModeActivations: 0
        };
        
        console.log("🧠 v8.9.3 Smart Mastery Engine Başlatıldı");
    }
    
    /**
     * Sıradaki soruyu seçer - ASLA aynı format üst üste gelmez
     */
    selectNextQuestion(availableQuestions, completedIds) {
        console.group("📝 Soru Seçimi");
        
        // 1. ÖNCE: Odaklanma Modu kontrolü
        if (this.focusMode.active && this.focusMode.targetQuestion) {
            console.log("🎯 ODAKLANMA MODU Aktif - Hedef soru tekrar ediliyor");
            const retryQuestion = this.prepareRetryQuestion(this.focusMode.targetQuestion);
            console.groupEnd();
            return retryQuestion;
        }
        
        // 2. FİLTRELE: Tamamlanan soruları çıkar
        const pendingQuestions = availableQuestions.filter(q => !completedIds.includes(q.id));
        
        if (pendingQuestions.length === 0) {
            console.log("✅ Tüm sorular tamamlandı!");
            console.groupEnd();
            return null; // Bölüm bitti
        }
        
        this.stats.totalQuestions = availableQuestions.length;
        
        // 3. AKILLI SEÇİM: Format çeşitliliği ile soru seç
        let selectedQuestion = null;
        let selectedFormat = null;
        
        // Tüm havuzu tara, uygun format bul
        for (let attempt = 0; attempt < pendingQuestions.length * 3; attempt++) {
            const randomIdx = Math.floor(Math.random() * pendingQuestions.length);
            const candidate = pendingQuestions[randomIdx];
            const candidateFormat = this.determineBestFormat(candidate);
            
            // KONTROL 1: Aynı soru ID'si tekrar etmesin
            if (candidate.id === this.lastQuestionId) {
                continue;
            }
            
            // KONTROL 2: Format izinli mi?
            if (this.isFormatAllowed(candidateFormat)) {
                selectedQuestion = candidate;
                selectedFormat = candidateFormat;
                break;
            }
        }
        
        // 4. HAVUZ DARSA: Format kuralını esnet ama format DEĞİŞTİR
        if (!selectedQuestion && pendingQuestions.length > 0) {
            console.warn("⚠️ Havuz dar, format zorla değiştiriliyor");
            selectedQuestion = pendingQuestions[0];
            selectedFormat = this.forceDifferentFormat(pendingQuestions[0]);
        }
        
        if (selectedQuestion) {
            // Geçmişi güncelle
            this.lastFormat = selectedFormat;
            this.lastQuestionId = selectedQuestion.id;
            this.formatHistory.push(selectedFormat);
            if (this.formatHistory.length > 5) {
                this.formatHistory.shift();
            }
            
            console.log(`✅ Seçildi: ${selectedQuestion.id} | Format: ${selectedFormat}`);
            
            // Soruyu formata dönüştür
            const formattedQuestion = this.applyFormat(selectedQuestion, selectedFormat);
            console.groupEnd();
            return formattedQuestion;
        }
        
        console.error("❌ Hiçbir soru seçilemedi");
        console.groupEnd();
        return null;
    }
    
    /**
     * Formatın izin verilip verilmediğini kontrol eder
     */
    isFormatAllowed(newFormat) {
        if (!this.lastFormat) {
            return true; // İlk soru
        }
        
        // KESİN YASAK: ABCD ailesi üst üste gelemez
        const lastFamily = this.getFormatFamily(this.lastFormat);
        const newFamily = this.getFormatFamily(newFormat);
        
        if (lastFamily === 'multiple_choice' && newFamily === 'multiple_choice') {
            console.log(`❌ YASAK: ${this.lastFormat} -> ${newFormat} (ABCD ailesi)`);
            return false;
        }
        
        // GENEL YASAK: Son 3 soruda aynı format var mı?
        const recentFormats = this.formatHistory.slice(-3);
        if (recentFormats.includes(newFormat)) {
            console.log(`❌ YASAK: ${newFormat} son 3 soruda var`);
            return false;
        }
        
        // GENEL YASAK: Son 5 soruda aynı format ailesi 3'ten fazla mı?
        const recentFamilies = this.formatHistory.slice(-5).map(f => this.getFormatFamily(f));
        const familyCount = recentFamilies.filter(f => f === newFamily).length;
        if (familyCount >= 3) {
            console.log(`❌ YASAK: ${newFamily} ailesi son 5 soruda 3 kez kullanıldı`);
            return false;
        }
        
        console.log(`✅ İZİN VERİLDİ: ${this.lastFormat} -> ${newFormat}`);
        return true;
    }
    
    /**
     * Formatın hangi aileye ait olduğunu bulur
     */
    getFormatFamily(format) {
        for (const [family, formats] of Object.entries(this.formatFamilies)) {
            if (formats.includes(format)) {
                return family;
            }
        }
        return 'unknown';
    }
    
    /**
     * Soru için en uygun formatı belirle
     */
    determineBestFormat(question) {
        // Eğer sorunun tercih edilmiş formatı varsa onu kullan
        if (question.preferredFormat) {
            return question.preferredFormat;
        }
        
        // İçeriğe göre otomatik karar
        if (question.audio && !question.text) {
            return 'listen_select';
        }
        if (question.image && question.options && question.options.length <= 4) {
            return 'abcd_image';
        }
        if (question.parts || question.puzzlePieces) {
            return 'puzzle_place';
        }
        if (question.dragItems) {
            return 'drag_drop';
        }
        if (question.sequence) {
            return 'order_items';
        }
        
        // Varsayılan: Klasik ABCD (ama bu asla üst üste gelmeyecek)
        return 'abcd_classic';
    }
    
    /**
     * Zorunlu format değişikliği (havuz daraldığında)
     */
    forceDifferentFormat(question) {
        const allFormats = ['abcd_image', 'drag_drop', 'listen_select', 'puzzle_place', 'order_items'];
        const allowed = allFormats.filter(f => {
            const family = this.getFormatFamily(f);
            const lastFamily = this.getFormatFamily(this.lastFormat);
            
            // ABCD ailesinden kaçın
            if (lastFamily === 'multiple_choice' && family === 'multiple_choice') {
                return false;
            }
            
            // Son formatla aynı olmasın
            return f !== this.lastFormat;
        });
        
        return allowed.length > 0 
            ? allowed[Math.floor(Math.random() * allowed.length)]
            : 'abcd_image';
    }
    
    /**
     * Soruyu seçilen formata dönüştürür
     */
    applyFormat(question, format) {
        return {
            ...question,
            activeFormat: format,
            timestamp: Date.now(),
            isRetry: false
        };
    }
    
    /**
     * YANLIŞ CEVAP: Odaklanma Modunu başlat
     */
    handleWrongAnswer(question, allQuestions, completedIds) {
        console.group("❌ Yanlış Cevap - Odaklanma Modu");
        
        this.stats.wrongAnswers++;
        this.stats.currentStreak = 0;
        this.stats.focusModeActivations++;
        
        // Odaklanma modunu başlat
        this.focusMode = {
            active: true,
            targetQuestion: question,
            attempts: 0,
            usedFormats: [question.activeFormat] // İlk denenen formatı kaydet
        };
        
        console.log(`🎯 Odaklanma Modu Başlatıldı: ${question.id}`);
        console.log(`📊 İstatistikler:`, this.stats);
        
        // UI'a bildirim gönder
        this.triggerFocusModal(question);
        
        // Aynı soruyu farklı formatta geri döndür
        const retryQuestion = this.prepareRetryQuestion(question);
        console.groupEnd();
        return retryQuestion;
    }
    
    /**
     * Tekrar sorulacak soruyu hazırla (farklı format ile)
     */
    prepareRetryQuestion(question) {
        this.focusMode.attempts++;
        
        // Kullanılmamış formatları bul
        const allFormats = ['drag_drop', 'puzzle_place', 'listen_select', 'abcd_image', 'order_items'];
        const unusedFormats = allFormats.filter(f => !this.focusMode.usedFormats.includes(f));
        
        // En interaktif formatı seç (sıkıcı olmasın)
        let newFormat;
        if (unusedFormats.length > 0) {
            // Önce sürükle-bırak, sonra puzzle, sonra dinleme
            const priorityOrder = ['drag_drop', 'puzzle_place', 'listen_select', 'abcd_image'];
            newFormat = priorityOrder.find(f => unusedFormats.includes(f)) || unusedFormats[0];
        } else {
            // Tüm formatlar kullanıldıysa, rastgele birini seç
            newFormat = allFormats[Math.floor(Math.random() * allFormats.length)];
        }
        
        this.focusMode.usedFormats.push(newFormat);
        
        console.log(`🔄 Tekrar Deneme #${this.focusMode.attempts} | Yeni Format: ${newFormat}`);
        
        return {
            ...question,
            activeFormat: newFormat,
            isRetry: true,
            retryCount: this.focusMode.attempts,
            hint: this.generateHint(question, this.focusMode.attempts)
        };
    }
    
    /**
     * Doğru cevap verildiğinde ne olacak
     */
    handleCorrectAnswer(questionId, isFocusClear = false) {
        console.group("✅ Doğru Cevap");
        
        this.stats.correctAnswers++;
        this.stats.currentStreak++;
        
        if (this.stats.currentStreak > this.stats.bestStreak) {
            this.stats.bestStreak = this.stats.currentStreak;
        }
        
        let resultType = 'NORMAL_PROGRESS';
        
        // Eğer odaklanma modundaysak ve doğru cevap geldiyse
        if (this.focusMode.active && isFocusClear) {
            console.log("🎉 ODAKLANMA MODU TAMAMLANDI!");
            
            // Odaklanma modunu kapat
            this.focusMode = {
                active: false,
                targetQuestion: null,
                attempts: 0,
                usedFormats: []
            };
            
            // Özel ödül
            this.triggerFocusSuccess();
            resultType = 'FOCUS_CLEARED';
        } else {
            // Normal ilerleme
            this.triggerNormalSuccess();
            
            // Seri bonusu (3 üst üste doğru)
            if (this.stats.currentStreak >= 3) {
                this.triggerStreakBonus(this.stats.currentStreak);
            }
        }
        
        console.log(`📊 İstatistikler:`, this.stats);
        console.groupEnd();
        return resultType;
    }
    
    /**
     * İpucu üret (tekrar sayısına göre)
     */
    generateHint(question, attemptNum) {
        if (attemptNum === 1) {
            return "🤔 Bir daha düşün...";
        } else if (attemptNum === 2) {
            return "💡 İpucu: " + (question.hint || "Görseli dikkatlice incele");
        } else {
            return "✨ Kolay gelsin: " + (question.answerExplanation || "Doğru cevaba yakınsın");
        }
    }
    
    // ==================== UI TETİKLEYİCİLERİ ====================
    
    triggerFocusModal(question) {
        console.log("📢 UI: Odaklanma Modalı Açılıyor");
        
        // Gerçek implementasyonda burası modal açacak
        const modalMessage = `
            🎯 BIRAZ ZORLANDIK!
            
            "${question.text || question.prompt}"
            
            Hadi birlikte öğrenelim! 💪
        `;
        
        console.log(modalMessage);
        
        if (window.DEEN_UI?.showFocusModal) {
            window.DEEN_UI.showFocusModal({
                question: question,
                message: "Biraz zorlandık, hadi birlikte öğrenelim!",
                attempts: this.focusMode.attempts
            });
        }
    }
    
    triggerFocusSuccess() {
        console.log("🎉 UI: ÖZEL BAŞARI Animasyonu");
        
        // Konfeti + özel ses + büyük animasyon
        if (window.DEEN_UI?.showFocusSuccess) {
            window.DEEN_UI.showFocusSuccess({
                message: "HARİKA! ÖĞRENDİN! 🌟",
                subMessage: "Şimdi devam edebiliriz!",
                effect: 'mega_confetti'
            });
        }
    }
    
    triggerNormalSuccess() {
        console.log("✨ UI: Normal Başarı");
        
        if (window.DEEN_UI?.showNormalSuccess) {
            window.DEEN_UI.showNormalSuccess({
                streak: this.stats.currentStreak
            });
        }
    }
    
    triggerStreakBonus(streak) {
        console.log("🔥 UI: Seri Bonusu!", streak);
        
        if (window.DEEN_UI?.showStreakBonus) {
            window.DEEN_UI.showStreakBonus({
                streak: streak,
                message: streak >= 5 ? "MUHTEŞEM! 🔥🔥🔥" : "DEVAM ET! 🔥"
            });
        }
    }
    
    /**
     * Bölüm sonu raporu (100/100 sistemi)
     */
    generateEndReport(allQuestions, completedIds) {
        const totalQuestions = allQuestions.length;
        const completedCount = completedIds.length;
        const accuracy = this.stats.correctAnswers / (this.stats.correctAnswers + this.stats.wrongAnswers) * 100;
        
        // Final skor HER ZAMAN 100/100 çünkü yanlışlar düzeltilene kadar devam ediyor
        const finalScore = 100;
        
        return {
            score: finalScore,
            totalQuestions: totalQuestions,
            completedCount: completedCount,
            accuracy: Math.round(accuracy),
            totalAttempts: this.stats.correctAnswers + this.stats.wrongAnswers,
            focusModeActivations: this.stats.focusModeActivations,
            bestStreak: this.stats.bestStreak,
            message: this.getEndMessage(accuracy, this.stats.focusModeActivations)
        };
    }
    
    getEndMessage(accuracy, focusActivations) {
        if (focusActivations === 0) {
            return "🏆 MÜKEMMEL! Hiç hata yapmadan tamamladın!";
        } else if (focusActivations <= 2) {
            return "🌟 HARİKA! Birkaç zorluk yaşadın ama hepsini öğrendin!";
        } else {
            return "💪 TEKRİKLER! Zorlandığın yerleri öğrendin ve bitirdin!";
        }
    }
    
    /**
     * Motoru sıfırla (yeni bölüm için)
     */
    reset() {
        this.formatHistory = [];
        this.lastFormat = null;
        this.lastQuestionId = null;
        this.focusMode = {
            active: false,
            targetQuestion: null,
            attempts: 0,
            usedFormats: []
        };
        this.stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            focusModeActivations: 0
        };
        console.log("🔄 Smart Mastery Engine sıfırlandı");
    }
}

// Global erişim
window.SmartMasteryEngine = SmartMasteryEngine;
console.log("🚀 DEEN v8.9.3 Smart Mastery & Focus Engine Yüklendi");
