# 🚀 Instrukcja Wdrożenia - Ripost

## Krok 1: Przygotowanie projektu

### 1.1 Usuń kody testowe

Otwórz `assets/js/app.js` i usuń (lub zakomentuj) sekcję TEST_CODES:

```javascript
// TEST CODES - REMOVE BEFORE PRODUCTION!
const TEST_CODES = {
    // 'DEMO-2026': { type: 'START', simulations: 1 },
    // 'PRO-49': { type: 'PRO', simulations: 5 },
    // 'UNLIMITED-99': { type: 'UNLIMITED', simulations: -1, expires: Date.now() + 30*24*60*60*1000 }
};
```

### 1.2 Zaktualizuj linki Naffy

W pliku `index.html` znajdź sekcję pricing i zaktualizuj linki:

```html
<a href="https://www.naffy.io/TWOJ-USERNAME/ripost-start" class="btn-pricing">Kup teraz</a>
<a href="https://www.naffy.io/TWOJ-USERNAME/ripost-pro" class="btn-pricing btn-pricing-pro">Kup teraz</a>
<a href="https://www.naffy.io/TWOJ-USERNAME/ripost-unlimited" class="btn-pricing btn-pricing-unlimited">Kup teraz</a>
```

## Krok 2: Uzyskaj Groq API Key

1. Wejdź na [console.groq.com](https://console.groq.com)
2. Zarejestruj się lub zaloguj
3. Przejdź do **API Keys**
4. Kliknij **Create API Key**
5. Nazwij klucz (np. "Ripost Production")
6. Skopiuj wygenerowany klucz (zaczyna się od `gsk_`)

⚠️ **WAŻNE**: Zapisz klucz w bezpiecznym miejscu - nie będziesz mógł go ponownie zobaczyć!

## Krok 3: GitHub Repository

### 3.1 Inicjalizacja Git

```bash
cd ripost
git init
git add .
git commit -m "Initial commit: Ripost v1.0"
```

### 3.2 Stwórz repozytorium na GitHub

1. Wejdź na [github.com](https://github.com)
2. Kliknij **New repository**
3. Nazwa: `ripost`
4. Wybierz: **Public** lub **Private**
5. **NIE** dodawaj README, .gitignore ani licencji (już je mamy)
6. Kliknij **Create repository**

### 3.3 Połącz z GitHub

```bash
git remote add origin https://github.com/TWOJ-USERNAME/ripost.git
git branch -M main
git push -u origin main
```

## Krok 4: Vercel Deployment

### 4.1 Stwórz konto na Vercel

1. Wejdź na [vercel.com](https://vercel.com)
2. Kliknij **Sign Up**
3. Wybierz **Continue with GitHub**
4. Autoryzuj Vercel

### 4.2 Import projektu

1. Na dashboardzie kliknij **Add New** → **Project**
2. Import Git Repository
3. Znajdź `ripost` i kliknij **Import**

### 4.3 Konfiguracja projektu

- **Framework Preset**: Other (lub None)
- **Build Command**: (zostaw puste)
- **Output Directory**: (zostaw puste)
- **Install Command**: npm install

### 4.4 Environment Variables

Kliknij **Environment Variables** i dodaj:

- **Key**: `GROQ_API_KEY`
- **Value**: Twój klucz Groq (zaczyna się od `gsk_`)
- **Environments**: Production, Preview, Development (zaznacz wszystkie)

### 4.5 Deploy

1. Kliknij **Deploy**
2. Poczekaj 1-2 minuty
3. Po zakończeniu zobaczysz **Congratulations!**
4. Kliknij **Visit** aby zobaczyć stronę

## Krok 5: Konfiguracja Naffy

### 5.1 Stwórz konto Naffy

1. Wejdź na [naffy.io](https://www.naffy.io)
2. Zarejestruj się
3. Przejdź weryfikację

### 5.2 Dodaj produkty

**Produkt 1: Ripost START**
- Nazwa: Ripost START
- Cena: 29 PLN
- Typ: Produkt cyfrowy
- Format kodu: `START-XXXXXX` (6 cyfr)
- Opis: 1 symulacja z AI

**Produkt 2: Ripost PRO** ⭐
- Nazwa: Ripost PRO
- Cena: 49 PLN
- Typ: Produkt cyfrowy
- Format kodu: `PRO-XX` (2 cyfry)
- Opis: 5 symulacji z AI

**Produkt 3: Ripost UNLIMITED** 🔥
- Nazwa: Ripost UNLIMITED
- Cena: 99 PLN (normalnie 149 PLN)
- Typ: Produkt cyfrowy
- Format kodu: `UNLIMITED-XX` (2 cyfry)
- Opis: Nielimitowane symulacje przez 30 dni

### 5.3 Skopiuj linki produktów

Po stworzeniu produktów skopiuj ich linki i zaktualizuj je w `index.html` (sekcja pricing).

## Krok 6: Testy końcowe

### 6.1 Test płatności Naffy

1. Kup produkt START (testowo, można potem zwrócić)
2. Sprawdź czy otrzymujesz kod
3. Wpisz kod w aplikacji
4. Przetestuj symulację

### 6.2 Test na urządzeniach

- ✅ Desktop Chrome
- ✅ Desktop Safari
- ✅ Desktop Firefox
- ✅ iPhone Safari
- ✅ Android Chrome
- ✅ Tablet (iPad/Android)

### 6.3 Test scenariuszy

- ✅ Podwyżka
- ✅ Awans
- ✅ Rekrutacja

### 6.4 Test limitów

- ✅ START: 1 symulacja i blokada
- ✅ PRO: 5 symulacji i blokada
- ✅ UNLIMITED: więcej niż 10 symulacji działa

## Krok 7: SEO i Analytics (opcjonalne)

### 7.1 Google Analytics

1. Stwórz konto [analytics.google.com](https://analytics.google.com)
2. Dodaj tracking code przed `</head>` w `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 7.2 Meta tags

Już są w `index.html`, ale sprawdź czy są poprawne:

```html
<title>Ripost - AI Trener Negocjacji | Przećwicz najtrudniejszą rozmowę</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
```

### 7.3 robots.txt

Stwórz plik `robots.txt` w głównym katalogu:

```
User-agent: *
Allow: /

Sitemap: https://ripost.vercel.app/sitemap.xml
```

## Krok 8: Własna domena (opcjonalne)

### 8.1 Kup domenę

- [OVH.pl](https://www.ovh.pl) - rekomendowane
- [nazwa.pl](https://www.nazwa.pl)
- [GoDaddy](https://www.godaddy.com)

### 8.2 Połącz z Vercel

1. W Vercel Dashboard → Settings → Domains
2. Dodaj swoją domenę (np. `ripost.pl`)
3. Skopiuj DNS records z Vercel
4. Dodaj je w panelu domeny:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

5. Poczekaj 24-48h na propagację DNS

## Krok 9: Monitoring i utrzymanie

### 9.1 Monitoruj logi Vercel

- Deployments → View Logs
- Sprawdzaj błędy API
- Monitoruj zużycie

### 9.2 Groq API Limits

- Free tier: 14,400 requests/day
- Monitoruj zużycie: [console.groq.com/usage](https://console.groq.com/usage)
- Przy większym ruchu rozważ płatny plan

### 9.3 Aktualizacje

Gdy chcesz wprowadzić zmiany:

```bash
git add .
git commit -m "Opis zmian"
git push
```

Vercel automatycznie zdeployuje nową wersję!

## 🎉 Gotowe!

Twoja aplikacja jest już live i gotowa do użycia!

**Linki:**
- Strona: `https://ripost.vercel.app` (lub Twoja domena)
- GitHub: `https://github.com/TWOJ-USERNAME/ripost`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Groq Console: `https://console.groq.com`

## 🆘 Pomoc

Jeśli coś nie działa:

1. Sprawdź Function Logs w Vercel
2. Sprawdź Console w przeglądarce (F12)
3. Sprawdź czy GROQ_API_KEY jest ustawiony
4. Zrestartuj deployment (Vercel → Redeploy)

---

Powodzenia! 🚀
