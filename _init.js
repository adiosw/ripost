// Ripost — ładuje konfigurację z Vercel ENV vars
(async function() {
  try {
    const r = await fetch('/api/config');
    const c = await r.json();
    window.SUPABASE_URL  = c.su;
    window.SUPABASE_ANON = c.sa;
    window.STRIPE_PK     = c.sp;
    window.PRICE_29      = c.p1;
    window.PRICE_49      = c.p2;
    window.PRICE_99      = c.p3;
  } catch(e) {
    console.warn('Config not loaded:', e);
  }
})();
