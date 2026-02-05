// RIPOST - App Logic (Naffy Integration)
// Kod dostÄ™pu â†’ Limit symulacji â†’ AI Chat

// ============================================
// ðŸ“¦ PAKIETY I LIMITY
// ============================================
const PACKAGES = {
    // Format kodu: NAFFY-XXXX lub numer zamÃ³wienia z Naffy
    // Rozpoznajemy pakiet po prefiksie lub dÅ‚ugoÅ›ci kodu
    
    // Testowe kody (usuÅ„ w produkcji)
    'DEMO-2026': { type: 'start', simulations: 1, days: null },
    'PRO-49': { type: 'pro', simulations: 5, days: null },
    'UNLIMITED-99': { type: 'unlimited', simulations: 999, days: 30 },
    
    // Produkcyjne - rozpoznawanie po wzorcu
    // Klient dostaje kod z Naffy (np. numer zamÃ³wienia)
    // Ty okreÅ›lasz pakiet na podstawie wzorca
};

// Mapping: Naffy order ID â†’ package type
function detectPackageType(code) {
    // Testowe kody (USUÅƒ W PRODUKCJI!)
    if (PACKAGES[code]) {
        return PACKAGES[code];
    }
    
    // âœ… PRODUKCJA: Rozpoznawanie po prefiksie Naffy
    // Adrian Roszczyk - naffy.io prefiksy:
    
    // START- â†’ 29 zÅ‚ â†’ 1 symulacja
    if (code.toUpperCase().startsWith('START-')) {
        return { type: 'start', simulations: 1, days: null };
    }
    
    // PRO- â†’ 49 zÅ‚ â†’ 5 symulacji
    if (code.toUpperCase().startsWith('PRO-')) {
        return { type: 'pro', simulations: 5, days: null };
    }
    
    // UNL- â†’ 99 zÅ‚ â†’ 7 dni nielimitowane
    if (code.toUpperCase().startsWith('UNL-')) {
        return { type: 'unlimited', simulations: 999, days: 30 };
    }
    
    // Fallback: Nierozpoznany kod
    return null;
}

// ============================================
// ðŸ”‘ ZARZÄ„DZANIE KODAMI
// ============================================
class AccessCodeManager {
    constructor() {
        this.STORAGE_KEY = 'ripost_access';
        this.loadState();
    }
    
    loadState() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.state = saved ? JSON.parse(saved) : {
            codes: {}, // { 'kod': { simulations: X, days: X, activated: timestamp } }
            currentCode: null,
            simulationsUsed: 0,
            activatedAt: null
        };
    }
    
    saveState() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    }
    
    validateCode(code) {
        code = code.trim().toUpperCase();
        
        // SprawdÅº czy kod juÅ¼ uÅ¼ywany
        if (this.state.codes[code]) {
            const existing = this.state.codes[code];
            
            // SprawdÅº limit czasu (7 dni)
            if (existing.days) {
                const daysPassed = (Date.now() - existing.activated) / (1000 * 60 * 60 * 24);
                if (daysPassed > existing.days) {
                    return { valid: false, error: 'Kod wygasÅ‚ (przekroczono 7 dni)' };
                }
            }
            
            // SprawdÅº limit symulacji
            if (existing.simulationsLeft <= 0) {
                return { valid: false, error: 'Kod wyczerpany (brak symulacji)' };
            }
            
            // Kod OK - zwrÃ³Ä‡ istniejÄ…cy stan
            return {
                valid: true,
                isNew: false,
                package: existing
            };
        }
        
        // Nowy kod - wykryj pakiet
        const packageInfo = detectPackageType(code);
        
        if (!packageInfo) {
            return { valid: false, error: 'NieprawidÅ‚owy kod dostÄ™pu' };
        }
        
        // Aktywuj nowy kod
        this.state.codes[code] = {
            type: packageInfo.type,
            simulations: packageInfo.simulations,
            simulationsLeft: packageInfo.simulations,
            days: packageInfo.days,
            activated: Date.now()
        };
        
        this.state.currentCode = code;
        this.saveState();
        
        return {
            valid: true,
            isNew: true,
            package: this.state.codes[code]
        };
    }
    
    getCurrentAccess() {
        if (!this.state.currentCode) return null;
        
        const code = this.state.currentCode;
        const access = this.state.codes[code];
        
        if (!access) return null;
        
        // SprawdÅº waÅ¼noÅ›Ä‡ czasowÄ…
        if (access.days) {
            const daysPassed = (Date.now() - access.activated) / (1000 * 60 * 60 * 24);
            if (daysPassed > access.days) {
                return null; // WygasÅ‚o
            }
        }
        
        // SprawdÅº limit symulacji
        if (access.simulationsLeft <= 0) {
            return null; // Wyczerpane
        }
        
        return {
            code: code,
            type: access.type,
            simulationsLeft: access.simulationsLeft,
            daysLeft: access.days ? Math.ceil(access.days - (Date.now() - access.activated) / (1000 * 60 * 60 * 24)) : null
        };
    }
    
    useSimulation() {
        if (!this.state.currentCode) return false;
        
        const access = this.state.codes[this.state.currentCode];
        if (!access || access.simulationsLeft <= 0) return false;
        
        access.simulationsLeft--;
        this.saveState();
        return true;
    }
    
    logout() {
        this.state.currentCode = null;
        this.saveState();
    }
}

// ============================================
// ðŸ’¬ AI CHAT MANAGER
// ============================================
class ChatManager {
    constructor() {
        this.messages = [];
        this.currentScenario = null;
        this.conversationStarted = false;
    }
    
    async sendMessage(message, scenario) {
        this.messages.push({ role: 'user', content: message });
        this.currentScenario = scenario;
        
        // PokaÅ¼ loading z rotujÄ…cymi tekstami
        this.showLoadingStates();
        
        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: this.messages,
                    scenario: scenario
                })
            });
            
            if (!response.ok) throw new Error('API Error');
            
            const data = await response.json();
            
            this.hideLoading();
            this.messages.push({ role: 'assistant', content: data.message });
            
            return {
                message: data.message,
                score: data.score,
                feedback: data.feedback
            };
            
        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }
    
    showLoadingStates() {
        const loadingTexts = [
            'ðŸ¤” PrzygotowujÄ™ trudne pytanie...',
            'ðŸ“Š AnalizujÄ™ Twoje argumenty...',
            'ðŸ’¡ FormuÅ‚ujÄ™ feedback...',
            'ðŸŽ¯ Sprawdzam Twoje odpowiedzi...',
            'ðŸ“ PrzygotowujÄ™ ocenÄ™...'
        ];
        
        const loadingEl = document.getElementById('aiLoading');
        if (!loadingEl) return;
        
        loadingEl.style.display = 'flex';
        let index = 0;
        
        const textEl = loadingEl.querySelector('.loading-text');
        if (textEl) {
            textEl.textContent = loadingTexts[0];
            
            this.loadingInterval = setInterval(() => {
                index = (index + 1) % loadingTexts.length;
                textEl.textContent = loadingTexts[index];
            }, 2500); // Zmiana co 2.5s
        }
    }
    
    hideLoading() {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
        
        const loadingEl = document.getElementById('aiLoading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    }
    
    reset() {
        this.messages = [];
        this.currentScenario = null;
        this.conversationStarted = false;
    }
}

// ============================================
// ðŸŽ¨ UI CONTROLLER
// ============================================
class AppUI {
    constructor() {
        this.accessManager = new AccessCodeManager();
        this.chatManager = new ChatManager();
        this.init();
    }
    
    init() {
        // SprawdÅº czy jest aktywny dostÄ™p
        const access = this.accessManager.getCurrentAccess();
        
        if (access) {
            this.showApp(access);
        } else {
            this.showUnlockScreen();
        }
        
        this.attachEventListeners();
    }
    
    showUnlockScreen() {
        document.getElementById('unlockScreen').style.display = 'flex';
        document.getElementById('appScreen').style.display = 'none';
    }
    
    showApp(access) {
        document.getElementById('unlockScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'flex';
        
        // Update UI z limitami
        this.updateAccessInfo(access);
    }
    
    updateAccessInfo(access) {
        const infoEl = document.getElementById('accessInfo');
        if (!infoEl) return;
        
        let infoHTML = `<div class="access-badge ${access.type}">`;
        infoHTML += `<span class="badge-icon">ðŸ”‘</span>`;
        infoHTML += `<span>Pakiet: ${access.type.toUpperCase()}</span>`;
        
        if (access.daysLeft) {
            infoHTML += `<span class="separator">|</span>`;
            infoHTML += `<span>PozostaÅ‚o: ${access.daysLeft} dni</span>`;
        } else {
            infoHTML += `<span class="separator">|</span>`;
            infoHTML += `<span>Symulacje: ${access.simulationsLeft}</span>`;
        }
        
        infoHTML += `</div>`;
        infoEl.innerHTML = infoHTML;
    }
    
    attachEventListeners() {
        // Unlock form
        const unlockForm = document.getElementById('unlockForm');
        if (unlockForm) {
            unlockForm.addEventListener('submit', (e) => this.handleUnlock(e));
        }
        
        // Scenario selection
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectScenario(e));
        });
        
        // Chat form
        const chatForm = document.getElementById('chatForm');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // New conversation
        const newConvBtn = document.getElementById('newConversation');
        if (newConvBtn) {
            newConvBtn.addEventListener('click', () => this.startNewConversation());
        }
    }
    
    handleUnlock(e) {
        e.preventDefault();
        
        const codeInput = document.getElementById('accessCode');
        const code = codeInput.value.trim();
        
        if (!code) {
            this.showError('Wpisz kod dostÄ™pu');
            return;
        }
        
        const result = this.accessManager.validateCode(code);
        
        if (!result.valid) {
            this.showError(result.error);
            return;
        }
        
        // Sukces!
        if (result.isNew) {
            this.showSuccess('Kod aktywowany! Witaj w Ripost.');
        } else {
            this.showSuccess('Zalogowano! Kontynuuj trening.');
        }
        
        const access = this.accessManager.getCurrentAccess();
        this.showApp(access);
    }
    
    selectScenario(e) {
        const card = e.currentTarget;
        const scenario = card.dataset.scenario;
        
        // Remove active from all
        document.querySelectorAll('.scenario-card').forEach(c => {
            c.classList.remove('active');
        });
        
        // Add active to clicked
        card.classList.add('active');
        
        // Show chat
        document.getElementById('scenarioSelection').style.display = 'none';
        document.getElementById('chatInterface').style.display = 'flex';
        
        // Set scenario
        this.currentScenario = scenario;
        
        // Start conversation
        this.startConversation(scenario);
    }
    
    async startConversation(scenario) {
        this.chatManager.reset();
        
        const scenarioNames = {
            'raise': 'PodwyÅ¼ka',
            'promotion': 'Awans',
            'interview': 'Rekrutacja'
        };
        
        // WyÅ›wietl info o scenariuszu
        this.addSystemMessage(`Rozpoczynasz trening: <strong>${scenarioNames[scenario]}</strong>`);
        
        // AI first message
        this.chatManager.showLoadingStates();
        
        try {
            const response = await this.chatManager.sendMessage('START', scenario);
            this.addAIMessage(response.message);
        } catch (error) {
            this.showError('BÅ‚Ä…d poÅ‚Ä…czenia z AI. SprÃ³buj ponownie.');
        }
    }
    
    async handleSendMessage(e) {
        e.preventDefault();
        
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to UI
        this.addUserMessage(message);
        input.value = '';
        
        // Send to AI
        try {
            const response = await this.chatManager.sendMessage(message, this.currentScenario);
            
            this.addAIMessage(response.message);
            
            // JeÅ›li jest score - pokaÅ¼ feedback
            if (response.score) {
                this.showFeedback(response.score, response.feedback);
                
                // Use simulation
                this.accessManager.useSimulation();
                
                // Update UI
                const access = this.accessManager.getCurrentAccess();
                if (access) {
                    this.updateAccessInfo(access);
                }
            }
            
        } catch (error) {
            this.showError('BÅ‚Ä…d poÅ‚Ä…czenia z AI. SprÃ³buj ponownie.');
        }
    }
    
    addSystemMessage(text) {
        const messagesEl = document.getElementById('chatMessages');
        const msgEl = document.createElement('div');
        msgEl.className = 'message system';
        msgEl.innerHTML = `<div class="message-content">${text}</div>`;
        messagesEl.appendChild(msgEl);
        this.scrollToBottom();
    }
    
    addUserMessage(text) {
        const messagesEl = document.getElementById('chatMessages');
        const msgEl = document.createElement('div');
        msgEl.className = 'message user';
        msgEl.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">${this.escapeHtml(text)}</div>
            </div>
            <div class="message-avatar">ðŸ‘¤</div>
        `;
        messagesEl.appendChild(msgEl);
        this.scrollToBottom();
    }
    
    addAIMessage(text) {
        const messagesEl = document.getElementById('chatMessages');
        const msgEl = document.createElement('div');
        msgEl.className = 'message ai';
        msgEl.innerHTML = `
            <div class="message-avatar">ðŸ’¼</div>
            <div class="message-content">
                <div class="message-bubble">${this.escapeHtml(text)}</div>
            </div>
        `;
        messagesEl.appendChild(msgEl);
        this.scrollToBottom();
    }
    
    showFeedback(score, feedback) {
        const feedbackHTML = `
            <div class="feedback-card">
                <div class="feedback-header">
                    <span>Twoja ocena:</span>
                    <span class="feedback-score">${score}/10</span>
                </div>
                
                ${feedback.weakPoints ? `
                    <div class="feedback-section">
                        <h4>âŒ SÅ‚abe punkty:</h4>
                        <ul>
                            ${feedback.weakPoints.map(point => `<li>${this.escapeHtml(point)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${feedback.improvements ? `
                    <div class="feedback-section">
                        <h4>âœ… Jak poprawiÄ‡:</h4>
                        <ul>
                            ${feedback.improvements.map(point => `<li>${this.escapeHtml(point)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <button class="btn btn-primary" onclick="app.startNewConversation()">
                    Nowa symulacja
                </button>
            </div>
        `;
        
        const messagesEl = document.getElementById('chatMessages');
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'message feedback';
        feedbackEl.innerHTML = feedbackHTML;
        messagesEl.appendChild(feedbackEl);
        this.scrollToBottom();
    }
    
    startNewConversation() {
        document.getElementById('scenarioSelection').style.display = 'grid';
        document.getElementById('chatInterface').style.display = 'none';
        document.getElementById('chatMessages').innerHTML = '';
        
        // UsuÅ„ active ze wszystkich scenariuszy
        document.querySelectorAll('.scenario-card').forEach(c => {
            c.classList.remove('active');
        });
        
        this.chatManager.reset();
    }
    
    handleLogout() {
        if (confirm('Czy na pewno chcesz siÄ™ wylogowaÄ‡?')) {
            this.accessManager.logout();
            this.showUnlockScreen();
            this.chatManager.reset();
        }
    }
    
    showError(message) {
        const errorEl = document.getElementById('errorMessage');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    showSuccess(message) {
        const successEl = document.getElementById('successMessage');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
            setTimeout(() => {
                successEl.style.display = 'none';
            }, 3000);
        }
    }
    
    scrollToBottom() {
        const messagesEl = document.getElementById('chatMessages');
        if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// ðŸš€ INITIALIZE
// ============================================
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new AppUI();
});

