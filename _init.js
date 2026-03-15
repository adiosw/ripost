// Ripost — ładuje konfigurację z Vercel ENV vars
(async function() {
  try {
    const r = await fetch('/api/config');
    const c = await r.json();
    window.SUPABASE_URL  = c.su;
    window.SUPABASE_ANON = c.sa;
  } catch(e) {
    console.warn('Config not loaded:', e);
  }
})();
