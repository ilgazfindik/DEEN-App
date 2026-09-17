/**
 * DEEN App v8.9.4 - Multi-Format & Smart Converter Engine
 * Amaç: Metin tabanlı soruları otomatik olarak görsel/işitsel oyunlara dönüştürmek.
 * Hedef: 3 yaş+ çocuklar için okuma gerektirmeyen, tamamen görsel/işitsel deneyim.
 */

class MultiFormatEngine {
    constructor() {
        this.availableFormats = [
            'drag_drop_match',    // Kelimeyi resme sürükle
            'audio_listen_point', // Sesi dinle ve işaretle
            'visual_memory',      // Kart eşleştirme
            'puzzle_assemble',    // Basit yapboz
            'image_select',       // Çoktan seçmeli ama sadece resimli (ABCD yok)
            'happy_path'          // Doğru yolu takip et
        ];
        
        this.lastFormat = null;
        this.formatHistory = [];
    }

    /**
     * Ana Metod: Gelen veriyi analiz et ve en uygun çocuk dostu formata dönüştür
     * @param {Object} originalQuestion - Orijinal soru verisi (text, options, answer)
     * @param {string} forcedFormat - İstenilen format (opsiyonel)
     */
    convertToChildFriendly(originalQuestion, forcedFormat = null) {
        let targetFormat = forcedFormat || this.selectBestFormat(originalQuestion);
        
        // Asla üst üste aynı format gelmesin (Özellikle ABCD)
        if (targetFormat === this.lastFormat && this.availableFormats.length > 1) {
            const alternatives = this.availableFormats.filter(f => f !== this.lastFormat);
            targetFormat = alternatives[Math.floor(Math.random() * alternatives.length)];
        }

        this.lastFormat = targetFormat;
        this.formatHistory.push(targetFormat);
        if (this.formatHistory.length > 5) this.formatHistory.shift();

        console.log(`[Converter] Soru tipi: ${targetFormat}`);

        switch (targetFormat) {
            case 'drag_drop_match':
                return this.createDragDropGame(originalQuestion);
            case 'audio_listen_point':
                return this.createAudioGame(originalQuestion);
            case 'visual_memory':
                return this.createMemoryGame(originalQuestion);
            case 'puzzle_assemble':
                return this.createPuzzleGame(originalQuestion);
            case 'image_select':
                return this.createImageSelectGame(originalQuestion);
            case 'happy_path':
                return this.createHappyPathGame(originalQuestion);
            default:
                return originalQuestion; // Fallback
        }
    }

    /**
     * Akıllı Format Seçici: Sorunun içeriğine göre en iyi oyunu seçer
     */
    selectBestFormat(question) {
        // Eğer soruda görsel varsa -> Sürükle Bırak veya Hafıza
        if (question.image || (question.options && question.options.some(opt => opt.image))) {
            const randomVisual = ['drag_drop_match', 'image_select', 'visual_memory'];
            return randomVisual[Math.floor(Math.random() * randomVisual.length)];
        }
        
        // Eğer soru ses içeriyorsa veya kelime öğrenme ise -> Dinle ve İşaretle
        if (question.audio || question.type === 'vocabulary') {
            return 'audio_listen_point';
        }

        // Varsayılan olarak görsel ağırlıklı seçim
        return 'image_select';
    }

    // --- OYUN TİPİ OLUŞTURUCULARI ---

    createDragDropGame(q) {
        return {
            type: 'drag_drop_match',
            instruction: "Kelimeyi doğru resmin üzerine sürükle!",
            instructionAudio: "surukle_birak.mp3", // Örnek ses dosyası
            targetWord: q.correctAnswer.text || q.correctAnswer,
            targetImage: q.correctAnswer.image || `assets/images/${q.correctAnswer}.png`,
            distractors: q.options.filter(o => o !== q.correctAnswer).map(o => ({
                text: o.text || o,
                image: o.image || `assets/images/${o}.png`
            })),
            render: this.renderDragDrop
        };
    }

    createAudioGame(q) {
        return {
            type: 'audio_listen_point',
            instruction: "Dinle ve doğru resmi bul!",
            audioSrc: q.audio || this.generateTTS(q.correctAnswer.text || q.correctAnswer),
            options: q.options.map(opt => ({
                image: opt.image || `assets/images/${opt.text || opt}.png`,
                isCorrect: opt === q.correctAnswer || opt.text === q.correctAnswer.text
            })),
            render: this.renderAudioPoint
        };
    }

    createMemoryGame(q) {
        // Kart çiftleri oluştur (Resim + Eşleşen Kelime/Resim)
        let cards = [];
        const correct = q.correctAnswer.text || q.correctAnswer;
        const correctImg = q.correctAnswer.image || `assets/images/${correct}.png`;
        
        cards.push({ id: 1, content: correct, type: 'text', matchId: 1 });
        cards.push({ id: 1, content: correctImg, type: 'image', matchId: 1 });

        // Yanlış şıkları ekle
        q.options.filter(o => o !== q.correctAnswer).slice(0, 2).forEach((opt, idx) => {
            const txt = opt.text || opt;
            const img = opt.image || `assets/images/${txt}.png`;
            cards.push({ id: idx+2, content: txt, type: 'text', matchId: idx+2 });
            cards.push({ id: idx+2, content: img, type: 'image', matchId: idx+2 });
        });

        // Karıştır
        cards.sort(() => Math.random() - 0.5);

        return {
            type: 'visual_memory',
            instruction: "Eşleşen kartları bul!",
            cards: cards,
            render: this.renderMemory
        };
    }

    createImageSelectGame(q) {
        // Klasik ABCD yerine sadece büyük resimler
        return {
            type: 'image_select',
            instruction: "Doğru olanı seç!",
            options: q.options.map(opt => ({
                image: opt.image || `assets/images/${opt.text || opt}.png`,
                label: opt.text || opt,
                isCorrect: opt === q.correctAnswer || opt.text === q.correctAnswer.text
            })),
            render: this.renderImageSelect
        };
    }

    createPuzzleGame(q) {
        return {
            type: 'puzzle_assemble',
            instruction: "Parçaları birleştir!",
            mainImage: q.correctAnswer.image || `assets/images/${q.correctAnswer.text || q.correctAnswer}.png`,
            pieces: 4, // 4 parçalık puzzle
            render: this.renderPuzzle
        };
    }

    createHappyPathGame(q) {
        return {
            type: 'happy_path',
            instruction: "Doğru yola git!",
            correctPath: q.correctAnswer.text || q.correctAnswer,
            wrongPaths: q.options.filter(o => o !== q.correctAnswer).map(o => o.text || o),
            render: this.renderHappyPath
        };
    }

    // --- RENDER FONKSİYONLARI (DOM Manipülasyonu) ---
    
    renderDragDrop(container, data) {
        container.innerHTML = `<h3>${data.instruction}</h3><div class="game-area drag-drop"></div>`;
        const gameArea = container.querySelector('.game-area');
        
        // Hedef Alanlar (Resimler)
        const targetsContainer = document.createElement('div');
        targetsContainer.className = 'targets';
        [data.targetImage, ...data.distractors.map(d => d.image)].forEach((imgSrc, i) => {
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.dataset.index = i;
            dropZone.style.backgroundImage = `url(${imgSrc})`;
            dropZone.innerHTML = '<span class="placeholder">?</span>';
            targetsContainer.appendChild(dropZone);
        });

        // Sürüklenebilir Kelime
        const draggable = document.createElement('div');
        draggable.className = 'draggable';
        draggable.draggable = true;
        draggable.innerText = data.targetWord;
        draggable.dataset.correct = "0"; // İlk kutu doğru kabul edilecek basitlik için

        gameArea.appendChild(draggable);
        gameArea.appendChild(targetsContainer);

        // Basit Sürükle Bırak Mantığı (Touch destekli olması gerekir, burada temel yapı var)
        // Gerçek implementasyon için touch events eklenecek (v8.9.4 UI içinde)
        console.log("DragDrop Rendered");
    }

    renderAudioPoint(container, data) {
        container.innerHTML = `<h3>${data.instruction}</h3>`;
        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-btn-large';
        audioBtn.innerHTML = '🔊 Tekrar Dinle';
        audioBtn.onclick = () => {
            const audio = new Audio(data.audioSrc);
            audio.play();
            // Dopamin: Butona basınca hafif titreşim
            if(navigator.vibrate) navigator.vibrate(50);
        };
        container.appendChild(audioBtn);

        const grid = document.createElement('div');
        grid.className = 'image-grid';
        data.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-card';
            btn.style.backgroundImage = `url(${opt.image})`;
            btn.onclick = () => {
                if(opt.isCorrect) {
                    // Doğru cevap handled by engine
                    window.gameEngine.handleCorrect(i);
                } else {
                    window.gameEngine.handleWrong(i);
                }
            };
            grid.appendChild(btn);
        });
        container.appendChild(grid);
        
        // Otomatik başlat
        setTimeout(() => audioBtn.click(), 500);
    }

    renderMemory(container, data) {
        container.innerHTML = `<h3>${data.instruction}</h3><div class="memory-grid"></div>`;
        const grid = container.querySelector('.memory-grid');
        
        data.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.id = card.matchId;
            cardEl.dataset.content = card.content;
            cardEl.innerHTML = '<div class="front">?</div><div class="back"></div>';
            
            if(card.type === 'image') {
                cardEl.querySelector('.back').style.backgroundImage = `url(${card.content})`;
            } else {
                cardEl.querySelector('.back').innerText = card.content;
            }

            cardEl.onclick = function() {
                if(this.classList.contains('flipped')) return;
                this.classList.add('flipped');
                window.gameEngine.checkMemoryMatch(this);
            };
            grid.appendChild(cardEl);
        });
    }

    renderImageSelect(container, data) {
        container.innerHTML = `<h3>${data.instruction}</h3><div class="image-select-grid"></div>`;
        const grid = container.querySelector('.image-select-grid');
        
        data.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'big-option-card';
            btn.style.backgroundImage = `url(${opt.image})`;
            btn.onclick = () => {
                if(opt.isCorrect) window.gameEngine.handleCorrect(i);
                else window.gameEngine.handleWrong(i);
            };
            grid.appendChild(btn);
        });
    }

    renderPuzzle(container, data) {
        container.innerHTML = `<h3>${data.instruction}</h3><div class="puzzle-area"></div>`;
        // Puzzle mantığı basitleştirilmiş: Parçaları sırayla tıkla
        const area = container.querySelector('.puzzle-area');
        for(let i=0; i<data.pieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.innerText = `Parça ${i+1}`;
            piece.onclick = () => {
                // Animasyon oynat
                piece.classList.add('placed');
                // Hepsi yerleşti mi kontrol et
                if(document.querySelectorAll('.placed').length === data.pieces) {
                    window.gameEngine.handleCorrect(-1);
                }
            };
            area.appendChild(piece);
        }
    }

    renderHappyPath(container, data) {
        container.innerHTML = `<h3>${data.instruction}</h3><div class="path-area"></div>`;
        // Basit yol oyunu temsili
        const area = container.querySelector('.path-area');
        area.innerHTML = "<p>Yol haritası yükleniyor...</p>";
        // Gerçek implementasyon canvas veya SVG ile yapılacak
    }

    // Basit TTS (Text-to-Speech) simülasyonu - Tarayıcı desteği varsa
    generateTTS(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            utterance.rate = 0.9; // Çocuklar için biraz yavaş
            // Geriye blob URL dönmek yerine doğrudan çalacağız, 
            // ama arayüz uyumluluğu için dummy url dönebiliriz.
            // Bu fonksiyon renderAudioPoint içinde doğrudan kullanılacak.
            return null; 
        }
        return 'assets/audio/default.mp3';
    }
}

// Global erişim için
window.MultiFormatEngine = MultiFormatEngine;
