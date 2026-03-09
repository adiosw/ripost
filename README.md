# 🚀 Ripost v6 — AI Career Coach

Kompletny projekt: landing page z podstronami + aplikacja AI do treningu negocjacji.

## 📁 Struktura plików

```
ripost/
├── index.html              ← Strona główna (minimalistyczna: hero + wideo + CTA)
├── features.html           ← Funkcje: Jak działa, Demo AI, Historia, Opinie, FAQ
├── pricing.html            ← Cennik: 29 zł / 49 zł / 99 zł/mies.
├── about.html              ← O nas: misja, wartości, timeline
├── contact.html            ← Kontakt: formularz + karty info
├── app.html                ← Pełna aplikacja AI (scenariusze → chat → ocena)
├── demo.html               ← Strona demo
├── blog.html               ← Blog z artykułami
├── offline.html            ← PWA offline fallback
├── backend-setup.html      ← Instrukcja backendu krok po kroku (dla laika)
├── manifest.json           ← PWA manifest
├── sw.js                   ← Service Worker
├── service-worker.js       ← Service Worker v2
├── netlify.toml            ← Config Netlify
├── vercel.json             ← Config Vercel
├── netlify/functions/
│   └── chat.js             ← AI endpoint (Netlify Functions)
└── api/
    └── chat.js             ← AI endpoint (Vercel Serverless)
```

## 🔑 Kody testowe (app.html — bez backendu)

| Kod | Plan | Symulacje |
|-----|------|-----------|
| `DEMO-2026` | START | 1 |
| `PRO-49` | PRO | 5 |
| `UNLIMITED-99` | UNLIMITED | ∞ |

## ⚙️ Podpięcie backendu

Otwórz `backend-setup.html` w przeglądarce — kompletna instrukcja krok po kroku.

Potrzebne klucze (wklej w `app.html` w bloku KONFIGURACJA BACKENDU):
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` — z supabase.com
- `GROQ_KEY` — z console.groq.com
- `STRIPE_PK` + Price IDs — ze stripe.com

## 🚀 Deploy (30 sekund)

Netlify: przeciągnij folder na netlify.com/drop
Vercel: `vercel deploy` lub import z GitHub
