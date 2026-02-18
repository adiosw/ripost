# ⚡ Ripost - AI Trener Negocjacji

Kompletna aplikacja webowa PWA do trenowania trudnych rozmów zawodowych z AI (podwyżka, awans, rekrutacja).

## 📦 Co zawiera ta paczka?

### 🎨 Frontend
- **index.html** - Premium landing page z animacjami i interaktywnym demo
- **app.html** - Aplikacja z chatbotem AI
- **success.html** - Strona po udanej płatności
- **demo-video.html** - Generator demo video (HTML5 Canvas)
- **assets/css/premium.css** - Kompletne style (16KB)
- **assets/js/app.js** - Logika aplikacji
- **assets/js/premium.js** - Animacje landing page

### ⚙️ Backend (Vercel Serverless)
- **api/chat.js** - Groq AI endpoint (rozmowy z AI)
- **api/create-checkout.js** - Stripe checkout
- **api/stripe-webhook.js** - Obsługa płatności Stripe

### 📄 Konfiguracja
- **config.js** - Centralna konfiguracja (ceny, pakiety, teksty)
- **manifest.json** - PWA manifest
- **service-worker.js** - Offline support
- **package.json** - Node dependencies
- **vercel.json** - Vercel configuration

### 📚 Dokumentacja
- **README.md** - Ten plik
- **QUICKSTART.md** - Szybki start (5 minut)
- **DEPLOYMENT.md** - Szczegółowa instrukcja wdrożenia
- **STRIPE-SETUP.md** - Konfiguracja Stripe
- **CHECKLIST.md** - Kompletna lista kontrolna
- **email-template.html** - Szablon emaila z kodem

## 🎯 Funkcje

- ✅ **3 Scenariusze**: Podwyżka 💰, Awans 📈, Rekrutacja 🎯
- ✅ **AI-powered**: Groq API z modelem Llama 3.1 70B
- ✅ **Ocena 1-10**: Szczegółowy feedback po każdej rozmowie
- ✅ **PWA**: Instalowalne na telefonie, działa offline
- ✅ **System kodów**: Naffy lub Stripe
- ✅ **3 Pakiety**: START (29 zł), PRO (49 zł), UNLIMITED (99 zł)
- ✅ **Responsive**: 100% mobile-friendly
- ✅ **Premium Design**: Animacje, gradienty, smooth transitions
- ✅ **Interaktywne Demo**: Video + przykładowa rozmowa

## 🚀 Szybki Start

### 1. Przeczytaj dokumentację
```bash
# W kolejności:
1. QUICKSTART.md    # 5 minut - podstawy
2. DEPLOYMENT.md    # 30 minut - pełne wdrożenie  
3. CHECKLIST.md     # Przed uruchomieniem
```

### 2. Ustaw API keys
```bash
# Groq (wymagane)
GROQ_API_KEY=gsk_...

# Stripe (opcjonalne - zamiast Naffy)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
```

### 3. Deploy na Vercel
```bash
# GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Vercel
# 1. Import repository
# 2. Dodaj GROQ_API_KEY
# 3. Deploy!
```

### 4. Testuj
```bash
# Użyj kodów testowych:
PRO-49          # 5 symulacji
UNLIMITED-99    # Nielimitowane

# ⚠️ USUŃ przed produkcją!
```

## 🛠 Technologie

- **Frontend**: Vanilla HTML/CSS/JS (zero dependencies!)
- **Backend**: Vercel Serverless Functions
- **AI**: Groq API (Llama 3.1 70B - 70 billion parameters)
- **Payment**: Naffy lub Stripe
- **Hosting**: Vercel (unlimited builds)
- **PWA**: Manifest + Service Worker

## 📁 Struktura projektu

```
ripost/
├── index.html              # Landing page
├── app.html                # Aplikacja
├── success.html            # Po płatności
├── demo-video.html         # Demo generator
├── config.js               # ⚙️ TUTAJ edytujesz wszystko!
├── email-template.html     # Szablon emaila
├── manifest.json           # PWA
├── service-worker.js       # Offline
├── package.json            # Dependencies
├── vercel.json             # Vercel config
│
├── api/
│   ├── chat.js             # Groq AI
│   ├── create-checkout.js  # Stripe checkout
│   └── stripe-webhook.js   # Stripe webhooks
│
├── assets/
│   ├── css/
│   │   └── premium.css     # Style (16KB!)
│   └── js/
│       ├── app.js          # App logic (12KB)
│       └── premium.js      # Animations (4KB)
│
└── docs/
    ├── README.md           # Ten plik
    ├── QUICKSTART.md       # 5-minutowy start
    ├── DEPLOYMENT.md       # Pełne wdrożenie
    ├── STRIPE-SETUP.md     # Stripe guide
    └── CHECKLIST.md        # Lista kontrolna
```

## ⚙️ Customizacja

### Łatwa droga: config.js
Otwórz `config.js` i edytuj:
- Ceny pakietów
- Teksty i opisy
- Linki do Naffy/Stripe
- Testimonials
- FAQ
- Kolory brandingowe

### Zaawansowana: Bezpośrednie edycje
- **Kolory**: `assets/css/premium.css` (zmienne CSS)
- **Teksty**: `index.html` (wszystkie sekcje)
- **Logika**: `assets/js/app.js` (zachowanie aplikacji)
- **AI prompts**: `api/chat.js` (SYSTEM_PROMPTS)

## 🔑 Kody testowe

**⚠️ USUŃ PRZED PRODUKCJĄ!**

W `assets/js/app.js` znajdziesz:
```javascript
const TEST_CODES = {
    'DEMO-2026': { type: 'START', simulations: 1 },
    'PRO-49': { type: 'PRO', simulations: 5 },
    'UNLIMITED-99': { type: 'UNLIMITED', simulations: -1 }
};
```

Zakomentuj lub usuń przed uruchomieniem!

## 💰 Płatności

### Opcja 1: Naffy (prostsze)
1. Konto na [naffy.io](https://naffy.io)
2. Dodaj 3 produkty
3. Skopiuj linki do `index.html`
4. Gotowe!

### Opcja 2: Stripe (więcej funkcji)
1. Przeczytaj `STRIPE-SETUP.md`
2. Konto na [stripe.com](https://stripe.com)
3. Dodaj produkty + webhook
4. Skonfiguruj email service
5. Deploy!

## 📊 Metryki sukcesu

Target'y:
- **Landing → Zakup**: 2-5%
- **Zakup → Aktywacja**: 80%+
- **Aktywacja → Ukończenie**: 70%+
- **NPS**: 50+
- **Rating**: 4.5+

Monitoruj w:
- Vercel Analytics (automatyczne)
- Google Analytics (dodaj tracking code)
- Stripe/Naffy Dashboard

## ✅ Checklist przed produkcją

1. [ ] Usuń kody testowe (`assets/js/app.js`)
2. [ ] Zaktualizuj linki Naffy/Stripe (`index.html`)
3. [ ] Dodaj GROQ_API_KEY w Vercel
4. [ ] Test na prawdziwym telefonie
5. [ ] Dodaj Analytics (opcjonalnie)
6. [ ] Stwórz Regulamin i Politykę Prywatności
7. [ ] Test płatności (mała kwota)
8. [ ] Sprawdź wszystkie linki
9. [ ] SEO: meta tags, sitemap.xml
10. [ ] Backup wszystkich credentials

Pełna lista: `CHECKLIST.md`

## 🐛 Troubleshooting

### AI nie odpowiada
```bash
# Sprawdź:
1. GROQ_API_KEY w Vercel
2. Function Logs (Vercel Dashboard)
3. Console w przeglądarce (F12)
4. Groq API status (console.groq.com)
```

### Strona ucięta na mobile
```bash
# Już naprawione w CSS:
html, body {
    max-width: 100vw !important;
    overflow-x: hidden !important;
}
```

### Kody nie działają
```bash
# Debug:
1. Format: wielkie litery, regex match
2. localStorage (F12 → Application)
3. Test z kodami testowymi
```

## 📈 Roadmap (opcjonalne rozszerzenia)

- [ ] Export rozmowy do PDF
- [ ] Historia rozmów w localStorage
- [ ] Dark mode toggle
- [ ] Więcej scenariuszy (negocjacje biznesowe, konflikt w zespole)
- [ ] Poziomy trudności AI
- [ ] Leaderboard/ranking użytkowników
- [ ] Dashboard z progress tracking
- [ ] API dla integracji z innymi platformami
- [ ] Mobile app (React Native/Flutter)

## 🌍 Internationalization

Gotowe do tłumaczenia:
1. Wszystkie teksty w `config.js`
2. UI teksty w `index.html` i `app.html`
3. AI prompts w `api/chat.js`

## 💻 Development

```bash
# Local development (wymaga Vercel CLI)
npm install -g vercel
vercel dev

# Deploy preview
vercel

# Deploy production
vercel --prod

# Logs
vercel logs
```

## 📝 Licencja

MIT License - możesz robić co chcesz!

## 🤝 Contributing

Pull requests mile widziane!

## 📞 Wsparcie

- 📧 Email: kontakt@ripost.pl
- 📱 Discord/Slack: (dodaj własny)
- 🌐 Docs: (link do dokumentacji)

## 🎉 Credits

- **AI Model**: Groq (Llama 3.1 70B)
- **Hosting**: Vercel
- **Design inspiration**: Linear, Vercel, Anygen
- **Icons**: Native emoji
- **Fonts**: System fonts (super fast!)

---

## 🚀 Gotowe do startu?

1. **Nowy w tym?** → Czytaj `QUICKSTART.md`
2. **Wdrożenie?** → Czytaj `DEPLOYMENT.md`
3. **Checklist?** → Czytaj `CHECKLIST.md`
4. **Stripe?** → Czytaj `STRIPE-SETUP.md`

**Średni czas setup**: 30-60 minut
**Miesięczny koszt**: 0 zł (free tier)
**Czas do pierwszej sprzedaży**: Zależy od marketingu!

Made with ⚡ by Ripost Team

**Powodzenia!** 🎯

