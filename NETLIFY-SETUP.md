# 🚀 Netlify - Instrukcja wdrożenia (dla beginnerów)

## Dlaczego "Page not found"?

Twój błąd wynikał z tego, że:
1. Netlify wymaga pliku `netlify.toml` - teraz już jest ✅
2. Funkcje muszą być w `netlify/functions/` - teraz już są ✅
3. Brakuje ENV variable `GROQ_API_KEY` w Netlify - **to musisz zrobić!**

---

## Krok 1: Wgraj pliki na Netlify

### Metoda A: Drag & Drop (najłatwiejsza)

1. Otwórz [app.netlify.com](https://app.netlify.com)
2. Kliknij swój projekt (ten co już masz)
3. Kliknij **"Deploys"**
4. Przeciągnij **FOLDER** `ripost` (nie zip!) na pole "Drag and drop"
5. Poczekaj ~30 sekund na wdrożenie

### Metoda B: Nowe wdrożenie z zip

1. Otwórz [app.netlify.com](https://app.netlify.com)
2. Kliknij **"Add new site"** → **"Deploy manually"**
3. Przeciągnij folder `ripost` lub zip do pola
4. Gotowe!

---

## Krok 2: Dodaj GROQ_API_KEY ← TO JEST OBOWIĄZKOWE!

Bez tego AI nie będzie działać!

1. Wejdź na [console.groq.com](https://console.groq.com)
2. Kliknij **"API Keys"** → **"Create API Key"**
3. Skopiuj klucz (zaczyna się od `gsk_`)
4. W Netlify: **Site Settings** → **Environment Variables**
5. Kliknij **"Add a variable"**:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_twoj_klucz_tutaj`
6. Kliknij **"Save"**
7. **WAŻNE: Idź do Deploys → Trigger deploy → Deploy site** (żeby przeładować ze zmiennymi)

---

## Krok 3: Test

1. Otwórz swoją stronę (np. `incandescent-muffin-03596b.netlify.app`)
2. Powinna pokazać się landing page ✅
3. Kliknij "Zaloguj się"
4. Wpisz kod testowy: `PRO-49`
5. Wybierz scenariusz
6. Wyślij wiadomość
7. AI powinna odpowiedzieć ✅

---

## Struktura plików (ważne!)

```
ripost/                          ← Wgraj TEN folder
│
├── netlify.toml                 ← KLUCZOWY plik! Bez niego nic nie działa
├── index.html                   ← Landing page
├── app.html                     ← Aplikacja
│
├── netlify/
│   └── functions/
│       └── chat.js              ← AI funkcja (Netlify widzi automatycznie)
│
└── assets/
    ├── css/premium.css
    └── js/app.js
```

---

## Częste błędy

### "Page not found" na każdej stronie
**Przyczyna**: Brak `netlify.toml`
**Fix**: Upewnij się że w folderze jest plik `netlify.toml` ✅

### AI nie odpowiada / "Błąd serwera"
**Przyczyna**: Brak `GROQ_API_KEY`
**Fix**: Dodaj zmienną środowiskową (Krok 2 powyżej)

### "Function not found"
**Przyczyna**: Pliki funkcji w złym miejscu
**Fix**: Upewnij się że masz `netlify/functions/chat.js` ✅

### Strona się nie aktualizuje
**Fix**: W Netlify → Deploys → "Clear cache and deploy site"

---

## Sprawdź logi funkcji (debug)

Jeśli AI nie działa:
1. Netlify Dashboard → **Functions**
2. Kliknij `chat`
3. Zobacz logi błędów
4. Najczęstszy problem: brak `GROQ_API_KEY`

---

## Kody testowe

| Kod | Pakiet | Symulacje |
|-----|--------|-----------|
| `DEMO-2026` | START | 1 |
| `PRO-49` | PRO | 5 |
| `UNLIMITED-99` | UNLIMITED | ∞ (30 dni) |

**Usuń te kody przed sprzedażą!** (w `assets/js/app.js` linia ~11)

---

## Własna domena

1. Netlify → **Domain management** → **Add a domain**
2. Wpisz swoją domenę (np. `ripost.pl`)
3. Dodaj DNS records u dostawcy domeny:
   - Type: `CNAME`
   - Name: `www`
   - Value: `incandescent-muffin-03596b.netlify.app`
4. Poczekaj do 24h na propagację

---

## Podsumowanie

```
✅ netlify.toml - jest w paczce
✅ netlify/functions/chat.js - jest w paczce
❌ GROQ_API_KEY - MUSISZ dodać w Netlify!
```

Po dodaniu GROQ_API_KEY wszystko powinno działać! 🚀
