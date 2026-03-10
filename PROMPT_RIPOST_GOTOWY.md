# PROMPT: Zbuduj Ripost – AI Trener Negocjacji (PRODUKCJA, klucze gotowe)

Zbuduj kompletną aplikację webową **Ripost** — AI trener trudnych rozmów zawodowych. Wszystkie klucze API są już wpisane poniżej — wstaw je dokładnie tam gdzie opisano. Dostarcz ZIP gotowy do wrzucenia na Vercel lub Netlify.

---

## KLUCZE API (wstaw na twardo, nie jako placeholdery)

```
SUPABASE_URL  = SUPABASE_URL_PLACEHOLDER
SUPABASE_ANON = SUPABASE_ANON_PLACEHOLDER
GROQ_KEY      = GROQ_KEY_PLACEHOLDER
STRIPE_PK     = STRIPE_PK_PLACEHOLDER
PRICE_29zł    = PRICE_29_PLACEHOLDER
PRICE_49zł    = PRICE_49_PLACEHOLDER
PRICE_99zł    = PRICE_99_PLACEHOLDER
DOMAIN        = https://ripost.vercel.app
```

---

## STACK

- **Frontend:** HTML + CSS + Vanilla JS (zero frameworków)
- **AI:** Groq API (`llama-3.1-70b-versatile`) — klucz powyżej
- **Auth + DB:** Supabase — URL i anon key powyżej
- **Płatności:** Stripe Checkout — klucze powyżej
- **Hosting:** Vercel (główny) + Netlify (alternatywny)
- **Fonty:** Syne 700/800 + DM Sans 300/400/500 z Google Fonts
- **PWA:** manifest.json + sw.js

---

## DESIGN SYSTEM

```css
:root {
  --bg:#07070d; --bg2:#0d0d1a;
  --surface:rgba(255,255,255,0.03);
  --surface2:rgba(255,255,255,0.06);
  --border:rgba(255,255,255,0.08);
  --border2:rgba(255,255,255,0.15);
  --text:#f0f0f8; --text2:#9090b0; --text3:#5a5a7a;
  --accent:#6c63ff; --accent2:#ff6b9d; --accent3:#00d4aa; --gold:#ffd166;
  --grad1:linear-gradient(135deg,#6c63ff,#ff6b9d);
  --grad2:linear-gradient(135deg,#00d4aa,#6c63ff);
  --grad3:linear-gradient(135deg,#ff6b9d,#ffd166);
  --r:16px; --r-lg:24px; --r-xl:32px;
  --font-d:'Syne',sans-serif; --font-b:'DM Sans',sans-serif;
  --transition:0.3s cubic-bezier(0.4,0,0.2,1);
}
[data-theme="light"] {
  --bg:#f5f5ff; --bg2:#ebebff; --text:#0d0d1a; --text2:#4a4a6a; --text3:#8a8aaa;
  --surface:rgba(0,0,0,0.03); --border:rgba(0,0,0,0.08);
}
```

Efekty: glassmorphism (`backdrop-filter:blur`), 4 animowane orby (`radial-gradient + filter:blur(90px) + keyframes`), fade-in on scroll (IntersectionObserver → `.fade-in.visible`).

---

## PLIKI DO STWORZENIA

```
ripost/
├── index.html
├── features.html
├── pricing.html
├── about.html
├── contact.html
├── app.html                ← główna aplikacja AI
├── demo.html
├── blog.html
├── backend-setup.html      ← instrukcja backendu
├── offline.html
├── manifest.json
├── sw.js
├── service-worker.js
├── netlify.toml
├── vercel.json
├── netlify/functions/chat.js
└── api/chat.js
```

---

## index.html — STRONA GŁÓWNA

### Navbar (fixed, 68px, blur backdrop)
Logo "Ripost." (grad1) + linki: Start / Funkcje / Cennik / O nas / Kontakt / Aplikacja + toggle motywu (emoji 🌙/☀️) + btn "🚀 Zacznij" (grad1, pill). Hamburger poniżej 820px.

### Hero (layout 50/50 na desktop, 1 kolumna poniżej 900px)

**Lewa strona:**
- Badge: `● AI TRENER NEGOCJACJI · {licznik} osób trenuje teraz` (kolor accent3, pulsująca kropka)
- H1: `Trenuj trudne rozmowy z AI. Zdobądź podwyżkę.` (Syne 800, `clamp(2.2rem,5.5vw,4rem)`, ostatnia linia grad1)
- Podtytuł: `Ćwicz rozmowy o podwyżce, awans i rekrutację z inteligentnym trenerem. Żadnej teorii — tylko realne dialogi i natychmiastowy feedback po każdej sesji.`
- Przyciski: `🚀 Zacznij trening` (grad1 pill) + `📋 Jak to działa` (outline pill)
- Statsy inline: `12 840 Użytkowników | 5–15 min Sesja | +27% Śr. wzrost pensji | 4.9⭐ Ocena`

**Prawa strona — live mini-chat card:**
- 3 floating badges (absolute position): `⭐ 4.9/5 · 1200+ ocen` (top-right), `💰 +27% śr. wzrost pensji` (bottom-left), `🔥 {licznik} sesji dziś` (middle-right)
- Card: topbar z awatarem 🤖, "Ripost AI Trener", status "Online", tag "💰 Podwyżka"
- 2 predefiniowane wiadomości (AI + user)
- Input + przycisk send
- Po 3 wysłanych: input disabled, toast "Przejdź do Aplikacji"
- Odpowiedzi AI: 3 różne placeholdery (nie Groq — to tylko demo na stronie głównej)

**KRYTYCZNE zasady mobile:**
```css
#hero { min-height: auto; padding: 88px 4% 48px; } /* NIE 100vh */
@media(max-width:600px) { .hero-badge-float { display:none; } }
@media(max-width:900px) { .hero-inner { grid-template-columns:1fr; gap:1.5rem; } }
```

### Stats strip (bezpośrednio pod hero)
4 karty z animowanym licznikiem (IntersectionObserver):
- 👥 12 840 Użytkowników (grad1)
- 🎯 89 230 Sesji treningowych (grad2)
- 📈 27% Śr. wzrost wynagrodzenia (grad3)
- ⭐ 4.9/10 Ocena użytkowników (grad4)

```css
.gstats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
.gstat-num { font-size: clamp(1.4rem,4vw,2rem); } /* NIE fixed 2rem */
.gstat { padding: 1.25rem 0.875rem; } /* mniejszy padding */
@media(max-width:768px) { .gstats-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:480px) { .gstat { padding:1rem 0.625rem; } }
```

### Sekcja video (padding max 48px góra/dół)
Layout 50/50. Lewa: opis + 3 punkty (🎭/🤖/📊) + przyciski. Prawa: placeholder z przyciskiem play (animowany puls), onClick ładuje iframe YouTube (wstaw URL wideo gdy będzie gotowe).

### CTA box
Wyśrodkowany, max-width 680px. Tekst: `Zacznij trening już dziś` + `Demo dostępne od razu bez rejestracji. Pełne sesje z oceną w pakietach od 29 zł.` **NIE pisz "sesja bezpłatna".**

### Footer (4 kolumny)
Logo + opis | Produkt (Funkcje/Demo/Aplikacja/Blog) | Firma (O nas/Cennik/Kontakt) | Prawne (Regulamin/Prywatność)

---

## features.html — FUNKCJE

Sekcje: Page Hero → Jak działa (3 karty) → Live Demo AI → Video → Historia sesji → Opinie carousel → FAQ → CTA

### Live Demo AI
Layout 50/50. Lewa: panel sterowania (scenariusz info, checklist 3 punkty, progress tracker 6 kroków z dp-dot/dp-item active/done, przyciski Odtwórz▶/Wstrzymaj⏸). Prawa: chat window.

**7 wiadomości scenariusza "Podwyżka":**
1. AI: `Dzień dobry! Rozumiem, że chciałeś ze mną porozmawiać o ważnej sprawie. Słucham.`
2. User: `Chciałbym porozmawiać o podwyżce. Pracuję tu 2 lata i uważam, że moje wynagrodzenie nie odzwierciedla wkładu.`
3. AI: `Rozumiem. Zanim przejdziemy dalej — powiedz mi konkretnie: jakie wyniki osiągnąłeś? Liczby, fakty, wartość biznesowa.`
4. User: `Zaprojektowałem system obsługujący 40% transakcji, skróciłem wdrożenia o 35%, zredukowałem bug rate o 60%. Wartość projektów to ok. 2,4 mln zł.`
5. AI: `Budżet na podwyżki jest napięty. Cały zespół pracuje ciężko. Dlaczego właśnie Ty zasługujesz bardziej niż inni?`
6. User: `Proponuję etapową podwyżkę: 15% teraz i 10% za pół roku, powiązaną z KPI. Senior dev w Warszawie zarabia 18–22k. Jestem poniżej mediany.`
7. AI: `Przygotowałeś się bardzo dobrze. Etapowa propozycja z KPI jest rozsądna. Daj mi 3 dni na konsultację z HR.` ← eval trigger

Auto-play gdy sekcja wchodzi w viewport (IntersectionObserver, delay 1400ms). Timing: AI message delay 1100ms, kolejna wiadomość po 2300ms (AI) lub 1700ms (user).

**Eval card po zakończeniu:**
```html
Score: 8/10, pasek progresu (animowany setTimeout 200ms → width:80%),
positives: ["Doskonałe dane liczbowe", "Etapowa propozycja z KPI"],
improvements: ["Zbyt szybko zaakceptowałeś — ćwicz silent pause", "Brak BATNA"]
```
Zapis do localStorage: `ripost_sessions` → `[{scenario, score, date}]`

**Manualne pisanie:** 3 wiadomości, potem modal email capture.

### Opinie carousel (seamless loop)
```css
.testi-track { display:flex; gap:1.25rem; animation:scrollL 35s linear infinite; width:max-content; }
.testi-track:hover { animation-play-state:paused; }
@keyframes scrollL { from{transform:translateX(0)} to{transform:translateX(-50%)} }
```
6 kart × 2 (zduplikowane dla loop). Fade overlay lewo/prawo.

**6 opinii:**
- ⭐⭐⭐⭐⭐ Marta K., Product Manager: *"Po 3 sesjach z Ripost wynegocjowałam +3 200 zł brutto. Trener był bezlitosny ale właśnie tego potrzebowałam."*
- ⭐⭐⭐⭐⭐ Piotr W., Senior Developer: *"Czułem się jak przed prawdziwą rozmową. AI nie odpuszczało przy słabych argumentach. Dostałem awans po 2 miesiącach."*
- ⭐⭐⭐⭐⭐ Agnieszka R., Spedytor: *"Myślałam że to nie dla mnie. Okazało się że po 5 sesjach rozmawiałam zupełnie inaczej. Podwyżka 18%."*
- ⭐⭐⭐⭐⭐ Kamil T., Team Lead: *"Używam do treningu przed rozmowami z trudnymi klientami. Najlepsza inwestycja zawodowa tego roku."*
- ⭐⭐⭐⭐⭐ Joanna M., Rekruterka: *"Paradoksalnie używam Ripost żeby ćwiczyć PO STRONIE rekrutera. Genialne narzędzie do nauki dynamiki rozmowy."*
- ⭐⭐⭐⭐ Tomasz B., Freelancer: *"Jako freelancer negocjuję stawki co kilka miesięcy. Ripost pomógł mi przestać zaniżać ceny. +40% do stawki godzinowej."*

### FAQ (8 pytań, accordion)
1. Jak działa AI w Ripost?
2. Czy to zastąpi prawdziwego coacha?
3. Ile trwa jedna sesja?
4. Czy moje rozmowy są zapisywane i kto je widzi?
5. W jakich scenariuszach mogę ćwiczyć?
6. Jaka jest różnica między pakietami?
7. Jak anulować subskrypcję?
8. Czy wystawiacie faktury VAT?

---

## pricing.html — CENNIK

Dodaj do `<head>`: `<script src="https://js.stripe.com/v3/"></script>`

**3 karty pakietów:**

**Próbny — 29 zł jednorazowo**
- 1 pełna symulacja, wszystkie scenariusze, ocena 0–10, historia lokalna
- Przycisk: `handleBuy('PRICE_29_PLACEHOLDER', 'payment', 'Próbny', 29)`
- Styl: outline border

**Pro — 49 zł jednorazowo** ⭐ FEATURED
- 5 symulacji, wszystkie scenariusze, ocena, historia w chmurze, eksport PDF, ważność 90 dni
- Przycisk: `handleBuy('PRICE_49_PLACEHOLDER', 'payment', 'Pro', 49)`
- Styl: border gradient (::before z var(--grad1), inset:-2px)
- Badge: "🔥 Najpopularniejszy"

**Unlimited — 99 zł/miesiąc** (subskrypcja)
- ∞ symulacji, własne scenariusze, analityka, priorytetowe wsparcie
- Przycisk: `handleBuy('PRICE_99_PLACEHOLDER', 'subscription', 'Unlimited', 99)`
- Styl: gold gradient button

**Funkcja handleBuy (z prawdziwymi kluczami):**
```javascript
function handleBuy(priceId, mode, plan, amount) {
  showToast('🔐', `Przekierowuję do Stripe — ${plan} (${amount} zł)...`);
  const stripe = Stripe('STRIPE_PK_PLACEHOLDER');
  stripe.redirectToCheckout({
    lineItems: [{price: priceId, quantity: 1}],
    mode: mode,
    successUrl: 'https://ripost.vercel.app/app.html?success=1',
    cancelUrl:  'https://ripost.vercel.app/pricing.html',
  }).then(r => { if(r.error) showToast('❌', r.error.message); });
}
```

Gwarancja 7 dni (boks 🛡️). Tabela porównawcza pełna. FAQ cennikowe 5 pytań.

---

## app.html — APLIKACJA AI

**Blok konfiguracji na początku `<body>` (przed wszystkim):**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="https://js.stripe.com/v3/"></script>
<script>
const SUPABASE_URL  = 'SUPABASE_URL_PLACEHOLDER';
const SUPABASE_ANON = 'SUPABASE_ANON_PLACEHOLDER';
const GROQ_KEY      = 'GROQ_KEY_PLACEHOLDER';

const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

async function getUser() {
  const {data:{user}} = await _sb.auth.getUser();
  return user;
}
async function signIn(email, pass) {
  return _sb.auth.signInWithPassword({email, password:pass});
}
async function signUp(email, pass) {
  return _sb.auth.signUp({email, password:pass, options:{emailRedirectTo:'https://ripost.vercel.app'}});
}
async function signOut() {
  await _sb.auth.signOut(); updateAuthUI(null);
}
async function saveSessionCloud(scenario, score) {
  const user = await getUser();
  if (!user) return;
  await _sb.from('sessions').insert({user_id:user.id, scenario, score, messages_count: exchCount||0});
}

async function callGroqAI(messages, scenario) {
  const PROMPTS = {
    salary:      'Jesteś wymagającym dyrektorem HR w rozmowie o podwyżce. Bądź sceptyczny, kwestionuj argumenty, nie odpuszczaj łatwo. Odpowiadaj TYLKO PO POLSKU. Max 3 zdania.',
    promotion:   'Jesteś sceptycznym CEO rozmawiającym z pracownikiem o awansie. Kwestionuj gotowość i wyniki. TYLKO PO POLSKU. Max 3 zdania.',
    recruitment: 'Jesteś doświadczonym rekruterem prowadzącym rozmowę kwalifikacyjną. Zadawaj trudne pytania STAR. TYLKO PO POLSKU. Max 3 zdania.',
    client:      'Jesteś trudnym klientem negocjującym warunki współpracy. Bądź wymagający i dociekliwy. TYLKO PO POLSKU. Max 3 zdania.',
  };
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer GROQ_KEY_PLACEHOLDER'},
      body: JSON.stringify({
        model:'llama-3.1-70b-versatile',
        messages:[{role:'system', content:PROMPTS[scenario]||PROMPTS.salary}, ...messages],
        max_tokens:180, temperature:0.85
      })
    });
    if(!res.ok) return null;
    const d = await res.json();
    return d.choices?.[0]?.message?.content || null;
  } catch(e) { return null; }
}

(async()=>{
  const user = await getUser();
  updateAuthUI(user);
  _sb.auth.onAuthStateChange((_,session) => updateAuthUI(session?.user||null));
})();
</script>
```

**Tryb fallback bez konta (kody dostępu):**
```javascript
const CODES = {
  'DEMO-2026':    {plan:'START',     sims:1},
  'PRO-49':       {plan:'PRO',       sims:5},
  'UNLIMITED-99': {plan:'UNLIMITED', sims:Infinity}
};
```

**4 scenariusze:**
1. 💰 Rozmowa o podwyżkę — intro: `Dzień dobry! Rozumiem, że chciałeś ze mną porozmawiać. Słucham.`
2. 🚀 Negocjacja awansu — intro: `Cieszę się, że chciałeś porozmawiać. Co masz na myśli?`
3. 🎯 Rekrutacja — intro: `Dzień dobry! Proszę opowiedzieć mi o sobie i dlaczego aplikujesz na to stanowisko.`
4. 🤝 Trudna rozmowa z klientem — intro: `Dzień dobry. Rozumiem że mamy do omówienia kwestie dotyczące współpracy.`

Każdy ma 4+ lokalnych odpowiedzi AI jako fallback + `evalData` z positives/improvements/summary.

**Wywołanie AI (Groq first, fallback local):**
```javascript
async function getAIResponse(userMessage) {
  // buduj historię
  const history = chatHistory.map(m => ({role: m.role, content: m.text}));
  // próbuj Groq
  const groqReply = await callGroqAI(history, currentScenario);
  if (groqReply) return groqReply;
  // fallback: lokalna odpowiedź
  const scenario = SCENARIOS[currentScenario];
  const idx = Math.min(exchCount, scenario.ai.length - 1);
  return scenario.ai[idx](userMessage);
}
```

**Zapis sesji (localStorage + chmura):**
```javascript
function saveSession(scenario, score) {
  const sessions = JSON.parse(localStorage.getItem('ripost_sessions')||'[]');
  const sName = SCENARIOS[scenario]?.name || scenario;
  sessions.unshift({scenario:sName, score, date:new Date().toISOString()});
  localStorage.setItem('ripost_sessions', JSON.stringify(sessions.slice(0,50)));
  saveSessionCloud(sName, score); // Supabase
}
```

**Auth modal (HTML przed </body>):**
```html
<div id="auth-overlay" style="display:none;position:fixed;inset:0;z-index:3000;background:rgba(7,7,13,.9);backdrop-filter:blur(12px);align-items:center;justify-content:center;padding:1rem">
  <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:24px;padding:2.5rem;max-width:400px;width:100%">
    <h3 id="auth-modal-title" style="font-family:var(--font-d);font-size:1.4rem;font-weight:800;margin-bottom:.5rem;text-align:center">Zaloguj się</h3>
    <p style="color:var(--text2);font-size:.875rem;text-align:center;margin-bottom:1.5rem">Zapisuj historię sesji i synchronizuj postępy.</p>
    <div id="auth-err" style="display:none;color:#ff6b9d;font-size:.8rem;margin-bottom:.75rem;text-align:center"></div>
    <input id="auth-email" type="email" placeholder="Email" style="width:100%;padding:.825rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:14px;color:var(--text);font-family:var(--font-b);font-size:.95rem;outline:none;margin-bottom:.75rem;display:block"/>
    <input id="auth-password" type="password" placeholder="Hasło" style="width:100%;padding:.825rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:14px;color:var(--text);font-family:var(--font-b);font-size:.95rem;outline:none;margin-bottom:1.25rem;display:block"/>
    <button id="auth-submit" onclick="submitAuth()" style="width:100%;padding:.875rem;background:linear-gradient(135deg,#6c63ff,#ff6b9d);border:none;border-radius:100px;color:#fff;font-family:var(--font-d);font-weight:700;cursor:pointer;margin-bottom:1rem">Zaloguj</button>
    <p id="auth-switch" style="text-align:center;font-size:.82rem;color:var(--text2)">Nie masz konta? <span style="color:var(--accent3);cursor:pointer" onclick="showAuthModal('register')">Zarejestruj się</span></p>
    <button onclick="document.getElementById('auth-overlay').classList.remove('show')" style="display:block;width:100%;background:none;border:none;color:var(--text3);font-size:.78rem;cursor:pointer;margin-top:.875rem">Zamknij</button>
  </div>
</div>
<style>#auth-overlay{display:none!important}#auth-overlay.show{display:flex!important}</style>
```

---

## netlify/functions/chat.js

```javascript
const GROQ_KEY = process.env.GROQ_API_KEY || 'GROQ_KEY_PLACEHOLDER';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const PROMPTS = {
  salary:      'Jesteś wymagającym dyrektorem HR w rozmowie o podwyżce. TYLKO PO POLSKU. Max 3 zdania.',
  promotion:   'Jesteś sceptycznym CEO w rozmowie o awansie. TYLKO PO POLSKU. Max 3 zdania.',
  recruitment: 'Jesteś rekruterem prowadzącym rozmowę kwalifikacyjną. TYLKO PO POLSKU. Max 3 zdania.',
  client:      'Jesteś trudnym klientem negocjującym warunki. TYLKO PO POLSKU. Max 3 zdania.',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return {statusCode:200, headers:CORS, body:''};
  if (event.httpMethod !== 'POST') return {statusCode:405, headers:CORS, body:JSON.stringify({error:'Method not allowed'})};

  try {
    const {message, conversationHistory=[], scenario='salary', messageCount=0} = JSON.parse(event.body||'{}');
    const isEval = messageCount >= 6;

    const systemPrompt = isEval
      ? 'Oceń tę rozmowę negocjacyjną. Odpowiedz TYLKO w JSON: {"score":7,"positives":["..."],"improvements":["..."],"summary":"..."}'
      : (PROMPTS[scenario] || PROMPTS.salary);

    const messages = [
      {role:'system', content:systemPrompt},
      ...conversationHistory.slice(-8),
      {role:'user', content:message}
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},
      body: JSON.stringify({model:'llama-3.1-70b-versatile', messages, max_tokens:300, temperature:0.8})
    });

    if(!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';

    if(isEval) {
      try {
        const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0]||text);
        return {statusCode:200, headers:CORS, body:JSON.stringify({...parsed, isEvaluation:true})};
      } catch {
        return {statusCode:200, headers:CORS, body:JSON.stringify({text, isEvaluation:true, score:7})};
      }
    }
    return {statusCode:200, headers:CORS, body:JSON.stringify({text})};
  } catch(err) {
    return {statusCode:500, headers:CORS, body:JSON.stringify({text:'Przepraszam, wystąpił błąd. Spróbuj ponownie.'})};
  }
};
```

---

## Supabase SQL Schema (wykonaj w SQL Editor)

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, full_name TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, sims_left INT DEFAULT 0,
  expires_at TIMESTAMPTZ, stripe_sub_id TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario TEXT NOT NULL, score INT, feedback TEXT,
  messages_count INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL, source TEXT DEFAULT 'demo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN INSERT INTO public.user_profiles(id,email) VALUES(NEW.id,NEW.email) ON CONFLICT(id) DO NOTHING; RETURN NEW; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profile"  ON user_profiles FOR ALL USING (auth.uid()=id);
CREATE POLICY "own_plan"     ON user_plans    FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "own_sessions" ON sessions      FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "insert_lead"  ON leads FOR INSERT WITH CHECK (true);
```

---

## vercel.json

```json
{
  "version": 2,
  "name": "ripost",
  "env": {
    "GROQ_API_KEY": "GROQ_KEY_PLACEHOLDER"
  },
  "builds": [
    {"src": "api/chat.js", "use": "@vercel/node"},
    {"src": "*.html", "use": "@vercel/static"}
  ],
  "routes": [
    {"src": "/sw.js", "headers": {"Cache-Control": "no-cache", "Service-Worker-Allowed": "/"}, "dest": "/sw.js"},
    {"src": "/api/chat", "dest": "/api/chat.js"},
    {"src": "/(.*\\.html)", "dest": "/$1"},
    {"src": "/", "dest": "/index.html"}
  ]
}
```

---

## netlify.toml

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[build.environment]
  GROQ_API_KEY = "GROQ_KEY_PLACEHOLDER"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Service-Worker-Allowed = "/"
```

---

## EMAIL — gdzie założyć darmowy email dla domeny

**Najlepsze opcje (darmowe):**

1. **Resend.com** — najłatwiejsze jeśli masz domenę. Darmowy plan: 3 000 maili/mies. Idealne do transakcyjnych maili (rejestracja, reset hasła). Integruje się z Supabase jednym kliknięciem.

2. **Zoho Mail** (zoho.com/mail) — **darmowe konto biznesowe z własną domeną** (do 5 użytkowników). Dostajesz `kontakt@ripost.pl` jeśli masz domenę. Najlepszy wybór jeśli chcesz mieć normalną skrzynkę.

3. **Improvmx.com** — darmowy email forwarding. Maile na `kontakt@ripost.pl` trafiają na Twój Gmail. Szybkie w 2 minuty, ale nie możesz wysyłać z tej domeny.

4. **Cloudflare Email Routing** — jeśli domena jest na Cloudflare, masz forwarding za darmo w panelu.

**Rekomendacja:** Kup domenę `ripost.pl` na Cloudflare (~50 zł/rok) → Zoho Mail darmowy → masz `kontakt@ripost.pl` i `b2b@ripost.pl`. Cloudflare + Zoho zajmie 15 minut.
