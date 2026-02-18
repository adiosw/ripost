// ⚡ Ripost - App Logic
// Działa na Netlify i Vercel!

// ===== KONFIGURACJA =====
const CODE_PATTERNS = {
    START: /^START-\d{6}$|^\d{10}$/,
    PRO: /^PRO-\d{2}$/,
    UNLIMITED: /^UNLIMITED-\d{2}$/
};

// TEST CODES - USUŃ PRZED PRODUKCJĄ!
const TEST_CODES = {
    'DEMO-2026':    { type: 'START', simulations: 1 },
    'PRO-49':       { type: 'PRO', simulations: 5 },
    'UNLIMITED-99': { type: 'UNLIMITED', simulations: -1, expires: Date.now() + 30*24*60*60*1000 }
};

const SCENARIO_TITLES = {
    raise:     'Podwyżka 💰',
    promotion: 'Awans 📈',
    interview: 'Rekrutacja 🎯'
};

// ===== STAN =====
let conversationHistory = [];
let currentScenario = null;
let messageCount = 0;

// ===== API URL =====
// netlify.toml: /api/chat -> /.netlify/functions/chat
// Vercel: /api/chat bezposrednio
function getApiUrl() {
    return '/api/chat';
}

// ===== START =====
document.addEventListener('DOMContentLoaded', () => {
    const access = checkAccess();
    if (access) {
        showScenarioScreen();
        updateHeader(access);
    } else {
        showUnlockScreen();
    }
    setupListeners();
});

function setupListeners() {
    const form = document.getElementById('unlockForm');
    if (form) form.addEventListener('submit', handleUnlock);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// ===== DOSTEP =====
function unlockAccess(code) {
    const normalized = code.trim().toUpperCase();

    if (TEST_CODES[normalized]) {
        var a = TEST_CODES[normalized];
        saveAccess({ type: a.type, simulations: a.simulations, expires: a.expires || null });
        return true;
    }

    for (var type in CODE_PATTERNS) {
        if (CODE_PATTERNS[type].test(normalized)) {
            saveAccess({
                type: type,
                simulations: type === 'START' ? 1 : type === 'PRO' ? 5 : -1,
                expires: type === 'UNLIMITED' ? Date.now() + 30*24*60*60*1000 : null
            });
            return true;
        }
    }

    return false;
}

function saveAccess(data) {
    data.activated = Date.now();
    localStorage.setItem('ripost_access', JSON.stringify(data));
}

function checkAccess() {
    try {
        var raw = localStorage.getItem('ripost_access');
        if (!raw) return false;
        var access = JSON.parse(raw);
        if (access.expires && Date.now() > access.expires) {
            localStorage.removeItem('ripost_access');
            return false;
        }
        if (access.simulations === 0) return false;
        return access;
    } catch(e) {
        return false;
    }
}

function useSimulation() {
    var access = checkAccess();
    if (!access) return false;
    if (access.simulations > 0) access.simulations--;
    localStorage.setItem('ripost_access', JSON.stringify(access));
    updateHeader(access);
    return true;
}

// ===== EKRANY =====
function showUnlockScreen() {
    setDisplay('unlockScreen', 'flex');
    setDisplay('scenarioScreen', 'none');
    setDisplay('chatScreen', 'none');
    setDisplay('headerInfo', 'none');
    setDisplay('logoutBtn', 'none');
}

function showScenarioScreen() {
    setDisplay('unlockScreen', 'none');
    setDisplay('scenarioScreen', 'flex');
    setDisplay('chatScreen', 'none');
    setDisplay('headerInfo', 'flex');
    setDisplay('logoutBtn', 'block');
}

function showChatScreen() {
    setDisplay('unlockScreen', 'none');
    setDisplay('scenarioScreen', 'none');
    setDisplay('chatScreen', 'flex');
}

function setDisplay(id, val) {
    var el = document.getElementById(id);
    if (el) el.style.display = val;
}

function updateHeader(access) {
    var pkgEl = document.getElementById('packageInfo');
    var simEl = document.getElementById('simulationsInfo');
    if (pkgEl) pkgEl.textContent = 'PAKIET: ' + access.type;
    if (simEl) {
        if (access.simulations === -1) {
            var days = Math.ceil((access.expires - Date.now()) / 86400000);
            simEl.textContent = 'Nieograniczone (' + days + ' dni)';
        } else {
            simEl.textContent = 'Pozostalo: ' + access.simulations;
        }
    }
}

// ===== EVENTY =====
function handleUnlock(e) {
    e.preventDefault();
    var code = document.getElementById('accessCode').value;
    var errorDiv = document.getElementById('unlockError');

    if (unlockAccess(code)) {
        errorDiv.style.display = 'none';
        showScenarioScreen();
        updateHeader(checkAccess());
    } else {
        errorDiv.textContent = 'Nieprawidlowy kod. Sprawdz format (np. PRO-49)';
        errorDiv.style.display = 'block';
    }
}

function handleLogout() {
    if (confirm('Wylogowac sie? Twoje kody pozostana zapisane.')) {
        showUnlockScreen();
    }
}

function backToScenarios() {
    if (confirm('Przerwac rozmowe?')) {
        showScenarioScreen();
        resetChat();
    }
}

// ===== CHAT =====
function selectScenario(scenario) {
    var access = checkAccess();
    if (!access) {
        showUnlockScreen();
        return;
    }
    if (access.simulations === 0) {
        if (confirm('Wykorzystales wszystkie symulacje! Kupic kolejny pakiet?')) {
            window.open('index.html#pricing', '_blank');
        }
        return;
    }

    currentScenario = scenario;
    conversationHistory = [];
    messageCount = 0;

    showChatScreen();

    var titleEl = document.getElementById('chatScenarioTitle');
    if (titleEl) titleEl.textContent = SCENARIO_TITLES[scenario] || scenario;

    resetChat();
    addMessage('ai', 'Czesc! Jestem gotowy. Przedstaw swoja sytuacje i argumenty 🎯');
}

function resetChat() {
    var container = document.getElementById('chatMessages');
    if (container) container.innerHTML = '';
    conversationHistory = [];
    messageCount = 0;
}

async function sendMessage() {
    var input = document.getElementById('chatInput');
    var sendBtn = document.getElementById('sendBtn');
    var message = input.value.trim();
    if (!message) return;

    addMessage('user', message);
    conversationHistory.push({ role: 'user', content: message });
    input.value = '';
    messageCount++;

    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    var loadingId = showLoading();

    try {
        var response = await fetch(getApiUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                conversationHistory: conversationHistory,
                scenario: currentScenario,
                messageCount: messageCount
            })
        });

        removeLoading(loadingId);

        if (!response.ok) {
            var errData = {};
            try { errData = await response.json(); } catch(e) {}
            addMessage('ai', 'Blad serwera: ' + (errData.error || response.status) + '. Sprawdz GROQ_API_KEY w ustawieniach Netlify.');
            return;
        }

        var data = await response.json();
        conversationHistory.push({ role: 'assistant', content: data.text });

        if (data.score) {
            addEvaluation(data);
            useSimulation();
            setTimeout(addRestartButton, 800);
        } else {
            addMessage('ai', data.text);
        }

    } catch (error) {
        removeLoading(loadingId);
        addMessage('ai', 'Brak polaczenia z AI. Sprawdz internet i srodowisko.');
        console.error('API Error:', error);
    } finally {
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
    }
}

// ===== UI =====
function safeHtml(text) {
    return String(text)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\n/g,'<br>');
}

function addMessage(type, text) {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'chat-message ' + type;
    div.innerHTML =
        '<div class="chat-avatar">' + (type === 'user' ? '👤' : '🤖') + '</div>' +
        '<div class="chat-bubble">' + safeHtml(text) + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addEvaluation(data) {
    var container = document.getElementById('chatMessages');
    if (!container) return;

    var html = '<div class="evaluation-score">OCENA: ' + data.score + '/10</div>';

    if (data.weaknesses && data.weaknesses.length) {
        html += '<div class="evaluation-section"><h4>Slabe punkty:</h4><ol>';
        data.weaknesses.forEach(function(w) { html += '<li>' + safeHtml(w) + '</li>'; });
        html += '</ol></div>';
    }
    if (data.improvements && data.improvements.length) {
        html += '<div class="evaluation-section"><h4>Jak poprawic:</h4><ol>';
        data.improvements.forEach(function(i) { html += '<li>' + safeHtml(i) + '</li>'; });
        html += '</ol></div>';
    }
    if (data.text) {
        html += '<div class="evaluation-summary"><h4>Podsumowanie:</h4><p>' + safeHtml(data.text) + '</p></div>';
    }

    var evalDiv = document.createElement('div');
    evalDiv.className = 'chat-evaluation';
    evalDiv.innerHTML = html;
    container.appendChild(evalDiv);
    container.scrollTop = container.scrollHeight;
}

function addRestartButton() {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'text-align:center;margin:30px 0;padding:20px;';
    wrapper.innerHTML =
        '<p style="color:#a0a0a0;margin-bottom:15px;">Chcesz sprobowac ponownie?</p>' +
        '<button class="btn-primary" onclick="backToScenarios()">Nowa symulacja</button>';
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function showLoading() {
    var container = document.getElementById('chatMessages');
    if (!container) return null;
    var id = 'loading-' + Date.now();
    var div = document.createElement('div');
    div.id = id;
    div.className = 'chat-loading';
    div.innerHTML =
        '<div class="chat-avatar">🤖</div>' +
        '<div class="loading-dots">' +
        '<div class="loading-dot"></div>' +
        '<div class="loading-dot"></div>' +
        '<div class="loading-dot"></div>' +
        '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeLoading(id) {
    if (id) {
        var el = document.getElementById(id);
        if (el) el.remove();
    }
}

// ===== GLOBAL =====
window.selectScenario = selectScenario;
window.backToScenarios = backToScenarios;
window.sendMessage = sendMessage;
