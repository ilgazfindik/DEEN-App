/**
 * DEEN App v8.9.2 - Smart Flow & Focus Engine
 * 
 * ÖZELLİKLER:
 * 1. ASLA Üst Üste Aynı Format: Özellikle ABCD soruları arka arkaya gelmez.
 *    Havuzda çeşitlilik yoksa bile format değiştirilir (örn: ABCD -> Sürükle Bırak).
 * 
 * 2. ODAKLANMA MODU (Focus Mode):
 *    - Kullanıcı yanlış yaptığında oyun bitmez, durur.
 *    - Sadece yanlış yapılan soru tekrar sorulur.
 *    - Soru, kullanıcı doğru cevap verene kadar (farklı formatlarda) karşısına çıkar.
 *    - Doğru yapıldığında bölüm "100/100" başarı ile tamamlanır.
 *    - Tüm sorular baştan sorulmaz, sadece eksik kapatılır.
 */

class SmartFlowEngine {
    constructor() {
        this.lastFormat = null;
        this.lastQuestionId = null;
        this.formatHistory = []; // Son 5 formatı tutar
        this.focusMode = {
            active: false,
            targetQuestion: null,
            attempts: 0
        };
        
        // Format Aileleri (Benzer mantıklar üst üste gelmesin)
        this.formatFamilies = {
            'multiple_choice': ['abcd_classic', 'abcd_image', 'true_false'],
            'interaction': ['drag_drop', 'puzzle', 'match_pair'],
            'audio_visual': ['listen_select', 'point_object', 'color_match']
        };
    }

    /**
     * Bir sonraki soruyu seçer.
     * @param {Array} availableQuestions - Bölümdeki tüm sorular
     * @param {Array} completedIds - Daha önce doğru yapılan soru ID'leri
     */
    selectNextQuestion(availableQuestions, completedIds) {
        // 1. ÖNCE: Odaklanma Modu Kontrolü
        if (this.focusMode.active && this.focusMode.targetQuestion) {
            console.log("🎯 ODAKLANMA MODU: Hedef soru tekrar sunuluyor.");
            return this.transformQuestionForRetry(this.focusMode.targetQuestion);
        }

        // 2. FİLTRELEME: Tamamlananları çıkar
        const pendingQuestions = availableQuestions.filter(q => !completedIds.includes(q.id));

        if (pendingQuestions.length === 0) {
            return null; // Bölüm bitti
        }

        // 3. AKILLI SEÇİM: Format Çeşitliliği
        let selectedQuestion = null;
        let bestFormat = null;

        // Deneme sayısı limiti (Tüm havuz taransın diye)
        let attempts = 0;
        const maxAttempts = pendingQuestions.length * 2;

        while (attempts < maxAttempts) {
            // Rastgele bir soru seç
            const randomIndex = Math.floor(Math.random() * pendingQuestions.length);
            const candidate = pendingQuestions[randomIndex];
            
            // Bu sorunun formatını belirle (veya mevcut formatını kullan)
            const candidateFormat = this.determineFormat(candidate);

            // KONTROL 1: Aynı soru ID'si üst üste gelmesin (nadiren olabilir)
            if (candidate.id === this.lastQuestionId) {
                attempts++;
                continue;
            }

            // KONTROL 2: Aynı format ailesi üst üste gelmesin
            if (this.isFormatAllowed(candidateFormat)) {
                selectedQuestion = candidate;
                bestFormat = candidateFormat;
                break;
            }
            
            attempts++;
        }

        // Eğer hiçbir uygun soru bulunamazsa (havuz çok küçükse), kuralı esnet ama formatı değiştir
        if (!selectedQuestion && pendingQuestions.length > 0) {
            selectedQuestion = pendingQuestions[0];
            bestFormat = this.forceFormatChange(pendingQuestions[0]);
            console.warn("⚠️ Havuz dar, format kuralı esnetildi ama format değiştirildi.");
        }

        if (selectedQuestion) {
            this.lastFormat = bestFormat;
            this.lastQuestionId = selectedQuestion.id;
            this.formatHistory.push(bestFormat);
            if (this.formatHistory.length > 5) this.formatHistory.shift();
            
            return this.applyFormat(selectedQuestion, bestFormat);
        }

        return null;
    }

    /**
     * Formatın izin verilip verilmediğini kontrol eder.
     */
    isFormatAllowed(newFormat) {
        if (!this.lastFormat) return true;

        // Kesin Kural: ABCD türü sorular asla arka arkaya gelmez
        const isLastABCD = this.formatFamilies.multiple_choice.includes(this.lastFormat);
        const isNewABCD = this.formatFamilies.multiple_choice.includes(newFormat);

        if (isLastABCD && isNewABCD) {
            return false;
        }

        // Genel Kural: Son 3 soruda aynı format var mı?
        const recentFormats = this.formatHistory.slice(-3);
        if (recentFormats.includes(newFormat)) {
            return false;
        }

        return true;
    }

    /**
     * Zorunlu format değişikliği (Havuz daraldığında)
     */
    forceFormatChange(question) {
        const allFormats = ['abcd_image', 'drag_drop', 'listen_select', 'puzzle'];
        const allowed = allFormats.filter(f => f !== this.lastFormat);
        return allowed[Math.floor(Math.random() * allowed.length)];
    }

    /**
     * Soruya format atar.
     */
    determineFormat(question) {
        // Eğer sorunun özel bir formatı varsa onu kullan
        if (question.preferredFormat) return question.preferredFormat;
        
        // İçeriğe göre otomatik karar
        if (question.image && question.options) return 'abcd_image';
        if (question.audio) return 'listen_select';
        if (question.parts) return 'puzzle';
        
        return 'abcd_classic'; // Varsayılan
    }

    /**
     * Soruyu seçilen formata dönüştürür (Renderer'a veri hazırlar)
     */
    applyFormat(question, format) {
        return {
            ...question,
            activeFormat: format,
            timestamp: Date.now()
        };
    }

    /**
     * YANLIŞ CEVAP TEPKİSİ: Odaklanma Modunu Başlat
     */
    handleWrongAnswer(question, allQuestions, completedIds) {
        console.warn("❌ Yanlış Cevap! Odaklanma Modu devrede.");
        
        this.focusMode = {
            active: true,
            targetQuestion: question,
            attempts: 0
        };

        // UI'a bildirim gönder (Modal vs.)
        this.triggerFocusUI();

        // Hemen aynı soruyu (dönüştürülmüş haliyle) geri döndür
        return this.transformQuestionForRetry(question);
    }

    /**
     * Soruyu tekrar sorarken formatını değiştirir ki sıkıcı olmasın.
     * Örnek: İlk sefer ABCD idi -> İkinci sefer Sürükle Bırak olsun.
     */
    transformQuestionForRetry(question) {
        this.focusMode.attempts++;
        
        let newFormat = 'drag_drop'; // Varsayılan olarak daha interaktif bir şey yap
        if (this.focusMode.attempts % 2 === 0) {
            newFormat = 'puzzle'; // Çift denemelerde puzzle
        } else if (this.focusMode.attempts % 3 === 0) {
            newFormat = 'listen_select'; // Üçlü denemelerde dinleme
        }

        // Eğer soru bu formatı desteklemiyorsa en basite düş
        if (newFormat === 'drag_drop' && !question.dragData) {
            newFormat = 'abcd_image'; 
        }

        console.log(`🔄 Tekrar Deneme #${this.focusMode.attempts} | Format: ${newFormat}`);
        
        return {
            ...question,
            activeFormat: newFormat,
            isRetry: true,
            retryCount: this.focusMode.attempts
        };
    }

    /**
     * DOĞRU CEVAP TEPKİSİ: Odaklanma Modunu Kontrol Et
     */
    handleCorrectAnswer(questionId) {
        if (this.focusMode.active) {
            console.log("✅ Odaklanma Modu Başarılı! Kilit açıldı.");
            
            // Odaklanma modunu kapat
            this.focusMode = { active: false, targetQuestion: null, attempts: 0 };
            
            // Kullanıcıya özel ödül mesajı
            this.triggerSuccessUI(true); // true = "Harika, şimdi devam edelim" modu
            
            return 'FOCUS_CLEARED';
        }
        
        this.triggerSuccessUI(false);
        return 'NORMAL_PROGRESS';
    }

    // --- UI Tetikleyicileri (Gerçek UI kodu buraya bağlanacak) ---
    triggerFocusUI() {
        // Gerçek implementasyonda burası bir modal açacak:
        // "Biraz zorlandık, hadi bunu birlikte öğrenelim!"
        console.log("📢 UI: Odaklanma Modalı Açıldı");
        if (window.DEEN_UI && window.DEEN_UI.showFocusModal) {
            window.DEEN_UI.showFocusModal();
        }
    }

    triggerSuccessUI(isFocusClear) {
        if (isFocusClear) {
            console.log("🎉 UI: Harika! Öğrendin ve devam ediyoruz.");
            // Konfeti patlat ama oyunu bitirme, bir sonraki soruya geç
            if (window.DEEN_UI && window.DEEN_UI.showFocusSuccess) {
                window.DEEN_UI.showFocusSuccess();
            }
        } else {
            console.log("✨ UI: Doğru!");
            if (window.DEEN_UI && window.DEEN_UI.showNormalSuccess) {
                window.DEEN_UI.showNormalSuccess();
            }
        }
    }
}

// Global Erişim
window.SmartFlowEngine = SmartFlowEngine;
console.log("🚀 DEEN v8.9.2 Smart Flow Engine Yüklendi.");
