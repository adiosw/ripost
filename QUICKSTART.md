# ⚡ Quick Start - Ripost

## 🎯 Co masz w paczce?

Kompletną aplikację webową "Ripost" - AI trener negocjacji:
- ✅ Landing page premium (lepszy niż Anygen.ai)
- ✅ PWA aplikację z chatbotem AI
- ✅ Backend API (Groq AI)
- ✅ System kodów dostępu
- ✅ 3 pakiety (START/PRO/UNLIMITED)
- ✅ 100% mobile-friendly

## 🚀 Szybki start (5 minut)

### 1. Rozpakuj projekt
```bash
unzip ripost.zip
cd ripost
```

### 2. Uzyskaj Groq API Key
- Wejdź na: https://console.groq.com
- API Keys → Create new key
- Skopiuj klucz (zaczyna się `gsk_`)

### 3. Deploy na Vercel
```bash
# Zainstaluj Vercel CLI (opcjonalnie)
npm i -g vercel

# Lub użyj interfejsu webowego:
# 1. Push do GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TWOJAUSERNAME/ripost.git
git push -u origin main

# 2. Import na Vercel
# - vercel.com → Import Project
# - Wybierz repo
# - Dodaj GROQ_API_KEY w Environment Variables
# - Deploy!
```

### 4. Test
- Otwórz aplikację
- Użyj kodu testowego: `PRO-49`
- Wybierz scenariusz
- Rozpocznij rozmowę!

## 📦 Struktura plików

```
ripost/
├── index.html              ← Landing page
├── app.html                ← Aplikacja
├── api/chat.js             ← Groq API endpoint
├── assets/
│   ├── css/premium.css     ← Style
│   └── js/
│       ├── app.js          ← Logika aplikacji
│       └── premium.js      ← Animacje landingu
├── manifest.json           ← PWA config
├── service-worker.js       ← Offline support
├── package.json            ← Dependencies
├── vercel.json             ← Vercel config
├── README.md               ← Dokumentacja
└── DEPLOYMENT.md           ← Instrukcja wdrożenia
```

## 🔑 Kody testowe

**⚠️ USUŃ przed produkcją!**

W pliku `assets/js/app.js` znajdziesz:
- `DEMO-2026` - START (1 symulacja)
- `PRO-49` - PRO (5 symulacji)  
- `UNLIMITED-99` - UNLIMITED (nielimitowane)

Zakomentuj lub usuń obiekt `TEST_CODES` przed wdrożeniem!

## 💰 Integracja płatności

### Naffy (rekomendowane)
1. Stwórz konto: https://naffy.io
2. Dodaj 3 produkty (START/PRO/UNLIMITED)
3. Skopiuj linki do `index.html` (sekcja pricing)

### Stripe (alternatywnie)
1. Stwórz produkty w Stripe Dashboard
2. Dodaj webhook dla payment_intent.succeeded
3. Generuj kody po płatności
4. Wyślij email z kodem

## 🎨 Customizacja

### Kolory
W `assets/css/premium.css` zmień zmienne CSS:
```css
:root {
    --color-primary: #6366f1;        /* Twój kolor główny */
    --color-primary-light: #8b5cf6;  /* Jaśniejszy odcień */
    --color-accent: #10b981;         /* Kolor akcentu */
}
```

### Teksty
- Landing page: `index.html`
- Komunikaty AI: `api/chat.js` (SYSTEM_PROMPTS)
- Nazwy pakietów: `index.html` (sekcja pricing)

### Ceny
W `index.html` zmień ceny w sekcji pricing i linki Naffy.

## 📱 PWA - Instalacja na telefonie

Aplikacja działa jak natywna aplikacja:
1. Otwórz w Safari/Chrome na telefonie
2. Safari: Udostępnij → Dodaj do ekranu głównego
3. Chrome: Menu → Zainstaluj aplikację
4. Gotowe! Ikona na ekranie głównym

## 🐛 Częste problemy

### AI nie odpowiada
```bash
# Sprawdź:
1. GROQ_API_KEY w Vercel Environment Variables
2. Function Logs w Vercel (Deployments → View Logs)
3. Console w przeglądarce (F12)
```

### Strona ucięta na mobile
Sprawdź czy w `premium.css` jest:
```css
html, body {
    max-width: 100vw !important;
    overflow-x: hidden !important;
}
```

### Kody nie działają
1. Sprawdź format (wielkie litery!)
2. Sprawdź localStorage (F12 → Application → Local Storage)
3. Wyczyść cache i spróbuj ponownie

## 📊 Statystyki i metryki

### Vercel Analytics
Automatycznie dostępne w dashboard:
- Page views
- Unique visitors
- Function invocations
- Response times

### Google Analytics (opcjonalnie)
Dodaj tracking code przed `</head>` w `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## 🔒 Bezpieczeństwo

✅ **Co mamy:**
- HTTPS automatycznie (Vercel)
- Environment variables dla API key
- CORS properly configured
- No sensitive data in localStorage

⚠️ **Co możesz dodać:**
- Rate limiting na API endpoint
- Webhook verification dla płatności
- Backend validation kodów dostępu
- User authentication (opcjonalnie)

## 📈 Skalowanie

### Free tier limits:
- **Vercel**: Unlimited builds, 100GB bandwidth
- **Groq**: 14,400 requests/day (free tier)

### Gdy rośniesz:
- Groq: Przejdź na płatny plan ($0.59/1M tokens)
- Vercel: Pro plan ($20/mo) dla większego bandwidth
- Dodaj CDN dla statycznych assetów

## 🎯 Co dalej?

1. ✅ **Przed produkcją**: Przeczytaj `DEPLOYMENT.md`
2. 📝 **Dokumentacja**: Sprawdź `README.md`
3. 💡 **Pomysły**: Dodaj export do PDF, historię rozmów, więcej scenariuszy
4. 📧 **Marketing**: Email marketing po zakupie, social media

## 💬 Wsparcie

Jeśli masz pytania:
1. Sprawdź `README.md` i `DEPLOYMENT.md`
2. Console logs (F12 w przeglądarce)
3. Vercel Function Logs
4. Groq API status: https://status.groq.com

## 🎉 Sukces!

Masz wszystko czego potrzebujesz! Czas na deployment i pierwsze sprzedaże!

**Estimated setup time**: 15-30 minut
**Monthly cost**: ~0 zł (na free tier)
**Time to first sale**: Zależy od marketingu! 🚀

---

Powodzenia z Ripost! ⚡
