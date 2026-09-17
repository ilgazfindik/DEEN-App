/**
 * DEEN App v8.9.4 - Focus Mode UI Integration
 * 
 * ODAKLANMA MODU ARAYÜZÜ:
 * - Yanlış cevapta modal açılır
 * - Soru farklı formatta tekrar sorulur
 * - Doğru yapıldığında özel animasyon
 * - Final ekranı 100/100 gösterir
 */

class FocusModeUI {
    constructor() {
        this.modalContainer = null;
        this.confettiCanvas = null;
        console.log("🎨 v8.9.4 Focus Mode UI Başlatıldı");
    }

    /**
     * Modal'ı oluştur (ilk çağrıda)
     */
    createModalContainer() {
        if (this.modalContainer) return;

        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'focus-modal-container';
        this.modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7, 21, 28, 0.95);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(this.modalContainer);
    }

    /**
     * Odaklanma Modalını Göster
     */
    showFocusModal(data) {
        console.log("📢 Focus Modal Gösteriliyor:", data);
        
        this.createModalContainer();
        
        const { question, message, attempts } = data;
        
        const emoji = attempts === 1 ? '🤔' : attempts === 2 ? '💡' : '✨';
        const bgColor = attempts === 1 ? '#1a3a4a' : attempts === 2 ? '#2a4a5a' : '#3a5a6a';
        
        this.modalContainer.innerHTML = `
            <div style="
                background: ${bgColor};
                border-radius: 24px;
                padding: 32px;
                max-width: 90%;
                width: 340px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                animation: slideUp 0.4s ease;
            ">
                <div style="font-size: 64px; margin-bottom: 16px;">${emoji}</div>
                <h2 style="
                    color: #91e2ca;
                    font-size: 22px;
                    margin: 0 0 12px 0;
                    font-weight: 700;
                ">${message}</h2>
                <p style="
                    color: #eef7f4;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0 0 24px 0;
                ">
                    "${question.text || question.prompt || 'Soruyu tekrar çözelim'}"
                </p>
                ${attempts > 1 ? `
                    <div style="
                        background: rgba(145, 226, 202, 0.2);
                        border-radius: 12px;
                        padding: 12px;
                        margin-bottom: 20px;
                    ">
                        <p style="
                            color: #91e2ca;
                            font-size: 14px;
                            margin: 0;
                        ">💡 İpucu: ${question.hint || 'Dikkatlice düşün'}</p>
                    </div>
                ` : ''}
                <button onclick="window.DEEN_FOCUS_UI.closeModal()" style="
                    background: #91e2ca;
                    color: #07151c;
                    border: none;
                    border-radius: 16px;
                    padding: 14px 32px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    TAMAM, HAZIRIM! 💪
                </button>
            </div>
        `;

        this.modalContainer.style.display = 'flex';
        
        // Ses efekti
        this.playSound('thinking');
    }

    /**
     * Modalı Kapat
     */
    closeModal() {
        if (!this.modalContainer) return;
        this.modalContainer.style.display = 'none';
    }

    /**
     * Odaklanma Başarısı - Özel Animasyon
     */
    showFocusSuccess(data) {
        console.log("🎉 Focus Success Gösteriliyor:", data);
        
        const { message, subMessage, effect } = data;
        
        // Full-screen başarı ekranı
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #07151c 0%, #1a3a4a 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease;
        `;

        successOverlay.innerHTML = `
            <div style="font-size: 80px; animation: bounce 0.6s ease;">🌟</div>
            <h1 style="
                color: #91e2ca;
                font-size: 32px;
                margin: 24px 0 12px 0;
                font-weight: 900;
                text-align: center;
                animation: slideUp 0.5s ease;
            ">${message}</h1>
            <p style="
                color: #eef7f4;
                font-size: 18px;
                margin: 0 0 32px 0;
                animation: slideUp 0.6s ease;
            ">${subMessage}</p>
            <button onclick="window.DEEN_FOCUS_UI.closeSuccessScreen()" style="
                background: linear-gradient(135deg, #91e2ca 0%, #7ad1b8 100%);
                color: #07151c;
                border: none;
                border-radius: 20px;
                padding: 16px 40px;
                font-size: 18px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(145, 226, 202, 0.4);
                animation: slideUp 0.7s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                DEVAM ET 🚀
            </button>
        `;

        document.body.appendChild(successOverlay);
        
        // Confetti efekti
        if (effect === 'mega_confetti') {
            this.triggerConfetti();
        }
        
        // Ses efekti
        this.playSound('success_mega');
    }

    /**
     * Başarı ekranını kapat
     */
    closeSuccessScreen() {
        const overlay = document.querySelector('[style*="z-index: 10000"]');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Normal Başarı (küçük ödül)
     */
    showNormalSuccess(data) {
        console.log("✨ Normal Success:", data);
        
        const { streak } = data;
        
        // Küçük bildirim
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #91e2ca 0%, #7ad1b8 100%);
            color: #07151c;
            padding: 16px 24px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 16px;
            z-index: 9998;
            box-shadow: 0 4px 16px rgba(145, 226, 202, 0.4);
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2s forwards;
        `;

        const emojis = ['✅', '🎯', '⭐', '🔥', '💫'];
        const emoji = streak >= 5 ? '🔥' : streak >= 3 ? '⭐' : '✅';
        
        notification.textContent = `${emoji} Harika! (${streak} seri)`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2300);
        
        // Ses efekti
        this.playSound('success_normal');
    }

    /**
     * Seri Bonusu
     */
    showStreakBonus(data) {
        console.log("🔥 Streak Bonus:", data);
        
        const { streak, message } = data;
        
        const bonusOverlay = document.createElement('div');
        bonusOverlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
            color: white;
            padding: 24px 40px;
            border-radius: 20px;
            font-weight: 900;
            font-size: 24px;
            z-index: 9997;
            box-shadow: 0 8px 32px rgba(255, 107, 107, 0.5);
            animation: popIn 0.4s ease, fadeOut 0.4s ease 1.5s forwards;
        `;

        bonusOverlay.textContent = `${message} ${streak}x`;
        document.body.appendChild(bonusOverlay);
        
        setTimeout(() => bonusOverlay.remove(), 1900);
        
        // Ses efekti
        this.playSound('streak_bonus');
    }

    /**
     * Confetti Efekti
     */
    triggerConfetti() {
        console.log("🎊 Confetti Tetiklendi");
        
        const canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9996;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const colors = ['#91e2ca', '#7ad1b8', '#ffd700', '#ff6b6b', '#ffa500', '#ffffff'];
        
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 + 2,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
        
        let animationFrame = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });
            
            animationFrame++;
            if (animationFrame < 120) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        };
        
        animate();
    }

    /**
     * Ses Efektleri
     */
    playSound(type) {
        console.log("🔊 Ses Çalınıyor:", type);
        
        // Basit oscillator ile ses üretme
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            switch(type) {
                case 'thinking':
                    oscillator.frequency.value = 440;
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    oscillator.start(audioCtx.currentTime);
                    oscillator.stop(audioCtx.currentTime + 0.3);
                    break;
                    
                case 'success_normal':
                    oscillator.frequency.value = 523.25; // C5
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                    oscillator.start(audioCtx.currentTime);
                    oscillator.stop(audioCtx.currentTime + 0.2);
                    
                    setTimeout(() => {
                        const osc2 = audioCtx.createOscillator();
                        const gain2 = audioCtx.createGain();
                        osc2.connect(gain2);
                        gain2.connect(audioCtx.destination);
                        osc2.frequency.value = 659.25; // E5
                        osc2.type = 'sine';
                        gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
                        osc2.start(audioCtx.currentTime);
                        osc2.stop(audioCtx.currentTime + 0.3);
                    }, 150);
                    break;
                    
                case 'success_mega':
                    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                        setTimeout(() => {
                            const osc = audioCtx.createOscillator();
                            const gain = audioCtx.createGain();
                            osc.connect(gain);
                            gain.connect(audioCtx.destination);
                            osc.frequency.value = freq;
                            osc.type = 'sine';
                            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                            osc.start(audioCtx.currentTime);
                            osc.stop(audioCtx.currentTime + 0.4);
                        }, i * 100);
                    });
                    break;
                    
                case 'streak_bonus':
                    oscillator.frequency.value = 880;
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    oscillator.start(audioCtx.currentTime);
                    oscillator.stop(audioCtx.currentTime + 0.4);
                    break;
            }
        } catch (e) {
            console.warn("Ses çalınamadı:", e);
        }
    }
}

// Global erişim
window.DEEN_FOCUS_UI = new FocusModeUI();

// CSS Animasyonları ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
    @keyframes popIn { from { transform: translate(-50%, -50%) scale(0); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
`;
document.head.appendChild(style);

console.log("🚀 DEEN v8.9.4 Focus Mode UI Integration Yüklendi");
